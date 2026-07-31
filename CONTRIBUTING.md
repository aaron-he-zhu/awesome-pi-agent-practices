[English](CONTRIBUTING.md) | [简体中文](CONTRIBUTING.zh-CN.md)

# Contributing

<!-- sync:contrib-scope -->

Thank you for improving this bilingual, evidence-led Pi practice guide. This is
practice curation, not an exhaustive package directory. A useful contribution
helps a reader make or verify an operational decision.

Before contributing, read:

- the [research and inclusion methodology](docs/research/methodology.md);
- the [evidence ledger](docs/research/evidence-ledger.md);
- the [extension review](docs/extension-review.md) for third-party artifacts;
- Pi's own [contribution gate](https://github.com/earendil-works/pi/blob/main/CONTRIBUTING.md)
  if the underlying request belongs upstream.

## In scope

<!-- sync:contrib-in -->

- Correcting a fact, version boundary, command, translation, citation, or broken
  link.
- Adding or refining a reproducible Pi-specific practice.
- Adding primary evidence or a documented contradiction.
- Proposing a third-party artifact for source review.
- Submitting a human hands-on trial record.
- Updating the Pi baseline or a quarterly ecosystem snapshot.
- Improving bilingual parity, templates, schemas, checks, accessibility, or
  maintenance documentation.

## Out of scope

<!-- sync:contrib-out -->

- Bulk package/link submissions with no operational recommendation.
- Popularity, stars, downloads, sponsorship, or affiliation used as proof of
  quality.
- Generated descriptions copied from a catalog or search result.
- Unlicensed artifacts presented as reusable recommendations.
- Generic prompting slogans with no Pi-specific failure mode or verification.
- Undisclosed data transfer, credential access, destructive action, lifecycle
  script, or execution boundary.
- “Verified,” “secure,” “private,” “sandboxed,” or “battle-tested” claims
  without a scoped, reproducible record.
- Fully automated or unreviewed AI-generated pull requests.

## Contribution types

<!-- sync:contrib-types -->

### Fact correction

Include:

1. exact file/claim;
2. current behavior and corrected wording;
3. Pi version/tag/commit;
4. primary source and, when ambiguous, implementation/test evidence;
5. matching English and Chinese edits;
6. whether other practices or registry records are affected.

Security-sensitive corrections should follow [SECURITY.md](SECURITY.md).

### New or changed practice

Use the [practice proposal template](templates/practice-proposal.md). A practice
needs:

- a stable ID or proposed new ID;
- Pi-shaped failure mode;
- rationale;
- concrete procedure;
- observable verification;
- primary evidence where available;
- explicit inference labels;
- security/data/version qualifications;
- failure, rollback, or recovery guidance;
- fact-equivalent English and Chinese text.

Avoid renumbering existing practices. If a practice is retired, preserve its ID
in the decision history so external links do not silently change meaning.

### Watchlist candidate

A link alone is insufficient. Submit:

- canonical repository and immutable reviewed ref;
- artifact/package identity;
- license for repository and published artifact;
- current versus historical Pi scope;
- purpose and non-duplicative value;
- manifest, resources, dependencies, lifecycle scripts, native/binary/download
  behavior;
- file/process/network/credential/session authority;
- tests and CI observed at a dated snapshot;
- maintenance/compatibility evidence;
- obvious risks and proposed isolated trial;
- relationship disclosure.

The default result is `source-reviewed`, not a recommendation.

### Hands-on review

Use the [hands-on review template](templates/hands-on-review.md) and record:

- named human reviewer and relationship;
- exact artifact/ref/integrity;
- Pi/runtime/platform/provider versions;
- containment, test credentials/data, and network policy;
- exact install and test commands;
- expected and actual results for the relevant matrix;
- process/network/filesystem/data observations;
- cancellation, failure, reload, shutdown, uninstall, cleanup, and rollback;
- passed, failed, and skipped cases;
- residual risk, retest trigger, and expiration date;
- sanitized evidence links.

One successful happy path is not hands-on verification of a broad package.

## Recommendation states

<!-- sync:contrib-states -->

```text
discovered -> source-reviewed -> hands-on-verified -> featured
                    \-> rejected          \-> rejected
featured -> stale -> retest or remove
```

