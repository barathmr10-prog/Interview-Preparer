export const speakText = (text: string, onEnd?: () => void) => {
  if (!('speechSynthesis' in window)) {
    alert("Text-to-speech is not supported in your browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a good English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) || 
                         voices.find(v => v.lang.startsWith('en-'));
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd; // Ensure we reset state even on error
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
