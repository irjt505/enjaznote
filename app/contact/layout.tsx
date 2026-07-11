import type { Metadata } from 'next'
import { getSeoByPath } from '@/lib/seo'

const defaultTitle = 'اتصل بنا'
const defaultDesc = 'تواصل مع انجاز نوت — مكتبة ومركز خدمات عامة. للاستفسارات والخدمات: هاتف، واتساب، أو عبر النموذج الإلكتروني.'
const defaultOgDesc = 'تواصل مع انجاز نوت للاستفسارات والخدمات.'
const defaultKeywords = 'اتصل بنا, تواصل, واتساب, هاتف, انجاز نوت, مكتبة, خدمات'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPath('/contact')
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
      url: 'https://enjaznote.com/contact',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | انجاز نوت`,
      description: seo?.description || defaultOgDesc,
    },
    alternates: { canonical: 'https://enjaznote.com/contact' },
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
