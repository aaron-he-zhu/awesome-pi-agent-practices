import process from "node:process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

export function createDiscoveryQueryValidator(schema) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  return (configuration) => {
    const schemaValid = validate(configuration);
    const failures = (validate.errors ?? []).map(
      (error) => `${error.instancePath || "/"}: ${error.message}`,
    );
    if (schemaValid) {
      const ids = new Set();
      const requests = new Set();
      for (const [index, query] of configuration.queries.entries()) {
        if (ids.has(query.id)) failures.push(`/queries/${index}/id: duplicate query id ${query.id}`);
        ids.add(query.id);

        const requestIdentity = JSON.stringify([
          query.endpoint,
          query.query,
          query.sort,
          query.order,
          query.page,
          query.perPage,
        ]);
        if (requests.has(requestIdentity)) {
          failures.push(`/queries/${index}: duplicate endpoint/query/page request`);
        }
        requests.add(requestIdentity);

        if (query.endpoint === "code" && ![null, "indexed"].includes(query.sort)) {
          failures.push(`/queries/${index}/sort: code search only supports indexed or null`);
        }
        if (query.endpoint === "code" && /\bis:(?:public|private)\b/iu.test(query.query)) {
          failures.push(
            `/queries/${index}/query: code search must not use repository-visibility qualifiers`,
          );
        }
        if (query.endpoint === "repositories" && query.sort === "indexed") {
          failures.push(`/queries/${index}/sort: repository search does not support indexed`);
        }
        if (query.page !== 1) {
          failures.push(`/queries/${index}/page: scheduled probes are restricted to the first page`);
        }
      }
      const codeQueryCount = configuration.queries.filter(
        (query) => query.endpoint === "code",
      ).length;
      const repositoryQueryCount = configuration.queries.filter(
        (query) => query.endpoint === "repositories",
      ).length;
      if (codeQueryCount === 0) {
        failures.push(`/queries: scheduled probes require at least one code-search family`);
      }
      if (codeQueryCount > 8) {
        failures.push(`/queries: scheduled probes allow at most 8 code-search families`);
      }
      if (repositoryQueryCount === 0) {
        failures.push(`/queries: scheduled probes require at least one repository-search family`);
      }
    }
    return { valid: failures.length === 0, failures };
  };
}

function githubRepositoryRoot(value) {
  if (typeof value !== "string") return undefined;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return undefined;
  }
  if (parsed.protocol !== "https:" || !["github.com", "www.github.com"].includes(parsed.hostname)) {
    return undefined;
  }
  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length < 2) return undefined;
  return `https://github.com/${segments[0].toLocaleLowerCase("en-US")}/${segments[1]
    .replace(/\.git$/iu, "")
    .toLocaleLowerCase("en-US")}`;
}

export function knownRepositoryRoots(resourcesRegistry, candidateRegistry) {
  return new Set(
    [
      ...(resourcesRegistry.resources ?? []).map((resource) => resource.url),
      ...(candidateRegistry.candidates ?? []).map((candidate) => candidate.canonicalUrl),
    ]
      .map(githubRepositoryRoot)
      .filter(Boolean),
  );
}

export function normalizeSearchItems(endpoint, items, knownRoots) {
  return items
    .map((item, sourceIndex) => ({ item, sourceIndex }))
    .filter(({ item }) => {
      const repository = endpoint === "repositories" ? item : item.repository;
      const visibility = repository?.visibility;
      if (visibility !== undefined && visibility !== null && visibility !== "") {
        return visibility === "public" && repository?.private !== true;
      }
      return repository?.private === false;
    })
    .map(({ item, sourceIndex }) => {
    const repository = endpoint === "repositories" ? item : item.repository;
    const repositoryUrl = githubRepositoryRoot(repository?.html_url);
    const rawId =
      endpoint === "repositories"
        ? `github-repository:${String(repository?.id ?? item?.id ?? "unknown")}`
        : `github-code:${repository?.full_name ?? "unknown"}:${item?.path ?? "unknown"}:${item?.sha ?? "unknown"}`;
    return {
      position: sourceIndex + 1,
      rawId,
      repositoryFullName: repository?.full_name ?? null,
      repositoryUrl: repositoryUrl ?? null,
      evidenceUrl: endpoint === "code" ? item?.html_url ?? null : repository?.html_url ?? null,
      path: endpoint === "code" ? item?.path ?? null : null,
      knownState: repositoryUrl && knownRoots.has(repositoryUrl) ? "registered" : "unregistered",
    };
    });
}

