import type { Metadata } from 'next'
import { getSeoByPath } from '@/lib/seo'

const defaultTitle = 'خدماتنا'
const defaultDesc = 'جميع خدمات انجاز نوت في مكان واحد: خدمات مكتبية (طباعة، تصوير، تجليد، مسح ضوئي، مستلزمات مكتبية)، خدمات طلابية (بحث علمي، ترجمة، رسائل ماجستير ودكتوراه، ملخصات)، خدمات رقمية (برمجة مواقع، إنشاء متاجر إلكترونية، منيو رقمي، تصميم جرافيك، إدارة حسابات، تسويق رقمي، إدخال بيانات)، وخدمات حكومية (أبشر، ناجز، تقديم وظائف، القبول الجامعي، تصديق).'
const defaultOgDesc = 'جميع خدمات انجاز نوت — مكتبية، طلابية، رقمية، وحكومية.'
const defaultKeywords = 'خدمات, طباعة, تصوير, أبشر, برمجة, تصميم, تسويق, ترجمة, انجاز نوت'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPath('/services')
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
      url: 'https://enjaznote.com/services',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | انجاز نوت`,
      description: seo?.description || defaultOgDesc,
    },
    alternates: { canonical: 'https://enjaznote.com/services' },
  }
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
