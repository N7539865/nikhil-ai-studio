// src/components/common/VoiceInputButton.tsx
import React, { useState } from 'react';
import { Mic, MicOff, ChevronDown, Radio } from 'lucide-react';
import { Language } from '../../types';
import { speechService } from '../../services/speechService';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  className?: string;
  buttonText?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  language = 'hinglish',
  onLanguageChange,
  className = '',
  buttonText
}) => {
  const [isListening, setIsListening] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(language);

  const toggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(
        currentLang,
        (transcript, isFinal) => {
          onTranscript(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (error) => {
          console.warn('Voice error:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      if (started) {
        setIsListening(true);
      }
    }
  };

  const handleLangSelect = (lang: Language) => {
    setCurrentLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
    setShowLangMenu(false);
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? 'Stop recording voice' : `Speak in ${currentLang}`}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
          isListening
            ? 'bg-rose-600 text-white recording-pulse shadow-lg shadow-rose-600/40'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 shadow-sm'
        }`}
      >
        {isListening ? (
          <>
            <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
            <span>Listening ({currentLang})...</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            <span>{buttonText || `Voice (${currentLang})`}</span>
          </>
        )}
      </button>

      {/* Language Switcher Trigger */}
      <button
        type="button"
        onClick={() => setShowLangMenu(!showLangMenu)}
        className="ml-1 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
        title="Change speech language"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {/* Language dropdown menu */}
      {showLangMenu && (
        <div className="absolute top-full mt-1.5 left-0 z-50 w-36 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => handleLangSelect('hinglish')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
              currentLang === 'hinglish' ? 'bg-purple-600/20 text-purple-400 font-medium' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>Hinglish</span>
            <span className="text-[10px] text-slate-500">en-IN</span>
          </button>
          <button
            type="button"
            onClick={() => handleLangSelect('hindi')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
              currentLang === 'hindi' ? 'bg-purple-600/20 text-purple-400 font-medium' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>हिंदी (Hindi)</span>
            <span className="text-[10px] text-slate-500">hi-IN</span>
          </button>
          <button
            type="button"
            onClick={() => handleLangSelect('english')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
              currentLang === 'english' ? 'bg-purple-600/20 text-purple-400 font-medium' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>English</span>
            <span className="text-[10px] text-slate-500">en-US</span>
          </button>
        </div>
      )}
    </div>
  );
};
