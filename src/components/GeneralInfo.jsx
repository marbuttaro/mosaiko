import { useState } from 'react'
import Button from './Button'
import Reveal from './Reveal'
import ServiceModal from './ServiceModal'
import SplitText from './SplitText'

const SERVICES = [
  {
    title: 'Eventi',
    text: 'Produzione di eventi e organizzazione',
    image: '/images/servizi/eventi.jpg',
    details: [
      'Ideazione e progettazione eventi',
      'Produzione e coordinamento operativo',
      'Hospitality Management',
      'Corporate & Business Events',
      'Eventi sportivi e istituzionali',
      'Food & Beverage Management',
      'Location & Venue Management',
      'Guest Experience e servizi dedicati',
    ],
  },
  {
    title: 'Visibilità & Networking',
    text: 'Attività di networking',
    image: '/images/servizi/rete-impresa.jpg',
    details: [
      'Partnership e Sponsorship',
      'Brand Visibility',
      'Networking B2B',
      'Corporate Relations',
      'Eventi di relazione',
      'Attivazioni di brand',
      'Percorsi di visibilità su misura',
      'Accesso al network Mosaiko',
    ],
  },
  {
    title: 'Business',
    text: 'Coordinamento e gestione di attività commerciali',
    image: '/images/servizi/business.jpg',
    details: [
      'Business Development',
      'Creazione di nuove opportunità commerciali',
      'Connessioni tra aziende e partner',
      'Sviluppo di progetti su misura',
      'Partnership strategiche',
      'Valorizzazione di strutture e asset',
      'Sviluppo di nuovi format e iniziative',
      'Supporto all’espansione e al posizionamento',
    ],
  },
]

// Composizione "Un mosaico di impresa": su desktop ogni pezzo è posizionato in % sulla tela
// (left, top, width, height), su mobile i pezzi seguono una griglia a 2 colonne.
const pos = (l, t, w, h) => ({ '--l': `${l}%`, '--t': `${t}%`, '--w': `${w}%`, ...(h && { '--h': `${h}%` }) })

const PIECE = 'lg:absolute lg:left-(--l) lg:top-(--t) lg:w-(--w) lg:h-(--h)'

const TILE = `${PIECE} overflow-hidden rounded-lg shadow-lg shadow-mosaiko-navy/10`

