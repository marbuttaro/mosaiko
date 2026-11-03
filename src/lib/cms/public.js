import { cache } from 'react'
import { allNews } from '../../data/tutte-le-news'
import { events } from '../../data/content'

// Fallback esclusivamente prima dell'attivazione. Dopo la configurazione il DB è la fonte unica:
// un elenco vuoto deve restare vuoto, senza ripubblicare contenuti eliminati o bozze.
const getPublished = cache(async (kind) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url && !key) return kind === 'news' ? allNews : events
  if (!url || !key) throw new Error('Configurazione CMS incompleta')
  const items = []
  for (let offset = 0; ; offset += 500) {
    const response = await fetch(`${url}/rest/v1/cms_content?select=data&kind=eq.${kind}&status=eq.published&order=sort_order.asc,created_at.desc,id.asc&limit=500&offset=${offset}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store', signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error('Contenuti CMS temporaneamente non disponibili')
    const rows = await response.json()
    items.push(...rows.map(row => row.data))
    if (rows.length < 500) return items
  }
})
export const getNews = () => getPublished('news')
export const getEvents = () => getPublished('event')
