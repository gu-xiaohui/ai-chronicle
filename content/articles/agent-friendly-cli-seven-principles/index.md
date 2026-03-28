---
title: Agent 友好 CLI 的七个原则
author: Trevin Chow
date: 2026-03-27
category: Agent 设计
originalUrl: https://x.com/trevin/status/2037250000821059933
readTime: 15 分钟阅读
---

我最近在构建几个 CLI 作为副项目，希望它们从一开始就是 Agent 优先的。不是"Agent 大概能用"，而是为 Agent 的工作方式优化。

我找到了什么？优秀的 CLI 设计资源，但完全是关于人类的。[Command Line Interface Guidelines](https://clig.dev/) 非常出色。[CLI-Anything](https://clianything.org/) 也是。但它们是为人类在终端前的世界编写的——人类可以阅读提示、做出判断、视觉解析格式化表格。

**Agent 在后台运行时，交互式 CLI 会崩溃。**彩色输出浪费 token。无界响应吃掉上下文窗口。人类优先 CLI 设计中内置的假设为 Agent 消费者创造了真正的失败模式。

Anthropic 发布了[为 Agent 编写工具的可靠指南](https://www.anthropic.com/engineering/writing-tools-for-agents)，但那是广义的工具设计指南，不是 CLI 特定的。缺少的是一个实用标准，用于评估 CLI 是否对 Agent 工作良好，而不是是否技术上能用。

所以我写了一个。我综合了这些来源和我自己的经验，得出了覆盖"能用"和"好用"之间差距的 **七个原则**。

## 为什么选 CLI 而不是 MCP？

CLI 是文本进、文本出、天生可组合的。LLM 已经从训练数据中知道常见的 CLI 工具，所以没有 schema 开销。MCP 服务器可能仅仅加载工具定义就燃烧数万 token。MCP 在需要每用户认证和结构化治理时才值得，但对于开发者日常构建和使用的工具，**一个设计良好的 CLI 更快、更便宜、更可靠。**

## 严重性分级，不是计分卡

每个发现映射到三个严重级别之一：

- **Blocker**：阻止 Agent 可靠使用（命令挂起、需要人工干预、产出无法恢复）
- **Friction**：Agent 可以用但效率低（更多重试、浪费 token、脆弱解析）
- **Optimization**：CLI 工作正常但可以更快、更便宜或更可靠

## 1. 默认非交互

**原则：** Agent 可能自动化的任何命令都应该在没有提示的情况下运行。交互模式可以为人类存在，但它应该是便利层，不是唯一路径。

这是最常见的 Blocker。当 skill 派生子代理来执行 CLI 时，没有办法将交互提示回传给用户。命令只会挂起。

```bash
# 人类在终端（检测到 TTY）— 提示填充缺失输入
$ blog-cli publish
? Status? draft > published

# Agent 或脚本（无 TTY，或 --no-input）— 只有标志，没有提示
$ blog-cli publish --content my-post.md --yes
Published "My Post" (post_id: post_8k3m)
```

**修复：** 支持 `--no-input`、检测 TTY、接受 `--yes`、通过标志/文件/stdin 接受结构化输入。

## 2. 结构化、可解析的输出

**原则：** 返回数据的命令应该暴露稳定的机器可读表示。Agent 需要数据契约，不是展示格式。

```bash
# 人类可读
$ blog-cli publish --content my-post.md
Published "My Post" to personal
Post ID: post_8k3m

# 机器可读
$ blog-cli publish --content my-post.md --json
{"title":"My Post","post_id":"post_8k3m","status":"published"}
```

**实现：** 支持 `--json`、用退出码 0 表示成功、结果数据写到 stdout、诊断写到 stderr、返回有用字段（名称、URL、ID、状态）、非 TTY 时抑制颜色。

## 3. 快速失败，可操作的错误

**原则：** 当命令失败时，错误应该教会 Agent 如何在下一次尝试中成功。

```bash
# 坏的
$ blog-cli publish
Error: missing required arguments

# 好的
$ blog-cli publish
Error: --content is required. Usage: blog-cli publish --content <file>
Available statuses: draft, published, scheduled
Example: blog-cli publish --content my-post.md
```

好的错误做四件事：指出具体问题、显示正确调用形式、建议有效值、包含示例。收到这种错误的 Agent 可以一次重试就自我修正。

## 4. 安全重试和明确的变更边界

**原则：** Agent 会重试、恢复和重放命令。变更命令应该使重试安全，危险的变更应该明确。

```bash
# 重复相同命令不创建重复工作
$ blog-cli publish --content my-post.md
Published "My Post" (post_id: post_8k3m)
$ blog-cli publish --content my-post.md
Already published "My Post", no changes (post_id: post_8k3m)

# 危险变更是明确的
$ blog-cli posts delete --slug my-post --confirm
```

为有后果的变更提供 `--dry-run`，对危险操作使用明确的破坏性标志，在成功输出中返回足够的状态让 Agent 能验证发生了什么。

## 5. 渐进式帮助发现

**原则：** Agent 不会预先阅读 CLI 的完整文档。它们探测顶级帮助、子命令帮助、然后示例。帮助应该支持这种增量工作流。

```bash
$ blog-cli --help
Commands: publish, posts

$ blog-cli publish --help
Options: --content, --status, --yes, --json, --dry-run
Examples: blog-cli publish --content my-post.md
```

每个子命令的帮助应包含四件事：一行目的、具体调用模式、必需参数/标志、最重要的修饰符或安全标志。**示例比你想的更重要。**没有示例的帮助页迫使 Agent 从标志描述中合成调用方式，这浪费 token 并引发错误。

## 6. 可组合和可预测的结构

**原则：** Agent 通过链接命令来解决任务。它们受益于接受 stdin、产出干净 stdout、使用可预测命名和子命令模式的 CLI。

```bash
cat posts.json | blog-cli posts import --stdin
blog-cli posts list --json | blog-cli posts validate --stdin
blog-cli posts list --status draft --limit 5 --json | jq -r '.[].title'
```

一致性是关键。如果 `posts list` 支持 `--json` 但 `posts stats` 不支持，Agent 必须学习例外。如果 `posts list` 用 `--limit` 但 `comments list` 用 `--max-results`，Agent 必须记住任意的命名差异。

## 7. 有界、高信号的响应

**原则：** Agent 为每行额外输出付出实际成本。大型输出有时合理，但 CLI 应该让精确、相关的响应成为默认。

```bash
# 宽泛但有界
$ blog-cli posts list --limit 25
Showing 25 of 312 posts
To narrow: blog-cli posts list --status published --since 7d --limit 10

# 更精确
$ blog-cli posts list --tag javascript --status published --since 30d --limit 10 --json
```

关键设计举措：当 CLI 截断时，它教 Agent 如何缩小查询。"显示 312 篇中的 25 篇"加一个缩小建议命令给了 Agent 下一步。**转储所有 312 篇给了它一个解析问题。**

## 人类 ❤️ Agent

这里每个原则也让 CLI 对人类更好。结构化输出、可操作的错误、有界响应、非交互自动化路径——这些不是以人类体验为代价对 Agent 的让步。它们是优秀的 CLI 设计，我们一直在不一致地应用，因为人类足够宽容来弥补差距。

为 Agent 作为一等消费者设计消除了那个税，**CLI 在此过程中对人类也变得更好。**
