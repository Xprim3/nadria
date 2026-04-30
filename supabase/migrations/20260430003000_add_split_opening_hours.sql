alter table public.opening_hours
add column if not exists second_open_time time,
add column if not exists second_close_time time;
