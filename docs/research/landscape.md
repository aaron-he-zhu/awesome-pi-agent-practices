[English](./landscape.md) | [简体中文](./landscape.zh-CN.md)

# Pi ecosystem and issue landscape

<!-- sync:landscape-snapshot -->

This is a dated research snapshot, not a live dashboard and not a quality
ranking. Counts were captured on **2026-07-31 (Asia/Singapore)** from GitHub,
the Pi package catalog, release metadata, registry metadata, and the Earendil
RFC index. Re-run the queries before quoting them elsewhere.

<!-- sync:landscape-reproduction -->

Exact endpoints, query strings, immutable refs, and capture limitations are
preserved in the [query log](query-log.md) and the
[machine-readable snapshot](../../data/research-snapshot-2026-07-31.json).

## Executive findings

<!-- sync:landscape-findings -->

1. **Pi is both small in core policy and large in ecosystem surface.** The
   coding harness deliberately omits several opinionated workflow features,
   while packages/extensions implement many variants.
2. **The discovery problem is already served.** An official catalog and several
   package/wiki/awesome directories exist; another exhaustive link dump would
   be duplicative.
3. **The missing layer is operational evidence.** Users need procedures that
   state trust boundaries, version scope, verification, rollback, and data flow.
4. **Security language is easily overstated.** Project Trust, tool allowlists,
   worktrees, subprocesses, and tool routing are useful controls but are not
   equivalent to whole-process OS isolation.
5. **Compatibility is multidimensional.** Pi version, Node/Bun distribution,
   package scope, provider/model catalog, terminal, platform, and external
   service behavior can change independently.
6. **Popularity is a weak selection signal.** High-star projects may be broad,
   archived, legacy-scoped, unlicensed, or inappropriate for a particular data
   boundary; small focused tools may be excellent.

These findings define this repository's niche: bilingual, reproducible,
evidence-led, safety-aware practices rather than a package inventory.

## Upstream project snapshot

<!-- sync:landscape-upstream -->

GitHub API metadata at capture time:

| Metric | Snapshot value | Interpretation |
| --- | ---: | --- |
| Stars | approximately 81,068 | Popularity signal only; changes continuously. |
| Forks | approximately 10,008 | Repository-network count, not active maintainers. |
| Watchers | 273 | GitHub subscription metadata. |
| Open issues field | 83 | Repository metadata field; includes the 71 open issues and 12 open pull requests at this snapshot. |
| Total issues | 4,579 | Search query with `is:issue`; includes open and closed. |
| Open issues | 71 | Search query with `is:issue is:open`. |
| Closed issues | 4,508 | Search query with `is:issue is:closed`. |
| Total pull requests | 2,485 | Search query with `is:pr`; includes open and closed. |
| Open pull requests | 12 | Search query with `is:pr is:open`. |
| Closed pull requests | 2,473 | Search query with `is:pr is:closed`. |

The ratio of closed to open items suggests active triage, but it does not prove
resolution quality. Pi's contribution gate also auto-closes unsolicited items,
so raw close counts must not be interpreted as “bugs fixed.”

At the source snapshot:

- v0.83.0 was the latest stable release;
- the captured `main` was 56 commits ahead only about two days after the release
  commit;
- the npm/source coding-agent package required Node `>=22.19.0`;
- `@earendil-works/pi-protocol` had already appeared on `main` after the tag,
  showing how quickly main-only architecture can diverge from stable release
  material.

## Package catalog snapshot

<!-- sync:landscape-catalog -->

