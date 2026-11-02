import { NewsIndexPage } from '../../../../components/NewsPages'
import { newsPageCount } from '../../../../data/tutte-le-news'
import { newsPageHref } from '../../../../lib/route'

// Pagine 2..N dell'elenco news (la pagina 1 è /news/)
export const dynamicParams = false

export function generateStaticParams() {
  return Array.from({ length: newsPageCount - 1 }, (_, i) => ({ n: String(i + 2) }))
}

export async function generateMetadata({ params }) {
  const { n } = await params
  return {
    title: `News – pagina ${n}`,
    description: `Archivio news di Mosaiko Enterprise, pagina ${n}: eventi, partnership e progetti di networking.`,
    alternates: { canonical: newsPageHref(Number(n)) },
  }
}

export default async function Page({ params }) {
  const { n } = await params
  return <NewsIndexPage page={Number(n)} />
}
