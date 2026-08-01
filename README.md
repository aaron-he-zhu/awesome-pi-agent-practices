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

The [source-reviewed community capability map](docs/research/landscape.md#community-capability-map)
tracks concrete leads for VM isolation (Gondolin), subagent/workflow
orchestration (pi-subagents and pi-crew), MCP (pi-mcp-adapter), web/browser
access (pi-web-access and pi-agent-browser-native), human review (Plannotator),
code analysis (pi-lens), memory (pi-hermes-memory), tracing
(braintrust-pi-extension), an Emacs UI, and a broad operating layer
(gentle-pi). These are research leads, not featured recommendations; each still
requires a named, reproducible human trial.

For discovery, use the
[directory chooser](docs/research/ecosystem-directories.md#quick-chooser), then
verify each candidate at its canonical source. Older material may still use
`badlogic/pi-mono`, `earendil-works/pi-mono`, or `@mariozechner/*`; check the
current repository, npm publisher/scope, peer dependencies, and install target
against the [scope-migration note](docs/research/landscape.md#scope-migration-and-stale-instructions).

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

The [source-review watchlist](docs/research/watchlist.md) contains twelve
source-reviewed candidates pending hands-on verification across VM isolation,
subagents, workflows, MCP, web and browser access, human review, code analysis,
memory, tracing, alternate UI, and broad operating layers. Each entry records
why it merits a trial and the specific authority, privacy, supply-chain,
lifecycle, or compatibility boundary that must be tested.

The [coverage matrix](docs/research/coverage-matrix.md#community-capability-coverage) separately tracks
twenty-five community capability categories. The
machine-generated summary derives the current source-review, hands-on,
deferred, candidate, and architecture counts from checked-in data so prose
cannot silently drift. An empty category means
“not yet evidenced by this repository,” not “no implementation exists.” A
candidate remains an untrusted lead until it passes the documented source and
hands-on gates.

There are intentionally **no third-party featured entries yet**. Promotion
requires a named human reviewer, immutable artifact, disclosed relationship,
isolated trial, exact environment and commands, expected/actual results,
cleanup, residual risks, bilingual fact review, and an expiration/retest
trigger.

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

Research snapshot: **2026-07-31, Asia/Singapore**. Dynamic counts, package
metadata, provider behavior, and `latest` documentation may have changed.

The central Awesome project's
[list-creation guide](https://github.com/sindresorhus/awesome/blob/main/create-list.md)
and
[current pull-request template](https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md)
reject AI-generated lists and fully AI-generated pull requests. This
transparent research preview cannot honestly claim central-list eligibility
until substantive human testing, selection, rewriting, bilingual review, and
the required period of public maintenance have occurred.
