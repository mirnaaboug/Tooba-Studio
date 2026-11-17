-- =====================================================================
--  TOOBA — Supabase backend schema
--  Paste into Supabase → SQL Editor → Run (on a fresh project, once).
--
--  What it creates
--    • Enums for every status / stage
--    • 10 tables: profiles, clients, offerings, projects, quotes,
--      quote_items, payments, creative_routes, revisions, deliverables
--    • activity_log  — every insert / update / delete on every table,
--      written by triggers (who, when, before, after, changed fields)
--    • Row Level Security: only active team members can see anything;
--      only owners can delete; the log can never be edited
--    • Private "deliverables" storage bucket
--    • Views: quote_totals, project_overview, stage_history,
--      founding_places_left
--    • Seed data: Brick / House / Landmark, add-ons, retainers
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. ENUMS
-- ---------------------------------------------------------------------
create type public.team_role          as enum ('owner', 'designer', 'strategist', 'viewer');
create type public.client_status      as enum ('lead', 'qualified', 'active', 'past', 'lost');
create type public.client_market      as enum ('egypt', 'gulf');
create type public.lead_source        as enum ('instagram', 'tiktok', 'whatsapp', 'referral', 'website', 'linkedin', 'other');
create type public.project_stage      as enum ('discovery', 'brief', 'routes', 'refinement', 'final', 'delivered', 'on_hold', 'cancelled');
create type public.currency_code      as enum ('EGP', 'USD');
create type public.quote_status       as enum ('draft', 'sent', 'accepted', 'rejected', 'expired');
create type public.payment_kind       as enum ('deposit', 'balance', 'addon', 'retainer', 'refund');
create type public.offering_kind      as enum ('package', 'addon', 'retainer');
create type public.deliverable_status as enum ('draft', 'internal_review', 'approved', 'sent_to_client', 'client_approved');

-- ---------------------------------------------------------------------
-- 2. TABLES
-- ---------------------------------------------------------------------

-- Team members (one row per Supabase Auth user, created automatically)
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        public.team_role not null default 'viewer',
  is_active   boolean not null default false,   -- must be switched on by an owner
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Leads AND clients (status moves lead → qualified → active → past / lost)
create table public.clients (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  name_ar             text,
  sector              text,                      -- real estate, F&B, clinic, beauty, fashion…
  market              public.client_market not null default 'egypt',
  status              public.client_status not null default 'lead',
  source              public.lead_source,
  contact_name        text,
  phone               text,
  whatsapp            text,
  email               text,
  instagram           text,
  is_founding_client  boolean not null default false,
  notes               text,
  created_by          uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Packages, add-ons and retainers (the price list)
create table public.offerings (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,
  name             text not null,
  kind             public.offering_kind not null,
  price_egp        numeric(12,2) not null check (price_egp >= 0),
  price_usd        numeric(12,2) not null check (price_usd >= 0),
  price_is_from    boolean not null default false,   -- "from EGP 120,000"
  routes_included  int,
  rounds_included  int,
  timeline         text,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- One branding job for one client
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references public.clients (id) on delete restrict,
  package_id    uuid references public.offerings (id) on delete set null,
  owner_id      uuid references public.profiles (id) on delete set null,
  name          text not null,
  stage         public.project_stage not null default 'discovery',
  start_date    date,
  due_date      date,
  delivered_at  timestamptz,
  is_rush       boolean not null default false,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Quotes (EGP or USD, valid 14 days by default)
create sequence public.quote_number_seq;

create table public.quotes (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references public.projects (id) on delete cascade,
  quote_number     text not null unique
                   default 'TB-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.quote_number_seq')::text, 4, '0'),
  currency         public.currency_code not null default 'EGP',
  fx_rate          numeric(10,4),                 -- EGP per USD on the quote date
  discount_pct     numeric(5,2) not null default 0 check (discount_pct between 0 and 100),
  discount_reason  text,                          -- e.g. 'Founding client 30%'
  status           public.quote_status not null default 'draft',
  issued_at        date not null default current_date,
  valid_until      date not null default current_date + 14,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (valid_until >= issued_at)
);

