[English](./operating-playbook.md) | [简体中文](./operating-playbook.zh-CN.md)

# Pi operating playbook

<!-- sync:playbook-intro -->

This playbook turns the repository's thirty practices into one operating loop for supervised work, unattended automation, customization, and embedding. It is a workflow for people and host applications. It does **not** claim that Pi enforces approval, isolation, least privilege, review, or retention policy.

Use the [practice guide](practice-guide.md) for the rationale and primary evidence behind P01–P30, the [architecture map](architecture.md) for mechanism and ownership boundaries, and the [troubleshooting playbook](troubleshooting.md) when a gate fails.

The stable reference used by this repository is Pi v0.83.0. Recheck commands, defaults, provider behavior, and interfaces against the version actually in use.

<!-- sync:playbook-contract -->

## Operating contract

Every run should have an identifiable owner, risk level, execution boundary, task brief, verification plan, durable record, and stop authority.

The operator or host application owns controls outside Pi, including:

- operating-system, container, VM, or remote-sandbox isolation;
- credential scope, network reach, mounts, and process authority;
- approval, change management, retention, and incident response;
- deciding whether model output, tool output, and tests are trustworthy enough;
- final review, delivery, rollback, and communication.

Treat Pi configuration, tool allowlists, Project Trust, and resource discovery as workflow inputs. None is a substitute for an external security boundary.

<!-- sync:playbook-how-to-use -->

## How to use this playbook

