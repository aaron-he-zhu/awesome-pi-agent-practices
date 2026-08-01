[English](./coverage-summary.md) | [简体中文](./coverage-summary.zh-CN.md)

# 机器生成的生态覆盖摘要

<!-- sync:generated-coverage-purpose -->

本文件由 `npm run generate:coverage` 生成，请勿手工修改。候选只是待审查线索，不代表推荐、兼容性或安全背书。

数据源：[正式资源注册表](../../data/resources.json)、[发现候选注册表](../../data/discovery-candidates.json)与[实践分类法](../../data/practice-taxonomy.json)。正式矩阵中的边界、风险和研究动作仍见[生态覆盖矩阵](./coverage-matrix.zh-CN.md)。

<!-- sync:generated-coverage-counts -->

当前机器数据包含 **25** 个类别、**15** 条已注册社区记录和 **13** 条活跃发现候选。按 Primary 与 Secondary Category 的全部分配计算，**9** 类没有 Source-reviewed 代表，**25** 类没有 Hands-on-verified 代表；其中 **3** 个源码缺口类别已有候选。若只看互斥 Primary Placement，源码与亲测缺口分别为 **14** 与 **25** 类。机器 JSON 还完整报告 **275** 个 Category × Architecture Cell，其中 **82** 个非空。

## 类别覆盖

<!-- sync:generated-coverage-categories -->

| 类别 | 源码审查全部 / Primary | 人类亲测全部 / Primary | Deferred 全部 / Primary | Rejected / Stale Resource | 发现候选全部 / Primary | 源码架构 | 候选架构 | 状态 |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| VM/工具隔离 (`vm-tool-isolation`) | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | `in-process-extension`, `os-virtualization-boundary` | — | 已有源码证据；亲测缺口 |
| 权限与护栏 (`permission-guardrails`) | 2 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | `external-service`, `in-process-extension`, `os-virtualization-boundary`, `package-suite` | — | 已有源码证据；亲测缺口 |
| 子代理与工作流编排 (`subagents-workflow-orchestration`) | 3 / 2 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | `external-service`, `in-process-extension`, `package-suite` | — | 已有源码证据；亲测缺口 |
| MCP 集成 (`mcp-integration`) | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 1 / 0 | `external-service`, `in-process-extension` | `fork-alternate-distribution`, `package-suite`, `sdk-embedder` | 已有源码证据；亲测缺口 |
| 网页搜索与抓取 (`web-search-fetch`) | 1 / 1 | 0 / 0 | 1 / 0 | 0 / 0 | 0 / 0 | `external-service`, `in-process-extension` | — | 已有源码证据；亲测缺口 |
| 浏览器与已认证配置自动化 (`browser-authenticated-profile-automation`) | 1 / 1 | 0 / 0 | 1 / 0 | 0 / 0 | 0 / 0 | `external-service`, `in-process-extension` | — | 已有源码证据；亲测缺口 |
| 人工审查与规划 (`human-review-planning`) | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | `external-service`, `frontend-controller`, `in-process-extension` | — | 已有源码证据；亲测缺口 |
| 代码智能 (`code-intelligence`) | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 1 / 0 | `external-service`, `in-process-extension` | `fork-alternate-distribution`, `package-suite`, `sdk-embedder` | 已有源码证据；亲测缺口 |
| 持久记忆 (`persistent-memory`) | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | `external-service`, `in-process-extension` | — | 已有源码证据；亲测缺口 |
| 追踪与可观测性 (`tracing-observability`) | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | `external-service`, `in-process-extension` | — | 已有源码证据；亲测缺口 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | 2 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 10 / 7 | `external-service`, `frontend-controller`, `in-process-extension`, `rpc-json-consumer` | `acp-consumer`, `derived-internalized-runtime`, `fork-alternate-distribution`, `frontend-controller`, `in-process-extension`, `package-suite`, `rpc-json-consumer`, `sdk-embedder` | 已有源码证据；亲测缺口 |
| 宽域运行层 (`broad-operating-layer`) | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 2 / 0 | `external-service`, `in-process-extension`, `package-suite` | `derived-internalized-runtime`, `fork-alternate-distribution`, `frontend-controller`, `package-suite`, `sdk-embedder` | 已有源码证据；亲测缺口 |
| 上下文优化 (`context-optimization`) | 1 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | `external-service`, `in-process-extension` | — | 已有源码证据；亲测缺口 |
| 任务、目标与循环工程 (`task-goal-loop-engineering`) | 3 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | `external-service`, `in-process-extension`, `package-suite` | — | 已有源码证据；亲测缺口 |
| UI、状态栏、通知与无障碍 (`ui-statusline-notification-accessibility`) | 0 / 0 | 0 / 0 | 1 / 0 | 0 / 0 | 0 / 0 | — | — | 源码缺口；无已登记候选 |
| 主题与主题工具 (`theme-tooling`) | 0 / 0 | 0 / 0 | 1 / 0 | 0 / 0 | 0 / 0 | — | — | 源码缺口；无已登记候选 |
| 提示模板包 (`prompt-template-pack`) | 0 / 0 | 0 / 0 | 1 / 0 | 0 / 0 | 0 / 0 | — | — | 源码缺口；无已登记候选 |
| 单项技能 (`individual-skill`) | 0 / 0 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | — | — | 源码缺口；无已登记候选 |
| 自定义提供商与模型网关 (`custom-provider-model-gateway`) | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | — | — | 源码缺口；无已登记候选 |
| 本地模型运行时 (`local-model-runtime`) | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | — | — | 源码缺口；无已登记候选 |
| 远程控制、消息与协作 (`remote-control-messaging-collaboration`) | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 4 / 2 | — | `derived-internalized-runtime`, `frontend-controller`, `package-suite`, `rpc-json-consumer`, `sdk-embedder` | 源码缺口；已有候选 |
| 包套件与替代发行版 (`package-suite-alternate-distribution`) | 0 / 0 | 0 / 0 | 1 / 1 | 0 / 0 | 4 / 3 | — | `derived-internalized-runtime`, `fork-alternate-distribution`, `frontend-controller`, `package-suite`, `sdk-embedder` | 源码缺口；已有候选 |
| Git 与审查自动化 (`git-review-automation`) | 3 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 1 / 1 | `external-service`, `frontend-controller`, `in-process-extension` | `sdk-embedder` | 已有源码证据；亲测缺口 |
| 评测与基准测试 (`evals-benchmarking`) | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 1 / 0 | — | `fork-alternate-distribution`, `package-suite`, `sdk-embedder` | 源码缺口；已有候选 |
| 会话导出、分享与发布 (`session-export-sharing-publishing`) | 1 / 0 | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | `external-service`, `frontend-controller`, `in-process-extension` | — | 已有源码证据；亲测缺口 |

