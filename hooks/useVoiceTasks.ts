import { useSocket } from "@/hooks/useSocket";
import { TaskType } from "@/types/tasksTypes";
import { useEffect, useRef, useState } from "react";
import { useVoiceSynthesis } from "./useVoiceSynthesis";

export const useVoiceTasks = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const { socket, isConnected, history, setHistory, uiError, setUiError } =
    useSocket({
      onTasksConfig: (newTasks) => setTasks(newTasks),
      onProcessingConfig: (processingState) => setIsProcessing(processingState),
    });
  const hasFetched = useRef(false);
  const voiceAgentRef = useRef<{ startListening: () => void } | null>(null);
  const { speak } = useVoiceSynthesis();
  const triggerMic = () => {
    if (voiceAgentRef.current) {
      voiceAgentRef.current.startListening();
    }
  };

  const handleTranscript = (message: string) => {
    if (!socket.current) return;
    window.speechSynthesis.cancel();
    console.log("🎤 Sending transcript:", message);
    setIsProcessing(true);
    socket.current.emit("user-message", { message, history });
  };

  useEffect(() => {
    if (!isSessionActive) {
      setIsProcessing(false);
      window.speechSynthesis.cancel();
    }
  }, [isSessionActive]);

  useEffect(() => {
    const s = socket.current;
    if (!s) return;

    const handleAIResponse = (data: any) => {
      console.log("🚀 Global Listener Received:", data);

      if (data.tasks) setTasks(data.tasks);
      if (data.updatedHistory) setHistory(data.updatedHistory);

      if (!isSessionActive) {
        setIsProcessing(false);
        return;
      }
      if (data.text) {
        speak(data.text, () => {
          if (isSessionActive || data.awaitingConfirmation) {
            triggerMic();
          }
        });
      }
      setIsProcessing(false);
    };
    s.on("ai-response", handleAIResponse);
    return () => {
      s.off("ai-response", handleAIResponse);
    };
  }, [socket, isConnected, isSessionActive]);

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

  return {
    tasks,
    isProcessing,
    isSessionActive,
    setIsSessionActive,
    isConnected,
    handleTranscript,
    voiceAgentRef,
    uiError, // 👈 Added
    setUiError, // 👈 Added
  };
};
