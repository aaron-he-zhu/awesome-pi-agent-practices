[English](./watchlist.md) | [简体中文](./watchlist.zh-CN.md)

# 社区源码审查观察名单

<!-- sync:watchlist-warning -->

**这不是推荐列表。**以下 Artifact 在 **2026-07-31** 通过了有限的源码/Metadata
审查，但本仓库维护者没有安装或执行它们。所有条目都是 `source-reviewed`，仍在
等待人类亲测；其中若干项目有意提供高权限或外部数据传输能力。

采用前，应在 OS 隔离的可丢弃环境中使用
[Extension 审查](../extension-review.zh-CN.md)。机器可读事实位于
[`data/resources.json`](../../data/resources.json)。

## 隔离与编排

<!-- sync:watchlist-isolation -->

<!-- resource:watch-gondolin -->

### Gondolin

[仓库](https://github.com/earendil-works/gondolin) ·
[审查快照](https://github.com/earendil-works/gondolin/tree/29fa74d802112f29c720990aced26165e0d57d84) ·
Apache-2.0 · 已审查源码

- **为什么值得试用：**官方相关的 Linux Micro-VM Project，有大量 Security/
  Limitation 文档、Test 和 Pi Tool-routing Example。
- **需要验证：**Node/Runtime Prerequisite、支持的 Host、Filesystem Mount、
  Network Policy、Secret、VM Reset、Cancellation 与 Cleanup。
- **关键边界：**Example 不是可直接安装的 Pi Extension，并以读写方式把 Project
  挂载到 `/workspace`。Micro-VM 可以隔离 Guest Execution，但仍允许有意破坏已
  挂载项目文件。Gondolin 还把 QEMU、同用户 Host Process 和 Denial of Service
  列为 Non-goal。

<!-- resource:watch-pi-subagents -->

### pi-subagents

[仓库](https://github.com/nicobailon/pi-subagents) ·
[审查快照](https://github.com/nicobailon/pi-subagents/tree/89de10e4bc8895e7948704c38620a5b35ddcd17e) ·
MIT · 已审查源码

- **为什么值得试用：**专注 Subagent、Parallel、Chain、Background、Lifecycle
  与 Worktree Pattern，带 Unit/Integration/End-to-end CI。
- **需要验证：**精确 Child Model/Tool、Environment Inheritance、最大
  Concurrency/Cost、Background Cancellation、Result Aggregation、File
  Conflict、Memory/Session Retention 与 Removal。
- **关键边界：**Subprocess、Worktree 与 Tool Restriction 都不是 OS Isolation。
  未显式声明 Tool Set 的 Child 可能继承更广默认值；Parallel Writer 需要仓库级
  Coordination。

<!-- resource:watch-pi-crew -->

### pi-crew

[仓库](https://github.com/baphuongna/pi-crew) ·
[审查快照](https://github.com/baphuongna/pi-crew/tree/c694ebfd5d0f49d9479870d6919be4bbf9738291) ·
MIT · 已审查源码、高风险试用

- **为什么值得试用：**当前 Scope 下的 Durable Multi-agent Workflow、
  Parallelism、Orchestration 与可选 Worktree Isolation。
- **需要验证：**每个 Workflow 的 Code/Ref、Broker Exposure、Execution
  Confirmation Semantics、Worktree Merge/Conflict Path、State Retention，以及
  Partial Failure 后清理。
- **关键边界：**动态 `.dwf.ts` Workflow 是未沙箱化 JavaScript/TypeScript；
  名为 Confirmation 的配置不一定是人类审批；Unix Broker 可以默认启用。尽管有
  较广 CI，审查快照中的 Weekly Smoke Job 仍在失败。

## 互操作与外部访问

<!-- sync:watchlist-connectivity -->

<!-- resource:watch-mcp-adapter -->

### pi-mcp-adapter

[仓库](https://github.com/nicobailon/pi-mcp-adapter) ·
[审查快照](https://github.com/nicobailon/pi-mcp-adapter/tree/6a3e840219a49f9ae5350542b7a707aa1e83fedf) ·
MIT · 已审查源码

- **为什么值得试用：**看起来较成熟的 Lazy-proxy/Direct MCP Integration，覆盖
  Protocol、OAuth、Packaging 与 Conformance Test。
- **需要验证：**每次只使用一个 Pinned Server，检查 Exact Exposed Tool、
  Transport、Consent、Timeout、Cancellation、Credential、Shared Multiplexer
  State 与 Removal。
- **关键边界：**Pi 刻意不内建 MCP。Adapter Server Command、Argument、
  Environment 和 Secret Resolver Command 都以本地权限运行。Consent UI 不能
  替代 Server Review 或 OS Containment；不要使用未固定的 `@latest` Server
  Example。

<!-- resource:watch-web-access -->

### pi-web-access

[仓库](https://github.com/nicobailon/pi-web-access) ·
[审查快照](https://github.com/nicobailon/pi-web-access/tree/c702b3be11bfbc832489eb7cfe31d9bbbbb2cc27) ·
MIT · 已审查源码、外部数据传输

- **为什么值得试用：**一个 Package 覆盖 Search、Fetch、GitHub Repository、
  PDF、YouTube 与 Local-video Workflow。
- **需要验证：**每个 Request 实际选择的 Provider/Fallback、Outbound Host、
  Query/Page/Video Payload、Redirect/SSRF Behavior、Maximum Download/Upload
  Size、Cookie Access、Retention、Timeout 与 Offline Failure。
- **关键边界：**“零配置”搜索仍使用外部服务。Fallback 可把 Query、URL、Page
  Content 或 Video 发给 Exa、OpenAI、Gemini、Perplexity、Jina、Firecrawl 等。
  Browser-cookie Access 尤其敏感。仓库存在 Test，但快照时未观察到项目自己的
  Default-branch CI。

<!-- resource:watch-browser-native -->

### pi-agent-browser-native

[仓库](https://github.com/fitchmultz/pi-agent-browser-native) ·
[审查快照](https://github.com/fitchmultz/pi-agent-browser-native/tree/211a012c9b199d758768e8ba729f35e11e661f65) ·
MIT · 已审查源码、敏感本地数据

- **为什么值得试用：**通过 Structured Pi Tool 暴露独立 `agent-browser` CLI，
  覆盖 Browser/Electron/Profile/Download Workflow。
- **需要验证：**CLI/Version Pairing、Project-trust Behavior、专用测试 Profile、
  Cookie/Login Isolation、Clipboard、Download Path、Screenshot Content、
  Cleanup 与禁止生产账号 Policy。
- **关键边界：**真实 Browser 能访问 Authenticated Session 与 Private Content。
  Project-level Package Configuration 对 Trust 敏感。仓库有大量 Test，但快照
  时未观察到项目自己的 GitHub Actions。

## 人类审查与分析

<!-- sync:watchlist-review -->

<!-- resource:watch-plannotator -->

### Plannotator

[仓库](https://github.com/backnotprop/plannotator) ·
[审查快照](https://github.com/backnotprop/plannotator/tree/80065c84624e80bf60dc1ad862c17c3ea3f2bd80) ·
根仓库 Apache-2.0；Pi Extension MIT OR Apache-2.0 · 已审查源码

- **为什么值得试用：**为 Plan、Markdown/HTML 与 Code Diff 建立具体的
  Human-in-the-loop Review Surface，并有 Pi Runtime Smoke Test。
- **需要验证：**Local-only Path、Reject/Approve Semantics、Large Diff、
  Malformed Content、Browser Lifecycle、Cancellation，以及禁用 Sharing。
- **关键边界：**可选 Sharing 会上传 Encrypted Ciphertext 并使用 Shareable URL。
  Encryption 降低 Content Exposure，但不会消除 URL Fragment、Browser History、
  Metadata、Endpoint 与 Retention Risk。敏感组织应以
  `PLANNOTATOR_SHARE=disabled` 试用。

<!-- resource:watch-pi-lens -->

### pi-lens

[仓库](https://github.com/apmantza/pi-lens) ·
[审查快照](https://github.com/apmantza/pi-lens/tree/a4baa3a94ecaf71f8af9f48ab27c8d7f6da8fdb2) ·
MIT · 已审查源码

- **为什么值得试用：**Structured LSP、Lint、Formatter、AST/Tree-sitter 与可选
  Scanning Tool，并有多个 Smoke/Health Workflow。
- **需要验证：**Grammar/Download Integrity、Dependency Install Approval、
  Server Process Lifecycle、Mutation Preview、Formatter Conflict、Large
  Repository Behavior 与当前 Pi Compatibility。
- **关键边界：**Build/Lifecycle Path 可下载 Grammar 与 Tool；Structured
  Analysis 仍可修改文件。一个 Compatibility Workflow 固定到 Pi 0.80.10，因此
  单独看它不能证明完整支持 v0.83.0。

<!-- resource:watch-gentle-pi -->

### gentle-pi

[仓库](https://github.com/Gentleman-Programming/gentle-pi) ·
[审查快照](https://github.com/Gentleman-Programming/gentle-pi/tree/3b6b3d2183dbbc4d45b16a1a0f127728c0a2435c) ·
MIT · 已审查源码、高风险试用

- **为什么值得试用：**在 Specification-driven Development、TDD、Review、
  Subagent 与 Local Authority/Policy Design 方面非常宽泛的研究案例。
- **需要验证：**选择一个有文档的 Version/Architecture，检查 Native Runtime
  Artifact 与 Postinstall，枚举 Companion Extension，执行 Threat Model，并
  测试 Rollback/Removal。
- **关键边界：**能力面很大；`postinstall` 会获取或构建 Native Runtime，当前
  RDD Path 被描述为 Unstable，Threat Model 排除 Malicious Same-user Process
  替换。应视为研究案例，不是轻量默认选项。

## Memory、可观察性与替代 UI

<!-- sync:watchlist-state -->

<!-- resource:watch-hermes-memory -->

### pi-hermes-memory

[仓库](https://github.com/chandra447/pi-hermes-memory) ·
[审查快照](https://github.com/chandra447/pi-hermes-memory/tree/5aafe2ca04cb55b62204b159389c8381894038ce) ·
MIT · 已审查源码、持久私密数据

- **为什么值得试用：**Cross-session Memory、SQLite Full-text Session Search
  与 Procedural Memory，并有 Test/CI。
- **需要验证：**Database Location/Scope、Project Separation、Retention、
  Deletion/Export、Malicious Stored Instruction、Secret-scanner False
  Negative、Native ABI、Model-based Consolidation 与 Recovery。
- **关键边界：**Persistent Memory 会同时延长 Privacy 与 Prompt-injection
  Lifetime。Pattern Scanner 不能证明移除每个 Credential/Sensitive Fact；
  Consolidation 会通过模型发送和重写内容。

<!-- resource:watch-braintrust-tracing -->

### braintrust-pi-extension

[仓库](https://github.com/braintrustdata/braintrust-pi-extension) ·
[审查快照](https://github.com/braintrustdata/braintrust-pi-extension/tree/c8f1aea1236f47c2681c0104be143b832bc9058c) ·
MIT · 已审查源码、外部数据传输

- **为什么值得试用：**针对 Session、Turn、Model、Tool 与 Compaction 的显式
  Tracing，并有 Integration/Packaging/Compatibility CI。
- **需要验证：**在完成 Data Classification 前保持 Tracing Disabled；测试
  Redaction、Sampling、Endpoint/Account、Retention/Deletion、Offline Behavior、
  Backpressure、Failure Isolation 与 Removal。
- **关键边界：**启用后，实现可以发送 Raw User Input、Normalized Context、
  Assistant Output、Tool Argument 与 Tool Result。不记录 Provider Payload 或
  Thinking Signature，不表示 Session Content 留在本地。

<!-- resource:watch-emacs-frontend -->

### pi-coding-agent for Emacs

[仓库](https://github.com/dnouri/pi-coding-agent) ·
[审查快照](https://github.com/dnouri/pi-coding-agent/tree/df5ce0a176ce634ccb4883042c415a74a5637c37) ·
GPL-3.0-only · 已审查源码、Project Trust 敏感

- **为什么值得试用：**通过 Pi RPC 实现、测试充分的 Alternative UI，也是 Headless
  Controller 中 Trust Decision 的具体案例。
- **需要验证：**打开未知 Repository 前设置显式 Project-trust Policy；测试
  Approve/Deny、Context File、Auth-store Access、Cancellation、Child Restart
  与 Buffer/Session Cleanup。
- **关键边界：**文档默认配置会向 Pi 传 `--approve`，在无法显示 Trust Prompt
  的 RPC Mode 中启用项目 `.pi` Setting/Resource。不可信项目应使用前端的
  Non-approving Policy，并单独考虑 `--no-context-files`。

## 暂缓进入观察名单

<!-- sync:watchlist-deferred -->

以下来源可用于历史研究，但目前未通过观察名单 Gate，或必须拆成单项评估。

<!-- resource:defer-extension-collection -->

- **[pi-extensions 审查快照](https://github.com/tmustier/pi-extensions/tree/60d70f24825446205c45e89f98813688e52823f3)** —
  混合 Personal Collection，不是一个 Atomic Capability。
  各子目录 Test/CI 覆盖不同，部分文档保留 Legacy Link。应审查单个 Extension，
  而不是把整个仓库作为一个推荐项。

<!-- resource:defer-pi-skills -->

- **[pi-skills 审查快照](https://github.com/badlogic/pi-skills/tree/90bb51cae36515a648515b633a81c0c6efc8c74d)** —
  Heterogeneous High-permission Skill，安装指引仍使用旧
  `@mariozechner/*`，且未观察到 Repository CI/Test。每个 Skill 都需要迁移与
  独立 Authority Review。

<!-- resource:defer-share-hf -->

- **[pi-share-hf 审查快照](https://github.com/badlogic/pi-share-hf/tree/21c1d9629187b553a2d59f26c5ef28eb33bb4e70)** —
  未检测到 Repository/Package License，使用 Legacy Pi Scope，
  未观察到 Test/CI，并有意把 Session 上传到 Public Hugging Face。Secret
  Scanning 与 Model Review 都无法保证清除 Private Code、Business Fact、Name、
  Image 或 Conversation Data。

## 亲测晋级检查表

<!-- sync:watchlist-promotion -->

把条目移出本文件前，具名人类 Reviewer 必须：

1. 固定并记录 Exact Artifact 与 Integrity/Ref；
2. 披露与项目的任何关系；
3. 审查 Install/Lifecycle Script 与 Runtime Authority；
4. 用测试 Credential/Data 运行全部相关 Trial Matrix；
5. 验证 Cleanup 与 Rollback；
6. 记录 Pi/Node Version、Platform、相关时的 Model/Provider、日期、Command、
   Expected/Actual Result、Failure 与 Residual Risk；
7. 根据直接体验撰写英文 Recommendation；
8. 由另一位人类检查中文事实与安全限定；
9. 设置 Retest Trigger 与 Expiration Date。

Stars、下载、Catalog Rank、Maintainer Affiliation 或 Passing CI 都不能替代这些
步骤。
