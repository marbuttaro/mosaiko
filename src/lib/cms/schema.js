import { z } from 'zod'

export const reservedSlugs = ['admin', 'api', 'news', 'partner', 'feed', 'events', 'event', 'category', 'tag', 'author', 'wp-admin', 'wp-json', 'robots', 'sitemap']
export const safeUrl = (value) => /^\/(?!\/)[^\\\s]*$/.test(value) || /^https:\/\/[^\s\\]+$/i.test(value)
export const safeLink = (value) => safeUrl(value) || /^(mailto:[^\s]+@[^\s]+|tel:[+\d ()-]+|#[\w-]+)$/i.test(value)
const text = z.string().trim().min(1).max(20000).refine(v => [...v.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].every(m => safeLink(m[1])), 'Un link contiene un indirizzo non consentito')
const image = z.string().max(2000).refine(safeUrl, 'Usa un percorso locale o un URL https')
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v, 'Data non valida')
const bodyBlock = z.union([
  text,
  z.object({ heading: text }).strict(),
  z.object({ list: z.array(text).min(1).max(100) }).strict(),
  z.object({ quote: z.union([text,z.array(text).min(1).max(100)]) }).strict(),
  z.object({ image, alt: z.string().trim().min(1).max(500) }).strict(),
  z.object({ video: z.string().regex(/^[a-zA-Z0-9_-]{11}$/) }).strict(),
])
const common = {
  title: z.string().trim().min(1).max(300),
  image,
  date: z.string().trim().min(1).max(100),
}
export const newsSchema = z.object({
  ...common,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180).refine(v => !reservedSlugs.includes(v), 'URL riservato'),
  shortTitle: z.string().trim().min(1).max(300),
  imageAlt: z.string().trim().min(1).max(500),
  isoDate: date,
  modified: date.optional(),
  subtitle: z.string().max(3000).optional(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string().trim().min(1).max(80)).min(1).max(15),
  body: z.array(bodyBlock).min(1).max(300),
  archive: z.boolean().optional(),
  wpId: z.number().int().positive().optional(),
}).strict()
export const eventSchema = z.object({
  ...common,
  fullDate: z.string().trim().min(1).max(100),
  time: z.string().trim().min(1).max(100),
  location: z.string().trim().min(1).max(300),
  tag: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(10000),
  contact: z.string().email().max(250),
  imageAlt: z.string().max(500).optional(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
}).strict().refine(v => !v.endDate || (v.startDate && Date.parse(v.endDate) >= Date.parse(v.startDate)), 'La fine deve seguire l’inizio')
export const contentSchema = z.object({
  kind: z.enum(['news','event']),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180).refine(v => !reservedSlugs.includes(v), 'URL riservato'),
  status: z.enum(['draft','published']),
  sort_order: z.number().int().min(0).max(1000000),
  data: z.unknown(),
}).strict().superRefine((v,ctx) => {
  const result = (v.kind === 'news' ? newsSchema : eventSchema).safeParse(v.data)
  if (!result.success) for (const issue of result.error.issues) ctx.addIssue({...issue,path:['data',...issue.path]})
  if(v.kind === 'news' && v.data?.slug !== v.slug) ctx.addIssue({code:'custom',message:'URL articolo incoerente',path:['slug']})
})
