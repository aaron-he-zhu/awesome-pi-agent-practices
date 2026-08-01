import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createDiscoveryRegistryValidator } from "../scripts/discovery-validation-utils.mjs";

const readJson = async (relativePath) =>
  JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));

const [schema, registry, resourcesRegistry] = await Promise.all([
  readJson("../data/discovery-candidates.schema.json"),
  readJson("../data/discovery-candidates.json"),
  readJson("../data/resources.json"),
]);
const validate = createDiscoveryRegistryValidator(schema, resourcesRegistry);

function copyRegistry() {
  return structuredClone(registry);
}

function firstCandidate(candidateRegistry) {
  assert.ok(candidateRegistry.candidates.length > 0, "the registry needs at least one test subject");
  return candidateRegistry.candidates[0];
}

function promotableResource() {
  const resource = resourcesRegistry.resources.find(
    (item) =>
      item.kind === "community" &&
      ["source-reviewed", "hands-on-verified"].includes(item.reviewStatus) &&
      typeof item.reviewedRef === "string" &&
      /^[0-9a-f]{40}$/u.test(item.reviewedRef) &&
      /^https:\/\/github\.com\/[^/]+\/[^/]+$/u.test(item.url),
  );
  assert.ok(resource, "the resource registry needs a pinned GitHub resource for promotion tests");
  return resource;
}

function expectFailure(candidateRegistry, pattern, message) {
  const result = validate(candidateRegistry);
  assert.equal(result.valid, false, message);
  assert.match(result.failures.join("\n"), pattern, result.failures.join("\n"));
}

function promote(candidate, resource) {
  candidate.canonicalUrl = resource.url;
  candidate.snapshotRef = resource.reviewedRef;
  candidate.disposition = "promoted-to-resource";
  candidate.dispositionReasonCode = "promoted-after-source-review";
  candidate.reviewStatus = "handed-off-to-resource-registry";
  candidate.resourceId = resource.id;
}

test("the checked-in discovery candidate registry satisfies schema and semantic checks", () => {
  const result = validate(copyRegistry());
  assert.equal(result.valid, true, result.failures.join("\n"));
  assert.equal(result.schemaValid, true, "the checked-in registry must satisfy its strict schema");
  assert.equal(result.summary.total, registry.candidates.length);
  assert.equal(
    Object.values(result.summary.dispositions).reduce((sum, count) => sum + count, 0),
    registry.candidates.length,
    "each candidate must contribute exactly one disposition count",
  );
});

test("candidate IDs and canonical URLs remain unique after normalization", () => {
  const duplicateId = copyRegistry();
  const cloneById = structuredClone(firstCandidate(duplicateId));
  cloneById.canonicalUrl = "https://example.test/duplicate-id-subject";
  duplicateId.candidates.push(cloneById);
  expectFailure(duplicateId, /duplicate candidate id/u, "duplicate candidate IDs must fail");

  const duplicateUrl = copyRegistry();
  const cloneByUrl = structuredClone(firstCandidate(duplicateUrl));
  cloneByUrl.id = `${cloneByUrl.id}-duplicate-url-subject`;
  cloneByUrl.name = `${cloneByUrl.name} duplicate URL subject`;
  cloneByUrl.aliases = [];
  duplicateUrl.candidates.push(cloneByUrl);
  expectFailure(duplicateUrl, /duplicate canonical URL/u, "duplicate canonical URLs must fail");
});

