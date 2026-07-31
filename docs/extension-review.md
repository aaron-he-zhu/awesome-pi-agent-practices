[English](./extension-review.md) | [简体中文](./extension-review.zh-CN.md)

# Extension and package review

<!-- sync:review-purpose -->

Use this review before loading a third-party extension, skill, or Pi package.
Pi packages run inside the local-agent trust boundary: extensions execute
JavaScript/TypeScript with the Pi process's permissions, and skills can direct
the model to invoke tools or executables. Package catalog presence is discovery,
not a security review.

The output of this process is a decision record, not a score alone.

## Gate 0 — Identify the exact artifact

<!-- sync:review-identity -->

Record:

| Field | Required value |
| --- | --- |
| Project | Canonical repository and publisher identity. |
| Artifact | npm name, Git source, or local path. |
| Reviewed ref | Exact npm version plus integrity, or full Git commit. |
| Pi baseline | Exact Pi version/commit and Node version. |
| Review date | ISO date and reviewer. |
| License | Project, package artifact, vendored code, and material dependencies. |
| Claimed resources | Extensions, skills, prompts, themes, or combinations. |
| Install scope | User or project; temporary `-e` or persistent install. |

Stop if the artifact cannot be tied to immutable source, has no usable license,
or the published package materially differs from the repository without an
explanation.

## Gate 1 — Map installation and supply chain

<!-- sync:review-install -->

Inspect before normal installation:

1. `package.json`, `pi` resource declarations, conventional resource
   directories, included files, lockfiles, and release workflow.
2. `scripts` for `preinstall`, `install`, `postinstall`, `prepare`, build, and
   download behavior.
3. Direct and transitive runtime dependencies, native modules, binaries,
   downloaded models, and vendored code.
4. npm provenance/integrity where available, Git tag signature where used, and
   the mapping between release tag, commit, and artifact.
5. Whether a Git source is pinned. Branch and unversioned npm specs move.
6. Whether package update behavior preserves or advances that ref.

With the default npm command, Pi v0.83.0 uses `npm install --omit=dev` for a
Git package's dependencies. Managed npm-package installs use ordinary package
manager install arguments, and a custom `npmCommand` changes the Git dependency
path to plain `install`. None of these paths globally disables lifecycle
scripts. A repository checkout can also be reset/cleaned during Git
reconciliation, so never point package management at a working copy that
contains uncommitted work.

**Pass condition:** the reviewer can enumerate code that executes during
install, load, and update, and can reproduce the same dependency graph.

## Gate 2 — Map runtime authority

<!-- sync:review-authority -->

Search every extension entry point and helper for:

- process creation, shell execution, `eval`, dynamic import, workers, native
  modules, and child-process environment inheritance;
- filesystem reads/writes outside `ctx.cwd`, symlink handling, path traversal,
  temporary files, caches, and deletion;
- network clients, DNS, sockets, local servers, browser launch, SSH, and remote
  execution;
- environment variables, Pi auth/model APIs, credential files, Git/SSH config,
  cloud CLIs, and keychains;
- clipboard, notifications, terminal escape sequences, TUI overlays, and input
  interception;
- telemetry, analytics, crash reporting, session export, prompt/tool-result
  upload, and retention;
- registration or override of `read`, `bash`, `edit`, `write`, `grep`, `find`,
  or `ls`;
- hooks that can block, rewrite, inject, or observe messages and tool calls.

Create a compact authority table:

| Surface | Needs | Actual access | User control | Data leaves machine? |
| --- | --- | --- | --- | --- |
| Files | Paths and operations. | Observed implementation. | Config/allowlist/none. | Destination and retention. |
| Processes | Executables and arguments. | Observed implementation. | Confirmation/policy/none. | Child environment. |
| Network | Hosts and protocols. | Observed implementation. | Allowlist/offline/none. | Payload and identity. |
| Credentials | Credential categories. | Observed implementation. | Scoped token/profile/none. | Recipient. |
| Session | Messages, tools, metadata. | Observed implementation. | Opt-in/filter/none. | Storage and deletion. |

**Pass condition:** documentation and behavior agree, no authority is disguised
as a harmless UI or read-only feature, and the deployment can constrain each
unneeded surface outside Pi.

## Gate 3 — Review Pi integration correctness

<!-- sync:review-integration -->

### Lifecycle

- Is the factory fast and limited to registration or unavoidable one-time
  discovery?
- Are session resources initialized on the correct event?
- Are timers, processes, listeners, ports, files, UI slots, and statuses cleaned
  on shutdown and session replacement?
- Are setup and cleanup idempotent?
- Does code use the current event `ctx` rather than retaining stale
  session-bound objects?
- Does it work in interactive, print, JSON, RPC, and SDK modes it claims to
  support?

### Tools

- Does the name collide with a built-in or another common package?
- Do description, `promptSnippet`, and `promptGuidelines` state exact behavior?
- Is the schema closed and provider-compatible (`StringEnum` for string enums)?
- Are paths resolved against the intended directory and canonicalized before
  access checks?
- Does a mutating tool join Pi's per-file mutation queue?
- Is sequential execution declared when shared state or ordering requires it?
- Does cancellation reach child work?
- Are failures thrown so Pi marks `isError: true`?
- Are results limited to 2,000 lines/50 KB or a stricter bound, with explicit
  continuation/full-output information?
