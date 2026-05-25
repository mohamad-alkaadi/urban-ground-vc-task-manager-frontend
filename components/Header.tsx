"use client";
/**
 * Header Component
 * Displays the application branding and a real-time server connection status indicator.
 *
 * @param isConnected - Boolean flag indicating if the WebSocket or API server is reachable.
 */

import { useEffect, useState } from "react";
const Header = ({ isConnected }: { isConnected: boolean }) => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    // If the server is connected, we don't need to run the animation timer
    if (isConnected) return;

    // Cycle the dots: 1 -> 2 -> 3 -> 1 every 500 milliseconds
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);

    // Clean up the timer to prevent memory leaks
    return () => clearInterval(interval);
  }, [isConnected]);
  const dots = ".".repeat(dotCount);

  return (
    <header className="text-center">
      <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        Urban Ground AI
      </h1>
      <p className="text-slate-400 mt-2">Voice-controlled Task Manager</p>
      <div
        className={`mt-2 text-xs font-mono transition-colors ${isConnected ? "text-emerald-500" : "text-red-500"}`}
      >
        {isConnected ? "● SERVER ONLINE" : `SERVER CONNECTING${dots}`}
      </div>
    </header>
  );
};

export default Header;
