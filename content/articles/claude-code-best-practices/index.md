---
title: Claude Code 最佳实践：从"能用"到"真的好用"
author: Mr Panda
date: 2026-03-23
category: Claude Code
originalUrl: https://x.com/PandaTalk8/status/2035975664730575325
readTime: 20 分钟阅读
---

![封面](/images/articles/claude-code-best-practices/image-1.png)

我用 Claude Code 大半年了，踩过的坑比写过的代码还多。

一开始我以为 Claude Code 就是一个"更高级的 Copilot"——在终端里打字，它帮我写代码，完事。后来才发现，这东西的上限远比我想象得高，但前提是你得知道怎么用。

这篇文章结合官方文档和实战经验，整理了我认为最重要的使用技巧。有些是血泪教训，有些是读文档才知道的隐藏功能。

## 一、CLAUDE.MD：最被低估的功能

如果你只记住这篇文章的一件事，就记这个：

**写好你的 CLAUDE.md。**

CLAUDE.md 是 Claude Code 在每次对话开始时自动读取的指令文件。它就像你给一个新同事写的 onboarding doc——你希望他知道什么，你就写什么。

很多人不写 CLAUDE.md，或者随便写两行。结果就是每次对话都要从头解释项目结构、编码规范、技术栈选择。这就像每天早上都要重新给同事介绍一遍公司。

### 一个好的 CLAUDE.md 应该包含什么

```markdown
# 项目名称

## 构建和测试命令
- 安装依赖：npm install
- 运行测试：npm test
- 单个测试：npm test -- --grep "test name"
- 格式化：npm run format

## 编码规范
- Python 使用 ruff 格式化，行宽 88
- 测试用 pytest，每个 service 对应一个测试文件
- API 路由文件名用复数：users.py, orders.py
- 提交信息用英文，格式：type(scope): description

## 架构决策
- 选 Tailwind 而不是 CSS Modules，因为团队统一了这个规范
- 用户权限校验在 middleware 里做，不要在每个路由重复写
- Redis 缓存的 key 前缀统一用 `app:v1:`

## 常见陷阱
- 数据库连接池上限是 20，别在循环里开新连接
- 不要 mock 数据库，上次 mock 测试通过但生产迁移失败了
```

### 关键原则

1. **写 Claude 从代码里读不出来的东西** — 项目的"为什么"比"是什么"更重要
2. **控制在 200 行以内** — 太长会导致 Claude 忽略规则
3. **不要放频繁变化的内容** — 详细 API 文档不适合放在这里

### CLAUDE.md 的四级层级

![CLAUDE.md 层级](/images/articles/claude-code-best-practices/image-2.png)

## 二、提示词的质量决定产出的质量

**好的指令应该包含三个要素：目标、约束、上下文。**

### 差的指令 vs 好的指令

> ❌ 差："给用户列表加个搜索功能"

> ✅ 好："在 @src/pages/UserList.tsx 的表格上方加一个搜索框。搜索走后端 API /api/users?search=xxx，用 debounce 300ms，样式和 Filter 组件一致。"

### 官方推荐的提示技巧

1. **用 @ 引用具体文件** — `@src/auth/login.ts#5-30`
2. **贴截图和图片** — Ctrl+V 直接粘贴
3. **给验证标准** — 包含测试用例或预期输出
4. **明确"不要做"的事** — "只改这个函数，不要动其他代码"

## 三、PLAN MODE：先想清楚，再动手

在 Plan Mode 下，Claude Code 只能读取文件、搜索代码，**不能做任何修改**。

### 推荐的复杂任务工作流

1. 进入 Plan Mode
2. 让 Claude 阅读相关代码
3. 请求计划
4. Ctrl+G 审查和编辑计划
5. 切回正常模式
6. 按照计划实现
7. 让 Claude 对照需求自查

**判断标准：** 如果这个任务的实现方式只有一种，直接做。如果有多种选择，先规划。

## 四、子 AGENT：分身术

子 Agent 可以启动独立的 AI 进程来并行处理任务，每个子 Agent 有自己的上下文窗口。

### 后台运行：Ctrl+B

把子 Agent 放到后台运行，继续和 Claude 聊其他事。

适合：
- 跑测试套件
- 大范围代码搜索
- 不紧急的代码审查

## 五、上下文管理

### 五个实用策略

1. **/clear** — 一件事做完就清空
2. **/compact** — 手动压缩上下文
3. **/context** — 看看上下文被谁吃了
4. **用子 Agent 隔离噪声**
5. **在 CLAUDE.md 里写压缩保留指令**

![Memory vs CLAUDE.md](/images/articles/claude-code-best-practices/image-3.png)

## 六、权限管理

![权限模式](/images/articles/claude-code-best-practices/image-4.png)

### 几个 Git 铁律

1. **永远不要让 Claude Code 自动 push**
2. **频繁 commit** — 保留回退能力
3. **警惕破坏性操作** — rm -rf、git reset --hard 等

## 七、HOOKS：让规则变成铁律

CLAUDE.md 里的指令是"建议"，Hooks 是"铁律"。

![Hooks 事件类型](/images/articles/claude-code-best-practices/image-5.png)

## 八、快捷键速查

![快捷键](/images/articles/claude-code-best-practices/image-6.png)

## 总结

按重要性排序：

1. 写好 CLAUDE.md
2. 给精确的指令
3. 用 Plan Mode
4. 管理上下文
5. 控制权限
6. 频繁 commit

**Claude Code 的核心使用哲学：它是一个极其能干的协作者，但不是自动驾驶。方向盘始终在你手里。**
