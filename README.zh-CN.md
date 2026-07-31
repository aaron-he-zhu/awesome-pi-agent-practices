# Awesome Pi Agent Practices [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[English](README.md) | [简体中文](README.zh-CN.md)

面向 Pi Coding Agent 的可复现操作、定制、安全与集成实践。

> **AI 辅助研究预览。**源码审查不表示已经亲测、安全认证或背书。第三方候选必须由
> 具名人类维护者试用，并根据直接体验重写推荐，才能进入正式精选列表。

<!-- sync:root-contents -->

## 目录

- [从这里开始](#从这里开始)
- [Pi 生态概览](#pi-生态概览)
- [实践领域](#实践领域)
- [官方基础材料](#官方基础材料)
- [证据与研究](#证据与研究)
- [社区审查队列](#社区审查队列)

<!-- sync:root-start -->

## 从这里开始

本集合最短的安全阅读路径：

| 步骤 | 实践                                                                                                                  | 可观察结果                                                       |
| ---: | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
|    1 | [固定执行环境](docs/practice-guide.zh-CN.md#p01--固定并记录执行环境)。                                                | 可以重建 Pi/Runtime/Model/Resource Version。                     |
|    2 | [建立可恢复 Git Baseline](docs/practice-guide.zh-CN.md#p02--从可恢复的版本控制状态开始)。                             | 可以区分已有修改与 Agent 修改。                                  |
|    3 | [选择真正的 Containment Boundary](docs/practice-guide.zh-CN.md#p03--用-os-边界隔离不可信或无人值守工作)。             | 不可信工作无法访问无关文件、Credential 或 Network。              |
|    4 | [区分 Project Trust、Context 与 Sandbox](docs/practice-guide.zh-CN.md#p04--把-project-trust-当作加载门不是-sandbox)。 | Resource Loading 与 OS Authority 被独立控制。                    |
|    5 | [从可测试任务简报开始](docs/practice-guide.zh-CN.md#p08--以可测试的任务简报开始)。                                    | Goal、Scope、Constraint、Check 与 Handoff 明确。                 |
|    6 | [写入前先勘察](docs/practice-guide.zh-CN.md#p09--先只读勘察再扩大能力)。                                              | 第一轮绘制 Code Map，不修改文件。                                |
|    7 | [选择最小能力定制原语](docs/practice-guide.zh-CN.md#p11--选择满足需求的最小能力原语)。                                | Prompt、Skill、Extension、Package、JSON、RPC 或 SDK 有明确理由。 |
|    8 | [使用诊断隔离阶梯](docs/practice-guide.zh-CN.md#p28--用隔离阶梯诊断)。                                                | 一个受控变化能开关脱敏 Minimal Reproducer。                      |

阅读完整的[三十条实践指南](docs/practice-guide.zh-CN.md)；检查失败时使用
[故障排查手册](docs/troubleshooting.zh-CN.md)。

<!-- sync:root-ecosystem -->

## Pi 生态概览

Pi 生态不只是 `pi` 终端命令。在本仓库采用的稳定 **v0.83.0** 基线中，四个主要
Package 分别覆盖 Multi-provider AI API、Agent Runtime、Coding-agent CLI 与
TUI。Prompt Template、Skill、Extension、Theme 和 Pi Package 构成从可复用文本
到进程内代码的分层定制路径；JSON、RPC 与 SDK 则提供不同强度的程序化集成入口。

### 四个主要 Package

| Package                                                                                                                                                 | 具体职责                                                                                  | 适用场景                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`@earendil-works/pi-ai`](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/README.md)                     | 统一 Provider Streaming、Message、Tool Call、Usage 与 Cross-provider Transformation。        | 只需要 Model/Provider Primitive，不需要 Coding-agent UX。                |
| [`@earendil-works/pi-agent-core`](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/README.md)          | 提供 Agent Loop、State、Event、Tool Execution 与 Transport Primitive。                       | 构建 Agent Runtime，而不是直接使用完整 CLI。                                  |
| [`@earendil-works/pi-coding-agent`](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md) | 提供 `pi` CLI、Coding Tool、Session、Resource Loading，以及 TUI、Print、JSON、RPC 与 SDK Surface。 | 使用交互式 Agent、Headless Automation 或 Application Embedding Surface。 |
| [`@earendil-works/pi-tui`](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/tui/README.md)                   | 提供 Terminal Component、Differential Rendering、Input、Layout 与 Width Handling。           | 构建 Terminal Interface 或自定义 Pi UI。                                |

[Pi 的设计原则](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#design-principles)
是让 Mandatory Core 保持精简。在 v0.83.0 中，MCP、Subagent、Permission
Popup、Plan Mode、Todo 与 Background Bash 都不是内建 Workflow；它们可以通过
Extension/Package 实现，也可以与 Container、tmux 等外部工具组合。

### 定制与分发

| 原语                                                                                                                                                   | 具体行为                                                                                   | 必须记住的边界                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [Context File](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#context-files) | 分层加载 `AGENTS.md` 或 `CLAUDE.md` Instruction。                                            | 拒绝 Project Trust 不会关闭发现；需用 `-nc`。Context 不是 OS Permission Boundary。 |
| [Prompt Template](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md) | 通过 `/review` 等显式 Slash Command 展开可复用 Markdown。                                         | 它是文本展开，不是自动 Runtime Hook 或 Tool Policy。                             |
| [Skill](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md)                     | 按需加载 Workflow，并可包含 Script、Reference 与 Asset。                                           | Skill 可以指示 Tool/Executable Use，仍需要 Source Review。                   |
| [Extension](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)             | 在进程内运行 TypeScript/JavaScript，可增加 Event、Tool、Command、UI、Provider、Policy 与 Tool Routing。 | 它具有 Pi Process User 的 Authority；Tool Allowlist 不是 Sandbox。          |
| [Theme](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/themes.md)                     | 通过 JSON 配置 Terminal Presentation。                                                      | 包含 Theme 的 Package 还可能包含可执行 Extension 或 Dependency。                 |
| [Pi Package](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)              | 打包 Extension、Skill、Prompt 与 Theme；来源可以是 npm、Git 或 Local Path，CLI 管理已配置条目。              | 分发与 Catalog 收录不能证明 Identity、Compatibility、Quality 或 Safety。         |

### 集成路径

| Interface                                                                                                                                           | Data/Control 形态                                          | Ownership Boundary                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Interactive 与 Print](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md#modes) | 面向人的 TUI 或一次性 Final Output。                              | Print Mode 不会自动无 Session；需要时使用 `--no-session`。                             |
| [JSON Mode](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/json.md)                  | 面向 Log、Pipeline 与自定义消费者的单向 JSON Lines Event Stream。      | 它不是双向 Controller，Consumer 必须处理 Streaming Event。                            |
| [CLI RPC](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md)                     | 通过 stdio 上 LF 分隔的 JSONL 传递双向 Request、Response 与异步 Event。 | 固定 Pi Version，并单独 Drain stderr；RPC 不是 JSON Mode。                           |
| [TypeScript SDK](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sdk.md)              | 在进程内构建并拥有 Session、Resource、Tool、Model 与 Event。           | Host 负责 Policy、Credential、Persistence、Cancellation、Subscription 与 Cleanup。 |

[已完成源码审查的社区能力地图](docs/research/landscape.zh-CN.md#社区能力地图)
记录了 VM Isolation（Gondolin）、Subagent/Workflow Orchestration（pi-subagents
与 pi-crew）、MCP（pi-mcp-adapter）、Web/Browser Access（pi-web-access 与
pi-agent-browser-native）、Human Review（Plannotator）、Code Analysis
（pi-lens）、Memory（pi-hermes-memory）、Tracing（braintrust-pi-extension）、
Emacs UI 与 Broad Operating Layer（gentle-pi）等具体线索。这些是 Research
Lead，不是正式精选推荐；每个项目仍需具名人类完成可复现实测。

发现候选时，先使用[目录快速选择器](docs/research/ecosystem-directories.zh-CN.md#快速选择)，
再回到每个项目的 Canonical Source 核验。较早材料仍可能使用
`badlogic/pi-mono`、`earendil-works/pi-mono` 或 `@mariozechner/*`；执行前应根据
[Scope 迁移说明](docs/research/landscape.zh-CN.md#scope-迁移与过时指令)检查当前
Repository、npm Publisher/Scope、Peer Dependency 与 Install Target。

<!-- sync:root-areas -->

## 实践领域

| 领域                     | 实践                                                            | 主要决策                                                                |
| ------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Baseline 与 Recovery     | [P01–P02](docs/practice-guide.zh-CN.md#baseline-and-recovery)。 | 另一位使用者能否复现并安全回滚？                                        |
| Trust 与 Containment     | [P03–P06](docs/practice-guide.zh-CN.md#trust-and-containment)。 | 加载什么、什么能执行、它能访问什么？                                    |
| Task 与 Context Design   | [P07–P11](docs/practice-guide.zh-CN.md#任务与上下文设计)。      | 满足需求的最小 Context/Capability 是什么？                              |
| Session Operation        | [P12–P16](docs/practice-guide.zh-CN.md#任务执行中)。            | Durable State 在哪里，什么有损或可分享？                                |
| Model 与 Reliability     | [P17–P20](docs/practice-guide.zh-CN.md#模型provider-与可靠性)。 | 哪个 Provider/Model Behavior、Retry Owner 与 Output Bound 适用？        |
| Extension 与 Package     | [P21–P24](docs/practice-guide.zh-CN.md#extension-与-package)。  | Runtime Code 是否足以证明其 Lifecycle、Authority 与 Supply Chain 合理？ |
| Automation 与 Embedding  | [P25–P27](docs/practice-guide.zh-CN.md#自动化与嵌入)。          | 哪个 Process 承担 Policy、Session、Cancellation 与 Cleanup？            |
| Diagnosis 与 Maintenance | [P28–P30](docs/practice-guide.zh-CN.md#诊断升级与贡献)。        | Failure、Upgrade 与 Contribution 能否由人类核验？                       |

[架构决策地图](docs/architecture.zh-CN.md)区分稳定 Release Behavior、实验源码、
Customization Layer、Trust Boundary、Session Semantics 与 Integration Mode。

<!-- sync:root-official -->

## 官方基础材料

以下是 Primary Source 与 Reference Implementation，不是第三方背书。

<!-- resource:official-pi -->

- [Pi](https://github.com/earendil-works/pi) - 提供 Tag Source、Test、Release、Security Boundary 与 Contribution Policy 的 Canonical Monorepo。

<!-- resource:official-docs -->

- [Documentation](https://pi.dev/docs/latest) - 当前 Usage、Provider、Session、Resource、Security、Terminal Setup、JSON、RPC 与 SDK 指南。

<!-- resource:official-releases -->

- [Releases](https://github.com/earendil-works/pi/releases) - 用于选择和保存可复现 Baseline 的 Versioned Note 与 Artifact。

<!-- resource:official-extension-examples -->

- [Extension Examples](https://github.com/earendil-works/pi/tree/v0.83.0/packages/coding-agent/examples/extensions) - Lifecycle Hook、Custom Tool、Provider、UI、Policy 与 Tool-routing Pattern 的可审查实现。

<!-- resource:official-package-catalog -->

- [Package Catalog](https://pi.dev/packages) - 广泛 Package Discovery Surface；条目仍需 Source、License、Authority、Compatibility 与 Hands-on Review。

<!-- resource:official-rfcs -->

- [Pi RFCs](https://rfc.earendil.com/keyword/pi/) - 带显式 State 的 Design Proposal，必须与 Tag Implementation 和 Release Status 交叉验证。

<!-- sync:root-research -->

## 证据与研究

| 阅读材料                                           | 用途                                                                                          |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [文档地图](docs/README.zh-CN.md)                   | 选择阅读路径，理解 Evidence Label。                                                           |
| [官方来源地图](docs/research/source-map.zh-CN.md)  | 用固定版本一手来源替换记忆/Search Snippet。                                                   |
| [证据台账](docs/research/evidence-ledger.zh-CN.md) | 把 P01–P30 每条建议追溯到事实和明确标记的推论。                                               |
| [研究方法](docs/research/methodology.zh-CN.md)     | 检查 Source Tier、Inclusion Gate、Scoring、AI Disclosure 与 Update Procedure。                |
| [精确查询日志](docs/research/query-log.zh-CN.md)   | 重跑带日期的 GitHub、Catalog、Registry、RFC、Source 与 Community-review Query。                |
| [生态全景](docs/research/landscape.zh-CN.md)       | 查看带日期的 Project、Catalog、Issue Cluster、Directory 与 Opportunity Snapshot。             |
| [生态目录指南](docs/research/ecosystem-directories.zh-CN.md) | 在 Official、Curated、Automated、Synthesized 与 Historical Discovery Surface 之间选择。 |
| [Extension 审查](docs/extension-review.zh-CN.md)   | 审计 Identity、Install Script、Dependency、Authority、Lifecycle、Data Flow、Test 与 Removal。 |
| [术语表](docs/glossary.zh-CN.md)                   | 区分 Project Trust、Session Operation、Tool Limit、RPC、SDK 与 Containment。                  |

稳定结论以 **v0.83.0**
`845d6ff1f6643aba440341cce877ce1c43ebbc39` 核验。发布后观察固定到
`main@9b50b046d328d589a81400d2e184175d0bf19734`，并标记为 `main-only`。

<!-- sync:root-queue -->

## 社区审查队列

[源码审查观察名单](docs/research/watchlist.zh-CN.md)包含十二个已完成源码审查、
等待人类亲测的 Candidate，覆盖 VM Isolation、Subagent、Workflow、MCP、
Web/Browser Access、Human Review、Code Analysis、Memory、Tracing、Alternative
UI 与 Broad Operating Layer。每个条目都记录为何值得试用，以及必须测试的
Authority、Privacy、Supply-chain、Lifecycle 或 Compatibility Boundary。

目前有意**不设置任何第三方正式精选条目**。晋级需要具名人类 Reviewer、Immutable
Artifact、Relationship Disclosure、Isolated Trial、精确 Environment/Command、
Expected/Actual Result、Cleanup、Residual Risk、双语事实审查与 Expiration/
Retest Trigger。

<!-- sync:root-related -->

## 相关列表

以下项目回答相邻的 Discovery/Ecosystem 问题。

<!-- resource:related-awesome-pi -->

- [awesome-pi](https://github.com/BubblePtr/awesome-pi) - CC0 下活跃的双语 Pi Package 与 Ecosystem Resource Curated Directory。

<!-- resource:related-automated-directory -->

- [awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent) - 为 Breadth/Discovery 优化、自动且频繁更新的 Directory。

<!-- resource:related-package-index -->

- [Pi Package Index](https://github.com/getpipher/pi-package-index) - 非官方、每日刷新的 npm Package Index，提供可搜索的 Maintenance Metadata 与 Public JSON API。

<!-- resource:related-ecosystem-wiki -->

- [pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki) - Architecture、Comparison 与 Ecosystem Synthesis；Secondary Claim 应以一手来源验证。

<!-- sync:root-contributing -->

## 贡献

提议实践或候选前阅读[贡献指南](CONTRIBUTING.zh-CN.md)。贡献必须说明条目为何特别
有用，披露 Relationship 与 AI Assistance，区分 Source Review 与 Direct Use，
提供可复现证据，并同时更新两种语言。提交内容采用 CC0-1.0。

<!-- sync:root-footnotes -->

## 注记

这是独立社区仓库，不由 Earendil Works 维护，也不隶属于 Earendil Works。“Pi”
和所链接项目名称归各自所有者。

研究快照：**2026-07-31，Asia/Singapore**。Dynamic Count、Package Metadata、
Provider Behavior 与 `latest` Documentation 可能已经变化。

中央 Awesome 项目的
[列表创建指南](https://github.com/sindresorhus/awesome/blob/main/create-list.md)与
[当前 PR 模板](https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md)
拒绝 AI-generated List 与 Fully AI-generated PR。本透明研究预览必须先产生实质
Human Testing、Selection、Rewriting、Bilingual Review，并达到要求的公开维护
时间，才能诚实地声称具备中央列表申请资格。
