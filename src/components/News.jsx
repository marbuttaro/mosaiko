import { news } from '../data/news'
import { newsHref } from '../lib/route'
import Button from './Button'
import Reveal from './Reveal'

export function NewsCard({ item }) {
  return (
    <a
      href={newsHref(item.slug)}
      className="group grid h-full grid-cols-[42%_1fr] overflow-hidden rounded-xl bg-white shadow-md shadow-mosaiko-navy/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-mosaiko-navy/15"
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex min-h-56 flex-col p-5 sm:p-6">
        <time dateTime={item.isoDate} className="self-end text-xs text-mosaiko-ink sm:text-sm">{item.date}</time>
        <h3 className="mt-4 font-heading text-lg font-medium uppercase leading-tight tracking-[0.01em] text-mosaiko-navy sm:text-xl lg:text-lg xl:text-xl">
          {item.shortTitle}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-mosaiko-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white"
            >
              {tag}
            </li>
          ))}
        </ul>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="mt-auto h-6 w-6 self-end text-mosaiko-blue transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </a>
  )
}

function News() {
  return (
    <section id="news" className="bg-mosaiko-sand pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal
          as="span"
          className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige"
        >
          News
        </Reveal>

        <div className="mt-6 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {news.slice(0, 3).map((item, i) => (
            <Reveal key={item.id} delay={i * 120}>
              <NewsCard item={item} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-10 flex justify-center">
          <Button href="/news/" variant="navy">Scopri tutte le news</Button>
        </Reveal>
      </div>
    </section>
  )
}

export default News
