import Header from './components/Header'
import Hero from './components/Hero'
import GeneralInfo from './components/GeneralInfo'
import Team from './components/Team'
import SponsorsStats from './components/SponsorsStats'
import UpcomingEvents from './components/UpcomingEvents'
import Location from './components/Location'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-mosaiko-sand">
      <Header />
      <main>
        <Hero />
        <GeneralInfo />
        <Team />
        <SponsorsStats />
        <UpcomingEvents />
        <Location />
      </main>
      <Footer />
    </div>
  )
}

export default App
