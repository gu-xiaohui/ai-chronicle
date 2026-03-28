---
title: Claude Code 完整课程 2026 — 一次掌握 Claude Code
author: Phosphen
date: 2026-03-27
category: Claude Code
originalUrl: https://x.com/phosphenq/status/2037532834114453740
readTime: 35 分钟阅读
---

![封面](/images/articles/claude-code-full-course-2026/cover.jpg)

大多数开发者把 Claude Code 当成带文件系统的 ChatGPT 来用。他们输入请求，得到文件，觉得很高效。但那只是用了它 10% 的能力。**这是另外 90%。**

8 个级别。确切的顺序。读完你会拥有一个让一个人像小团队一样工作的配置。

## Level 1: 让 Claude Code 跑起来

**忘记你以为它是什么**

大多数人打开 Claude Code 问问题。那不是它的用途。Claude Code 不是更好的 ChatGPT。它是一个在你机器内部操作的 Agent。

它读取文件。写代码。打开浏览器，点击元素，检查控制台。运行终端命令。部署到生产。创建 Pull Request。

你不是问它问题。你给它任务，然后走开。

ChatGPT 给你一个答案。**Claude Code 改变你的项目。**

![安装](/images/articles/claude-code-full-course-2026/level1-installing.jpg)

**安装：两个选择**

选项 A：IDE 扩展 — 下载 Cursor 或 VS Code，搜索 "Claude"，安装。适合入门。

选项 B：CLI 终端 — 这才是解锁一切的那个。

```bash
npm install -g @anthropic/claude-code
cd your-project-folder
claude
```

![CLI](/images/articles/claude-code-full-course-2026/level1-cli.png)

**订阅计划**：Pro $20/月 / Max 5x $100/月 / Max 20x $200/月。同样 token 量通过 API 约 $500/月。订阅永远是更好的选择。

**在做任何事之前**

默认情况下，Claude Code 要求确认每个文件操作。如果你对每个提示都说是，你不是在委派，你是在监督一个非常慢的助手。

永久关闭确认循环：

```bash
alias cc="claude --dangerously-skip-permissions"
source ~/.zshrc
```

现在用 `cc` 启动。不再有提示。

**语音输入：没人谈论的倍增器**

打字时你会缩写、跳过上下文、假设 Claude 理解你的意思。但它并不总是理解。你得到 80% 正确的输出，花 20 分钟修复剩下的 20%。

**说话时一切改变了。** 说话比打字快，所以你不再编辑自己。你解释完整的画面。你描述边缘情况。你提到通常会跳过的约束。Claude 得到更好的指令并在第一次就产出更好的输出。

Wispr Flow 是 Mac 上最好的工具。按住 fn，在任何应用中说话，立即转录。40 秒打字的提示只需 8 秒说完。

**从第一天就值得知道的命令**

```bash
claude /cost    # 这个会话花了多少 token？
claude /doctor  # 诊断安装和配置问题
claude /clear   # 在同一项目中开始新会话
claude /memory  # 查看当前加载到上下文的所有内容
claude /status  # 当前模型、上下文百分比、活动配置
```

## Level 2: 让 Claude 记住你的项目

**33,000 Token 税**

每个新 Claude Code 会话从零开始了解你的项目。它做的第一件事是探索——读目录、打开文件、搞清楚情况。在一个小型 Chrome 扩展项目上，探索花费 33,000 token。实际工作只花 18,500 token。**探索成本几乎是工作的两倍。**

**CLAUDE.md：一次付费，永久受益**

在项目根目录创建 `CLAUDE.md`。Claude 在会话开始时自动读取。零探索需要。

```bash
claude /init
```

Claude 探索一次，写入文件。你再也不用为探索付费。

好的 CLAUDE.md 看起来像：

```markdown
# Project: Markdown Checklist Chrome Extension
## What this is
Chrome extension that converts markdown files into interactive checklists.
## Stack
- Vanilla JS, no frameworks
- Chrome Extensions Manifest V3
## File structure
- /chrome/ — extension files
- /landing/ — marketing landing page
## Rules
- Never install npm packages without asking first
- Always English in code and comments
- When I say "deploy", run: cd landing && npx vercel --prod
```

保持在 500 行以内。目标是定向，不是文档。

![记忆](/images/articles/claude-code-full-course-2026/level2-memory.jpg)

**全局规则**

适用于所有项目的规则放在 `~/.claude/CLAUDE.md`。

**自动记忆**

Claude 在会话中给自己写笔记，存在 `~/.claude/projects/[project-name]/memory.md`。

规则：自动记忆用于环境事实。CLAUDE.md 用于所有重要的东西。定期检查和清理。

## Level 3: 给 Claude 正确的工具

开箱即用的 Claude Code 只能读文件、写文件、运行 shell 命令。仅此而已。

**MCP：给 Claude 眼睛和手**

```bash
# Chrome DevTools MCP — 浏览器自动化
claude mcp add --scope user chrome-devtools npx @chrome-devtools/mcp@latest

# Exa — 真正的网络搜索
claude mcp add exa "https://mcp.exa.ai/mcp?apiKey=YOUR_API_KEY_HERE"

# Context7 — 当前库文档
claude mcp add context7 npx @upstash/context7-mcp@latest
```

