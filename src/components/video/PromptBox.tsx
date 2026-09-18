// src/components/video/PromptBox.tsx
import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Trash2, ArrowRight, Lightbulb, Play } from 'lucide-react';

interface PromptBoxProps {
  prompt: string;
  setPrompt: (value: string) => void;
  onGenerate: () => void;
  onEnhance: () => Promise<void>;
  onRewrite: () => Promise<void>;
  isEnhancing: boolean;
  isRewriting: boolean;
  isGenerating: boolean;
  variations: string[];
  onSelectVariation: (v: string) => void;
}

export const PromptBox: React.FC<PromptBoxProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  onEnhance,
  onRewrite,
  isEnhancing,
  isRewriting,
  isGenerating,
  variations,
  onSelectVariation
}) => {
  const [showVariations, setShowVariations] = useState(false);

  const samplePrompt =
    'Create a cinematic 10-second video of an artist drawing a realistic Krishna portrait with a pencil on white paper. Close-up shots of the hand, pencil movement and final artwork reveal. Warm studio lighting, realistic details, smooth camera movement.';

  const handleUseSample = () => {
    setPrompt(samplePrompt);
  };

  const handleClear = () => {
    setPrompt('');
    setShowVariations(false);
  };

  const handleTriggerRewrite = async () => {
    await onRewrite();
    setShowVariations(true);
  };

  return (
    <div className="bg-studio-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Prompt Editor
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                Prompt-to-Video
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Describe your visual sequence in natural language or enhance with AI
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseSample}
          className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-800/40 hover:bg-purple-900/40 transition-colors"
          title="Load Krishna portrait drawing example"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Load Example</span>
        </button>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to create…"
          rows={5}
          className="w-full bg-studio-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-y min-h-[110px]"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              if (prompt.trim() && !isGenerating) onGenerate();
            }
          }}
        />
        <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-500 font-mono">
          {prompt.length} chars • Ctrl+Enter to generate
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-800/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Enhance Prompt */}
          <button
            type="button"
            onClick={onEnhance}
            disabled={isEnhancing || !prompt.trim()}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              isEnhancing
                ? 'bg-purple-950/50 text-purple-400 border-purple-800/50 cursor-wait'
                : !prompt.trim()
                ? 'bg-studio-950 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-900/60 to-pink-900/50 text-purple-200 border-purple-700/50 hover:border-purple-500 hover:text-white shadow-sm'
            }`}
            title="Enrich with camera angles, lighting, style, composition and pacing"
          >
            <Sparkles className={`w-3.5 h-3.5 text-purple-400 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Enhancing...' : '✨ Enhance Prompt'}</span>
          </button>

          {/* Rewrite Prompt */}
          <button
            type="button"
            onClick={handleTriggerRewrite}
            disabled={isRewriting || !prompt.trim()}
            className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition-all ${
              isRewriting
                ? 'bg-studio-950 text-slate-400 border-slate-800 cursor-wait'
                : !prompt.trim()
                ? 'bg-studio-950 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-studio-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title="Generate creative variations"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isRewriting ? 'animate-spin' : ''}`} />
            <span>{isRewriting ? 'Generating...' : '🔄 Rewrite Prompt'}</span>
          </button>

          {/* Clear Button */}
          {prompt.trim() && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Primary Hero Generate Button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
            isGenerating
              ? 'bg-purple-800/60 text-purple-200 cursor-wait'
              : !prompt.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.99]'
          }`}
        >
          <Play className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : 'fill-current'}`} />
          <span>{isGenerating ? 'Rendering Video...' : '🚀 Generate Video'}</span>
        </button>
      </div>

      {/* Rewritten Variations Carousel / Selection */}
      {showVariations && variations.length > 0 && (
        <div className="mt-3 p-3.5 rounded-xl bg-studio-950/90 border border-purple-900/40 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Select a Creative Angle:
            </span>
            <button
              type="button"
              onClick={() => setShowVariations(false)}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <div className="space-y-2">
            {variations.map((variant, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectVariation(variant);
                  setShowVariations(false);
                }}
                className="group p-2.5 rounded-lg bg-studio-900/80 border border-slate-800/80 hover:border-purple-600/60 text-xs text-slate-300 hover:text-white cursor-pointer transition-all flex items-start justify-between gap-3"
              >
                <span className="flex-1 leading-relaxed">{variant}</span>
                <span className="text-[10px] text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-semibold shrink-0 pt-0.5">
                  Use This <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
