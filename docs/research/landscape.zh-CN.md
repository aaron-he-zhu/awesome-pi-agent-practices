[English](./landscape.md) | [简体中文](./landscape.zh-CN.md)

# Pi 生态与 Issue 全景

<!-- sync:landscape-snapshot -->

这是带日期的研究快照，不是 Live Dashboard，也不是质量排名。数字于
**2026-07-31（Asia/Singapore）**从 GitHub、Pi Package Catalog、Release
Metadata、Registry Metadata 与 Earendil RFC Index 捕获。向其他地方引用前应
重新运行 Query。

<!-- sync:landscape-reproduction -->

精确 Endpoint、Query String、Immutable Ref 与 Capture Limitation 保存在
[查询日志](query-log.zh-CN.md)和
[机器可读快照](../../data/research-snapshot-2026-07-31.json)中。

## 核心发现

<!-- sync:landscape-findings -->

1. **Pi 的 Core Policy 很小，生态表面却很大。**Coding Harness 刻意不内建若干
   Opinionated Workflow Feature，Package/Extension 则实现很多变体。
2. **发现问题已经有人解决。**已有官方 Catalog 和多个 Package/Wiki/Awesome
   Directory，再做一个穷举 Link Dump 会重复。
3. **缺失的是 Operational Evidence Layer。**用户需要包含 Trust Boundary、
   Version Scope、Verification、Rollback 与 Data Flow 的步骤。
4. **安全语言很容易被夸大。**Project Trust、Tool Allowlist、Worktree、
   Subprocess 和 Tool Routing 都是有用控制，但不等同于整个 Process 的 OS
   Isolation。
5. **兼容性是多维的。**Pi Version、Node/Bun Distribution、Package Scope、
   Provider/Model Catalog、Terminal、Platform 和 External Service Behavior
   可以独立改变。
6. **Popularity 是很弱的选择信号。**高 Star Project 可能过宽、Archived、
   Legacy-scoped、无 License 或不适合某类 Data Boundary；小而专注的 Tool 也
   可能很优秀。

这些发现定义本仓库的空位：建设双语、可复现、证据导向、安全敏感的实践，而不是
Package Inventory。

## 上游项目快照

<!-- sync:landscape-upstream -->

捕获时 GitHub API Metadata：

| 指标 | 快照值 | 解释 |
| --- | ---: | --- |
| Stars | 约 81,068 | 仅流行度信号，持续变化。 |
| Forks | 约 10,008 | Repository Network Count，不是 Active Maintainer。 |
| Watchers | 273 | GitHub Subscription Metadata。 |
| Open Issues Field | 83 | Repository Metadata Field；本快照中包含 71 个 Open Issue 与 12 个 Open PR。 |
| Total Issues | 4,579 | 带 `is:issue` 的 Search Query，含 Open/Closed。 |
| Open Issues | 71 | 带 `is:issue is:open` 的 Search Query。 |
| Closed Issues | 4,508 | 带 `is:issue is:closed` 的 Search Query。 |
| Total Pull Requests | 2,485 | 带 `is:pr` 的 Search Query，含 Open/Closed。 |
| Open Pull Requests | 12 | 带 `is:pr is:open` 的 Search Query。 |
| Closed Pull Requests | 2,473 | 带 `is:pr is:closed` 的 Search Query。 |

Closed/Open 比例表明 Triage 活跃，但不证明 Resolution Quality。Pi Contribution
Gate 还会自动关闭 Unsolicited Item，因此不能把 Raw Close Count 解释为“修复的
Bug”。

源码快照时：

- v0.83.0 是最新 Stable Release；
- 捕获的 `main` 在 Release Commit 约两天后已经领先 56 个 Commit；
- npm/Source Coding-agent Package 要求 Node `>=22.19.0`；
- `@earendil-works/pi-protocol` 已在 Tag 后进入 `main`，说明 Main-only
  Architecture 可以非常快地偏离稳定 Release Material。

## Package Catalog 快照

<!-- sync:landscape-catalog -->

