import { sponsors, stats } from '../data/content'

function SponsorsStats() {
  return (
    <section id="sponsor" className="bg-mosaiko-navy py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-gold">
            Numeri e sponsor
          </span>
          <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-white sm:text-5xl">
            Una rete che cresce evento dopo evento
          </h2>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-heading text-4xl font-semibold text-mosaiko-gold sm:text-5xl">
                {stat.value}
              </dt>
              <dd className="mt-2 text-sm text-white/70">{stat.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 border-t border-white/10 pt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Con il supporto di
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-6">
            {sponsors.map((sponsor) => (
              <span
                key={sponsor}
                className="font-heading text-lg font-medium text-white/45 transition-colors hover:text-white/80"
              >
                {sponsor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SponsorsStats
