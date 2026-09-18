// src/components/settings/BrandSettingsView.tsx
import React, { useState, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Language, Brand } from '../../types';
import {
  Settings,
  Save,
  Trash2,
  Sparkles,
  Zap,
  Globe,
  CheckCircle2,
  Key,
  ShieldCheck
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, GithubIcon } from '../common/BrandIcons';

export const BrandSettingsView: React.FC = () => {
  const { activeBrand, updateBrand, deleteBrand, brands, serverStatus, checkServerStatus } = useStudio();

  // Local Form State
  const [name, setName] = useState(activeBrand.name);
  const [creatorName, setCreatorName] = useState(activeBrand.creatorName);
  const [handleYt, setHandleYt] = useState(activeBrand.handleYt || '');
  const [handleInsta, setHandleInsta] = useState(activeBrand.handleInsta || '');
  const [handleGithub, setHandleGithub] = useState(activeBrand.handleGithub || '');
  const [niches, setNiches] = useState(activeBrand.niches);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(activeBrand.preferredLanguage || 'hinglish');
  const [preferredStyle, setPreferredStyle] = useState(activeBrand.preferredStyle || '');
  const [defaultCta, setDefaultCta] = useState(activeBrand.defaultCta || '');
  const [bio, setBio] = useState(activeBrand.bio || '');
  const [color, setColor] = useState(activeBrand.color || '#8b5cf6');

  // Sync when active brand changes
  useEffect(() => {
    setName(activeBrand.name);
    setCreatorName(activeBrand.creatorName);
    setHandleYt(activeBrand.handleYt || '');
    setHandleInsta(activeBrand.handleInsta || '');
    setHandleGithub(activeBrand.handleGithub || '');
    setNiches(activeBrand.niches);
    setPreferredLanguage(activeBrand.preferredLanguage || 'hinglish');
    setPreferredStyle(activeBrand.preferredStyle || '');
    setDefaultCta(activeBrand.defaultCta || '');
    setBio(activeBrand.bio || '');
    setColor(activeBrand.color || '#8b5cf6');
  }, [activeBrand]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Brand = {
      ...activeBrand,
      name,
      creatorName,
      handleYt,
      handleInsta,
      handleGithub,
      niches,
      preferredLanguage,
      preferredStyle,
      defaultCta,
      bio,
      color
    };
    updateBrand(updated);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Brand Persona & AI Strategy Settings</h2>
            <p className="text-xs text-slate-400">
              Configure parameters that guide how the AI writes scripts and generates hooks for <span className="text-purple-400 font-semibold">{activeBrand.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {brands.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete workspace "${activeBrand.name}"?`)) {
                  deleteBrand(activeBrand.id);
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-studio-950 border border-slate-800 transition-colors"
              title="Delete this brand"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity & Persona Card */}
        <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Creator Identity & Social Links
          </h3>

          {/* Creator Profile Photo Spotlight */}
          <div className="p-4 rounded-2xl bg-studio-950/80 border border-slate-800 flex flex-wrap items-center gap-4">
            <div className="relative w-16 h-20 rounded-2xl overflow-hidden ring-2 ring-purple-500/50 shadow-lg bg-studio-900 shrink-0">
              <img src="/nikhil.jpg" alt="Nikhil" className="w-full h-full object-cover object-top" />
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-studio-950" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">Official Creator Profile Photo</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  Active in Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">
                This photo is displayed on your Studio Dashboard, Top Navigation, Sidebar, and AI Copilot messages.
              </p>
              <p className="text-[10px] font-mono text-purple-400">
                Aesthetic: 90s Vintage Denim & Classic Car ("ज़िंदगी एक सफ़र है सुहाना")
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Workspace / Brand Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Creator Screen Name</label>
              <input
                type="text"
                required
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. Nikhil"
                className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube Channel</span>
              </label>
              <input
                type="text"
                value={handleYt}
                onChange={(e) => setHandleYt(e.target.value)}
                placeholder="@NikhilOfficial or channel URL"
                className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                <span>Instagram Username</span>
              </label>
              <input
                type="text"
                value={handleInsta}
                onChange={(e) => setHandleInsta(e.target.value)}
                placeholder="@nikhil.creates"
                className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>GitHub ID / Profile</span>
              </label>
              <input
                type="text"
                value={handleGithub}
                onChange={(e) => setHandleGithub(e.target.value)}
                placeholder="e.g. nikhilarts or username"
                className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-9 h-9 rounded-xl bg-transparent cursor-pointer border-0"
              />
              <span className="text-xs font-mono text-slate-300 uppercase">{color}</span>
              <span className="text-[11px] text-slate-500">(Used for avatar highlights and badges)</span>
            </div>
          </div>
        </div>

        {/* Content Voice & AI Strategy Card */}
        <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Content Niche & AI Tone Prompts
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Core Niches / Content Topics</label>
            <input
              type="text"
              value={niches}
              onChange={(e) => setNiches(e.target.value)}
              placeholder="e.g. Smartphone Tips, AI Tools, Creative Timelapses, Desi Comedy"
              className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred AI Script Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500 capitalize"
              >
                <option value="hinglish">Hinglish (Conversational Desi English + Hindi)</option>
                <option value="hindi">हिंदी (Pure / Formal Hindi)</option>
                <option value="english">English (Global / International)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Content Delivery Style</label>
              <input
                type="text"
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                placeholder="e.g. Rapid jumpcuts, pattern-interrupts, calm aesthetic"
                className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default Call To Action (CTA)</label>
            <input
              type="text"
              value={defaultCta}
              onChange={(e) => setDefaultCta(e.target.value)}
              placeholder="e.g. Follow @nikhil for daily tech tips and drop a comment 'SAVE'!"
              className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand Bio / Core Vision</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your channel's persona, target audience, and promise to the viewer..."
              className="w-full px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* AI Engine & Backend Architecture Status */}
        <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AI Provider & Security Architecture</span>
            </h3>
            <button
              type="button"
              onClick={() => checkServerStatus()}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Refresh Status
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-studio-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Provider Mode</span>
              <p className="text-xs font-bold text-slate-200 capitalize">{serverStatus.activeProvider}</p>
              <p className="text-[10px] text-emerald-400">Configured via server .env</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-studio-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Gemini API Key</span>
              <p className="text-xs font-bold text-slate-200">
                {serverStatus.hasGeminiKey ? 'Detected & Active' : 'Not Provided (Mock Active)'}
              </p>
              <p className="text-[10px] text-slate-500">Google AI Studio</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-studio-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">OpenAI Key</span>
              <p className="text-xs font-bold text-slate-200">
                {serverStatus.hasOpenAIKey ? 'Detected & Active' : 'Optional Fallback'}
              </p>
              <p className="text-[10px] text-slate-500">GPT-4o Mini</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-1">
            🔒 <strong>Zero Client-Side Exposure:</strong> All AI calls pass through your local backend proxy (<code className="text-purple-400">http://localhost:5000/api/ai</code>). API keys are never bundled into the frontend.
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Brand Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
