'use client'

import Link from 'next/link'
import Story from './Story'
import Timeline from './Timeline'
import { useLanguage } from '@/lib/LanguageContext'

export default function AboutInteractive() {
  const { dict } = useLanguage()

  return (
    <>
      <Story />
      <Timeline />
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-dark" />
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 size-96 rounded-full bg-accent/5 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {dict.contact.cta}
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            {dict.contact.ctaDesc}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all shadow-lg shadow-accent/30"
          >
            {dict.contact.info}
            <svg aria-hidden="true" focusable="false" className="size-5 rtl-flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
