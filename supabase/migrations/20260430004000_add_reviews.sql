create table if not exists public.review (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurant(id) on delete cascade,
  quote text not null,
  name text not null,
  detail text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists review_restaurant_sort_idx
  on public.review (restaurant_id, sort_order, created_at desc);
