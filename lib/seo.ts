export interface SeoEntry {
  id?: number
  page_path: string
  title: string | null
  description: string | null
  keywords: string | null
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function getSeoByPath(path: string): Promise<SeoEntry | null> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/seo?page_path=eq.${encodeURIComponent(path)}`,
      { headers: { apikey: supabaseKey }, next: { revalidate: 60 } },
    )
    if (!res.ok) return null
    const data: SeoEntry[] = await res.json()
    return data[0] || null
  } catch {
    return null
  }
}

export async function getAllSeo(): Promise<SeoEntry[]> {
  const res = await fetch(`${supabaseUrl}/rest/v1/seo?order=page_path.asc`, {
    headers: { apikey: supabaseKey },
    next: { revalidate: 60 },
  })
  if (!res.ok) return []
  return res.json()
}

export async function updateSeo(id: number, data: Partial<SeoEntry>) {
  const res = await fetch(`${supabaseUrl}/rest/v1/seo?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
  })
  return res.ok
}
