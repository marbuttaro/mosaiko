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

const PILOT = { l: 19.8, t: 21.9, w: 28.7, h: 51.7 }

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
        className={`mt-4 font-heading uppercase tracking-[0.01em] text-3xl font-medium leading-tight sm:text-4xl lg:mt-[0.5cqw] lg:max-w-[50cqw] lg:text-[5.8cqw] lg:font-semibold lg:leading-[1.05] ${
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
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-10">
        <div className="@container grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:relative lg:block lg:aspect-[1252/718]">
          <div className={`col-span-2 ${PIECE} lg:z-10`} style={pos(0, 1)}>
            <TitleBlock />
          </div>
          {/* Copia bianca del titolo, visibile solo dove passa sopra la foto del pilota */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
            style={{ clipPath: `inset(${PILOT.t}% ${100 - PILOT.l - PILOT.w}% ${100 - PILOT.t - PILOT.h}% ${PILOT.l}% round 0.5rem)` }}
          >
            <div className={PIECE} style={pos(0, 1)}>
              <TitleBlock light />
            </div>
          </div>

          <Tile position={pos(0.3, 33.8, 18.3, 20.5)} className="hidden lg:block" />
          <Reveal as="p" delay={150} className={`col-span-2 mb-6 ${BODY} ${PIECE} lg:mb-0`} style={pos(0.5, 57.8, 17.6)}>
            Mosaiko nasce da una convinzione semplice: il valore più importante
            di ogni progetto sono{' '}
            <strong className="font-semibold text-mosaiko-navy">le relazioni che riesce a generare.</strong>
          </Reveal>

          <Photo name="pilota" position={pos(PILOT.l, PILOT.t, PILOT.w, PILOT.h)} className="col-span-2 aspect-[1.17] lg:aspect-auto" />
          <Tile position={pos(22.6, 74.8, 11.2, 21)} delay={80} className="aspect-[1.17] lg:aspect-auto" />
          <Photo name="networking" position={pos(34.6, 74.8, 13.9, 24.9)} delay={160} className="aspect-[1.17] lg:aspect-auto" />

          <Tile position={pos(59.8, 0, 16.9, 25.1)} delay={120} className="hidden lg:block" />
          <Photo
            name="networking-cena"
            position={pos(49.3, 26.5, 27.6, 28.6)}
            delay={80}
            className="order-1 col-span-2 aspect-[1.68] lg:order-none lg:aspect-auto"
          />
          <Photo name="rally-wide" position={pos(77.6, 33.8, 22.4, 21)} delay={200} className="order-last col-span-2 aspect-[1.85] lg:order-none lg:aspect-auto" />
          <Photo name="pista" position={pos(49.3, 56.4, 16.5, 25.9)} delay={160} className="aspect-[1.11] lg:aspect-auto" />
          <Tile position={pos(66.6, 56.4, 21.4, 18)} delay={240} className="aspect-[1.11] lg:aspect-auto" />

          <Reveal as="p" delay={250} className={`order-last col-span-2 mt-6 ${BODY} ${PIECE} lg:mt-0`} style={pos(66.9, 77, 20.9)}>
            Eventi, hospitality e networking non rappresentano attività
            separate, ma parti di un unico modello. Costruiamo progetti in cui
            organizzazione, esperienza e relazioni lavorano insieme per{' '}
            <strong className="font-semibold text-mosaiko-navy">creare valore per aziende, partner e stakeholder.</strong>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-4 sm:mt-28 lg:mt-36 sm:grid-cols-3 sm:gap-6">
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
              <span className="absolute left-5 top-5 font-heading text-xl font-medium text-white sm:text-2xl">
                {service.title}
              </span>

              <div className="absolute inset-0 flex flex-col items-start justify-end gap-4 bg-mosaiko-navy/80 p-6 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
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
