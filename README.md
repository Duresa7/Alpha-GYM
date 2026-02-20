# Alpha GYM

Local-first gym and body-weight tracker built with Next.js, Tailwind, shadcn/ui, Drizzle, and SQLite.

## Tech Stack

- Next.js App Router (TypeScript)
- Tailwind CSS + shadcn/ui
- SQLite (`better-sqlite3`) + Drizzle ORM
- React Hook Form + Zod
- Recharts + TanStack Table

## Features

- Dashboard (`/`) with key stats, weight trend, volume trend, and recent activity
- Quick Log (`/log`) with dynamic exercise/cardio rows, body weight, and notes
- Weekly Plan (`/plan`) with 7-day grouped schedule
- Exercise Library (`/exercises`) with category tabs
- History (`/history`) tables for exercise/cardio/weight logs with sorting, filtering, pagination, and delete actions

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Push schema to local SQLite DB:

```bash
npm run db:push
```

3. Seed exercise list and weekly plan:

```bash
npm run db:seed
```

4. Start development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run db:push` - push Drizzle schema
- `npm run db:generate` - generate Drizzle SQL artifacts
- `npm run db:studio` - open Drizzle Studio
- `npm run db:seed` - seed reference data

## Database

- DB file: `./data/alpha-gym.db`
- Tables:
  - `exercises`
  - `cardio`
  - `weight_log`
  - `workout_notes`
  - `exercise_list`
  - `weekly_plan`

## Verification Checklist

1. Submit a workout from `/log` (exercise/cardio/weight optional by workout type).
2. Confirm entries appear in `/history` tables.
3. Delete an entry in `/history` and confirm the table refreshes immediately.
4. Confirm dashboard stats/charts update on `/`.
5. Confirm weekly plan and exercise library render as expected.
