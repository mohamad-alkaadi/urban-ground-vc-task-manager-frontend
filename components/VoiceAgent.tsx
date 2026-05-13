"use client";
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import {
  Props,
  SpeechRecognitionEvent,
  SpeechRecognitionInstance,
} from "@/types/speechRecognitionTypes";

export default function VoiceAgent({ onTranscript, isProcessing }: Props) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    // Only initialize once!
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

      rec.onresult = (event: SpeechRecognitionEvent) => {
        clearTimeout(silenceTimer);
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        silenceTimer = setTimeout(() => {
          if (transcript.trim().length > 2) {
            onTranscriptRef.current(transcript);
            rec.stop(); // Stop listening once we've sent the message
            setIsListening(false);
          }
        }, 3000); // 3 seconds "breath" room
      };

      rec.onerror = (event: any) => {
        // THIS IS THE KEY: Look at your browser console (F12) for this log!
        console.error("🎤 Speech API Error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);
  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition error:", err);
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`relative p-8 rounded-full transition-all ${
          isListening ? "bg-red-500 scale-110" : "bg-blue-600 hover:bg-blue-700"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isListening ? (
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
        ) : null}

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
}
