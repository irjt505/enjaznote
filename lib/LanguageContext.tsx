'use client'

import { createContext, useContext, useState, useEffect, startTransition, type ReactNode } from 'react'
import arMessages from '@/messages/ar.json'
import enMessages from '@/messages/en.json'
import type { Dictionary } from '@/lib/dictionary'

const arDict = arMessages as unknown as Dictionary
const enDict = enMessages as unknown as Dictionary

export type Language = 'ar' | 'en'

interface LanguageContextType {
  lang: Language
  dict: Dictionary
  toggleLang: () => void
  dir: 'rtl' | 'ltr'
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  dict: arDict,
  toggleLang: () => {},
  dir: 'rtl',
})

function readStoredLang(initialLang?: Language): Language {
  if (typeof window !== 'undefined') {
    const c = document.cookie.replace(/(?:(?:^|.*;\s*)lang\s*=\s*([^;]*).*$)|^.*$/, '$1')
    if (c === 'ar' || c === 'en') return c
    const stored = localStorage.getItem('lang') as Language | null
    if (stored === 'ar' || stored === 'en') return stored
  }
  return initialLang || 'ar'
}

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang?: Language }) {
  const [lang, setLang] = useState<Language>(initialLang || 'ar')

  useEffect(() => {
    startTransition(() => {
      const stored = readStoredLang(initialLang)
      if (stored !== lang) {
        setLang(stored)
      }
    })
  }, [initialLang, lang])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const toggleLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar'
    setLang(next)
    localStorage.setItem('lang', next)
    document.cookie = `lang=${next};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
  }

  const dict = lang === 'ar' ? arDict : enDict
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ lang, dict, toggleLang, dir }}>
      <div dir={dir} className="min-h-full flex flex-col bg-primary text-text-light">
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
