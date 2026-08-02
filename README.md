# Awesome Pi Agent Practices [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[English](README.md) | [简体中文](README.zh-CN.md)

A copy-first field guide for using the Pi coding agent on real work.

Use this repository to finish a small task, teach Pi how your repository works,
run long or parallel jobs, customize the agent, embed it in another program,
and recover when something fails. You do not need to study all thirty
practices or the ecosystem research before starting.

| I want to…                                        | Start here                                                   |
| ------------------------------------------------- | ------------------------------------------------------------ |
| Finish my first useful task                       | [Get a useful result in ten minutes after setup](#start-now) |
| Copy a ready-made task shape                      | [Pick a ready-made recipe](#recipe-chooser)                  |
| Give Pi stable repository instructions            | [Copy the starter kit](#starter-kit)                         |
| Handle a long, parallel, or automated job         | [Use the high-leverage patterns](#advanced-patterns)         |
| Build a Skill, Extension, UI, or host application | [Customize or integrate Pi](#pi-surfaces)                    |
| Find packages and community implementations       | [Explore ecosystem implementations](#ecosystem-exploration)  |
| Diagnose a failure                                | [Recover by changing one variable](#failure-recovery)        |

> The command examples are source-backed recipes for the repository's pinned
> Pi **v0.83.0** baseline, not claims that this maintainer has executed them.
> Where an example contains placeholders, replace all of them, inspect the
> command, and judge success from the actual exit status and result. For a new
> installation, use the current official quickstart linked in step 1, record
> <code>pi --version</code>, and
> adapt pinned examples to the installed version.

<!-- sync:root-contents -->

## Contents

- [Get a useful result in ten minutes after setup](#get-a-useful-result-in-ten-minutes-after-setup)
- [Learn only your next layer](#learn-only-your-next-layer)
- [Keep the six-step daily cheat sheet](#keep-the-six-step-daily-cheat-sheet)
- [Pick a ready-made recipe](#pick-a-ready-made-recipe)
- [Copy the starter kit](#copy-the-starter-kit)
- [Use the high-leverage patterns](#use-the-high-leverage-patterns)
- [Customize or integrate Pi](#customize-or-integrate-pi)
- [Explore ecosystem implementations](#explore-ecosystem-implementations)
- [Recover by changing one variable](#recover-by-changing-one-variable)
- [Reference library](#reference-library)

<!-- sync:root-start -->

<a id="start-now"></a>

## Get a useful result in ten minutes after setup

This path takes about ten minutes **after Pi is installed and authenticated**.
It is for a small, supervised, reversible change in a repository you trust.
Use a disposable fixture or an external OS boundary for unknown code, sensitive
data, broad credentials, or unattended work.

### 1. Get a result in 60 seconds

Install and authenticate Pi through the
[current official quickstart](https://pi.dev/docs/latest/quickstart). Then, from
a new empty directory, confirm the executable/runtime and make one request with
the provider, model, and profile Pi already has configured:

```bash
command -v pi
pi --version
node --version
pi --no-session --no-tools -p "Reply with exactly PI_READY."
```

The smoke test passes only if each command exits successfully and the final
response is exactly <code>PI_READY</code>. It verifies the installed profile's
default request path; it does not establish repository access, tool behavior,
or isolation. If it fails, go to the
[sterile-baseline recipe](#scenario-1-recipe) to inspect the binary, provider,
model, and authentication separately.

### 2. Get a useful read-only repository map

In a repository you trust, record the starting state and ask Pi for a concrete
orientation without exposing write or command-execution tools:

```bash
git status --short
git branch --show-current
git rev-parse HEAD

pi --approve --no-session --tools read,grep,find,ls -p \
  "Do not modify files. Explain what this repository does. Cite the main entry point, one representative test, and the exact documented commands for a focused check and the full suite. Separate facts from guesses."
```

The map passes only if the process exits successfully, it names relevant files
and documented checks, and the recorded Git status is unchanged. <code>--approve</code> permits protected project-resource loading; it does not
approve external actions or create a filesystem, process, credential, or
network sandbox. The tool allowlist controls only the Pi tools registered for
this run.

### 3. Start one supervised change

Review the map and the repository's <code>AGENTS.md</code>, settings, and Pi
resources. If the task is still narrow and the repository is trusted, start a
separate interactive run with the minimum useful write set:

```bash
pi --approve --tools read,grep,find,ls,edit,write,bash
```

Paste this task contract and replace every capitalized placeholder:

```text
Goal: produce ONE OBSERVABLE OUTCOME.

In scope: PATHS OR COMPONENTS.
Out of scope: UNRELATED REFACTORS OR EXTERNAL SYSTEMS.
Must preserve: EXISTING USER CHANGES, API/DATA BEHAVIOR, AND CONSTRAINTS.

Start by reading the relevant instructions and files. State the smallest plan.
Make only the approved change.

Acceptance:
1. Run EXACT BEHAVIOR CHECK.
2. Run EXACT REGRESSION OR STATIC CHECK.
3. Review the complete diff and unexpected files.

Stop and ask before expanding scope, adding authority, installing dependencies,
using credentials, changing external state, or taking a destructive action.

Finish with: outcome, changed files, checks and results, skipped checks,
residual risks, and rollback.
```

### 4. Close the task from evidence

Do not accept a plausible final message as proof. Inspect the repository and
run its real checks:

```bash
git status --short
git diff --check
git diff
```

Then run the repository's documented focused test first and the broader
regression checks required by the task. A useful handoff says exactly what
changed, which commands passed or failed, what was not verified, what external
effects occurred, and how to roll back.

Go straight to [Scenario 2 in the recipe chooser](#scenario-2-recipe) for the
fully specified version with prerequisites, expected results, failure branches,
verification, and cleanup.

<!-- sync:root-learning -->

## Learn only your next layer

| Stage                        | Learn by doing; keep this proof                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. First success             | Complete the ten-minute path and trusted-repository repair; keep the reviewable diff, checks, and handoff.                                  |
| 2. Daily repeatability       | Add repository instructions and use a task brief; keep stable commands plus explicit task scope.                                            |
| 3. Long or parallel work     | Use checkpoints, compaction, cloned sessions, and Git worktrees; keep the checkpoint, writer ownership, and merge order.                    |
| 4. Customization             | Choose the smallest Pi primitive; keep one narrow Prompt Template, Skill, Extension, or package plus its removal steps.                     |
| 5. Automation or embedding   | Choose Print, JSON, RPC, or SDK by lifecycle owner; test startup, output, cancellation, failure, shutdown, and cleanup.                     |
| 6. Operation and maintenance | Isolate one variable, compare a fixed evaluation set, and stage upgrades; keep the reproducer, before/after result, rollback, and recovery. |

The thirty numbered practices are a reference for these layers, not a reading
prerequisite. Open the practice guide only when a recipe or failure points to a
decision you need to understand.

<!-- sync:root-loop -->

## Keep the six-step daily cheat sheet

After the quickstart, reuse this six-step checklist for each real task:

|        Step | What to do                                                                                                     | Evidence before moving on                        |
| ----------: | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
|    1. Frame | Name one outcome, in-scope paths, preservation rules, stop conditions, and exact checks.                       | A short task contract another person can review. |
| 2. Baseline | Record Pi/runtime/model, Git status, branch, and commit. Separate pre-existing changes.                        | A recoverable starting point.                    |
|      3. Map | Inspect instructions and relevant code before exposing writes or execution.                                    | A file map and smallest-change plan.             |
|   4. Change | Keep one session on one coherent goal. Expand context or authority only when evidence requires it.             | A scoped, attributable diff.                     |
|   5. Verify | Run behavior, regression, static, security/data-boundary, and cleanup checks in proportion to risk.            | Actual commands, exits, and sanitized results.   |
| 6. Hand off | Review the full diff, record skipped checks and residual risk, clean temporary effects, and preserve rollback. | A decision-ready delivery summary.               |

Three rules prevent many of the costliest mistakes:

| Remember                                                                                                                                                             | Consequence                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Project Trust controls protected project-resource loading; it is not operating-system containment.                                                                   | Unknown, privileged, or unattended work still needs an external boundary.          |
| <code>AGENTS.md</code>, Prompt Templates, Skills, Extensions, packages, sessions, Git worktrees, and external services are different state and authority boundaries. | Choose and review each layer separately.                                           |
| Session navigation does not restore files or external systems.                                                                                                       | Check Git, filesystem, process, credential, network, and service state separately. |

The complete version is the
[eight-stage operating playbook](docs/operating-playbook.md#how-to-use-this-playbook);
the [practice guide's starting point](docs/practice-guide.md#before-the-task)
explains each decision only when you need it.

<!-- sync:root-recipes -->

<a id="recipe-chooser"></a>

## Pick a ready-made recipe

Do not read the whole handbook before doing one job. Open the row that matches
today's outcome; each scenario includes prerequisites, a copyable procedure,
expected results, failure branches, verification, cleanup, and linked
practices.

| Today I need to…                                           | Copy this scenario                                                                                                                       | Default risk |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Prove the binary, provider, model, and authentication path | <a id="scenario-1-recipe"></a>[1. First sterile baseline](docs/scenario-cookbook.md#scenario-1--first-sterile-baseline)                  | R0           |
| Make a narrow supervised repair                            | <a id="scenario-2-recipe"></a>[2. Trusted repository repair](docs/scenario-cookbook.md#scenario-2--small-repair-in-a-trusted-repository) | R1           |
| Audit unfamiliar source without accepting its instructions | [3. Unknown repository audit](docs/scenario-cookbook.md#scenario-3--read-only-audit-of-an-unknown-repository)                            | R2           |
| Continue across context or supervision windows             | [4. Long task and compaction](docs/scenario-cookbook.md#scenario-4--long-task-with-checkpoint-and-compaction)                            | R1–R2        |
| Split independent changes safely                           | [5. Parallel Git worktrees](docs/scenario-cookbook.md#scenario-5--parallel-work-with-git-worktrees)                                      | R1–R2        |
| Compare or hand off between providers                      | [6. Multi-provider transition](docs/scenario-cookbook.md#scenario-6--multi-provider-comparison-or-handoff)                               | R1–R2        |
| Trial an executable third-party package                    | [7. Isolated package trial](docs/scenario-cookbook.md#scenario-7--isolated-third-party-package-trial)                                    | R2           |
| Run a headless check or consume events                     | [8. CI Print and JSON](docs/scenario-cookbook.md#scenario-8--ci-job-using-print-and-json-modes)                                          | R2–R3        |
| Control Pi from a process or TypeScript application        | [9. RPC and SDK lifecycle](docs/scenario-cookbook.md#scenario-9--rpc-child-or-sdk-host-lifecycle)                                        | R2–R3        |
| Add a tool, event, command, UI, provider, or policy hook   | [10. Extension development](docs/scenario-cookbook.md#scenario-10--extension-development-and-lifecycle-test)                             | R2           |
| Change Pi, model catalogs, packages, or extensions         | [11. Staged upgrade and rollback](docs/scenario-cookbook.md#scenario-11--staged-upgrade-and-rollback)                                    | R2–R3        |
| Respond to possible credential or private-data exposure    | [12. Suspected secret exposure](docs/scenario-cookbook.md#scenario-12--suspected-secret-exposure-incident)                               | R3           |

R0–R3 are routing labels, not policies enforced by Pi. R0 is read-only and
synthetic; R1 is a reversible local change; R2 adds executable third-party
code, credentials, network writes, or shared state; R3 is destructive,
production-sensitive, regulated, or incident work. See the
[risk-classification gate](docs/operating-playbook.md#risk-classification)
before an R2/R3 run.

<!-- sync:root-starter -->

<a id="starter-kit"></a>

## Copy the starter kit

Start with the smallest artifact that makes the next run easier:

| Copy this                                           | Use it when                                                                   | What it gives you                                                                          |
| --------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [Repository instructions](templates/AGENTS.md)      | A repository has stable commands, layout, conventions, or preservation rules. | A reviewable <code>AGENTS.md</code>; keep secrets and one-off tasks out.                   |
| [Task brief](templates/task-brief.md)               | Any real change needs scope and acceptance.                                   | Outcome, in/out, evidence, checks, stop conditions, handoff, and rollback.                 |
| [Run manifest](templates/run-manifest.md)           | A long, parallel, CI, RPC, SDK, or unattended run must be reconstructed.      | Version, model, resources, authority, containment, result, and cleanup provenance.         |
| [Evaluation record](templates/evaluation-record.md) | Comparing a prompt, model, provider, tool, extension, or workflow.            | Fixed cases, expected versus actual results, gates, metrics, cost, and decision.           |
| [Hands-on review](templates/hands-on-review.md)     | Trialling a third-party package or community project.                         | Identity, authority, data flow, lifecycle, behavior, negative cases, and removal evidence. |

### Minimal repository instructions

Copy this shape into a project-root <code>AGENTS.md</code>, then replace it with
commands and constraints that are true for that repository:

```markdown
# Repository guide

## Map
- Main code:
- Tests:
- Generated or vendored paths:

## Commands
- Install:
- Fast focused check:
- Full check:
- Build or type-check:
- Format:

## Change rules
- Preserve:
- Do not edit:
- New dependencies require:

## Definition of done
- Expected behavior is reproduced and verified.
- Focused and required regression checks pass.
- The complete diff and unexpected files are reviewed.
- Skipped checks, residual risks, and rollback are reported.
```

Repository instructions are durable context, not a sandbox or a per-task plan.
More specific nested instructions may override a broad root file, so keep the
hierarchy small and reviewable.

### Daily TUI shortcuts

| Input                            | Use it for                                                                                        | Boundary                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| <code>@path</code>               | Add a precise file or directory reference instead of dumping a broad tree.                        | Confirm the selected content is appropriate for the provider.  |
| <code>!command</code>            | Run a command and place its output in model-visible context.                                      | Bound and sanitize output.                                     |
| <code>!!command</code>           | Run locally without adding output to model context.                                               | Output may still exist in terminal, session, logs, or exports. |
| <code>Enter</code> while working | Steer after the active assistant turn's tool work completes and before the next model invocation. | Use it to correct scope or assumptions promptly.               |
| <code>Alt+Enter</code>           | Queue a follow-up after the current unit finishes.                                                | Do not mix an unrelated goal into the active unit.             |
| <code>/session</code>            | Inspect the active session identity.                                                              | A session is not repository state.                             |
| <code>/tree</code>               | Explore or return to an alternative inside one session file.                                      | It does not isolate filesystem writes.                         |
| <code>/fork</code>               | Start a new session from an earlier user prompt.                                                  | Verify the repository state separately.                        |
| <code>/clone</code>              | Copy the complete active branch into an independent session.                                      | Use a Git worktree as well when writes must be isolated.       |
| <code>/compact</code>            | Compress at a semantic milestone.                                                                 | Externalize durable decisions before compaction.               |

<!-- sync:root-patterns -->

<a id="advanced-patterns"></a>

## Use the high-leverage patterns

### Resume a long task without trusting chat history

Before compaction or handoff, write a durable checkpoint outside the session:

```text
/session

Goal and accepted scope:
BASE_COMMIT and current diff:
Decisions and invariants:
Checks passed and failed:
External effects and idempotency keys:
Open questions:
Exact next action:
Rollback point:

/compact Preserve the accepted scope, decisions, invariants, failed checks,
external-effect identifiers, next action, and rollback point above.
```

After resume, compare the model's restatement with the checkpoint and inspect
Git and external state independently. Use <code>/clone</code> for an independent
session continuation and <code>/tree</code> for alternatives inside one session;
neither restores files.

### Parallelize only independent write sets

Resolve every placeholder and validate that the worktree paths and branch names
do not already exist:

```bash
git status --short
git rev-parse HEAD
git worktree add WORKTREE_A -b BRANCH_A BASE_COMMIT
git worktree add WORKTREE_B -b BRANCH_B BASE_COMMIT
git worktree list
```

Give each worktree one Pi session, one goal, one owner, one write set, and one
check set. Serialize shared lockfiles, schemas, generated files, databases,
ports, or external state. Worktrees isolate Git work units; they are not OS
sandboxes.

### Produce a one-shot read-only inspection

For one final read-only analysis, use Print mode. For a machine-readable event
stream, switch to <code>--mode json</code> and consume stdout as JSON Lines while
draining stderr separately:

```bash
pi --no-approve --no-context-files --no-extensions --no-skills \
  --no-prompt-templates --no-themes --no-session \
  --tools read,grep,find,ls --provider PROVIDER --model MODEL \
  -p "Inspect the requested scope without invoking repository commands. Return the findings and file-based evidence."
```

The read-only tool set cannot execute tests, linters, builds, or any other
repository command, so this is an inspection rather than a CI check. When a CI
job must execute commands, the CI host must provide and contain that authority.
It also owns timeout, retry, cancellation, exit interpretation, retention, and
cleanup. Use RPC or the SDK when the controller needs bidirectional long-lived
control.

<!-- sync:root-customize -->

<a id="pi-surfaces"></a>

## Customize or integrate Pi

### Use the smallest primitive that solves the problem

| Need                                     | Start with                                       | Move up only when…                                                                 |
| ---------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Stable repository facts and commands     | <code>AGENTS.md</code>                           | The behavior is task-specific or needs explicit invocation.                        |
| Reusable explicit text                   | Prompt Template                                  | You need references, helper scripts, or an on-demand workflow.                     |
| On-demand workflow                       | Skill                                            | You need runtime events, a custom tool, command, UI, provider, policy, or routing. |
| Runtime behavior                         | Extension                                        | You need to distribute several resources together.                                 |
| Shared bundle                            | Pi package                                       | You have reviewed every bundled executable resource and its lifecycle.             |
| Terminal appearance only                 | Theme                                            | The package contains executable code or dependencies beyond presentation.          |
| OS/process isolation or parallel writers | External container, VM, sandbox, or Git worktree | Never substitute prompt wording or a tool list for the required boundary.          |

Start with the official [Prompt Template](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md),
[Skill](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md),
[Extension](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md),
[Theme](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/themes.md), and
[package](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)
guides. For executable code, use the Extension-development scenario above to
place its minimal example in a disposable fixture before adapting it.

### Choose the interface from who owns the lifecycle

| Your program needs…                                        | Use                   | The owner must handle…                                                                                |
| ---------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| Human-supervised coding                                    | Interactive TUI       | Trust, resources, tools, session, review, and interruption.                                           |
| One prompt and one final result                            | Print <code>-p</code> | Exit status, timeout, result validation, and session policy.                                          |
| A one-way machine event stream                             | JSON mode             | JSONL parsing, stderr, ordering, partial/failure events, backpressure, and retention.                 |
| Bidirectional control from a non-Node host or alternate UI | CLI RPC               | Child startup, LF framing, correlation, events, cancellation, restart, and shutdown.                  |
| Full in-process ownership in TypeScript                    | SDK                   | Model/resources/tools, sessions, subscriptions, persistence, credentials, cancellation, and disposal. |

The RPC/SDK scenario above contains the v0.83.0 lifecycle examples. Do not
treat RPC as JSON mode, and do not assume either interface is stable across
unpinned upgrades.

### Know which package you actually need

| Package                                                                                                                                                            | Choose it when                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [<code>@earendil-works/pi-coding-agent</code>](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md) | You want the ready-made CLI, sessions, resources, tools, TUI, Print, JSON, RPC, or SDK surface. |
| [<code>@earendil-works/pi-ai</code>](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/README.md)                     | You only need multi-provider model, streaming, message, tool-call, and usage primitives.        |
| [<code>@earendil-works/pi-agent-core</code>](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/README.md)          | You are building your own agent runtime and state/event/tool loop.                              |
| [<code>@earendil-works/pi-tui</code>](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/tui/README.md)                   | You are building terminal components or a custom terminal UI.                                   |

<!-- sync:root-ecosystem -->

<a id="ecosystem-exploration"></a>

## Explore ecosystem implementations

The official capabilities below can be used now. This repository currently has
**zero hands-on-verified or featured third-party recommendations**, so the
community sections are an exploration map, not a copy-now installation guide.
Use them to find patterns and trial leads, then reproduce behavior inside your
own boundary before adoption.

### Official building blocks

<!-- resource:official-pi -->

- [Pi](https://github.com/earendil-works/pi) - Canonical source, releases, tests, package code, security boundaries, and contribution policy.

<!-- resource:official-docs -->

- [Documentation](https://pi.dev/docs/latest) - Current usage, provider, session, resource, security, terminal, JSON, RPC, and SDK guides.

<!-- resource:official-releases -->

- [Releases](https://github.com/earendil-works/pi/releases) - Versioned notes and artifacts for choosing and preserving a reproducible baseline.

<!-- resource:official-extension-examples -->

- [Extension Examples](https://github.com/earendil-works/pi/tree/v0.83.0/packages/coding-agent/examples/extensions) - Reviewable implementations of lifecycle hooks, tools, UI, providers, policy, and tool routing.

<!-- resource:official-package-catalog -->

- [Package Catalog](https://pi.dev/packages) - Broad package discovery whose entries still require source, license, authority, compatibility, and hands-on review.

<!-- resource:official-rfcs -->

- [Pi RFCs](https://rfc.earendil.com/keyword/pi/) - Design proposals whose state must be checked against tagged implementation and releases.

### Source-reviewed projects to learn from

The following pinned projects were inspected on 2026-07-31 for purpose, source,
license, dependencies, authority/data flow, tests, CI, and obvious risks. The
maintainer has **not** installed or run them. Study the pattern, not the trust
decision:

- [Gondolin](https://github.com/earendil-works/gondolin/tree/29fa74d802112f29c720990aced26165e0d57d84) @ <code>29fa74d</code> - **Study:** routing Pi tools through a micro-VM boundary. **Verify first:** mount, network, same-user process, and denial-of-service exclusions.
- [pi-subagents](https://github.com/nicobailon/pi-subagents/tree/89de10e4bc8895e7948704c38620a5b35ddcd17e) @ <code>89de10e</code> - **Study:** child-agent, chain, background, and worktree orchestration. **Verify first:** child authority, inherited environment, concurrency, cost, retained state, and writer ownership.
- [pi-crew](https://github.com/baphuongna/pi-crew/tree/c694ebfd5d0f49d9479870d6919be4bbf9738291) @ <code>c694ebf</code> - **Study:** durable parallel workflow orchestration. **Verify first:** child authority, inherited environment, concurrency, cost, retained state, and writer ownership.
- [pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter/tree/6a3e840219a49f9ae5350542b7a707aa1e83fedf) @ <code>6a3e840</code> - **Study:** lazy proxy, direct server, OAuth, packaging, and conformance paths. **Verify first:** every server command, secret resolver, credential, and shared multiplexer.
- [pi-web-access](https://github.com/nicobailon/pi-web-access/tree/c702b3be11bfbc832489eb7cfe31d9bbbbb2cc27) @ <code>c702b3b</code> - **Study:** a composed search, fetch, PDF, repository, and video surface with provider fallbacks. **Verify first:** query/content egress, cookies, redirects/SSRF, size, retention, timeout, and offline failure.
- [pi-agent-browser-native](https://github.com/fitchmultz/pi-agent-browser-native/tree/211a012c9b199d758768e8ba729f35e11e661f65) @ <code>211a012</code> - **Study:** structured Pi tools over a separate browser CLI. **Verify first:** use a dedicated test profile; inspect cookies, clipboard, downloads, screenshots, and CLI pairing.
- [Plannotator](https://github.com/backnotprop/plannotator/tree/80065c84624e80bf60dc1ad862c17c3ea3f2bd80) @ <code>80065c8</code> - **Study:** human review surfaces for plans, documents, HTML, and diffs. **Verify first:** disable optional sharing for sensitive trials; inspect link, history, metadata, endpoint, and retention.
- [pi-hermes-memory](https://github.com/chandra447/pi-hermes-memory/tree/5aafe2ca04cb55b62204b159389c8381894038ce) @ <code>5aafe2c</code> - **Study:** cross-session search, durable memory, and model-assisted consolidation. **Verify first:** privacy lifetime, stored prompt injection, scanner limits, SQLite ABI, and memory rewrites.
- [pi-coding-agent for Emacs](https://github.com/dnouri/pi-coding-agent/tree/df5ce0a176ce634ccb4883042c415a74a5637c37) @ <code>df5ce0a</code> - **Study:** a tested Emacs frontend over RPC and headless trust handling. **Verify first:** replace the documented default approval policy for unknown repositories and review shared auth storage.
- [pi-lens](https://github.com/apmantza/pi-lens/tree/a4baa3a94ecaf71f8af9f48ab27c8d7f6da8fdb2) @ <code>a4baa3a</code> - **Study:** LSP, lint, format, AST, and tree-sitter tools composed behind Pi. **Verify first:** downloads, optional installs, file mutation, and version-specific compatibility.
- [braintrust-pi-extension](https://github.com/braintrustdata/braintrust-pi-extension/tree/c8f1aea1236f47c2681c0104be143b832bc9058c) @ <code>c8f1aea</code> - **Study:** tracing sessions, turns, model calls, tools, and compaction. **Verify first:** raw input/context/output/tool egress, redaction, sampling, retention, deletion, and failure isolation.
- [gentle-pi](https://github.com/Gentleman-Programming/gentle-pi/tree/3b6b3d2183dbbc4d45b16a1a0f127728c0a2435c) @ <code>3b6b3d2</code> - **Study:** a broad SDD/TDD layer composing specification, testing, review, subagents, and policy. **Verify first:** native postinstall, unstable surfaces, broad companion authority, and same-user threat-model exclusions.

The complete entry points, test/CI notes, and trial questions live in the
[source-review watchlist](docs/research/watchlist.md).

### Explore next, but do not copy blindly

All thirteen links below are only <code>preliminary-evidence-collected</code>, <code>awaiting-source-review</code>, and <code>not-evaluated</code>:

| Need                                    | Leads                                                                                                                                                                                                                                                             |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Remote, messaging, or mobile control    | [OpenClaw](https://github.com/openclaw/openclaw), [Polpo](https://github.com/pugliatechs/polpo), [piclaw](https://github.com/rcarmo/piclaw), [pi-mobile](https://github.com/p1rallels/pi-mobile)                                                                  |
| Alternate distributions or broad suites | [oh-my-pi](https://github.com/can1357/oh-my-pi), [Senpi](https://github.com/code-yeongyu/senpi), [my-pi](https://github.com/spences10/my-pi)                                                                                                                      |
| VS Code, Neovim, ACP, or alternate UI   | [pi-vscode-extension](https://github.com/Zetaphor/pi-vscode-extension), [pi-vscode](https://github.com/pithings/pi-vscode), [pi-acp](https://github.com/svkozak/pi-acp), [acpx](https://github.com/openclaw/acpx), [pi-nvim](https://github.com/carderne/pi-nvim) |
| GitHub automation                       | [pi-coding-agent-action](https://github.com/shaftoe/pi-coding-agent-action)                                                                                                                                                                                       |

OpenClaw is included because pinned evidence records historical direct embedding
of Pi packages, later runtime internalization, and retained Pi provenance. That
does **not** establish current Pi v0.83 compatibility or complete current
source, license, authority, data-flow, test, or maintenance status. See the
[candidate registry](data/discovery-candidates.json) for its five-source chain
and all 28 immutable candidate evidence links.

Three records are intentionally deferred rather than presented as current
adoption paths: [pi-extensions](https://github.com/tmustier/pi-extensions)
needs item-by-item review; [pi-skills](https://github.com/badlogic/pi-skills)
uses legacy scope and heterogeneous high-authority workflows; and
[pi-share-hf](https://github.com/badlogic/pi-share-hf) is blocked by license,
legacy-scope, and public-sharing/privacy concerns.

### Trial and remove one project-level package in a disposable fixture

The commands below are a **placeholder structure, not an adoption recommendation
for any named third-party package**. Review the exact artifact, install scripts,
dependencies, entry points, data flow, tests, and removal path first. In a
disposable local fixture, choose **one** pinned source form that matches the
artifact you reviewed, and replace every placeholder:

```bash
pi install npm:@scope/name@1.2.3 -l --approve
pi install git:github.com/OWNER/REPOSITORY@FULL_COMMIT -l --approve
```

After the bounded trial, run only the removal form matching the source you
installed, then inspect leftover files, processes, credentials, settings,
sessions, and external data:

```bash
pi remove npm:@scope/name -l --approve
pi remove git:github.com/OWNER/REPOSITORY -l --approve
```

Use the isolated package-trial recipe and hands-on review template listed
above; catalog presence, source review, tests, CI, or a declared license is not
a substitute for your own trial.

<!-- sync:root-troubleshoot -->

<a id="failure-recovery"></a>

## Recover by changing one variable

First preserve the original error and stop destructive, credential-bearing, or
repeated external work. Record Pi/Node version, cwd, Git state, provider/model,
mode, trust choice, tools, loaded resources, session, and the failing phase.
Then use the smallest comparison that changes one variable:

| Step | Change one thing                                           | If the result changes, inspect…                                      |
| ---: | ---------------------------------------------------------- | -------------------------------------------------------------------- |
|    1 | Use a fresh empty working directory.                       | Repository files, context, resources, or path assumptions.           |
|    2 | Use Print mode instead of the TUI.                         | Terminal rendering, key handling, or interactive Extension UI.       |
|    3 | Pin provider, model, and thinking.                         | Catalog alias, capability, transport, or model-specific behavior.    |
|    4 | Add <code>--no-session</code>.                             | Stored history, branches, compaction, or legacy tool-call arguments. |
|    5 | Add <code>--no-context-files --no-approve</code>.          | Context instructions or protected project resources.                 |
|    6 | Disable Extensions, Skills, Prompt Templates, and Themes.  | One optional resource or an interaction between them.                |
|    7 | Add back one artifact at one immutable ref.                | That package/resource or its lifecycle.                              |
|    8 | Use only built-in read tools.                              | Bash/write behavior or a custom/overridden tool.                     |
|    9 | Reduce to one minimal input, repository, or file.          | The smallest reproducible trigger.                                   |
|   10 | Compare a clean profile or the previous pinned Pi version. | User configuration state or a regression.                            |

Start from the [symptom router](docs/troubleshooting.md#symptom-router), or run
the [sterile baseline](docs/troubleshooting.md#sterile-baseline) when the normal
profile itself may be involved. Do not change cwd, model, provider, prompt,
session, packages, and tools at once; making the symptom disappear is not the
same as identifying its cause.

Stop local diagnosis and use the appropriate private incident path for
credential exposure, destructive behavior outside the target, production
mutation, boundary bypass, or data whose safe handling is uncertain.

<!-- sync:root-reference -->

## Reference library

### Read by outcome

| Need                                                                    | Open                                             |
| ----------------------------------------------------------------------- | ------------------------------------------------ |
| One of twelve complete operational recipes                              | [Scenario cookbook](docs/scenario-cookbook.md)   |
| Intake, risk, ownership, checkpoints, verification, and delivery        | [Operating playbook](docs/operating-playbook.md) |
| All thirty rationale/action/verification practices                      | [Practice guide](docs/practice-guide.md)         |
| A filled teaching record with failure branches                          | [Worked example](docs/worked-example.md)         |
| Architecture, resources, trust, sessions, and interface decisions       | [Architecture guide](docs/architecture.md)       |
| Provider, package, session, terminal, JSON/RPC/SDK, or upgrade failures | [Troubleshooting](docs/troubleshooting.md)       |
| Third-party source, authority, data-flow, and lifecycle review          | [Extension review](docs/extension-review.md)     |
| Every document and template in the repository                           | [Documentation map](docs/README.md)              |

<details>
<summary><strong>Evidence and ecosystem research snapshot</strong></summary>

The operational guidance is kept traceable without making the research process
the main learning path:

| Checked-in evidence            | Snapshot                                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Resource registry              | 28 records: 6 official, 7 directory/related, 12 source-reviewed community, and 3 deferred community records.                        |
| Discovery queue                | 13 preliminary candidates with 28 immutable evidence links.                                                                         |
| Coverage map                   | 25 capability categories, 11 architecture types, 13 Pi relationship types, and no hands-on-verified third-party representative yet. |
| Stable implementation baseline | Pi v0.83.0 at <code>845d6ff1f6643aba440341cce877ce1c43ebbc39</code>.                                                                |
| Dates                          | Source-review snapshot 2026-07-31; discovery-candidate snapshot 2026-08-01, Asia/Singapore.                                         |

Use the [official source map](docs/research/source-map.md) for pinned primary
sources, the [evidence ledger](docs/research/evidence-ledger.md) for P01–P30
traceability, the [coverage matrix](docs/research/coverage-matrix.md) for
capability gaps, the [landscape](docs/research/landscape.md) for the itemized
ecosystem, and the [methodology](docs/research/methodology.md) or
[discovery protocol](docs/research/discovery-protocol.md) only when auditing or
updating the research.

Source review is not hands-on verification, safety certification, compatibility
proof, or endorsement. There are intentionally zero featured third-party
recommendations until named human maintainers provide reproducible trials and
an editorial promotion decision.

</details>

<a id="related-lists"></a>

### Related discovery lists

These projects answer adjacent package and ecosystem discovery questions.

<!-- resource:related-awesome-pi -->

- [awesome-pi](https://github.com/BubblePtr/awesome-pi) - Active bilingual directory of Pi packages and ecosystem resources.

<!-- resource:related-automated-directory -->

- [awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent) - Automated, frequently refreshed directory optimized for broad discovery.

<!-- resource:related-package-index -->

- [Pi Package Index](https://github.com/getpipher/pi-package-index) - Unofficial daily npm index with searchable maintenance metadata and a public JSON API.

<!-- resource:related-ecosystem-wiki -->

- [pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki) - Architecture, comparison, and ecosystem synthesis whose secondary claims should be checked against primary sources.

<!-- sync:root-contributing -->

### Contributing

Read the [contribution guide](CONTRIBUTING.md) before proposing a practice,
recipe, or ecosystem lead. Contributions must explain the reader outcome,
separate sourced facts from direct execution, disclose relationships and AI
assistance, provide reproducible evidence, and update both languages. Content
is released under CC0-1.0.

For changes to this repository itself:

```bash
npm ci --ignore-scripts
npm run check
npm run check:awesome
```

These checks validate the documentation, bilingual structure, registries,
research data, links, and validators; they do not claim that Pi recipes were
executed.

<!-- sync:root-footnotes -->

### Notes

This independent community repository is not maintained by or affiliated with
Earendil Works. Pi and linked project names belong to their respective owners.

Dynamic package counts, provider behavior, model catalogs, and current
documentation may have changed since the dated snapshots. Older material may
use <code>badlogic/pi-mono</code>, <code>earendil-works/pi-mono</code>, or <code>@mariozechner/\*</code>; resolve the current repository, publisher,
package scope, peer dependencies, and install target before following it.

The central Awesome project's
[list-creation guide](https://github.com/sindresorhus/awesome/blob/main/create-list.md)
and
[current pull-request template](https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md)
reject AI-generated lists and fully AI-generated pull requests. This
AI-assisted preview requires substantive human testing, selection, rewriting,
bilingual review, and the required public maintenance period before it can
honestly claim central-list eligibility.
