[English](./source-map.md) | [简体中文](./source-map.zh-CN.md)

# Official Pi source map

<!-- sync:source-baseline -->

Use this map to replace search snippets and remembered behavior with an
authoritative source. The stable research baseline is:

| Field | Value |
| --- | --- |
| Release | [`v0.83.0`](https://github.com/earendil-works/pi/releases/tag/v0.83.0), published `2026-07-29T22:30:33Z`. |
| Tag commit | [`845d6ff1f6643aba440341cce877ce1c43ebbc39`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39). |
| npm/source Node engine | `>=22.19.0` for the coding-agent package; do not infer the same requirement for standalone Bun binaries. |
| Source archive | [`pi-0.83.0-source.tar.gz`](https://github.com/earendil-works/pi/releases/download/v0.83.0/pi-0.83.0-source.tar.gz). |
| Source SHA-256 | `f225b87ec3b4825dd5b94e922a8629558addca31a1b4d2c206ae598a8e2692c0`, from the release `SHA256SUMS` asset at the snapshot. |
| Research `main` | [`9b50b046d328d589a81400d2e184175d0bf19734`](https://github.com/earendil-works/pi/tree/9b50b046d328d589a81400d2e184175d0bf19734), 56 commits ahead of the tag at capture time. |
| Snapshot | 2026-07-31, Asia/Singapore. |

The release timestamp, commit timestamp, and changelog date can fall on
different calendar dates or time zones. Preserve the timestamp/source instead
of flattening them into an ambiguous “released on” date.

## Canonical entry points

<!-- sync:source-entry -->

| Question | Current discovery link | Version-pinned source |
| --- | --- | --- |
| What is Pi? | [Repository](https://github.com/earendil-works/pi) | [v0.83.0 root README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/README.md) |
| How do I begin? | [Quickstart](https://pi.dev/docs/latest/quickstart) | [v0.83.0 quickstart](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/quickstart.md) |
| What are all CLI modes/options? | [Usage](https://pi.dev/docs/latest/usage) | [v0.83.0 usage](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md) |
| What changed? | [Releases](https://github.com/earendil-works/pi/releases) | [v0.83.0 coding-agent changelog](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/CHANGELOG.md) |
| How do I contribute? | [Current contribution guide](https://github.com/earendil-works/pi/blob/main/CONTRIBUTING.md) | [v0.83.0 contribution gate](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/CONTRIBUTING.md) |
| How do I report security issues? | [Current security policy](https://github.com/earendil-works/pi/security/policy) | [v0.83.0 local-agent boundary](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md) |

## Package and architecture sources

<!-- sync:source-packages -->

The v0.83.0 root “All Packages” table lists four primary packages. This label
does not make every other workspace stable or published.

| Package/layer | Source | Primary responsibility |
| --- | --- | --- |
| `@earendil-works/pi-ai` | [README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/README.md) · [package manifest](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/package.json) | Provider-normalized streaming, messages, tools, usage, and transformations. |
| `@earendil-works/pi-agent-core` | [README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/README.md) · [package manifest](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/package.json) | Agent loop, state, events, tools, and transports. |
| `@earendil-works/pi-coding-agent` | [README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md) · [package manifest](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/package.json) | CLI, coding tools, sessions, resources, TUI modes, SDK, JSON, and RPC. |
| `@earendil-works/pi-tui` | [README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/tui/README.md) · [package manifest](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/tui/package.json) | Terminal components, rendering, input, layout, and width handling. |
| `@earendil-works/pi-storage-sqlite-node` | [source directory](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/storage/sqlite-node) | Optional Node SQLite backend for the agent harness; not an automatic replacement for coding-agent JSONL sessions. |
| `@earendil-works/pi-server` | [experimental README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/server/README.md) | Experimental server present in the v0.83.0 source tree; API/CLI/behavior may change or disappear. |

At the snapshot, registry checks found the five named `@earendil-works/*`
packages above at `0.83.0` except the experimental server, while
`@earendil-works/pi-server` and the post-release
`@earendil-works/pi-protocol` were not stable published registry packages.
Always verify the current registry before installation.

## Security, trust, and isolation

<!-- sync:source-security -->

| Topic | Best primary source | Essential boundary |
| --- | --- | --- |
| Local permission model | [Security: no built-in sandbox](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md#no-built-in-sandbox) | Pi, tools, and extensions run as the invoking user. |
| Project Trust | [Security: Project Trust](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md#project-trust) | Resource-loading gate, not tool/OS permission. |
| Context files | [Usage: context files](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#context-files) | `AGENTS.md`/`CLAUDE.md` need `-nc` to disable; declining trust is insufficient. |
| Untrusted/unattended work | [Security: containment](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md#running-untrusted-or-unmonitored-work) | Use external OS/virtualization policy and minimum mounts, credentials, network. |
| Container patterns | [Containerization](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/containerization.md) | Whole-process isolation differs from routing only selected tools. |
| Offline/telemetry flags | [Environment variables](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/environment-variables.md) · [README telemetry section](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md#telemetry-and-update-checks) | Offline/startup and telemetry controls are not a network firewall. |
| Package authority | [Packages: security warning](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md#install-and-manage) | Extensions execute; skills can direct executable/tool use. |

## Context, sessions, and compaction

<!-- sync:source-session -->

| Topic | Primary source | What it answers |
| --- | --- | --- |
| Hierarchical context | [Usage](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#context-files) · [resource loader](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/core/resource-loader.ts) | Search locations, file preference, ordering, and disable flag. |
| Session operations | [Sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md) | Persistence, naming, resume, tree, fork, clone, export, share. |
| JSONL schema | [Session format](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/session-format.md) | Header and entry types, parent tree, custom entries, compaction entries. |
| Compaction behavior | [Compaction](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/compaction.md) | Trigger, kept context, split turns, summary format, extension hooks. |
| Compaction defaults | [Settings](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md#compaction) | v0.83.0 defaults: reserve 16,384, keep recent 20,000 tokens. |
| Message queues | [Usage: message queue](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#message-queue) | Steering/follow-up timing, abort, and queue modes. |
| Sharing implementation | [Share command source](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/modes/interactive/interactive-mode.ts) · [HTML exporter](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/core/export-html/index.ts) | Secret/unlisted gist behavior and what the exporter embeds. |

## Customization and package sources

<!-- sync:source-custom -->

| Primitive | Primary source | Review focus |
| --- | --- | --- |
| Prompt template | [Prompt templates](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md) | Locations, trust, explicit expansion, arguments. |
| Skill | [Skills](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md) | Progressive disclosure, locations, executables, validation. |
| Extension | [Extensions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md) | Lifecycle, events, tools, UI, policy, providers, errors, truncation. |
| Pi package | [Packages](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md) | npm/Git/local source, refs, install, manifest, dependencies, filters. |
| Theme | [Themes](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/themes.md) | Discovery, schema, terminal support, live development. |
| Custom provider | [Custom provider](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/custom-provider.md) | Registration, model discovery, auth, streaming, errors, overflow. |
| Examples | [Extension index](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/README.md) | Patterns only; verify production requirements separately. |
| Public catalog | [Pi packages](https://pi.dev/packages) | Discovery only; filters can overlap and entries are not endorsed. |

Especially relevant example sources:

- [project-trust.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/project-trust.ts)
  demonstrates handling the trust event.
- [permission-gate.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/permission-gate.ts)
  demonstrates an extension policy, not a built-in permission system.
- [sandbox/](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/sandbox)
  and [gondolin/](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/gondolin)
  demonstrate tool routing; inspect which code still runs on the host.
- [subagent/](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/subagent),
  [plan-mode/](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/plan-mode),
  and [todo.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/todo.ts)
  prove those capabilities can be extensions; Pi deliberately does not make
  them default core features.
- [tool-override.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/tool-override.ts),
  [tools.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/tools.ts),
  and [truncated-tool.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/truncated-tool.ts)
  cover override, schema/result, and output-limit patterns.

## Providers, models, retries, and transformations

<!-- sync:source-models -->

| Topic | Primary source | Important qualification |
| --- | --- | --- |
| Model selection/catalog | [Models](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/models.md) | Catalogs and provider configuration can refresh independently. |
| Built-in providers/auth | [Providers](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/providers.md) | Scope claims to provider, auth route, region/gateway, and model. |
| Retry defaults | [Settings: retry](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md#retry) | Agent and provider retry layers differ; provider default is zero. |
| Overflow recovery | [Custom provider: context overflow](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/custom-provider.md#context-overflow-detection) | Provider-specific mapping must not turn quota errors into compaction. |
| Cross-provider conversion | [Transformation implementation](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/src/api/transform-messages.ts) | Best-effort/lossy: thinking, signatures, images, IDs, failed messages, and orphan tool calls can change. |

## Tools, output, and concurrency

<!-- sync:source-tools -->

| Topic | Primary source | Important qualification |
| --- | --- | --- |
| Tool options | [Usage: tool options](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#tool-options) | An allowlist addresses registered names, not arbitrary extension process APIs. |
| Custom tools | [Extensions: custom tools](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md#custom-tools) | Schema, `StringEnum`, errors, cancellation, usage, rendering, overrides. |
| Parallel execution | [Agent event flow](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/README.md#event-flow) | Sibling calls run concurrently; a sequential tool can serialize the batch. |
| Same-file mutation | [Extensions: file mutation queue](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md#custom-tools) | Queue the full canonical read-modify-write window. |
| Output limits | [Extensions: output truncation](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md#output-truncation) | Common 50 KB/2,000-line ceiling; individual tools have head/tail/count policies. |
| Shell session environment | [Environment variables](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/environment-variables.md#bash-tool-session-environment) | Session/model variables can be exposed to spawned shell work unless configured otherwise. |

## Integration interfaces

<!-- sync:source-integration -->

| Interface | v0.83.0 source | Framing/ownership |
| --- | --- | --- |
| Print/interactive | [Usage: modes](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#modes) | Human/one-shot CLI; use `--no-session` for explicit ephemerality. |
| JSON mode | [JSON event stream](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/json.md) | One-way JSON lines with streaming, queue, compaction, retry, and error events. |
| CLI RPC | [RPC](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md) | Requests/responses/events over stdio; only LF separates records. Pin the Pi version. |
| SDK | [SDK](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sdk.md) | In-process TypeScript; host owns lifecycle, resources, cancellation, credentials, and cleanup. |

### Main-only experimental protocol

`@earendil-works/pi-protocol` was introduced after v0.83.0 in
[`56eb685b…`](https://github.com/earendil-works/pi/commit/56eb685b69bb1a6c158c9eb8ead147e1d31e9d3f).
At the research commit, its
[README](https://github.com/earendil-works/pi/blob/9b50b046d328d589a81400d2e184175d0bf19734/packages/protocol/README.md)
defines protocol version 2, `[uint32-be length][definite-length CBOR]`, a first
`hello` message with bearer token, authoritative snapshots, transient progress,
and no compatibility guarantee. It is not part of the v0.83.0 tag and is not
CLI RPC.

## Terminal and platform sources

<!-- sync:source-platform -->

| Area | Primary source |
| --- | --- |
| Terminal emulator setup and Alt/Option+Enter conflicts | [Terminal setup](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/terminal-setup.md) |
| Tmux behavior | [Tmux](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/tmux.md) |
| Windows guidance | [Windows](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/windows.md) |
| Android/Termux | [Termux](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/termux.md) |
| Keybindings | [Keybindings](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/keybindings.md) |
| TUI extension APIs | [TUI](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/tui.md) |

## Name and scope migration

<!-- sync:source-migration -->

Older primary/maintainer material may refer to `badlogic/pi-mono`,
`earendil-works/pi-mono`, or `@mariozechner/*`. The scope migration commit is
[`3e5ad67e…`](https://github.com/earendil-works/pi/commit/3e5ad67e0f325d4888f82f9b82966218eb4407f5)
from 2026-05-07. New instructions should use `earendil-works/pi` and
`@earendil-works/*`; preserve old names only when citing historical material or
explaining migration.

Do not mechanically replace old URLs inside an immutable quote, commit, tag, or
third-party repository. Instead, label the source historical and verify that
its commands still apply.

## Maintainer and design context

<!-- sync:source-context -->

These sources are valuable context but rank below tagged implementation for
behavioral claims:

- [Pi: The Minimal Agent Within](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
  explains the minimal, extensible design philosophy under historical naming.
- [What If You Don't Need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
  explains the design tradeoff behind not making MCP a built-in default.
- [Pi-related RFCs](https://rfc.earendil.com/keyword/pi/) expose proposal states;
  an RFC is not proof that a change shipped in a stable tag.

When a blog, RFC, README, and tagged source disagree, scope the claim to tagged
source and record the discrepancy.
