---
title: .claude/ 文件夹结构详解
author: Akshay Pachaar
date: 2026-03-19
category: Claude Code
originalUrl: https://x.com/akshay_pachaar/status/2035341800739877091
readTime: 8 分钟阅读
---

![封面](/images/articles/anatomy-of-claude-folder/image-1.jpg)

`.claude/` 文件夹是项目中的一个重要目录，包含 Claude Code 的配置文件。理解其结构可以帮助你自定义开发体验。

## CLAUDE.md

CLAUDE.md 文件是主要的配置文件，向 Claude 提供项目特定的指令。它可以包括：

- 项目结构和架构
- 编码风格指南
- 构建、测试和部署的常用命令
- 重要的模式或约定
- 需要避免的事项（陷阱）

![CLAUDE.md 示例](/images/articles/anatomy-of-claude-folder/image-2.jpg)

## settings.json

settings.json 文件允许你配置 Claude Code 行为的各个方面，包括：

- 默认模型
- 权限和访问控制
- 工具配置
- 环境设置

![settings.json 示例](/images/articles/anatomy-of-claude-folder/image-3.jpg)

## skills/

skills/ 目录包含自定义技能，可以扩展 Claude 的能力。每个技能都是一个独立的文件夹，包含：

- SKILL.md - 技能描述和指令
- 相关的脚本或资源文件

![skills 目录](/images/articles/anatomy-of-claude-folder/image-4.jpg)

## agents/

agents/ 目录用于定义自定义 Agent，可以创建专门的子 Agent 来处理特定任务。

![agents 目录](/images/articles/anatomy-of-claude-folder/image-5.jpg)

## hooks/

hooks/ 目录包含在特定事件时自动执行的脚本，可以自动化常见工作流程。

![hooks 目录](/images/articles/anatomy-of-claude-folder/image-6.jpg)

## 总结

`.claude/` 文件夹结构：

```
.claude/
├── CLAUDE.md        # 项目配置和指令
├── settings.json    # Claude Code 设置
├── skills/          # 自定义技能
├── agents/          # 自定义 Agent
├── hooks/           # 自动化钩子
└── rules/           # 规则文件（可选）
```

理解这个结构可以帮助你更好地自定义和优化 Claude Code 的使用体验。
