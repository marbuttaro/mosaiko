import { location } from '../data/content'

// Dominio definitivo: canonical, sitemap e Open Graph puntano sempre qui, anche sulle anteprime
export const SITE_URL = 'https://www.mosaiko.org'
export const SITE_NAME = 'Mosaiko'
export const DEFAULT_DESCRIPTION =
  "Mosaiko Enterprise: eventi, business e networking a Napoli. Creiamo occasioni concrete di incontro tra persone, imprese e territori."
export const DEFAULT_IMAGE = '/images/hero-networking.jpg'

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: location.company,
  alternateName: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo/mosaiko-lockup-navy.png`,
  email: location.email,
  telephone: location.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via Agnano Astroni 30',
    addressLocality: 'Napoli',
    addressCountry: 'IT',
  },
}

// Script JSON-LD sicuro da inserire nell'HTML
export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
