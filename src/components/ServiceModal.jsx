'use client'

import { useEffect, useRef } from 'react'
import { startScroll, stopScroll } from '../lib/smoothScroll'

// Popup con il dettaglio di un servizio. <dialog> nativo: Esc chiude, il focus resta
// dentro il popup e il resto della pagina non è interattivo finché è aperto.
function ServiceModal({ service, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!service) return
    dialog.showModal()
    stopScroll()
    return () => {
      dialog.close()
      startScroll()
    }
  }, [service])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="service-modal-title"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // clic sullo sfondo scuro (fuori dal pannello) = chiudi
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="service-modal m-auto w-[calc(100%-2rem)] max-w-lg overflow-visible bg-transparent p-0 backdrop:bg-mosaiko-navy/75 backdrop:backdrop-blur-sm"
    >
      {service && (
        <div className="relative overflow-hidden rounded-2xl bg-mosaiko-navy-2 p-8 text-white shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:p-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige">
            I nostri servizi
          </span>
          <h3
            id="service-modal-title"
            className="mt-3 pr-10 font-heading text-3xl font-medium uppercase leading-tight tracking-[0.01em] sm:text-4xl"
          >
            {service.title}
          </h3>

          <ul className="mt-8 space-y-3.5">
            {service.details.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base leading-snug text-white/80">
                <span className="mt-[0.45em] h-2 w-2 shrink-0 rounded-[3px] bg-mosaiko-beige" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  )
}

export default ServiceModal