function buildRequestUrl(query) {
  const parameters = new URLSearchParams({
    q: query.query,
    order: query.order,
    page: String(query.page),
    per_page: String(query.perPage),
  });
  if (query.sort !== null) parameters.set("sort", query.sort);
  return `https://api.github.com/search/${query.endpoint}?${parameters.toString()}`;
}

function skippedCodeQuery(query) {
  return {
    id: query.id,
    endpoint: query.endpoint,
    query: query.query,
    rationale: query.rationale,
    request: {
      url: buildRequestUrl(query),
      sort: query.sort,
      order: query.order,
      page: query.page,
      perPage: query.perPage,
    },
    status: "skipped",
    requestAttempts: 0,
    skipReason: {
      kind: "dedicated-code-search-token-unavailable",
      message:
        "Code search was not attempted with the repository-scoped Actions token; configure a public-only DISCOVERY_SEARCH_TOKEN to enable this query family.",
    },
    error: null,
    totalCount: null,
    apiIncomplete: null,
    paginationTruncated: null,
    nonPublicResultsRedacted: false,
    rawResults: [],
    unregisteredRepositoryUrls: [],
    rateLimit: { remaining: null, resetAt: null },
  };
}

function boundedRetryDelay(result) {
  const httpStatus = result?.error?.status;
  const retryable =
    httpStatus === 429 || (httpStatus === 403 && result?.rateLimit?.remaining === 0);
  const resetAt = Date.parse(result?.rateLimit?.resetAt ?? "");
  if (!retryable || !Number.isFinite(resetAt)) return null;
  const delay = Math.max(1_000, resetAt - Date.now() + 1_000);
  return delay <= 60_000 ? delay : null;
}

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

