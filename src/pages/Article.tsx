import { useParams } from 'react-router-dom'
import articles from '../data/articles'

export default function Article() {
  const { slug } = useParams()
  const article = articles.find(a => a.slug === slug)

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">文章未找到</h1>
        <p className="text-[var(--color-muted)]">
          <a href="/" className="text-[var(--color-accent)] hover:underline">返回首页</a>
        </p>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="mb-12 animate-fade-in">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回文章列表
        </a>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-1 rounded-full">
            {article.category}
          </span>
          <span className="text-xs text-[var(--color-muted)]">{article.readTime}</span>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-[var(--color-muted)] pb-8 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
              {article.author.charAt(0)}
            </div>
            <span className="font-medium text-[var(--color-text)]">{article.author}</span>
          </div>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <a 
            href={article.originalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)]"
          >
            原文链接
          </a>
        </div>
      </header>

      {/* Content */}
      <div 
        className="article-content animate-fade-in"
        style={{ animationDelay: '100ms' }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[var(--color-muted)]">
            <p>原文作者：{article.author}</p>
            <p className="mt-1">
              <a 
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--color-accent)]"
              >
                {article.originalUrl}
              </a>
            </p>
          </div>
          <a 
            href="/"
            className="text-sm px-4 py-2 rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors"
          >
            更多文章
          </a>
        </div>
      </footer>
    </article>
  )
}
