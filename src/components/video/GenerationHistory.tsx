// src/components/video/GenerationHistory.tsx
import React from 'react';
import { History, Play, Bookmark, BookmarkCheck, Trash2, Clock, Ratio, Film, Download } from 'lucide-react';
import { AiGeneratedVideo } from '../../types';

interface GenerationHistoryProps {
  history: AiGeneratedVideo[];
  onSelectVideo: (video: AiGeneratedVideo) => void;
  onToggleSave: (id: string) => void;
  onDeleteVideo: (id: string) => void;
  selectedVideoId?: string;
}

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  history,
  onSelectVideo,
  onToggleSave,
  onDeleteVideo,
  selectedVideoId
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-studio-900/90 border border-slate-800/90 rounded-2xl p-6 text-center shadow-xl backdrop-blur-sm">
        <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-300">No Generations Yet</p>
        <p className="text-[11px] text-slate-500 mt-1">
          Your prompt-to-video runs and storyboard reels will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-studio-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-slate-100">Generation History</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
            {history.length}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">Click any run to preview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
        {history.map((vid) => {
          const isSelected = vid.id === selectedVideoId;
          const dateStr = new Date(vid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 group ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-900/30'
                  : 'bg-studio-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-studio-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail / Play trigger */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                  {vid.thumbnailUrl ? (
                    <img src={vid.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Film className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                      {vid.settings.aspectRatio}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {vid.totalDuration}s
                    </span>
                    <span className="text-[10px] text-slate-500 ml-auto">
                      {dateStr}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100 truncate mt-1">
                    {vid.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                    {vid.prompt}
                  </p>
                </div>
              </div>

              {/* Action Buttons footer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                <span className="text-[10px] text-slate-500">
                  {vid.scenes?.length || 0} scenes • {vid.settings.style}
                </span>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onToggleSave(vid.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      vid.isSaved
                        ? 'bg-amber-950/50 border-amber-800/60 text-amber-300'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={vid.isSaved ? 'Remove from Saved' : 'Save Video'}
                  >
                    {vid.isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteVideo(vid.id)}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
                    title="Delete Run"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
