import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'انجاز نوت: وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية في الرياض. تعرف على قصتنا ورؤيتنا وفريقنا.',
  openGraph: {
    title: 'من نحن | انجاز نوت',
    description: 'انجاز نوت: وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية في الرياض.',
    url: 'https://enjaznote.com/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'من نحن | انجاز نوت',
    description: 'انجاز نوت: وجهتك المتكاملة للخدمات المكتبية والطلابية والحكومية والرقمية في الرياض.',
  },
  alternates: { canonical: 'https://enjaznote.com/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
