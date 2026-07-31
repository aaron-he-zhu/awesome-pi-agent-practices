import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import {
  displayedNameMatches,
  duplicateValues,
  expectedLandscapeIds,
  expectedRootIdGroups,
  expectedRootIds,
  expectedWatchlistIds,
  firstMarkdownLink,
  isRegistryResourceLink,
  resourceBlocks,
  resourceDisplayName,
  resourceMarkers,
  sameMembership,
  sameSequence,
} from "./resource-validation-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

const registry = JSON.parse(await read("data/resources.json"));
const registrySchema = JSON.parse(await read("data/resources.schema.json"));
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateRegistry = ajv.compile(registrySchema);
if (!validateRegistry(registry)) {
  for (const error of validateRegistry.errors ?? []) {
    failures.push(
      `data/resources.json${error.instancePath || "/"}: ` +
        `${error.message ?? "schema validation failed"}`,
    );
  }
}

const resources = Array.isArray(registry.resources)
  ? registry.resources.filter(
      (resource) => resource && typeof resource === "object" && !Array.isArray(resource),
    )
  : [];
const ids = resources.map((resource) => resource.id);

if (registry.schemaVersion !== 1) failures.push("data/resources.json: schemaVersion must be 1");
if (!Number.isFinite(Date.parse(registry.snapshotAt))) {
  failures.push("data/resources.json: snapshotAt must be an ISO date-time");
}
for (const key of ["piCommit", "mainCommit"]) {
  if (!/^[0-9a-f]{40}$/u.test(registry.baseline?.[key] ?? "")) {
    failures.push(`data/resources.json: baseline.${key} must be a full lowercase commit`);
  }
}

for (const duplicate of duplicateValues(ids)) {
  failures.push(`data/resources.json: duplicate id ${duplicate}`);
}

const urls = resources.map((resource) => resource.url);
for (const duplicate of duplicateValues(urls)) {
  failures.push(`data/resources.json: duplicate canonical URL ${duplicate}`);
}

const requiredFields = [
  "id",
  "name",
  "kind",
  "status",
  "reviewStatus",
  "url",
  "license",
  "currentScope",
  "lastReviewed",
  "piVersion",
  "platforms",
  "tests",
  "ci",
  "reason",
  "riskSummary",
];
const allowedKinds = new Set(["official", "related-list", "community"]);
const snapshotDate = String(registry.snapshotAt).slice(0, 10);

