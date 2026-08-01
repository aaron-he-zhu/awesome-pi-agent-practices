[English](./README.md) | [简体中文](./README.zh-CN.md)

# 文档地图

<!-- sync:docs-scope -->

本仓库是一份实践指南，不镜像 Pi 官方文档，也不再建设一个穷举式 Package
目录。它集中回答六个问题：

1. 谨慎的 Pi 用户在任务开始前、执行中和结束后应当做什么？
2. 一个工作流应当使用哪种 Pi 原语：上下文文件、提示词模板、Skill、
   Extension、Package、SDK、JSON 事件流还是 RPC？
3. 每条建议由什么证据支持，适用于哪个版本？
4. 维护者怎样评估社区材料，又不把列表变成未经审核的自动信息流？
5. 一个真实任务从开始到结束分别需要哪些阶段闸门、产物、负责人和停止条件？
6. 官方/社区能力有哪些已经覆盖、仍为空白、被暂缓，或仅仅是 Discovery Lead？

研究快照日期为 **2026-07-31**。稳定行为以 **v0.83.0**
（`845d6ff1…`）核验；来自发布后 `main` 的事实固定到 `9b50b046…`，并明确
标记。

<!-- sync:docs-reading-paths -->

## 按目标选择阅读路径

| 如果你想…… | 先读 | 再读 |
| --- | --- | --- |
| 从任务接收到清理完整运行一次任务 | [运行手册](operating-playbook.zh-CN.md) | [已填写完整示例](worked-example.zh-CN.md) |
| 按包含失败与清理分支的具体配方操作 | [场景手册](scenario-cookbook.zh-CN.md) | [故障排查](troubleshooting.zh-CN.md) |
| 在真实仓库中安全使用 Pi | [实践指南](practice-guide.zh-CN.md) | [故障排查](troubleshooting.zh-CN.md) |
| 理解 Pi 的组成 | [架构](architecture.zh-CN.md) | [官方来源地图](research/source-map.zh-CN.md) |
| 引入第三方 Package | [Extension 审查](extension-review.zh-CN.md) | [生态研究](research/landscape.zh-CN.md) |
| 把 Pi 嵌入其他程序 | [架构：集成模式](architecture.zh-CN.md#集成模式) | [实践指南：自动化](practice-guide.zh-CN.md#自动化与嵌入) |
| 验证本仓库的结论 | [研究方法](research/methodology.zh-CN.md) | [证据台账](research/evidence-ledger.zh-CN.md) |
| 复现带日期的动态数字 | [精确查询日志](research/query-log.zh-CN.md) | [生态全景](research/landscape.zh-CN.md) |
| 提议新实践 | [贡献指南](../CONTRIBUTING.zh-CN.md) | [实践模板](../templates/practice-proposal.zh-CN.md) |
| 查找生态目录 | [生态目录指南](research/ecosystem-directories.zh-CN.md) | [Extension 审查](extension-review.zh-CN.md) |
| 审计生态研究遗漏了什么 | [覆盖矩阵](research/coverage-matrix.zh-CN.md) | [研究方法](research/methodology.zh-CN.md) |

<!-- sync:docs-library -->

## 实践资料库

- [运行手册](operating-playbook.zh-CN.md) — R0–R3 风险等级、RACI、三轴决策、
  八个阶段闸门、并行/长任务控制、数据处置、验证、交付与清理。
- [场景手册](scenario-cookbook.zh-CN.md) — 十二个端到端配方，逐一给出
  前置条件、精确 v0.83.0 命令或 Host 伪代码、预期结果、失败分支、
  核验、清理、回滚与关联实践。
- [架构与决策指南](architecture.zh-CN.md) — 稳定层与实验层、资源加载、信任
  边界、运行时数据流、启动/资源加载、威胁模型、会话和集成模式。
- [端到端实践指南](practice-guide.zh-CN.md) — 三十条可复现实践，每条都包含
  原因、操作、验证和一手证据。
- [Extension 与 Package 审查](extension-review.zh-CN.md) — 引入前检查源码、
  依赖、权限、运行时、数据和维护状态。
- [故障排查手册](troubleshooting.zh-CN.md) — 面向 Provider、Extension、终端、
  会话和安装问题的最小复现阶梯。
- [术语表](glossary.zh-CN.md) — 澄清容易混淆的 Pi 专用概念。
- [已填写完整示例](worked-example.zh-CN.md) — 一份虚构且明确标为未执行的记录，
  展示命令、预期/实际证据、失败分支、回滚和交付，不冒充亲测结果。

<!-- sync:docs-research -->

## 研究资料库

- [研究方法与收录政策](research/methodology.zh-CN.md) — 来源分级、搜索覆盖、
  评分、排除项、局限性和更新步骤。
- [生态与 Issue 全景](research/landscape.zh-CN.md) — 定量快照、反复出现的问题簇
  和实践机会图。
- [生态覆盖矩阵](research/coverage-matrix.zh-CN.md) — 官方 Surface 与社区能力类别，
  逐项给出当前证据、边界、明确缺口、发现方法和晋级工作。
- [发现协议](research/discovery-protocol.zh-CN.md) — 可重放 Query、Identity、
  Relationship、Disposition、安全与分层抽样规则。
- [机器生成的覆盖摘要](research/coverage-summary.zh-CN.md) — 从机器数据推导
  Reviewed、Hands-on、Deferred、Candidate、Category 与 Architecture Count。
- [生态发现目录](research/ecosystem-directories.zh-CN.md) — Official、Curated、
  Automated、Synthesized 与 Historical Discovery Surface，以及选择和核验边界。
- [精确查询日志](research/query-log.zh-CN.md) — 保存该日期快照的 Endpoint、
  Query String、Immutable Ref、Capture Limit 与重跑步骤。
- [官方来源地图](research/source-map.zh-CN.md) — 按问题分组、固定版本的一手链接。
- [证据台账](research/evidence-ledger.zh-CN.md) — 每条编号实践与来源之间的可追溯关系。
- [社区观察名单](research/watchlist.zh-CN.md) — 已完成源码层审阅、但在成为正式
  推荐前仍需维护者亲自试用的候选项目。

<!-- sync:docs-artifacts -->

## 运行产物

| 产物 | 用途 | 不应混淆为 |
| --- | --- | --- |
| [任务简报](../templates/task-brief.zh-CN.md) | 结果、范围、保留规则、验收与交付。 | 授予更广权限的模型 Prompt。 |
| [运行清单](../templates/run-manifest.zh-CN.md) | 版本、模型、资源、策略、隔离和结果来源。 | 存放凭据值或完整私密日志的地方。 |
| [仓库指令](../templates/AGENTS.zh-CN.md) | 靠近所约束代码、稳定且可审查的命令与规则。 | Sandbox 或单次任务计划。 |
| [实践提案](../templates/practice-proposal.zh-CN.md) | 新指引的 Claim、证据、试验与双语审查。 | 实践已经执行的证明。 |
| [亲测审查](../templates/hands-on-review.zh-CN.md) | 固定第三方制品的 Source、Authority、Data Flow 与行为审查。 | 安全认证或自动 Featured 状态。 |
| [评估记录](../templates/evaluation-record.zh-CN.md) | 固定用例、命令/预期/实际/证据、门槛、指标、成本、回滚与人类确认。 | 把空白评分表、CI Badge 或 AI 摘要当成观察证据。 |

把已完成记录保存在项目中可审查、命名稳定的位置，并从其支持的决定或 Registry
条目链接过去。不要用项目结果覆盖空白模板。

<!-- sync:docs-status -->

## 证据状态

每条重要陈述都应当属于以下一种状态：

- **稳定（Stable）** — 已在 v0.83.0 文档或 tag 源码中核验。
- **仅 main（Main-only）** — 在 v0.83.0 之后、固定的 `main` commit 中观察到；
  不能视为稳定版承诺。
- **实验性（Experimental）** — 上游明确说明接口不稳定。
- **社区（Community）** — 有公开第三方来源支撑，但不是 Pi 维护者的承诺。
- **推论（Inference）** — 从多项来源导出的建议；基础事实有引用，推论会明确标记。

Stars、下载量、Issue 数、目录规模等动态数字只进入带日期的研究快照，不进入推荐
理由。

<!-- sync:docs-bilingual -->

## 双语维护

英文文件使用 `.md`，简体中文对应文件使用 `.zh-CN.md`。隐藏的 `sync:` 标记
标识对等章节与实践编号。运行：

```bash
npm ci --ignore-scripts
npm run check
```

若缺少语言对应文件、同步标记不一致，或机器可读资源注册表与两份根 README
不一致，检查会失败。双语一致指事实和范围等价，不要求逐句保持相同语序。
