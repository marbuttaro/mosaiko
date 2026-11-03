import { getNews } from '../../lib/cms/public'
export const dynamic = 'force-dynamic'

import { NewsIndexPage } from '../../components/NewsPages'
import { DEFAULT_IMAGE } from '../../lib/site'

export const metadata = {
  title: 'News',
  description: 'News di Mosaiko Enterprise: storie, eventi, partnership e progetti di networking tra imprese.',
  alternates: { canonical: '/news/' },
  openGraph: { images: [DEFAULT_IMAGE], url: '/news/', title: 'News – Mosaiko' },
}

export default async function Page() {
  return <NewsIndexPage page={1} allNews={await getNews()} />
}
