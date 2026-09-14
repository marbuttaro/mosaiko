import Placeholder from './Placeholder'

const FEATURES = [
  {
    title: 'Eventi',
    text: 'Format originali, dai summit alle serate di networking, pensati per generare incontri di qualità.',
    tone: 'bg-mosaiko-navy text-mosaiko-green',
    icon: (
      <path
        d="M7 3v4M17 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Business',
    text: 'Occasioni concrete di confronto tra imprese, professionisti e istituzioni del territorio.',
    tone: 'bg-mosaiko-blue text-white',
    icon: (
      <path
        d="M4 8.5 12 4l8 4.5M4 8.5v9L12 22l8-4.5v-9M4 8.5 12 13l8-4.5M12 13v9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Networking',
    text: 'Una community viva che connette persone e organizzazioni oltre la durata del singolo evento.',
    tone: 'bg-mosaiko-green text-mosaiko-navy',
    icon: (
      <path
        d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm2.2-3.5 7.2 3.6M10.2 15.3l7.2-3.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
]

function GeneralInfo() {
  return (
    <section id="chi-siamo" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-24 sm:pt-32 lg:px-10">
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-green-dark">
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
      </div>

      <div className="mt-20 border-t border-mosaiko-navy/10 bg-mosaiko-cream/60 sm:mt-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-3 sm:gap-8 sm:py-20 lg:px-10">
          {FEATURES.map((feature) => (
            <div key={feature.title}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.tone}`}>
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mt-5 font-heading text-lg font-normal text-mosaiko-navy">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mosaiko-ink">{feature.text}</p>
              <a
                href="#eventi"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mosaiko-green-dark transition-colors hover:text-mosaiko-navy"
              >
                Scopri di più
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GeneralInfo
