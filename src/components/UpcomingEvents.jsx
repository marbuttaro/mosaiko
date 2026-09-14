import { events } from '../data/content'
import Placeholder from './Placeholder'

const TAG_STYLES = {
  Networking: 'bg-mosaiko-yellow text-mosaiko-navy',
  Conferenza: 'bg-mosaiko-blue text-white',
  Workshop: 'bg-mosaiko-yellow text-mosaiko-navy',
}

function UpcomingEvents() {
  return (
    <section id="eventi" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-yellow-dark">
            Calendario
          </span>
          <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-mosaiko-navy sm:text-5xl">
            Prossimi eventi
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          {events.map((event, i) => (
            <a
              key={event.title}
              href={`#evento-${i}`}
              className={`flex flex-col gap-2 rounded-xl border px-6 py-6 transition-all sm:px-8 sm:py-8 ${
                i === 0
                  ? 'border-transparent bg-mosaiko-navy shadow-xl shadow-mosaiko-navy/15'
                  : 'border-mosaiko-navy/10 bg-mosaiko-navy/5 hover:border-mosaiko-yellow/40 hover:bg-white'
              }`}
            >
              <span
                className={`text-xs font-semibold uppercase tracking-[0.15em] sm:text-sm ${
                  i === 0 ? 'text-mosaiko-yellow-light' : 'text-mosaiko-yellow-dark'
                }`}
              >
                {event.date}
              </span>
              <span
                className={`font-heading text-3xl font-semibold leading-none sm:text-4xl ${
                  i === 0 ? 'text-white' : 'text-mosaiko-navy'
                }`}
              >
                {event.tag}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {events.map((event, i) => (
            <article
              id={`evento-${i}`}
              key={event.title}
              className="group scroll-mt-28 rounded-2xl border border-mosaiko-navy/10 bg-white p-3 shadow-md shadow-mosaiko-navy/10 transition-shadow hover:shadow-xl hover:shadow-mosaiko-navy/15"
            >
              <div className="relative">
                <Placeholder tone="navy" className="aspect-[4/3] w-full rounded-xl" />
                <span className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1 text-xs font-semibold text-mosaiko-navy">
                  {event.date}
                </span>
              </div>

              <div className="px-2 pb-2">
                <span
                  className={`mt-5 inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${
                    TAG_STYLES[event.tag] ?? 'bg-mosaiko-yellow text-mosaiko-navy'
                  }`}
                >
                  {event.tag}
                </span>
                <h3 className="mt-2 font-heading text-xl font-normal leading-snug text-mosaiko-navy">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-mosaiko-ink">{event.location}</p>

                <div className="mt-5 flex items-center justify-between">
                  <a
                    href="#"
                    className="inline-flex items-center rounded-lg bg-mosaiko-navy px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-mosaiko-navy-2"
                  >
                    Scopri di più
                  </a>
                  <button
                    type="button"
                    aria-label="Condividi"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-mosaiko-navy/15 text-mosaiko-navy/60 transition-colors hover:border-mosaiko-yellow hover:text-mosaiko-yellow-dark"
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
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents
