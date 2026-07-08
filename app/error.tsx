'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <svg className="size-16 mx-auto mb-6 text-accent/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
        <p className="text-text-muted text-sm mb-6">An unexpected error occurred. Please try again.</p>
        <button onClick={reset} className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-light transition-all cursor-pointer">
          Try Again
        </button>
      </div>
    </div>
  )
}
