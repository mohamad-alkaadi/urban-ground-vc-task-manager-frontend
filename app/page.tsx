"use client";
import TaskList from "@/components/TaskList";
import VoiceAgent from "@/components/VoiceAgent";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]); // To store actual DB records
  const { socket, isConnected, history, setHistory } = useSocket();
  const hasFetched = useRef(false);

  useEffect(() => {
    const s = socket.current;
    if (!s) return;

    const handleAIResponse = (data: any) => {
      console.log("🚀 Global Listener Received:", data);

      if (data.updatedHistory) setHistory(data.updatedHistory);
      if (data.tasks) setTasks(data.tasks);

      setIsProcessing(false);
    };
    s.on("ai-response", handleAIResponse);
    return () => {
      s.off("ai-response", handleAIResponse);
    };
    // -----------------------------
  }, [socket, isConnected]);

  useEffect(() => {
    if (socket.current && isConnected && !hasFetched.current) {
      console.log("📡 Requesting initial task list...");
      socket.current.emit("user-message", {
        message: "get all my tasks",
        history: [],
      });
      hasFetched.current = true;
    }
  }, [socket, isConnected]);

  const handleTranscript = (message: string) => {
    if (!socket.current) return;
    console.log("🎤 Sending transcript:", message);
    setIsProcessing(true);
    socket.current.emit("user-message", { message, history });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Urban Ground AI
          </h1>
          <p className="text-slate-400 mt-2">Voice-controlled Task Manager</p>
          <div
            className={`mt-2 text-xs font-mono transition-colors ${isConnected ? "text-emerald-500" : "text-red-500"}`}
          >
            {isConnected ? "● SERVER ONLINE" : "○ SERVER OFFLINE"}
          </div>
        </header>

        <VoiceAgent
          onTranscript={handleTranscript}
          isProcessing={isProcessing}
        />

        {/* 3. The Visual Reward: The actual task list */}
        <section className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Live Tasks</h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
              {tasks.length} total
            </span>
          </div>

          <TaskList tasks={tasks} />
        </section>
      </div>
    </main>
  );
}
