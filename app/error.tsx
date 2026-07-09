'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4" role="alert">
      <div className="text-center max-w-md">
        <svg className="size-16 mx-auto mb-6 text-accent/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className="text-xl font-bold text-white mb-2">عذراً، حدث خطأ ما</h2>
        <p className="text-text-muted text-sm mb-1">Something went wrong.</p>
        <p className="text-text-muted text-sm mb-6">يرجى المحاولة مرة أخرى.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-light transition-all cursor-pointer"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
