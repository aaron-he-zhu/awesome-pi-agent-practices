[English](./AGENTS.md) | [简体中文](./AGENTS.zh-CN.md)

# 仓库指令

<!-- sync:agents-warning -->

<!--
保持本文件简洁，并只写跨任务稳定的仓库规则。
Pi 即使在 Project Trust 被拒绝时也可能加载 AGENTS.md。不要在此放 Secret、
临时任务细节或从不可信 Output 复制的指令。
适配模板后删除这些 Comment。
-->

<!-- sync:agents-purpose -->

## 用途

- Repository Purpose：
- Primary User：
- Non-goal：

<!-- sync:agents-map -->

## 仓库地图

- `path/` — Responsibility 与 Owner。
- `path/` — Responsibility，以及 Generated/Manual Status。

<!-- sync:agents-commands -->

## 必需命令

- Install：
- Fast Check：
- Full Check：
- Focused Test：
- Build：
- Format：

Working Directory 或 Runtime Version 不明显时应明确说明。

<!-- sync:agents-rules -->

## 修改规则

- Preserve：
- 不要编辑/由什么生成：
- Public Compatibility：
- Dependency Policy：
- Migration Policy：
- Required Documentation：

<!-- sync:agents-safety -->

## 安全与数据

- 允许的 File/Process/Network：
- 允许的 Credential：
- Sensitive Path/Data：
- 需要显式批准的 Destructive Operation：
- Untrusted/Unattended Work 所需 Containment：

<!-- sync:agents-done -->

## 完成定义

- 已命名 Behavior/Regression Check 通过。
- Diff 没有 Unrelated/Unexplained Change。
- New Dependency、Script、Network/Data Flow 与 Migration 有文档。
- Generated Artifact 被复现或有意排除。
- Risk 与 Skipped Check 已报告。

<!-- sync:agents-local -->

## 更具体的指令

Subdirectory 可以有更具体的 `AGENTS.md`。遵循适用 Hierarchy；发现矛盾时报告，
而不是静默选择。
