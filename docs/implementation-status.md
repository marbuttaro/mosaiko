# Stato implementazione Mosaiko — 3 novembre 2026

## Stato effettivo

**Supabase e dashboard sono attivi su Vercel.** L’account `mosaikoenterprise@gmail.com` è verificato; il progetto Free `mosaiko` (`rctuxnshrrxtyekvwqbn`) è operativo in Irlanda (`eu-west-1`). Il sito legge dal database i 45 articoli e i 3 eventi importati. Dashboard: `https://mosaiko-ten.vercel.app/admin/`.

Il deploy CLI `dpl_2sh6jWxCApyakCP2GNkcR6HUE6us` è pronto e collaudato sul dominio Vercel. **Aruba e la migrazione DNS sono rinviati su richiesta esplicita dell’utente.** Nessun record DNS modificato: `mosaiko.org` e `www.mosaiko.org` continuano a servire il vecchio hosting Aruba. I canonical del nuovo sito restano sul dominio definitivo.

| Attività | Stato ed evidenza |
| --- | --- |
| Repository | `marbuttaro/mosaiko`, cartella locale `SMDev/Mosaiko/app`; codice e istruzioni sotto controllo Git. |
| Supabase | Organizzazione `Mosaiko`, piano Free, database attivo in Irlanda. Email confermata tramite il nuovo link ricevuto in Gmail. |
| Schema e permessi | Applicate entrambe le migrazioni SQL: tabelle contenuti/admin, RLS, immutabilità tipo/slug, revisione concorrente e bucket immagini. Le funzioni non richiedono privilegi del proprietario dai client. |
| Importazione | 45 news (42 WordPress + 3 recenti), 3 eventi pubblicati, un amministratore CMS. Importazione idempotente senza sovrascrivere modifiche editoriali. |
| Dashboard | CRUD news/eventi, bozze, pubblicazione, categorie/tipologie, ordine, blocchi, upload, anteprima, conflitti e ricerca. Verificata nel browser contro Supabase reale anche sul deploy Vercel. |
| Autenticazione | Registrazioni pubbliche e accessi anonimi disabilitati; conferma email richiesta. Admin con email verificata e password casuale distinta dagli altri account. Site URL: `https://mosaiko-ten.vercel.app/admin/`. |
| Chiavi | Nuove chiavi publishable/secret. Su Vercel soltanto URL e chiave pubblicabile, negli ambienti Production/Preview/Development. Chiave privilegiata e credenziali in `SMDev/Mosaiko/.env`, fuori dal repository e dal deploy. |
| Vercel | CLI autenticata `marbuttaro`, team `marbuttaros-projects`, progetto `mosaiko` (`prj_NeYu3FER1NPSWnUVLfQQ3K4QtmAn`). |
| Dominio | Apex e www associati al progetto, redirect apex → www predisposto. DNS ancora Aruba, `89.46.110.9`, per scelta dell’utente. |
| Search Console | Proprietà `mosaiko.org` preparata con Gmail Mosaiko; TXT conservato localmente. Verifica e invio sitemap dipendono dal futuro accesso DNS. |

## Verifiche eseguite

- Build di produzione riuscita; lint senza errori o avvisi. L’audit dipendenze già eseguito non rileva vulnerabilità; nessuna dipendenza aggiunta durante l’attivazione.
- 2 test PostgreSQL/PGlite e validazione superati, con entrambe le migrazioni. Confermati RLS, protezione bozze, scritture riservate, divieto di autoassegnazione admin, immutabilità URL e funzioni con privilegi limitati.
- 10 test browser/API/SEO con servizio simulato superati dopo l’aggiornamento alle chiavi pubblicabili.
- **Collaudo Supabase reale superato**, dalla build locale e dal sito Vercel: permessi anonimo/utente/admin, news/eventi CRUD, bozze, pubblicazione, SSR e sitemap, duplicati/conflitti, URL immutabili, rifiuto input pericolosi/SVG, upload PNG integro, login/modifica/eliminazione/logout nel browser. Ripetuto sul deploy dopo il restringimento finale dei permessi SQL.
- Fixture, immagini e utenze temporanee rimosse. Inventario e revisioni dei contenuti preesistenti verificati identici prima/dopo.
- 5 smoke test pubblici superati sul deploy con Supabase attivo: desktop/mobile, 51 pagine con metadati e JSON-LD, 841 redirect e 51 ID WordPress, RSS, robots e 404.
- Crawl online con Supabase attivo: **51 pagine, 1.064 collegamenti interni, 89 immagini distinte, zero problemi**.
- Confronto visivo già eseguito con il commit iniziale `f184894`: 12 schermate desktop/mobile, **0 pixel diversi**, neutralizzando animazioni/embed solo nei browser di test. L’attivazione Supabase non cambia componenti o CSS pubblici.
- Lighthouse mobile locale già eseguito su home/news/articolo: SEO 100/100, best practices 100/100, accessibilità 96/100; performance 75/75/77. Questi risultati precedono l’attivazione del database e non sono misure dei Core Web Vitals reali.

