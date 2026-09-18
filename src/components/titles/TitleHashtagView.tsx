// src/components/titles/TitleHashtagView.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { TitleHashtagSet, Platform, Language } from '../../types';
import { AiService } from '../../services/aiService';
import {
  Hash,
  Sparkles,
  Key,
  MessageSquare,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../common/BrandIcons';
import { CopyButton } from '../common/CopyButton';
import { VoiceInputButton } from '../common/VoiceInputButton';

export const TitleHashtagView: React.FC = () => {
  const { activeBrand, showToast } = useStudio();

  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('YouTube Short');
  const [language, setLanguage] = useState<Language>(activeBrand.preferredLanguage || 'hinglish');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TitleHashtagSet | null>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const data = await AiService.generateTitlesAndHashtags(topic, platform, activeBrand, language);
      setResult(data);
      if (data) {
        showToast(`Titles, captions, & tags generated in ${language.toUpperCase()}!`);
      }
    } catch (err) {
      console.error('Error:', err);
      showToast('Generation failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Input Header */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Title, Caption & Hashtag Generator</h2>
              <p className="text-xs text-slate-400">
                High-CTR YouTube titles, Shorts titles, Instagram captions, and indexed search keywords
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

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  language === 'hindi'
                    ? 'विषय दर्ज करें (जैसे: 2026 में बजट स्मार्टफोन तुलना, चित्रकला ट्यूटोरियल)...'
                    : (language === 'english'
                      ? 'Enter video topic (e.g. Budget 5G Smartphone comparison, Art drawing tutorial)...'
                      : 'Video topic likho (e.g. Budget 5G Smartphone comparison, Art drawing tutorial)...')
                }
                className="flex-1 px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-pink-500"
              />
              <VoiceInputButton
                language={language}
                onLanguageChange={(l) => setLanguage(l)}
                onTranscript={(text) => setTopic(text)}
                buttonText="Voice"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Generating...' : `Generate in ${language.toUpperCase()}`}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Honest Creator Notice */}
      <div className="p-4 rounded-2xl bg-studio-950/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Creator Tip: </span>
          Hashtags and keywords help algorithms classify your content to the correct audience niche, but
          retention, click-through-rate (CTR), and average watch time are what truly drive sustainable growth.
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* 10 YouTube Titles & 10 Shorts Titles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 10 YouTube Titles */}
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <YoutubeIcon className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-slate-100">10 YouTube Titles</h3>
                </div>
                <CopyButton
                  text={result.youtubeTitles.join('\n')}
                  label="Copy All"
                />
              </div>

              <div className="space-y-2">
                {result.youtubeTitles.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-studio-950 border border-slate-800/80 hover:border-red-500/40 flex items-center justify-between text-xs text-slate-200 transition-colors"
                  >
                    <span className="truncate pr-2 font-medium">{idx + 1}. {t}</span>
                    <CopyButton text={t} />
                  </div>
                ))}
              </div>
            </div>

            {/* 10 Shorts / Reel Titles */}
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <InstagramIcon className="w-4 h-4 text-pink-500" />
                  <h3 className="text-sm font-bold text-slate-100">10 Shorts / Reel Titles</h3>
                </div>
                <CopyButton
                  text={result.shortsTitles.join('\n')}
                  label="Copy All"
                />
              </div>

              <div className="space-y-2">
                {result.shortsTitles.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-studio-950 border border-slate-800/80 hover:border-pink-500/40 flex items-center justify-between text-xs text-slate-200 transition-colors"
                  >
                    <span className="truncate pr-2 font-medium">{idx + 1}. {t}</span>
                    <CopyButton text={t} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instagram Captions */}
          <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">High-Engagement Captions</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.captions.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-studio-950 border border-slate-800/80 flex flex-col justify-between space-y-3"
                >
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {cap}
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <CopyButton text={cap} label="Copy Caption" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags & Search Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hashtags */}
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-pink-400" />
                  <h3 className="text-sm font-bold text-slate-100">Targeted Hashtags</h3>
                </div>
                <CopyButton text={result.hashtags.join(' ')} label="Copy All Tags" />
              </div>

              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-studio-950 border border-slate-800 text-xs text-purple-300 font-mono font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-slate-100">SEO Keywords & Search Tags</h3>
                </div>
                <CopyButton text={result.keywords.join(', ')} label="Copy Comma-Separated" />
              </div>

              <div className="flex flex-wrap gap-2">
                {result.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-studio-950 border border-slate-800 text-xs text-amber-300 font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