- If nested models are called, is usage reported?

### Hooks and policy

- Does a `tool_call` policy fail closed on its own errors?
- Can another extension run earlier, override the same tool, or bypass the
  intended policy through a different API?
- Are prompt/message transformations bounded, deterministic, and visible?
- Are UI-only renderers kept separate from session/model content?
- Does “sandbox”, “permission”, or “read-only” documentation name the actual OS
  or enforcement boundary?

**Pass condition:** tests cover every claimed Pi mode and every privileged
operation, including collision and failure behavior.

## Gate 4 — Review skills and prompt resources

<!-- sync:review-instructions -->

Non-code resources can still cause powerful actions. Read every instruction,
script, reference, frontmatter field, and linked setup step. Look for:

- commands that download and execute remote code;
- destructive operations, recursive paths, unresolved variables, or broad
  globs;
- requests for secrets, browser profiles, session data, or credential exports;
- instructions to weaken tool policy, trust all projects, disable review, or
  conceal output;
- dependency installation without version or integrity pinning;
- external URLs whose content becomes an instruction channel;
- claims that Project Trust or a tool allowlist provides full isolation;
- generated commands that are never validated against user intent.

**Pass condition:** every side effect is disclosed at the point of use, risky
steps require an explicit decision, and scripts are reviewed as code.

## Gate 5 — Run an isolated behavioral trial

<!-- sync:review-trial -->

Use a disposable OS boundary and test credentials. Do not begin in a personal
home directory or production repository.

Minimum trial matrix:

| Case | Test | Expected observation |
| --- | --- | --- |
| Install | Capture files, processes, DNS/network, and lifecycle output. | Matches the supply-chain map. |
| Startup | Load with no prompt and with no project trust. | No unexplained action; trust behavior documented. |
| Happy path | Run the smallest documented example. | Claimed result and bounded output. |
| Denied credential | Omit or revoke the credential. | Clear failure; no fallback to broader credentials. |
| Denied network | Block outbound access. | Finite timeout and actionable error. |
| Denied file | Remove permission or use an out-of-scope path. | Fail closed without partial destructive state. |
| Invalid input | Fuzz missing, extra, large, and malformed arguments. | Schema rejection or safe thrown error. |
| Concurrency | Invoke sibling calls on shared state/files. | No lost update, race, or corrupt state. |
| Cancellation | Abort during network/process/file work. | Child work stops and cleanup completes. |
| Oversized result | Produce output beyond the limit. | Explicit truncation and retrievable continuation. |
| Reload | Reload resources and change session repeatedly. | No duplicate handler or stale context. |
| Shutdown | Exit during idle and active work. | No orphan process, port, timer, or temp secret. |
| Removal | Remove package and configuration. | Documented data/cache cleanup and no residual loading. |

Capture exact commands and sanitized observations. Packet/process tracing is
more reliable than assuming the README lists every side effect.

## Gate 6 — Assess maintenance and adoption fitness

<!-- sync:review-maintenance -->

Check:

- current `@earendil-works/*` dependencies or an explained compatibility layer;
- recent Pi-version testing, release notes, migration handling, and issue
  responsiveness;
- CI and tests that exercise behavior rather than only formatting;
- supported operating systems, terminals, providers, authentication modes, and
  runtime versions;
- ownership concentration, release automation, security reporting route, and
  recovery from a compromised release;
- documented update, rollback, uninstall, data deletion, and breaking-change
  policy;
- duplicate capability already provided more safely by Pi, a prompt, or a
  skill.

An active commit date is not enough. Conversely, a small stable tool does not
need constant commits when its compatibility matrix and tests remain current.

## Decision

<!-- sync:review-decision -->

Choose exactly one:

| Decision | Meaning |
| --- | --- |
| Reject | A blocking safety, licensing, integrity, relevance, or reproducibility issue exists. |
| Watch | Source review is useful, but hands-on evidence or a material answer is missing. |
| Trial only | Works under named containment/credentials but is not appropriate for broad recommendation. |
| `hands-on-verified` | Named environment and version passed the matrix; still not automatically featured. |
| `featured` | Maintainer judgment, direct experience, documentation, license, and current compatibility justify root curation. |

Record blocking issues, compensating controls, residual risk, retest trigger,
and expiration date. The `featured` status requires a human-written recommendation that
answers why the item is unusually useful; popularity and package-catalog
presence are not reasons.

## Review record

<!-- sync:review-record -->

Copy this block into a proposal:

```yaml
project:
artifact:
repository:
reviewed_ref:
artifact_integrity:
license:
pi_version:
node_version:
platform:
reviewer:
reviewed_at:
relationship_disclosed:
resources:
authority:
  files:
  processes:
  network:
  credentials:
  session_data:
install_observations:
test_cases:
  passed: []
  failed: []
  skipped: []
cleanup_observations:
decision:
blocking_issues: []
residual_risks: []
retest_on:
expires_at:
evidence_links: []
```

See [P06, P21–P24](practice-guide.md#extensions-and-packages) and the
[methodology](research/methodology.md#recommendation-lifecycle).
