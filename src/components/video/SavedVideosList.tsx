// src/components/video/SavedVideosList.tsx
import React, { useState } from 'react';
import { Bookmark, Search, Play, Trash2, Film, Download, Calendar, ArrowUpRight } from 'lucide-react';
import { AiGeneratedVideo } from '../../types';

interface SavedVideosListProps {
  savedVideos: AiGeneratedVideo[];
  onSelectVideo: (video: AiGeneratedVideo) => void;
  onRemoveSaved: (id: string) => void;
  onSendToProject: (video: AiGeneratedVideo) => void;
}

export const SavedVideosList: React.FC<SavedVideosListProps> = ({
  savedVideos,
  onSelectVideo,
  onRemoveSaved,
  onSendToProject
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = savedVideos.filter((vid) => {
    const q = searchTerm.toLowerCase();
    return (
      vid.title.toLowerCase().includes(q) ||
      vid.prompt.toLowerCase().includes(q) ||
      vid.settings.style.toLowerCase().includes(q)
    );
  });

  if (savedVideos.length === 0) {
    return (
      <div className="bg-studio-900/90 border border-slate-800/90 rounded-2xl p-6 text-center shadow-xl backdrop-blur-sm">
        <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-300">No Saved Videos</p>
        <p className="text-[11px] text-slate-500 mt-1">
          Click the bookmark icon or "Save Video" on any generation to save your favorite reels here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-studio-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100">Saved Video Projects</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
            {savedVideos.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved videos..."
            className="bg-studio-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filtered.map((vid) => (
          <div
            key={vid.id}
            className="p-3.5 rounded-xl bg-studio-950/90 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <div
                onClick={() => onSelectVideo(vid)}
                className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0 cursor-pointer border border-slate-800 group-hover:border-amber-500/40 transition-colors"
              >
                {vid.thumbnailUrl ? (
                  <img src={vid.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Film className="w-6 h-6" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 text-white fill-current" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                    {vid.settings.aspectRatio}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {vid.totalDuration}s
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {vid.settings.style}
                  </span>
                </div>

                <h3
                  onClick={() => onSelectVideo(vid)}
                  className="text-xs font-bold text-slate-100 hover:text-amber-300 cursor-pointer truncate mt-1.5 transition-colors"
                >
                  {vid.title}
                </h3>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-tight">
                  {vid.prompt}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <button
                type="button"
                onClick={() => onSendToProject(vid)}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Add to Video Projects</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSelectVideo(vid)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  title="Load in Preview Player"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveSaved(vid.id)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
                  title="Remove from Saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
