"use client";
import { forwardRef, useImperativeHandle } from "react";
import MicButton from "./MicButton";
import MicText from "./MicText";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { VoiceAgentProps, VoiceAgentRef } from "@/types/voiceTypes";

/**
 * VoiceAgent Component
 *
 * A specialized component using `forwardRef` to allow parent components
 * to imperatively trigger voice commands (e.g., auto-starting from a greeting).
 *
 * It acts as the controller for Speech Recognition lifecycle and UI synchronization.
 */
const VoiceAgent = forwardRef<VoiceAgentRef, VoiceAgentProps>(
  (
    { onTranscript, isProcessing, isSessionActive, setIsSessionActive },
    ref,
  ) => {
    const { isListening, setIsListening, recognitionRef, silenceTimerRef } =
      useSpeechRecognition(onTranscript, setIsSessionActive);

    /**
     * Exposes specific methods to the parent component.
     * Use case: Allowing the Home page or a 'Welcome' prompt to trigger the mic.
     */
    useImperativeHandle(ref, () => ({
      startListening: () => {
        if (recognitionRef.current && !isListening) {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.error("Auto-start error:", err);
          }
        }
      },
    }));

    /**
     * Toggles the voice session.
     * - If active: Stops the recognition engine, clears timers, and kills any ongoing TTS (Speech Synthesis).
     * - If idle: Initializes the speech recognition engine.
     */
    const toggleListening = () => {
      if (isListening || isSessionActive) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

        recognitionRef.current?.stop();
        window.speechSynthesis.cancel();
        setIsSessionActive(false);
        setIsListening(false);
      } else {
        recognitionRef.current?.start();
        setIsSessionActive(true);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <MicButton
          toggleListening={toggleListening}
          isSessionActive={isSessionActive}
          isProcessing={isProcessing}
        />

        <MicText
          isSessionActive={isSessionActive}
          isProcessing={isProcessing}
        />
      </div>
    );
  },
);

VoiceAgent.displayName = "VoiceAgent";
export default VoiceAgent;
