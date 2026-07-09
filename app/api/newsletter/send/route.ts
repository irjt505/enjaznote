import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createHash } from 'crypto'
import { textToHtml } from '@/lib/emailFormatter'
import { isAdmin } from '@/lib/adminAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const smtpUser = process.env.SMTP_USER!
const smtpPass = process.env.SMTP_PASS!
const websiteUrl = process.env.WEBSITE_URL || 'https://www.enjaznote.com'

function createTransport() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  })
}

function generateToken(email: string): string {
  const salt = process.env.UNSUBSCRIBE_SALT
  if (!salt) throw new Error('UNSUBSCRIBE_SALT not set')
  return createHash('sha256').update(email + salt).digest('hex').slice(0, 16)
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { subject, textContent } = await req.json()
    if (!subject || !textContent) {
      return NextResponse.json({ error: 'Subject and content required' }, { status: 400 })
    }

    // Fetch all subscribers with tokens
    const res = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
      headers: { apikey: supabaseKey },
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }
    const subscribers: { id: number; email: string; unsubscribe_token: string | null }[] = await res.json()
    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No subscribers' }, { status: 400 })
    }

    const transport = createTransport()

    // Assign unsubscribe tokens for subscribers that don't have one
    for (const sub of subscribers) {
      if (!sub.unsubscribe_token) {
        const token = generateToken(sub.email)
        await fetch(`${supabaseUrl}/rest/v1/subscribers?id=eq.${sub.id}`, {
          method: 'PATCH',
          headers: {
            apikey: supabaseKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ unsubscribe_token: token }),
        })
        sub.unsubscribe_token = token
      }
    }

    const htmlBody = textToHtml(textContent)
    let sent = 0
    let failed = 0

    for (const sub of subscribers) {
      try {
        const unsubscribeUrl = `${websiteUrl}/api/unsubscribe?token=${sub.unsubscribe_token}&email=${encodeURIComponent(sub.email)}`
        const personalizedHtml = htmlBody.replace(/__UNSUBSCRIBE_URL__/g, unsubscribeUrl)

        const mailOptions: nodemailer.SendMailOptions = {
          from: `"انجاز نوت" <${smtpUser}>`,
          to: sub.email,
          subject,
          html: personalizedHtml,
          text: textContent,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            'Precedence': 'bulk',
            'X-Entity-Ref-ID': `newsletter-${Date.now()}`,
          },
        }

        await transport.sendMail(mailOptions)
        sent++
      } catch {
        failed++
      }
    }

    // Save to newsletters table
    await fetch(`${supabaseUrl}/rest/v1/newsletters`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        subject,
        text_content: textContent,
        html_content: htmlBody,
        recipient_count: sent,
      }),
    })

    return NextResponse.json({ sent, failed, total: subscribers.length }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