捕获时，官方 [Pi Package Catalog](https://pi.dev/packages) 报告 **5,351** 个
Package。UI Filter 返回：

| Filter | 数量 |
| --- | ---: |
| Extension | 3,059 |
| Skill | 360 |
| Theme | 109 |
| Prompt | 78 |

这些数字不可相加。一个 Package 可声明多个 Resource Type，Catalog Metadata
可能不完整；Presence 不能证明 License、当前 Pi Compatibility、Documentation
Quality、Maintenance、Safety 或 Direct Use。Catalog 是优秀 Discovery Index，
不是 Endorsement Oracle。

## RFC 快照

<!-- sync:landscape-rfc -->

捕获时，[Earendil Pi RFC Index](https://rfc.earendil.com/keyword/pi/) 列出九个
状态不同的 Pi-related RFC。RFC 记录 Proposal 与 State，本身不能证明 Implementation
已进入 Stable Tag、发布到 Registry 或保留所提 Interface。因此每条 RFC 结论都
要与 Tag/Source 交叉验证。

## 公开 Issue 信号

<!-- sync:landscape-issues -->

以下 GitHub Issue-search Count 是**互相重叠的 Keyword Hit**，不是互斥 Category，
也不是 Percentage：

| 搜索簇 | 命中 | 人工 Sampling 检查内容 |
| --- | ---: | --- |
| Provider / Model | 2,272 | Catalog Mismatch、Unsupported Capability、Provider-specific Payload、Endpoint/Region Behavior。 |
| Authentication / Login / OAuth | 490 | Credential Route、Expiry、Scope、Subscription/API-key Difference、Headless Behavior。 |
| Extension | 1,563 | Lifecycle、Event Ordering、Tool Override、UI/Mode Behavior、Compatibility。 |
| Package / Install / Update | 2,478 | Registry/Git Install、Dependency Script、Pin、Update Semantics、Migration。 |
| Session | 1,534 | Resume、Tree/Fork/Clone、Storage、Export/Share、Stale/Wrong Context。 |
| Compaction | 415 | Overflow Recognition、Summary Loss、Branch Behavior、Retry 与 Custom Hook。 |
| Windows / WSL | 304 | Native/WSL Path、Terminal Key、Process Behavior、Shell/Encoding。 |
| Terminal / TUI | 1,061 | Emulator/Multiplexer Difference、Keybinding、Rendering、Resize、Unicode。 |
| Timeout / Retry / Hang | 530 | Provider Idle、Layered Retry、等待 Input 的 Command、Cancellation。 |
| Sandbox / Security / Permission | 211 | Project Trust Misconception、Containment、Extension Authority、Prompt Injection。 |

Query 使用针对完整 Issue Corpus 的宽泛 OR-style Search，所以同一 Issue 可进入多行。
人工 Sampling Recent/Top Result 用于识别 Failure *Shape*，不是估算 Incident
Prevalence。

### 反复出现的失败形态

<!-- sync:landscape-shapes -->

| 失败形态 | 为什么容易混淆 | 实践响应 |
| --- | --- | --- |
| 把 Provider Behavior 当 Pi Behavior | 同一 CLI/Session 可路由到完全不同 Model API。 | 记录 Provider/Model/Catalog/Transport；用小型 Capability Ladder 复现。 |
| Automation 中没有 Trust Prompt | Non-interactive Mode 无法询问，Resource 可能被跳过或全局批准。 | 显式声明 Trust、Context、Resource 与 Tool；Fail Closed。 |
| “Read-only” 不是 Enforcement Boundary | Extension 可覆盖 Name 或直接使用 Process API。 | 禁用/审查 Extension；对对抗场景使用 OS Containment。 |
| 把 Session Continuity 当 Environment Reproducibility | JSONL 缺 Runtime、Catalog、完整 Package、Network 与 Repository Metadata。 | 另存 Execution Manifest 与 Durable Task Record。 |
| 把 Compaction 症状归咎于模型质量 | Lossy Summary 或 Split Turn 改变 Visible Context。 | 检查 Compaction Entry，压缩前外部化 Invariant。 |
| Retry Amplification | Provider、Agent、Controller 与 CI 都可重试。 | 每类 Failure 指定一个 Owner，并限制每一层。 |
| 把不完整 Output 当完整 | Tool 使用不同 Head/Tail/Count Truncation Strategy。 | 保留 Truncation Marker，跟随 Continuation/Full-output Path。 |
| Extension Startup/Reload Leak | Factory、Session 与 Replacement Lifecycle 被混为一谈。 | 在正确 Event 初始化 Session-bound Resource，并幂等 Cleanup。 |
| 把 Terminal Issue 当 Provider Failure | 模型响应正确后，Rendering/Input 仍可失败。 | 在 Print Mode 复现，每次改变一层 Terminal。 |
| 把 Package Discovery 当 Trust | Gallery/Search Presence 容易让人误认为已审核。 | 审 Source、Dependency、Lifecycle Script、Permission、License，并做隔离 Trial。 |

## 现有目录与重叠

<!-- sync:landscape-directories -->

<!-- resource:related-awesome-pi -->

### awesome-pi

[BubblePtr/awesome-pi](https://github.com/BubblePtr/awesome-pi) 是 CC0 下活跃的
双语 Package/Ecosystem Curated Directory。它是最接近的现有 “Awesome Pi” List，
应视为互补 Discovery Source，而不是复制对象。

<!-- resource:related-automated-directory -->

### awesome-pi-coding-agent

[shaftoe/awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent)
是 MIT 下自动、频繁刷新的 Directory。强项是 Breadth/Recency；Automated
Selection/Description 不等于 Human Hands-on Curation。

<!-- resource:related-package-index -->

### Pi Package Index

[getpipher/pi-package-index](https://github.com/getpipher/pi-package-index) 是
非官方、采用 MIT 许可且每日刷新的 npm Package Index，提供可搜索的
[Web Interface](https://pi-package.rectorspace.com/)与 Public
[JSON API](https://pi-package.rectorspace.com/api/packages)。它用 GitHub 与
Maintenance Signal 丰富 npm Metadata。这些 Signal 有助于 Discovery/Filtering，
不等于 Quality、Compatibility 或 Security Review。

<!-- resource:related-archived-awesome -->

### awesome-pi-agent

[qualisero/awesome-pi-agent](https://github.com/qualisero/awesome-pi-agent)
是较早的生态目录，但已 Archived，并自述 Retired/Outdated。它适合 Ecosystem
History，不是当前 Compatibility Source。

<!-- resource:related-ecosystem-wiki -->

### pi-ecosystem-wiki

[micuintus/pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki)
聚焦 Architecture、Comparison 与 Ecosystem Synthesis。Generated/Secondary
Claim 应当作为 Discovery Lead，直到用一手来源验证。

<!-- resource:related-extension-registry-snapshot -->

### Traveler0014 的 awesome-pi-agent

[Traveler0014/awesome-pi-agent](https://github.com/Traveler0014/awesome-pi-agent)
使用 Structured YAML Registry、Schema Validation、Generated README 与
Scheduled Metadata Workflow。审查时 Scheduled Updater 失败，内容没有越过六月
初始快照；README 与 License File 的 Metadata 也不一致，因此未进入导航。

<!-- resource:related-awesome-pi-mono-snapshot -->

### awesome-pi-mono

[afoofaa/awesome-pi-mono](https://github.com/afoofaa/awesome-pi-mono) 是五月完成
Seed 的 MIT 人工分类列表。审查时没有可见的后续实质更新，仍保留旧 Upstream
Path，初始 Link Check 也失败，因此未进入导航。

### 未晋级的专用 Registry

[Leoguy77/pi-packages.nix](https://github.com/Leoguy77/pi-packages.nix) 是活跃的
Nix-native Generated Registry，包含 Integrity Hash 与可选 Binary Cache。它不是
通用 Awesome Directory。在
[`ab97786…`](https://github.com/Leoguy77/pi-packages.nix/commit/ab977868c85409142df3c7dc1b3e98281dde5617)，
README 声明 MIT，但 Tree 中没有独立 License File，GitHub 也未识别 SPDX
License。其文档中的 Fallback/Build Path 还可能需要关闭 Nix Sandbox 与 TLS
Verification。因此它仍是专用 Supply-chain Research Lead，而不是根 Discovery
Recommendation。

### 官方 Catalog

官方 Package Catalog 比任何人工 List 都更广。这些来源合起来已经很好地回答
“存在什么？”[生态目录指南](./ecosystem-directories.zh-CN.md)链接官方
Resource-type Filter，比较 Update Model，并区分活跃导航与 Historical/
Context-only Source。

### 不重复的范围

本仓库改为回答：

- 谨慎 Operator 应该做什么？
- Procedure 如何验证与回滚？
- 它适用于哪个 Pi Version/Interface？
- 真正 Execution/Data/Trust Boundary 在哪里？
- 哪个 Source 证明基础事实？
- 人类是否实际安装并测试过 Third-party Artifact？

本仓库在 Related Lists 链接当前目录，在生态目录指南中保留更完整的 Directory
Inventory，并把未试用 Candidate 放入明显分开的 Watchlist。

## 社区能力地图

<!-- sync:landscape-community -->

第二轮 Source Review 对以下类别抽样：

| 能力 | 观察名单示例 | 主要审查问题 |
| --- | --- | --- |
| VM/Tool Isolation | Gondolin。 | 什么仍在 Host，什么以读写方式挂载？ |
| Subagent/Workflow Orchestration | pi-subagents、pi-crew。 | 是否把 Subprocess/Worktree/Tool Limit 误当 OS Isolation？ |
| MCP | pi-mcp-adapter。 | 哪些 Server/Command/Credential 运行，是否固定？ |
| Web/Browser Access | pi-web-access、pi-agent-browser-native。 | 哪些 Private Content 离机或进入真实 Profile？ |
| Human Review | Plannotator。 | Optional Sharing 是否改变 Data Boundary？ |
| Structured Code Analysis | pi-lens。 | 什么会下载、执行、修改并保持 Version Compatible？ |
| Memory | pi-hermes-memory。 | 什么持久化、跨 Project、进入 Model 并可注入未来 Context？ |
| Tracing | braintrust-pi-extension。 | 哪些 Raw Prompt/Context/Tool Data 被上传？ |
| Alternative UI | pi-coding-agent for Emacs。 | RPC 没有 Prompt 时怎样处理 Project Trust？ |
| Broad Operating Layer | gentle-pi。 | 大型 Policy/Native-runtime Surface 能否固定、理解与回滚？ |

没有项目被升级到根列表，因为 Source Review 不是 Hands-on Evidence。另有三个来源
被 Deferred：需要逐项审查的 Mixed Extension Collection、Legacy-scoped Skill
Collection，以及无 License 的 Public-session-sharing Tool。

## 实践分类

<!-- sync:landscape-taxonomy -->

证据收敛为七类实践：

1. **Baseline 与 Recovery** — Version、Environment、Git State、Rollback。
2. **Trust 与 Containment** — Project Trust、Context、Credential、Mount、
   Network、Package Supply Chain。
3. **Task 与 Context Design** — Task Brief、Hierarchical Instruction、Read-only
   Reconnaissance、Context Budget、Primitive Selection。
4. **Session Operation** — Coherent Goal、Steering/Follow-up、Tree/Fork/Clone、
   Compaction、Export/Privacy。
5. **Model Reliability** — Capability Scope、Cross-provider Loss、Retry Layer、
   Bounded Output 与 Cancellation。
6. **Customization** — Prompt/Skill/Extension Choice、Lifecycle、Honest Tool、
   Package Manifest 与 Dependency Execution。
7. **Integration 与 Maintenance** — Interface Selection、Non-interactive Policy、
   RPC/SDK Ownership、Diagnosis、Staged Upgrade、Upstream Contribution。

这些直接映射到[实践指南](../practice-guide.zh-CN.md)的 P01–P30。

## Scope 迁移与过时指令

<!-- sync:landscape-migration -->

项目在 2026 年从 `badlogic/pi-mono`、`earendil-works/pi-mono`、
`@mariozechner/*` 等历史 Repository/Package Identity 迁移到
`earendil-works/pi` 与 `@earendil-works/*`。很多有价值的 Article、README、
Package Example 与 Search Result 仍带旧名。

Migration Review 应问：

- Repository URL 只是 Historical，还是代码已不再维护？
- npm Package 是否已经使用当前 Scope？
- Peer Dependency 与 Import Path 是否当前？
- Install Command 是否解析到持续维护 Artifact？
- Screenshot/Blog Claim 是否描述了 Pre-trust、Pre-package 或 Pre-protocol
  Version？
- Version Number 是否从未发布的 Lockstep Workspace 复制而来？

绝不能静默“纠正”Immutable Historical Evidence。应标记它，再单独链接当前
Canonical Source。

## 机会地图

<!-- sync:landscape-opportunities -->

未来人类贡献者的高价值工作：

| 机会 | 交付物 |
| --- | --- |
| Reproducible Operating Profile | 针对 Supervised Local、Sterile Read-only、Contained Untrusted 与 Non-interactive Automation 的 Pinned Command/Manifest。 |
| Hands-on Extension Report | Exact Artifact、Authority Map、Test Matrix、Data Flow、Cleanup 与 Retest Date。 |
| Platform Matrix | Native Windows vs WSL、macOS/Linux Terminal、Container、SSH 与支持的 Node/Bun Distribution。 |
| Provider Capability Probe | 针对 Tool、Image、Reasoning、Streaming、Retry/Overflow 与 Cross-provider Conversion 的小型脱敏 Test。 |
| Session Privacy Tooling | 不虚假承诺完整 Secret Detection 的 Local Pre-export Inspection。 |
| Package Supply-chain Record | Published Artifact/Source/Ref Mapping、Lifecycle Script、Transitive/Native Dependency 与 Rollback。 |
| Upgrade Diff Note | Stable Pi Baseline 之间 Trust、Resource、Session、Tool、RPC、SDK 与 Model Catalog 的变化。 |
| Bilingual Terminology Review | 人类验证 Command、Version Qualification、Risk 与 Evidence Status 等价。 |

仓库应通过这些 Verified Record 增长，而不是最大化 Link 数。

## 全景局限

<!-- sync:landscape-limits -->

- 所有 Dynamic Count 会立即变旧。
- Keyword Search 有重叠、False Positive 与 False Negative。
- GitHub/Catalog Metadata 很少揭示 Runtime Behavior。
- Passing Default-branch CI 不能证明每个 Published Artifact/Supported Platform。
- 缺 CI Workflow 不证明 Test 不存在或 Project 很差；它只改变 Confidence 与
  Trial Burden。
- License Detection 可能漏掉非标准声明；Published Artifact 可能与 Repository
  License 不同。
- 第二轮 Community Pass 仅看源码，没有实际触发 Credential、Network、Install
  Script、Cleanup 或真实 Pi Session。
- Provider Service 与 Model Catalog 可在 Repository 无 Commit 时变化。
