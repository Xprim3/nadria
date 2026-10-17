-- Homepage advertisement / promo modal (single poster, admin-toggleable)

alter table public.restaurant
add column if not exists promo_modal_enabled boolean not null default false;

alter table public.restaurant
add column if not exists promo_modal_image_path text;

alter table public.restaurant
add column if not exists promo_modal_link_url text;
