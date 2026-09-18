// src/components/scripts/ScriptGeneratorView.tsx
import React, { useState, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Script, ScriptScene, Language, Platform } from '../../types';
import { AiService } from '../../services/aiService';
import {
  FileText,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Edit3,
  RotateCcw,
  Clock,
  Video,
  Volume2,
  Type,
  Check,
  Plus,
  Trash2
} from 'lucide-react';
import { CopyButton } from '../common/CopyButton';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

export const ScriptGeneratorView: React.FC = () => {
  const {
    activeBrand,
    scripts,
    saveScript,
    deleteScript,
    showToast,
    quickDraftTopic,
    setQuickDraftTopic
  } = useStudio();

  // Inputs
  const [topic, setTopic] = useState(quickDraftTopic || '');
  const [platform, setPlatform] = useState<Platform>('Instagram Reel');
  const [duration, setDuration] = useState('45-60 seconds');
  const [language, setLanguage] = useState<Language>(activeBrand.preferredLanguage || 'hinglish');
  const [style, setStyle] = useState(activeBrand.preferredStyle || 'Fast cuts, bold on-screen text');
  const [tone, setTone] = useState('High Energy & Engaging');

  const [loading, setLoading] = useState(false);
  const [currentScript, setCurrentScript] = useState<Script | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editableScenes, setEditableScenes] = useState<ScriptScene[]>([]);
  const [editableHook, setEditableHook] = useState('');
  const [editableCta, setEditableCta] = useState('');

  // Handle passed topic from other screens
  useEffect(() => {
    if (quickDraftTopic) {
      setTopic(quickDraftTopic);
      setQuickDraftTopic('');
    }
  }, [quickDraftTopic, setQuickDraftTopic]);

  const tones = [
    'High Energy & Engaging',
    'Curious & Suspenseful',
    'Authoritative & Expert',
    'Casual & Relatable (Desi / Chill)',
    'Humorous & Sarcastic',
    'Inspirational & Motivational'
  ];

  const durations = [
    '30 seconds (Fast Hook)',
    '45-60 seconds (Standard Reel)',
    '60-90 seconds (In-depth Short)',
    '5-8 minutes (YouTube Video)',
    '10-15 minutes (Full Breakdown)'
  ];

  const handleGenerateScript = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const generated = await AiService.generateScript(
        topic,
        platform,
        duration,
        language,
        style,
        tone,
        activeBrand
      );

      if (generated) {
        setCurrentScript(generated);
        setEditableScenes(generated.scenes);
        setEditableHook(generated.hook);
        setEditableCta(generated.cta);
        showToast('Script generated successfully!');
      }
    } catch (err) {
      console.error('Failed to generate script:', err);
      showToast('Error generating script. Please retry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrent = () => {
    if (!currentScript) return;
    saveScript(currentScript);
  };

  const handleOpenEdit = () => {
    if (!currentScript) return;
    setEditableScenes([...currentScript.scenes]);
    setEditableHook(currentScript.hook);
    setEditableCta(currentScript.cta);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentScript) return;
    const updated: Script = {
      ...currentScript,
      hook: editableHook,
      cta: editableCta,
      scenes: editableScenes,
      fullText: editableScenes
        .map(s => `[${s.timestamp}] ${s.onScreenText}\nVisual: ${s.visualCues}\nAudio: ${s.dialogue}`)
        .join('\n\n')
    };
    setCurrentScript(updated);
    saveScript(updated);
    setIsEditModalOpen(false);
    showToast('Changes saved to script!');
  };

  const handleSceneChange = (index: number, field: keyof ScriptScene, value: string) => {
    const updated = [...editableScenes];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setEditableScenes(updated);
  };

  const isCurrentSaved = currentScript && scripts.some(s => s.id === currentScript.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Script Generator Input Form */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Full Video Script Studio</h2>
            <p className="text-xs text-slate-400">
              Build retention-optimized scripts with visual cues, dialogue, and on-screen graphics
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerateScript} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Video Topic or Core Premise *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. 3 Hidden Android features in 2026, How to paint watercolor glass, Telecom recharge tricks"
                className="flex-1 px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
              <VoiceInputButton
                language={language}
                onLanguageChange={(l) => setLanguage(l)}
                onTranscript={(text) => setTopic(text)}
                buttonText="Voice Topic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Instagram Reel">Instagram Reel</option>
                <option value="YouTube Short">YouTube Short</option>
                <option value="YouTube Long Video">YouTube Long Video</option>
                <option value="Story">Story Sequence</option>
              </select>
            </div>

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

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                {tones.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Creating Scene Breakdown...' : 'Generate Full Script'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated / Active Script Display */}
      {currentScript && (
        <div className="rounded-3xl bg-studio-900/90 border border-slate-800 p-6 shadow-xl space-y-6 animate-fadeIn">
          {/* Script Header Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge type="platform" value={currentScript.platform} />
                <span className="text-xs font-semibold text-purple-400 capitalize">{currentScript.language}</span>
                <span className="text-xs text-slate-400">• {currentScript.duration}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-100">{currentScript.topic}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveCurrent}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isCurrentSaved
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                    : 'bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isCurrentSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isCurrentSaved ? 'Saved in Studio' : 'Save Script'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateScript()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>

              <CopyButton
                text={`TOPIC: ${currentScript.topic}\n\nHOOK: ${currentScript.hook}\n\n${currentScript.fullText}\n\nCTA: ${currentScript.cta}`}
                label="Copy Full Script"
              />
            </div>
          </div>

          {/* Hook Callout Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-studio-950 to-pink-950/20 border border-purple-500/30 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
              🎯 Opening 3-Second Retention Hook
            </span>
            <p className="text-base font-bold text-white italic">
              "{currentScript.hook}"
            </p>
          </div>

          {/* Scene Breakdown Table / Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Scene-By-Scene Production Breakdown
            </h4>

            <div className="space-y-3">
              {currentScript.scenes.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="rounded-2xl bg-studio-950 border border-slate-800/80 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 text-xs font-bold font-mono">
                        Scene {scene.sceneNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{scene.timestamp}</span>
                      </span>
                    </div>

                    {scene.sfx && (
                      <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-medium flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        <span>SFX: {scene.sfx}</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Visual Cues */}
                    <div className="p-3 rounded-xl bg-studio-900/80 border border-slate-800 space-y-1">
                      <p className="font-semibold text-purple-400 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>Camera & Visual Action:</span>
                      </p>
                      <p className="text-slate-300 leading-relaxed">{scene.visualCues}</p>
                    </div>

                    {/* Dialogue / Voiceover */}
                    <div className="p-3 rounded-xl bg-studio-900/80 border border-slate-800 space-y-1">
                      <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Spoken Dialogue / Voiceover:</span>
                      </p>
                      <p className="text-slate-200 font-medium leading-relaxed italic">
                        "{scene.dialogue}"
                      </p>
                    </div>
                  </div>

                  {/* On-Screen Text */}
                  {scene.onScreenText && (
                    <div className="flex items-center gap-2 text-xs pt-1">
                      <span className="text-pink-400 font-semibold flex items-center gap-1">
                        <Type className="w-3.5 h-3.5" />
                        <span>On-Screen Graphic (OST):</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20 font-bold">
                        {scene.onScreenText}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-4 rounded-2xl bg-studio-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Call to Action (CTA)</p>
              <p className="text-xs font-semibold text-slate-200 mt-0.5">{currentScript.cta}</p>
            </div>
            <CopyButton text={currentScript.cta} label="Copy CTA" />
          </div>
        </div>
      )}

      {/* Previously Saved Scripts Library */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          {activeBrand.name} Saved Scripts ({scripts.length})
        </h3>

        {scripts.length === 0 ? (
          <div className="p-8 rounded-3xl bg-studio-900/40 border border-dashed border-slate-800 text-center text-slate-400 text-xs">
            No scripts saved yet. Generate one above to save it to your permanent library!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scripts.map((sc) => (
              <div
                key={sc.id}
                className="p-5 rounded-3xl bg-studio-900/60 border border-slate-800 hover:border-slate-700 space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Badge type="platform" value={sc.platform} />
                  <span className="text-[10px] font-mono text-slate-400">{sc.duration}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">{sc.topic}</h4>
                <p className="text-xs text-slate-300 italic line-clamp-2">"{sc.hook}"</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentScript(sc);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300"
                  >
                    Load in Studio
                  </button>
                  <div className="flex items-center gap-1.5">
                    <CopyButton text={sc.fullText} />
                    <button
                      type="button"
                      onClick={() => deleteScript(sc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-studio-950 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Script Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Script Details"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Opening Hook</label>
            <textarea
              rows={2}
              value={editableHook}
              onChange={(e) => setEditableHook(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            <label className="block text-xs font-semibold text-slate-300">Scenes</label>
            {editableScenes.map((scene, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-studio-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400">Scene {scene.sceneNumber}</span>
                  <input
                    type="text"
                    value={scene.timestamp}
                    onChange={(e) => handleSceneChange(idx, 'timestamp', e.target.value)}
                    placeholder="Timestamp"
                    className="w-28 px-2 py-1 rounded-lg bg-studio-900 border border-slate-800 text-[11px] text-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Visual Direction:</label>
                  <input
                    type="text"
                    value={scene.visualCues}
                    onChange={(e) => handleSceneChange(idx, 'visualCues', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-studio-900 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Audio Dialogue:</label>
                  <textarea
                    rows={2}
                    value={scene.dialogue}
                    onChange={(e) => handleSceneChange(idx, 'dialogue', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-studio-900 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Call to Action (CTA)</label>
            <input
              type="text"
              value={editableCta}
              onChange={(e) => setEditableCta(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
