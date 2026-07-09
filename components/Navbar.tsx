'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, startTransition } from 'react'
import Logo from './Logo'
import { useLanguage } from '@/lib/LanguageContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const [announceClosing, setAnnounceClosing] = useState(false)
  const { dict, toggleLang, lang } = useLanguage()
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    startTransition(() => {
      try {
        if (localStorage.getItem('announcementClosed') === 'true') {
          setShowAnnouncement(false)
        }
      } catch { /* localStorage not available */ }
    })
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  if (isAdmin) return null

  function dismissAnnouncement() {
    setAnnounceClosing(true)
    setTimeout(() => {
      setShowAnnouncement(false)
      localStorage.setItem('announcementClosed', 'true')
    }, 300)
  }

  const links = [
    { href: '/', label: dict.nav.home },
    { href: '/about', label: dict.nav.about },
    { href: '/services', label: dict.nav.services },
    { href: '/contact', label: dict.nav.contact },
  ]

  return (
    <nav className="fixed top-0 start-0 w-full z-50">
      {showAnnouncement && (
        <div
          className={`bg-gradient-to-r from-accent-dark via-accent to-accent-light text-white text-center text-sm py-2 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
            announceClosing ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <svg aria-hidden="true" focusable="false" className="size-4 shrink-0 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="truncate">{dict.announcement}</span>
          <button onClick={dismissAnnouncement} className="shrink-0 hover:opacity-70 cursor-pointer p-1" aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}>
            <svg aria-hidden="true" focusable="false" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-primary/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/">
              <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-accent/20 text-accent-light'
                      : 'text-text-light/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="ms-2 px-5 py-2 rounded-lg text-sm font-semibold bg-accent text-white hover:bg-accent-light transition-all shadow-lg shadow-accent/20"
              >
                {dict.nav.requestService}
              </Link>
              <button
                onClick={() => { toggleLang(); router.refresh() }}
                className="ms-1 px-3 py-2 rounded-lg text-xs font-medium border border-white/20 text-text-light hover:bg-white/10 transition-colors cursor-pointer"
              >
                {dict.theme.switchLang}
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-2 rounded-lg text-text-light hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" className="md:hidden border-t border-white/10 bg-primary/98 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-accent/20 text-accent-light'
                      : 'text-text-light/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full px-4 py-3 rounded-lg text-sm font-semibold bg-accent text-white hover:bg-accent-light transition-all text-center"
              >
                {dict.nav.requestService}
              </Link>
              <button
                onClick={() => { toggleLang(); setMobileOpen(false); router.refresh() }}
                className="block w-full px-4 py-3 rounded-lg text-sm font-medium border border-white/20 text-text-light hover:bg-white/10 transition-colors text-center mt-1 cursor-pointer"
              >
                {dict.theme.switchLang}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
