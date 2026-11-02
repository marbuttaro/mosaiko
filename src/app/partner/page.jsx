import PartnersPage from '../../components/PartnersPage'
import { DEFAULT_IMAGE } from '../../lib/site'

export const metadata = {
  title: 'Partner e sponsor',
  description: 'Partner, sponsor e collaborazioni di Mosaiko Enterprise: la rete di imprese che rende possibili i nostri eventi e progetti.',
  alternates: { canonical: '/partner/' },
  openGraph: { images: [DEFAULT_IMAGE], url: '/partner/', title: 'Partner e sponsor – Mosaiko' },
}

export default function Page() {
  return <PartnersPage />
}
