[English](./hands-on-review.md) | [简体中文](./hands-on-review.zh-CN.md)

# 第三方亲测审查

<!-- sync:trial-identity -->

## Identity 与 Provenance

本空白表格不是证据。必须明确保留 `NOT RUN`（未运行）与 `NOT OBSERVED`（未观察）；
只有具名人类可以报告 Observed Result。

- Project/Repository：
- Artifact/Package：
- Exact Reviewed Commit/Tag/Version：
- Artifact Integrity/Provenance：
- Repository/Artifact License：
- Reviewer 与 Review Date：
- Relationship/Conflict Disclosure：
- Material AI Assistance：
- Current/Legacy Pi Scope：
- Execution Status：`not-run` / `partially-run` / `executed`。

无法确认 Identity、Source Mapping 或 Reuse License 时停止。

<!-- sync:trial-environment -->

## 环境

- Pi Version/Commit/Distribution：
- Node/Bun Version：
- OS/Architecture/Terminal/Shell：
- Provider/Model/Thinking/Transport：
- Containment：
- Mounted File：
- Network Policy：
- Test Credential/Account/Data：
- Session/Trust/Context/Resource/Tool Flag：
- Baseline Git State：

<!-- sync:trial-source -->

## 源码审查

- Declared Pi Resource：
- Entry Point：
- Direct/Transitive/Native Dependency：
- Lockfile/Release Workflow：
- Lifecycle Script/Download/Binary：
- File/Process/Network/Credential/Session Authority：
- Built-in Tool Override：
- Telemetry/External Transfer/Retention：
- Persistent State/Cache：
- Update、Rollback、Uninstall 与 Deletion：
- Observed Test/CI：
- Maintenance/Compatibility Evidence：

<!-- sync:trial-matrix -->

## 行为矩阵

每个可独立复现的案例使用一行。只有写明适用性原因时才能记为 `skip`。必需案例
失败或结果无法解释时，不得标记为 `hands-on-verified`；不要把细节都塞进一格笼统
结果。

| 案例 | 适用性 / 跳过原因 | 精确命令或步骤 | 预期 | 实际 | 结果（`pass` / `fail` / `skip`） | 已脱敏证据 | 清理 / 回滚 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 安装：文件、进程、脚本、下载、网络 |  |  |  |  |  |  |  |
| 拒绝信任后启动：动作与受保护资源加载 |  |  |  |  |  |  |  |
| 正常路径：最小文档示例 |  |  |  |  |  |  |  |
| 缺少凭据：明确失败且不寻找权限更广的凭据 |  |  |  |  |  |  |  |
| 禁止网络：有限超时并保留状态 |  |  |  |  |  |  |  |
| 文件拒绝/越界：关闭式失败且无部分破坏 |  |  |  |  |  |  |  |
| 无效/超大输入：Schema/Validation 安全拒绝 |  |  |  |  |  |  |  |
| 并发：共享状态/文件保持正确 |  |  |  |  |  |  |  |
| 取消：子工作停止并完成清理 |  |  |  |  |  |  |  |
| 超大输出：显式截断且可取回后续内容 |  |  |  |  |  |  |  |
| 重载/会话替换：Handler/Resource 仅绑定一次 |  |  |  |  |  |  |  |
| 工作中关停：进程、端口、定时器、临时密钥被移除 |  |  |  |  |  |  |  |
| 离线/数据流：出站主机与载荷类别符合披露 |  |  |  |  |  |  |  |
| 更新/回滚：恢复到已审查 Ref |  |  |  |  |  |  |  |
| 卸载/删除：停止加载并移除文档所述状态/缓存 |  |  |  |  |  |  |  |

<!-- sync:trial-observations -->

## 观察到的 Authority 与 Data Flow

| 表面 | Expected | Observed | Control | Residual Risk |
| --- | --- | --- | --- | --- |
| Files |  |  |  |  |
| Processes |  |  |  |  |
| Network |  |  |  |  |
| Credentials |  |  |  |  |
| Session/Model Content |  |  |  |  |
| Persistent Data |  |  |  |  |

<!-- sync:trial-decision -->

## 决定

- Decision：Rejected / `source-reviewed` / `hands-on-verified`。
- 是否请求独立 Editorial Promotion，以及 Decision Record Link：
- 为什么特别有用：
- Failed/Skipped Case：
- Blocking Issue：
- Compensating Control：
- Residual Risk：
- Supported Scope：
- Retest Trigger：
- Verification Expires：
- Human-authored Recommendation Draft：

通过本审查不表示 Security Certification，也不能自行授予 `featured`。Promotion
仍需独立 Maintainer Editorial Decision 与 Bilingual Review。
