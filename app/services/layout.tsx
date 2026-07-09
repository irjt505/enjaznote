import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'خدماتنا',
  description: 'جميع خدمات انجاز نوت في مكان واحد: الخدمات المكتبية، الخدمات الطلابية، الخدمات الرقمية، والخدمات الحكومية في الرياض.',
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
