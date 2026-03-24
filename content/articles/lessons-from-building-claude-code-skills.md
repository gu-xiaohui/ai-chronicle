---
title: 构建 Claude Code 的经验：我们如何使用 Skills
author: Thariq
date: 2026-03-18
category: Claude Code
originalUrl: https://x.com/trq212/status/2033949937936085378
readTime: 15 分钟阅读
---

![Skills 概览](https://pbs.twimg.com/media/GoFq0HtXcAAf-5n?format=jpg&name=large)

Skills 已成为 Claude Code 中使用最广泛的扩展点之一。它们灵活、易于制作，且分发简单。

但这种灵活性也让人们难以知道什么才是最佳实践。什么类型的 Skills 值得制作？写好 Skill 的秘诀是什么？什么时候应该与他人分享？

我们在 Anthropic 大量使用 Claude Code 的 Skills，目前有数百个 Skills 在活跃使用中。以下是我们学到的关于如何使用 Skills 加速开发的经验。

## 什么是 Skills？

如果你对 Skills 还不熟悉，我建议先阅读我们的[文档](https://code.claude.com/docs/en/skills)或观看我们最新的 [Agent Skills 课程](https://anthropic.skilljar.com/introduction-to-agent-skills)。本文假设你已经对 Skills 有一定了解。

关于 Skills 的一个常见误解是它们"只是 markdown 文件"，但 Skills 最有趣的地方在于它们不仅仅是文本文件。它们是文件夹，可以包含脚本、资源、数据等，Agent 可以发现、探索和操作这些内容。

在 Claude Code 中，Skills 还有[多种配置选项](https://code.claude.com/docs/en/skills#frontmatter-reference)，包括注册动态 Hooks。

我们发现 Claude Code 中一些最有趣的 Skills 创造性地使用了这些配置选项和文件夹结构。

## Skills 的 9 种类型

在整理了所有的 Skills 后，我们注意到它们可以归类为几种常见的类型。最好的 Skills 能清晰地归入某一类；而令人困惑的 Skills 往往跨越多个类别。

### 1. 库和 API 参考

解释如何正确使用库、CLI 或 SDK 的 Skills。这些可以是内部库，也可以是 Claude Code 有时处理不好的常用库。这类 Skills 通常包含参考代码片段文件夹和 Claude 在编写脚本时应避免的陷阱列表。

**示例：**
- **billing-lib** — 你的内部计费库：边缘情况、易错点等
- **internal-platform-cli** — 你的内部 CLI 封装器的每个子命令，附带使用时机示例
- **frontend-design** — 让 Claude 更好地适应你的设计系统

### 2. 产品验证

描述如何测试或验证代码是否正常工作的 Skills。这些通常与 Playwright、tmux 等外部工具配合使用进行验证。

验证 Skills 对于确保 Claude 的输出正确非常有用。让工程师花一周时间完善你的验证 Skills 可能是值得的。

**示例：**
- **signup-flow-driver** — 在无头浏览器中运行注册 → 邮箱验证 → 引导流程
- **checkout-verifier** — 使用 Stripe 测试卡驱动结账 UI，验证发票处于正确状态
- **tmux-cli-driver** — 用于交互式 CLI 测试

### 3. 数据获取和分析

连接到你的数据和监控堆栈的 Skills。

**示例：**
- **funnel-query** — 查看注册 → 激活 → 付费的事件连接
- **cohort-compare** — 比较两个群组的留存或转化
- **grafana** — 数据源 UID、集群名称、仪表板查找表

### 4. 业务流程和团队自动化

将重复的工作流程自动化为一个命令的 Skills。

**示例：**
- **standup-post** — 聚合工单跟踪器、GitHub 活动和 Slack → 格式化的站会
- **create-ticket** — 强制执行模式并创建工单
- **weekly-recap** — 合并的 PR + 关闭的工单 + 部署 → 周报

### 5. 代码脚手架和模板

为代码库中的特定功能生成框架样板代码的 Skills。

**示例：**
- **new-workflow** — 脚手架新的服务/工作流程
- **new-migration** — 迁移文件模板
- **create-app** — 新的内部应用

### 6. 代码质量和审查

在组织内强制执行代码质量并帮助审查代码的 Skills。

**示例：**
- **adversarial-review** — 生成子 Agent 进行批评和修复
- **code-style** — 强制执行代码风格
- **testing-practices** — 如何编写测试

### 7. CI/CD 和部署

帮助你在代码库中获取、推送和部署代码的 Skills。

**示例：**
- **babysit-pr** — 监控 PR → 重试 CI → 解决合并冲突
- **deploy-service** — 构建 → 冒烟测试 → 逐步推出
- **cherry-pick-prod** — 隔离的 worktree → cherry-pick → PR

### 8. 运行手册

接受症状，通过多工具调查，并生成结构化报告的 Skills。

**示例：**
- **service-debugging** — 将症状映射到工具和查询
- **oncall-runner** — 获取警报 → 检查常见嫌疑 → 格式化发现
- **log-correlator** — 给定请求 ID，拉取匹配的日志

### 9. 基础设施运维

执行例行维护和操作程序的 Skills。

**示例：**
- **resource-orphans** — 查找孤立的资源 → 清理
- **dependency-management** — 依赖审批工作流程
- **cost-investigation** — 分析账单激增

## 制作 Skills 的技巧

### 不要说显而易见的事

Claude Code 对你的代码库了解很多。如果你发布一个主要是关于知识的 Skill，试着专注于那些能推动 Claude 跳出常规思维方式的信息。

### 建立 Gotchas 部分

任何 Skill 中信号最高的内容是 Gotchas 部分。这些部分应该从常见失败点积累而来。

### 使用文件系统和渐进式披露

Skill 是一个文件夹，不仅仅是一个 markdown 文件。你应该将整个文件系统视为一种上下文工程和渐进式披露的形式。

### 避免过度限制 Claude

Claude 通常会尝试遵循你的指令。给 Claude 它需要的信息，但给它适应情况的灵活性。

### Description 字段是给模型看的

当 Claude Code 启动会话时，它会构建每个可用 Skill 及其描述的列表。description 字段不是摘要 — 它是描述何时触发此 Skill 的说明。

## 分发 Skills

有两种方式与他人分享 Skills：
1. 将你的 Skills 提交到仓库（在 ./.claude/skills 下）
2. 制作 plugin 并在 Claude Code Plugin 市场上发布

## 结语

Skills 是 Agent 非常强大、灵活的工具，但现在还处于早期阶段，我们都在摸索如何最好地使用它们。

经常实验，阅读你的输出，尝试新事物。理解 Skills 最好的方式是开始、实验，看看什么对你有效。
