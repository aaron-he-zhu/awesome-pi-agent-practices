# Awesome Pi Agent Practices [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[English](README.md) | [简体中文](README.zh-CN.md)

面向 Pi Coding Agent 的可复现操作、定制、安全与集成实践。

> \*\*AI 辅助研究预览。\*\*源码审查不表示已经亲测、安全认证或背书。第三方候选必须由
> 具名人类维护者试用，并根据直接体验重写推荐，才能进入正式精选列表。

<!-- sync:root-contents -->

## 目录

- [从这里开始](#从这里开始)
- [把 Pi 作为一个系统运行](#把-pi-作为一个系统运行)
- [Pi 生态概览](#pi-生态概览)
- [实践领域](#实践领域)
- [官方基础材料](#官方基础材料)
- [证据与研究](#证据与研究)
- [社区审查队列](#社区审查队列)
  - [状态快照](#状态快照)
  - [已完成源码审查的社区项目——全部 12 项](#已完成源码审查的社区项目全部-12-项)
  - [延后处理的社区记录——全部 3 项](#延后处理的社区记录全部-3-项)
  - [初步发现候选——全部 13 项](#初步发现候选全部-13-项)
  - [能力覆盖与缺口——全部 25 类](#能力覆盖与缺口全部-25-类)
  - [架构层次——全部 11 种](#架构层次全部-11-种)
  - [与 Pi 的关系类型——全部 13 种](#与-pi-的关系类型全部-13-种)
  - [Catalog、目录与历史语境](#catalog目录与历史语境)
  - [发现边界与可能仍然遗漏的范围](#发现边界与可能仍然遗漏的范围)
  - [晋级 Gate](#晋级-gate)

<!-- sync:root-start -->

## 从这里开始

复制任何命令前，先选择版本轨道：

| 轨道    | 适用情况                | 规则                                                                                           |
| ----- | ------------------- | -------------------------------------------------------------------------------------------- |
| 可复现基线 | 复现本仓库结论或比较行为。       | 使用 Pi **v0.83.0**，并采用[官方来源地图](docs/research/source-map.zh-CN.md#规范入口)中的固定来源。                 |
| 当前版本  | 使用刚安装的最新 Pi 开始日常工作。 | 查阅[当前 Quickstart](https://pi.dev/docs/latest/quickstart)，记录精确版本；在核验前，把与 v0.83.0 的差异视为版本敏感行为。 |

### 五分钟只读基线

下面的基线用于核验可执行文件、Provider 认证、模型选择和最小资源运行；它**不是**
安装指南，也不是 Sandbox。

1. 在不含敏感数据的仓库中记录初始状态：

   ```bash
   command -v pi
   pi --version
   node --version
   git status --short
   ```

2. 使用与试运行相同的可选资源控制枚举模型：

   ```bash
   pi --offline --no-approve --no-context-files --no-extensions --no-skills \
     --no-prompt-templates --no-themes --list-models
   ```

   从真实结果中选择模型，再替换下方的 `PROVIDER` 和 `MODEL`。使用测试账号，或
   仅能完成一次模型请求的最小权限凭据。该命令仍使用当前全局 Pi Profile；若还要
   排除 Profile 本身，请使用故障排查手册的[干净基线](docs/troubleshooting.zh-CN.md#干净基线)。

3. 执行一次临时、只读的勘察；同时关闭项目上下文和可选资源：

   ```bash
   pi --offline --no-approve --no-context-files --no-extensions --no-skills \
     --no-prompt-templates --no-themes --no-session \
     --tools read,grep,find,ls \
     --provider PROVIDER --model MODEL -p \
     "只做勘察：指出仓库根目录和建议运行的检查，不要修改文件。"
   ```

   这里的只读只发生在“已注册工具”层，不是操作系统层。`read`、`grep`、`find` 与
   `ls` 仍能访问 Pi 进程可读的任何路径，返回内容也可能发送给所选 Provider；若
   这种可达范围不可接受，必须使用外部边界。`--offline` 只关闭 Pi 启动时的更新、
   Catalog 与 Telemetry 网络操作，不会阻止所选 Provider 请求，也不是网络防火墙。

4. 只有在命令成功退出、回答识别了预期仓库、`git status --short` 没有变化，且
   运行不依赖项目资源时，才算基线通过。认证、网络或模型错误进入
   [Provider 故障排查](docs/troubleshooting.zh-CN.md#provider-model-auth)；
   仅在项目目录中出现的故障进入[隔离阶梯](docs/troubleshooting.zh-CN.md#隔离阶梯)。

5. 开放写权限前，填写[任务简报](templates/task-brief.zh-CN.md)，根据
   [运行手册](docs/operating-playbook.zh-CN.md)划分风险，并建立可恢复的 Git
   基线。`git status` 不变只能证明仓库状态；工具白名单只限制已注册工具，不能
   隔离宿主进程。

### 按任务选择路径

| 任务                | 从这里开始                                                         | 完成前的必需产物                                 |
| ----------------- | ------------------------------------------------------------- | ---------------------------------------- |
| 第一次在真实仓库中工作       | [运行手册](docs/operating-playbook.zh-CN.md#如何使用本手册)              | 任务简报、Git 基线、验证结果和交付摘要。                   |
| 只读审查或分诊           | [勘察闸门](docs/operating-playbook.zh-CN.md#阶段-4--只读勘察与计划)        | 与文件对应的发现，以及“未授权写入”的明确说明。                 |
| 长任务或并行修改          | [运行手册：检查点与并行工作](docs/operating-playbook.zh-CN.md#检查点与并行工作)    | 路径/Worktree 归属、检查点、合并顺序和最终集成检查。          |
| 未知仓库或第三方 Package  | [Extension 审查](docs/extension-review.zh-CN.md#gate-0--确认精确制品) | 来源图、权限/数据流审查、隔离试用和清理。                    |
| CI 或无人值守运行        | [P25–P27](docs/practice-guide.zh-CN.md#p25--按所有权边界选择接口)       | 显式 Trust/Tool/Session 策略、有限超时/重试和机器可读结果。 |
| JSON、RPC 或 SDK 集成 | [架构：集成模式](docs/architecture.zh-CN.md#集成模式)                    | 启动、流式传输、取消、失败和关闭的生命周期测试。                 |
| 故障调查              | [症状路由](docs/troubleshooting.zh-CN.md#症状路由)                    | 最小复现、单变量对照和已脱敏证据。                        |
| 升级                | [P29](docs/practice-guide.zh-CN.md#p29--通过固定分阶段可逆的路径升级)       | 升级前后矩阵和经过演练的回滚。                          |
| 评估工作流或模型变更        | [评估记录](templates/evaluation-record.zh-CN.md)                  | 固定用例、门槛、指标、成本和 Reviewer 决定。              |

如果需要十二种常见任务的具体命令、预期结果、失败分支、核验和清理步骤，
请直接使用[场景手册](docs/scenario-cookbook.zh-CN.md)。

### 每个真实任务都要控制的八件事

三十条实践中最短的安全路径是：

| 步骤 | 实践                                                                                                       | 可观察结果                                                |
| -: | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
|  1 | [固定执行环境](docs/practice-guide.zh-CN.md#p01--固定并记录执行环境)。                                                   | 可以重建 Pi/Runtime/Model/Resource Version。              |
|  2 | [建立可恢复 Git Baseline](docs/practice-guide.zh-CN.md#p02--从可恢复的版本控制状态开始)。                                   | 可以区分已有修改与 Agent 修改。                                  |
|  3 | [选择真正的 Containment Boundary](docs/practice-guide.zh-CN.md#p03--用-os-边界隔离不可信或无人值守工作)。                     | 不可信工作无法访问无关文件、Credential 或 Network。                  |
|  4 | [区分 Project Trust、Context 与 Sandbox](docs/practice-guide.zh-CN.md#p04--把-project-trust-当作加载门不是-sandbox)。 | Resource Loading 与 OS Authority 被独立控制。               |
|  5 | [从可测试任务简报开始](docs/practice-guide.zh-CN.md#p08--以可测试的任务简报开始)。                                             | Goal、Scope、Constraint、Check 与 Handoff 明确。            |
|  6 | [写入前先勘察](docs/practice-guide.zh-CN.md#p09--先只读勘察再扩大能力)。                                                  | 第一轮绘制 Code Map，不修改文件。                                |
|  7 | [选择最小能力定制原语](docs/practice-guide.zh-CN.md#p11--选择满足需求的最小能力原语)。                                           | Prompt、Skill、Extension、Package、JSON、RPC 或 SDK 有明确理由。 |
|  8 | [使用诊断隔离阶梯](docs/practice-guide.zh-CN.md#p28--用隔离阶梯诊断)。                                                   | 一个受控变化能开关脱敏 Minimal Reproducer。                      |

阅读完整的[三十条实践指南](docs/practice-guide.zh-CN.md)；检查失败时使用
[故障排查手册](docs/troubleshooting.zh-CN.md)。

<!-- sync:root-operating -->

## 把 Pi 作为一个系统运行

可靠运行需要分别控制五个平面。一个平面通过，不代表另一个平面安全或正确。

| 控制平面   | 核心问题                                  | 最少证据                      |
| ------ | ------------------------------------- | ------------------------- |
| 意图与范围  | 授权了哪个可观察结果，明确排除了什么？                   | 含验收与停止条件的任务简报。            |
| 上下文与知识 | 哪些仓库指令、文件、Session 历史和模型可见输出真正相关？      | 已加载资源清单和有边界的上下文。          |
| 能力与权限  | 哪些工具/代码能执行，它们能访问哪些文件、进程、网络、凭据或外部系统？   | 风险等级、隔离决定和显式能力集合。         |
| 执行与状态  | 检查点、分支/Worktree、Session、重试、取消和清理由谁负责？ | 运行清单、恢复点和生命周期记录。          |
| 证据与质量  | 如何判断正确性、回归、安全、效率和可复现性？                | 已命名检查、结果、最终 Diff、残余风险和回滚。 |

[运行手册](docs/operating-playbook.zh-CN.md)把这些平面落实为八个阶段：任务接收、
基线、边界选择、只读勘察、计划、受控执行、分层验证，以及交付/清理。
[完整示例](docs/worked-example.zh-CN.md)展示已经填写的产物和失败分支，而不只是
空白模板。

以下风险等级用于路由任务，并不表示 Pi 会自动实施策略：

| 等级            | 典型任务                                   | 必需控制                                        |
| ------------- | -------------------------------------- | ------------------------------------------- |
| R0 — 观察       | 公开或合成数据、只读分析、不修改外部状态。                  | 显式只读工具、关闭不必要的 Session/资源、核验状态未变化。           |
| R1 — 可逆本地修改   | 在受信仓库中修改代码或文档。                         | 已知 Git 基线、受限写入、项目检查、Diff 审查和回滚。             |
| R2 — 高权限或外部影响 | 安装 Package、使用凭据、网络写入、Issue/PR/消息、共享环境。 | 受限测试身份、隔离试用、影响发生前人工复核、审计和清理。                |
| R3 — 破坏性或生产敏感 | 删除、生产修改、安全响应、受监管/私密数据、无人值守高权限工作。       | 专用隔离与策略、所有者明确批准、Dry Run/Canary、独立验证和演练过的恢复。 |

任务一旦升级到更高等级，应在检查点停止，取得新的边界与权限后再继续。
Project Trust、Prompt 措辞、Worktree 和工具名称白名单都不能替代 OS 或服务端控制。

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

<!-- sync:root-ecosystem-evidence -->

### 如何阅读生态地图

下方表格是有日期、已 Check-in 的研究地图，不是流行度排行或推荐列表。“属于生态”
表示不可变的一手证据能证明项目与 Pi 存在相关的技术或历史关系；不表示项目仍然
活跃、当前兼容、安全、持续维护或获得背书。

| 证据状态                             | 当前数量 | 实际已经确认的内容                                                | 采用时的含义                                               |
| -------------------------------- | ---: | -------------------------------------------------------- | ---------------------------------------------------- |
| 官方基础材料                           |    6 | 上游仓库、当前文档、Release、Example、Package Catalog 或 RFC Index。   | 仍须固定版本，并区分 Proposal、`main` 与 Stable Release。         |
| `source-reviewed` 社区项目           |   12 | 对固定 Ref 进行了有限审查，覆盖用途、源码、License、依赖、权限/数据流、Test、CI 与显著风险。 | 只是值得试用的线索；本仓库维护者没有安装或运行它们。                           |
| 延后处理的社区记录                        |    3 | 已检查到足以确认其混合、旧 Scope、缺 License、隐私阻塞，或必须逐项拆分。              | 不要把整个仓库视为一个原子能力或当前采用路径。                              |
| `preliminary-evidence-collected` |   13 | 固定证据确认了 Identity 及初步 Pi 关系；完整 Source-review Gate 尚未开始。   | 状态仍是 `awaiting-source-review`、`not-evaluated` 与不受信任。 |
| `hands-on-verified` / `featured` |    0 | 尚无第三方项目由具名人类完成可复现实测，并另经编辑晋级决定。                           | 当前有意不设置任何第三方正式推荐。                                    |

资源注册表采集于 **2026-07-31T15:56:32+08:00**；发现候选注册表采集于
**2026-08-01T15:28:59+08:00**。完整逐项地图见后文“社区审查队列”。较早材料仍可能
使用 `badlogic/pi-mono`、`earendil-works/pi-mono` 或
`@mariozechner/*`；执行前必须解析当前 Repository、Publisher/Scope、Peer
Dependency 与 Install Target。

<!-- sync:root-areas -->

## 实践领域

| 领域                      | 实践                                                             | 主要决策                                                        |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| Baseline 与 Recovery     | [P01–P02](docs/practice-guide.zh-CN.md#baseline-and-recovery)。 | 另一位使用者能否复现并安全回滚？                                            |
| Trust 与 Containment     | [P03–P06](docs/practice-guide.zh-CN.md#trust-and-containment)。 | 加载什么、什么能执行、它能访问什么？                                          |
| Task 与 Context Design   | [P07–P11](docs/practice-guide.zh-CN.md#任务与上下文设计)。              | 满足需求的最小 Context/Capability 是什么？                             |
| Session Operation       | [P12–P16](docs/practice-guide.zh-CN.md#任务执行中)。                 | Durable State 在哪里，什么有损或可分享？                                 |
| Model 与 Reliability     | [P17–P20](docs/practice-guide.zh-CN.md#模型provider-与可靠性)。       | 哪个 Provider/Model Behavior、Retry Owner 与 Output Bound 适用？   |
| Extension 与 Package     | [P21–P24](docs/practice-guide.zh-CN.md#extension-与-package)。   | Runtime Code 是否足以证明其 Lifecycle、Authority 与 Supply Chain 合理？ |
| Automation 与 Embedding  | [P25–P27](docs/practice-guide.zh-CN.md#自动化与嵌入)。                | 哪个 Process 承担 Policy、Session、Cancellation 与 Cleanup？        |
| Diagnosis 与 Maintenance | [P28–P30](docs/practice-guide.zh-CN.md#诊断升级与贡献)。               | Failure、Upgrade 与 Contribution 能否由人类核验？                     |

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

| 阅读材料                                                   | 用途                                                                                  |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [文档地图](docs/README.zh-CN.md)                           | 选择阅读路径，理解 Evidence Label。                                                           |
| [官方来源地图](docs/research/source-map.zh-CN.md)            | 用固定版本一手来源替换记忆/Search Snippet。                                                       |
| [证据台账](docs/research/evidence-ledger.zh-CN.md)         | 把 P01–P30 每条建议追溯到事实和明确标记的推论。                                                        |
| [研究方法](docs/research/methodology.zh-CN.md)             | 检查 Source Tier、Inclusion Gate、Scoring、AI Disclosure 与 Update Procedure。             |
| [发现协议](docs/research/discovery-protocol.zh-CN.md)      | 保存可重放搜索、Identity、Relationship、Disposition 与分层审查顺序。                                  |
| [精确查询日志](docs/research/query-log.zh-CN.md)             | 重跑带日期的 GitHub、Catalog、Registry、RFC、Source 与 Community-review Query。                 |
| [生态全景](docs/research/landscape.zh-CN.md)               | 查看带日期的 Project、Catalog、Issue Cluster、Directory 与 Opportunity Snapshot。              |
| [生态覆盖矩阵](docs/research/coverage-matrix.zh-CN.md)       | 查看全部官方/社区能力领域、证据状态、明确缺口与下一道 Gate。                                                   |
| [机器生成的覆盖摘要](docs/research/coverage-summary.zh-CN.md)   | 查看从已审查资源和发现候选推导的类别与架构计数。                                                            |
| [生态目录指南](docs/research/ecosystem-directories.zh-CN.md) | 在 Official、Curated、Automated、Synthesized 与 Historical Discovery Surface 之间选择。       |
| [Extension 审查](docs/extension-review.zh-CN.md)         | 审计 Identity、Install Script、Dependency、Authority、Lifecycle、Data Flow、Test 与 Removal。 |
| [术语表](docs/glossary.zh-CN.md)                          | 区分 Project Trust、Session Operation、Tool Limit、RPC、SDK 与 Containment。                |

稳定结论以 **v0.83.0**
`845d6ff1f6643aba440341cce877ce1c43ebbc39` 核验。发布后观察固定到
`main@9b50b046d328d589a81400d2e184175d0bf19734`，并标记为 `main-only`。

<!-- sync:root-queue -->

## 社区审查队列

本节把当前 Check-in 的完整决策地图直接放进 README。机器事实仍以资源注册表、
候选注册表、分类法和生成覆盖数据为准；更深的观察名单保存逐项目审查轨迹。这些
研究表中的条目不是正式 Awesome Item；除非未来晋级为 `featured`，否则不会获得
`resource:` Marker。

<!-- sync:root-queue-snapshot -->

### 状态快照

| 维度                                     | Check-in 状态                                                                         | 含义                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [资源注册表](data/resources.json)           | 28 条：6 条官方资源、7 条目录/相关资源、15 条社区记录。                                                   | 15 条社区记录分为 12 条 `source-reviewed` 和 3 条延后记录。                            |
| [发现候选](data/discovery-candidates.json) | 13 个；全部为 `preliminary-evidence-collected`、`awaiting-source-review`、`not-evaluated`。 | Identity 与 Pi 关系证据已固定；普通源码审查仍未完成。                                       |
| [机器分类法](data/practice-taxonomy.json)   | 25 类能力、11 种架构、13 种与 Pi 的关系。                                                         | Category 说明项目做什么，Architecture 说明如何运行，Relationship 说明如何连接 Pi。            |
| [覆盖数据](data/coverage-summary.json)     | 275 个“类别 × 架构”单元：82 个非空、42 个有源码审查证据、0 个有亲测证据。                                       | 一个项目可以占多个单元，因此 82 个非空单元不等于 82 个项目。                                      |
| 源码审查缺口                                 | 25 类中有 9 类没有任何 Primary/Secondary 源码审查代表；14 类没有源码审查 Primary 代表。                      | 14 个 Primary 缺口中有 5 个仅由 Secondary 覆盖；空白只表示本仓库没有 Check-in 证据，不证明生态中没有实现。 |
| 亲测与推荐状态                                | 25/25 类没有 Hands-on-verified 代表；第三方 Featured 条目为 0。                                  | 增加 Candidate Link 不能替代具名、可复现的人类实测。                                      |

下文 `P` 与 `S` 分别表示 Primary 和 Secondary Category Placement。除非明确
标为总数，否则计数可能重叠。

<!-- sync:root-queue-reviewed -->

### 已完成源码审查的社区项目——全部 12 项

以下项目在 **2026-07-31** 针对链接中的 Immutable Ref 通过了有限的 Source 与
Metadata Review。本仓库维护者没有安装或运行它们；在具名人类亲测前，它们仍是不
受信任的试用线索。入口、Test 与试用问题见[完整源码审查观察名单](docs/research/watchlist.zh-CN.md)。

| 项目与已审查证据                                                                                                                                                                                                          | 能力、架构及与 Pi 的关系                                                                                                  | 源码审查已确认的内容                                                                                  | 任何亲测前必须处理的关键边界                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Gondolin @ `29fa74d`](https://github.com/earendil-works/gondolin/tree/29fa74d802112f29c720990aced26165e0d57d84) · Apache-2.0 · macOS/Linux · Extensive Test、CI 通过                                                | P：VM/工具隔离；S：权限/护栏。OS/虚拟化边界 + 进程内 Example；官方相邻的 Pi Resource。                                                     | Micro-VM 隔离研究，包含具体 Pi Tool-routing Example 与较完整的安全/限制文档。                                    | Example 不是可安装 Pi Package；项目以 Read-write 挂载到 `/workspace`；QEMU、同用户进程和 DoS 是文档明确的 Non-goal。                                                        |
| [pi-subagents @ `89de10e`](https://github.com/nicobailon/pi-subagents/tree/89de10e4bc8895e7948704c38620a5b35ddcd17e) · MIT · Current Scope · Unit/Integration/E2E、CI 通过                                           | P：子代理/工作流；S：任务/目标循环、Git/审查。进程内扩展；Pi Package/Resource。                                                           | Subagent、Parallel、Chain、Background、Lifecycle 与 Worktree 编排模式。                               | Subprocess、Worktree 和 Tool Restriction 不是 OS 隔离；必须限定子代理 Tool/Model、环境继承、并发、成本、后台取消、持久状态和并行写。                                                     |
| [pi-crew @ `c694ebf`](https://github.com/baphuongna/pi-crew/tree/c694ebfd5d0f49d9479870d6919be4bbf9738291) · MIT · Current Scope · Unit/Integration/Package Test、CI Mixed                                         | P：子代理/工作流；S：任务/目标循环、Git/审查。进程内扩展 + 外部服务；Pi Package/Resource + Service/Infrastructure。                           | Durable Multi-agent Workflow、并行编排和可选 Worktree 隔离。                                           | 动态 `.dwf.ts` 运行未沙箱化 JS/TS；“Confirmation” Flag 不一定是人工批准；Unix Broker 与残留状态都需显式审查和清理。                                                               |
| [pi-mcp-adapter @ `6a3e840`](https://github.com/nicobailon/pi-mcp-adapter/tree/6a3e840219a49f9ae5350542b7a707aa1e83fedf) · MIT · Current Scope · Unit/OAuth/Conformance/Package Test、CI 通过                        | P：MCP 集成。进程内扩展 + 外部服务；Pi Package/Resource + Service/Infrastructure。                                             | Lazy-proxy 与 Direct MCP Path，覆盖 OAuth、Packaging、Protocol 与 Conformance。                     | MCP Server Command 与 Secret Resolver 以本地用户权限执行；共享 Multiplexer 会共享状态与凭据。每个 Server 都必须分别固定、审查和隔离。                                                  |
| [pi-web-access @ `c702b3b`](https://github.com/nicobailon/pi-web-access/tree/c702b3be11bfbc832489eb7cfe31d9bbbbb2cc27) · MIT · Current Scope · 有 Test、未观察到仓库 CI                                                   | P：网页搜索/抓取。进程内扩展 + 外部服务；Pi Package/Resource + Service/Infrastructure。                                            | 在一个 Package 中整合 Search、Fetch、Repository、PDF、YouTube 与 Local-video Workflow。                 | Query、URL、页面、视频和 Browser Cookie 可能进入多个 Provider/Fallback；必须逐 Provider 审查 Data Flow、Redirect/SSRF、Size Limit、Retention、Timeout 与 Offline Failure。 |
| [pi-agent-browser-native @ `211a012`](https://github.com/fitchmultz/pi-agent-browser-native/tree/211a012c9b199d758768e8ba729f35e11e661f65) · MIT · Pi `>=0.80.6` · Extensive Test、未观察到仓库 CI                       | P：已认证浏览器自动化；S：替代 UI/编辑器。进程内扩展 + 外部服务；Pi Package/Resource + Service/Infrastructure。                              | 在独立 `agent-browser` CLI 之上提供结构化 Pi Tool Surface，覆盖 Browser、Electron、Profile 与 Download。     | 可接触 Login State、Cookie、Clipboard、Download 和 Screenshot；项目配置 Trust-sensitive。只能使用专用 Test Profile，并核验 CLI/Version Pairing 与 Cleanup。               |
| [Plannotator @ `80065c8`](https://github.com/backnotprop/plannotator/tree/80065c84624e80bf60dc1ad862c17c3ea3f2bd80) · Root Apache-2.0；Pi Extension MIT OR Apache-2.0 · Pi `>=0.74.0` · CI 通过                      | P：人工审查/规划；S：Git/审查、Session Sharing。进程内扩展 + Frontend/Controller + 外部服务；对应三种 Pi 关系。                               | 为 Plan、Markdown/HTML 与 Code Diff 提供 Human-review Surface，并有 Pi Runtime Smoke Coverage。      | 可选分享会上传加密密文；加密不能消除 URL Fragment、History、Metadata、Endpoint 或 Retention 风险；敏感试用必须禁用分享。                                                             |
| [pi-hermes-memory @ `5aafe2c`](https://github.com/chandra447/pi-hermes-memory/tree/5aafe2ca04cb55b62204b159389c8381894038ce) · MIT · Current Scope · Unit/Check/Lint、CI 通过                                        | P：持久记忆；S：上下文优化。进程内扩展 + 外部服务；Pi Package/Resource + Service/Infrastructure。                                       | Cross-session Memory、SQLite 全文 Session Search 与 Procedural-memory Workflow。                 | 持久索引会延长隐私与 Stored Prompt Injection 的生命周期；Scanner 不完整、Native SQLite 有 ABI 风险，Model-based Consolidation 会读取并改写记忆。                                  |
| [pi-coding-agent for Emacs @ `df5ce0a`](https://github.com/dnouri/pi-coding-agent/tree/df5ce0a176ce634ccb4883042c415a74a5637c37) · GPL-3.0-only · Pi `>=0.79.1` · Unit/Integration/GUI/Lint、CI 通过                 | P：替代 UI/编辑器。RPC/JSON Consumer + Frontend/Controller；对应 RPC 与 Frontend 关系。                                       | 经过测试的 Pi RPC Emacs UI，也是 Headless Project-trust 的具体案例。                                      | 文档默认传递 `--approve`；未知仓库必须采用显式 Non-approving Policy，并分别决定 Context File 与共享 Auth Storage。                                                          |
| [pi-lens @ `a4baa3a`](https://github.com/apmantza/pi-lens/tree/a4baa3a94ecaf71f8af9f48ab27c8d7f6da8fdb2) · MIT · Current Scope · Install/Grammar/Tool Compatibility CI                                            | P：代码智能。进程内扩展 + 外部服务；Pi Package/Resource + Service/Infrastructure。                                               | Structured LSP、Lint、Formatting、AST/Tree-sitter 与可选扫描工具。                                     | Build/Lifecycle 可下载 Grammar/Tool，分析也可能修改文件；一项固定到 Pi 0.80.10 的 Compatibility Smoke 不能证明完整支持 v0.83.0。                                              |
| [braintrust-pi-extension @ `c8f1aea`](https://github.com/braintrustdata/braintrust-pi-extension/tree/c8f1aea1236f47c2681c0104be143b832bc9058c) · MIT · Recent-minor Matrix · Integration/Package/Compatibility CI | P：追踪/可观测性。进程内扩展 + 外部服务；Pi Package/Resource + Service/Infrastructure。                                            | 对 Session、Turn、Model Call、Tool 与 Compaction 进行 Tracing。                                     | 启用后可上传原始输入、规范化 Context、Output、Tool Argument 与 Tool Result；必须先完成分类、脱敏、采样、Retention/Deletion 与 Failure Isolation。                                  |
| [gentle-pi @ `3b6b3d2`](https://github.com/Gentleman-Programming/gentle-pi/tree/3b6b3d2183dbbc4d45b16a1a0f127728c0a2435c) · MIT · Current Scope · Unit/Package/Publish、CI 通过                                      | P：宽域运行层；S：Guardrail、Subagent、任务/目标循环。Package Suite + 进程内扩展 + 外部服务；Pi Package/Resource + Service/Infrastructure。 | Specification-driven Development、TDD、Review、Subagent 与 Local Authority/Policy Design 的宽域案例。 | `postinstall` 获取或构建 Native Runtime，当前 RDD Path 标记为 Unstable，Companion Surface 很大，Threat Model 排除恶意同用户进程替换。                                       |

<!-- sync:root-queue-deferred -->

### 延后处理的社区记录——全部 3 项

延后记录已经过足够检查，可以指出明确阻塞条件，但不计入 Source-review Evidence。

| 项目与已审查证据                                                                                                                                                    | 能力与形态                                                                                                                 | 保留原因                                                       | 阻塞条件与重新开启 Gate                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [pi-extensions @ `60d70f2`](https://github.com/tmustier/pi-extensions/tree/60d70f24825446205c45e89f98813688e52823f3) · MIT · `collection-needs-item-review` | P：Package Suite/Alternate Distribution；S：UI/Statusline/Accessibility、Theme、Prompt Pack。Package Suite + 进程内 Extension。 | 混合集合中可能存在单独有价值的 Extension。                                 | 它不是一个 Atomic Capability；Test/CI 因子目录而异，部分文档保留旧链接。只能按单项 Review 重新开启。                       |
| [pi-skills @ `90bb51c`](https://github.com/badlogic/pi-skills/tree/90bb51cae36515a648515b633a81c0c6efc8c74d) · MIT · `legacy-scope`                         | P：单项 Skill；S：Browser 与 Web Access。Resource-only + 外部服务。                                                               | Browser、Google Service、Transcription 与 API Workflow 的历史案例。 | 旧 `@mariozechner/*` 指引、异质高权限能力且未观察到 Test/CI；每个 Skill 都需要迁移与独立权限审查。                        |
| [pi-share-hf @ `21c1d96`](https://github.com/badlogic/pi-share-hf/tree/21c1d9629187b553a2d59f26c5ef28eb33bb4e70) · `NOASSERTION` · `blocked`                | P：Session Export/Sharing/Publishing。进程内扩展 + 外部服务。                                                                     | 具有多阶段 Redaction 的历史 Session-sharing Flow。                  | 未检测到 License、旧 Scope、未观察到 Test/CI，且有意上传到 Public Hugging Face；Scanner 与模型审查不能证明所有私密内容均被移除。 |

<!-- sync:root-queue-candidates -->

### 初步发现候选——全部 13 项

每一行的状态都是 `preliminary-evidence-collected`、
`awaiting-source-review` 与 `not-evaluated`。所有仓库在快照时声明了 MIT
Metadata，但 License Scope 本身尚未通过 Source-review Gate。下方 28 个 Evidence
Link 全部不可变；它们只能证明表中陈述的关系。

| 候选与固定证据                                                                                                                                                                                                                                                                                                                                    | 能力与架构                                                                                                  | 有证据支持的 Pi 关系                                                                                                    | Source Review 前仍未解决                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [OpenClaw](https://github.com/openclaw/openclaw) · Alias：Warelay、Clawdbot、Moltbot · npm `openclaw` · [下方五段证据链](#为何-openclaw-属于本生态地图)                                                                                                                                                                                                       | P：远程控制/消息/协作；S：宽域运行层、Package Suite。Frontend/Controller + Derived/Internalized Runtime + Package Suite。 | Pi Package Consumer + Historical SDK Embedder + Frontend/Controller + Derived/Internalized-from-Pi。             | 当前 Scope、兼容性、权限、数据流、Test、维护与完整 License Boundary；没有“当前兼容 Pi v0.83”的结论。                                     |
| [oh-my-pi](https://github.com/can1357/oh-my-pi) · npm `@oh-my-pi/pi-coding-agent` · [身份](https://github.com/can1357/oh-my-pi/blob/fcf6d65140a1d53a55de3edb0d413bd2b8433bb0/README.md) · [Manifest](https://github.com/can1357/oh-my-pi/blob/fcf6d65140a1d53a55de3edb0d413bd2b8433bb0/packages/coding-agent/package.json)                   | P：Package Suite/Alternate Distribution；S：替代 UI。Frontend + Fork + Derived Runtime + Suite。              | Pi Fork，发布自己的 Terminal、SDK、RPC、Native ACP 与 `@oh-my-pi/*` Family；这些是 Fork 自有 Surface，不证明通过上游 SDK/RPC/ACP 消费 Pi。 | 继承与独立行为、分歧、兼容性、权限、Test 与维护。                                                                               |
| [Senpi](https://github.com/code-yeongyu/senpi) · npm `@code-yeongyu/senpi` · [身份](https://github.com/code-yeongyu/senpi/blob/f4705697bb63e880140d9d885fe5bd5540b52d77/README.md) · [Manifest](https://github.com/code-yeongyu/senpi/blob/f4705697bb63e880140d9d885fe5bd5540b52d77/packages/coding-agent/package.json)                      | P：Package Suite/Alternate Distribution；S：替代 UI。Frontend + Fork + Derived Runtime。                      | pi-mono Fork/Rebrand，并作为 Dori 的 Coding-agent Runtime。                                                           | 精确 Fork Point、独立改动、当前上游关系、兼容性、风险、Test 与维护。                                                                |
| [piclaw](https://github.com/rcarmo/piclaw) · [Workspace 说明](https://github.com/rcarmo/piclaw/blob/4de5e92aa96bdf809de772e68da767c2eb4957dd/README.md) · [Pi 0.83 Manifest](https://github.com/rcarmo/piclaw/blob/4de5e92aa96bdf809de772e68da767c2eb4957dd/package.json)                                                                    | P：替代 UI/编辑器；S：远程控制/协作。SDK Embedder + Frontend/Controller。                                              | 自托管 Web Workspace；固定 Manifest 直接依赖 Pi 0.83.0 的四个 Package。                                                       | Authentication、Process/Session Lifecycle、Data Boundary、实际兼容性、Test 与 Cleanup。                              |
| [pi-vscode-extension](https://github.com/Zetaphor/pi-vscode-extension) · [身份](https://github.com/Zetaphor/pi-vscode-extension/blob/526df5ead8e0104ea5d176bb5e6fa25e6d75844a/README.md) · [Session 构建](https://github.com/Zetaphor/pi-vscode-extension/blob/526df5ead8e0104ea5d176bb5e6fa25e6d75844a/src/pi/session.ts)                     | P：替代 UI/编辑器。SDK Embedder + Frontend/Controller。                                                        | VS Code Frontend，在 Editor Extension 内导入 Pi API 并构建 Agent Session。                                               | Project Trust、Editor Authority、Session Lifecycle、Cancellation、Compatibility 与 Cleanup。                    |
| [pi-vscode](https://github.com/pithings/pi-vscode) · 历史 Alias `pi0/pi-vscode` · [身份](https://github.com/pithings/pi-vscode/blob/8761b3ccf99bf5b7bc7e3631c508e1dd164b0e2c/README.md) · [RPC Spawn](https://github.com/pithings/pi-vscode/blob/8761b3ccf99bf5b7bc7e3631c508e1dd164b0e2c/src/pi.ts)                                           | P：替代 UI/编辑器。RPC/JSON Consumer + Frontend/Controller。                                                   | VS Code Bridge，以 RPC Mode 启动 Pi，并把 Frontend 连接到该进程。                                                             | Redirect Lineage、Project Trust、Process Lifecycle、Cancellation、Compatibility 与 Cleanup。                    |
| [pi-acp](https://github.com/svkozak/pi-acp) · npm `pi-acp` · [协议说明](https://github.com/svkozak/pi-acp/blob/d1cffc047ab37a096ee70ca39cfc1de463db8d12/README.md) · [RPC Process](https://github.com/svkozak/pi-acp/blob/d1cffc047ab37a096ee70ca39cfc1de463db8d12/src/pi-rpc/process.ts)                                                      | P：替代 UI/编辑器。RPC/JSON Consumer + ACP Consumer。                                                          | 启动 Pi RPC，并通过 stdio 映射到 ACP，供 Zed 等 Client 使用。                                                                  | Protocol Completeness、Authorization、Cancellation、Error Mapping、Child Supervision、Compatibility 与 Cleanup。 |
| [acpx](https://github.com/openclaw/acpx) · npm `acpx` · [Agent Mapping](https://github.com/openclaw/acpx/blob/504040facb1992453cf16a2a096a1094fc4e48d4/src/agent-registry.ts) · [Manifest](https://github.com/openclaw/acpx/blob/504040facb1992453cf16a2a096a1094fc4e48d4/package.json)                                                    | P：替代 UI/编辑器。ACP Consumer + Frontend/Controller。                                                        | 间接的 `acpx → pi-acp → Pi` 关系；不是直接 Pi SDK Embedder。                                                               | 间接依赖与 Protocol Boundary、Authorization、Lifecycle、Compatibility、Test 与维护。                                   |
| [pi-coding-agent-action](https://github.com/shaftoe/pi-coding-agent-action) · [Action 入口](https://github.com/shaftoe/pi-coding-agent-action/blob/1bd7b89a7e1943cb1cf01f2f8b61e2108e0224c1/action.yml) · [Pi 0.82.1 Manifest](https://github.com/shaftoe/pi-coding-agent-action/blob/1bd7b89a7e1943cb1cf01f2f8b61e2108e0224c1/package.json) | P：Git/审查自动化。SDK Embedder。                                                                              | GitHub/Forgejo Action，直接嵌入 Pi Coding-agent、AI、Agent-core 0.82.1。                                                | Token Scope、Checkout Mutation、Remote Write、Approval、Rollback、Failure Isolation 与当前兼容性。                    |
| [Polpo](https://github.com/pugliatechs/polpo) · [远程控制说明](https://github.com/pugliatechs/polpo/blob/ad8e1bd0cdc8b491a64aede27a1a97c0ac41d477/README.md) · [RPC Launcher](https://github.com/pugliatechs/polpo/blob/ad8e1bd0cdc8b491a64aede27a1a97c0ac41d477/src/agent/pi-agent.js)                                                          | P：远程控制/消息/协作；S：替代 UI。RPC/JSON Consumer + Frontend/Controller。                                          | 面向手机的 Remote Controller，通过 RPC 启动并连接 Pi。                                                                        | Identity、Authorization、Replay Resistance、Disconnect、Retention、Process Cleanup 与 Compatibility。            |
| [pi-nvim](https://github.com/carderne/pi-nvim) · npm `pi-nvim` · [Extension 入口](https://github.com/carderne/pi-nvim/blob/fbc6f12652234f03d2fe729adbcc3ff61ca7d39a/extension.ts)                                                                                                                                                            | P：替代 UI/编辑器。进程内扩展 + Frontend/Controller。                                                               | 由 Pi 加载的 Extension，打开 Unix JSON Socket 供 Neovim Frontend 使用；不构建 `AgentSession`，不是 SDK Runtime Embedder。         | Buffer/Editor Authority、Project Trust、Socket/Process Lifecycle、Cancellation、Compatibility 与 Cleanup。      |
| [pi-mobile](https://github.com/p1rallels/pi-mobile) · [产品说明](https://github.com/p1rallels/pi-mobile/blob/4cc9b712254d84c90a00373c972c8a417fd26fb9/README.md) · [Session Runtime](https://github.com/p1rallels/pi-mobile/blob/4cc9b712254d84c90a00373c972c8a417fd26fb9/src/session-runtime.ts)                                              | P：替代 UI/编辑器；S：远程控制/协作。SDK Embedder + Frontend/Controller。                                              | Web/Mobile Frontend；固定 Runtime 直接构建并管理 Pi Agent Session。                                                        | Authentication、Transport Authorization、Retention、Disconnect、Compatibility、Test 与 Cleanup。                 |
| [my-pi](https://github.com/spences10/my-pi) · npm `my-pi` · [Suite 说明](https://github.com/spences10/my-pi/blob/c0bca00ef69c20c2192d7457827b45e3d3d401bb/README.md) · [Session API](https://github.com/spences10/my-pi/blob/c0bca00ef69c20c2192d7457827b45e3d3d401bb/src/api.ts)                                                            | P：Package Suite/Alternate Distribution；S：MCP、代码智能、Evals、宽域运行层。SDK Embedder + Fork + Suite。             | Pi SDK Wrapper/Alternate Distribution，覆盖 MCP、LSP、Team 与 Evaluation-telemetry Surface。                           | 每个 Bundled Artifact 的权限、数据流、行为、兼容性、Test 与维护；目前不能作 Suite-level 结论。                                         |

<!-- sync:root-queue-openclaw -->

#### 为何 OpenClaw 属于本生态地图

OpenClaw 已明确纳入初步候选层。证据支持其历史 SDK 嵌入、保留的 Pi Provenance
及后续 Runtime Internalization；证据**不表示**当前 OpenClaw 仍嵌入上游 Runtime，
也不支持“当前兼容 Pi v0.83.0”的结论。

1. 固定的[命名历史](https://github.com/openclaw/openclaw/blob/a2b97cc950f49f5194c64a58fe24c9eb38d640ce/docs/start/lore.md)记录 Warelay → Clawdbot → Moltbot → OpenClaw。
2. 历史 [Pi 集成文档](https://github.com/openclaw/openclaw/blob/99b27cde64d6616a9e41f52f4a699577cf60f1d6/docs/pi.md)描述通过 `AgentSession` 直接集成 Coding-agent、AI、Agent-core 与 TUI。
3. 固定的[来源声明](https://github.com/openclaw/openclaw/blob/a2b97cc950f49f5194c64a58fe24c9eb38d640ce/THIRD_PARTY_NOTICES.md)记录部分代码改编自 Pi/pi-mono，并保留 Pi TUI 依赖。
4. [内部化迁移](https://github.com/openclaw/openclaw/commit/bb46b79d3c1479f194a90afcf3dd69a1858a7898)引入 OpenClaw 自有 Agent Core、移除原 Pi Runtime Layout，同时保留第三方来源。
5. 固定的[根 Manifest](https://github.com/openclaw/openclaw/blob/a2b97cc950f49f5194c64a58fe24c9eb38d640ce/package.json)使用 npm Identity `openclaw`，并保留 `@earendil-works/pi-tui` 0.82.1。

仅靠名称或当前依赖搜索很容易漏掉这类项目：当前名称不含 Pi、经历过三个旧名称，
且关系已从 Direct Embed 演化为 Derived/Internalized Lineage。原始 13 条线索搜索
是重建且不可重放的，因此这些只是合理的遗漏机制，不是对某个历史唯一原因的断言。

<!-- sync:root-queue-coverage -->

### 能力覆盖与缺口——全部 25 类

全部类别仍然缺少 Hands-on Evidence。`P`/`S` 保留 Primary 与 Secondary 区别；
Deferred Record 不会增加 Source-review Coverage，初步候选也不算 Reviewed
Evidence。

| 能力类别          | 已完成源码审查的代表                                | 延后记录             | 初步候选                                                                                               | 下一步证据缺口                                           |
| ------------- | ----------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| VM/工具隔离       | Gondolin（P）                               | —                | —                                                                                                  | 人工实测。                                             |
| 权限与护栏         | Gondolin（S）、gentle-pi（S）                  | —                | —                                                                                                  | Primary 代表与人工实测。                                  |
| 子代理与工作流编排     | pi-subagents（P）、pi-crew（P）、gentle-pi（S）   | —                | —                                                                                                  | 对不同编排形态分别亲测。                                      |
| MCP 集成        | pi-mcp-adapter（P）                         | —                | my-pi（S）                                                                                           | 人工实测；Suite Candidate 仍需源码审查。                      |
| 网页搜索与抓取       | pi-web-access（P）                          | pi-skills（S）     | —                                                                                                  | Data-flow 人工实测。                                   |
| 浏览器与已认证配置自动化  | pi-agent-browser-native（P）                | pi-skills（S）     | —                                                                                                  | 专用 Profile 人工实测。                                  |
| 人工审查与规划       | Plannotator（P）                            | —                | —                                                                                                  | Local/Share-disabled 人工实测。                        |
| 代码智能          | pi-lens（P）                                | —                | my-pi（S）                                                                                           | 人工实测；Suite Candidate 仍需源码审查。                      |
| 持久记忆          | pi-hermes-memory（P）                       | —                | —                                                                                                  | 隐私、Retention 与 Prompt-injection 人工实测。             |
| 追踪与可观测性       | braintrust-pi-extension（P）                | —                | —                                                                                                  | 脱敏、Retention 与 Failure-isolation 人工实测。            |
| 替代 UI 与编辑器集成  | Emacs Frontend（P）、browser-native（S）       | —                | piclaw（P）、两个 VS Code 项目（P）、pi-acp（P）、acpx（P）、pi-nvim（P）、pi-mobile（P）、oh-my-pi（S）、Senpi（S）、Polpo（S） | 按 Integration Form 完成候选源码审查，再亲测。                  |
| 宽域运行层         | gentle-pi（P）                              | —                | OpenClaw（S）、my-pi（S）                                                                               | 选定范围亲测；两个候选均需源码审查。                                |
| 上下文优化         | pi-hermes-memory（S）                       | —                | —                                                                                                  | Primary 代表与人工实测。                                  |
| 任务、目标与循环工程    | pi-subagents（S）、pi-crew（S）、gentle-pi（S）   | —                | —                                                                                                  | Primary 代表与人工实测。                                  |
| UI、状态栏、通知与无障碍 | —                                         | pi-extensions（S） | —                                                                                                  | 拆分集合、源码审查，再亲测。                                    |
| 主题与主题工具       | —                                         | pi-extensions（S） | —                                                                                                  | 拆分集合、源码审查，再亲测。                                    |
| 提示模板包         | —                                         | pi-extensions（S） | —                                                                                                  | 拆分集合、源码审查，再亲测。                                    |
| 单项技能          | —                                         | pi-skills（P）     | —                                                                                                  | 迁移并逐项审查 Skill，再亲测。                                |
| 自定义提供商与模型网关   | —                                         | —                | —                                                                                                  | 发现可信公开线索、源码审查与人工实测。                               |
| 本地模型运行时       | —                                         | —                | —                                                                                                  | 发现可信公开线索、源码审查与人工实测。                               |
| 远程控制、消息与协作    | —                                         | —                | OpenClaw（P）、Polpo（P）、piclaw（S）、pi-mobile（S）                                                        | 按 Trust/Transport Model 源码审查，再亲测。                 |
| 包套件与替代发行版     | —                                         | pi-extensions（P） | oh-my-pi（P）、Senpi（P）、my-pi（P）、OpenClaw（S）                                                          | 审查继承与独立行为，再亲测。                                    |
| Git 与审查自动化    | pi-subagents（S）、pi-crew（S）、Plannotator（S） | —                | pi-coding-agent-action（P）                                                                          | 在候选之外补 Primary Source Review，再进行 Remote-write 亲测。 |
| 评测与基准测试       | —                                         | —                | my-pi（S）                                                                                           | 源码审查独立 Eval Slice/代表，再完成实测验证。                     |
| 会话导出、分享与发布    | Plannotator（S）                            | pi-share-hf（P）   | —                                                                                                  | 活跃 Primary 代表与隐私人工实测。                             |

按 Primary + Secondary Placement 计算，16 类有 Source-review Evidence，9 类
没有；这 9 类中 3 类已有 Candidate，6 类没有 Active Candidate，但其中 4 类保留
Deferred Material。候选 Primary Placement 高度集中：7 个替代 UI/编辑器、3 个
Package Suite/Distribution、2 个 Remote/Collaboration、1 个 Git/Review；这不是
25 类能力的均匀样本。

<!-- sync:root-queue-architectures -->

### 架构层次——全部 11 种

Architecture 描述项目如何执行或组合。一个项目可以占多行，因此计数不能相加为
Project Total。

| 架构                           | Source-reviewed 记录 | 初步候选 | 运行边界                                                                                                           |
| ---------------------------- | -----------------: | ---: | -------------------------------------------------------------------------------------------------------------- |
| Resource-only                |                  0 |    0 | 声明式 Prompt、Theme、Template 或 Skill 仍会影响模型/工具使用；当前案例属于 Deferred，而非 Reviewed。                                     |
| In-process Extension         |                 11 |    1 | 代码以 Pi Process User 的 File、Process、Credential 与 Network Authority 运行。                                          |
| SDK Embedder                 |                  0 |    5 | Host 拥有 Policy、Session、Tool、Credential、Cancellation、Subscription、Persistence 与 Cleanup。                        |
| RPC/JSON Consumer            |                  1 |    3 | Controller 拥有 Subprocess Startup、Protocol Framing、stderr Drain、Event Handling、Cancellation、Restart 与 Shutdown。 |
| ACP Consumer                 |                  0 |    2 | Adapter/Client 增加 Protocol Mapping、Authorization、Capability、Error、Cancellation 与 Lifecycle Boundary。           |
| Frontend/Controller          |                  2 |   10 | Editor、Web、Mobile、Messaging 或 Remote UI Policy 决定谁能查看并控制 Pi-backed Session。                                    |
| External Service             |                  9 |    0 | Credential、Outbound Data、Tenancy、Retention、Availability、Backpressure 与 Deletion 超出本地进程。                        |
| OS/Virtualization Boundary   |                  1 |    0 | Containment 取决于 Mount、Network、Secret、Host Process、Reset 与明确的 Threat-model Exclusion。                           |
| Fork/Alternate Distribution  |                  0 |    3 | 必须区分 Identity、继承与改变的行为、Package Scope、Update Path 及与上游的分歧。                                                      |
| Derived/Internalized Runtime |                  0 |    3 | 即使上游 Runtime Dependency 消失，历史 Provenance 仍可能保留；继承的结论必须重新验证。                                                    |
| Package Suite                |                  1 |    3 | 每个 Bundled Executable/Resource 及组合权限都需审查；一个安全组件不能验证整个 Suite。                                                   |

<!-- sync:root-queue-relations -->

### 与 Pi 的关系类型——全部 13 种

Relationship 解释项目为何属于 Pi 生态地图，不代表质量或兼容性。关系可以重叠，
后续 Internalization 或改名也不会抹除历史 Provenance。

| 与 Pi 的关系                       | Source-reviewed 记录 | 初步候选 | 含义                                                                        |
| ------------------------------ | -----------------: | ---: | ------------------------------------------------------------------------- |
| Pi Package 或 Resource          |                 11 |    2 | 由 Pi Extension/Resource System 加载、为其分发或直接围绕它构建。                           |
| SDK Embedder                   |                  0 |    5 | 在另一应用内构建 Pi Session 或导入 Pi Runtime API。                                   |
| Historical SDK Embedder        |                  0 |    1 | Immutable 历史证据显示曾直接嵌入 SDK，但不一定仍是当前关系。                                     |
| Pi Package Consumer            |                  0 |    1 | 消费至少一个 Pi Package，但不一定嵌入完整的当前 Runtime。                                    |
| RPC/JSON Consumer              |                  1 |    3 | 启动或消费 Pi CLI Protocol/Event Surface。                                      |
| ACP Consumer                   |                  0 |    2 | 直接或通过 Bridge 连接 ACP。                                                      |
| Frontend 或 Controller          |                  2 |   10 | 展示或远程控制 Pi-backed User/Session Surface。                                   |
| Fork 或 Alternate Distribution  |                  0 |    3 | 重新发布、改名或实质性重新分发 Pi-derived Code/Behavior。                                 |
| Derived 或 Internalized from Pi |                  0 |    3 | 在 Internalize 或改变 Runtime Boundary 后仍保留 Pi-derived Code/Provenance。       |
| Service 或 Infrastructure       |                  9 |    0 | 为 Pi Workflow 增加外部/本地 Service、Broker、Backend 或 Infrastructure Dependency。 |
| Official-adjacent              |                  1 |    0 | 由上游组织维护或作为相邻 Reference 提供，但不属于 Pi Core。                                   |
| Historical 或 Archived          |                  0 |    0 | 记录 Legacy/Retired 关系；当前实例均为 Deferred，不增加 Reviewed/Candidate Count。        |
| Indirect Consumer              |                  0 |    1 | 通过另一 Adapter/Dependency 接触 Pi，而不是直接 Embed 或 Launch。                       |

<!-- sync:root-queue-directories -->

### Catalog、目录与历史语境

官方 Catalog 与四个当前相关目录是导航入口，不是质量或兼容性 Oracle。在带日期的
2026-07-31 快照中，Catalog 报告 5,351 个 Package，以及互相重叠的 3,059 个
Extension、360 个 Skill、109 个 Theme、78 个 Prompt Filter；这些 Filter 数不能
相加。

| 入口                                                                                | 注册表状态           | 合适用途                                                         | 边界                                                                               |
| --------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Pi Package Catalog                                                                | 官方 Discovery    | 广泛发现 Package。                                                | Catalog 收录不等于 Source、License、Safety、Maintenance、Compatibility 或 Hands-on Review。 |
| awesome-pi                                                                        | 当前 Related List | 活跃、双语、人工策展的 Package/Resource 导航。                             | Discovery Scope 不同于证据化运行实践。                                                      |
| awesome-pi-coding-agent                                                           | 当前 Related List | 自动、频繁更新、偏广度的导航。                                              | 自动发现和生成描述不是人工实测。                                                                 |
| Pi Package Index                                                                  | 当前 Related List | 每日 npm Metadata、Maintenance Signal、Search 与 Public JSON API。 | 非官方 Metadata 与 Popularity/Maintenance Signal 不构成背书。                              |
| pi-ecosystem-wiki                                                                 | 当前 Related List | Architecture、Comparison 与 Ecosystem Synthesis。               | Secondary/Generated Claim 在回查一手来源前仍只是线索。                                         |
| [awesome-pi-agent](https://github.com/qualisero/awesome-pi-agent)                 | Archived 历史语境   | 理解较早目录与命名入口。                                                 | 已明确 Retired/Outdated，不能用于当前 Compatibility。                                       |
| [Traveler0014/awesome-pi-agent](https://github.com/Traveler0014/awesome-pi-agent) | 已拒绝作为当前目录       | Schema-backed Catalog Design 参考。                             | Scheduled Metadata Update 失败，内容未越过六月初始快照。                                        |
| [awesome-pi-mono](https://github.com/afoofaa/awesome-pi-mono)                     | 已拒绝作为当前目录       | 早期 Manual Taxonomy/Directory 语境。                             | 五月 Seed 后没有实质更新，持续维护未得到证明。                                                       |

<!-- sync:root-queue-limits -->

### 发现边界与可能仍然遗漏的范围

以上标题中的“全部”是指当前仓库已 Check-in 的全部记录，不是所有现实中存在的
Pi 相关项目。

| 盲区                                            | 真实项目可能缺席的原因                                                                                      | 当前处理与残余限制                                                                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 初始批次不可重放                                      | 历史 13 条线索搜索没有保存原始 Query、Ranking、Page、Duplicate、Rejected Result、Failure 或 Pre-filter Denominator。 | 运行被如实标记为 `reconstructed-non-replayable`、Truncated 与 Incomplete；不能支持“生态完整”结论。                                                               |
| 当前 Probe 有界                                   | 配置了 9 个 GitHub Query Family——6 个 Code、3 个 Repository；每个只读第一页，最多 50 条。                            | 保存 Limit、Truncation、Error、Attempt 与 Disposition；低排名或使用不同措辞的项目仍可能遗漏。                                                                        |
| Code-search Authentication                    | Repository-scoped 默认 Actions Token 不提供本项目使用的独立 Public Code-search Context。                       | Repository Search 运行；除非配置 Public-only `DISCOVERY_SEARCH_TOKEN`，6 个 Code Search 都以 0 Attempt 明确记为 `skipped`。                                |
| 仅搜索 GitHub                                    | 其他 Forge、个人网站、仅文档产品、Binary 或 Registry-only Package 可能没有可发现的 GitHub Repository。                   | Catalog、Registry、Directory 与 Referral Cross-check 能缓解，但不能使覆盖完整。                                                                            |
| Private/Internal/Visibility Ambiguous         | 发布这些 Identity 可能泄露信息或污染公开计数。                                                                     | Probe Fail Closed，并清除受影响整条 Query 的 Identity/Count；这些项目有意不进入 Public Artifact。                                                               |
| Rename、Move、Fork、Delete 与 Internalize         | Canonical URL 和当前 Dependency Name 会隐藏历史 Alias、Redirect、Provenance 与独立 Fork。                      | 保存 Alias、Package Identity、Immutable Evidence 与显式 Relationship Type；未知 Lineage 仍可能存在。                                                       |
| Search Vocabulary、Language、Ranking 与 Indexing | 产品可能不含“Pi”、使用其他语言、间接调用 Protocol，或排在第一页之后。                                                        | Query 覆盖 Package Symbol、RPC String、Provenance 与 Product Term，但有限 Vocabulary 不可能完整。                                                         |
| Registry/Manifest 形态差异                        | 相关 Import 可能只在 Lockfile、Generated File、Monorepo Subdirectory、其他语言或未公开 Source Archive 中。          | Source Review 时解析 Publisher、Artifact、Repository、Ref 与 Install Target；当前 Query 不覆盖所有形态。                                                     |
| Dynamic Compatibility                         | Pi、Node/Bun、Package Scope、Provider、Terminal、Platform 与 External Service 可独立变化。                   | 固定 Snapshot，并把 Relationship、Source Review、Hands-on Verification 与 Recommendation 分成不同 Claim。                                               |
| Evidence 不均衡                                  | 候选集中在 Frontend、SDK Embedder、Fork 与 Suite；另有 6 类既无 Reviewed Evidence，也无 Active Candidate。         | 优先发现 Custom Provider/Model Gateway、Local-model Runtime、UI/Statusline/Accessibility、Theme、Prompt Pack 与 Individual Skill，同时不能隐藏所有类别都缺亲测的事实。 |

### 晋级 Gate

目前有意**不设置任何第三方正式精选条目**。晋级需要具名人类 Reviewer、
Immutable Artifact、Relationship Disclosure、Isolated Trial、精确
Environment/Command、Expected/Actual Result、Negative Case、Cleanup/Rollback、
Residual Risk、双语事实审查与 Expiration/Retest Trigger。Star、Download、
Catalog Presence、Passing CI、Declared License Metadata 或 Source Review 都不能
替代这些步骤。

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

策展/源码审查快照：**2026-07-31，Asia/Singapore**。发现候选快照：
**2026-08-01，Asia/Singapore**。Dynamic Count、Package Metadata、Provider
Behavior 与 `latest` Documentation 可能已经变化。

中央 Awesome 项目的
[列表创建指南](https://github.com/sindresorhus/awesome/blob/main/create-list.md)与
[当前 PR 模板](https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md)
拒绝 AI-generated List 与 Fully AI-generated PR。本透明研究预览必须先产生实质
Human Testing、Selection、Rewriting、Bilingual Review，并达到要求的公开维护
时间，才能诚实地声称具备中央列表申请资格。
