import 'server-only'
import { cookies } from 'next/headers'
import ar from '@/messages/ar.json'
import en from '@/messages/en.json'
import type { Dictionary } from '@/lib/dictionary'

const arDict = ar as unknown as Dictionary
const enDict = en as unknown as Dictionary

export async function getServerLanguage(): Promise<{ lang: 'ar' | 'en'; dict: Dictionary; dir: 'rtl' | 'ltr' }> {
  const cookieStore = await cookies()
  const lang = cookieStore.get('lang')?.value === 'en' ? 'en' : 'ar'
  const dict = lang === 'ar' ? arDict : enDict
  return { lang, dict, dir: lang === 'ar' ? 'rtl' : 'ltr' }
}
