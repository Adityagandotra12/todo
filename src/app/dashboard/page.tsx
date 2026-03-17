"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import type { Task } from "@/components/TaskItem";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tasks");
      const data = (await res.json()) as Task[];
      setTasks(data);
    }
    load();
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
      </main>
    </div>
  );
}

