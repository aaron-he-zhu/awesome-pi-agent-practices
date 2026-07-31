import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

function fail(message) {
  failures.push(message);
}

function indexUnique(items, label) {
  const result = new Map();
  for (const item of items) {
    if (result.has(item.id)) fail(`${label}: duplicate id ${item.id}`);
    result.set(item.id, item);
  }
  return result;
}

function requireExactIds(items, expectedIds, label) {
  const actualIds = [...items.keys()];
  const missing = expectedIds.filter((id) => !items.has(id));
  const unexpected = actualIds.filter((id) => !expectedIds.includes(id));
  if (missing.length > 0 || unexpected.length > 0) {
    fail(
      `${label}: expected exactly ${expectedIds.join(", ")}; ` +
        `missing ${missing.join(", ") || "none"}; ` +
        `unexpected ${unexpected.join(", ") || "none"}`,
    );
  }
}

function requireInteger(item, field, label) {
  if (!Number.isInteger(item[field]) || item[field] < 0) {
    fail(`${label}: ${field} must be a non-negative integer`);
  }
}

function requireTermsOnOneLine(text, terms, label) {
  const found = text
    .split("\n")
    .some((line) => terms.every((term) => line.includes(String(term))));
  if (!found) fail(`${label}: expected ${terms.map((term) => JSON.stringify(term)).join(" and ")}`);
}

const snapshot = JSON.parse(await read("data/research-snapshot-2026-07-31.json"));
const registry = JSON.parse(await read("data/resources.json"));
const [
  landscapeEnglish,
  landscapeChinese,
  queryLogEnglish,
  queryLogChinese,
  watchlistEnglish,
  watchlistChinese,
] = await Promise.all([
  read("docs/research/landscape.md"),
  read("docs/research/landscape.zh-CN.md"),
  read("docs/research/query-log.md"),
  read("docs/research/query-log.zh-CN.md"),
  read("docs/research/watchlist.md"),
  read("docs/research/watchlist.zh-CN.md"),
]);

if (snapshot.schemaVersion !== 1) fail("research snapshot: schemaVersion must be 1");
if (!/^\d{4}-\d{2}-\d{2}$/u.test(snapshot.capturedOn ?? "")) {
  fail("research snapshot: capturedOn must use YYYY-MM-DD");
}
if (!Number.isFinite(Date.parse(snapshot.finalizedAt))) {
  fail("research snapshot: finalizedAt must be an ISO date-time");
}
if (snapshot.capturedOn !== String(snapshot.finalizedAt).slice(0, 10)) {
  fail("research snapshot: capturedOn and finalizedAt date differ");
}
if (snapshot.finalizedAt !== registry.snapshotAt) {
  fail("research snapshot: finalizedAt must match resources snapshotAt");
}
for (const key of ["piVersion", "piCommit", "mainCommit"]) {
  if (snapshot.sourceBaseline?.[key] !== registry.baseline?.[key]) {
    fail(`research snapshot: sourceBaseline.${key} differs from resources registry`);
  }
}
if (!Number.isInteger(snapshot.sourceBaseline?.mainCommitsAhead)) {
  fail("research snapshot: mainCommitsAhead must be an integer");
}

const repositoryFields = indexUnique(
  snapshot.github?.repositoryFields ?? [],
  "repositoryFields",
);
const totals = indexUnique(snapshot.github?.totals ?? [], "GitHub totals");
const clusters = indexUnique(
  snapshot.github?.keywordClusters ?? [],
  "GitHub keyword clusters",
);
const catalogViews = indexUnique(
  snapshot.packageCatalog?.views ?? [],
  "package catalog views",
);

