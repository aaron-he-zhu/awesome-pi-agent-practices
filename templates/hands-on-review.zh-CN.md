[English](./hands-on-review.md) | [简体中文](./hands-on-review.zh-CN.md)

# 第三方亲测审查

<!-- sync:trial-identity -->

## Identity 与 Provenance

- Project/Repository：
- Artifact/Package：
- Exact Reviewed Commit/Tag/Version：
- Artifact Integrity/Provenance：
- Repository/Artifact License：
- Reviewer 与 Review Date：
- Relationship/Conflict Disclosure：
- Material AI Assistance：
- Current/Legacy Pi Scope：

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

每行记录 Exact Command、Expected、Actual、Pass/Fail/Skip、Sanitized Evidence 与
Cleanup。

| 案例 | 必答问题 | 结果 |
| --- | --- | --- |
| Install | File、Process、Script、Download 与 Network 是否符合 Source Map？ |  |
| Startup Denied Trust | 是否有无法解释动作或 Protected Resource Load？ |  |
| Happy Path | 最小 Documented Example 是否工作？ |  |
| Missing Credential | 是否清楚失败，且不寻找更广 Credential？ |  |
| Network Denied | 是否有限 Timeout 并保留 State？ |  |
| File Denied/Out of Scope | 是否 Fail Closed，且无 Partial Destructive Work？ |  |
| Invalid/Oversized Input | Schema/Validation 是否安全拒绝？ |  |
| Concurrency | Shared State/File 是否正确？ |  |
| Cancellation | Child Work 是否停止并 Cleanup？ |  |
| Oversized Output | Truncation 是否显式，Continuation 是否可取回？ |  |
| Reload/Session Replacement | Handler/Resource 是否只 Rebind 一次？ |  |
| Shutdown Mid-work | Process、Port、Timer 与 Temp Secret 是否清除？ |  |
| Offline/Data Flow | Outbound Host/Payload Category 是否与披露完全一致？ |  |
| Update/Rollback | 是否能恢复 Reviewed Ref？ |  |
| Uninstall/Delete | 是否停止加载，并移除有文档 State/Cache？ |  |

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

- Decision：Rejected / `source-reviewed` / `hands-on-verified` / `featured`。
- 为什么特别有用：
- Failed/Skipped Case：
- Blocking Issue：
- Compensating Control：
- Residual Risk：
- Supported Scope：
- Retest Trigger：
- Verification Expires：
- Human-authored Recommendation Draft：

通过本审查不表示 Security Certification。`featured` 状态仍需独立 Maintainer
Editorial Judgment 与 Bilingual Review。
