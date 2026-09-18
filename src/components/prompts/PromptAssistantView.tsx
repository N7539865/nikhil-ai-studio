// src/components/prompts/PromptAssistantView.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { AiPromptTemplate, Language } from '../../types';
import { AiService } from '../../services/aiService';
import {
  Image as ImageIcon,
  Sparkles,
  Copy,
  Ratio,
  Sliders,
  Flame,
  Camera,
  Layers
} from 'lucide-react';
import { CopyButton } from '../common/CopyButton';
import { VoiceInputButton } from '../common/VoiceInputButton';

export const PromptAssistantView: React.FC = () => {
  const { activeBrand, showToast } = useStudio();

  const [category, setCategory] = useState('Thumbnail');
  const [subject, setSubject] = useState('');
  const [language, setLanguage] = useState<Language>('english');
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<AiPromptTemplate[]>([]);

  const promptCategories = [
    'Thumbnail',
    'Poster',
    'Reel scene',
    'Character',
    'Product promotion',
    'Cinematic video',
    'Funny video',
    'Art video'
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const results = await AiService.generateImagePrompts(
        category,
        subject || 'Modern Creator Studio',
        activeBrand,
        language
      );
      setPrompts(results);
      if (results.length > 0) {
        showToast(`Image & video prompts generated in ${language.toUpperCase()}!`);
      }
    } catch (err) {
      console.error('Prompt error:', err);
      showToast('Could not generate prompts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Configuration Form */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">AI Image & Video Prompt Studio</h2>
              <p className="text-xs text-slate-400">
                Craft hyper-detailed prompts for Midjourney, Flux, Ideogram, DALL-E 3, Sora, and Runway
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-studio-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('english')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                language === 'english' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English (100%)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hindi')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                language === 'hindi' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hinglish')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                language === 'hinglish' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">Prompt Purpose / Format</label>
          <div className="flex flex-wrap gap-2">
            {promptCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  category === c
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-studio-950 hover:bg-studio-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Subject, Mood & Key Elements
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  language === 'hindi'
                    ? 'विषय, भाव और मुख्य दृश्य विवरण लिखें (जैसे: भविष्य का स्मार्टफोन थंबनेल, नियॉन लाइटिंग)...'
                    : (language === 'english'
                      ? 'Enter subject and visual details (e.g. Creator holding glowing phone, dark studio neon lighting)...'
                      : 'Subject aur lighting details likho (e.g. Creator holding glowing phone, neon lighting)...')
                }
                className="flex-1 px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
              <VoiceInputButton
                language={language}
                onLanguageChange={(l) => setLanguage(l)}
                onTranscript={(text) => setSubject(text)}
                buttonText="Voice"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Generating Prompts...' : `Generate ${category} Prompts`}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Prompts */}
      {prompts.length > 0 && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Generated Prompt Variations ({prompts.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {prompts.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl bg-studio-900/95 border border-slate-800 hover:border-purple-500/40 p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all"
              >
                <div className="space-y-3">
                  {/* Meta tag row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono">
                      Aspect Ratio: {p.aspectRatio}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {p.recommendedTool}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100">{p.title}</h4>

                  {/* Main Prompt Box */}
                  <div className="p-3.5 rounded-2xl bg-studio-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                      <span>Positive Prompt:</span>
                      <CopyButton text={p.prompt} label="Copy" />
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-mono select-all">
                      {p.prompt}
                    </p>
                  </div>

                  {/* Negative Prompt */}
                  {p.negativePrompt && (
                    <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-rose-400">
                        <span>Negative Prompt:</span>
                        <CopyButton text={p.negativePrompt} label="Copy" />
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                        {p.negativePrompt}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Style: {p.style}</span>
                  <CopyButton
                    text={`${p.prompt}\n\nNegative: ${p.negativePrompt || ''}`}
                    label="Copy All"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
