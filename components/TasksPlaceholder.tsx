import { Calendar } from "lucide-react";

/**
 * TasksPlaceholder Component
 *
 * Rendered when the task list is empty.
 * Serves as both a visual fallback and a "Call to Action" (CTA)
 * to guide the user on how to interact with the Voice Agent.
 */
const TasksPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
      <div className="p-3 bg-slate-800/50 rounded-full mb-3">
        <Calendar className="w-6 h-6 text-slate-500" />
      </div>
      <p className="text-slate-400 text-sm font-medium">No tasks found</p>
      <p className="text-slate-600 text-xs mt-1 text-center">
        Try saying &quot;Add a task to call my brother tomorrow&quot;
      </p>
    </div>
  );
};

export default TasksPlaceholder;
