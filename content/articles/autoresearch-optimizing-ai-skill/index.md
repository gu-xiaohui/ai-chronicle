---
title: 用 Autoresearch 优化 AI Skill，它教会了我们写更好的测试
author: Lotte (Langfuse)
date: 2026-03-28
category: Claude Code
originalUrl: https://x.com/lotte_verheyden/status/2037665098983190904
readTime: 15 分钟阅读
---

![封面](/images/articles/autoresearch-optimizing-ai-skill/cover.jpg)

[Autoresearch](https://github.com/karpathy/autoresearch) 自 Karpathy 发布以来引起了很多关注，甚至他本人都在自己手动调优了几个月的代码上找到了 20 个改进。它专为优化代码设计，但底层原则适用更广。

看到网上的讨论后，我们想知道：它优化 [Langfuse skill](https://github.com/langfuse/skills/tree/main/skills/langfuse) 的效果如何？

## Autoresearch 是什么

Autoresearch 是一个极简的 ~630 行 Python 脚本，自动化了实验循环。外层"优化器" Agent 读取目标文件，生成改进假设并做出修改。内层循环运行修改后的文件，评估器对结果打分。如果分数提高，保留修改；如果没提高，丢弃修改。无限重复，你终止时停止。

![循环](/images/articles/autoresearch-optimizing-ai-skill/autoresearch-loop.png)

## 测试用例

我们定义了评估 Langfuse skill 的 6 个测试用例，涵盖不同的 Langfuse 场景和查询模式。

![测试](/images/articles/autoresearch-optimizing-ai-skill/test-score.png)

## 实验结果：14 轮优化

![前后对比](/images/articles/autoresearch-optimizing-ai-skill/before-after.png)

运行 14 轮实验后，Autoresearch 生成了一个显著改进的 skill 版本。

## 关键改进

### 1. 用 curl 替换 pip 安装

原始 skill 在生成代码时通过 pip 安装 langfuse。Autoresearch 改为直接使用 curl。

**为什么更好？** pip 需要用户交互（确认提示），需要先安装 Python，需要虚拟环境管理。curl 是预装的，非交互的，不依赖 Python 包管理。

### 2. 用 fetch API 替换 Python SDK

原始 skill 使用 langfuse Python SDK。Autoresearch 改为直接调用 REST API。

**为什么更好？** SDK 需要额外的 pip install 步骤，会在沙盒测试环境中失败。在真实用户仓库中 langfuse 可能已安装了 SDK，但 SDK 更新可能破坏代码。直接调用 REST API 更轻量、更可靠。

### 3. 移除 sub-prompt 追踪

原始 skill 有完整的小节来识别跨 prompt 的共享文本（sub-prompt linking）。Autoresearch 完全移除了。

**为什么更好？** 6 个测试用例中没有一个覆盖此功能。如果不可衡量就会被裁掉。从产品角度看，这些功能用户实际需要——但 skill 现在无法帮助处理常见的迁移后步骤。

### 4. 将"目标函数"作为 harness 的一切

Autoresearch 会精确优化你衡量和给上下文执行的内容。如果目标函数有盲点，它会找到并利用。这是一个好的教训：**花足够时间让 Agent harness 代表真实世界。**

![变更1](/images/articles/autoresearch-optimizing-ai-skill/changes-1.png)

![变更2](/images/articles/autoresearch-optimizing-ai-skill/changes-2.png)

![变更3](/images/articles/autoresearch-optimizing-ai-skill/changes-3.png)

## 收获

![收获](/images/articles/autoresearch-optimizing-ai-skill/takeaways.png)

1. **Autoresearch 优化你衡量什么。** 如果评估数据集太窄或目标函数太简单，它会对实际使用场景过拟合。

2. **有些"错误"实际上是正确的权衡。** 原始 skill 中某些看似低效的代码（如 pip install）提供了更好的开发者体验。Autoresearch 移除了它们是因为测试无法捕捉这种价值。

3. **花时间让 harness 代表真实世界。** Agent 驱动的优化只能和你的评估函数一样好。如果 harness 有盲点，优化器会找到并利用它们。

## 我们会再用吗？

会。尽管有上述注意事项，Autoresearch 无疑比手动优化更快。只是要确保你的评估套件真正代表了实际使用场景。

> 就像初级工程师的 PR 审查：有些变更会很有洞察力，有些则是走捷径。你的工作是把它们分开。
