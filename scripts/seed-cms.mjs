import { createClient } from '@supabase/supabase-js'
import { allNews } from '../src/data/tutte-le-news.js'
import { events } from '../src/data/content.js'
import { contentSchema } from '../src/lib/cms/schema.js'

const rows=[
  ...allNews.map((original,i)=>{const data={...original,body:original.body.map(block=>typeof block==='object' && block.image ? {...block,alt:block.alt || original.title} : block)}; return ({kind:'news',slug:data.slug,status:'published',sort_order:i,data})}),
  ...events.map((data,i)=>({kind:'event',slug:['napoli-futsal-sporting-sala-consilina','gran-premio-anact-stakes','juve-stabia-hellas-verona'][i],status:'published',sort_order:i,data})),
].map(row=>contentSchema.parse(row))
if(process.argv.includes('--validate')) {
  console.log(`Validi: ${allNews.length} articoli e ${events.length} eventi.`)
} else {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY
  if(!url || !key) throw new Error('Mancano URL Supabase o service role locale')
  const db=createClient(url,key,{auth:{persistSession:false}})
  // Ripetibile: importa solo le righe assenti, senza sovrascrivere modifiche editoriali.
  const {error}=await db.from('cms_content').upsert(rows,{onConflict:'kind,slug',ignoreDuplicates:true})
  if(error) throw error
  console.log(`Importazione completata: ${rows.length} contenuti (esistenti preservati).`)
}
