
-- Fix function search_path
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Lock down has_role execute
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

-- Tighten public booking insert policy
drop policy "bookings insert public" on public.bookings;

create policy "bookings insert public validated"
  on public.bookings for insert
  to anon, authenticated
  with check (
    adults >= 1
    and adults <= 20
    and children >= 0
    and children <= 20
    and (adults + children) <= 20
    and length(customer_name) between 2 and 120
    and customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(customer_email) <= 254
    and date >= current_date
    and date <= current_date + interval '1 year'
    and exists (
      select 1 from public.activities a
      where a.id = activity_id and a.active = true
    )
    and status = 'pending'
    and amount_cents >= 0
  );
