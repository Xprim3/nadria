alter table public.review enable row level security;

drop policy if exists "Authenticated can read reviews" on public.review;
create policy "Authenticated can read reviews"
on public.review
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert reviews" on public.review;
create policy "Authenticated can insert reviews"
on public.review
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update reviews" on public.review;
create policy "Authenticated can update reviews"
on public.review
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete reviews" on public.review;
create policy "Authenticated can delete reviews"
on public.review
for delete
to authenticated
using (true);
