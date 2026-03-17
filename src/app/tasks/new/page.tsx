"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { TaskForm, type TaskFormValues } from "@/components/TaskForm";

export default function NewTaskPage() {
  const router = useRouter();

  async function handleCreate(values: TaskFormValues) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      throw new Error("Failed to create task");
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen font-sans text-zinc-900 dark:text-zinc-50">
      <Navbar />
      <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6 sm:gap-6 sm:px-6 sm:py-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              Create a new task
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            Add details, set priority, and (optionally) a due date.
          </p>
        </header>

        <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-200/50 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/95 dark:shadow-none sm:p-4">
          <TaskForm onSubmit={handleCreate} />
        </div>
      </main>
    </div>
  );
}

