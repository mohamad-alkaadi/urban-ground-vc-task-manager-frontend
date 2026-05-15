export const useVoiceSynthesis = () => {
  const speak = (text: string, onDone?: () => void) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.1;

    utterance.onend = () => {
      if (onDone) onDone();
    };

    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};
