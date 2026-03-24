import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
        <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-serif italic text-lg shadow-lg group-hover:shadow-violet-500/25 transition-shadow">
              AI
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight">
              Chronicle
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              文章
            </Link>
            <Link 
              to="/about" 
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              关于
            </Link>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] mt-20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted)]">
            <p className="font-serif italic">
              "The art of AI, curated for the curious mind."
            </p>
            <p>
              Made with ❤️ by{' '}
              <a 
                href="https://github.com/gu-xiaohui/ai-chronicle" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[var(--color-accent)]"
              >
                AI Chronicle
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
