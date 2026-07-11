import type { Metadata } from 'next'
import { getSeoByPath } from '@/lib/seo'

const defaultTitle = 'من نحن'
const defaultDesc = 'انجاز نوت: وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية. تعرف على قصتنا ورؤيتنا ورسالتنا.'
const defaultOgDesc = 'انجاز نوت: وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية. تعرف على قصتنا ورؤيتنا.'
const defaultKeywords = 'عن انجاز نوت, قصتنا, رؤيتنا, رسالتنا, من نحن, مكتبة, خدمات عامة'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPath('/about')
  const title = seo?.title || defaultTitle
  const description = seo?.description || defaultDesc
  const keywords = seo?.keywords || defaultKeywords

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | انجاز نوت`,
      description: seo?.description || defaultOgDesc,
      url: 'https://enjaznote.com/about',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | انجاز نوت`,
      description: seo?.description || defaultOgDesc,
    },
    alternates: { canonical: 'https://enjaznote.com/about' },
  }
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
