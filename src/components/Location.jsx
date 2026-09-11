import { location } from '../data/content'

function Location() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`

  return (
    <section id="dove-siamo" className="bg-mosaiko-cream py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
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

          <dl className="mt-8 space-y-4 text-sm">
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-semibold text-mosaiko-navy">Indirizzo</dt>
              <dd className="text-mosaiko-ink">{location.address}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-semibold text-mosaiko-navy">Email</dt>
              <dd>
                <a href={`mailto:${location.email}`} className="text-mosaiko-ink hover:text-mosaiko-gold-dark">
                  {location.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 font-semibold text-mosaiko-navy">Telefono</dt>
              <dd>
                <a href={`tel:${location.phone}`} className="text-mosaiko-ink hover:text-mosaiko-gold-dark">
                  {location.phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-mosaiko-navy/10 shadow-sm">
          <iframe
            title="Mappa Mosaiko"
            src={mapSrc}
            className="h-full w-full grayscale-[15%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default Location
