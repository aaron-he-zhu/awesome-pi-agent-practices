[English](./query-log.md) | [简体中文](./query-log.zh-CN.md)

# Research query log

<!-- sync:query-purpose -->

This log makes the dated numbers in the
[ecosystem landscape](./landscape.md) reproducible. The machine-readable
record is
[`data/research-snapshot-2026-07-31.json`](../../data/research-snapshot-2026-07-31.json).
Saved counts are historical observations, not assertions about the current
result of a moving endpoint.

Snapshot date: **2026-07-31, Asia/Singapore**. The registry and query record
were finalized at `2026-07-31T15:56:32+08:00`. Individual dynamic requests
were made during the same dated research pass; a single exact timestamp was
not preserved for each request.

## GitHub repository metadata

<!-- sync:query-github-repo -->

Endpoint:

```text
GET https://api.github.com/repos/earendil-works/pi
```

Equivalent authenticated command:

```bash
gh api repos/earendil-works/pi \
  --jq '{stars: .stargazers_count, forks: .forks_count, subscribers: .subscribers_count, open_issues_field: .open_issues_count}'
```

| Field | Saved value | Interpretation |
| --- | ---: | --- |
| `stargazers_count` | 81,068 | Stars; a popularity signal only. |
| `forks_count` | 10,008 | Repository-network forks, not active maintainers. |
| `subscribers_count` | 273 | Explicit watchers/subscribers. |
| `open_issues_count` | 83 | GitHub's combined open issue + open PR metadata field: 71 + 12 at this snapshot. |

Do not label `watchers_count` as explicit watchers: GitHub aliases it to the
star count. The subscriber field is the relevant explicit-watch value.

## GitHub issue and pull-request totals

<!-- sync:query-github-totals -->

Endpoint:

```text
GET https://api.github.com/search/issues?q={URL-encoded query}
```

The saved value is the response's `total_count`; no attempt was made to fetch
every result. Re-run any row with:

```bash
gh api -X GET search/issues \
  -f q='repo:earendil-works/pi is:issue is:open' \
  --jq '.total_count'
```

| ID | Exact query | Saved `total_count` |
| --- | --- | ---: |
| Issues total | `repo:earendil-works/pi is:issue` | 4,579 |
| Issues open | `repo:earendil-works/pi is:issue is:open` | 71 |
| Issues closed | `repo:earendil-works/pi is:issue is:closed` | 4,508 |
| Pull requests total | `repo:earendil-works/pi is:pr` | 2,485 |
| Pull requests open | `repo:earendil-works/pi is:pr is:open` | 12 |
| Pull requests closed | `repo:earendil-works/pi is:pr is:closed` | 2,473 |

The arithmetic checks are `4,579 = 71 + 4,508`, `2,485 = 12 + 2,473`, and
GitHub repository `open_issues_count = 71 + 12 = 83`.

## GitHub keyword clusters

<!-- sync:query-github-clusters -->

Each row uses the same Search Issues endpoint and saves only `total_count`.
Terms and capitalization below are the exact submitted query strings.

| Cluster | Exact query | Saved `total_count` |
| --- | --- | ---: |
| Provider / model | `repo:earendil-works/pi is:issue provider OR model` | 2,272 |
| Authentication / login / OAuth | `repo:earendil-works/pi is:issue auth OR login OR OAuth` | 490 |
| Extension | `repo:earendil-works/pi is:issue extension` | 1,563 |
| Package / install / update | `repo:earendil-works/pi is:issue package OR install OR update` | 2,478 |
| Session | `repo:earendil-works/pi is:issue session` | 1,534 |
| Compaction | `repo:earendil-works/pi is:issue compact OR compaction` | 415 |
| Windows / WSL | `repo:earendil-works/pi is:issue Windows OR WSL` | 304 |
| Terminal / TUI | `repo:earendil-works/pi is:issue terminal OR TUI` | 1,061 |
| Timeout / retry / hang | `repo:earendil-works/pi is:issue timeout OR retry OR hang` | 530 |
| Sandbox / security / permission | `repo:earendil-works/pi is:issue sandbox OR security OR permission` | 211 |

These sets overlap. They are neither an issue taxonomy nor prevalence
percentages. GitHub exposes `total_count` beyond its 1,000-result retrieval
cap, but that does not make full-result sampling possible. Search stemming,
index updates, edited issues, and new/closed issues can change counts without a
Pi release.

## Pi package catalog

<!-- sync:query-catalog -->

The package catalog is server-rendered. The count was read from the visible
`.packages-count` text for each exact URL:

| View | Exact URL | Saved visible count |
| --- | --- | ---: |
| All | `https://pi.dev/packages` | 5,351 |
| Extension | `https://pi.dev/packages?type=extension` | 3,059 |
| Skill | `https://pi.dev/packages?type=skill` | 360 |
| Theme | `https://pi.dev/packages?type=theme` | 109 |
| Prompt | `https://pi.dev/packages?type=prompt` | 78 |

One reproducible extraction is:

```bash
curl -fsSL 'https://pi.dev/packages?type=extension' |
  rg -o 'packages-count">[^<]+'
```

