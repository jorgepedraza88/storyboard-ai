-- Organizational-only fields, not fed into the image generation prompt:
-- dialogue lines spoken during the shot, and the narrative purpose/goal of the shot.
alter table public.shots
  add column if not exists dialogue text,
  add column if not exists purpose text;
