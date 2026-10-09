import { team } from '../data/content'
import Reveal from './Reveal'
import SplitText from './SplitText'

function Team() {
  return (
    <section className="relative overflow-hidden bg-mosaiko-navy-2 rounded-t-[2rem] shadow-[0_-24px_60px_-28px_rgba(14,26,43,0.45)] sm:rounded-t-[2.5rem] py-24 sm:py-32">
      <svg
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-mosaiko-blue opacity-15"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.6" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <Reveal
            as="span"
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige"
          >
            Il team
          </Reveal>
          <SplitText
            text="Le persone dietro Mosaiko"
            className="mt-4 font-heading uppercase tracking-[0.01em] text-3xl font-medium leading-tight text-white sm:text-4xl"
          />
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {team.map((member, i) => (
            <Reveal
              key={member.name}
              delay={(i % 2) * 120}
              className="flex items-start gap-6 rounded-2xl sm:items-center bg-white/[0.04] p-5 pr-8 ring-1 ring-white/10 transition-colors hover:bg-white/[0.07] sm:p-6"
            >
              <img
                src={member.photo}
                alt={member.name}
                width="400"
                height="400"
                loading="lazy"
                className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
              />
              <div>
                <h3 className="font-heading text-[1.375rem] font-normal text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-normal uppercase tracking-[0.15em] text-mosaiko-beige">
                  {member.role}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {member.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
