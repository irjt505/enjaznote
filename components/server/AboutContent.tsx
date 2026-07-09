import Link from 'next/link'
import { getServerLanguage } from '@/lib/serverLanguage'

export default async function AboutContent() {
  const { dict } = await getServerLanguage()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://enjaznote.com' },
              { '@type': 'ListItem', position: 2, name: 'من نحن', item: 'https://enjaznote.com/about' },
            ],
          }),
        }}
      />
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary-dark" />
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 size-72 rounded-full bg-accent/15 blur-[100px]" />
          <div className="absolute bottom-10 left-10 size-96 rounded-full bg-accent/8 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent-light text-sm font-medium mb-4">
            {dict.about.subtitle}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1]">
            {dict.about.title}
          </h1>
          <div className="w-20 h-1 bg-accent rounded-full mx-auto mb-6" />
          <p className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto">
            {dict.about.description}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dict.about.vision && (
              <div className="card-gradient rounded-2xl p-8 md:p-10">
                <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <svg aria-hidden="true" focusable="false" className="size-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{dict.about.vision.title}</h3>
                <p className="text-text-muted leading-relaxed text-lg">{dict.about.vision.text}</p>
              </div>
            )}
            {dict.about.mission && (
              <div className="card-gradient rounded-2xl p-8 md:p-10">
                <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <svg aria-hidden="true" focusable="false" className="size-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{dict.about.mission.title}</h3>
                <p className="text-text-muted leading-relaxed text-lg">{dict.about.mission.text}</p>
              </div>
            )}
          </div>
        </div>
      </section>

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
