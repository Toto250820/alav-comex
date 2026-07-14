-- ═══════════════════════════════════════════════════════════
-- ALAV COMEX — Tabla de control de ZFE3 ya procesados
-- Correr UNA sola vez en: Supabase → tu proyecto → SQL Editor → New query
-- Evita descontar el mismo ZFE3 dos veces del stock por error.
-- ═══════════════════════════════════════════════════════════

create table if not exists zfe3_procesados (
  despacho text primary key,
  fecha date,
  procesado_por text,
  procesado_en timestamptz default now(),
  items_afectados integer
);

alter table zfe3_procesados disable row level security;
