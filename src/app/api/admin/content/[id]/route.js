import { z } from 'zod'
import { requireAdmin, reply, failure, readJson, CmsError } from '../../../../../lib/cms/auth'
import { contentSchema } from '../../../../../lib/cms/schema'

async function current(request,params) {
  const db=await requireAdmin(request)
  const {id}=await params
  z.string().uuid().parse(id)
  const {data,error}=await db.from('cms_content').select('*').eq('id',id).maybeSingle()
  if(error) throw error
  if(!data) throw new CmsError('Contenuto non trovato',404)
  const revision=request.headers.get('if-match')
  if(!revision || revision!==data.updated_at) throw new CmsError('Il contenuto è cambiato. Ricarica prima di salvarlo.',409)
  return {db,item:data}
}
export async function PATCH(request,{params}) {
  try {
    const {db,item}=await current(request,params)
    const input=contentSchema.parse(await readJson(request))
    if(input.slug!==item.slug || input.kind!==item.kind) throw new CmsError('URL e tipo restano invariati per preservare i collegamenti esistenti',400)
    const {data,error}=await db.from('cms_content').update(input).eq('id',item.id).eq('updated_at',item.updated_at).select().maybeSingle()
    if(error) throw error
    if(!data) throw new CmsError('Modifica contemporanea: ricarica il contenuto',409)
    return reply({item:data})
  } catch(error) { return failure(error) }
}
export async function DELETE(request,{params}) {
  try {
    const {db,item}=await current(request,params)
    const {data,error}=await db.from('cms_content').delete().eq('id',item.id).eq('updated_at',item.updated_at).select('id')
    if(error) throw error
    if(!data?.length) throw new CmsError('Modifica contemporanea: ricarica il contenuto',409)
    return reply({deleted:true})
  } catch(error) { return failure(error) }
}
