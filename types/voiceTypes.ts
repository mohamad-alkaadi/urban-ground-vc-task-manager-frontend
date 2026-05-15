export interface VoiceAgentRef {
  startListening: () => void;
}

export interface VoiceAgentProps {
  onTranscript: (transcript: string) => void;
  isProcessing: boolean;
  isSessionActive: boolean;
  setIsSessionActive: (active: boolean) => void;
}
