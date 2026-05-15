import { useState, useEffect, useRef } from "react";
import {
  SpeechRecognitionEvent,
  SpeechRecognitionInstance,
} from "@/types/speechRecognitionTypes";

/**
 * useSpeechRecognition Hook
 * Manages the Web Speech API lifecycle and implements automatic
 * turn-taking using a silence timer.
 */
export const useSpeechRecognition = (
  onTranscript: (t: string) => void,
  setIsSessionActive: (b: boolean) => void,
) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep the latest transcript callback available without re-triggering the main Effect
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (recognitionRef.current) return;

    // Cross-browser support for Web Speech API (Chrome/Safari/Edge)
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

        /**
         * Custom Silence Detection:
         * If the user stops talking for 2000ms (2s), assume they are finished.
         * We then send the transcript to the parent handler and stop the mic.
         */
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
          recognitionRef.current?.stop();
          setIsListening(false);
          setIsSessionActive(false);
          return;
        }

        if (event.error === "audio-capture") {
          setIsListening(false);
          setIsSessionActive(false);
          alert("Microphone capture failed. Please check your permissions.");
        } else {
          setIsListening(false);
          setIsSessionActive(false);
        }
      };

      recognitionRef.current = rec;
    }
  }, [setIsSessionActive]);

  return { isListening, setIsListening, recognitionRef, silenceTimerRef };
};
