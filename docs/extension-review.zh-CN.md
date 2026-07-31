[English](./extension-review.md) | [简体中文](./extension-review.zh-CN.md)

# Extension 与 Package 审查

<!-- sync:review-purpose -->

加载第三方 Extension、Skill 或 Pi Package 前使用本流程。Pi Package 位于本地
Agent Trust Boundary 内：Extension 以 Pi 进程权限执行 JavaScript/TypeScript；
Skill 可以指示模型调用工具或可执行文件。进入 Package Catalog 只是被发现，不是
通过安全审查。

本流程产出的是 Decision Record，而不只是一个分数。

## Gate 0 — 确认精确制品

<!-- sync:review-identity -->

记录：

| 字段 | 必填内容 |
| --- | --- |
| Project | Canonical Repository 与 Publisher Identity。 |
| Artifact | npm Name、Git Source 或 Local Path。 |
| Reviewed Ref | 精确 npm Version 加 Integrity，或完整 Git Commit。 |
| Pi Baseline | 精确 Pi Version/Commit 与 Node Version。 |
| Review Date | ISO 日期与 Reviewer。 |
| License | Project、Package Artifact、Vendored Code 与重要 Dependency。 |
| Claimed Resources | Extension、Skill、Prompt、Theme 或组合。 |
| Install Scope | User/Project；临时 `-e` 或持久安装。 |

如果 Artifact 无法对应不可变源码、没有可用 License，或 Published Package 与
Repository 有无法解释的实质差异，停止审查。

## Gate 1 — 梳理安装与供应链

<!-- sync:review-install -->

正常安装前检查：

1. `package.json`、`pi` Resource Declaration、约定式 Resource Directory、
   Included File、Lockfile 和 Release Workflow。
2. `scripts` 中的 `preinstall`、`install`、`postinstall`、`prepare`、Build 与
   Download Behavior。
3. 直接/传递 Runtime Dependency、Native Module、Binary、下载模型与 Vendored
   Code。
4. 可用时检查 npm Provenance/Integrity、所用 Git Tag Signature，以及 Release
   Tag、Commit 与 Artifact 的对应关系。
5. Git Source 是否固定。Branch 与无版本 npm Spec 会移动。
6. Package Update 会保持还是推进该 Ref。

使用默认 npm Command 时，Pi v0.83.0 会对 Git Package 的 Dependency 执行
`npm install --omit=dev`。托管 npm Package 使用普通 Package-manager Install
Argument；自定义 `npmCommand` 还会把 Git Dependency 路径改为普通 `install`。
这些路径都不会全局关闭 Lifecycle Script。Git Reconciliation 还可能 Reset/
Clean Checkout，因此绝不能让 Package Manager 指向包含未提交工作的 Working
Copy。

**通过条件：**Reviewer 可以枚举 Install、Load、Update 时执行的代码，并能复现
同一 Dependency Graph。

## Gate 2 — 梳理 Runtime Authority

<!-- sync:review-authority -->

在每个 Extension Entry Point 与 Helper 中搜索：

- Process Creation、Shell Execution、`eval`、Dynamic Import、Worker、Native
  Module 与 Child-process Environment Inheritance；
- `ctx.cwd` 之外的文件读写、Symlink、Path Traversal、Temp File、Cache 和
  Deletion；
- Network Client、DNS、Socket、Local Server、Browser Launch、SSH 与 Remote
  Execution；
- Environment Variable、Pi Auth/Model API、Credential File、Git/SSH Config、
  Cloud CLI 与 Keychain；
- Clipboard、Notification、Terminal Escape Sequence、TUI Overlay 和 Input
  Interception；
- Telemetry、Analytics、Crash Report、Session Export、Prompt/Tool-result
  Upload 与 Retention；
- 注册或覆盖 `read`、`bash`、`edit`、`write`、`grep`、`find` 或 `ls`；
- 可以 Block、Rewrite、Inject 或 Observe Message/Tool Call 的 Hook。

建立紧凑 Authority Table：

