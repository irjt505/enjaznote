'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { usePageTitle } from '@/lib/usePageTitle'
import ScrollReveal from '@/components/ScrollReveal'
import { whatsappUrl } from '@/components/WhatsAppButton'
import { categoryIcons, validCategories } from '@/lib/constants'
import type { CategoryKey } from '@/lib/constants'

export default function ProductPage() {
  const params = useParams()
  const { dict, lang } = useLanguage()
  const category = params.category as string
  const productSlug = params.product as string
  const [notes, setNotes] = useState('')
  usePageTitle(dict.services.categories[category as CategoryKey]?.items.find((i: { slug: string }) => i.slug === productSlug)?.name || productSlug)

  if (!validCategories.includes(category as CategoryKey)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{dict.pageNotFound}</h1>
          <Link href="/services" className="text-accent hover:underline">{dict.backToServices}</Link>
        </div>
      </div>
    )
  }

  const cat = dict.services.categories[category as CategoryKey]
  const items = cat.items as Array<{ name: string; desc: string; slug: string }>
  const product = items.find((i) => i.slug === productSlug)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{dict.productNotFound}</h1>
          <Link href={`/services/${category}`} className="text-accent hover:underline">{dict.backToCategory}</Link>
        </div>
      </div>
    )
  }

  const otherProducts = items.filter((i) => i.slug !== productSlug)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.nav.home, item: 'https://injaz-note.com/' },
      { '@type': 'ListItem', position: 2, name: dict.nav.services, item: 'https://injaz-note.com/services' },
      { '@type': 'ListItem', position: 3, name: cat.title, item: `https://injaz-note.com/services/${category}` },
      { '@type': 'ListItem', position: 4, name: product?.name || productSlug, item: `https://injaz-note.com/services/${category}/${productSlug}` },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: product?.name || productSlug,
    description: product?.desc || '',
    provider: {
      '@type': 'LocalBusiness',
      name: 'انجاز نوت',
      url: 'https://injaz-note.com',
    },
    areaServed: { '@type': 'City', name: 'الرياض' },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: `https://injaz-note.com/services/${category}/${productSlug}` },
  }

  const fullMessage = lang === 'ar'
    ? `مرحباً، أود طلب خدمة: ${product.name}\n\nالقسم: ${cat.title}\nالخدمة: ${product.name}\n${notes ? `ملاحظات: ${notes}\n` : ''}الرجاء تأكيد السعر والتوفر`
    : `Hello, I would like to request: ${product.name}\n\nCategory: ${cat.title}\nProduct: ${product.name}\n${notes ? `Notes: ${notes}\n` : ''}Please confirm price and availability`

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 size-64 rounded-full bg-accent/15 blur-[100px]" />
          <div className="absolute bottom-20 left-10 size-80 rounded-full bg-accent/8 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex items-center justify-center gap-2 text-xs text-text-muted mb-8">
            <Link href="/" className="hover:text-accent transition-colors">
              {dict.nav.home}
            </Link>
            <span className="text-text-dim">/</span>
            <Link href="/services" className="hover:text-accent transition-colors">
              {dict.nav.services}
            </Link>
            <span className="text-text-dim">/</span>
            <Link href={`/services/${category}`} className="hover:text-accent transition-colors">
              {cat.title}
            </Link>
            <span className="text-text-dim">/</span>
            <span className="text-text-dim">{product.name}</span>
          </nav>

          <div className="card-gradient rounded-3xl p-10 md:p-14">
            <div className="size-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <svg aria-hidden="true" focusable="false" className="size-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={categoryIcons[category] || categoryIcons.office} />
              </svg>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent-light text-xs font-medium mb-4">
              {cat.title}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{product.name}</h1>
            <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-6" />
            <p className="text-text-muted text-lg leading-relaxed max-w-2xl mx-auto">{product.desc}</p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              { icon: '🌟', label: dict.about.valuesList[0] },
              { icon: '🔍', label: dict.about.valuesList[1] },
              { icon: '🤝', label: dict.about.valuesList[2] },
              { icon: '💡', label: dict.about.valuesList[3] },
              { icon: '🏆', label: dict.about.valuesList[4] },
              { icon: '⚡', label: dict.about.valuesList[5] },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] hover:border-accent/30 transition-all group w-[140px]"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium text-text-light text-center leading-relaxed">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="card-gradient rounded-2xl p-8 md:p-10 text-center border-accent/20">
              <h2 className="text-2xl font-bold text-white mb-2">
                {dict.services.orderNow}
              </h2>
              <p className="text-text-muted text-sm mb-6">{dict.services.requestBtn}</p>

              <div className="mb-6 text-start">
                <label className="block text-sm font-medium text-text-light mb-2">
                  {dict.services.notes}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-white placeholder:text-text-dim/50 resize-none"
                  placeholder={dict.services.notesPlaceholder}
                />
              </div>

              <a
                href={whatsappUrl(fullMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full px-8 py-5 rounded-2xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all hover:shadow-2xl hover:shadow-accent/30"
              >
                <svg aria-hidden="true" focusable="false" className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {dict.services.orderViaWhatsapp}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {otherProducts.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                {dict.services.otherServices}
              </h2>
              <div className="section-divider mb-10" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherProducts.map((item) => (
                  <Link key={item.slug} href={`/services/${category}/${item.slug}`}>
                    <div className="product-card rounded-xl p-5 text-center h-full">
                      <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                        <svg aria-hidden="true" focusable="false" className="size-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d={categoryIcons[category] || categoryIcons.office} />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-1">{item.name}</h3>
                      <p className="text-text-muted text-xs line-clamp-2">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-white mb-4">
              {dict.services.needAnotherService}
            </h2>
            <p className="text-text-muted mb-8">
              {dict.services.needAnotherServiceDesc}
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-light transition-all"
            >
              {dict.services.allServices}
              <svg aria-hidden="true" focusable="false" className="size-5 rtl-flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
