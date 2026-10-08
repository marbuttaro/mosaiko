// Routing minimo: home e pagina partner, il resto lo serve index.html (vedi vercel.json)
export const isPartnerPage = /^\/partner\/?$/.test(window.location.pathname)

// Le ancore della home funzionano anche dalle altre pagine
export const homeHref = (hash) => (isPartnerPage ? `/${hash}` : hash)
