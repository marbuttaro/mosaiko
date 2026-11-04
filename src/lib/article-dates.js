import originalDates from '../data/wordpress-article-dates.json' with { type: 'json' }

// The CMS stores editorial dates with day precision. Only emit DateTime values
// recovered from the original article; do not invent a publication time.
export function articleDates(item) {
  const original = originalDates.articles[item.wpId]
  if (!original || original.slug !== item.slug) return {}
  return {
    ...(item.isoDate === original.publishedDay ? { datePublished: original.publishedAt } : {}),
    ...(item.modified === original.modifiedDay ? { dateModified: original.modifiedAt } : {}),
  }
}
