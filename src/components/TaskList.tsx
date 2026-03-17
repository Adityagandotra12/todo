import type { Task } from "./TaskItem";

type Props = {
  tasks: Task[];
  onToggleCompleted: (task: Task) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
};

import { TaskItem } from "./TaskItem";

export type { Task };

export function TaskList({ tasks, onToggleCompleted, onDelete, onEdit }: Props) {
  if (tasks.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No tasks found. Adjust filters or create a new one.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompleted={onToggleCompleted}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

