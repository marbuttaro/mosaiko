// Percorsi del sito. Con trailingSlash attivo (next.config.mjs) tutte le pagine finiscono con "/", come su WordPress.
export function routeFlags(pathname = '/') {
  const path = pathname.replace(/\/+$/, '') || '/'
  return { isHome: path === '/', isPartnerPage: path === '/partner' }
}

// Le ancore della home funzionano anche dalle altre pagine
export const homeHref = (isHome, href) => (!isHome && href.startsWith('#') ? `/${href}` : href)

// Gli articoli stanno in radice con lo stesso slug del vecchio sito WordPress: gli URL già indicizzati non cambiano
export const newsHref = (slug) => `/${slug}/`

export const newsPageHref = (page) => (page > 1 ? `/news/page/${page}/` : '/news/')
