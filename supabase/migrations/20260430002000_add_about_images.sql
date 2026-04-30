alter table public.restaurant
add column if not exists about_image_path text,
add column if not exists about_detail_image_path text;
