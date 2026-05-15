/**
 * Header Component
 * Displays the application branding and a real-time server connection status indicator.
 *
 * @param isConnected - Boolean flag indicating if the WebSocket or API server is reachable.
 */

const Header = ({ isConnected }: { isConnected: boolean }) => {
  return (
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
  );
};

export default Header;
