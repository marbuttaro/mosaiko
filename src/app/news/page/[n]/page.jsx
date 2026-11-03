import { notFound, permanentRedirect } from 'next/navigation'
import { NewsIndexPage } from '../../../../components/NewsPages'
import { NEWS_PER_PAGE } from '../../../../data/tutte-le-news'
import { newsPageHref } from '../../../../lib/route'
import { getNews } from '../../../../lib/cms/public'
import { DEFAULT_IMAGE } from '../../../../lib/site'
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }) {
  const {n}=await params
  return {
    title:`News – pagina ${n}`,
    description:`Archivio news di Mosaiko Enterprise, pagina ${n}: eventi, partnership e progetti di networking.`,
    alternates:{canonical:newsPageHref(Number(n))},
    openGraph:{title:`News – pagina ${n} – Mosaiko`,url:newsPageHref(Number(n)),images:[DEFAULT_IMAGE]},
  }
}
export default async function Page({ params }) {
  const {n}=await params
  if(!/^[1-9]\d*$/.test(n)) notFound()
  if(n==='1') permanentRedirect('/news/')
  const allNews=await getNews()
  if(Number(n)>Math.ceil(allNews.length/NEWS_PER_PAGE)) notFound()
  return <NewsIndexPage page={Number(n)} allNews={allNews} />
}
