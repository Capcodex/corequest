create table if not exists public.project_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null,
  xp_awarded integer not null default 0,
  completed_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, project_id)
);

alter table public.project_completions enable row level security;

drop policy if exists "project_completions_select_own" on public.project_completions;
create policy "project_completions_select_own"
on public.project_completions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "project_completions_insert_own" on public.project_completions;
create policy "project_completions_insert_own"
on public.project_completions
for insert
to authenticated
with check (auth.uid() = user_id);

create or replace function public.complete_project(
  p_project_id text,
  p_xp_award integer
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

  insert into public.project_completions (user_id, project_id, xp_awarded)
  values (v_user_id, p_project_id, p_xp_award)
  on conflict (user_id, project_id) do nothing;

  v_xp_granted := found;

  insert into public.user_progress (user_id, current_level_id, xp_total)
  values (
    v_user_id,
    coalesce((select current_level_id from public.user_progress where user_id = v_user_id), 'rust-level-1'),
    case when v_xp_granted then p_xp_award else 0 end
  )
  on conflict (user_id) do update
  set
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

grant execute on function public.complete_project(text, integer) to authenticated;
