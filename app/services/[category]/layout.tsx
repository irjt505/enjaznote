import type { Metadata } from 'next'
import ar from '@/messages/ar.json'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = (ar.services.categories as Record<string, { title: string; desc: string }>)[category]
  const title = cat?.title || category
  const desc = cat?.desc || `خدمات ${title} في انجاز نوت — الرياض`
  return {
    title,
    description: desc,
    openGraph: {
      title: `${title} | انجاز نوت`,
      description: desc,
      url: `https://enjaznote.com/services/${category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | انجاز نوت`,
      description: desc,
    },
    alternates: { canonical: `https://enjaznote.com/services/${category}` },
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
