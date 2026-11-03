'use client'

import { Children, cloneElement, isValidElement, useEffect, useId, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { contentSchema } from '../../lib/cms/schema'
import { NewsArticlePage } from '../NewsPages'
import UpcomingEvents from '../UpcomingEvents'

const inputClass='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 disabled:bg-slate-100'
const buttonClass='rounded-lg bg-mosaiko-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50'
const smallClass='rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 disabled:opacity-50'
function Field({label,children}) {
  const id=useId()
  return <div className="grid gap-1.5 text-sm font-medium text-slate-700"><label htmlFor={id}>{label}</label>{Children.map(children,child=>isValidElement(child)&&['input','select','textarea'].includes(child.type)?cloneElement(child,{id}):child)}</div>
}
const today=()=>new Date().toISOString().slice(0,10)
const displayDate=(value)=>new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value))
const empty=(kind)=>({kind,slug:'',status:'draft',sort_order:0,data:kind==='news'
  ? {slug:'',title:'',shortTitle:'',date:displayDate(today()),isoDate:today(),subtitle:'',description:'',tags:['News'],image:'',imageAlt:'',body:['']}
  : {title:'',date:'',fullDate:'',time:'',location:'',tag:'',description:'',contact:'info@mosaiko.org',image:'',imageAlt:''}})
const blockType=(block)=>typeof block==='string'?'paragraph':Object.keys(block)[0]
const newBlock=(type)=>({paragraph:'',heading:{heading:''},list:{list:['']},quote:{quote:['']},image:{image:'',alt:''},video:{video:''}}[type])
let browserClient
function getBrowserClient() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if(!url || !key) return null
  // One GoTrue client per browser prevents competing session locks in Strict Mode.
  if(typeof window==='undefined') return null
  return browserClient ||= createClient(url,key)
}

