[English](./query-log.md) | [简体中文](./query-log.zh-CN.md)

# 研究查询日志

<!-- sync:query-purpose -->

本日志使[生态全景](./landscape.zh-CN.md)中的带日期数字可复现。机器可读记录位于
[`data/research-snapshot-2026-07-31.json`](../../data/research-snapshot-2026-07-31.json)。
保存的数字是历史观察，不是对移动 Endpoint 当前结果的断言。

快照日期：**2026-07-31，Asia/Singapore**。Registry 与 Query Record 于
`2026-07-31T15:56:32+08:00` 完成定稿。各 Dynamic Request 在同一次带日期的
研究过程中发出；首轮没有为每个请求保存单独的精确时间戳。

## GitHub 仓库元数据

<!-- sync:query-github-repo -->

Endpoint：

```text
GET https://api.github.com/repos/earendil-works/pi
```

等价的已认证命令：

```bash
gh api repos/earendil-works/pi \
  --jq '{stars: .stargazers_count, forks: .forks_count, subscribers: .subscribers_count, open_issues_field: .open_issues_count}'
```

| 字段 | 保存值 | 解释 |
| --- | ---: | --- |
| `stargazers_count` | 81,068 | Stars；只能作为流行度信号。 |
| `forks_count` | 10,008 | Repository-network Fork，不是活跃 Maintainer。 |
| `subscribers_count` | 273 | 显式 Watcher/Subscriber。 |
| `open_issues_count` | 83 | GitHub 的 Open Issue + Open PR 合并元数据字段：本快照为 71 + 12。 |

不要把 `watchers_count` 标为显式 Watcher：GitHub 会把它作为 Star Count 的别名。
显式 Watch 应使用 Subscriber Field。

## GitHub Issue 与 Pull-request 总量

<!-- sync:query-github-totals -->

Endpoint：

```text
GET https://api.github.com/search/issues?q={URL-encoded query}
```

保存值为 Response 的 `total_count`；没有尝试获取全部 Result。任一行可这样重跑：

```bash
gh api -X GET search/issues \
  -f q='repo:earendil-works/pi is:issue is:open' \
  --jq '.total_count'
```

| ID | 精确 Query | 保存的 `total_count` |
| --- | --- | ---: |
| Issue Total | `repo:earendil-works/pi is:issue` | 4,579 |
| Open Issue | `repo:earendil-works/pi is:issue is:open` | 71 |
| Closed Issue | `repo:earendil-works/pi is:issue is:closed` | 4,508 |
| Pull Request Total | `repo:earendil-works/pi is:pr` | 2,485 |
| Open Pull Request | `repo:earendil-works/pi is:pr is:open` | 12 |
| Closed Pull Request | `repo:earendil-works/pi is:pr is:closed` | 2,473 |

算术检查为 `4,579 = 71 + 4,508`、`2,485 = 12 + 2,473`，GitHub Repository
`open_issues_count = 71 + 12 = 83`。

## GitHub 关键词簇

<!-- sync:query-github-clusters -->

每行使用同一个 Search Issues Endpoint，并只保存 `total_count`。以下 Term 与
大小写是实际提交的完整 Query String。

| 搜索簇 | 精确 Query | 保存的 `total_count` |
| --- | --- | ---: |
| Provider / Model | `repo:earendil-works/pi is:issue provider OR model` | 2,272 |
| Authentication / Login / OAuth | `repo:earendil-works/pi is:issue auth OR login OR OAuth` | 490 |
| Extension | `repo:earendil-works/pi is:issue extension` | 1,563 |
| Package / Install / Update | `repo:earendil-works/pi is:issue package OR install OR update` | 2,478 |
| Session | `repo:earendil-works/pi is:issue session` | 1,534 |
| Compaction | `repo:earendil-works/pi is:issue compact OR compaction` | 415 |
| Windows / WSL | `repo:earendil-works/pi is:issue Windows OR WSL` | 304 |
| Terminal / TUI | `repo:earendil-works/pi is:issue terminal OR TUI` | 1,061 |
| Timeout / Retry / Hang | `repo:earendil-works/pi is:issue timeout OR retry OR hang` | 530 |
| Sandbox / Security / Permission | `repo:earendil-works/pi is:issue sandbox OR security OR permission` | 211 |

这些集合互相重叠，既不是 Issue Taxonomy，也不是占比。GitHub 可在 1,000 条结果
获取上限之外给出 `total_count`，但这不表示可以完整抽样全部结果。Search
Stemming、Index Update、Issue 编辑、新建/关闭都能在 Pi 没有发布新版本时改变
数字。

## Pi Package Catalog

<!-- sync:query-catalog -->

Package Catalog 由 Server Render。每个准确 URL 的数字取自可见
`.packages-count` 文本：

| View | 精确 URL | 保存的可见数字 |
| --- | --- | ---: |
| All | `https://pi.dev/packages` | 5,351 |
| Extension | `https://pi.dev/packages?type=extension` | 3,059 |
| Skill | `https://pi.dev/packages?type=skill` | 360 |
| Theme | `https://pi.dev/packages?type=theme` | 109 |
| Prompt | `https://pi.dev/packages?type=prompt` | 78 |

一种可复现的提取方式：

```bash
curl -fsSL 'https://pi.dev/packages?type=extension' |
  rg -o 'packages-count">[^<]+'
```

Filter Count 会重叠，因为一个 Package 可声明多个 Resource Type。npm Publish/
Unpublish 或 Catalog Reconciliation 后，Rendered Count 都可能改变。

## Release、Source、Registry 与 RFC 检查

<!-- sync:query-primary -->

