create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_level_id text not null default 'rust-level-1',
  xp_total integer not null default 0 check (xp_total >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.level_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  level_id text not null,
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  completed_at timestamptz not null default timezone('utc', now()),
  unique (user_id, level_id)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  level_id text not null,
  code text not null,
  status text not null,
  stdout text not null default '',
  stderr text not null default '',
  duration_ms integer not null default 0,
  passed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;

  insert into public.user_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row
execute function public.touch_updated_at();

drop trigger if exists user_progress_touch_updated_at on public.user_progress;
create trigger user_progress_touch_updated_at
before update on public.user_progress
for each row
execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.level_completions enable row level security;
alter table public.submissions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.premium_interest enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "user_progress_select_own" on public.user_progress;
create policy "user_progress_select_own"
on public.user_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "user_progress_insert_own" on public.user_progress;
create policy "user_progress_insert_own"
on public.user_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "user_progress_update_own" on public.user_progress;
create policy "user_progress_update_own"
on public.user_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "level_completions_select_own" on public.level_completions;
create policy "level_completions_select_own"
on public.level_completions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "level_completions_insert_own" on public.level_completions;
create policy "level_completions_insert_own"
on public.level_completions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "submissions_select_own" on public.submissions;
create policy "submissions_select_own"
on public.submissions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "submissions_insert_own" on public.submissions;
create policy "submissions_insert_own"
on public.submissions
for insert
to authenticated
with check (auth.uid() = user_id);

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

create or replace function public.complete_level(
  p_level_id text,
  p_xp_award integer,
  p_next_level_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_xp_granted boolean := false;
  v_xp_total integer := 0;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  insert into public.level_completions (user_id, level_id, xp_awarded)
  values (v_user_id, p_level_id, p_xp_award)
  on conflict (user_id, level_id) do nothing;

  v_xp_granted := found;

  insert into public.user_progress (user_id, current_level_id, xp_total)
  values (
    v_user_id,
    coalesce(p_next_level_id, p_level_id),
    case when v_xp_granted then p_xp_award else 0 end
  )
  on conflict (user_id) do update
  set
    current_level_id = case
      when p_next_level_id is not null and public.user_progress.current_level_id = p_level_id
        then p_next_level_id
      else public.user_progress.current_level_id
    end,
    xp_total = public.user_progress.xp_total + case when v_xp_granted then p_xp_award else 0 end,
    updated_at = timezone('utc', now());

  select xp_total into v_xp_total
  from public.user_progress
  where user_id = v_user_id;

  return jsonb_build_object(
    'xpGranted', v_xp_granted,
    'xpTotal', v_xp_total
  );
end;
$$;

grant execute on function public.complete_level(text, integer, text) to authenticated;
