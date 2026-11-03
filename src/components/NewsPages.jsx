import { NEWS_PER_PAGE } from '../data/tutte-le-news'
import { safeLink } from '../lib/cms/schema'
import { newsHref, newsPageHref } from '../lib/route'
import { NewsCard } from './News'
import Reveal from './Reveal'
import SplitText from './SplitText'

// Nel testo delle news le parti tra **asterischi** sono i passaggi chiave da evidenziare,
// [testo](indirizzo) è un link (negli articoli importati da WordPress)
function RichText({ text }) {
  return text.split(/(\[[^\]]+\]\([^)\s]+\))/).map((chunk, c) => {
    const link = chunk.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link && safeLink(link[2])) {
      const external = /^https?:/.test(link[2]) && !link[2].includes('mosaiko.org')
      return (
        <a
          key={c}
          href={link[2]}
          className="font-medium text-mosaiko-blue underline underline-offset-2 hover:text-mosaiko-navy"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {link[1].replace(/\*\*/g, '')}
        </a>
      )
    }
    return chunk.split('**').map((part, i) =>
      i % 2 ? (
        <strong key={`${c}-${i}`} className="font-semibold text-mosaiko-navy">
          {part}
        </strong>
      ) : (
        part
      ),
    )
  })
}

// Blocchi del corpo: paragrafi (stringhe) e, negli articoli d'archivio, titoletti, elenchi, citazioni, immagini e video
function BodyBlock({ block, imageAlt }) {
  if (typeof block === 'string') return <p><RichText text={block} /></p>
  if (block.heading) return <h2 className="pt-4 font-heading text-xl font-medium text-mosaiko-navy sm:text-2xl">{block.heading.replace(/\*\*/g, '')}</h2>
  if (block.list)
    return (
      <ul className="list-disc space-y-2 pl-5 marker:text-mosaiko-blue">
        {block.list.map((item) => (
          <li key={item.slice(0, 40)}><RichText text={item} /></li>
        ))}
      </ul>
    )
  if (block.quote)
    return (
      <blockquote className="space-y-4 border-l-2 border-mosaiko-gold pl-5 italic text-mosaiko-navy/80">
        {[].concat(block.quote).map((paragraph) => (
          <p key={paragraph.slice(0, 40)}><RichText text={paragraph} /></p>
        ))}
      </blockquote>
    )
  if (block.image)
    return (
      <figure className="overflow-hidden rounded-2xl shadow-md shadow-mosaiko-navy/10">
        <img src={block.image} alt={block.alt || imageAlt} className="w-full object-cover" loading="lazy" />
      </figure>
    )
  if (block.video)
    return (
      <div className="aspect-video overflow-hidden rounded-2xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${block.video}`}
          title="Video"
          className="h-full w-full"
          loading="lazy"
          allowFullScreen
        />
      </div>
    )
  return null
}

const blockKey = (block, i) => `${i}-${typeof block === 'string' ? block.slice(0, 24) : Object.keys(block)[0]}`

function Tags({ tags }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-md bg-mosaiko-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}

// Card compatta della colonna "Altre news": foto, data con linea, titolo e link
function SidebarCard({ item }) {
  return (
    <a
      href={newsHref(item.slug)}
      className="group block overflow-hidden rounded-xl border border-mosaiko-navy/10 bg-white shadow-sm shadow-mosaiko-navy/5 transition-shadow duration-300 hover:shadow-lg hover:shadow-mosaiko-navy/10"
    >
      <div className="overflow-hidden">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <time dateTime={item.isoDate} className="whitespace-nowrap text-xs text-mosaiko-ink">
            {item.date}
          </time>
          <span className="h-px flex-1 bg-mosaiko-navy/15" />
        </div>
        <p className="mt-3 font-heading text-lg font-medium leading-snug text-mosaiko-navy">{item.shortTitle}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-mosaiko-blue">
          Leggi l&apos;articolo
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  )
}

function ArrowLink({ href, direction, children, ...props }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-mosaiko-navy/60 transition-colors hover:text-mosaiko-navy"
      {...props}
    >
      {direction === 'prev' && <span aria-hidden="true">‹</span>}
      {children}
      {direction === 'next' && <span aria-hidden="true">›</span>}
    </a>
  )
}

