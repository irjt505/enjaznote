import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${req.cookies.get('sb-access-token')?.value ?? ''}` },
      },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
  return supabase
}

export async function POST(req: NextRequest) {
  const { service_name, category_name, notes, phone } = await req.json()
  if (!service_name || !category_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const supabase = getSupabase(req)
  const { data, error } = await supabase
    .from('orders')
    .insert({ service_name, category_name, notes, phone })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET(req: NextRequest) {
  const supabase = getSupabase(req)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
