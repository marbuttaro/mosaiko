import { location, navLinks } from '../data/content'

const SOCIALS = [
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <path
        d="M6.94 8.5H4V20h2.94V8.5ZM5.47 7.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM20 20v-6.4c0-3.06-1.63-4.48-3.8-4.48-1.75 0-2.53.96-2.97 1.64V8.5H10.3c.04.85 0 12 0 12h2.94v-6.7c0-.36.03-.72.13-.98.29-.72.94-1.47 2.04-1.47 1.44 0 2.02 1.1 2.02 2.7V20H20Z"
        fill="currentColor"
      />
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <path
        d="M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm0-1.8a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm6.4-.2a1.17 1.17 0 1 1-2.33 0 1.17 1.17 0 0 1 2.33 0ZM12 4.6c-2.05 0-2.3.008-3.11.045-.81.037-1.36.166-1.85.354a3.73 3.73 0 0 0-1.35.878 3.73 3.73 0 0 0-.878 1.35c-.188.49-.317 1.04-.354 1.85C4.408 9.7 4.4 9.95 4.4 12s.008 2.3.045 3.11c.037.81.166 1.36.354 1.85.19.49.45.9.878 1.35.44.44.86.7 1.35.878.49.188 1.04.317 1.85.354.81.037 1.06.045 3.11.045s2.3-.008 3.11-.045c.81-.037 1.36-.166 1.85-.354a3.73 3.73 0 0 0 1.35-.878c.44-.44.7-.86.878-1.35.188-.49.317-1.04.354-1.85.037-.81.045-1.06.045-3.11s-.008-2.3-.045-3.11c-.037-.81-.166-1.36-.354-1.85a3.73 3.73 0 0 0-.878-1.35 3.73 3.73 0 0 0-1.35-.878c-.49-.188-1.04-.317-1.85-.354C14.3 4.608 14.05 4.6 12 4.6Z"
        fill="currentColor"
      />
    ),
  },
]

function SectionLabel({ children }) {
  return (
    <h3 className="inline-flex rounded-lg border border-white/15 px-5 py-2 text-sm font-semibold text-white">
      {children}
    </h3>
  )
}

function Footer() {
  const half = Math.ceil(navLinks.length / 2)

  return (
    <footer className="bg-mosaiko-navy pb-10 pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <img src="/logo/mosaiko-lockup-white.png" alt="Mosaiko" className="h-7 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Eventi, business e networking: creiamo occasioni concrete di
              incontro tra persone, imprese e territori.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-mosaiko-green hover:text-mosaiko-green"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Naviga</SectionLabel>
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
              <ul className="space-y-3">
                {navLinks.slice(0, half).map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-white/70 hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {navLinks.slice(half).map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-white/70 hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <SectionLabel>Newsletter</SectionLabel>
            <p className="mt-6 text-sm leading-relaxed text-white/60">
              Iscriviti per ricevere gli aggiornamenti sui prossimi eventi e
              le novità di Mosaiko.
            </p>
            <form className="mt-5 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="La tua email"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-mosaiko-green focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mosaiko-green text-mosaiko-navy transition-colors hover:bg-mosaiko-green-light"
                aria-label="Iscriviti"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div>
            <SectionLabel>Contatti</SectionLabel>
            <ul className="mt-6 space-y-4 text-sm text-white/70">
              <li>
                <a href={`mailto:${location.email}`} className="hover:text-white">
                  {location.email}
                </a>
              </li>
              <li>{location.address}</li>
              <li>
                <a href={`tel:${location.phone}`} className="hover:text-white">
                  {location.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-xl bg-white/5 px-6 py-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Mosaiko. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
