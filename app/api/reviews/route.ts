import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { name, text, stars } = await req.json()
  if (!name || !text || !stars || stars < 1 || stars > 5) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const { data, error } = await supabase
    .from('reviews')
    .insert({ name, text, stars })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const approved = searchParams.get('approved')
  const query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
  if (approved === 'true') query.eq('approved', true)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
