-- GymBarrio App — esquema inicial
-- Tablas: gyms, exercises, routines, routine_exercises
-- Acceso: lectura pública (modo kiosco), escritura autenticada (admin)

-- ---------------------------------------------------------------------------
-- Extensiones
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------
create type public.routine_objective as enum (
  'fuerza',
  'cardio',
  'movilidad',
  'express'
);

create type public.routine_level as enum (
  'principiante',
  'intermedio',
  'avanzado'
);

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------
create table public.gyms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  constraint gyms_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'general',
  video_url text,
  duration_seconds integer not null default 60
    check (duration_seconds > 0),
  created_at timestamptz not null default now()
);

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  title text not null,
  objective public.routine_objective not null,
  level public.routine_level not null default 'intermedio',
  created_at timestamptz not null default now()
);

create table public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  sets integer not null default 3 check (sets > 0),
  reps integer not null default 10 check (reps > 0),
  rest_seconds integer not null default 60 check (rest_seconds >= 0),
  order_index integer not null default 0 check (order_index >= 0),
  unique (routine_id, order_index)
);

-- ---------------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------------
create index routines_gym_id_idx on public.routines (gym_id);
create index routines_objective_idx on public.routines (objective);
create index routine_exercises_routine_id_idx on public.routine_exercises (routine_id);
create index routine_exercises_order_idx on public.routine_exercises (routine_id, order_index);
create index exercises_category_idx on public.exercises (category);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.gyms enable row level security;
alter table public.exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;

-- Lectura pública (kiosco / socios sin login)
create policy "gyms_public_read"
  on public.gyms for select
  to anon, authenticated
  using (true);

create policy "exercises_public_read"
  on public.exercises for select
  to anon, authenticated
  using (true);

create policy "routines_public_read"
  on public.routines for select
  to anon, authenticated
  using (true);

create policy "routine_exercises_public_read"
  on public.routine_exercises for select
  to anon, authenticated
  using (true);

-- Escritura solo autenticados (panel admin)
create policy "gyms_auth_insert"
  on public.gyms for insert
  to authenticated
  with check (true);

create policy "gyms_auth_update"
  on public.gyms for update
  to authenticated
  using (true)
  with check (true);

create policy "gyms_auth_delete"
  on public.gyms for delete
  to authenticated
  using (true);

create policy "exercises_auth_insert"
  on public.exercises for insert
  to authenticated
  with check (true);

create policy "exercises_auth_update"
  on public.exercises for update
  to authenticated
  using (true)
  with check (true);

create policy "exercises_auth_delete"
  on public.exercises for delete
  to authenticated
  using (true);

create policy "routines_auth_insert"
  on public.routines for insert
  to authenticated
  with check (true);

create policy "routines_auth_update"
  on public.routines for update
  to authenticated
  using (true)
  with check (true);

create policy "routines_auth_delete"
  on public.routines for delete
  to authenticated
  using (true);

create policy "routine_exercises_auth_insert"
  on public.routine_exercises for insert
  to authenticated
  with check (true);

create policy "routine_exercises_auth_update"
  on public.routine_exercises for update
  to authenticated
  using (true)
  with check (true);

create policy "routine_exercises_auth_delete"
  on public.routine_exercises for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Seed de demo
-- ---------------------------------------------------------------------------
insert into public.gyms (name, slug) values
  ('Barrio Los Castores', 'barrio-los-castores'),
  ('Barrio Santa Clara', 'barrio-santa-clara');

insert into public.exercises (title, description, category, video_url, duration_seconds) values
  (
    'Sentadilla goblet',
    'Mantén el torso erguido y baja hasta que los muslos queden paralelos al piso.',
    'piernas',
    'https://www.youtube.com/embed/MeIiIdhvXT4',
    45
  ),
  (
    'Press de pecho con mancuernas',
    'Controlá la bajada y empujá sin bloquear los codos.',
    'pecho',
    'https://www.youtube.com/embed/VmB1G1K7v94',
    40
  ),
  (
    'Remo unilateral',
    'Apoyá una rodilla en el banco y llevá el codo hacia atrás.',
    'espalda',
    'https://www.youtube.com/embed/roCP6wCXPqo',
    40
  ),
  (
    'Plancha frontal',
    'Activá el core y mantené una línea recta de cabeza a talones.',
    'core',
    'https://www.youtube.com/embed/ASdvN_XEl_c',
    30
  ),
  (
    'Burpees',
    'Movimiento completo: sentadilla, plancha, flexión y salto.',
    'cardio',
    'https://www.youtube.com/embed/auBLPXO8Fww',
    30
  ),
  (
    'Movilidad de cadera 90/90',
    'Alterná la rotación interna y externa de cadera de forma controlada.',
    'movilidad',
    'https://www.youtube.com/embed/4BQLE_RrTSU',
    60
  );

-- Rutinas para Los Castores
insert into public.routines (gym_id, title, objective, level)
select id, 'Fuerza Full Body', 'fuerza', 'intermedio'
from public.gyms where slug = 'barrio-los-castores';

insert into public.routines (gym_id, title, objective, level)
select id, 'Cardio Explosivo', 'cardio', 'principiante'
from public.gyms where slug = 'barrio-los-castores';

insert into public.routines (gym_id, title, objective, level)
select id, 'Movilidad Matutina', 'movilidad', 'principiante'
from public.gyms where slug = 'barrio-los-castores';

insert into public.routines (gym_id, title, objective, level)
select id, 'Express 20 min', 'express', 'intermedio'
from public.gyms where slug = 'barrio-los-castores';

-- routine_exercises: Fuerza Full Body
insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 4, 10, 90, 0
from public.routines r
cross join public.exercises e
where r.title = 'Fuerza Full Body' and e.title = 'Sentadilla goblet';

insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 3, 12, 75, 1
from public.routines r
cross join public.exercises e
where r.title = 'Fuerza Full Body' and e.title = 'Press de pecho con mancuernas';

insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 3, 10, 75, 2
from public.routines r
cross join public.exercises e
where r.title = 'Fuerza Full Body' and e.title = 'Remo unilateral';

insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 3, 45, 45, 3
from public.routines r
cross join public.exercises e
where r.title = 'Fuerza Full Body' and e.title = 'Plancha frontal';

-- Cardio Explosivo
insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 4, 12, 45, 0
from public.routines r
cross join public.exercises e
where r.title = 'Cardio Explosivo' and e.title = 'Burpees';

insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 3, 15, 40, 1
from public.routines r
cross join public.exercises e
where r.title = 'Cardio Explosivo' and e.title = 'Sentadilla goblet';

-- Movilidad
insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 2, 8, 20, 0
from public.routines r
cross join public.exercises e
where r.title = 'Movilidad Matutina' and e.title = 'Movilidad de cadera 90/90';

insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 2, 30, 15, 1
from public.routines r
cross join public.exercises e
where r.title = 'Movilidad Matutina' and e.title = 'Plancha frontal';

-- Express
insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 3, 10, 40, 0
from public.routines r
cross join public.exercises e
where r.title = 'Express 20 min' and e.title = 'Sentadilla goblet';

insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 3, 10, 40, 1
from public.routines r
cross join public.exercises e
where r.title = 'Express 20 min' and e.title = 'Press de pecho con mancuernas';

insert into public.routine_exercises (routine_id, exercise_id, sets, reps, rest_seconds, order_index)
select r.id, e.id, 3, 8, 30, 2
from public.routines r
cross join public.exercises e
where r.title = 'Express 20 min' and e.title = 'Burpees';
