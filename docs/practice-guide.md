[English](./practice-guide.md) | [简体中文](./practice-guide.zh-CN.md)

# End-to-end Pi practice guide

<!-- sync:practice-intro -->

These practices turn Pi's deliberately small coding harness into a controlled,
repeatable workflow. They are recommendations, not claims that Pi enforces the
behavior. Each practice has four parts:

- **Why** explains the failure mode.
- **Do** gives an executable procedure.
- **Verify** supplies an observable completion check.
- **Evidence** points to the numbered claim in the
  [evidence ledger](research/evidence-ledger.md).

The baseline is Pi v0.83.0. Anything newer is marked `main-only`.

## Before the task

<!-- sync:practice-baseline -->

<a id="baseline-and-recovery"></a>

<!-- sync:P01 -->

### P01 — Pin and record the execution envelope

**Why:** Pi, its model catalog, providers, extensions, and models evolve
independently. “It worked in Pi” is not enough information to reproduce a run.

**Do:**

1. Record `pi --version`, `node --version`, operating system, terminal, working
   directory, install method, and the relevant repository commit.
2. Record the selected `provider/model`, thinking level, transport, allowed
   tools, loaded packages, and whether project resources were approved.
3. For automation, save this metadata beside the output rather than only in a
   terminal transcript. Start with the
   [run manifest template](../templates/run-manifest.md).

**Verify:** Another person can reconstruct the command and identify every
version-sensitive input without asking what “latest” meant.

