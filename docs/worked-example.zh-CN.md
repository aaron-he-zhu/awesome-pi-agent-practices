[English](./worked-example.md) | [简体中文](./worked-example.zh-CN.md)

# 评估记录填写示例

<!-- sync:worked-warning -->

> **仅作示例——没有进行任何亲测。** 下方 Repository、Commit、Command、Output 与
> Date 都是虚构的教学数据。每个案例都标为 `skip`，每项 Actual Result 都写明
> `NOT RUN`。不得把本页作为任何真实 Artifact 的证据。

本页演示如何填写[评估记录模板](../templates/evaluation-record.zh-CN.md)，同时避免把
Expected Result 冒充为 Observed Result。

<!-- sync:worked-identity -->

## 身份与状态

- **Record ID：**`EXAMPLE-DOC-001`。
- **对象与 Claim：**一个虚构的纯文档修改声称修复一处本地 Broken Link，且不改变
  Runtime Behavior。
- **Repository/Artifact：**`https://example.invalid/acme/pi-demo`（保留且不会解析的
  Example Domain）；没有 Published Artifact。
- **精确 Commit：**`1111111111111111111111111111111111111111`（虚构）。
- **Artifact Integrity/Source Mapping：**不适用；这是纯文档示例。
- **关联记录：**本页演示[可复用模板](../templates/evaluation-record.zh-CN.md)。
- **具名 Human Evaluator：**无——示例作者不是 Evaluator。
- **评估日期/时间：**`NOT OBSERVED`；示意日期 `2026-07-31`。
- **Relationship/Conflict Disclosure：**无；被评估对象并不存在。
- **重要 AI Assistance：**示例文字可能有 AI 辅助；没有把任何结果表述成人类观察。
- **Execution Status：**`not-run`。
- **Review Stage：**`not-reviewed`；不是 `source-reviewed` 或
  `hands-on-verified`。
- **Record Disposition：**`example-only`；不是 `featured`。

<!-- sync:worked-scope -->

## 范围与拟议环境

- **适用范围：**仅限虚构的 `docs/guide.md` Link 修改。
- **不适用范围：**Pi Runtime Behavior、Package、Provider、Security 或
  Compatibility。
- **拟议 Runtime：**macOS arm64 上的 Node.js `22.23.1` 与 npm `10.9.8`。
- **拟议 Repository Baseline：**虚构的 Clean Commit
  `1111111111111111111111111111111111111111`。
- **Containment/Network：**本地文档检查；安装 Package 会访问 Registry，但没有
  运行任何命令。
- **Credential/Data：**预期无需使用；未观察。
- **Assumption：**目标文件存在。可在虚构仓库运行 Local-link Checker 证伪。

<!-- sync:worked-boundary -->

## 权限与数据边界

| 表面 | 预期权限/数据 | 控制 | 实际 | 残余风险 |
| --- | --- | --- | --- | --- |
| 文件 | 读取 Repository Markdown 与已安装工具 | 在干净 Disposable Clone 运行 | `NOT OBSERVED` | 实现可能读取无关文件 |
| 进程 | Node/npm 子进程 | 使用精确命令与有限 CI Timeout | `NOT OBSERVED` | 未评估 Dependency Tooling |
| 网络 | 安装时访问 npm Registry；Local-link Check 不联网 | 使用 `npm ci --ignore-scripts` | `NOT OBSERVED` | 仍会下载 Transitive Package |
| 凭据 | 无 | 使用空白 Test Environment | `NOT OBSERVED` | 未测试 Environment Inheritance |
| 会话/模型内容 | 无 | 不导出 Pi Session | `NOT OBSERVED` | 未进行 Runtime Trial |
| 持久数据 | 若安装则产生 `node_modules` 与 npm Cache | Disposable Clone 与有文档的 Cleanup | `NOT OBSERVED` | 未验证 Cleanup |

<!-- sync:worked-cases -->

## 评估案例

| Case ID | Requirement/Source | 前置条件 | 精确命令或步骤 | 预期 | 实际 | 结果 | 证据 | 清理 / 回滚 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `DOC-01` | Local Link 可解析 | 已 Checkout 虚构 Commit；Dependency 存在 | 从 Repository Root 运行：`node scripts/check-local-links.mjs` | Exit `0`；输出没有 Missing File/Anchor | `NOT RUN — teaching example` | `skip`：无人执行 | 无 | 预期无需清理；若失败则恢复虚构 Patch |
| `DOC-02` | 全部 Repository Check 保持通过 | 相同 Baseline；精确 Lockfile | 从 Repository Root 运行：`npm ci --ignore-scripts && npm run check` | 两条命令均 Exit `0`；没有生成 Tracked Change | `NOT RUN — teaching example` | `skip`：无人执行 | 无 | 删除 Disposable Clone；不得把 Expected Output 当成证据 |
| `DOC-03` | 修改可撤销 | 存在已审查的 Change Commit | 审查 Inverse Diff，再运行 `git revert --no-edit <fictional-change-commit>` | Link 恢复 Baseline Target，且 Check 仍通过 | `NOT RUN — teaching example` | `skip`：不存在 Change Commit | 无 | Rollback 本身也需审查；没有执行回滚 |

<!-- sync:worked-summary -->

## 总结与决定

- **Passed：**无。
- **Failed：**无。
- **Skipped：**`DOC-01`、`DOC-02`、`DOC-03`；本示例有意不执行审查。
- **支持的结论：**该记录格式把 Command、Expected、Actual、Result、Evidence 与
  Rollback 分开。
- **不支持的结论：**虚构 Link 已修复；命令通过；修改安全；任何 Artifact 已验证
  或 Featured。
- **Residual Risk：**具名人类在真实、Pinned Repository 运行案例前，所有行为均为
  未知。
- **Review-stage Decision：**`not-reviewed`。
- **Record Disposition：**`revise` / `example-only`；不具备推荐资格。
- **Retest Trigger：**替换所有虚构 Identity/Environment Value，并运行每个适用案例。
- **Verification Expires：**不适用，因为不存在 Verification。

<!-- sync:worked-delivery -->

## 交付与回滚

- **面向读者的 Outcome：**一个如实报告 `NOT RUN` 的填写示例。
- **File/Artifact：**只有本文档页；没有 Log 或 Runtime Output。
- **Check：**零 Passed、零 Failed、三个 Skipped。
- **交付的精确 Version/Ref：**无；被评估对象的 Ref 均为虚构。
- **Data/Network/Credential Effect：**因未运行任何内容，未观察到影响。
- **Generated Artifact/Cleanup：**无。
- **Rollback：**示例不再有用时移除本页；真实修改应使用经过审查的 Inverse Patch
  或 Revert Commit。
- **Rollback Verification：**`NOT RUN`。
- **下一项 Human Decision：**决定是否为真实、单独标识的评估复制该模板。

<!-- sync:worked-attestation -->

## 确认状态

- [ ] 具名人类运行了案例。*（有意不勾选。）*
- [x] Actual Result 明确为 `NOT RUN` / `NOT OBSERVED`。
- [x] 本示例不声称 `source-reviewed`、`hands-on-verified`、`featured`、Secure、
  Sandboxed 或 Certified Status。
