"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskList } from "@/components/TaskList";
import type { Task } from "@/components/TaskItem";

type Filter = "all" | "completed" | "pending" | "high";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  async function fetchTasks() {
    const res = await fetch("/api/tasks");
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = (await res.json()) as Task[];
    setTasks(data);
  }

  useEffect(() => {
    fetchTasks().catch((err) => {
      console.error(err);
      setError("Could not load tasks.");
    });
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q),
      );
    }
    if (filter === "completed") list = list.filter((t) => t.completed);
    if (filter === "pending") list = list.filter((t) => !t.completed);
    if (filter === "high") list = list.filter((t) => t.priority === "HIGH");
    return list;
  }, [tasks, search, filter]);

  async function handleToggleCompleted(task: Task) {
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          completed: !task.completed,
        }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = (await res.json()) as Task;
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
    } catch (err) {
      console.error(err);
      setError("Could not update task.");
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      setError("Could not delete task.");
    }
  }

  function handleEdit() {}

  return (
    <div className="min-h-screen font-sans text-zinc-900 dark:text-zinc-50">
      <Navbar />
      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                Tasks
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
              Manage, prioritize and track your work.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <div className="grid min-w-0 grid-cols-3 gap-1.5 text-xs sm:gap-2">
              <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800/90">
                <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                  Total
                </p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {totalTasks}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800/90">
                <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Done
                </p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {completedTasks}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800/90">
                <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  Pending
                </p>
                <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {pendingTasks}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-fuchsia-500 dark:focus:ring-fuchsia-500/20 sm:text-sm"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 text-xs scrollbar-none [-webkit-overflow-scrolling:touch] sm:flex-shrink-0 sm:overflow-visible sm:pb-0">
              {(
                [
                  ["all", "All"],
                  ["completed", "Done"],
                  ["pending", "Pending"],
                  ["high", "High"],
                ] as [Filter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`shrink-0 touch-manipulation rounded-full px-3 py-2 font-semibold transition sm:py-1.5 ${
                    filter === value
                      ? "bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 text-white shadow-md dark:shadow-fuchsia-500/20"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900/95 sm:p-3">
            <TaskList
              tasks={filteredTasks}
              onToggleCompleted={handleToggleCompleted}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </section>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </main>
    </div>
  );
}

