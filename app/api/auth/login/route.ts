import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const rateLimit = new Map<string, { count: number; time: number }>()
const LIMIT = 5
const WINDOW = 60000

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (entry && now - entry.time < WINDOW) {
    if (entry.count >= LIMIT) {
      return NextResponse.json({ error: 'محاولات كثيرة جداً. حاول بعد دقيقة.' }, { status: 429 })
    }
    rateLimit.set(ip, { count: entry.count + 1, time: entry.time })
  } else {
    rateLimit.set(ip, { count: 1, time: now })
  }

  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    const message = error.message.includes('Email not confirmed')
      ? 'البريد الإلكتروني لم يتم تأكيده. تأكد من بريدك الوارد أو عطّل التأكيد من Supabase Dashboard > Auth > Settings > Confirm email'
      : 'بيانات الدخول غير صحيحة'
    return NextResponse.json({ error: message }, { status: 401 })
  }
  return NextResponse.json({ user: data.user })
}
