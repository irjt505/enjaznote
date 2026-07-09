import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/adminAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const rateLimit = new Map<string, number>()
const RATE_WINDOW = 60000

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const lastReq = rateLimit.get(ip)
  if (lastReq && now - lastReq < RATE_WINDOW) {
    return NextResponse.json({ error: 'محاولات كثيرة. حاول بعد دقيقة.' }, { status: 429 })
  }
  rateLimit.set(ip, now)

  const { service_name, category_name, notes, phone } = await req.json()
  if (!service_name || !category_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ service_name, category_name, notes, phone }),
  })
  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }
  const data = await res.json()
  return NextResponse.json(data[0], { status: 201 })
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = `${supabaseUrl}/rest/v1/orders?order=created_at.desc`
  const res = await fetch(url, { headers: { apikey: supabaseKey } })
  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }
  const data = await res.json()
  return NextResponse.json(data)
}
