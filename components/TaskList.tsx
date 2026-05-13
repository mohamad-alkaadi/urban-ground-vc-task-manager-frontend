"use client";

import { CheckCircle2, Circle, Calendar, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define the interface to match your Supabase schema
interface Task {
  id: number;
  title: string;
  status: "pending" | "completed";
  due_date?: string;
}

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  // 1. Handle Empty State
  if (tasks.length === 0) {
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
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/40 rounded-2xl hover:bg-slate-800/50 transition-all group"
          >
            <div className="flex items-center space-x-4">
              {/* 3. Task Content */}
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
        ))}
      </AnimatePresence>
    </ul>
  );
}