`scripts/test-cms-live.mjs` riproduce il collaudo reale con fixture UUID e pulizia finale. I test locali/GitHub simulati restano distinti dal collaudo reale. Comandi nel README; riepilogo in `qa-summary.json`.

## Interventi SEO senza modificare la grafica

- Preservati testi, immagini, slug, classi CSS e impaginazione pubblica. Migliorati alt mancanti, gerarchia semantica e priorità dell’immagine principale.
- Sitemap, RSS, metadati e pagine leggono solo i contenuti pubblicati. Bozze e cancellazioni non ripristinano dati statici.
- Canonical, Open Graph, NewsArticle e BreadcrumbList, descrizioni di riserva e discovery RSS.
- Dashboard/API non indicizzabili; anteprime `*.vercel.app` con `X-Robots-Tag: noindex`; dominio definitivo predisposto all’indicizzazione.
- 841 redirect espliciti più 51 ID WordPress, con destinazioni dirette verificate. Conservati gli URL dei 42 articoli WordPress e 4 PDF originali con checksum.
- Inventario WordPress di 211 URL: 44 conservati con 200, 15 reindirizzati, 152 senza equivalente lasciati 404 (molti layout/tassonomie/contenuti dimostrativi del tema). Dettagli in `legacy-url-map.csv`.
- `/video-gallery/` reindirizza al canale YouTube Mosaiko già collegato nell’originale; feed commenti/login/admin WordPress restano 404.

## Migrazione dominio rinviata

Alla ripresa, riverificare nell’API Vercel i valori consigliati prima di modificare i DNS:

| Record | Nome | Valore rilevato il 3 novembre 2026 |
| --- | --- | --- |
| CNAME | www | `8dde7fdfc350b4ff.vercel-dns-017.com.` |
| A | @ | `216.198.79.1` |
| A | @ | `64.29.17.1` |

Conservare MX, TXT, record di posta e nameserver. Lo snapshot pubblico rileva MX `mx.mosaiko.org`, priorità 10. Prima della migrazione resta da acquisire/verificare un backup completo WordPress (file + SQL); la copia delle API pubbliche e dei PDF non lo sostituisce. IP precedente `89.46.110.9` conservato per il ripristino; vecchio hosting non cancellato.

Dopo il futuro cambio: controllare DNS autoritativi, HTTPS, redirect apex/www, canonical, robots, sitemap, contenuti e CMS; completare Search Console e inviare la sitemap. Le credenziali Aruba del file risultano rifiutate; l’account salvato in Chrome non contiene mosaiko.org.

## Limiti e attività residue

- La protezione contro password già trapelate non è inclusa nel piano Free richiesto: [documentazione Supabase](https://supabase.com/docs/guides/auth/password-security). Registrazioni pubbliche disabilitate e password CMS casuale distinta. Nessun upgrade a pagamento effettuato.
- Analytics, backlink, benchmark keyword, priorità di traffico/conversioni e Rich Results Test Google non verificati. Nessun ID di tracciamento inventato. Verifica DNS Search Console e Core Web Vitals del nuovo ambiente sul dominio definitivo rinviati con il passaggio DNS.
- Immagini pesanti e animazioni preesistenti limitano LCP; colori e contrasti conservati per rispettare il vincolo grafico. La vecchia `/privacy-policy/` contiene testo dimostrativo di AncoraThemes: non è stata trasformata in un’informativa legale inventata.
