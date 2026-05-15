/**
 * MicText Component
 * Provides textual guidance to the user based on the voice agent's state.
 *
 * Logic Priority:
 * 1. Processing (AI Thinking)
 * 2. Active (Listening)
 * 3. Idle (Ready)
 */
const MicText = ({
  isSessionActive,
  isProcessing,
}: {
  isSessionActive: boolean;
  isProcessing: boolean;
}) => {
  return (
    <p className="text-sm font-medium transition-opacity duration-300">
      <span className={isSessionActive ? "text-red-400" : "text-slate-400"}>
        {isSessionActive
          ? isProcessing
            ? "AI is thinking..."
            : "I'm listening... speak anytime"
          : "Tap the mic to start talking"}
      </span>
    </p>
  );
};

export default MicText;
