import { chromium } from '@playwright/test'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { mkdir,writeFile } from 'node:fs/promises'

const before=process.argv[2]||'http://127.0.0.1:3101', after=process.argv[3]||'http://127.0.0.1:3102'
const output='test-results/visual';await mkdir(output,{recursive:true})
const browser=await chromium.launch({headless:true})
const results=[]
const paths=['/','/news/','/news/page/2/','/2-8/','/2-5/','/partner/']
for(const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
  for(const path of paths) {
    const images=[],dimensions=[]
    for(const [name,base] of [['before',before],['after',after]]) {
      const page=await browser.newPage({viewport,reducedMotion:'reduce'})
      // External embeds can vary between requests; compare the application itself.
      await page.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort())
      await page.goto(base+path,{waitUntil:'networkidle'})
      await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.reveal,.split-word{opacity:1!important;transform:none!important}iframe{visibility:hidden!important}'})
      await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>{i.loading='eager'});await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))})
      const buffer=await page.screenshot({fullPage:true,animations:'disabled'})
      const file=`${viewport.width}-${path.replaceAll('/','_')||'home'}-${name}.png`
      await writeFile(`${output}/${file}`,buffer)
      const png=PNG.sync.read(buffer);images.push(png);dimensions.push([png.width,png.height])
      await page.close()
    }
    const [a,b]=images
    const matchingSize=a.width===b.width&&a.height===b.height
    const different=matchingSize?pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0.1}):null
    results.push({path,viewport:viewport.width,dimensions,differentPixels:different,ratio:matchingSize?different/(a.width*a.height):null})
    console.log(results.at(-1))
  }
}
await browser.close()
await writeFile(`${output}/comparison.json`,JSON.stringify(results,null,2))
if(results.some(r=>r.ratio===null||r.ratio>0.002))process.exitCode=1
