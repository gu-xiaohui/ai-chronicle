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

结果是无人干预的机器速度迭代。Karpathy 报告约每小时 12 个实验，意味着一晚上约 100 个实验。

## 测试设置

Langfuse skill 相当宽泛，包含通用最佳实践指导和特定用例的详细指南。为了控制范围，我们专注于 **prompt 迁移用例**。

```bash
skills/langfuse
|---SKILL.md
|---references
    |---instrumentation.md
    |---prompt-migration.md
    |---...
```

为了适配 AI skill（而非代码），我们对 autoresearch 做了一些调整：

![设置](/images/articles/autoresearch-optimizing-ai-skill/test-score.png)

**评分函数：**

```
score = (correctness * 0.5) + (completeness * 0.3) + (efficiency * 0.2)
```

- **正确性**：通过静态代码检查确定——原始 prompt 已移除、`get_prompt()` 和 `.compile()` 存在、使用了 `label="production"`、在 Langfuse 中创建了正确内容的 prompt、使用了 `{{var}}` 语法、类型正确
- **完整性**：实际迁移的预期 prompt 占比
- **效率**：基于 Agent 轮次的奖励/惩罚

我们还添加了停止标准（原项目没有）：连续 5 个实验没有改进后循环停止。

## 测试用例仓库

我们构建了 6 个递增难度的测试代码库。每个实验中，Agent 对所有 6 个运行 skill，评估器对结果打分。

![测试用例](/images/articles/autoresearch-optimizing-ai-skill/before-after.png)

每个用例都有一个 `expected.json` 定义评估器检查什么：哪些 prompt 应该存在于 Langfuse、它们应该有哪些变量、代码中哪些模式应该消失。

## 前后对比

