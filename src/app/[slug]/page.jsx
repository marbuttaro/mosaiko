import { NewsArticlePage } from '../../components/NewsPages'
import { allNews, findNews, newsDescription } from '../../data/tutte-le-news'
import { newsHref } from '../../lib/route'
import { JsonLd, SITE_URL, organizationJsonLd } from '../../lib/site'

// Articoli in radice con lo slug di WordPress: solo quelli noti, ogni altro percorso dà 404
export const dynamicParams = false

export function generateStaticParams() {
  return allNews.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = findNews(slug)
  const url = newsHref(item.slug)
  return {
    title: item.title,
    description: newsDescription(item),
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: item.title,
      description: newsDescription(item),
      publishedTime: item.isoDate,
      ...(item.modified ? { modifiedTime: item.modified } : {}),
      ...(item.image ? { images: [item.image] } : {}),
    },
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const item = findNews(slug)
  const url = `${SITE_URL}${newsHref(item.slug)}`
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: item.title,
          description: newsDescription(item),
          datePublished: item.isoDate,
          dateModified: item.modified ?? item.isoDate,
          mainEntityOfPage: url,
          ...(item.image ? { image: [`${SITE_URL}${item.image}`] } : {}),
          author: { '@type': 'Organization', name: organizationJsonLd.name, url: `${SITE_URL}/` },
          publisher: { '@type': 'Organization', name: organizationJsonLd.name, logo: { '@type': 'ImageObject', url: organizationJsonLd.logo } },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news/` },
            { '@type': 'ListItem', position: 3, name: item.shortTitle, item: url },
          ],
        }}
      />
      <NewsArticlePage slug={item.slug} />
    </>
  )
}
