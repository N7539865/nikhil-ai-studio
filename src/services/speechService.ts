// src/services/speechService.ts
import { Language } from '../types';

// Extend window for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  getLanguageCode(lang: Language): string {
    switch (lang) {
      case 'hindi':
        return 'hi-IN';
      case 'hinglish':
        return 'en-IN'; // Indian English handles Hinglish best in standard speech engines
      case 'english':
      default:
        return 'en-US';
    }
  }

  startListening(
    lang: Language,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or an Android browser.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = this.getLanguageCode(lang);

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      onResult(text, !!finalTranscript);
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      this.isListening = false;
      onError(event.error === 'not-allowed' ? 'Microphone access was denied.' : `Voice error: ${event.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e: any) {
      console.error('Failed to start speech recognition:', e);
      onError(e.message || 'Failed to start microphone');
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechService();
