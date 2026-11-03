import { createClient } from '@supabase/supabase-js'

export class CmsError extends Error {
  constructor(message,status) { super(message); this.status=status }
}
export async function requireAdmin(request) {
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1]
  if (!token) throw new CmsError('Accesso richiesto',401)
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new CmsError('Dashboard non ancora configurata',503)
  const db=createClient(url,key, {auth:{persistSession:false,autoRefreshToken:false}, global:{headers:{Authorization:`Bearer ${token}`}}})
  const {data:{user},error}=await db.auth.getUser(token)
  if(error || !user) throw new CmsError('Sessione scaduta: accedi nuovamente',401)
  const {data:admin,error:adminError}=await db.from('cms_admins').select('user_id').eq('user_id',user.id).maybeSingle()
  if(adminError) throw new CmsError('Verifica autorizzazioni non disponibile',503)
  if(!admin) throw new CmsError('Account non autorizzato',403)
  return db
}
export function reply(data,status=200) {
  return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}})
}
export function failure(error) {
  if(error.name==='ZodError') return reply({error:error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')},400)
  if(error instanceof SyntaxError) return reply({error:'Dati non validi'},400)
  return reply({error:error.status ? error.message : 'Operazione non riuscita. Riprova.'},error.status || 500)
}
export async function readJson(request) {
  const body=await request.text()
  if(body.length>500000) throw new CmsError('Contenuto troppo grande',413)
  return JSON.parse(body)
}
