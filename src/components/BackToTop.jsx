'use client'

import { useEffect, useState } from 'react'
import { scrollToTop } from '../lib/smoothScroll'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Torna su"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-xl border border-mosaiko-beige/50 bg-mosaiko-navy/70 text-mosaiko-blue-light shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-mosaiko-navy/90 sm:bottom-10 sm:right-8 sm:h-14 sm:w-14 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default BackToTop
