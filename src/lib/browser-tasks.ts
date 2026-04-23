import type { Task } from "@/components/TaskItem";
import type { TaskFormValues } from "@/components/TaskForm";

const LS_KEY = "todo-app-tasks-v1";
const SS_KEY = "todo-use-browser";

/** Build-time: force browser storage (for Vercel without a reachable MySQL). */
export function browserTasksForcedByEnv(): boolean {
  return process.env.NEXT_PUBLIC_USE_BROWSER_TASKS === "true";
}

/** Client: env flag or session fallback after API/DB failure. */
export function browserTasksActive(): boolean {
  if (typeof window === "undefined") return false;
  return (
    browserTasksForcedByEnv() || sessionStorage.getItem(SS_KEY) === "1"
  );
}

export function enableBrowserTasksFallback(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SS_KEY, "1");
}

export function loadBrowserTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch {
    return [];
  }
}

function persistBrowserTasks(tasks: Task[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new Event("todo-tasks-changed"));
}

export function addBrowserTask(values: TaskFormValues): Task {
  const tasks = loadBrowserTasks();
  const id = tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;
  const createdAt = new Date().toISOString();
  const dueDate =
    values.dueDate && values.dueDate.trim()
      ? new Date(`${values.dueDate}T12:00:00`).toISOString()
      : null;
  const task: Task = {
    id,
    title: values.title.trim(),
    description: values.description?.trim()
      ? values.description.trim()
      : null,
    priority: values.priority,
    completed: false,
    dueDate,
    createdAt,
  };
  persistBrowserTasks([task, ...tasks]);
  return task;
}

export function setBrowserTaskCompleted(id: number, completed: boolean): Task | null {
  const tasks = loadBrowserTasks();
  const i = tasks.findIndex((t) => t.id === id);
  if (i === -1) return null;
  const updated: Task = { ...tasks[i], completed };
  const next = [...tasks];
  next[i] = updated;
  persistBrowserTasks(next);
  return updated;
}

export function updateBrowserTask(
  id: number,
  updates: Partial<Pick<Task, "title" | "description" | "priority" | "dueDate">>,
): Task | null {
  const tasks = loadBrowserTasks();
  const i = tasks.findIndex((t) => t.id === id);
  if (i === -1) return null;
  const updated: Task = { ...tasks[i], ...updates };
  const next = [...tasks];
  next[i] = updated;
  persistBrowserTasks(next);
  return updated;
}

export function deleteBrowserTask(id: number): void {
  persistBrowserTasks(loadBrowserTasks().filter((t) => t.id !== id));
}

/** Replace all browser tasks (e.g. seed from React state after API timeout). */
export function replaceBrowserTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  persistBrowserTasks(tasks);
}

/** Use DB error responses / messages to decide automatic browser fallback. */
export function shouldFallbackToBrowserStorage(message: string): boolean {
  return /pool timeout|ECONNREFUSED|ETIMEDOUT|getaddrinfo|ENOTFOUND|connect timed out|failed to retrieve a connection from pool/i.test(
    message,
  );
}