async function executeQuery(query, token, knownRoots, requestAttempts = 1) {
  const requestUrl = buildRequestUrl(query);
  let response;
  try {
    response = await fetch(requestUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "awesome-pi-agent-practices-discovery-probe",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    return {
      id: query.id,
      endpoint: query.endpoint,
      query: query.query,
      rationale: query.rationale,
      request: {
        url: requestUrl,
        sort: query.sort,
        order: query.order,
        page: query.page,
        perPage: query.perPage,
      },
      status: "failed",
      requestAttempts,
      error: {
        kind: "network",
        message: `GitHub search request failed before an HTTP response (${error?.name ?? "Error"}).`,
      },
      totalCount: null,
      apiIncomplete: null,
      paginationTruncated: null,
      nonPublicResultsRedacted: false,
      rawResults: [],
      unregisteredRepositoryUrls: [],
      rateLimit: { remaining: null, resetAt: null },
    };
  }
  const remainingHeader = response.headers.get("x-ratelimit-remaining");
  const resetHeader = response.headers.get("x-ratelimit-reset");
  const remaining = remainingHeader === null ? null : Number.parseInt(remainingHeader, 10);
  const resetEpoch = resetHeader === null ? Number.NaN : Number(resetHeader);
  const rateLimit = {
    remaining: Number.isFinite(remaining) ? remaining : null,
    resetAt: Number.isFinite(resetEpoch) ? new Date(resetEpoch * 1000).toISOString() : null,
  };
  if (!response.ok) {
    return {
      id: query.id,
      endpoint: query.endpoint,
      query: query.query,
      rationale: query.rationale,
      request: {
        url: requestUrl,
        sort: query.sort,
        order: query.order,
        page: query.page,
        perPage: query.perPage,
      },
      status: "failed",
      requestAttempts,
      error: {
        kind: "github-api",
        status: response.status,
        message: `GitHub Search API returned HTTP ${response.status}.`,
      },
      totalCount: null,
      apiIncomplete: null,
      paginationTruncated: null,
      nonPublicResultsRedacted: false,
      rawResults: [],
      unregisteredRepositoryUrls: [],
      rateLimit,
    };
  }
  let body;
  try {
    body = await response.json();
  } catch {
    return {
      id: query.id,
      endpoint: query.endpoint,
      query: query.query,
      rationale: query.rationale,
      request: {
        url: requestUrl,
        sort: query.sort,
        order: query.order,
        page: query.page,
        perPage: query.perPage,
      },
      status: "failed",
      requestAttempts,
      error: {
        kind: "invalid-response",
        status: response.status,
        message: "GitHub Search API returned a successful response with an invalid JSON body.",
      },
      totalCount: null,
      apiIncomplete: null,
      paginationTruncated: null,
      nonPublicResultsRedacted: false,
      rawResults: [],
      unregisteredRepositoryUrls: [],
      rateLimit,
    };
  }
  if (
    !body ||
    typeof body !== "object" ||
    !Array.isArray(body.items) ||
    !Number.isInteger(body.total_count) ||
    body.total_count < 0 ||
    typeof body.incomplete_results !== "boolean"
  ) {
    return {
      id: query.id,
      endpoint: query.endpoint,
      query: query.query,
      rationale: query.rationale,
      request: {
        url: requestUrl,
        sort: query.sort,
        order: query.order,
        page: query.page,
        perPage: query.perPage,
      },
      status: "failed",
      requestAttempts,
      error: {
        kind: "invalid-response",
        status: response.status,
        message: "GitHub Search API returned JSON with an unexpected response shape.",
      },
      totalCount: null,
      apiIncomplete: null,
      paginationTruncated: null,
      nonPublicResultsRedacted: false,
      rawResults: [],
      unregisteredRepositoryUrls: [],
      rateLimit,
    };
  }
  const rawResults = normalizeSearchItems(query.endpoint, body.items ?? [], knownRoots);
  const visibilityContaminated = rawResults.length !== (body.items ?? []).length;
  if (visibilityContaminated) {
    return {
      id: query.id,
      endpoint: query.endpoint,
      query: query.query,
      rationale: query.rationale,
      request: {
        url: requestUrl,
        sort: query.sort,
        order: query.order,
        page: query.page,
        perPage: query.perPage,
      },
      status: "failed",
      requestAttempts,
      error: {
        kind: "visibility-contaminated",
        message:
          "At least one result was non-public or had ambiguous visibility; all result identities and counts for this query were redacted.",
      },
      totalCount: null,
      apiIncomplete: null,
      paginationTruncated: null,
      nonPublicResultsRedacted: true,
      rawResults: [],
      unregisteredRepositoryUrls: [],
      rateLimit,
    };
  }
  const totalCount = body.total_count ?? 0;
  const apiIncomplete = body.incomplete_results ?? false;
  return {
    id: query.id,
    endpoint: query.endpoint,
    query: query.query,
    rationale: query.rationale,
    request: {
      url: requestUrl,
      sort: query.sort,
      order: query.order,
      page: query.page,
      perPage: query.perPage,
    },
    status: apiIncomplete ? "partial" : "completed",
    requestAttempts,
    error: apiIncomplete
      ? {
          kind: "api-incomplete",
          status: response.status,
          message: "GitHub Search API marked this response as incomplete.",
        }
      : null,
    totalCount,
    apiIncomplete,
    paginationTruncated: apiIncomplete || totalCount > (body.items ?? []).length,
    nonPublicResultsRedacted: false,
    rawResults,
    unregisteredRepositoryUrls: [
      ...new Set(
        rawResults
          .filter((result) => result.knownState === "unregistered" && result.repositoryUrl)
          .map((result) => result.repositoryUrl),
      ),
    ].sort(),
    rateLimit,
  };
}

export async function runDiscoveryProbe(configuration, registries, token, options = {}) {
  const knownRoots = knownRepositoryRoots(registries.resources, registries.candidates);
  const codeSearchEnabled = options.codeSearchEnabled ?? true;
  const waitForRetry = options.waitForRetry ?? wait;
  const queries = [];
  for (const query of configuration.queries) {
    if (query.endpoint === "code" && !codeSearchEnabled) {
      queries.push(skippedCodeQuery(query));
      continue;
    }
    let result = await executeQuery(query, token, knownRoots);
    const retryDelay = boundedRetryDelay(result);
    if (retryDelay !== null) {
      const retry = {
        triggerKind: result.error.kind,
        httpStatus: result.error.status ?? null,
        waitMilliseconds: retryDelay,
        initialRateLimit: result.rateLimit,
      };
      await waitForRetry(retryDelay);
      result = await executeQuery(query, token, knownRoots, 2);
      result.retry = retry;
    }
    queries.push(result);
  }
  const unregisteredRepositoryUrls = [
    ...new Set(queries.flatMap((query) => query.unregisteredRepositoryUrls)),
  ].sort();
  const codeQueries = queries.filter((query) => query.endpoint === "code");
  const allCodeQueriesReturnedZero =
    codeQueries.length > 0 &&
    codeQueries.every((query) => query.status === "completed" && query.totalCount === 0);
  const repositoryQueries = queries.filter((query) => query.endpoint === "repositories");
  const allRepositoryQueriesReturnedZero =
    repositoryQueries.length > 0 &&
    repositoryQueries.every(
      (query) => query.status === "completed" && query.totalCount === 0,
    );
  const healthFailures = [];
  if (allCodeQueriesReturnedZero) {
    healthFailures.push({
      kind: "code-search-all-zero",
      message:
        "Every configured code-search family returned zero results; treat this as an authentication-scope or query-semantics regression until the artifact is reviewed.",
    });
  }
  if (allRepositoryQueriesReturnedZero) {
    healthFailures.push({
      kind: "repository-search-all-zero",
      message:
        "Every configured repository-search family returned zero results; treat this as an authentication-scope or query-semantics regression until the artifact is reviewed.",
    });
  }
  const failedQueries = queries.filter((query) => query.status === "failed").length;
  const partialQueries = queries.filter((query) => query.status === "partial").length;
  const skippedQueries = queries.filter((query) => query.status === "skipped").length;
  const status =
    failedQueries > 0 || partialQueries > 0 || healthFailures.length > 0
      ? "failed"
      : skippedQueries > 0
        ? "completed-with-gaps"
        : "completed";
  return {
    schemaVersion: 1,
    probeVersion: 3,
    status,
    healthFailures,
    executedAt: new Date().toISOString(),
    source: "GitHub public search API",
    executionContext: {
      repository: process.env.GITHUB_REPOSITORY ?? null,
      workflowRunId: process.env.GITHUB_RUN_ID ?? null,
      workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
      repositorySha: process.env.GITHUB_SHA ?? null,
      repositoryRef: process.env.GITHUB_REF ?? null,
      codeSearchMode: codeSearchEnabled ? "enabled" : "skipped-with-repository-token",
      nodeVersion: process.version,
      githubApiVersion: "2022-11-28",
      queryConfigurationSha256: createHash("sha256")
        .update(JSON.stringify(configuration))
        .digest("hex"),
    },
    authenticationContext:
      process.env.DISCOVERY_AUTH_CONTEXT ??
      "Caller-supplied bearer token; result visibility depends on that token's repository access.",
    limitations:
      "This is a bounded first-page discovery probe. Search index coverage, token visibility, ranking, API limits, query vocabulary, and any explicitly skipped code-search families prevent ecosystem-completeness claims. If any result is non-public or has ambiguous visibility, every identity and derived count for that query is redacted and the query fails closed. Public results are untrusted leads and are never promoted automatically.",
    summary: {
      configuredQueries: configuration.queries.length,
      completedQueries: queries.filter((query) => query.status === "completed").length,
      failedQueries,
      partialQueries,
      skippedQueries,
      failedHealthChecks: healthFailures.length,
      preservedRawResults: queries.reduce((total, query) => total + query.rawResults.length, 0),
      visibilityContaminatedQueries: queries.filter(
        (query) => query.nonPublicResultsRedacted,
      ).length,
      unregisteredRepositories: unregisteredRepositoryUrls.length,
    },
    unregisteredRepositoryUrls,
    queries,
  };
}

async function main() {
  const [configuration, schema] = await Promise.all([
    readJson("data/discovery-queries.json"),
    readJson("data/discovery-queries.schema.json"),
  ]);
  const validation = createDiscoveryQueryValidator(schema)(configuration);
  if (!validation.valid) {
    console.error(`Discovery-query configuration failed with ${validation.failures.length} problem(s):`);
    for (const failure of validation.failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  if (process.argv[2] === "--check-config") {
    console.log(`Discovery-query configuration passed: ${configuration.queries.length} bounded query families.`);
    return;
  }
  if (process.argv[2] !== "--output" || !process.argv[3]) {
    console.error("Usage: node scripts/discovery-probe.mjs --check-config | --output <path>");
    process.exitCode = 2;
    return;
  }

  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (!token) {
    console.error("GITHUB_TOKEN or GH_TOKEN is required for the read-only GitHub discovery probe.");
    process.exitCode = 2;
    return;
  }
  const codeSearchMode = process.env.DISCOVERY_CODE_SEARCH_MODE ?? "enabled";
  if (!["enabled", "skip-with-repository-token"].includes(codeSearchMode)) {
    console.error(
      "DISCOVERY_CODE_SEARCH_MODE must be enabled or skip-with-repository-token.",
    );
    process.exitCode = 2;
    return;
  }
  const [resources, candidates] = await Promise.all([
    readJson("data/resources.json"),
    readJson("data/discovery-candidates.json"),
  ]);
  const report = await runDiscoveryProbe(configuration, { resources, candidates }, token, {
    codeSearchEnabled: codeSearchMode === "enabled",
  });
  const outputPath = path.resolve(process.cwd(), process.argv[3]);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(
    `Discovery probe preserved ${report.summary.preservedRawResults} raw result(s) ` +
      `from ${report.summary.configuredQueries} query families; ` +
      `${report.summary.partialQueries} partial and ${report.summary.failedQueries} failed; ` +
      `${report.summary.skippedQueries} query family/families were explicitly skipped; ` +
      `${report.summary.unregisteredRepositories} repository URL(s) are not in either registry.`,
  );
  if (report.status === "failed") process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
