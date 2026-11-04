import { NewsArticlePage } from '../../components/NewsPages'
import { newsDescription } from '../../data/tutte-le-news'
import { getNews } from '../../lib/cms/public'
import { notFound } from 'next/navigation'
import { newsHref } from '../../lib/route'
import { JsonLd, SITE_URL, organizationJsonLd } from '../../lib/site'
import { articleDates } from '../../lib/article-dates'

// Articoli in radice con lo slug di WordPress: solo quelli noti, ogni altro percorso dà 404
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const allNews = await getNews()
  const item = allNews.find(item => item.slug === slug)
  if (!item) notFound()
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
      ...(articleDates(item).datePublished ? { publishedTime: articleDates(item).datePublished } : {}),
      ...(articleDates(item).dateModified ? { modifiedTime: articleDates(item).dateModified } : {}),
      ...(item.image ? { images: [item.image] } : {}),
    },
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const allNews = await getNews()
  const item = allNews.find(item => item.slug === slug)
  if (!item) notFound()
  const url = `${SITE_URL}${newsHref(item.slug)}`
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: item.title,
          description: newsDescription(item),
          ...articleDates(item),
          mainEntityOfPage: url,
          ...(item.image ? { image: [new URL(item.image, SITE_URL).href] } : {}),
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
      <NewsArticlePage slug={item.slug} allNews={allNews} />
    </>
  )
}
