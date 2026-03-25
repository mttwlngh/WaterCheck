-- ══════════════════════════════════════════════════════════
-- WaterCheck – Supabase Migration
-- Ausführen in: Supabase Dashboard → SQL Editor → New query
-- ══════════════════════════════════════════════════════════

-- Tabelle: täglicher Wasserstand pro User
create table if not exists public.water_intake (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null default current_date,
  intake_ml   integer not null default 0 check (intake_ml >= 0 and intake_ml <= 3000),
  updated_at  timestamptz not null default now(),

  -- Jeder User hat maximal einen Eintrag pro Tag
  unique (user_id, date)
);

-- Index für schnelle Abfragen nach user_id + date
create index if not exists water_intake_user_date_idx
  on public.water_intake (user_id, date);

-- ── Row Level Security ──────────────────────────────────
alter table public.water_intake enable row level security;

-- Jeder User sieht und bearbeitet nur seine eigenen Zeilen
create policy "Users can read own intake"
  on public.water_intake for select
  using (auth.uid() = user_id);

create policy "Users can insert own intake"
  on public.water_intake for insert
  with check (auth.uid() = user_id);

create policy "Users can update own intake"
  on public.water_intake for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own intake"
  on public.water_intake for delete
  using (auth.uid() = user_id);

-- ── Helper-Funktion: upsert (insert or update) ──────────
-- Wird vom Frontend über RPC aufgerufen
create or replace function public.upsert_water_intake(
  p_date      date,
  p_intake_ml integer
)
returns public.water_intake
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.water_intake;
begin
  insert into public.water_intake (user_id, date, intake_ml, updated_at)
  values (auth.uid(), p_date, p_intake_ml, now())
  on conflict (user_id, date)
  do update set
    intake_ml  = excluded.intake_ml,
    updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;
