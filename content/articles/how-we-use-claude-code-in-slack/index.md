---
title: 我们如何在 Slack 中使用 Claude Code
author: Thariq
date: 2026-01-31
category: Claude Code
originalUrl: https://x.com/trq212/status/2017350486756888917
readTime: 5 分钟阅读
---

![封面](/images/articles/how-we-use-claude-code-in-slack/image-1.jpg)

我们在 Anthropic 使用 Claude Code 的方式与外界最大的不同之一，是我们在 **Slack** 中大量使用它。

具体来说，我们用它来**回答问题、处理反馈和构建原型**。

## 回答问题

当市场、客户支持、营销、产品等部门的人有关于 Claude Code 的问题时，他们会直接在 Slack 中问 Claude。虽然我们保持文档更新，但它们不能涵盖所有可能的问题。**最终的真相来源在代码库中**。

因为它有访问 git 的权限，它可以回答像"这个功能是什么时候发布的？"或"谁负责这段代码？"这样的问题，这可以帮助你找到正确的负责人。

> **Pro tip**：更进一步，添加可以访问事件存储或分析仪表板的 skills，来回答关于功能使用或错误日志的问题。

## 处理反馈

我们有非常活跃的 Claude Code 反馈渠道。当有人发送反馈时，我们经常会 tag @Claude 来尝试用一些引导上下文来解决它。这并不总是可能的，但 PR 可以是一种探索或理解如何做某事的方式。

每个 Slack 中的 Claude 实例都在 web 上的 Claude Code 中可见，所以我在 claude.ai/code 的聊天历史几乎就像我的 Jira 板，反馈 PR 就在那里等着被处理。

## 构建原型

我真的不再发送备忘录或制作模型了，我直接制作 CC 原型。如果我有一个想法，我可能会通过 Slack 中的 Claude 启动原型，等看看结果如何，然后再决定是否值得投入。

## 使用 Slack 中 Claude 的技巧

1. **投资配置（如 CLAUDE.MD、hooks、验证等）更有价值**，因为它让非技术人员也能更好地在 Slack 中使用 Claude。

2. **你仍然需要检查、测试和阅读代码**。我们不会直接从 Slack 合并到 main 分支。

3. **为频道设置"默认仓库"**，让 Slack 中的 Claude 更容易知道它可以在哪里进行更改。

---

**文档链接**: https://code.claude.com/docs/en/slack

如果你已经在使用它，请给我们反馈！
