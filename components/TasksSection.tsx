import TaskList from "./TaskList";
import { TaskType } from "@/types/tasksTypes";

/**
 * TasksSection Component
 *
 * Acts as the primary container for the task management UI.
 * Features a glassmorphism design (backdrop-blur) and displays
 * a real-time count of tasks currently in the state.
 */
const TasksSection = ({ tasks }: { tasks: TaskType[] }) => {
  return (
    <section className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Live Tasks</h2>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
          {tasks.length} total
        </span>
      </div>

      <TaskList tasks={tasks} />
    </section>
  );
};

export default TasksSection;