The official [Pi package catalog](https://pi.dev/packages) reported **5,351**
packages at capture time. Its UI filters returned:

| Filter | Count |
| --- | ---: |
| Extension | 3,059 |
| Skill | 360 |
| Theme | 109 |
| Prompt | 78 |

These numbers are not additive. One package can declare several resource types,
catalog metadata can be incomplete, and presence does not demonstrate license,
current Pi compatibility, documentation quality, maintenance, safety, or direct
use. The catalog is an excellent discovery index and an unsuitable endorsement
oracle.

## RFC snapshot

<!-- sync:landscape-rfc -->

The [Earendil Pi RFC index](https://rfc.earendil.com/keyword/pi/) listed nine
Pi-related RFCs with mixed states at capture time. An RFC records a proposal and
its state; it does not by itself prove that implementation landed in a stable
tag, was published to a registry, or retained the proposed interface. Every RFC
claim therefore needs a tag/source cross-check.

## Public issue signal

<!-- sync:landscape-issues -->

The following GitHub issue-search counts are **overlapping keyword hits**, not
mutually exclusive categories and not percentages:

| Search cluster | Hits | What manual sampling looked for |
| --- | ---: | --- |
| Provider / model | 2,272 | Catalog mismatch, unsupported capabilities, provider-specific payloads, endpoint/region behavior. |
| Authentication / login / OAuth | 490 | Credential route, expiry, scopes, subscription/API-key differences, headless behavior. |
| Extension | 1,563 | Lifecycle, event ordering, tool overrides, UI/mode behavior, compatibility. |
| Package / install / update | 2,478 | Registry/Git installs, dependency scripts, pinning, update semantics, migration. |
| Session | 1,534 | Resume, tree/fork/clone, storage, export/share, stale or wrong context. |
| Compaction | 415 | Overflow recognition, summary loss, branch behavior, retry and custom hooks. |
| Windows / WSL | 304 | Native-versus-WSL paths, terminal keys, process behavior, shell/encoding. |
| Terminal / TUI | 1,061 | Emulator/multiplexer differences, keybindings, rendering, resize, Unicode. |
| Timeout / retry / hang | 530 | Provider idle, layered retries, commands waiting for input, cancellation. |
| Sandbox / security / permission | 211 | Project Trust misconceptions, containment, extension authority, prompt injection. |

The query terms were broad OR-style searches over the full issue corpus, so a
single issue can appear in many rows. Manual sampling of recent/top results was
used to identify failure *shapes*, not to estimate incident prevalence.

### Recurring failure shapes

<!-- sync:landscape-shapes -->

| Failure shape | Why it is confusing | Practice response |
| --- | --- | --- |
| Provider behavior presented as Pi behavior | The same CLI/session can route to very different model APIs. | Record provider/model/catalog/transport; reproduce with a tiny capability ladder. |
| Trust prompt absent in automation | Non-interactive modes cannot ask, so resources may be skipped or globally approved. | Declare trust, context, resources, and tools explicitly; fail closed. |
| “Read-only” that is not an enforcement boundary | Extensions can override names or act through process APIs. | Disable/audit extensions and use OS containment for adversarial cases. |
| Session continuity mistaken for environment reproducibility | JSONL omits runtime, catalog, full package, network, and repository metadata. | Save a separate execution manifest and durable task record. |
| Compaction symptom attributed to model quality | A lossy summary or split turn changes visible context. | Inspect compaction entries and externalize invariants before compacting. |
| Retry amplification | Provider, agent, controller, and CI can all retry. | Assign one owner per failure category and bound every layer. |
| Incomplete output treated as complete | Tools use different head/tail/count truncation strategies. | Preserve truncation markers and follow continuation/full-output paths. |
| Extension startup/reload leak | Factory, session, and replacement lifecycles are conflated. | Initialize session-bound resources at the right event and clean idempotently. |
| Terminal issue reported as provider failure | Rendering/input can fail after the model response is correct. | Reproduce in print mode and vary one terminal layer. |
| Package discovery treated as trust | Gallery/search presence feels like vetting. | Inspect source, dependencies, lifecycle scripts, permissions, license, and run an isolated trial. |

## Existing directories and overlap

<!-- sync:landscape-directories -->

<!-- resource:related-awesome-pi -->

### awesome-pi

[BubblePtr/awesome-pi](https://github.com/BubblePtr/awesome-pi) is an active
bilingual curated directory of packages and ecosystem resources under CC0. It
is the closest existing “awesome Pi” list and should be treated as a
complementary discovery source, not copied.

<!-- resource:related-automated-directory -->

### awesome-pi-coding-agent

[shaftoe/awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent)
is an automated, frequently refreshed directory under MIT. Its strength is
breadth/recency; automated selection and descriptions are not the same as
human hands-on curation.

<!-- resource:related-package-index -->

### Pi Package Index

[getpipher/pi-package-index](https://github.com/getpipher/pi-package-index) is
an unofficial MIT-licensed, daily-refreshed npm package index with a searchable
[web interface](https://pi-package.rectorspace.com/) and public
[JSON API](https://pi-package.rectorspace.com/api/packages). It enriches npm
metadata with GitHub and maintenance signals. Those signals help discovery and
filtering; they are not quality, compatibility, or security review.

<!-- resource:related-archived-awesome -->

### awesome-pi-agent

[qualisero/awesome-pi-agent](https://github.com/qualisero/awesome-pi-agent) was
created earlier in the ecosystem but is archived and describes itself as
retired/outdated. It is useful for ecosystem history, not current
compatibility.

<!-- resource:related-ecosystem-wiki -->

### pi-ecosystem-wiki

[micuintus/pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki)
focuses on architecture, comparison, and ecosystem synthesis. Treat generated
or secondary claims as discovery leads until checked against primary sources.

<!-- resource:related-extension-registry-snapshot -->

### awesome-pi-agent by Traveler0014

[Traveler0014/awesome-pi-agent](https://github.com/Traveler0014/awesome-pi-agent)
uses a structured YAML registry, schema validation, generated README, and
scheduled metadata workflow. At review time the scheduled updater was failing
and the content had not advanced beyond its initial June snapshot. Metadata
also disagreed between its README and license file, so it was screened out of
navigation.

<!-- resource:related-awesome-pi-mono-snapshot -->

### awesome-pi-mono

[afoofaa/awesome-pi-mono](https://github.com/afoofaa/awesome-pi-mono) is a
manually categorized MIT list seeded in May. No later substantive update was
visible at review time, old upstream paths remained, and its initial link check
failed, so it was screened out of navigation.

### Specialized registry not promoted

[Leoguy77/pi-packages.nix](https://github.com/Leoguy77/pi-packages.nix) is an
active Nix-native generated registry with integrity hashes and an optional
binary cache. It is not a general Awesome directory. At
[`ab97786…`](https://github.com/Leoguy77/pi-packages.nix/commit/ab977868c85409142df3c7dc1b3e98281dde5617),
its README declared MIT, but the tree had no standalone license file and GitHub
detected no SPDX license. Its documented fallback/build paths can require
disabling the Nix sandbox and TLS verification. It remains a specialist
supply-chain research lead, not a root discovery recommendation.

### Official catalog

The official package catalog is much broader than any manual list. Together,
these sources already cover “what exists?” well. The
[ecosystem directory guide](./ecosystem-directories.md) links the official
resource-type filters, compares update models, and separates active navigation
from historical/context-only sources.

### Non-duplicative scope

This repository instead answers:

- What should a careful operator do?
- How can the procedure be verified and rolled back?
- Which Pi version and interface does it apply to?
- Where is the real execution/data/trust boundary?
- Which source proves the underlying fact?
- Has a human actually installed and tested the third-party artifact?

It links current directories under Related Lists, preserves the fuller
directory inventory in the ecosystem directory guide, and keeps untested
candidates in a visibly separate watchlist.

## Community capability map

<!-- sync:landscape-community -->

The second source-review pass sampled candidate repositories across:

| Capability | Examples in the watchlist | Dominant review question |
| --- | --- | --- |
| VM/tool isolation | Gondolin. | What remains on the host, and what is mounted read-write? |
| Subagent/workflow orchestration | pi-subagents, pi-crew. | Are subprocess/worktree/tool limits being mistaken for OS isolation? |
| MCP | pi-mcp-adapter. | Which servers/commands/credentials run, and are they pinned? |
| Web/browser access | pi-web-access, pi-agent-browser-native. | Which private content leaves the machine or enters a real profile? |
| Human review | Plannotator. | Does optional sharing change the data boundary? |
| Structured code analysis | pi-lens. | What downloads, executes, mutates, and remains version-compatible? |
| Memory | pi-hermes-memory. | What persists, crosses projects, enters models, and can inject future context? |
| Tracing | braintrust-pi-extension. | Which raw prompts/context/tool data is uploaded? |
| Alternate UI | pi-coding-agent for Emacs. | How is Project Trust handled when RPC has no prompt? |
| Broad operating layer | gentle-pi. | Can a large policy/native-runtime surface be pinned, understood, and rolled back? |

None was promoted to the root list because source review is not hands-on
evidence. Three additional sources were deferred: a mixed extension collection
that needs per-item review, a legacy-scoped skill collection, and an unlicensed
public-session-sharing tool.

## Taxonomy of practices

<!-- sync:landscape-taxonomy -->

The evidence converged on seven practice areas:

1. **Baseline and recovery** — versions, environment, Git state, rollback.
2. **Trust and containment** — Project Trust, context, credentials, mounts,
   network, package supply chain.
3. **Task and context design** — task brief, hierarchical instructions,
   read-only reconnaissance, context budget, primitive selection.
4. **Session operations** — coherent goals, steering/follow-up, tree/fork/clone,
   compaction, export/privacy.
5. **Model reliability** — capability scope, cross-provider loss, retry layers,
   bounded output and cancellation.
6. **Customization** — prompt/skill/extension choice, lifecycle, honest tools,
   package manifests and dependency execution.
7. **Integration and maintenance** — interface selection, non-interactive
   policy, RPC/SDK ownership, diagnosis, staged upgrades, upstream contribution.

These map directly to P01–P30 in the [practice guide](../practice-guide.md).

## Scope migration and stale instructions

<!-- sync:landscape-migration -->

The project moved from historical repository/package identities including
`badlogic/pi-mono`, `earendil-works/pi-mono`, and `@mariozechner/*` to
`earendil-works/pi` and `@earendil-works/*` in 2026. Many valuable articles,
READMEs, package examples, and search results still carry old names.

Migration review should ask:

- Is the repository URL merely historical, or is the code no longer maintained?
- Does the npm package now use the current scope?
- Are peer dependencies and import paths current?
- Do install commands resolve to a maintained artifact?
- Are screenshots/blog claims describing a pre-trust, pre-package, or
  pre-protocol version?
- Was a version number copied across an unpublished lockstep workspace?

Never silently “correct” immutable historical evidence. Label it, then link the
current canonical source separately.

## Opportunity map

<!-- sync:landscape-opportunities -->

High-value work for future human contributors:

| Opportunity | Deliverable |
| --- | --- |
| Reproducible operating profiles | Pinned commands/manifests for supervised local, sterile read-only, contained untrusted, and non-interactive automation runs. |
| Hands-on extension reports | Exact artifact, authority map, test matrix, data flow, cleanup, and retest date. |
| Platform matrices | Native Windows vs WSL, macOS/Linux terminals, containers, SSH, and supported Node/Bun distributions. |
| Provider capability probes | Tiny, sanitized tests for tools, images, reasoning, streaming, retry/overflow, and cross-provider conversion. |
| Session privacy tooling | Local pre-export inspection that does not falsely promise complete secret detection. |
| Package supply-chain records | Published artifact/source/ref mapping, lifecycle scripts, transitive/native dependencies, and rollback. |
| Upgrade diff notes | What changed between stable Pi baselines in trust, resources, sessions, tools, RPC, SDK, and model catalogs. |
| Bilingual terminology review | Human verification that commands, version qualifiers, risk, and evidence status remain equivalent. |

The repository should grow through these verified records, not by maximizing
the number of links.

## Limitations of the landscape

<!-- sync:landscape-limits -->

- All dynamic counts age immediately.
- Keyword searches overlap and include false positives/negatives.
- GitHub and catalog metadata reveal little about runtime behavior.
- A passing default-branch CI run does not prove every published artifact or
  supported platform.
- A missing CI workflow does not prove tests are absent or a project is bad; it
  changes the confidence and trial burden.
- License detection can miss nonstandard declarations; published artifacts may
  differ from repository licensing.
- The second community pass was source-only and did not exercise credentials,
  networks, installation scripts, cleanup, or real Pi sessions.
- Provider services and model catalogs can change without repository commits.