![工具](/images/articles/claude-code-full-course-2026/level3-tools.jpg)

**Skills：MCP 不是的东西**

Skill 是项目内的 markdown 文件：`.claude/skills/skill-name/SKILL.md`

关键机制：只有 skill 头自动加载到上下文。完整内容只在 Claude 决定 skill 与当前任务相关时才加载。所以你可以安装 20 个 skill，几乎不花上下文。

**值得立即安装的 Skills：**
- `frontend-design` — 没有 this skill，Claude 的 UI 输出看起来像 AI 生成的
- `git-commit` — 自动执行约定式提交
- `skill-creator` — 帮你构建自己的 skill

![Skills](/images/articles/claude-code-full-course-2026/level3-skills.png)

**子代理：改变一切的部分**

大多数人用一个会话、一个任务、一个上下文窗口使用 Claude Code。那就像在单线程中运行所有代码。

每个子代理有自己的隔离上下文。它做一个工作并报告回来。主会话保持干净。而且它们**并行运行**。

![子代理](/images/articles/claude-code-full-course-2026/level3-subagents.jpg)

按任务选择正确的模型：
- **Opus**：规划、架构、复杂推理
- **Sonnet**：编写代码、实现
- **Haiku**：搜索文档、简单查询

**Agent Teams（实验性）**

两个可以互相讨论的 Agent。适合研究和竞争假设。

![Teams](/images/articles/claude-code-full-course-2026/level3-teams.jpg)

## Level 4: 上下文窗口是预算

每个会话有上下文限制。在你打一个字之前，已经有很多东西在填满它：系统提示、内置工具、CLAUDE.md、MCP 工具、Skill 头、子代理定义、自动记忆。

**三个区域：**
- **绿色区域 (0-50%)**：完整质量
- **橙色区域 (50-70%)**：Claude 开始忘记早期内容
- **红色区域 (70-85%)**：明显退化

**目标：完成任务，开始新会话。不要把旧上下文带入新工作。**

![上下文](/images/articles/claude-code-full-course-2026/level4-context.jpg)

```bash
# 手动压缩 — 你选择什么保留
claude /compact "Focus on: the landing page redesign, current file structure"
```

## Level 5: 部署

**两分钟到在线 URL**

```bash
npx vercel        # 首次部署
npx vercel --prod  # 后续部署
```

![部署](/images/articles/claude-code-full-course-2026/level5-deploy.jpg)

**你的密钥如果放在代码里就不是密钥**

本地开发用 `.env`，`.gitignore` 必须包含 `.env`。生产用 GitHub Secrets。

## Level 6: Git、Worktree 和自动化

**Git 是你的撤销按钮**

```bash
git init && git add . && git commit -m "initial commit"
gh auth login
gh repo create my-project --private && git push -u origin main
```

**Worktree 解决并行工作问题**

两个 Agent 在同一文件夹的不同分支工作会互相覆盖文件。Git worktree 给每个工作一个独立的文件夹：

```bash
git worktree add -b feature-1 ../my-project-feature-1
git worktree add -b feature-2 ../my-project-feature-2
```

![Git](/images/articles/claude-code-full-course-2026/level6-git.jpg)

**自动化部署**

Claude 可以创建 GitHub Actions 工作流，推送到 main 就自动部署到 Vercel。

**保护 Main 分支**

启用分支保护：需要 Pull Request 才能合并，阻止 force push。

## Level 7: 构建真正有效的流程

**核心循环：头脑风暴 → 规格 → 计划 → 执行 → 审查 → 发布**

- **头脑风暴**：在写一行代码之前问每个问题
- **规格**：Claude 写下它理解的内容，你读它
- **计划**：将规格分解为离散任务，一个任务一个子代理
- **执行**：并行运行，每个任务在自己的 worktree 中
- **审查**：子代理检查每个输出是否符合规格
- **发布**：Pull Request，GitHub Actions 处理其余

**Superpowers 框架**自动化了这个工作流。

![流程](/images/articles/claude-code-full-course-2026/level7-process.jpg)

## Level 8: 最小堆栈和下一步

**一次安装，到处工作：**

```bash
# MCP
claude mcp add exa "https://mcp.exa.ai/mcp?apiKey=YOUR_KEY"
claude mcp add context7 npx @upstash/context7-mcp@latest
claude mcp add --scope user chrome-devtools npx @chrome-devtools/mcp@latest

# Skills
claude /plugins  # 安装: frontend-design, superpowers
```

**全局 CLAUDE.md：**
```markdown
- Use Exa for all web search and URL fetching
- Use Context7 for any library or framework
- Git worktrees for parallel work
- Never push directly to main
- Never install packages without asking
- Never store API keys in code
```

**终端别名：**
```bash
alias cc="claude --dangerously-skip-permissions"
```

**真正区分人的东西**

从 Claude Code 获得最多的开发者不是知道最多命令的人。**而是弄清楚 Claude Code 不是更快执行任务的工具的人。它是不同抽象层级操作的工具。**

你停止执行。你指挥。真正的命令不是 `cc`。那只是入口。**真正的命令是：构建一个你处理决策、Claude 处理实现的系统。**

一旦这点击了，生产力数字就不再令人惊讶。当然一个人可以在一天内构建以前需要一周的东西。**他们停止做了大部分工作。**
