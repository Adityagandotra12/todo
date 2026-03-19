"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import type { Task } from "@/components/TaskItem";
import {
  browserTasksActive,
  browserTasksForcedByEnv,
  enableBrowserTasksFallback,
  loadBrowserTasks,
  shouldFallbackToBrowserStorage,
} from "@/lib/browser-tasks";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usingBrowserStorage, setUsingBrowserStorage] = useState(false);

  useEffect(() => {
    async function load() {
      if (browserTasksForcedByEnv() || browserTasksActive()) {
        setTasks(loadBrowserTasks());
        setUsingBrowserStorage(true);
        setError(null);
        return;
      }
      try {
        const res = await fetch("/api/tasks");

        if (!res.ok) {
          let msg = "Failed to fetch tasks";
          try {
            const payload = (await res.json()) as {
              error?: string;
              message?: string;
            };
            msg = payload.message ?? payload.error ?? msg;
          } catch {
            msg = `HTTP ${res.status}`;
          }
          throw new Error(msg);
        }

        const data = (await res.json()) as unknown;
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response from tasks API");
        }

        setTasks(data as Task[]);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
        const msg = e instanceof Error ? e.message : String(e);
        if (shouldFallbackToBrowserStorage(msg)) {
          enableBrowserTasksFallback();
          setTasks(loadBrowserTasks());
          setUsingBrowserStorage(true);
          setError(null);
          return;
        }
        setError("Could not load dashboard data.");
        setTasks([]);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const onChange = () => {
      if (browserTasksForcedByEnv() || browserTasksActive()) {
        setTasks(loadBrowserTasks());
      }
    };
    window.addEventListener("todo-tasks-changed", onChange);
    return () => window.removeEventListener("todo-tasks-changed", onChange);
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter((t) => t.priority === "HIGH").length;

  const cards = [
    {
      label: "Total Tasks",
      value: total,
      color:
        "bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 text-white shadow-fuchsia-500/20",
    },
    {
      label: "Completed",
      value: completed,
      color:
        "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-emerald-500/20",
    },
    {
      label: "Pending",
      value: pending,
      color:
        "bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-amber-500/20",
    },
    {
      label: "High Priority",
      value: highPriority,
      color:
        "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-500/20",
    },
  ];

  return (
    <div className="min-h-screen font-sans text-zinc-900 dark:text-zinc-50">
      <Navbar />
      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            Overview of your tasks and priorities.
          </p>
        </header>
        {usingBrowserStorage && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
            <span className="font-semibold">Browser storage:</span> counts
            reflect tasks saved on this device only.
          </p>
        )}
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl p-4 shadow-xl sm:p-5 ${card.color}`}
            >
              <p className="text-[10px] font-semibold opacity-90 sm:text-xs">{card.label}</p>
              <p className="mt-1.5 text-2xl font-semibold sm:mt-2 sm:text-3xl">{card.value}</p>
            </div>
          ))}
        </section>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </main>
    </div>
  );
}

