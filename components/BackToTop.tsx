'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'

export default function BackToTop() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const { dict } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname.startsWith('/admin')) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 start-6 z-50 flex items-center justify-center size-12 rounded-full bg-accent text-white shadow-lg hover:bg-accent-light transition-all duration-300 cursor-pointer ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
      aria-label={dict.backToTop}
    >
      <svg aria-hidden="true" focusable="false" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}
