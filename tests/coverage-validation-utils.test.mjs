import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildCoverageSummary,
  validateCoverageMatrixCounts,
  validateTaxonomyDocumentation,
  validateTaxonomyAssignments,
} from "../scripts/coverage-validation-utils.mjs";

const readJson = async (relativePath) =>
  JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));

const [
  taxonomy,
  registry,
  candidateRegistry,
  matrixEnglish,
  matrixChinese,
  protocolEnglish,
  protocolChinese,
  candidateIssueForm,
] = await Promise.all([
  readJson("../data/practice-taxonomy.json"),
  readJson("../data/resources.json"),
  readJson("../data/discovery-candidates.json"),
  readFile(new URL("../docs/research/coverage-matrix.md", import.meta.url), "utf8"),
  readFile(new URL("../docs/research/coverage-matrix.zh-CN.md", import.meta.url), "utf8"),
  readFile(new URL("../docs/research/discovery-protocol.md", import.meta.url), "utf8"),
  readFile(new URL("../docs/research/discovery-protocol.zh-CN.md", import.meta.url), "utf8"),
  readFile(new URL("../.github/ISSUE_TEMPLATE/ecosystem-candidate.yml", import.meta.url), "utf8"),
]);

const copy = (value) => structuredClone(value);

test("checked-in resources and candidates use machine taxonomy identifiers", () => {
  assert.deepEqual(validateTaxonomyAssignments(taxonomy, registry, candidateRegistry), []);
});

test("coverage summary derives the 25-category source and hands-on gaps", () => {
  const summary = buildCoverageSummary(taxonomy, registry, candidateRegistry);
  assert.equal(summary.totals.categories, 25);
  assert.equal(summary.totals.registeredCommunityRecords, 15);
  assert.equal(summary.totals.sourceReviewedPrimaryRecords, 12);
  assert.equal(summary.totals.handsOnPrimaryRecords, 0);
  assert.equal(summary.totals.sourceReviewedPrimaryGapCategories, 14);
  assert.equal(summary.totals.handsOnGapCategories, 25);
  assert.equal(summary.totals.categoryArchitectureCells, 25 * 11);
});

test("narrative matrices retain taxonomy order and machine-derived source counts", () => {
  const summary = buildCoverageSummary(taxonomy, registry, candidateRegistry);
  assert.deepEqual(validateCoverageMatrixCounts(matrixEnglish, summary, "en"), []);
  assert.deepEqual(validateCoverageMatrixCounts(matrixChinese, summary, "zh-CN"), []);

  const stale = matrixEnglish.replace("1 source-reviewed: Gondolin", "9 source-reviewed: Gondolin");
  assert.ok(
    validateCoverageMatrixCounts(stale, summary, "en").some((failure) =>
      failure.includes("states 9 source-reviewed"),
    ),
  );

  const wrongChineseCategory = matrixChinese.replace("VM/工具隔离", "错误类别名");
  assert.ok(
    validateCoverageMatrixCounts(wrongChineseCategory, summary, "zh-CN").some((failure) =>
      failure.includes("expected VM/工具隔离"),
    ),
  );
});

test("discovery protocols and issue form enumerate machine relation and architecture IDs", () => {
  const documents = { protocolEnglish, protocolChinese, candidateIssueForm };
  assert.deepEqual(validateTaxonomyDocumentation(taxonomy, documents), []);

  const missing = {
    ...documents,
    candidateIssueForm: candidateIssueForm.replace("historical-sdk-embedder", "removed-relation"),
  };
  assert.ok(
    validateTaxonomyDocumentation(taxonomy, missing).some((failure) =>
      failure.includes("missing relation taxonomy id historical-sdk-embedder"),
    ),
  );
});

test("unknown and overlapping assignments fail before generation", () => {
  const invalidRegistry = copy(registry);
  const community = invalidRegistry.resources.find((resource) => resource.kind === "community");
  community.secondaryCategories.push(community.primaryCategory);
  community.architectureTypes.push("imaginary-architecture");
  community.relationTypes.push("imaginary-relation");

  const failures = validateTaxonomyAssignments(taxonomy, invalidRegistry, candidateRegistry);
  assert.ok(failures.some((failure) => failure.includes("repeated in secondaryCategories")));
  assert.ok(failures.some((failure) => failure.includes("imaginary-architecture")));
  assert.ok(failures.some((failure) => failure.includes("imaginary-relation")));
});

test("a candidate occupies the discovery column without upgrading source evidence", () => {
  const summary = buildCoverageSummary(taxonomy, registry, candidateRegistry);
  const candidateCategory = summary.categories.find(
    (category) => category.discoveryCandidatesPrimary > 0 && category.sourceReviewedPrimary === 0,
  );
  assert.ok(candidateCategory, "at least one source gap should have a discovery candidate");
  assert.equal(candidateCategory.handsOnPrimary, 0);
});

test("secondary categories count as coverage without changing primary placement", () => {
  const summary = buildCoverageSummary(taxonomy, registry, candidateRegistry);
  const permission = summary.categories.find((category) => category.id === "permission-guardrails");
  assert.equal(permission.sourceReviewedPrimary, 0);
  assert.ok(permission.sourceReviewedAny > 0);

  const evals = summary.categories.find((category) => category.id === "evals-benchmarking");
  assert.equal(evals.discoveryCandidatesPrimary, 0);
  assert.ok(evals.discoveryCandidatesAny > 0);
  assert.ok(evals.discoveryCandidateIds.includes("my-pi"));
});

test("category-by-architecture cells preserve every zero and nonzero stratum", () => {
  const summary = buildCoverageSummary(taxonomy, registry, candidateRegistry);
  assert.equal(summary.categoryArchitectureCells.length, 25 * 11);
  assert.ok(
    summary.categoryArchitectureCells.some(
      (cell) => cell.sourceReviewedRecords > 0 && cell.handsOnRecords === 0,
    ),
  );
  assert.ok(
    summary.categoryArchitectureCells.some(
      (cell) => cell.unresolvedCandidates > 0 && cell.sourceReviewedRecords === 0,
    ),
  );
});

test("inactive resources remain separated as deferred, rejected, or stale", () => {
  const mutated = copy(registry);
  const deferred = mutated.resources.find(
    (resource) => resource.kind === "community" && resource.status === "deferred",
  );
  assert.ok(deferred);
  const categoryId = deferred.primaryCategory;
  deferred.status = "rejected";

  const summary = buildCoverageSummary(taxonomy, mutated, candidateRegistry);
  const category = summary.categories.find((item) => item.id === categoryId);
  assert.ok(category.rejectedResourcesAny > 0);
  assert.ok(category.rejectedResourceIds.includes(deferred.id));
  assert.equal(category.deferredResourceIds.includes(deferred.id), false);
});
