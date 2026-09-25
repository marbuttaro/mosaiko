import Button from './Button'

const SERVICES = [
  {
    title: 'Eventi',
    text: 'Produzione di eventi e organizzazione',
    image: '/images/servizi/eventi.jpg',
  },
  {
    title: 'Visibilità & Networking',
    text: 'Attività di networking',
    image: '/images/servizi/rete-impresa.jpg',
  },
  {
    title: 'Business',
    text: 'Coordinamento e gestione di attività commerciali',
    image: '/images/servizi/business.jpg',
  },
]

// Colonne del mosaico: ogni colonna ha il suo sfalsamento verticale
const MOSAIC = [
  { offset: 'translate-y-8', tiles: [{ color: 'bg-mosaiko-navy' }, { image: 'porto' }] },
  { offset: '-translate-y-4', tiles: [{ image: 'concerto' }, { color: 'bg-mosaiko-blue' }] },
  { offset: 'translate-y-4', tiles: [{ color: 'bg-mosaiko-blue' }, { image: 'rally' }] },
  { offset: '-translate-y-8', tiles: [{ image: 'festival' }, { color: 'bg-mosaiko-navy' }] },
]

function GeneralInfo() {
  return (
    <section id="chi-siamo" className="bg-mosaiko-sand">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {MOSAIC.map((column, c) => (
              <div key={c} className={`flex flex-col gap-3 sm:gap-5 ${column.offset}`}>
                {column.tiles.map((tile, i) => (
                  <div
                    key={i}
                    className={`h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-mosaiko-navy/10 sm:h-24 sm:w-24 lg:h-28 lg:w-28 ${tile.color ?? ''}`}
                  >
                    {tile.image && (
                      <img
                        src={`/images/mosaico/${tile.image}.jpg`}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige-dark">
              Chi siamo
            </span>
            <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-mosaiko-navy sm:text-5xl">
              Un Mosaiko d’impresa
            </h2>
            <p className="mt-6 text-base leading-relaxed text-mosaiko-ink sm:text-lg">
              Mosaiko nasce da una convinzione semplice: il valore più
              importante di ogni progetto sono le relazioni che riesce a
              generare.
            </p>
            <p className="mt-4 text-base leading-relaxed text-mosaiko-ink sm:text-lg">
              Per questo eventi, hospitality e networking non rappresentano
              attività separate, ma parti di un unico modello. Costruiamo
              progetti in cui organizzazione, esperienza e relazioni lavorano
              insieme per creare valore per aziende, partner e stakeholder.
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

              <div className="absolute inset-0 flex flex-col items-start justify-end gap-4 bg-mosaiko-navy/80 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-sm leading-relaxed text-white/80">{service.text}</p>
                <Button href="#eventi" className="px-5 py-2 text-xs">
                  Scopri di più
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GeneralInfo
