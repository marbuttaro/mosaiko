import { team } from '../data/content'
import Placeholder from './Placeholder'

function Team() {
  return (
    <section id="team" className="relative overflow-hidden bg-mosaiko-navy-2 py-24 sm:py-32">
      <svg
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-mosaiko-blue opacity-15"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.6" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-green">
            Il team
          </span>
          <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-white sm:text-5xl">
            Le persone dietro Mosaiko
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-6 rounded-2xl bg-white/[0.04] p-3 pr-8 ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
            >
              <Placeholder
                tone="cream"
                className="h-20 w-20 shrink-0 rounded-xl sm:h-24 sm:w-24"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-mosaiko-green">
                  {member.role}
                </p>
                <h3 className="mt-1 font-heading text-xl font-normal text-white">
                  {member.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
