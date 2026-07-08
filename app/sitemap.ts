import type { MetadataRoute } from 'next'

const categories = ['office', 'student', 'digital', 'government'] as const

const products: Record<string, string[]> = {
  office: ['printing', 'binding', 'scanning', 'supplies'],
  student: ['research', 'translation', 'thesis', 'materials'],
  digital: ['graphic-design', 'web-dev', 'social-media', 'data-entry', 'digital-marketing'],
  government: ['absher', 'job-applications', 'admissions', 'hr', 'legalization', 'ministry', 'admin'],
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://injaz-note.com'

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  const categoryPages = categories.map((cat) => ({
    url: `${base}/services/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const productPages = categories.flatMap((cat) =>
    (products[cat] || []).map((slug) => ({
      url: `${base}/services/${cat}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  )

  return [...staticPages, ...categoryPages, ...productPages]
}
