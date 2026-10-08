
-- ============ ENUMS ============
create type public.app_role as enum ('admin');
create type public.activity_type as enum ('canoe', 'velo', 'combine');
create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'refunded');

-- ============ HELPER FUNCTION ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============ ACTIVITIES ============
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  type activity_type not null,
  name_fr text not null,
  name_en text not null,
  description_fr text,
  description_en text,
  duration_minutes int not null default 120,
  base_price_cents int not null default 0,
  child_price_cents int,
  max_capacity int not null default 20,
  photo_url text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_activities_updated
  before update on public.activities
  for each row execute function public.set_updated_at();

grant select on public.activities to anon, authenticated;
grant all on public.activities to service_role;

alter table public.activities enable row level security;

-- ============ STOCK ============
create table public.stock (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  date date not null,
  total_units int not null default 0,
  blocked boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (activity_id, date)
);

create trigger trg_stock_updated
  before update on public.stock
  for each row execute function public.set_updated_at();

create index idx_stock_date on public.stock(date);

grant select on public.stock to anon, authenticated;
grant all on public.stock to service_role;

alter table public.stock enable row level security;

-- ============ BOOKINGS ============
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique default ('CE-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  status booking_status not null default 'pending',
  activity_id uuid not null references public.activities(id) on delete restrict,
  date date not null,
  slot_time time,
  adults int not null default 1,
  children int not null default 0,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  amount_cents int not null default 0,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  language text not null default 'fr',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_bookings_updated
  before update on public.bookings
  for each row execute function public.set_updated_at();

create index idx_bookings_date on public.bookings(date);
create index idx_bookings_status on public.bookings(status);

grant select, insert, update, delete on public.bookings to authenticated;
grant insert on public.bookings to anon;
grant all on public.bookings to service_role;

alter table public.bookings enable row level security;

-- ============ USER ROLES ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- ============ POLICIES ============

-- activities: public read of active, admin write
create policy "activities readable by all"
  on public.activities for select
  using (active = true or public.has_role(auth.uid(), 'admin'));

create policy "activities admin write"
  on public.activities for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- stock: public read, admin write
create policy "stock readable by all"
  on public.stock for select
  using (true);

create policy "stock admin write"
  on public.stock for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- bookings: anon can insert (will be hardened by server fn in phase 2), admin can read/modify all
create policy "bookings insert public"
  on public.bookings for insert
  to anon, authenticated
  with check (true);

create policy "bookings admin read"
  on public.bookings for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "bookings admin update"
  on public.bookings for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "bookings admin delete"
  on public.bookings for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- user_roles: users see their own roles, no client writes (service_role only)
create policy "user_roles read own"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- ============ SEED ACTIVITIES ============
insert into public.activities (slug, type, name_fr, name_en, description_fr, description_en, duration_minutes, base_price_cents, child_price_cents, max_capacity, display_order, photo_url) values
('canoe-sauvage','canoe','La Sauvage','The Wild','Cazoulès → Saint-Julien, 8 km de descente paisible','Cazoulès → Saint-Julien, peaceful 8 km descent',120,1600,800,40,1,'https://i0.wp.com/canoe-sur-dordogne.com/wp-content/uploads/2022/04/AdobeStock_308214234-scaled.jpeg'),
('canoe-familiale','canoe','La Familiale','The Family','Saint-Julien → Vitrac, 16 km, château de Montfort','Saint-Julien → Vitrac, 16 km past Montfort castle',210,2000,1000,60,2,'https://i0.wp.com/canoe-sur-dordogne.com/wp-content/uploads/2022/04/3889671326_d213aaeccb_o.jpg'),
('canoe-pittoresque','canoe','La Pittoresque','The Scenic','Saint-Julien → La Roque-Gageac, 22 km','Saint-Julien → La Roque-Gageac, 22 km',300,2400,1200,40,3,'https://i0.wp.com/canoe-sur-dordogne.com/wp-content/uploads/2022/04/AdobeStock_282044418-2-scaled.jpeg'),
('canoe-integrale','canoe','L''Intégrale','The Full Run','Saint-Julien → Beynac, 29 km, 6 châteaux','Saint-Julien → Beynac, 29 km, 6 castles',360,2600,1300,30,4,'https://i0.wp.com/canoe-sur-dordogne.com/wp-content/uploads/2022/04/AdobeStock_234345499-scaled.jpeg'),
('velo-electrique','velo','Vélo électrique','E-Bike','Demi-journée, jusqu''à 80 km d''autonomie','Half-day, up to 80 km range',240,3000,null,20,5,'https://i0.wp.com/canoe-sur-dordogne.com/wp-content/uploads/2023/04/Voie-verte-Sarlat-Cap-Evasion.webp'),
('velo-vtt','velo','VTT / VTC','MTB / Hybrid','Demi-journée sur la voie verte','Half-day on the greenway',240,1500,null,30,6,'https://i0.wp.com/canoe-sur-dordogne.com/wp-content/uploads/2023/04/Pont-grolejac-Piste-Cyclable.webp'),
('combine-detente','combine','Combiné Détente','Easy Combo','Vélo + canoë, 8 km + 8 km','Bike + canoe, 8 km + 8 km',300,2400,1200,30,7,'https://i0.wp.com/canoe-sur-dordogne.com/wp-content/uploads/2022/04/AdobeStock_56586890-1-scaled.jpeg'),
('combine-sportif','combine','Combiné Sportif','Sport Combo','Vélo + canoë, 11 km + 14 km','Bike + canoe, 11 km + 14 km',360,3000,1500,20,8,'https://i0.wp.com/canoe-sur-dordogne.com/wp-content/uploads/2022/04/AdobeStock_180472181-scaled.jpeg');
