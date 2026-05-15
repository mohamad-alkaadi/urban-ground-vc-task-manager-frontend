import { Mic, MicOff, Loader2 } from "lucide-react";

/**
 * MicButton Component
 * A multi-state toggle button that handles the voice interaction UI.
 *
 * States handled:
 * 1. Idle: Blue background, Mic icon.
 * 2. Listening: Red background, MicOff icon, Pulse animation.
 * 3. Processing: Red background, Spinner icon (STT/LLM logic active).
 */
const MicButton = ({
  toggleListening,
  isSessionActive,
  isProcessing,
}: {
  toggleListening: () => void;
  isSessionActive: boolean;
  isProcessing: boolean;
}) => {
  return (
    <button
      onClick={toggleListening}
      className={`relative p-8 rounded-full transition-all ${
        isSessionActive
          ? "bg-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {isSessionActive && !isProcessing && (
        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
      )}

      {isProcessing && isSessionActive ? (
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      ) : isSessionActive ? (
        <MicOff className="w-8 h-8 text-white relative z-10" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
    </button>
  );
};

export default MicButton;
