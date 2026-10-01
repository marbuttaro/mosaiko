import { events } from '../data/content'
import Placeholder from './Placeholder'
import Reveal from './Reveal'
import SplitText from './SplitText'

function UpcomingEvents() {
  return (
    <section id="eventi" className="bg-mosaiko-sand py-16 sm:py-20">
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

        <div className="mt-12 grid gap-3 md:grid-cols-3 md:gap-8">
          {events.map((event, i) => (
            <Reveal
              as="a"
              key={event.title}
              delay={i * 90}
              href={`#evento-${i}`}
              className="flex flex-col gap-1.5 rounded-xl border border-mosaiko-navy/10 bg-mosaiko-navy/5 px-6 py-4 transition-all hover:border-mosaiko-blue/40 hover:bg-white sm:px-8 sm:py-5"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-mosaiko-blue sm:text-sm">
                {event.date}
              </span>
              <span className="font-heading text-xl font-semibold leading-none text-mosaiko-navy sm:text-2xl">
                {event.tag}
              </span>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {events.map((event, i) => (
            <Reveal
              as="article"
              id={`evento-${i}`}
              key={event.title}
              delay={i * 120}
              className="group scroll-mt-28 rounded-2xl border border-mosaiko-navy/10 bg-white p-3 shadow-md shadow-mosaiko-navy/10 transition-shadow hover:shadow-xl hover:shadow-mosaiko-navy/15"
            >
              <div className="relative">
                <Placeholder tone="navy" className="aspect-[4/3] w-full rounded-xl" />
                <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold text-mosaiko-navy">
                  {event.date}
                </span>
              </div>

              <div className="px-2 pb-2">
                <span className="mt-5 inline-flex items-center rounded-md bg-mosaiko-blue px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                  {event.tag}
                </span>
                <h3 className="mt-2 font-heading text-xl font-normal leading-snug text-mosaiko-navy">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-mosaiko-ink">{event.location}</p>

                <div className="mt-5 flex items-center justify-between">
                  <a
                    href="#"
                    className="inline-flex items-center rounded-lg bg-mosaiko-navy px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-mosaiko-navy-2"
                  >
                    Scopri di più
                  </a>
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
          ))}
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents
