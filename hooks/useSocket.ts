"use client";
import { Content } from "@/types/historyTypes";
import { TaskType } from "@/types/tasksTypes";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export interface AiResponseData {
  text: string;
  tasks: TaskType[];
  updatedHistory: Content[];
  error?: boolean;
  awaitingConfirmation?: boolean;
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [history, setHistory] = useState<Content[]>([]);
  const [uiError, setUiError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    // Cleanup ONLY when the whole app unmounts
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []); // 👈 EMPTY ARRAY! This prevents the disconnect loop!

  return {
    socket: socketRef,
    isConnected,
    history,
    setHistory,
    uiError,
    setUiError,
  };
};
