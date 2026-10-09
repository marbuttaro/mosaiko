import { model, partnerGroups, stats } from '../data/content'
import Button from './Button'
import CountUp from './CountUp'
import PartnerLogo from './PartnerLogo'
import Reveal from './Reveal'
import SplitText from './SplitText'

export function ModelSection() {
  return (
    <section className="relative overflow-hidden bg-mosaiko-navy rounded-t-[2rem] shadow-[0_-24px_60px_-28px_rgba(14,26,43,0.45)] sm:rounded-t-[2.5rem] py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal
          as="span"
          className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige"
        >
          {model.eyebrow}
        </Reveal>
        <SplitText
          text={model.heading}
          className="mt-4 font-heading uppercase tracking-[0.01em] text-3xl font-medium leading-tight text-white sm:text-4xl"
        />

        {/* Testo a sinistra e numeri a destra; la linea sta solo sopra i numeri */}
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-6 lg:pt-[calc(2.5rem+1px)]">
            {model.paragraphs.map((paragraph, i) => (
              <Reveal
                as="p"
                key={i}
                delay={i * 120}
                className={`text-base leading-relaxed ${
                  i === 0 ? 'text-white/85 sm:text-lg' : 'text-white/55'
                }`}
              >
                {paragraph}
              </Reveal>
            ))}
          </div>

          <dl className="grid grid-cols-2 content-start max-lg:text-center gap-x-8 gap-y-10 border-t border-white/10 pt-10 lg:w-full lg:max-w-md lg:justify-self-end">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <dt className="font-heading text-5xl font-semibold tracking-tight text-mosaiko-beige sm:text-6xl">
                  <CountUp to={Number(stat.value)} />
                </dt>
                <dd className="mt-2 text-sm font-medium uppercase tracking-[0.1em] text-white/60">
                  {stat.label}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

// Righe dell'anteprima in home: etichetta a sinistra, loghi a destra
function LogoRow({ label, children }) {
  return (
    <div className="grid gap-8 border-t border-mosaiko-navy/10 py-10 sm:py-12 lg:grid-cols-[12rem_1fr] lg:items-center lg:gap-12">
      <h3 className="font-heading text-sm font-medium uppercase tracking-[0.1em] text-mosaiko-navy sm:text-base">
        {label}
      </h3>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

// Nastro di loghi in loop: la lista è duplicata e scorre di metà della sua larghezza
function LogoMarquee({ items }) {
  return (
    <div className="logo-marquee overflow-hidden">
      <div className="logo-marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li key={item.name} className="px-7 sm:px-10">
                <PartnerLogo {...item} scale={5.5} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

function SponsorsStats() {
  const [partners, sponsors] = partnerGroups

  return (
    <section id="sponsor" className="bg-mosaiko-sand py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <Reveal
            as="span"
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige"
          >
            Partner
          </Reveal>
          <SplitText
            text="Il nostro mosaico"
            className="mt-4 font-heading uppercase tracking-[0.01em] text-3xl font-medium leading-tight text-mosaiko-navy sm:text-4xl"
          />
        </div>

        <Reveal className="mt-12 border-b border-mosaiko-navy/10">
          <LogoRow label="Partner">
            <LogoMarquee items={partners.items} />
          </LogoRow>
          <LogoRow label="Sponsor">
            <ul className="grid grid-cols-3 items-center gap-6">
              {sponsors.items.map((item) => (
                <li key={item.name} className="flex justify-center">
                  <PartnerLogo {...item} scale={4.5} />
                </li>
              ))}
            </ul>
          </LogoRow>
        </Reveal>

        <Reveal delay={150} className="mt-12 flex justify-center">
          <Button href="/partner" variant="navy">Vedi tutti i partner</Button>
        </Reveal>
      </div>
    </section>
  )
}

export default SponsorsStats
