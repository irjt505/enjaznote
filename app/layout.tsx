import type { Metadata } from 'next'
import { Geist, Geist_Mono, Tajawal } from 'next/font/google'
import '@/app/globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const tajawal = Tajawal({
  variable: '--font-tajawal',
  subsets: ['arabic'],
  weight: ['400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'انجاز نوت | مكتبة ومركز خدمات عامة - الرياض',
    template: '%s | انجاز نوت',
  },
  description: 'انجاز نوت: وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية في الرياض. طباعة، تصوير، أبشر، ترجمة، بحث علمي، تصميم جرافيك، خدمات حكومية.',
  keywords: 'انجاز نوت, مكتبة, خدمات عامة, طباعة, تصوير, خدمات حكومية, أبشر, خدمات طلابية, ترجمة, بحث علمي, تصميم, الرياض, السعودية, مركز خدمات, تجليد, مستلزمات مكتبية',
  metadataBase: new URL('https://injaz-note.com'),
  openGraph: {
    title: 'انجاز نوت | مكتبة ومركز خدمات عامة - الرياض',
    description: 'وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية في الرياض — طباعة، أبشر، ترجمة، تصميم، وكل ما تحتاجه في مكان واحد.',
    url: 'https://injaz-note.com',
    siteName: 'انجاز نوت',
    locale: 'ar_SA',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'انجاز نوت | مكتبة ومركز خدمات عامة - الرياض',
    description: 'وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية في الرياض.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#002248" />
        <link rel="canonical" href="https://injaz-note.com" />
        <link rel="alternate" hrefLang="x-default" href="https://injaz-note.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'انجاز نوت',
              url: 'https://injaz-note.com',
              description: 'مكتبة ومركز خدمات عامة — طباعة، خدمات حكومية، خدمات طلابية، حلول رقمية',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://injaz-note.com/services?search={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'انجاز نوت',
              url: 'https://injaz-note.com',
              logo: 'https://injaz-note.com/pp.png',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+966554764417',
                contactType: 'customer service',
                email: 'enjaznote@gmail.com',
                availableLanguage: ['Arabic', 'English'],
              },
              sameAs: [
                'https://www.snapchat.com/add/enjaznote',
                'https://www.tiktok.com/@enjaznote',
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'انجاز نوت',
              description: 'مكتبة ومركز خدمات عامة — طباعة، خدمات حكومية، خدمات طلابية، حلول رقمية',
              url: 'https://injaz-note.com',
              telephone: '+966554764417',
              email: 'enjaznote@gmail.com',
              image: 'https://injaz-note.com/pp.png',
              priceRange: '$$',
              address: { '@type': 'PostalAddress', addressLocality: 'الرياض', addressCountry: 'SA' },
              openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '09:00', closes: '00:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '13:00', closes: '00:00' },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-tajawal), var(--font-geist-sans), sans-serif' }}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-accent focus:text-white focus:font-semibold focus:outline-none">
          <span lang="ar">تخطى إلى المحتوى الرئيسي</span>
          <span aria-hidden="true" className="mx-1 opacity-50">|</span>
          <span lang="en">Skip to main content</span>
        </a>
        <LanguageProvider>
          <Navbar />
          <main id="main-content" className="flex-1 pt-16 md:pt-20">{children}</main>
          <Footer />
          <WhatsAppButton />
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  )
}
