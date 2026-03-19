# Task Manager (Next.js + Prisma + MySQL/MariaDB)

A full-stack task manager built with:

- **Next.js App Router** (`src/app/`)
- **React 19** components (`src/components/`)
- **Prisma** for database access (`prisma/`, `src/lib/prisma.ts`)
- **Tailwind CSS v4** for styling (`src/app/globals.css`)
- **Theme switching** via `next-themes`

---

## Project structure

```text
todo-app/
  src/
    app/
      layout.tsx              # Root layout (wraps all routes)
      globals.css             # Global styles + theme background
      page.tsx                # "/" route (redirects to /tasks/new)
      tasks/
        page.tsx              # "/tasks" - list + filters
        new/
          page.tsx            # "/tasks/new" - create form
      dashboard/
        page.tsx              # "/dashboard" - summary cards
      api/
        tasks/
          route.ts            # "/api/tasks" - GET/POST/PUT/DELETE

    components/
      Navbar.tsx              # Shared nav (desktop + mobile drawer)
      TaskForm.tsx            # Create/update task form
      TaskList.tsx            # Renders list of TaskItem
      TaskItem.tsx            # Single task row (toggle/delete)
      ThemeProvider.tsx       # Wraps next-themes provider
      ThemeToggle.tsx         # Light/dark toggle button

    lib/
      prisma.ts               # Prisma client + MariaDB adapter

  prisma/
    schema.prisma             # Data models (User, Task, Priority)
    migrations/               # Prisma migrations

  scripts/
    dev-mobile.js             # Starts dev server on 0.0.0.0 + prints mobile URL

  package.json                # Scripts + dependencies
  .env.example                # Environment variable template
```

---

## How the app works (high-level)

### Routing (App Router)

Routes are file-based under `src/app/`:

- **`/`** → `src/app/page.tsx` → redirects to **`/tasks/new`**
- **`/tasks/new`** → create a task
- **`/tasks`** → view/search/filter tasks
- **`/dashboard`** → summary counters

The root wrapper is `src/app/layout.tsx`, which renders `<ThemeProvider>{children}</ThemeProvider>`. Every route is rendered inside this layout.

### UI composition

Each page composes reusable components:

- Pages render **`<Navbar />`** + their screen content
- `TaskList` maps tasks into `TaskItem`
- `TaskForm` emits values to the page via `onSubmit(...)`

### Data flow (client → API → DB)

1. UI calls the API with `fetch("/api/tasks", ...)`
2. Next.js route handler `src/app/api/tasks/route.ts` handles the request
3. API uses Prisma client from `src/lib/prisma.ts`
4. Prisma talks to the database using the MariaDB adapter
5. JSON is returned back to the UI

---

## API design

Endpoint: **`/api/tasks`**

- **GET**: returns tasks (supports query params `q` and `filter`)
- **POST**: creates a task
- **PUT**: updates a task (toggle completed, edit fields)
- **DELETE**: deletes a task

Note: the API currently uses a placeholder user id (`DEFAULT_USER_ID = 1`) and does not implement authentication yet.

---

## Database design (Prisma)

Models live in `prisma/schema.prisma`:

- **`User`**: `id`, `email`, `password`, `createdAt`, `tasks[]`
- **`Task`**: `id`, `title`, `description?`, `priority`, `completed`, `dueDate?`, `createdAt`, `userId`
- **`Priority`** enum: `LOW | MEDIUM | HIGH`

---

## UI / Design system

### Visual style

- **Modern gradient accents** (indigo → fuchsia → pink)
- **Soft background orbs** for depth (light + dark versions in `globals.css`)
- **Rounded surfaces** (`rounded-xl/2xl`) + subtle shadows
- **Typography**: Geist fonts via `next/font`

### Responsiveness (mobile-first)

Key rules used across components:

- **No horizontal overflow**: `overflow-x: hidden` in global styles
- **Safe-area support**: padding via `env(safe-area-inset-*)`
- **Tap targets**: mobile buttons/controls are sized ~44px+
- **Navbar**: mobile drawer menu; desktop icon+label nav
- **Tasks filters**: horizontal scroll pills on small screens

---

## Local development

Install dependencies:

```bash
npm install
```

Create your env file:

```bash
cp .env.example .env
```

Start dev server:

```bash
npm run dev
```

Open in browser:

- `http://localhost:3000`

### Vercel without a reachable MySQL

If the database is not available (e.g. pool timeout on Vercel), **Add Task** automatically falls back to **browser storage** so the app still works. Tasks are saved in `localStorage` for that browser only.

You can also force this mode in production by setting in Vercel:

- `NEXT_PUBLIC_USE_BROWSER_TASKS` = `true`

API calls use a **short client timeout** (~1.2s for saves, ~2.2s for lists) so a stuck database does not block the UI for ~10 seconds; the app can fall back to browser storage when needed.

---

## Open on your phone (same Wi‑Fi)

Run:

```bash
npm run dev:mobile
```

This starts Next.js on **`0.0.0.0:3000`**, detects your local IP, and prints a ready URL like:

- `http://192.168.x.x:3000`

If local LAN access fails and `ngrok` is installed, it will print an `https://...ngrok...` URL.

---

## Common troubleshooting

- **Phone can’t open local URL**: ensure phone + laptop are on the same Wi‑Fi and try disabling VPN.
- **Firewall prompt**: allow incoming connections for Node/Next if macOS asks.
- **Database errors**: verify `.env` matches your MySQL/MariaDB connection.

---

## Deploy “live” from GitHub

This project is a full-stack Next.js app that uses **Prisma** and **API routes**, so it needs a backend runtime (not static GitHub Pages).

You can deploy it to any Next.js-compatible host (for example, Vercel, Netlify, or a custom Node server) by:

1. Pushing this repo to GitHub (already done).
2. Creating a project on your chosen platform and linking this GitHub repo.
3. Configuring the environment variables from `.env.example`.

Deployment steps depend on the platform you choose.

### Vercel + MySQL only on your laptop

**Vercel cannot open a TCP connection to MySQL that runs only on your PC.**  
On your laptop, `localhost` is *your* machine. On Vercel, `localhost` is *their* server — there is no MySQL there, so Prisma waits until the pool **times out (~10s)**. That is not a bug in this repo; it’s how the internet works.

If you **do not want a hosted/cloud database**, you can still ship the app in these ways:

| Approach | Idea |
|--------|------|
| **Self-host Next.js** | Run `npm run build && npm start` (or Docker) on the **same machine** as MySQL, or on your home server. Use your LAN IP, Tailscale, or your own domain. No Vercel required for DB. |
| **Tunnel only the API (advanced)** | Keep MySQL on the PC; run a TCP tunnel (e.g. ngrok TCP, Cloudflare Tunnel) so Vercel’s `DATABASE_URL` points at a **public hostname** that forwards to your MySQL. Your laptop + tunnel must stay on; not ideal for real users, and lock down access. |
| **Demo without Vercel DB** | Use `npm run dev:mobile` / ngrok for **the Next app** so others hit your laptop; DB stays local. |

There is **no code-only change** that makes Vercel magically use your private `localhost` MySQL without one of the above.

