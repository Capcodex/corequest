drop policy if exists "review_items_select_own" on public.review_items;
create policy "review_items_select_own"
on public.review_items
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "review_items_insert_own" on public.review_items;
create policy "review_items_insert_own"
on public.review_items
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "review_items_update_own" on public.review_items;
create policy "review_items_update_own"
on public.review_items
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "review_attempts_select_own" on public.review_attempts;
create policy "review_attempts_select_own"
on public.review_attempts
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "review_attempts_insert_own" on public.review_attempts;
create policy "review_attempts_insert_own"
on public.review_attempts
for insert
to authenticated
with check ((select auth.uid()) = user_id);
