import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createDiscoveryQueryValidator,
  knownRepositoryRoots,
  normalizeSearchItems,
  runDiscoveryProbe,
} from "../scripts/discovery-probe.mjs";

const readJson = async (relativePath) =>
  JSON.parse(await readFile(new URL(relativePath, import.meta.url), "utf8"));

const [schema, configuration, resources, candidates] = await Promise.all([
  readJson("../data/discovery-queries.schema.json"),
  readJson("../data/discovery-queries.json"),
  readJson("../data/resources.json"),
  readJson("../data/discovery-candidates.json"),
]);

test("scheduled discovery queries satisfy the strict bounded-query schema", () => {
  const result = createDiscoveryQueryValidator(schema)(configuration);
  assert.equal(result.valid, true, result.failures.join("\n"));
  assert.ok(configuration.queries.some((query) => query.endpoint === "code"));
  assert.ok(configuration.queries.some((query) => query.endpoint === "repositories"));
});

test("query validation rejects duplicate identities, duplicate requests, and unsupported sorts", () => {
  const invalid = structuredClone(configuration);
  invalid.queries.push({ ...invalid.queries[0] });
  invalid.queries.push({
    ...invalid.queries[0],
    id: "unsupported-code-sort",
    query: '"unique-package" filename:package.json',
    sort: "stars",
  });
  const result = createDiscoveryQueryValidator(schema)(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.failures.some((failure) => failure.includes("duplicate query id")));
  assert.ok(result.failures.some((failure) => failure.includes("duplicate endpoint/query/page")));
  assert.ok(result.failures.some((failure) => failure.includes("only supports indexed or null")));
});

test("request identity includes sort, order, page size, and not only query text", () => {
  const variant = structuredClone(configuration);
  variant.queries.push({
    ...variant.queries[0],
    id: "current-coding-agent-package-consumers-ascending",
    order: "asc",
  });
  const result = createDiscoveryQueryValidator(schema)(variant);
  assert.equal(result.valid, true, result.failures.join("\n"));
});

test("code-search queries reject unsupported repository-visibility qualifiers", () => {
  const invalid = structuredClone(configuration);
  invalid.queries.find((query) => query.endpoint === "code").query += " is:public";
  const result = createDiscoveryQueryValidator(schema)(invalid);
  assert.equal(result.valid, false);
  assert.ok(
    result.failures.some((failure) =>
      failure.includes("code search must not use repository-visibility qualifiers"),
    ),
  );
});

test("scheduled probes reject pages beyond the bounded first page", () => {
  const invalid = structuredClone(configuration);
  invalid.queries[0].page = 2;
  const result = createDiscoveryQueryValidator(schema)(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.failures.some((failure) => failure.includes("restricted to the first page")));
});

test("scheduled probes reserve code-search rate-limit headroom", () => {
  const invalid = structuredClone(configuration);
  for (let index = 0; index < 3; index += 1) {
    invalid.queries.push({
      ...invalid.queries.find((query) => query.endpoint === "code"),
      id: `extra-code-query-${index}`,
      query: `\"extra-${index}\" filename:package.json`,
    });
  }
  const result = createDiscoveryQueryValidator(schema)(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.failures.some((failure) => failure.includes("at most 8 code-search")));
});

test("scheduled probes retain both code and repository search families", () => {
  for (const endpoint of ["code", "repositories"]) {
    const invalid = structuredClone(configuration);
    invalid.queries = invalid.queries.filter((query) => query.endpoint !== endpoint);
    const result = createDiscoveryQueryValidator(schema)(invalid);
    assert.equal(result.valid, false);
    assert.ok(
      result.failures.some((failure) =>
        failure.includes(`require at least one ${endpoint === "code" ? "code" : "repository"}-search`),
      ),
    );
  }
});

test("probe normalization distinguishes registered and unseen repository roots", () => {
  const known = knownRepositoryRoots(resources, candidates);
  const knownCandidate = candidates.candidates[0];
  const knownItem = {
    id: 1,
    full_name: new URL(knownCandidate.canonicalUrl).pathname.slice(1),
    html_url: `${knownCandidate.canonicalUrl}/`,
    private: false,
    visibility: "public",
  };
  const unseenItem = {
    id: 2,
    full_name: "example/unseen-pi-project",
    html_url: "https://github.com/example/unseen-pi-project",
    private: false,
    visibility: "public",
  };
  const normalized = normalizeSearchItems("repositories", [knownItem, unseenItem], known);
  assert.equal(normalized[0].knownState, "registered");
  assert.equal(normalized[1].knownState, "unregistered");
  assert.deepEqual(normalized.map((item) => item.position), [1, 2]);
});

test("code results preserve path and blob identity without copying source content", () => {
  const normalized = normalizeSearchItems(
    "code",
    [
      {
        path: "package.json",
        sha: "a".repeat(40),
        html_url: "https://github.com/example/project/blob/aaaaaaaa/package.json",
        repository: {
          full_name: "example/project",
          html_url: "https://github.com/example/project",
          private: false,
          visibility: "public",
        },
      },
    ],
    new Set(),
  );
  assert.equal(normalized[0].path, "package.json");
  assert.match(normalized[0].rawId, /^github-code:example\/project:package\.json:/u);
  assert.equal("text_matches" in normalized[0], false);
});

test("probe normalization fail-closes and redacts non-public or ambiguous repositories", () => {
  const normalized = normalizeSearchItems(
    "repositories",
    [
      {
        id: 1,
        full_name: "private/secret-project",
        html_url: "https://github.com/private/secret-project",
        private: true,
        visibility: "private",
      },
      {
        id: 2,
        full_name: "unknown/visibility",
        html_url: "https://github.com/unknown/visibility",
      },
      {
        id: 4,
        full_name: "internal/project",
        html_url: "https://github.com/internal/project",
        private: false,
        visibility: "internal",
      },
      {
        id: 3,
        full_name: "public/project",
        html_url: "https://github.com/public/project",
        private: false,
        visibility: "public",
      },
    ],
    new Set(),
  );
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].repositoryFullName, "public/project");
  assert.doesNotMatch(
    JSON.stringify(normalized),
    /secret-project|unknown\/visibility|internal\/project/u,
  );
});

test("a visibility-contaminated response redacts the entire query and every derived count", async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        total_count: 2,
        incomplete_results: false,
        items: [
          {
            id: 1,
            full_name: "public/one",
            html_url: "https://github.com/public/one",
            private: false,
            visibility: "public",
          },
          {
            id: 2,
            full_name: "private/secret",
            html_url: "https://github.com/private/secret",
            private: true,
            visibility: "private",
          },
        ],
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );

  const report = await runDiscoveryProbe(
    { queries: [configuration.queries.find((query) => query.endpoint === "repositories")] },
    { resources: { resources: [] }, candidates: { candidates: [] } },
    "test-token",
  );
  assert.equal(report.summary.failedQueries, 1);
  assert.equal(report.summary.visibilityContaminatedQueries, 1);
  assert.equal(report.queries[0].totalCount, null);
  assert.equal(report.queries[0].paginationTruncated, null);
  assert.deepEqual(report.queries[0].rawResults, []);
  assert.doesNotMatch(JSON.stringify(report), /private\/secret/u);
});

test("probe reports API incompleteness separately from first-page truncation", async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        total_count: 2,
        incomplete_results: false,
        items: [
          {
            id: 1,
            full_name: "example/one",
            html_url: "https://github.com/example/one",
            private: false,
            visibility: "public",
          },
        ],
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "x-ratelimit-remaining": "0",
        },
      },
    );

  const report = await runDiscoveryProbe(
    { queries: [configuration.queries.find((query) => query.endpoint === "repositories")] },
    { resources: { resources: [] }, candidates: { candidates: [] } },
    "test-token",
  );
  assert.equal(report.queries[0].apiIncomplete, false);
  assert.equal(report.queries[0].paginationTruncated, true);
  assert.equal(report.queries[0].requestAttempts, 1);
  assert.equal(report.queries[0].rateLimit.remaining, 0);
  assert.equal(report.queries[0].rateLimit.resetAt, null);
});

test("probe fails closed when every code-search family returns zero results", async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ total_count: 0, incomplete_results: false, items: [] }),
      { status: 200, headers: { "content-type": "application/json" } },
    );

  const codeQueries = configuration.queries
    .filter((query) => query.endpoint === "code")
    .slice(0, 2);
  const report = await runDiscoveryProbe(
    { queries: codeQueries },
    { resources: { resources: [] }, candidates: { candidates: [] } },
    "test-token",
  );
  assert.equal(report.status, "failed");
  assert.equal(report.summary.failedQueries, 0);
  assert.equal(report.summary.failedHealthChecks, 1);
  assert.deepEqual(report.healthFailures, [
    {
      kind: "code-search-all-zero",
      message:
        "Every configured code-search family returned zero results; treat this as an authentication-scope or query-semantics regression until the artifact is reviewed.",
    },
  ]);
});

test("probe preserves completed queries and sanitized failures in one partial report", async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => {
    globalThis.fetch = originalFetch;
  });
  let request = 0;
  globalThis.fetch = async () => {
    request += 1;
    if (request === 1) {
      return new Response(
        JSON.stringify({
          total_count: 1,
          incomplete_results: false,
          items: [
            {
              id: 1,
              full_name: "public/one",
              html_url: "https://github.com/public/one",
              private: false,
              visibility: "public",
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }
    return new Response(JSON.stringify({ message: "rate limited" }), {
      status: 403,
      headers: { "content-type": "application/json", "x-ratelimit-remaining": "0" },
    });
  };

  const repositoryQueries = configuration.queries
    .filter((query) => query.endpoint === "repositories")
    .slice(0, 2);
  const report = await runDiscoveryProbe(
    { queries: repositoryQueries },
    { resources: { resources: [] }, candidates: { candidates: [] } },
    "test-token",
  );
  assert.equal(report.summary.completedQueries, 1);
  assert.equal(report.summary.failedQueries, 1);
  assert.equal(report.queries[0].rawResults.length, 1);
  assert.equal(report.queries[1].status, "failed");
  assert.deepEqual(report.queries[1].error, {
    kind: "github-api",
    status: 403,
    message: "GitHub Search API returned HTTP 403.",
  });
});

test("probe converts malformed successful responses into sanitized per-query failures", async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () =>
    new Response("not-json", { status: 200, headers: { "content-type": "text/plain" } });

  const report = await runDiscoveryProbe(
    { queries: [configuration.queries.find((query) => query.endpoint === "repositories")] },
    { resources: { resources: [] }, candidates: { candidates: [] } },
    "test-token",
  );
  assert.equal(report.summary.failedQueries, 1);
  assert.equal(report.queries[0].error.kind, "invalid-response");
  assert.equal(report.queries[0].rawResults.length, 0);
});

test("probe rejects unexpected JSON response shapes without aborting the report", async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ total_count: 1, incomplete_results: false, items: {} }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  const report = await runDiscoveryProbe(
    { queries: [configuration.queries.find((query) => query.endpoint === "repositories")] },
    { resources: { resources: [] }, candidates: { candidates: [] } },
    "test-token",
  );
  assert.equal(report.summary.failedQueries, 1);
  assert.equal(report.queries[0].error.kind, "invalid-response");
  assert.match(report.queries[0].error.message, /unexpected response shape/u);
});
