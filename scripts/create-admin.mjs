import {createClient} from '@supabase/supabase-js'
const {NEXT_PUBLIC_SUPABASE_URL:url,SUPABASE_SERVICE_ROLE_KEY:key,CMS_ADMIN_EMAIL:email,CMS_ADMIN_PASSWORD:password}=process.env
if(!url||!key||!email||!password||password.length<14)throw new Error('Imposta URL, service role, CMS_ADMIN_EMAIL e una password distinta di almeno 14 caratteri in un file locale escluso da Git.')
const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
let existing
for(let page=1; ;page++) {
  const {data,error}=await db.auth.admin.listUsers({page,perPage:100})
  if(error)throw error
  existing=data.users.find(user=>user.email?.toLowerCase()===email.toLowerCase())
  if(existing||data.users.length<100)break
}
if(!existing) {
  const {data,error}=await db.auth.admin.createUser({email,password,email_confirm:true})
  if(error)throw error
  existing=data.user
}
const {error}=await db.from('cms_admins').upsert({user_id:existing.id},{onConflict:'user_id',ignoreDuplicates:true})
if(error)throw error
console.log('Amministratore configurato. La password di un account preesistente non viene modificata.')
