import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import {
  buildCoverageSummary,
  renderCoverageMarkdown,
  stableJson,
  validateTaxonomyAssignments,
  validateCoverageMatrixCounts,
  validateTaxonomyDocumentation,
} from "./coverage-validation-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2] ?? "--check";
if (!["--check", "--write"].includes(mode)) {
  console.error("Usage: node scripts/generate-coverage.mjs [--check|--write]");
  process.exit(2);
}

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

const [
  taxonomySchema,
  taxonomy,
  registry,
  candidateRegistry,
  matrixEnglish,
  matrixChinese,
  protocolEnglish,
  protocolChinese,
  candidateIssueForm,
] = await Promise.all([
  readJson("data/practice-taxonomy.schema.json"),
  readJson("data/practice-taxonomy.json"),
  readJson("data/resources.json"),
  readJson("data/discovery-candidates.json"),
  readFile(path.join(root, "docs/research/coverage-matrix.md"), "utf8"),
  readFile(path.join(root, "docs/research/coverage-matrix.zh-CN.md"), "utf8"),
  readFile(path.join(root, "docs/research/discovery-protocol.md"), "utf8"),
  readFile(path.join(root, "docs/research/discovery-protocol.zh-CN.md"), "utf8"),
  readFile(path.join(root, ".github/ISSUE_TEMPLATE/ecosystem-candidate.yml"), "utf8"),
]);

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateTaxonomy = ajv.compile(taxonomySchema);
if (!validateTaxonomy(taxonomy)) {
  console.error("Practice taxonomy schema validation failed:");
  for (const error of validateTaxonomy.errors ?? []) {
    console.error(`- ${error.instancePath || "/"}: ${error.message}`);
  }
  process.exit(1);
}

const assignmentFailures = validateTaxonomyAssignments(taxonomy, registry, candidateRegistry);
if (assignmentFailures.length > 0) {
  console.error(`Coverage assignment validation failed with ${assignmentFailures.length} problem(s):`);
  for (const failure of assignmentFailures) console.error(`- ${failure}`);
  process.exit(1);
}

const summary = buildCoverageSummary(taxonomy, registry, candidateRegistry);
const matrixFailures = [
  ...validateCoverageMatrixCounts(matrixEnglish, summary, "en"),
  ...validateCoverageMatrixCounts(matrixChinese, summary, "zh-CN"),
];
const taxonomyDocumentationFailures = validateTaxonomyDocumentation(taxonomy, {
  protocolEnglish,
  protocolChinese,
  candidateIssueForm,
});
const narrativeFailures = [...matrixFailures, ...taxonomyDocumentationFailures];
if (narrativeFailures.length > 0) {
  console.error(`Taxonomy documentation validation failed with ${narrativeFailures.length} problem(s):`);
  for (const failure of narrativeFailures) console.error(`- ${failure}`);
  process.exit(1);
}
const outputs = new Map([
  ["data/coverage-summary.json", stableJson(summary)],
  ["docs/research/coverage-summary.md", renderCoverageMarkdown(summary, "en")],
  ["docs/research/coverage-summary.zh-CN.md", renderCoverageMarkdown(summary, "zh-CN")],
]);

if (mode === "--write") {
  await Promise.all(
    [...outputs].map(([relativePath, contents]) =>
      writeFile(path.join(root, relativePath), contents, "utf8"),
    ),
  );
  console.log(
    `Generated coverage: ${summary.totals.categories} categories, ` +
      `${summary.totals.sourceReviewedGapCategories} source-reviewed gaps, ` +
      `${summary.totals.discoveryCandidates} active candidates.`,
  );
} else {
  const failures = [];
  for (const [relativePath, expected] of outputs) {
    let actual;
    try {
      actual = await readFile(path.join(root, relativePath), "utf8");
    } catch (error) {
      if (error?.code === "ENOENT") {
        failures.push(`${relativePath}: missing generated file`);
        continue;
      }
      throw error;
    }
    if (actual !== expected) failures.push(`${relativePath}: stale; run npm run generate:coverage`);
  }

  if (failures.length > 0) {
    console.error("Generated coverage validation failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log(
    `Generated coverage is current: ${summary.totals.categories} categories, ` +
      `${summary.totals.sourceReviewedGapCategories} source-reviewed gaps, ` +
      `${summary.totals.handsOnGapCategories} hands-on gaps.`,
  );
}
