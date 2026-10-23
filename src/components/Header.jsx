import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import Button from './Button'
import { homeHref, isHome, isPartnerPage } from '../lib/route'

// Sfondi chiari delle sezioni: sopra di questi logo e bottone passano alla versione scura
const LIGHT_BGS = ['bg-mosaiko-sand', 'bg-mosaiko-mist']

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [onLight, setOnLight] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      // Logo navy quando l'header passa sopra una sezione chiara
      const section = document
        .elementsFromPoint(40, 40)
        .find((el) => el.matches('section, footer'))
      setOnLight(LIGHT_BGS.some((bg) => section?.classList.contains(bg)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Nella pagina partner il form è in fondo alla pagina stessa
  const contactHref = isPartnerPage ? '#contatti' : homeHref('#dove-siamo')

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
        <a href={isHome ? '#top' : '/'} className="shrink-0">
          <img
            src={onLight ? '/logo/mosaiko-mark-navy.png' : '/logo/mosaiko-mark-white.png'}
            alt="Mosaiko"
            className="h-11 w-auto"
          />
        </a>

        <nav
          className={`hidden items-center gap-1 rounded-xl border px-2 py-2 backdrop-blur-md transition-colors duration-300 lg:flex ${
            scrolled || onLight
              ? 'border-white/10 bg-mosaiko-navy/90 shadow-lg shadow-black/20'
              : 'border-white/15 bg-mosaiko-navy/40'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={homeHref(link.href)}
              className="rounded-lg px-5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button href={contactHref} variant={onLight ? 'navy' : 'primary'} className="max-lg:hidden">
          Contattaci
        </Button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-mosaiko-navy/60 text-white backdrop-blur-md lg:hidden"
          aria-label="Apri il menu"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="mx-6 mt-3 rounded-2xl border border-white/10 bg-mosaiko-navy/95 px-6 py-6 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={homeHref(link.href)}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium text-white/85 hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
            <Button href={contactHref} onClick={() => setOpen(false)} className="mt-3 w-full">
              Contattaci
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
