-- Eseguire nel progetto Supabase Mosaiko. Nessun permesso amministrativo è ricavato dai metadati utente.
create table public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.cms_admins enable row level security;
revoke all on public.cms_admins from anon, authenticated;
grant select on public.cms_admins to authenticated;
grant all on public.cms_admins to service_role;
create policy "Read own admin membership" on public.cms_admins for select to authenticated using (user_id=(select auth.uid()));

create function public.is_cms_admin() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.cms_admins where user_id=(select auth.uid()));
$$;
revoke all on function public.is_cms_admin() from public;
grant execute on function public.is_cms_admin() to anon, authenticated;
grant execute on function public.is_cms_admin() to service_role;

create table public.cms_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('news','event')),
  slug text not null check (length(slug)<=180 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    and slug not in ('admin','api','news','partner','feed','events','event','category','tag','author','wp-admin','wp-json','robots','sitemap')),
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order integer not null default 0 check (sort_order between 0 and 1000000),
  data jsonb not null check (jsonb_typeof(data)='object' and coalesce(length(data->>'title'),0)>0 and octet_length(data::text)<500000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(kind,slug),
  check (kind<>'news' or (data->>'slug' is not null and data->>'slug'=slug))
);
create index cms_content_public on public.cms_content(kind,status,sort_order);
alter table public.cms_content enable row level security;
revoke all on public.cms_content from anon, authenticated;
grant select on public.cms_content to anon;
grant select,insert,update,delete on public.cms_content to authenticated;
grant all on public.cms_content to service_role;
create policy "Published content is public" on public.cms_content for select to anon,authenticated using (status='published');
create policy "Admins manage all content" on public.cms_content for all to authenticated using ((select public.is_cms_admin())) with check ((select public.is_cms_admin()));

create function public.cms_touch() returns trigger language plpgsql set search_path='' as $$
begin
  if new.kind<>old.kind or new.slug<>old.slug then raise exception 'Content kind and URL are immutable'; end if;
  new.updated_at=clock_timestamp();
  return new;
end;
$$;
create trigger cms_content_touch before update on public.cms_content for each row execute function public.cms_touch();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('cms-images','cms-images',true,4000000,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
create policy "Admins upload CMS images" on storage.objects for insert to authenticated
with check (bucket_id='cms-images' and (select public.is_cms_admin()));
create policy "Admins read CMS images" on storage.objects for select to authenticated
using (bucket_id='cms-images' and (select public.is_cms_admin()));
create policy "Admins remove CMS images" on storage.objects for delete to authenticated
using (bucket_id='cms-images' and (select public.is_cms_admin()));
