-- =====================================================================
--  TOOBA — 002: website onboarding → leads
--  Run in Supabase → SQL Editor AFTER 001_tooba_schema.sql.
--
--  The public "Start your project" form calls submit_onboarding().
--  It creates a lead in `clients` and keeps the full answers in
--  `onboarding_submissions`. Visitors can only call this one function:
--  they can't read, change or delete anything.
-- =====================================================================

begin;

create table public.onboarding_submissions (
  id                 uuid primary key default gen_random_uuid(),
  ref                text not null unique,
  client_id          uuid references public.clients (id) on delete set null,
  business_name      text not null,
  city               text,
  industry           text,
  stage              text,                -- new / named / rebrand
  services           text[],
  package_name       text,                -- what the form showed (e.g. 'Full identity' or 'Custom selection')
  estimate_egp       numeric(12,2),       -- price the form showed
  timeline           text,
  budget             text,
  language           text,
  preferred_channel  text,
  answers            jsonb not null,      -- the full raw submission
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index on public.onboarding_submissions (client_id);
create index on public.onboarding_submissions (created_at desc);

create trigger onboarding_submissions_updated_at before update on public.onboarding_submissions
  for each row execute function public.set_updated_at();
create trigger onboarding_submissions_log after insert or update or delete on public.onboarding_submissions
  for each row execute function public.log_activity();

alter table public.onboarding_submissions enable row level security;
create policy "team can read"    on public.onboarding_submissions for select to authenticated using (public.is_team());
create policy "team can edit"    on public.onboarding_submissions for update to authenticated using (public.is_team()) with check (public.is_team());
create policy "owner can delete" on public.onboarding_submissions for delete to authenticated using (public.is_owner());

-- Called by the website. Returns the reference shown to the client.
create function public.submit_onboarding(payload jsonb)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_name     text := left(btrim(coalesce(payload #>> '{biz,name}', '')), 200);
  v_email    text := lower(left(btrim(coalesce(payload #>> '{contact,email}', '')), 200));
  v_phone    text := left(btrim(coalesce(payload #>> '{contact,phone}', '')), 50);
  v_channel  text := left(coalesce(payload ->> 'channel', ''), 40);
  v_ref      text;
  v_client   uuid;
  v_services text[];
begin
  if pg_column_size(payload) > 20000 then
    raise exception 'Submission is too large';
  end if;
  if v_name = '' then
    raise exception 'Business name is required';
  end if;
  if v_email = '' and v_phone = '' then
    raise exception 'An email or phone number is required';
  end if;
  if v_email <> '' and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Email address looks wrong';
  end if;

  -- Same person re-sending within 10 minutes (double click, retry): return the first reference.
  select s.ref into v_ref
  from public.onboarding_submissions s
  where s.created_at > now() - interval '10 minutes'
    and lower(s.business_name) = lower(v_name)
    and coalesce(lower(s.answers #>> '{contact,email}'), '') = v_email
  order by s.created_at desc limit 1;
  if v_ref is not null then
    return v_ref;
  end if;

  select coalesce(array_agg(left(x, 40)), '{}') into v_services
  from jsonb_array_elements_text(coalesce(payload -> 'sel', '[]'::jsonb)) as x;

  insert into public.clients (name, sector, market, status, source, contact_name, phone, whatsapp, email, notes)
  values (
    v_name,
    left(payload ->> 'industry', 80),
    'egypt',
    'lead',
    'website',
    left(btrim(coalesce(payload #>> '{contact,name}', '')), 200),
    nullif(v_phone, ''),
    case when v_channel = 'WhatsApp' then nullif(v_phone, '') end,
    nullif(v_email, ''),
    left(concat_ws(E'\n',
      nullif(btrim(coalesce(payload #>> '{biz,about}', '')), ''),
      'City: ' || nullif(btrim(coalesce(payload #>> '{biz,city}', '')), ''),
      'Role: ' || nullif(btrim(coalesce(payload #>> '{contact,role}', '')), ''),
      'Prefers: ' || nullif(v_channel, '')
    ), 4000)
  )
  returning id into v_client;

  v_ref := 'TB-' || to_char(now(), 'YYMM') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 5));

  insert into public.onboarding_submissions
    (ref, client_id, business_name, city, industry, stage, services, package_name, estimate_egp,
     timeline, budget, language, preferred_channel, answers)
  values (
    v_ref, v_client, v_name,
    left(payload #>> '{biz,city}', 120),
    left(payload ->> 'industry', 80),
    left(payload ->> 'stage', 40),
    v_services,
    left(payload #>> '{pricing,name}', 80),
    case when (payload #>> '{pricing,price}') ~ '^\d+(\.\d+)?$' then (payload #>> '{pricing,price}')::numeric end,
    left(payload ->> 'timeline', 40),
    left(payload ->> 'budget', 40),
    left(payload ->> 'lang', 40),
    nullif(v_channel, ''),
    payload
  );

  return v_ref;
end $$;

revoke all on function public.submit_onboarding(jsonb) from public;
grant execute on function public.submit_onboarding(jsonb) to anon, authenticated;

commit;
