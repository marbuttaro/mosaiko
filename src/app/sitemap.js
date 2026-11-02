import { allNews, newsPageCount } from '../data/tutte-le-news'
import { newsHref, newsPageHref } from '../lib/route'
import { SITE_URL } from '../lib/site'

// Solo URL canonici (con slash finale) che rispondono 200
export default function sitemap() {
  const latest = allNews.map((item) => item.modified ?? item.isoDate).sort().at(-1)
  return [
    { url: `${SITE_URL}/`, lastModified: latest },
    { url: `${SITE_URL}/partner/` },
    ...Array.from({ length: newsPageCount }, (_, i) => ({ url: `${SITE_URL}${newsPageHref(i + 1)}`, ...(i === 0 ? { lastModified: latest } : {}) })),
    ...allNews.map((item) => ({ url: `${SITE_URL}${newsHref(item.slug)}`, lastModified: item.modified ?? item.isoDate })),
  ]
}
