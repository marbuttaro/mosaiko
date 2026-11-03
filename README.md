# Mosaiko

Next.js 16 App Router, React 19, Tailwind CSS 4, Supabase e Vercel.
Dominio canonico: `https://www.mosaiko.org`. Anteprima: `https://mosaiko-ten.vercel.app`.

## Sviluppo e controlli

```bash
npm ci
npm run dev
npm run lint
npm test
npm run seed:validate
npx playwright install chromium
npm run test:smoke
npm run build
npm start
```

I test SQL applicano la migrazione a PostgreSQL tramite PGlite e verificano i permessi anonimo/utente/admin. I test browser e API usano un servizio Supabase simulato locale, separato da qualsiasi progetto reale. Verificano CRUD, bozze, pubblicazione, conflitti, upload, login/logout, metadati, 51 pagine e tutti i redirect. La verifica su Supabase reale è un passaggio distinto dopo il provisioning.

## Attivazione Supabase

1. Creare un progetto **Free** nell’account Mosaiko, preferibilmente in una regione UE. Salvare password e chiavi in un file privato fuori dal repository.
2. Eseguire `supabase/migrations/202611030001_cms.sql` nel SQL editor del progetto. Crea `cms_content`, `cms_admins`, le policy RLS e il bucket pubblico `cms-images` (scrittura solo admin).
3. Impostare in un file locale `.env.local` le variabili di `.env.example`. Il sito e le API usano solo URL e chiave anon. La service role serve esclusivamente agli script di provisioning e non va inserita in Vercel né in variabili `NEXT_PUBLIC_*`.
4. Importare i 45 articoli e i 3 eventi esistenti:

   ```bash
   node --env-file=.env.local scripts/seed-cms.mjs
   ```

   L’importazione è ripetibile: gli elementi già presenti vengono conservati, senza sovrascrivere modifiche editoriali.
5. Creare l’utente amministratore con email verificata e password distinta da Gmail/Supabase Dashboard, aggiungendo localmente `CMS_ADMIN_EMAIL` e `CMS_ADMIN_PASSWORD`:

   ```bash
   node --env-file=.env.local scripts/create-admin.mjs
   ```

   L’accesso al pannello Supabase e l’accesso al CMS del sito sono account distinti. Lo script non cambia password di utenti già esistenti. Disabilitare le iscrizioni pubbliche in Authentication → Settings: il CMS non offre registrazione pubblica.
6. Configurare `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` negli ambienti Vercel richiesti, poi ricostruire il deploy. Verificare login e CRUD reali su `/admin/` con contenuti di prova riconoscibili e rimuoverli al termine.

Senza entrambe le variabili il sito conserva i dati statici originali e il pannello mostra “in configurazione”. Quando Supabase è configurato, il database è l’unica fonte: bozze, cancellazioni e un archivio vuoto non ripristinano dati statici. Un errore del servizio viene segnalato e non mascherato con contenuti obsoleti.

### Collaudo del progetto reale

Dopo il provisioning, avviare una build locale collegata al progetto Supabase reale prima di configurare le variabili del deploy pubblico. Con le stesse variabili e la service role presenti soltanto nel file privato locale, eseguire:

```bash
CMS_LIVE_BASE_URL=http://127.0.0.1:3000 node --env-file=.env.local scripts/test-cms-live.mjs
```

Il comando richiede esplicitamente URL del sito, chiavi Supabase e credenziali CMS. Verifica RLS anonimo/utente/admin, CRUD news/eventi, bozze e pubblicazione, conflitti, SSR e sitemap, upload e login/logout dal browser. Crea un utente senza privilegi e contenuti con un prefisso UUID univoco, poi elimina solo queste fixture e controlla che l’inventario dei contenuti preesistenti sia invariato. Non eseguirlo durante modifiche editoriali contemporanee. Un’esecuzione sul sito pubblico rende brevemente visibili le fixture pubblicate: preferire la build locale prima del collegamento in produzione. Il successo dei test simulati non implica il successo di questo collaudo.

## Uso della dashboard

`/admin/` permette di cercare, creare, modificare, pubblicare e cancellare news ed eventi. La news supporta categorie, titoli, date, descrizione SEO, immagini, paragrafi, titoletti, elenchi, citazioni e video YouTube. Gli eventi mantengono tutti i campi già presenti nel sito. Gli upload accettano JPG, PNG e WebP fino a 4 MB. L’anteprima usa gli stessi componenti del sito.

Lo stato **Bozza** è privato. **Pubblicato** è visibile immediatamente, senza nuovo deploy. L’ordine crescente controlla la posizione nelle liste. Lo slug resta stabile dopo la creazione per conservare gli URL. Se due sessioni modificano lo stesso contenuto, la seconda deve ricaricare: una modifica non sovrascrive silenziosamente l’altra.

## SEO e dominio

`src/data/legacy-redirects.json` contiene redirect verificati da API e sitemap WordPress, comprese varianti delle immagini e ID storici. `src/proxy.js` applica redirect 308; gli URL senza equivalente restano 404. I 42 articoli importati mantengono gli URL originali. I PDF sono conservati in `public/wp-content/uploads` con manifest SHA-256.

Sitemap e feed RSS leggono solo contenuti pubblicati. Canonical, Open Graph, NewsArticle e BreadcrumbList restano sul dominio definitivo; `/admin/` e API non sono indicizzabili. I domini `*.vercel.app` mantengono `X-Robots-Tag: noindex`.

Per verificare un deploy:

```bash
node scripts/audit-site.mjs https://mosaiko-ten.vercel.app
node scripts/lighthouse-audit.mjs http://127.0.0.1:3000
node scripts/verify-visual.mjs http://127.0.0.1:3101 http://127.0.0.1:3102
SMOKE_BASE_URL=https://mosaiko-ten.vercel.app npm run test:smoke
```

Con `SMOKE_BASE_URL` vengono eseguiti solo controlli pubblici in lettura sul sito indicato (desktop/mobile, metadati, redirect, RSS e robots); non partono server locali né test CRUD sul database remoto.

Il confronto visivo richiede due build in esecuzione e disattiva solo nei browser di test animazioni ed embed esterni. I risultati sono in `test-results/`, esclusa da Git. Stato della migrazione e limiti dei controlli: `docs/implementation-status.md`.
