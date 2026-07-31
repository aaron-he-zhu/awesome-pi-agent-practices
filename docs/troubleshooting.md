[English](./troubleshooting.md) | [简体中文](./troubleshooting.zh-CN.md)

# Troubleshooting playbook

<!-- sync:trouble-purpose -->

Troubleshoot Pi by separating layers, not by repeatedly reinstalling everything.
Preserve the failing case, capture a sanitized execution envelope, then change
one variable per run.

This playbook targets Pi v0.83.0. Check the current
[official documentation](https://pi.dev/docs/latest) when using a newer release.

## First response

<!-- sync:trouble-first -->

1. **Stop destructive or credential-bearing work.** Abort the current action,
   revoke a possibly exposed test credential, and preserve the repository state.
2. **Record the envelope.** Capture Pi/Node version, install method, OS,
   terminal, shell, working directory, repository commit/status, provider/model,
   thinking level, transport, mode, trust choice, tool list, loaded resources,
   and exact error time.
3. **Preserve evidence.** Copy the smallest relevant stderr/event/log excerpt
   before retrying. Do not publish session files, `pi-debug.log`, HTML exports,
   auth stores, environment dumps, or full tool output without redaction.
4. **Classify the failing phase.** Installation, startup/resource loading,
   model/auth, prompt/streaming, tool execution, terminal rendering,
   session/compaction, RPC/SDK, update, or shutdown.
5. **Select the smallest isolation ladder below.**

<!-- sync:trouble-router -->

<a id="symptom-router"></a>

## Symptom router

Start from the first observable symptom, not a guessed root cause. Capture the
original error before running the first comparison.

| Observable symptom | First route | First safe comparison | Result to record |
| --- | --- | --- | --- |
| `pi` is not found or reports an engine error | [Install/update](#install-update) | `command -v pi`, `pi --version`, `node --version` | Resolved executable, distribution and runtime. |
| 401/403, missing auth, unknown model, quota or provider timeout | [Provider/model/auth](#provider-model-auth) | One-line, no-tool prompt with explicit provider/model | Exact error class, status and whether any retry occurred. |
| Only one repository/cwd fails | [Trust/resources](#trust-resources) | Original cwd versus an empty directory with `-nc --no-approve` | Which directory/resource boundary toggles the failure. |
| Failure begins after a package/extension is loaded | [Extension/package](#extension-package) | Disable all, then add back one pinned artifact | Exact artifact/ref and first failing lifecycle phase. |
| A tool edits the wrong file, hangs or truncates output | [Tool/shell](#tool-shell) | Built-ins only, smallest input, finite command timeout | Registered tool identity, side effect and truncation/cancel state. |
| Old session fails while a fresh run works | [Session/compaction](#session-compaction) | Same prompt with `--no-session` | Session ID/format/compaction boundary that changes the result. |
| TUI freezes or renders incorrectly but print mode works | [Terminal/TUI](#terminal-tui) | Same prompt/model in `-p` mode | Terminal, keybinding, renderer or interactive-extension difference. |
| JSON consumer or RPC client hangs/misparses | [JSON/RPC/SDK](#json-rpc-sdk) | Drain stderr separately and test one LF-delimited exchange | Last complete event/response, pending correlation and child status. |
| Failure occurs only on native Windows/WSL | [Windows](#windows-route) | Record shell/path/terminal and compare the supported counterpart | Platform-specific path, signal, permission or terminal difference. |
| Evidence may contain a secret or private data | [Sanitized evidence](#sanitized-evidence-bundle) | Stop sharing; search the smallest local artifact | Exposure surface, revocation/deletion action and retained safe excerpt. |

If two rows seem to apply, begin with the comparison that removes the most
components without changing data or state. If the symptom can cause deletion,
credential exposure, production mutation or repeated external side effects,
skip diagnosis-in-place and follow the [stop conditions](#stop-conditions).

## Sterile baseline

<!-- sync:trouble-baseline -->

The following is a POSIX-shell example. Use a disposable directory and a test
credential. `PI_CODING_AGENT_DIR` gives both commands the same fresh Pi
profile; credentials stored in the normal profile are deliberately absent, so
provider credentials must come from the explicitly prepared test environment.
Record the generated path so it can be inspected and removed after the trial.

```bash
trial_root="$(mktemp -d)"
trial_profile="$trial_root/pi-profile"
trial_work="$trial_root/work"
mkdir "$trial_work"
cd "$trial_work"
PI_CODING_AGENT_DIR="$trial_profile" \
pi --offline --no-approve --no-context-files --no-extensions --no-skills \
  --no-prompt-templates --no-themes --list-models
```

Replace `PROVIDER` and `MODEL` with an entry from the command above. The next
command removes discovered project instructions/resources and all discovered
optional resource types, uses no session file, and exposes only built-in
read-oriented tools:

```bash
PI_CODING_AGENT_DIR="$trial_profile" \
pi --offline --no-approve --no-context-files --no-extensions --no-skills \
  --no-prompt-templates --no-themes --no-session \
  --tools read,grep,find,ls \
  --provider PROVIDER --model MODEL -p "Reply exactly PI_BASELINE_OK."
```

The core baseline passes when the process exits successfully and the final
output contains `PI_BASELINE_OK`. Record startup warnings and stderr separately;
do not redefine a warning as success. Confirm that no session file was created,
inspect everything under the exact `trial_root`, then remove that disposable
directory through the platform's normal safe deletion mechanism. Never use a
broad home/config path as the cleanup target.

Interpretation:

- **Fails:** focus on installation/runtime, selected provider/model,
  authentication, transport/network, or the Pi core.
- **Passes:** reintroduce the original working directory, context files, project
  trust, one resource type, one package/extension, original tools, session, and
  terminal mode in that order.

This is a minimal workflow baseline, not a security sandbox. Use an OS boundary
for untrusted code and network/credential containment. `--offline` disables
Pi's startup update/catalog/telemetry operations, not the selected provider
request or arbitrary network access by the process.

## Isolation ladder

<!-- sync:trouble-ladder -->

| Step | Hold constant | Change one thing | What a change in outcome implicates |
| --- | --- | --- | --- |
| 1 | Same Pi binary and model. | Fresh empty working directory. | Repository files, context, project resources, or path assumptions. |
| 2 | Same prompt/model/cwd. | Print mode instead of TUI. | Terminal rendering, key handling, or interactive extension UI. |
| 3 | Same mode/prompt. | Explicit provider/model and thinking level. | Catalog selection, alias, capability, or model-specific behavior. |
| 4 | Same configuration. | `--no-session`. | Stored history, branch, compaction, or legacy tool-call arguments. |
| 5 | Same cwd. | `--no-context-files --no-approve`. | Context instruction or protected project resource. |
| 6 | Same prompt. | Disable all optional resource discovery. | Extension, skill, prompt, or theme. |
| 7 | Same resource type. | Add back one artifact at a pinned ref. | Specific package/resource or interaction. |
| 8 | Same artifact. | Read-only built-in tool allowlist. | Bash/write behavior or a custom/overridden tool. |
| 9 | Same failure. | Minimal input/repository/file. | Small reproducible trigger. |
| 10 | Same reproducer. | Previous Pi version or a clean profile. | Regression or user configuration state. |

Do not change model, provider, package versions, prompt, and session at once.
That may make the symptom disappear without identifying the cause.

## Installation and update failures

<a id="install-update"></a>

<!-- sync:trouble-install -->

### Checks

1. Confirm which distribution is running:

   ```bash
   command -v pi
   pi --version
   node --version
   ```

2. For the npm/source CLI, verify the release's Node engine requirement. Do not
   apply that npm engine rule blindly to a standalone Bun binary.
3. Separate update surfaces:

   - `pi update --self` updates Pi.
   - `pi update --extensions` updates unpinned packages. Pinned Git refs are
     skipped; move one deliberately with `pi install git:HOST/PATH@NEW_REF`.
   - `pi update --models` refreshes model catalogs.
   - `pi update --all` combines Pi and package updates.

4. For a package failure, record source type and exact spec. Check registry
   access, Git ref existence, SSH configuration, proxy/CA, disk space,
   permissions, package manager configuration, lifecycle scripts, and native
   build output.
5. In CI, make Git failure finite:

   ```bash
   export GIT_TERMINAL_PROMPT=0
   export GIT_SSH_COMMAND="ssh -o BatchMode=yes -o ConnectTimeout=5"
   ```

6. Do not “fix” an install by deleting broad user directories. Locate the exact
   user/project package path from settings and back it up before a targeted,
   recoverable change.

### Distinguish

| Symptom | Likely layer |
| --- | --- |
| `pi` not found | PATH, install target, shell hash/cache, or failed install. |
| Engine/version error | Node runtime does not satisfy the npm package requirement. |
| Registry 404 | Wrong scope/name/version, unpublished artifact, registry mirror, or auth. |
| Git hangs | Interactive credential/host-key prompt or unreachable remote. |
| Native build fails | Runtime ABI, compiler/toolchain, architecture, or lifecycle dependency. |
| Package reappears | Still declared in user/project settings or conventional resource directory. |
| Behavior changed without Pi update | Package update, model catalog refresh, provider service, or configuration change. |

## Provider, model, and authentication failures

<a id="provider-model-auth"></a>

<!-- sync:trouble-provider -->

### Classify before retrying

| Error class | First checks | Do not do |
| --- | --- | --- |
| Unknown model | `--list-models`, exact `provider/model`, catalog refresh time, custom provider registration. | Retry the same alias indefinitely. |
| Missing authentication | Provider-specific login/key route, credential profile, scope, expiry, process environment. | Print the secret into logs or an issue. |
| 401/403 | Wrong credential type, expired token, account/project permission, endpoint, audience. | Treat as transient network failure. |
| 404 | Model/endpoint name, region, API compatibility, gateway route. | Assume the model never existed without checking the selected catalog. |
| 429/quota | Account quota, provider retry-after, concurrency, usage limit. | Stack unbounded client/provider/agent retries. |
| Timeout/hang | DNS/TLS/proxy, transport, idle timeout, streamed bytes, provider status, cancellation. | Immediately increase every timeout. |
| Context overflow | Actual model context, transformed messages, tool output, compaction recognition. | Rewrite rate-limit errors as overflow. |
| Tool schema rejection | Provider compatibility, string enum form, unsupported schema construct, current tool definition. | Blame prompt quality before checking the request. |

Use a one-line prompt with no tools, then add a single read call, a single custom
tool, images, reasoning, and long context separately. Record whether the model
catalog changed since the last passing run.

Pi v0.83.0 defaults provider-level retries to `0` and documents agent-level
retry separately. Keep the layers distinct so Pi can classify quota and
overflow errors.

## Project Trust and resource-loading surprises

<a id="trust-resources"></a>

<!-- sync:trouble-trust -->

### “I declined trust, but repository text still affected the model”

`AGENTS.md` and `CLAUDE.md` are context files and load independently of Project
Trust. Reproduce with `--no-approve --no-context-files`.

### “It works interactively but not in print/JSON/RPC”

Non-interactive modes cannot show a trust prompt. Without a saved applicable
decision, global `defaultProjectTrust` decides whether protected resources load;
`ask` and `never` skip them, while `always` loads them. Pass `--approve` or
`--no-approve` explicitly and declare every resource type.

### “Changing `/trust` had no effect”

The command saves a future decision; it does not reload the current process.
Restart Pi.

### “A read-only tool did something unexpected”

Extensions can override built-in tool names. Reproduce with
`--no-extensions --tools read,grep,find,ls` in an OS-contained environment, and
inspect startup warnings/resource lists.

## Extension and package failures

<a id="extension-package"></a>

<!-- sync:trouble-extension -->

1. Pin the exact artifact and make a copy of settings.
2. Reproduce with all extension discovery off.
3. Load exactly one explicit extension in a disposable environment:

   ```bash
   pi --no-extensions -e ./extension.ts --no-session
   ```

4. Test factory/startup, `session_start`, first tool call, session switch,
   reload, cancellation, and `session_shutdown` separately.
5. Check stderr. General hook errors can be logged while processing continues;
   `tool_call` hook errors fail safe by blocking the tool; a custom tool must
   throw for Pi to mark the result as an error.
6. Look for stale captured `ctx`, duplicate handlers, orphan children, unclosed
   sockets, shared mutable state, same-file races, tool-name collisions, and
   oversized output.
7. For custom tool failures, log sanitized raw arguments, validation result,
   execution start/end, cancellation, result byte/line count, and thrown error.
8. If two packages pass separately but fail together, vary load order and
   inspect same-name tools, hooks that rewrite the same event, global state,
   ports, environment variables, and dependency versions.

Use the [extension review](extension-review.md) before re-enabling the artifact.

## Tool and shell failures

<a id="tool-shell"></a>

<!-- sync:trouble-tools -->

| Symptom | Check |
| --- | --- |
| Command never returns | Tool-native timeout, process tree, stdin wait, pager, prompt, network idle, cancellation propagation. |
| Output appears incomplete | Truncation notice, line/byte limit, head/tail policy, continuation offset, full-output path. |
| Edit lost another edit | Parallel sibling calls and missing `withFileMutationQueue()` around the whole read-modify-write window. |
| Wrong directory | `ctx.cwd`, shell `pwd`, path resolution, session switch, symlink canonicalization. |
| “Error” result treated as success | Custom tool returned error-shaped text instead of throwing. |
| Works in shell, not tool | Different environment, shell, PATH, cwd, non-interactive behavior, stdin, timeout, or sandbox route. |
| Child remains after abort | Signal not forwarded or process-tree cleanup incomplete. |
| `!!` output still appears in export | Excluded-from-model context is not excluded from session persistence/export. |

Capture full output to a deliberate file when needed. Never remove truncation
markers to make a result look complete.

## Session and compaction failures

<a id="session-compaction"></a>

<!-- sync:trouble-session -->

### Wrong or missing context

1. Use `/session` to record the current ID and model.
2. Inspect `/tree` for the active leaf.
3. Determine whether a prior `/fork`, `/clone`, or CLI `--fork` created a new
   file.
4. Check for a compaction entry and compare the active model-visible summary
   with the original JSONL history.
5. Reproduce in `--no-session` mode.

Session operations do not restore repository files. Compare Git/filesystem state
separately.

### Compaction changed behavior

- Record whether compaction was manual, threshold-triggered, or overflow
  recovery.
- Save the summary, `firstKeptEntryId`, token settings, model, and custom
  compaction extension.
- Check whether a single oversized turn forced a split-turn boundary.
- Move invariants and decisions into files, then retry from a fresh or cloned
  session.
- Do not claim data was deleted merely because it left model-visible context;
  original entries normally remain in JSONL.

### Old custom tool calls fail after an upgrade

An old session can contain arguments for an earlier schema. Reproduce in a fresh
session. Extension authors should keep the public schema strict and use the
documented argument-preparation compatibility hook when appropriate.

## Terminal and TUI failures

<a id="terminal-tui"></a>

<!-- sync:trouble-terminal -->

First run the same prompt in print mode. If print mode passes:

- record terminal emulator/version, `$TERM`, locale, multiplexer, SSH layer,
  font, color mode, and alternate-screen choice;
- compare outside tmux/screen and outside SSH;
- check Pi's terminal setup, tmux, Windows, Termux, and keybinding docs;
- test input keys with conflicting terminal shortcuts;
- note that Windows Terminal and some macOS terminals bind Alt/Option+Enter for
  fullscreen or fail to transmit it distinctly;
- disable UI extensions/themes one at a time;
- resize the terminal and test narrow widths, Unicode, wide characters, and
  pasted multiline text;
- use `/debug` only with care: its log can contain rendered lines and messages
  sent to the model.

Do not report a terminal rendering problem as a provider failure merely because
the final response looks truncated.

## JSON, RPC, and SDK failures

<a id="json-rpc-sdk"></a>

<!-- sync:trouble-integration -->

### JSON mode

- Treat stdout as JSON lines, keep stderr separate, and tolerate streaming and
  partial events.
- Do not assume a `message_end` means the entire process lifecycle is finished
  when other finalization/error events remain.
- Test aborted, failed, and compaction-retry sequences.

### v0.83.0 CLI RPC

- Split records only on LF (`\n`); optionally remove a trailing CR. Do not use a
  line splitter that also treats U+2028/U+2029 as delimiters.
- Separate command responses from asynchronous events.
- Correlate commands, implement `abort`/`abort_bash`, drain stderr, and define a
  child-exit policy.
- Send malformed and unknown commands in tests; do not let one bad line corrupt
  subsequent framing.
- Pin Pi: the interface is released in v0.83.0, but no long-term compatibility
  guarantee is documented.

### SDK

- Confirm which `ResourceLoader` is active; the default can discover standard
  resources.
- Subscribe/unsubscribe explicitly, propagate cancellation, and call disposal
  methods.
- When replacing a session runtime, rebind session-specific subscriptions and
  extensions; do not keep stale references.
- Test authentication resolution, resource diagnostics, in-memory versus
  persisted session behavior, and host shutdown.

Do not send CLI-RPC JSON to the post-v0.83.0 framed-CBOR
`@earendil-works/pi-protocol`; they are different interfaces.

## Windows-specific split

<a id="windows-route"></a>

<!-- sync:trouble-windows -->

Determine first whether Pi is running:

- as native Windows Node/Bun;
- in WSL with Linux paths and processes;
- in a container/remote environment accessed from Windows;
- through an editor terminal, Windows Terminal, or SSH.

Then check path separator/drive/UNC behavior, shell selection, CRLF, executable
suffixes, quoting, code page/UTF-8, terminal keybindings, symlinks, antivirus
locks, file watcher behavior, and process-tree cancellation. Do not combine
native and WSL paths in one minimal reproducer.

<!-- sync:trouble-resolution -->

## Close a diagnosis with a verified resolution

Every branch in this playbook should end in the same auditable loop:

1. **Symptom:** preserve the exact failure, timestamp and smallest affected
   artifact before changing anything.
2. **Comparison:** change one variable and record both commands, effective
   environments, expected results, actual results and exit states.
3. **Attribution:** name the narrowest layer that the comparison implicates;
   keep alternative explanations when the observation is not unique.
4. **Remediation:** choose the smallest reversible change. State files,
   settings, package refs, credentials and external state it will affect.
5. **Reverification:** reproduce the old failure case, run the focused check,
   run the relevant regression/negative checks, and confirm cleanup.
6. **Prevention:** add a regression test, version guard, clearer diagnostic,
   runbook update or monitoring signal when justified.

Use this compact record for each attempted fix:

```text
Hypothesis:
One changed variable:
Before command / expected / actual / exit:
After command / expected / actual / exit:
Implicated layer and remaining alternatives:
Remediation and affected state:
Focused / regression / negative results:
Rollback performed or rehearsed:
Cleanup and retained artifacts:
Owner / next step / retest trigger:
```

A disappearing symptom is not enough: if the run also changed the model,
provider, session, package set and working directory, classify it as an
unresolved workaround and continue with controlled comparisons.

## Sanitized evidence bundle

<!-- sync:trouble-bundle -->

An actionable report contains:

```text
Summary:
Impact:
Expected:
Actual:
First known failing version:
Last known passing version:
Pi distribution and version:
Node/Bun version:
OS/architecture:
Terminal/shell/mode:
Provider/model/thinking/transport:
Session: fresh | existing | compacted
Project trust/context/resource flags:
Package/extension exact refs:
Repository state or minimal fixture:
Minimal command/prompt:
Numbered reproduction steps:
Sanitized error/event excerpt:
One-variable isolation results:
Security/data implications:
```

Before sharing, remove API keys, bearer tokens, cookies, credential paths,
private code, session content, account/project IDs, personal paths, hostnames,
and signed URLs. Replace values with stable labels so repeated values remain
correlatable.

## Stop conditions

<!-- sync:trouble-stop -->

Stop testing and escalate privately when you observe:

- credential or private-source exfiltration;
- execution outside the claimed containment boundary;
- artifact integrity/provenance mismatch;
- destructive behavior outside the declared path;
- a reproducible privilege-boundary bypass;
- a compromised package/release;
- a vulnerability whose public reproduction would create immediate harm.

For expected local-agent behavior—full user permissions, prompt injection from
untrusted content, or dangerous third-party instructions—first improve
containment and documentation. Follow Pi's current security reporting policy
for a genuine boundary bypass. For exposed evidence or a vulnerability in this
guide's own scripts/content, use this repository's [security policy](../SECURITY.md),
which identifies the private reporting route and data-minimization rules.
