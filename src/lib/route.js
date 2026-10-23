// Routing minimo: home, pagina partner e news; il resto lo serve index.html (vedi vercel.json)
const path = window.location.pathname.replace(/\/+$/, '') || '/'

export const isHome = path === '/'
export const isPartnerPage = path === '/partner'
export const isNewsIndex = path === '/news'

// /news/<slug> → pagina della singola news
const newsMatch = path.match(/^\/news\/([^/]+)$/)
export const newsSlug = newsMatch ? decodeURIComponent(newsMatch[1]) : null

export const newsHref = (slug) => `/news/${slug}`

// Le ancore della home funzionano anche dalle altre pagine
export const homeHref = (href) => (!isHome && href.startsWith('#') ? `/${href}` : href)
