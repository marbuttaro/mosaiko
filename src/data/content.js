export const navLinks = [
  { label: 'Chi siamo', href: '#chi-siamo' },
  { label: 'Team', href: '#team' },
  { label: 'Partner', href: '/partner' },
  { label: 'Eventi', href: '#eventi' },
  { label: 'News', href: '/news' },
  { label: 'Dove siamo', href: '#dove-siamo' },
]

export const model = {
  eyebrow: 'Il nostro modello',
  heading: 'Eventi e Networking',
  paragraphs: [
    'Progettiamo e realizziamo eventi capaci di trasformarsi in occasioni concrete di incontro, visibilità e business.',
    'Le nostre iniziative diventano occasioni in cui connettere aziende, professionisti, partner e stakeholder, creando relazioni e nuove opportunità di collaborazione. Attraverso i nostri progetti offriamo inoltre alle aziende opportunità di visibilità, posizionamento e presenza qualificata all’interno di eventi, partnership, sponsorship e contesti ad alto valore relazionale.',
    'Per Mosaiko, ogni evento è uno strumento per incontrare le persone giuste, rafforzare il proprio brand e generare nuove opportunità.',
  ],
}

export const stats = [
  { value: '140', label: 'Eventi' },
  { value: '7', label: 'Attività' },
  { value: '16', label: 'Partner' },
  { value: '999', label: 'Progetti' },
]

// Loghi monocromatici in /public/images/partner; ratio = larghezza/altezza, serve a bilanciarne le dimensioni.
// In home vanno solo partner e sponsor, nella pagina /partner anche le collaborazioni.
const logo = (name, file, ratio) => ({ name, logo: `/images/partner/${file}.png`, ratio })

export const partnerGroups = [
  {
    id: 'partner',
    title: 'Partner',
    items: [
      logo('Bey Studio', 'bey-studio', 2.646),
      logo('Sport Media House', 'sport-media-house', 2.158),
      logo('QMS', 'qms', 0.919),
      logo('Luema', 'luema', 3.373),
      logo('Maxima Holding', 'maxima', 4.569),
      logo('Arda Consulting', 'arda-consulting', 2.75),
    ],
  },
  {
    id: 'sponsor',
    title: 'Sponsor',
    items: [
      logo('Energia Sociale', 'energia-sociale', 5.521),
      logo('Clima Convenienza', 'clima-convenienza', 0.986),
      logo('Strega', 'strega', 1),
    ],
  },
  {
    id: 'collaborazioni',
    title: 'Collaborazioni',
    items: [
      logo('Città della Scienza', 'citta-della-scienza', 1.308),
      logo('Ippodromo di Agnano', 'ippodromo-agnano', 1.297),
      logo('Circolo Nautico Posillipo', 'circolo-posillipo', 1.119),
      logo('PalaDennerlein', 'paladennerlein', 1.87),
      logo('Radio Kiss Kiss', 'radio-kiss-kiss', 1.317),
      logo('Fairmont Monte Carlo', 'fairmont', 2.618),
    ],
  },
]

export const team = [
  {
    name: 'Guglielmo Esposito',
    photo: '/images/team/guglielmo-esposito.jpg',
    role: 'Co-Founder & Relationship Strategist',
    description:
      'Guida lo sviluppo di Mosaiko, le relazioni strategiche e la crescita del network.',
  },
  {
    name: 'Luca Ferraro',
    photo: '/images/team/luca-ferraro.jpg',
    role: 'Co-Founder & Operations Director',
    description:
      'Coordina organizzazione, logistica e sviluppo operativo dei progetti e degli eventi.',
  },
  {
    name: 'Antonietta Marcello',
    photo: '/images/team/antonietta-marcello.jpg',
    role: 'Partnership Manager',
    description:
      'Sviluppa e gestisce le relazioni con partner, aziende e realtà del network Mosaiko.',
  },
  {
    name: 'Raffaele Rippa',
    photo: '/images/team/raffaele-rippa.jpg',
    role: 'Business & Financial Coordinator',
    description:
      'Segue la pianificazione economica e lo sviluppo delle opportunità di business.',
  },
  {
    name: 'Roberto Ivone',
    photo: '/images/team/roberto-ivone.jpg',
    role: 'Hospitality & F&B Manager',
    description:
      'Coordina le attività hospitality, food & beverage e la gestione operativa delle strutture.',
  },
]

export const events = [
  {
    date: '23 Ott 2026',
    fullDate: 'Venerdì 23 ottobre 2026',
    time: '20:30',
    title: 'Napoli Futsal – Sporting Sala Consilina',
    location: 'PalaVesuvio – Napoli',
    image: '/images/eventi/napoli-futsal.jpg',
    tag: 'Futsal',
    description:
      "Il Napoli Futsal affronta lo Sporting Sala Consilina in una nuova sfida del campionato di Serie A. Un appuntamento che unisce la passione sportiva all'esperienza hospitality firmata Mosaiko, creando occasioni di incontro e networking in un contesto dinamico e coinvolgente.",
    contact: 'info@mosaiko.org',
  },
  {
    date: '27 Ott 2026',
    fullDate: 'Martedì 27 ottobre 2026',
    time: 'Dalle 15:00',
    title: 'Gran Premio ANACT Stakes+ – Batterie di qualificazione',
    location: 'Ippodromo di Agnano – Napoli',
    image: '/images/eventi/ippodromo-agnano.jpg',
    tag: 'Ippica',
    description:
      "L'Ippodromo di Agnano ospita le batterie di qualificazione del Gran Premio ANACT Stakes+, prestigioso appuntamento dedicato ai giovani talenti del trotto italiano. Un pomeriggio all'insegna dello sport ippico, dell'eccellenza e della convivialità, nella suggestiva cornice dell'ippodromo napoletano.",
    contact: 'info@mosaiko.org',
  },
  {
    date: '28 Ott 2026',
    fullDate: 'Mercoledì 28 ottobre 2026',
    time: '20:00',
    title: 'Juve Stabia – Hellas Verona',
    location: 'Stadio Romeo Menti – Castellammare di Stabia',
    image: '/images/eventi/juve-stabia.jpg',
    tag: 'Calcio',
    description:
      "La Juve Stabia ospita l'Hellas Verona per una nuova sfida del campionato di Serie BKT. Una serata di grande calcio e partecipazione, in cui Mosaiko contribuisce all'esperienza del pubblico attraverso i propri servizi presso lo stadio Romeo Menti.",
    contact: 'info@mosaiko.org',
  },
]

export const location = {
  company: 'Mosaiko Enterprise srl',
  address: 'Via Agnano Astroni 30, Napoli',
  email: 'info@mosaiko.org',
  phone: '+39 331 316 1556',
  mapQuery: 'Via Agnano Astroni 30, Napoli',
}
