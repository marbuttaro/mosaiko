import {mkdir,writeFile} from 'node:fs/promises'
const base=process.argv[2]||'http://127.0.0.1:3102'
const canonical='https://www.mosaiko.org'
const sitemap=await (await fetch(base+'/sitemap.xml')).text()
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname)
const pages=new Map(),resources=new Set(),links=[],issues=[]
async function pool(values,fn) {
  const queue=[...values]
  await Promise.all(Array.from({length:5},async()=>{while(queue.length)await fn(queue.shift())}))
}
const local=(value,path='/')=>{try{const u=new URL(value,canonical+path);return ['www.mosaiko.org','mosaiko.org',new URL(base).hostname].includes(u.hostname)?u:null}catch{return null}}
await pool(urls,async path=>{
  const response=await fetch(base+path,{redirect:'manual'}),html=await response.text()
  const row={path,status:response.status,title:html.match(/<title>(.*?)<\/title>/)?.[1],canonical:html.match(/<link rel="canonical" href="([^"]+)"/)?.[1],description:html.match(/<meta name="description" content="([^"]+)"/)?.[1],robots:response.headers.get('x-robots-tag'),html}
  pages.set(path,row)
  if(row.status!==200||!row.title||!row.description||row.canonical!==canonical+path)issues.push({path,reason:'Status or metadata invalid'})
  for(const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const url=local(match[1].replaceAll('&amp;','&'),path)
    if(url)links.push({source:path,path:url.pathname,hash:url.hash})
  }
  for(const match of html.matchAll(/<img\b([^>]+)>/g)) {
    const src=match[1].match(/src="([^"]+)"/)?.[1],url=src&&local(src)
    if(url)resources.add(url.pathname)
    if(!/alt="[^"]*"/.test(match[1]))issues.push({path,reason:'Missing image alt',src})
  }
})
await pool(new Set(links.map(l=>l.path).filter(p=>!pages.has(p))),async path=>{
  const response=await fetch(base+path,{redirect:'manual'}),html=await response.text()
  pages.set(path,{path,status:response.status,html})
})
for(const link of links) {
  const target=pages.get(link.path)
  if(target?.status!==200)issues.push({...link,reason:'Internal link is not a direct 200',status:target?.status})
  else if(link.hash && !target.html.includes(`id="${decodeURIComponent(link.hash.slice(1))}"`))issues.push({...link,reason:'Missing fragment target'})
}
await pool(resources,async path=>{const response=await fetch(base+path,{method:'HEAD',redirect:'manual'});if(response.status!==200)issues.push({path,reason:'Image is not a direct 200',status:response.status})})
const report={base,checkedAt:new Date().toISOString(),sitemapPages:urls.length,internalLinks:links.length,uniqueImages:resources.size,issues,pages:[...pages.values()].map(({html:_html,...row})=>row)}
await mkdir('test-results',{recursive:true});await writeFile('test-results/site-audit.json',JSON.stringify(report,null,2))
console.log(JSON.stringify({...report,pages:undefined},null,2))
if(issues.length)process.exitCode=1
