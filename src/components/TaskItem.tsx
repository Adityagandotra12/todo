import type { Priority } from "./TaskForm";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
};

type Props = {
  task: Task;
  onToggleCompleted: (task: Task) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
};

function priorityColor(priority: Priority) {
  if (priority === "HIGH")
    return "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm shadow-rose-500/20";
  if (priority === "LOW")
    return "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm shadow-emerald-500/20";
  return "bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-sm shadow-amber-500/20";
}

export function TaskItem({ task, onToggleCompleted, onDelete, onEdit }: Props) {
  return (
    <div className="group flex flex-wrap items-start gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/90 dark:hover:bg-zinc-800 sm:flex-nowrap sm:gap-3">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleCompleted(task)}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-300 text-indigo-600 focus:ring-indigo-400 dark:border-zinc-600 dark:bg-zinc-700 dark:text-fuchsia-500"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <p
            className={`min-w-0 flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-50 sm:flex-none ${
              task.completed ? "line-through text-zinc-400 dark:text-zinc-500" : ""
            }`}
          >
            {task.title}
          </p>
          <span
            className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityColor(
              task.priority,
            )}`}
          >
            {task.priority.toLowerCase()}
          </span>
        </div>
        {task.description && (
          <p className="line-clamp-2 break-words text-xs text-zinc-600 dark:text-zinc-300">
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-x-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>
            Created{" "}
            {new Date(task.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
          {task.dueDate && (
            <span>
              Due{" "}
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
      <div className="flex w-full shrink-0 flex-row gap-3 opacity-100 sm:w-auto sm:flex-col sm:opacity-0 sm:transition sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="touch-manipulation text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="touch-manipulation text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

