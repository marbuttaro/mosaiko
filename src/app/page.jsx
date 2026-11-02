import Hero from '../components/Hero'
import GeneralInfo from '../components/GeneralInfo'
import News from '../components/News'
import Team from '../components/Team'
import SponsorsStats, { ModelSection } from '../components/SponsorsStats'
import StickyLayer from '../components/StickyLayer'
import UpcomingEvents from '../components/UpcomingEvents'
import Location from '../components/Location'
import { DEFAULT_IMAGE, JsonLd, organizationJsonLd } from '../lib/site'

export const metadata = {
  // Stesso title della home WordPress, già indicizzato
  title: { absolute: "Mosaiko – Eventi – Business – Rete d'Impresa" },
  alternates: { canonical: '/' },
  openGraph: { images: [DEFAULT_IMAGE], url: '/' },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <Hero />
      <News />
      {/* Pannelli colorati che salgono sopra la sezione precedente */}
      <div>
        <StickyLayer id="chi-siamo" hold={60}>
          <GeneralInfo />
        </StickyLayer>
        <div className="relative z-10">
          <StickyLayer hold={30}>
            <ModelSection />
          </StickyLayer>
          <div id="team" className="relative z-10">
            <Team />
          </div>
        </div>
      </div>
      <SponsorsStats />
      <UpcomingEvents />
      <Location />
    </>
  )
}
