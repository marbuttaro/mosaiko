import { location } from '../data/content'
import Placeholder from './Placeholder'

function Location() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`

  return (
    <section id="dove-siamo" className="bg-mosaiko-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-gold-dark">
            Dove siamo
          </span>
          <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-mosaiko-navy sm:text-5xl">
            Vieni a trovarci
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mosaiko-ink sm:text-lg">
            La nostra sede è il punto di partenza di una rete che si estende
            in tutta la regione. Passa a trovarci o scrivici per organizzare
            insieme il prossimo evento.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl bg-white p-3 shadow-xl shadow-mosaiko-navy/10 sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr_1fr] lg:gap-4">
            <div className="flex flex-col justify-center gap-6 rounded-xl bg-mosaiko-cream/70 p-6 sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mosaiko-gold-dark">
                  Indirizzo
                </p>
                <p className="mt-2 text-base font-medium leading-relaxed text-mosaiko-navy">
                  {location.address}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mosaiko-gold-dark">
                  Città
                </p>
                <p className="mt-2 text-base font-medium text-mosaiko-navy">{location.city}</p>
              </div>
            </div>

            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl lg:aspect-auto">
              <iframe
                title="Mappa Mosaiko"
                src={mapSrc}
                className="h-full min-h-72 w-full grayscale-[15%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex flex-col justify-center gap-6 rounded-xl bg-mosaiko-navy p-6 text-white sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mosaiko-gold">
                  Email
                </p>
                <a
                  href={`mailto:${location.email}`}
                  className="mt-2 block text-base font-medium text-white hover:text-mosaiko-gold-light"
                >
                  {location.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mosaiko-gold">
                  Telefono
                </p>
                <a
                  href={`tel:${location.phone}`}
                  className="mt-2 block text-base font-medium text-white hover:text-mosaiko-gold-light"
                >
                  {location.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg">
                {i === 2 ? (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-mosaiko-gold text-center text-mosaiko-navy">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em]">Sede</span>
                    <span className="font-heading text-lg font-medium">Mosaiko</span>
                  </div>
                ) : (
                  <Placeholder tone={i % 2 === 0 ? 'navy' : 'cream'} className="h-full w-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Location
