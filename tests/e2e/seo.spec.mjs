import {test,expect} from '@playwright/test'
import migration from '../../src/data/legacy-redirects.json' with {type:'json'}
import {allNews} from '../../src/data/tutte-le-news.js'

test('all seeded articles and sitemap entries have unique canonical, title, description and SSR content',async({request})=>{
  const sitemap=await (await request.get('/sitemap.xml')).text()
  const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1])
  expect(new Set(urls).size).toBe(urls.length)
  expect(urls).toHaveLength(51)
  for(const url of urls) {
    const response=await request.get(new URL(url).pathname)
    expect(response.status(),url).toBe(200)
    const html=await response.text()
    expect((html.match(/rel="canonical"/g)||[]).length,url).toBe(1)
    expect(html,url).toContain(`href="${url}"`)
    expect(html,url).toMatch(/<title>[^<]+<\/title>/)
    expect(html,url).toMatch(/name="description" content="[^"]+"/)
    expect(html,url).toContain('<h1')
    for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))expect(()=>JSON.parse(match[1])).not.toThrow()
  }
  for(const item of allNews)expect(urls).toContain(`https://www.mosaiko.org/${item.slug}/`)
})

test('all migration redirects resolve in one hop to their explicit destination',async({request})=>{
  test.setTimeout(180000)
  for(const [path,destination] of Object.entries(migration.paths)) {
    const res=await request.get(path,{maxRedirects:0})
    expect(res.status(),path).toBe(308)
    const actual=new URL(res.headers().location,'http://127.0.0.1:3100')
    const expected=new URL(destination,'http://127.0.0.1:3100')
    expect(actual.href,path).toBe(expected.href)
  }
  for(const target of new Set(Object.values(migration.paths))) {
    if(target.startsWith('https:'))continue
    expect((await request.get(target.split('#')[0],{maxRedirects:0})).status(),target).toBe(200)
  }
  for(const [id,target] of Object.entries(migration.ids)) {
    const response=await request.get(`/?p=${id}`,{maxRedirects:0})
    expect(response.status(),id).toBe(308)
    expect(new URL(response.headers().location,'http://127.0.0.1:3100').href).toBe(new URL(target,'http://127.0.0.1:3100').href)
  }
  expect((await request.get('/?p=99999999')).status()).toBe(404)
})

test('robots, RSS, noindex admin and genuine missing-page statuses',async({request})=>{
  const robots=await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Sitemap: https://www.mosaiko.org/sitemap.xml')
  expect(robots).toContain('Disallow: /admin/');expect(robots).not.toMatch(/Disallow: \/\s*\n/)
  const feed=await request.get('/feed/');expect(feed.status()).toBe(200);expect(feed.headers()['content-type']).toContain('application/rss+xml')
  expect(await feed.text()).toContain('<rss version="2.0"')
  expect(await (await request.get('/admin/')).text()).toContain('noindex')
  for(const path of ['/news/page/0/','/news/page/999/','/wp-admin/','/wp-login.php','/comments/feed/'])expect((await request.get(path)).status(),path).toBe(404)
  const page1=await request.get('/news/page/1/',{maxRedirects:0});expect(page1.status()).toBe(308)
})