test("canonical URLs, aliases, and package identities use normalized identities", () => {
  const nonCanonicalUrl = copyRegistry();
  firstCandidate(nonCanonicalUrl).canonicalUrl += "/";
  expectFailure(
    nonCanonicalUrl,
    /canonicalUrl is not canonical/u,
    "a redundant trailing slash must fail canonical URL validation",
  );

  const duplicateAlias = copyRegistry();
  const aliasSubject = duplicateAlias.candidates.find((candidate) => candidate.aliases.length > 0);
  assert.ok(aliasSubject, "the registry needs a candidate alias test subject");
  aliasSubject.aliases.push(aliasSubject.aliases[0].toLocaleUpperCase("en-US").replace(/a/giu, "-a"));
  expectFailure(
    duplicateAlias,
    /aliases contain a normalized duplicate/u,
    "formatting and case must not conceal a duplicate alias",
  );

  const duplicatePackage = copyRegistry();
  const packageSubject = duplicatePackage.candidates.find(
    (candidate) => candidate.packageIdentities.length > 0,
  );
  assert.ok(packageSubject, "the registry needs a package identity test subject");
  const packageClone = structuredClone(packageSubject.packageIdentities[0]);
  packageClone.name = packageClone.name.toLocaleUpperCase("en-US");
  packageSubject.packageIdentities.push(packageClone);
  expectFailure(
    duplicatePackage,
    /packageIdentities contain normalized duplicate/u,
    "package identity case must not conceal a duplicate",
  );
});

test("commit-like refs must be exact lowercase commits", () => {
  const invalidSnapshot = copyRegistry();
  firstCandidate(invalidSnapshot).snapshotRef = "deadbeef";
  expectFailure(
    invalidSnapshot,
    /snapshotRef: commit refs must be exact 40-character lowercase commits/u,
    "abbreviated snapshot refs must fail",
  );

  const invalidSource = copyRegistry();
  const candidate = firstCandidate(invalidSource);
  assert.ok(candidate.discoverySources.length > 0, "a candidate needs a discovery source test subject");
  candidate.discoverySources[0].ref = "A".repeat(40);
  expectFailure(
    invalidSource,
    /discoverySources\[0\]\.ref: commit refs must be exact 40-character lowercase commits/u,
    "uppercase discovery refs must fail",
  );
});

test("a cheap discovery lead may record an unavailable immutable ref with a reason", () => {
  const candidateRegistry = copyRegistry();
  const candidate = firstCandidate(candidateRegistry);
  candidate.snapshotRef = null;
  candidate.snapshotRefReason = "The initial public referral did not expose an immutable artifact.";
  candidate.discoverySources[0].ref = null;
  candidate.discoverySources[0].refReason =
    "The directory observation was public but did not provide a versioned source.";

  const result = validate(candidateRegistry);
  assert.equal(result.valid, true, result.failures.join("\n"));

  delete candidate.snapshotRefReason;
  expectFailure(
    candidateRegistry,
    /missing immutable ref requires a nonblank ref reason/u,
    "a null immutable ref must retain an auditable reason",
  );
});

test("resolved refs forbid stale unavailability reasons", () => {
  const staleSnapshotReason = copyRegistry();
  firstCandidate(staleSnapshotReason).snapshotRefReason = "The ref used to be unavailable.";
  expectFailure(
    staleSnapshotReason,
    /snapshotRefReason|must NOT be valid|must match "else" schema/u,
    "a resolved snapshot cannot keep an unavailability reason",
  );

  const staleSourceReason = copyRegistry();
  firstCandidate(staleSourceReason).discoverySources[0].refReason =
    "The source ref used to be unavailable.";
  expectFailure(
    staleSourceReason,
    /refReason|must NOT be valid|must match "else" schema/u,
    "a resolved source cannot keep an unavailability reason",
  );
});

test("discovery source ids are unique within each candidate", () => {
  const candidateRegistry = copyRegistry();
  const candidate = firstCandidate(candidateRegistry);
  const duplicate = structuredClone(candidate.discoverySources[0]);
  duplicate.evidence += " Distinct text does not make the source id distinct.";
  candidate.discoverySources.push(duplicate);
  expectFailure(candidateRegistry, /duplicate discoverySources id/u);
});

test("candidate and evidence dates cannot move beyond the registry snapshot", () => {
  const candidateRegistry = copyRegistry();
  const candidate = firstCandidate(candidateRegistry);
  candidate.firstSeenAt = "2999-01-01";
  candidate.lastUpdatedAt = "2999-01-01";
  candidate.discoverySources[0].observedAt = "2999-01-01";
  expectFailure(
    candidateRegistry,
    /firstSeenAt must not be after registry snapshotAt/u,
    "future discovery chronology must fail",
  );
});