| 结论 | Endpoint 或命令 | 保存结果 |
| --- | --- | --- |
| Stable Release Identity | `GET https://api.github.com/repos/earendil-works/pi/releases/tags/v0.83.0` | 发布时间 `2026-07-29T22:30:33Z`；Tag Commit `845d6ff1f6643aba440341cce877ce1c43ebbc39`。 |
| Research Head | 带日期 Clone 中的 `git rev-parse main` | `9b50b046d328d589a81400d2e184175d0bf19734`。 |
| Ahead Commit | `git rev-list --count 845d6ff1f6643aba440341cce877ce1c43ebbc39..9b50b046d328d589a81400d2e184175d0bf19734` | 56。 |
| Source Archive | 下载 Release Asset 后运行 `shasum -a 256 pi-0.83.0-source.tar.gz` | `f225b87ec3b4825dd5b94e922a8629558addca31a1b4d2c206ae598a8e2692c0`。 |
| Pi RFC Index | `https://rfc.earendil.com/keyword/pi/` | 9 个可见 Pi-related Entry，状态不同。 |
| npm Package Metadata | `npm view {exact-package}@0.83.0 --json` | 只用于检查 Package Publication/Engine；行为仍以 Tag Source 为准。 |

Release Time、Commit Time、Changelog Date 与本地日期可以不同。应保留原始 Timestamp
与 Time Zone，不要压平为一个含糊的 Calendar Date。

## 社区源码审查 Ref

<!-- sync:query-community -->

Snapshot 分开记录 Community Population、Evidence Stage、Disposition 与 Immutable
Ref Coverage：

| Snapshot Field | Value | 解释 |
| --- | ---: | --- |
| `communityResources` | 15 | Registry 中 `kind` 为 `community` 的全部 Record。 |
| `sourceReviewed` | 12 | `reviewStatus` 为 `source-reviewed` 的 Record。 |
| `reviewedResources` | 12 | `sourceReviewed` 的兼容 Alias，不表示 Community 总量。 |
| `handsOnVerified` | 0 | `reviewStatus` 为 `hands-on-verified` 的 Record。 |
| `deferred` | 3 | Curation `status` 为 `deferred` 的 Record。 |
| `pinnedRefs` | 15 | 具有完整 40 位 `reviewedRef` 的 Community Record。 |

12 个 Source-reviewed Watchlist 与三个 Deferred Repository 在
[`data/resources.json`](../../data/resources.json)中都有完整 Ref。Watchlist 同时
链接移动的 Repository 与不可变 Reviewed Tree。可这样验证保存的 Ref：

```text
GET https://api.github.com/repos/{owner}/{repo}/commits/{reviewedRef}
```

该 Ref 证明审查了哪个 Source State；它不会把 Source Review 变成 Install、
Runtime Test、Security Certification 或 Endorsement。

## 人工抽样局限

<!-- sync:query-sampling -->

首轮使用 Recent/High-signal Search Result 综合定性 Failure Shape，但**没有**保存
固定 Sample Size、Sort Order 或 Issue-ID Sample。因此：

- 人工抽样结果不用于任何定量结论；
- Failure Shape 被标为 Synthesis，不是 Frequency Estimate；
- 首轮 Sample 无法精确复现；
- 未来快照在提出抽样结论前，必须记录 Order、Sample Size、Selection Rule 与
  Sampled ID。

探索性 GitHub Repository Search 只用于发现。已选 Community Source State 可由
`reviewedRef` 重建；Search Funnel 不是完整性声明。

这一局限仍属于历史 2026-07-31 Snapshot。[发现运行 Ledger](../../data/discovery-runs.json)
中首批 13 条 Gap Lead 被明确标记为 `reconstructed-non-replayable`：它把新规范化线索
链接到[候选注册表](../../data/discovery-candidates.json)，但没有保存原始 Query、
Ranking、被过滤结果与分母，因此不能修复历史抽样缺口。从新定时 Artifact 导出的已审
Ledger Import 与新的人工运行遵循[发现协议](discovery-protocol.zh-CN.md)：导入前保存
Raw Result Identifier 与顺序，并为每条结果记录 Candidate Mapping 或明确
Disposition。定时 Probe Artifact 本身只是 Pre-triage Signal，不自动成为 Ledger Run；
经过审查的导入还必须补全 Run-level Status/Error/Attempt Metadata 与逐结果
Normalization Contract。

## 重跑与保存协议

<!-- sync:query-rerun -->

1. 把当前 Snapshot JSON 复制到新日期；绝不覆盖历史 Snapshot。
2. 记录 `capturedOn`、Time Zone、Finalization Time、Stable Tag、Stable Commit
   与 Research `main` Commit。
3. 重跑每个精确 Endpoint/Query，同时保留旧数字与新数字。
4. 生态发现保存精确 Query、Client/Endpoint、Sort、Page/Cursor、Limit、返回顺序中
   的每个 Raw Result Identifier、Redirect/Alias、Error 与 Truncation Boundary。
5. 把每条 Raw Result 映射到稳定 Candidate ID，或明确的 Duplicate、Rejected、
   Deferred、Out-of-scope Disposition；绝不静默丢弃。
6. 定性 Issue 抽样保存 Ordering、Sample Size、Selection Rule 与 Issue ID。
7. 阅读结论前把每个 Community Default Branch 解析成完整 Commit；只有审查 Diff
   后才更新 `reviewedRef`。
8. 运行 `npm run generate:coverage`，再同时更新 English/Chinese Text。
9. 运行 `npm run check`；它会交叉检查 Snapshot、Candidate/Reviewed Registry、
   机器生成的类别/架构覆盖、两份 Landscape 与 Watchlist Immutable Link。
