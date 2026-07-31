[English](./glossary.md) | [简体中文](./glossary.zh-CN.md)

# Pi practice glossary

<!-- sync:glossary-use -->

These definitions use Pi v0.83.0 terminology unless marked `main-only`. They
clarify terms that are commonly treated as synonyms even though they have
different execution, persistence, or trust semantics.

## Runtime and model terms

<!-- sync:glossary-runtime -->

| Term | Meaning in this repository | Common confusion |
| --- | --- | --- |
| Pi | The `earendil-works/pi` project. In a command example, usually the `pi` CLI from `@earendil-works/pi-coding-agent`. | Not every package in the monorepo is the coding-agent CLI or equally stable. |
| Coding harness | A runtime that connects model messages, tools, sessions, resources, and user interfaces. | Pi is intentionally smaller than a full IDE or policy sandbox. |
| `pi-ai` | Provider-normalized model/message/streaming/tool utilities. | Normalization does not make every cross-provider conversion lossless. |
| `pi-agent-core` | Agent loop, state, events, tools, and transport primitives. | It does not automatically provide coding-agent resource/session UX. |
| `pi-coding-agent` | CLI, coding tools, resource loading, sessions, TUI modes, SDK, JSON, and RPC integration. | Project Trust is not a tool permission system. |
| `pi-tui` | Terminal rendering and component library. | Terminal compatibility still depends on emulator, multiplexer, locale, and key transmission. |
| Provider | A model API/authentication/transport integration identified by Pi. | A provider name is not a model name, account, or guarantee of one transport. |
| Model catalog | Pi's current metadata for selectable models and capabilities. It can refresh independently of the Pi binary. | Recording only `pi --version` does not freeze the catalog. |
| Thinking level | A Pi selection that influences supported model reasoning behavior. | Providers represent reasoning differently; it may not survive a handoff. |
| Transport | Provider communication choice such as SSE, WebSocket, or automatic selection where supported. | This is distinct from CLI RPC and the experimental Pi protocol. |

## Resource and customization terms

<!-- sync:glossary-resources -->

| Term | Meaning in this repository | Common confusion |
| --- | --- | --- |
| Resource | Generic Pi-loadable customization material: extension, skill, prompt template, theme, context, or package-declared material depending on the context. | “Resource” does not imply passive or safe. |
| Context file | Hierarchically discovered `AGENTS.md` or `CLAUDE.md` text appended to model context. | It can load even when Project Trust is declined; use `-nc` to disable discovery. |
| Project Trust | A decision controlling protected project settings/resources/package loading. | It is not an OS sandbox and does not restrict enabled tools after startup. |
| Prompt template | Markdown expanded through an explicit slash command, with optional arguments. | It is not automatically invoked like a runtime hook. |
| Skill | On-demand instructions plus optional scripts/references/assets; metadata is discoverable before the full skill is read. | Skills may direct powerful tool or executable use and need review. |
| Extension | In-process TypeScript/JavaScript that can register events, tools, commands, UI, providers, and policy. | An extension can act outside registered tools using normal process APIs. |
| Theme | Terminal presentation configuration. | A package containing a theme may also contain executable resources. |
| Pi package | A distribution bundle for extensions, skills, prompts, and themes from npm, Git, or local paths. | Package catalog listing is not hands-on or security verification. |
| Package source | An npm spec, Git URL/ref, or local path declared for package resolution. | `-e` is temporary loading, not sandboxing. |
| Pinned ref | Exact npm version or Git tag/commit kept from automatically advancing under documented update behavior. | Pinning improves reproducibility, not trustworthiness. |

## Tools and extension lifecycle

<!-- sync:glossary-tools -->

| Term | Meaning in this repository | Common confusion |
| --- | --- | --- |
| Built-in tool | Pi-provided `read`, `bash`, `edit`, `write`, and optional `grep`, `find`, `ls`. | An extension can override a built-in by registering the same name. |
| Tool allowlist | CLI/runtime selection of active registered tool names. | It is not an OS-level restriction on extension code. |
| Tool schema | Machine-readable parameter contract shown to a model/provider. | A human-readable description cannot compensate for an invalid/provider-incompatible schema. |
| Tool result | Content/details returned to Pi and often placed in model/session context. | Returning text that says “error” does not set `isError`; the tool must throw. |
| Event/hook | Extension callback around session, agent, message, tool, model, input, or UI lifecycle. | Error behavior differs by event; notably, `tool_call` hook errors block fail-safe. |
| Factory | Default extension export called while resources load to register behavior. It may be asynchronous and delays startup. | Long-lived resources should normally start with the session or on demand, not in the factory. |
| Session-bound context | The current event/API objects tied to one session runtime. | Captured objects can become stale after replacement or reload. |
| File mutation queue | Pi helper that serializes a complete read-modify-write window for the same canonical file. | Tool calls otherwise run concurrently by default. |
| Truncation | Deliberately bounding tool output and explaining omitted data/continuation. | It is not the same as compaction, which summarizes conversation context. |

