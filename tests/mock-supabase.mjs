// Test-only HTTP fixture. Authentication/storage are simulated; PostgreSQL RLS is
// tested separately against the real migration in cms-security.test.mjs.
import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { allNews } from '../src/data/tutte-le-news.js'
import { events } from '../src/data/content.js'

const adminId='00000000-0000-4000-8000-000000000001'
const userId='00000000-0000-4000-8000-000000000002'
const jwt=id=>[Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),Buffer.from(JSON.stringify({sub:id,role:'authenticated',exp:Math.floor(Date.now()/1000)+86400})).toString('base64url'),'test-signature'].join('.')
const adminToken=jwt(adminId), userToken=jwt(userId)
const user=id=>({id,aud:'authenticated',role:'authenticated',email:id===adminId?'admin@example.test':'user@example.test',app_metadata:{provider:'email'},user_metadata:{},created_at:new Date().toISOString()})
let items=[...allNews.map((data,i)=>({kind:'news',slug:data.slug,data,sort_order:i})),...events.map((data,i)=>({kind:'event',slug:`event-${i}`,data,sort_order:i}))].map(item=>({...item,id:randomUUID(),status:'published',created_at:new Date().toISOString(),updated_at:new Date().toISOString()}))
const uploads=new Map()
const server=createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Headers','*')
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,OPTIONS')
  const send=(data,status=200)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data))}
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return}
  const url=new URL(req.url,'http://localhost'), path=url.pathname
  const token=req.headers.authorization?.replace('Bearer ','')
  const id=token===adminToken?adminId:token===userToken?userId:null
  const admin=id===adminId
  const chunks=[];for await(const chunk of req)chunks.push(chunk)
  const bytes=Buffer.concat(chunks)
  const body=()=>JSON.parse(bytes.toString()||'{}')
  try {
    if(path==='/health')return send({ok:true})
    if(path==='/auth/v1/token') {
      const input=body()
      if(input.password!=='test-password-only' || !['admin@example.test','user@example.test'].includes(input.email))return send({msg:'Invalid login credentials'},400)
      const uid=input.email==='admin@example.test'?adminId:userId
      return send({access_token:uid===adminId?adminToken:userToken,token_type:'bearer',expires_in:86400,refresh_token:'fixture-refresh-token',user:user(uid)})
    }
    if(path==='/auth/v1/user')return id?send(user(id)):send({msg:'Invalid JWT'},401)
    if(path==='/auth/v1/logout'){res.writeHead(204);res.end();return}
    if(path==='/rest/v1/cms_admins')return send(admin?[{user_id:adminId}]:[])
    if(path==='/rest/v1/cms_content') {
      if(req.method!=='GET' && !admin)return send({message:'permission denied'},403)
      let filtered=items.filter(item=>(admin || item.status==='published') && [...url.searchParams].every(([key,value])=>!value.startsWith('eq.') || String(item[key])===value.slice(3)))
      if(req.method==='GET') {
        filtered.sort((a,b)=>a.sort_order-b.sort_order || b.created_at.localeCompare(a.created_at) || a.id.localeCompare(b.id))
        const offset=Number(url.searchParams.get('offset')||0),limit=Number(url.searchParams.get('limit')||1000)
        filtered=filtered.slice(offset,offset+limit)
        if(url.searchParams.get('select')==='data')filtered=filtered.map(({data})=>({data}))
      } else if(req.method==='POST') {
        const input=body()
        if(items.some(x=>x.kind===input.kind&&x.slug===input.slug))return send({code:'23505',message:'duplicate'},409)
        const item={...input,id:randomUUID(),created_at:new Date().toISOString(),updated_at:new Date().toISOString()}
        items.push(item);filtered=[item]
      } else if(req.method==='PATCH') {
        const input=body()
        filtered=filtered.map(item=>{Object.assign(item,input,{updated_at:new Date().toISOString()});return item})
      } else if(req.method==='DELETE')items=items.filter(item=>!filtered.includes(item))
      if(req.headers.accept?.includes('vnd.pgrst.object+json'))return filtered.length===1?send(filtered[0],req.method==='POST'?201:200):send({code:'PGRST116',details:`The result contains ${filtered.length} rows`},406)
      return send(filtered,req.method==='POST'?201:200)
    }
    if(path.startsWith('/storage/v1/object/public/cms-images/')) {
      const content=uploads.get(path.split('/').at(-1))
      if(!content)return send({},404)
      res.writeHead(200,{'Content-Type':'image/png'});res.end(content);return
    }
    if(path.startsWith('/storage/v1/object/cms-images/')&&req.method==='POST') {
      if(!admin)return send({},403)
      const name=path.split('/').at(-1);uploads.set(name,bytes)
      return send({Key:`cms-images/${name}`,Id:randomUUID()})
    }
    send({message:'Unknown fixture endpoint'},404)
  } catch(error){send({message:error.message},500)}
})
server.listen(54329,'127.0.0.1',()=>console.log('Supabase test fixture on 54329'))
