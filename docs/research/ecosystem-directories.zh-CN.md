[English](./ecosystem-directories.md) | [简体中文](./ecosystem-directories.zh-CN.md)

# Pi 生态发现目录

审查日期：**2026-07-31，Asia/Singapore**。Live Directory 会独立变化；下文同时
链接不可变审查快照。

<!-- sync:directories-purpose -->

## 用途与边界

Pi 已经拥有多个有价值的 Discovery Surface。本指南直接链接这些入口，解释各自
擅长什么，并保留足够的状态信息，帮助读者做选择。

Directory Entry 只是线索，不是背书。Catalog 收录、Star、下载量、Generated
Description 或 `awesome` 标签，都不能证明 Source Identity、当前 Pi
Compatibility、Runtime Authority 安全或 Hands-on Quality。应先用 Directory
发现候选，再到 Canonical Source 独立核验。

本仓库不复制这些 Catalog。它的独立职责是记录可复现操作实践、证据、Trust
Boundary、Verification 与 Rollback。

<!-- sync:directories-chooser -->

## 快速选择

| 目标 | 优先打开 | 原因 | 重要限制 |
| --- | --- | --- | --- |
| 浏览广泛的 npm 发布生态 | [Pi 官方 Package Catalog](https://pi.dev/packages) | First-party Discovery UI，提供 Package Page、Install Command、Source/npm Link 与 Resource-type Filter。 | Catalog 收录不代表本仓库完成了 Source、Security、Compatibility 或 Hands-on Review。 |
| 从较小的双语精选开始 | [BubblePtr/awesome-pi](https://github.com/BubblePtr/awesome-pi) | 人工组织的中英文 Package/Resource 分类。 | Manual Selection 与 Description 仍需独立核验。 |
| 尽量覆盖广度与新鲜度 | [shaftoe/awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent)或其[可搜索网站](https://awesome-pi.site/) | 每日自动 Discovery、Classification 与 Rendering。 | Automated、LLM-reviewed Classification 可能包含 Noise、Adjacent Project 与过时 Metadata。 |
| 搜索或以程序消费 Package Metadata | [Pi Package Index](https://pi-package.rectorspace.com/)及其[JSON API](https://pi-package.rectorspace.com/api/packages) | 每日 npm Index，并用 GitHub 与 Maintenance Signal 补充。 | 它是非官方自动索引；Ranking Input 不是 Quality/Security Evidence。 |
| 比较不同架构方案 | [micuintus/pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki) | Topic Survey、Comparison、Navigation 与“How to pick”说明。 | 它是面向 LLM 的 Synthesis；Secondary Claim 需回到一手来源核验。 |
| 理解早期生态历史 | [qualisero/awesome-pi-agent](https://github.com/qualisero/awesome-pi-agent) | 保留较早的列表及其退役说明。 | 仓库已归档，并明确自述已经过时。 |

若这些入口都找不到项目，可以把
[GitHub `pi-agent` Topic](https://github.com/topics/pi-agent)作为 Raw Fallback。
Topic 由仓库自行标注，既不完整，也不是 Curated List。

<!-- sync:directories-official -->

## 官方 Catalog Filter

可以直接打开所需的 Resource Type：

- [全部 Package](https://pi.dev/packages)
- [Extension](https://pi.dev/packages?type=extension)
- [Skill](https://pi.dev/packages?type=skill)
- [Theme](https://pi.dev/packages?type=theme)
- [Prompt Template](https://pi.dev/packages?type=prompt)

一个 Package 可以声明多种 Resource Type，因此 Filter View 可能重叠。官方
Catalog 是浏览 npm 发布生态广度的最佳起点；Git Package、Local Package、
Example 与 Ecosystem Tool 可能只出现在社区目录。

安装、Source、Manifest、Dependency 与制作行为参考官方
[Packages 文档](https://pi.dev/docs/latest/packages)，Extension API 与生命周期参考
[Extensions 文档](https://pi.dev/docs/latest/extensions)。这些页面说明机制怎样工作，
并不是独立的社区目录。在审查日，Extension Discovery 使用 Catalog 的
`type=extension` Filter，而不是另一个顶层 Extension Catalog。

<!-- sync:directories-current -->

## 当前社区导航

以下四个来源采用不同的导航模式，并且在审查日仍有独立的当前价值，因此保留在根
[相关列表](../../README.zh-CN.md#相关列表)中。

| Directory | 审查时的更新模式 | License | 最适合 | 审查快照 |
| --- | --- | --- | --- | --- |
| [awesome-pi](https://github.com/BubblePtr/awesome-pi) | Maintainer Curated、双语且近期有实质更新。 | CC0-1.0 | 按 Use Case 分类的精简中英文清单。 | [`64bc5f2…`](https://github.com/BubblePtr/awesome-pi/commit/64bc5f217272110ba9602ea735197678ede52b17) |
| [awesome-pi-coding-agent](https://github.com/shaftoe/awesome-pi-coding-agent) | 每日调度的 Automated Discovery-to-render Pipeline。 | MIT | 广泛、较新的 Package/Repository Discovery，以及对索引名称、描述与分类的站内搜索。 | [`ec09125…`](https://github.com/shaftoe/awesome-pi-coding-agent/commit/ec0912594a01cabea416d6186afe13d2ebb4d9ca) |
| [Pi Package Index](https://github.com/getpipher/pi-package-index) | 每日 npm/GitHub Metadata Pipeline，提供可搜索 Web UI 与 Public API。 | MIT | Package Filtering、Machine-readable Indexing 与 Maintenance-signal Triage。 | [`115a35b…`](https://github.com/getpipher/pi-package-index/commit/115a35bf0dc467db7f30a4a3fd3de740f7dadd8f) |
| [pi-ecosystem-wiki](https://github.com/micuintus/pi-ecosystem-wiki) | 围绕 Ecosystem Question 与 Comparison 组织的 LLM-wiki 页面。 | MIT | 理解 Category、Alternative、Architectural Pattern 与 Selection Question。 | [`8cc9e98…`](https://github.com/micuintus/pi-ecosystem-wiki/commit/8cc9e98e8c6f2574859482a9655b4d4479ab3988) |

这里的“当前”仅表示在审查日适合作为活跃 Discovery 入口；不表示其中每个链接条目
都仍在维护、兼容、安全或经过亲测。表中 License 只覆盖相应 Directory 的内容或
代码，不会改变被链接项目各自的 License。

Package Scope 不等于 Publisher Identity：Unscoped npm Name 不能证明 Package 由
Earendil Works 维护。应核对 npm Publisher、Repository、Manifest 与 Release
Provenance，不要继承社区列表给出的“Official”标签。

<!-- sync:directories-context -->

## 历史与未通过晋级的列表

已退役列表保留历史；其他链接记录已经审查、但未达到当前导航门槛的不同 Catalog
Design。

| Directory | 2026-07-31 观察状态 | License | 适合学习 | 为何不进入根导航 |
| --- | --- | --- | --- | --- |
| [qualisero/awesome-pi-agent](https://github.com/qualisero/awesome-pi-agent) | GitHub 已归档；README 明确表示列表已经退役且过时。 | MIT | 历史项目名称、Category 与 List Lineage。 | 不能作为当前 Compatibility Source。[审查快照 `d2ffdd4…`](https://github.com/qualisero/awesome-pi-agent/commit/d2ffdd4433fc4f64a59c8ffbb9a344a32ee669a7)。 |
| [Traveler0014/awesome-pi-agent](https://github.com/Traveler0014/awesome-pi-agent) | 采用 Structured YAML Registry 与 Generated README，但 Scheduled Metadata Updater 在审查时失败，内容没有越过六月初始快照。 | License File 为 MIT；README Metadata 不一致。 | 学习 Schema-backed Generated Extension List Design。 | Refresh 失败、Upstream Path 过时且 Metadata 不一致。[审查快照 `9f62023…`](https://github.com/Traveler0014/awesome-pi-agent/commit/9f62023d73073dccb431201a06be5aee9e925aa3)。 |
| [afoofaa/awesome-pi-mono](https://github.com/afoofaa/awesome-pi-mono) | 五月完成 Seed，审查时没有后续实质更新。 | MIT | 比较较早的 Manual Category List Layout。 | 没有持续维护、Upstream Path 过时，初始 Link Check 失败。[审查快照 `fa37800…`](https://github.com/afoofaa/awesome-pi-mono/commit/fa3780084c90244ac88154d087146f6e734f6117)。 |

空仓库、名称中含 `awesome` 的单一 Extension、个人配置仓库与泛 AI-agent List
均被排除，因为它们没有提供独立且有用的 Pi 生态目录。

[Leoguy77/pi-packages.nix](https://github.com/Leoguy77/pi-packages.nix)也作为
专用 Nix-native Generated Registry 接受了筛查。它仍活跃且技术上有研究价值，但
不是通用 Awesome Directory。在
[审查快照 `ab97786…`](https://github.com/Leoguy77/pi-packages.nix/commit/ab977868c85409142df3c7dc1b3e98281dde5617)，
README 声明 MIT，但 Tree 中没有独立 License File，GitHub 也未识别 SPDX
License。同一 README 记录了可能关闭 Nix Sandbox 与 TLS Verification 的
Fallback/Build Path。应把它视为 Supply-chain Research Lead，而不是通用
Discovery Recommendation。

<!-- sync:directories-workflow -->

## 把发现结果转成可审查决策

对每个从 Catalog/List 找到的候选：

1. 打开 Canonical Source Repository，确认 Package Name、Owner、Install Target
   与所链接 npm Identity 一致。
2. 记录计划使用的 Pi Version、Runtime、Platform、Provider/Model、Package
   Version，以及精确 Git Tag 或 Commit。
3. 检查 Manifest、Install/Lifecycle Script、Direct/Transitive Dependency、
   Native Binary、Network Destination、Data Retention 与 License。
4. 绘制 Runtime Authority。Pi Extension 在进程内执行，也能使用普通 Process
   API；仅有 Tool Allowlist 并不是完整 Sandbox。
5. 使用非生产 Credential 与有代表性的测试数据，在 Disposable 或 OS-contained
   Environment 中运行固定 Artifact。
6. 记录 Expected/Actual Result、Cleanup、Residual File/Service 与
   Expiration/Retest Trigger。

详细检查使用 [Extension 与 Package 审查](../extension-review.zh-CN.md)。已完成
Source Review、但仍需具名人类亲测的 Candidate，放在独立的
[社区观察名单](./watchlist.zh-CN.md)中。

<!-- sync:directories-linking -->

## 外链与索引实践

本仓库引用其他 Directory 时：

- 链接其 Canonical Repository 或 Official Site，不复制其中条目；
- 说明它是 Official、Human-curated、Automated、Synthesized、Screened-out、
  Context-only 还是 Archived；
- 做状态判断时保留上游 License 与不可变 Reviewed Commit；
- 解释该 Directory 的独立价值与主要 Verification Limit；
- 不要求互链，也不暗示 Affiliation 或 Endorsement。

这样既能给维护者提供有用的 Outbound Discovery Link，也能让 Search Engine 与
读者抵达原始 Source、Contribution Rule、History 与 License。

<!-- sync:directories-method -->

## 搜索与维护说明

本轮审查结合了 Official Catalog、现有 Directory 互相引用、GitHub
Repository/Topic Search、Repository Metadata、README/License Inspection、
Commit History 与 Automation Status。代表性 Repository Query 包括：

```text
"pi coding agent" awesome in:name,description,readme
"pi package" directory "pi.dev" in:readme
awesome pi coding agent
```

Search Result 与 Repository State 是动态的，因此这是有边界的 Inventory，不是
“不存在其他列表”的断言。每次刷新 Research Snapshot 时：

1. 重跑 Discovery，并检查新的同名 Repository。
2. 重新检查 Archive State、License、最近实质 Commit 与 Scheduled Automation
   Result。
3. 根 Related Lists 只保留独立、当前且有用的来源。
4. 退役、停滞或未通过门槛的 Directory 移到 Historical/Screened-out Status，
   同时保留其历史。
5. 同时更新两种语言与机器可读 Resource Registry。

更广泛的带日期证据见[生态全景](./landscape.zh-CN.md)、
[精确查询日志](./query-log.zh-CN.md)与
[研究方法](./methodology.zh-CN.md)。
