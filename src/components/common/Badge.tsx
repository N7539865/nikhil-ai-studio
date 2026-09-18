// src/components/common/Badge.tsx
import React from 'react';
import { Platform, ContentStatus } from '../../types';
import { Video, FileText, Sparkles, CheckCircle2, Clock, Edit3, Scissors } from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from './BrandIcons';

interface BadgeProps {
  type: 'platform' | 'status' | 'category' | 'language';
  value: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ type, value, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (type === 'platform') {
    const p = value as Platform;
    switch (p) {
      case 'Instagram Reel':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 ${sizeClasses}`}>
            <InstagramIcon className="w-3 h-3" />
            <span>Reel</span>
          </span>
        );
      case 'YouTube Short':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/30 ${sizeClasses}`}>
            <YoutubeIcon className="w-3 h-3" />
            <span>Shorts</span>
          </span>
        );
      case 'YouTube Long Video':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses}`}>
            <Video className="w-3 h-3" />
            <span>YouTube</span>
          </span>
        );
      case 'Story':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 ${sizeClasses}`}>
            <Sparkles className="w-3 h-3" />
            <span>Story</span>
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses}`}>
            <FileText className="w-3 h-3" />
            <span>{value}</span>
          </span>
        );
    }
  }

  if (type === 'status') {
    const s = value as ContentStatus;
    switch (s) {
      case 'Idea':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses}`}>
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Idea</span>
          </span>
        );
      case 'Script Ready':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 ${sizeClasses}`}>
            <Edit3 className="w-3 h-3" />
            <span>Script Ready</span>
          </span>
        );
      case 'Recording':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses}`}>
            <Video className="w-3 h-3 text-amber-400" />
            <span>Recording</span>
          </span>
        );
      case 'Editing':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 ${sizeClasses}`}>
            <Scissors className="w-3 h-3" />
            <span>Editing</span>
          </span>
        );
      case 'Ready':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 ${sizeClasses}`}>
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            <span>Ready</span>
          </span>
        );
      case 'Published':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Published</span>
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses}`}>
            {value}
          </span>
        );
    }
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/80 ${sizeClasses}`}>
      {value}
    </span>
  );
};
