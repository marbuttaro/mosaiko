# Stato implementazione Mosaiko — 3 novembre 2026

## Stato effettivo

Il codice del CMS e gli interventi SEO sono implementati, pubblicati su GitHub e distribuiti tramite la CLI Vercel autenticata `marbuttaro`. Il deploy `dpl_BMnfcnkfe89LsWhiHryjui8reE6y` è pronto e verificato su `https://mosaiko-ten.vercel.app`. **Attivazione Supabase e cambio DNS restano da completare**. Gmail è accessibile; Supabase blocca il login sul controllo di sicurezza e Aruba richiede un CAPTCHA per l'accesso via email. Il dominio pubblico punta ancora al vecchio hosting Aruba. `/admin/` mostra “in configurazione” fino all’inserimento delle variabili Supabase e al relativo nuovo deploy.

| Attività | Stato ed evidenza |
| --- | --- |
| Repository | `marbuttaro/mosaiko`, cartella locale `SMDev/Mosaiko/app`; accesso collaboratore risolto accettando l’invito esistente. |
| Account Supabase | Gmail Mosaiko autenticato e mail di conferma ricevuta. Link precedente scaduto; login con credenziali salvate arrestato dal controllo di sicurezza Supabase. Nessun progetto remoto creato. |
| Schema database | Migrazione SQL pronta, RLS testata su PostgreSQL/PGlite. Lettura pubblica solo dei contenuti pubblicati; scritture e upload solo admin. Non ancora applicata a Supabase remoto. |
| Dashboard | CRUD news/eventi, bozze, categorie/tipologie, ordine, blocchi editoriali, upload, anteprima e gestione delle modifiche concorrenti. Test browser/API con servizio Supabase simulato superati. |
| Importazione | Validati 45 articoli (42 WordPress + 3 recenti) e 3 eventi. Script idempotente, senza sovrascrivere record già presenti. |
| Vercel | CLI autenticata `marbuttaro`, team `marbuttaros-projects`, progetto `mosaiko` (`prj_NeYu3FER1NPSWnUVLfQQ3K4QtmAn`). |
| Deploy | Blocco precedente risolto: il repository risulta ora pubblico. La CLI ha completato `dpl_BMnfcnkfe89LsWhiHryjui8reE6y`, versione con CMS e SEO, sul progetto corretto. Non sono stati modificati dall'agente visibilità del repository o autori Git. |
| Dominio | Aggiunti `www.mosaiko.org` e `mosaiko.org` al progetto corretto. Configurato redirect 308 da apex a www. DNS pubblici ancora Aruba, `89.46.110.9`. |
| Aruba | Password dell’immagine rifiutata in precedenza. Preparato accesso ufficiale senza password alla casella Mosaiko; CAPTCHA in attesa. Nessun record DNS modificato. |
| Search Console | Aperta con la casella Mosaiko e preparata la proprietà dominio `mosaiko.org`; record TXT pronto localmente. Verifica DNS e invio sitemap pendenti. |

## Verifiche eseguite

