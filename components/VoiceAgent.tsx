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

        let silenceTimer: NodeJS.Timeout;

        rec.onstart = () => {
          // Fulfills: "Assistant should stop playback immediately"
          window.speechSynthesis.cancel();
          setIsListening(true);
        };

        rec.onresult = (event: SpeechRecognitionEvent) => {
          clearTimeout(silenceTimer);
          // Secondary interruption check [cite: 131, 133]
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }

          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");

          silenceTimer = setTimeout(() => {
            if (transcript.trim().length > 2) {
              onTranscriptRef.current(transcript);
              rec.stop();
              setIsListening(false);
            }
          }, 2000);
        };

        rec.onerror = (event: any) => {
          console.error("🎤 Speech API Error:", event.error);
          setIsListening(false);
          setIsSessionActive(false);
        };

        recognitionRef.current = rec;
      }
    }, [setIsSessionActive]); // Added dependency

    const toggleListening = () => {
      if (isListening) {
        recognitionRef.current?.stop();
        setIsSessionActive(false); // Fulfills manual stop [cite: 132]
      } else {
        recognitionRef.current?.start();
        setIsSessionActive(true); // Begins continuous Al workflow [cite: 28]
      }
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`relative p-8 rounded-full transition-all ${
            isListening
              ? "bg-red-500 scale-110"
              : "bg-blue-600 hover:bg-blue-700"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          )}

          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : isListening ? (
            <MicOff className="w-8 h-8 text-white relative z-10" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
        <p className="text-sm font-medium text-slate-400">
          {isListening
            ? "Listening..."
            : isProcessing
              ? "AI is thinking..."
              : "Tap to speak"}
        </p>
      </div>
    );
  },
);

// Added DisplayName for debugging
VoiceAgent.displayName = "VoiceAgent";
export default VoiceAgent;