1. Classify risk before selecting a mode or loading project resources.
2. Assign accountable people and record who may stop the run.
3. Choose independently along the mode, customization, and placement axes.
4. Pass through all eight stages; do not skip a gate silently.
5. Preserve the named artifact from each stage beside the task output.
6. If a stop condition fires, preserve evidence and use the relevant [isolation ladder](troubleshooting.md#isolation-ladder).

For a small task, one person may fill several roles and the artifacts may be short Markdown sections. The controls still need explicit answers.

<!-- sync:playbook-risk -->

## Risk classification

### Risk dimensions

Classify the highest credible exposure, not the hoped-for behavior.

| Dimension | Lower exposure | Higher exposure |
| --- | --- | --- |
| Source trust | Known repository and reviewed instructions | Unknown or adversarial repository, prompt, or package |
| Execution | Read-only inspection | Shell, writes, generated code, lifecycle scripts, or privileged tools |
| Data | Public fixture | Private source, personal data, regulated data, or credentials |
| Reach | Disposable directory with no secrets or network | Home directory, host sockets, broad mounts, production network |
| Supervision | Human watches every consequential action | Unattended, scheduled, queued, or long-running operation |
| Reversibility | Clean branch/worktree and deterministic rebuild | Dirty tree, external side effects, destructive migration |
| Distribution | Built-in behavior and pinned local text | Third-party runtime code, moving refs, or transitive dependencies |
| Impact | Local experiment | Shared branch, release, production service, or external publication |

### Risk levels

| Level | Typical case | Minimum boundary | Approval and evidence |
| --- | --- | --- | --- |
| R0 — Observe | Public files, no secrets, read-only question | Disposable or known directory; read-oriented tools | Operator records source/version and result |
| R1 — Local reversible | Supervised edits in a trusted repository | Recoverable Git state and scoped credentials | Operator reviews diff and named checks |
| R2 — Isolated sensitive | Unknown repository, third-party package, private data, broad tools, or isolated low-impact unattended work | Container, VM, micro-VM, remote sandbox, or equivalent OS policy | Accountable owner approves boundary and retained evidence |
| R3 — High impact | Production, release, destructive, or otherwise high-impact external effects; or unattended work combined with privileged identity, sensitive data, broad reach, or hard-to-reverse effects | Dedicated identity and isolated environment with explicit egress, mount, and secret policy | Independent review, rehearsed rollback, and incident route |

A move toward higher exposure requires a new classification decision; it does
not make every unattended observation R3 by itself. Use R3 for high-impact
combinations, especially unattended execution with privileged, destructive,
production, sensitive-data, or hard-to-reverse authority. Lower a level only
after changing the environment or scope, not because the model or package
appears well behaved.

### Classification gate

**Entry:** A request, repository, intended output, and known execution context.

**Actions:** Score every dimension; identify irreversible actions; name data and credentials; decide R0–R3; record assumptions in the [task brief](../templates/task-brief.md) and [run manifest](../templates/run-manifest.md).

**Artifact:** Risk decision, rationale, required controls, approver, and review expiry.

**Exit:** The selected boundary is available and every required control has an owner.

**Stop:** The data, credential, external side effect, or rollback path cannot be identified; the requested boundary cannot be provided; or R3 has no independent approver.

<!-- sync:playbook-risk-controls -->

### Minimum controls by level

| Control | R0 | R1 | R2 | R3 |
| --- | --- | --- | --- | --- |
| Version record | Required | Required | Required | Required |
| Git or fixture baseline | Fixture | Required | Required | Required plus protected integration |
| Project-resource review | If loaded | Required | Required before approval | Required with independent approval |
| OS containment | Optional | According to exposure | Required | Required and tested |
| Scoped task credential | None preferred | If needed | Required | Dedicated, short-lived, monitored |
| Network policy | No unexpected reach | Record required endpoints | Allowlist where practical | Explicit allowlist and incident monitoring |
| Human supervision | At completion | During consequential edits | At gates | Independent gate before external effect |
| Rollback rehearsal | Recreate fixture | Known Git rollback | Tested cleanup | Rehearsed service/data rollback |
| Evidence retention | Result summary | Manifest, diff, checks | Sanitized evidence bundle | Audit package under retention policy |

<!-- sync:playbook-roles -->

## Roles and accountability

| Role | Responsibility |
| --- | --- |
| Requester | Defines the desired outcome, business context, and acceptable impact. |
| Operator | Starts and steers Pi, observes tool use, and keeps the run inside scope. |
| Risk owner | Accepts residual security, privacy, operational, and supply-chain risk. |
| Reviewer | Independently checks the brief, diff, evidence, and acceptance results. |
| Platform owner | Owns sandbox, identity, network, storage, logging, and host lifecycle. |
| Maintainer | Owns repository conventions, integration quality, and rollback readiness. |
| Incident contact | Receives private escalation when a stop condition indicates harm. |

One person may hold multiple roles for R0/R1. For R3, the operator should not be the only approver of the external effect or rollback plan.

### RACI matrix

`A` is accountable, `R` performs the work, `C` is consulted, and `I` is informed.

| Stage | Requester | Operator | Risk owner | Reviewer | Platform owner | Maintainer |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Intake and classify | A | R | C | I | C | C |
| 2. Baseline and contain | I | R | A | C | R | C |
| 3. Brief and context | A | R | C | C | I | C |
| 4. Reconnoiter and plan | C | R | I | C | I | A |
| 5. Execute and coordinate | I | R | C | I | C | A |
| 6. Verify and diagnose | C | R | I | A | C | R |
| 7. Deliver and clean | A | R | C | A | C | R |
| 8. Retain, learn, and upgrade | I | R | A | C | R | A |

**Entry:** Named people or teams for the roles that the risk level requires.

**Actions:** Resolve blank accountability, define approval response time, and record who can abort tools, revoke credentials, reject delivery, and restore the environment.

**Artifact:** A task-specific RACI row set or equivalent ownership note.

**Exit:** Every gate and external side effect has one accountable owner.

**Stop:** No one can authorize the boundary, review a high-impact change, or execute rollback.

<!-- sync:playbook-three-axes -->

## Three-axis operating decision

Do not put every Pi capability on one power ladder. Select three independent properties: execution mode, customization primitive, and placement/distribution.

### Axis A — execution and integration mode

| Mode | Choose when | Owner must provide | Avoid when |
| --- | --- | --- | --- |
| Interactive | A person supervises a coding task in the TUI | Steering, review, terminal compatibility, cleanup | The job cannot wait for a human or TUI output would be parsed |
| Print (`-p`) | One prompt should produce one final output | Explicit model, tools, trust, session, cwd, and exit policy | Bidirectional control or rich event history is required |
| JSON | A process consumes one run's event stream | Streaming parser, stderr handling, partial/error event policy | The controller must issue commands during the run |
| Released CLI RPC | A non-Node controller or alternate UI owns a long-lived child | LF framing, correlation, cancellation, stderr drain, restart, version pin | In-process TypeScript ownership is simpler |
| SDK | A TypeScript host owns sessions, resources, tools, and events | Policy, credentials, persistence, backpressure, subscriptions, disposal | A process boundary is required for isolation |

Use [P25–P27](practice-guide.md#automation-and-embedding) and the [integration-mode architecture](architecture.md#integration-modes). Non-interactive operation does not itself mean no session, no project resources, or no ambient authority.

### Axis B — customization primitive

| Need | Smallest suitable primitive | Review focus |
| --- | --- | --- |
| Stable repository guidance | `AGENTS.md` or `CLAUDE.md` | Scope, precedence, truth over time, prompt-injection risk |
| Explicit reusable text | Prompt template | Arguments, expansion, accidental broad scope |
| On-demand workflow, references, or helper scripts | Skill | Instructions, scripts, assets, executable and data access |
| Runtime events, tools, UI, policy, or provider | Extension | In-process code, lifecycle, authority, failure behavior |

Start with [P07–P11](practice-guide.md#task-and-context-design). Prototype text before runtime code as described by [P21–P24](practice-guide.md#extensions-and-packages), and use the [extension review](extension-review.md) before adopting executable artifacts.

### Axis C — placement and distribution

| Placement | Choose when | Main control |
| --- | --- | --- |
| Task-local text | The instruction belongs only to this run | Keep it in the task brief or prompt and review it with the output |
| Repository resource | The rule applies to contributors in this repository | Version it, scope it narrowly, and review project loading |
| User/global resource | The behavior should follow one operator across projects | Audit its effect on unknown repositories and Trust timing |
| Pi package from npm/Git/local path | Several resources need repeatable distribution | Pin identity/ref, inspect dependencies/scripts, test install and removal |
| Host application code | The product owns orchestration or integration | Treat it as an application with policy, secrets, tests, and lifecycle |

### Decision gate

**Entry:** A testable capability need and the R0–R3 classification.

**Actions:** Select one row on each relevant axis; state why a smaller primitive or simpler mode does not fit; record version and ownership; review all executable inputs.

**Artifact:** A three-axis decision such as `Interactive + Skill + repository` or `RPC + no Pi customization + host application`.

**Exit:** The selected combination has a named owner, test plan, installation or startup path, and removal or shutdown path.

**Stop:** Selection is based only on popularity; a moving artifact cannot be pinned; runtime code has no lifecycle owner; or the chosen mode cannot enforce the host's required policy.

<!-- sync:playbook-loop -->

## Eight-stage operating loop

Each stage consumes the previous artifact. A failed exit gate returns to the earliest stage whose assumption changed.

<!-- sync:playbook-stage-1 -->

### Stage 1 — Intake and classify

**Entry:** A request with at least a desired outcome and target repository or system.

**Actions:** Clarify current and desired behavior; list in-scope and out-of-scope paths; identify external systems; classify R0–R3; assign the RACI; define the maximum acceptable time, cost, data exposure, and external effect.

Use the [task brief template](../templates/task-brief.md). Link unknown facts instead of silently turning them into assumptions.

**Artifact:** Approved task brief, risk level, ownership, budget, and stop authority.

**Exit:** Scope and acceptance are testable, and required controls are available.

**Stop:** Conflicting goals, unknown authority, undefined production impact, unavailable reviewer, or a request to conceal material risk.

<!-- sync:playbook-stage-2 -->

### Stage 2 — Baseline and contain

**Entry:** Approved brief and risk decision.

**Actions:** Apply [P01–P06](practice-guide.md#baseline-and-recovery): record the execution envelope, inspect Git state, create a recoverable branch/worktree or fixture, review Project Trust inputs, minimize credentials/mounts/network, and pin any Package or Extension.

At minimum record:

```bash
pi --version
node --version
git status --short
git rev-parse --show-toplevel
git rev-parse HEAD
```

For untrusted or unattended work, build and test the external OS boundary before Pi sees the repository. The test should demonstrate that unrelated files, credentials, host sockets, and unapproved destinations are unavailable.

**Artifact:** Completed [run manifest](../templates/run-manifest.md), Git/fixture baseline, containment decision, resource inventory, and rollback point.

**Exit:** Another operator can reconstruct the environment and recover without discarding pre-existing work.

**Stop:** Dirty state is unattributed; a credential is broader than the task; untrusted code can reach the host; artifact identity is uncertain; or rollback has not been demonstrated.

<!-- sync:playbook-stage-3 -->

### Stage 3 — Brief, context, and capability design

**Entry:** Reproducible baseline and effective boundary.

**Actions:** Apply [P07–P11](practice-guide.md#task-and-context-design). Inventory applicable `AGENTS.md`/`CLAUDE.md`, settings, prompts, skills, themes, extensions, packages, tools, provider/model, session behavior, and working directory. Remove irrelevant context. Select along the three axes above.

For repository instructions, start from the [AGENTS.md template](../templates/AGENTS.md) and keep only durable facts that change execution. For non-interactive work, make trust, context, tools, model, cwd, and session policy explicit.

**Artifact:** Context/resource manifest, three-axis decision, capability allowlist, and acceptance-command plan.

**Exit:** Every loaded input and executable capability has a reason and owner; the task still fits its approved risk level.

**Stop:** Conflicting instructions cannot be resolved; project resources have not been reviewed; a same-name custom tool is unexplained; or a runtime primitive is selected without a need that text cannot meet.

<!-- sync:playbook-stage-4 -->

### Stage 4 — Reconnoiter and plan

**Entry:** Approved context and capability set.

**Actions:** Begin read-only as in [P09](practice-guide.md#p09--reconnoiter-read-only-then-expand-capabilities). Map relevant files, ownership boundaries, tests, generated artifacts, migration paths, and likely rollback. Preserve full local output outside model context when needed, while sending decisive evidence to the model.

One source-reviewed baseline is below. Replace `PROVIDER` and `MODEL` with an
entry enumerated under the same resource controls, as shown in the
[sterile baseline](troubleshooting.md#sterile-baseline):

```bash
pi --offline --no-approve --no-context-files --no-extensions --no-skills \
  --no-prompt-templates --no-themes --no-session \
  --tools read,grep,find,ls \
  --provider PROVIDER --model MODEL -p \
  "Map the relevant code and propose checks."
```

Adapt it deliberately: those flags control Pi startup network operations,
resource loading, and registered tools, not provider traffic or
operating-system authority.

**Artifact:** Code/system map, proposed changes, dependency order, named checks, unknowns, and capability-expansion request.

**Exit:** The reviewer can trace every proposed change to scope and every check to an acceptance criterion.

**Stop:** The observed system contradicts the brief; required data is missing; the first write would be irreversible; or the plan requires a higher risk level.

<!-- sync:playbook-stage-5 -->

### Stage 5 — Execute and coordinate

**Entry:** Reviewed plan, recovery point, minimum write capability, and active supervision appropriate to risk.

**Actions:** Apply [P12–P20](practice-guide.md#during-the-task): keep one coherent goal per session, distinguish steering from queued follow-up, bound commands and retries, watch truncation, externalize durable decisions, and treat cross-model handoff as best effort. Apply P22–P27 when runtime code or embedding is involved.

For each consequential action:

1. state the intended change and affected path/system;
2. check the precondition immediately before acting;
3. execute the smallest reversible step;
4. inspect result, stderr/events, and repository/external state;
5. record a checkpoint before expanding scope.

**Artifact:** Focused diff or external change set, decision log, checkpoint record, command/event summary, and updated unknowns.

**Exit:** Planned changes are complete, no unexplained side effect remains, and the environment is ready for independent verification.

**Stop:** Tool behavior differs from its description; output is truncated with no continuation; retries exceed budget; cancellation fails; credentials appear in output; the session loses a critical invariant; or changes escape scope.

<!-- sync:playbook-stage-6 -->

### Stage 6 — Verify and diagnose

**Entry:** Candidate change and unchanged acceptance criteria.

**Actions:** Run checks from narrow to broad: targeted reproduction, unit or component checks, static analysis, integration checks, and final diff review. Compare expected and actual output, including exit status and negative cases.

When a check fails, preserve the failing case and apply [P28](practice-guide.md#p28--diagnose-with-an-isolation-ladder) and the [troubleshooting isolation ladder](troubleshooting.md#isolation-ladder). Change one variable at a time; do not rewrite acceptance to match the output.

For Extension/Package work, complete the [hands-on review template](../templates/hands-on-review.md) before any featured recommendation or broad rollout.

**Artifact:** Verification matrix with command/input, expected result, actual result, status, environment, and evidence location; reviewed final diff.

**Exit:** Named acceptance checks pass, negative and rollback paths are credible, and skipped checks and residual risks have accountable acceptance.

**Stop:** A security boundary fails; evidence cannot be reproduced; tests are flaky without bounded diagnosis; source and artifact provenance differ; or a reviewer cannot explain the diff.

<!-- sync:playbook-stage-7 -->

### Stage 7 — Deliver and clean

**Entry:** Verified result and approved residual risks.

**Actions:** Prepare a handoff that leads with outcome, lists changed paths or external effects, summarizes checks, identifies skipped checks and risks, and gives rollback. Separate pre-existing changes. Remove temporary artifacts and revoke task credentials. Inspect sessions, logs, exports, and links before sharing as required by [P16](practice-guide.md#p16--scrub-sessions-before-export-or-sharing).

Do not publish or submit upstream merely because a model generated a plausible report. Follow [P30](practice-guide.md#p30--contribute-upstream-only-after-human-reproduction-and-review) and obtain human reproduction and review.

**Artifact:** Handoff packet, sanitized evidence, cleanup record, credential disposition, and tested rollback instructions.

**Exit:** The requester can verify the outcome, the maintainer can continue the work, and the platform owner can account for retained data and active access.

**Stop:** A secret or private source may be present; a share link's visibility or revocation is unknown; rollback is ambiguous; or delivery would bypass required review/change control.

<!-- sync:playbook-stage-8 -->

### Stage 8 — Retain, learn, and upgrade

**Entry:** Accepted delivery and completed cleanup.

**Actions:** Retain only artifacts required by repository, legal, security, or operational policy. Record root cause and preventive action for failures. Promote durable instructions into reviewed repository files, not only session history. Expire temporary exceptions and credentials. Schedule retest for version-sensitive behavior, Packages, Extensions, and provider/model assumptions.

For upgrades, follow [P29](practice-guide.md#p29--upgrade-through-a-pinned-staged-reversible-path): capture before/after versions, test in a disposable environment, run the smoke matrix, stage rollout, and rehearse rollback.

**Artifact:** Retention decision, lessons or ADR, regression test or follow-up, expiry/retest trigger, and closed task record.

**Exit:** Durable knowledge is reviewable, ephemeral access is gone, retained data has an owner and expiry, and the next version-sensitive review has a trigger.

**Stop:** Policy requires deletion that cannot be confirmed; the incident is still open; a temporary control has no expiry; or the lesson would expose secret or private material.

<!-- sync:playbook-parallel -->

## Checkpoint and parallel work

Pi session branching and filesystem branching solve different problems. `/tree`, `/fork`, and `/clone` do not restore files or isolate concurrent edits. External or third-party multi-agent orchestration is not assumed to be a built-in Pi control; its coordinator must own isolation, scheduling, cancellation, and merge.

### Parallel-work gate

**Entry:** A plan with two or more units that can be independently verified.

**Actions:** Give each unit one goal, branch/worktree or disjoint write set, owner, input commit, acceptance checks, budget, and integration order. Identify shared generated files, schemas, lockfiles, databases, ports, credentials, and rate limits. Serialize shared read-modify-write windows.

Use an ownership ledger:

| Unit | Owner/session | Branch/worktree | Write set | Depends on | Checks | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Example A | named operator | exact path/ref | paths or external system | none | command/result | planned |
| Example B | named operator | exact path/ref | paths or external system | A interface | command/result | blocked |

**Artifact:** Ownership ledger, dependency graph, checkpoint refs, merge order, and collision policy.

**Exit:** Units integrate against the intended base, shared invariants pass, and the combined diff receives a fresh review.

**Stop:** Two writers own the same mutable state without serialization; a unit cannot be cancelled; a dependency changed without notification; or integration requires discarding user-owned work.

### Long-running-work gate

**Entry:** Expected duration exceeds one supervision window, one model context, or one provider/tool retry budget.

**Actions:** Define wall-clock, token/cost, retry, and external-side-effect budgets. Add bounded checkpoints at semantic milestones. Persist decisions, current state, next action, and rollback outside model-visible context before compaction or handoff. Define heartbeat, cancellation, restart, and stale-work policy. Revalidate credentials and target state at every resume.

**Artifact:** Budget, checkpoint schedule, durable state record, resume preconditions, and cancellation/cleanup procedure.

**Exit:** The work can stop and resume from a verified checkpoint without hidden session state or duplicated external effects.

**Stop:** No heartbeat within the agreed window; budget exhausted; repeated retry category unchanged; checkpoint cannot be reconstructed; target moved; or the operator cannot regain control.

<!-- sync:playbook-data -->

## Data, credentials, sessions, and logs

### Data classification

| Class | Examples | Default handling |
| --- | --- | --- |
| Public | Public repository, public docs, synthetic fixture | Record source; still inspect for malicious instructions |
| Internal | Non-public code, paths, hostnames, design notes | Minimum context, approved provider/host, controlled retention |
| Sensitive | Personal data, customer data, security findings | Isolated processing, explicit owner, redaction and deletion plan |
| Secret | API key, bearer token, cookie, private key | Do not place in prompts/logs; inject narrowly, rotate, and revoke |

**Entry:** Data inventory, provider/host route, retention policy, and task risk.

**Actions:** Minimize what enters model context; use stable redaction labels; separate task credentials from personal credentials; constrain environment, mounts, sockets, and network; prevent shell tracing or debug output from printing secrets; inspect tool output before it enters a Session or Export.

For each credential record owner, purpose, scope, injection route, expiry, rotation/revocation action, and proof of disposal. Disabling telemetry does not disable provider traffic.

Treat Session JSONL, HTML Export, debug logs, tool-output files, RPC/JSON events, screenshots, and share links as potentially sensitive. `!!` controls model context, not necessarily persistence or export.

**Artifact:** Data-flow note, credential register, redaction map, retention and deletion decision, and sanitized evidence location.

**Exit:** Only approved data paths remain, every credential is accounted for, and retained artifacts have an owner, visibility, expiry, and deletion route.

**Stop:** Unknown data classification; unexpected egress; secret in transcript or log; inaccessible revocation; unapproved provider/region; or uncertain share-link visibility.

<!-- sync:playbook-verification -->

## Verification and delivery standard

Verification should prove the requested outcome and constrain unintended change. Do not use “the agent said it passed” as evidence.

### Verification matrix

| Layer | Required question | Evidence |
| --- | --- | --- |
| Reproduction | Does the original failure exist before the change? | Minimal command/input and captured result |
| Focused behavior | Does the smallest relevant check now pass? | Exact command, status, and output summary |
| Negative behavior | Are denied, invalid, cancelled, and oversized cases safe? | Expected failure and preserved error category |
| Integration | Do affected boundaries still interoperate? | Versioned fixture or integration result |
| Regression | Do nearby established checks still pass? | Named suite and environment |
| Diff | Is every change in scope, intentional, and attributable? | Human-reviewed diff and file inventory |
| Security/data | Did authority, egress, secret, or retention assumptions change? | Boundary test and data/credential record |
| Recovery | Can the change be rolled back without unrelated loss? | Rehearsed command or restoration procedure |

### Delivery packet

A complete handoff contains:

1. outcome and impact;
2. exact changed paths, artifacts, configuration, or external systems;
3. before/after environment and immutable refs;
4. acceptance matrix with commands and results;
5. skipped, partial, or flaky checks with reasons;
6. residual security, privacy, compatibility, cost, and operational risks;
7. cleanup and credential disposition;
8. rollback trigger and steps;
9. retained evidence location and expiry;
10. reviewer, approver, and follow-up owner.

**Entry:** Stage 6 evidence and the approved scope.

**Actions:** Reconcile the delivery packet with the task brief and run manifest; have the reviewer sample evidence and execute critical checks independently.

**Artifact:** Signed or otherwise attributable delivery packet.

**Exit:** Requester accepts the outcome, reviewer accepts the evidence, and risk owner accepts disclosed residual risk.

**Stop:** Acceptance relies on unverifiable model narration, mutable links, missing versions, unexplained changes, or absent rollback.

<!-- sync:playbook-quick-check -->

## One-page operating check

Before starting:

- [ ] Task, scope, owner, RACI, risk, budget, and stop authority are explicit.
- [ ] Pi/runtime/model/resource versions and Git baseline are recorded.
- [ ] Trust, context, tools, packages, credentials, mounts, network, and Session
      behavior are intentional.
- [ ] Mode, customization, and placement decisions are recorded independently.
- [ ] Acceptance, negative checks, recovery, and evidence locations are named.

Before delivering:

- [ ] The original failure and requested outcome have reproducible evidence.
- [ ] Named checks pass; skipped checks and uncertainty are disclosed.
- [ ] Final diff/external effects contain no unexplained or unrelated change.
- [ ] Secrets, Sessions, logs, exports, links, and temporary artifacts are handled.
- [ ] Credential revocation, cleanup, rollback, retention, and retest are owned.
- [ ] A human reviewer can defend the conclusion and continue from the handoff.

If any box cannot be answered, return to the earliest affected stage rather than silently weakening the completion standard.
