import {test,expect} from '@playwright/test'

const article=slug=>({kind:'news',slug,status:'draft',sort_order:0,data:{slug,title:'Smoke news',shortTitle:'Smoke news',date:'3 Nov 2026',isoDate:'2026-11-03',tags:['News'],image:'/images/hero-networking.jpg',imageAlt:'Networking',body:['Testo smoke', {heading:'Titolo'}, {list:['Voce']}, {quote:['Citazione']}, {image:'/images/hero-networking.jpg',alt:'Networking'}, {video:'dQw4w9WgXcQ'}]}})
async function token(request,email='admin@example.test') {
  const res=await request.post('http://127.0.0.1:54329/auth/v1/token?grant_type=password',{data:{email,password:'test-password-only'}})
  return (await res.json()).access_token
}

test('API rejects anonymous, expired and non-admin access',async({request})=>{
  expect((await request.get('/api/admin/content/')).status()).toBe(401)
  expect((await request.get('/api/admin/content/',{headers:{Authorization:'Bearer expired'}})).status()).toBe(401)
  expect((await request.get('/api/admin/content/',{headers:{Authorization:`Bearer ${await token(request,'user@example.test')}`}})).status()).toBe(403)
})

test('news CRUD, drafts, conflict detection, SSR metadata and deletion',async({request})=>{
  const headers={Authorization:`Bearer ${await token(request)}`}, slug=`smoke-news-${Date.now()}`
  const input=article(slug)
  const created=await request.post('/api/admin/content/',{headers,data:input})
  expect(created.status()).toBe(201)
  let item=(await created.json()).item
  expect((await request.get(`/${slug}/`)).status()).toBe(404)
  expect((await request.post('/api/admin/content/',{headers,data:input})).status()).toBe(409)
  expect((await request.patch(`/api/admin/content/${item.id}/`,{headers,data:input})).status()).toBe(409)
  input.status='published'
  const published=await request.patch(`/api/admin/content/${item.id}/`,{headers:{...headers,'If-Match':item.updated_at},data:input})
  expect(published.status()).toBe(200)
  const oldRevision=item.updated_at;item=(await published.json()).item
  const page=await request.get(`/${slug}/`)
  expect(page.status()).toBe(200)
  const html=await page.text()
  expect(html).toContain('Smoke news');expect(html).toContain(`https://www.mosaiko.org/${slug}/`);expect(html).toContain('NewsArticle')
  expect(await (await request.get('/sitemap.xml')).text()).toContain(`/${slug}/`)
  expect((await request.patch(`/api/admin/content/${item.id}/`,{headers:{...headers,'If-Match':oldRevision},data:input})).status()).toBe(409)
  expect((await request.patch(`/api/admin/content/${item.id}/`,{headers:{...headers,'If-Match':item.updated_at},data:{...input,slug:'changed',data:{...input.data,slug:'changed'}}})).status()).toBe(400)
  expect((await request.delete(`/api/admin/content/${item.id}/`,{headers:{...headers,'If-Match':item.updated_at}})).status()).toBe(200)
  expect((await request.get(`/${slug}/`)).status()).toBe(404)
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain(`/${slug}/`)
})

test('event CRUD updates homepage and removes unpublished content',async({request})=>{
  const headers={Authorization:`Bearer ${await token(request)}`}
  const input={kind:'event',slug:`smoke-event-${Date.now()}`,status:'draft',sort_order:0,data:{title:'Smoke event fixture',date:'3 Nov',fullDate:'3 Novembre 2026',time:'18:00',location:'Napoli',tag:'Networking',description:'Evento test',contact:'info@mosaiko.org',image:'/images/hero-networking.jpg'}}
  const result=await request.post('/api/admin/content/',{headers,data:input});expect(result.status()).toBe(201)
  let item=(await result.json()).item
  expect(await (await request.get('/')).text()).not.toContain(input.data.title)
  input.status='published'
  const updated=await request.patch(`/api/admin/content/${item.id}/`,{headers:{...headers,'If-Match':item.updated_at},data:input});expect(updated.status()).toBe(200);item=(await updated.json()).item
  expect(await (await request.get('/')).text()).toContain(input.data.title)
  expect((await request.delete(`/api/admin/content/${item.id}/`,{headers:{...headers,'If-Match':item.updated_at}})).status()).toBe(200)
  expect(await (await request.get('/')).text()).not.toContain(input.data.title)
})

test('invalid content and unsafe uploads are rejected; PNG upload works',async({request})=>{
  const headers={Authorization:`Bearer ${await token(request)}`}
  const invalid=article('invalid-test');invalid.data.body=['[x](javascript:alert)']
  expect((await request.post('/api/admin/content/',{headers,data:invalid})).status()).toBe(400)
  expect((await request.post('/api/admin/upload/',{headers,multipart:{file:{name:'evil.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg onload="alert(1)"/>')}}})).status()).toBe(400)
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nXsAAAAASUVORK5CYII=','base64')
  const uploaded=await request.post('/api/admin/upload/',{headers,multipart:{file:{name:'pixel.png',mimeType:'image/png',buffer:png}}})
  expect(uploaded.status()).toBe(201);expect((await uploaded.json()).url).toMatch(/cms-images\/.*\.png$/)
})

test('admin browser login, create/edit/delete and logout',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  await page.goto('/admin/')
  await page.getByLabel('Email',{exact:true}).fill('admin@example.test')
  await page.getByLabel('Password',{exact:true}).fill('test-password-only')
  await page.getByRole('button',{name:'Accedi',exact:true}).click()
  await page.getByRole('button',{name:'Nuova news',exact:true}).click()
  await page.getByLabel('Titolo',{exact:true}).fill('Browser smoke article')
  await page.getByLabel('Identificativo URL').fill(`browser-smoke-${Date.now()}`)
  await page.getByLabel('Titolo breve per le schede').fill('Browser smoke')
  await page.getByLabel('Immagine di copertina',{exact:true}).fill('/images/hero-networking.jpg')
  await page.getByLabel('Testo alternativo immagine',{exact:true}).fill('Networking')
  await page.getByLabel('Testo blocco 1',{exact:true}).fill('Corpo articolo di prova')
  await page.getByRole('button',{name:'Salva contenuto',exact:true}).click()
  await expect(page.getByRole('status')).toContainText('Bozza salvata')
  await page.getByLabel('Titolo',{exact:true}).fill('Browser smoke edited')
  await page.getByLabel('Stato',{exact:true}).selectOption('published')
  await page.getByRole('button',{name:'Salva contenuto',exact:true}).click()
  await expect(page.getByRole('status')).toContainText('Contenuto pubblicato')
  page.once('dialog',dialog=>dialog.accept())
  await page.getByRole('button',{name:'Elimina contenuto',exact:true}).click()
  await expect(page.getByRole('status')).toContainText('Contenuto eliminato')
  await page.getByRole('button',{name:'Esci',exact:true}).click()
  await expect(page.getByRole('button',{name:'Accedi',exact:true})).toBeVisible()
  expect(errors).toEqual([])
})

for(const viewport of [{width:1440,height:1000},{width:390,height:844}])test(`public smoke at ${viewport.width}px`,async({page})=>{
  await page.setViewportSize(viewport)
  const errors=[];page.on('pageerror',e=>errors.push(e.message))
  for(const path of ['/','/news/','/news/page/2/','/2-8/','/partner/']) {
    const response=await page.goto(path);expect(response.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://www.mosaiko.org${path}`)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true)
  }
  expect((await page.goto('/non-existent-smoke-check/')).status()).toBe(404)
  expect(errors).toEqual([])
})
