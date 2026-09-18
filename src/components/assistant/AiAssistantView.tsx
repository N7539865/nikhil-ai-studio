// src/components/assistant/AiAssistantView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useStudio } from '../../context/StudioContext';
import { AiChatMessage, Language, Platform } from '../../types';
import { StorageService } from '../../services/storageService';
import { AiService } from '../../services/aiService';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  Zap,
  Trash2
} from 'lucide-react';
import { CopyButton } from '../common/CopyButton';
import { VoiceInputButton } from '../common/VoiceInputButton';

export const AiAssistantView: React.FC = () => {
  const { activeBrand, showToast, saveIdea, saveScript } = useStudio();

  // Chat settings
  const [platform, setPlatform] = useState<Platform>('Instagram Reel');
  const [language, setLanguage] = useState<Language>(activeBrand.preferredLanguage || 'hinglish');
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  // Chat messages
  const [messages, setMessages] = useState<AiChatMessage[]>(() => {
    return StorageService.getChatHistory(activeBrand.id);
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(StorageService.getChatHistory(activeBrand.id));
    setLanguage(activeBrand.preferredLanguage || 'hinglish');
  }, [activeBrand.id, activeBrand.preferredLanguage]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    StorageService.saveChatHistory(activeBrand.id, messages);
  }, [messages, activeBrand.id]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg: AiChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString(),
      platform,
      language
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await AiService.sendChatMessage(textToSend, activeBrand, language, platform);
      const assistantMsg: AiChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toISOString(),
        platform,
        language
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      showToast('Failed to get response. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = (msgIndex: number) => {
    let lastUserText = '';
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        lastUserText = messages[i].text;
        break;
      }
    }
    if (lastUserText) {
      handleSend(lastUserText);
    }
  };

  const handleSaveToLibrary = (msg: AiChatMessage) => {
    const isIdea = msg.text.toLowerCase().includes('idea') || msg.text.toLowerCase().includes('concept');
    if (isIdea) {
      saveIdea({
        id: 'idea_chat_' + Date.now(),
        brandId: activeBrand.id,
        title: `${language.toUpperCase()} Idea: ${msg.text.slice(0, 40)}...`,
        hook: 'Hook from AI Conversation',
        concept: msg.text,
        suggestedShots: ['Shot breakdown available in concept notes'],
        cta: activeBrand.defaultCta,
        caption: msg.text.slice(0, 200),
        hashtags: ['#AIStudio', '#CreatorTips'],
        platform,
        niche: activeBrand.niches,
        category: 'AI Assistant',
        language,
        duration: '60s',
        isFavorite: true,
        createdAt: new Date().toISOString()
      });
    } else {
      saveScript({
        id: 'script_chat_' + Date.now(),
        brandId: activeBrand.id,
        topic: `${language.toUpperCase()} Script: ${msg.text.slice(0, 35)}...`,
        platform,
        duration: '60s',
        language,
        tone: activeBrand.preferredStyle,
        hook: 'Hook generated in chat',
        scenes: [],
        fullText: msg.text,
        cta: activeBrand.defaultCta,
        isFavorite: true,
        createdAt: new Date().toISOString()
      });
    }

    setMessages(prev =>
      prev.map(m => (m.id === msg.id ? { ...m, isSaved: true } : m))
    );
    showToast(`Saved to ${activeBrand.name} library!`);
  };

  const clearHistory = () => {
    if (window.confirm('Clear conversation history for this brand?')) {
      const resetText = language === 'english'
        ? `Chat cleared! Ready for your next creative session in English for **${activeBrand.name}**. What are we creating?`
        : (language === 'hindi'
          ? `बातचीत साफ़ कर दी गई है! **${activeBrand.name}** के लिए हिंदी में नया सत्र शुरू करने के लिए तैयार हैं। आप क्या बनाना चाहते हैं?`
          : `Chat cleared! Ready for your next creative session in Hinglish for **${activeBrand.name}**. What are we creating?`);

      const resetMsg: AiChatMessage[] = [
        {
          id: 'msg_welcome_' + Date.now(),
          sender: 'assistant',
          text: resetText,
          timestamp: new Date().toISOString(),
          platform,
          language
        }
      ];
      setMessages(resetMsg);
      StorageService.saveChatHistory(activeBrand.id, resetMsg);
    }
  };

  // Language-specific preset prompts
  const getPresetPrompts = () => {
    if (language === 'english') {
      return [
        { label: '🔥 100% English Hook', prompt: 'Give me 3 scroll-stopping hooks completely in English for my next video topic.' },
        { label: '🎬 English Reel Script', prompt: 'Write a full 45-second high-energy Reel script in 100% English with scene visuals and voiceover.' },
        { label: '💡 5 Shorts Concepts', prompt: 'Suggest 5 viral YouTube Shorts concepts in English for my niche.' },
        { label: '📈 Retention Strategy', prompt: 'How do I stop viewers from dropping off after the first 5 seconds? Explain in English.' },
        { label: '🎯 High-CTR Titles', prompt: 'Generate 5 high curiosity titles and 3 engaging Instagram captions in 100% English.' }
      ];
    } else if (language === 'hindi') {
      return [
        { label: '🔥 शक्तिशाली हुक (हिंदी)', prompt: 'मेरे अगले वीडियो विषय के लिए 3 प्रभावशाली हुक शुद्ध हिंदी में बताएं।' },
        { label: '🎬 संपूर्ण रील स्क्रिप्ट', prompt: 'दृश्य और संवाद के साथ 45 सेकंड का पूर्ण रील स्क्रिप्ट शुद्ध हिंदी में लिखें।' },
        { label: '💡 5 वायरल विचार', prompt: 'मेरे विषय के लिए 5 वायरल यूट्यूब शॉर्ट्स विचार हिंदी में सुझाएं।' },
        { label: '📈 वॉच-टाइम रणनीति', prompt: 'वीडियो के शुरुआती 5 सेकंड में दर्शकों का ध्यान कैसे आकर्षित रखें? हिंदी में समझाएं।' },
        { label: '🎯 आकर्षक शीर्षक व टैग', prompt: 'मेरे विषय के लिए 5 आकर्षक शीर्षक और 3 इंस्टाग्राम कैप्शन हिंदी में बनाएं।' }
      ];
    } else {
      return [
        { label: '🔥 High-Retention Hook', prompt: 'Give me 3 scroll-stopping hooks in Hinglish for my next video topic.' },
        { label: '🎬 Reel Script (Hinglish)', prompt: 'Write a full 45-second high-energy Reel script in Hinglish with scene visuals and voiceover.' },
        { label: '💡 5 Viral Shorts Concepts', prompt: 'Suggest 5 viral YouTube Shorts ideas in Hinglish for my niche.' },
        { label: '📈 Improve Retention', prompt: 'How do I stop viewers from dropping off after the first 5 seconds of my video?' },
        { label: '🎯 High-CTR Titles', prompt: 'Generate 5 high curiosity titles and 3 engaging Instagram captions in Hinglish.' }
      ];
    }
  };

  const presetPrompts = getPresetPrompts();

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] md:h-[calc(100vh-6.5rem)] rounded-3xl bg-studio-900/90 border border-slate-800 overflow-hidden shadow-xl">
      {/* Top Filter & Context Toolbar */}
      <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-studio-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Format Selector */}
          <div className="flex items-center gap-1 bg-studio-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(['Instagram Reel', 'YouTube Short', 'YouTube Long Video', 'Post', 'Story'] as Platform[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  platform === p ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p === 'YouTube Long Video' ? 'YT Video' : p}
              </button>
            ))}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-studio-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('english')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                language === 'english' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English (100%)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hindi')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                language === 'hindi' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hinglish')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                language === 'hinglish' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={clearHistory}
          title="Clear Chat History"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-studio-900 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Chips */}
      <div className="px-4 py-2 border-b border-slate-800/40 bg-studio-950/30 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Prompts ({language.toUpperCase()}):</span>
        {presetPrompts.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(chip.prompt)}
            className="px-2.5 py-1 rounded-full bg-studio-900/80 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 text-[11px] font-medium whitespace-nowrap transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md overflow-hidden ${
                  isUser
                    ? 'ring-2 ring-purple-500/40 bg-purple-600 text-white'
                    : 'bg-gradient-to-tr from-pink-600 to-amber-500 text-white'
                }`}
              >
                {isUser ? (
                  <img
                    src="/nikhil.jpg"
                    alt="Nikhil"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.currentTarget.style as any).display = 'none';
                    }}
                  />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 space-y-2 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-purple-600/20 border border-purple-500/30 text-slate-100 rounded-tr-none'
                    : 'bg-studio-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Message Actions for Assistant responses */}
                {!isUser && (
                  <div className="pt-2 flex items-center gap-2 border-t border-slate-800/80 text-xs">
                    <CopyButton text={msg.text} label="Copy" />

                    <button
                      type="button"
                      onClick={() => handleSaveToLibrary(msg)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        msg.isSaved
                          ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/60'
                      }`}
                    >
                      {msg.isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                      <span>{msg.isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRegenerate(idx)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-2xl mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-studio-950 border border-slate-800 rounded-tl-none space-y-2">
              <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Formulating response in {language.toUpperCase()}...</span>
              </div>
              <div className="h-3 w-48 bg-slate-800 rounded-full" />
              <div className="h-3 w-64 bg-slate-800 rounded-full" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Field with Voice Integration */}
      <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-studio-950/80 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input with selected language */}
          <VoiceInputButton
            language={language}
            onLanguageChange={(l) => setLanguage(l)}
            onTranscript={(transcript) => {
              setInputPrompt(prev => (prev ? `${prev} ${transcript}` : transcript));
            }}
          />

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              language === 'english'
                ? 'Ask in 100% English (e.g. "Suggest 3 viral hooks for my tech video")...'
                : (language === 'hindi'
                  ? 'शुद्ध हिंदी में पूछें (जैसे: "मेरे वीडियो के लिए 3 वायरल हुक बताएं")...'
                  : 'Hinglish mein poochho (e.g. "Reel hook on telecom 5G deals")...')
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-studio-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || loading}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white shadow-md shadow-purple-600/30 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
