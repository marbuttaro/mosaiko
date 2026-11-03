import { NextResponse } from 'next/server'
import migration from './data/legacy-redirects.json'

export function proxy(request) {
  const url=request.nextUrl
  let path
  try {path=decodeURIComponent(url.pathname)} catch {return NextResponse.next()}
  let destination=migration.paths[path]
  if(path==='/') {
    const id=url.searchParams.get('p') || url.searchParams.get('page_id')
    if(id) {
      if(!Object.hasOwn(migration.ids,id))return new NextResponse(null,{status:404})
      destination=migration.ids[id]
    }
    if(url.searchParams.get('feed')==='rss2' || url.searchParams.get('feed')==='rss')destination='/feed/'
  }
  if(!destination) return NextResponse.next()
  const target=new URL(destination,url.origin)
  for(const [key,value] of url.searchParams)if(!['p','page_id','feed','paged'].includes(key))target.searchParams.append(key,value)
  return NextResponse.redirect(target,308)
}

export const config={matcher:['/((?!_next/static|_next/image|api/|admin/|images/|logo/|favicon).*)']}
