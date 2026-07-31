[English](./practice-guide.md) | [简体中文](./practice-guide.zh-CN.md)

# Pi 端到端实践指南

<!-- sync:practice-intro -->

这些实践把 Pi 刻意保持精简的 Coding Harness 变成可控、可重复的工作流。它们是
建议，并不表示 Pi 会强制执行这些行为。每条实践包含四部分：

- **原因**说明要避免的失败模式。
- **操作**给出可执行步骤。
- **验证**给出可观察的完成检查。
- **证据**链接到[证据台账](research/evidence-ledger.zh-CN.md)中的编号结论。

基线版本为 Pi v0.83.0；更新内容会标记为“仅 main”。

## 任务开始前

<!-- sync:practice-baseline -->

<a id="baseline-and-recovery"></a>

<!-- sync:P01 -->

### P01 — 固定并记录执行环境

**原因：**Pi、模型目录、Provider、Extension 和模型各自独立演进。“在 Pi 中
有效”不足以复现一次运行。

**操作：**

1. 记录 `pi --version`、`node --version`、操作系统、终端、工作目录、安装方式
   和目标仓库 commit。
2. 记录所选 `provider/model`、Thinking Level、Transport、允许的工具、加载的
   Package，以及是否批准项目资源。
3. 自动化场景中，把这些元数据保存在结果旁，而不只留在终端记录里。
   可从[运行清单模板](../templates/run-manifest.zh-CN.md)开始。

**验证：**另一位使用者无需询问“latest 是哪个版本”，就能重建命令并识别全部
版本敏感输入。

