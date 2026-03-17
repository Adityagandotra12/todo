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