for (const resource of resources) {
  for (const field of requiredFields) {
    if (!(field in resource)) failures.push(`${resource.id ?? "<unknown>"}: missing ${field}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(resource.id ?? "")) {
    failures.push(`${resource.id ?? "<unknown>"}: invalid id`);
  }
  if (!allowedKinds.has(resource.kind)) failures.push(`${resource.id}: invalid kind ${resource.kind}`);
  if (!/^https:\/\//u.test(resource.url ?? "")) failures.push(`${resource.id}: URL must use https`);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(resource.lastReviewed ?? "")) {
    failures.push(`${resource.id}: lastReviewed must use YYYY-MM-DD`);
  } else if (resource.lastReviewed > snapshotDate) {
    failures.push(`${resource.id}: lastReviewed is after registry snapshot`);
  }
  if (!Array.isArray(resource.platforms)) failures.push(`${resource.id}: platforms must be an array`);
  if (
    resource.kind === "community" &&
    !/^[0-9a-f]{40}$/u.test(resource.reviewedRef ?? "")
  ) {
    failures.push(`${resource.id}: community resources require a full reviewedRef commit`);
  }
  for (const field of ["name", "status", "reviewStatus", "license", "piVersion", "tests", "ci", "reason", "riskSummary"]) {
    if (typeof resource[field] !== "string" || resource[field].trim() === "") {
      failures.push(`${resource.id}: ${field} must be a non-empty string`);
    }
  }
  if (typeof resource.currentScope !== "boolean") {
    failures.push(`${resource.id}: currentScope must be boolean`);
  }
  if (
    resource.kind === "community" &&
    resource.status === "featured" &&
    resource.reviewStatus !== "hands-on-verified"
  ) {
    failures.push(`${resource.id}: a community featured item must be hands-on-verified`);
  }
}

const filesWithMarkers = [
  "README.md",
  "README.zh-CN.md",
  "docs/research/landscape.md",
  "docs/research/landscape.zh-CN.md",
  "docs/research/watchlist.md",
  "docs/research/watchlist.zh-CN.md",
];
const markersByFile = new Map();
const blocksByFile = new Map();
const used = new Set();

for (const file of filesWithMarkers) {
  const text = await read(file);
  const markers = resourceMarkers(text);
  markersByFile.set(file, markers);
  blocksByFile.set(file, resourceBlocks(text));
  for (const marker of markers) {
    used.add(marker);
    if (!ids.includes(marker)) failures.push(`${file}: unknown resource marker ${marker}`);
  }
  for (const duplicate of duplicateValues(markers)) {
    failures.push(`${file}: duplicate resource marker ${duplicate}`);
  }
}

const resourcesById = new Map(resources.map((resource) => [resource.id, resource]));
for (const file of filesWithMarkers) {
  for (const [id, block] of blocksByFile.get(file)) {
    const resource = resourcesById.get(id);
    if (!resource) continue;
    const firstLink = firstMarkdownLink(block);
    if (!firstLink || !isRegistryResourceLink(firstLink.target, resource)) {
      failures.push(
        `${file}: ${id} first resource link must match registry URL or reviewed snapshot ` +
          `${resource.url}`,
      );
    }
  }
}

for (const file of ["docs/research/landscape.md", "docs/research/watchlist.md"]) {
  for (const [id, block] of blocksByFile.get(file)) {
    const resource = resourcesById.get(id);
    if (!resource) continue;
    const displayedName = resourceDisplayName(block) ?? "";
    if (!displayedNameMatches(displayedName, resource.name)) {
      failures.push(`${file}: ${id} block does not identify registry name ${resource.name}`);
    }
    if (
      file === "docs/research/watchlist.md" &&
      typeof resource.status === "string" &&
      resource.status.startsWith("watchlist") &&
      !block.includes(resource.reviewStatus)
    ) {
      failures.push(
        `${file}: ${id} block does not state reviewStatus ${resource.reviewStatus}`,
      );
    }
  }
}

for (const [english, chinese] of [
  ["README.md", "README.zh-CN.md"],
  ["docs/research/landscape.md", "docs/research/landscape.zh-CN.md"],
  ["docs/research/watchlist.md", "docs/research/watchlist.zh-CN.md"],
]) {
  if (!sameSequence(markersByFile.get(english), markersByFile.get(chinese))) {
    failures.push(`${english} <> ${chinese}: resource membership/order differs`);
  }
}

const rootMarkers = markersByFile.get("README.md");
const expectedRoot = expectedRootIds(resources);
if (!sameMembership(rootMarkers, expectedRoot)) {
  failures.push(
    `README.md: official/current-related/featured-community marker membership differs\n` +
      `  Expected: ${expectedRoot.join(", ")}\n  Found: ${rootMarkers.join(", ")}`,
  );
}
for (const group of expectedRootIdGroups(resources)) {
  const groupIds = new Set(group.ids);
  const found = rootMarkers.filter((id) => groupIds.has(id));
  if (!sameSequence(found, group.ids)) {
    failures.push(
      `README.md: ${group.label} resource marker order differs from registry\n` +
        `  Expected: ${group.ids.join(", ")}\n  Found: ${found.join(", ")}`,
    );
  }
}

const landscapeMarkers = markersByFile.get("docs/research/landscape.md");
const expectedLandscape = expectedLandscapeIds(resources);
if (!sameSequence(landscapeMarkers, expectedLandscape)) {
  failures.push("docs/research/landscape.md: related-list markers do not match registry");
}

const watchlistMarkers = markersByFile.get("docs/research/watchlist.md");
const expectedWatchlist = expectedWatchlistIds(resources);
if (!sameSequence([...watchlistMarkers].sort(), [...expectedWatchlist].sort())) {
  failures.push(
    `docs/research/watchlist.md: community markers must match registry membership\n` +
      `  Expected: ${expectedWatchlist.join(", ")}\n  Found: ${watchlistMarkers.join(", ")}`,
  );
}

for (const id of ids) {
  if (!used.has(id)) failures.push(`data/resources.json: ${id} is not represented by a resource marker`);
}

if (failures.length > 0) {
  console.error(`Resource validation failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const counts = Object.groupBy(resources, (resource) => resource.kind);
  console.log(
    `Resource validation passed: ${resources.length} unique resources ` +
      `(${counts.official?.length ?? 0} official, ` +
      `${counts["related-list"]?.length ?? 0} related, ` +
      `${counts.community?.length ?? 0} community).`,
  );
}
