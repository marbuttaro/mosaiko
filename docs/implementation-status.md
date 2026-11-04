# Stato implementazione Mosaiko — 4 novembre 2026

## Stato effettivo

**Migrazione completata:** sito `https://www.mosaiko.org`, dashboard `https://www.mosaiko.org/admin/`. Supabase Free è attivo in Irlanda (`eu-west-1`), progetto `rctuxnshrrxtyekvwqbn`, con 45 news, 3 eventi e un amministratore. I DNS web Aruba sono stati cambiati solo dopo aver acquisito e verificato il backup completo di filesystem e database.

Il commit applicativo verificato è `7cd00d119862da9b153213b34c4470e07c74cfe9`; il deploy `dpl_B2bCg7WY3RoRCJNMTRwGaigoeYvq` è READY. La [pipeline GitHub](https://github.com/marbuttaro/mosaiko/actions/runs/41879208441) è conclusa con successo. Repository `marbuttaro/mosaiko`; CLI Vercel autenticata come `marbuttaro`, team `marbuttaros-projects`, progetto `mosaiko`.

| Attività | Stato ed evidenza |
| --- | --- |
| Supabase | Organizzazione Mosaiko, piano Free; account `mosaikoenterprise@gmail.com` verificato. |
| Schema e permessi | Entrambe le migrazioni SQL applicate: contenuti/admin, RLS, tipo e slug immutabili, controllo revisioni concorrenti e bucket immagini. Nessuna funzione client richiede privilegi del proprietario. |
| Importazione | 42 articoli WordPress conservati con gli URL originali, 3 news recenti e 3 eventi. Confronto prima del cambio DNS: nessun articolo WordPress mancante. Importazione idempotente. |
| Dashboard | CRUD news/eventi, bozze/pubblicazione, categorie e tipologie, ordine, blocchi, upload, anteprima, conflitti e ricerca. Collaudata sul dominio definitivo con Supabase reale. |
| Autenticazione | Iscrizioni pubbliche e accessi anonimi disabilitati; admin con email verificata e password casuale distinta. Site URL aggiornato a `https://www.mosaiko.org/admin/`. |
| Chiavi | Su Vercel solo URL e chiave pubblicabile, per Production/Preview/Development. Chiave privilegiata e credenziali nel file privato `SMDev/Mosaiko/.env`, fuori da Git e dal deploy. |
| Dominio e HTTPS | Apex e www sul progetto Vercel; redirect 308 apex → www. Certificato valido per entrambi, rinnovo automatico. |
| Search Console | Proprietà dominio verificata tramite TXT. Sitemap elaborata correttamente il 4 novembre: 51 pagine rilevate. |

## Backup Aruba prima del cambio DNS

Backup privato nella cartella `backup-aruba-2026-11-04` del workspace Windows di questa attività, fuori dal repository e dal deploy.

- Filesystem completo: **46.565 file, 8.138 cartelle, 1.569.370.065 byte**. Inventario e checksum verificati. Un file di statistiche modificato durante la copia è stato riacquisito e verificato.
- Database: esportazione SQL compressa con **84 tabelle**, CRC e chiusura transazione verificati. Ripristino riuscito in MariaDB 10.11 isolato, con rete disabilitata; confermati 1.629 post, 11.478 metadati post, 709 opzioni e un utente.
- Archivio completo: `mosaiko-wordpress-backup-2026-11-04.zip`, **1.160.158.392 byte**, 54.711 voci. CRC ZIP e hash dei sorgenti validi.
- SHA-256 archivio: `7a12a18f857be682f97fd9255362967bcf7018cad5da9068c1404bf669c2fb14`.
- Zona DNS esportata prima e dopo il passaggio; rapporti JSON e istruzioni di ripristino conservati accanto al backup. Il backup contiene configurazioni e dati riservati: non è stato pubblicato su GitHub né allegato all’email.

## DNS e certificato

| Tipo | Nome | Valore | TTL |
| --- | --- | --- | --- |
| A | @ | `216.198.79.1` | 300 |
| A | @ | `64.29.17.1` | 300 |
| A | www | `216.198.79.1` | 300 |
| A | www | `64.29.17.1` | 300 |

Entrambi gli indirizzi sono quelli raccomandati dall’API Vercel, che conferma `misconfigured: false` per apex e www. Rimossi esclusivamente i vecchi record web A/AAAA. Aggiunto il TXT di verifica Google; rimossi i TXT ACME temporanei dopo l’emissione del certificato. Il confronto degli export conferma **50 altri record identici**, inclusi MX, SPF, DKIM, DMARC, servizi mail/FTP e nameserver. MX `mx.mosaiko.org`, priorità 10.

Certificato `cert_8lQFWoxqwdlSq2YT1VgxqZA3`, emittente Let’s Encrypt YR2, SAN `mosaiko.org` e `www.mosaiko.org`, scadenza 2 febbraio 2027, rinnovo automatico Vercel. HTTPS verificato con la normale validazione TLS su entrambi gli IP; www risponde 200, apex reindirizza con 308.

Alle 18:04 UTC del 4 novembre, **36/36 controlli DNS** sui quattro nameserver Aruba e sui resolver Google/Cloudflare erano corretti. Il resolver del PC conservava ancora l’IP Aruba con circa 24 minuti di TTL residuo: singole cache possono mostrare temporaneamente il vecchio sito. I test del nuovo dominio sono stati eseguiti tramite un tunnel HTTPS locale che risolve con DNS pubblico, mantenendo la validazione TLS e senza modificare il file hosts o i DNS del PC.

Il vecchio hosting resta disponibile per ripristino. `dns-before.bind` conserva la zona originaria: web A `89.46.110.9` e AAAA `2a00:6d40:4:1::c302:9`, TTL 3600. Nessun trasferimento del registrar. Aruba indica scadenza dominio **15 novembre 2026**; nessun rinnovo a pagamento eseguito.

## Verifiche eseguite

- Build riuscita e lint senza errori/avvisi. Nessuna dipendenza aggiunta il 4 novembre; l’audit dipendenze del 3 novembre non rilevava vulnerabilità.
- **4 test unitari superati:** 2 PostgreSQL/PGlite e validazione, 2 sulla correttezza dei timestamp SEO. RLS, bozze, scritture riservate, divieto di autoassegnazione admin, URL immutabili e funzioni con privilegi limitati verificati.
- **10 test browser/API/SEO locali con servizio simulato superati** dopo la correzione dei metadati.
- **Collaudo Supabase reale superato sul dominio definitivo:** permessi anonimo/utente/admin, CRUD news/eventi, bozze, pubblicazione, SSR/sitemap, conflitti, URL immutabili, rifiuto input pericolosi/SVG, upload PNG, login/modifica/eliminazione/logout nel browser.
- Fixture, immagini e utente temporaneo rimossi; inventario e revisioni dei contenuti preesistenti identici prima/dopo.
- **5 smoke test pubblici superati su www.mosaiko.org:** desktop/mobile, 51 pagine e metadati/JSON-LD, 841 redirect e 51 ID WordPress, RSS, robots, admin noindex e 404.
- Crawl sul dominio definitivo: **51 pagine, 1.064 collegamenti interni, 89 immagini distinte, zero problemi**.
- Google Rich Results sul dominio definitivo: scansione riuscita, un NewsArticle e un BreadcrumbList validi, nessun avviso. [Esito del test](https://search.google.com/test/rich-results/result?id=-OFBCdNjejg6qsb1RsXV6Q).
- Search Console: proprietà verificata e sitemap `https://www.mosaiko.org/sitemap.xml` elaborata con **51 pagine rilevate**. Il rilevamento non equivale all’indicizzazione di tutte le pagine.
- Confronto grafico del 3 novembre con il commit iniziale `f184894`: 12 schermate desktop/mobile, **0 pixel diversi**, neutralizzando animazioni/embed solo nei browser di test. Le modifiche del 4 novembre riguardano esclusivamente metadati e documentazione; nessun componente visivo o CSS modificato.
- Lighthouse mobile locale del 3 novembre: SEO 100/100, best practices 100/100, accessibilità 96/100; performance 75/75/77 su home/news/articolo. Non sono misure dei Core Web Vitals sul campo.

Lo script `scripts/test-cms-live.mjs` riproduce il collaudo reale con fixture UUID e pulizia finale. I test locali/GitHub simulati restano distinti dal collaudo reale. Comandi nel README; risultati in `qa-summary.json`.

## Interventi SEO senza modificare la grafica

- Preservati testi, immagini, slug, classi CSS e impaginazione pubblica. Migliorati alt mancanti, gerarchia semantica e priorità dell’immagine principale.
- Sitemap, RSS, metadati e pagine leggono solo i contenuti pubblicati; bozze e cancellazioni non ripristinano dati statici.
- Canonical, Open Graph, NewsArticle/BreadcrumbList, descrizioni di riserva e discovery RSS.
- Recuperati gli orari UTC originali dei 42 articoli WordPress per `datePublished` e `dateModified`. I metadati riutilizzano questi orari solo se ID, slug e data editoriale coincidono; per date senza orario noto i campi facoltativi sono omessi, senza inventare timestamp. Risolti gli avvisi Google sulle date.
- Dashboard/API non indicizzabili; anteprime `*.vercel.app` con `X-Robots-Tag: noindex`; dominio definitivo indicizzabile.
- 841 redirect espliciti più 51 ID WordPress verificati. Conservati gli URL dei 42 articoli e 4 PDF originali con checksum.
- Inventario WordPress di 211 URL: 44 conservati con 200, 15 reindirizzati, 152 senza equivalente lasciati 404, prevalentemente layout/tassonomie/contenuti dimostrativi del tema. Dettagli in `legacy-url-map.csv`.
- `/video-gallery/` reindirizza al canale YouTube Mosaiko già collegato nell’originale; feed commenti/login/admin WordPress restano 404.

## Limiti dei controlli

- La protezione Supabase contro password già trapelate non è inclusa nel piano Free richiesto. Registrazioni pubbliche disabilitate e password CMS casuale distinta; nessun upgrade a pagamento.
- Analytics, backlink e benchmark keyword/conversioni non misurati. Nessun ID di tracciamento inventato. Search Console non dispone ancora di dati Core Web Vitals del nuovo ambiente: richiedono traffico e raccolta nel tempo.
- Immagini pesanti e animazioni preesistenti limitano LCP; colori e contrasti conservati per rispettare il vincolo grafico. La vecchia `/privacy-policy/` contiene testo dimostrativo di AncoraThemes: non è stata sostituita con un’informativa legale inventata.
