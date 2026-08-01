import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createDiscoveryRunValidator } from "../scripts/check-discovery-runs.mjs";

const readJson = async (relativePath) =>
  JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));

const [schema, ledger, candidateRegistry] = await Promise.all([
  readJson("../data/discovery-runs.schema.json"),
  readJson("../data/discovery-runs.json"),
  readJson("../data/discovery-candidates.json"),
]);
const validate = createDiscoveryRunValidator(schema, candidateRegistry);
const copy = () => structuredClone(ledger);

function expectFailure(candidateLedger, pattern) {
  const result = validate(candidateLedger);
  assert.equal(result.valid, false);
  assert.match(result.failures.join("\n"), pattern, result.failures.join("\n"));
}

function appendRawResult(candidateLedger, changes) {
  const run = candidateLedger.runs[0];
  const result = {
    ...structuredClone(run.rawResults[0]),
    position: run.rawResults.length + 1,
    rawId: `mutation-${run.rawResults.length + 1}`,
    ...changes,
  };
  run.rawResults.push(result);
  run.pagination.resultLimit = Math.max(run.pagination.resultLimit, run.rawResults.length);
  return result;
}

test("checked-in reconstructed runs honestly map every candidate without claiming replayability", () => {
  const result = validate(copy());
  assert.equal(result.valid, true, result.failures.join("\n"));
  assert.equal(result.schemaValid, true);
  assert.equal(ledger.runs[0].replayability, "reconstructed-non-replayable");
  assert.equal(ledger.runs[0].completeForClaimedBatch, false);
  assert.equal(ledger.runs[0].pagination.truncated, true);
});

test("run identities, result positions, and candidate mappings are auditable", () => {
  const duplicateRun = copy();
  duplicateRun.runs.push(structuredClone(duplicateRun.runs[0]));
  expectFailure(duplicateRun, /duplicate run id/u);

  const badPosition = copy();
  badPosition.runs[0].rawResults[0].position = 99;
  expectFailure(badPosition, /must preserve contiguous source order 1/u);

  const unknownCandidate = copy();
  unknownCandidate.runs[0].rawResults[0].candidateId = "not-a-candidate";
  expectFailure(unknownCandidate, /unknown candidateId not-a-candidate/u);
});

test("no candidate can exist outside the preserved reconstructed mapping batch", () => {
  const missingMapping = copy();
  const missingId = missingMapping.runs[0].rawResults.pop().candidateId;
  expectFailure(
    missingMapping,
    new RegExp(`candidate ${missingId}: no discovery-run raw result maps`, "u"),
  );
});

test("a reconstructed run cannot masquerade as complete or untruncated", () => {
  const complete = copy();
  complete.runs[0].completeForClaimedBatch = true;
  expectFailure(complete, /reconstructed run cannot claim a complete batch/u);

  const untruncated = copy();
  untruncated.runs[0].pagination.truncated = false;
  untruncated.runs[0].pagination.truncationReason = null;
  expectFailure(untruncated, /reconstructed run must state its truncation boundary/u);
});

test("a replayable zero-hit query is preserved as a valid completed run", () => {
  const zeroHitLedger = copy();
  const zeroHit = structuredClone(zeroHitLedger.runs[0]);
  zeroHit.id = "replayable-zero-hit-query";
  zeroHit.replayability = "replayable";
  zeroHit.status = "completed";
  zeroHit.error = null;
  zeroHit.sourceKind = "repository-search";
  zeroHit.query = "exact zero-hit query";
  zeroHit.rawResults = [];
  zeroHit.pagination = {
    method: "page",
    pagesAttempted: 1,
    pagesCompleted: 1,
    resultLimit: 50,
    truncated: false,
    truncationReason: null,
  };
  zeroHit.completeForClaimedBatch = true;
  zeroHit.knownLimitations = "A zero result is scoped to this exact query and execution time.";
  zeroHitLedger.runs.push(zeroHit);

  const result = validate(zeroHitLedger);
  assert.equal(result.valid, true, result.failures.join("\n"));
});

test("partial and failed runs require sanitized structured errors", () => {
  const missingError = copy();
  missingError.runs[0].replayability = "replayable";
  missingError.runs[0].status = "failed";
  missingError.runs[0].error = null;
  expectFailure(missingError, /status failed requires a sanitized error record/u);

  const falseComplete = copy();
  falseComplete.runs[0].replayability = "replayable";
  falseComplete.runs[0].status = "failed";
  falseComplete.runs[0].error = {
    kind: "github-api",
    httpStatus: 403,
    message: "GitHub Search API returned HTTP 403.",
  };
  falseComplete.runs[0].completeForClaimedBatch = true;
  expectFailure(falseComplete, /failed run cannot claim a complete batch/u);
});

