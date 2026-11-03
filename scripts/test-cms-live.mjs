import assert from 'node:assert/strict'
import { randomUUID, randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { chromium } from '@playwright/test'

// Explicit opt-in: this exercises the real database, using only unique test fixtures.
const {
  CMS_LIVE_BASE_URL: base,
  NEXT_PUBLIC_SUPABASE_URL: url,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  SUPABASE_SERVICE_ROLE_KEY: serviceKey,
  CMS_ADMIN_EMAIL: email,
  CMS_ADMIN_PASSWORD: password,
} = process.env
if (!base || !url || !anonKey || !serviceKey || !email || !password) {
  throw new Error('Imposta CMS_LIVE_BASE_URL e le credenziali Supabase/CMS in un file privato locale. Questo test modifica solo fixture temporanee.')
}
const origin = new URL(base)
assert(['http:', 'https:'].includes(origin.protocol), 'Protocollo sito non valido')
assert(!origin.username && !origin.password && !origin.search && !origin.hash, 'Usa un URL base senza credenziali o parametri')
const options = { auth: { persistSession: false, autoRefreshToken: false } }
const service = createClient(url, serviceKey, options)
const anon = createClient(url, anonKey, options)
const admin = createClient(url, anonKey, options)
const visitor = createClient(url, anonKey, options)
const prefix = `live-smoke-${randomUUID()}`
const slugs = new Set()
const objectPaths = new Set()
const cleanupErrors = []
let visitorId, browser, token, failure
let stage = 'accesso admin'
function ok(result, label) {
  assert(!result.error, `${label}: operazione Supabase non riuscita (${result.error?.code || result.error?.status || 'errore'})`)
  return result.data
}
function news(slug) {
  slugs.add(slug)
  return { kind: 'news', slug, status: 'draft', sort_order: 999999, data: {
    slug, title: `Collaudo temporaneo ${slug}`, shortTitle: 'Collaudo temporaneo',
    date: '3 Nov 2026', isoDate: '2026-11-03', tags: ['News'],
    image: '/images/hero-networking.jpg', imageAlt: 'Networking', body: ['Contenuto temporaneo di collaudo.'],
  } }
}
async function api(path, { method = 'GET', body, revision, auth = token } = {}) {
  const headers = {}
  if (auth) headers.Authorization = `Bearer ${auth}`
  if (revision) headers['If-Match'] = revision
  if (body && !(body instanceof FormData)) headers['Content-Type'] = 'application/json'
  return fetch(new URL(path, origin), {
    method, headers, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(60000), redirect: 'error',
  })
}
async function bodyAt(path, status = 200) {
  const response = await api(path, { auth: null })
  assert.equal(response.status, status, `Stato pubblico ${path}`)
  return response.text()
}
async function listedBy(client, slug) {
  return ok(await client.from('cms_content').select('id,status').eq('slug', slug), 'Verifica RLS')
}
async function contentSnapshot() {
  const rows = []
  for (let offset = 0; ; offset += 500) {
    const batch = ok(await service.from('cms_content').select('id,updated_at').order('id').range(offset, offset + 499), 'Inventario contenuti')
    rows.push(...batch)
    if (batch.length < 500) return rows
  }
}
const before = await contentSnapshot()
try {
  token = ok(await admin.auth.signInWithPassword({ email, password }), 'Accesso admin').session.access_token
  stage = 'utente senza privilegi'
  const visitorEmail = `${prefix}@example.invalid`, visitorPassword = randomBytes(32).toString('base64url')
  visitorId = ok(await service.auth.admin.createUser({ email: visitorEmail, password: visitorPassword, email_confirm: true }), 'Fixture utente').user.id
  const visitorToken = ok(await visitor.auth.signInWithPassword({ email: visitorEmail, password: visitorPassword }), 'Accesso fixture').session.access_token
  assert.equal((await api('/api/admin/content/', { auth: null })).status, 401)
  assert.equal((await api('/api/admin/content/', { auth: 'invalid-test-token' })).status, 401)
  assert.equal((await api('/api/admin/content/', { auth: visitorToken })).status, 403)
  assert((await visitor.from('cms_admins').insert({ user_id: visitorId })).error, 'Autoassegnazione admin vietata')
  const denied = news(`${prefix}-denied`)
  assert((await anon.from('cms_content').insert(denied)).error, 'Scrittura anonima vietata')
  assert((await visitor.from('cms_content').insert(denied)).error, 'Scrittura utente non admin vietata')
  console.log('PASS: autenticazione, autorizzazione API e RLS scrittura')

  stage = 'CRUD news e RLS lettura'
  const input = news(`${prefix}-news`)
  let response = await api('/api/admin/content/', { method: 'POST', body: input })
  assert.equal(response.status, 201, 'Creazione news')
  let item = (await response.json()).item
  assert.equal((await listedBy(anon, input.slug)).length, 0, 'Bozza non pubblica')
  assert.equal((await listedBy(visitor, input.slug)).length, 0, 'Bozza non visibile a utente comune')
  await bodyAt(`/${input.slug}/`, 404)
  assert(!(await bodyAt('/sitemap.xml')).includes(`/${input.slug}/`), 'Bozza esclusa dalla sitemap')
  assert.equal((await api('/api/admin/content/', { method: 'POST', body: input })).status, 409, 'Duplicato rifiutato')
  assert.equal((await api(`/api/admin/content/${item.id}/`, { method: 'PATCH', body: input })).status, 409, 'Revisione obbligatoria')
  const oldRevision = item.updated_at
  input.status = 'published'
  response = await api(`/api/admin/content/${item.id}/`, { method: 'PATCH', body: input, revision: item.updated_at })
  assert.equal(response.status, 200, 'Pubblicazione news')
  item = (await response.json()).item
  assert.equal((await listedBy(anon, input.slug)).length, 1, 'News pubblica via RLS')
  assert((await anon.from('cms_content').update({ status: 'draft' }).eq('id', item.id)).error, 'Modifica anonima vietata')
  assert.equal(ok(await visitor.from('cms_content').update({ status: 'draft' }).eq('id', item.id).select('id'), 'Modifica non admin').length, 0)
  assert.equal(ok(await visitor.from('cms_content').delete().eq('id', item.id).select('id'), 'Eliminazione non admin').length, 0)
  assert((await bodyAt(`/${input.slug}/`)).includes('NewsArticle'), 'Pagina SSR e JSON-LD')
  assert((await bodyAt('/sitemap.xml')).includes(`/${input.slug}/`), 'News pubblicata in sitemap')
  assert.equal((await api(`/api/admin/content/${item.id}/`, { method: 'PATCH', body: input, revision: oldRevision })).status, 409, 'Conflitto rilevato')
  const modified = { ...input, slug: `${input.slug}-changed`, data: { ...input.data, slug: `${input.slug}-changed` } }
  slugs.add(modified.slug)
  assert.equal((await api(`/api/admin/content/${item.id}/`, { method: 'PATCH', body: modified, revision: item.updated_at })).status, 400, 'Slug immutabile')
  assert.equal((await api(`/api/admin/content/${item.id}/`, { method: 'DELETE', revision: item.updated_at })).status, 200, 'Eliminazione news')
  await bodyAt(`/${input.slug}/`, 404)
  assert(!(await bodyAt('/sitemap.xml')).includes(`/${input.slug}/`), 'News eliminata dalla sitemap')
  console.log('PASS: news CRUD, bozze, pubblicazione, conflitti, SSR e sitemap')

  stage = 'CRUD eventi'
  const eventSlug = `${prefix}-event`
  slugs.add(eventSlug)
  const event = { kind: 'event', slug: eventSlug, status: 'draft', sort_order: 999999, data: {
    title: `Evento ${prefix}`, date: '3 Nov', fullDate: '3 Novembre 2026', time: '18:00', location: 'Napoli',
    tag: 'Networking', description: 'Collaudo temporaneo', contact: 'info@mosaiko.org', image: '/images/hero-networking.jpg',
  } }
  response = await api('/api/admin/content/', { method: 'POST', body: event })
  assert.equal(response.status, 201)
  item = (await response.json()).item
  assert(!(await bodyAt('/')).includes(event.data.title), 'Evento in bozza escluso dalla home')
  event.status = 'published'
  response = await api(`/api/admin/content/${item.id}/`, { method: 'PATCH', body: event, revision: item.updated_at })
  assert.equal(response.status, 200)
  item = (await response.json()).item
  assert((await bodyAt('/')).includes(event.data.title), 'Evento pubblicato nella home')
  assert.equal((await api(`/api/admin/content/${item.id}/`, { method: 'DELETE', revision: item.updated_at })).status, 200)
  assert(!(await bodyAt('/')).includes(event.data.title), 'Evento rimosso dalla home')
  console.log('PASS: eventi CRUD e aggiornamento homepage')

  stage = 'upload e validazione'
  const invalid = news(`${prefix}-invalid`)
  invalid.data.body = ['[link](javascript:alert)']
  assert.equal((await api('/api/admin/content/', { method: 'POST', body: invalid })).status, 400)
  const svg = new FormData()
  svg.set('file', new Blob(['<svg/>'], { type: 'image/svg+xml' }), 'test.svg')
  assert.equal((await api('/api/admin/upload/', { method: 'POST', body: svg })).status, 400)
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nXsAAAAASUVORK5CYII=', 'base64')
  const deniedPath = `${prefix}-denied.png`
  objectPaths.add(deniedPath)
  assert((await anon.storage.from('cms-images').upload(deniedPath, png, { contentType: 'image/png' })).error, 'Upload anonimo vietato')
  assert((await visitor.storage.from('cms-images').upload(deniedPath, png, { contentType: 'image/png' })).error, 'Upload non admin vietato')
  const form = new FormData()
  form.set('file', new Blob([png], { type: 'image/png' }), `${prefix}.png`)
  response = await api('/api/admin/upload/', { method: 'POST', body: form })
  assert.equal(response.status, 201)
  const upload = new URL((await response.json()).url)
  assert.equal(upload.origin, new URL(url).origin, 'Upload sul progetto previsto')
  const objectPath = upload.pathname.split('/storage/v1/object/public/cms-images/')[1]
  assert(objectPath && /^[a-f0-9-]+\.png$/.test(objectPath), 'Percorso upload valido')
  objectPaths.add(objectPath)
  response = await fetch(upload, { signal: AbortSignal.timeout(30000) })
  assert.equal(response.status, 200)
  assert(Buffer.from(await response.arrayBuffer()).equals(png), 'Immagine pubblica integra')
  console.log('PASS: validazione contenuti e upload reale con permessi storage')

  stage = 'dashboard browser'
  const browserSlug = `${prefix}-browser`
  slugs.add(browserSlug)
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.name))
  await page.goto(new URL('/admin/', origin).href)
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Accedi', exact: true }).click()
  await page.getByRole('button', { name: 'Nuova news', exact: true }).click()
  await page.getByLabel('Titolo', { exact: true }).fill(`Browser ${prefix}`)
  await page.getByLabel('Identificativo URL').fill(browserSlug)
  await page.getByLabel('Titolo breve per le schede').fill('Collaudo browser')
  await page.getByLabel('Immagine di copertina', { exact: true }).fill('/images/hero-networking.jpg')
  await page.getByLabel('Testo alternativo immagine', { exact: true }).fill('Networking')
  await page.getByLabel('Testo blocco 1', { exact: true }).fill('Collaudo temporaneo dashboard')
  await page.getByRole('button', { name: 'Salva contenuto', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'Bozza salvata' }).waitFor()
  assert.equal((await listedBy(admin, browserSlug)).length, 1, 'Bozza browser persistita')
  const editedTitle = `Browser modificato ${prefix}`
  await page.getByLabel('Titolo', { exact: true }).fill(editedTitle)
  await page.getByRole('button', { name: 'Salva contenuto', exact: true }).click()
  await page.getByRole('button', { name: 'Salva contenuto', exact: true }).waitFor({ state: 'visible' })
  await page.waitForFunction(() => document.querySelector('[role="status"]')?.textContent?.includes('Bozza salvata'))
  assert.equal(ok(await admin.from('cms_content').select('data').eq('slug', browserSlug).single(), 'Modifica browser').data.title, editedTitle)
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Elimina contenuto', exact: true }).click()
  await page.getByRole('status').filter({ hasText: 'Contenuto eliminato' }).waitFor()
  assert.equal((await listedBy(admin, browserSlug)).length, 0, 'Bozza browser eliminata')
  await page.getByRole('button', { name: 'Esci', exact: true }).click()
  await page.getByRole('button', { name: 'Accedi', exact: true }).waitFor()
  assert.equal(errors.length, 0, 'Nessun errore JavaScript in dashboard')
  console.log('PASS: login, creazione, modifica, eliminazione e logout nel browser')
} catch (error) {
  const reason = error instanceof assert.AssertionError ? error.message : error.name
  failure = `Collaudo non superato: ${stage} (${reason}).`
} finally {
  const clean = async (label, operation) => {
    try { if ((await operation())?.error) cleanupErrors.push(label) }
    catch { cleanupErrors.push(label) }
  }
  if (browser) await clean('browser', () => browser.close())
  if (slugs.size) await clean('contenuti temporanei', () => service.from('cms_content').delete().in('slug', [...slugs]))
  if (objectPaths.size) await clean('immagini temporanee', () => service.storage.from('cms-images').remove([...objectPaths]))
  if (visitorId) await clean('utente temporaneo', () => service.auth.admin.deleteUser(visitorId))
  if (token) await clean('sessione test', () => admin.auth.signOut({ scope: 'local' }))
}
assert.equal(cleanupErrors.length, 0, `Pulizia incompleta: ${cleanupErrors.join(', ')}; prefisso ${prefix}`)
const after = await contentSnapshot()
assert.deepEqual(after, before, 'L’inventario/revisione dei contenuti deve tornare identico a prima del test')
if (failure) throw new Error(failure)
console.log('PASS: pulizia fixture verificata; contenuti preesistenti invariati')
