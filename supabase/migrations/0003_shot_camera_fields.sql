-- Extend shots with title + full camera-language breakdown, matching the
-- richer shot-creation UI (shot type, angle, movement, lens, duration).
-- camera_shot_type keeps storing the "shot type" (wide, close-up, etc.).
alter table public.shots
  add column if not exists title text not null default '',
  add column if not exists camera_angle text,
  add column if not exists camera_movement text,
  add column if not exists lens text,
  add column if not exists duration integer not null default 4;
