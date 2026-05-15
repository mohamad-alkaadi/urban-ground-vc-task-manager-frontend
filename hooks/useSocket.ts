"use client";
import { Content } from "@/types/historyTypes";
import { useEffect, useState, useRef } from "react";

import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

/**
 * useSocket Hook
 * Manages the WebSocket connection lifecycle and maintains connection state.
 *
 * This centralizes the socket instance to prevent multiple connections
 * and ensures proper cleanup when the app or component unmounts.
 */
export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [history, setHistory] = useState<Content[]>([]);

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
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return { socket: socketRef, isConnected, history, setHistory };
};
