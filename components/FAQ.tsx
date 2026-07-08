'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function FAQ() {
  const { dict } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const items = dict.services.faq.items

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-12">{dict.services.faq.title}</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="card-gradient rounded-xl border border-white/10 overflow-hidden transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className="font-semibold text-white">{item.q}</span>
                <svg
                  className={`size-5 text-accent shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-5 pb-5 text-text-muted leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
