import { location } from '../data/content'

function Location() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`

  return (
    <section id="dove-siamo" className="bg-mosaiko-sand py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige-dark">
            Dove siamo
          </span>
          <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-mosaiko-navy sm:text-5xl">
            Il nostro mosaico
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mosaiko-ink sm:text-lg">
            La nostra sede è il punto di partenza di una rete che si estende
            in tutta la regione. Passa a trovarci o scrivici per organizzare
            insieme il prossimo evento.
          </p>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-2xl shadow-xl shadow-mosaiko-navy/10 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-8 bg-mosaiko-navy-2 p-8 text-white sm:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                Ragione sociale
              </p>
              <p className="mt-2 text-base font-medium text-white">{location.company}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                Indirizzo
              </p>
              <p className="mt-2 text-base font-medium leading-relaxed text-white">
                {location.address}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                Email
              </p>
              <a
                href={`mailto:${location.email}`}
                className="mt-2 block text-base font-medium text-white hover:underline"
              >
                {location.email}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                Telefono
              </p>
              <a
                href={`tel:${location.phone}`}
                className="mt-2 block text-base font-medium text-white hover:underline"
              >
                {location.phone}
              </a>
            </div>
          </div>

          <div className="aspect-[4/3] w-full lg:aspect-auto">
            <iframe
              title="Mappa Mosaiko"
              src={mapSrc}
              className="h-full min-h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Location
