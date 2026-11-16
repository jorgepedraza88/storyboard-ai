-- Enable UUID generation
create extension if not exists "pgcrypto";

create table public.sequences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shots (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid not null references public.sequences(id) on delete cascade,
  description text not null,
  camera_shot_type text,               -- e.g. 'wide', 'close-up', 'over-the-shoulder' (freeform, no enum)
  position double precision not null,  -- fractional index for cheap drag-reorder (see below)
  image_url text,
  status text not null default 'pending'
    check (status in ('pending', 'generating', 'done', 'error')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shots_sequence_id_position_idx on public.shots (sequence_id, position);

-- shared updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_sequences_updated_at
  before update on public.sequences
  for each row execute function public.set_updated_at();

create trigger set_shots_updated_at
  before update on public.shots
  for each row execute function public.set_updated_at();

-- RLS: public anon-key access, no auth for MVP (single hobbyist user)
alter table public.sequences enable row level security;
alter table public.shots enable row level security;

create policy "sequences_public_all" on public.sequences
  for all using (true) with check (true);

create policy "shots_public_all" on public.shots
  for all using (true) with check (true);