// Pagina dell'articolo (/<slug>/): articolo a sinistra, "Altre news" a destra (layout ripreso dal sito Caruso, con la foto)
export function NewsArticlePage({ slug, allNews }) {
  const index = allNews.findIndex((item) => item.slug === slug)
  const article = allNews[index]

  const prev = allNews[(index - 1 + allNews.length) % allNews.length]
  const next = allNews[(index + 1) % allNews.length]
  const others = allNews.filter((item) => item.slug !== slug).slice(0, 3)

  return (
    <section className="bg-mosaiko-sand pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-between border-b border-mosaiko-navy/10 pb-5">
          <ArrowLink href="/news/" direction="prev">Tutte le news</ArrowLink>
          {allNews.length > 1 && (
            <div className="flex gap-6">
              <ArrowLink href={newsHref(prev.slug)} direction="prev">Indietro</ArrowLink>
              <ArrowLink href={newsHref(next.slug)} direction="next">Prossimo</ArrowLink>
            </div>
          )}
        </div>

        <div className="mt-10 grid items-start gap-14 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article className="min-w-0 max-w-3xl">
            <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Tags tags={article.tags} />
              <time dateTime={article.isoDate} className="text-sm text-mosaiko-ink">{article.date}</time>
            </Reveal>
            <Reveal
              as="h1"
              delay={80}
              className="mt-5 font-heading text-3xl font-medium leading-[1.15] tracking-[-0.01em] text-mosaiko-navy sm:text-4xl lg:text-[2.75rem]"
            >
              {article.title}
            </Reveal>
            {article.subtitle && (
              <Reveal as="p" delay={160} className="mt-5 text-lg leading-relaxed text-mosaiko-navy/75 sm:text-xl">
                {article.subtitle}
              </Reveal>
            )}

            {article.image && (
              <Reveal delay={220} className="mt-10 overflow-hidden rounded-2xl shadow-md shadow-mosaiko-navy/10">
                <img src={article.image} alt={article.imageAlt} fetchPriority="high" loading="eager" className="aspect-[3/2] w-full object-cover" />
              </Reveal>
            )}

            <div className="mt-10 space-y-5 text-base leading-relaxed text-mosaiko-ink sm:text-[17px]">
              {article.body.map((block, i) => (
                <BodyBlock key={blockKey(block, i)} block={block} imageAlt={article.title} />
              ))}
            </div>
          </article>

          {others.length > 0 && (
            <aside className="min-w-0 border-t border-mosaiko-navy/10 pt-10 lg:sticky lg:top-28 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <h2 className="font-heading text-2xl font-medium uppercase tracking-[0.01em] text-mosaiko-navy">Altre news</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {others.map((item) => (
                  <SidebarCard key={item.slug} item={item} />
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}

// Numeri di pagina in fondo all'elenco: link veri, così ogni articolo resta raggiungibile anche dai motori di ricerca
function Pagination({ page, newsPageCount }) {
  if (newsPageCount < 2) return null
  const pages = Array.from({ length: newsPageCount }, (_, i) => i + 1)
  return (
    <nav aria-label="Pagine delle news" className="mt-14 flex items-center justify-center gap-6 border-t border-mosaiko-navy/10 pt-8">
      {page > 1 && <ArrowLink href={newsPageHref(page - 1)} direction="prev" rel="prev">Precedenti</ArrowLink>}
      <ul className="flex gap-2">
        {pages.map((p) => (
          <li key={p}>
            <a
              href={newsPageHref(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page ? 'bg-mosaiko-navy text-white' : 'text-mosaiko-navy/70 hover:bg-mosaiko-navy/10'
              }`}
            >
              {p}
            </a>
          </li>
        ))}
      </ul>
      {page < newsPageCount && <ArrowLink href={newsPageHref(page + 1)} direction="next" rel="next">Successive</ArrowLink>}
    </nav>
  )
}

// Pagina /news/ (e /news/page/N/): prima le news nuove, poi l'archivio, con le stesse card della home
export function NewsIndexPage({ page = 1, allNews }) {
  const newsPageCount = Math.ceil(allNews.length / NEWS_PER_PAGE)
  const items = allNews.slice((page - 1) * NEWS_PER_PAGE, page * NEWS_PER_PAGE)

  return (
    <section className="bg-mosaiko-sand pb-24 pt-40 sm:pb-32 sm:pt-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal as="span" className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige">
          News
        </Reveal>
        <SplitText
          as="h1"
          text="Storie, eventi e partnership"
          className="mt-4 font-heading text-4xl font-medium uppercase leading-tight tracking-[0.01em] text-mosaiko-navy sm:text-5xl"
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {items.map((item, i) => (
            <Reveal key={item.slug} delay={(i % 3) * 120}>
              <NewsCard item={item} priority={i === 0} />
            </Reveal>
          ))}
        </div>

        <Pagination page={page} newsPageCount={newsPageCount} />
      </div>
    </section>
  )
}