**Evidence:** [E01](research/evidence-ledger.md#e01).

<!-- sync:P02 -->

### P02 — Start from a recoverable version-control state

**Why:** Pi's tools can change many files quickly. A pre-existing dirty tree
makes attribution and rollback ambiguous.

**Do:**

1. Inspect `git status --short` and the current branch.
2. Commit, stash, or explicitly inventory pre-existing changes.
3. Create a task branch or worktree for risky or parallel work.
4. State that user-owned changes must be preserved.

**Verify:** The pre-task diff is known, and reverting only the agent's changes
does not discard unrelated work.

**Evidence:** [E02](research/evidence-ledger.md#e02).

<!-- sync:practice-trust -->

<a id="trust-and-containment"></a>

<!-- sync:P03 -->

### P03 — Put untrusted or unattended work behind an OS boundary

**Why:** Pi has no built-in filesystem, process, network, credential, or
per-command permission sandbox. It runs with the permissions of the account
that starts it.

**Do:** Run untrusted repositories, generated code, and unattended agents in a
container, VM, micro-VM, remote sandbox, or policy-controlled sandbox. Mount
only the task files, expose only task credentials, and restrict outbound
network access where practical.

**Verify:** From inside the environment, test that unrelated home files,
credential stores, host sockets, and privileged network destinations are not
reachable.

**Evidence:** [E03](research/evidence-ledger.md#e03).

<!-- sync:P04 -->

### P04 — Treat Project Trust as a loading gate, not a sandbox

**Why:** Trusting a project allows project settings and resources to load and
may execute extensions or install packages. Declining trust does not constrain
built-in tools, and `AGENTS.md`/`CLAUDE.md` still enter model context unless
context loading is disabled.

**Do:**

1. Inspect `.pi/`, `.agents/skills/`, `.pi/settings.json`, and context files
   before approval.
2. Use `--no-approve` for a one-run protected-resource denial.
3. Add `--no-context-files` (`-nc`) when even repository instructions are
   untrusted or irrelevant.
4. Restart after changing a saved `/trust` decision; the current session is not
   reloaded.

**Verify:** Run `pi --no-approve --no-context-files ...` and confirm the task
does not depend on skipped project resources.

**Evidence:** [E04](research/evidence-ledger.md#e04).

<!-- sync:P05 -->

### P05 — Minimize credentials, mounts, and network reach

**Why:** Any loaded extension, invoked executable, or model-directed tool can
act with the Pi process's ambient access. “The model probably will not use it”
is not a security control.

**Do:** Use scoped, short-lived credentials; remove unrelated environment
variables; mount credentials read-only only when possible; separate personal
and automation accounts; and allowlist required network destinations.
Distinguish disabling telemetry from disabling all outbound model/provider
traffic.

**Verify:** Enumerate the environment and mounted paths available to the run,
then revoke or rotate the task credential after a high-risk trial.

**Evidence:** [E05](research/evidence-ledger.md#e05).

<!-- sync:P06 -->

### P06 — Inspect, pin, and trial packages before adoption

**Why:** A Pi package can bundle executable extensions, skills that direct tool
use, and npm dependencies. Git package reconciliation can run dependency
installation, so package review is also supply-chain review.

**Do:**

1. Read the package manifest, Pi resource declarations, lockfile, lifecycle
   scripts, transitive dependencies, and extension entry points.
2. Prefer a release tag, exact npm version, or full Git commit over a moving
   branch.
3. Trial it with test credentials in an isolated disposable environment.
4. Record the reviewed ref and artifact integrity value when available.

**Verify:** Reinstallation resolves the same ref and dependency graph, and the
trial shows every expected file, process, network, and credential interaction.

**Evidence:** [E06](research/evidence-ledger.md#e06).

## Task and context design

<!-- sync:P07 -->

### P07 — Keep hierarchical context concise and reviewable

**Why:** Pi discovers `AGENTS.md` or `CLAUDE.md` from global, ancestor, and
current-directory locations. Large or conflicting files consume context and
make instruction precedence hard to audit.

**Do:** Put stable organization-wide rules globally, repository conventions at
the root, and narrow component rules near the relevant code. Include only
commands, constraints, architecture facts, and definitions that change how the
task should be performed.

**Verify:** A contributor can explain which context files apply to a target
file, and each instruction remains true across multiple tasks.

**Evidence:** [E07](research/evidence-ledger.md#e07).

<!-- sync:P08 -->

### P08 — Begin with a testable task brief

**Why:** A broad prompt invites scope drift and makes “done” subjective.

**Do:** State the goal, current behavior, desired behavior, in-scope paths,
out-of-scope changes, constraints, acceptance checks, and required handoff.
Use the [task brief template](../templates/task-brief.md).

**Verify:** Each proposed edit maps to the goal, and completion can be decided
from named commands or observable outcomes.

**Evidence:** [E08](research/evidence-ledger.md#e08).

<!-- sync:P09 -->

### P09 — Reconnoiter read-only, then expand capabilities

**Why:** The default coding tool set includes `read`, `write`, `edit`, and
`bash`. Early mutation is unnecessary while the problem and repository shape
are still unknown.

**Do:** Start review, triage, and discovery with:

```bash
pi --no-approve --no-context-files --no-extensions --no-skills \
  --no-prompt-templates --no-themes --no-session \
  --tools read,grep,find,ls -p "Map the relevant code and propose checks."
```

After reviewing the map, begin a separate write-capable run or deliberately
expand the allowlist. Extensions can override a built-in tool under the same
name, which is why this baseline disables extension discovery. An allowlist
constrains registered Pi tools; it is not an OS sandbox around extension code.

**Verify:** The first pass changes no project/repository files, and the write
phase names the minimum additional capabilities it needs.

**Evidence:** [E09](research/evidence-ledger.md#e09).

<!-- sync:P10 -->

### P10 — Target context and keep noise out of the model transcript

**Why:** Broad discovery, generated files, and long command output consume
context that should be reserved for decisions and relevant code.

**Do:** Reference relevant files explicitly with `@path`, ask for scoped reads,
and run local inspection commands with `!!command` when their output should not
be sent to the model. Summarize only the result that affects the task. Never use
`!!` to hide evidence the model must reason about. The command still runs with
local user permissions and its excluded output can remain in the session/export;
`!!` is context control, not secret storage.

**Verify:** The transcript contains the decisive source excerpts and results,
not thousands of unrelated lines.

**Evidence:** [E10](research/evidence-ledger.md#e10).

<!-- sync:P11 -->

### P11 — Choose the least powerful customization primitive

**Why:** Context files, prompt templates, skills, extensions, packages, and
integration interfaces answer three different questions. Treating them as one
power ladder confuses capability, distribution, and host ownership. Runtime
power matters within an axis because it adds code execution, lifecycle, and
upgrade surface.

**Do:** Make three independent decisions:

1. **Capability axis:** use `AGENTS.md` for stable repository guidance, a
   prompt template for explicitly expanded reusable text, a skill for an
   on-demand workflow/scripts/references, and an extension only for runtime
   events, tools, UI, policy, or providers.
2. **Distribution axis:** keep a resource in the repository or user directory
   when local ownership is enough; use a Pi package only when the selected
   resources need npm/Git/local-package distribution and lifecycle management.
3. **Integration axis:** use interactive mode for supervised work, print for a
   one-shot final answer, JSON for one-way event consumption, RPC for a
   controlling process, and the SDK for in-process TypeScript ownership.

Common combinations are `AGENTS.md + prompt template` for repository review,
`skill + package` for a distributed team workflow, `extension + package` for a
shared runtime tool, RPC for a Python controller, and the SDK for a TypeScript
host application.

**Verify:** The choice is justified separately on all applicable axes, and a
lower-authority option on the same axis cannot express the requirement cleanly.

**Evidence:** [E11](research/evidence-ledger.md#e11).

## During the task

<!-- sync:P12 -->

### P12 — Give one session one coherent goal

**Why:** A long-lived session accumulates assumptions, tool results, and
compaction summaries. Unrelated goals make later reasoning and rollback harder
to interpret.

**Do:** Name important sessions, keep a single acceptance boundary per session,
and start `/new`, `/fork`, or `/clone` when the goal, risk boundary, or
deliverable changes materially.

**Verify:** The session title and opening brief still describe every in-scope
change at handoff.

**Evidence:** [E12](research/evidence-ledger.md#e12).

<!-- sync:P13 -->

### P13 — Use steering and follow-up messages intentionally

**Why:** A steering message is delivered after the current assistant turn's
tool calls and before the next model call. A follow-up waits until the agent has
no more tool calls or steering work. Confusing them can interrupt the wrong
phase or delay urgent corrections.

**Do:** Use **Enter** to steer or replace the active direction, and
**Alt+Enter** for a later task that should not disturb current work. Use
`one-at-a-time` delivery unless several queued instructions form one coherent
update.

**Verify:** A correction arrives before the next reasoning step, while a
non-urgent addition waits until the current task is complete.

**Evidence:** [E13](research/evidence-ledger.md#e13).

<!-- sync:P14 -->

### P14 — Use tree, fork, and clone for different intentions

**Why:** The three operations look similar but have different provenance:
`/tree` changes the active branch inside one session file; `/fork` starts a new
file from an earlier user prompt; `/clone` copies the current active branch to a
new file.

**Do:** Use `/tree` for reversible exploration, `/fork` to retry from a prior
decision point with an edited prompt, and `/clone` to preserve the whole current
path before an independent continuation.

**Verify:** The new branch or file starts at the intended decision point and the
original remains available. Separately verify the filesystem and Git state:
none of these session operations restores files.

**Evidence:** [E14](research/evidence-ledger.md#e14).

<!-- sync:P15 -->

### P15 — Compact at semantic boundaries and externalize durable state

**Why:** Compaction is lossy. Although the JSONL file retains original entries,
the model continues from a generated summary and recent messages.

**Do:** Before manual compaction, finish a coherent unit, run relevant checks,
and write decisions, invariants, unresolved questions, and next steps into
version-controlled files. Provide custom `/compact` instructions when the
default summary would miss domain-specific state.

**Verify:** After compaction, ask the agent to restate constraints and the next
check; compare the answer with the durable task record.

**Evidence:** [E15](research/evidence-ledger.md#e15).

<!-- sync:P16 -->

### P16 — Scrub sessions before export or sharing

**Why:** Session JSONL and HTML exports can contain prompts, file content, tool
output, filesystem paths, model metadata, and credentials accidentally printed
by commands. Share links create externally accessible artifacts.

**Do:** Inspect the source session or export, remove secrets and private data,
prefer the minimum necessary excerpt, and understand the visibility and
revocation behavior of the chosen sharing service.

**Verify:** Search the artifact for credential patterns, private hostnames,
personal paths, internal repository names, and sensitive source fragments
before sending the link.

**Evidence:** [E16](research/evidence-ledger.md#e16).

## Models, providers, and reliability

<!-- sync:P17 -->

### P17 — Scope and record model-dependent behavior

**Why:** Tool schemas, reasoning blocks, images, context windows, streaming,
cost accounting, and authentication differ by provider and model.

**Do:** Reproduce failures with an explicit `provider/model`, thinking level,
transport, authentication method category, and refreshed model catalog time.
Do not publish tokens or account identifiers.

**Verify:** The same configuration can be selected explicitly and its
capabilities can be checked against the model catalog.

**Evidence:** [E17](research/evidence-ledger.md#e17).

<!-- sync:P18 -->

### P18 — Treat cross-provider handoff as best-effort

**Why:** Pi converts messages between provider formats, but reasoning,
provider-specific metadata, tool-call conventions, and unsupported content
cannot always round-trip losslessly.

**Do:** Finish the current unit, save important state in files, then switch
provider/model. Start a new or cloned session when fidelity matters more than
continuity, and retest any provider-specific tool behavior.

**Verify:** The new model can restate the task and pass a small tool-call smoke
test without relying on hidden provider-specific state.

**Evidence:** [E18](research/evidence-ledger.md#e18).

<!-- sync:P19 -->

### P19 — Retry at the layer that understands the failure

**Why:** Pi has agent-level retry policy and optional provider/SDK retries.
Stacking both can multiply latency and may hide quota or usage-limit errors from
the agent.

**Do:** Keep provider retries at the documented default of `0` unless a
provider-specific case requires them. Bound agent retries, backoff, and maximum
delay. Classify authentication, quota, context overflow, timeout, transport,
and deterministic tool failures before retrying.

**Verify:** A forced failure produces a finite, observable retry sequence and
ends with the original error category intact.

**Evidence:** [E19](research/evidence-ledger.md#e19).

<!-- sync:P20 -->

### P20 — Bound commands and design for truncated output

**Why:** Long-running commands can hang a task, and built-in tools truncate
large results. A visually complete-looking excerpt may be only the head or tail
of the real output.

**Do:** Add tool-native timeouts, filters, deterministic sampling, and output
files. Check truncation metadata and continuation hints. Keep summary output in
context and preserve full logs outside it when needed.

**Verify:** A deliberately oversized or stalled command is abortable, and the
workflow can locate the full result or request the next range.

**Evidence:** [E20](research/evidence-ledger.md#e20).

## Extensions and packages

<!-- sync:P21 -->

### P21 — Prototype with instructions before runtime code

**Why:** Many apparent extension needs are reusable prompts or procedural
knowledge. Runtime code adds an in-process trust boundary and compatibility
surface.

**Do:** Prove the workflow as a prompt template or skill first. Promote it to an
extension only when it needs events, a custom tool, dynamic resource discovery,
provider registration, or interactive UI.

**Verify:** The extension proposal names the runtime capability unavailable to
the prompt/skill version.

**Evidence:** [E21](research/evidence-ledger.md#e21).

<!-- sync:P22 -->

### P22 — Make extension lifecycle explicit and idempotent

**Why:** Extension factories run during loading; sessions can start, switch,
fork, reload resources, or shut down. Leaked processes, listeners, timers, and
temporary files accumulate across these transitions.

**Do:** Register lightweight handlers in the factory. Initialize session-bound
resources on `session_start`, handle mode and session switches, and clean up on
`session_shutdown`. Make setup and cleanup safe to call more than once.

**Verify:** Repeated reload/start/shutdown cycles leave no orphan process,
duplicate handler, open descriptor, stale status, or temporary artifact.

**Evidence:** [E22](research/evidence-ledger.md#e22).

<!-- sync:P23 -->

### P23 — Build honest, bounded, composable custom tools

**Why:** Tool descriptions and schemas are the model's API contract. Results
also enter context, and tools may execute in parallel unless sequential
behavior is declared.

**Do:**

1. Give the tool one clear responsibility and an exact schema; use closed
   string enums where required.
2. Declare side effects, prerequisites, failure conditions, and output limits.
3. Mark it sequential when ordering or shared mutable state requires it.
4. Apply line/byte truncation and return continuation metadata or a full-output
   path.
5. Throw on failure instead of returning success-shaped error text.

**Verify:** Test valid, invalid, concurrent, oversized, cancelled, and failing
calls; confirm the model can distinguish each outcome.

**Evidence:** [E23](research/evidence-ledger.md#e23).

<!-- sync:P24 -->

### P24 — Design Pi packages as executable supply-chain artifacts

**Why:** A package manifest controls resource discovery and dependency
installation. Incorrect dependency placement, broad globs, or moving refs can
break consumers or execute unexpected code.

**Do:** Declare only intended Pi resources; keep runtime imports in
`dependencies`, compatible Pi host APIs in the documented dependency form,
commit a lockfile where applicable, minimize lifecycle scripts, pin Git refs,
and document install, update, removal, data storage, and rollback.

**Verify:** Install the exact artifact into a clean environment with
`--ignore-scripts` where the distribution method supports it, inspect what
remains unavailable, then perform a controlled normal install and smoke test.

**Evidence:** [E24](research/evidence-ledger.md#e24).

## Automation and embedding

<!-- sync:P25 -->

### P25 — Select the interface from the ownership boundary

**Why:** Interactive, print, JSON, RPC, and SDK modes differ in lifecycle and
control. Parsing terminal UI when a machine protocol exists creates fragile
automation.

**Do:** Use interactive mode for supervised work, print mode for a one-shot
final answer, JSON mode for event consumption, the v0.83.0 released JSONL RPC
for a non-Node controller or alternate UI, and the SDK when a TypeScript process
owns the full runtime. Add `--no-session` when a print/JSON run must be
ephemeral; non-interactive mode alone does not imply that.

**Verify:** The integration consumes a documented machine interface and does
not scrape ANSI terminal output.

**Evidence:** [E25](research/evidence-ledger.md#e25).

<!-- sync:P26 -->

### P26 — Make non-interactive policy explicit and fail closed

**Why:** Print, JSON, and RPC modes cannot show the Project Trust prompt.
Defaults may silently skip project resources or, if globally configured, load
them.

**Do:** Pass an explicit trust override, tool allowlist, model, working
directory, session behavior, and context-file choice. Check the precondition
that the Git tree and required files match expectations. Treat missing
resources, unknown model selection, and a dirty destination as errors.

**Verify:** The same command behaves identically under a clean user profile,
and an untrusted resource or unmet precondition stops the job.

**Evidence:** [E26](research/evidence-ledger.md#e26).

<!-- sync:P27 -->

### P27 — Own SDK and RPC lifecycle completely

**Why:** Embedding transfers responsibility for cancellation, correlation,
cleanup, credentials, sessions, backpressure, and error propagation to the
host application.

**Do:** For RPC, split messages only on LF-delimited JSON lines, keep responses
separate from asynchronous events, correlate commands, handle cancellation,
and drain stderr separately. For SDK, unsubscribe handlers and dispose
session-owned resources. Pin the coding-agent API version in both cases.

Do not confuse the v0.83.0 released CLI RPC with the framed-CBOR
`@earendil-works/pi-protocol` added after v0.83.0; the latter is experimental
and incompatible. No long-term compatibility guarantee is documented for the
released CLI RPC either, so pin the Pi version.

**Verify:** Automated tests cover startup, prompt, streaming events,
cancellation, malformed input, child exit, restart, and cleanup.

**Evidence:** [E27](research/evidence-ledger.md#e27).

## Diagnosis, upgrades, and contribution

<!-- sync:P28 -->

### P28 — Diagnose with an isolation ladder

**Why:** Provider, configuration, session, context, extension, package,
terminal, and repository failures often look alike in the final UI.

**Do:** Preserve the failing case, then vary one layer at a time: fresh working
directory, print mode, explicit model, fresh session, context files off,
project resources denied, all optional extensions/packages off, minimal tool
allowlist, then a minimal input. Reintroduce one component per run.

**Verify:** One controlled change reliably toggles the failure, yielding a
small reproducer with sanitized logs.

**Evidence:** [E28](research/evidence-ledger.md#e28).

<!-- sync:P29 -->

### P29 — Upgrade through a pinned, staged, reversible path

**Why:** Pi changes quickly, while configuration, packages, extensions, model
catalogs, and providers may change independently.

**Do:** Read the changelog and migration notes; capture current versions and
settings; update in a disposable environment; run a smoke matrix for models,
sessions, trust, core tools, and each extension; then roll out gradually. Keep
the previous artifact and configuration backup until acceptance passes.

**Verify:** Both upgrade and rollback are rehearsed, and the smoke matrix
records the exact before/after versions.

**Evidence:** [E29](research/evidence-ledger.md#e29).

<!-- sync:P30 -->

### P30 — Contribute upstream only after human reproduction and review

**Why:** Pi's upstream contribution gate automatically closes unsolicited
issues and pull requests unless a maintainer marks them for consideration.
Generated volume and vague reports create maintainer cost rather than useful
evidence.

**Do:** Reproduce on a supported release or pinned commit, reduce the case,
search existing issues, write a concise human-authored report, and follow the
upstream `CONTRIBUTING.md` gate. Never submit model output without personally
checking every claim and line of a patch.

**Verify:** The report fits on one screen before logs, includes exact
environment and reproduction steps, and a human signer can defend the proposed
change.

**Evidence:** [E30](research/evidence-ledger.md#e30).

<!-- sync:practice-after-task -->

## After the task: close the loop

Finishing an edit is not the same as completing the task. Use this exit
procedure after P01–P30 and before reporting success:

1. Re-read the original outcome, scope, preservation rules, and acceptance
   checks. Mark every requirement `pass`, `fail`, or `not run`; never collapse a
   skipped check into “all checks passed.”
2. Run the smallest relevant checks first, then the broader regression suite.
   Record exact commands, exit status, and a concise result. Preserve full logs
   outside model context only when they are needed and safe to retain.
3. Inspect `git status --short`, the complete diff, and untracked/generated
   files. Account for every change and distinguish pre-existing work from the
   task's edits.
4. Re-run the task's security/data boundary check: unexpected files, processes,
   network calls, credential use, external writes, package changes, and
   persistent state are failures until explained.
5. Exercise the rollback or recovery path against a disposable copy or an
   explicitly identified checkpoint. Do not destroy user-owned work merely to
   prove rollback.
6. Move durable decisions, invariants, and follow-up work from the session into
   version-controlled files. A compaction summary or chat message is not a
   durable project record.
7. Sanitize retained evidence. Remove temporary artifacts, stop child
   processes, release ports/locks, revoke trial credentials, and record what
   intentionally remains.
8. Review session/export/share handling. State whether a session was saved,
   whether an export or link exists, who can access it, and how it will expire
   or be removed.
9. Produce one handoff containing the outcome, files changed, checks and exact
   results, versions/refs, assumptions, skipped work, residual risks, cleanup,
   rollback, and next human decision.
10. If the task changed a reusable workflow, evaluate it on fixed cases with
    the [evaluation record](../templates/evaluation-record.md) before declaring
    the workflow improved.

| Phase | Minimum durable artifact | Completion signal |
| --- | --- | --- |
| Intake and baseline | [Task brief](../templates/task-brief.md), Git baseline, [run manifest](../templates/run-manifest.md) when version-sensitive | Owner, outcome, boundaries and recovery point are explicit. |
| Reconnaissance and plan | Code/resource map, risk class, capability/integration choice | Every planned action maps to scope and an acceptance check. |
| Controlled execution | Checkpoint notes, decision record, changed-path inventory | Work can resume or roll back without relying on chat memory. |
| Validation | Command/result matrix, diff review, security/data check | Required gates pass and every skip has an owner-visible reason. |
| Handoff and cleanup | Result summary, residual risk, rollback and retention record | Another person can verify, operate, or reverse the result. |

If a required check fails, the correct outcome is a bounded partial result or a
failure report, not an optimistic success claim. Use the
[worked example](worked-example.md) for a filled, explicitly unexecuted example
of the complete record, and the [operating playbook](operating-playbook.md) for
stage gates and escalation rules.

<!-- sync:practice-definition-done -->

## Definition of done

A careful Pi task is complete when:

- the requested outcome and named acceptance checks pass;
- the final diff contains no unrelated or unexplained changes;
- secrets, generated artifacts, and full logs are handled deliberately;
- environment, model, tool, trust, and package assumptions are recorded;
- durable decisions are in repository files;
- risks, skipped checks, and version-sensitive claims are disclosed;
- rollback or recovery is understood.

Use the [troubleshooting playbook](troubleshooting.md) when a check does not
pass, and the [extension review](extension-review.md) before adopting runtime
customizations.
