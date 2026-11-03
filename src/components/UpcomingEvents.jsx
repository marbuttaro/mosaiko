'use client'

import { useState } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'

// Selettore vista solo mobile: elenco compatto o schede estese con foto
const VIEWS = [
  {
    id: 'cards',
    label: 'Vista estesa',
    icon: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="2.2" />
        <rect x="13" y="4" width="7" height="7" rx="2.2" />
        <rect x="4" y="13" width="7" height="7" rx="2.2" />
        <rect x="13" y="13" width="7" height="7" rx="2.2" />
      </>
    ),
  },
  {
    id: 'list',
    label: 'Vista elenco',
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="M7.5 8.5h.01M7.5 12h.01M7.5 15.5h.01M10.5 8.5h6M10.5 12h6M10.5 15.5h6" />
      </>
    ),
  },
]

function ViewToggle({ view, onChange }) {
  return (
    <div className="mt-8 flex justify-end gap-2.5 md:hidden" role="group" aria-label="Visualizzazione eventi">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onChange(v.id)}
          aria-label={v.label}
          aria-pressed={view === v.id}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-colors ${
            view === v.id
              ? 'bg-mosaiko-navy text-mosaiko-blue-light shadow-md shadow-mosaiko-navy/20'
              : 'border border-mosaiko-navy/10 bg-white/60 text-mosaiko-navy/50'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-6 w-6">
            {v.icon}
          </svg>
        </button>
      ))}
    </div>
  )
}

function UpcomingEvents({ events }) {
  const [view, setView] = useState('list')
  const [expanded, setExpanded] = useState(() => new Set())

  const toggleEvent = (i) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  // Da mobile, in vista elenco, il tocco su un evento apre la vista estesa su quella scheda
  const openEvent = (e, i) => {
    if (view !== 'list' || window.matchMedia('(min-width: 768px)').matches) return
    e.preventDefault()
    setView('cards')
    requestAnimationFrame(() => document.getElementById(`evento-${i}`)?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <section id="eventi" className="bg-mosaiko-mist pt-24 pb-16 sm:pt-32 sm:pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal
            as="span"
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige"
          >
            Calendario
          </Reveal>
          <SplitText
            text="Prossimi eventi"
            className="mt-4 font-heading uppercase tracking-[0.01em] text-3xl font-medium leading-tight text-mosaiko-navy sm:text-4xl"
          />
        </div>

        <ViewToggle view={view} onChange={setView} />

        <div className={`mt-8 gap-3 md:mt-12 md:grid md:grid-cols-3 md:gap-8 ${view === 'list' ? 'grid' : 'hidden'}`}>
          {events.map((event, i) => (
            <Reveal
              as="a"
              key={event.title}
              delay={i * 90}
              href={`#evento-${i}`}
              onClick={(e) => openEvent(e, i)}
              className="flex flex-col gap-1.5 rounded-xl border border-mosaiko-navy/10 bg-white/60 px-6 py-4 transition-all hover:border-mosaiko-blue/40 hover:bg-white sm:px-8 sm:py-5"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-mosaiko-blue sm:text-sm">
                {event.date}
              </span>
              <span className="hidden font-heading text-2xl font-semibold leading-none text-mosaiko-navy md:block">
                {event.tag}
              </span>
              {/* Da mobile l'elenco mostra le info complete dell'evento */}
              <span className="font-heading text-lg font-medium leading-snug text-mosaiko-navy md:hidden">
                {event.title}
              </span>
              <span className="flex items-center gap-2 text-sm text-mosaiko-ink md:hidden">
                <span className="rounded-md bg-mosaiko-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                  {event.tag}
                </span>
                {event.location}
              </span>
            </Reveal>
          ))}
        </div>

        {/* items-start: aprendo una scheda si allunga solo quella, non le altre della riga */}
        <div className={`mt-8 items-start gap-5 md:mt-14 md:grid md:grid-cols-3 md:gap-8 ${view === 'cards' ? 'grid' : 'hidden'}`}>
          {events.map((event, i) => {
            const isOpen = expanded.has(i)
            return (
            <Reveal
              as="article"
              id={`evento-${i}`}
              key={event.title}
              delay={i * 120}
              className="group flex scroll-mt-28 flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-mosaiko-navy/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-mosaiko-navy/15"
            >
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.imageAlt || event.title}
                  className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold text-mosaiko-navy">
                  {event.date}
                </span>
              </div>

              <div className="flex flex-1 flex-col items-start px-5 pb-5">
                <span className="mt-5 inline-flex items-center rounded-md bg-mosaiko-blue px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                  {event.tag}
                </span>
                <h3 className="mt-2 font-heading text-xl font-normal leading-snug text-mosaiko-navy md:min-h-[3.5rem]">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-mosaiko-ink">{event.location}</p>

                {/* Dettagli completi: il box si allunga con un'animazione su grid-rows */}
                <div
                  id={`evento-${i}-dettagli`}
                  className={`grid w-full transition-[grid-template-rows,opacity] duration-500 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-mosaiko-navy/10 pt-5 text-sm text-mosaiko-navy">
                      <dt className="font-semibold">Data:</dt>
                      <dd>{event.fullDate}</dd>
                      <dt className="font-semibold">Orario:</dt>
                      <dd>{event.time}</dd>
                      <dt className="font-semibold">Luogo:</dt>
                      <dd>{event.location}</dd>
                    </dl>
                    <p className="mt-4 text-sm leading-relaxed text-mosaiko-ink">{event.description}</p>
                    <p className="mt-4 text-sm text-mosaiko-navy">
                      <span className="font-semibold">Per contatti:</span>{' '}
                      <a href={`mailto:${event.contact}`} className="text-mosaiko-blue underline-offset-4 hover:underline">
                        {event.contact}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex w-full items-center justify-between pt-5">
                  <button
                    type="button"
                    onClick={() => toggleEvent(i)}
                    aria-expanded={isOpen}
                    aria-controls={`evento-${i}-dettagli`}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-mosaiko-blue/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-mosaiko-blue transition-colors hover:bg-mosaiko-blue hover:text-white"
                  >
                    {isOpen ? 'Chiudi' : 'Scopri di più'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Condividi"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-mosaiko-navy/15 text-mosaiko-navy/60 transition-colors hover:border-mosaiko-blue hover:text-mosaiko-blue"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path
                        d="M8.6 13.5 15.4 17M15.4 7l-6.8 3.5M18 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents
