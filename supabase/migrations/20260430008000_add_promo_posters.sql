-- Multiple homepage promo posters. Each row has its own is_active flag.
-- There is no one-active unique index: several posters may be active together.
-- The single restaurant.promo_modal_* columns are copied once and left in place.

create table if not exists public.promo_poster (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurant (id) on delete cascade,
  storage_path text not null,
  link_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promo_poster_restaurant_created_idx
  on public.promo_poster (restaurant_id, created_at desc);

drop trigger if exists promo_poster_updated on public.promo_poster;
create trigger promo_poster_updated
before update on public.promo_poster
for each row execute function public.set_updated_at();

alter table public.promo_poster enable row level security;

-- Replaces the earlier combined read policy if this file is applied again.
drop policy if exists "Public read promo_poster" on public.promo_poster;

drop policy if exists "Anon read active promo_poster" on public.promo_poster;
create policy "Anon read active promo_poster"
  on public.promo_poster for select
  to anon
  using (is_active);

drop policy if exists "Authenticated read promo_poster" on public.promo_poster;
create policy "Authenticated read promo_poster"
  on public.promo_poster for select
  to authenticated
  using (true);

drop policy if exists "Admin all promo_poster" on public.promo_poster;
create policy "Admin all promo_poster"
  on public.promo_poster for all
  to authenticated
  using (true)
  with check (true);

insert into public.promo_poster (restaurant_id, storage_path, link_url, is_active)
select
  r.id,
  r.promo_modal_image_path,
  r.promo_modal_link_url,
  r.promo_modal_enabled
from public.restaurant r
where r.promo_modal_image_path is not null
  and btrim(r.promo_modal_image_path) <> ''
  and not exists (
    select 1
    from public.promo_poster p
    where p.restaurant_id = r.id
      and p.storage_path = r.promo_modal_image_path
  );
