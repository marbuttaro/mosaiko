import { requireAdmin, reply, failure, CmsError } from '../../../../lib/cms/auth'

export async function POST(request) {
  try {
    const db=await requireAdmin(request)
    if(Number(request.headers.get('content-length'))>4500000) throw new CmsError('Immagine troppo grande (massimo 4 MB)',413)
    const file=(await request.formData()).get('file')
    if(!file || typeof file==='string' || file.size>4000000 || !file.size) throw new CmsError('Seleziona un’immagine di massimo 4 MB',400)
    const bytes=new Uint8Array(await file.arrayBuffer())
    let ext
    if(bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff) ext='jpg'
    else if([137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b)) ext='png'
    else if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF' && new TextDecoder().decode(bytes.slice(8,12))==='WEBP') ext='webp'
    else throw new CmsError('Sono supportate immagini JPG, PNG e WebP',400)
    const path=`${crypto.randomUUID()}.${ext}`
    const {error}=await db.storage.from('cms-images').upload(path,bytes,{contentType:`image/${ext==='jpg'?'jpeg':ext}`,upsert:false})
    if(error) throw error
    return reply({url:db.storage.from('cms-images').getPublicUrl(path).data.publicUrl},201)
  } catch(error) { return failure(error) }
}
