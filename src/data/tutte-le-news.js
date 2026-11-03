import { news } from './news.js'
import { newsArchive } from './news-archivio.js'

// Sezione News: prima le news del nuovo sito (news.js), poi l'archivio importato da WordPress.
// In home restano solo le prime tre di news.js.
export const allNews = [...news, ...newsArchive]

export const NEWS_PER_PAGE = 12
export const newsPageCount = Math.ceil(allNews.length / NEWS_PER_PAGE)

export const findNews = (slug) => allNews.find((item) => item.slug === slug)

// Testo semplice per meta description: subtitle delle news nuove, description per l'archivio
export const newsDescription = (item) => item.description?.trim() || item.subtitle?.trim() || item.body.filter(block => typeof block === 'string').join(' ').replace(/\*\*/g, '').slice(0, 160)

// Uno slug non deve coincidere con una pagina del sito
const RESERVED = ['news', 'partner']
const clash = allNews.filter((item, i) => RESERVED.includes(item.slug) || allNews.findIndex((x) => x.slug === item.slug) !== i)
if (clash.length) throw new Error(`Slug news non validi o duplicati: ${clash.map((x) => x.slug).join(', ')}`)
