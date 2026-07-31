[English](./evidence-ledger.md) | [简体中文](./evidence-ledger.zh-CN.md)

# 实践证据台账

<!-- sync:evidence-scope -->

本台账把上游事实与本仓库建议分开。除非条目另有说明，稳定来源均固定到 Pi
v0.83.0 的 commit `845d6ff1f6643aba440341cce877ce1c43ebbc39`。“推论”
表示建议步骤是本仓库的综合判断，不是 Pi 内建保证。

| 标签 | 含义 |
| --- | --- |
| 一手来源 | Pi 仓库、Tag 源码或 Pi 官方文档。 |
| 一手示例 | Pi 仓库随附的示例代码，不代表核心功能保证。 |
| 社区 | 第三方公开来源。 |
| 推论 | 从所引事实和通用工程控制导出的实践。 |

<!-- sync:evidence-claims -->

## 实践论据

<!-- sync:E01 -->

### E01

- **支持：**[P01](../practice-guide.zh-CN.md#p01--固定并记录执行环境)。
- **事实：**Pi 暴露 Version、Provider/Model、Thinking、Transport、Tool 与
  Resource 相关 CLI/配置输入；模型目录可以独立刷新。
- **来源：**[v0.83.0 coding-agent README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)、
  [models](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/models.md)
  与 [settings](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md)。
- **状态：**一手事实 + 可复现性推论。

<!-- sync:E02 -->

### E02

- **支持：**[P02](../practice-guide.zh-CN.md#p02--从可恢复的版本控制状态开始)。
- **事实：**上游提供 Dirty-repository Guard 和 Git Checkpoint 示例，证明风险与
  Extension Pattern 存在，但两者都不是内建默认行为。
- **来源：**[dirty-repo-guard.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/dirty-repo-guard.ts)
  与 [git-checkpoint.ts](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/git-checkpoint.ts)。
- **状态：**一手示例 + 版本控制推论。

<!-- sync:E03 -->

### E03

- **支持：**[P03](../practice-guide.zh-CN.md#p03--用-os-边界隔离不可信或无人值守工作)。
- **事实：**Pi 继承启动用户权限，没有内建 Sandbox；官方建议对不可信或无人监控
  工作使用隔离环境。
- **来源：**[security](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
  与 [containerization](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/containerization.md)。
- **状态：**一手来源。

<!-- sync:E04 -->

### E04

- **支持：**[P04](../practice-guide.zh-CN.md#p04--把-project-trust-当作加载门不是-sandbox)。
- **事实：**Project Trust 只控制受保护项目资源，不是 Sandbox。Context File
  除非关闭否则独立加载；非交互 Override 和重启行为都有文档。
- **来源：**[security](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
  与 [settings](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md)。
- **状态：**一手来源。

<!-- sync:E05 -->

### E05

- **支持：**[P05](../practice-guide.zh-CN.md#p05--最小化凭据挂载和网络可达范围)。
- **事实：**官方隔离指南明确建议最少挂载、凭据、环境变量和网络访问，并在把结果
  复制回可信系统前审查。
- **来源：**[security: running untrusted work](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
  与 [containerization](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/containerization.md)。
- **状态：**一手事实 + 最小权限推论。

<!-- sync:E06 -->

### E06

- **支持：**[P06](../practice-guide.zh-CN.md#p06--引入-package-前审查固定并隔离试用)。
- **事实：**Package 可包含可执行/资源材料；项目 Package 在信任后可安装；Git Ref
  可固定；Reconciliation 可运行 npm 依赖安装。
- **来源：**[packages](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)
  与 [security](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)。
- **状态：**一手事实 + 供应链推论。

<!-- sync:E07 -->

### E07

- **支持：**[P07](../practice-guide.zh-CN.md#p07--让分层上下文简洁可审查)。
- **事实：**Pi 从全局和项目路径发现分层 `AGENTS.md`/`CLAUDE.md`，并提供关闭
  加载的 Flag。
- **来源：**[coding-agent README: context files](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)
  与 [SDK context example](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/sdk/07-context-files.ts)。
- **状态：**一手事实 + Context Design 推论。

<!-- sync:E08 -->

### E08

- **支持：**[P08](../practice-guide.zh-CN.md#p08--以可测试的任务简报开始)。
- **事实：**Pi 机制无法从规格不足的 Prompt 中可靠推断用户验收边界。
- **来源：**本仓库[任务简报模板](../../templates/task-brief.zh-CN.md)把 Goal、
  Scope、Constraint 和 Check 变成可执行格式。
- **状态：**工程推论；不声称上游强制执行。

<!-- sync:E09 -->

### E09

- **支持：**[P09](../practice-guide.zh-CN.md#p09--先只读勘察再扩大能力)。
- **事实：**默认 Tool Set 与 `--tools` Allowlist 有明确文档；`grep`、`find` 和
  `ls` 是可选只读工具。
- **来源：**[coding-agent README: tools and CLI options](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)。
- **状态：**一手事实 + 分阶段能力推论。

<!-- sync:E10 -->

### E10

- **支持：**[P10](../practice-guide.zh-CN.md#p10--精确提供上下文不让噪声进入模型记录)。
- **事实：**`@path` 加入文件上下文；`!command` 把输出发给模型，`!!command`
  不发送。
- **来源：**[quickstart](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/quickstart.md)
  与 [coding-agent README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)。
- **状态：**一手事实 + 上下文预算推论。

<!-- sync:E11 -->

### E11

- **支持：**[P11](../practice-guide.zh-CN.md#p11--选择满足需求的最小能力原语)。
- **事实：**上游分别记录 Context File、Prompt Template、Skill、Extension、
  Package、JSON、RPC 与 SDK。
- **来源：**[documentation index](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/index.md)、
  [prompt templates](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md)、
  [skills](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md)
  与 [extensions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)。
- **状态：**一手事实 + 最小能力推论。

<!-- sync:E12 -->

### E12

- **支持：**[P12](../practice-guide.zh-CN.md#p12--一个会话只承载一个连贯目标)。
- **事实：**Pi Session 是持久、可命名、支持 Branch 与 Compaction 的 JSONL
  历史。
- **来源：**[sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md)
  与 [session format](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/session-format.md)。
- **状态：**一手事实 + Session Cohesion 推论。

<!-- sync:E13 -->

### E13

- **支持：**[P13](../practice-guide.zh-CN.md#p13--有意识地区分-steering-与-follow-up)。
- **事实：**上游定义了 Steering 与 Follow-up 不同的送达时点和 Queue Mode。
- **来源：**[coding-agent README: message queue](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)
  与 [RPC message queue commands](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md)。
- **状态：**一手来源。

<!-- sync:E14 -->

### E14

- **支持：**[P14](../practice-guide.zh-CN.md#p14--按不同意图使用-treefork-与-clone)。
- **事实：**`/tree`、`/fork`、`/clone` 与 CLI `--fork` 有不同且明确的文件和
  Branch 语义。
- **来源：**[sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md)
  与 [coding-agent README: session tree](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)。
- **状态：**一手来源。

<!-- sync:E15 -->

### E15

- **支持：**[P15](../practice-guide.zh-CN.md#p15--在语义边界压缩并把长期状态写入文件)。
- **事实：**上游明确称 Compaction 有损，在 JSONL 保留全部历史，记录自动阈值，
  并提供手动/自定义 Compaction。
- **来源：**[compaction](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/compaction.md)
  与 [sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md)。
- **状态：**一手事实 + 长期状态推论。

<!-- sync:E16 -->

### E16

- **支持：**[P16](../practice-guide.zh-CN.md#p16--导出或分享前清理-session)。
- **事实：**Session 包括 Message 与 Tool Result；HTML Exporter 可以包含
  Header、Entry、Active Leaf、System Prompt 与 Tool Description/Schema。
  `/share` 把该 Export 上传到 Secret/Unlisted GitHub Gist
  （`--public=false`），不是带访问控制的 Private Object；拿到 URL 的人可能
  都能读取。
- **来源：**[sessions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sessions.md)
  与 [session format](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/session-format.md)；
  [Share Implementation](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/modes/interactive/interactive-mode.ts#L5560-L5613)
  与 [HTML Exporter](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/src/core/export-html/index.ts#L236-L274)。
- **状态：**一手事实 + 隐私审查推论。

<!-- sync:E17 -->

### E17

- **支持：**[P17](../practice-guide.zh-CN.md#p17--明确模型相关行为的适用范围并记录配置)。
- **事实：**Provider 与模型目录表现不同的能力、Transport、认证路径、费用和
  Context Limit。
- **来源：**[models](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/models.md)、
  [providers](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/providers.md)
  与 [environment variables](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/environment-variables.md)。
- **状态：**一手来源。

<!-- sync:E18 -->

### E18

- **支持：**[P18](../practice-guide.zh-CN.md#p18--把跨-provider-handoff-视为尽力而为)。
- **事实：**`pi-ai` 记录跨 Provider Message Transformation 和 Provider 特定
  Compatibility Path，而不是通用无损表示。
- **来源：**[pi-ai README](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/README.md)
  与 [providers](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/providers.md)。
- **状态：**一手事实 + Checkpoint 推论。

<!-- sync:E19 -->

### E19

- **支持：**[P19](../practice-guide.zh-CN.md#p19--在能理解错误的层重试)。
- **事实：**Settings 定义 Agent Retry 与 Provider Retry 默认值；上游警告
  Provider Retry 可能隐藏 Usage-limit Error。
- **来源：**[settings: retry](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/settings.md)
  与 [custom provider errors](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/custom-provider.md)。
- **状态：**一手来源。

<!-- sync:E20 -->

### E20

- **支持：**[P20](../practice-guide.zh-CN.md#p20--限制命令并为输出截断做设计)。
- **事实：**内建输出上限为 2,000 行或 50 KB；Read 保留 Head 并支持 Offset
  Continuation，Bash 保留 Tail 和完整输出路径。
- **来源：**[extensions: result truncation](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)
  与 [truncated tool example](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/truncated-tool.ts)。
- **状态：**一手来源。

<!-- sync:E21 -->

### E21

- **支持：**[P21](../practice-guide.zh-CN.md#p21--先用指令原型验证再写-runtime-code)。
- **事实：**Prompt Template、Skill 与 Extension 有不同且明确的加载与能力模型。
- **来源：**[prompt templates](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md)、
  [skills](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md)
  与 [extensions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)。
- **状态：**一手事实 + Prototype-first 推论。

<!-- sync:E22 -->

### E22

- **支持：**[P22](../practice-guide.zh-CN.md#p22--让-extension-生命周期明确且幂等)。
- **事实：**Extension 文档定义 Factory、Session Event、Reload、Replacement 和
  Shutdown；过期 Session-bound Object 会失败。
- **来源：**[extensions: lifecycle and events](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)
  与 [shutdown example](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/shutdown-command.ts)。
- **状态：**一手事实 + 生命周期推论。

<!-- sync:E23 -->

### E23

- **支持：**[P23](../practice-guide.zh-CN.md#p23--构建诚实有边界可组合的自定义工具)。
- **事实：**Extension 文档要求 Throw Tool Error 才能得到 `isError`，建议使用
  `StringEnum`，并记录 Parallel Execution/File Mutation Queue、Sequential
  Tool、Cancellation 和 Truncation Utility。
- **来源：**[extensions: custom tools](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)
  与 [tools example](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/tools.ts)。
- **状态：**一手来源。

<!-- sync:E24 -->

### E24

- **支持：**[P24](../practice-guide.zh-CN.md#p24--把-pi-package-当作可执行供应链制品设计)。
- **事实：**Package Manifest 声明 Pi Resource 与 Dependency；npm、Git 和 Local
  Source 的安装/更新行为不同。
- **来源：**[packages](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)
  与 [with-deps example](https://github.com/earendil-works/pi/tree/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/examples/extensions/with-deps)。
- **状态：**一手事实 + Package Hygiene 推论。

<!-- sync:E25 -->

### E25

- **支持：**[P25](../practice-guide.zh-CN.md#p25--按所有权边界选择接口)。
- **事实：**Pi 分别记录 Interactive/Print、JSON Event Stream、双向 RPC Process
  Protocol 与进程内 TypeScript SDK。
- **来源：**[usage](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/usage.md)、
  [JSON](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/json.md)、
  [RPC](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md)
  与 [SDK](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sdk.md)。
- **状态：**一手来源。

<!-- sync:E26 -->

### E26

- **支持：**[P26](../practice-guide.zh-CN.md#p26--显式声明非交互策略并-fail-closed)。
- **事实：**非交互模式不能询问 Project Trust；行为由已保存/全局 Policy 或显式
  Approval Flag 决定。Tool/Model/Context Flag 均可用。
- **来源：**[security](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/security.md)
  与 [coding-agent CLI options](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)。
- **状态：**一手事实 + Fail-closed 推论。

<!-- sync:E27 -->

### E27

- **支持：**[P27](../practice-guide.zh-CN.md#p27--完整承担-sdk-与-rpc-生命周期)。
- **事实：**v0.83.0 已发布的 CLI RPC 是 stdio 上以 LF 分隔的 JSON；上游没有
  记录长期兼容保证。Framed-CBOR `@earendil-works/pi-protocol` 只存在于
  v0.83.0 后，并明确不保证兼容性。
- **来源：**[v0.83.0 RPC](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/rpc.md)、
  [v0.83.0 SDK](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/sdk.md)
  与[仅 main 的 protocol README](https://github.com/earendil-works/pi/blob/9b50b046d328d589a81400d2e184175d0bf19734/packages/protocol/README.md)。
- **状态：**一手来源；最后一个来源仅 main 且为实验性。

<!-- sync:E28 -->

### E28

- **支持：**[P28](../practice-guide.zh-CN.md#p28--用隔离阶梯诊断)。
- **事实：**Pi 为 Mode、Session、Context File、Trust、Extension、Package、
  Tool、Model、Provider 和 Working Directory 提供独立控制。
- **来源：**[CLI options](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md)、
  [extensions](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)
  与 [packages](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)。
- **状态：**一手控制项 + 诊断推论。

<!-- sync:E29 -->

### E29

- **支持：**[P29](../practice-guide.zh-CN.md#p29--通过固定分阶段可逆的路径升级)。
- **事实：**Pi 发布频繁，提供 Package/Model Update Command、Pinned Git Ref，
  并在 Changelog 记录迁移。
- **来源：**[releases](https://github.com/earendil-works/pi/releases)、
  [changelog](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/CHANGELOG.md)
  与 [packages: update behavior](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)。
- **状态：**一手事实 + 分阶段发布推论。

<!-- sync:E30 -->

### E30

- **支持：**[P30](../practice-guide.zh-CN.md#p30--经过人类复现与审查后再向上游贡献)。
- **事实：**Pi 上游贡献指南说明 Maintainer Approval Gate，并要求简洁、人类式
  沟通。
- **来源：**[Pi CONTRIBUTING.md](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/CONTRIBUTING.md)
  与本仓库[贡献政策](../../CONTRIBUTING.zh-CN.md)。
- **状态：**一手上游政策 + 本地人类审查政策。

<!-- sync:evidence-limitations -->

## 台账局限

- 每个来源只证明相邻事实，不自动证明整套建议控制。
- Example Extension 只能证明实现 Pattern 存在，不会让它变成稳定核心功能。
- `latest` 文档会在快照后变化，因此稳定结论使用 Tag/Commit 链接；发现入口放在
  [来源地图](source-map.zh-CN.md)。
- Community Project 在记录 Hands-on Review 前，只放在
  [观察名单](watchlist.zh-CN.md)中。
