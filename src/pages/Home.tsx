import articles from '../data/articles'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero */}
      <section className="text-center mb-16 animate-fade-in">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          AI Chronicle
        </h1>
        <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
          精选 AI 领域的深度文章与洞见，翻译整理，为中文读者呈现
        </p>
      </section>

      {/* Articles Grid */}
      <section>
        <h2 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-accent)]"></span>
          文章精选
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article, index) => (
            <article 
              key={article.slug}
              className="article-card animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <a href={`/article/${article.slug}`} className="block">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {article.date}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2 hover:text-[var(--color-accent)] transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                  <span>by</span>
                  <span className="font-medium text-[var(--color-text)]">{article.author}</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="mt-20 text-center">
        <blockquote className="font-serif text-xl md:text-2xl italic text-[var(--color-muted)] max-w-2xl mx-auto">
          "Tools are shaped to abilities. See like an agent."
        </blockquote>
        <p className="mt-4 text-sm text-[var(--color-muted)]">— Thariq, Anthropic</p>
      </section>
    </div>
  )
}