## Session and context terms

<!-- sync:glossary-sessions -->

| Term | Meaning in this repository | Common confusion |
| --- | --- | --- |
| Session | Persistent or in-memory conversation state managed by the coding agent. Default persisted sessions use JSONL. | A session is not a Git checkpoint or a complete execution manifest. |
| Session entry | One JSONL tree node with an ID and usually a parent relationship, such as message, model change, compaction, or custom data. | Physical file order alone does not define the active conversation path. |
| Active leaf | The terminal node whose ancestors form the current model-visible branch, subject to compaction. | Other branches can remain in the file without being active. |
| `/tree` | Select or create branches inside the same session file. | It does not restore filesystem state. |
| `/fork` | Start a new session file from an earlier user-message point, allowing the selected prompt to be edited. | It is different from creating a branch inside the original file. |
| `/clone` | Copy the full current active branch into a new session file and continue from its end. | It does not duplicate the repository or process environment. |
| Compaction | Lossy summary entry replacing older model-visible context while the original JSONL entries remain. | “History remains” does not mean every detail remains visible to the model. |
| Branch summary | Summary used when navigating between branches so relevant abandoned-branch context can be represented. | It is related to but not identical to the active-path compaction operation. |
| Steering message | Queued instruction delivered after the current assistant turn's tool calls and before the next model call. | It does not immediately interrupt the currently running tool. |
| Follow-up message | Queued instruction delivered after the agent has no remaining tool calls or steering work. | It is intentionally later than steering. |
| `!!command` | User shell command whose output is excluded from model context. | It still executes locally, and output can persist in the session/export. |

## Integration and security terms

<!-- sync:glossary-integration -->

| Term | Meaning in this repository | Common confusion |
| --- | --- | --- |
| Interactive mode | Human-facing terminal UI with commands, editor, and rendering. | TUI text should not be scraped as a machine protocol. |
| Print mode | Non-interactive one-shot use that emits final output. | It is not automatically sessionless; add `--no-session` when required. |
| JSON mode | JSON-line event output for observing a run. | It does not provide the same bidirectional command surface as RPC. |
| CLI RPC | The JSONL stdio request/response/event interface released in v0.83.0. | Only LF frames records; it is not the main-only framed-CBOR protocol, and no long-term compatibility guarantee is documented. |
| SDK | In-process TypeScript API for constructing and owning sessions/resources/tools. | The host application assumes lifecycle, policy, credential, and cleanup responsibility. |
| `@earendil-works/pi-protocol` | `main-only` experimental protocol added after v0.83.0 using length-prefixed CBOR. | Its package metadata version does not make it part of the v0.83.0 tag or compatible with CLI RPC. |
| Sandbox | Enforced boundary restricting actions despite malicious or erroneous code. | Pi's Project Trust and tool allowlist are not complete sandboxes. |
| Containment | External control using a container, VM, micro-VM, remote sandbox, OS policy, filesystem mounts, credential scope, and network policy. | Routing only some tools into a sandbox leaves other host extension code outside it. |
| Secret/unlisted gist | GitHub gist created with `/share` in v0.83.0 and readable via its URL. | It is not an ACL-private document and is not automatically redacted. |

## Curation status terms

<!-- sync:glossary-curation -->

| Term | Meaning in this repository |
| --- | --- |
| `discovered` | Found by search or referral; not yet reviewed. |
| `source-reviewed` | Purpose, source, metadata, license, and obvious boundaries inspected; not executed by this repository's maintainer. |
| `hands-on-verified` | A named human recorded and personally ran a pinned artifact, environment, steps, expected/actual result, and cleanup. |
| `featured` | Hands-on evidence plus current human editorial judgment merits inclusion in the root curated list. |
| Main-only | Observed at the named post-release `main` commit and absent from the stable baseline. |
| Experimental | Upstream explicitly withholds stability/compatibility promises. |
| Inference | Advice synthesized from cited facts; not a behavior enforced by Pi. |
