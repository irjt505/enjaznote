import type { Metadata } from 'next'
import { Geist, Geist_Mono, Tajawal } from 'next/font/google'
import '@/app/globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import { getServerLanguage } from '@/lib/serverLanguage'
import { getSeoByPath } from '@/lib/seo'
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

const siteKeywords = [
  'انجاز نوت', 'مكتبة', 'خدمات عامة', 'مركز خدمات',
  'طباعة', 'تصوير', 'طباعة ملونة', 'طباعة ابيض واسود', 'تجليد', 'تغليف', 'مسح ضوئي', 'مستلزمات مكتبية', 'قرطاسية', 'ورق',
  'أبشر', 'ناجز', 'توكلنا', 'خدمات حكومية', 'معاملات حكومية', 'إنهاء معاملات', 'تقديم وظائف', 'الموارد البشرية', 'الخدمة المدنية',
  'القبول الجامعي', 'تقديم جامعة', 'تصديق', 'توثيق', 'وزارة', 'وزارة العدل', 'وزارة الداخلية', 'وزارة الخارجية', 'وزارة التعليم',
  'تجديد جواز', 'تجديد إقامة', 'استخراج صك', 'إصدار وثائق',
  'خدمات طلابية', 'بحث علمي', 'تقارير', 'ترجمة', 'ترجمة معتمدة', 'رسائل ماجستير', 'رسائل دكتوراه', 'مناهج', 'ملخصات', 'كتب دراسية', 'مواد دراسية',
  'برمجة', 'تطوير مواقع', 'برمجة مواقع', 'تصميم مواقع', 'متجر إلكتروني', 'إنشاء متجر', 'سلة', 'زد', 'متجر سلة', 'متجر زد',
  'منيو رقمي', 'منيو مطعم', 'QR كود', 'باركود', 'منيو QR', 'قائمة طعام رقمية', 'تطبيق مطعم', 'برمجة منيو',
  'تصميم', 'تصميم جرافيك', 'تصميم شعار', 'هوية بصرية', 'تصميم بروشور', 'تصميم بوست', 'تصميم إعلان', 'تصميم كرت عمل', 'تصميم غلاف',
  'سوشيال ميديا', 'إدارة حسابات', 'إدارة منصات', 'تسويق', 'تسويق إلكتروني', 'تسويق رقمي', 'إعلانات مدفوعة', 'SEO', 'تحسين محركات البحث', 'حملات إعلانية', 'جوجل أدز', 'سناب شات', 'تيك توك', 'انستقرام', 'فيسبوك', 'تويتر', 'لينكد إن',
  'إدخال بيانات', 'تفريغ صوتيات', 'رقمنة', 'تنظيم بيانات', 'إكسل', 'قواعد بيانات',
  'السعودية', 'المملكة العربية السعودية',
].join(', ')

const defaultTitle = 'انجاز نوت | مكتبة ومركز خدمات عامة'
const defaultDesc = 'انجاز نوت — وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية. طباعة، تصوير، أبشر، تجليد، مسح ضوئي، ترجمة، بحث علمي، تصميم جرافيك، تسويق رقمي، برمجة مواقع، إنشاء متاجر إلكترونية، إدارة حسابات، إدخال بيانات، تقديم وظائف، القبول الجامعي، وتصديق المستندات.'
const defaultOgDesc = 'انجاز نوت — وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية. طباعة، تصوير، أبشر، ترجمة، تصميم، برمجة، تسويق، وكل ما تحتاجه في مكان واحد.'
const defaultTwDesc = 'انجاز نوت — وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية.'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPath('/')
  const title = seo?.title || defaultTitle
  const description = seo?.description || defaultDesc
  const keywords = seo?.keywords || siteKeywords

  return {
    title: { default: title, template: '%s | انجاز نوت' },
    description,
    keywords,
    metadataBase: new URL('https://enjaznote.com'),
    openGraph: {
      title,
      description: seo?.description || defaultOgDesc,
      url: 'https://enjaznote.com',
      siteName: 'انجاز نوت',
      locale: 'ar_SA',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: seo?.description || defaultTwDesc,
      images: ['/og-image.png'],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: { url: '/pp.png', type: 'image/png', sizes: '88x88' },
      apple: '/pp.png',
    },
    alternates: {
      canonical: 'https://enjaznote.com',
      languages: {
        'x-default': 'https://enjaznote.com',
        ar: 'https://enjaznote.com',
      },
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, dir } = await getServerLanguage()
  return (
    <html
      lang={lang}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#002248" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'انجاز نوت',
              url: 'https://enjaznote.com',
              description: 'مكتبة ومركز خدمات عامة — طباعة، خدمات حكومية، خدمات طلابية، حلول رقمية',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://enjaznote.com/services?search={search_term_string}' },
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
              url: 'https://enjaznote.com',
              logo: 'https://enjaznote.com/pp.png',
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
              url: 'https://enjaznote.com',
              telephone: '+966554764417',
              email: 'enjaznote@gmail.com',
              image: 'https://enjaznote.com/pp.png',
              priceRange: '$$',
              address: { '@type': 'PostalAddress', addressCountry: 'SA' },
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
        <LanguageProvider initialLang={lang}>
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