function Photo({ name, position, delay, className = '' }) {
  return (
    <Reveal delay={delay} className={`relative ${TILE} ${className}`} style={position}>
      <img src={`/images/mosaico/${name}.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
      {/* Overlay #0E1A2B al 20% in moltiplica, come da design */}
      <div className="absolute inset-0 bg-mosaiko-navy/20 mix-blend-multiply" />
    </Reveal>
  )
}

function Tile({ position, delay, className = '' }) {
  return <Reveal delay={delay} className={`bg-mosaiko-navy ${TILE} ${className}`} style={position} />
}

const PILOT = { l: 39, t: 21.8, w: 21.8, h: 51.7 }

function TitleBlock({ light = false }) {
  return (
    <>
      <Reveal
        as="span"
        className={`inline-block text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige ${light ? 'invisible' : ''}`}
      >
        Chi siamo
      </Reveal>
      <SplitText
        text="Un Mosaiko d’impresa"
        className={`mt-4 font-heading uppercase tracking-[0.01em] text-[1.75rem] font-medium leading-tight sm:text-[2rem] lg:mt-[0.5cqw] lg:max-w-[50cqw] lg:text-[5cqw] lg:font-semibold lg:leading-[1.05] ${
          light ? 'text-white' : 'text-mosaiko-navy'
        }`}
      />
    </>
  )
}

const BODY = 'text-base leading-relaxed text-mosaiko-ink sm:text-lg lg:text-[1.36cqw] lg:leading-[1.25]'

function GeneralInfo() {
  const [openService, setOpenService] = useState(null)

  return (
    <section className="bg-mosaiko-sand">
      {/* Fascia azzurra solo dietro "Un mosaico di impresa", come la sezione eventi */}
      <div className="mt-20 bg-mosaiko-mist sm:mt-24">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-14 sm:pt-24 sm:pb-16 lg:px-10">
          <div className="@container grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:relative lg:block lg:aspect-[1252/546]">
            <div className={`col-span-2 ${PIECE} lg:z-10`} style={pos(0, 8)}>
              <TitleBlock />
            </div>
            {/* Copia bianca del titolo, visibile solo dove passa sopra la foto del pilota */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
              style={{ clipPath: `inset(${PILOT.t}% ${100 - PILOT.l - PILOT.w}% ${100 - PILOT.t - PILOT.h}% ${PILOT.l}% round 0.5rem)` }}
            >
              <div className={PIECE} style={pos(0, 8)}>
                <TitleBlock light />
              </div>
            </div>

            <Reveal delay={150} className={`col-span-2 mb-6 space-y-[1.4em] ${BODY} ${PIECE} lg:mb-0`} style={pos(0, 46, 32)}>
              <p>
                Mosaiko nasce da una convinzione semplice: il valore più importante
                di ogni progetto sono{' '}
                <strong className="font-semibold text-mosaiko-navy">le relazioni che riesce a generare.</strong>
              </p>
              <p>
                Eventi, hospitality e networking non rappresentano attività
                separate, ma parti di un unico modello. Costruiamo progetti in cui
                organizzazione, esperienza e relazioni lavorano insieme per{' '}
                <strong className="font-semibold text-mosaiko-navy">creare valore per aziende, partner e stakeholder.</strong>
              </p>
            </Reveal>

            <Photo name="pilota" position={pos(PILOT.l, PILOT.t, PILOT.w, PILOT.h)} className="col-span-2 aspect-[1.17] lg:aspect-auto" />
            <Tile position={pos(41.1, 74.7, 8.5, 21.1)} delay={80} className="aspect-[1.17] lg:aspect-auto" />
            <Photo name="networking" position={pos(50.2, 74.7, 10.6, 24.9)} delay={160} className="aspect-[1.17] lg:aspect-auto" />

            <Tile position={pos(69.4, 0, 12.8, 25.1)} delay={120} className="hidden lg:block" />
            <Photo
              name="networking-cena"
              position={pos(61.4, 26.4, 21, 28.6)}
              delay={80}
              className="order-1 col-span-2 aspect-[1.68] lg:order-none lg:aspect-auto"
            />
            <Photo name="rally-wide" position={pos(82.9, 33.8, 17.1, 21.1)} delay={200} className="order-last col-span-2 aspect-[1.85] lg:order-none lg:aspect-auto" />
            <Photo name="pista" position={pos(61.4, 56.4, 12.5, 25.9)} delay={160} className="aspect-[1.11] lg:aspect-auto" />
            <Tile position={pos(74.6, 56.4, 16.3, 18)} delay={240} className="aspect-[1.11] lg:aspect-auto" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 sm:pt-20 sm:pb-32 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {SERVICES.map((service, i) => (
            <Reveal
              key={service.title}
              delay={i * 120}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-lg shadow-mosaiko-navy/10"
            >
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-mosaiko-navy/55 via-mosaiko-navy/0 to-mosaiko-navy/0" />
              {/* Overlay scuro: su mobile al tocco, su desktop all'hover */}
              <div className="absolute inset-0 bg-mosaiko-navy/80 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100" />

              {/* Il titolo resta fisso; su desktop all'hover sotto compare l'elenco delle attività */}
              <div className="absolute inset-x-0 top-0 p-6 xl:p-8">
                <h3 className="font-heading text-3xl font-medium uppercase leading-tight tracking-[0.01em] text-white sm:text-xl lg:text-2xl xl:text-3xl">
                  {service.title}
                </h3>
                <ul className="mt-6 hidden space-y-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block xl:mt-8 xl:space-y-3.5">
                  {service.details.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-snug text-white/80 xl:text-base">
                      <span className="mt-[0.45em] h-2 w-2 shrink-0 rounded-[3px] bg-mosaiko-beige" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solo mobile/tablet: descrizione e pulsante che apre il popup */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-4 p-6 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 lg:hidden">
                <p className="text-sm leading-relaxed text-white/80">{service.text}</p>
                <Button
                  as="button"
                  type="button"
                  onClick={() => setOpenService(service)}
                  className="cursor-pointer px-5 py-2 text-xs"
                >
                  Scopri di più
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <ServiceModal service={openService} onClose={() => setOpenService(null)} />
    </section>
  )
}

export default GeneralInfo
