[English](./troubleshooting.md) | [简体中文](./troubleshooting.zh-CN.md)

# 故障排查手册

<!-- sync:trouble-purpose -->

排查 Pi 应分离不同层，而不是反复重装全部组件。保留失败案例，记录脱敏执行环境，
然后每次运行只改变一个变量。

本手册以 Pi v0.83.0 为目标。使用更新版本时，请检查当前
[官方文档](https://pi.dev/docs/latest)。

## 第一响应

<!-- sync:trouble-first -->

1. **停止破坏性或带凭据工作。**Abort 当前 Action，撤销可能暴露的测试 Credential，
   并保留 Repository State。
2. **记录环境。**捕获 Pi/Node Version、Install Method、OS、Terminal、Shell、
   Working Directory、Repository Commit/Status、Provider/Model、Thinking Level、
   Transport、Mode、Trust Choice、Tool List、Loaded Resource 和精确错误时间。
3. **保留证据。**重试前复制最小相关 stderr/Event/Log。未经脱敏，不要公开 Session
   File、`pi-debug.log`、HTML Export、Auth Store、Environment Dump 或完整 Tool
   Output。
4. **分类失败阶段。**Install、Startup/Resource Loading、Model/Auth、Prompt/
   Streaming、Tool Execution、Terminal Rendering、Session/Compaction、RPC/SDK、
   Update 或 Shutdown。
5. **选择下面最小的隔离阶梯。**

## 干净基线

<!-- sync:trouble-baseline -->

使用可丢弃目录和测试 Credential。以下命令移除已发现的项目指令/资源以及所有可选
Resource Type，不保存 Session，只提供内建只读型 Tool：

```bash
pi --no-approve --no-context-files --no-extensions --no-skills \
  --no-prompt-templates --no-themes --no-session \
  --tools read,grep,find,ls \
  --provider PROVIDER --model MODEL -p "只回复 OK。"
```

解释：

- **失败：**重点检查 Installation/Runtime、所选 Provider/Model、Authentication、
  Transport/Network 或 Pi Core。
- **通过：**按顺序加回原 Working Directory、Context File、Project Trust、一个
  Resource Type、一个 Package/Extension、原 Tool、Session 与 Terminal Mode。

这是最小工作流基线，不是安全 Sandbox。不可信代码和 Network/Credential
Containment 仍需要 OS Boundary。

## 隔离阶梯

<!-- sync:trouble-ladder -->

| 步骤 | 保持不变 | 只改变一项 | 结果变化指向 |
| --- | --- | --- | --- |
| 1 | 同一 Pi Binary 与 Model。 | 全新空 Working Directory。 | Repository File、Context、Project Resource 或 Path Assumption。 |
| 2 | 同一 Prompt/Model/Cwd。 | Print Mode 代替 TUI。 | Terminal Rendering、Key Handling 或 Interactive Extension UI。 |
| 3 | 同一 Mode/Prompt。 | 显式 Provider/Model 与 Thinking Level。 | Catalog Selection、Alias、Capability 或模型特定行为。 |
| 4 | 同一 Configuration。 | `--no-session`。 | Stored History、Branch、Compaction 或旧 Tool-call Argument。 |
| 5 | 同一 Cwd。 | `--no-context-files --no-approve`。 | Context Instruction 或受保护项目资源。 |
| 6 | 同一 Prompt。 | 关闭所有可选 Resource Discovery。 | Extension、Skill、Prompt 或 Theme。 |
| 7 | 同一 Resource Type。 | 以固定 Ref 加回一个 Artifact。 | 特定 Package/Resource 或交互。 |
| 8 | 同一 Artifact。 | 内建只读 Tool Allowlist。 | Bash/Write Behavior 或 Custom/Overridden Tool。 |
| 9 | 同一 Failure。 | 最小 Input/Repository/File。 | 小型可复现 Trigger。 |
| 10 | 同一 Reproducer。 | 上一 Pi Version 或 Clean Profile。 | Regression 或 User Configuration State。 |

不要同时改变 Model、Provider、Package Version、Prompt 和 Session。那可能让症状
消失，却无法确认原因。

## 安装与更新失败

<!-- sync:trouble-install -->

### 检查

1. 确认实际运行的 Distribution：

   ```bash
   command -v pi
   pi --version
   node --version
   ```

2. 对 npm/Source CLI，验证 Release 的 Node Engine Requirement。不要把 npm
   Engine Rule 直接套到独立 Bun Binary。
3. 分开 Update Surface：

   - `pi update --self` 更新 Pi。
   - `pi update --extensions` 更新未固定 Package，并协调 Pinned Git Ref。
   - `pi update --models` 刷新模型目录。
   - `pi update --all` 组合 Pi 与 Package Update。

4. Package 失败时记录 Source Type 与 Exact Spec。检查 Registry Access、Git Ref
   是否存在、SSH Configuration、Proxy/CA、Disk Space、Permission、Package
   Manager Configuration、Lifecycle Script 与 Native Build Output。
5. 在 CI 中让 Git Failure 有限：

   ```bash
   export GIT_TERMINAL_PROMPT=0
   export GIT_SSH_COMMAND="ssh -o BatchMode=yes -o ConnectTimeout=5"
   ```

6. 不要通过删除宽泛 User Directory “修复”安装。先从 Settings 确定精确 User/
   Project Package Path 并备份，再做可恢复的目标修改。

### 区分

| 症状 | 可能层 |
| --- | --- |
| 找不到 `pi` | PATH、Install Target、Shell Hash/Cache 或失败安装。 |
| Engine/Version Error | Node Runtime 不满足 npm Package Requirement。 |
| Registry 404 | 错误 Scope/Name/Version、未发布 Artifact、Registry Mirror 或 Auth。 |
| Git 挂起 | Interactive Credential/Host-key Prompt 或 Remote 不可达。 |
| Native Build 失败 | Runtime ABI、Compiler/Toolchain、Architecture 或 Lifecycle Dependency。 |
| Package 再次出现 | 仍在 User/Project Settings 或约定式 Resource Directory 声明。 |
| 未更新 Pi 但行为变化 | Package Update、模型目录刷新、Provider Service 或 Configuration Change。 |

## Provider、模型与认证失败

<!-- sync:trouble-provider -->

### 重试前分类

| 错误类别 | 首要检查 | 不要做 |
| --- | --- | --- |
| Unknown Model | `--list-models`、精确 `provider/model`、Catalog Refresh Time、Custom Provider Registration。 | 无限重试同一 Alias。 |
| Missing Authentication | Provider 特定 Login/Key Route、Credential Profile、Scope、Expiry、Process Environment。 | 把 Secret 打印到 Log/Issue。 |
| 401/403 | 错误 Credential Type、Expired Token、Account/Project Permission、Endpoint、Audience。 | 当成暂时 Network Failure。 |
| 404 | Model/Endpoint Name、Region、API Compatibility、Gateway Route。 | 不检查所选 Catalog 就认定模型从未存在。 |
| 429/Quota | Account Quota、Provider Retry-after、Concurrency、Usage Limit。 | 叠加无限 Client/Provider/Agent Retry。 |
| Timeout/Hang | DNS/TLS/Proxy、Transport、Idle Timeout、Streamed Byte、Provider Status、Cancellation。 | 立即增大全部 Timeout。 |
| Context Overflow | 实际 Model Context、Transformed Message、Tool Output、Compaction Recognition。 | 把 Rate-limit Error 重写成 Overflow。 |
| Tool Schema Rejection | Provider Compatibility、String Enum Form、Unsupported Schema Construct、当前 Tool Definition。 | 检查 Request 前先怪 Prompt Quality。 |

先用无 Tool 的一行 Prompt，再分别加入一个 Read Call、一个 Custom Tool、Image、
Reasoning 与 Long Context。记录模型目录自上次成功运行后是否变化。

Pi v0.83.0 的 Provider-level Retry 默认为 `0`，Agent-level Retry 单独记录。
保持各层分离，才能让 Pi 正确分类 Quota 与 Overflow Error。

## Project Trust 与资源加载意外

<!-- sync:trouble-trust -->

### “我拒绝了 Trust，但仓库文本仍影响模型”

`AGENTS.md` 与 `CLAUDE.md` 是 Context File，独立于 Project Trust 加载。使用
`--no-approve --no-context-files` 复现。

### “Interactive 可用，但 Print/JSON/RPC 不可用”

非交互模式无法显示 Trust Prompt。没有适用的已保存决定时，全局
`defaultProjectTrust` 决定是否加载受保护 Resource；`ask` 与 `never` 跳过，
`always` 加载。显式传入 `--approve` 或 `--no-approve`，并声明每种 Resource
Type。

### “修改 `/trust` 没有效果”

该命令保存未来决定，不会重载当前 Process。重启 Pi。

### “只读 Tool 做了意外操作”

Extension 可以覆盖 Built-in Tool Name。在 OS Containment 中使用
`--no-extensions --tools read,grep,find,ls` 复现，并检查启动 Warning/Resource
List。

## Extension 与 Package 失败

<!-- sync:trouble-extension -->

1. 固定 Exact Artifact，并复制 Settings。
2. 在关闭全部 Extension Discovery 时复现。
3. 在可丢弃环境只加载一个显式 Extension：

   ```bash
   pi --no-extensions -e ./extension.ts --no-session
   ```

4. 分别测试 Factory/Startup、`session_start`、首次 Tool Call、Session Switch、
   Reload、Cancellation 和 `session_shutdown`。
5. 检查 stderr。一般 Hook Error 可能只被记录并继续；`tool_call` Hook Error 会
   Fail Safe、阻止工具；Custom Tool 必须 Throw 才会被 Pi 标记为 Error。
6. 查找过期 Captured `ctx`、Duplicate Handler、Orphan Child、Unclosed Socket、
   Shared Mutable State、Same-file Race、Tool-name Collision 和 Oversized Output。
7. Custom Tool 失败时记录脱敏 Raw Argument、Validation Result、Execution
   Start/End、Cancellation、Result Byte/Line Count 与 Thrown Error。
8. 两个 Package 分别通过、组合失败时，改变 Load Order，并检查 Same-name Tool、
   重写同一 Event 的 Hook、Global State、Port、Environment Variable 和
   Dependency Version。

重新启用 Artifact 前使用[Extension 审查](extension-review.zh-CN.md)。

## Tool 与 Shell 失败

<!-- sync:trouble-tools -->

| 症状 | 检查 |
| --- | --- |
| Command 永不返回 | Tool-native Timeout、Process Tree、Stdin Wait、Pager、Prompt、Network Idle、Cancellation Propagation。 |
| Output 看似不完整 | Truncation Notice、Line/Byte Limit、Head/Tail Policy、Continuation Offset、Full-output Path。 |
| 一个 Edit 覆盖另一个 | Parallel Sibling Call；完整 Read-modify-write Window 是否缺 `withFileMutationQueue()`。 |
| 目录错误 | `ctx.cwd`、Shell `pwd`、Path Resolution、Session Switch、Symlink Canonicalization。 |
| “Error” Result 被当成功 | Custom Tool 返回 Error-shaped Text，而不是 Throw。 |
| Shell 可用、Tool 不可用 | 不同 Environment、Shell、PATH、Cwd、Non-interactive Behavior、Stdin、Timeout 或 Sandbox Route。 |
| Abort 后 Child 残留 | Signal 未传递，或 Process-tree Cleanup 不完整。 |
| `!!` Output 仍在 Export | Excluded-from-model Context 不等于从 Session Persistence/Export 排除。 |

需要时把完整输出保存到有意识选择的文件。绝不能为了让结果看似完整而移除
Truncation Marker。

## Session 与 Compaction 失败

<!-- sync:trouble-session -->

### 上下文错误或缺失

1. 用 `/session` 记录当前 ID 与 Model。
2. 检查 `/tree` 的 Active Leaf。
3. 判断先前 `/fork`、`/clone` 或 CLI `--fork` 是否创建了新文件。
4. 查找 Compaction Entry，对比 Active Model-visible Summary 与原 JSONL History。
5. 在 `--no-session` 模式复现。

Session 操作不会恢复 Repository File。需要单独比较 Git/File-system State。

### Compaction 改变行为

- 记录 Compaction 是 Manual、Threshold-triggered 还是 Overflow Recovery。
- 保存 Summary、`firstKeptEntryId`、Token Settings、Model 与 Custom Compaction
  Extension。
- 检查单个超大 Turn 是否迫使 Split-turn Boundary。
- 把 Invariant 与 Decision 写入文件，再从 Fresh/Cloned Session 重试。
- 不要因为内容离开 Model-visible Context 就声称数据已删除；Original Entry 通常
  仍留在 JSONL。

### 升级后旧 Custom Tool Call 失败

旧 Session 可能包含早期 Schema 的 Argument。先在 Fresh Session 复现。
Extension Author 应保持 Public Schema 严格，并在适当时使用有文档的
Argument-preparation Compatibility Hook。

## Terminal 与 TUI 失败

<!-- sync:trouble-terminal -->

先在 Print Mode 运行同一 Prompt。若 Print 通过：

- 记录 Terminal Emulator/Version、`$TERM`、Locale、Multiplexer、SSH Layer、
  Font、Color Mode 与 Alternate-screen Choice；
- 比较 tmux/screen 外和 SSH 外的行为；
- 检查 Pi 的 Terminal Setup、tmux、Windows、Termux 与 Keybinding 文档；
- 测试与 Terminal Shortcut 冲突的 Input Key；
- 注意 Windows Terminal 和部分 macOS Terminal 把 Alt/Option+Enter 绑定为全屏，
  或无法区分传递；
- 每次关闭一个 UI Extension/Theme；
- 调整 Terminal Size，测试窄宽度、Unicode、Wide Character 与 Pasted Multiline
  Text；
- 谨慎使用 `/debug`：日志可能包含 Rendered Line 与发给模型的 Message。

不要因为最终响应在 UI 中看似截断，就把 Terminal Rendering Problem 报告为
Provider Failure。

## JSON、RPC 与 SDK 失败

<!-- sync:trouble-integration -->

### JSON 模式

- 把 stdout 视为 JSON Line，单独处理 stderr，并容忍 Streaming 与 Partial Event。
- 当其他 Finalization/Error Event 尚未结束时，不要假设一个 `message_end` 就代表
  整个 Process Lifecycle 完成。
- 测试 Aborted、Failed 与 Compaction-retry Sequence。

### v0.83.0 CLI RPC

- 只按 LF（`\n`）分隔 Record；可以移除末尾 CR。不要使用还把 U+2028/U+2029 当
  分隔符的 Line Splitter。
- 分离 Command Response 与 Asynchronous Event。
- Correlate Command，实现 `abort`/`abort_bash`，Drain stderr，并定义 Child-exit
  Policy。
- 在测试中发送 Malformed/Unknown Command；不能让一条 Bad Line 破坏后续 Framing。
- 固定 Pi：该接口在 v0.83.0 已发布，但上游没有记录长期兼容保证。

### SDK

- 确认正在使用哪个 `ResourceLoader`；默认 Loader 会发现标准 Resource。
- 显式 Subscribe/Unsubscribe，传播 Cancellation，并调用 Dispose Method。
- 替换 Session Runtime 时，重新绑定 Session-specific Subscription 与
  Extension；不要保留 Stale Reference。
- 测试 Authentication Resolution、Resource Diagnostic、In-memory/Persisted
  Session Behavior 与 Host Shutdown。

不要把 CLI-RPC JSON 发给 v0.83.0 后的 Framed-CBOR
`@earendil-works/pi-protocol`；它们是不同接口。

## Windows 特定分流

<!-- sync:trouble-windows -->

先确定 Pi 运行在：

- Native Windows Node/Bun；
- 使用 Linux Path/Process 的 WSL；
- 从 Windows 访问的 Container/Remote Environment；
- Editor Terminal、Windows Terminal 或 SSH。

再检查 Path Separator/Drive/UNC、Shell Selection、CRLF、Executable Suffix、
Quoting、Code Page/UTF-8、Terminal Keybinding、Symlink、Antivirus Lock、File
Watcher 与 Process-tree Cancellation。不要在一个 Minimal Reproducer 中混合
Native 与 WSL Path。

## 脱敏证据包

<!-- sync:trouble-bundle -->

可操作报告包括：

```text
Summary:
Impact:
Expected:
Actual:
First known failing version:
Last known passing version:
Pi distribution and version:
Node/Bun version:
OS/architecture:
Terminal/shell/mode:
Provider/model/thinking/transport:
Session: fresh | existing | compacted
Project trust/context/resource flags:
Package/extension exact refs:
Repository state or minimal fixture:
Minimal command/prompt:
Numbered reproduction steps:
Sanitized error/event excerpt:
One-variable isolation results:
Security/data implications:
```

分享前移除 API Key、Bearer Token、Cookie、Credential Path、Private Code、Session
Content、Account/Project ID、Personal Path、Hostname 与 Signed URL。使用稳定
Label 替换，使重复值仍可关联。

## 停止条件

<!-- sync:trouble-stop -->

观察到以下情况时停止测试，并通过私有渠道升级：

- Credential 或 Private Source Exfiltration；
- 在声称的 Containment Boundary 外执行；
- Artifact Integrity/Provenance Mismatch；
- 在声明 Path 外的 Destructive Behavior；
- 可复现的 Privilege-boundary Bypass；
- 被入侵的 Package/Release；
- 公开 Reproducer 会造成即时危害的 Vulnerability。

对于预期的 Local-agent Behavior——完整用户权限、来自不可信内容的 Prompt
Injection 或危险第三方指令——应先改善 Containment 与文档。真正的 Boundary
Bypass 则遵循 Pi 当前 Security Reporting Policy。
