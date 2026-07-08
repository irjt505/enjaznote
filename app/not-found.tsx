'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function NotFound() {
  const { dict } = useLanguage()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 size-96 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-10 left-10 size-80 rounded-full bg-accent/5 blur-[120px]" />
      </div>
      <div className="relative z-10 text-center px-4">
        <div className="text-9xl font-black text-accent/20 mb-4 select-none">404</div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{dict.notFound.title}</h1>
        <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" />
        <p className="text-xl text-text-muted mb-10 max-w-md mx-auto">{dict.notFound.description}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all hover:shadow-2xl hover:shadow-accent/30"
          >
            {dict.notFound.action}
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
          >
            {dict.services.title}
          </Link>
        </div>
      </div>
    </div>
  )
}