requireExactIds(
  repositoryFields,
  ["stars", "forks", "subscribers", "open-issues-field"],
  "repositoryFields",
);
requireExactIds(
  totals,
  [
    "issues-total",
    "issues-open",
    "issues-closed",
    "pulls-total",
    "pulls-open",
    "pulls-closed",
  ],
  "GitHub totals",
);
requireExactIds(
  clusters,
  [
    "provider-model",
    "authentication",
    "extension",
    "package-install-update",
    "session",
    "compaction",
    "windows-wsl",
    "terminal-tui",
    "timeout-retry-hang",
    "sandbox-security-permission",
  ],
  "GitHub keyword clusters",
);
requireExactIds(
  catalogViews,
  ["all", "extension", "skill", "theme", "prompt"],
  "package catalog views",
);

for (const [label, items, field] of [
  ["repositoryFields", repositoryFields.values(), "value"],
  ["GitHub totals", totals.values(), "totalCount"],
  ["GitHub keyword clusters", clusters.values(), "totalCount"],
  ["package catalog views", catalogViews.values(), "count"],
]) {
  for (const item of items) requireInteger(item, field, `${label}/${item.id}`);
}

for (const item of [...totals.values(), ...clusters.values()]) {
  if (typeof item.query !== "string" || !item.query.startsWith("repo:earendil-works/pi ")) {
    fail(`GitHub query ${item.id}: missing exact repository-scoped query`);
  }
}
const queries = [...totals.values(), ...clusters.values()].map((item) => item.query);
if (new Set(queries).size !== queries.length) fail("research snapshot: duplicate GitHub query");

for (const [language, text] of [
  ["English query log", queryLogEnglish],
  ["Chinese query log", queryLogChinese],
]) {
  for (const requiredLiteral of [
    snapshot.capturedOn,
    snapshot.finalizedAt,
    snapshot.sourceBaseline?.piVersion,
    snapshot.sourceBaseline?.piCommit,
    snapshot.sourceBaseline?.mainCommit,
  ]) {
    if (!requiredLiteral || !text.includes(String(requiredLiteral))) {
      fail(`${language}: missing baseline literal ${requiredLiteral || "<empty>"}`);
    }
  }
  for (const endpoint of [
    snapshot.github?.repositoryEndpoint,
    snapshot.github?.searchEndpoint,
  ]) {
    const endpointUrl = String(endpoint ?? "").replace(/^GET\s+/u, "");
    if (!endpointUrl || !text.includes(endpointUrl)) {
      fail(`${language}: missing endpoint ${endpointUrl || "<empty>"}`);
    }
  }
  for (const item of repositoryFields.values()) {
    requireTermsOnOneLine(
      text,
      [item.field, new Intl.NumberFormat("en-US").format(item.value)],
      `${language}/repository field ${item.id}`,
    );
  }
  for (const item of [...totals.values(), ...clusters.values()]) {
    requireTermsOnOneLine(
      text,
      [item.query, new Intl.NumberFormat("en-US").format(item.totalCount)],
      `${language}/GitHub query ${item.id}`,
    );
  }
  for (const item of catalogViews.values()) {
    requireTermsOnOneLine(
      text,
      [item.url, new Intl.NumberFormat("en-US").format(item.count)],
      `${language}/catalog view ${item.id}`,
    );
  }
  requireTermsOnOneLine(
    text,
    [snapshot.rfc?.url, snapshot.rfc?.visiblePiRelatedEntries],
    `${language}/RFC index`,
  );
}

const count = (items, id, field) => items.get(id)?.[field];
if (
  count(totals, "issues-total", "totalCount") !==
  count(totals, "issues-open", "totalCount") +
    count(totals, "issues-closed", "totalCount")
) {
  fail("research snapshot: total issues do not equal open plus closed");
}
if (
  count(totals, "pulls-total", "totalCount") !==
  count(totals, "pulls-open", "totalCount") +
    count(totals, "pulls-closed", "totalCount")
) {
  fail("research snapshot: total pull requests do not equal open plus closed");
}
if (
  count(repositoryFields, "open-issues-field", "value") !==
  count(totals, "issues-open", "totalCount") +
    count(totals, "pulls-open", "totalCount")
) {
  fail("research snapshot: open_issues_count does not equal open issues plus open PRs");
}

