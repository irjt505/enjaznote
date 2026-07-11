import type { Metadata } from 'next'
import ar from '@/messages/ar.json'
import { getSeoByPath } from '@/lib/seo'

interface Props {
  params: Promise<{ category: string; product: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product } = await params
  const cat = (ar.services.categories as Record<string, { title: string; desc: string; items: { name: string; desc: string; slug: string }[] }>)[category]
  const item = cat?.items?.find((i) => i.slug === product)
  const title = item?.name || product
  const desc = item?.desc || `${title} في انجاز نوت`
  const catTitle = cat?.title || category

  const seo = await getSeoByPath(`/services/${category}/${product}`)
  const seoTitle = seo?.title
  const seoDesc = seo?.description
  const seoKeywords = seo?.keywords

  return {
    title: seoTitle || title,
    description: seoDesc || desc,
    ...(seoKeywords ? { keywords: seoKeywords } : { keywords: [title, catTitle, 'انجاز نوت', 'خدمات'] }),
    openGraph: {
      title: `${seoTitle || title} | انجاز نوت`,
      description: seoDesc || desc,
      url: `https://enjaznote.com/services/${category}/${product}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${seoTitle || title} | انجاز نوت`,
      description: seoDesc || desc,
    },
    alternates: { canonical: `https://enjaznote.com/services/${category}/${product}` },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