export default function AdminDashboard() {
  const client=useMemo(()=>getBrowserClient(),[])
  const [session,setSession]=useState(null), [initializing,setInitializing]=useState(true)
  const [items,setItems]=useState([]), [kind,setKind]=useState('news'), [search,setSearch]=useState('')
  const [draft,setDraft]=useState(null), [dirty,setDirty]=useState(false), [busy,setBusy]=useState(false)
  const [error,setError]=useState(''), [message,setMessage]=useState(''), [authorized,setAuthorized]=useState(false)
  const [email,setEmail]=useState(''), [password,setPassword]=useState('')
  const [blockChoice,setBlockChoice]=useState('paragraph'), [preview,setPreview]=useState(false)

  useEffect(()=>{
    if(!client) return
    let active=true
    client.auth.getSession().then(({data,error})=>{if(active){setSession(data.session);if(error)setError('Sessione non disponibile')}})
      .catch(()=>{if(active)setError('Sessione non disponibile. Ricarica la pagina.')})
      .finally(()=>{if(active)setInitializing(false)})
    const {data:{subscription}}=client.auth.onAuthStateChange((_event,value)=>{if(active){setAuthorized(false);setSession(value);setInitializing(false)}})
    return ()=>{active=false;subscription.unsubscribe()}
  },[client])
  useEffect(()=>{
    if(!session || !client) return
    let active=true
    fetch('/api/admin/content/',{headers:{Authorization:`Bearer ${session.access_token}`},cache:'no-store'})
      .then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error);return data})
      .then(data=>{if(active){setItems(data.items);setAuthorized(true)}})
      .catch(e=>{if(active){setError(e.message);setAuthorized(false)}})
    return ()=>{active=false}
  },[session,client])
  useEffect(()=>{
    const warn=e=>{if(dirty){e.preventDefault();e.returnValue=''}}
    window.addEventListener('beforeunload',warn)
    return ()=>window.removeEventListener('beforeunload',warn)
  },[dirty])

  async function api(path,options={}) {
    const {data:{session:current}}=await client.auth.getSession()
    if(!current) throw new Error('Sessione scaduta: accedi nuovamente')
    const response=await fetch(path,{...options,headers:{...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),Authorization:`Bearer ${current.access_token}`,...options.headers},cache:'no-store'})
    const data=await response.json()
    if(!response.ok) throw new Error(data.error || 'Operazione non riuscita')
    return data
  }
  async function login(e) {
    e.preventDefault();setBusy(true);setError('')
    try {
      const {error}=await client.auth.signInWithPassword({email,password})
      if(error) throw new Error('Accesso non riuscito. Verifica email e password.')
      setPassword('')
    } catch(e) {setError(e.message)} finally {setBusy(false)}
  }
  const canLeave=()=>!dirty || window.confirm('Abbandonare le modifiche non salvate?')
  const choose=item=>{if(!canLeave())return;setDraft(structuredClone(item));setDirty(false);setPreview(false);setError('');setMessage('')}
  const change=(key,value)=>{setDraft(d=>({...d,[key]:value}));setDirty(true)}
  const changeData=(key,value)=>{setDraft(d=>({...d,data:{...d.data,[key]:value}}));setDirty(true)}
  const changeBlock=(i,value)=>changeData('body',draft.data.body.map((block,index)=>index===i?value:block))
  async function save(e) {
    e.preventDefault();setBusy(true);setError('');setMessage('')
    try {
      const data={...draft.data}
      if(draft.kind==='news'){data.slug=draft.slug;if(draft.id)data.modified=today()}
      const input=contentSchema.parse({kind:draft.kind,slug:draft.slug,status:draft.status,sort_order:Number(draft.sort_order),data})
      const result=await api(`/api/admin/content/${draft.id?`${draft.id}/`:''}`,{method:draft.id?'PATCH':'POST',headers:draft.id?{'If-Match':draft.updated_at}:{},body:JSON.stringify(input)})
      setItems(rows=>[...rows.filter(row=>row.id!==result.item.id),result.item].sort((a,b)=>a.sort_order-b.sort_order))
      setDraft(result.item);setDirty(false);setMessage(result.item.status==='published'?'Contenuto pubblicato. Il sito è aggiornato.':'Bozza salvata. Non è visibile sul sito.')
    } catch(e) {setError(e.issues?e.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; '):e.message)} finally {setBusy(false)}
  }
  async function remove() {
    if(!window.confirm(`Eliminare definitivamente “${draft.data.title}”? Il contenuto verrà rimosso dal sito.`))return
    setBusy(true);setError('')
    try {
      await api(`/api/admin/content/${draft.id}/`,{method:'DELETE',headers:{'If-Match':draft.updated_at}})
      setItems(rows=>rows.filter(row=>row.id!==draft.id));setDraft(null);setDirty(false);setMessage('Contenuto eliminato.')
    } catch(e) {setError(e.message)} finally {setBusy(false)}
  }
  async function upload(file,blockIndex=null) {
    if(!file)return
    setBusy(true);setError('')
    try {
      if(file.size>4000000)throw new Error('Immagine troppo grande (massimo 4 MB)')
      const form=new FormData();form.set('file',file)
      const {url}=await api('/api/admin/upload/',{method:'POST',body:form})
      if(blockIndex===null)changeData('image',url)
      else changeBlock(blockIndex,{...draft.data.body[blockIndex],image:url})
      setMessage('Immagine caricata. Salva il contenuto per applicarla.')
    } catch(e) {setError(e.message)} finally {setBusy(false)}
  }
  async function logout() {
    if(!canLeave())return
    setBusy(true)
    try {await client.auth.signOut({scope:'local'});setDraft(null);setItems([]);setDirty(false);setError('');setMessage('')}
    finally {setBusy(false)}
  }
  function moveBlock(i,direction) {
    const body=[...draft.data.body], target=i+direction
    if(target<0 || target>=body.length)return
    ;[body[i],body[target]]=[body[target],body[i]];changeData('body',body)
  }
  const visible=items.filter(item=>item.kind===kind && `${item.data.title} ${item.slug} ${item.status}`.toLowerCase().includes(search.toLowerCase()))
  return <section className="mx-auto max-w-7xl px-6 pb-20 pt-36 text-slate-900">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-semibold">Gestione news ed eventi</h1><p className="mt-2 text-slate-600">Crea, modifica e pubblica i contenuti di Mosaiko.</p></div>{session && <button type="button" className={smallClass} onClick={logout} disabled={busy}>Esci</button>}</div>
    {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</p>}
    {message && <p role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">{message}</p>}
    {!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? <p className="rounded-xl bg-white p-6">La dashboard è in configurazione. L’accesso sarà disponibile dopo l’attivazione del database.</p>
      : initializing ? <p role="status">Caricamento…</p>
      : !session ? <form onSubmit={login} className="grid max-w-md gap-5 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Accesso amministratore</h2>
        <Field label="Email"><input className={inputClass} type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></Field>
        <Field label="Password"><input className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></Field>
        <button className={buttonClass} disabled={busy}>{busy?'Accesso…':'Accedi'}</button>
      </form> : !authorized ? <p role="status">{error?'Questo account non dispone dell’accesso ai contenuti.':'Verifica accesso…'}</p> : <>
        <div className="mb-6 flex flex-wrap gap-3"><button className={kind==='news'?buttonClass:smallClass} onClick={()=>{if(canLeave()){setKind('news');setDraft(null);setDirty(false)}}}>News</button><button className={kind==='event'?buttonClass:smallClass} onClick={()=>{if(canLeave()){setKind('event');setDraft(null);setDirty(false)}}}>Eventi</button><button className={smallClass} onClick={()=>choose(empty(kind))}>{kind==='news'?'Nuova news':'Nuovo evento'}</button></div>
        <div className="grid items-start gap-7 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-xl bg-white p-4 shadow-sm"><Field label="Cerca contenuti"><input type="search" className={inputClass} value={search} onChange={e=>setSearch(e.target.value)}/></Field><p className="my-3 text-xs text-slate-500">{visible.length} contenuti</p><ul className="max-h-[70vh] space-y-2 overflow-y-auto">{visible.map(item=><li key={item.id}><button className={`w-full rounded-lg border p-3 text-left ${draft?.id===item.id?'border-blue-600 bg-blue-50':'border-slate-200'}`} onClick={()=>choose(item)}><span className="block text-sm font-medium">{item.data.title}</span><span className="mt-1 block text-xs text-slate-500">{item.status==='published'?'Pubblicato':'Bozza'} · Ordine {item.sort_order}</span></button></li>)}</ul></aside>
          {!draft ? <p className="rounded-xl bg-white p-6">Seleziona un contenuto oppure creane uno nuovo.</p> : <form onSubmit={save} className="grid gap-5 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{draft.id?'Modifica':'Crea'} {draft.kind==='news'?'news':'evento'}</h2>
            <Field label="Titolo"><input required className={inputClass} value={draft.data.title} maxLength={300} onChange={e=>changeData('title',e.target.value)}/></Field>
            <Field label="Identificativo URL"><input required className={inputClass} value={draft.slug} disabled={!!draft.id} pattern="[a-z0-9]+(-[a-z0-9]+)*" onChange={e=>change('slug',e.target.value)}/><span className="text-xs text-slate-500">Lettere minuscole, numeri e trattini. Rimane stabile dopo la creazione per conservare i collegamenti.</span></Field>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Stato"><select className={inputClass} value={draft.status} onChange={e=>change('status',e.target.value)}><option value="draft">Bozza</option><option value="published">Pubblicato</option></select></Field><Field label="Ordine (0 = primo)"><input className={inputClass} type="number" min="0" max="1000000" required value={draft.sort_order} onChange={e=>change('sort_order',e.target.value)}/></Field></div>
            {draft.kind==='news' && <>
              <Field label="Titolo breve per le schede"><input required className={inputClass} value={draft.data.shortTitle} onChange={e=>changeData('shortTitle',e.target.value)}/></Field>
              <Field label="Data di pubblicazione"><input required className={inputClass} type="date" value={draft.data.isoDate} onChange={e=>{changeData('isoDate',e.target.value);if(e.target.value)changeData('date',displayDate(e.target.value))}}/></Field>
              <Field label="Sottotitolo"><textarea className={inputClass} rows={3} value={draft.data.subtitle||''} onChange={e=>changeData('subtitle',e.target.value)}/></Field>
              <Field label="Descrizione per motori di ricerca"><textarea className={inputClass} rows={3} maxLength={500} value={draft.data.description||''} onChange={e=>changeData('description',e.target.value)}/></Field>
              <Field label="Categorie (separate da virgola)"><input className={inputClass} required value={draft.data.tags.join(', ')} onChange={e=>changeData('tags',e.target.value.split(',').map(v=>v.trim()))}/></Field>
            </>}
            <Field label="Data visualizzata"><input required className={inputClass} value={draft.data.date} onChange={e=>changeData('date',e.target.value)}/></Field>
            {draft.kind==='event' && <>
              {[["fullDate","Data completa"],["time","Orario"],["location","Luogo"],["tag","Tipologia (es. Calcio, Futsal, Ippica)"],["contact","Email di contatto"]].map(([key,label])=><Field key={key} label={label}><input required className={inputClass} type={key==='contact'?'email':'text'} value={draft.data[key]} onChange={e=>changeData(key,e.target.value)}/></Field>)}
              <Field label="Descrizione evento"><textarea required className={inputClass} rows={6} value={draft.data.description} onChange={e=>changeData('description',e.target.value)}/></Field>
            </>}
            <Field label="Immagine di copertina"><input required className={inputClass} value={draft.data.image} placeholder="/images/… oppure https://…" onChange={e=>changeData('image',e.target.value)}/></Field>
            <Field label="Carica immagine (JPG, PNG o WebP; massimo 4 MB)"><input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>upload(e.target.files?.[0])}/></Field>
            <Field label="Testo alternativo immagine"><input required={draft.kind==='news'} className={inputClass} value={draft.data.imageAlt||''} onChange={e=>changeData('imageAlt',e.target.value)}/></Field>
            {draft.kind==='news' && <fieldset className="grid gap-4 border-t border-slate-200 pt-5"><legend className="text-lg font-semibold">Corpo dell’articolo</legend><p className="text-xs text-slate-600">Usa **testo** per il grassetto e [testo](https://indirizzo) per i link.</p>
              {draft.data.body.map((block,i)=>{const type=blockType(block);return <div className="grid gap-3 rounded-lg border border-slate-200 p-4" key={i}>
                <div className="flex flex-wrap items-center gap-2"><strong className="mr-auto text-sm">Blocco {i+1} · {({paragraph:'Paragrafo',heading:'Titolo',list:'Elenco',quote:'Citazione',image:'Immagine',video:'Video'})[type]}</strong><button type="button" aria-label={`Sposta su blocco ${i+1}`} className={smallClass} disabled={i===0} onClick={()=>moveBlock(i,-1)}>↑</button><button type="button" aria-label={`Sposta giù blocco ${i+1}`} className={smallClass} disabled={i===draft.data.body.length-1} onClick={()=>moveBlock(i,1)}>↓</button><button type="button" className={smallClass} onClick={()=>changeData('body',draft.data.body.filter((_,index)=>index!==i))}>Rimuovi blocco</button></div>
                {['paragraph','heading','list','quote'].includes(type) && <Field label={`Testo blocco ${i+1}`}><textarea className={inputClass} rows={type==='heading'?2:5} required value={type==='paragraph'?block:[].concat(block[type]).join('\n')} onChange={e=>changeBlock(i,type==='paragraph'?e.target.value:{[type]:['list','quote'].includes(type)?e.target.value.split('\n'):e.target.value})}/>{['list','quote'].includes(type)&&<span className="text-xs text-slate-500">Un elemento o paragrafo per riga.</span>}</Field>}
                {type==='image' && <><Field label={`URL immagine blocco ${i+1}`}><input className={inputClass} required value={block.image} onChange={e=>changeBlock(i,{...block,image:e.target.value})}/></Field><Field label={`Descrizione immagine blocco ${i+1}`}><input className={inputClass} required value={block.alt} onChange={e=>changeBlock(i,{...block,alt:e.target.value})}/></Field><input aria-label={`Carica immagine blocco ${i+1}`} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>upload(e.target.files?.[0],i)}/></>}
                {type==='video' && <Field label={`ID video YouTube blocco ${i+1}`}><input className={inputClass} required pattern="[a-zA-Z0-9_-]{11}" value={block.video} onChange={e=>changeBlock(i,{video:e.target.value})}/></Field>}
              </div>})}
              <div className="flex flex-wrap gap-3"><select aria-label="Tipo di blocco" className={inputClass+' max-w-xs'} value={blockChoice} onChange={e=>setBlockChoice(e.target.value)}>{[['paragraph','Paragrafo'],['heading','Titolo'],['list','Elenco'],['quote','Citazione'],['image','Immagine'],['video','Video YouTube']].map(([v,label])=><option key={v} value={v}>{label}</option>)}</select><button type="button" className={smallClass} onClick={()=>changeData('body',[...draft.data.body,newBlock(blockChoice)])}>Aggiungi blocco</button></div>
            </fieldset>}
            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5"><button className={buttonClass} disabled={busy}>{busy?'Salvataggio…':'Salva contenuto'}</button><button type="button" className={smallClass} onClick={()=>setPreview(v=>!v)}>Anteprima</button>{draft.id && <button type="button" className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700" disabled={busy} onClick={remove}>Elimina contenuto</button>}</div>
            {dirty && <p className="text-xs text-amber-800">Modifiche non salvate</p>}
          </form>}
        </div>
        {preview && draft && <div className="mt-8 overflow-hidden rounded-xl border border-slate-300"><p className="bg-white p-4 font-semibold">Anteprima — le modifiche non sono ancora pubblicate</p>{draft.kind==='news'?<NewsArticlePage slug={draft.slug} allNews={[{...draft.data,slug:draft.slug}]}/>:<UpcomingEvents events={[draft.data]}/>}</div>}
      </>}
  </section>
}
