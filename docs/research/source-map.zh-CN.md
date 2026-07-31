[English](./source-map.md) | [简体中文](./source-map.zh-CN.md)

# Pi 官方来源地图

<!-- sync:source-baseline -->

用本地图把 Search Snippet 和记忆中的行为换成权威来源。稳定研究基线为：

| 字段 | 值 |
| --- | --- |
| Release | [`v0.83.0`](https://github.com/earendil-works/pi/releases/tag/v0.83.0)，发布于 `2026-07-29T22:30:33Z`。 |
| Tag Commit | [`845d6ff1f6643aba440341cce877ce1c43ebbc39`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39)。 |
| npm/Source Node Engine | Coding-agent Package 为 `>=22.19.0`；不要据此推断独立 Bun Binary 有相同要求。 |
| Source Archive | [`pi-0.83.0-source.tar.gz`](https://github.com/earendil-works/pi/releases/download/v0.83.0/pi-0.83.0-source.tar.gz)。 |
| Source SHA-256 | `f225b87ec3b4825dd5b94e922a8629558addca31a1b4d2c206ae598a8e2692c0`，来自快照时 Release `SHA256SUMS` Asset。 |
| 研究 `main` | [`9b50b046d328d589a81400d2e184175d0bf19734`](https://github.com/earendil-works/pi/tree/9b50b046d328d589a81400d2e184175d0bf19734)，捕获时比 Tag 多 56 个 Commit。 |
| 快照 | 2026-07-31，Asia/Singapore。 |

Release Timestamp、Commit Timestamp 与 Changelog Date 可能落在不同日历日期或
时区。应保留 Timestamp/Source，而不是压成含糊的“发布于某天”。

## 规范入口

<!-- sync:source-entry -->

| 问题 | 当前发现链接 | 固定版本来源 |
| --- | --- | --- |
| Pi 是什么？ | [Repository](https://github.com/earendil-works/pi) | [v0.83.0 Root README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/README.md) |
| 如何开始？ | [Quickstart](https://pi.dev/docs/latest/quickstart) | [v0.83.0 Quickstart](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/quickstart.md) |
| CLI Mode/Option 有哪些？ | [Usage](https://pi.dev/docs/latest/usage) | [v0.83.0 Usage](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md) |
| 什么发生了变化？ | [Releases](https://github.com/earendil-works/pi/releases) | [v0.83.0 Coding-agent Changelog](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/CHANGELOG.md) |
| 如何贡献？ | [Current Contribution Guide](https://github.com/earendil-works/pi/blob/main/CONTRIBUTING.md) | [v0.83.0 Contribution Gate](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/CONTRIBUTING.md) |
| 如何报告安全问题？ | [Current Security Policy](https://github.com/earendil-works/pi/security/policy) | [v0.83.0 Local-agent Boundary](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md) |

## Package 与架构来源

<!-- sync:source-packages -->

v0.83.0 Root “All Packages” 表列出四个主要 Package。这个标签不表示所有其他
Workspace 都稳定或已经发布。

| Package/层 | 来源 | 主要职责 |
| --- | --- | --- |
| `@earendil-works/pi-ai` | [README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/README.md) · [Package Manifest](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/package.json) | 统一 Provider 的 Streaming、Message、Tool、Usage 与 Transformation。 |
| `@earendil-works/pi-agent-core` | [README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/README.md) · [Package Manifest](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/package.json) | Agent Loop、State、Event、Tool 与 Transport。 |
| `@earendil-works/pi-coding-agent` | [README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md) · [Package Manifest](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/package.json) | CLI、Coding Tool、Session、Resource、TUI Mode、SDK、JSON 与 RPC。 |
| `@earendil-works/pi-tui` | [README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/tui/README.md) · [Package Manifest](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/tui/package.json) | Terminal Component、Rendering、Input、Layout 与 Width Handling。 |
| `@earendil-works/pi-storage-sqlite-node` | [Source Directory](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/storage/sqlite-node) | Agent Harness 的可选 Node SQLite Backend；不会自动替代 Coding-agent JSONL Session。 |
| `@earendil-works/pi-server` | [Experimental README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/server/README.md) | v0.83.0 源码树中的实验 Server；API/CLI/Behavior 可以改变或消失。 |

快照时，Registry Check 在 `0.83.0` 找到以上五个命名的
`@earendil-works/*` Package（不含实验 Server）；
`@earendil-works/pi-server` 与发布后的 `@earendil-works/pi-protocol` 都不是
稳定已发布 Registry Package。安装前始终重新验证当前 Registry。

## 安全、信任与隔离

<!-- sync:source-security -->

| 主题 | 最佳一手来源 | 核心边界 |
| --- | --- | --- |
| 本地权限模型 | [Security: no built-in sandbox](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md#no-built-in-sandbox) | Pi、Tool 与 Extension 继承启动用户权限。 |
| Project Trust | [Security: Project Trust](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md#project-trust) | Resource-loading Gate，不是 Tool/OS Permission。 |
| Context File | [Usage: context files](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#context-files) | `AGENTS.md`/`CLAUDE.md` 需要 `-nc` 关闭；拒绝 Trust 不够。 |
| 不可信/无人值守工作 | [Security: containment](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md#running-untrusted-or-unmonitored-work) | 使用外部 OS/Virtualization Policy，最少 Mount、Credential 与 Network。 |
| Container Pattern | [Containerization](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/containerization.md) | 整个 Process Isolation 不同于只路由特定 Tool。 |
| Offline/Telemetry Flag | [Environment Variables](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/environment-variables.md) · [README Telemetry Section](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md#telemetry-and-update-checks) | Offline/Startup 与 Telemetry Control 都不是 Network Firewall。 |
| Package Authority | [Packages: Security Warning](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md#install-and-manage) | Extension 执行代码；Skill 可指导 Executable/Tool Use。 |

## 上下文、Session 与 Compaction

<!-- sync:source-session -->

| 主题 | 一手来源 | 回答内容 |
| --- | --- | --- |
| Hierarchical Context | [Usage](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#context-files) · [Resource Loader](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/core/resource-loader.ts) | Search Location、File Preference、Order 与 Disable Flag。 |
| Session Operation | [Sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md) | Persistence、Naming、Resume、Tree、Fork、Clone、Export、Share。 |
| JSONL Schema | [Session Format](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/session-format.md) | Header/Entry Type、Parent Tree、Custom Entry、Compaction Entry。 |
| Compaction Behavior | [Compaction](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/compaction.md) | Trigger、Kept Context、Split Turn、Summary Format、Extension Hook。 |
| Compaction Default | [Settings](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md#compaction) | v0.83.0 默认 Reserve 16,384、Keep Recent 20,000 Token。 |
| Message Queue | [Usage: Message Queue](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#message-queue) | Steering/Follow-up 时点、Abort 与 Queue Mode。 |
| Sharing Implementation | [Share Command Source](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/modes/interactive/interactive-mode.ts) · [HTML Exporter](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/core/export-html/index.ts) | Secret/Unlisted Gist Behavior 与 Exporter Embed 内容。 |

## 定制与 Package 来源

<!-- sync:source-custom -->

| 原语 | 一手来源 | 审查重点 |
| --- | --- | --- |
| Prompt Template | [Prompt Templates](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md) | Location、Trust、Explicit Expansion、Argument。 |
| Skill | [Skills](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md) | Progressive Disclosure、Location、Executable、Validation。 |
| Extension | [Extensions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md) | Lifecycle、Event、Tool、UI、Policy、Provider、Error、Truncation。 |
| Pi Package | [Packages](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md) | npm/Git/Local Source、Ref、Install、Manifest、Dependency、Filter。 |
| Theme | [Themes](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/themes.md) | Discovery、Schema、Terminal Support、Live Development。 |
| Custom Provider | [Custom Provider](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/custom-provider.md) | Registration、Model Discovery、Auth、Streaming、Error、Overflow。 |
| Example | [Extension Index](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/README.md) | 只是 Pattern；Production Requirement 另行验证。 |
| Public Catalog | [Pi Packages](https://pi.dev/packages) | 仅发现；Filter 可重叠，Entry 不代表背书。 |

特别相关的 Example Source：

- [project-trust.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/project-trust.ts)
  展示 Trust Event Handling。
- [permission-gate.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/permission-gate.ts)
  展示 Extension Policy，不是 Built-in Permission System。
- [sandbox/](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/sandbox)
  与 [gondolin/](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/gondolin)
  展示 Tool Routing；应检查哪些 Code 仍在 Host 运行。
- [subagent/](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/subagent)、
  [plan-mode/](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/plan-mode)
  与 [todo.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/todo.ts)
  证明这些能力可用 Extension 实现；Pi 刻意不把它们设为默认 Core Feature。
- [tool-override.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/tool-override.ts)、
  [tools.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/tools.ts)
  与 [truncated-tool.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/truncated-tool.ts)
  覆盖 Override、Schema/Result 与 Output-limit Pattern。

## Provider、模型、重试与转换

<!-- sync:source-models -->

| 主题 | 一手来源 | 重要限定 |
| --- | --- | --- |
| Model Selection/Catalog | [Models](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/models.md) | Catalog 与 Provider Configuration 可独立刷新。 |
| Built-in Provider/Auth | [Providers](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/providers.md) | 结论应限定到 Provider、Auth Route、Region/Gateway 与 Model。 |
| Retry Default | [Settings: Retry](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md#retry) | Agent/Provider Retry Layer 不同；Provider Default 为零。 |
| Overflow Recovery | [Custom Provider: Context Overflow](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/custom-provider.md#context-overflow-detection) | Provider-specific Mapping 不能把 Quota Error 变成 Compaction。 |
| Cross-provider Conversion | [Transformation Implementation](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/src/api/transform-messages.ts) | Best-effort/Lossy：Thinking、Signature、Image、ID、Failed Message 与 Orphan Tool Call 会变化。 |

## Tool、输出与并发

<!-- sync:source-tools -->

| 主题 | 一手来源 | 重要限定 |
| --- | --- | --- |
| Tool Option | [Usage: Tool Options](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#tool-options) | Allowlist 针对 Registered Name，不是任意 Extension Process API。 |
| Custom Tool | [Extensions: Custom Tools](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md#custom-tools) | Schema、`StringEnum`、Error、Cancellation、Usage、Rendering、Override。 |
| Parallel Execution | [Agent Event Flow](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/README.md#event-flow) | Sibling Call 并发；一个 Sequential Tool 可串行化 Batch。 |
| Same-file Mutation | [Extensions: File Mutation Queue](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md#custom-tools) | 对 Canonical File 排队完整 Read-modify-write Window。 |
| Output Limit | [Extensions: Output Truncation](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md#output-truncation) | 通用 50 KB/2,000 行上限；单个 Tool 另有 Head/Tail/Count Policy。 |
| Shell Session Environment | [Environment Variables](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/environment-variables.md#bash-tool-session-environment) | 除非另行配置，Session/Model Variable 可暴露给 Spawned Shell Work。 |

## 集成接口

<!-- sync:source-integration -->

| 接口 | v0.83.0 来源 | Framing/所有权 |
| --- | --- | --- |
| Print/Interactive | [Usage: Modes](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#modes) | Human/One-shot CLI；需要明确临时化时使用 `--no-session`。 |
| JSON Mode | [JSON Event Stream](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/json.md) | 单向 JSON Line，包含 Streaming、Queue、Compaction、Retry 与 Error Event。 |
| CLI RPC | [RPC](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md) | stdio Request/Response/Event；只有 LF 分隔 Record。固定 Pi Version。 |
| SDK | [SDK](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sdk.md) | 进程内 TypeScript；Host 承担 Lifecycle、Resource、Cancellation、Credential 与 Cleanup。 |

### 仅 main 的实验协议

`@earendil-works/pi-protocol` 在 v0.83.0 后由
[`56eb685b…`](https://github.com/earendil-works/pi/commit/56eb685b69bb1a6c158c9eb8ead147e1d31e9d3f)
引入。在研究 Commit，其
[README](https://github.com/earendil-works/pi/blob/9b50b046d328d589a81400d2e184175d0bf19734/packages/protocol/README.md)
定义 Protocol Version 2、`[uint32-be length][definite-length CBOR]`、第一条带
Bearer Token 的 `hello`、Authoritative Snapshot、Transient Progress，并明确
不保证兼容性。它不属于 v0.83.0 Tag，也不是 CLI RPC。

## Terminal 与 Platform 来源

<!-- sync:source-platform -->

| 领域 | 一手来源 |
| --- | --- |
| Terminal Emulator Setup 与 Alt/Option+Enter 冲突 | [Terminal Setup](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/terminal-setup.md) |
| Tmux Behavior | [Tmux](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/tmux.md) |
| Windows Guidance | [Windows](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/windows.md) |
| Android/Termux | [Termux](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/termux.md) |
| Keybinding | [Keybindings](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/keybindings.md) |
| TUI Extension API | [TUI](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/tui.md) |

## 名称与 Scope 迁移

<!-- sync:source-migration -->

旧的一手/维护者资料可能写 `badlogic/pi-mono`、`earendil-works/pi-mono` 或
`@mariozechner/*`。Scope Migration Commit 为 2026-05-07 的
[`3e5ad67e…`](https://github.com/earendil-works/pi/commit/3e5ad67e0f325d4888f82f9b82966218eb4407f5)。
新指令应使用 `earendil-works/pi` 与 `@earendil-works/*`；只有引用历史材料或
解释 Migration 时保留旧名。

不要机械替换 Immutable Quote、Commit、Tag 或第三方 Repository 中的旧 URL。
应把来源标为 Historical，并验证 Command 是否仍适用。

## 维护者与设计背景

<!-- sync:source-context -->

以下来源是有价值的背景，但在行为结论中低于 Tag Implementation：

- [Pi: The Minimal Agent Within](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
  以历史名称解释 Minimal/Extensible Design Philosophy。
- [What If You Don't Need MCP?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
  解释不把 MCP 设为 Built-in Default 的设计取舍。
- [Pi-related RFCs](https://rfc.earendil.com/keyword/pi/) 展示 Proposal State；
  RFC 不能证明 Change 已进入 Stable Tag。

Blog、RFC、README 与 Tag Source 不一致时，把结论限定到 Tag Source，并记录差异。