| 表面 | 需求 | 实际访问 | 用户控制 | 数据是否离机 |
| --- | --- | --- | --- | --- |
| Files | Path 与 Operation。 | 观察到的实现。 | Config/Allowlist/无。 | Destination 与 Retention。 |
| Processes | Executable 与 Argument。 | 观察到的实现。 | Confirmation/Policy/无。 | Child Environment。 |
| Network | Host 与 Protocol。 | 观察到的实现。 | Allowlist/Offline/无。 | Payload 与 Identity。 |
| Credentials | Credential Category。 | 观察到的实现。 | Scoped Token/Profile/无。 | Recipient。 |
| Session | Message、Tool、Metadata。 | 观察到的实现。 | Opt-in/Filter/无。 | Storage 与 Deletion。 |

**通过条件：**文档和行为一致；没有把 Authority 伪装成无害 UI 或只读功能；部署
可以在 Pi 外部限制每个不需要的表面。

## Gate 3 — 审查 Pi 集成正确性

<!-- sync:review-integration -->

### 生命周期

- Factory 是否快速，且只做注册或不可避免的一次性发现？
- Session Resource 是否在正确 Event 初始化？
- Timer、Process、Listener、Port、File、UI Slot 与 Status 是否在 Shutdown 和
  Session Replacement 时清理？
- Setup/Cleanup 是否幂等？
- 代码是否使用当前 Event `ctx`，而不是保留过期 Session-bound Object？
- 它声称支持的 Interactive、Print、JSON、RPC 与 SDK 模式是否真的工作？

### 工具

- Name 是否与 Built-in Tool 或常见 Package 冲突？
- Description、`promptSnippet` 与 `promptGuidelines` 是否准确描述行为？
- Schema 是否闭合且兼容 Provider（String Enum 使用 `StringEnum`）？
- Path 是否相对预期目录解析，并在 Access Check 前 Canonicalize？
- Mutating Tool 是否加入 Pi 的 Per-file Mutation Queue？
- Shared State 或 Ordering 有要求时是否声明 Sequential Execution？
- Cancellation 是否传递到 Child Work？
- Failure 是否通过 Throw 让 Pi 标为 `isError: true`？
- Result 是否限制到 2,000 行/50 KB 或更严格范围，并显式给出 Continuation/
  Full-output Information？
- 调用 Nested Model 时是否记录 Usage？

### Hook 与 Policy

- `tool_call` Policy 自身出错时是否 Fail Closed？
- 其他 Extension 能否更早运行、覆盖同一 Tool，或通过不同 API 绕过目标 Policy？
- Prompt/Message Transformation 是否有界、确定且可见？
- UI-only Renderer 是否与 Session/Model Content 分离？
- 文档中的 “Sandbox”“Permission”“Read-only” 是否说明真正的 OS/Enforcement
  Boundary？

**通过条件：**Test 覆盖每个声称支持的 Pi Mode 和每项特权操作，包括冲突与失败
行为。

## Gate 4 — 审查 Skill 与 Prompt Resource

<!-- sync:review-instructions -->

无代码 Resource 仍能触发强大操作。阅读每条 Instruction、Script、Reference、
Frontmatter Field 与链接的 Setup Step，检查：

- 下载并执行远程代码的命令；
- Destructive Operation、Recursive Path、Unresolved Variable 或宽泛 Glob；
- 对 Secret、Browser Profile、Session Data 或 Credential Export 的请求；
- 要求削弱 Tool Policy、信任全部 Project、关闭 Review 或隐藏输出；
- 没有 Version/Integrity Pin 的 Dependency Install；
- 内容会成为 Instruction Channel 的 External URL；
- 声称 Project Trust 或 Tool Allowlist 提供完整隔离；
- 从未根据用户意图验证的 Generated Command。

**通过条件：**每个 Side Effect 都在使用点披露；风险步骤需要显式决定；Script
按代码标准审查。

## Gate 5 — 运行隔离行为试验

<!-- sync:review-trial -->

使用可丢弃 OS Boundary 与测试凭据。不要在个人 Home Directory 或生产仓库开始。

最低试验矩阵：

