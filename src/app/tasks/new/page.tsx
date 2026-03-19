"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TaskForm, type TaskFormValues } from "@/components/TaskForm";
import {
  addBrowserTask,
  browserTasksActive,
  browserTasksForcedByEnv,
  enableBrowserTasksFallback,
  shouldFallbackToBrowserStorage,
} from "@/lib/browser-tasks";

export default function NewTaskPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(values: TaskFormValues) {
    setSubmitting(true);
    setError(null);

    try {
      // Optional: always use browser storage on Vercel when env is set
      if (browserTasksForcedByEnv() || browserTasksActive()) {
        addBrowserTask(values);
        router.push("/tasks");
        router.refresh();
        return;
      }

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        let msg = "Failed to create task";
        try {
          const payload = (await res.json()) as {
            error?: string;
            message?: string;
          };
          msg = payload.message ?? payload.error ?? msg;
        } catch {
          // ignore parse errors
        }

        if (res.status === 400) {
          setError(msg);
          return;
        }

        // DB unreachable (e.g. pool timeout on Vercel + local MySQL) → save in browser
        if (
          res.status >= 500 ||
          shouldFallbackToBrowserStorage(msg)
        ) {
          enableBrowserTasksFallback();
          addBrowserTask(values);
          router.push("/tasks");
          router.refresh();
          return;
        }

        setError(msg);
        return;
      }

      router.push("/tasks");
      router.refresh();
    } catch (e) {
      console.error("Create task error:", e);
      // Network error or timeout → browser fallback so Add Task still works
      enableBrowserTasksFallback();
      addBrowserTask(values);
      router.push("/tasks");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
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
          <TaskForm onSubmit={handleCreate} submitting={submitting} />
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </main>
    </div>
  );
}

