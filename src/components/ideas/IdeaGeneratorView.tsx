// src/components/ideas/IdeaGeneratorView.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ContentIdea, Language, Platform } from '../../types';
import { AiService } from '../../services/aiService';
import {
  Lightbulb,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  FileText,
  Share2,
  Filter,
  Flame,
  CheckCircle2,
  Video,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CopyButton } from '../common/CopyButton';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { Badge } from '../common/Badge';

export const IdeaGeneratorView: React.FC = () => {
  const { activeBrand, ideas, saveIdea, showToast, quickCreateScriptForTopic } = useStudio();

  // Generator Filters
  const [platform, setPlatform] = useState<Platform>('Instagram Reel');
  const [niche, setNiche] = useState(activeBrand.niches || 'Tech & Mobile');
  const [language, setLanguage] = useState<Language>(activeBrand.preferredLanguage || 'hinglish');
  const [category, setCategory] = useState('Educational');
  const [duration, setDuration] = useState('45-60s');
  const [mode, setMode] = useState<'trending' | 'evergreen'>('trending');
  const [contentStyle, setContentStyle] = useState(activeBrand.preferredStyle || 'Fast-paced storytelling');

  const [loading, setLoading] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);

  const categories = [
    'Tech', 'AI', 'Business', 'Educational', 'Funny', 'Motivational', 'Gaming', 'Art', 'Telecom'
  ];

  const durations = ['15-30s', '45-60s', '60-90s', '8-10 mins'];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const results = await AiService.generateIdeas(
        platform,
        `${niche} (${mode} style: ${contentStyle})`,
        language,
        category,
        duration,
        activeBrand
      );
      setGeneratedIdeas(results);
      if (results.length > 0) {
        showToast(`Generated ${results.length} fresh ideas!`);
      }
    } catch (err) {
      console.error('Error generating ideas:', err);
      showToast('Could not generate ideas. Check backend status.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isSavedInStudio = (ideaId: string) => {
    return ideas.some(i => i.id === ideaId);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Card */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">AI Content Idea Studio</h2>
              <p className="text-xs text-slate-400">Generate high-retention concepts tailored to {activeBrand.name}</p>
            </div>
          </div>

          {/* Mode Switcher: Trending vs Evergreen */}
          <div className="flex items-center gap-1 bg-studio-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMode('trending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                mode === 'trending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('evergreen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                mode === 'evergreen' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Evergreen</span>
            </button>
          </div>
        </div>

        {/* Filter Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Topic / Niche with Voice Input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Topic or Niche Angle
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. Budget smartphones under 20k, AI video generators, Drawing timelapse"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
                />
                <VoiceInputButton
                  language={language}
                  onLanguageChange={(l) => setLanguage(l)}
                  onTranscript={(text) => setNiche(text)}
                  buttonText="Voice"
                />
              </div>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Instagram Reel">Instagram Reel</option>
                <option value="YouTube Short">YouTube Short</option>
                <option value="YouTube Long Video">YouTube Long Video</option>
                <option value="Post">Instagram / Community Post</option>
                <option value="Story">Interactive Story</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="english">English (100%)</option>
                <option value="hindi">हिंदी (Hindi 100%)</option>
                <option value="hinglish">Hinglish (Hindi + English)</option>
              </select>
            </div>

            {/* Content Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Content Style</label>
              <input
                type="text"
                value={contentStyle}
                onChange={(e) => setContentStyle(e.target.value)}
                placeholder="e.g. Energetic & punchy"
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Generating Concepts...' : 'Generate 3 Viral Ideas'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Ideas Cards Display */}
      {generatedIdeas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>Generated Concepts</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
              {generatedIdeas.length} Ready
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedIdeas.map((idea) => {
              const alreadySaved = isSavedInStudio(idea.id);
              return (
                <div
                  key={idea.id}
                  className="rounded-3xl bg-studio-900/95 border border-slate-800 hover:border-amber-500/40 p-5 flex flex-col justify-between shadow-lg transition-all duration-200"
                >
                  <div className="space-y-3">
                    {/* Tags */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge type="platform" value={idea.platform} />
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {idea.duration}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 capitalize">
                        {idea.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-slate-100 leading-snug">
                      {idea.title}
                    </h4>

                    {/* Hook Box */}
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                      <p className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                        ⚡ 3-Second Opening Hook
                      </p>
                      <p className="text-xs font-semibold text-slate-200 italic">
                        "{idea.hook}"
                      </p>
                    </div>

                    {/* Concept */}
                    <div className="space-y-1 text-xs text-slate-300">
                      <p className="font-semibold text-slate-400 uppercase text-[10px]">Concept Blueprint:</p>
                      <p className="leading-relaxed">{idea.concept}</p>
                    </div>

                    {/* Suggested Shots */}
                    {idea.suggestedShots && idea.suggestedShots.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <p className="font-semibold text-slate-400 uppercase text-[10px]">Suggested Shots:</p>
                        <ul className="space-y-1 text-[11px] text-slate-400">
                          {idea.suggestedShots.map((shot, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-purple-400 font-bold">•</span>
                              <span>{shot}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CTA & Hashtags */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <p className="text-[11px] text-slate-300">
                        <span className="text-slate-400 font-semibold">CTA: </span>
                        {idea.cta}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {idea.hashtags?.slice(0, 4).map((tag, tIdx) => (
                          <span key={tIdx} className="text-[10px] text-purple-400 font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => saveIdea(idea)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        alreadySaved
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                          : 'bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {alreadySaved ? <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                      <span>{alreadySaved ? 'Saved in Bank' : 'Save Idea'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => quickCreateScriptForTopic(idea.title)}
                      title="Generate scene-by-scene script for this idea"
                      className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    <CopyButton
                      text={`Title: ${idea.title}\nHook: ${idea.hook}\nConcept: ${idea.concept}\nCTA: ${idea.cta}\nHashtags: ${idea.hashtags.join(' ')}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Saved Ideas Bank for this Brand */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            {activeBrand.name} Saved Ideas Library ({ideas.length})
          </h3>
        </div>

        {ideas.length === 0 ? (
          <div className="p-8 rounded-3xl bg-studio-900/40 border border-dashed border-slate-800 text-center text-slate-400 text-xs">
            No saved ideas for this channel yet. Generate ideas above or use the AI Assistant to build your library!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-studio-900/60 border border-slate-800 hover:border-slate-700 space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Badge type="platform" value={item.platform} />
                  <span className="text-[10px] font-mono text-slate-400">{item.duration}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-300 italic line-clamp-2">"{item.hook}"</p>
                <p className="text-xs text-slate-400 line-clamp-2">{item.concept}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => quickCreateScriptForTopic(item.title)}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>Script this</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <CopyButton text={`Title: ${item.title}\nHook: ${item.hook}\nConcept: ${item.concept}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