| 案例 | 测试 | 预期观察 |
| --- | --- | --- |
| Install | 捕获 File、Process、DNS/Network 与 Lifecycle Output。 | 与供应链地图一致。 |
| Startup | 无 Prompt 启动；不信任 Project 启动。 | 无无法解释动作；Trust 行为有文档。 |
| Happy Path | 运行最小官方示例。 | 得到声称结果和有界输出。 |
| Denied Credential | 省略或撤销 Credential。 | 清楚失败；不会回退到更广凭据。 |
| Denied Network | 阻断 Outbound Access。 | 有限 Timeout 与可操作错误。 |
| Denied File | 移除 Permission 或访问范围外路径。 | Fail Closed，不留下部分破坏状态。 |
| Invalid Input | Fuzz Missing、Extra、Large 与 Malformed Argument。 | Schema Rejection 或安全 Throw。 |
| Concurrency | 在共享状态/文件上调用 Sibling Call。 | 无 Lost Update、Race 或 Corruption。 |
| Cancellation | 在 Network/Process/File Work 中途 Abort。 | Child Work 停止并完成清理。 |
| Oversized Result | 生成超限输出。 | 显式 Truncation 与可取回 Continuation。 |
| Reload | 重复 Reload Resource 和切换 Session。 | 无 Duplicate Handler 或 Stale Context。 |
| Shutdown | Idle/Active Work 时退出。 | 无孤儿 Process、Port、Timer 或 Temp Secret。 |
| Removal | 移除 Package 和配置。 | Data/Cache 清理有文档，不再残留加载。 |

记录精确命令和脱敏观察。Packet/Process Tracing 比假设 README 列出全部 Side
Effect 更可靠。

## Gate 6 — 评估维护与采用适合度

<!-- sync:review-maintenance -->

检查：

- 当前 `@earendil-works/*` Dependency，或解释清楚的 Compatibility Layer；
- 最近 Pi-version Test、Release Note、Migration Handling 与 Issue Response；
- 验证行为而不只检查格式的 CI/Test；
- 支持的 OS、Terminal、Provider、Authentication Mode 与 Runtime Version；
- Ownership Concentration、Release Automation、Security Reporting Route，以及
  Compromised Release 恢复方式；
- Update、Rollback、Uninstall、Data Deletion 与 Breaking-change Policy 文档；
- 是否已有 Pi、Prompt 或 Skill 提供更安全的重复能力。

最近 Commit Date 并不足够。反过来，只要 Compatibility Matrix 与 Test 仍然
有效，小而稳定的工具也不需要持续 Commit。

## 决策

<!-- sync:review-decision -->

必须选择且只选择一个：

| 决策 | 含义 |
| --- | --- |
| Reject | 存在阻断性 Safety、Licensing、Integrity、Relevance 或 Reproducibility 问题。 |
| Watch | Source Review 有价值，但缺 Hands-on Evidence 或重要答案。 |
| Trial Only | 在指定 Containment/Credential 下工作，不适合广泛推荐。 |
| `hands-on-verified` | 指定环境与版本通过矩阵；仍不会自动成为精选。 |
| `featured` | Maintainer Judgment、Direct Experience、Documentation、License 和当前兼容性足以支持根文件策展。 |

记录 Blocking Issue、Compensating Control、Residual Risk、Retest Trigger 与
Expiration Date。`featured` 状态需要人类撰写推荐，说明项目为何特别有用；Popularity
和 Package Catalog Presence 都不是理由。

## 审查记录

<!-- sync:review-record -->

把以下区块复制到提案：

```yaml
project:
artifact:
repository:
reviewed_ref:
artifact_integrity:
license:
pi_version:
node_version:
platform:
reviewer:
reviewed_at:
relationship_disclosed:
resources:
authority:
  files:
  processes:
  network:
  credentials:
  session_data:
install_observations:
test_cases:
  passed: []
  failed: []
  skipped: []
cleanup_observations:
decision:
blocking_issues: []
residual_risks: []
retest_on:
expires_at:
evidence_links: []
```

参见 [P06、P21–P24](practice-guide.zh-CN.md#extension-与-package) 和
[研究方法](research/methodology.zh-CN.md#推荐生命周期)。
