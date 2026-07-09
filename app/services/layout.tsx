import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'خدماتنا',
  description: 'جميع خدمات انجاز نوت في مكان واحد: خدمات مكتبية (طباعة، تصوير، تجليد، مسح ضوئي، مستلزمات مكتبية)، خدمات طلابية (بحث علمي، ترجمة، رسائل ماجستير ودكتوراه، ملخصات)، خدمات رقمية (برمجة مواقع، إنشاء متاجر إلكترونية، منيو رقمي، تصميم جرافيك، إدارة حسابات، تسويق رقمي، إدخال بيانات)، وخدمات حكومية (أبشر، ناجز، تقديم وظائف، القبول الجامعي، تصديق).',
  openGraph: {
    title: 'خدماتنا | انجاز نوت',
    description: 'جميع خدمات انجاز نوت — مكتبية، طلابية، رقمية، وحكومية.',
    url: 'https://enjaznote.com/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'خدماتنا | انجاز نوت',
    description: 'جميع خدمات انجاز نوت — مكتبية، طلابية، رقمية، وحكومية.',
  },
  alternates: { canonical: 'https://enjaznote.com/services' },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
