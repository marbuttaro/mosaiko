import { getNews } from '../../lib/cms/public'
import { newsDescription } from '../../data/tutte-le-news'
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from '../../lib/site'
export const dynamic='force-dynamic'
const xml=value=>String(value).replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]))
export async function GET() {
  const news=await getNews()
  const items=[...news].sort((a,b)=>b.isoDate.localeCompare(a.isoDate)).slice(0,50).map(item=>`<item><title>${xml(item.title)}</title><link>${SITE_URL}/${item.slug}/</link><guid isPermaLink="true">${SITE_URL}/${item.slug}/</guid><description>${xml(newsDescription(item))}</description><pubDate>${new Date(item.isoDate+'T12:00:00Z').toUTCString()}</pubDate>${item.tags.map(tag=>`<category>${xml(tag)}</category>`).join('')}</item>`).join('')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${SITE_NAME}</title><link>${SITE_URL}/</link><description>${xml(DEFAULT_DESCRIPTION)}</description><language>it-IT</language><atom:link href="${SITE_URL}/feed/" rel="self" type="application/rss+xml"/>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'no-store'}})
}
