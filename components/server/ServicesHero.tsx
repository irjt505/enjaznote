import { getServerLanguage } from '@/lib/serverLanguage'

export default async function ServicesHero() {
  const { dict } = await getServerLanguage()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dict.services.faq.items.map((item: { q: string; a: string }) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.nav.home, item: 'https://enjaznote.com/' },
      { '@type': 'ListItem', position: 2, name: dict.nav.services, item: 'https://enjaznote.com/services' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 size-72 rounded-full bg-accent/15 blur-[100px]" />
          <div className="absolute bottom-20 right-10 size-96 rounded-full bg-accent/8 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">{dict.services.title}</h1>
          <div className="w-20 h-1 bg-accent rounded-full mx-auto mb-6" />
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto">{dict.services.subtitle}</p>
        </div>
      </section>
    </>
  )
}