const displayedCounts = [
  ...[...repositoryFields.values()].map((item) => item.value),
  ...[...totals.values()].map((item) => item.totalCount),
  ...[...clusters.values()].map((item) => item.totalCount),
  ...[...catalogViews.values()].map((item) => item.count),
];
for (const value of new Set(displayedCounts)) {
  const formatted = new Intl.NumberFormat("en-US").format(value);
  if (!landscapeEnglish.includes(formatted)) {
    fail(`docs/research/landscape.md: missing snapshot count ${formatted}`);
  }
  if (!landscapeChinese.includes(formatted)) {
    fail(`docs/research/landscape.zh-CN.md: missing snapshot count ${formatted}`);
  }
}

const community = registry.resources.filter((resource) => resource.kind === "community");
const communityCounts = {
  communityResources: community.length,
  sourceReviewed: community.filter(
    (resource) => resource.reviewStatus === "source-reviewed",
  ).length,
  handsOnVerified: community.filter(
    (resource) => resource.reviewStatus === "hands-on-verified",
  ).length,
  deferred: community.filter((resource) => resource.status === "deferred").length,
  pinnedRefs: community.filter((resource) =>
    /^[0-9a-f]{40}$/u.test(resource.reviewedRef ?? ""),
  ).length,
};
for (const [field, expected] of Object.entries(communityCounts)) {
  const actual = snapshot.communityReview?.[field];
  if (!Number.isInteger(actual) || actual < 0) {
    fail(`research snapshot: communityReview.${field} must be a non-negative integer`);
  } else if (actual !== expected) {
    fail(
      `research snapshot: communityReview.${field} is ${actual}; registry requires ${expected}`,
    );
  }
}
if (snapshot.communityReview?.reviewedResources !== communityCounts.sourceReviewed) {
  fail(
    "research snapshot: legacy communityReview.reviewedResources alias must equal sourceReviewed",
  );
}
for (const [language, text] of [
  ["English query log", queryLogEnglish],
  ["Chinese query log", queryLogChinese],
]) {
  for (const [field, value] of Object.entries({
    ...communityCounts,
    reviewedResources: communityCounts.sourceReviewed,
  })) {
    requireTermsOnOneLine(
      text,
      [`\`${field}\``, value],
      `${language}/community review field ${field}`,
    );
  }
}
if (
  !Number.isInteger(snapshot.rfc?.visiblePiRelatedEntries) ||
  snapshot.rfc.visiblePiRelatedEntries < 1
) {
  fail("research snapshot: visiblePiRelatedEntries must be a positive integer");
}
for (const resource of community) {
  if (!/^[0-9a-f]{40}$/u.test(resource.reviewedRef ?? "")) {
    fail(`${resource.id}: missing full reviewedRef`);
    continue;
  }
  const immutableUrl = `${resource.url}/tree/${resource.reviewedRef}`;
  if (!watchlistEnglish.includes(immutableUrl)) {
    fail(`docs/research/watchlist.md: missing fixed snapshot for ${resource.id}`);
  }
  if (!watchlistChinese.includes(immutableUrl)) {
    fail(`docs/research/watchlist.zh-CN.md: missing fixed snapshot for ${resource.id}`);
  }
}

if (snapshot.manualSampling?.fixedSamplePreserved !== false) {
  fail("research snapshot: first-pass fixed-sample limitation must remain explicit");
}

if (failures.length > 0) {
  console.error(`Research-snapshot validation failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Research-snapshot validation passed: ${repositoryFields.size} repository fields, ` +
      `${totals.size} totals, ${clusters.size} keyword queries, ` +
      `${catalogViews.size} catalog views, ${communityCounts.communityResources} community ` +
      `records (${communityCounts.sourceReviewed} source-reviewed, ` +
      `${communityCounts.handsOnVerified} hands-on, ${communityCounts.deferred} deferred), ` +
      `${communityCounts.pinnedRefs} pinned refs.`,
  );
}
