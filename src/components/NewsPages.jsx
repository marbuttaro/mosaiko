import { useEffect } from 'react'
import { news } from '../data/news'
import { newsHref } from '../lib/route'
import Button from './Button'
import { NewsCard } from './News'
import Reveal from './Reveal'
import SplitText from './SplitText'

// Nel testo delle news le parti tra **asterischi** sono i passaggi chiave da evidenziare
function RichText({ text }) {
  return text.split('**').map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-mosaiko-navy">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

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

function ArrowLink({ href, direction, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-mosaiko-navy/60 transition-colors hover:text-mosaiko-navy"
    >
      {direction === 'prev' && <span aria-hidden="true">‹</span>}
      {children}
      {direction === 'next' && <span aria-hidden="true">›</span>}
    </a>
  )
}

// Pagina /news/<slug>: articolo a sinistra, "Altre news" a destra (layout ripreso dal sito Caruso, con la foto)
export function NewsArticlePage({ slug }) {
  const index = news.findIndex((item) => item.slug === slug)
  const article = news[index]

  useEffect(() => {
    document.title = article ? `${article.shortTitle} — Mosaiko` : 'News non trovata — Mosaiko'
  }, [article])

  if (!article) {
    return (
      <section className="bg-mosaiko-sand pb-24 pt-40 sm:pt-48">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h1 className="font-heading text-3xl font-medium uppercase text-mosaiko-navy sm:text-4xl">News non trovata</h1>
          <p className="mt-4 text-mosaiko-ink">L&apos;articolo che cerchi non esiste o è stato spostato.</p>
          <Button href="/news" variant="navy" className="mt-8">Tutte le news</Button>
        </div>
      </section>
    )
  }

  const prev = news[(index - 1 + news.length) % news.length]
  const next = news[(index + 1) % news.length]
  const others = news.filter((item) => item.slug !== slug).slice(0, 3)

  return (
    <section className="bg-mosaiko-sand pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-between border-b border-mosaiko-navy/10 pb-5">
          <ArrowLink href="/news" direction="prev">Tutte le news</ArrowLink>
          {news.length > 1 && (
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
            <Reveal as="p" delay={160} className="mt-5 text-lg leading-relaxed text-mosaiko-navy/75 sm:text-xl">
              {article.subtitle}
            </Reveal>

            <Reveal delay={220} className="mt-10 overflow-hidden rounded-2xl shadow-md shadow-mosaiko-navy/10">
              <img src={article.image} alt={article.imageAlt} className="aspect-[3/2] w-full object-cover" />
            </Reveal>

            <div className="mt-10 space-y-5 text-base leading-relaxed text-mosaiko-ink sm:text-[17px]">
              {article.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>
                  <RichText text={paragraph} />
                </p>
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

// Pagina /news: elenco di tutte le news con le stesse card della home
export function NewsIndexPage() {
  useEffect(() => {
    document.title = 'News — Mosaiko'
  }, [])

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
          {news.map((item, i) => (
            <Reveal key={item.slug} delay={(i % 3) * 120}>
              <NewsCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
