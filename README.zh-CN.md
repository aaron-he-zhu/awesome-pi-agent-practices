# Awesome Pi Agent Practices [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[English](README.md) | [简体中文](README.zh-CN.md)

面向真实任务、可以直接照着用的 Pi 编码智能体实战手册。

用这个仓库完成第一次小修改，把仓库规则教给 Pi，管理长任务和并行任务，定制
智能体，把 Pi 嵌入其他程序，以及在出错时有条理地恢复。开始使用前不需要先读完
三十条实践，也不需要先理解整套生态研究。

| 我现在想要……                           | 直接从这里开始                           |
| --------------------------------- | --------------------------------- |
| 完成第一个真正有用的任务                      | [安装并认证后，十分钟取得可用结果](#start-now)    |
| 复制一种现成的任务结构                       | [按结果选择现成配方](#recipe-chooser)      |
| 给 Pi 稳定、清楚的仓库规则                   | [直接复制起步套件](#starter-kit)          |
| 处理长任务、并行任务或自动化                    | [使用高收益模式](#advanced-patterns)     |
| 构建技能（Skill）、扩展（Extension）、界面或宿主程序 | [定制或集成 Pi](#pi-surfaces)          |
| 寻找包（Package）和社区实现                 | [按需求探索生态](#ecosystem-exploration) |
| 排查故障                              | [每次只改变一个变量](#failure-recovery)    |

> 这里的命令是依据仓库固定的 Pi **v0.83.0** 官方文档和源码整理的配方，
> 不表示维护者已经逐条运行。请替换所有占位符、先审查命令，并以实际退出状态和
> 实际结果判断成功。第一次安装请使用第 1 步链接的当前官方快速入门指南，
> 记录 <code>pi --version</code>，然后按实际版本调整固定版本示例。

<!-- sync:root-contents -->

## 目录

- [安装并认证后，十分钟取得可用结果](#安装并认证后十分钟取得可用结果)
- [只学习下一层](#只学习下一层)
- [保留六步日常速查](#保留六步日常速查)
- [按结果选择现成配方](#按结果选择现成配方)
- [直接复制起步套件](#直接复制起步套件)
- [使用高收益模式](#使用高收益模式)
- [定制或集成 Pi](#定制或集成-pi)
- [按需求探索生态](#按需求探索生态)
- [每次只改变一个变量](#每次只改变一个变量)
- [参考资料库](#参考资料库)

<!-- sync:root-start -->

<a id="start-now"></a>

## 安装并认证后，十分钟取得可用结果

前提是你已经按[当前官方快速入门指南](https://pi.dev/docs/latest/quickstart)安装 Pi、
完成认证，并配置了可用的默认模型。这条路径适合在你信任的仓库中，由人监督完成
一个范围小、容易回滚的修改。面对未知代码、敏感数据、宽权限凭据或无人值守任务，
应改用一次性环境或外部操作系统隔离边界。

### 1. 用 60 秒确认 Pi 可以工作

在一个新的空目录中运行：

```bash
command -v pi
pi --version
node --version
pi --no-session --no-tools -p "Reply with exactly PI_READY."
```

实际输出中应包含 Pi 和 Node 的版本，最后一个命令应成功退出并只返回 <code>PI_READY</code>。它会使用你当前配置的默认模型服务商（Provider）、模型和
用户配置；如果失败，直接使用
[场景 1：首次干净基线](./docs/scenario-cookbook.zh-CN.md#场景-1--首次干净基线)。
如果需要严格可复现的干净配置和固定模型，也进入场景 1，不要把这些高级控制塞进
首次成功路径。

### 2. 取得一份可以直接使用的只读仓库地图

进入一个你信任的仓库，先记录状态，再让 Pi 用只读工具说明仓库结构：

```bash
git status --short
git branch --show-current
git rev-parse HEAD

pi --approve --no-session --tools read,grep,find,ls -p \
  "不要修改文件。说明这个仓库的用途。引用主入口、一个代表性测试，以及文档中明确写出的聚焦检查和完整检查命令。把事实和推测分开。"
```

只有进程成功退出、答案引用了仓库中的实际文件和明确检查，而且之前记录的 Git
状态没有变化，这一步才算通过。<code>--approve</code> 只决定是否加载受保护的项目
资源；工具白名单只限制 Pi 注册的工具。两者都不会隔离文件、进程、凭据或网络。
陌生仓库应改用
[场景 3：未知仓库只读审计](./docs/scenario-cookbook.zh-CN.md#场景-3--未知仓库只读审计)。

### 3. 开始一个有人监督的小修改

审查代码地图，以及仓库中的 <code>AGENTS.md</code>、设置和 Pi 资源。如果任务
仍然足够小，而且仓库可信，再启动一个独立的交互运行，只开放必要的写入能力：

```bash
pi --approve --tools read,grep,find,ls,edit,write,bash
```

粘贴下面的任务约定，并把各项改成这次任务的真实内容：

```text
目标：产出一个可以实际验证的结果。

范围内：允许修改的路径或组件。
范围外：不相关重构或未授权外部系统。
必须保留：用户已有修改、API/数据行为和明确约束。

先阅读相关指令与文件，说明最小方案，再做获准修改。

验收：
1. 运行精确的行为检查。
2. 运行精确的回归或静态检查。
3. 审查完整变更差异和意外文件。

如果需要扩大范围、增加权限、安装依赖、使用凭据、改变外部状态或执行破坏性
操作，先停止并询问。

完成时报告：结果、修改文件、检查与结果、跳过项、剩余风险和回滚方法。
```

### 4. 用证据关闭任务

不要把一段听起来合理的最终回复当作完成证明。亲自检查仓库：

```bash
git status --short
git diff --check
git diff
```

然后先运行仓库规定的聚焦测试，再运行本任务需要的更广回归检查。合格的交付必须
说清楚：改了什么、哪些命令通过或失败、哪些内容没有验证、发生了哪些外部影响，
以及怎样回滚。

需要更完整的版本时，直接使用
[场景 2：可信仓库中的小修复](./docs/scenario-cookbook.zh-CN.md#场景-2--可信仓库中的小修复)，
其中包含前置条件、预期结果、失败分支、核验和清理步骤。

<!-- sync:root-learning -->

## 只学习下一层

| 阶段          | 直接实践，并保留这些证明                                  |
| ----------- | --------------------------------------------- |
| 1. 完成第一项小任务 | 跑完十分钟路径和场景 2；保留可审查的变更差异、检查结果和交付摘要。            |
| 2. 让日常工作可重复 | 复制仓库指令和任务简报；保留稳定命令和清楚的任务范围。                   |
| 3. 管理长任务和并行 | 使用检查点、上下文压缩、克隆会话和 Git 工作树；保留检查点、归属表和合并顺序。     |
| 4. 定制 Pi    | 构建解决问题的最小原语；保留一个范围窄、可移除的提示词、技能、扩展或包。          |
| 5. 自动化或嵌入   | 按生命周期负责人选择 Print、JSON、RPC 或 SDK；测试启动到清理的完整周期。 |
| 6. 运行与维护    | 隔离一个变量、比较固定用例并分阶段升级；保留复现、前后结果、回滚和恢复证据。        |

需要解释某个选择时，再查阅
[三十条编号实践](./docs/practice-guide.zh-CN.md#任务开始前)，无需按顺序通读。

<!-- sync:root-loop -->

## 保留六步日常速查

完成快速开始后，每个真实任务都复用这六步：

|      步骤 | 你要做什么                                   | 进入下一步前应看到什么       |
| ------: | --------------------------------------- | ----------------- |
|   1. 定义 | 写清一个结果、允许路径、必须保留项、停止条件和精确检查。            | 一份别人可以审查的短任务约定。   |
|  2. 建基线 | 记录 Pi/运行时/模型、Git 状态、分支和提交，并区分已有修改。       | 一个可恢复的起点。         |
|  3. 先勘察 | 开放写入或执行前，先阅读指令和相关代码。                    | 文件地图和最小修改方案。      |
| 4. 小步修改 | 一个会话（Session）只做一个连贯目标；只有证据需要时才扩大上下文或权限。 | 范围明确、来源可追踪的变更差异。  |
| 5. 分层验证 | 按风险运行行为、回归、静态、安全/数据边界和清理检查。             | 实际命令、退出状态和脱敏结果。   |
|   6. 交付 | 审查完整变更差异，记录跳过项与风险，清理临时影响，并保留回滚。         | 不依赖完整聊天记录也能决策的摘要。 |

三条规则能避免大多数高成本错误：

| 必须记住                                                             | 直接后果                        |
| ---------------------------------------------------------------- | --------------------------- |
| 项目信任（Project Trust）只控制受保护项目资源的加载，不是操作系统隔离。                       | 未知、高权限或无人值守工作仍需要外部边界。       |
| <code>AGENTS.md</code>、提示词模板、技能、扩展、包、会话、Git 工作树和外部服务是不同的状态与权限边界。 | 每一层都要单独选择和审查。               |
| 会话导航不会恢复文件或外部系统。                                                 | Git、文件、进程、凭据、网络和服务状态必须分别检查。 |

完整版在[八阶段运行手册](docs/operating-playbook.zh-CN.md#如何使用本手册)中；
只有需要理解某个决定时，再从
[实践指南的任务开始前章节](docs/practice-guide.zh-CN.md#任务开始前)进入。

<!-- sync:root-recipes -->

<a id="recipe-chooser"></a>

## 按结果选择现成配方

不要为了今天的一项工作先读完整本手册。打开最符合当前结果的那一行；每个场景
都包含前置条件、可复制步骤、预期结果、失败分支、核验、清理和对应实践。

| 我今天需要……                  | 直接复制这个场景                                                                          | 默认风险  |
| ------------------------ | --------------------------------------------------------------------------------- | ----- |
| 确认可执行文件、模型服务商、模型和认证路径    | [1. 首次干净基线](docs/scenario-cookbook.zh-CN.md#场景-1--首次干净基线)                         | R0    |
| 完成一个范围小、有人监督的修复          | [2. 可信仓库小修复](docs/scenario-cookbook.zh-CN.md#场景-2--可信仓库中的小修复)                     | R1    |
| 审查陌生源码，但不接受其中的指令         | [3. 未知仓库审计](docs/scenario-cookbook.zh-CN.md#场景-3--未知仓库只读审计)                       | R2    |
| 跨上下文窗口或监督时段继续            | [4. 长任务与上下文压缩](docs/scenario-cookbook.zh-CN.md#场景-4--长任务检查点与-compaction)          | R1–R2 |
| 安全拆分互不重叠的修改              | [5. Git 工作树并行](docs/scenario-cookbook.zh-CN.md#场景-5--使用-git-worktree-并行工作)        | R1–R2 |
| 比较模型或在模型服务商之间交接          | [6. 多服务商交接](docs/scenario-cookbook.zh-CN.md#场景-6--多-provider-比较或-handoff)         | R1–R2 |
| 试用可执行第三方包                | [7. 隔离试用包](docs/scenario-cookbook.zh-CN.md#场景-7--第三方-package-隔离试用)                | R2    |
| 运行无界面检查或消费事件             | [8. CI Print 与 JSON](docs/scenario-cookbook.zh-CN.md#场景-8--ci-中使用-print-与-json)   | R2–R3 |
| 从进程或 TypeScript 应用控制 Pi  | [9. RPC 与 SDK 生命周期](docs/scenario-cookbook.zh-CN.md#场景-9--rpc-子进程或-sdk-host-生命周期) | R2–R3 |
| 增加工具、事件、命令、界面、模型服务商或策略钩子 | [10. 扩展开发](docs/scenario-cookbook.zh-CN.md#场景-10--extension-开发与生命周期测试)            | R2    |
| 升级 Pi、模型目录、包或扩展          | [11. 分阶段升级与回滚](docs/scenario-cookbook.zh-CN.md#场景-11--分阶段升级与回滚)                   | R2–R3 |
| 处理可能的凭据或私有数据泄露           | [12. 密钥泄露响应](docs/scenario-cookbook.zh-CN.md#场景-12--疑似-secret-泄露事件)               | R3    |

R0–R3 只是分流标签，不是 Pi 强制执行的策略。R0 是只读和合成数据；R1 是容易
回滚的本地修改；R2 涉及可执行第三方代码、凭据、网络写入或共享状态；R3 涉及
破坏性操作、生产、受监管数据或安全事件。R2/R3 开始前应使用
[风险分级闸门](docs/operating-playbook.zh-CN.md#风险分级)。

<!-- sync:root-starter -->

<a id="starter-kit"></a>

## 直接复制起步套件

只复制能让下一次运行更清楚的最小制品：

| 直接复制                                         | 什么时候用                             | 你会得到什么                                   |
| -------------------------------------------- | --------------------------------- | ---------------------------------------- |
| [仓库指令](templates/AGENTS.zh-CN.md)            | 仓库有长期稳定的命令、结构、约定或保留规则。            | 可审查的 <code>AGENTS.md</code>；不要放密钥和一次性任务。 |
| [任务简报](templates/task-brief.zh-CN.md)        | 任何真实修改都需要范围和验收。                   | 目标、范围、证据、检查、停止条件、交付和回滚。                  |
| [运行清单](templates/run-manifest.zh-CN.md)      | 长任务、并行任务、CI、RPC、SDK 或无人值守运行必须可重建。 | 版本、模型、资源、权限、隔离、结果和清理来源。                  |
| [评估记录](templates/evaluation-record.zh-CN.md) | 比较提示词、模型、模型服务商、工具、扩展或工作流。         | 固定用例、预期/实际结果、门槛、指标、成本和决定。                |
| [亲测审查](templates/hands-on-review.zh-CN.md)   | 试用第三方包或社区项目。                      | 身份、权限、数据流、生命周期、行为、反例和移除证据。               |

### 最小仓库指令

把下面的结构复制到项目根目录 <code>AGENTS.md</code>，再替换成这个仓库真正
使用的命令和约束：

```markdown
# 仓库指南

## 结构
- 主要代码：
- 测试：
- 生成或供应商代码路径：

## 命令
- 安装：
- 快速聚焦检查：
- 完整检查：
- 构建或类型检查：
- 格式化：

## 修改规则
- 必须保留：
- 不得修改：
- 新增依赖需要：

## 完成定义
- 已复现并验证预期行为。
- 聚焦检查和必要回归检查通过。
- 已审查完整变更差异和意外文件。
- 已报告跳过项、剩余风险和回滚方法。
```

仓库指令是持久上下文，不是沙箱，也不是单次任务计划。更深目录中的具体指令
可能覆盖根文件，因此指令层级应保持短小、清楚、可审查。

### 日常 TUI 速查

| 输入                      | 用来做什么                         | 注意边界                 |
| ----------------------- | ----------------------------- | -------------------- |
| <code>@path</code>      | 精确加入文件或目录，而不是倾倒整个仓库。          | 确认内容适合发送给所选模型服务商。    |
| <code>!command</code>   | 运行命令并让模型看到输出。                 | 限制并脱敏输出。             |
| <code>!!command</code>  | 只在本地运行，不加入模型上下文。              | 输出仍可能存在于终端、会话、日志或导出。 |
| 工作中按 <code>Enter</code> | 当前回复中的工具工作全部结束后、下一次模型调用前纠正方向。 | 尽早修正范围和假设。           |
| <code>Alt+Enter</code>  | 当前工作单元结束后再处理后续请求。             | 不要把无关目标混入当前任务。       |
| <code>/session</code>   | 查看当前会话身份。                     | 会话不是仓库状态。            |
| <code>/tree</code>      | 在同一个会话文件内探索或返回其他分支。           | 不隔离文件写入。             |
| <code>/fork</code>      | 从较早的用户提示新建会话。                 | 仓库状态仍需单独核验。          |
| <code>/clone</code>     | 复制完整活动分支，独立继续。                | 写入需要隔离时还应使用 Git 工作树。 |
| <code>/compact</code>   | 在语义里程碑压缩上下文。                  | 压缩前把持久决定写到外部文件。      |

<!-- sync:root-patterns -->

<a id="advanced-patterns"></a>

## 使用高收益模式

### 不依赖聊天记录恢复长任务

上下文压缩或交接前，把可恢复检查点写在会话外：

```text
/session

目标和已接受范围：
BASE_COMMIT 和当前变更差异：
决定与不变量：
通过和失败的检查：
外部影响与幂等标识：
开放问题：
下一步精确动作：
回滚点：

/compact 保留上面的范围、决定、不变量、失败检查、外部影响标识、下一步和回滚点。
```

恢复后，把模型复述与检查点逐项比较，并独立检查 Git 和外部状态。 <code>/clone</code> 用于独立会话续跑，<code>/tree</code> 用于同一会话内的替代
路径；两者都不会恢复文件。

### 只并行互不重叠的写入范围

替换所有占位符，并先确认工作树路径和分支名都不存在：

```bash
git status --short
git rev-parse HEAD
git worktree add WORKTREE_A -b BRANCH_A BASE_COMMIT
git worktree add WORKTREE_B -b BRANCH_B BASE_COMMIT
git worktree list
```

每个 Git 工作树只配一个 Pi 会话、一个目标、一个负责人、一组写入路径和一组检查。
锁文件、结构定义、生成文件、数据库、端口或外部状态共享时必须串行化。Git 工作树
隔离的是 Git 工作单元，不是操作系统权限。

### 在 CI 中生成一次只读审查报告

只需要一个最终只读报告时使用 Print；需要机器事件流时改用 <code>--mode json</code>，按 JSON Lines 消费标准输出，并单独持续读取标准错误
输出：

```bash
pi --no-approve --no-context-files --no-extensions --no-skills \
  --no-prompt-templates --no-themes --no-session \
  --tools read,grep,find,ls --provider PROVIDER --model MODEL \
  -p "审查指定范围，但不要调用仓库命令。返回发现和基于文件的证据。"
```

这一条命令只有读取类工具，**不能执行仓库测试、Lint 或构建命令**。确实需要执行时，
应由可信或隔离的 CI 宿主单独定义并约束 <code>bash</code> 权限。CI 宿主还负责超时、
重试、取消、退出判断、保留和清理；需要长期双向控制的控制器应使用 RPC 或 SDK。

<!-- sync:root-customize -->

<a id="pi-surfaces"></a>

## 定制或集成 Pi

### 选择能解决问题的最小原语

| 你需要什么       | 先用什么                   | 只有在以下情况才升级                       |
| ----------- | ---------------------- | -------------------------------- |
| 稳定仓库事实和命令   | <code>AGENTS.md</code> | 行为只属于单次任务，或需要显式调用。               |
| 可重复调用的文字    | 提示词模板                  | 需要参考资料、辅助脚本或按需工作流。               |
| 按需工作流       | 技能                     | 需要运行时事件、自定义工具、命令、界面、模型服务商、策略或路由。 |
| 运行时行为       | 扩展                     | 需要把多种资源一起分发。                     |
| 共享资源包       | Pi 包                   | 已审查每个可执行资源和组合后的生命周期。             |
| 只改变终端外观     | 主题                     | 包含展示之外的可执行代码或依赖。                 |
| 操作系统隔离或并行写入 | 外部容器、虚拟机、沙箱或 Git 工作树   | 不要用提示词或工具列表代替真正边界。               |

从官方[提示词模板（Prompt Template）](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/prompt-templates.md)、
[技能（Skill）](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/skills.md)、
[扩展（Extension）](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/extensions.md)、
[主题（Theme）](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/themes.md)和
[包（Package）](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/docs/packages.md)
指南开始。需要可执行代码时，使用上方扩展开发场景，先在一次性测试目录中放入最小
示例，再做适配。

### 根据生命周期由谁负责来选择接口

| 程序需要……              | 使用                    | 负责人必须处理……                         |
| ------------------- | --------------------- | --------------------------------- |
| 人在环编码               | 交互 TUI                | 信任、资源、工具、会话、审查和中断。                |
| 一个提示词和一个最终结果        | Print <code>-p</code> | 退出状态、超时、结果验证和会话策略。                |
| 单向机器事件流             | JSON 模式               | JSONL 解析、标准错误输出、顺序、部分/失败事件、背压和保留。 |
| 非 Node 宿主或替代界面双向控制  | CLI RPC               | 子进程启动、LF 分帧、关联、事件、取消、重启和关闭。       |
| TypeScript 内完全拥有运行时 | SDK                   | 模型、资源、工具、会话、订阅、持久化、凭据、取消和释放。      |

上方 RPC/SDK 场景包含 v0.83.0 生命周期示例。不要把 RPC 当成 JSON 模式，
也不要假设未固定版本的升级保持接口稳定。

### 确认你真正需要哪个包

| 包                                                                                                                                                                  | 适合什么情况                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| [<code>@earendil-works/pi-coding-agent</code>](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/coding-agent/README.md) | 需要完整 CLI、会话、资源、工具、TUI、Print、JSON、RPC 或 SDK。 |
| [<code>@earendil-works/pi-ai</code>](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/ai/README.md)                     | 只需要多服务商模型、流式输出、消息、工具调用和用量统计原语。              |
| [<code>@earendil-works/pi-agent-core</code>](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/agent/README.md)          | 自己构建智能体运行时及状态、事件和工具循环。                      |
| [<code>@earendil-works/pi-tui</code>](https://github.com/earendil-works/pi/blob/845d6ff1f6643aba440341cce877ce1c43ebbc39/packages/tui/README.md)                   | 构建终端组件或自定义终端界面。                             |

<!-- sync:root-ecosystem -->

<a id="ecosystem-exploration"></a>

## 按需求探索生态

官方能力可以现在就用。社区区目前有 **0 个经过实际运行验证的项目，0 个正式推荐项目**，
所以这里只提供探索地图，不提供“复制安装即可采用”的第三方清单。任何社区项目在
你自己的隔离环境中复现前，都只能作为设计模式和试用线索。

### 官方基础材料

<!-- resource:official-pi -->

- [Pi](https://github.com/earendil-works/pi) - 提供源码、发布版本、测试、包代码、安全边界和贡献政策的权威仓库。

<!-- resource:official-docs -->

- [Documentation](https://pi.dev/docs/latest) - 当前用法、模型服务商、会话、资源、安全、终端、JSON、RPC 与 SDK 指南。

<!-- resource:official-releases -->

- [Releases](https://github.com/earendil-works/pi/releases) - 用于选择并保存可复现基线的版本说明和制品。

<!-- resource:official-extension-examples -->

- [Extension Examples](https://github.com/earendil-works/pi/tree/v0.83.0/packages/coding-agent/examples/extensions) - 可审查的生命周期钩子、工具、界面、模型服务商、策略与工具路由实现。

<!-- resource:official-package-catalog -->

- [Package Catalog](https://pi.dev/packages) - 广泛的包发现入口；条目仍需源码、许可证、权限、兼容性与亲测审查。

<!-- resource:official-rfcs -->

- [Pi RFCs](https://rfc.earendil.com/keyword/pi/) - 设计提案；状态必须与固定标签实现和发布版本交叉核验。

### 从源码审查案例中探索设计模式

下面的固定项目在 2026-07-31 接受了目的、源码、许可证、依赖、权限与数据流、测试、
CI 和明显风险审查。仓库维护者**没有**安装或运行它们。可以借鉴模式，不能复制
信任结论。

- **虚拟机工具隔离 — [Gondolin @ <code>29fa74d</code>](https://github.com/earendil-works/gondolin/tree/29fa74d802112f29c720990aced26165e0d57d84)。**
  可学习通过微型虚拟机路由 Pi 工具；先核验挂载、网络、同用户进程和拒绝服务攻击
  等非目标。
- **子智能体编排 — [pi-subagents @ <code>89de10e</code>](https://github.com/nicobailon/pi-subagents/tree/89de10e4bc8895e7948704c38620a5b35ddcd17e)。**
  可学习子智能体、链式、后台和工作树编排；先核验子进程权限、继承环境、并发、
  成本、保留状态和写入归属。
- **持久并行工作流 — [pi-crew @ <code>c694ebf</code>](https://github.com/baphuongna/pi-crew/tree/c694ebfd5d0f49d9479870d6919be4bbf9738291)。**
  可学习持久并行工作流编排；先核验子进程权限、继承环境、并发、成本、保留状态和
  写入归属。
- **MCP 连接 — [pi-mcp-adapter @ <code>6a3e840</code>](https://github.com/nicobailon/pi-mcp-adapter/tree/6a3e840219a49f9ae5350542b7a707aa1e83fedf)。**
  可学习延迟代理、直接服务器、OAuth、包和一致性检查；先核验每个服务器命令、
  密钥解析器、凭据和共享多路复用器。
- **搜索、抓取、PDF、仓库和视频 — [pi-web-access @ <code>c702b3b</code>](https://github.com/nicobailon/pi-web-access/tree/c702b3be11bfbc832489eb7cfe31d9bbbbb2cc27)。**
  可学习带服务商回退的组合式网络工具；先核验查询与内容外发、Cookie、重定向与
  SSRF、大小、保留、超时和离线失败。
- **已登录浏览器自动化 — [pi-agent-browser-native @ <code>211a012</code>](https://github.com/fitchmultz/pi-agent-browser-native/tree/211a012c9b199d758768e8ba729f35e11e661f65)。**
  可学习在独立浏览器 CLI 上提供结构化 Pi 工具；先使用专用测试配置，并检查
  Cookie、剪贴板、下载、截图和 CLI 配对。
- **人工审查计划与变更差异 — [Plannotator @ <code>80065c8</code>](https://github.com/backnotprop/plannotator/tree/80065c84624e80bf60dc1ad862c17c3ea3f2bd80)。**
  可学习计划、文档、HTML 和变更差异审查界面；敏感试用先关闭分享，并检查链接、
  历史、元数据、端点和保留策略。
- **跨会话记忆 — [pi-hermes-memory @ <code>5aafe2c</code>](https://github.com/chandra447/pi-hermes-memory/tree/5aafe2ca04cb55b62204b159389c8381894038ce)。**
  可学习会话搜索、持久记忆和模型辅助整合；先核验隐私生命周期、存储型提示词注入、
  扫描器限制、SQLite ABI 和记忆重写。
- **Emacs RPC 前端 — [pi-coding-agent for Emacs @ <code>df5ce0a</code>](https://github.com/dnouri/pi-coding-agent/tree/df5ce0a176ce634ccb4883042c415a74a5637c37)。**
  可学习经过测试的替代界面和无界面信任处理；未知仓库应改变默认批准策略，并审查
  共享认证存储。
- **LSP、Lint、格式化、AST 与 Tree-sitter — [pi-lens @ <code>a4baa3a</code>](https://github.com/apmantza/pi-lens/tree/a4baa3a94ecaf71f8af9f48ab27c8d7f6da8fdb2)。**
  可学习把结构化代码智能工具组合到 Pi 后面；先核验下载、可选安装、文件修改和
  特定版本兼容性。
- **会话与工具追踪 — [braintrust-pi-extension @ <code>c8f1aea</code>](https://github.com/braintrustdata/braintrust-pi-extension/tree/c8f1aea1236f47c2681c0104be143b832bc9058c)。**
  可学习追踪会话、轮次、模型调用、工具和上下文压缩；先核验原始输入、上下文、
  输出与工具外发，以及脱敏、采样、保留、删除和故障隔离。
- **宽域 SDD/TDD 运行层 — [gentle-pi @ <code>3b6b3d2</code>](https://github.com/Gentleman-Programming/gentle-pi/tree/3b6b3d2183dbbc4d45b16a1a0f127728c0a2435c)。**
  可学习组合规格、TDD、审查、子智能体和策略；先核验原生安装后脚本、不稳定接口、
  广泛配套权限和同用户威胁模型排除项。

完整入口、测试与 CI 说明和试用问题见
[源码审查观察名单](docs/research/watchlist.zh-CN.md)。

### 可以继续探索，但不要直接照搬

下面 13 项都只保存了初步证据，仍在等待源码审查，且没有经过评估：

| 需求                        | 线索                                                                                                                                                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 远程、消息或移动控制                | [OpenClaw](https://github.com/openclaw/openclaw)、[Polpo](https://github.com/pugliatechs/polpo)、[piclaw](https://github.com/rcarmo/piclaw)、[pi-mobile](https://github.com/p1rallels/pi-mobile)                                                                 |
| 替代发行版或宽域套件                | [oh-my-pi](https://github.com/can1357/oh-my-pi)、[Senpi](https://github.com/code-yeongyu/senpi)、[my-pi](https://github.com/spences10/my-pi)                                                                                                                    |
| VS Code、Neovim、ACP 或替代 UI | [pi-vscode-extension](https://github.com/Zetaphor/pi-vscode-extension)、[pi-vscode](https://github.com/pithings/pi-vscode)、[pi-acp](https://github.com/svkozak/pi-acp)、[acpx](https://github.com/openclaw/acpx)、[pi-nvim](https://github.com/carderne/pi-nvim) |
| GitHub 自动化                | [pi-coding-agent-action](https://github.com/shaftoe/pi-coding-agent-action)                                                                                                                                                                                   |

OpenClaw 被纳入，是因为固定证据记录了对 Pi 包的历史直接嵌入、后来将运行时
内部化，以及保留的 Pi 来源。这**不能**证明当前兼容 Pi v0.83，也不能替代当前
源码、许可证、权限、数据流、测试和维护审查。其五段证据链和
全部 28 条候选固定证据见
[候选注册表](data/discovery-candidates.json)。

另有三项被有意延后，而不是当作当前采用路径：
[pi-extensions](https://github.com/tmustier/pi-extensions) 需要逐项审查；
[pi-skills](https://github.com/badlogic/pi-skills) 使用旧命名空间，且包含多种
高权限工作流；[pi-share-hf](https://github.com/badlogic/pi-share-hf) 因
许可证、旧命名空间与公开分享/隐私问题而阻断。

### 在一次性目录中试装并移除已审查的包

下面是安装命令的**占位结构，不是对任何具体第三方包的采用建议**。先审查精确制品、
安装脚本、依赖、入口点、数据流、测试和移除方法。在一次性本地测试目录中，只选择
与你审查制品一致的**一种**固定来源，并替换全部占位符：

```bash
pi install npm:@scope/name@1.2.3 -l --approve
pi install git:github.com/OWNER/REPOSITORY@FULL_COMMIT -l --approve
```

完成有限试用后，只运行与你所安装来源相匹配的那一条移除命令，再检查残留文件、
进程、凭据、设置、会话和外部数据：

```bash
pi remove npm:@scope/name -l --approve
pi remove git:github.com/OWNER/REPOSITORY -l --approve
```

使用上方隔离试用包的场景和亲测审查模板。目录收录、源码审查、测试、CI 或声明
许可证都不能代替你自己的试用。

<!-- sync:root-troubleshoot -->

<a id="failure-recovery"></a>

## 每次只改变一个变量

先保存原始错误，并停止破坏性操作、携带凭据的操作或重复外部写入。记录 Pi/Node
版本、当前目录、Git 状态、模型服务商与模型、模式、信任决定、工具、已加载资源、
会话和失败阶段。然后用最小对照，每次只改变一个变量：

| 步骤 | 只改变这一件事                                          | 如果结果变化，应检查……         |
| -: | ------------------------------------------------ | -------------------- |
|  1 | 换到全新空目录。                                         | 仓库文件、上下文、资源或路径假设。    |
|  2 | 用 Print 代替 TUI。                                  | 终端渲染、按键处理或扩展提供的交互界面。 |
|  3 | 固定模型服务商、模型和思考级别。                                 | 目录别名、能力、传输或模型行为。     |
|  4 | 增加 <code>--no-session</code>。                    | 历史、分支、上下文压缩或旧工具调用参数。 |
|  5 | 增加 <code>--no-context-files --no-approve</code>。 | 上下文指令或受保护项目资源。       |
|  6 | 禁用扩展、技能、提示词模板和主题。                                | 某个可选资源或它们之间的交互。      |
|  7 | 一次只加回一个固定引用的制品。                                  | 该包、资源或其生命周期。         |
|  8 | 只开放内置读取工具。                                       | Bash/写入行为或自定义、覆盖工具。  |
|  9 | 缩小到一个最小输入、仓库或文件。                                 | 最小可复现触发条件。           |
| 10 | 比较干净用户配置或上一固定 Pi 版本。                             | 用户配置状态或回归问题。         |

可以从[症状路由](docs/troubleshooting.zh-CN.md#症状路由)开始；怀疑正常用户配置
本身时，运行[干净基线](docs/troubleshooting.zh-CN.md#干净基线)。不要一次同时
改变目录、模型、模型服务商、提示词、会话、包和工具；故障消失不等于
已经找出原因。

遇到凭据泄露、目标外破坏性行为、生产修改、隔离绕过，或不确定能否安全处理的
数据时，停止本地诊断，进入对应的私密事件流程。

<!-- sync:root-reference -->

## 参考资料库

### 按结果阅读

| 需要                               | 打开                                       |
| -------------------------------- | ---------------------------------------- |
| 十二套完整运行配方                        | [场景手册](docs/scenario-cookbook.zh-CN.md)  |
| 任务受理、风险、归属、检查点、验证和交付             | [运行手册](docs/operating-playbook.zh-CN.md) |
| 三十条原因、行动和验证实践                    | [实践指南](docs/practice-guide.zh-CN.md)     |
| 带失败分支的已填写教学记录                    | [完整示例](docs/worked-example.zh-CN.md)     |
| 架构、资源、信任、会话与接口选择                 | [架构指南](docs/architecture.zh-CN.md)       |
| 模型服务商、包、会话、终端、JSON/RPC/SDK 或升级故障 | [故障排查](docs/troubleshooting.zh-CN.md)    |
| 第三方来源、权限、数据流和生命周期审查              | [扩展审查](docs/extension-review.zh-CN.md)   |
| 仓库中全部文档和模板                       | [文档地图](docs/README.zh-CN.md)             |

<details>
<summary><strong>证据与生态研究快照</strong></summary>

运行建议仍然可以追溯，但研究过程不再占据主学习路径：

| 已录入证据  | 快照                                                                   |
| ------ | -------------------------------------------------------------------- |
| 资源注册表  | 28 条：6 个官方、7 个目录/相关入口、12 个已完成源码审查的社区项目、3 个延后社区记录。                    |
| 发现队列   | 13 个初步候选，包含 28 条不可变证据链接。                                             |
| 覆盖地图   | 25 个能力类别、11 个架构类型、13 种 Pi 关系；目前没有第三方项目经过实际运行验证。                     |
| 稳定实现基线 | Pi v0.83.0，提交 <code>845d6ff1f6643aba440341cce877ce1c43ebbc39</code>。 |
| 日期     | 源码审查快照 2026-07-31；发现候选快照 2026-08-01，Asia/Singapore。                  |

需要固定一手来源时看[官方来源图](docs/research/source-map.zh-CN.md)，需要追溯
P01–P30 时看[证据台账](docs/research/evidence-ledger.zh-CN.md)，需要能力缺口时看
[覆盖矩阵](docs/research/coverage-matrix.zh-CN.md)，需要逐项生态时看
[生态图谱](docs/research/landscape.zh-CN.md)。只有审计或更新研究时，才需要进入
[方法论](docs/research/methodology.zh-CN.md)和
[发现协议](docs/research/discovery-protocol.zh-CN.md)。

源码审查不等于亲测、安全认证、兼容性证明或背书。在具名人类维护者提交可复现
试用，并经过独立编辑晋级前，第三方正式推荐仍然有意保持为零。

</details>

<a id="相关列表"></a>

### 相关发现列表

这些项目处理相邻的包与生态发现问题。

<!-- resource:related-awesome-pi -->

- [awesome-pi](https://github.com/BubblePtr/awesome-pi) - 活跃的双语 Pi 包与生态资源目录。

<!-- resource:related-automated-directory -->

- [awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent) - 为广泛发现优化、自动且频繁刷新的目录。

<!-- resource:related-package-index -->

- [Pi Package Index](https://github.com/getpipher/pi-package-index) - 非官方每日 npm 索引，提供可搜索的维护元数据和公开 JSON API。

<!-- resource:related-ecosystem-wiki -->

- [pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki) - 架构、比较与生态综述；其中的二手说法应回查一手来源。

<!-- sync:root-contributing -->

### 贡献

提议实践、配方或生态线索前，请阅读[贡献指南](CONTRIBUTING.zh-CN.md)。贡献必须
解释给读者带来的结果，区分来源事实和直接执行，披露项目关系与 AI 辅助情况，
提供可复现证据，并同步更新两种语言。内容采用 CC0-1.0。

修改这个仓库本身时运行：

```bash
npm ci --ignore-scripts
npm run check
npm run check:awesome
```

这些检查验证文档、双语结构、注册表、研究数据、链接和校验器；它们不表示
Pi 配方已经实际执行。

<!-- sync:root-footnotes -->

### 注记

这是独立社区仓库，不由 Earendil Works 维护，也不隶属于 Earendil Works。Pi
和所链接项目名称归各自所有者。

动态包数量、模型服务商行为、模型目录和当前文档可能已在快照后变化。
旧资料可能使用 <code>badlogic/pi-mono</code>、 <code>earendil-works/pi-mono</code> 或 <code>@mariozechner/\*</code>；
遵循前应确认当前仓库、发布者、包命名空间、对等依赖和安装目标。

中央 Awesome 项目的
[列表创建指南](https://github.com/sindresorhus/awesome/blob/main/create-list.md)和
[当前 PR 模板](https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md)
拒绝 AI 生成的列表和完全由 AI 生成的 PR。本 AI 辅助预览必须经过实质性人工测试、
筛选、重写和双语审查，并达到要求的公开维护时间，才能诚实声称具备中央列表申请
资格。
