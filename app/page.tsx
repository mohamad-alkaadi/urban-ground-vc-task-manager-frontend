"use client";
import Header from "@/components/Header";
import TasksSection from "@/components/TasksSection";
import VoiceAgent from "@/components/VoiceAgent";
import { useVoiceTasks } from "@/hooks/useVoiceTasks";

/**
 * Main Entry Point: Voice Task Manager
 * This page coordinates the voice interaction logic with the UI display.
 * It uses a custom hook to manage state for transcripts, task lists, and socket connectivity.
 */
export default function Home() {
  // Destructure state and handlers from our core business logic hook
  const {
    tasks, // Array of task objects generated from voice input
    isProcessing, // UI loading state for AI processing/STT
    isSessionActive, // Toggle for the active recording/listening state
    setIsSessionActive,
    isConnected, // Connection status (e.g., WebSocket or API status)
    handleTranscript, // Callback function to process raw text into tasks
    voiceAgentRef, // Ref to access internal Canvas/Audio methods in VoiceAgent
  } = useVoiceTasks();
  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-12">
        {/* Visual feedback for connection health */}
        <Header isConnected={isConnected} />

        {/* The Audio Interface: Handles recording and visualizes the voice stream */}
        <VoiceAgent
          ref={voiceAgentRef}
          onTranscript={handleTranscript}
          isProcessing={isProcessing}
          isSessionActive={isSessionActive}
          setIsSessionActive={setIsSessionActive}
        />

        {/* The Data Display: Renders the list of tasks derived from the voice session */}
        <TasksSection tasks={tasks} />
      </div>
    </main>
  );
}
