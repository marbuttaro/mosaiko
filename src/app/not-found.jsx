import Button from '../components/Button'

export const metadata = { title: 'Pagina non trovata' }

export default function NotFound() {
  return (
    <section className="bg-mosaiko-sand pb-24 pt-40 sm:pt-48">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
        <h1 className="font-heading text-3xl font-medium uppercase text-mosaiko-navy sm:text-4xl">Pagina non trovata</h1>
        <p className="mt-4 text-mosaiko-ink">La pagina che cerchi non esiste o è stata spostata.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="navy">Torna alla home</Button>
          <Button href="/news/" variant="navy">Tutte le news</Button>
        </div>
      </div>
    </section>
  )
}
