[English](./coverage-matrix.md) | [简体中文](./coverage-matrix.zh-CN.md)

# Pi ecosystem coverage matrix

<!-- sync:coverage-purpose -->

This matrix turns ecosystem breadth into an auditable research queue. It covers
the stable Pi surface first, then maps community capability categories to the
current registry. It is **not** a package ranking, an endorsement list, or a
claim that discovery is complete.

Snapshot baseline: Pi **v0.83.0** at
[`845d6ff…`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39),
research `main` at
[`9b50b04…`](https://github.com/earendil-works/pi/tree/9b50b046d328d589a81400d2e184175d0bf19734),
and the reviewed-resource registry at **2026-07-31 15:56:32
(Asia/Singapore)**. The candidate registry and generated coverage state are at
**2026-08-01 15:28:59 (Asia/Singapore)**. Moving sources must be rechecked
before using this matrix for a current decision.

## How counts and evidence states work

<!-- sync:coverage-counting -->

The registry contains 15 community records: **12 source-reviewed**, **zero
hands-on-verified**, **zero featured**, and **three deferred**. All 15 have a
pinned `reviewedRef`; a pinned ref identifies source state but does not prove
that installation, runtime behavior, the published artifact, or cleanup was
tested.

This page uses these evidence states:

| State | Meaning | Allowed conclusion |
| --- | --- | --- |
| Stable source | Behavior is supported by the pinned v0.83.0 tag, its tests, or versioned release material. | A version-scoped Pi fact. |
| Main-only / experimental | The source exists only after the stable tag or is explicitly experimental. | A research lead, never a stable guarantee. |
| Source-reviewed | A community repository was inspected at a full commit under the repository methodology. | The observed source exposes a capability and named risks; no runtime recommendation. |
| Deferred / blocked | A collection needs item-level review, is legacy-scoped, or lacks evidence needed to continue. | Historical context or a future research lead only. |
| Candidate-stage | A discovery-only lead has a canonical identity and provisional relation; a relation-confirmed lead also has pinned primary relationship evidence, but neither has passed the full source gate. | The lead exists and may have a confirmed Pi relationship; no current-scope, compatibility, risk, runtime, or endorsement conclusion. |
| Hands-on-verified | A named human preserved the exact artifact, environment, steps, expected/actual results, cleanup, and residual risk. | A reproducible trial result within its stated scope. |
| Featured | Hands-on evidence plus maintainer judgment passes the publication gate. | A scoped recommendation, not a safety certification. |

Counts in the community table refer only to records in
[`data/resources.json`](../../data/resources.json). The much larger
[official package catalog](https://pi.dev/packages) and external directories
are discovery populations; they are not silently added to the reviewed count.

The [machine-generated coverage summary](coverage-summary.md) is the
authoritative count view across reviewed records, deferred records, discovery
candidates, categories, architectures, and Pi relationships. `check:coverage`
also verifies that the source-reviewed counts and category order in the
narrative table below still match the machine taxonomy.

## Execution and ownership boundaries

<!-- sync:coverage-boundaries -->

Each category records where enforcement or ownership actually lives:

| Boundary | What it means in this matrix | What it does not prove |
| --- | --- | --- |
| Built-in stable | Shipped in the pinned Pi tag and owned by a documented Pi package or CLI mode. | That every provider, terminal, package, or host behaves identically. |
| Official optional / example | Shipped beside Pi as an optional package, example, or pattern. | That the feature is enabled by default, production-hardened, or API-stable. |
| Extension / Pi package | In-process JavaScript/TypeScript or resources loaded through Pi's extension/package system. | OS isolation. Extensions retain the Pi process user's authority. |
| External process / service | A server, browser, CLI, model endpoint, hosted API, or controller outside the Pi process. | That an extension consent screen constrains the external component. |
| OS / virtualization boundary | Container, VM, separate user, mount, credential, and network policy outside Pi. | Protection for deliberately shared read-write mounts or host-side components outside the boundary. |

[Project Trust](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
is a resource-loading decision, not an OS sandbox. Tool allowlists, worktrees,
subprocesses, and confirmation UIs must not be promoted to the OS-boundary row.

## Official surface coverage

<!-- sync:coverage-official -->

| Surface | Definition and primary evidence | Boundary | Current evidence | Explicit gap | Retrieval and advancement action |
| --- | --- | --- | --- | --- | --- |
| Package architecture | The AI API, agent loop, coding harness, TUI, and supporting packages in the [v0.83.0 tree](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages). | Built-in stable plus optional/experimental packages. | Seven package manifests are present: `ai`, `agent`, `coding-agent`, `tui`, `evals`, `server`, and `storage/sqlite-node`; the first four are the primary public narrative. | No machine-readable package inventory records publish status, API stability, consumers, or changes between tags. | Diff package manifests and READMEs for every baseline; record stable, experimental, private/unpublished, added, removed, and renamed states. |
| Provider and model API | Streaming, message/tool representations, authentication routes, model metadata, transformation, and custom-provider hooks from [`pi-ai`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai), [providers](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/providers.md), and [models](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/models.md). | Built-in provider adapters; custom providers are extensions; model endpoints are external services. | Stable source is mapped in the source map and evidence ledger. | No preserved capability matrix across provider, model, authentication route, image/tool/reasoning support, region, or gateway. | Preserve sanitized capability probes and service date separately from Pi version; expire results when the model catalog or service changes. |
| Agent loop and tools | State, events, transport, tool execution, cancellation, and sibling-call concurrency in [`pi-agent-core`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent) and the coding-agent tools. | Built-in stable; extensions can add or override tools. | Stable source supports practices on bounded output, cancellation, and honest tools. | No compact event/tool invariants table or reproducible concurrency/failure probe. | Extract event ordering and ownership from tag tests; add small probes for cancellation, parallel calls, error propagation, and truncation. |
| Sessions, context, and compaction | JSONL persistence, tree/fork/clone, message queues, context files, compaction, export, and sharing. | Built-in stable; custom compaction/resource loading may be extended; storage and sharing leave separate data boundaries. | Version-pinned session, format, compaction, usage, and settings sources support P07 and P12–P16. | No artifact-level privacy inventory, migration fixture set, or cross-version session compatibility test. | Preserve sanitized session fixtures; test open/resume/fork/compact/export across adjacent baselines and record every persisted/uploaded field. |
| Customization and distribution | Context files, prompt templates, skills, extensions, themes, and Pi packages. | Context/prompts/skills/themes are resources; extensions execute in process; packages can bundle all of them and run dependency installation. | Five dedicated stable guides plus package/security guidance; the pinned extension-example directory has 79 top-level entries, including files and subdirectories. | Examples are not classified by lifecycle, authority, stability, tests, data flow, or production readiness; no item-level official skill/prompt/theme inventory is preserved. | Generate an example manifest from the tag tree, label each example-only pattern, and keep catalog discovery separate from source/hands-on review. |
| Terminal, TUI, and platforms | Differential rendering, input, components, keybindings, terminal setup, tmux, Windows/WSL, and Termux. | Built-in TUI plus host terminal/OS behavior. | Stable `tui`, keybinding, terminal, tmux, Windows, and Termux sources are mapped. | No hands-on matrix for native Windows versus WSL, shells, multiplexers, SSH, Unicode/width, clipboard, and Node/Bun distributions. | Run a fixed smoke script per supported environment; record terminal, locale, shell, distribution, input path, rendering result, and cleanup. |
| Interactive, print, JSON, RPC, and SDK | Human CLI, one-shot output, one-way JSON events, bidirectional stdio RPC, and in-process TypeScript ownership. | Built-in stable; controller/host process owns draining, cancellation, policy, persistence, and cleanup. | Stable interface docs plus 13 numbered SDK examples and a README. | No comparative contract matrix, malformed-frame tests, backpressure profile, or long-lived controller record. | Version protocol fixtures; test EOF, stderr draining, cancellation, restart, trust prompts, queueing, and subscription cleanup. |
| Security and containment | Local-user authority, Project Trust, context/resource loading, package execution, and containment guidance. | Loading gates are built in; permission hooks are extensions; real isolation is external OS/virtualization policy. | Stable security/containerization docs and official guard/sandbox examples; Gondolin is one source-reviewed community record. | No hands-on proof for mount, credential, network, host-process, denial-of-service, or cleanup claims. | Build disposable profiles for supervised, sterile read-only, contained untrusted, and non-interactive work; test negative access as well as successful operation. |
| Local inference | Local model operation through the [llama.cpp guide](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/llama-cpp.md) and custom endpoints. | Pi/provider configuration is built in; model runtime and hardware are external. | One stable official guide; zero source-reviewed community records in this category. | No hardware/runtime matrix, tool-call compatibility probe, context-limit verification, or offline-network test. | Sample exact runtime/model/template pairs; record hardware, quantization, API mode, tool/image/reasoning behavior, and outbound connections. |
| Evals, server, and storage | The tag contains [`evals`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/evals), an experimental [`server`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/server), and [`storage/sqlite-node`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/storage/sqlite-node). | Official optional/experimental; not all are the coding-agent CLI's default persistence path. | Source map covers server/storage partially; evals is not yet a first-class coverage record. | Purpose, publish status, stability, schema ownership, and intended consumers are easy to misread. | Add per-package stability cards and verify npm publication separately from source presence. |
| Main-only protocol | [`@earendil-works/pi-protocol`](https://github.com/earendil-works/pi/tree/9b50b046d328d589a81400d2e184175d0bf19734/packages/protocol) appears after v0.83.0. | Main-only / experimental. | Correctly labeled in the source map and E27. | No automated stable-versus-main package/API diff or promotion trigger. | Recheck every release; move claims to stable only after a tag contains the implementation and its compatibility status is documented. |
| Repository and npm identity migration | Historical `badlogic/pi-mono`, `earendil-works/pi-mono`, and `@mariozechner/*` identities moved to `earendil-works/pi` and `@earendil-works/*`. | Distribution and provenance boundary. | Migration commit and current names are documented. | No per-package old/new name, last-old/first-new version, deprecation, redirect, import, and artifact mapping. | Preserve a migration ledger from GitHub refs, changelog, and npm metadata; never rewrite immutable historical evidence. |
| Official-adjacent repositories | Same-organization projects can demonstrate review, tutorial, chat, or containment patterns without being part of the Pi stable core. | Separate repositories and artifacts; affiliation is not core inclusion. | Gondolin is reviewed. [`pi-review`](https://github.com/earendil-works/pi-review), [`pi-review-loop`](https://github.com/earendil-works/pi-review-loop), [`pi-tutorial`](https://github.com/earendil-works/pi-tutorial), and [`pi-chat`](https://github.com/earendil-works/pi-chat) are four discovery-only leads with zero registry records. | Exact artifact, license, Pi compatibility, tests, authority, and maintenance have not been reviewed here. | Resolve each default branch to a commit, apply the normal community source gate, and retain `official-adjacent` rather than implying stable-core support. |

## Community capability coverage

<!-- sync:coverage-community -->

The counts below are mutually exclusive placements for the 12 source-reviewed
watchlist records. Multi-capability projects have one primary placement so the
total remains auditable; their secondary capabilities still belong in the
individual review. Deferred collections are shown separately and are not
counted as reviewed items. Use the
[generated summary](coverage-summary.md) for candidate and architecture strata;
candidate presence never increases a source-reviewed count.

| Capability | Definition | Built-in / extension / external boundary | Current registry evidence | Explicit gap | Retrieval and advancement action |
| --- | --- | --- | --- | --- | --- |
| VM/tool isolation | Execute selected work behind a machine or process boundary. | No built-in sandbox; extension routes tools; OS/VM enforces containment. | 1 source-reviewed: Gondolin. | No hands-on mount/network/credential/reset matrix. | Search VM/container/tool-router implementations; require negative access tests and host/guest authority map. |
| Permission and guardrails | Allow, deny, ask, audit, or protect operations before execution. | Pi provides hooks and Project Trust; extensions implement policy UI; OS policy is external enforcement. | 0 source-reviewed. | A high-demand safety category has no reviewed implementation comparison. | Search package catalog and repositories for permission, guardrail, protected-path, and command-policy terms; compare bypass paths before trial. |
| Subagents and workflow orchestration | Delegate, chain, parallelize, background, and coordinate child tasks. | Not a built-in workflow; extensions spawn agents/processes; worktrees are not OS isolation. | 2 source-reviewed: pi-subagents and pi-crew. | No hands-on cost/concurrency/cancellation/file-conflict comparison. | Preserve child model/tool/environment manifests; test partial failure, cancellation, merge, and cleanup. |
| MCP integration | Connect Pi to Model Context Protocol servers. | No built-in MCP; adapter is an extension; servers/transports/credentials are external. | 1 source-reviewed: pi-mcp-adapter. | No pinned single-server hands-on trace or hostile-server test. | Review one exact server and adapter artifact at a time; enumerate tools, commands, secrets, consent, timeout, and removal. |
| Web search and fetch | Query search services and retrieve remote pages/media. | Extensions expose tools; network providers and content processors are external. | 1 source-reviewed: pi-web-access. | Provider/fallback routing, redirects, SSRF, size limits, cookies, and retention are untested. | Capture outbound hosts and payloads with test data; force offline and provider-failure paths. |
| Browser and authenticated-profile automation | Drive browsers, Electron apps, profiles, downloads, screenshots, or clipboard surfaces. | Extension wraps an external browser/CLI; real profiles contain independent credentials and private data. | 1 source-reviewed: pi-agent-browser-native. | No disposable-profile hands-on run or data-residue inventory. | Use a dedicated test profile/account; inspect cookies, downloads, screenshots, clipboard, process cleanup, and profile deletion. |
| Human review and planning | Present plans, diffs, or artifacts for approve/reject/annotate decisions. | Extension supplies UI; optional browser/share service may create an external data boundary. | 1 source-reviewed: Plannotator. | Approval semantics, large/malformed input, sharing-off behavior, and cleanup are untested. | Trial local-only first; verify reject/cancel paths and prohibit sharing until endpoint/retention review is complete. |
| Code intelligence | Add LSP, lint, formatter, AST, grammar, scan, and structured navigation tools. | Extension orchestrates external servers/binaries and may mutate files. | 1 source-reviewed: pi-lens. | No language/platform matrix or download/install integrity verification. | Pin one language toolchain; record downloads, server lifecycle, mutation preview, conflicts, and removal. |
| Persistent memory | Retain and retrieve facts, sessions, or procedures across turns/projects. | Extension controls storage/injection; databases and consolidation models may be external. | 1 source-reviewed: pi-hermes-memory. | Project separation, deletion, poisoning, secret leakage, native ABI, and recovery are untested. | Use synthetic secrets and malicious stored instructions; verify scope, retention, export/delete, backup, and model egress. |
| Tracing and observability | Record turns, model calls, tools, costs, compaction, or diagnostics. | Extension instruments Pi; hosted telemetry is an external processor. | 1 source-reviewed: braintrust-pi-extension. | No redaction, sampling, backpressure, outage, retention, or deletion trial. | Start disabled; classify every field and test offline/failure isolation before any real project data. |
| Alternate UI and editor integration | Control Pi from an editor, GUI, or alternate terminal surface. | RPC/SDK are built in; frontend owns trust prompts, process lifecycle, buffers, and policy. | 1 source-reviewed: pi-coding-agent for Emacs. | No cross-frontend comparison or non-approving unknown-project trial. | Test explicit approve/deny, context disablement, restart, cancellation, auth-store access, and buffer/session cleanup. |
| Broad operating layer | Bundle policy, workflows, native runtime, task systems, and multiple extensions. | Package/extension code plus possible native/external components. | 1 source-reviewed: gentle-pi. | Surface is too broad for one undifferentiated recommendation; native/postinstall paths remain untested. | Decompose by artifact and capability; require threat model, install transcript, rollback, and partial-adoption path. |
| Context optimization | Prune, cache, summarize, retrieve, or compress context beyond built-in compaction. | Built-in compaction exists; extensions modify visible context; external stores/models may process it. | 0 source-reviewed. | No comparison of token savings against lost evidence, branch semantics, or privacy. | Search context/prune/cache/summary/retrieval terms; require before/after fixtures and failure-recovery checks. |
| Task, goal, and loop engineering | Persist goals, todos, staged workflows, supervisors, or iterative completion loops. | Not a mandatory built-in workflow; extensions/resources implement control; child models/services may be external. | 0 source-reviewed. | No state-machine, termination, cost-bound, or stale-goal evidence. | Search goal/todo/workflow/loop/supervisor terms; test abort, restart, max-iteration, partial completion, and cleanup. |
| UI, statusline, notification, and accessibility | Change status, progress, overlays, alerts, editor behavior, or presentation. | TUI APIs are built in; extensions render UI; OS notification services are external. | 0 source-reviewed. | No accessibility, terminal compatibility, failure-isolation, or token/cost accuracy review. | Sample by UI primitive rather than aesthetics; test narrow terminals, resize, Unicode, screen readers where applicable, and disable/removal. |
| Themes and theme tooling | Provide color schemas, switching, terminal integration, or bundled visual resources. | Theme loading is built in; pure JSON is lower authority, but a package may also contain executable extensions/scripts. | 0 source-reviewed. | Catalog has a theme surface but the registry has no item-level theme evidence. | Sample pure-theme, theme-pack, and executable theme-tool cases; verify manifest contents, contrast, terminal colors, and clean removal. |
| Prompt-template packs | Provide explicit reusable slash-command text expansions. | Prompt expansion is built in; package scripts or bundled extensions add separate authority. | 0 source-reviewed. | No item-level provenance, injection-risk, argument, portability, or maintenance review. | Sample prompts by workflow; inspect all bundled resources and verify expansion with inert test inputs. |
| Individual skills | Provide on-demand instructions with optional scripts, references, and assets. | Skill loading is built in; instructed tools/scripts execute through Pi or external runtimes. | 0 source-reviewed items; 1 legacy-scoped collection deferred (`pi-skills`). | Collection-level review hides per-skill authority, dependencies, portability, and stale commands. | Split collections into atomic skill records; review every referenced script/asset and migrate old scopes before hands-on use. |
| Custom providers and model gateways | Register new provider authentication, catalogs, streaming, error, usage, and overflow behavior. | Extension runs in process; model gateway/API is external. | 0 source-reviewed. | No community implementation demonstrates correct conversion, usage, retry, and credential boundaries. | Search provider/gateway/model-catalog packages; run sanitized conformance cases for tools, images, reasoning, errors, overflow, and cancellation. |
| Local-model runtimes | Operate local or LAN model servers and their templates/tool-call parsers. | Pi connects through provider configuration; runtime/hardware/network are external. | 0 source-reviewed; one stable official llama.cpp guide. | No community runtime artifact or compatibility matrix. | Sample exact model/runtime/template combinations and verify true offline behavior. |
| Remote control, messaging, and collaboration | Connect sessions or agents through chat, mobile, peer, broker, or remote-control channels. | Controller/extension bridges Pi; identity, transport, server, and retention are external. | 0 source-reviewed. | Authentication, command authorization, multi-user isolation, replay, and data retention are uncovered. | Search Telegram/Slack/chat/peer/broker/remote terms; test least-privilege accounts, replay resistance, disconnect, and audit trail. |
| Package suites and alternate distributions | Bundle many extensions, skills, themes, binaries, or opinionated defaults. | Package reconciliation and in-process code combine with postinstall/native/external components. | 0 source-reviewed suites; 1 mixed extension collection deferred (`pi-extensions`). | Aggregate install authority, conflicting hooks, updates, provenance, and partial removal are unknown. | Inventory every bundled artifact and dependency; review atomic pieces before any suite-level trial. |
| Git and review automation | Checkpoint, commit, branch, review, or merge repository changes. | Official examples show patterns; extensions/CLIs mutate Git and files; remote forges are external. | 0 source-reviewed community records. | No comparison of dirty-tree behavior, rollback, merge conflicts, credentials, or remote writes. | Search checkpoint/review/commit/merge terms; use disposable repositories and test failure before remote-write capability. |
| Evals and benchmarking | Measure model/agent behavior, regressions, cost, latency, or task success. | Official eval source exists; harnesses, datasets, judges, and providers may be external. | 0 source-reviewed community records. | No methodology, dataset-license, leakage, variance, or reproducibility standard. | Start from the official eval package; require fixed fixtures, repeated runs, cost accounting, and limitations before publishing results. |
| Session export, sharing, and publishing | Export or upload session records and derived artifacts. | Export is built in; sharing clients and hosting destinations are external data processors. | 0 source-reviewed; `pi-share-hf` is deferred/blocked. | Secret scanning cannot prove privacy; license, consent, deletion, images, names, and business facts remain unresolved. | Use synthetic sessions only; enumerate fields and destination policy, then test local inspection, explicit consent, deletion, and link revocation. |

## Prioritized gap queue

<!-- sync:coverage-gaps -->

The next pass should favor category coverage and evidence quality over adding a
large number of links:

1. **P0 — enforcement and data boundaries:** permission/guardrails, context
   optimization, remote/messaging control, and session sharing.
2. **P0 — item-level decomposition:** split deferred skill and extension
   collections into atomic artifacts before judging the collection.
3. **P1 — operational control:** task/goal/loop systems, Git/review automation,
   and custom providers.
4. **P1 — platform breadth:** local inference, alternate UI, browser profiles,
   and terminal/TUI smoke matrices.
5. **P2 — lower-authority resources:** themes, prompt packs, status/UI, and
   package presentation, while still checking for bundled executable code.
6. **P2 — measurement:** official/community evals with reproducible fixtures,
   dataset licensing, repeated runs, and cost/error reporting.

No row becomes a recommendation merely because it fills a gap. A category may
remain empty when candidates cannot pass source, license, artifact, safety, or
utility gates.

## Reproducible retrieval protocol

<!-- sync:coverage-search -->

For every category pass:

1. Record the source, exact query/filter, sort order, capture time, page range,
   and returned package/repository identifiers.
2. Search the [official catalog](https://pi.dev/packages), npm metadata,
   [awesome-pi](https://github.com/BubblePtr/awesome-pi),
   [awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent),
   and the [Pi Package Index](https://github.com/getpipher/pi-package-index).
   These are discovery sources only.
3. Resolve every candidate to its canonical repository, full default-branch
   commit, published artifact/version, license evidence, and Pi dependency or
   install target.
4. Preserve all sampled identifiers and a reason-coded disposition:
   duplicate, out of scope, inaccessible, no license, stale scope, collection,
   insufficient evidence, source-review queue, or rejected.
5. Do not describe the search as complete unless pagination, registry scope,
   aliases, forks, renamed packages, and historical identities were handled.
6. Keep discovery counts separate from source-reviewed, hands-on, and featured
   counts in both prose and machine data.

Suggested query families combine `pi`, `pi-coding-agent`, current and historical
package scopes, and category terms such as `permission`, `guardrail`, `context`,
`goal`, `workflow`, `theme`, `provider`, `llama`, `telegram`, `review`, or
`eval`. Broad terms require manual identity validation because “Pi” is highly
ambiguous outside repository- or package-scoped searches.

## Source-review and promotion gate

<!-- sync:coverage-promotion -->

A candidate advances one state at a time:

1. **Discovery → source review:** establish canonical identity, purpose,
   license, immutable source ref, resource types, Pi compatibility claim,
   dependencies, install/lifecycle scripts, executable authority, data flow,
   tests, CI, removal, and obvious conflicts.
2. **Source review → hands-on:** bind the repository ref to the exact npm/Git/
   local artifact; use a disposable environment, test accounts/data, pinned Pi
   and runtime, explicit expected/actual steps, negative cases, cleanup, and
   residual-risk record.
3. **Hands-on → featured:** require a named human recommendation based on direct
   use, an independent bilingual fact/risk review, disclosed relationships,
   ongoing usefulness, and a retest/expiration trigger.
4. **Any state → stale/rejected/deferred:** record the reason without treating
   the state as public shaming. A passing CI badge, catalog listing, affiliation,
   popularity, or immutable commit never skips a gate.

Each hands-on matrix must vary the dimensions that matter to its category:
Pi/runtime version, OS/platform, provider/model, terminal/controller, network,
credentials, concurrency, failure injection, data retention, and rollback.

## Maintenance rules

<!-- sync:coverage-maintenance -->

- Rebuild official package/doc/example inventories at every Pi minor baseline.
- Diff the old and new matrices; do not silently overwrite historical scope.
- Re-resolve moving community branches before review, but update `reviewedRef`
  only after inspecting the diff.
- Expire hands-on results when Pi, the reviewed artifact, a native dependency,
  a provider service, or a critical data policy leaves the tested window.
- Keep `communityResources`, `sourceReviewed`, `handsOnVerified`, `deferred`,
  and `pinnedRefs` as separate snapshot fields.
- Run Markdown, bilingual-marker, registry, research-snapshot, and local-link
  checks with every paired update; human review is still required for factual
  and translation equivalence.

## Limitations

<!-- sync:coverage-limitations -->

- A category is a research lens, not a mutually exclusive package identity;
  complex packages may span several rows.
- The primary placement used for counts prevents double counting but does not
  describe the whole authority surface of a project.
- Source review cannot detect all runtime behavior, compromised dependencies,
  unpublished artifact differences, or external-service changes.
- Empty coverage does not mean no implementation exists; it means no current
  registry item has crossed the stated evidence gate.
- Full catalog counts change quickly and resource-type filters overlap. They
  measure discovery surface, not quality or review progress.
