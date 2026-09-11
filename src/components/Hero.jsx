import Button from './Button'

function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-mosaiko-navy pt-28"
    >
      {/* Watermark mark + geometric accents */}
      <img
        src="/logo/mosaiko-mark-white.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-[130%] w-auto -translate-y-1/2 opacity-[0.06]"
      />
      <svg
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 text-mosaiko-gold opacity-20"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.6" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-mosaiko-gold/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-gold">
            Eventi · Business · Networking
          </span>

          <h1 className="mt-7 font-heading text-5xl font-medium leading-[1.1] text-white sm:text-6xl lg:text-7xl">
            Costruiamo connessioni che generano valore.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
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
