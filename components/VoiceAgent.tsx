"use client";
// 1. Added useImperativeHandle to imports
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import {
  SpeechRecognitionEvent,
  SpeechRecognitionInstance,
} from "@/types/speechRecognitionTypes";

// Ensure your Props interface includes isSessionActive and setIsSessionActive
const VoiceAgent = forwardRef(
  (
    { onTranscript, isProcessing, isSessionActive, setIsSessionActive }: any,
    ref,
  ) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const onTranscriptRef = useRef(onTranscript);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
      startListening: () => {
        // Allows the parent to restart the loop after AI speaks [cite: 20]
        if (recognitionRef.current && !isListening) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error("Auto-start error:", err);
          }
        }
      },
    }));

    useEffect(() => {
      onTranscriptRef.current = onTranscript;
    }, [onTranscript]);

    useEffect(() => {
      if (recognitionRef.current) return;

      const SpeechRecognitionConstructor =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;

      if (SpeechRecognitionConstructor) {
        const rec =
          new SpeechRecognitionConstructor() as SpeechRecognitionInstance;
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onstart = () => {
          // Fulfills: "Assistant should stop playback immediately"
          window.speechSynthesis.cancel();
          setIsListening(true);
        };

        rec.onresult = (event: SpeechRecognitionEvent) => {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }

          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");

          silenceTimerRef.current = setTimeout(() => {
            if (transcript.trim().length > 2) {
              onTranscriptRef.current(transcript);
              rec.stop();
              setIsListening(false);
            }
          }, 2000);
        };

        rec.onerror = (event: any) => {
          if (event.error === "no-speech") {
            // We don't use console.error here to avoid the Next.js dev overlay.
            recognitionRef.current?.stop();
            setIsListening(false);
            setIsSessionActive(false);
            return; // Exit early
          }
          // console.error("🎤 Speech API Error:", event.error);

          if (event.error === "audio-capture") {
            // Hardware issues require a harder reset
            setIsListening(false);
            setIsSessionActive(false);
            alert("Microphone capture failed. Please check your permissions.");
          } else {
            // For other errors (network, aborted, etc.), kill the session
            setIsListening(false);
            setIsSessionActive(false);
          }
        };

        recognitionRef.current = rec;
      }
    }, [setIsSessionActive]); // Added dependency

    const toggleListening = () => {
      if (isListening || isSessionActive) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        recognitionRef.current?.stop();
        window.speechSynthesis.cancel();
        setIsSessionActive(false); // Fulfills manual stop [cite: 132]
        setIsListening(false);
      } else {
        recognitionRef.current?.start();
        setIsSessionActive(true); // Begins continuous Al workflow [cite: 28]
      }
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <button
          onClick={toggleListening}
          className={`relative p-8 rounded-full transition-all ${
            isSessionActive
              ? "bg-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {/* Keep the Ping animation active as long as the session is live.
          This visually confirms to the user: "I can hear you right now."
      */}
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

        <p className="text-sm font-medium transition-opacity duration-300">
          <span className={isSessionActive ? "text-red-400" : "text-slate-400"}>
            {isSessionActive
              ? isProcessing
                ? "AI is thinking..."
                : "I'm listening... speak anytime"
              : "Tap the mic to start talking"}
          </span>
        </p>
      </div>
    );
  },
);

// Added DisplayName for debugging
VoiceAgent.displayName = "VoiceAgent";
export default VoiceAgent;
