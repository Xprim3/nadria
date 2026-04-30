alter table public.restaurant
add column if not exists show_notices boolean not null default true;
