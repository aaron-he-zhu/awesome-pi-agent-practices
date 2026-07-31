[English](./evaluation-record.md) | [简体中文](./evaluation-record.zh-CN.md)

# 评估记录

<!-- sync:evaluation-warning -->

本记录用于可复现的源码审查、试验或验收检查。必须明确保留 `NOT RUN`（未运行）与
`NOT OBSERVED`（未观察）。不得把拟议命令、预期结果、CI Badge 或 AI-generated
Summary 写成 `pass` 结果。

<!-- sync:evaluation-identity -->

## 身份与状态

- **Record ID：**
- **被评估对象与 Claim：**
- **Repository/Artifact：**
- **精确 Version/Tag/Commit：**
- **Artifact Integrity 或 Source Mapping：**
- **关联 Proposal/Task Brief/Run Manifest：**
- **具名 Human Evaluator：**
- **评估日期、时间与时区：**
- **Relationship/Conflict Disclosure：**
- **重要 AI Assistance：**
- **Execution Status：**`not-run` / `partially-run` / `executed`。
- **Review Stage：**`not-reviewed` / `source-reviewed` /
  `hands-on-verified`。
- **Record Disposition：**`example-only` / `revise` / `accept` / `rejected`。

`featured` 不是评估结果；它需要独立的 Maintainer Editorial Decision 与双语审查。

`source-reviewed` 要求具名人类打开并检查每个引用来源。`hands-on-verified` 还要求
该人类执行所有适用案例，并观察所记录的 Actual Result。

<!-- sync:evaluation-scope -->

## 范围与环境

- **适用范围：**
- **不适用范围：**
- **Pi Version/Commit/Distribution：**
- **Runtime、OS、Architecture、Terminal 与 Shell：**
- **Provider/Model/Thinking/Transport（如相关）：**
- **Repository Baseline 与 Pre-existing Change：**
- **Containment、Mount 与 Network Policy：**
- **Test Credential/Account/Data Category：**
- **Session/Trust/Context/Resource/Tool Policy：**
- **Assumption 与证伪方式：**

<!-- sync:evaluation-boundary -->

## 权限与数据边界

| 表面 | 预期权限/数据 | 控制或隔离 | 实际观察 | 残余风险 |
| --- | --- | --- | --- | --- |
| 文件 |  |  |  |  |
| 进程 |  |  |  |  |
| 网络 |  |  |  |  |
| 凭据 |  |  |  |  |
| 会话/模型内容 |  |  |  |  |
| 持久数据 |  |  |  |  |

<!-- sync:evaluation-cases -->

## 评估案例

每个可独立复现的案例使用一行。Working Directory 与 Prerequisite 相关时，和命令
一起精确记录。`skip` 必须写原因；`pass` 必须有观察结果与已脱敏证据。

| Case ID | Requirement/Source | 前置条件 | 精确命令或步骤 | 预期 | 实际 | 结果（`pass` / `fail` / `skip`） | 已脱敏证据 | 清理 / 回滚 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |

<!-- sync:evaluation-evidence -->

## 证据清单

不得包含 Credential、Private Source/Session Content、Signed URL、Browser
Profile、Personal Identifier 或未脱敏 Log。

| Evidence ID | Path 或 Stable Link | SHA-256 或 Immutable Ref | 证明内容 | 脱敏/移除方式 |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

<!-- sync:evaluation-summary -->

## 总结与决定

- **Passed Case：**
- **Failed Case：**
- **Skipped Case 与原因：**
- **Blocking Issue：**
- **支持的结论与范围：**
- **不支持的结论：**
- **Residual Risk：**
- **Retest Trigger：**
- **Verification Expires：**
- **Review-stage Decision：**`not-reviewed` / `source-reviewed` /
  `hands-on-verified`。
- **Record Disposition：**`example-only` / `revise` / `accept` / `rejected`。

没有具名人类执行命令并观察结果时，Decision 不得为 `hands-on-verified`。

<!-- sync:evaluation-delivery -->

## 交付与回滚

- **面向读者的 Outcome：**
- **修改或生成的 File/Artifact：**
- **Passed/Failed/Skipped Check：**
- **交付的精确 Version/Ref：**
- **File/Process/Network/Credential/Session Effect：**
- **Generated Artifact 与剩余 Cleanup：**
- **Rollback Command 或 Procedure：**
- **Rollback Verification：**
- **下一项 Human Decision、Owner 与 Due Date：**

<!-- sync:evaluation-attestation -->

## 人类确认

- [ ] 我亲自打开并检查了支持 Review Stage 的每个来源。
- [ ] 我是运行所有标记为 `pass` 或 `fail` 案例的具名人类。
- [ ] Actual Result 来自观察，不是复制 Expected Result 或 Generated Text。
- [ ] Evidence 已脱敏、可归属，并足以支持所述范围。
- [ ] Failed/Skipped Case、Cleanup、Rollback 与 Residual Risk 已明确记录。
- [ ] 本记录不声称 `featured`、Secure、Sandboxed 或 Certified Status。