test("pagination and chronology claims cannot contradict the saved run", () => {
  const future = copy();
  future.runs[0].executedAt = "2999-01-01T00:00:00Z";
  expectFailure(future, /executedAt must not be after ledger snapshotAt/u);

  const tooManyPages = copy();
  tooManyPages.runs[0].pagination.pagesCompleted = 2;
  expectFailure(tooManyPages, /pagesCompleted cannot exceed pagesAttempted/u);

  const missingReason = copy();
  missingReason.runs[0].pagination.truncationReason = null;
  expectFailure(missingReason, /a truncated run requires truncationReason/u);

  const falseComplete = copy();
  falseComplete.runs[0].completeForClaimedBatch = true;
  expectFailure(falseComplete, /a truncated run cannot claim a complete batch/u);
});

test("each raw-result disposition has an exact reason and candidate contract", async (t) => {
  const cases = [
    {
      name: "candidate-mapped rejects a duplicate reason",
      changes: { disposition: "candidate-mapped", reasonCode: "duplicate-result" },
      pattern: /candidate-mapped does not allow reasonCode duplicate-result/u,
    },
    {
      name: "candidate-mapped requires a candidate",
      changes: {
        disposition: "candidate-mapped",
        reasonCode: "normalized-to-candidate",
        candidateId: null,
      },
      pattern: /candidate-mapped requires a non-null registered candidateId/u,
    },
    {
      name: "duplicate requires its duplicate reason",
      changes: { disposition: "duplicate", reasonCode: "normalized-to-candidate" },
      pattern: /duplicate does not allow reasonCode normalized-to-candidate/u,
    },
    {
      name: "duplicate requires a candidate",
      changes: { disposition: "duplicate", reasonCode: "duplicate-result", candidateId: null },
      pattern: /duplicate requires a non-null registered candidateId/u,
    },
    {
      name: "rejected only represents insufficient relation evidence",
      changes: {
        disposition: "rejected",
        reasonCode: "scope-needs-resolution",
        candidateId: null,
      },
      pattern: /rejected does not allow reasonCode scope-needs-resolution/u,
    },
    {
      name: "rejected cannot attach a candidate",
      changes: {
        disposition: "rejected",
        reasonCode: "insufficient-relation-evidence",
      },
      pattern: /rejected requires candidateId null/u,
    },
    {
      name: "deferred only permits unresolved evidence, scope, or license",
      changes: { disposition: "deferred", reasonCode: "duplicate-result", candidateId: null },
      pattern: /deferred does not allow reasonCode duplicate-result/u,
    },
    {
      name: "deferred cannot attach a candidate",
      changes: { disposition: "deferred", reasonCode: "license-needs-resolution" },
      pattern: /deferred requires candidateId null/u,
    },
    {
      name: "out-of-scope cannot masquerade as a candidate mapping",
      changes: { disposition: "out-of-scope", reasonCode: "out-of-scope" },
      pattern: /out-of-scope requires candidateId null/u,
    },
    {
      name: "lookup-failed requires its matching reason",
      changes: { disposition: "lookup-failed", reasonCode: "out-of-scope", candidateId: null },
      pattern: /lookup-failed does not allow reasonCode out-of-scope/u,
    },
    {
      name: "lookup-failed cannot attach a candidate",
      changes: { disposition: "lookup-failed", reasonCode: "lookup-failed" },
      pattern: /lookup-failed requires candidateId null/u,
    },
  ];

  for (const { name, changes, pattern } of cases) {
    await t.test(name, () => {
      const invalid = copy();
      appendRawResult(invalid, changes);
      expectFailure(invalid, pattern);
    });
  }
});

