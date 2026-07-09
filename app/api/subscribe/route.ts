import { NextRequest, NextResponse } from 'next/server'
import { getResend, resendFrom } from '@/lib/resend'

const adminEmail = process.env.ADMIN_EMAIL!
if (!adminEmail) throw new Error('ADMIN_EMAIL not set')

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

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

  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const res = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: 500 })
    }

    await getResend().emails.send({
      from: resendFrom,
      to: adminEmail,
      subject: '📬 اشتراك جديد في النشرة البريدية',
      html: `
        <div style="font-family: Arial; background:#002248;color:white;padding:24px;border-radius:8px">
          <h2 style="color:#c49027;margin:0 0 16px">اشتراك جديد ✅</h2>
          <p style="margin:0 0 8px"><strong>البريد الإلكتروني:</strong></p>
          <p style="direction:ltr;background:rgba(255,255,255,0.1);padding:12px;border-radius:6px">${escapeHtml(email)}</p>
          <p style="margin:16px 0 0;color:rgba(255,255,255,0.6);font-size:13px">
            تم الاشتراك عبر النشرة البريدية في الموقع
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
