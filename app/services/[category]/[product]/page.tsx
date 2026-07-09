import Link from 'next/link'
import { getServerLanguage } from '@/lib/serverLanguage'
import ProductOrderForm from '@/components/ProductOrderForm'
import { categoryIcons, itemIcons, validCategories } from '@/lib/constants'
import type { CategoryKey } from '@/lib/constants'

interface Props { params: Promise<{ category: string; product: string }> }

export default async function ProductPage({ params }: Props) {
  const { dict } = await getServerLanguage()
  const { category, product: productSlug } = await params

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
      { '@type': 'ListItem', position: 1, name: dict.nav.home, item: 'https://enjaznote.com/' },
      { '@type': 'ListItem', position: 2, name: dict.nav.services, item: 'https://enjaznote.com/services' },
      { '@type': 'ListItem', position: 3, name: cat.title, item: `https://enjaznote.com/services/${category}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: `https://enjaznote.com/services/${category}/${productSlug}` },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: product.name,
    description: product.desc,
    provider: { '@type': 'LocalBusiness', name: 'انجاز نوت', url: 'https://enjaznote.com' },
    areaServed: { '@type': 'City', name: 'الرياض' },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: `https://enjaznote.com/services/${category}/${productSlug}` },
  }

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
            <Link href="/" className="hover:text-accent transition-colors">{dict.nav.home}</Link>
            <span className="text-text-dim">/</span>
            <Link href="/services" className="hover:text-accent transition-colors">{dict.nav.services}</Link>
            <span className="text-text-dim">/</span>
            <Link href={`/services/${category}`} className="hover:text-accent transition-colors">{cat.title}</Link>
            <span className="text-text-dim">/</span>
            <span className="text-text-dim">{product.name}</span>
          </nav>

          <div className="card-gradient rounded-3xl p-10 md:p-14">
            <div className="size-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <svg aria-hidden="true" focusable="false" className="size-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={itemIcons[productSlug] || categoryIcons[category] || categoryIcons.office} />
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
              <div key={item.label} className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] hover:border-accent/30 transition-all group w-[140px]">
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium text-text-light text-center leading-relaxed">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <ProductOrderForm productName={product.name} categoryTitle={cat.title} />
      </section>

      {otherProducts.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">{dict.services.otherServices}</h2>
            <div className="section-divider mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherProducts.map((item) => (
                <Link key={item.slug} href={`/services/${category}/${item.slug}`}>
                  <div className="product-card rounded-xl p-5 text-center h-full">
                    <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <svg aria-hidden="true" focusable="false" className="size-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={itemIcons[item.slug] || categoryIcons[category] || categoryIcons.office} />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">{item.name}</h3>
                    <p className="text-text-muted text-xs line-clamp-2">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-4">{dict.services.needAnotherService}</h2>
          <p className="text-text-muted mb-8">{dict.services.needAnotherServiceDesc}</p>
          <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent-light transition-all">
            {dict.services.allServices}
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
