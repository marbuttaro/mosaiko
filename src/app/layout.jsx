import { Plus_Jakarta_Sans } from 'next/font/google'
import '../index.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import ClientEffects from '../components/ClientEffects'
import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, SITE_NAME, SITE_URL } from '../lib/site'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-jakarta' })

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} – Eventi – Business – Rete d'Impresa`, template: `%s – ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, locale: 'it_IT', type: 'website', images: [DEFAULT_IMAGE] },
  twitter: { card: 'summary_large_image' },
  alternates: { types: { 'application/rss+xml': `${SITE_URL}/feed/` } },
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={jakarta.variable}>
      <body>
        <div className="min-h-screen bg-mosaiko-sand">
          <ClientEffects />
          <Header />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </div>
      </body>
    </html>
  )
}
