import { model, sponsors, stats } from '../data/content'

function SponsorsStats() {
  return (
    <>
      <section className="relative overflow-hidden bg-mosaiko-navy py-24 sm:py-32">
        <svg
          className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 text-mosaiko-gold opacity-[0.07]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <rect x="10" y="10" width="80" height="80" rx="18" stroke="currentColor" strokeWidth="0.6" />
        </svg>

        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-gold">
              {model.eyebrow}
            </span>
            <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-white sm:text-5xl">
              {model.heading}
            </h2>

            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-heading text-5xl font-semibold tracking-tight text-mosaiko-gold sm:text-6xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-sm font-medium uppercase tracking-[0.1em] text-white/60">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-6 lg:pt-2">
            {model.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={`text-base leading-relaxed ${
                  i === 0 ? 'text-white/85 sm:text-lg' : 'text-white/55'
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="sponsor" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-gold-dark">
              Partner
            </span>
            <h2 className="mt-4 font-heading text-3xl font-medium leading-tight text-mosaiko-navy sm:text-4xl">
              I nostri sponsor
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 divide-x divide-y divide-mosaiko-navy/10 overflow-hidden rounded-2xl border border-mosaiko-navy/10 bg-mosaiko-cream/30 shadow-sm sm:grid-cols-3 lg:grid-cols-4">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor}
                className="group flex items-center justify-center px-6 py-12 text-center transition-colors duration-300 hover:bg-white"
              >
                <span className="font-heading text-lg font-medium tracking-wide text-mosaiko-navy opacity-35 transition-opacity duration-300 group-hover:opacity-100">
                  {sponsor}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default SponsorsStats
