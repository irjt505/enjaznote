'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { usePageTitle } from '@/lib/usePageTitle'
import ScrollReveal from '@/components/ScrollReveal'
import FAQ from '@/components/FAQ'
import CustomServiceRequest from '@/components/CustomServiceRequest'
import { categoryIcons as svgIcons } from '@/lib/constants'

export default function ServicesInteractive() {
  const { dict, lang } = useLanguage()
  usePageTitle(lang === 'ar' ? 'خدماتنا' : 'Our Services')
  const [search, setSearch] = useState('')

  const categoryKeys = Object.keys(dict.services.categories) as Array<keyof typeof dict.services.categories>
  const filtered = search.trim()
    ? categoryKeys.filter((key) => {
        const cat = dict.services.categories[key]
        const items = cat.items as Array<{ name: string }>
        const q = search.toLowerCase()
        return (
          cat.title.toLowerCase().includes(q) ||
          cat.desc.toLowerCase().includes(q) ||
          items.some((i) => i.name.toLowerCase().includes(q))
        )
      })
    : categoryKeys

  return (
    <>
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <svg aria-hidden="true" focusable="false" className="absolute start-4 top-1/2 -translate-y-1/2 size-5 text-text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-12 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50 text-center text-lg"
                placeholder={dict.services.searchPlaceholder}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-white transition-colors cursor-pointer"
                >
                  <svg aria-hidden="true" focusable="false" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-text-muted text-lg py-12">
              {dict.services.noResultsFor} &ldquo;{search}&rdquo;
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filtered.map((key) => {
                const cat = dict.services.categories[key]
                const items = cat.items as Array<{ name: string; slug: string }>
                return (
                  <ScrollReveal key={key}>
                    <Link href={`/services/${key}`} className="block group h-full">
                      <div className="category-card rounded-3xl p-8 md:p-10 h-full flex flex-col items-center text-center">
                        <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent transition-all duration-400">
                          <svg aria-hidden="true" focusable="false" className="size-8 text-accent group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d={svgIcons[key] || svgIcons.office} />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">{cat.title}</h2>
                        <p className="text-text-muted text-sm mb-6 max-w-md">{cat.desc}</p>

                        <div className="flex flex-wrap justify-center gap-2 mb-8 flex-1">
                          {items.slice(0, 6).map((item) => (
                            <span key={item.slug} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-text-muted text-sm">
                              <svg aria-hidden="true" focusable="false" className="size-3.5 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              {item.name}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto pt-5 border-t border-white/10 w-full text-center">
                          <span className="inline-flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all">
                            {items.length} {dict.services.noResults} &middot; {dict.hero.cta}
                            <svg aria-hidden="true" focusable="false" className="size-5 rtl-flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <FAQ />

      <CustomServiceRequest />
    </>
  )
}
