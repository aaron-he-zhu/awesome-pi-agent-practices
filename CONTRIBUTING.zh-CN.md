[English](CONTRIBUTING.md) | [简体中文](CONTRIBUTING.zh-CN.md)

# 贡献指南

<!-- sync:contrib-scope -->

感谢改进这份双语、证据导向的 Pi 实践指南。本仓库做 Practice Curation，不做穷举
Package Directory。有用的贡献应帮助读者做出或验证 Operational Decision。

贡献前阅读：

- [研究与收录方法](docs/research/methodology.zh-CN.md)；
- [证据台账](docs/research/evidence-ledger.zh-CN.md)；
- 第三方 Artifact 适用的
  [Extension 审查](docs/extension-review.zh-CN.md)；
- 若底层请求应提交上游，阅读 Pi 自己的
  [Contribution Gate](https://github.com/earendil-works/pi/blob/main/CONTRIBUTING.md)。

## 范围内

<!-- sync:contrib-in -->

- 修正 Fact、Version Boundary、Command、Translation、Citation 或 Broken Link。
- 新增或改进可复现的 Pi-specific Practice。
- 增加 Primary Evidence 或有文档的矛盾。
- 提议第三方 Artifact 进行 Source Review。
- 提交人类 Hands-on Trial Record。
- 更新 Pi Baseline 或季度 Ecosystem Snapshot。
- 改善 Bilingual Parity、Template、Schema、Check、Accessibility 或 Maintenance
  Documentation。

## 范围外

<!-- sync:contrib-out -->

- 没有 Operational Recommendation 的批量 Package/Link Submission。
- 用 Popularity、Star、Download、Sponsorship 或 Affiliation 证明质量。
- 从 Catalog/Search Result 复制的 Generated Description。
- 把无 License Artifact 当成可复用推荐。
- 没有 Pi-specific Failure Mode/Verification 的通用 Prompting Slogan。
- 未披露 Data Transfer、Credential Access、Destructive Action、Lifecycle
  Script 或 Execution Boundary。
- 没有 Scoped/Reproducible Record 却声称 “Verified”“Secure”“Private”
  “Sandboxed” 或 “Battle-tested”。
- 完全自动或无人审查的 AI-generated PR。

## 贡献类型

<!-- sync:contrib-types -->

### 事实修正

包括：

1. 精确 File/Claim；
2. 当前行为与修正措辞；
3. Pi Version/Tag/Commit；
4. Primary Source；含糊时增加 Implementation/Test Evidence；
5. 对应英文与中文修改；
6. 是否影响其他 Practice/Registry Record。

安全敏感修正遵循 [SECURITY.zh-CN.md](SECURITY.zh-CN.md)。

### 新增或修改实践

使用[实践提案模板](templates/practice-proposal.zh-CN.md)。实践需要：

- 稳定 ID 或拟议 New ID；
- Pi-shaped Failure Mode；
- Rationale；
- Concrete Procedure；
- Observable Verification；
- 有一手证据时引用一手证据；
- 显式 Inference Label；
- Security/Data/Version Qualification；
- Failure、Rollback 或 Recovery Guidance；
- Fact-equivalent English/Chinese Text。

避免重新编号已有 Practice。Practice Retired 时，在 Decision History 保留 ID，
不要让 External Link 静默改变含义。

### 发现候选

完整审查前，使用轻量[生态候选 Issue Form](.github/ISSUE_TEMPLATE/ecosystem-candidate.yml)
保存公开线索。提供：

- Canonical Public URL；
- 证明可能存在 Pi 关系的最小公开证据；
- 已知时提供 Alias、Package Name、Discovery Query/Source 与 Immutable Ref；
- Relationship Disclosure。

发现阶段允许明确保留不确定性、未知 License 或缺失 Immutable Ref。维护者把接受的
线索规范化到 `data/discovery-candidates.json`。候选收录不等于 Source Review、
兼容性证据或背书。

### 源码审查或观察名单提名

仅链接远远不够。提交：

- Canonical Repository 与 Immutable Reviewed Ref；
- Artifact/Package Identity；
- Repository 与 Published Artifact License；
- Current/Historical Pi Scope；
- Purpose 与 Non-duplicative Value；
- Manifest、Resource、Dependency、Lifecycle Script、Native/Binary/Download
  Behavior；
- File/Process/Network/Credential/Session Authority；
- 带日期快照的 Test/CI；
- Maintenance/Compatibility Evidence；
- 明显 Risk 与拟议 Isolated Trial；
- Relationship Disclosure。

默认结果是 `source-reviewed`，不是推荐。

### 亲测审查

使用[亲测审查模板](templates/hands-on-review.zh-CN.md)，记录：

- 具名 Human Reviewer 与 Relationship；
- Exact Artifact/Ref/Integrity；
- Pi/Runtime/Platform/Provider Version；
- Containment、Test Credential/Data 与 Network Policy；
- 精确 Install/Test Command；
- Relevant Matrix 的 Expected/Actual Result；
- Process/Network/Filesystem/Data Observation；
- Cancellation、Failure、Reload、Shutdown、Uninstall、Cleanup 与 Rollback；
- Passed/Failed/Skipped Case；
- Residual Risk、Retest Trigger 与 Expiration Date；
- Sanitized Evidence Link。

一次 Happy Path 成功不等于对宽泛 Package 的 Hands-on Verification。

## 推荐状态

<!-- sync:contrib-states -->

```text
discovered -> relation-confirmed -> source-reviewed -> hands-on-verified -> featured
discovered / relation-confirmed -> deferred or rejected
source-reviewed / hands-on-verified -> rejected
featured -> stale -> retest or remove
```

只有 `featured` 第三方 Item 进入根 Curated Section。Promotion 需要 Direct Human
Use 与 Editorial Judgment；Numeric Score、CI、Package Catalog Entry 或 Maintainer
Reputation 都不能自动晋级。

<!-- sync:contrib-state-map -->

上面的生命周期、Registry 字段和发布位置是不同维度。在 Registry Schema 进一步
拆分前，社区资源采用下面的规范映射：

| 生命周期含义 | `reviewStatus` | 允许的 `status` 形态 | 必需证据与发布动作 |
| --- | --- | --- | --- |
| 仅发现 | 候选注册表使用 `discovery-only`；尚不适用策展注册表字段 | 候选注册表中的 `awaiting-source-review`、`deferred` 或 `rejected` | 保存 Identity、Provenance、Relation Hypothesis、类别/架构与 Disposition；绝不作为已审查证据发布。 |
| 已确认关系 | 候选注册表使用 `preliminary-evidence-collected` | 通常为 `awaiting-source-review` | 固定能证明直接、间接、历史或派生 Pi 关系的一手证据；这仍不等于 Source Review。 |
| 源码审查进行中 | 候选注册表使用 `source-review-in-progress` | `source-review-in-progress` | 固定精确制品并完成全部 Source Gate；Gate 完成前不得作为已审源码发布。 |
| 已审源码 | `source-reviewed` | 某个 `watchlist*` 风险/处置值 | 在双语 Watchlist 记录精确 Ref、License、入口、依赖、Authority/Data Flow、Test/CI 与未决试用问题。 |
| 已亲测 | `hands-on-verified` | 在独立编辑决定前仍为 `watchlist*` | 附上已完成的[亲测审查](templates/hands-on-review.zh-CN.md)，包含具名人类、Expected/Actual 证据、Cleanup、残余风险与到期时间。 |
| 已精选 | `hands-on-verified` | `featured` | 完成独立编辑与双语审查；加入成对的根 Resource Block，并移除成对的 Watchlist Block。 |
| 已过期 | 保留上一证据阶段，但不得暗示仍然有效 | `stale` | 从根列表移除，说明到期 Trigger，并安排固定制品复测或移除决定。 |
| 已拒绝 | 保留支持决定的证据阶段，或使用 `blocked` | `rejected` | 保留简明理由与 Immutable Evidence，避免反复发现同一不安全/不适合制品。 |

`watchlist-data-access`、`watchlist-data-egress`、`watchlist-high-risk`、
`watchlist-privacy` 与 `watchlist-trust-sensitive` 是面向风险的展示变体，不是更高
证据阶段。`deferred` 与 `rejected` 是处置结果，不证明发生过 Source 或 Hands-on
Review。`hands-on-review` 表单不能自行授予 `featured`；独立决定还要检查相对价值、
利益冲突、到期、措辞和双语一致性。

## AI 辅助

<!-- sync:contrib-ai -->

只有在 Human Contributor 完成以下事项时，AI 才可辅助 Discovery、Draft、
Translation 或 Consistency Check：

1. 理解每条提交 Claim 与每行内容；
2. 打开并验证每个 Source；
3. 运行或亲自验证每个声称的 Command/Test；
4. 移除 Fabricated、Overbroad 或 Unsupported Language；
5. 检查两种语言；
6. 在 PR 中披露重要 AI Assistance。

AI 不能成为具名 Hands-on Reviewer。不得伪造 Test Result、Citation、Maintainer
Opinion 或 Translation。不得提交 Fully AI-generated/Unreviewed PR。

中央 Awesome 项目的
[列表创建指南](https://github.com/sindresorhus/awesome/blob/main/create-list.md)与
[当前 PR 模板](https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md)
要求 Non-generated Markdown，并拒绝 AI-generated List/Fully AI-generated PR。
本仓库透明的 Research-preview History 不构成豁免。未来中央列表提案需要实质
Human Testing、Selection、Rewriting 与要求的 Public-maintenance Period。

## 利益冲突

<!-- sync:contrib-conflict -->

如果你 Own、Maintain、Work For、Advise、Sponsor、Invest In 候选项目，或从中
获得报酬，必须披露。披露后的 Self-nomination 可以接受 Source Review，但不会
获得优先级或降低证据标准。

本仓库没有 Paid Placement、Affiliate Ranking、Sponsored Ordering 或基于 Star/
Download 的 Promotion。存在重要利益冲突的 Maintainer 不得成为 Feature 决定的
唯一 Reviewer。

## 双语修改

<!-- sync:contrib-bilingual -->

- 英文文件使用 `.md`；简体中文 Peer 使用 `.zh-CN.md`。
- 在同一 PR 增加/更新两个 Peer。
- 保持完全相同的 `<!-- sync:... -->` Marker ID 与顺序。
- 保持完全相同的 `<!-- resource:... -->` Membership、Order 与 Status。
- 翻译 Fact 与 Risk Qualification，而不只是 Heading。
- 精确保留 Command、Version、Commit、Flag、Identifier、Date、License 与
  Evidence Status。
- 优先自然中文，不强求逐词翻译，但不能弱化 Security Warning，也不能把
  Source-reviewed Item 升级成推荐。
- 英文 `README.md` 是 `awesome-lint` Target；不要为了通过英文规则而破坏中文
  Punctuation。

Automation 检查 Structure/Registry Membership，不检查 Semantic Translation
Quality。仍需要 Human Bilingual Review。

## 编辑资源注册表

<!-- sync:contrib-registry -->

仓库刻意分开三本 Ledger：

- `data/discovery-candidates.json` 保存低成本、不受信任的线索、Alias、关系证据、
  类别/架构与 Disposition；
- `data/discovery-runs.json` 保存精确有界 Query、Raw Result 顺序、Normalization，
  以及 Claimed Batch 中每条结果的 Disposition；缺少这些证据的历史导入必须标记为
  `reconstructed-non-replayable`、不完整且已截断；
- `data/resources.json` 保存已审查或明确 Deferred 的策展记录。

三者都不是 README Generator。策展 Markdown 必须由人类编辑；只有机器覆盖摘要
按脚本重新生成。

每个发现候选：

- 保存 Canonical URL、Alias、精确 Discovery Source 与完整 Ref；
- 使用机器分类法填写 Primary/Secondary Category 与 Architecture；
- 初始使用 `reviewStatus: discovery-only`；固定关系证据后才能使用
  `preliminary-evidence-collected`，完整 Gate 审查期间使用
  `source-review-in-progress`；Candidate Ledger 中的 `endorsementStatus` 始终为
  `not-evaluated`；
- 只有 `promoted-to-resource` 才要求 `resourceId`，并把候选保留为可审计 Redirect；
  晋级时 Candidate `resourceId` 与 Resource `sourceCandidateId` 必须互相指向。

每次 Discovery Run 都要按 Source Order 保留全部 Raw Result。把它映射到 Candidate，
或记录明确的 Duplicate、Deferred、Rejected、Out-of-scope、Lookup-failed
Disposition。说明 Truncation 与声称的精确 Denominator；绝不能把有界 Batch 描述为
完整生态。分开保存返回的 `sourceUrl` 与规范化后的 `resolvedCandidateUrl`，因为
Package、Catalog、Provenance 或 Redirect Source 未必使用 Repository URL。

每个 Resource：

- 使用稳定、小写、Hyphenated ID；
- 如实记录带日期的 `reviewStatus` 与 `status`；
- 不能用推断结果填写 Reviewer/Test Field；
- 没检测到 License 时使用 `NOASSERTION`，不能猜；
- 写明 Current/Legacy Pi Scope；
- 从机器分类法分配一个 Primary Category、可选 Secondary Category、Architecture
  Type 与 Pi Relationship Type；
- 区分 `reason` 与 `riskSummary`；
- 在两种语言文件中更新对应 Resource Marker。

不要把 Dynamic Star/Download 变成持久 Resource Field 或 Recommendation Order。

## 写作风格

<!-- sync:contrib-style -->

- 写具体、中性的 Description，回答条目为何有用。
- 区分 **Fact**、**Community Claim**、**Example** 与 **Inference**。
- Stable Implementation Claim 使用 Version-pinned Link。
- 优先使用当前 Canonical `earendil-works/pi` 与 `@earendil-works/*`；标记历史
  Identity，不静默重写证据。
- 不把 v0.83.0 CLI RPC 称为永久稳定协议。
- 不把 Project Trust、Tool Allowlist、Worktree 或 Subprocess 称为 OS Sandbox。
- 不把 GitHub Secret/Unlisted Gist 称为 Access-controlled Private Document。
- Root README 可以包含带日期、明确状态并有 Check-in 数据支持的生态研究快照。
  只有 `featured` 第三方条目是正式策展推荐；详细 Methodology、Ledger、原始
  Dynamic Result 与可复现证据仍放在 `data/` 和 `docs/research/`。
- 根文件正式 Awesome Item 使用
  `- [Name](URL) - Description.`，Description 具体、首字母大写并有标点。
- Internal Navigation 使用 Table 或 Text-first Bullet，避免 `awesome-lint` 把
  Relative Link 误判成正式 List Item。
- 不增加 CI Badge 或 README `License` Heading。

## 本地检查

<!-- sync:contrib-checks -->

使用仓库要求的 Node Version：

```bash
npm ci --ignore-scripts
npm run generate:coverage
npm run check
npm run check:awesome
```

只有 Registry、Candidate 或 Taxonomy 发生有意修改后才运行 `generate:coverage`。
CI 使用 Check Mode；机器生成覆盖过期时会失败。

另外：

1. 检查 English/Chinese Markdown Rendering；
2. 打开每个新增 Evidence Link；
3. 确认 Fixture、Log、Screenshot 或 Session Export 没有 Secret/Private Data；
4. 确认 Diff 没有 Generated Root README 或 Unrelated Change。

`awesome-lint` 可能要求 GitHub Remote Metadata，例如 Description、Topic 与检测到的
CC0 License。因此新 Local Clone 可能通过 Content Rule，却在 Repository 发布/
配置前无法通过 Remote-metadata Rule。不要永久禁用该 Rule 来隐藏 Metadata
缺失。

## 首次发布检查表

<!-- sync:contrib-publish -->

在把仓库视为公开发布前：

1. 写明人类 Maintainer，分别指定 Bilingual Fact Review、Security Report、
   Feature Decision 与 Stale-item Revalidation Owner，并记录有人监控的 Security
   Contact 或启用 Private Vulnerability Reporting；
2. 发布到 GitHub，并把 `main` 设为 Default Branch；
3. 使用具体 Description，例如“Bilingual, evidence-led, reproducible practices
   for the Pi coding agent”；
4. 至少添加 `awesome` 与 `awesome-list` Topic，并添加范围精确的 `pi-agent`、
   `coding-agent`、`bilingual` 等 Topic；
5. 确认 GitHub 把根 License 识别为 CC0-1.0；
6. 若 Hosting Plan 支持，对受保护修改要求 Documentation-quality 与 Link-health
   Check；
7. 从 Branch 正在跟踪已发布 Remote 的 Clone 中重跑 `npm run check:awesome`。

不要把这个研究预览提交到中央 Awesome List。只有在公开维护至少 30 天，并经过
实质、可独立审查的人类亲测、筛选、重写与双语事实审查，使上游
Non-AI-generated-list Attestation 成为真实陈述后，才重新考虑。

## Pull-request 检查表

<!-- sync:contrib-pr -->

- [ ] 修改在范围内，并说明 Reader Value。
- [ ] 我亲自验证了每项 Fact、Command、Link 与 Result。
- [ ] 我记录了精确 Version/Commit/Date 与 Evidence Status。
- [ ] 我披露了 Relationship、Sponsorship 与重要 AI Assistance。
- [ ] 我没有把 Popularity/Generated Text 转换成 Recommendation。
- [ ] 我更新了 English/Chinese Peer 与一致的 Sync/Resource Marker。
- [ ] Membership/Status 改变时，我更新了 `data/resources.json`。
- [ ] 我运行本地检查并检查 Markdown Rendering。
- [ ] 我移除了 Credential、Private Source/Session Content、Identifier 与
      Sensitive Log。
- [ ] 我同意以 CC0-1.0 贡献所提交内容。

## 授权

<!-- sync:contrib-license -->

除非明确另行说明，对本仓库的贡献均通过
[CC0 1.0 Universal](LICENSE)贡献到公共领域。提交 Contribution 表示你确认有权
作出该贡献。除非 License 允许，不要复制第三方 Description、Documentation 或
Code；应写简短的 Original Summary 并链接 Source。
