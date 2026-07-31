[English](./glossary.md) | [简体中文](./glossary.zh-CN.md)

# Pi 实践术语表

<!-- sync:glossary-use -->

除非标为“仅 main”，以下定义采用 Pi v0.83.0 术语。它们澄清一些常被当作同义词、
但执行、持久化或信任语义不同的概念。

## Runtime 与模型术语

<!-- sync:glossary-runtime -->

| 术语 | 本仓库中的含义 | 常见混淆 |
| --- | --- | --- |
| Pi | `earendil-works/pi` 项目。命令示例中通常指 `@earendil-works/pi-coding-agent` 的 `pi` CLI。 | Monorepo 中并非每个 Package 都是 Coding-agent CLI，也不具有相同稳定性。 |
| Coding Harness | 连接 Model Message、Tool、Session、Resource 与 UI 的 Runtime。 | Pi 刻意比完整 IDE 或 Policy Sandbox 更小。 |
| `pi-ai` | 统一 Provider 的 Model/Message/Streaming/Tool Utility。 | 统一并不表示跨 Provider Conversion 全部无损。 |
| `pi-agent-core` | Agent Loop、State、Event、Tool 与 Transport Primitive。 | 它不会自动提供 Coding-agent Resource/Session UX。 |
| `pi-coding-agent` | CLI、Coding Tool、Resource Loading、Session、TUI Mode、SDK、JSON 与 RPC Integration。 | Project Trust 不是 Tool Permission System。 |
| `pi-tui` | Terminal Rendering 与 Component Library。 | Terminal Compatibility 仍取决于 Emulator、Multiplexer、Locale 与 Key Transmission。 |
| Provider | Pi 识别的 Model API/Authentication/Transport Integration。 | Provider Name 不是 Model Name、Account 或单一 Transport 保证。 |
| Model Catalog | Pi 当前可选 Model 与 Capability Metadata，可独立于 Pi Binary 刷新。 | 只记录 `pi --version` 不会固定 Catalog。 |
| Thinking Level | 影响所支持模型 Reasoning Behavior 的 Pi 选择。 | Provider 表示 Reasoning 的方式不同，Handoff 时可能丢失。 |
| Transport | Provider 支持时可选的 SSE、WebSocket 或 Auto Communication。 | 它与 CLI RPC、实验 Pi Protocol 都不同。 |

## Resource 与定制术语

<!-- sync:glossary-resources -->

| 术语 | 本仓库中的含义 | 常见混淆 |
| --- | --- | --- |
| Resource | 根据上下文泛指 Pi 可加载的 Extension、Skill、Prompt Template、Theme、Context 或 Package 声明材料。 | “Resource” 不表示被动或安全。 |
| Context File | 分层发现并加入模型上下文的 `AGENTS.md` 或 `CLAUDE.md` 文本。 | 拒绝 Project Trust 后仍可能加载；用 `-nc` 关闭发现。 |
| Project Trust | 控制受保护项目设置/资源/Package 加载的决定。 | 不是 OS Sandbox；启动后不会限制已启用 Tool。 |
| Prompt Template | 通过显式 Slash Command 展开、可带 Argument 的 Markdown。 | 它不会像 Runtime Hook 那样自动调用。 |
| Skill | 按需 Instruction 加可选 Script/Reference/Asset；读取全文前可发现 Metadata。 | Skill 可指示强大的 Tool/Executable Use，也需要审查。 |
| Extension | 进程内 TypeScript/JavaScript，可注册 Event、Tool、Command、UI、Provider 与 Policy。 | Extension 可绕开注册 Tool，使用普通 Process API 行动。 |
| Theme | Terminal Presentation Configuration。 | 含 Theme 的 Package 还可能包含可执行 Resource。 |
| Pi Package | 从 npm、Git 或 Local Path 分发 Extension、Skill、Prompt 与 Theme 的 Bundle。 | 进入 Package Catalog 不等于亲测或安全验证。 |
| Package Source | 用于 Package Resolution 的 npm Spec、Git URL/Ref 或 Local Path。 | `-e` 是临时加载，不是 Sandbox。 |
| Pinned Ref | 在有文档的 Update Behavior 下不会自动推进的精确 npm Version 或 Git Tag/Commit。 | Pin 改善可复现性，不改善可信度。 |

## Tool 与 Extension 生命周期

<!-- sync:glossary-tools -->

| 术语 | 本仓库中的含义 | 常见混淆 |
| --- | --- | --- |
| Built-in Tool | Pi 提供的 `read`、`bash`、`edit`、`write`，以及可选 `grep`、`find`、`ls`。 | Extension 可以注册同名 Tool 覆盖 Built-in。 |
| Tool Allowlist | CLI/Runtime 对 Active Registered Tool Name 的选择。 | 不是针对 Extension Code 的 OS-level Restriction。 |
| Tool Schema | 展示给 Model/Provider 的机器可读 Parameter Contract。 | 人类可读 Description 无法弥补无效或不兼容 Provider 的 Schema。 |
| Tool Result | 返回 Pi、通常进入 Model/Session Context 的 Content/Details。 | 返回写着 “error” 的文本不会设置 `isError`；Tool 必须 Throw。 |
| Event/Hook | 围绕 Session、Agent、Message、Tool、Model、Input 或 UI Lifecycle 的 Extension Callback。 | Event 的 Error Behavior 不同；`tool_call` Hook Error 会 Fail-safe Block。 |
| Factory | Resource Loading 时调用的默认 Extension Export，用来注册行为；可以 Async，并延迟 Startup。 | 长生命周期 Resource 通常应随 Session 或按需启动，而不是在 Factory 中启动。 |
| Session-bound Context | 绑定某个 Session Runtime 的当前 Event/API Object。 | Replacement/Reload 后，Captured Object 会过期。 |
| File Mutation Queue | 对同一 Canonical File 串行化完整 Read-modify-write Window 的 Pi Helper。 | 否则 Tool Call 默认并发。 |
| Truncation | 有意识地限制 Tool Output，并说明省略数据/Continuation。 | 不同于 Compaction；后者总结 Conversation Context。 |

