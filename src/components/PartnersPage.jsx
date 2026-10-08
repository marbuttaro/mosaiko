import { useEffect } from 'react'
import { partnerGroups } from '../data/content'
import ContactForm from './ContactForm'
import PartnerLogo from './PartnerLogo'
import Reveal from './Reveal'
import SplitText from './SplitText'

// Gerarchia: i loghi si riducono scendendo di categoria
const GROUP_STYLES = {
  partner: { scale: 6.5, cell: 'h-28 sm:h-36' },
  sponsor: { scale: 5, cell: 'h-24 sm:h-28' },
  collaborazioni: { scale: 4, cell: 'h-20 sm:h-24' },
}

// Blocco di una categoria: linea sopra, titolo a sinistra, loghi a destra
function PartnerGroup({ group, dark = false }) {
  const style = GROUP_STYLES[group.id]

  return (
    <div
      id={group.id}
      className={`grid scroll-mt-28 gap-10 border-t pt-10 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:pt-12 ${
        // sulla fascia scura la linea chiude anche il fondo
        dark ? 'border-b border-white/10 pb-10 lg:pb-12' : 'border-mosaiko-navy/10'
      }`}
    >
      <SplitText
        text={group.title}
        className={`font-heading text-2xl font-medium uppercase leading-tight tracking-[0.01em] sm:text-3xl ${
          dark ? 'text-white' : 'text-mosaiko-navy'
        }`}
      />

      <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {group.items.map((item, i) => (
          <Reveal
            as="li"
            key={item.name}
            delay={(i % 3) * 80}
            className={`flex items-center justify-center ${style.cell}`}
          >
            {/* Su sfondo scuro i loghi diventano bianchi */}
            <PartnerLogo {...item} scale={style.scale} className={dark ? 'opacity-75 brightness-0 invert' : ''} />
          </Reveal>
        ))}
      </ul>
    </div>
  )
}

// Pagina /partner: intro, poi un blocco per categoria (titolo a sinistra, loghi a destra) e form in fondo
function PartnersPage() {
  useEffect(() => {
    document.title = 'Partner e sponsor — Mosaiko'
  }, [])

  return (
    <>
      <section className="bg-mosaiko-sand pb-12 pt-40 sm:pb-16 sm:pt-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal
            as="span"
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige"
          >
            Partner e sponsor
          </Reveal>
          <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
            <SplitText
              as="h1"
              text="Una rete in movimento"
              className="font-heading text-4xl font-medium uppercase leading-tight tracking-[0.01em] text-mosaiko-navy sm:text-5xl"
            />
            {/* Testo segnaposto */}
            <Reveal as="p" delay={150} className="text-base leading-relaxed text-mosaiko-ink sm:text-lg">
              Mosaiko cresce insieme a una rete di aziende, istituzioni e realtà del
              territorio che condividono la nostra visione: creare occasioni concrete
              di incontro, visibilità e business. Partner, sponsor e collaborazioni
              sono le tessere che, insieme, compongono il nostro mosaico.
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-mosaiko-sand pb-20 pt-4 sm:pb-28">
        <div className="mx-auto max-w-7xl space-y-20 px-6 sm:space-y-28 lg:px-10">
          {partnerGroups
            .filter((group) => group.id !== 'collaborazioni')
            .map((group) => (
              <PartnerGroup key={group.id} group={group} />
            ))}
        </div>
      </section>

      {/* Le collaborazioni su una fascia scura a tutta larghezza */}
      <section className="bg-mosaiko-navy-2 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <PartnerGroup group={partnerGroups.find((group) => group.id === 'collaborazioni')} dark />
        </div>
      </section>

      <ContactForm />
    </>
  )
}

export default PartnersPage
