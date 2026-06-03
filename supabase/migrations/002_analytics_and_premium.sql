create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  anonymous_session_id text,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.premium_interest (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  source text not null default 'premium-page',
  created_at timestamptz not null default timezone('utc', now()),
  constraint premium_interest_email_or_user check (email is not null or user_id is not null)
);

create unique index if not exists premium_interest_user_id_unique
on public.premium_interest (user_id)
where user_id is not null;

create unique index if not exists premium_interest_email_unique
on public.premium_interest (email)
where email is not null;

alter table public.analytics_events enable row level security;
alter table public.premium_interest enable row level security;

drop policy if exists "analytics_insert_self_or_anon" on public.analytics_events;
create policy "analytics_insert_self_or_anon"
on public.analytics_events
for insert
to anon, authenticated
with check (
  auth.uid() = user_id
  or user_id is null
);

drop policy if exists "analytics_select_own" on public.analytics_events;
create policy "analytics_select_own"
on public.analytics_events
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "premium_interest_insert_self_or_anon" on public.premium_interest;
create policy "premium_interest_insert_self_or_anon"
on public.premium_interest
for insert
to anon, authenticated
with check (
  auth.uid() = user_id
  or user_id is null
);

drop policy if exists "premium_interest_select_own" on public.premium_interest;
create policy "premium_interest_select_own"
on public.premium_interest
for select
to authenticated
using (auth.uid() = user_id);
