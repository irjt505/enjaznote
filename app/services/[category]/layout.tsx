import type { Metadata } from 'next'
import ar from '@/messages/ar.json'
import { getSeoByPath } from '@/lib/seo'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = (ar.services.categories as Record<string, { title: string; desc: string; items?: { name: string; desc: string; slug: string }[] }>)[category]
  const title = cat?.title || category
  const desc = cat?.desc || `خدمات ${title} في انجاز نوت`

  const seo = await getSeoByPath(`/services/${category}`)
  const seoTitle = seo?.title
  const seoDesc = seo?.description
  const seoKeywords = seo?.keywords

  return {
    title: seoTitle || title,
    description: seoDesc || desc,
    ...(seoKeywords ? { keywords: seoKeywords } : {}),
    openGraph: {
      title: `${seoTitle || title} | انجاز نوت`,
      description: seoDesc || desc,
      url: `https://enjaznote.com/services/${category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${seoTitle || title} | انجاز نوت`,
      description: seoDesc || desc,
    },
    alternates: { canonical: `https://enjaznote.com/services/${category}` },
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
