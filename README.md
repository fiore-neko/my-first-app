# GymBarrio App

PWA para gimnasios de barrios privados: socios eligen objetivo, siguen rutinas con video y temporizador de descanso. Optimizada para celular y tablets en modo kiosco.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Lucide React
- Supabase (Auth + Postgres)

## Arranque rápido (modo demo)

Sin configurar Supabase, la app usa datos mock:

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) y entrá a `/gym/barrio-los-castores`.

## Supabase

1. Creá un proyecto en Supabase.
2. Corré el SQL de `supabase/migrations/20261005120000_initial_schema.sql` en el SQL Editor (o con la CLI).
3. Copiá `.env.local.example` a `.env.local` y completá las keys.
4. Creá un usuario en Authentication para el panel `/admin`.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Selección de gym / código (modo kiosco) |
| `/gym/[slug]` | Objetivos / rutinas del gym |
| `/gym/[slug]/routine/[id]` | Lista de ejercicios + comenzar |
| `/gym/[slug]/routine/[id]/play` | Reproductor guiado |
| `/admin` | Auth + CRUD ejercicios |
| `/admin/routines` | Creador de rutinas |

## Estructura clave

```
src/app/                  # App Router
src/components/           # UI de flujo + WorkoutPlayer
src/lib/supabase/         # Clientes browser/server
src/lib/data.ts           # Acceso a datos (Supabase o mock)
supabase/migrations/      # Esquema SQL
```
