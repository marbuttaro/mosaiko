'use client'

import { useEffect } from 'react'
import { initSmoothScroll } from '../lib/smoothScroll'

// Effetti solo browser: scroll morbido e ancora iniziale (es. /#team arrivando da un'altra pagina)
function ClientEffects() {
  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    const target = window.location.hash && document.querySelector(window.location.hash)
    if (target) requestAnimationFrame(() => target.scrollIntoView())
  }, [])

  return null
}

export default ClientEffects