-- Line items on a quote (package + any add-ons)
create table public.quote_items (
  id           uuid primary key default gen_random_uuid(),
  quote_id     uuid not null references public.quotes (id) on delete cascade,
  offering_id  uuid references public.offerings (id) on delete set null,
  description  text not null,
  quantity     int not null default 1 check (quantity > 0),
  unit_price   numeric(12,2) not null check (unit_price >= 0),
  line_total   numeric(14,2) generated always as (quantity * unit_price) stored,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Money received (always in the quote's currency)
create table public.payments (
  id          uuid primary key default gen_random_uuid(),
  quote_id    uuid not null references public.quotes (id) on delete restrict,
  amount      numeric(12,2) not null check (amount > 0),
  kind        public.payment_kind not null,
  method      text,                               -- InstaPay, bank transfer, Vodafone Cash, cash…
  reference   text,
  paid_at     timestamptz not null default now(),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- The creative routes shown to the client (one gets selected)
create table public.creative_routes (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id) on delete cascade,
  route_number  int not null check (route_number > 0),
  name          text not null,
  concept       text,
  preview_path  text,                             -- path in the 'deliverables' bucket
  is_selected   boolean not null default false,
  presented_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (project_id, route_number)
);
create unique index one_selected_route_per_project
  on public.creative_routes (project_id) where is_selected;

-- Refinement rounds on a route
create table public.revisions (
  id               uuid primary key default gen_random_uuid(),
  route_id         uuid not null references public.creative_routes (id) on delete cascade,
  round            int not null check (round > 0),
  client_feedback  text,
  internal_notes   text,
  requested_at     timestamptz not null default now(),
  completed_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (route_id, round)
);

-- Final files and everything handed over
create table public.deliverables (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id) on delete cascade,
  type          text not null,                    -- logo, brand_book, social_templates, stationery…
  title         text not null,
  storage_path  text,                             -- path in the 'deliverables' bucket
  version       int not null default 1 check (version > 0),
  status        public.deliverable_status not null default 'draft',
  approved_by   uuid references public.profiles (id) on delete set null,
  approved_at   timestamptz,
  sent_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- The audit trail: one row per change, anywhere
create table public.activity_log (
  id              bigint generated always as identity primary key,
  actor_id        uuid references public.profiles (id) on delete set null,  -- null = dashboard / system
  table_name      text not null,
  record_id       uuid,
  action          text not null check (action in ('insert', 'update', 'delete')),
  changed_fields  text[],
  old_data        jsonb,
  new_data        jsonb,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. INDEXES (foreign keys + common lookups)
-- ---------------------------------------------------------------------
create index on public.clients (status);
create index on public.projects (client_id);
create index on public.projects (package_id);
create index on public.projects (owner_id);
create index on public.projects (stage);
create index on public.quotes (project_id);
create index on public.quote_items (quote_id);
create index on public.payments (quote_id);
create index on public.creative_routes (project_id);
create index on public.revisions (route_id);
create index on public.deliverables (project_id);
create index on public.activity_log (table_name, record_id);
create index on public.activity_log (actor_id);
create index on public.activity_log (created_at desc);

-- ---------------------------------------------------------------------
-- 4. FUNCTIONS
-- ---------------------------------------------------------------------

-- Keep updated_at current
create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- Write every change to activity_log
create function public.log_activity()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_old     jsonb;
  v_new     jsonb;
  v_changed text[];
begin
  if tg_op in ('UPDATE', 'DELETE') then v_old := to_jsonb(old); end if;
  if tg_op in ('INSERT', 'UPDATE') then v_new := to_jsonb(new); end if;

  if tg_op = 'UPDATE' then
    select array_agg(n.key order by n.key) into v_changed
    from jsonb_each(v_new) n
    where n.value is distinct from v_old -> n.key
      and n.key <> 'updated_at';
    if v_changed is null then
      return null;                                -- nothing real changed, don't log
    end if;
  end if;

  insert into public.activity_log (actor_id, table_name, record_id, action, changed_fields, old_data, new_data)
  values (
    auth.uid(),
    tg_table_name,
    coalesce(v_new ->> 'id', v_old ->> 'id')::uuid,
    lower(tg_op),
    v_changed,
    v_old,
    v_new
  );
  return null;
end $$;

-- Create a profile when someone signs up
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Access helpers used by the RLS policies
create function public.is_team()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_active);
$$;

create function public.is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_active and role = 'owner');
$$;

-- Mark sent quotes past their validity date as expired
create function public.expire_quotes()
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update public.quotes set status = 'expired'
  where status = 'sent' and valid_until < current_date;
  get diagnostics n = row_count;
  return n;
end $$;

-- ---------------------------------------------------------------------
-- 5. TRIGGERS + ROW LEVEL SECURITY on every business table
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'clients', 'offerings', 'projects', 'quotes', 'quote_items',
    'payments', 'creative_routes', 'revisions', 'deliverables'
  ] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function public.log_activity()', t || '_log', t);
    execute format('alter table public.%I enable row level security', t);

    if t <> 'profiles' then
      execute format('create policy "team can read"   on public.%I for select to authenticated using (public.is_team())', t);
      execute format('create policy "team can add"    on public.%I for insert to authenticated with check (public.is_team())', t);
      execute format('create policy "team can edit"   on public.%I for update to authenticated using (public.is_team()) with check (public.is_team())', t);
      execute format('create policy "owner can delete" on public.%I for delete to authenticated using (public.is_owner())', t);
    end if;
  end loop;
