import type { Metadata } from 'next'
import ar from '@/messages/ar.json'

interface Props {
  params: Promise<{ category: string; product: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product } = await params
  const cat = (ar.services.categories as Record<string, { title: string; desc: string; items: { name: string; desc: string; slug: string }[] }>)[category]
  const item = cat?.items.find((i) => i.slug === product)
  const title = item?.name || product
  const desc = item?.desc || `${title} في انجاز نوت — الرياض`
  const catTitle = cat?.title || category
  return {
    title,
    description: desc,
    openGraph: {
      title: `${title} | انجاز نوت`,
      description: desc,
      url: `https://enjaznote.com/services/${category}/${product}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | انجاز نوت`,
      description: desc,
    },
    alternates: { canonical: `https://enjaznote.com/services/${category}/${product}` },
    keywords: [title, catTitle, 'انجاز نوت', 'الرياض', 'خدمات'],
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
