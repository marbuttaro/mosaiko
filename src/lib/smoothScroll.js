import Lenis from 'lenis'

let lenis = null

// Scroll morbido (Lenis), disattivato se l'utente preferisce meno animazioni
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  lenis = new Lenis({ duration: 1.1, anchors: true, autoRaf: true })
  return () => {
    lenis.destroy()
    lenis = null
  }
}

// Blocca/sblocca lo scroll della pagina (es. mentre è aperto un popup)
export function stopScroll() {
  lenis?.stop()
}

export function startScroll() {
  lenis?.start()
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