**证据：**[E01](research/evidence-ledger.zh-CN.md#e01)。

<!-- sync:P02 -->

### P02 — 从可恢复的版本控制状态开始

**原因：**Pi 的工具可以快速修改很多文件。预先存在的 Dirty Tree 会使归因与回滚
变得含糊。

**操作：**

1. 检查 `git status --short` 和当前分支。
2. Commit、Stash，或明确盘点预先存在的修改。
3. 对高风险或并行工作建立任务分支或 Worktree。
4. 明确要求保留用户已有修改。

**验证：**任务前 Diff 已知；只撤销 Agent 修改时不会丢失无关工作。

**证据：**[E02](research/evidence-ledger.zh-CN.md#e02)。

<!-- sync:practice-trust -->

<a id="trust-and-containment"></a>

<!-- sync:P03 -->

### P03 — 用 OS 边界隔离不可信或无人值守工作

**原因：**Pi 没有内建的文件、进程、网络、凭据或逐命令权限 Sandbox。它继承启动
账号的权限。

**操作：**在 Container、VM、Micro-VM、远程 Sandbox 或受策略控制的 Sandbox
中处理不可信仓库、生成代码及无人值守 Agent。只挂载任务文件、只暴露任务凭据，
并在可行时限制出站网络。

**验证：**在环境内部测试：无关 Home 文件、Credential Store、Host Socket 和
特权网络目标均不可访问。

**证据：**[E03](research/evidence-ledger.zh-CN.md#e03)。

<!-- sync:P04 -->

### P04 — 把 Project Trust 当作加载门，不是 Sandbox

**原因：**信任项目后，会加载项目设置和资源，并可能执行 Extension 或安装
Package。拒绝信任不会约束内建工具；除非关闭上下文加载，`AGENTS.md`/
`CLAUDE.md` 仍会进入模型上下文。

**操作：**

1. 批准前检查 `.pi/`、`.agents/skills/`、`.pi/settings.json` 与上下文文件。
2. 用 `--no-approve` 在本次运行拒绝受保护资源。
3. 当仓库指令也不可信或不相关时，再加 `--no-context-files`（`-nc`）。
4. 用 `/trust` 修改保存的决定后要重启；当前会话不会自动重载。

**验证：**运行 `pi --no-approve --no-context-files ...`，确认任务不依赖被跳过的
项目资源。

**证据：**[E04](research/evidence-ledger.zh-CN.md#e04)。

<!-- sync:P05 -->

### P05 — 最小化凭据、挂载和网络可达范围

**原因：**任何已加载 Extension、被调用的可执行文件或模型驱动工具，都能使用 Pi
进程的环境权限。“模型大概不会用”不是安全控制。

**操作：**使用范围受限、短期凭据；移除无关环境变量；尽可能只读挂载凭据；分离
个人账号与自动化账号；Allowlist 必需网络目标。不要把“禁用遥测”误解为“关闭
全部模型/Provider 出站流量”。

**验证：**枚举运行可见的环境和挂载路径；高风险试用后撤销或轮换任务凭据。

**证据：**[E05](research/evidence-ledger.zh-CN.md#e05)。

<!-- sync:P06 -->

### P06 — 引入 Package 前审查、固定并隔离试用

**原因：**Pi Package 可以捆绑可执行 Extension、会指导工具使用的 Skill，以及
npm 依赖。Git Package 的协调过程可能安装依赖，因此 Package 审查也是供应链
审查。

**操作：**

1. 阅读 Package Manifest、Pi 资源声明、Lockfile、Lifecycle Script、传递依赖
   和 Extension 入口。
2. 优先使用 Release Tag、精确 npm 版本或完整 Git Commit，而不是移动分支。
3. 用测试凭据在隔离、可丢弃环境中试用。
4. 记录已审查 Ref；若有制品完整性值，也一并记录。

**验证：**重新安装会解析到同一 Ref 与依赖图；试用能说明所有预期的文件、进程、
网络和凭据交互。

**证据：**[E06](research/evidence-ledger.zh-CN.md#e06)。

## 任务与上下文设计

<!-- sync:P07 -->

### P07 — 让分层上下文简洁、可审查

**原因：**Pi 会从全局、祖先目录和当前目录发现 `AGENTS.md` 或 `CLAUDE.md`。
过长或冲突的文件消耗上下文，也使指令优先级难以审计。

**操作：**把稳定的组织规则放在全局，把仓库约定放在根目录，把组件特定规则放在
相应代码附近。只写会改变任务执行方式的命令、约束、架构事实和定义。

**验证：**贡献者能解释目标文件适用哪些 Context File；每条指令对多个任务都
持续成立。

**证据：**[E07](research/evidence-ledger.zh-CN.md#e07)。

<!-- sync:P08 -->

### P08 — 以可测试的任务简报开始

**原因：**宽泛 Prompt 容易导致范围漂移，也会让“完成”变成主观判断。

**操作：**写明目标、当前行为、期望行为、范围内路径、范围外变更、约束、验收检查
和交付内容。可以使用[任务简报模板](../templates/task-brief.zh-CN.md)。

**验证：**每项修改都能映射到目标；完成与否可由已命名命令或可观察结果判断。

**证据：**[E08](research/evidence-ledger.zh-CN.md#e08)。

<!-- sync:P09 -->

### P09 — 先只读勘察，再扩大能力

**原因：**默认 Coding Tool 包括 `read`、`write`、`edit` 和 `bash`。在问题与
仓库形态尚不清楚时，没有必要过早修改。

**操作：**Review、Triage 与发现阶段从以下命令开始：

```bash
pi --no-approve --no-context-files --no-extensions --no-skills \
  --no-prompt-templates --no-themes --no-session \
  --tools read,grep,find,ls -p "梳理相关代码并提出检查方案。"
```

审阅地图后，另开可写运行，或有意识地扩大 Allowlist。Extension 可以用同名工具
覆盖内建工具，因此这个基线会关闭 Extension Discovery。Allowlist 约束注册到 Pi
的工具，不是包住 Extension Code 的 OS Sandbox。

**验证：**首轮不修改项目/仓库文件；写入阶段明确说明所需的最少新增能力。

**证据：**[E09](research/evidence-ledger.zh-CN.md#e09)。

<!-- sync:P10 -->

### P10 — 精确提供上下文，不让噪声进入模型记录

**原因：**宽泛发现、生成文件和超长命令输出会占据本应留给决策与相关代码的上下文。

**操作：**用 `@path` 明确指向相关文件，请求范围受限的读取；当本地检查输出不应
发给模型时使用 `!!command`。只总结真正影响任务的结果。绝不能用 `!!` 隐藏模型
推理所必需的证据。命令仍以本地用户权限运行，被排除的输出仍可能保留在 Session/
Export 中；`!!` 是上下文控制，不是 Secret Storage。

**验证：**Transcript 中是关键源码片段与结果，不是数千行无关输出。

**证据：**[E10](research/evidence-ledger.zh-CN.md#e10)。

<!-- sync:P11 -->

### P11 — 选择满足需求的最小能力原语

**原因：**Context File、Prompt Template、Skill、Extension、Package 与集成接口
回答的是三个不同问题。把它们排成一条能力阶梯，会混淆能力、分发方式与宿主所有权。
在同一轴内，运行时能力越强，代码执行、生命周期和升级表面积通常越大。

**操作：**分别做三项决定：

1. **能力轴：**稳定仓库指引用 `AGENTS.md`；显式展开的可复用文本用 Prompt
   Template；按需工作流、脚本或参考资料用 Skill；只有需要 Runtime Event、Tool、
   UI、Policy 或 Provider 时才用 Extension。
2. **分发轴：**本地所有权足够时，把资源保留在仓库或用户目录；只有选定资源需要
   npm、Git 或 Local Package 分发及生命周期管理时，才使用 Pi Package。
3. **集成轴：**有人监督的工作用 Interactive；一次性最终回答用 Print；单向消费
   Event 用 JSON；由外部进程控制用 RPC；由 TypeScript 进程内完全托管用 SDK。

常见组合包括：仓库审查使用 `AGENTS.md + Prompt Template`，团队分发工作流使用
`Skill + Package`，共享 Runtime Tool 使用 `Extension + Package`，Python
Controller 使用 RPC，TypeScript Host Application 使用 SDK。

**验证：**分别说明每个适用轴的选择理由；同一轴上权限更小的方案无法清晰表达需求。

**证据：**[E11](research/evidence-ledger.zh-CN.md#e11)。

## 任务执行中

<!-- sync:P12 -->

### P12 — 一个会话只承载一个连贯目标

**原因：**长生命周期会话不断积累假设、工具结果和 Compaction 摘要。不相关目标
会使后续推理与回滚难以解释。

**操作：**给重要 Session 命名；每个 Session 维持一个验收边界；当目标、风险
边界或交付物发生实质变化时，使用 `/new`、`/fork` 或 `/clone`。

**验证：**交付时，Session 标题与开场简报仍能描述全部范围内修改。

**证据：**[E12](research/evidence-ledger.zh-CN.md#e12)。

<!-- sync:P13 -->

### P13 — 有意识地区分 Steering 与 Follow-up

**原因：**Steering Message 会在当前 Assistant Turn 的工具调用结束后、下一次
模型调用前送达；Follow-up 会等到 Agent 没有更多 Tool Call 或 Steering 后再
送达。混淆二者会在错误阶段打断任务，或延迟紧急纠正。

**操作：**用 **Enter** Steering/替换当前方向；用 **Alt+Enter** 添加不应干扰
当前工作的后续任务。除非多条排队指令构成一个整体更新，否则保持
`one-at-a-time`。

**验证：**纠正指令在下一轮推理前生效，非紧急补充则等当前任务完成后执行。

**证据：**[E13](research/evidence-ledger.zh-CN.md#e13)。

<!-- sync:P14 -->

### P14 — 按不同意图使用 Tree、Fork 与 Clone

**原因：**三个操作看似相似，但 Provenance 不同：`/tree` 在一个 Session File
内切换 Active Branch；`/fork` 从较早 User Prompt 新建文件；`/clone` 把当前
Active Branch 复制到新文件。

**操作：**可逆探索使用 `/tree`；从早期决策点修改 Prompt 重试使用 `/fork`；
在独立继续前保留完整当前路径使用 `/clone`。

**验证：**新 Branch 或文件从预期决策点开始，原始版本仍可访问。另外检查文件系统
和 Git 状态：这些 Session 操作都不会恢复文件。

**证据：**[E14](research/evidence-ledger.zh-CN.md#e14)。

<!-- sync:P15 -->

### P15 — 在语义边界压缩，并把长期状态写入文件

**原因：**Compaction 是有损的。虽然 JSONL 文件保留原始 Entry，模型会从生成的
摘要和近期消息继续。

**操作：**手动 Compaction 前，完成一个连贯单元、运行相关检查，并把决策、
Invariant、未决问题和下一步写入版本控制文件。当默认摘要会遗漏领域状态时，为
`/compact` 提供自定义指令。

**验证：**Compaction 后让 Agent 复述约束和下一项检查，并与长期任务记录核对。

**证据：**[E15](research/evidence-ledger.zh-CN.md#e15)。

<!-- sync:P16 -->

### P16 — 导出或分享前清理 Session

**原因：**Session JSONL 与 HTML Export 可能包含 Prompt、文件内容、工具输出、
文件系统路径、模型元数据，以及命令意外打印的凭据。Share Link 会产生外部可访问
制品。

**操作：**检查源 Session 或 Export，移除 Secret 与私密数据，优先分享最小必要
片段，并理解所选分享服务的可见性和撤销方式。

**验证：**发送链接前，搜索 Credential Pattern、私有 Hostname、个人路径、内部
仓库名和敏感源码片段。

**证据：**[E16](research/evidence-ledger.zh-CN.md#e16)。

## 模型、Provider 与可靠性

<!-- sync:P17 -->

### P17 — 明确模型相关行为的适用范围并记录配置

**原因：**Tool Schema、Reasoning Block、Image、Context Window、Streaming、
费用统计和认证方式都会随 Provider 与模型而异。

**操作：**用显式 `provider/model`、Thinking Level、Transport、认证方式类别和
模型目录刷新时间复现问题。不要发布 Token 或账号标识。

**验证：**可以显式选择同一配置，并在模型目录中检查其能力。

**证据：**[E17](research/evidence-ledger.zh-CN.md#e17)。

<!-- sync:P18 -->

### P18 — 把跨 Provider Handoff 视为“尽力而为”

**原因：**Pi 会转换 Provider 之间的消息格式，但 Reasoning、Provider 特定
Metadata、Tool-call Convention 和不受支持内容并不总能无损往返。

**操作：**完成当前单元，把重要状态写入文件，再切换 Provider/Model。Fidelity
比连续性更重要时，新建或 Clone Session；重新测试 Provider 特定工具行为。

**验证：**新模型能复述任务，并通过小型 Tool-call Smoke Test，而不依赖隐藏的
Provider 状态。

**证据：**[E18](research/evidence-ledger.zh-CN.md#e18)。

<!-- sync:P19 -->

### P19 — 在能理解错误的层重试

**原因：**Pi 同时有 Agent-level Retry Policy 和可选 Provider/SDK Retry。
叠加两层会放大延迟，还可能让 Agent 看不到 Quota/Usage-limit Error。

**操作：**除非 Provider 特定场景确有需要，否则把 Provider Retry 保持为文档
默认值 `0`。限制 Agent Retry 次数、Backoff 和 Maximum Delay。重试前先区分
认证、额度、上下文溢出、超时、Transport 和确定性工具失败。

**验证：**强制失败会产生有限、可观察的重试序列，最终仍保留原始错误类别。

**证据：**[E19](research/evidence-ledger.zh-CN.md#e19)。

<!-- sync:P20 -->

### P20 — 限制命令，并为输出截断做设计

**原因：**长时间运行命令可能挂起任务，内建工具会截断大结果。看起来完整的片段
可能只是实际输出的 Head 或 Tail。

**操作：**使用工具自身的 Timeout、Filter、确定性 Sampling 和 Output File。
检查 Truncation Metadata 与 Continuation Hint。在上下文中只保留摘要，需要时
在外部保存完整日志。

**验证：**故意制造超大输出或停滞命令时，可以 Abort；工作流能找到完整结果或
请求下一段。

**证据：**[E20](research/evidence-ledger.zh-CN.md#e20)。

## Extension 与 Package

<!-- sync:P21 -->

### P21 — 先用指令原型验证，再写 Runtime Code

**原因：**很多看似需要 Extension 的需求，其实是可复用 Prompt 或流程知识。
Runtime Code 会新增进程内信任边界与兼容表面积。

**操作：**先用 Prompt Template 或 Skill 证明工作流。只有需要 Event、Custom
Tool、动态资源发现、Provider 注册或交互式 UI 时，才升级为 Extension。

**验证：**Extension 提案明确指出 Prompt/Skill 版本无法提供哪项 Runtime
能力。

**证据：**[E21](research/evidence-ledger.zh-CN.md#e21)。

<!-- sync:P22 -->

### P22 — 让 Extension 生命周期明确且幂等

**原因：**Extension Factory 在加载时运行；Session 可能 Start、Switch、Fork、
Reload Resource 或 Shutdown。泄漏的 Process、Listener、Timer 和临时文件会
在这些转换中累积。

**操作：**在 Factory 中只注册轻量 Handler；在 `session_start` 初始化
Session-bound Resource；处理 Mode/Session Switch；在 `session_shutdown`
清理。Setup 和 Cleanup 都应可安全重复调用。

**验证：**重复 Reload/Start/Shutdown 后，没有孤儿进程、重复 Handler、未关闭
Descriptor、过期状态或临时制品。

**证据：**[E22](research/evidence-ledger.zh-CN.md#e22)。

<!-- sync:P23 -->

### P23 — 构建诚实、有边界、可组合的自定义工具

**原因：**Tool Description 与 Schema 是模型的 API Contract。结果也会进入
上下文；除非声明顺序要求，工具可能并行执行。

**操作：**

1. 每个 Tool 只承担一个明确职责，Schema 精确；需要时使用闭合 String Enum。
2. 声明 Side Effect、Prerequisite、Failure Condition 和 Output Limit。
3. 顺序或共享可变状态有要求时标记为 Sequential。
4. 按行数/字节截断，并返回 Continuation Metadata 或完整输出路径。
5. 失败时 Throw，不返回看似成功的错误文本。

**验证：**测试合法、非法、并发、超大、取消和失败调用；确认模型能区分每种结果。

**证据：**[E23](research/evidence-ledger.zh-CN.md#e23)。

<!-- sync:P24 -->

### P24 — 把 Pi Package 当作可执行供应链制品设计

**原因：**Package Manifest 控制资源发现与依赖安装。错误依赖位置、宽泛 Glob
或移动 Ref 都会破坏 Consumer，甚至执行意外代码。

**操作：**只声明预期 Pi 资源；Runtime Import 放入 `dependencies`；兼容 Pi
Host API 采用文档指定的依赖形式；适用时提交 Lockfile；最小化 Lifecycle
Script；固定 Git Ref；记录安装、更新、移除、数据存储与回滚方式。

**验证：**在干净环境中对精确制品执行安装；分发方式支持时先用
`--ignore-scripts` 检查缺失能力，再做受控正常安装和 Smoke Test。

**证据：**[E24](research/evidence-ledger.zh-CN.md#e24)。

## 自动化与嵌入

<!-- sync:P25 -->

### P25 — 按所有权边界选择接口

**原因：**Interactive、Print、JSON、RPC 和 SDK 的生命周期与控制能力不同。
已有机器协议时解析 Terminal UI，会产生脆弱自动化。

**操作：**有人监督工作使用 Interactive；一次性最终答案使用 Print；消费 Event
使用 JSON；非 Node Controller 或替代 UI 使用 v0.83.0 已发布的 JSONL RPC；
由 TypeScript 进程完全托管 Runtime 时使用 SDK。Print/JSON Run 需要临时化时要
加 `--no-session`；仅仅使用非交互模式并不会自动停止保存 Session。

**验证：**集成消费有文档的机器接口，不抓取 ANSI Terminal Output。

**证据：**[E25](research/evidence-ledger.zh-CN.md#e25)。

<!-- sync:P26 -->

### P26 — 显式声明非交互策略并 Fail Closed

**原因：**Print、JSON 与 RPC 模式无法显示 Project Trust 提示。默认配置可能
静默跳过项目资源，或在全局配置允许时自动加载。

**操作：**显式传入 Trust Override、Tool Allowlist、Model、Working Directory、
Session Behavior 和 Context-file Choice。检查 Git Tree 与必需文件符合预期。
缺少资源、模型选择不明确或目标 Dirty 时应直接失败。

**验证：**同一命令在干净 User Profile 下行为一致；不可信资源或不满足的前置条件
会终止 Job。

**证据：**[E26](research/evidence-ledger.zh-CN.md#e26)。

<!-- sync:P27 -->

### P27 — 完整承担 SDK 与 RPC 生命周期

**原因：**嵌入后，Cancellation、Correlation、Cleanup、Credential、Session、
Backpressure 和 Error Propagation 都由 Host Application 负责。

**操作：**RPC 只能按 LF 分隔 JSON Line，把 Response 与异步 Event 分开，关联
Command，处理 Cancellation，并单独 Drain stderr。SDK 应取消订阅 Handler，
Dispose Session-owned Resource。两种方式都要固定 Coding-agent API 版本。

不要把 v0.83.0 已发布的 CLI RPC 与此后加入的 Framed-CBOR
`@earendil-works/pi-protocol` 混淆；后者是实验协议，且与前者不兼容。上游也
没有承诺已发布 CLI RPC 的长期兼容性，因此应固定 Pi 版本。

**验证：**自动化测试覆盖 Startup、Prompt、Streaming Event、Cancellation、
Malformed Input、Child Exit、Restart 与 Cleanup。

**证据：**[E27](research/evidence-ledger.zh-CN.md#e27)。

## 诊断、升级与贡献

<!-- sync:P28 -->

### P28 — 用隔离阶梯诊断

**原因：**Provider、Configuration、Session、Context、Extension、Package、
Terminal 与 Repository 故障在最终 UI 中常常很相似。

**操作：**保留失败样本，然后每次只改变一层：全新工作目录、Print 模式、显式
Model、Fresh Session、关闭 Context File、拒绝项目资源、关闭全部可选
Extension/Package、最小 Tool Allowlist、最小输入。随后每次只加回一个组件。

**验证：**一个受控改变可以稳定地开关故障，从而得到带脱敏日志的小型 Reproducer。

**证据：**[E28](research/evidence-ledger.zh-CN.md#e28)。

<!-- sync:P29 -->

### P29 — 通过固定、分阶段、可逆的路径升级

**原因：**Pi 演进很快，而 Configuration、Package、Extension、模型目录和
Provider 可能分别变化。

**操作：**阅读 Changelog 与 Migration Note；记录当前版本和设置；在可丢弃环境
更新；对模型、Session、Trust、核心 Tool 与每个 Extension 运行 Smoke Matrix；
再逐步发布。在验收通过前保留旧制品和配置备份。

**验证：**升级与回滚都经过演练；Smoke Matrix 记录精确的前后版本。

**证据：**[E29](research/evidence-ledger.zh-CN.md#e29)。

<!-- sync:P30 -->

### P30 — 经过人类复现与审查后再向上游贡献

**原因：**Pi 上游贡献门会自动关闭未经邀请的 Issue 和 PR，除非维护者标记为可
考虑。批量生成内容与含糊报告只增加维护成本，不能提供有效证据。

**操作：**在受支持 Release 或固定 Commit 上复现，缩小案例，搜索已有 Issue，
写简洁的人类作者报告，并遵循上游 `CONTRIBUTING.md` 门槛。绝不提交未经本人
逐条、逐行核验的模型输出。

**验证：**日志前的报告能在一屏内读完，包含精确环境和复现步骤；人类签署者可以
解释每项结论与修改。

**证据：**[E30](research/evidence-ledger.zh-CN.md#e30)。

<!-- sync:practice-after-task -->

## 任务结束后：闭合执行循环

完成编辑不等于完成任务。完成 P01–P30 后、报告成功前，执行下面的退出流程：

1. 重新阅读最初的结果、范围、保留规则和验收检查。把每项要求标成 `pass`、
   `fail` 或 `not run`；不要把跳过的检查合并成“全部通过”。
2. 先运行最相关的小范围检查，再运行更广的回归检查。记录精确命令、退出状态和
   简明结果。只有确有需要且能够安全保存时，才在模型上下文外保留完整日志。
3. 检查 `git status --short`、完整 Diff，以及未跟踪/生成文件。解释每项修改，
   并把任务修改与预先存在的工作分开。
4. 重新执行任务的安全/数据边界检查：意外文件、进程、网络请求、凭据使用、外部
   写入、Package 变化和持久状态，在解释清楚前都属于失败。
5. 在可丢弃副本或明确的检查点上演练回滚/恢复。不要为了证明回滚而破坏用户工作。
6. 把长期决策、不变量和后续工作从 Session 写入版本控制文件。Compaction 摘要或
   Chat 消息不是持久项目记录。
7. 脱敏需要保留的证据；删除临时制品，停止子进程，释放端口/锁，撤销试用凭据，
   并记录有意保留的内容。
8. 审查 Session、Export 和 Share 的处置：说明是否保存 Session、是否存在导出或
   链接、谁能访问，以及怎样过期或删除。
9. 生成一份统一交付记录，包含：结果、修改文件、检查和精确结果、版本/Ref、假设、
   跳过项、残余风险、清理、回滚和下一项人工决定。
10. 如果任务修改了可复用工作流，先用固定用例填写
    [评估记录](../templates/evaluation-record.zh-CN.md)，再宣布工作流已经改善。

| 阶段 | 最少持久产物 | 完成信号 |
| --- | --- | --- |
| 任务接收与基线 | [任务简报](../templates/task-brief.zh-CN.md)、Git 基线；版本敏感时另有[运行清单](../templates/run-manifest.zh-CN.md) | 所有者、结果、边界和恢复点明确。 |
| 勘察与计划 | 代码/资源地图、风险等级、能力/集成选择 | 每项计划动作都对应范围和验收检查。 |
| 受控执行 | 检查点记录、决策记录、修改路径清单 | 不依赖 Chat 记忆也能恢复或回滚工作。 |
| 验证 | 命令/结果矩阵、Diff 审查、安全/数据检查 | 必需门槛通过，每个跳过项都有所有者可见的理由。 |
| 交付与清理 | 结果摘要、残余风险、回滚和留存记录 | 另一位使用者能核验、运行或撤销结果。 |

必需检查失败时，正确结果是有边界的部分交付或失败报告，而不是乐观地宣称成功。
[完整示例](worked-example.zh-CN.md)提供一份已经填写、但明确标为未执行的完整记录；
[运行手册](operating-playbook.zh-CN.md)说明阶段闸门与升级规则。

<!-- sync:practice-definition-done -->

## 完成定义

一项谨慎的 Pi 任务在以下条件全部满足时才算完成：

- 请求结果与已命名验收检查通过；
- 最终 Diff 没有无关或无法解释的修改；
- Secret、生成制品和完整日志得到有意识的处理；
- 环境、模型、Tool、Trust 与 Package 假设已记录；
- 长期决定已经写入仓库文件；
- 风险、跳过的检查和版本敏感结论已披露；
- 回滚或恢复方式清楚。

检查失败时使用[故障排查手册](troubleshooting.zh-CN.md)；引入 Runtime
Customization 前使用[Extension 审查](extension-review.zh-CN.md)。
