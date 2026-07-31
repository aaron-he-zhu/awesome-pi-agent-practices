[English](./README.md) | [简体中文](./README.zh-CN.md)

# 文档地图

<!-- sync:docs-scope -->

本仓库是一份实践指南，不镜像 Pi 官方文档，也不再建设一个穷举式 Package
目录。它集中回答四个问题：

1. 谨慎的 Pi 用户在任务开始前、执行中和结束后应当做什么？
2. 一个工作流应当使用哪种 Pi 原语：上下文文件、提示词模板、Skill、
   Extension、Package、SDK、JSON 事件流还是 RPC？
3. 每条建议由什么证据支持，适用于哪个版本？
4. 维护者怎样评估社区材料，又不把列表变成未经审核的自动信息流？

研究快照日期为 **2026-07-31**。稳定行为以 **v0.83.0**
（`845d6ff1…`）核验；来自发布后 `main` 的事实固定到 `9b50b046…`，并明确
标记。

<!-- sync:docs-reading-paths -->

## 按目标选择阅读路径

| 如果你想…… | 先读 | 再读 |
| --- | --- | --- |
| 在真实仓库中安全使用 Pi | [实践指南](practice-guide.zh-CN.md) | [故障排查](troubleshooting.zh-CN.md) |
| 理解 Pi 的组成 | [架构](architecture.zh-CN.md) | [官方来源地图](research/source-map.zh-CN.md) |
| 引入第三方 Package | [Extension 审查](extension-review.zh-CN.md) | [生态研究](research/landscape.zh-CN.md) |
| 把 Pi 嵌入其他程序 | [架构：集成模式](architecture.zh-CN.md#集成模式) | [实践指南：自动化](practice-guide.zh-CN.md#自动化与嵌入) |
| 验证本仓库的结论 | [研究方法](research/methodology.zh-CN.md) | [证据台账](research/evidence-ledger.zh-CN.md) |
| 复现带日期的动态数字 | [精确查询日志](research/query-log.zh-CN.md) | [生态全景](research/landscape.zh-CN.md) |
| 提议新实践 | [贡献指南](../CONTRIBUTING.zh-CN.md) | [实践模板](../templates/practice-proposal.zh-CN.md) |
| 查找生态目录 | [相关列表](../README.zh-CN.md#相关列表) | [研究观察名单](research/watchlist.zh-CN.md) |

<!-- sync:docs-library -->

## 实践资料库

- [架构与决策指南](architecture.zh-CN.md) — 稳定层与实验层、资源加载、信任
  边界、会话和集成模式。
- [端到端实践指南](practice-guide.zh-CN.md) — 三十条可复现实践，每条都包含
  原因、操作、验证和一手证据。
- [Extension 与 Package 审查](extension-review.zh-CN.md) — 引入前检查源码、
  依赖、权限、运行时、数据和维护状态。
- [故障排查手册](troubleshooting.zh-CN.md) — 面向 Provider、Extension、终端、
  会话和安装问题的最小复现阶梯。
- [术语表](glossary.zh-CN.md) — 澄清容易混淆的 Pi 专用概念。

<!-- sync:docs-research -->

## 研究资料库

- [研究方法与收录政策](research/methodology.zh-CN.md) — 来源分级、搜索覆盖、
  评分、排除项、局限性和更新步骤。
- [生态与 Issue 全景](research/landscape.zh-CN.md) — 定量快照、反复出现的问题簇
  和实践机会图。
- [精确查询日志](research/query-log.zh-CN.md) — 保存该日期快照的 Endpoint、
  Query String、Immutable Ref、Capture Limit 与重跑步骤。
- [官方来源地图](research/source-map.zh-CN.md) — 按问题分组、固定版本的一手链接。
- [证据台账](research/evidence-ledger.zh-CN.md) — 每条编号实践与来源之间的可追溯关系。
- [社区观察名单](research/watchlist.zh-CN.md) — 已完成源码层审阅、但在成为正式
  推荐前仍需维护者亲自试用的候选项目。

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