Only `featured` third-party items appear in the root curated section. Promotion
requires direct human use and editorial judgment; a numeric score, CI, package
catalog entry, or maintainer reputation cannot promote an item automatically.

<!-- sync:contrib-state-map -->

The lifecycle above, registry fields, and publication location are separate
dimensions. Until the registry schema splits them further, use this mapping for
community resources:

| Lifecycle meaning | `reviewStatus` | Allowed `status` shape | Required evidence and publication action |
| --- | --- | --- | --- |
| Discovered only | `catalog-only`, `collection-needs-item-review`, `legacy-scope`, or `blocked` as applicable | Normally `deferred`; never `featured` | Preserve canonical URL/ref and discovery reason; list only in research/coverage material. |
| Source reviewed | `source-reviewed` | A `watchlist*` risk/disposition value | Record exact ref, license, entry points, dependencies, authority/data flow, tests/CI and unresolved trial questions in both watchlists. |
| Hands-on verified | `hands-on-verified` | Remains `watchlist*` until a separate editorial decision | Attach a completed [hands-on review](templates/hands-on-review.md) with named human, expected/actual evidence, cleanup, residual risks and expiry. |
| Featured | `hands-on-verified` | `featured` | Obtain independent editorial and bilingual review; add paired root resource blocks and remove the paired watchlist blocks. |
| Stale | Preserve the last evidence stage; do not imply it is current | `stale` | Remove from the root list, state the expiry trigger, and queue a pinned retest or removal decision. |
| Rejected | Preserve the evidence stage that justified the decision, or `blocked` | `rejected` | Keep a concise reason and immutable evidence so the same unsafe/unfit artifact is not repeatedly rediscovered. |

`watchlist-data-access`, `watchlist-data-egress`, `watchlist-high-risk`,
`watchlist-privacy`, and `watchlist-trust-sensitive` are risk-oriented display
variants, not stronger evidence stages. `deferred` and `rejected` are
dispositions, not proof that source or hands-on review happened. The
`hands-on-review` form cannot itself award `featured`; that separate decision
checks comparative usefulness, conflicts, expiration, wording, and bilingual
parity.

## AI assistance

<!-- sync:contrib-ai -->

AI may assist discovery, drafting, translation, or consistency checks only when
a human contributor:

1. understands every submitted claim and line;
2. opens and verifies every source;
3. runs or personally validates every claimed command/test;
4. removes fabricated, overbroad, or unsupported language;
5. checks both language versions;
6. discloses material AI assistance in the pull request.

AI cannot be the named hands-on reviewer. Do not fabricate test results,
citations, maintainer opinions, or translations. Do not submit a fully
AI-generated or unreviewed pull request.

