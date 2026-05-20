"use client";
import { AiResponseData, useSocket } from "@/hooks/useSocket";
import { TaskType } from "@/types/tasksTypes";
import { useEffect, useRef, useState } from "react";
import { useVoiceSynthesis } from "./useVoiceSynthesis";

export const useVoiceTasks = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // 1. Just call useSocket cleanly, no props needed!
  const { socket, isConnected, history, setHistory, uiError, setUiError } =
    useSocket();

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

    const handleAIResponse = (data: AiResponseData) => {
      // 🚨 INTERCEPT BACKEND ERRORS
      if (data.error) {
        setIsProcessing(false);
        setIsSessionActive(false);
        setUiError(data.text); // 👈 Show red banner
        window.speechSynthesis.cancel();

        if (data.text) {
          speak(data.text, () => {});
        }
        return;
      }

      // --- Normal Success Path ---
      setUiError(null); // 👈 Clear any previous errors on success
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
  }, [socket, isConnected, isSessionActive, speak, setHistory, setUiError]);

  useEffect(() => {
    if (socket.current && isConnected && !hasFetched.current) {
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
    uiError,
    setUiError,
  };
};
