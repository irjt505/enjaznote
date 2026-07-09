'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Logo from './Logo'
import SocialLinks from './SocialLinks'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const pathname = usePathname()
  const { dict, lang } = useLanguage()
  const [subscribeEmail, setSubscribeEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [subscribeMsg, setSubscribeMsg] = useState<string | null>(null)
  const [subscribeSuccess, setSubscribeSuccess] = useState(false)

  if (pathname.startsWith('/admin')) return null

  const quickLinks = [
    { href: '/', label: dict.nav.home },
    { href: '/about', label: dict.nav.about },
    { href: '/services', label: dict.nav.services },
    { href: '/contact', label: dict.nav.contact },
  ]

  return (
    <footer className="bg-primary-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo className="mb-4" />
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              {dict.footer.tagline}
            </p>
            <SocialLinks />
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{dict.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors ${
                        isActive
                          ? 'text-accent-light'
                          : 'text-text-muted hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{dict.contact.info}</h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <svg aria-hidden="true" focusable="false" className="size-4 shrink-0 text-accent mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{dict.contact.addressText}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg aria-hidden="true" focusable="false" className="size-4 shrink-0 text-accent mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{dict.contact.phoneText}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg aria-hidden="true" focusable="false" className="size-4 shrink-0 text-accent mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>{dict.contact.emailText}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{dict.footer.subscribeTitle}</h3>
            <p className="text-text-muted text-sm mb-3 leading-relaxed">
              {dict.footer.subscribeDesc}
            </p>
              <div className="flex gap-2">
                <label htmlFor="subscribe-email" className="sr-only">{dict.footer.subscribePlaceholder}</label>
                <input
                  id="subscribe-email"
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => { setSubscribeEmail(e.target.value); if (subscribeMsg) setSubscribeMsg(null) }}
                  placeholder={dict.footer.subscribePlaceholder}
                  className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  disabled={subscribing}
                  onClick={async () => {
                    const email = subscribeEmail.trim()
                    if (!email) { setSubscribeMsg(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email'); setSubscribeSuccess(false); return }
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setSubscribeMsg(lang === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address'); setSubscribeSuccess(false); return }
                    setSubscribing(true)
                    setSubscribeMsg(null)
                    try {
                      const res = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                      })
                      if (res.ok) {
                        setSubscribeMsg(dict.footer.subscribeSuccess)
                        setSubscribeSuccess(true)
                        setSubscribeEmail('')
                      } else {
                        const data = await res.json()
                        setSubscribeMsg(data.error || (lang === 'ar' ? 'حدث خطأ، حاول مرة أخرى' : 'Something went wrong'))
                        setSubscribeSuccess(false)
                      }
                    } catch {
                      setSubscribeMsg(lang === 'ar' ? 'حدث خطأ في الاتصال' : 'Network error')
                      setSubscribeSuccess(false)
                    } finally {
                      setSubscribing(false)
                    }
                  }}
                  className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-light transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {dict.footer.subscribeBtn}
                </button>
              </div>
              {subscribeMsg && (
                <p className={`text-xs mt-2 ${subscribeSuccess ? 'text-green-400' : 'text-red-400'}`}>
                  {subscribeMsg}
                </p>
              )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} Injaz Note. {dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
