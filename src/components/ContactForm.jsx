'use client'

import { location } from '../data/content'
import Button from './Button'
import Reveal from './Reveal'
import SplitText from './SplitText'

const FIELDS = [
  { name: 'nome', label: 'Nome e cognome', type: 'text', autoComplete: 'name', required: true },
  { name: 'azienda', label: 'Azienda', type: 'text', autoComplete: 'organization' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { name: 'telefono', label: 'Telefono', type: 'tel', autoComplete: 'tel' },
]

const inputClass =
  'mt-2 w-full rounded-lg border border-mosaiko-navy/15 bg-white px-4 py-3 text-base text-mosaiko-navy outline-none transition-colors placeholder:text-mosaiko-navy/35 focus:border-mosaiko-blue focus:ring-2 focus:ring-mosaiko-blue/15'

const labelClass = 'text-xs font-semibold uppercase tracking-[0.12em] text-mosaiko-navy/70'

// Form di contatto: per ora apre il client email con il messaggio già compilato
// TODO: collegare a un servizio di invio (es. Formspree o un endpoint dedicato)
function ContactForm() {
  const onSubmit = (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const body = [
      `Nome: ${data.nome}`,
      data.azienda && `Azienda: ${data.azienda}`,
      `Email: ${data.email}`,
      data.telefono && `Telefono: ${data.telefono}`,
      '',
      data.messaggio,
    ]
      .filter((line) => line !== undefined && line !== '')
      .join('\n')
    const subject = `Richiesta di contatto — ${data.azienda || data.nome}`
    window.location.href = `mailto:${location.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="contatti" className="scroll-mt-24 bg-mosaiko-sand py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Da mobile testo e form sono due blocchi separati, da desktop un unico riquadro */}
        <Reveal className="grid gap-3 lg:grid-cols-[2fr_3fr] lg:gap-0 lg:overflow-hidden lg:rounded-2xl lg:shadow-xl lg:shadow-mosaiko-navy/10">
          <div className="flex flex-col gap-8 bg-mosaiko-navy-2 p-8 text-white max-lg:rounded-2xl max-lg:shadow-xl max-lg:shadow-mosaiko-navy/10 sm:p-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mosaiko-beige">
                Contatti
              </span>
              <SplitText
                text="Entra nel Mosaiko"
                className="mt-4 font-heading text-3xl font-medium uppercase leading-tight tracking-[0.01em] text-white sm:text-4xl"
              />
              <p className="mt-6 text-base leading-relaxed text-white/70">
                Vuoi diventare partner, sostenere un evento o proporci una
                collaborazione? Raccontaci il tuo progetto: ti ricontatteremo
                al più presto.
              </p>
            </div>

            <div className="mt-auto space-y-5 border-t border-white/10 pt-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">Email</p>
                <a href={`mailto:${location.email}`} className="mt-1 block font-medium hover:underline">
                  {location.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">Telefono</p>
                <a href={`tel:${location.phone}`} className="mt-1 block font-medium hover:underline">
                  {location.phone}
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="bg-white/60 p-8 max-lg:rounded-2xl max-lg:shadow-xl max-lg:shadow-mosaiko-navy/10 sm:p-12">
            <div className="grid gap-6 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <label key={field.name} className="block">
                  <span className={labelClass}>
                    {field.label}
                    {field.required && <span className="text-mosaiko-beige"> *</span>}
                  </span>
                  <input
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    required={field.required}
                    className={inputClass}
                  />
                </label>
              ))}
            </div>

            <label className="mt-6 block">
              <span className={labelClass}>
                Messaggio<span className="text-mosaiko-beige"> *</span>
              </span>
              <textarea name="messaggio" rows={5} required className={`${inputClass} resize-y`} />
            </label>

            <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-mosaiko-ink">
              <input type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-mosaiko-navy" />
              <span>Acconsento al trattamento dei dati personali per essere ricontattato.</span>
            </label>

            <Button as="button" type="submit" variant="navy" className="mt-8 w-full sm:w-auto">
              Invia messaggio
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default ContactForm
