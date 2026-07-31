import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const readJson = async (relativePath) =>
  JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));

const schema = await readJson("../data/resources.schema.json");
const registry = await readJson("../data/resources.json");
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

function copyRegistry() {
  return structuredClone(registry);
}

function expectValid(candidate, message) {
  assert.equal(validate(candidate), true, `${message}: ${ajv.errorsText(validate.errors)}`);
}

function expectInvalid(candidate, message) {
  assert.equal(validate(candidate), false, message);
}

test("the checked-in resource registry satisfies the schema", () => {
  expectValid(copyRegistry(), "checked-in registry should validate");
});

test("lastReviewed rejects impossible calendar dates", () => {
  const candidate = copyRegistry();
  candidate.resources[0].lastReviewed = "2026-02-31";
  expectInvalid(candidate, "an impossible review date must fail");
});

test("platform entries cannot be empty or duplicated", () => {
  const empty = copyRegistry();
  empty.resources[0].platforms = [""];
  expectInvalid(empty, "an empty platform name must fail");

  const whitespace = copyRegistry();
  whitespace.resources[0].platforms = ["   "];
  expectInvalid(whitespace, "a whitespace-only platform name must fail");

  const duplicate = copyRegistry();
  duplicate.resources[0].platforms = ["linux", "linux"];
  expectInvalid(duplicate, "duplicate platforms must fail");
});

test("resource kind constrains the allowed status family", () => {
  const official = copyRegistry();
  official.resources.find((resource) => resource.kind === "official").status = "watchlist";
  expectInvalid(official, "an official source cannot use a community watchlist status");

  const community = copyRegistry();
  community.resources.find((resource) => resource.kind === "community").status = "primary";
  expectInvalid(community, "a community source cannot use an official primary status");
});

test("featured requires a community hands-on verification stage", () => {
  const insufficient = copyRegistry();
  const sourceReviewed = insufficient.resources.find(
    (resource) => resource.kind === "community" && resource.reviewStatus === "source-reviewed",
  );
  sourceReviewed.status = "featured";
  expectInvalid(insufficient, "source review alone cannot become featured");

  const eligibleCombination = copyRegistry();
  const handsOn = eligibleCombination.resources.find(
    (resource) => resource.kind === "community" && resource.reviewStatus === "source-reviewed",
  );
  handsOn.reviewStatus = "hands-on-verified";
  handsOn.status = "featured";
  expectValid(eligibleCombination, "the schema should allow the editorially eligible combination");
});

test("blocked or unresolved review stages cannot masquerade as an active watchlist review", () => {
  const candidate = copyRegistry();
  const community = candidate.resources.find(
    (resource) => resource.kind === "community" && resource.reviewStatus === "source-reviewed",
  );
  community.reviewStatus = "blocked";
  community.status = "watchlist";
  expectInvalid(candidate, "blocked evidence must use a deferred or rejected disposition");
});

test("active watchlist states require source or hands-on review", () => {
  const catalogOnly = copyRegistry();
  const community = catalogOnly.resources.find(
    (resource) => resource.kind === "community" && resource.reviewStatus === "source-reviewed",
  );
  community.reviewStatus = "catalog-only";
  expectInvalid(catalogOnly, "catalog discovery must not masquerade as an active watchlist review");

  const handsOn = copyRegistry();
  const verified = handsOn.resources.find(
    (resource) => resource.kind === "community" && resource.reviewStatus === "source-reviewed",
  );
  verified.reviewStatus = "hands-on-verified";
  expectValid(handsOn, "hands-on evidence may remain on the watchlist before editorial promotion");
});

test("hands-on evidence cannot use a discovered-only deferred disposition", () => {
  const candidate = copyRegistry();
  const community = candidate.resources.find(
    (resource) => resource.kind === "community" && resource.reviewStatus === "source-reviewed",
  );
  community.reviewStatus = "hands-on-verified";
  community.status = "deferred";
  expectInvalid(candidate, "hands-on evidence must retain a reviewed, stale, or rejected disposition");
});

test("related and community source reviews require immutable reviewed refs", () => {
  for (const kind of ["related-list", "community"]) {
    const candidate = copyRegistry();
    const resource = candidate.resources.find((item) => item.kind === kind);
    delete resource.reviewedRef;
    expectInvalid(candidate, `${kind} resources must retain an immutable reviewed ref`);
  }
});

test("active and legacy dispositions constrain current scope", () => {
  const inactiveWatchlist = copyRegistry();
  const watchlist = inactiveWatchlist.resources.find((resource) =>
    resource.status.startsWith("watchlist"),
  );
  watchlist.currentScope = false;
  expectInvalid(inactiveWatchlist, "an active watchlist entry cannot claim non-current scope");

  const currentLegacy = copyRegistry();
  const legacy = currentLegacy.resources.find(
    (resource) => resource.reviewStatus === "legacy-scope",
  );
  legacy.currentScope = true;
  expectInvalid(currentLegacy, "legacy evidence cannot claim current scope");
});

test("canonical resource URLs must be complete HTTPS URIs", () => {
  const candidate = copyRegistry();
  candidate.resources[0].url = "https://";
  expectInvalid(candidate, "a scheme without a host is not a canonical resource URL");
});

test("required descriptive fields cannot contain whitespace only", () => {
  for (const field of ["name", "license", "piVersion", "tests", "ci", "reason", "riskSummary"]) {
    const candidate = copyRegistry();
    candidate.resources[0][field] = "   ";
    expectInvalid(candidate, `${field} must contain a visible value`);
  }

  const baseline = copyRegistry();
  baseline.baseline.piVersion = "   ";
  expectInvalid(baseline, "baseline.piVersion must contain a visible value");
});
