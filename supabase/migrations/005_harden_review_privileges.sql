revoke all on public.review_items from anon, authenticated, public;
revoke all on public.review_attempts from anon, authenticated, public;

grant select, insert, update on public.review_items to authenticated;
grant select, insert on public.review_attempts to authenticated;
