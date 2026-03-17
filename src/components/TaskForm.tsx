import { useState, useEffect } from "react";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type TaskFormValues = {
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
};

type Props = {
  initialValues?: TaskFormValues;
  onSubmit: (values: TaskFormValues) => Promise<void> | void;
  submitting?: boolean;
};

export function TaskForm({ initialValues, onSubmit, submitting }: Props) {
  const [values, setValues] = useState<TaskFormValues>({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
  });

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title,
        description: initialValues.description,
        priority: initialValues.priority,
        dueDate: initialValues.dueDate ?? "",
      });
    }
  }, [initialValues]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.title.trim()) return;
    await onSubmit(values);
    if (!initialValues) {
      setValues({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl p-3 text-sm sm:p-4"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
        <input
          name="title"
          type="text"
          placeholder="Task title"
          value={values.title}
          onChange={handleChange}
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-fuchsia-500 dark:focus:ring-fuchsia-500/20"
        />
        <div className="flex gap-2 sm:shrink-0">
          <select
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className="flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-xs font-medium text-zinc-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-fuchsia-500 dark:focus:ring-fuchsia-500/20 sm:w-28"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <input
            name="dueDate"
            type="date"
            value={values.dueDate ?? ""}
            onChange={handleChange}
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-2 py-2.5 text-xs font-medium text-zinc-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-fuchsia-500 dark:focus:ring-fuchsia-500/20 sm:w-36"
          />
        </div>
      </div>
      <textarea
        name="description"
        placeholder="Description (optional)"
        value={values.description}
        onChange={handleChange}
        rows={2}
        className="w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-fuchsia-500 dark:focus:ring-fuchsia-500/20"
      />
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={submitting || !values.title.trim()}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-fuchsia-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-fuchsia-500/20 sm:w-auto sm:min-h-0 sm:py-2 sm:text-xs"
        >
          {submitting ? "Saving..." : initialValues ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
}

