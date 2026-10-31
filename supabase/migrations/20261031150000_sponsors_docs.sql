-- Sponsor + Dokumentasi (album foto). Baca: publik. Tulis: hanya admin. Aman dijalankan ulang.

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Akun yang SUDAH ada di Supabase Auth saat ini dianggap admin.
insert into public.admin_users (email)
select lower(email) from auth.users where email is not null
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
drop policy if exists "admin_users: admin baca" on public.admin_users;
create policy "admin_users: admin baca" on public.admin_users
  for select to authenticated using (public.is_admin());

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null default 'supporter' check (tier in ('platinum', 'gold', 'silver', 'supporter')),
  logo_url text,
  website text,
  since text,
  note text,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.doc_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text,
  event_date date,
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.doc_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.doc_albums(id) on delete cascade,
  image_url text not null,
  storage_path text,
  caption text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists doc_photos_album_idx on public.doc_photos(album_id, order_index);

alter table public.sponsors enable row level security;
alter table public.doc_albums enable row level security;
alter table public.doc_photos enable row level security;

drop policy if exists "sponsors: publik baca aktif" on public.sponsors;
create policy "sponsors: publik baca aktif" on public.sponsors
  for select to anon, authenticated using (is_active or public.is_admin());
drop policy if exists "sponsors: admin tulis" on public.sponsors;
create policy "sponsors: admin tulis" on public.sponsors
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "doc_albums: publik baca terbit" on public.doc_albums;
create policy "doc_albums: publik baca terbit" on public.doc_albums
  for select to anon, authenticated using (is_published or public.is_admin());
drop policy if exists "doc_albums: admin tulis" on public.doc_albums;
create policy "doc_albums: admin tulis" on public.doc_albums
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "doc_photos: publik baca" on public.doc_photos;
create policy "doc_photos: publik baca" on public.doc_photos
  for select to anon, authenticated using (
    public.is_admin()
    or exists (select 1 from public.doc_albums a where a.id = album_id and a.is_published)
  );
drop policy if exists "doc_photos: admin tulis" on public.doc_photos;
create policy "doc_photos: admin tulis" on public.doc_photos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.sponsors, public.doc_albums, public.doc_photos to anon, authenticated;
grant insert, update, delete on public.sponsors, public.doc_albums, public.doc_photos to authenticated;
grant select on public.admin_users to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sponsors', 'sponsors', true, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
on conflict (id) do update set public = true, file_size_limit = 2097152,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dokumentasi', 'dokumentasi', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp'];

drop policy if exists "sponsors bucket: publik baca" on storage.objects;
create policy "sponsors bucket: publik baca" on storage.objects
  for select to anon, authenticated using (bucket_id = 'sponsors');
drop policy if exists "sponsors bucket: admin tulis" on storage.objects;
create policy "sponsors bucket: admin tulis" on storage.objects
  for all to authenticated
  using (bucket_id = 'sponsors' and public.is_admin())
  with check (bucket_id = 'sponsors' and public.is_admin());

drop policy if exists "dokumentasi bucket: publik baca" on storage.objects;
create policy "dokumentasi bucket: publik baca" on storage.objects
  for select to anon, authenticated using (bucket_id = 'dokumentasi');
drop policy if exists "dokumentasi bucket: admin tulis" on storage.objects;
create policy "dokumentasi bucket: admin tulis" on storage.objects
  for all to authenticated
  using (bucket_id = 'dokumentasi' and public.is_admin())
  with check (bucket_id = 'dokumentasi' and public.is_admin());
