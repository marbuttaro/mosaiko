import { sponsors } from '../data/content'
import Reveal from './Reveal'

// Griglia completa degli sponsor: non usata in home, servirà nella pagina partner e sponsor
function SponsorsGrid({ items = sponsors, className = '' }) {
  return (
    <Reveal
      className={`grid grid-cols-2 divide-x divide-y divide-mosaiko-navy/10 overflow-hidden rounded-2xl border border-mosaiko-navy/10 bg-mosaiko-navy/5 shadow-sm sm:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {items.map((sponsor) => (
        <div
          key={sponsor}
          className="group flex items-center justify-center px-6 py-12 text-center transition-colors duration-300 hover:bg-white"
        >
          <span className="font-heading text-lg font-medium tracking-wide text-mosaiko-navy opacity-35 transition-opacity duration-300 group-hover:opacity-100">
            {sponsor}
          </span>
        </div>
      ))}
    </Reveal>
  )
}

export default SponsorsGrid
