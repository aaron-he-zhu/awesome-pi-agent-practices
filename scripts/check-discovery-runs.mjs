import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import { canonicalUrlKey } from "./discovery-validation-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const RESULT_CONTRACTS = {
  "candidate-mapped": {
    reasonCodes: new Set(["normalized-to-candidate"]),
    candidateRequired: true,
  },
  duplicate: {
    reasonCodes: new Set(["duplicate-result"]),
    candidateRequired: true,
  },
  rejected: {
    reasonCodes: new Set(["insufficient-relation-evidence"]),
    candidateRequired: false,
  },
  deferred: {
    reasonCodes: new Set([
      "license-needs-resolution",
      "scope-needs-resolution",
      "insufficient-relation-evidence",
    ]),
    candidateRequired: false,
  },
  "out-of-scope": {
    reasonCodes: new Set(["out-of-scope"]),
    candidateRequired: false,
  },
  "lookup-failed": {
    reasonCodes: new Set(["lookup-failed"]),
    candidateRequired: false,
  },
};

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

export function validateDiscoveryRunSemantics(ledger, candidateRegistry) {
  const failures = [];
  const runs = Array.isArray(ledger?.runs) ? ledger.runs : [];
  const candidates = Array.isArray(candidateRegistry?.candidates)
    ? candidateRegistry.candidates
    : [];
  const candidatesById = new Map(
    candidates
      .filter((candidate) => typeof candidate?.id === "string")
      .map((candidate) => [candidate.id, candidate]),
  );
  const candidateIds = new Set(candidatesById.keys());
  const mappedCandidateIds = new Set();
  const seenRunIds = new Set();
  const snapshotTime = Date.parse(ledger?.snapshotAt);

  for (const runValue of runs) {
    const run = runValue && typeof runValue === "object" && !Array.isArray(runValue)
      ? runValue
      : {};
    const label = `discovery run ${run?.id ?? "<unknown>"}`;
    if (seenRunIds.has(run.id)) failures.push(`${label}: duplicate run id`);
    seenRunIds.add(run.id);

    const executedTime = Date.parse(run.executedAt);
    if (Number.isFinite(snapshotTime) && Number.isFinite(executedTime) && executedTime > snapshotTime) {
      failures.push(`${label}: executedAt must not be after ledger snapshotAt`);
    }

    let endpoint;
    try {
      endpoint = new URL(run.endpoint);
    } catch {
      endpoint = undefined;
    }
    if (endpoint?.username || endpoint?.password) {
      failures.push(`${label}: endpoint must not include URL credentials`);
    }
    if (endpoint?.hash) failures.push(`${label}: endpoint must not include a fragment`);
    if (endpoint?.search) failures.push(`${label}: endpoint must not include a query`);

    const pagination = run.pagination ?? {};
    if (pagination.pagesCompleted > pagination.pagesAttempted) {
      failures.push(`${label}: pagesCompleted cannot exceed pagesAttempted`);
    }
    if (pagination.truncated === true && !pagination.truncationReason) {
      failures.push(`${label}: a truncated run requires truncationReason`);
    }
    if (pagination.truncated === false && pagination.truncationReason !== null) {
      failures.push(`${label}: an untruncated run must use null truncationReason`);
    }
    if (run.completeForClaimedBatch === true && pagination.truncated === true) {
      failures.push(`${label}: a truncated run cannot claim a complete batch`);
    }
    if (pagination.pagesCompleted < pagination.pagesAttempted) {
      if (pagination.truncated !== true) {
        failures.push(`${label}: an incomplete page attempt must be marked truncated`);
      }
      if (run.completeForClaimedBatch === true) {
        failures.push(`${label}: an incomplete page attempt cannot claim a complete batch`);
      }
    }
    if (run.replayability === "reconstructed-non-replayable") {
      if (run.status !== "reconstructed") {
        failures.push(`${label}: a reconstructed run requires status reconstructed`);
      }
      if (run.completeForClaimedBatch !== false) {
        failures.push(`${label}: a reconstructed run cannot claim a complete batch`);
      }
      if (pagination.truncated !== true || !pagination.truncationReason) {
        failures.push(`${label}: a reconstructed run must state its truncation boundary`);
      }
    }
    if (run.replayability === "replayable" && run.status === "reconstructed") {
      failures.push(`${label}: a replayable run cannot use status reconstructed`);
    }
    if (["completed", "reconstructed"].includes(run.status) && run.error !== null) {
      failures.push(`${label}: status ${run.status} requires error null`);
    }
    if (["partial", "failed"].includes(run.status) && !run.error) {
      failures.push(`${label}: status ${run.status} requires a sanitized error record`);
    }
    if (run.status === "failed" && run.completeForClaimedBatch === true) {
      failures.push(`${label}: a failed run cannot claim a complete batch`);
    }

    const rawResults = Array.isArray(run.rawResults) ? run.rawResults : [];
    if (pagination.resultLimit < rawResults.length) {
      failures.push(`${label}: resultLimit is smaller than the preserved raw-result count`);
    }
    if (rawResults.length > 0 && pagination.pagesCompleted < 1) {
      failures.push(`${label}: preserved raw results require at least one completed page or batch`);
    }
    const positions = new Set();
    const rawIds = new Set();
    for (const [index, resultValue] of rawResults.entries()) {
      const result =
        resultValue && typeof resultValue === "object" && !Array.isArray(resultValue)
          ? resultValue
          : {};
      const resultLabel = `${label} rawResults[${index}]`;
      const expectedPosition = index + 1;
      if (result.position !== expectedPosition) {
        failures.push(
          `${resultLabel}: position ${String(result.position)} must preserve contiguous source order ${expectedPosition}`,
        );
      }
      if (positions.has(result.position)) failures.push(`${resultLabel}: duplicate position`);
      positions.add(result.position);
      if (rawIds.has(result.rawId)) failures.push(`${resultLabel}: duplicate rawId ${result.rawId}`);
      rawIds.add(result.rawId);

      let sourceUrl;
      try {
        sourceUrl = new URL(result.sourceUrl);
      } catch {
        sourceUrl = undefined;
      }
      if (sourceUrl?.username || sourceUrl?.password) {
        failures.push(`${resultLabel}: sourceUrl must not include URL credentials`);
      }
      if (sourceUrl?.search) {
        failures.push(`${resultLabel}: sourceUrl must not include a query`);
      }
      if (sourceUrl?.hash) {
        failures.push(`${resultLabel}: sourceUrl must not include a fragment`);
      }

      const contract = RESULT_CONTRACTS[result.disposition];
      let contractValid = contract !== undefined;
      if (contract && !contract.reasonCodes.has(result.reasonCode)) {
        failures.push(
          `${resultLabel}: disposition ${result.disposition} does not allow reasonCode ${String(result.reasonCode)}`,
        );
        contractValid = false;
      }

      if (contract?.candidateRequired === true) {
        if (typeof result.candidateId !== "string" || result.candidateId === "") {
          failures.push(
            `${resultLabel}: disposition ${result.disposition} requires a non-null registered candidateId`,
          );
          contractValid = false;
        } else if (!candidateIds.has(result.candidateId)) {
          failures.push(`${resultLabel}: unknown candidateId ${result.candidateId}`);
          contractValid = false;
        }
      } else if (contract?.candidateRequired === false && result.candidateId !== null) {
        failures.push(
          `${resultLabel}: disposition ${result.disposition} requires candidateId null`,
        );
        contractValid = false;
      }
      if (contract?.candidateRequired === false && result.resolvedCandidateUrl !== null) {
        failures.push(
          `${resultLabel}: disposition ${result.disposition} requires resolvedCandidateUrl null`,
        );
        contractValid = false;
      }

      if (
        contract?.candidateRequired === true &&
        typeof result.candidateId === "string" &&
        candidatesById.has(result.candidateId)
      ) {
        const candidate = candidatesById.get(result.candidateId);
        const resultUrlKey = canonicalUrlKey(result.resolvedCandidateUrl);
        const candidateUrlKey = canonicalUrlKey(candidate.canonicalUrl);
        if (!resultUrlKey || resultUrlKey !== candidateUrlKey) {
          failures.push(
            `${resultLabel}: ${result.disposition} resolvedCandidateUrl must normalize to candidate ` +
              `${result.candidateId} canonicalUrl ${candidate.canonicalUrl}`,
          );
          contractValid = false;
        }
      }

      if (result.disposition === "candidate-mapped" && contractValid) {
        mappedCandidateIds.add(result.candidateId);
      }
    }
  }

  for (const candidateId of candidateIds) {
    if (!mappedCandidateIds.has(candidateId)) {
      failures.push(`candidate ${candidateId}: no discovery-run raw result maps to this candidate`);
    }
  }

  return failures;
}

export function createDiscoveryRunValidator(schema, candidateRegistry) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validateSchema = ajv.compile(schema);
  return (ledger) => {
    const schemaValid = validateSchema(ledger);
    const failures = [];
    if (!schemaValid) {
      for (const error of validateSchema.errors ?? []) {
        failures.push(`${error.instancePath || "/"}: ${error.message}`);
      }
    }
    failures.push(...validateDiscoveryRunSemantics(ledger, candidateRegistry));
    return { valid: failures.length === 0, schemaValid, failures };
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [ledger, schema, candidateRegistry] = await Promise.all([
    readJson("data/discovery-runs.json"),
    readJson("data/discovery-runs.schema.json"),
    readJson("data/discovery-candidates.json"),
  ]);
  const result = createDiscoveryRunValidator(schema, candidateRegistry)(ledger);
  if (!result.valid) {
    console.error(`Discovery-run validation failed with ${result.failures.length} problem(s):`);
    for (const failure of result.failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    const resultCount = ledger.runs.reduce((total, run) => total + run.rawResults.length, 0);
    console.log(
      `Discovery-run validation passed: ${ledger.runs.length} run(s), ` +
        `${resultCount} preserved raw result(s), every candidate mapped.`,
    );
  }
}