- Build di produzione riuscita; lint senza errori o avvisi; `npm audit` senza vulnerabilità.
- Commit implementazione `91ac65d`, esclusioni upload `7ecdd35`, entrambi su `main`. [Pipeline GitHub del codice completata con successo](https://github.com/marbuttaro/mosaiko/actions/runs/41624510712).
- 2 test SQL/validazione superati: RLS anonimo/utente/admin, divieto di autoassegnazione admin, bozze, scritture, upload, immutabilità URL e input pericolosi.
- 10 test browser/API/SEO superati: login/logout, CRUD news e eventi, visibilità bozza/pubblicato, aggiornamento SSR e sitemap, duplicati, conflitti, upload PNG e rifiuto SVG, schermi 1440 e 390 px, 404 reali, RSS e redirect.
- 5 test pubblici aggiuntivi superati sul deploy Vercel reale: desktop/mobile, 51 pagine con metadati e JSON-LD, tutti gli 841 redirect e 51 ID WordPress, RSS, robots e 404. Nessuna scrittura al database remoto durante questi test.
- Crawl della build: 51 pagine nella sitemap, 1.064 collegamenti interni, 89 immagini distinte; nessun link o immagine interno mancante, metadati e canonical validi.
- Ripetuto lo stesso crawl sul deploy reale: 51 pagine, 1.064 collegamenti e 89 immagini; zero problemi.
- Confronto con il commit iniziale `f184894`: home, news, pagina 2, due articoli e partner su desktop/mobile. **12 schermate, 0 pixel diversi**, con animazioni ed embed esterni neutralizzati solo nei browser di test.
- Lighthouse mobile locale su home/news/articolo: SEO 100/100, best practices 100/100, accessibilità 96/100; performance 75/75/77. Le metriche di laboratorio non costituiscono una verifica dei Core Web Vitals reali né una garanzia di posizionamento.

I test di integrazione simulano l’HTTP Supabase; **non sostituiscono il collaudo del progetto Supabase reale**, che resta da eseguire dopo l’attivazione. Le prove locali sono riproducibili tramite i comandi nel README.

## Interventi SEO senza modificare la grafica

- Preservati slug, testi, immagini, classi CSS e impaginazione pubblica. Migliorati alt mancanti e priorità di caricamento dell’immagine principale.
- Sitemap dinamica e metadati leggono la stessa fonte dei contenuti. Cancellazioni e bozze non vengono ripubblicate dai dati statici dopo l’attivazione del CMS.
- Conservati canonical, Open Graph, NewsArticle e BreadcrumbList; descrizione di riserva per le nuove news; aggiunto feed RSS e relativa discovery.
- Dashboard e API escluse dall’indicizzazione. Le anteprime Vercel mantengono `X-Robots-Tag: noindex`; il dominio definitivo resta indicizzabile.
- 841 redirect espliciti per percorsi storici e varianti delle immagini, più 51 ID WordPress. Verificati 308 e destinazioni interne dirette 200.
- Recuperati 4 PDF pubblici dagli uploads WordPress, mantenendo il percorso originale; checksum in `legacy-pdf-manifest.json`.
- Inventario della sitemap WordPress: 211 URL, di cui 44 conservati con 200, 15 reindirizzati e 152 senza equivalente, lasciati 404. L’elenco completo è in `legacy-url-map.csv`. Include molti layout, tassonomie e contenuti dimostrativi del tema: non vengono mascherati con redirect generici alla homepage.
- `/video-gallery/` reindirizza al canale YouTube Mosaiko già collegato nella pagina originale. `/comments/feed/`, login e admin WordPress restano 404.

## Passaggio DNS preparato

Valori consigliati con priorità 1 dall'API Vercel, riverificati tramite la CLI il 3 novembre 2026; da controllare nuovamente prima della modifica:

| Record | Nome | Valore |
| --- | --- | --- |
| CNAME | www | `8dde7fdfc350b4ff.vercel-dns-017.com.` |
| A | @ | `216.198.79.1` |
| A | @ | `64.29.17.1` |

Modificare solo i record web dopo aver ottenuto l’accesso Aruba. Conservare MX, TXT, record di posta e nameserver esistenti. Lo snapshot pubblico rileva MX `mx.mosaiko.org`, priorità 10. Dopo il cambio: verificare DNS autoritativi, certificato HTTPS, redirect apex/www, canonical, robots, sitemap, contenuti e accesso CMS. L’IP web precedente `89.46.110.9` è conservato per il ripristino; il vecchio hosting non è stato cancellato.

## Attività ancora aperte

1. Rilascio Vercel completato; rimane il nuovo deploy dopo il collegamento Supabase.
2. Completare il controllo di sicurezza del login Supabase, rinnovare la conferma email, creare progetto Free, applicare migrazione, importare dati, creare admin e configurare Vercel. Eseguire CRUD reale e rimuovere i contenuti di prova.
3. Accesso Aruba valido; ottenere backup completo WordPress (file + SQL), verificarne integrità e ripristino, poi applicare il cambio DNS e collaudare il dominio.
4. Concludere la verifica DNS della proprietà Search Console preparata e inviare la sitemap dopo la migrazione. Nessuna proprietà verificata preesistente era visibile nell'account Mosaiko. Analytics, backlink, benchmark keyword, priorità di traffico e conversioni non verificati; nessun ID di tracciamento inventato o aggiunto.
5. Rich Results Test Google e Core Web Vitals sul dominio dopo il passaggio non ancora verificati. JSON-LD parsabile verificato localmente.
6. Prestazioni mobile: immagini pesanti e animazioni preesistenti limitano LCP. Contrasti cromatici segnalati da Lighthouse sono conservati per rispettare il vincolo grafico. La vecchia `/privacy-policy/` contiene il testo dimostrativo di AncoraThemes: non è stata trasformata in un’informativa legale Mosaiko inventata.

La copia delle API pubbliche WordPress e dei PDF è un recupero di contenuti, **non un backup completo del sito originale**.
