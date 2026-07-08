'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface AnimatedNumberProps {
  value: number
  duration?: number
  suffix?: string
}

function AnimatedNumber({ value, duration = 1000, suffix = '' }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced.current) { setDisplay(value); return }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (value === 0) { setDisplay(0); return }

    const steps = 30
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{display}{suffix}</span>
}

export default function Stats() {
  const { lang } = useLanguage()
  const stats = [
    { key: 'years', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', value: 10, suffix: '+', label: { ar: 'سنوات خبرة', en: 'Years Experience' } },
    { key: 'clients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', value: 1000, suffix: '+', label: { ar: 'عميل يثقون بنا', en: 'Clients trust us' } },
    { key: 'services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', value: 50, suffix: '+', label: { ar: 'خدمة متكاملة', en: 'Integrated Services' } },
    { key: 'support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', value: 24, suffix: '/7', label: { ar: 'دعم فني', en: 'Technical Support' } },
  ]

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.key} className="card-gradient rounded-2xl p-6 md:p-8 text-center hover:border-accent/30 transition-all group">
              <div className="size-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-all">
                <svg className="size-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={stat.icon} />
                </svg>
              </div>
              <p className="text-3xl md:text-4xl font-black text-white mb-1">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-text-muted">{stat.label[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
