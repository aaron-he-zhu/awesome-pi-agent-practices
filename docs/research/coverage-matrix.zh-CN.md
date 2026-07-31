[English](./coverage-matrix.md) | [简体中文](./coverage-matrix.zh-CN.md)

# Pi 生态覆盖矩阵

<!-- sync:coverage-purpose -->

本矩阵把生态广度转化为可审计的研究队列：先覆盖 Stable Pi Surface，再把社区能力
类别映射到当前 Registry。它**不是** Package 排名、推荐列表，也不声称 Discovery
已经完整。

快照 Baseline：Pi **v0.83.0**
[`845d6ff…`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39)，
研究 `main`
[`9b50b04…`](https://github.com/earendil-works/pi/tree/9b50b046d328d589a81400d2e184175d0bf19734)，
以及 **2026-07-31（Asia/Singapore）**的 Registry State。用本矩阵做当前决策前，
必须重新检查移动来源。

## Count 与 Evidence State 的含义

<!-- sync:coverage-counting -->

Registry 包含 15 条 Community Record：**12 条 Source-reviewed**、**零条
Hands-on-verified**、**零条 Featured**、**三条 Deferred**。15 条都有固定的
`reviewedRef`；固定 Ref 只能标识 Source State，不能证明 Install、Runtime
Behavior、Published Artifact 或 Cleanup 已经测试。

本页使用以下 Evidence State：

| State | 含义 | 允许得出的结论 |
| --- | --- | --- |
| Stable Source | 行为得到固定 v0.83.0 Tag、Test 或 Versioned Release Material 支持。 | 限定版本的 Pi 事实。 |
| Main-only / Experimental | Source 只在 Stable Tag 之后出现，或明确标为实验性。 | 只能作为 Research Lead，不能当作 Stable Guarantee。 |
| Source-reviewed | 按本仓库方法在完整 Commit 上检查了 Community Repository。 | 观察到的 Source 暴露某项能力与已命名风险；不是 Runtime Recommendation。 |
| Deferred / Blocked | Collection 需要逐项检查、仍属 Legacy Scope，或缺少继续审查所需证据。 | 只能作为历史背景或未来 Research Lead。 |
| Discovery-only | Catalog、Directory、Search Result 或未审查 Repository 指向可能的 Candidate。 | 只能说“存在且可能值得审查”。 |
| Hands-on-verified | 具名人类保存 Exact Artifact、Environment、Step、Expected/Actual、Cleanup 与 Residual Risk。 | 在明确范围内可复现的 Trial Result。 |
| Featured | Hands-on Evidence 与维护者判断共同通过发布 Gate。 | 有范围的 Recommendation，不是 Safety Certification。 |

Community 表的 Count 只引用
[`data/resources.json`](../../data/resources.json)中的 Record。规模大得多的
[官方 Package Catalog](https://pi.dev/packages)和外部 Directory 属于 Discovery
Population，不会被静默计入 Reviewed Count。

## Execution 与 Ownership Boundary

<!-- sync:coverage-boundaries -->

每个类别都记录 Enforcement 或 Ownership 实际位于哪一层：

| Boundary | 在本矩阵中的含义 | 不能证明什么 |
| --- | --- | --- |
| Built-in Stable | 随固定 Pi Tag 发布，由具名 Pi Package 或 CLI Mode 拥有。 | 每个 Provider、Terminal、Package 或 Host 行为都相同。 |
| Official Optional / Example | 与 Pi 一起提供的可选 Package、Example 或 Pattern。 | 功能默认启用、Production-hardened 或 API Stable。 |
| Extension / Pi Package | 通过 Pi Extension/Package System 加载的进程内 JavaScript/TypeScript 或 Resource。 | OS Isolation。Extension 仍具有 Pi Process User 的 Authority。 |
| External Process / Service | Pi Process 之外的 Server、Browser、CLI、Model Endpoint、Hosted API 或 Controller。 | Extension Consent Screen 能约束外部 Component。 |
| OS / Virtualization Boundary | Pi 之外的 Container、VM、Separate User、Mount、Credential 与 Network Policy。 | 对故意共享的 Read-write Mount，或 Boundary 外 Host Component 的保护。 |

[Project Trust](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
是 Resource-loading Decision，不是 OS Sandbox。Tool Allowlist、Worktree、
Subprocess 与 Confirmation UI 不能被升级到 OS-boundary 一栏。

## 官方 Surface Coverage

<!-- sync:coverage-official -->

| Surface | 定义与一手证据 | Boundary | 当前证据 | 明确缺口 | 检索与晋级动作 |
| --- | --- | --- | --- | --- | --- |
| Package Architecture | [v0.83.0 Tree](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages)中的 AI API、Agent Loop、Coding Harness、TUI 与 Supporting Package。 | Built-in Stable + Optional/Experimental Package。 | 存在七个 Package Manifest：`ai`、`agent`、`coding-agent`、`tui`、`evals`、`server`、`storage/sqlite-node`；前四个构成主要公开叙事。 | 没有 Machine-readable Package Inventory 记录 Publish Status、API Stability、Consumer 与 Tag 间变化。 | 每次 Baseline Diff Package Manifest/README；记录 Stable、Experimental、Private/Unpublished、Added、Removed 与 Renamed State。 |
| Provider 与 Model API | 来自 [`pi-ai`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai)、[providers](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/providers.md)和[models](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/models.md)的 Streaming、Message/Tool Representation、Auth Route、Model Metadata、Transformation 与 Custom-provider Hook。 | Built-in Provider Adapter；Custom Provider 是 Extension；Model Endpoint 是 External Service。 | Source Map/Evidence Ledger 已映射 Stable Source。 | 没有跨 Provider、Model、Auth Route、Image/Tool/Reasoning、Region 与 Gateway 的 Capability Matrix。 | 单独保存脱敏 Capability Probe 与 Service Date；Model Catalog 或 Service 改变时过期。 |
| Agent Loop 与 Tool | [`pi-agent-core`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent)和 Coding-agent Tool 中的 State、Event、Transport、Tool Execution、Cancellation 与 Sibling-call Concurrency。 | Built-in Stable；Extension 可新增或 Override Tool。 | Stable Source 支持 Bounded Output、Cancellation 与 Honest Tool 实践。 | 没有紧凑 Event/Tool Invariant Table 或可复现 Concurrency/Failure Probe。 | 从 Tag Test 提取 Event Ordering/Ownership；增加 Cancellation、Parallel Call、Error Propagation 与 Truncation 小型 Probe。 |
| Session、Context 与 Compaction | JSONL Persistence、Tree/Fork/Clone、Message Queue、Context File、Compaction、Export 与 Share。 | Built-in Stable；Custom Compaction/Resource Loading 可扩展；Storage/Share 具有独立 Data Boundary。 | 固定版本的 Session、Format、Compaction、Usage 与 Settings Source 支持 P07/P12–P16。 | 没有 Artifact-level Privacy Inventory、Migration Fixture 或跨版本 Session Compatibility Test。 | 保存脱敏 Session Fixture；在相邻 Baseline 间测试 Open/Resume/Fork/Compact/Export，并记录全部持久化/上传字段。 |
| Customization 与 Distribution | Context File、Prompt Template、Skill、Extension、Theme 与 Pi Package。 | Context/Prompt/Skill/Theme 是 Resource；Extension 在进程内执行；Package 可捆绑全部类型并触发 Dependency Install。 | 五份 Stable 专项指南与 Package/Security Guidance；固定 Extension Example 目录有 79 个 Top-level Entry，包括文件与子目录。 | Example 没按 Lifecycle、Authority、Stability、Test、Data Flow 或 Production Readiness 分类；没有官方 Skill/Prompt/Theme 的 Item-level Inventory。 | 从 Tag Tree 生成 Example Manifest，标注 Example-only Pattern，并把 Catalog Discovery 与 Source/Hands-on Review 分开。 |
| Terminal、TUI 与 Platform | Differential Rendering、Input、Component、Keybinding、Terminal Setup、tmux、Windows/WSL 与 Termux。 | Built-in TUI + Host Terminal/OS Behavior。 | Stable `tui`、Keybinding、Terminal、tmux、Windows 与 Termux Source 已映射。 | 没有 Native Windows vs WSL、Shell、Multiplexer、SSH、Unicode/Width、Clipboard 与 Node/Bun Distribution 实测矩阵。 | 每个 Environment 跑固定 Smoke Script；记录 Terminal、Locale、Shell、Distribution、Input Path、Rendering Result 与 Cleanup。 |
| Interactive、Print、JSON、RPC 与 SDK | Human CLI、One-shot Output、单向 JSON Event、双向 stdio RPC 与进程内 TypeScript Ownership。 | Built-in Stable；Controller/Host 负责 Draining、Cancellation、Policy、Persistence 与 Cleanup。 | Stable Interface Doc + 13 个编号 SDK Example 与 README。 | 没有 Comparative Contract Matrix、Malformed-frame Test、Backpressure Profile 或 Long-lived Controller Record。 | Version Protocol Fixture；测试 EOF、stderr Draining、Cancellation、Restart、Trust Prompt、Queue 与 Subscription Cleanup。 |
| Security 与 Containment | Local-user Authority、Project Trust、Context/Resource Loading、Package Execution 与 Containment Guidance。 | Loading Gate 内建；Permission Hook 属于 Extension；真正 Isolation 属于 External OS/Virtualization Policy。 | Stable Security/Containerization Doc 与官方 Guard/Sandbox Example；Gondolin 是一条 Source-reviewed Community Record。 | 没有 Mount、Credential、Network、Host Process、Denial-of-service 或 Cleanup 的 Hands-on Proof。 | 建立 Supervised、Sterile Read-only、Contained Untrusted 与 Non-interactive Disposable Profile；既测试成功路径，也测试访问失败。 |
| Local Inference | 通过 [llama.cpp Guide](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/llama-cpp.md)与 Custom Endpoint 运行本地 Model。 | Pi/Provider Config 内建；Model Runtime/Hardware 在外部。 | 一份 Stable 官方 Guide；本类别零条 Source-reviewed Community Record。 | 没有 Hardware/Runtime Matrix、Tool-call Compatibility Probe、Context-limit Verification 或 Offline-network Test。 | 抽样 Exact Runtime/Model/Template Pair；记录 Hardware、Quantization、API Mode、Tool/Image/Reasoning Behavior 与 Outbound Connection。 |
| Evals、Server 与 Storage | Tag 包含 [`evals`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/evals)、实验性 [`server`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/server)与 [`storage/sqlite-node`](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/storage/sqlite-node)。 | Official Optional/Experimental；并非都属于 Coding-agent CLI Default Persistence Path。 | Source Map 部分覆盖 Server/Storage；Evals 还不是 First-class Coverage Record。 | Purpose、Publish Status、Stability、Schema Ownership 与 Intended Consumer 容易被误读。 | 增加 Per-package Stability Card，并把 npm Publication 与 Source Presence 分开验证。 |
| Main-only Protocol | [`@earendil-works/pi-protocol`](https://github.com/earendil-works/pi/tree/9b50b046d328d589a81400d2e184175d0bf19734/packages/protocol)在 v0.83.0 之后出现。 | Main-only / Experimental。 | Source Map 与 E27 已正确标记。 | 没有自动 Stable-vs-main Package/API Diff 或 Promotion Trigger。 | 每个 Release 复核；只有 Tag 包含 Implementation 且 Compatibility Status 有文档时，才把 Claim 移到 Stable。 |
| Repository 与 npm Identity Migration | 历史 `badlogic/pi-mono`、`earendil-works/pi-mono`、`@mariozechner/*` 已迁移到 `earendil-works/pi` 与 `@earendil-works/*`。 | Distribution/Provenance Boundary。 | 已记录 Migration Commit 与当前名称。 | 没有逐包 Old/New Name、Last-old/First-new Version、Deprecation、Redirect、Import 与 Artifact Mapping。 | 从 GitHub Ref、Changelog 与 npm Metadata 保存 Migration Ledger；绝不重写 Immutable Historical Evidence。 |
| Official-adjacent Repository | 同组织 Project 可展示 Review、Tutorial、Chat 或 Containment Pattern，但不属于 Pi Stable Core。 | 独立 Repository/Artifact；Affiliation 不等于 Core Inclusion。 | Gondolin 已审查。[`pi-review`](https://github.com/earendil-works/pi-review)、[`pi-review-loop`](https://github.com/earendil-works/pi-review-loop)、[`pi-tutorial`](https://github.com/earendil-works/pi-tutorial)、[`pi-chat`](https://github.com/earendil-works/pi-chat)是四个 Discovery-only Lead，在 Registry 中为零条。 | 本仓库尚未审查 Exact Artifact、License、Pi Compatibility、Test、Authority 与 Maintenance。 | 把每个 Default Branch 解析为 Commit，采用普通 Community Source Gate，并保留 `official-adjacent` 标签，避免暗示 Stable-core Support。 |

## Community Capability Coverage

<!-- sync:coverage-community -->

以下 Count 把 12 条 Source-reviewed Watchlist Record 放在互斥的 Primary Category
中。Multi-capability Project 只放一个 Primary Placement，以便总数可审计；Secondary
Capability 仍应写入单项 Review。Deferred Collection 单独显示，不计入 Reviewed
Item。

| Capability | 定义 | Built-in / Extension / External Boundary | 当前 Registry Evidence | 明确缺口 | 检索与晋级动作 |
| --- | --- | --- | --- | --- | --- |
| VM/Tool Isolation | 在 Machine/Process Boundary 后执行选定工作。 | 没有 Built-in Sandbox；Extension 路由 Tool；OS/VM 执行 Containment。 | 1 条 Source-reviewed：Gondolin。 | 没有 Mount/Network/Credential/Reset 的 Hands-on Matrix。 | 检索 VM/Container/Tool-router；要求 Negative Access Test 与 Host/Guest Authority Map。 |
| Permission 与 Guardrail | 在执行前 Allow、Deny、Ask、Audit 或保护 Operation。 | Pi 提供 Hook/Project Trust；Extension 实现 Policy UI；OS Policy 才是外部 Enforcement。 | 0 条 Source-reviewed。 | 高需求 Safety Category 没有 Reviewed Implementation Comparison。 | 在 Catalog/Repository 搜索 permission、guardrail、protected-path、command-policy；Trial 前比较 Bypass Path。 |
| Subagent 与 Workflow Orchestration | Delegate、Chain、Parallel、Background 与协调 Child Task。 | 不是 Built-in Workflow；Extension Spawn Agent/Process；Worktree 不是 OS Isolation。 | 2 条 Source-reviewed：pi-subagents、pi-crew。 | 没有 Cost/Concurrency/Cancellation/File-conflict Hands-on Comparison。 | 保存 Child Model/Tool/Environment Manifest；测试 Partial Failure、Cancellation、Merge 与 Cleanup。 |
| MCP Integration | 把 Pi 连接到 Model Context Protocol Server。 | 无 Built-in MCP；Adapter 是 Extension；Server/Transport/Credential 在外部。 | 1 条 Source-reviewed：pi-mcp-adapter。 | 没有固定 Single-server Hands-on Trace 或 Hostile-server Test。 | 每次只审一个 Exact Server/Adapter Artifact；枚举 Tool、Command、Secret、Consent、Timeout 与 Removal。 |
| Web Search 与 Fetch | 查询 Search Service 并获取远端 Page/Media。 | Extension 暴露 Tool；Network Provider/Content Processor 在外部。 | 1 条 Source-reviewed：pi-web-access。 | Provider/Fallback Routing、Redirect、SSRF、Size Limit、Cookie 与 Retention 未测试。 | 用 Test Data 捕获 Outbound Host/Payload；强制测试 Offline 与 Provider-failure Path。 |
| Browser 与 Authenticated-profile Automation | 驱动 Browser、Electron、Profile、Download、Screenshot 或 Clipboard Surface。 | Extension 包装 External Browser/CLI；真实 Profile 有独立 Credential/Private Data。 | 1 条 Source-reviewed：pi-agent-browser-native。 | 没有 Disposable-profile Hands-on Run 或 Data-residue Inventory。 | 使用专用 Test Profile/Account；检查 Cookie、Download、Screenshot、Clipboard、Process Cleanup 与 Profile Deletion。 |
| Human Review 与 Planning | 为 Plan、Diff 或 Artifact 提供 Approve/Reject/Annotate Decision。 | Extension 提供 UI；可选 Browser/Share Service 可能增加 External Data Boundary。 | 1 条 Source-reviewed：Plannotator。 | Approval Semantics、Large/Malformed Input、Sharing-off Behavior 与 Cleanup 未测试。 | 先 Trial Local-only；验证 Reject/Cancel，并在完成 Endpoint/Retention Review 前禁止 Sharing。 |
| Code Intelligence | 增加 LSP、Lint、Formatter、AST、Grammar、Scan 与 Structured Navigation。 | Extension 编排 External Server/Binary，也可能修改文件。 | 1 条 Source-reviewed：pi-lens。 | 没有 Language/Platform Matrix 或 Download/Install Integrity Verification。 | 固定一个 Language Toolchain；记录 Download、Server Lifecycle、Mutation Preview、Conflict 与 Removal。 |
| Persistent Memory | 跨 Turn/Project 保存并检索 Fact、Session 或 Procedure。 | Extension 控制 Storage/Injection；Database/Consolidation Model 可能在外部。 | 1 条 Source-reviewed：pi-hermes-memory。 | Project Separation、Deletion、Poisoning、Secret Leakage、Native ABI 与 Recovery 未测试。 | 使用 Synthetic Secret 与 Malicious Stored Instruction；验证 Scope、Retention、Export/Delete、Backup 与 Model Egress。 |
| Tracing 与 Observability | 记录 Turn、Model Call、Tool、Cost、Compaction 或 Diagnostic。 | Extension Instrument Pi；Hosted Telemetry 是 External Processor。 | 1 条 Source-reviewed：braintrust-pi-extension。 | 没有 Redaction、Sampling、Backpressure、Outage、Retention 或 Deletion Trial。 | 默认 Disabled；分类每个 Field，并在真实 Project Data 前测试 Offline/Failure Isolation。 |
| Alternate UI 与 Editor Integration | 从 Editor、GUI 或替代 Terminal Surface 控制 Pi。 | RPC/SDK 内建；Frontend 负责 Trust Prompt、Process Lifecycle、Buffer 与 Policy。 | 1 条 Source-reviewed：pi-coding-agent for Emacs。 | 没有 Cross-frontend Comparison 或 Unknown-project Non-approving Trial。 | 测试 Explicit Approve/Deny、Context Disable、Restart、Cancellation、Auth-store Access 与 Buffer/Session Cleanup。 |
| Broad Operating Layer | 捆绑 Policy、Workflow、Native Runtime、Task System 与多个 Extension。 | Package/Extension Code + 可能的 Native/External Component。 | 1 条 Source-reviewed：gentle-pi。 | Surface 太大，不能作为一个不分解的 Recommendation；Native/Postinstall Path 未测试。 | 按 Artifact/Capability 分解；要求 Threat Model、Install Transcript、Rollback 与 Partial-adoption Path。 |
| Context Optimization | 在 Built-in Compaction 之外 Prune、Cache、Summarize、Retrieve 或 Compress Context。 | Built-in Compaction 存在；Extension 修改 Visible Context；External Store/Model 可能处理内容。 | 0 条 Source-reviewed。 | 没有 Token Saving 与 Lost Evidence、Branch Semantics、Privacy 的比较。 | 搜索 context/prune/cache/summary/retrieval；要求 Before/After Fixture 与 Failure-recovery Check。 |
| Task、Goal 与 Loop Engineering | 持久化 Goal/Todo、Staged Workflow、Supervisor 或 Iterative Completion Loop。 | 不是 Mandatory Built-in Workflow；Extension/Resource 实现控制；Child Model/Service 可能在外部。 | 0 条 Source-reviewed。 | 没有 State-machine、Termination、Cost-bound 或 Stale-goal Evidence。 | 搜索 goal/todo/workflow/loop/supervisor；测试 Abort、Restart、Max-iteration、Partial Completion 与 Cleanup。 |
| UI、Statusline、Notification 与 Accessibility | 修改 Status、Progress、Overlay、Alert、Editor Behavior 或 Presentation。 | TUI API 内建；Extension Render UI；OS Notification Service 在外部。 | 0 条 Source-reviewed。 | 没有 Accessibility、Terminal Compatibility、Failure Isolation 或 Token/Cost Accuracy Review。 | 按 UI Primitive 而非美观抽样；测试窄 Terminal、Resize、Unicode、适用时的 Screen Reader 与 Disable/Removal。 |
| Theme 与 Theme Tooling | 提供 Color Schema、Switching、Terminal Integration 或 Bundled Visual Resource。 | Theme Loading 内建；Pure JSON Authority 较低，但 Package 可能同时包含 Executable Extension/Script。 | 0 条 Source-reviewed。 | Catalog 有 Theme Surface，但 Registry 没有 Item-level Theme Evidence。 | 抽样 Pure Theme、Theme Pack 与 Executable Theme-tool；验证 Manifest Content、Contrast、Terminal Color 与 Clean Removal。 |
| Prompt-template Pack | 提供通过 Slash Command 显式展开的 Reusable Text。 | Prompt Expansion 内建；Package Script 或 Bundled Extension 增加独立 Authority。 | 0 条 Source-reviewed。 | 没有 Item-level Provenance、Injection Risk、Argument、Portability 或 Maintenance Review。 | 按 Workflow 抽样 Prompt；检查所有 Bundled Resource，并用 Inert Test Input 验证 Expansion。 |
| Individual Skill | 提供 On-demand Instruction，可含 Script、Reference 与 Asset。 | Skill Loading 内建；被指示的 Tool/Script 通过 Pi 或 External Runtime 执行。 | 0 条 Source-reviewed Item；1 个 Legacy-scoped Collection Deferred（`pi-skills`）。 | Collection-level Review 隐藏逐 Skill Authority、Dependency、Portability 与 Stale Command。 | 把 Collection 拆成 Atomic Skill Record；检查每个引用的 Script/Asset，Hands-on 前迁移旧 Scope。 |
| Custom Provider 与 Model Gateway | 注册新的 Provider Auth、Catalog、Streaming、Error、Usage 与 Overflow Behavior。 | Extension 在进程内运行；Model Gateway/API 在外部。 | 0 条 Source-reviewed。 | 没有 Community Implementation 展示正确的 Conversion、Usage、Retry 与 Credential Boundary。 | 搜索 provider/gateway/model-catalog Package；用脱敏 Case 验证 Tool、Image、Reasoning、Error、Overflow 与 Cancellation。 |
| Local-model Runtime | 运行 Local/LAN Model Server 及其 Template/Tool-call Parser。 | Pi 通过 Provider Config 连接；Runtime/Hardware/Network 在外部。 | 0 条 Source-reviewed；一份 Stable 官方 llama.cpp Guide。 | 没有 Community Runtime Artifact 或 Compatibility Matrix。 | 抽样 Exact Model/Runtime/Template Combination，并验证真正 Offline Behavior。 |
| Remote Control、Messaging 与 Collaboration | 通过 Chat、Mobile、Peer、Broker 或 Remote-control Channel 连接 Session/Agent。 | Controller/Extension Bridge Pi；Identity、Transport、Server 与 Retention 在外部。 | 0 条 Source-reviewed。 | Auth、Command Authorization、Multi-user Isolation、Replay 与 Data Retention 未覆盖。 | 搜索 Telegram/Slack/chat/peer/broker/remote；测试 Least-privilege Account、Replay Resistance、Disconnect 与 Audit Trail。 |
| Package Suite 与 Alternate Distribution | 捆绑多个 Extension、Skill、Theme、Binary 或 Opinionated Default。 | Package Reconciliation/In-process Code + Postinstall/Native/External Component。 | 0 条 Source-reviewed Suite；1 个 Mixed Extension Collection Deferred（`pi-extensions`）。 | Aggregate Install Authority、Hook Conflict、Update、Provenance 与 Partial Removal 未知。 | Inventory 每个 Bundled Artifact/Dependency；Suite-level Trial 前先审 Atomic Piece。 |
| Git 与 Review Automation | Checkpoint、Commit、Branch、Review 或 Merge Repository Change。 | 官方 Example 展示 Pattern；Extension/CLI 修改 Git/File；Remote Forge 在外部。 | 0 条 Source-reviewed Community Record。 | 没有 Dirty-tree、Rollback、Merge Conflict、Credential 或 Remote-write Comparison。 | 搜索 checkpoint/review/commit/merge；使用 Disposable Repository，先测试 Failure 再给 Remote-write Capability。 |
| Evals 与 Benchmarking | 测量 Model/Agent Behavior、Regression、Cost、Latency 或 Task Success。 | Official Eval Source 存在；Harness、Dataset、Judge 与 Provider 可能在外部。 | 0 条 Source-reviewed Community Record。 | 没有 Methodology、Dataset License、Leakage、Variance 或 Reproducibility Standard。 | 从 Official Eval Package 开始；发布结果前要求固定 Fixture、Repeated Run、Cost Accounting 与 Limitation。 |
| Session Export、Sharing 与 Publishing | 导出或上传 Session Record 与 Derived Artifact。 | Export 内建；Sharing Client/Hosting Destination 是 External Data Processor。 | 0 条 Source-reviewed；`pi-share-hf` Deferred/Blocked。 | Secret Scanning 不能证明 Privacy；License、Consent、Deletion、Image、Name 与 Business Fact 未解决。 | 只用 Synthetic Session；枚举 Field/Destination Policy，再测试 Local Inspection、Explicit Consent、Deletion 与 Link Revocation。 |

## Prioritized Gap Queue

<!-- sync:coverage-gaps -->

下一轮应优先扩大 Category Coverage 与 Evidence Quality，而不是增加大量 Link：

1. **P0 — Enforcement/Data Boundary：**Permission/Guardrail、Context
   Optimization、Remote/Messaging Control 与 Session Sharing。
2. **P0 — Item-level Decomposition：**判断 Collection 前，先把 Deferred Skill 与
   Extension Collection 拆成 Atomic Artifact。
3. **P1 — Operational Control：**Task/Goal/Loop、Git/Review Automation 与 Custom
   Provider。
4. **P1 — Platform Breadth：**Local Inference、Alternate UI、Browser Profile 与
   Terminal/TUI Smoke Matrix。
5. **P2 — Lower-authority Resource：**Theme、Prompt Pack、Status/UI 与 Package
   Presentation，同时仍检查 Bundled Executable Code。
6. **P2 — Measurement：**使用 Reproducible Fixture、Dataset License、Repeated
   Run 与 Cost/Error Report 的官方/社区 Eval。

一个 Row 不会因为填补空白就成为 Recommendation。如果 Candidate 不能通过 Source、
License、Artifact、Safety 或 Utility Gate，该类别可以继续为空。

## 可复现检索协议

<!-- sync:coverage-search -->

每轮 Category Pass 都应：

1. 记录 Source、Exact Query/Filter、Sort Order、Capture Time、Page Range 与返回的
   Package/Repository Identifier。
2. 搜索[官方 Catalog](https://pi.dev/packages)、npm Metadata、
   [awesome-pi](https://github.com/BubblePtr/awesome-pi)、
   [awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent)与
   [Pi Package Index](https://github.com/getpipher/pi-package-index)。这些都只是
   Discovery Source。
3. 把每个 Candidate 解析到 Canonical Repository、完整 Default-branch Commit、
   Published Artifact/Version、License Evidence 与 Pi Dependency/Install Target。
4. 保存全部 Sampled Identifier 与 Reason-coded Disposition：Duplicate、Out of
   Scope、Inaccessible、No License、Stale Scope、Collection、Insufficient Evidence、
   Source-review Queue 或 Rejected。
5. 除非处理 Pagination、Registry Scope、Alias、Fork、Renamed Package 与
   Historical Identity，否则不要称 Search 完整。
6. 在 Prose 与 Machine Data 中始终分开 Discovery、Source-reviewed、Hands-on 与
   Featured Count。

建议 Query Family 组合 `pi`、`pi-coding-agent`、当前/历史 Package Scope 与
`permission`、`guardrail`、`context`、`goal`、`workflow`、`theme`、`provider`、
`llama`、`telegram`、`review`、`eval` 等 Category Term。在 Repository/Package
Scope 之外，“Pi”高度歧义，宽泛 Query 必须人工验证 Identity。

## Source Review 与 Promotion Gate

<!-- sync:coverage-promotion -->

Candidate 每次只能前进一个 State：

1. **Discovery → Source Review：**确认 Canonical Identity、Purpose、License、
   Immutable Source Ref、Resource Type、Pi Compatibility Claim、Dependency、
   Install/Lifecycle Script、Executable Authority、Data Flow、Test、CI、Removal
   与明显 Conflict。
2. **Source Review → Hands-on：**把 Repository Ref 绑定到 Exact npm/Git/Local
   Artifact；使用 Disposable Environment、Test Account/Data、固定 Pi/Runtime、
   明确 Expected/Actual Step、Negative Case、Cleanup 与 Residual-risk Record。
3. **Hands-on → Featured：**需要具名人类根据 Direct Use 撰写 Recommendation、
   独立双语 Fact/Risk Review、Relationship Disclosure、持续 Utility 与 Retest/
   Expiration Trigger。
4. **任意 State → Stale/Rejected/Deferred：**记录原因，但不作为 Public Shaming。
   Passing CI Badge、Catalog Listing、Affiliation、Popularity 或 Immutable Commit
   都不能跳过 Gate。

每个 Hands-on Matrix 必须改变与 Category 有关的维度：Pi/Runtime Version、OS/
Platform、Provider/Model、Terminal/Controller、Network、Credential、Concurrency、
Failure Injection、Data Retention 与 Rollback。

## 维护规则

<!-- sync:coverage-maintenance -->

- 每次 Pi Minor Baseline 都重建官方 Package/Doc/Example Inventory。
- Diff 新旧矩阵，不静默覆盖 Historical Scope。
- Review 前重新解析移动的 Community Branch；只有检查 Diff 后才更新
  `reviewedRef`。
- Pi、Reviewed Artifact、Native Dependency、Provider Service 或 Critical Data
  Policy 离开 Tested Window 时，过期 Hands-on Result。
- Snapshot 中分别保留 `communityResources`、`sourceReviewed`、
  `handsOnVerified`、`deferred` 与 `pinnedRefs`。
- 每次双语修改都运行 Markdown、Bilingual-marker、Registry、Research-snapshot 与
  Local-link Check；事实与翻译等价仍需要人类审查。

## 局限

<!-- sync:coverage-limitations -->

- Category 是 Research Lens，不是互斥 Package Identity；复杂 Package 可跨多行。
- 为避免 Double Count 而采用的 Primary Placement 不能描述 Project 全部 Authority
  Surface。
- Source Review 不能发现所有 Runtime Behavior、Compromised Dependency、
  Unpublished Artifact Difference 或 External-service Change。
- Empty Coverage 不表示实现不存在，只表示当前 Registry 没有 Item 越过指定
  Evidence Gate。
- Full Catalog Count 变化很快，Resource-type Filter 互相重叠。它们衡量 Discovery
  Surface，不衡量 Quality 或 Review Progress。
