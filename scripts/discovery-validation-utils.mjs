import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const FULL_COMMIT_PATTERN = /^[0-9a-f]{40}$/u;
const COMMIT_LIKE_PATTERN = /^[0-9a-f]{7,40}$/iu;
const MUTABLE_REF_PATTERN = /^(?:head|latest|main|master|default)$/iu;
const PROMOTED_DISPOSITION = "promoted-to-resource";
const PROMOTED_REVIEW_STATUS = "handed-off-to-resource-registry";
const PROMOTED_REASON_CODE = "promoted-after-source-review";
const PROMOTABLE_RESOURCE_REVIEW_STATUSES = new Set(["source-reviewed", "hands-on-verified"]);

const ENDORSEMENT_PATTERNS = [
  /\b(?:recommended|endorsed|approved|vetted|trusted)\b/giu,
  /\b(?:best(?:[ -]in[ -]class)?|production[ -]ready|safe to use)\b/giu,
  /\b(?:fully|independently|hands[ -]on|source)[ -]verified\b/giu,
  /(?:推荐|精选|背书|审核通过|已验证|值得信赖|安全可用|最佳|生产就绪)/gu,
];

const NEGATED_ENDORSEMENT_PATTERN =
  /(?:\b(?:does not|do not|is not|are not|not|never|without|neither|nor|no)(?:\s+(?:constitute|imply|yet|an?))*\s*|(?:不构成|不代表|并非|不是|不能|不得|尚未|未经|未|非|无))$/iu;

function valueLabel(value) {
  return typeof value === "string" && value !== "" ? value : "<unknown>";
}

function candidateLabel(candidate, index) {
  return `candidate ${valueLabel(candidate?.id)} at candidates[${index}]`;
}