end $$;

-- Profiles: team sees the team; you can edit only your own name.
-- Role and is_active are changed by an owner from the Supabase dashboard.
create policy "team can read profiles" on public.profiles
  for select to authenticated using (public.is_team() or id = auth.uid());
create policy "edit own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant  update (full_name) on public.profiles to authenticated;

-- Activity log: readable by the team, writable only by the triggers
alter table public.activity_log enable row level security;
create policy "team can read log" on public.activity_log
  for select to authenticated using (public.is_team());
revoke insert, update, delete, truncate on public.activity_log from anon, authenticated;

-- ---------------------------------------------------------------------
-- 6. STORAGE — private bucket for routes, drafts and final files
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('deliverables', 'deliverables', false)
on conflict (id) do nothing;

create policy "team reads deliverables" on storage.objects
  for select to authenticated using (bucket_id = 'deliverables' and public.is_team());
create policy "team uploads deliverables" on storage.objects
  for insert to authenticated with check (bucket_id = 'deliverables' and public.is_team());
create policy "team updates deliverables" on storage.objects
  for update to authenticated using (bucket_id = 'deliverables' and public.is_team());
create policy "owner deletes deliverables" on storage.objects
  for delete to authenticated using (bucket_id = 'deliverables' and public.is_owner());

-- ---------------------------------------------------------------------
-- 7. VIEWS (respect RLS via security_invoker)
-- ---------------------------------------------------------------------

-- Totals, money in, balance and deposit check per quote
create view public.quote_totals with (security_invoker = true) as
select
  q.id                                                       as quote_id,
  q.project_id,
  q.quote_number,
  q.currency,
  q.status,
  q.valid_until,
  coalesce(i.subtotal, 0)                                    as subtotal,
  round(coalesce(i.subtotal, 0) * q.discount_pct / 100, 2)   as discount,
  round(coalesce(i.subtotal, 0) * (1 - q.discount_pct / 100), 2) as total,
  coalesce(p.paid, 0)                                        as paid,
  round(coalesce(i.subtotal, 0) * (1 - q.discount_pct / 100), 2) - coalesce(p.paid, 0) as balance,
  coalesce(p.paid, 0) >= round(coalesce(i.subtotal, 0) * (1 - q.discount_pct / 100), 2) * 0.5 as deposit_cleared
from public.quotes q
left join (
  select quote_id, sum(line_total) as subtotal
  from public.quote_items group by quote_id
) i on i.quote_id = q.id
left join (
  select quote_id, sum(case when kind = 'refund' then -amount else amount end) as paid
  from public.payments group by quote_id
) p on p.quote_id = q.id;

-- One line per project: stage, money, and rounds used vs. included
create view public.project_overview with (security_invoker = true) as
select
  pr.id                                     as project_id,
  pr.name                                   as project_name,
  c.name                                    as client_name,
  c.market,
  o.name                                    as package,
  pr.stage,
  pr.due_date,
  qt.quote_number,
  qt.currency,
  qt.total,
  qt.paid,
  qt.balance,
  coalesce(qt.deposit_cleared, false)       as deposit_cleared,     -- OK to start work
  coalesce(qt.balance <= 0, false)          as files_releasable,    -- OK to hand over source files
  o.rounds_included,
  coalesce(r.rounds_used, 0)                as rounds_used,
  greatest(coalesce(r.rounds_used, 0) - coalesce(o.rounds_included, 0), 0) as extra_rounds_to_bill
from public.projects pr
join public.clients c on c.id = pr.client_id
left join public.offerings o on o.id = pr.package_id
left join lateral (
  select * from public.quote_totals t
  where t.project_id = pr.id and t.status = 'accepted'
  order by t.valid_until desc limit 1
) qt on true
left join lateral (
  select max(rv.round) as rounds_used
  from public.revisions rv
  join public.creative_routes cr on cr.id = rv.route_id
  where cr.project_id = pr.id and cr.is_selected
) r on true;

-- Every stage change, with who moved it and when (turnaround tracking)
create view public.stage_history with (security_invoker = true) as
select
  l.record_id                    as project_id,
  l.old_data ->> 'stage'         as from_stage,
  coalesce(l.new_data ->> 'stage', 'discovery') as to_stage,
  l.actor_id,
  l.created_at                   as changed_at
from public.activity_log l
where l.table_name = 'projects'
  and (l.action = 'insert' or 'stage' = any (l.changed_fields));

-- "[X] of 5 places left" for the founding-client offer
create view public.founding_places_left with (security_invoker = true) as
select 5 - count(*)::int as places_left
from public.clients
where is_founding_client;

-- ---------------------------------------------------------------------
-- 8. SEED — approved price list (17 Oct 2026)
-- ---------------------------------------------------------------------
insert into public.offerings (code, name, kind, price_egp, price_usd, price_is_from, routes_included, rounds_included, timeline) values
  ('brick',            'Brick',                       'package',  25000,  1200, false, 2, 2, '7 working days'),
  ('house',            'House',                       'package',  60000,  2900, false, 3, 2, '12–15 working days'),
  ('landmark',         'Landmark',                    'package', 120000,  5500, true,  3, 3, '3–4 weeks'),
  ('naming',           'Naming',                      'addon',    15000,   600, false, null, null, null),
  ('logo_animation',   'Logo animation',              'addon',     8000,   350, false, null, null, null),
  ('extra_route',      'Extra route',                 'addon',     6000,   250, false, null, null, null),
  ('extra_round',      'Extra round',                 'addon',     3500,   150, false, null, null, null),
  ('packaging_sku',    'Packaging (per SKU)',         'addon',    10000,   400, true,  null, null, null),
  ('deck_brochure',    'Pitch deck or brochure',      'addon',    12000,   500, false, null, null, null),
  ('landing_page',     'Landing page design',         'addon',    20000,   800, true,  null, null, null),
  ('ai_photo_10',      'AI photography (10 images)',  'addon',    10000,   400, false, null, null, null),
  ('social_6',         '6 extra social templates',    'addon',     6000,   250, false, null, null, null),
  ('brand_care',       'Brand Care (monthly)',        'retainer', 15000,   600, false, null, null, '3-month minimum'),
  ('brand_partner',    'Brand Partner (monthly)',     'retainer', 30000,  1200, false, null, null, '3-month minimum');
-- Rush (+25%) is a flag on the project (projects.is_rush), not a fixed price.

commit;

-- =====================================================================
--  AFTER RUNNING
--  1. Sign up in your app (or Auth → Users → Add user), then make
--     yourself the owner:
--       update public.profiles set role = 'owner', is_active = true
--       where email = 'you@example.com';
--  2. Recommended: Auth → Providers → Email → turn off "Allow new users
--     to sign up" so only people you invite get in. New sign-ups are
--     inactive (see nothing) until an owner activates them anyway.
--  3. Optional — expire old quotes nightly (Database → Extensions →
--     enable pg_cron, then run):
--       select cron.schedule('expire-quotes', '0 1 * * *', 'select public.expire_quotes()');
-- =====================================================================
