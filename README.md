# AI Chronicle

> A curated collection of AI articles and essays, translated and organized for Chinese readers.

精选 AI 领域的深度文章与洞见，翻译整理，为中文读者呈现。

## 添加新文章

1. 在 `content/articles/` 目录下创建新的 `.md` 文件
2. 在文件顶部添加 frontmatter 元数据：

```markdown
---
title: 文章标题
author: 作者名
date: 2026-03-24
category: 分类
originalUrl: https://原文链接
readTime: 10 分钟阅读
---

文章内容...
```

3. 运行 `npm run build:articles` 或直接 `npm run dev`（会自动构建）
4. 文章会自动出现在博客中

## 技术栈

- React 19
- Vite 6
- TypeScript
- Tailwind CSS
- Markdown (gray-matter + marked)

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 项目结构

```
ai-chronicle/
├── content/
│   └── articles/        # Markdown 文章
│       ├── article-1.md
│       └── article-2.md
├── scripts/
│   └── build-articles.js  # Markdown 构建脚本
├── src/
│   ├── data/
│   │   └── articles.ts   # 自动生成，不要手动编辑
│   ├── pages/
│   └── components/
└── ...
```

## License

MIT
