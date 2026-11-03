import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import {chromium} from '@playwright/test'
import {mkdir,writeFile} from 'node:fs/promises'
const base=process.argv[2]||'http://127.0.0.1:3102'
if(process.platform==='linux')process.env.TMPDIR='/tmp'
await mkdir('test-results/lighthouse',{recursive:true})
const chrome=await chromeLauncher.launch({chromePath:chromium.executablePath(),chromeFlags:['--headless=new','--no-sandbox','--disable-dev-shm-usage']})
try {
  const results=[]
  for(const [name,path] of [['home','/'],['news','/news/'],['article','/2-8/']]) {
    const {lhr,report}=await lighthouse(base+path,{port:chrome.port,output:'json',onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error'})
    await writeFile(`test-results/lighthouse/${name}.json`,report)
    const result={name,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),LCP:lhr.audits['largest-contentful-paint'].numericValue,CLS:lhr.audits['cumulative-layout-shift'].numericValue,TBT:lhr.audits['total-blocking-time'].numericValue,issues:Object.entries(lhr.audits).filter(([,v])=>v.score!==null&&v.score<1&&v.scoreDisplayMode!=='informative').map(([id,v])=>({id,title:v.title,value:v.displayValue}))}
    results.push(result);console.log(JSON.stringify(result,null,2))
  }
  await writeFile('test-results/lighthouse/summary.json',JSON.stringify(results,null,2))
} finally {await chrome.kill()}