function countValues(values) {
  const counts = {};
  for (const value of values) {
    if (typeof value !== "string" || value === "") continue;
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
}

function normalizedArrayDuplicates(values, normalize) {
  const seen = new Map();
  const duplicates = [];
  for (const value of Array.isArray(values) ? values : []) {
    const key = normalize(value);
    if (!key) continue;
    if (seen.has(key)) {
      duplicates.push({ key, first: seen.get(key), duplicate: value });
    } else {
      seen.set(key, value);
    }
  }
  return duplicates;
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function validateDiscoveryRef(value, unavailableReason, label, failures) {
  if (value === null) {
    if (typeof unavailableReason !== "string" || !/\S/u.test(unavailableReason)) {
      failures.push(`${label}: a missing immutable ref requires a nonblank ref reason`);
    }
    return;
  }
  if (typeof value !== "string" || !/\S/u.test(value)) {
    failures.push(`${label}: ref must be an immutable commit, tag, version, dated snapshot, or null`);
    return;
  }
  if (MUTABLE_REF_PATTERN.test(value)) {
    failures.push(`${label}: mutable branch or latest refs are not reproducible`);
  }
  if (COMMIT_LIKE_PATTERN.test(value) && !FULL_COMMIT_PATTERN.test(value)) {
    failures.push(`${label}: commit refs must be exact 40-character lowercase commits`);
  }
}

function endorsementMatches(text) {
  const matches = [];
  if (typeof text !== "string") return matches;
  for (const pattern of ENDORSEMENT_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const prefix = text.slice(Math.max(0, (match.index ?? 0) - 56), match.index ?? 0);
      if (!NEGATED_ENDORSEMENT_PATTERN.test(prefix)) matches.push(match[0]);
    }
  }
  return matches;
}

function identityOwners(candidates) {
  const owners = new Map();
  for (const [index, candidate] of candidates.entries()) {
    const keys = new Set(
      [candidate?.id, candidate?.name, ...(Array.isArray(candidate?.aliases) ? candidate.aliases : [])]
        .map(normalizeAlias)
        .filter(Boolean),
    );
    for (const key of keys) {
      const existing = owners.get(key) ?? [];
      existing.push({ candidate, index });
      owners.set(key, existing);
    }
  }
  return owners;
}

function packageIdentityOwners(candidates) {
  const owners = new Map();
  for (const [index, candidate] of candidates.entries()) {
    for (const identity of Array.isArray(candidate?.packageIdentities)
      ? candidate.packageIdentities
      : []) {
      const key = normalizePackageIdentity(identity);
      if (!key) continue;
      const existing = owners.get(key) ?? [];
      existing.push({ candidate, index });
      owners.set(key, existing);
    }
  }
  return owners;
}

function resourceCollections(resourcesRegistry) {
  const resources = Array.isArray(resourcesRegistry?.resources)
    ? resourcesRegistry.resources.filter(
        (resource) => resource && typeof resource === "object" && !Array.isArray(resource),
      )
    : [];
  return {
    resources,
    byId: new Map(resources.map((resource) => [resource.id, resource])),
    byUrl: new Map(
      resources
        .map((resource) => [canonicalUrlKey(resource.url), resource])
        .filter(([key]) => key !== undefined),
    ),
  };
}

function hasValidPromotionContract(candidate, resourceById) {
  if (candidate?.disposition !== PROMOTED_DISPOSITION) return false;
  if (typeof candidate.resourceId !== "string" || candidate.resourceId === "") return false;
  if (candidate.reviewStatus !== PROMOTED_REVIEW_STATUS) return false;
  if (candidate.dispositionReasonCode !== PROMOTED_REASON_CODE) return false;
  const resource = resourceById.get(candidate.resourceId);
  return (
    resource?.kind === "community" &&
    PROMOTABLE_RESOURCE_REVIEW_STATUSES.has(resource.reviewStatus) &&
    resource.sourceCandidateId === candidate.id &&
    canonicalUrlKey(resource.url) === canonicalUrlKey(candidate.canonicalUrl) &&
    typeof resource.reviewedRef === "string" &&
    candidate.snapshotRef === resource.reviewedRef
  );
}

/**
 * Normalize a display alias for collision detection while retaining Unicode letters and digits.
 * Display aliases may preserve their original casing; this key is deliberately stricter than
 * string equality so that values such as "Open-Claw" and "open claw" cannot silently diverge.
 */
export function normalizeAlias(value) {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

/** Return a case-insensitive ecosystem/package identity key. */
export function normalizePackageIdentity(identity) {
  if (!identity || typeof identity !== "object" || Array.isArray(identity)) return "";
  if (typeof identity.ecosystem !== "string" || typeof identity.name !== "string") return "";
  const ecosystem = identity.ecosystem.normalize("NFKC").trim().toLocaleLowerCase("en-US");
  const name = identity.name.normalize("NFKC").trim().toLocaleLowerCase("en-US");
  return ecosystem && name ? `${ecosystem}:${name}` : "";
}

/**
 * Produce the canonical representation accepted for a discovery URL. The comparison form used
 * for collision checks is slightly more forgiving for GitHub's case-insensitive owner/repo paths.
 */
export function canonicalizeCandidateUrl(value) {
  if (typeof value !== "string" || value === "") return undefined;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return undefined;
  }
  if (
    parsed.protocol !== "https:" ||
    parsed.username !== "" ||
    parsed.password !== "" ||
    parsed.search !== "" ||
    parsed.hash !== ""
  ) {
    return undefined;
  }

  parsed.hostname = parsed.hostname.toLocaleLowerCase("en-US");
  if (parsed.hostname === "www.github.com") parsed.hostname = "github.com";
  let pathname = parsed.pathname.replace(/\/{2,}/gu, "/").replace(/\/+$/u, "");
  if (parsed.hostname === "github.com") {
    pathname = pathname.replace(/\.git$/iu, "");
    const repositorySegments = pathname.split("/").filter(Boolean);
    if (repositorySegments.length !== 2) return undefined;
  }
  parsed.pathname = pathname || "/";

  const authority = parsed.host;
  const path = parsed.pathname === "/" ? "" : parsed.pathname;
  return `https://${authority}${path}`;
}

/** Return a normalized URL identity key used for duplicates and registry overlap checks. */
export function canonicalUrlKey(value) {
  const canonical = canonicalizeCandidateUrl(value);
  if (!canonical) return undefined;
  const parsed = new URL(canonical);
  if (parsed.hostname === "github.com") {
    return `${parsed.origin}${parsed.pathname.toLocaleLowerCase("en-US")}`.replace(/\/+$/u, "");
  }
  return canonical;
}

/** Build deterministic, count-independent summary data for CLI and tests. */
export function summarizeDiscoveryCandidates(registry) {
  const candidates = Array.isArray(registry?.candidates) ? registry.candidates : [];
  const primaryCategories = candidates.map((candidate) => candidate?.primaryCategory);
  const secondaryCategories = candidates.flatMap((candidate) =>
    Array.isArray(candidate?.secondaryCategories) ? candidate.secondaryCategories : [],
  );
  return {
    total: candidates.length,
    dispositions: countValues(candidates.map((candidate) => candidate?.disposition)),
    relations: countValues(
      candidates.flatMap((candidate) =>
        Array.isArray(candidate?.relationTypes) ? candidate.relationTypes : [],
      ),
    ),
    primaryCategories: countValues(primaryCategories),
    categories: countValues([...primaryCategories, ...secondaryCategories]),
    architectures: countValues(
      candidates.flatMap((candidate) =>
        Array.isArray(candidate?.architectureTypes) ? candidate.architectureTypes : [],
      ),
    ),
  };
}

/** Format count objects without relying on the current number of checked-in candidates. */
export function formatDiscoverySummary(summary) {
  const formatCounts = (counts) =>
    Object.entries(counts)
      .map(([name, count]) => `${name}=${count}`)
      .join(", ") || "none";
  return [
    `Discovery candidate validation passed: ${summary.total} unique candidate(s).`,
    `  Dispositions: ${formatCounts(summary.dispositions)}.`,
    `  Relations: ${formatCounts(summary.relations)}.`,
    `  Primary categories: ${formatCounts(summary.primaryCategories)}.`,
    `  All categories: ${formatCounts(summary.categories)}.`,
    `  Architectures: ${formatCounts(summary.architectures)}.`,
  ].join("\n");
}

/**
 * Run cross-record and cross-registry checks that JSON Schema cannot express. This function is
 * intentionally total: malformed input produces failures rather than throwing, so schema errors
 * and semantic errors can be reported together.
 */
export function validateDiscoverySemantics(registry, resourcesRegistry) {
  const failures = [];
  const candidates = Array.isArray(registry?.candidates)
    ? registry.candidates.filter(
        (candidate) => candidate && typeof candidate === "object" && !Array.isArray(candidate),
      )
    : [];
  const snapshotAt = registry?.snapshotAt;
  const snapshotTime = typeof snapshotAt === "string" ? Date.parse(snapshotAt) : Number.NaN;
  const snapshotDate =
    Number.isFinite(snapshotTime) && /^\d{4}-\d{2}-\d{2}T/u.test(snapshotAt)
      ? snapshotAt.slice(0, 10)
      : undefined;
  const {
    resources,
    byId: resourceById,
    byUrl: resourceByUrl,
  } = resourceCollections(resourcesRegistry);

  const seenIds = new Map();
  const seenUrls = new Map();
  for (const [index, candidate] of candidates.entries()) {
    const label = candidateLabel(candidate, index);

    if (typeof candidate.id === "string") {
      if (seenIds.has(candidate.id)) {
        failures.push(`${label}: duplicate candidate id; first used at candidates[${seenIds.get(candidate.id)}]`);
      } else {
        seenIds.set(candidate.id, index);
      }
    }

    const canonicalUrl = canonicalizeCandidateUrl(candidate.canonicalUrl);
    const urlKey = canonicalUrlKey(candidate.canonicalUrl);
    if (!canonicalUrl) {
      failures.push(`${label}: canonicalUrl must be a canonical HTTPS URL without credentials, query, or fragment`);
    } else if (candidate.canonicalUrl !== canonicalUrl) {
      failures.push(`${label}: canonicalUrl is not canonical; expected ${canonicalUrl}`);
    }
    if (urlKey) {
      if (seenUrls.has(urlKey)) {
        failures.push(`${label}: duplicate canonical URL; first used at candidates[${seenUrls.get(urlKey)}]`);
      } else {
        seenUrls.set(urlKey, index);
      }
    }

    validateDiscoveryRef(
      candidate.snapshotRef,
      candidate.snapshotRefReason,
      `${label}: snapshotRef`,
      failures,
    );
    const discoverySourceIds = new Set();
    for (const [sourceIndex, source] of (Array.isArray(candidate.discoverySources)
      ? candidate.discoverySources
      : []).entries()) {
      if (discoverySourceIds.has(source?.id)) {
        failures.push(`${label}: duplicate discoverySources id ${source.id}`);
      }
      discoverySourceIds.add(source?.id);
      let sourceUrl;
      try {
        sourceUrl = new URL(source?.url);
      } catch {
        sourceUrl = undefined;
      }
      if (
        !sourceUrl ||
        sourceUrl.protocol !== "https:" ||
        sourceUrl.username !== "" ||
        sourceUrl.password !== "" ||
        sourceUrl.search !== "" ||
        sourceUrl.hash !== ""
      ) {
        failures.push(
          `${label}: discoverySources[${sourceIndex}].url must be HTTPS without credentials, query, or fragment`,
        );
      }
      validateDiscoveryRef(
        source?.ref,
        source?.refReason,
        `${label}: discoverySources[${sourceIndex}].ref`,
        failures,
      );
    }

    const firstSeenAt = candidate.firstSeenAt;
    const lastUpdatedAt = candidate.lastUpdatedAt;
    if (validDate(firstSeenAt) && validDate(lastUpdatedAt) && firstSeenAt > lastUpdatedAt) {
      failures.push(`${label}: firstSeenAt must not be after lastUpdatedAt`);
    }
    if (snapshotDate && validDate(firstSeenAt) && firstSeenAt > snapshotDate) {
      failures.push(`${label}: firstSeenAt must not be after registry snapshotAt`);
    }
    if (snapshotDate && validDate(lastUpdatedAt) && lastUpdatedAt > snapshotDate) {
      failures.push(`${label}: lastUpdatedAt must not be after registry snapshotAt`);
    }
    for (const [sourceIndex, source] of (Array.isArray(candidate.discoverySources)
      ? candidate.discoverySources
      : []).entries()) {
      if (validDate(firstSeenAt) && validDate(source?.observedAt) && source.observedAt < firstSeenAt) {
        failures.push(`${label}: discoverySources[${sourceIndex}].observedAt is before firstSeenAt`);
      }
      if (validDate(lastUpdatedAt) && validDate(source?.observedAt) && source.observedAt > lastUpdatedAt) {
        failures.push(`${label}: discoverySources[${sourceIndex}].observedAt is after lastUpdatedAt`);
      }
      if (snapshotDate && validDate(source?.observedAt) && source.observedAt > snapshotDate) {
        failures.push(`${label}: discoverySources[${sourceIndex}].observedAt is after registry snapshotAt`);
      }
    }

    const aliases = Array.isArray(candidate.aliases) ? candidate.aliases : [];
    const ownIdentityKeys = new Set([candidate.id, candidate.name].map(normalizeAlias).filter(Boolean));
    for (const [aliasIndex, alias] of aliases.entries()) {
      if (typeof alias === "string" && alias !== alias.normalize("NFKC").trim()) {
        failures.push(`${label}: aliases[${aliasIndex}] must be trimmed and Unicode-normalized`);
      }
      const aliasKey = normalizeAlias(alias);
      if (aliasKey && ownIdentityKeys.has(aliasKey)) {
        failures.push(`${label}: aliases[${aliasIndex}] redundantly repeats the candidate id or name`);
      }
    }
    for (const duplicate of normalizedArrayDuplicates(aliases, normalizeAlias)) {
      failures.push(
        `${label}: aliases contain a normalized duplicate (${String(duplicate.first)} / ${String(duplicate.duplicate)})`,
      );
    }

    const packageIdentities = Array.isArray(candidate.packageIdentities)
      ? candidate.packageIdentities
      : [];
    for (const [identityIndex, identity] of packageIdentities.entries()) {
      for (const field of ["ecosystem", "name"]) {
        const value = identity?.[field];
        if (typeof value === "string" && value !== value.normalize("NFKC").trim()) {
          failures.push(
            `${label}: packageIdentities[${identityIndex}].${field} must be trimmed and Unicode-normalized`,
          );
        }
      }
    }
    for (const duplicate of normalizedArrayDuplicates(packageIdentities, normalizePackageIdentity)) {
      failures.push(`${label}: packageIdentities contain normalized duplicate ${duplicate.key}`);
    }

    for (const field of ["relationTypes", "secondaryCategories", "architectureTypes"]) {
      for (const duplicate of normalizedArrayDuplicates(candidate[field], (value) =>
        typeof value === "string" ? value.normalize("NFKC").trim().toLocaleLowerCase("en-US") : "",
      )) {
        failures.push(`${label}: ${field} contains normalized duplicate ${duplicate.key}`);
      }
    }

    const primaryCategory =
      typeof candidate.primaryCategory === "string"
        ? candidate.primaryCategory.normalize("NFKC").trim().toLocaleLowerCase("en-US")
        : "";
    const secondaryCategories = new Set(
      (Array.isArray(candidate.secondaryCategories) ? candidate.secondaryCategories : [])
        .filter((value) => typeof value === "string")
        .map((value) => value.normalize("NFKC").trim().toLocaleLowerCase("en-US")),
    );
    if (primaryCategory && secondaryCategories.has(primaryCategory)) {
      failures.push(`${label}: primaryCategory must not be repeated in secondaryCategories`);
    }

    for (const field of ["dispositionReason", "evidenceSummary"]) {
      const matches = endorsementMatches(candidate[field]);
      if (matches.length > 0) {
        failures.push(
          `${label}: ${field} uses endorsement vocabulary (${[...new Set(matches)].join(", ")}) while endorsementStatus is not-evaluated`,
        );
      }
    }

    const promotionContractValid = hasValidPromotionContract(candidate, resourceById);
    if (candidate.disposition === PROMOTED_DISPOSITION) {
      if (typeof candidate.resourceId !== "string" || candidate.resourceId === "") {
        failures.push(`${label}: promoted-to-resource requires resourceId`);
      } else if (!resourceById.has(candidate.resourceId)) {
        failures.push(`${label}: resourceId ${candidate.resourceId} does not exist in data/resources.json`);
      }
      if (candidate.reviewStatus !== PROMOTED_REVIEW_STATUS) {
        failures.push(
          `${label}: promoted-to-resource requires reviewStatus ${PROMOTED_REVIEW_STATUS}`,
        );
      }
      if (candidate.dispositionReasonCode !== PROMOTED_REASON_CODE) {
        failures.push(
          `${label}: promoted-to-resource requires dispositionReasonCode ${PROMOTED_REASON_CODE}`,
        );
      }
      const promotedResource = resourceById.get(candidate.resourceId);
      if (promotedResource && promotedResource.kind !== "community") {
        failures.push(`${label}: promoted resource must use kind community`);
      }
      if (
        promotedResource &&
        !PROMOTABLE_RESOURCE_REVIEW_STATUSES.has(promotedResource.reviewStatus)
      ) {
        failures.push(
          `${label}: promoted resource requires reviewStatus source-reviewed or hands-on-verified`,
        );
      }
      if (promotedResource && promotedResource.sourceCandidateId !== candidate.id) {
        failures.push(
          `${label}: promoted resource sourceCandidateId must point back to candidate ${candidate.id}`,
        );
      }
      if (
        promotedResource &&
        urlKey &&
        canonicalUrlKey(promotedResource.url) !== urlKey
      ) {
        failures.push(
          `${label}: promoted candidate canonicalUrl must match resourceId ${candidate.resourceId}`,
        );
      }
      if (
        promotedResource &&
        (typeof promotedResource.reviewedRef !== "string" ||
          candidate.snapshotRef !== promotedResource.reviewedRef)
      ) {
        failures.push(
          `${label}: promoted candidate snapshotRef must match the resource reviewedRef`,
        );
      }
    } else if (candidate.resourceId !== undefined) {
      failures.push(`${label}: resourceId is only allowed for promoted-to-resource candidates`);
    }

    const idCollision = resourceById.get(candidate.id);
    const urlCollision = urlKey ? resourceByUrl.get(urlKey) : undefined;
    const collisions = [...new Map(
      [idCollision, urlCollision]
        .filter(Boolean)
        .map((resource) => [resource.id, resource]),
    ).values()];
    for (const resource of collisions) {
      if (!promotionContractValid || candidate.resourceId !== resource.id) {
        failures.push(
          `${label}: overlaps resource ${resource.id} without an explicit matching promoted-to-resource/resourceId contract`,
        );
      }
    }
  }

  for (const [key, owners] of identityOwners(candidates)) {
    if (owners.length <= 1) continue;
    failures.push(
      `data/discovery-candidates.json: normalized identity ${key} is shared by ${owners
        .map(({ candidate }) => valueLabel(candidate.id))
        .join(", ")}`,
    );
  }
  for (const [key, owners] of packageIdentityOwners(candidates)) {
    if (owners.length <= 1) continue;
    failures.push(
      `data/discovery-candidates.json: package identity ${key} is shared by ${owners
        .map(({ candidate }) => valueLabel(candidate.id))
        .join(", ")}`,
    );
  }

  const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  for (const resource of resources) {
    if (resource.sourceCandidateId === undefined) continue;
    const candidate = candidateById.get(resource.sourceCandidateId);
    if (!candidate) {
      failures.push(
        `resource ${resource.id}: sourceCandidateId ${resource.sourceCandidateId} does not exist`,
      );
      continue;
    }
    if (
      candidate.disposition !== PROMOTED_DISPOSITION ||
      candidate.resourceId !== resource.id ||
      !hasValidPromotionContract(candidate, resourceById)
    ) {
      failures.push(
        `resource ${resource.id}: sourceCandidateId must point to a matching promoted candidate`,
      );
    }
  }

  return [...new Set(failures)];
}

/** Compile the strict schema and combine it with semantic checks. */
export function createDiscoveryRegistryValidator(schema, resourcesRegistry) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validateSchema = ajv.compile(schema);

  return (registry) => {
    const schemaValid = validateSchema(registry);
    const schemaFailures = schemaValid
      ? []
      : (validateSchema.errors ?? []).map(
          (error) =>
            `data/discovery-candidates.json${error.instancePath || "/"}: ` +
            `${error.message ?? "schema validation failed"}`,
        );
    const failures = [
      ...schemaFailures,
      ...validateDiscoverySemantics(registry, resourcesRegistry),
    ];
    return {
      valid: failures.length === 0,
      schemaValid,
      failures: [...new Set(failures)],
      summary: summarizeDiscoveryCandidates(registry),
    };
  };
}
