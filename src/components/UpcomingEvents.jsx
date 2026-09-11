import { events } from '../data/content'
import Placeholder from './Placeholder'
import Button from './Button'

function UpcomingEvents() {
  return (
    <section id="eventi" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-gold-dark">
              Calendario
            </span>
            <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-mosaiko-navy sm:text-5xl">
              Prossimi eventi
            </h2>
          </div>
          <Button href="#" variant="outlineNavy">
            Vedi tutti gli eventi
          </Button>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {events.map((event) => (
            <article key={event.title} className="group">
              <div className="relative">
                <Placeholder tone="navy" className="aspect-[4/3] w-full rounded-2xl" />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-mosaiko-navy">
                  {event.date}
                </span>
              </div>

              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-mosaiko-gold-dark">
                {event.tag}
              </span>
              <h3 className="mt-2 font-heading text-xl font-medium leading-snug text-mosaiko-navy">
                {event.title}
              </h3>
              <p className="mt-1 text-sm text-mosaiko-ink">{event.location}</p>

              <a
                href="#"
                className="mt-4 inline-block border-b border-transparent text-sm font-semibold text-mosaiko-gold-dark transition-colors group-hover:border-mosaiko-gold-dark"
              >
                Scopri di più
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents
