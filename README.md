# Awesome Pi Agent Practices [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[English](README.md) | [简体中文](README.zh-CN.md)

Reproducible operating, customization, security, and integration practices for
the Pi coding agent.

> **AI-assisted research preview.** Source review does not mean hands-on
> verification, safety certification, or endorsement. Third-party candidates
> stay outside the featured list until named human maintainers test them and
> rewrite the recommendation from direct experience.

<!-- sync:root-contents -->

## Contents

- [Start Here](#start-here)
- [Operate Pi as a System](#operate-pi-as-a-system)
- [Pi Ecosystem at a Glance](#pi-ecosystem-at-a-glance)
- [Practice Areas](#practice-areas)
- [Official Building Blocks](#official-building-blocks)
- [Evidence and Research](#evidence-and-research)
- [Community Review Queue](#community-review-queue)
  - [Status snapshot](#status-snapshot)
  - [Source-reviewed community projects — all 12](#source-reviewed-community-projects--all-12)
  - [Deferred community records — all 3](#deferred-community-records--all-3)
  - [Preliminary discovery candidates — all 13](#preliminary-discovery-candidates--all-13)
  - [Capability coverage and gaps — all 25](#capability-coverage-and-gaps--all-25)
  - [Architecture strata — all 11](#architecture-strata--all-11)
  - [Pi relationship types — all 13](#pi-relationship-types--all-13)
  - [Catalogs, directories, and historical context](#catalogs-directories-and-historical-context)
  - [Discovery limits and what may still be missing](#discovery-limits-and-what-may-still-be-missing)
  - [Promotion gate](#promotion-gate)

<!-- sync:root-start -->

## Start Here

Choose a version track before copying any command:

| Track                 | Use it when                                                         | Rule                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reproducible baseline | You are reproducing this repository's claims or comparing behavior. | Use Pi **v0.83.0** and the pinned sources in the [official source map](docs/research/source-map.md#canonical-entry-points).                                              |
| Current release       | You are starting ordinary work on the newest Pi you installed.      | Check the [current quickstart](https://pi.dev/docs/latest/quickstart), record the exact version, and treat differences from v0.83.0 as version-sensitive until verified. |

### Five-minute read-only baseline

This baseline verifies the executable, provider authentication, model selection,
and a resource-minimized run. It is deliberately **not** an installation guide
or a sandbox.

1. In a repository containing no sensitive data, record the starting state:

   ```bash
   command -v pi
   pi --version
   node --version
   git status --short
   ```

2. List models with the same optional-resource controls used by the trial:

   ```bash
   pi --offline --no-approve --no-context-files --no-extensions --no-skills \
     --no-prompt-templates --no-themes --list-models
   ```

   Select a real entry, then replace `PROVIDER` and `MODEL` below. Use a test
   account or the narrowest credential that can make one model request. This
   still uses the current global Pi profile; use the troubleshooting guide's
   [sterile baseline](docs/troubleshooting.md#sterile-baseline) when the profile
   itself must be excluded.

3. Run one ephemeral, read-only inspection with project context and optional
   resources disabled:

   ```bash
   pi --offline --no-approve --no-context-files --no-extensions --no-skills \
     --no-prompt-templates --no-themes --no-session \
     --tools read,grep,find,ls \
     --provider PROVIDER --model MODEL -p \
     "Inspect only. Name the repository root and list the checks you would run. Do not modify files."
   ```

   This is read-only at the registered-tool level, not at the operating-system
   level. `read`, `grep`, `find`, and `ls` can access any path readable by the
   Pi process, and returned content may be sent to the selected provider. Use
   an external boundary when that reach is unacceptable. `--offline` suppresses
   Pi's startup update/catalog/telemetry network operations; it does not block
   the selected provider request and is not a network firewall.

4. Treat the baseline as passed only when the command exits successfully, the
   response identifies the intended repository, `git status --short` is
   unchanged, and no project resource was required. Authentication, network,
   or model errors go to [provider troubleshooting](docs/troubleshooting.md#provider-model-auth);
   repository-only failures go through the [isolation ladder](docs/troubleshooting.md#isolation-ladder).

5. Before allowing writes, fill the [task brief](templates/task-brief.md),
   classify risk in the [operating playbook](docs/operating-playbook.md), and
   create a recoverable Git baseline. An unchanged `git status` proves only the
   repository state; a tool allowlist limits registered tools but does not
   contain the host process.

### Choose the path that matches the job

| Job                                       | Start with                                                                                         | Required artifact before completion                                                |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| First supervised repository task          | [Operating playbook](docs/operating-playbook.md#how-to-use-this-playbook)                          | Task brief, Git baseline, validation and handoff summary.                          |
| Read-only review or triage                | [Reconnaissance gate](docs/operating-playbook.md#stage-4--reconnoiter-and-plan)                    | Findings tied to files and a statement that no write was authorized.               |
| Long or parallel change                   | [Playbook: checkpoints and parallel work](docs/operating-playbook.md#checkpoint-and-parallel-work) | Owned paths/worktrees, checkpoint records, merge order, final integrated checks.   |
| Unknown repository or third-party package | [Extension review](docs/extension-review.md#gate-0--identify-the-exact-artifact)                   | Source map, authority/data-flow review, isolated trial and cleanup.                |
| CI or unattended run                      | [P25–P27](docs/practice-guide.md#p25--select-the-interface-from-the-ownership-boundary)            | Explicit trust/tool/session policy, finite timeout/retry, machine-readable result. |
| JSON, RPC, or SDK integration             | [Architecture: integration modes](docs/architecture.md#integration-modes)                          | Lifecycle tests for startup, stream, cancellation, failure and shutdown.           |
| Failure investigation                     | [Symptom router](docs/troubleshooting.md#symptom-router)                                           | Minimal reproducer, one-variable comparison and sanitized evidence.                |
| Upgrade                                   | [P29](docs/practice-guide.md#p29--upgrade-through-a-pinned-staged-reversible-path)                 | Before/after matrix and a tested rollback.                                         |
| Evaluate a workflow or model change       | [Evaluation record](templates/evaluation-record.md)                                                | Fixed cases, gates, metrics, costs and reviewer decision.                          |

For concrete commands, expected outcomes, failure branches, verification, and
cleanup across twelve common jobs, use the [scenario cookbook](docs/scenario-cookbook.md).

### Eight controls for every real task

The shortest safe path through the thirty practices is:

| Step | Practice                                                                                                                               | Observable result                                                         |
| ---: | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
|    1 | [Pin the execution envelope](docs/practice-guide.md#p01--pin-and-record-the-execution-envelope).                                       | Pi/runtime/model/resource versions can be reconstructed.                  |
|    2 | [Create a recoverable Git baseline](docs/practice-guide.md#p02--start-from-a-recoverable-version-control-state).                       | Pre-existing and agent changes are distinguishable.                       |
|    3 | [Choose the real containment boundary](docs/practice-guide.md#p03--put-untrusted-or-unattended-work-behind-an-os-boundary).            | Untrusted work cannot reach unrelated files, credentials, or network.     |
|    4 | [Separate Project Trust from context and sandboxing](docs/practice-guide.md#p04--treat-project-trust-as-a-loading-gate-not-a-sandbox). | Resource loading and OS authority are controlled independently.           |
|    5 | [Start with a testable task brief](docs/practice-guide.md#p08--begin-with-a-testable-task-brief).                                      | Goal, scope, constraints, checks, and handoff are explicit.               |
|    6 | [Reconnoiter before writing](docs/practice-guide.md#p09--reconnoiter-read-only-then-expand-capabilities).                              | The first pass maps the code without changing it.                         |
|    7 | [Choose the least powerful customization primitive](docs/practice-guide.md#p11--choose-the-least-powerful-customization-primitive).    | Prompt, skill, extension, package, JSON, RPC, or SDK has a stated reason. |
|    8 | [Use the diagnosis ladder](docs/practice-guide.md#p28--diagnose-with-an-isolation-ladder).                                             | One controlled change toggles a sanitized minimal reproducer.             |

Read the complete [thirty-practice guide](docs/practice-guide.md), then use the
[troubleshooting playbook](docs/troubleshooting.md) when a check fails.

<!-- sync:root-operating -->

## Operate Pi as a System

A dependable run controls five independent planes. Passing one plane does not
imply that another is safe or correct.

| Control plane            | Question                                                                                                                | Minimum evidence                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Intent and scope         | What observable outcome is authorized, and what is excluded?                                                            | Task brief with acceptance and stop conditions.                 |
| Context and knowledge    | Which repository instructions, files, session history, and model-visible outputs are relevant?                          | Loaded-resource inventory and bounded context.                  |
| Capability and authority | Which tools/code can act, and which files, processes, network targets, credentials, or external systems can they reach? | Risk class, containment decision and explicit capability set.   |
| Execution and state      | How are checkpoints, branches/worktrees, sessions, retries, cancellation and cleanup owned?                             | Run manifest, recovery point and lifecycle record.              |
| Evidence and quality     | How will correctness, regression, security, efficiency and reproducibility be judged?                                   | Named checks, results, final diff, residual risks and rollback. |

The [operating playbook](docs/operating-playbook.md) turns these planes into an
eight-stage lifecycle: intake, baseline, boundary selection, reconnaissance,
plan, controlled execution, layered validation, and handoff/cleanup. The
[worked example](docs/worked-example.md) shows the artifacts and failure
branches filled in rather than leaving them as blank templates.

Use these risk classes as routing, not as a claim that Pi enforces policy:

| Class                                    | Typical task                                                                                          | Required control                                                                                                                |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| R0 — observe                             | Public or synthetic data; read-only analysis; no external mutation.                                   | Explicit read-only tools, no unnecessary session/resources, verify unchanged state.                                             |
| R1 — reversible local change             | Code/docs edits in a trusted repository.                                                              | Known Git baseline, scoped writes, project checks, diff review and rollback.                                                    |
| R2 — privileged or external effect       | Package install, credential, network write, issue/PR/message, shared environment.                     | Scoped test identity, isolated trial, human review before the effect, audit and cleanup.                                        |
| R3 — destructive or production-sensitive | Deletion, production mutation, security response, regulated/private data, unattended privileged work. | Purpose-built containment and policy, explicit owner approval, dry run/canary, independent verification and rehearsed recovery. |

If a task moves to a higher class, stop at a checkpoint and obtain the new
boundary and authority before continuing. Project Trust, prompt wording,
worktrees and tool-name allowlists do not replace OS or service-side controls.

<!-- sync:root-ecosystem -->

## Pi Ecosystem at a Glance

The Pi ecosystem is more than the `pi` terminal command. At this repository's
stable **v0.83.0** baseline, four primary packages cover the multi-provider AI
API, agent runtime, coding-agent CLI, and TUI. Prompt templates, skills,
extensions, themes, and Pi packages then provide a customization path from
reusable text to in-process code, while JSON, RPC, and the SDK expose distinct
programmatic integration levels.

### Four primary packages

| Package                                                                                                                                                 | Concrete responsibility                                                                                       | Use it when                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`@earendil-works/pi-ai`](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/README.md)                     | Normalizes provider streaming, messages, tool calls, usage, and cross-provider transformations.               | You need model/provider primitives without the coding-agent UX.                        |
| [`@earendil-works/pi-agent-core`](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/README.md)          | Provides the agent loop, state, events, tool execution, and transport primitives.                             | You are building an agent runtime rather than using the ready-made CLI.                |
| [`@earendil-works/pi-coding-agent`](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md) | Provides the `pi` CLI, coding tools, sessions, resource loading, and TUI, print, JSON, RPC, and SDK surfaces. | You want the interactive agent, headless automation, or application embedding surface. |
| [`@earendil-works/pi-tui`](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/tui/README.md)                   | Supplies terminal components, differential rendering, input, layout, and width handling.                      | You are building a terminal interface or custom Pi UI.                                 |

[Pi's design principles](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#design-principles)
keep the mandatory core small. MCP, subagents, permission popups, plan mode,
to-dos, and background Bash are not built-in workflows in v0.83.0; they can be
implemented through extensions or packages, or composed with external tools
such as containers and tmux.

### Customization and distribution

| Primitive                                                                                                                                            | What it concretely does                                                                                                             | Boundary to remember                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [Context file](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#context-files) | Hierarchically loads `AGENTS.md` or `CLAUDE.md` instructions.                                                                       | Declining Project Trust does not disable discovery; use `-nc`. Context is not an OS permission boundary. |
| [Prompt template](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md) | Expands reusable Markdown through an explicit slash command such as `/review`.                                                      | It is text expansion, not an automatic runtime hook or tool policy.                                      |
| [Skill](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md)                     | Loads an on-demand workflow with optional scripts, references, and assets.                                                          | A skill can direct tool or executable use and still requires source review.                              |
| [Extension](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)             | Runs TypeScript/JavaScript in-process and can add events, tools, commands, UI, providers, policy, and tool routing.                 | It executes with the Pi process user's authority; a tool allowlist is not a sandbox.                     |
| [Theme](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/themes.md)                     | Configures terminal presentation through JSON.                                                                                      | A package containing a theme may also contain executable extensions or dependencies.                     |
| [Pi package](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)              | Bundles extensions, skills, prompts, and themes; sources may be npm, Git, or local paths, while the CLI manages configured entries. | Distribution and catalog presence do not prove identity, compatibility, quality, or safety.              |

### Integration paths

| Interface                                                                                                                                             | Data/control shape                                                                           | Ownership boundary                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Interactive and print](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#modes) | Human-facing TUI or one-shot final output.                                                   | Print mode is not automatically sessionless; use `--no-session` when required.            |
| [JSON mode](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/json.md)                    | One-way JSON Lines event stream for logs, pipelines, and custom consumers.                   | It is not a bidirectional controller and consumers must handle streamed events.           |
| [CLI RPC](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md)                       | Bidirectional requests, responses, and asynchronous events over LF-delimited JSONL on stdio. | Pin the Pi version and separately drain stderr; RPC is not JSON mode.                     |
| [TypeScript SDK](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sdk.md)                | In-process construction and ownership of sessions, resources, tools, models, and events.     | The host owns policy, credentials, persistence, cancellation, subscriptions, and cleanup. |

<!-- sync:root-ecosystem-evidence -->

### How to read the ecosystem map

The tables below are a dated, checked-in research map, not a popularity ranking
or a recommendation list. “In the ecosystem” means that immutable primary
evidence establishes a relevant technical or historical relationship to Pi; it
does not mean the project is current, compatible, safe, maintained, or endorsed.

| Evidence state                   | Current count | What has actually been established                                                                                               | Adoption consequence                                                                 |
| -------------------------------- | ------------: | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Official building block          |             6 | Upstream repository, current documentation, releases, examples, package catalog, or RFC index.                                   | Still pin versions and distinguish a proposal, `main`, and a stable release.         |
| `source-reviewed` community      |            12 | A bounded review of a pinned ref covered purpose, code, license, dependencies, authority/data flow, tests, CI, and obvious risk. | Useful trial leads only; no maintainer in this repository has installed or run them. |
| Deferred community record        |             3 | The source was inspected but is mixed, legacy-scoped, unlicensed, privacy-blocked, or needs item-by-item decomposition.          | Do not treat the repository as an atomic capability or current adoption path.        |
| `preliminary-evidence-collected` |            13 | Pinned evidence establishes identity and a provisional Pi relationship; the complete source-review gate has not started.         | `awaiting-source-review`, `not-evaluated`, and untrusted.                            |
| `hands-on-verified` / `featured` |             0 | A named human has not yet supplied a reproducible trial and a separate editorial promotion decision for any third party.         | There are intentionally no third-party recommendations yet.                          |

The resource registry was captured at **2026-07-31T15:56:32+08:00**; the
discovery-candidate registry was captured at
**2026-08-01T15:28:59+08:00**. The complete itemized map appears later in
Community Review Queue. Older material may still use
`badlogic/pi-mono`, `earendil-works/pi-mono`, or `@mariozechner/*`; resolve the
current repository, publisher/scope, peer dependencies, and install target
before following it.

<!-- sync:root-areas -->

## Practice Areas

| Area                      | Practices                                                              | Main decision                                                         |
| ------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Baseline and recovery     | [P01–P02](docs/practice-guide.md#baseline-and-recovery).               | Can another person reproduce and safely roll back the run?            |
| Trust and containment     | [P03–P06](docs/practice-guide.md#trust-and-containment).               | What is loaded, what can execute, and what can it reach?              |
| Task and context design   | [P07–P11](docs/practice-guide.md#task-and-context-design).             | What is the smallest context and capability set that works?           |
| Session operations        | [P12–P16](docs/practice-guide.md#during-the-task).                     | Where does durable state live, and what is lossy or shareable?        |
| Models and reliability    | [P17–P20](docs/practice-guide.md#models-providers-and-reliability).    | Which provider/model behavior, retry owner, and output bound applies? |
| Extensions and packages   | [P21–P24](docs/practice-guide.md#extensions-and-packages).             | Does runtime code justify its lifecycle, authority, and supply chain? |
| Automation and embedding  | [P25–P27](docs/practice-guide.md#automation-and-embedding).            | Which process owns policy, sessions, cancellation, and cleanup?       |
| Diagnosis and maintenance | [P28–P30](docs/practice-guide.md#diagnosis-upgrades-and-contribution). | Can the failure, upgrade, and contribution be human-verified?         |

The [architecture decision map](docs/architecture.md) distinguishes stable
release behavior, experimental source, customization layers, trust boundaries,
session semantics, and integration modes.

<!-- sync:root-official -->

## Official Building Blocks

These are primary sources and reference implementations, not third-party
endorsements.

<!-- resource:official-pi -->

- [Pi](https://github.com/earendil-works/pi) - Canonical monorepo for tagged source, tests, releases, security boundaries, and contribution policy.

<!-- resource:official-docs -->

- [Documentation](https://pi.dev/docs/latest) - Current guides for usage, providers, sessions, resources, security, terminal setup, JSON, RPC, and SDK.

<!-- resource:official-releases -->

- [Releases](https://github.com/earendil-works/pi/releases) - Versioned notes and artifacts for selecting and preserving a reproducible baseline.

<!-- resource:official-extension-examples -->

- [Extension Examples](https://github.com/earendil-works/pi/tree/v0.83.0/packages/coding-agent/examples/extensions) - Reviewable implementations of lifecycle hooks, custom tools, providers, UI, policy, and tool-routing patterns.

<!-- resource:official-package-catalog -->

- [Package Catalog](https://pi.dev/packages) - Broad package discovery surface whose entries still require source, license, authority, compatibility, and hands-on review.

<!-- resource:official-rfcs -->

- [Pi RFCs](https://rfc.earendil.com/keyword/pi/) - Design proposals with explicit states that must be cross-checked against tagged implementation and release status.

<!-- sync:root-research -->

## Evidence and Research

| Read                                                                | Use it for                                                                                          |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Documentation map](docs/README.md)                                 | Choose a reading path and understand evidence labels.                                               |
| [Official source map](docs/research/source-map.md)                  | Replace memory/search snippets with version-pinned primary sources.                                 |
| [Evidence ledger](docs/research/evidence-ledger.md)                 | Trace every P01–P30 recommendation to facts and labeled inference.                                  |
| [Research methodology](docs/research/methodology.md)                | Review source tiers, inclusion gates, scoring, AI disclosure, and update procedure.                 |
| [Discovery protocol](docs/research/discovery-protocol.md)           | Preserve replayable searches, identities, relationships, dispositions, and stratified review order. |
| [Exact query log](docs/research/query-log.md)                       | Re-run the dated GitHub, catalog, registry, RFC, source, and community-review queries.              |
| [Ecosystem landscape](docs/research/landscape.md)                   | Inspect the dated project, catalog, issue-cluster, directory, and opportunity snapshot.             |
| [Ecosystem coverage matrix](docs/research/coverage-matrix.md)       | See every tracked official/community capability area, evidence state, explicit gap, and next gate.  |
| [Generated coverage summary](docs/research/coverage-summary.md)     | Inspect category and architecture counts derived from reviewed resources and discovery candidates.  |
| [Ecosystem directory guide](docs/research/ecosystem-directories.md) | Choose among official, curated, automated, synthesized, and historical discovery surfaces.          |
| [Extension review](docs/extension-review.md)                        | Audit identity, install scripts, dependencies, authority, lifecycle, data flow, tests, and removal. |
| [Glossary](docs/glossary.md)                                        | Disambiguate Project Trust, session operations, tool limits, RPC, SDK, and containment.             |

Stable claims were checked against **v0.83.0** at
`845d6ff1f6643aba440341cce877ce1c43ebbc39`. Post-release observations are
pinned to `main@9b50b046d328d589a81400d2e184175d0bf19734` and labeled
`main-only`.

<!-- sync:root-queue -->

## Community Review Queue

This section puts the complete checked-in decision map in the README. The
canonical machine records remain the resource registry, candidate registry,
taxonomy, and generated coverage data; the deeper watchlist preserves the
item-by-item review trail. Entries in these research tables are not formal
Awesome items and do not receive `resource:` markers unless they later become
`featured`.

<!-- sync:root-queue-snapshot -->

### Status snapshot

| Dimension                                              | Checked-in state                                                                                                                   | Interpretation                                                                                                                                 |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [Resource registry](data/resources.json)               | 28 records: 6 official, 7 directory/related, and 15 community.                                                                     | The 15 community records split into 12 `source-reviewed` and 3 deferred records.                                                               |
| [Discovery candidates](data/discovery-candidates.json) | 13 candidates; every item is `preliminary-evidence-collected`, `awaiting-source-review`, and `not-evaluated`.                      | Identity and Pi relationship evidence are pinned; ordinary source review is still incomplete.                                                  |
| [Machine taxonomy](data/practice-taxonomy.json)        | 25 capability categories, 11 architecture types, and 13 Pi relationship types.                                                     | Categories say what a project does; architectures say how it runs; relationships say how it connects to Pi.                                    |
| [Coverage data](data/coverage-summary.json)            | 275 category × architecture cells: 82 nonempty, 42 with source-review evidence, 0 with hands-on evidence.                          | One project can occupy several cells, so 82 nonempty cells do not mean 82 projects.                                                            |
| Source-review gaps                                     | 9 of 25 categories have no source-reviewed primary or secondary representative; 14 have no source-reviewed primary representative. | Five of the 14 primary gaps have only secondary coverage; an empty cell means no checked-in evidence, not proof that no implementation exists. |
| Hands-on and recommendation state                      | 25 of 25 categories have no hands-on-verified representative; 0 third-party entries are featured.                                  | More candidate links cannot substitute for named, reproducible human trials.                                                                   |

`P` and `S` below mean primary and secondary category placement. Counts are
overlapping unless explicitly described as totals.

<!-- sync:root-queue-reviewed -->

### Source-reviewed community projects — all 12

These projects passed a bounded source and metadata review at the linked
immutable ref on **2026-07-31**. They were not installed or executed by this
repository's maintainer. They remain untrusted trial leads pending a named
human review; see the [full source-review watchlist](docs/research/watchlist.md)
for entry points, tests, and trial questions.

| Project and reviewed evidence                                                                                                                                                                                     | Capability, architecture, and Pi relationship                                                                                                                               | What source review established                                                                                             | Critical boundary before any hands-on use                                                                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Gondolin @ `29fa74d`](https://github.com/earendil-works/gondolin/tree/29fa74d802112f29c720990aced26165e0d57d84) · Apache-2.0 · macOS/Linux · extensive tests, passing CI                                         | P: VM/tool isolation; S: permission/guardrails. OS/virtualization boundary + in-process example; official-adjacent Pi resource.                                             | Micro-VM isolation research with a concrete Pi tool-routing example and substantial security/limitation documentation.     | The example is not an installable Pi package, mounts the project read-write at `/workspace`, and documents QEMU, same-user processes, and denial of service as non-goals.                              |
| [pi-subagents @ `89de10e`](https://github.com/nicobailon/pi-subagents/tree/89de10e4bc8895e7948704c38620a5b35ddcd17e) · MIT · current scope · unit/integration/E2E, passing CI                                     | P: subagents/workflows; S: task/goal loops and Git/review. In-process extension; Pi package/resource.                                                                       | Subagent, parallel, chained, background, lifecycle, and worktree orchestration patterns.                                   | Subprocesses, worktrees, and tool restrictions are not OS isolation; bound child tools/models, inherited environment, concurrency, cost, background cancellation, durable state, and parallel writers. |
| [pi-crew @ `c694ebf`](https://github.com/baphuongna/pi-crew/tree/c694ebfd5d0f49d9479870d6919be4bbf9738291) · MIT · current scope · unit/integration/package tests, mixed CI                                       | P: subagents/workflows; S: task/goal loops and Git/review. In-process extension + external service; Pi package/resource + service/infrastructure.                           | Durable multi-agent workflows, parallel orchestration, and optional worktree isolation.                                    | Dynamic `.dwf.ts` runs unsandboxed JavaScript/TypeScript; a “confirmation” flag is not necessarily human approval; the Unix broker and retained state require explicit review and cleanup.             |
| [pi-mcp-adapter @ `6a3e840`](https://github.com/nicobailon/pi-mcp-adapter/tree/6a3e840219a49f9ae5350542b7a707aa1e83fedf) · MIT · current scope · unit/OAuth/conformance/package tests, passing CI                 | P: MCP integration. In-process extension + external service; Pi package/resource + service/infrastructure.                                                                  | Lazy-proxy and direct MCP paths with OAuth, packaging, protocol, and conformance coverage.                                 | MCP server commands and secret resolvers execute with local-user authority; shared multiplexers share state and credentials. Pin, inspect, and contain every server separately.                        |
| [pi-web-access @ `c702b3b`](https://github.com/nicobailon/pi-web-access/tree/c702b3be11bfbc832489eb7cfe31d9bbbbb2cc27) · MIT · current scope · tests present, no repository CI observed                           | P: web search/fetch. In-process extension + external service; Pi package/resource + service/infrastructure.                                                                 | Search, fetch, repository, PDF, YouTube, and local-video workflows in one package.                                         | Queries, URLs, pages, video, and browser cookies may reach several providers or fallback routes; review data flow, redirects/SSRF, size limits, retention, timeouts, and offline failure per provider. |
| [pi-agent-browser-native @ `211a012`](https://github.com/fitchmultz/pi-agent-browser-native/tree/211a012c9b199d758768e8ba729f35e11e661f65) · MIT · Pi `>=0.80.6` · extensive tests, no repository CI observed     | P: authenticated-browser automation; S: alternate UI/editor. In-process extension + external service; Pi package/resource + service/infrastructure.                         | A structured Pi tool surface over the separate `agent-browser` CLI for browser, Electron, profile, and download workflows. | It can reach login state, cookies, clipboard, downloads, and screenshots; project configuration is trust-sensitive. Use only a dedicated test profile and verify CLI/version pairing and cleanup.      |
| [Plannotator @ `80065c8`](https://github.com/backnotprop/plannotator/tree/80065c84624e80bf60dc1ad862c17c3ea3f2bd80) · root Apache-2.0; Pi extension MIT OR Apache-2.0 · Pi `>=0.74.0` · passing CI                | P: human review/planning; S: Git/review and session sharing. In-process extension + frontend/controller + external service; three matching Pi relationships.                | Human review surfaces for plans, Markdown/HTML, and code diffs, with Pi runtime smoke coverage.                            | Optional sharing uploads encrypted ciphertext. Encryption does not remove URL-fragment, history, metadata, endpoint, or retention risk; disable sharing for sensitive trials.                          |
| [pi-hermes-memory @ `5aafe2c`](https://github.com/chandra447/pi-hermes-memory/tree/5aafe2ca04cb55b62204b159389c8381894038ce) · MIT · current scope · unit/check/lint, passing CI                                  | P: persistent memory; S: context optimization. In-process extension + external service; Pi package/resource + service/infrastructure.                                       | Cross-session memory, SQLite full-text session search, and procedural-memory workflows.                                    | Persistent indexes extend privacy and stored-prompt-injection lifetime; scanners are incomplete, native SQLite has ABI risk, and model-based consolidation reads and rewrites memory.                  |
| [pi-coding-agent for Emacs @ `df5ce0a`](https://github.com/dnouri/pi-coding-agent/tree/df5ce0a176ce634ccb4883042c415a74a5637c37) · GPL-3.0-only · Pi `>=0.79.1` · unit/integration/GUI/lint, passing CI           | P: alternate UI/editor. RPC/JSON consumer + frontend/controller; matching RPC and frontend relationships.                                                                   | A tested Emacs UI over Pi RPC and a concrete headless project-trust case study.                                            | The documented default passes `--approve`; unknown repositories need an explicit non-approving policy plus a separate decision about context files and shared authentication storage.                  |
| [pi-lens @ `a4baa3a`](https://github.com/apmantza/pi-lens/tree/a4baa3a94ecaf71f8af9f48ab27c8d7f6da8fdb2) · MIT · current scope · install/grammar/tool compatibility CI                                            | P: code intelligence. In-process extension + external service; Pi package/resource + service/infrastructure.                                                                | Structured LSP, lint, formatting, AST/tree-sitter, and optional scanning tools.                                            | Build and lifecycle paths can download grammars/tools; analysis can mutate files. A compatibility smoke pinned to Pi 0.80.10 does not prove complete v0.83.0 support.                                  |
| [braintrust-pi-extension @ `c8f1aea`](https://github.com/braintrustdata/braintrust-pi-extension/tree/c8f1aea1236f47c2681c0104be143b832bc9058c) · MIT · recent-minor matrix · integration/package/compatibility CI | P: tracing/observability. In-process extension + external service; Pi package/resource + service/infrastructure.                                                            | Tracing for sessions, turns, model calls, tools, and compaction.                                                           | When enabled it can upload raw input, normalized context, output, tool arguments, and tool results; classify, redact, sample, set retention/deletion, and test failure isolation first.                |
| [gentle-pi @ `3b6b3d2`](https://github.com/Gentleman-Programming/gentle-pi/tree/3b6b3d2183dbbc4d45b16a1a0f127728c0a2435c) · MIT · current scope · unit/package/publish, passing CI                                | P: broad operating layer; S: guardrails, subagents, task/goal loops. Package suite + in-process extension + external service; Pi package/resource + service/infrastructure. | A broad case study in specification-driven development, TDD, review, subagents, and local authority/policy design.         | `postinstall` obtains or builds a native runtime, the current RDD path is marked unstable, the companion surface is large, and the threat model excludes malicious same-user replacement.              |

<!-- sync:root-queue-deferred -->

### Deferred community records — all 3

Deferred records have already been inspected enough to identify a blocking
condition, but they do not count as source-reviewed evidence.

| Project and reviewed evidence                                                                                                                               | Capability and form                                                                                                                     | Why it is retained                                                            | Blocking condition and reopen gate                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [pi-extensions @ `60d70f2`](https://github.com/tmustier/pi-extensions/tree/60d70f24825446205c45e89f98813688e52823f3) · MIT · `collection-needs-item-review` | P: package suites/alternate distributions; S: UI/statusline/accessibility, themes, prompt packs. Package suite + in-process extensions. | A mixed collection may contain individually useful extensions.                | It is not one atomic capability; tests/CI vary and some docs retain legacy links. Reopen only as separate item-level reviews.                                                           |
| [pi-skills @ `90bb51c`](https://github.com/badlogic/pi-skills/tree/90bb51cae36515a648515b633a81c0c6efc8c74d) · MIT · `legacy-scope`                         | P: individual skills; S: browser and web access. Resource-only + external service.                                                      | Historical browser, Google-service, transcription, and API workflow examples. | Legacy `@mariozechner/*` guidance, heterogeneous high authority, and no observed tests/CI require migration plus a separate authority review for every skill.                           |
| [pi-share-hf @ `21c1d96`](https://github.com/badlogic/pi-share-hf/tree/21c1d9629187b553a2d59f26c5ef28eb33bb4e70) · `NOASSERTION` · `blocked`                | P: session export/sharing/publishing. In-process extension + external service.                                                          | A historical session-sharing flow with several redaction stages.              | No detected license, legacy scope, no observed tests/CI, and intentional public Hugging Face upload block reuse; scanners and model review cannot prove all private content is removed. |

<!-- sync:root-queue-candidates -->

### Preliminary discovery candidates — all 13

Every row is `preliminary-evidence-collected`, `awaiting-source-review`, and
`not-evaluated`. All repositories declared MIT metadata at the snapshot, but
license scope itself has not passed the source-review gate. The 28 evidence
links below are immutable; they establish only the stated relationship.

| Candidate and pinned evidence                                                                                                                                                                                                                                                                                                                 | Capability and architecture                                                                                                                                 | Evidence-backed Pi relationship                                                                                                                                            | Still unresolved before source review                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [OpenClaw](https://github.com/openclaw/openclaw) · aliases Warelay, Clawdbot, Moltbot · npm `openclaw` · [five-source chain below](#why-openclaw-is-in-this-map)                                                                                                                                                                              | P: remote control/messaging/collaboration; S: broad operating layer and package suites. Frontend/controller + derived/internalized runtime + package suite. | Pi package consumer + historical SDK embedder + frontend/controller + derived/internalized-from-Pi.                                                                        | Current scope, compatibility, authority, data flow, tests, maintenance, and complete license boundary; no current Pi v0.83 compatibility conclusion. |
| [oh-my-pi](https://github.com/can1357/oh-my-pi) · npm `@oh-my-pi/pi-coding-agent` · [identity](https://github.com/can1357/oh-my-pi/blob/fcf6d65140a1d53a55de3edb0d413bd2b8433bb0/README.md) · [manifest](https://github.com/can1357/oh-my-pi/blob/fcf6d65140a1d53a55de3edb0d413bd2b8433bb0/packages/coding-agent/package.json)                | P: package suites/alternate distributions; S: alternate UI. Frontend + fork + derived runtime + suite.                                                      | A Pi fork publishing its own terminal, SDK, RPC, native ACP, and `@oh-my-pi/*` family; those are fork-owned surfaces, not proof of consuming upstream through SDK/RPC/ACP. | Inherited versus independent behavior, divergence, compatibility, authority, tests, and maintenance.                                                 |
| [Senpi](https://github.com/code-yeongyu/senpi) · npm `@code-yeongyu/senpi` · [identity](https://github.com/code-yeongyu/senpi/blob/f4705697bb63e880140d9d885fe5bd5540b52d77/README.md) · [manifest](https://github.com/code-yeongyu/senpi/blob/f4705697bb63e880140d9d885fe5bd5540b52d77/packages/coding-agent/package.json)                   | P: package suites/alternate distributions; S: alternate UI. Frontend + fork + derived runtime.                                                              | A pi-mono fork/rebrand used as Dori's coding-agent runtime.                                                                                                                | Exact fork point, independent changes, present upstream relationship, compatibility, risk, tests, and maintenance.                                   |
| [piclaw](https://github.com/rcarmo/piclaw) · [workspace claim](https://github.com/rcarmo/piclaw/blob/4de5e92aa96bdf809de772e68da767c2eb4957dd/README.md) · [Pi 0.83 manifest](https://github.com/rcarmo/piclaw/blob/4de5e92aa96bdf809de772e68da767c2eb4957dd/package.json)                                                                    | P: alternate UI/editor; S: remote control/collaboration. SDK embedder + frontend/controller.                                                                | A self-hosted web workspace whose pinned manifest directly depends on all four Pi 0.83.0 packages.                                                                         | Authentication, process/session lifecycle, data boundaries, effective compatibility, tests, and cleanup.                                             |
| [pi-vscode-extension](https://github.com/Zetaphor/pi-vscode-extension) · [identity](https://github.com/Zetaphor/pi-vscode-extension/blob/526df5ead8e0104ea5d176bb5e6fa25e6d75844a/README.md) · [session construction](https://github.com/Zetaphor/pi-vscode-extension/blob/526df5ead8e0104ea5d176bb5e6fa25e6d75844a/src/pi/session.ts)        | P: alternate UI/editor. SDK embedder + frontend/controller.                                                                                                 | A VS Code frontend that imports Pi APIs and constructs the agent session inside the editor extension.                                                                      | Project trust, editor authority, session lifecycle, cancellation, compatibility, and cleanup.                                                        |
| [pi-vscode](https://github.com/pithings/pi-vscode) · historical alias `pi0/pi-vscode` · [identity](https://github.com/pithings/pi-vscode/blob/8761b3ccf99bf5b7bc7e3631c508e1dd164b0e2c/README.md) · [RPC spawn](https://github.com/pithings/pi-vscode/blob/8761b3ccf99bf5b7bc7e3631c508e1dd164b0e2c/src/pi.ts)                                | P: alternate UI/editor. RPC/JSON consumer + frontend/controller.                                                                                            | A VS Code bridge that starts Pi in RPC mode and attaches the frontend to that process.                                                                                     | Redirect lineage, project trust, process lifecycle, cancellation, compatibility, and cleanup.                                                        |
| [pi-acp](https://github.com/svkozak/pi-acp) · npm `pi-acp` · [protocol claim](https://github.com/svkozak/pi-acp/blob/d1cffc047ab37a096ee70ca39cfc1de463db8d12/README.md) · [RPC process](https://github.com/svkozak/pi-acp/blob/d1cffc047ab37a096ee70ca39cfc1de463db8d12/src/pi-rpc/process.ts)                                               | P: alternate UI/editor. RPC/JSON consumer + ACP consumer.                                                                                                   | An adapter that launches Pi RPC and maps it to ACP over stdio for clients such as Zed.                                                                                     | Protocol completeness, authorization, cancellation, error mapping, child supervision, compatibility, and cleanup.                                    |
| [acpx](https://github.com/openclaw/acpx) · npm `acpx` · [agent mapping](https://github.com/openclaw/acpx/blob/504040facb1992453cf16a2a096a1094fc4e48d4/src/agent-registry.ts) · [manifest](https://github.com/openclaw/acpx/blob/504040facb1992453cf16a2a096a1094fc4e48d4/package.json)                                                       | P: alternate UI/editor. ACP consumer + frontend/controller.                                                                                                 | An indirect `acpx → pi-acp → Pi` relationship; it is not a direct Pi SDK embedder.                                                                                         | Indirect dependency and protocol boundaries, authorization, lifecycle, compatibility, tests, and maintenance.                                        |
| [pi-coding-agent-action](https://github.com/shaftoe/pi-coding-agent-action) · [action entry](https://github.com/shaftoe/pi-coding-agent-action/blob/1bd7b89a7e1943cb1cf01f2f8b61e2108e0224c1/action.yml) · [Pi 0.82.1 manifest](https://github.com/shaftoe/pi-coding-agent-action/blob/1bd7b89a7e1943cb1cf01f2f8b61e2108e0224c1/package.json) | P: Git/review automation. SDK embedder.                                                                                                                     | A GitHub/Forgejo action directly embedding Pi coding-agent, AI, and agent-core 0.82.1.                                                                                     | Token scope, checkout mutation, remote writes, approval, rollback, failure isolation, and current compatibility.                                     |
| [Polpo](https://github.com/pugliatechs/polpo) · [remote-controller claim](https://github.com/pugliatechs/polpo/blob/ad8e1bd0cdc8b491a64aede27a1a97c0ac41d477/README.md) · [RPC launcher](https://github.com/pugliatechs/polpo/blob/ad8e1bd0cdc8b491a64aede27a1a97c0ac41d477/src/agent/pi-agent.js)                                            | P: remote control/messaging/collaboration; S: alternate UI. RPC/JSON consumer + frontend/controller.                                                        | A phone-oriented remote controller that starts and connects to Pi through RPC.                                                                                             | Identity, authorization, replay resistance, disconnect behavior, retention, process cleanup, and compatibility.                                      |
| [pi-nvim](https://github.com/carderne/pi-nvim) · npm `pi-nvim` · [extension entry](https://github.com/carderne/pi-nvim/blob/fbc6f12652234f03d2fe729adbcc3ff61ca7d39a/extension.ts)                                                                                                                                                            | P: alternate UI/editor. In-process extension + frontend/controller.                                                                                         | A Pi-loaded extension opening a Unix JSON socket for a Neovim frontend; it does not construct `AgentSession` and is not an SDK runtime embedder.                           | Buffer/editor authority, project trust, socket/process lifecycle, cancellation, compatibility, and cleanup.                                          |
| [pi-mobile](https://github.com/p1rallels/pi-mobile) · [product claim](https://github.com/p1rallels/pi-mobile/blob/4cc9b712254d84c90a00373c972c8a417fd26fb9/README.md) · [session runtime](https://github.com/p1rallels/pi-mobile/blob/4cc9b712254d84c90a00373c972c8a417fd26fb9/src/session-runtime.ts)                                        | P: alternate UI/editor; S: remote control/collaboration. SDK embedder + frontend/controller.                                                                | A web/mobile frontend whose pinned runtime directly constructs and manages a Pi agent session.                                                                             | Authentication, transport authorization, retention, disconnect behavior, compatibility, tests, and cleanup.                                          |
| [my-pi](https://github.com/spences10/my-pi) · npm `my-pi` · [suite claim](https://github.com/spences10/my-pi/blob/c0bca00ef69c20c2192d7457827b45e3d3d401bb/README.md) · [session API](https://github.com/spences10/my-pi/blob/c0bca00ef69c20c2192d7457827b45e3d3d401bb/src/api.ts)                                                            | P: package suites/alternate distributions; S: MCP, code intelligence, evals, broad operating layer. SDK embedder + fork + suite.                            | A Pi SDK wrapper/alternate distribution spanning MCP, LSP, team, and evaluation-telemetry surfaces.                                                                        | Every bundled artifact's authority, data flow, behavior, compatibility, tests, and maintenance; no suite-level conclusion yet.                       |

<!-- sync:root-queue-openclaw -->

#### Why OpenClaw is in this map

OpenClaw is explicitly included at the preliminary-candidate layer. The
evidence supports historical SDK embedding, retained Pi provenance, and later
runtime internalization. It does **not** show that current OpenClaw still embeds
the upstream runtime or that it is compatible with Pi v0.83.0.

1. The pinned [naming history](https://github.com/openclaw/openclaw/blob/a2b97cc950f49f5194c64a58fe24c9eb38d640ce/docs/start/lore.md) records Warelay → Clawdbot → Moltbot → OpenClaw.
2. Historical [Pi integration documentation](https://github.com/openclaw/openclaw/blob/99b27cde64d6616a9e41f52f4a699577cf60f1d6/docs/pi.md) describes direct `AgentSession` integration of coding-agent, AI, agent-core, and TUI.
3. The pinned [provenance notice](https://github.com/openclaw/openclaw/blob/a2b97cc950f49f5194c64a58fe24c9eb38d640ce/THIRD_PARTY_NOTICES.md) records code adapted from Pi/pi-mono and a retained Pi TUI dependency.
4. The [internalization migration](https://github.com/openclaw/openclaw/commit/bb46b79d3c1479f194a90afcf3dd69a1858a7898) introduced OpenClaw-owned agent core, removed the former Pi runtime layout, and retained third-party provenance.
5. The pinned [root manifest](https://github.com/openclaw/openclaw/blob/a2b97cc950f49f5194c64a58fe24c9eb38d640ce/package.json) uses the npm identity `openclaw` and retains `@earendil-works/pi-tui` 0.82.1.

This kind of project is easy to miss with name/current-dependency search alone:
its current name does not contain Pi, it passed through three older names, and
its relationship changed from direct embedding to derived/internalized lineage.
The original 13-lead search was reconstructed and non-replayable, so these are
plausible omission mechanisms, not a claim about one proven historical cause.

<!-- sync:root-queue-coverage -->

### Capability coverage and gaps — all 25

Every category still has a hands-on gap. `P` and `S` preserve the primary versus
secondary distinction; deferred records never increase source-review coverage,
and preliminary candidates never count as reviewed evidence.

| Capability                                      | Source-reviewed representatives                | Deferred records  | Preliminary candidates                                                                                                     | Next evidence gap                                                                 |
| ----------------------------------------------- | ---------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| VM/tool isolation                               | Gondolin (P)                                   | —                 | —                                                                                                                          | Hands-on trial.                                                                   |
| Permission and guardrails                       | Gondolin (S), gentle-pi (S)                    | —                 | —                                                                                                                          | Primary representative and hands-on trial.                                        |
| Subagents and workflow orchestration            | pi-subagents (P), pi-crew (P), gentle-pi (S)   | —                 | —                                                                                                                          | Hands-on trial across distinct orchestration forms.                               |
| MCP integration                                 | pi-mcp-adapter (P)                             | —                 | my-pi (S)                                                                                                                  | Hands-on trial; suite candidate still needs source review.                        |
| Web search and fetch                            | pi-web-access (P)                              | pi-skills (S)     | —                                                                                                                          | Hands-on data-flow trial.                                                         |
| Browser and authenticated-profile automation    | pi-agent-browser-native (P)                    | pi-skills (S)     | —                                                                                                                          | Hands-on dedicated-profile trial.                                                 |
| Human review and planning                       | Plannotator (P)                                | —                 | —                                                                                                                          | Hands-on local/share-disabled trial.                                              |
| Code intelligence                               | pi-lens (P)                                    | —                 | my-pi (S)                                                                                                                  | Hands-on trial; suite candidate still needs source review.                        |
| Persistent memory                               | pi-hermes-memory (P)                           | —                 | —                                                                                                                          | Hands-on privacy, retention, and prompt-injection trial.                          |
| Tracing and observability                       | braintrust-pi-extension (P)                    | —                 | —                                                                                                                          | Hands-on redaction, retention, and failure-isolation trial.                       |
| Alternate UI and editor integration             | Emacs frontend (P), browser-native (S)         | —                 | piclaw (P), two VS Code projects (P), pi-acp (P), acpx (P), pi-nvim (P), pi-mobile (P), oh-my-pi (S), Senpi (S), Polpo (S) | Source-review candidates by integration form, then hands-on trials.               |
| Broad operating layer                           | gentle-pi (P)                                  | —                 | OpenClaw (S), my-pi (S)                                                                                                    | Hands-on scoped slice; both candidates need source review.                        |
| Context optimization                            | pi-hermes-memory (S)                           | —                 | —                                                                                                                          | Primary representative and hands-on trial.                                        |
| Task, goal, and loop engineering                | pi-subagents (S), pi-crew (S), gentle-pi (S)   | —                 | —                                                                                                                          | Primary representative and hands-on trial.                                        |
| UI, statusline, notification, and accessibility | —                                              | pi-extensions (S) | —                                                                                                                          | Itemize the collection, source review, then hands-on trial.                       |
| Themes and theme tooling                        | —                                              | pi-extensions (S) | —                                                                                                                          | Itemize the collection, source review, then hands-on trial.                       |
| Prompt-template packs                           | —                                              | pi-extensions (S) | —                                                                                                                          | Itemize the collection, source review, then hands-on trial.                       |
| Individual skills                               | —                                              | pi-skills (P)     | —                                                                                                                          | Migrate and review individual skills, then hands-on trial.                        |
| Custom providers and model gateways             | —                                              | —                 | —                                                                                                                          | Discover a credible public lead, source review, and hands-on trial.               |
| Local-model runtimes                            | —                                              | —                 | —                                                                                                                          | Discover a credible public lead, source review, and hands-on trial.               |
| Remote control, messaging, and collaboration    | —                                              | —                 | OpenClaw (P), Polpo (P), piclaw (S), pi-mobile (S)                                                                         | Source review each trust/transport model, then hands-on trial.                    |
| Package suites and alternate distributions      | —                                              | pi-extensions (P) | oh-my-pi (P), Senpi (P), my-pi (P), OpenClaw (S)                                                                           | Source review inherited versus independent behavior, then hands-on trial.         |
| Git and review automation                       | pi-subagents (S), pi-crew (S), Plannotator (S) | —                 | pi-coding-agent-action (P)                                                                                                 | Primary source review beyond the candidate, then hands-on remote-write trial.     |
| Evals and benchmarking                          | —                                              | —                 | my-pi (S)                                                                                                                  | Source review an eval-specific slice or representative, then hands-on validation. |
| Session export, sharing, and publishing         | Plannotator (S)                                | pi-share-hf (P)   | —                                                                                                                          | Primary active representative and hands-on privacy trial.                         |

Across primary and secondary placement, 16 categories have source-review
evidence and 9 do not. Three of those 9 have candidates; six have no active
registered candidate, although four retain deferred material. Candidate primary
placement is strongly concentrated: 7 alternate UI/editor, 3 package
suite/distribution, 2 remote/collaboration, and 1 Git/review. It is not a
balanced sample of the 25 categories.

<!-- sync:root-queue-architectures -->

### Architecture strata — all 11

Architecture describes how a project executes or is composed. A project can
occupy several rows, so counts cannot be summed into project totals.

| Architecture                 | Source-reviewed records | Preliminary candidates | Operational boundary                                                                                                                  |
| ---------------------------- | ----------------------: | ---------------------: | ------------------------------------------------------------------------------------------------------------------------------------- |
| Resource-only                |                       0 |                      0 | Declarative prompts, themes, templates, or skills still influence model/tool use; current examples are deferred rather than reviewed. |
| In-process extension         |                      11 |                      1 | Code runs with the Pi process user's filesystem, process, credential, and network authority.                                          |
| SDK embedder                 |                       0 |                      5 | The host application owns policy, sessions, tools, credentials, cancellation, subscriptions, persistence, and cleanup.                |
| RPC/JSON consumer            |                       1 |                      3 | A controller owns subprocess startup, protocol framing, stderr draining, event handling, cancellation, restart, and shutdown.         |
| ACP consumer                 |                       0 |                      2 | An adapter/client adds protocol mapping, authorization, capability, error, cancellation, and lifecycle boundaries.                    |
| Frontend/controller          |                       2 |                     10 | Editor, web, mobile, messaging, or remote UI policy determines who can see and command a Pi-backed session.                           |
| External service             |                       9 |                      0 | Credentials, outbound data, tenancy, retention, availability, backpressure, and deletion extend beyond the local process.             |
| OS/virtualization boundary   |                       1 |                      0 | Containment depends on mounts, network, secrets, host process, reset, and documented threat-model exclusions.                         |
| Fork/alternate distribution  |                       0 |                      3 | Identity, inherited versus changed behavior, package scope, update path, and divergence from upstream must be separated.              |
| Derived/internalized runtime |                       0 |                      3 | Historical provenance may remain even after upstream runtime dependencies disappear; inherited claims need revalidation.              |
| Package suite                |                       1 |                      3 | Each bundled executable/resource and their combined authority must be reviewed; one safe component cannot validate a whole suite.     |

<!-- sync:root-queue-relations -->

### Pi relationship types — all 13

Relationship describes why a project belongs in the Pi ecosystem map, not its
quality or compatibility. Relationships overlap and later internalization or
renaming does not erase historical provenance.

| Pi relationship                 | Source-reviewed records | Preliminary candidates | Meaning                                                                                                                             |
| ------------------------------- | ----------------------: | ---------------------: | ----------------------------------------------------------------------------------------------------------------------------------- |
| Pi package or resource          |                      11 |                      2 | Loaded by, distributed for, or directly built around Pi's extension/resource system.                                                |
| SDK embedder                    |                       0 |                      5 | Constructs Pi sessions or imports Pi runtime APIs inside another application.                                                       |
| Historical SDK embedder         |                       0 |                      1 | Immutable historical evidence shows direct SDK embedding that is no longer necessarily current.                                     |
| Pi package consumer             |                       0 |                      1 | Consumes at least one Pi package without necessarily embedding the full current runtime.                                            |
| RPC/JSON consumer               |                       1 |                      3 | Starts or consumes Pi's CLI protocol/event surfaces.                                                                                |
| ACP consumer                    |                       0 |                      2 | Connects through ACP directly or through a bridge.                                                                                  |
| Frontend or controller          |                       2 |                     10 | Presents or remotely controls a Pi-backed user/session surface.                                                                     |
| Fork or alternate distribution  |                       0 |                      3 | Republishes, renames, or materially redistributes Pi-derived code or behavior.                                                      |
| Derived or internalized from Pi |                       0 |                      3 | Retains Pi-derived code/provenance after internalizing or changing the runtime boundary.                                            |
| Service or infrastructure       |                       9 |                      0 | Adds an external/local service, broker, backend, or infrastructure dependency to a Pi workflow.                                     |
| Official-adjacent               |                       1 |                      0 | Maintained within the upstream organization or presented as an adjacent reference, without becoming Pi core.                        |
| Historical or archived          |                       0 |                      0 | Records a legacy or retired relationship; current counted examples are deferred, so they do not increase reviewed/candidate totals. |
| Indirect consumer               |                       0 |                      1 | Reaches Pi through another adapter or dependency rather than embedding or launching it directly.                                    |

<!-- sync:root-queue-directories -->

### Catalogs, directories, and historical context

The official catalog and four current related directories are navigation
surfaces, not quality or compatibility oracles. At the dated 2026-07-31
snapshot, the catalog reported 5,351 packages and overlapping filters of 3,059
extensions, 360 skills, 109 themes, and 78 prompts; those filter counts are not
additive.

| Surface                                                                           | Registry status                 | Appropriate use                                                       | Boundary                                                                                               |
| --------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Pi Package Catalog                                                                | Official discovery              | Broad package discovery.                                              | Catalog presence is not source, license, safety, maintenance, compatibility, or hands-on review.       |
| awesome-pi                                                                        | Current related list            | Active bilingual human-curated package/resource navigation.           | Discovery scope differs from evidence-backed operating practice.                                       |
| awesome-pi-coding-agent                                                           | Current related list            | Automated, frequently refreshed breadth.                              | Generated discovery and descriptions are not human trials.                                             |
| Pi Package Index                                                                  | Current related list            | Daily npm metadata, maintenance signals, search, and public JSON API. | Unofficial metadata and popularity/maintenance signals are not endorsement.                            |
| pi-ecosystem-wiki                                                                 | Current related list            | Architecture, comparison, and ecosystem synthesis.                    | Secondary/generated claims remain leads until checked against primary sources.                         |
| [awesome-pi-agent](https://github.com/qualisero/awesome-pi-agent)                 | Archived historical context     | Understand an earlier directory and naming surface.                   | Explicitly retired/outdated; do not use for current compatibility.                                     |
| [Traveler0014/awesome-pi-agent](https://github.com/Traveler0014/awesome-pi-agent) | Rejected as a current directory | Schema-backed catalog-design reference.                               | Scheduled metadata updates were failing and content had not advanced beyond the initial June snapshot. |
| [awesome-pi-mono](https://github.com/afoofaa/awesome-pi-mono)                     | Rejected as a current directory | Early manual taxonomy/directory context.                              | No substantive update followed the May seed, so continuing maintenance was not demonstrated.           |

<!-- sync:root-queue-limits -->

### Discovery limits and what may still be missing

“All” in the headings above means every record currently checked into this
repository, not every Pi-related project in existence.

| Blind spot                                           | Why a real project can be absent                                                                                                                               | Current handling and remaining limitation                                                                                                                                                 |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Non-replayable initial batch                         | The 13-lead historical search did not preserve original queries, ranking, pages, duplicates, rejected results, failures, or pre-filter denominator.            | The run is honestly marked `reconstructed-non-replayable`, truncated, and incomplete; it cannot support an ecosystem-completeness claim.                                                  |
| Bounded current probe                                | The configured probe has 9 GitHub query families—6 code and 3 repository—and reads only the first page, at most 50 results per query.                          | It records limits, truncation, errors, attempts, and dispositions; lower-ranked and differently worded projects can still be missed.                                                      |
| Code-search authentication                           | The repository-scoped default Actions token does not provide the separate public code-search context used by this project.                                     | Repository searches run, while all 6 code searches are explicitly `skipped` with zero attempts unless a public-only `DISCOVERY_SEARCH_TOKEN` is configured.                               |
| GitHub-only discovery                                | Other forges, personal sites, documentation-only products, binaries, or registry-only packages may expose no discoverable GitHub repository.                   | Catalog, registry, directory, and referral cross-checks help, but do not make coverage exhaustive.                                                                                        |
| Private/internal/ambiguous visibility                | Publishing these identities could disclose information or contaminate public counts.                                                                           | The probe fails closed and clears identities/counts for the whole affected query; such projects are intentionally absent from public artifacts.                                           |
| Renames, moves, forks, deletion, and internalization | Canonical URLs and current dependency names can hide historical aliases, redirects, provenance, and independent forks.                                         | Preserve aliases, package identities, immutable evidence, and explicit relationship types; undiscovered lineage can remain.                                                               |
| Search vocabulary, language, ranking, and indexing   | A product may omit “Pi,” use another language, call protocols indirectly, or appear beyond the ranked page.                                                    | Queries cover package symbols, RPC strings, provenance, and product terms, but no finite vocabulary is complete.                                                                          |
| Registry and manifest variation                      | Relevant imports may occur only in a lockfile, generated file, monorepo subdirectory, another language, or an unpublished source archive.                      | Resolve publisher, artifact, repository, ref, and install target during source review; current queries do not cover every form.                                                           |
| Dynamic compatibility                                | Pi, Node/Bun, package scopes, providers, terminals, platforms, and external services evolve independently.                                                     | Pin snapshots and keep relationship, source review, hands-on verification, and recommendation as separate claims.                                                                         |
| Evidence imbalance                                   | The candidate batch is concentrated in frontends, SDK embedders, forks, and suites, while 6 categories have neither reviewed evidence nor an active candidate. | Prioritize custom provider/model gateway, local-model runtime, UI/statusline/accessibility, theme, prompt-pack, and individual-skill discovery—without hiding the universal hands-on gap. |

### Promotion gate

There are intentionally **no third-party featured entries yet**. Promotion
requires a named human reviewer, immutable artifact, disclosed relationship,
isolated trial, exact environment and commands, expected and actual results,
negative cases, cleanup and rollback, residual risks, bilingual fact review,
and an expiration/retest trigger. Stars, downloads, catalog presence, passing
CI, declared license metadata, or a source review cannot replace those steps.

<!-- sync:root-related -->

## Related Lists

These projects answer adjacent discovery and ecosystem questions.

<!-- resource:related-awesome-pi -->

- [awesome-pi](https://github.com/BubblePtr/awesome-pi) - Active bilingual curated directory of Pi packages and ecosystem resources under CC0.

<!-- resource:related-automated-directory -->

- [awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent) - Automated, frequently refreshed directory optimized for breadth and discovery.

<!-- resource:related-package-index -->

- [Pi Package Index](https://github.com/getpipher/pi-package-index) - Unofficial daily-refreshed npm package index with searchable maintenance metadata and a public JSON API.

<!-- resource:related-ecosystem-wiki -->

- [pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki) - Architecture, comparison, and ecosystem synthesis whose secondary claims should be verified against primary sources.

<!-- sync:root-contributing -->

## Contributing

Read the [contribution guide](CONTRIBUTING.md) before proposing a practice or
candidate. Contributions must state why the item is unusually useful, disclose
relationships and AI assistance, distinguish source review from direct use,
include reproducible evidence, and update both languages. Submissions are
offered under CC0-1.0.

<!-- sync:root-footnotes -->

## Footnotes

This independent community repository is not maintained by or affiliated with
Earendil Works. “Pi” and linked project names belong to their respective
owners.

Curated/source-review snapshot: **2026-07-31, Asia/Singapore**. Discovery-
candidate snapshot: **2026-08-01, Asia/Singapore**. Dynamic counts, package
metadata, provider behavior, and `latest` documentation may have changed.

The central Awesome project's
[list-creation guide](https://github.com/sindresorhus/awesome/blob/main/create-list.md)
and
[current pull-request template](https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md)
reject AI-generated lists and fully AI-generated pull requests. This
transparent research preview cannot honestly claim central-list eligibility
until substantive human testing, selection, rewriting, bilingual review, and
the required period of public maintenance have occurred.
