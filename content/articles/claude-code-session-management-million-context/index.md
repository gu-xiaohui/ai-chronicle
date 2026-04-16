---
title: Claude Code 会话管理与百万级上下文窗口
author: trq
date: 2026-04-16
category: Claude Code
originalUrl: https://x.com/trq212/status/2044548257058328723
readTime: 15 分钟阅读
---

在我最近与 Claude Code 用户的交流中，一个主题反复出现：**100 万 token 上下文窗口是一把双刃剑。**

它让 Claude Code 能更长时间自主运行、更可靠地处理任务，但如果你不刻意管理会话，它也打开了上下文污染的大门。

会话管理比以往任何时候都重要，而且围绕它有很多疑问。是保持一个终端会话，还是开两个？每次提示都重新开始？什么时候用 compact、rewind、subagent？什么会导致一次糟糕的 compact？

这里有大量细节会真正塑造你的 Claude Code 体验，几乎全都与**上下文窗口管理**有关。

![上下文窗口示意](/images/articles/claude-code-session-management-million-context/image-1.jpg)

## 上下文、压缩与上下文衰退

上下文窗口是模型在生成下一个响应时能"看到"的所有内容。它包括系统提示、到目前为止的对话、每个工具调用及其输出、以及每个被读取的文件。Claude Code 的上下文窗口为 100 万 token。

不幸的是，使用上下文是有代价的，通常被称为**上下文衰退**（context rot）。上下文衰退是指随着上下文增长，模型性能下降——因为注意力被分散到更多 token 上，旧的、不相关的内容开始干扰当前任务。对于我们 100 万 token 的模型，我们观察到大约在 30-40 万 token 时会出现某种程度的上下文衰退，但这高度依赖于任务——不是一个硬性规则。

上下文窗口是硬性截止点，所以当接近窗口末尾时，你需要将当前任务摘要为一个更小的描述，并在新的上下文窗口中继续工作——我们称之为**压缩**（compaction）。你也可以手动触发压缩。

![上下文衰退示意](/images/articles/claude-code-session-management-million-context/image-2.jpg)

# 每一轮都是一个分支点

假设你刚让 Claude 做了某件事，它完成了。现在你的上下文中有一些信息（工具调用、工具输出、你的指令），而你有令人惊讶的多个选择：

- **继续** — 在同一会话中发送下一条消息
- **/rewind**（双击 Esc）— 跳回之前的消息并从那里重试
- **/clear** — 开始新会话，通常带一个你从刚才所学中提炼的简报
- **/compact** — 摘要当前会话，在摘要之上继续
- **Subagent** — 将下一块工作委派给一个拥有干净上下文的 Agent，只把结果拉回来

![五种选择示意](/images/articles/claude-code-session-management-million-context/image-3.jpg)

虽然最自然的选择是继续，但其他四个选项的存在是为了帮助管理你的上下文。

## 什么时候开始新会话

新的 100 万 token 上下文窗口意味着你现在可以更可靠地做更长的任务，比如让它从头构建一个全栈应用。但**模型没有耗尽上下文，不意味着你不应该开始新会话。**

我们的一般经验法则是：**开始新任务时，也应该开始新会话。**

一个灰色地带是你可能想做一些相关任务，其中部分上下文仍然必要但不是全部。

例如，为你刚实现的功能写文档。虽然你可以开始新会话，但 Claude 必须重新读取你刚实现的文件，这会更慢更贵。由于文档编写可能不是高度智能敏感的任务，额外的上下文可能值得——换取不用重新读取相关文件的效率提升。

## Rewind 而不是纠正

如果我要选一个标志良好上下文管理的习惯，那就是 **rewind**。

![Rewind 操作示意](/images/articles/claude-code-session-management-million-context/image-4.jpg)

在 Claude Code 中，双击 Esc（或运行 `/rewind`）可以让你跳回任何之前的消息并从那里重新提示。该点之后的消息会从上下文中丢弃。

Rewind 通常是更好的纠正方式。例如，Claude 读了五个文件，尝试了一种方法，不行。你的本能可能是输入"那不行，试试 X"。但更好的做法是 rewind 到文件读取之后，用你学到的信息重新提示："不要用方案 A，foo 模块没有暴露那个接口——直接用 B。"

你还可以用"summarize from here"让 Claude 总结它的发现并创建一个交接消息——就像未来的自己给尝试过并失败的过去的自己写的一封信。

![Summarize from here 示意](/images/articles/claude-code-session-management-million-context/image-5.jpg)

## Compact vs Fresh Session

当会话变长，你有两种方式减轻重量：`/compact` 或 `/clear`（开始全新会话）。它们感觉相似但行为非常不同。

**Compact** 要求模型摘要对话到目前为止的内容，然后用摘要替换历史。这是有损的——你信任 Claude 来决定什么重要，但你不需要自己写任何东西，而且 Claude 可能在包含重要发现或文件方面更彻底。你可以通过传递指令来引导它（如 `/compact 聚焦于 auth 重构，丢弃测试调试`）。

![Compact 流程示意](/images/articles/claude-code-session-management-million-context/image-6.jpg)

**`/clear`** 是你自己写下什么重要（"我们在重构 auth 中间件，约束是 X，关键文件是 A 和 B，已排除方案 Y"），然后干净地开始。这需要更多工作，但生成的上下文是你认为相关的内容。

## 什么导致了糟糕的 Compact？

![Bad Compact 示意](/images/articles/claude-code-session-management-million-context/image-7.jpg)

如果你运行大量长时间会话，你可能注意到某些时候压缩效果特别差。我们发现，**糟糕的 compact 通常发生在模型无法预测你工作方向的时候。**

例如，auto-compact 在一个漫长的调试会话后触发，摘要了调查过程，然后你的下一条消息是"现在修复我们在 bar.ts 中看到的另一个警告"。

但由于会话聚焦于调试，那个其他警告可能已经从摘要中丢失了。

这特别困难，因为由于上下文衰退，模型在压缩时处于其最不智能的状态。有了 100 万 token 上下文，你有更多时间**主动 `/compact`**，并附上你接下来想做的描述。

## Subagent 与全新上下文窗口

![Subagent 流程示意](/images/articles/claude-code-session-management-million-context/image-8.jpg)

Subagent 是一种上下文管理形式，适用于你提前知道一块工作会产生大量你不再需要的中间输出的情况。

当 Claude 通过 Agent 工具生成 subagent 时，那个 subagent 获得自己全新的上下文窗口。它可以做任意多的工作，然后综合结果，只有最终报告返回给父会话。

我们使用的心理测试是：**我以后还需要这个工具输出，还是只需要结论？**

虽然 Claude Code 会自动调用 subagent，但你可能想明确告诉它这样做。例如：

- "启动一个 subagent，根据以下 spec 文件验证这项工作的结果"
- "启动一个 subagent，通读这个其他代码库并总结它的 auth 流程实现方式，然后你用同样的方式自己实现"
- "启动一个 subagent，根据我的 git 变更为这个功能写文档"

## 总结

![总结示意](/images/articles/claude-code-session-management-million-context/image-9.jpg)

当 Claude 结束一轮对话而你准备发送新消息时，你面临一个决策点。

- 新任务？→ 新会话
- 当前任务需要纠正？→ Rewind
- 会话太长需要减重？→ `/compact` 或 `/clear`
- 即将产生大量中间输出？→ 用 subagent

随着时间推移，我们预期 Claude 会自己帮你处理这些决策。但现在，这是你可以引导 Claude 输出的重要方式之一。

---

*原文发布于 X/Twitter，阅读量超 100 万，点赞超 5500。*
