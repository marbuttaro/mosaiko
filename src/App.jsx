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
import PartnersPage from './components/PartnersPage'
import { isPartnerPage } from './lib/route'
import { initSmoothScroll } from './lib/smoothScroll'

function App() {
  useEffect(() => initSmoothScroll(), [])

  // Arrivando da un'altra pagina con un'ancora (es. /#team) la sezione esiste solo dopo il render
  useEffect(() => {
    const target = window.location.hash && document.querySelector(window.location.hash)
    if (target) requestAnimationFrame(() => target.scrollIntoView())
  }, [])

  return (
    <div className="min-h-screen bg-mosaiko-sand">
      <Header />
      <main>
        {isPartnerPage ? (
          <PartnersPage />
        ) : (
          <>
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
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
