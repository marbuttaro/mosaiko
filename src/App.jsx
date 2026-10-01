import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import GeneralInfo from './components/GeneralInfo'
import News from './components/News'
import Team from './components/Team'
import SponsorsStats, { ModelSection } from './components/SponsorsStats'
import StickyLayer from './components/StickyLayer'
import UpcomingEvents from './components/UpcomingEvents'
import Location from './components/Location'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import { initSmoothScroll } from './lib/smoothScroll'

function App() {
  useEffect(() => initSmoothScroll(), [])

  return (
    <div className="min-h-screen bg-mosaiko-sand">
      <Header />
      <main>
        <Hero />
        <News />
        {/* Pannelli colorati che salgono sopra la sezione precedente */}
        <div>
          <StickyLayer id="chi-siamo">
            <GeneralInfo />
          </StickyLayer>
          <div className="relative z-10">
            <StickyLayer>
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
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