## Session 与上下文术语

<!-- sync:glossary-sessions -->

| 术语 | 本仓库中的含义 | 常见混淆 |
| --- | --- | --- |
| Session | 由 Coding Agent 管理的持久或 In-memory Conversation State；默认持久 Session 使用 JSONL。 | Session 不是 Git Checkpoint，也不是完整 Execution Manifest。 |
| Session Entry | 带 ID、通常带 Parent Relationship 的 JSONL Tree Node，例如 Message、Model Change、Compaction 或 Custom Data。 | 单纯 Physical File Order 不定义 Active Conversation Path。 |
| Active Leaf | 其 Ancestor 组成当前 Model-visible Branch 的 Terminal Node，同时受 Compaction 影响。 | 其他 Branch 可保留在文件中但不是 Active。 |
| `/tree` | 在同一 Session File 中选择或创建 Branch。 | 不会恢复文件系统状态。 |
| `/fork` | 从较早 User-message Point 新建 Session File，并可编辑所选 Prompt。 | 不同于在原文件内新建 Branch。 |
| `/clone` | 把完整 Current Active Branch 复制到新 Session File，并从末端继续。 | 不会复制 Repository 或 Process Environment。 |
| Compaction | 用 Lossy Summary Entry 替换较早 Model-visible Context，原 JSONL Entry 仍保留。 | “History 仍在”不表示模型仍能看到每个细节。 |
| Branch Summary | 在 Branch 间导航时，用来表示相关 Abandoned-branch Context 的摘要。 | 与 Active-path Compaction 有关，但不是同一个操作。 |
| Steering Message | 当前 Assistant Turn 的 Tool Call 完成后、下一次模型调用前送达的 Queue Instruction。 | 不会立即中断正在运行的 Tool。 |
| Follow-up Message | Agent 没有剩余 Tool Call 或 Steering Work 后送达的 Queue Instruction。 | 有意晚于 Steering。 |
| `!!command` | Output 被排除出 Model Context 的用户 Shell Command。 | 仍在本地执行，Output 可保留在 Session/Export。 |

## Integration 与安全术语

<!-- sync:glossary-integration -->

| 术语 | 本仓库中的含义 | 常见混淆 |
| --- | --- | --- |
| Interactive Mode | 带 Command、Editor 与 Rendering 的人类 Terminal UI。 | 不应把 TUI Text 当机器协议抓取。 |
| Print Mode | 输出最终结果的非交互一次性用法。 | 不会自动变成 Sessionless；需要时加 `--no-session`。 |
| JSON Mode | 用于观察运行的 JSON-line Event Output。 | 不提供与 RPC 相同的双向 Command Surface。 |
| CLI RPC | v0.83.0 已发布的 JSONL stdio Request/Response/Event Interface。 | 只按 LF 分帧；不是仅 main 的 Framed-CBOR Protocol；上游无长期兼容保证。 |
| SDK | 用于构建并拥有 Session/Resource/Tool 的进程内 TypeScript API。 | Host Application 承担 Lifecycle、Policy、Credential 与 Cleanup。 |
| `@earendil-works/pi-protocol` | v0.83.0 后加入、使用 Length-prefixed CBOR 的“仅 main”实验协议。 | Package Metadata Version 不表示它属于 v0.83.0 Tag，也不表示兼容 CLI RPC。 |
| Sandbox | 即使代码恶意或错误，仍强制限制行动的边界。 | Pi 的 Project Trust 与 Tool Allowlist 都不是完整 Sandbox。 |
| Containment | 使用 Container、VM、Micro-VM、Remote Sandbox、OS Policy、Mount、Credential Scope 与 Network Policy 的外部控制。 | 只把部分 Tool 路由进 Sandbox，会让其他 Host Extension Code 留在外面。 |
| Secret/Unlisted Gist | v0.83.0 `/share` 创建、拿到 URL 即可读取的 GitHub Gist。 | 不是 ACL-private Document，也不会自动脱敏。 |

## 策展状态术语

<!-- sync:glossary-curation -->

| 术语 | 本仓库中的含义 |
| --- | --- |
| `discovered` | 通过 Search/Referral 发现，尚未审查。 |
| `source-reviewed` | 已检查 Purpose、Source、Metadata、License 与明显边界；本仓库维护者尚未执行。 |
| `hands-on-verified` | 具名人类记录并亲自运行 Pinned Artifact、Environment、Step、Expected/Actual Result 与 Cleanup。 |
| `featured` | Hands-on Evidence 加当前人类编辑判断，足以进入根 Curated List。 |
| Main-only | 在指定发布后 `main` Commit 观察到，且不在稳定基线中。 |
| Experimental | 上游明确不承诺 Stability/Compatibility。 |
| Inference | 从所引事实综合的建议；不是 Pi 强制行为。 |
