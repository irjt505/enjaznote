import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

function generateToken(email: string): string {
  const salt = process.env.UNSUBSCRIBE_SALT
  if (!salt) throw new Error('UNSUBSCRIBE_SALT not set')
  return createHash('sha256').update(email + salt).digest('hex').slice(0, 16)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  if (token && email) {
    const expected = generateToken(email)
    if (token === expected) {
      await fetch(`${supabaseUrl}/rest/v1/subscribers?email=eq.${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { apikey: supabaseKey },
      })
      return NextResponse.redirect(new URL('/?unsubscribed=true', req.url))
    }
  }

  if (email) {
    const expected = generateToken(email)
    const unsubscribeUrl = `${req.url.split('?')[0]}?token=${expected}&email=${encodeURIComponent(email)}`
    return new Response(`
      <!DOCTYPE html>
      <html dir="rtl"><head><meta charset="utf-8"><title>إلغاء الاشتراك</title>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <style>
        body{font-family:Tahoma;background:#002248;color:white;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px}
        .card{background:#001a35;padding:32px;border-radius:16px;text-align:center;max-width:400px;border:1px solid rgba(255,255,255,0.06)}
        h1{color:#c49027;font-size:20px;margin:0 0 12px}
        p{color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 20px;line-height:1.6}
        a{display:inline-block;background:#c49027;color:#002248;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px}
        a:hover{background:#d4a037}
      </style></head><body>
        <div class="card">
          <h1>إلغاء الاشتراك</h1>
          <p>هل تريد إلغاء الاشتراك في النشرة البريدية لـ <strong>انجاز نوت</strong>؟</p>
          <a href="${unsubscribeUrl}">تأكيد إلغاء الاشتراك</a>
        </div>
      </body></html>
    `, { status: 200, headers: { 'Content-Type': 'text/html;charset=utf-8' } })
  }

  return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
}
