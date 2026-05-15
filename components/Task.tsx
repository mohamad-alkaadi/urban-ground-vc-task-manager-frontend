import { Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { TaskType } from "@/types/tasksTypes";

/**
 * Task Component
 * Represents an individual task item in the list with entry/exit animations.
 *
 * Features:
 * - Framer Motion animations for smooth list transitions.
 * - Conditional styling based on "completed" status.
 * - Formatted date display using European (en-DE) locale.
 */
const Task = ({ task }: { task: TaskType }) => {
  return (
    <motion.li
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/40 rounded-2xl hover:bg-slate-800/50 transition-all group"
    >
      <div className="flex items-center space-x-4">
        <div className="min-w-0">
          <p
            className={`font-medium truncate transition-all ${
              task.status === "completed"
                ? "line-through text-slate-500"
                : "text-slate-200"
            }`}
          >
            {task.title}
          </p>
          {task.due_date && (
            <div className="flex items-center text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-semibold">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(task.due_date).toLocaleDateString("en-DE", {
                timeZone: "UTC",
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
};

export default Task;
