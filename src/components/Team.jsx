import { team } from '../data/content'
import Placeholder from './Placeholder'

function Team() {
  return (
    <section id="team" className="bg-mosaiko-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-gold-dark">
            Il team
          </span>
          <h2 className="mt-4 font-heading text-4xl font-medium leading-tight text-mosaiko-navy sm:text-5xl">
            Le persone dietro Mosaiko
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {team.map((member) => (
            <div key={member.name}>
              <Placeholder tone="navy" className="aspect-square w-full rounded-2xl" />
              <h3 className="mt-4 font-heading text-lg font-medium text-mosaiko-navy">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-mosaiko-ink">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
