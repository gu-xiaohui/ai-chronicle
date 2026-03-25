---
title: 使用 Claude Code 制作 Playground
author: Thariq
date: 2026-01-30
category: Claude Code
originalUrl: https://x.com/trq212/status/2017024445244924382
readTime: 5 分钟阅读
---

![封面](/images/articles/making-playgrounds-using-claude-code/image-1.jpg)

我们发布了一个新的 Claude Code 插件叫 **playground**，它帮助 Claude 生成 HTML playground。这些是独立的 HTML 文件，让你可以用 Claude 可视化问题、与之交互，并给你一个输出提示粘贴回 Claude Code。

我发现这对于以不适合文本的方式与模型交互非常有用，例如：

- **可视化代码库架构**
- **调整组件设计**
- **头脑风暴布局和设计**
- **调整游戏平衡**

## 开始使用

在 Claude Code 中运行以下命令安装插件：

```
/plugin marketplace update claude-plugins-official
/plugin install playground@claude-plugins-official
```

## 一些有趣的 Playground 示例

### 1. 改变 AskUserQuestion 工具的设计

```
prompt: "Use the playground skill to create a playground that helps me explore new layout changes to the AskUserQuestion Tool"
```

### 2. 批评你的写作并获得反馈

```
prompt: "Use the playground skill to review my SKILL.MD and give me inline suggestions I can approve, reject or comment"
```

### 3. 调整 Remotion 视频开场

```
prompt: "Use the playground skill to tweak my intro screen to be more interesting and delightful"
```

### 4. 查看架构图并让用户评论

```
prompt: "Use the playground skill to show how this email agent codebase works and let me comment on particular nodes in the architecture to ask questions, make edits, etc"
```

### 5. 平衡我正在制作的超级英雄 Roguelike 游戏

```
prompt: "Use the playground skill to help me balance the 'Inferno' hero's deck"
```

## 小贴士

创建有趣 playground 的技巧——想一种与模型交互的独特方式，然后让它表达出来。你可能会发现它令人惊讶。

如果你做出了很酷的东西，请分享！
