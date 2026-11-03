import { NEWS_PER_PAGE } from '../data/tutte-le-news'
import { getNews } from '../lib/cms/public'
export const dynamic = 'force-dynamic'
import { newsHref, newsPageHref } from '../lib/route'
import { SITE_URL } from '../lib/site'

// Solo URL canonici (con slash finale) che rispondono 200
export default async function sitemap() {
  const allNews = await getNews()
  const newsPageCount = Math.max(1, Math.ceil(allNews.length / NEWS_PER_PAGE))
  const latest = allNews.map((item) => item.modified ?? item.isoDate).sort().at(-1)
  return [
    { url: `${SITE_URL}/`, lastModified: latest },
    { url: `${SITE_URL}/partner/` },
    ...Array.from({ length: newsPageCount }, (_, i) => ({ url: `${SITE_URL}${newsPageHref(i + 1)}`, ...(i === 0 ? { lastModified: latest } : {}) })),
    ...allNews.map((item) => ({ url: `${SITE_URL}${newsHref(item.slug)}`, lastModified: item.modified ?? item.isoDate })),
  ]
}
