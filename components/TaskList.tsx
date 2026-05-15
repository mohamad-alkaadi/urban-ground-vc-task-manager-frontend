"use client";

import { AnimatePresence } from "framer-motion";
import { TaskType } from "@/types/tasksTypes";
import Task from "./Task";
import TasksPlaceholder from "./TasksPlaceholder";

interface TaskListProps {
  tasks: TaskType[];
}

/**
 * TaskList Component
 * Renders a scrollable list of tasks with sophisticated entry/exit animations.
 *
 * Handles the empty state automatically by switching to a placeholder view.
 */
export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <TasksPlaceholder />;
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </ul>
  );
}
