"use client";
import { Content } from "@/types/historyTypes";
import { useEffect, useState, useRef } from "react";

import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

interface AiResponseData {
  text: string;
  tasks: any[];
  updatedHistory: Content[];
  error?: boolean;
}

interface UseSocketProps {
  onTasksConfig?: (tasks: any[]) => void;
  onProcessingConfig?: (isProcessing: boolean) => void;
}
/**
 * useSocket Hook
 * Manages the WebSocket connection lifecycle and maintains connection state.
 *
 * This centralizes the socket instance to prevent multiple connections
 * and ensures proper cleanup when the app or component unmounts.
 */
export const useSocket = (props?: UseSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [history, setHistory] = useState<Content[]>([]);
  const [uiError, setUiError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Connection Configuration:
     * - reconnectionAttempts: Limits reconnection loops to prevent client-side resource exhaustion.
     * - transports: Forced to ["websocket"] to skip long-polling (standard for modern real-time apps).
     */
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("ai-response", (data: AiResponseData) => {
      // 1. Turn off loaders using the parent's configuration handler
      if (props?.onProcessingConfig) {
        props.onProcessingConfig(false);
      }

      if (data.error) {
        setUiError(data.text);

        // Error voice announcement fallback
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));
        }
      } else {
        setUiError(null); // Clear previous errors on success

        // 2. Push fresh task state directly into useVoiceTasks
        if (props?.onTasksConfig) {
          props.onTasksConfig(data.tasks);
        }

        setHistory(data.updatedHistory);

        // Standard TTS response execution
        if (
          data.text &&
          typeof window !== "undefined" &&
          window.speechSynthesis
        ) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(data.text));
        }
      }
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [props?.onTasksConfig, props?.onProcessingConfig]);

  return {
    socket: socketRef,
    isConnected,
    history,
    setHistory,
    uiError,
    setUiError,
  };
};
