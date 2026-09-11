import Placeholder from './Placeholder'

const FEATURES = [
  {
    title: 'Eventi',
    text: 'Format originali, dai summit alle serate di networking, pensati per generare incontri di qualità.',
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
    <section id="chi-siamo" className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-gold-dark">
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

          <dl className="mt-10 grid gap-8 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mosaiko-navy text-mosaiko-gold">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    {feature.icon}
                  </svg>
                </div>
                <dt className="mt-4 font-heading text-lg font-medium text-mosaiko-navy">
                  {feature.title}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-mosaiko-ink">{feature.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Placeholder
          tone="navy"
          label="Foto in arrivo"
          className="aspect-[4/5] w-full rounded-3xl"
        />
      </div>
    </section>
  )
}

export default GeneralInfo
