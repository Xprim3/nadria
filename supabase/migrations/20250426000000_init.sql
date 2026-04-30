-- Phase 2: schema for restaurant CMS (single restaurant, reusable later with extra keys)
-- Run in Supabase SQL Editor or via CLI: supabase db push

create extension if not exists "pgcrypto";

-- --- Core restaurant (one row for v1) ---
create table public.restaurant (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Restaurant',
  tagline text,
  story text,
  phone text,
  email text,
  address_line text,
  city text,
  postal_code text,
  country text not null default 'Deutschland',
  latitude double precision,
  longitude double precision,
  maps_url text,
  social_instagram text,
  social_facebook text,
  impressum_content text,
  datenschutz_content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- --- Menu ---
create table public.menu_category (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurant (id) on delete cascade,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.menu_item (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_category (id) on delete cascade,
  name text not null,
  description text,
  price_cents int not null check (price_cents >= 0),
  image_path text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- day: 0 = Monday … 6 = Sunday (EU-friendly)
create table public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurant (id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  open_time time,
  close_time time,
  is_closed boolean not null default false,
  unique (restaurant_id, day_of_week)
);

create table public.notice (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurant (id) on delete cascade,
  title text not null,
  body text,
  starts_on date,
  ends_on date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_image (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurant (id) on delete cascade,
  storage_path text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- --- updated_at helpers ---
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger restaurant_updated
before update on public.restaurant
for each row execute function public.set_updated_at();

create trigger menu_item_updated
before update on public.menu_item
for each row execute function public.set_updated_at();

create trigger notice_updated
before update on public.notice
for each row execute function public.set_updated_at();

-- --- RLS ---
alter table public.restaurant enable row level security;
alter table public.menu_category enable row level security;
alter table public.menu_item enable row level security;
alter table public.opening_hours enable row level security;
alter table public.notice enable row level security;
alter table public.gallery_image enable row level security;

-- Public read (anon + authenticated)
create policy "Public read restaurant"
  on public.restaurant for select
  to anon, authenticated
  using (true);

create policy "Public read menu_category"
  on public.menu_category for select
  to anon, authenticated
  using (true);

create policy "Public read menu_item"
  on public.menu_item for select
  to anon, authenticated
  using (true);

create policy "Public read opening_hours"
  on public.opening_hours for select
  to anon, authenticated
  using (true);

create policy "Public read notice"
  on public.notice for select
  to anon, authenticated
  using (true);

create policy "Public read gallery_image"
  on public.gallery_image for select
  to anon, authenticated
  using (true);

-- Authenticated: full data management (v1: single admin user)
create policy "Admin insert restaurant"
  on public.restaurant for insert
  to authenticated
  with check (true);

create policy "Admin update restaurant"
  on public.restaurant for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin all menu_category"
  on public.menu_category for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all menu_item"
  on public.menu_item for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all opening_hours"
  on public.opening_hours for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all notice"
  on public.notice for all
  to authenticated
  using (true)
  with check (true);

create policy "Admin all gallery_image"
  on public.gallery_image for all
  to authenticated
  using (true)
  with check (true);

-- Optional seed: one restaurant (comment out if you insert manually)
insert into public.restaurant (name, tagline)
values ('Pizzeria Adria', 'Authentic Italian cuisine');

-- --- Storage: buckets (public read for site visitors) ---
insert into storage.buckets (id, name, public)
values ('menu', 'menu', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Read objects for everyone
create policy "Public read menu storage"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'menu');

create policy "Public read gallery storage"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

-- Authenticated upload/update/delete
create policy "Admin upload menu storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'menu');

create policy "Admin update menu storage"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'menu');

create policy "Admin delete menu storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'menu');

create policy "Admin upload gallery storage"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery');

create policy "Admin update gallery storage"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery');

create policy "Admin delete gallery storage"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery');
