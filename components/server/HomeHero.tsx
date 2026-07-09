import Link from 'next/link'
import { getServerLanguage } from '@/lib/serverLanguage'
import { whatsappUrl } from '@/lib/whatsapp'
import { categoryIcons } from '@/lib/constants'

export default async function HomeHero() {
  const { dict } = await getServerLanguage()
  const catKeys = Object.keys(dict.services.categories)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'انجاز نوت',
            url: 'https://enjaznote.com',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5',
              bestRating: '5',
              ratingCount: '2',
              reviewCount: '2',
            },
          }),
        }}
      />
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 size-96 rounded-full bg-accent/15 blur-[120px]" />
          <div className="absolute bottom-10 right-10 size-[500px] rounded-full bg-accent/8 blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 size-64 rounded-full bg-accent/5 blur-[100px]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,118,43,0.06),transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent-light text-sm font-medium mb-8">
              <svg aria-hidden="true" focusable="false" className="size-4" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{dict.hero.subtitle}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tight">
              {dict.hero.title}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-text-muted leading-relaxed max-w-2xl mx-auto mb-10">
              {dict.hero.description}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all hover:shadow-2xl hover:shadow-accent/40"
              >
                {dict.hero.cta}
                <svg aria-hidden="true" focusable="false" className="size-5 rtl-flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <a
                href={whatsappUrl('مرحباً، أود الاستفسار عن خدماتكم')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl border-2 border-white/20 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <svg aria-hidden="true" focusable="false" className="size-6 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {dict.hero.cta2}
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 mt-12">
              <div className="flex -space-x-2">
                {['#c49027', '#D4A43E', '#A6781E', '#E0B84E', '#B8902E'].map((c, i) => (
                  <div key={i} className="size-10 rounded-full border-2 border-primary shadow-lg" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="text-text-muted">
                <span className="text-accent font-bold text-lg">1000+</span>
                {' '}{dict.stats.clients}
              </p>
              <span className="text-text-dim hidden sm:inline">|</span>
              <p className="text-text-muted hidden sm:block">
                <span className="text-accent font-bold text-lg">50+</span>
                {' '}{dict.stats.services}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">{dict.services.title}</h2>
            <div className="w-20 h-1 bg-accent rounded-full mx-auto mb-4" />
            <p className="text-text-muted text-lg max-w-2xl mx-auto">{dict.services.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catKeys.map((key) => {
              const cat = dict.services.categories[key as keyof typeof dict.services.categories]
              return (
                <Link key={key} href={`/services/${key}`} className="block group">
                  <div className="product-card rounded-2xl p-8 h-full flex flex-col items-center text-center">
                    <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent transition-all duration-400">
                      <svg aria-hidden="true" focusable="false" className="size-8 text-accent group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={categoryIcons[key as keyof typeof categoryIcons] || categoryIcons.office} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-4">{cat.desc}</p>
                    <div className="flex items-center gap-2 text-accent text-sm font-semibold mt-auto">
                      <span>{dict.hero.cta}</span>
                      <svg aria-hidden="true" focusable="false" className="size-4 rtl-flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-dark" />
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 size-96 rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-accent/5 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent-light text-sm font-medium mb-4">
              {dict.about.subtitle}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">{dict.about.title}</h2>
            <div className="w-20 h-1 bg-accent rounded-full mx-auto mb-4" />
            <p className="text-text-muted text-lg max-w-3xl mx-auto">{dict.about.description}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {(['🌟', '🔍', '🤝', '💡', '🏆', '⚡']).map((icon, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] hover:border-accent/30 transition-all w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(16.666%-0.75rem)]"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-medium text-text-light text-center leading-relaxed">
                  {dict.about.valuesList[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
