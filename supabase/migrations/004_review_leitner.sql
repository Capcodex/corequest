create table if not exists public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id text not null,
  content_type text not null default 'exercise',
  leitner_box smallint not null default 1,
  last_reviewed_at timestamptz,
  next_review_at timestamptz not null default (timezone('utc', now()) + interval '1 day'),
  success_count integer not null default 0,
  failure_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint review_items_content_type_check check (content_type in ('exercise')),
  constraint review_items_leitner_box_check check (leitner_box between 1 and 6),
  constraint review_items_success_count_check check (success_count >= 0),
  constraint review_items_failure_count_check check (failure_count >= 0),
  constraint review_items_user_content_unique unique (user_id, content_id)
);

create table if not exists public.review_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  review_item_id uuid not null references public.review_items(id) on delete cascade,
  content_id text not null,
  result text not null,
  previous_box smallint not null,
  next_box smallint not null,
  reviewed_at timestamptz not null default timezone('utc', now()),
  constraint review_attempts_result_check check (result in ('success', 'failure')),
  constraint review_attempts_previous_box_check check (previous_box between 1 and 6),
  constraint review_attempts_next_box_check check (next_box between 1 and 6)
);

create index if not exists review_items_user_next_review_idx
on public.review_items (user_id, next_review_at);

create index if not exists review_items_user_box_due_idx
on public.review_items (user_id, leitner_box, next_review_at);

create index if not exists review_attempts_user_reviewed_at_idx
on public.review_attempts (user_id, reviewed_at desc);

create index if not exists review_attempts_review_item_id_idx
on public.review_attempts (review_item_id);

alter table public.review_items enable row level security;
alter table public.review_attempts enable row level security;

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

revoke all on public.review_items from anon, authenticated, public;
revoke all on public.review_attempts from anon, authenticated, public;

grant select, insert, update on public.review_items to authenticated;
grant select, insert on public.review_attempts to authenticated;