Filter counts overlap because one package can declare several resource types.
Rendered counts can change after npm publication, unpublication, or catalog
reconciliation.

## Release, source, registry, and RFC checks

<!-- sync:query-primary -->

| Claim | Endpoint or command | Saved result |
| --- | --- | --- |
| Stable release identity | `GET https://api.github.com/repos/earendil-works/pi/releases/tags/v0.83.0` | Published `2026-07-29T22:30:33Z`; tag commit `845d6ff1f6643aba440341cce877ce1c43ebbc39`. |
| Research head | `git rev-parse main` in the dated clone | `9b50b046d328d589a81400d2e184175d0bf19734`. |
| Commits ahead | `git rev-list --count 845d6ff1f6643aba440341cce877ce1c43ebbc39..9b50b046d328d589a81400d2e184175d0bf19734` | 56. |
| Source archive | `shasum -a 256 pi-0.83.0-source.tar.gz` after downloading the release asset | `f225b87ec3b4825dd5b94e922a8629558addca31a1b4d2c206ae598a8e2692c0`. |
| Pi RFC index | `https://rfc.earendil.com/keyword/pi/` | 9 visible Pi-related entries with mixed states. |
| npm package metadata | `npm view {exact-package}@0.83.0 --json` | Used only for package publication/engine checks; tagged source remains authoritative for behavior. |

Release time, commit time, changelog date, and local date can differ. Preserve
the original timestamp and time zone rather than flattening them into one
calendar date.

## Community source-review refs

<!-- sync:query-community -->

The snapshot separates the community population, evidence stage, disposition,
and immutable-ref coverage:

| Snapshot field | Value | Interpretation |
| --- | ---: | --- |
| `communityResources` | 15 | All registry records whose `kind` is `community`. |
| `sourceReviewed` | 12 | Records whose `reviewStatus` is `source-reviewed`. |
| `reviewedResources` | 12 | Compatibility alias for `sourceReviewed`; it is not the total community population. |
| `handsOnVerified` | 0 | Records whose `reviewStatus` is `hands-on-verified`. |
| `deferred` | 3 | Records whose curation `status` is `deferred`. |
| `pinnedRefs` | 15 | Community records with a full 40-character `reviewedRef`. |

The 12 source-reviewed watchlist and three deferred repositories all have a
full ref in [`data/resources.json`](../../data/resources.json). The watchlist
links both the moving repository and the immutable reviewed tree. Verify a
saved ref with:

```text
GET https://api.github.com/repos/{owner}/{repo}/commits/{reviewedRef}
```

The ref proves which source state was inspected. It does not convert source
review into installation, runtime testing, security certification, or
endorsement.

## Manual sampling limitation

<!-- sync:query-sampling -->

The first pass used recent and high-signal search results to synthesize
qualitative failure shapes, but it did **not** preserve a fixed sample size,
sort order, or issue-ID sample. Therefore:

- no manual-sampling result is used as a quantitative claim;
- failure shapes are labeled synthesis rather than frequency estimates;
- the first-pass sample cannot be reproduced exactly;
- future snapshots must record ordering, sample size, selection rule, and
  sampled IDs before making a sampling claim.

Exploratory GitHub repository searches were used only for discovery. The
selected community source states are reconstructable from their `reviewedRef`;
the search funnel is not a completeness claim.

This limitation remains part of the historical 2026-07-31 snapshot. The first
checked-in 13-lead gap batch in the
[discovery-run ledger](../../data/discovery-runs.json) is explicitly marked
`reconstructed-non-replayable`: it links the newly normalized leads to the
[candidate registry](../../data/discovery-candidates.json), but the original
queries, rankings, filtered results, and denominator were not preserved. It
therefore does not repair the historical sampling gap. Reviewed ledger imports
derived from new scheduled artifacts, as well as new human runs, follow the
[discovery protocol](discovery-protocol.md): before import they preserve raw
result identifiers and ordering and give every result a candidate mapping or
explicit disposition. Scheduled probe artifacts are pre-triage signals, not
ledger runs by themselves; a reviewed import must add the run-level
status/error/attempt metadata and per-result normalization contract.

## Rerun and preservation protocol

<!-- sync:query-rerun -->

1. Copy the current snapshot JSON to a new date; never overwrite a historical
   snapshot.
2. Record `capturedOn`, time zone, finalization time, stable tag, stable commit,
   and research `main` commit.
3. Re-run every exact endpoint/query and retain both the previous and new
   counts.
4. For ecosystem discovery, save the exact query, client/endpoint, sort,
   page/cursor, limits, every raw result identifier in returned order,
   redirects/aliases, errors, and truncation boundaries.
5. Map every raw result to a stable candidate ID or an explicit duplicate,
   rejected, deferred, or out-of-scope disposition; never silently drop a
   result.
6. For qualitative issue sampling, save ordering, sample size, selection rule,
   and issue IDs.
7. Resolve every community default branch to a full commit before reading
   claims; update `reviewedRef` only after reviewing the diff.
8. Run `npm run generate:coverage`, then update English and Chinese text
   together.
9. Run `npm run check`; it cross-checks the snapshots, candidate and reviewed
   registries, generated category/architecture coverage, both landscapes, and
   immutable watchlist links.
