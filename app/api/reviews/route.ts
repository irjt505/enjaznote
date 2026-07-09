import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { isAdmin } from '@/lib/adminAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const smtpUser = process.env.SMTP_USER!
const smtpPass = process.env.SMTP_PASS!
const adminEmail = process.env.ADMIN_EMAIL
if (!adminEmail) throw new Error('ADMIN_EMAIL not set')

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const rateLimit = new Map<string, number>()
const RATE_WINDOW = 60000

function createTransport() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const lastReq = rateLimit.get(ip)
  if (lastReq && now - lastReq < RATE_WINDOW) {
    return NextResponse.json({ error: 'محاولات كثيرة. حاول بعد دقيقة.' }, { status: 429 })
  }
  rateLimit.set(ip, now)

  const { name, text, stars } = await req.json()
  if (!name || !text || !stars || stars < 1 || stars > 5) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const res = await fetch(`${supabaseUrl}/rest/v1/reviews`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ name, text, stars }),
  })
  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }
  const data = await res.json()

  // Send email notification to admin
  try {
    const starsStr = '⭐'.repeat(stars)
    const transport = createTransport()
    await transport.sendMail({
      from: `"انجاز نوت" <${smtpUser}>`,
      to: adminEmail,
      subject: `تقييم جديد من ${name}`,
      html: `
        <div style="font-family:Arial;background:#002248;color:white;padding:32px;border-radius:12px;max-width:500px">
          <div style="text-align:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.1)">
            <h1 style="color:#c49027;margin:0;font-size:20px">انجاز نوت</h1>
            <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:4px 0 0">تقييم جديد</p>
          </div>
          <div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:16px;margin-bottom:16px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#c49027,#a07020);display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;color:#002248">${escapeHtml(name.charAt(0))}</div>
              <div>
                <p style="margin:0;font-weight:bold;font-size:14px">${escapeHtml(name)}</p>
                <p style="margin:2px 0 0;font-size:12px;color:rgba(255,255,255,0.5)">${starsStr}</p>
              </div>
            </div>
            <p style="margin:0;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.85)">${escapeHtml(text)}</p>
          </div>
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);text-align:center">
            قم بزيارة لوحة التحكم للموافقة أو الرفض
          </p>
          <div style="text-align:center;margin-top:12px">
            <a href="https://www.enjaznote.com/admin" style="display:inline-block;background:#c49027;color:#002248;padding:8px 20px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:12px">فتح لوحة التحكم</a>
          </div>
        </div>
      `,
    })
  } catch {
    // Email notification is optional, don't fail the request
  }

  return NextResponse.json(data[0], { status: 201 })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const approved = searchParams.get('approved')
  let url = `${supabaseUrl}/rest/v1/reviews?order=created_at.desc`
  if (approved === 'true') {
    url += '&approved=eq.true'
  } else if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const res = await fetch(url, {
    headers: { apikey: supabaseKey },
  })
  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: 500 })
  }
  const data = await res.json()
  return NextResponse.json(data)
}
