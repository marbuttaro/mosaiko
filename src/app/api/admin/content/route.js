import { requireAdmin, reply, failure, readJson, CmsError } from '../../../../lib/cms/auth'
import { contentSchema } from '../../../../lib/cms/schema'

export async function GET(request) {
  try {
    const db=await requireAdmin(request)
    const items=[]
    for(let offset=0; ; offset+=500) {
      const {data,error}=await db.from('cms_content').select('*').order('sort_order').order('created_at',{ascending:false}).order('id').range(offset,offset+499)
      if(error) throw error
      items.push(...data)
      if(data.length<500) break
    }
    return reply({items})
  } catch(error) { return failure(error) }
}
export async function POST(request) {
  try {
    const db=await requireAdmin(request)
    const item=contentSchema.parse(await readJson(request))
    const {data,error}=await db.from('cms_content').insert(item).select().single()
    if(error?.code==='23505') throw new CmsError('Questo URL è già utilizzato',409)
    if(error) throw error
    return reply({item:data},201)
  } catch(error) { return failure(error) }
}