test("candidate-mapped and duplicate URLs must normalize to the target candidate", () => {
  const wrongMappedUrl = copy();
  const targetId = wrongMappedUrl.runs[0].rawResults[0].candidateId;
  const otherCandidate = candidateRegistry.candidates.find((candidate) => candidate.id !== targetId);
  assert.ok(otherCandidate, "URL mismatch testing requires a second candidate");
  wrongMappedUrl.runs[0].rawResults[0].resolvedCandidateUrl = otherCandidate.canonicalUrl;
  expectFailure(
    wrongMappedUrl,
    new RegExp(`candidate-mapped resolvedCandidateUrl must normalize to candidate ${targetId} canonicalUrl`, "u"),
  );

  const wrongDuplicateUrl = copy();
  appendRawResult(wrongDuplicateUrl, {
    disposition: "duplicate",
    reasonCode: "duplicate-result",
    resolvedCandidateUrl: otherCandidate.canonicalUrl,
  });
  expectFailure(
    wrongDuplicateUrl,
    /duplicate resolvedCandidateUrl must normalize to candidate .* canonicalUrl/u,
  );

  const normalizedDuplicateUrl = copy();
  const duplicate = appendRawResult(normalizedDuplicateUrl, {
    disposition: "duplicate",
    reasonCode: "duplicate-result",
  });
  duplicate.resolvedCandidateUrl = `${duplicate.resolvedCandidateUrl}/`;
  const result = validate(normalizedDuplicateUrl);
  assert.equal(result.valid, true, result.failures.join("\n"));

  const sourceDiffersFromCanonical = copy();
  sourceDiffersFromCanonical.runs[0].rawResults[0].sourceUrl =
    "https://www.npmjs.com/package/openclaw";
  const sourceResult = validate(sourceDiffersFromCanonical);
  assert.equal(sourceResult.valid, true, sourceResult.failures.join("\n"));
});

test("out-of-scope results cannot carry a real or fabricated candidateId", () => {
  const realCandidate = copy();
  appendRawResult(realCandidate, {
    disposition: "out-of-scope",
    reasonCode: "out-of-scope",
  });
  expectFailure(realCandidate, /out-of-scope requires candidateId null/u);

  const fabricatedCandidate = copy();
  appendRawResult(fabricatedCandidate, {
    disposition: "out-of-scope",
    reasonCode: "out-of-scope",
    candidateId: "fabricated-candidate",
  });
  expectFailure(fabricatedCandidate, /out-of-scope requires candidateId null/u);
});

test("run endpoints reject credentials, fragments, and every query string", () => {
  const credentials = copy();
  credentials.runs[0].endpoint = "https://user:password@github.com/search?q=pi";
  expectFailure(credentials, /endpoint must not include URL credentials/u);

  const fragment = copy();
  fragment.runs[0].endpoint = "https://github.com/search?q=pi#results";
  expectFailure(fragment, /endpoint must not include a fragment/u);

  const sensitiveQuery = copy();
  sensitiveQuery.runs[0].endpoint = "https://github.com/search?q=pi&token=secret";
  expectFailure(sensitiveQuery, /endpoint must not include a query/u);

  const ordinaryQuery = copy();
  ordinaryQuery.runs[0].endpoint = "https://github.com/search?q=pi&type=repositories";
  expectFailure(ordinaryQuery, /endpoint must not include a query/u);
});

test("raw-result source URLs reject credentials, query strings, and fragments", () => {
  const credentials = copy();
  credentials.runs[0].rawResults[0].sourceUrl =
    "https://user:password@github.com/openclaw/openclaw";
  expectFailure(credentials, /rawResults\[0\]: sourceUrl must not include URL credentials/u);

  const query = copy();
  query.runs[0].rawResults[0].sourceUrl = "https://github.com/openclaw/openclaw?tab=readme";
  expectFailure(query, /rawResults\[0\]: sourceUrl must not include a query/u);

  const fragment = copy();
  fragment.runs[0].rawResults[0].sourceUrl = "https://github.com/openclaw/openclaw#readme";
  expectFailure(fragment, /rawResults\[0\]: sourceUrl must not include a fragment/u);
});

test("raw ids and pagination completion remain internally consistent", () => {
  const duplicateRawId = copy();
  duplicateRawId.runs[0].rawResults[1].rawId = duplicateRawId.runs[0].rawResults[0].rawId;
  expectFailure(duplicateRawId, /duplicate rawId/u);

  const zeroCompleted = copy();
  zeroCompleted.runs[0].pagination.pagesCompleted = 0;
  expectFailure(zeroCompleted, /preserved raw results require at least one completed/u);

  const incompleteAttempt = copy();
  incompleteAttempt.runs[0].replayability = "replayable";
  incompleteAttempt.runs[0].pagination.pagesAttempted = 2;
  incompleteAttempt.runs[0].pagination.pagesCompleted = 1;
  incompleteAttempt.runs[0].pagination.truncated = false;
  incompleteAttempt.runs[0].pagination.truncationReason = null;
  incompleteAttempt.runs[0].completeForClaimedBatch = true;
  expectFailure(incompleteAttempt, /incomplete page attempt must be marked truncated/u);
  expectFailure(incompleteAttempt, /incomplete page attempt cannot claim a complete batch/u);
});
