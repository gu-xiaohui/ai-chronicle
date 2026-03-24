export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <h1 className="font-serif text-4xl font-bold mb-8 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
        关于 AI Chronicle
      </h1>

      <div className="article-content">
        <p>
          <strong>AI Chronicle</strong> 是一个精选 AI 领域深度文章的集合，致力于将优质的英文内容翻译整理，为中文读者提供便捷的阅读体验。
        </p>

        <h2>为什么创建这个项目？</h2>
        <p>
          AI 领域发展迅速，许多来自 Anthropic、OpenAI、Google 等顶尖团队的一手经验和洞见都以英文发布。我们希望通过翻译和整理，让更多中文读者能够接触到这些高质量的内容。
        </p>

        <h2>内容来源</h2>
        <p>
          所有文章均来自原作者的公开分享，我们会在每篇文章中标注原文链接和作者信息。如果您是原作者且不希望您的文章出现在这里，请与我们联系。
        </p>

        <h2>贡献</h2>
        <p>
          欢迎提交您发现的优质 AI 文章，或者帮助我们改进翻译质量。请访问我们的{' '}
          <a href="https://github.com/gu-xiaohui/ai-chronicle" target="_blank" rel="noopener noreferrer">
            GitHub 仓库
          </a>
          。
        </p>

        <blockquote>
          "The art of AI, curated for the curious mind."
        </blockquote>
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]">
        <h3 className="font-serif text-lg font-semibold mb-4">联系方式</h3>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/gu-xiaohui/ai-chronicle" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
