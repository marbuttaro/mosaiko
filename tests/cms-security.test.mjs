import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
import { contentSchema } from '../src/lib/cms/schema.js'

test('database RLS: anonymous and regular users cannot read drafts, write content or grant admin access', async () => {
  const db=new PGlite()
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create schema storage;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema public,auth,storage to anon,authenticated;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
    alter table storage.objects enable row level security;
    grant select,insert,delete on storage.objects to authenticated;
    insert into auth.users values ('00000000-0000-4000-8000-000000000001'),('00000000-0000-4000-8000-000000000002');`)
  const migrationDir=new URL('../supabase/migrations/',import.meta.url)
  for(const file of (await readdir(migrationDir)).filter(file=>file.endsWith('.sql')).sort()) {
    await db.exec(await readFile(new URL(file,migrationDir),'utf8'))
  }
  assert.equal((await db.query("select prosecdef from pg_proc where oid='public.is_cms_admin()'::regprocedure")).rows[0].prosecdef,false)
  await db.exec(`insert into public.cms_admins(user_id) values('00000000-0000-4000-8000-000000000001');`)
  async function as(role,id,fn) {
    await db.exec(`set role ${role}`)
    await db.query(`select set_config('request.jwt.claim.sub',$1,false)`,[id || ''])
    try {return await fn()} finally {await db.exec('reset role')}
  }
  const insert=async(status,slug)=>db.query(`insert into public.cms_content(kind,slug,status,data) values('news',$1,$2,$3::jsonb) returning *`,[slug,status,JSON.stringify({title:'Test',slug})])
  let published,draft
  await as('authenticated','00000000-0000-4000-8000-000000000001',async()=>{
    published=(await insert('published','test-published')).rows[0]
    draft=(await insert('draft','test-draft')).rows[0]
    assert.equal((await db.query('select * from cms_content')).rows.length,2)
    await db.query(`insert into storage.objects(bucket_id,name) values('cms-images','test.png')`)
  })
  await as('anon',null,async()=>{
    assert.deepEqual((await db.query('select slug from cms_content')).rows.map(x=>x.slug),['test-published'])
    await assert.rejects(()=>insert('published','attacker'))
    await assert.rejects(()=>db.query('select * from cms_admins'))
    await assert.rejects(()=>db.query('select public.is_cms_admin()'))
  })
  await as('authenticated','00000000-0000-4000-8000-000000000002',async()=>{
    assert.equal((await db.query('select public.is_cms_admin() as allowed')).rows[0].allowed,false)
    assert.equal((await db.query('select * from cms_content')).rows.length,1)
    assert.equal((await db.query('select * from cms_admins')).rows.length,0)
    await assert.rejects(()=>insert('published','attacker'))
    await assert.rejects(()=>db.query(`insert into cms_admins(user_id) values('00000000-0000-4000-8000-000000000002')`))
    assert.equal((await db.query(`update cms_content set status='draft' where id=$1 returning id`,[published.id])).rows.length,0)
    assert.equal((await db.query(`delete from cms_content where id=$1 returning id`,[published.id])).rows.length,0)
    await assert.rejects(()=>db.query(`insert into storage.objects(bucket_id,name) values('cms-images','bad.png')`))
  })
  await as('authenticated','00000000-0000-4000-8000-000000000001',async()=>{
    assert.equal((await db.query('select public.is_cms_admin() as allowed')).rows[0].allowed,true)
    const updated=(await db.query(`update cms_content set status='published' where id=$1 returning *`,[draft.id])).rows[0]
    assert.notEqual(updated.updated_at,draft.updated_at)
    await assert.rejects(()=>db.query(`update cms_content set slug='changed-url',data='{"title":"Test","slug":"changed-url"}' where id=$1`,[draft.id]))
    assert.equal((await db.query(`delete from cms_content where id=$1 returning id`,[draft.id])).rows.length,1)
  })
  await db.close()
})

const valid={kind:'news',slug:'test',status:'draft',sort_order:0,data:{slug:'test',title:'Test',shortTitle:'Test',date:'3 Nov 2026',isoDate:'2026-11-03',tags:['News'],image:'/images/test.jpg',imageAlt:'Test',body:['Test']}}
test('content validation rejects script URLs, reserved routes, bad dates and arbitrary HTML blocks',()=>{
  assert.equal(contentSchema.safeParse(valid).success,true)
  for(const change of [{slug:'admin'}, {image:'javascript:alert(1)'},{isoDate:'2026-02-30'},{body:['[click](javascript:alert)']},{body:[{html:'<script>alert(1)</script>'}]},{body:[{video:'../../evil'}]}]) {
    assert.equal(contentSchema.safeParse({...valid,data:{...valid.data,...change}}).success,false,JSON.stringify(change))
  }
  assert.equal(contentSchema.safeParse({...valid,kind:'event'}).success,false)
})
