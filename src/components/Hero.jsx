'use client'

import { useEffect, useRef } from 'react'
import Button from './Button'
import Reveal from './Reveal'
import SplitText from './SplitText'

function Hero() {
  const parallaxRef = useRef(null)

  // Leggera parallasse della foto mentre la hero esce dallo schermo
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight)
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0)`
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden bg-mosaiko-navy pt-24"
    >
      {/* full-bleed photo */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        <img
          src="/images/hero-networking.jpg"
          alt="Persone che fanno networking durante un evento Mosaiko"
          className="hero-image h-full w-full object-cover"
        />
      </div>

      {/* legibility scrim */}
      <div className="absolute inset-0 bg-gradient-to-r from-mosaiko-navy via-mosaiko-navy/85 to-mosaiko-navy/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-mosaiko-navy/70 via-transparent to-mosaiko-navy/50" />

      {/* geometric gradient shards, over the photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(38% 0%, 74% 0%, 48% 100%, 12% 100%)',
          background: 'linear-gradient(135deg, rgba(21,40,65,0.9) 0%, rgba(21,40,65,0.05) 75%)',
          mixBlendMode: 'multiply',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(58% 0%, 92% 0%, 78% 100%, 44% 100%)',
          background: 'linear-gradient(150deg, rgba(134,177,238,0.6) 0%, rgba(12,99,221,0) 70%)',
          mixBlendMode: 'overlay',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(80% 0%, 100% 0%, 100% 55%, 88% 100%, 66% 100%)',
          background: 'linear-gradient(160deg, rgba(12,99,221,0.65) 0%, rgba(12,99,221,0) 65%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* vertical eyebrow label */}
      <span
        className="pointer-events-none absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rotate-180 text-xs font-semibold uppercase tracking-[0.3em] text-white/45 lg:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        Events · Networking · Business
      </span>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="max-w-xl lg:pl-8">
          <Reveal
            as="span"
            className="inline-flex items-center rounded-lg border border-mosaiko-beige/40 bg-mosaiko-beige/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige"
          >
            Mosaiko Enterprise
          </Reveal>

          <SplitText
            as="h1"
            text="Dove le relazioni diventano valore."
            delay={150}
            stagger={70}
            className="mt-7 font-heading uppercase text-4xl font-semibold leading-[1.05] tracking-[0.01em] text-white sm:text-5xl lg:w-[44rem] lg:text-[3.5rem]"
          />

          <Reveal as="p" delay={500} className="mt-6 max-w-md text-[0.9375rem] font-light leading-relaxed text-white/70 sm:text-base">
            Mosaiko progetta e sviluppa eventi, esperienze di hospitality e
            occasioni di networking capaci di connettere aziende, istituzioni,
            professionisti e territori.
          </Reveal>
          <Reveal as="p" delay={600} className="mt-4 max-w-md text-[0.9375rem] font-light leading-relaxed text-white/70 sm:text-base">
            Creiamo occasioni in cui essere insieme genera visibilità, relazioni
            e nuove opportunità.
          </Reveal>

          <Reveal delay={700} className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#eventi" variant="primary">
              Scopri i prossimi eventi
            </Button>
            <Button href="#chi-siamo" variant="outline">
              Chi siamo
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Hero
