import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'اتصل بنا',
  description: 'تواصل مع انجاز نوت — مكتبة ومركز خدمات عامة في الرياض. للاستفسارات والخدمات: هاتف، واتساب، أو عبر النموذج الإلكتروني.',
  openGraph: {
    title: 'اتصل بنا | انجاز نوت',
    description: 'تواصل مع انجاز نوت للاستفسارات والخدمات في الرياض.',
    url: 'https://enjaznote.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا | انجاز نوت',
    description: 'تواصل مع انجاز نوت للاستفسارات والخدمات في الرياض.',
  },
  alternates: { canonical: 'https://enjaznote.com/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
