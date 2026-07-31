[English](SECURITY.md) | [简体中文](SECURITY.zh-CN.md)

# 安全政策

<!-- sync:security-scope -->

本仓库包含 Documentation、Template、JSON Data 与 Local Validation Script，不
分发 Pi、Model、Credential 或观察名单中的第三方 Extension。

Pi 自身的安全问题应遵循 Pi 当前
[安全政策](https://github.com/earendil-works/pi/security/policy)。链接的第三方
项目安全问题归其 Maintainer 处理。分享 Reproduction 前先检查每个 Policy。

## 本仓库接收什么报告

<!-- sync:security-report -->

以下情况尽可能私下报告：

- 本仓库发布了 Credential、Private Session/Source Fragment、Personal
  Identifier、Signed URL、Private Hostname 或其他敏感 Research Artifact；
- Validation Script/Workflow 会执行 Unintended Code、暴露 Secret、覆盖本仓库
  之外的文件，或接受不安全 Untrusted Input；
- 把危险控制误述成 Sandbox、Access-controlled Private Store 或 Verified
  Security Boundary，可能造成即时伤害；
- 链接 Artifact Identity 被 Hijack，或 Release/Source Provenance 被替换；
- Repository-owned Code 中存在可复现 Vulnerability。

普通 Broken Link、过期 Version Fact、Translation Error 与非敏感 Documentation
Correction 可以使用 Fact-correction Issue Form。

## 报告渠道

<!-- sync:security-route -->

本仓库已启用 GitHub Private Vulnerability Reporting。请使用
**Security → Report a vulnerability**，并提供 Affected File/Line、Impact、
Minimal Reproduction 与 Proposed Safe Correction。不要提交 Live Credential
或超出必要范围的 Private Data。

初始 Maintainer 与 Security Router 是
[@aaron-he-zhu](https://github.com/aaron-he-zhu)；在扩大 Ownership 前，也由其
负责 Bilingual Fact Review、Featured-item Decision 与 Stale-item
Revalidation。如果以后无法使用 Private Reporting，**不要**公开发布可利用
Reproduction 或 Sensitive Artifact；只开一个不含 Secret Detail 的最小 Public
Issue，说明需要 Private Maintainer Route。

## 处理敏感证据

<!-- sync:security-data -->

- 使用 Synthetic Repository、Account、Credential 与 Data 复现。
- 实验后撤销 Test Credential。
- 分享最小 Excerpt，不分享完整 Session、HTML Export、Debug Log、Environment
  Dump、Browser Profile、Database 或 Packet Capture。
- 用 Stable Label 替换敏感值，保留 Correlation。
- 移除 Image Metadata 并检查 Screenshot。
- 记住 Pi `/share` 创建 Secret/Unlisted Gist，不是 Access-controlled Private
  Document。
- 把 Evidence 发给 External Service 前，先约定 Deletion/Retention。

## 响应预期

<!-- sync:security-response -->

Maintainer 应：

1. 确认收到，不请求不必要 Sensitive Data；
2. 验证时保持 Confidentiality；
3. 判断问题属于本仓库、Pi Upstream 还是 Third Party；
4. 紧急时删除 Exposed Data 或禁用 Unsafe Link/Workflow；
5. 准备 Fact-equivalent English/Chinese Correction；
6. 在 Reporter 要求且安全时署名；
7. 修复后发布简洁说明，不提前暴露 Exploit Detail。

当前不承诺 Response-time SLA。

## 本指南的 Security Model

<!-- sync:security-model -->

本指南提供 Operational Recommendation，不提供 Guarantee：

- Project Trust 是 Resource-loading Gate，不是 Sandbox。
- Tool Allowlist 限制 Registered Tool Name，不限制任意 Extension Code。
- Extension 与 Package Lifecycle Script 在本地 Process Boundary 内执行。
- Skill/Prompt 可指导强大操作。
- Worktree/Subprocess 不隔离 Host。
- Tool Routing 只隔离被路由 Surface。
- Container/VM 仍暴露 Operator 提供的 File、Credential、Socket 与 Network。
- Secret Scanner/Redaction Pattern 有 False Negative。
- Source Review 与 Passing CI 不是 Hands-on Security Certification。

即使问题不是可利用 Software Vulnerability，违反以上边界的措辞也应按 Fact
Correction 报告。