test("a not-detected license status cannot carry a contradictory license identifier", () => {
  const candidateRegistry = copyRegistry();
  const candidate = firstCandidate(candidateRegistry);
  candidate.licenseStatus = "not-detected";
  candidate.license = "MIT";
  expectFailure(
    candidateRegistry,
    /license.*must be null/u,
    "not-detected plus a declared identifier must fail",
  );
});

test("primary category cannot also appear as a secondary category", () => {
  const candidateRegistry = copyRegistry();
  const candidate = firstCandidate(candidateRegistry);
  candidate.secondaryCategories = [...candidate.secondaryCategories, candidate.primaryCategory];
  expectFailure(
    candidateRegistry,
    /primaryCategory must not be repeated in secondaryCategories/u,
    "primary/secondary category overlap must fail",
  );
});

test("an unpromoted candidate cannot silently collide with the resource registry", () => {
  const candidateRegistry = copyRegistry();
  const candidate = firstCandidate(candidateRegistry);
  const resource = promotableResource();
  candidate.canonicalUrl = resource.url;
  candidate.disposition = "awaiting-source-review";
  candidate.reviewStatus = "discovery-only";
  delete candidate.resourceId;
  expectFailure(
    candidateRegistry,
    new RegExp(`overlaps resource ${resource.id} without an explicit matching`, "u"),
    "a resource URL collision without a promotion contract must fail",
  );
});

test("promotion requires the complete hand-off contract and an exact resource mapping", () => {
  const resource = promotableResource();

  const missingResourceId = copyRegistry();
  const incomplete = firstCandidate(missingResourceId);
  incomplete.disposition = "promoted-to-resource";
  incomplete.dispositionReasonCode = "promoted-after-source-review";
  incomplete.reviewStatus = "handed-off-to-resource-registry";
  delete incomplete.resourceId;
  expectFailure(
    missingResourceId,
    /promoted-to-resource requires resourceId/u,
    "promotion without resourceId must fail",
  );

  const wrongMapping = copyRegistry();
  const mismatched = firstCandidate(wrongMapping);
  promote(mismatched, resource);
  const otherResource = resourcesRegistry.resources.find((item) => item.id !== resource.id);
  assert.ok(otherResource, "the registry needs a second resource for mismatch testing");
  mismatched.resourceId = otherResource.id;
  expectFailure(
    wrongMapping,
    /promoted candidate canonicalUrl must match resourceId|explicit matching promoted-to-resource/u,
    "promotion must point to the resource represented by the candidate URL",
  );

  const validPromotion = copyRegistry();
  const linkedResources = structuredClone(resourcesRegistry);
  const linkedResource = linkedResources.resources.find((item) => item.id === resource.id);
  const promotedCandidate = firstCandidate(validPromotion);
  promote(promotedCandidate, linkedResource);
  linkedResource.sourceCandidateId = promotedCandidate.id;
  const result = createDiscoveryRegistryValidator(schema, linkedResources)(validPromotion);
  assert.equal(result.valid, true, result.failures.join("\n"));
});

test("promotion requires a bidirectional resource link", () => {
  const candidateRegistry = copyRegistry();
  const candidate = firstCandidate(candidateRegistry);
  const linkedResources = structuredClone(resourcesRegistry);
  const resource = linkedResources.resources.find(
    (item) =>
      item.kind === "community" &&
      ["source-reviewed", "hands-on-verified"].includes(item.reviewStatus) &&
      typeof item.reviewedRef === "string" &&
      /^[0-9a-f]{40}$/u.test(item.reviewedRef) &&
      /^https:\/\/github\.com\/[^/]+\/[^/]+$/u.test(item.url),
  );
  assert.ok(resource);
  promote(candidate, resource);

  const missingLink = createDiscoveryRegistryValidator(schema, linkedResources)(candidateRegistry);
  assert.equal(missingLink.valid, false);
  assert.match(missingLink.failures.join("\n"), /sourceCandidateId must point back/u);

  resource.sourceCandidateId = candidate.id;

  const linkedValidate = createDiscoveryRegistryValidator(schema, linkedResources);
  const linkedResult = linkedValidate(candidateRegistry);
  assert.equal(linkedResult.valid, true, linkedResult.failures.join("\n"));

  resource.sourceCandidateId = "missing-candidate";
  const missingResult = createDiscoveryRegistryValidator(schema, linkedResources)(candidateRegistry);
  assert.equal(missingResult.valid, false);
  assert.match(missingResult.failures.join("\n"), /sourceCandidateId missing-candidate does not exist/u);
});

