import Button from './Button'

function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-mosaiko-navy pt-24"
    >
      {/* full-bleed photo */}
      <img
        src="/images/hero-networking.jpg"
        alt="Persone che fanno networking durante un evento Mosaiko"
        className="absolute inset-0 h-full w-full object-cover"
      />

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
          background: 'linear-gradient(150deg, rgba(141,170,220,0.6) 0%, rgba(26,84,184,0) 70%)',
          mixBlendMode: 'overlay',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          clipPath: 'polygon(80% 0%, 100% 0%, 100% 55%, 88% 100%, 66% 100%)',
          background: 'linear-gradient(160deg, rgba(26,84,184,0.65) 0%, rgba(26,84,184,0) 65%)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* vertical eyebrow label */}
      <span
        className="pointer-events-none absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.3em] text-white/45 lg:block"
        style={{ writingMode: 'vertical-rl' }}
      >
        Eventi · Business · Networking
      </span>

      <span className="absolute bottom-10 right-8 z-10 hidden h-14 w-14 items-center justify-center rounded-xl border border-mosaiko-green/50 bg-mosaiko-navy/70 shadow-lg backdrop-blur-sm sm:flex">
        <span className="h-2.5 w-2.5 rounded-full bg-mosaiko-green" />
      </span>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="max-w-xl lg:pl-8">
          <span className="inline-flex items-center rounded-lg border border-mosaiko-green/40 bg-mosaiko-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-green">
            Mosaiko Enterprise
          </span>

          <h1 className="mt-7 font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[3.75rem]">
            Costruiamo connessioni che generano valore.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            Mosaiko progetta eventi, esperienze di networking e occasioni di
            business che uniscono persone, imprese e territori — trasformando
            ogni incontro in un'opportunità concreta di crescita.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#eventi" variant="primary">
              Scopri i prossimi eventi
            </Button>
            <Button href="#chi-siamo" variant="outline">
              Chi siamo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