## 类别 × 架构单元格

<!-- sync:generated-coverage-cells -->

机器 JSON 保存全部 275 个单元格，包括零值。下表只展示非空单元格；Unresolved 与 Rejected Candidate 分列，绝不计入源码或亲测证据。

| 类别 | 架构 | 源码审查 | 人类亲测 | Deferred Resource | Rejected Resource | Stale Resource | 其他 Inactive | Unresolved Candidate | Rejected Candidate |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| VM/工具隔离 (`vm-tool-isolation`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| VM/工具隔离 (`vm-tool-isolation`) | OS/虚拟化边界 (`os-virtualization-boundary`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 权限与护栏 (`permission-guardrails`) | 进程内扩展 (`in-process-extension`) | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 权限与护栏 (`permission-guardrails`) | 外部服务 (`external-service`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 权限与护栏 (`permission-guardrails`) | OS/虚拟化边界 (`os-virtualization-boundary`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 权限与护栏 (`permission-guardrails`) | 包套件 (`package-suite`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 子代理与工作流编排 (`subagents-workflow-orchestration`) | 进程内扩展 (`in-process-extension`) | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 子代理与工作流编排 (`subagents-workflow-orchestration`) | 外部服务 (`external-service`) | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 子代理与工作流编排 (`subagents-workflow-orchestration`) | 包套件 (`package-suite`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| MCP 集成 (`mcp-integration`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| MCP 集成 (`mcp-integration`) | SDK 嵌入者 (`sdk-embedder`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| MCP 集成 (`mcp-integration`) | 外部服务 (`external-service`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| MCP 集成 (`mcp-integration`) | Fork/替代发行版 (`fork-alternate-distribution`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| MCP 集成 (`mcp-integration`) | 包套件 (`package-suite`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 网页搜索与抓取 (`web-search-fetch`) | 纯资源 (`resource-only`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 网页搜索与抓取 (`web-search-fetch`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 网页搜索与抓取 (`web-search-fetch`) | 外部服务 (`external-service`) | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 浏览器与已认证配置自动化 (`browser-authenticated-profile-automation`) | 纯资源 (`resource-only`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 浏览器与已认证配置自动化 (`browser-authenticated-profile-automation`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 浏览器与已认证配置自动化 (`browser-authenticated-profile-automation`) | 外部服务 (`external-service`) | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 人工审查与规划 (`human-review-planning`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 人工审查与规划 (`human-review-planning`) | 前端/控制器 (`frontend-controller`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 人工审查与规划 (`human-review-planning`) | 外部服务 (`external-service`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 代码智能 (`code-intelligence`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 代码智能 (`code-intelligence`) | SDK 嵌入者 (`sdk-embedder`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 代码智能 (`code-intelligence`) | 外部服务 (`external-service`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 代码智能 (`code-intelligence`) | Fork/替代发行版 (`fork-alternate-distribution`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 代码智能 (`code-intelligence`) | 包套件 (`package-suite`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 持久记忆 (`persistent-memory`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 持久记忆 (`persistent-memory`) | 外部服务 (`external-service`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 追踪与可观测性 (`tracing-observability`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 追踪与可观测性 (`tracing-observability`) | 外部服务 (`external-service`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | SDK 嵌入者 (`sdk-embedder`) | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | RPC/JSON 消费者 (`rpc-json-consumer`) | 1 | 0 | 0 | 0 | 0 | 0 | 3 | 0 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | ACP 消费者 (`acp-consumer`) | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | 前端/控制器 (`frontend-controller`) | 1 | 0 | 0 | 0 | 0 | 0 | 9 | 0 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | 外部服务 (`external-service`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | Fork/替代发行版 (`fork-alternate-distribution`) | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | 派生/内部化运行时 (`derived-internalized-runtime`) | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| 替代 UI 与编辑器集成 (`alternate-ui-editor-integration`) | 包套件 (`package-suite`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 宽域运行层 (`broad-operating-layer`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 宽域运行层 (`broad-operating-layer`) | SDK 嵌入者 (`sdk-embedder`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 宽域运行层 (`broad-operating-layer`) | 前端/控制器 (`frontend-controller`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 宽域运行层 (`broad-operating-layer`) | 外部服务 (`external-service`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 宽域运行层 (`broad-operating-layer`) | Fork/替代发行版 (`fork-alternate-distribution`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 宽域运行层 (`broad-operating-layer`) | 派生/内部化运行时 (`derived-internalized-runtime`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 宽域运行层 (`broad-operating-layer`) | 包套件 (`package-suite`) | 1 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| 上下文优化 (`context-optimization`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 上下文优化 (`context-optimization`) | 外部服务 (`external-service`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 任务、目标与循环工程 (`task-goal-loop-engineering`) | 进程内扩展 (`in-process-extension`) | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 任务、目标与循环工程 (`task-goal-loop-engineering`) | 外部服务 (`external-service`) | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 任务、目标与循环工程 (`task-goal-loop-engineering`) | 包套件 (`package-suite`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| UI、状态栏、通知与无障碍 (`ui-statusline-notification-accessibility`) | 进程内扩展 (`in-process-extension`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| UI、状态栏、通知与无障碍 (`ui-statusline-notification-accessibility`) | 包套件 (`package-suite`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 主题与主题工具 (`theme-tooling`) | 进程内扩展 (`in-process-extension`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 主题与主题工具 (`theme-tooling`) | 包套件 (`package-suite`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 提示模板包 (`prompt-template-pack`) | 进程内扩展 (`in-process-extension`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 提示模板包 (`prompt-template-pack`) | 包套件 (`package-suite`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 单项技能 (`individual-skill`) | 纯资源 (`resource-only`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 单项技能 (`individual-skill`) | 外部服务 (`external-service`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 远程控制、消息与协作 (`remote-control-messaging-collaboration`) | SDK 嵌入者 (`sdk-embedder`) | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| 远程控制、消息与协作 (`remote-control-messaging-collaboration`) | RPC/JSON 消费者 (`rpc-json-consumer`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 远程控制、消息与协作 (`remote-control-messaging-collaboration`) | 前端/控制器 (`frontend-controller`) | 0 | 0 | 0 | 0 | 0 | 0 | 4 | 0 |
| 远程控制、消息与协作 (`remote-control-messaging-collaboration`) | 派生/内部化运行时 (`derived-internalized-runtime`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 远程控制、消息与协作 (`remote-control-messaging-collaboration`) | 包套件 (`package-suite`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 包套件与替代发行版 (`package-suite-alternate-distribution`) | 进程内扩展 (`in-process-extension`) | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 包套件与替代发行版 (`package-suite-alternate-distribution`) | SDK 嵌入者 (`sdk-embedder`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 包套件与替代发行版 (`package-suite-alternate-distribution`) | 前端/控制器 (`frontend-controller`) | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 |
| 包套件与替代发行版 (`package-suite-alternate-distribution`) | Fork/替代发行版 (`fork-alternate-distribution`) | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 |
| 包套件与替代发行版 (`package-suite-alternate-distribution`) | 派生/内部化运行时 (`derived-internalized-runtime`) | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 |
| 包套件与替代发行版 (`package-suite-alternate-distribution`) | 包套件 (`package-suite`) | 0 | 0 | 1 | 0 | 0 | 0 | 3 | 0 |
| Git 与审查自动化 (`git-review-automation`) | 进程内扩展 (`in-process-extension`) | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Git 与审查自动化 (`git-review-automation`) | SDK 嵌入者 (`sdk-embedder`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| Git 与审查自动化 (`git-review-automation`) | 前端/控制器 (`frontend-controller`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Git 与审查自动化 (`git-review-automation`) | 外部服务 (`external-service`) | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 评测与基准测试 (`evals-benchmarking`) | SDK 嵌入者 (`sdk-embedder`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 评测与基准测试 (`evals-benchmarking`) | Fork/替代发行版 (`fork-alternate-distribution`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 评测与基准测试 (`evals-benchmarking`) | 包套件 (`package-suite`) | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 会话导出、分享与发布 (`session-export-sharing-publishing`) | 进程内扩展 (`in-process-extension`) | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 会话导出、分享与发布 (`session-export-sharing-publishing`) | 前端/控制器 (`frontend-controller`) | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 会话导出、分享与发布 (`session-export-sharing-publishing`) | 外部服务 (`external-service`) | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |

## 架构分层

<!-- sync:generated-coverage-architectures -->

同一能力类别中的不同架构会产生不同的权限、生命周期与兼容性边界；因此，一个项目不能自动代表整个类别。

| 架构 | 源码审查记录 | 发现候选 |
| --- | ---: | ---: |
| 纯资源 (`resource-only`) | 0 | 0 |
| 进程内扩展 (`in-process-extension`) | 11 | 1 |
| SDK 嵌入者 (`sdk-embedder`) | 0 | 5 |
| RPC/JSON 消费者 (`rpc-json-consumer`) | 1 | 3 |
| ACP 消费者 (`acp-consumer`) | 0 | 2 |
| 前端/控制器 (`frontend-controller`) | 2 | 10 |
| 外部服务 (`external-service`) | 9 | 0 |
| OS/虚拟化边界 (`os-virtualization-boundary`) | 1 | 0 |
| Fork/替代发行版 (`fork-alternate-distribution`) | 0 | 3 |
| 派生/内部化运行时 (`derived-internalized-runtime`) | 0 | 3 |
| 包套件 (`package-suite`) | 1 | 3 |

## 生态关系

<!-- sync:generated-coverage-relations -->

关系描述项目如何与 Pi 相连，而不是质量、当前兼容性或推荐等级；历史关系不会因后续内部化或重命名而被覆盖。

| 关系 | 源码审查记录 | 发现候选 |
| --- | ---: | ---: |
| Pi 包或资源 (`pi-package-or-resource`) | 11 | 2 |
| SDK 嵌入者 (`sdk-embedder`) | 0 | 5 |
| 历史 SDK 嵌入者 (`historical-sdk-embedder`) | 0 | 1 |
| Pi 包消费者 (`pi-package-consumer`) | 0 | 1 |
| RPC/JSON 消费者 (`rpc-json-consumer`) | 1 | 3 |
| ACP 消费者 (`acp-consumer`) | 0 | 2 |
| 前端或控制器 (`frontend-or-controller`) | 2 | 10 |
| Fork 或替代发行版 (`fork-or-alternate-distribution`) | 0 | 3 |
| 由 Pi 派生或内部化 (`derived-or-internalized-from-pi`) | 0 | 3 |
| 服务或基础设施 (`service-or-infrastructure`) | 9 | 0 |
| 官方相邻 (`official-adjacent`) | 1 | 0 |
| 历史或归档 (`historical-or-archived`) | 0 | 0 |
| 间接消费者 (`indirect-consumer`) | 0 | 1 |