The central Awesome project's
[list-creation guide](https://github.com/sindresorhus/awesome/blob/main/create-list.md)
and
[current pull-request template](https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md)
require non-generated Markdown and reject AI-generated lists/fully AI-generated
pull requests. This repository's transparent research-preview history does not
qualify for an exemption. Any future central-list proposal requires substantive
human testing, selection, rewriting, and the required public-maintenance
period.

## Conflicts of interest

<!-- sync:contrib-conflict -->

Disclose if you own, maintain, work for, advise, sponsor, invest in, or were paid
by a candidate. Self-nominations are allowed for source review when disclosed;
they do not receive priority or a lower evidence bar.

There is no paid placement, affiliate ranking, sponsored ordering, or
star/download-based promotion. A materially conflicted maintainer must not be
the sole reviewer for featuring.

## Bilingual changes

<!-- sync:contrib-bilingual -->

- English files use `.md`; Simplified Chinese peers use `.zh-CN.md`.
- Add/update both peers in the same pull request.
- Preserve identical `<!-- sync:... -->` marker IDs and order.
- Preserve identical `<!-- resource:... -->` membership, order, and status.
- Translate facts and risk qualifications, not just headings.
- Keep commands, versions, commits, flags, identifiers, dates, licenses, and
  evidence status exact.
- Natural Chinese is preferred over word-for-word translation, but it must not
  weaken a security warning or upgrade a source-reviewed item to a recommendation.
- English `README.md` is the `awesome-lint` target; do not distort Chinese
  punctuation merely to make it pass English list rules.

Automation checks structure and registry membership, not semantic translation
quality. Human bilingual review remains required.

## Editing the resource registry

<!-- sync:contrib-registry -->

`data/resources.json` is a validation ledger, not a README generator. Keep
Markdown human-edited.

For each resource:

- use a stable lowercase hyphenated ID;
- record the dated `reviewStatus` and `status` honestly;
- never fill reviewer/test fields with inferred results;
- use `NOASSERTION` when no license is detected instead of guessing;
- state current/legacy Pi scope;
- keep `reason` distinct from `riskSummary`;
- update corresponding resource markers in both language files.

Do not turn dynamic stars/downloads into persistent resource fields or
recommendation ordering.

## Style

<!-- sync:contrib-style -->

- Write concrete, neutral descriptions that answer why an item is useful.
- Distinguish **fact**, **community claim**, **example**, and **inference**.
- Use version-pinned links for stable implementation claims.
- Prefer current canonical `earendil-works/pi` and `@earendil-works/*` names;
  label historical identities rather than silently rewriting evidence.
- Do not call the v0.83.0 CLI RPC a permanently stable protocol.
- Do not call Project Trust, a tool allowlist, a worktree, or a subprocess an OS
  sandbox.
- Do not call GitHub secret/unlisted gists access-controlled private documents.
- Keep the root README thin; detailed methodology, dynamic numbers, and untested
  candidates belong under `docs/research/`.
- Formal root Awesome items use `- [Name](URL) - Description.` with a
  concrete, capitalized, punctuated description.
- Internal navigation should use tables or text-first bullets so
  `awesome-lint` does not mistake relative links for formal list items.
- Do not add CI badges or a README `License` heading.

## Local checks

<!-- sync:contrib-checks -->

Use the repository's required Node version:

```bash
npm ci --ignore-scripts
npm run check
npm run check:awesome
```

Also:

1. inspect the rendered English and Chinese Markdown;
2. open every new evidence link;
3. verify no secret/private data appears in fixtures, logs, screenshots, or
   session exports;
4. confirm the diff contains no generated root README or unrelated changes.

`awesome-lint` can require GitHub remote metadata such as description, topics,
and detected CC0 license. A new local clone may therefore pass content rules but
fail the remote-metadata rule until the repository is published/configured.
Do not disable that rule permanently to hide missing metadata.

## First-publication checklist

<!-- sync:contrib-publish -->

Before treating the repository as publicly released:

1. name the human maintainer(s), assign owners for bilingual fact review,
   security reports, feature decisions, and stale-item revalidation, and
   document a monitored security contact or enable private vulnerability
   reporting;
2. publish it on GitHub with `main` as the default branch;
3. use a concrete description such as “Bilingual, evidence-led, reproducible
   practices for the Pi coding agent”;
4. add at least the `awesome` and `awesome-list` topics, plus narrowly relevant
   topics such as `pi-agent`, `coding-agent`, and `bilingual`;
5. confirm GitHub detects the root license as CC0-1.0;
6. require the documentation-quality and link-health checks for protected
   changes where the hosting plan supports it;
7. re-run `npm run check:awesome` from a clone whose branch tracks the published
   remote.

Do not submit this research preview to the central Awesome list. Reconsider only
after at least 30 days of public maintenance and substantive, independently
reviewable human testing, selection, rewriting, and bilingual fact review make
the upstream non-AI-generated-list attestation truthful.

## Pull-request checklist

<!-- sync:contrib-pr -->

- [ ] The change is in scope and explains reader value.
- [ ] I personally verified every fact, command, link, and result.
- [ ] I recorded exact version/commit/date and evidence status.
- [ ] I disclosed relationships, sponsorship, and material AI assistance.
- [ ] I did not convert popularity or generated text into a recommendation.
- [ ] I updated English and Chinese peers with matching sync/resource markers.
- [ ] I updated `data/resources.json` when membership/status changed.
- [ ] I ran local checks and inspected Markdown rendering.
- [ ] I removed credentials, private source/session content, identifiers, and
      sensitive logs.
- [ ] I agree to contribute the submitted content under CC0-1.0.

## Licensing

<!-- sync:contrib-license -->

Unless explicitly stated otherwise, contributions to this repository are
dedicated under [CC0 1.0 Universal](LICENSE). By submitting a contribution, you
confirm that you have the right to make that dedication. Do not copy third-party
descriptions, documentation, or code unless licensing permits it; write a short
original summary and link to the source.
