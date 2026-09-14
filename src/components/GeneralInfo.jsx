import Placeholder from './Placeholder'

const SERVICES = [
  { title: 'Eventi', image: '/images/servizi/eventi.jpg' },
  { title: "Rete d'impresa", image: '/images/servizi/rete-impresa.jpg' },
  { title: 'Business', image: '/images/servizi/business.jpg' },
]

function GeneralInfo() {
  return (
    <section id="chi-siamo" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex items-center justify-center gap-4 sm:gap-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-28 w-28 shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-mosaiko-navy/10 sm:h-36 sm:w-36 ${
                  i === 1 ? '-translate-y-6' : 'translate-y-6'
                }`}
              >
                <Placeholder tone={i === 1 ? 'cream' : 'navy'} className="h-full w-full" />
              </div>
            ))}
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-yellow-dark">
              Chi siamo
            </span>
            <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-mosaiko-navy sm:text-5xl">
              Un hub che mette in rete persone, imprese e idee
            </h2>
            <p className="mt-6 text-base leading-relaxed text-mosaiko-ink sm:text-lg">
              Mosaiko nasce per dare forma a un ecosistema di relazioni: ideiamo
              e organizziamo eventi che uniscono aziende, professionisti e
              istituzioni, creando spazi dove il business incontra le persone
              e le opportunità diventano concrete.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-lg shadow-mosaiko-navy/10"
            >
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-mosaiko-navy/55 via-mosaiko-navy/0 to-mosaiko-navy/0" />
              <span className="absolute left-5 top-5 font-heading text-xl font-medium text-white sm:text-2xl">
                {service.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GeneralInfo
