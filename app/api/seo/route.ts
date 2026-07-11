import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/adminAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  const res = await fetch(`${supabaseUrl}/rest/v1/seo?order=page_path.asc`, {
    headers: { apikey: anonKey },
  })
  if (!res.ok) return NextResponse.json({ error: 'Failed' }, { status: 500 })
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { page_path, title, description, keywords } = await req.json()
    if (!page_path) return NextResponse.json({ error: 'page_path required' }, { status: 400 })

    const body: Record<string, unknown> = {
      page_path,
      title: title || null,
      description: description || null,
      keywords: keywords || null,
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/seo`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: 500 })
    }
    const data = await res.json()
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, title, description, keywords } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const res = await fetch(`${supabaseUrl}/rest/v1/seo?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title || null,
        description: description || null,
        keywords: keywords || null,
        updated_at: new Date().toISOString(),
      }),
    })
    if (!res.ok) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id query param required' }, { status: 400 })

    const res = await fetch(`${supabaseUrl}/rest/v1/seo?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    })
    if (!res.ok) return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