你可以在[这里](https://langfuse.com/blog/2026-03-24-optimizing-ai-skill-with-autoresearch#before-and-after)看到 skill 在 14 个实验前后的样子。总的来说，这些内容改变了：

![变更](/images/articles/autoresearch-optimizing-ai-skill/changes-1.png)

## 我们没有接受所有更新

目标分数从 0.35 提高到 0.824，但如下所述，并非所有改变都是改进。

![分数](/images/articles/autoresearch-optimizing-ai-skill/changes-2.png)

你可以在 [PR #17](https://github.com/langfuse/skills/pull/17) 中看到我们挑选并提交到真实 skill 的变更。其余的被丢弃了。

## 深入结果

Agent 运行了 14 个实验。有些 autoresearch 找到了有用的东西，有些则优化了测试 harness 而非实际使用。

### 做得好的

**1. 双花括号 CRITICAL 警告**

跨多个实验，Agent 不断上传使用 `{var}` 而非 `{{var}}` 的 prompt 到 Langfuse。Langfuse 使用双花括号进行变量替换——单花括号被视为字面文本。原始 skill 也提到了这一点，但它隐藏在表格行中。Autoresearch 将其提升了两次：首先是内联指令，然后在 prompt 创建步骤顶部添加了 **CRITICAL** 粗体警告。每次提升都改善了分数。

**2. 清单步骤**

在复杂用例（9 个文件中 12 个 prompt）中，Agent 通常在完全了解需要改变什么之前就开始修改代码，然后遗漏 prompt 或失去跟踪。Autoresearch 添加了一个明确的步骤：

> "在编写任何代码之前，制作你找到的每个 prompt 的完整清单"

包含 6 个必填字段（名称、源文件、要重构的代码文件、类型、变量、prompt 内容）。这迫使 Agent 先规划再行动。Case 04 从不稳定的结果变为稳定地在 0.88 以上评分。

**先规划再行动是对人类来说显而易见的建议；结果证明 Agent 需要你明确说出来。**

### 做了无关或有害的

**1. 跳过文档获取**

主 skill 文件说"文档优先：编写代码前总是获取当前文档"，因为 Langfuse 更新频繁。Autoresearch 将此改为"对于有参考文件覆盖的任务，直接遵循该文件。"这节省了轮次并提高了效率分数。但这也意味着当 API 更改时，skill 会静默使用过时的指令。

虽然这改善了今天测试 harness 的执行，但明天在生产环境中会崩溃。

![问题](/images/articles/autoresearch-optimizing-ai-skill/changes-3.png)

**2. 移除审批门并切换到 curl**

这是 autoresearch 单个最大的分数提升——Case 01-03 在一个实验中从 0.00 正确性跃升到 1.00。原始 skill 有一个步骤让 Agent 展示其迁移计划并等待用户批准后才修改代码。在 autoresearch harness 中，没有人类，所以批准永远不会到来，Agent 就一直规划。

移除它使 skill 在实际使用场景中变得更差——你可能希望审查它即将做什么。类似地，autoresearch 从 `langfuse.create_prompt()`（Python SDK）切换到对 REST API 的原始 curl 命令，因为 `pip install langfuse` 在沙盒测试环境中会失败。在 langfuse 已安装的真实用户仓库中，SDK 更干净、更不易出错。

> 这不完全是 Agent 的错。这是一个很好的例子，说明没有花足够时间让 Agent harness 代表真实世界会导致次优结果。

**3. 移除 sub-prompt 和 trace linking**

原始 skill 有完整的小节来识别跨 prompt 的共享文本（sub-prompt）和将 prompt 链接到 trace 以实现可观测性。Autoresearch 完全移除了两者。为什么？因为 6 个测试用例没有一个覆盖这些功能。**如果不可衡量，它就会被裁掉。**从产品角度看，这些是用户实际需要的功能——现在 skill 无法帮助处理常见的迁移后步骤。

## 你的目标函数和 Agent Harness 就是一切

Autoresearch 精确优化你在给定执行上下文中衡量的东西。如果你的目标函数有盲点，它会找到并利用它们。[Autoresearch 社区](https://github.com/karpathy/autoresearch/pull/218)一直在提出同样的担忧：这是机器速度的古德哈特定律。无论你暴露什么指标，Agent 都会无情地利用它。

除此之外，autoresearch 在[更广泛社区](https://news.ycombinator.com/item?id=47291123)中的常见批评是验证集过拟合。对固定测试用例集运行数百个实验，你最终会针对特定数据的怪癖进行优化。

问题是：大多数人不会构建足够完整的目标函数。我们没有。对于一个做一件狭窄事情的 skill，构建覆盖完整表面积的目标函数是可行的。Autoresearch 可能会给你很好的结果。例如，Shopify 的 Tobi Lutke 将 autoresearch [应用于他们的 Liquid 模板引擎](https://x.com/tobi/status/2032212531846971413)——一个狭窄、定义明确的优化目标——从 93 个自动提交中获得了 53% 更快的渲染和 61% 更少的内存分配。他仍然指出了过拟合问题。

![教训](/images/articles/autoresearch-optimizing-ai-skill/takeaways.png)

对于像这样的广泛 skill，表面积太大，无法将所有内容纳入目标函数和 harness。所以**把输出当作灵感**。并在准备上花足够时间。

工作流不是"运行它然后提交结果"。而是：

1. **花足够时间在设置上**，让 harness 和目标函数正确。正如 [autoresearch 社区指出](https://github.com/karpathy/autoresearch/issues/22)的，人类的工作从"你能实现这个吗？"变成了"你能写出一个产生有用研究的 program.md 吗？"
2. **让它运行**
3. **批判性地审查**：阅读每个变更，理解为什么做出，问它是真正的改进还是 harness/目标函数的伪影
4. **挑选相关改进**，丢弃过拟合

> 底线：像审查初级工程师的 PR 一样审查它。他们会有好主意混着坏主意。有些变更会很有洞察力。有些会是恰好通过测试的捷径，比如移除审批门、切换到 curl。在像这样模糊的环境中，分辨它们是你的工作。

## 我们会再用吗？

会。尽管有上述所有内容，autoresearch 绝对有用。它测试 skill 的程度远超我们手动会做的：6 个代码库上 14 个实验，数十次完整 Agent 运行。它暴露了我们没考虑到的失败模式（双花括号问题、先规划再行动问题）。拥有一个从你没想到的角度压力测试你的 skill 的流程是有价值的。

## 用 Autoresearch 进行 Prompt 优化

除了 skill，同样的模式可以应用于 prompt 优化。我们之前[探索过 prompt 改进工作流](https://langfuse.com/blog/2026-02-26-evaluate-ai-agent-skills)，用 autoresearch 自动化该循环是自然的下一步。虽然同样的警告适用：如果你的评估数据集太窄或目标函数太简单，你会同样高效地过拟合。

本文也发布在 [Langfuse Blog](https://langfuse.com/blog/2026-03-24-optimizing-ai-skill-with-autoresearch)。