test("promotion targets only a source-reviewed community resource at the same ref", () => {
  const candidateRegistry = copyRegistry();
  const candidate = firstCandidate(candidateRegistry);
  const linkedResources = structuredClone(resourcesRegistry);
  const resource = linkedResources.resources.find((item) => item.id === promotableResource().id);
  promote(candidate, resource);
  resource.sourceCandidateId = candidate.id;

  resource.reviewStatus = "collection-needs-item-review";
  let result = createDiscoveryRegistryValidator(schema, linkedResources)(candidateRegistry);
  assert.equal(result.valid, false);
  assert.match(result.failures.join("\n"), /requires reviewStatus source-reviewed/u);

  resource.reviewStatus = "source-reviewed";
  resource.kind = "related-list";
  result = createDiscoveryRegistryValidator(schema, linkedResources)(candidateRegistry);
  assert.equal(result.valid, false);
  assert.match(result.failures.join("\n"), /must use kind community/u);

  resource.kind = "community";
  candidate.snapshotRef = "f".repeat(40);
  result = createDiscoveryRegistryValidator(schema, linkedResources)(candidateRegistry);
  assert.equal(result.valid, false);
  assert.match(result.failures.join("\n"), /snapshotRef must match the resource reviewedRef/u);
});

test("persisted discovery-source URLs cannot contain credentials or mutable URL state", () => {
  for (const unsafeUrl of [
    "https://user:secret@github.com/example/project",
    "https://github.com/example/project?token=secret",
    "https://github.com/example/project#mutable-fragment",
  ]) {
    const candidateRegistry = copyRegistry();
    firstCandidate(candidateRegistry).discoverySources[0].url = unsafeUrl;
    expectFailure(
      candidateRegistry,
      /discoverySources\[0\]\.url must be HTTPS without credentials, query, or fragment/u,
      `unsafe persisted source URL must fail: ${unsafeUrl}`,
    );
  }
});

test("candidate evidence cannot make an endorsement claim at any pre-promotion review stage", () => {
  const candidateRegistry = copyRegistry();
  const candidate = firstCandidate(candidateRegistry);
  candidate.reviewStatus = "discovery-only";
  candidate.evidenceSummary = "Recommended for production use.";
  expectFailure(
    candidateRegistry,
    /uses endorsement vocabulary \(Recommended\) while endorsementStatus is not-evaluated/iu,
    "candidate records must not imply endorsement",
  );

  for (const reviewStatus of ["preliminary-evidence-collected", "source-review-in-progress"]) {
    const stagedRegistry = copyRegistry();
    const staged = firstCandidate(stagedRegistry);
    staged.reviewStatus = reviewStatus;
    staged.disposition =
      reviewStatus === "source-review-in-progress"
        ? "source-review-in-progress"
        : "awaiting-source-review";
    staged.evidenceSummary = "Highly recommended, vetted, production-ready and safe to use.";
    expectFailure(
      stagedRegistry,
      /uses endorsement vocabulary/u,
      `${reviewStatus} must not bypass the candidate non-endorsement boundary`,
    );
  }

  const explicitNonEndorsement = copyRegistry();
  firstCandidate(explicitNonEndorsement).evidenceSummary +=
    " This discovery record is not recommended. It is not endorsed.";
  const result = validate(explicitNonEndorsement);
  assert.equal(
    result.valid,
    true,
    `explicit non-endorsement language must remain allowed:\n${result.failures.join("\n")}`,
  );
});
