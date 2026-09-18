// src/components/video/VideoSettingsPanel.tsx
import React from 'react';
import { Sliders, Ratio, Clock, Sparkles, Camera, Monitor } from 'lucide-react';
import {
  VideoAspectRatio,
  VideoDuration,
  VideoResolution,
  VideoStyle,
  VideoCamera,
  VideoStudioSettings
} from '../../types';

interface VideoSettingsPanelProps {
  settings: VideoStudioSettings;
  onChange: (updated: Partial<VideoStudioSettings>) => void;
}

export const VideoSettingsPanel: React.FC<VideoSettingsPanelProps> = ({
  settings,
  onChange
}) => {
  const aspectRatios: { id: VideoAspectRatio; label: string; iconLabel: string; desc: string }[] = [
    { id: '9:16', label: '9:16 Vertical', iconLabel: '📱 9:16', desc: 'Shorts, Reels, TikTok' },
    { id: '16:9', label: '16:9 Widescreen', iconLabel: '🖥️ 16:9', desc: 'YouTube & Cinematic' },
    { id: '1:1', label: '1:1 Square', iconLabel: '⏹️ 1:1', desc: 'Instagram Feed Post' }
  ];

  const durations: { id: VideoDuration; label: string; desc: string }[] = [
    { id: 5, label: '5s', desc: 'Punchy Hook' },
    { id: 8, label: '8s', desc: 'Micro Story' },
    { id: 10, label: '10s', desc: 'Standard Reel' },
    { id: 15, label: '15s', desc: 'Extended Scene' }
  ];

  const resolutions: { id: VideoResolution; label: string; badge: string }[] = [
    { id: '720p', label: '720p HD', badge: 'Fastest' },
    { id: '1080p', label: '1080p Full HD', badge: 'Recommended' },
    { id: '4K', label: '4K Ultra HD', badge: 'Cinematic' }
  ];

  const styles: { id: VideoStyle; label: string; icon: string }[] = [
    { id: 'Realistic', label: 'Realistic', icon: '📷' },
    { id: 'Cinematic', label: 'Cinematic', icon: '🎬' },
    { id: 'Art', label: 'Art / Sketch', icon: '🎨' },
    { id: '3D', label: '3D Render', icon: '🧊' },
    { id: 'Animated', label: 'Animated', icon: '✨' },
    { id: 'Product', label: 'Product', icon: '📦' },
    { id: 'Documentary', label: 'Documentary', icon: '🎙️' },
    { id: 'Fantasy', label: 'Fantasy', icon: '🔮' }
  ];

  const cameraMoves: { id: VideoCamera; label: string; desc: string }[] = [
    { id: 'Cinematic', label: 'Cinematic Flow', desc: 'Smooth stabilized motion' },
    { id: 'Close-up', label: 'Close-up / Macro', desc: 'Intense detail & texture' },
    { id: 'Tracking', label: 'Tracking Motion', desc: 'Follows hand or subject' },
    { id: 'Dolly', label: 'Dolly In / Out', desc: 'Slow cinematic push/pull' },
    { id: 'Wide shot', label: 'Wide Establishing', desc: 'Full studio environment' },
    { id: 'Pan', label: 'Smooth Pan', desc: 'Horizontal sweep' },
    { id: 'Tilt', label: 'Slow Tilt', desc: 'Vertical upward/downward reveal' },
    { id: 'Handheld', label: 'Organic Handheld', desc: 'Natural organic movement' },
    { id: 'Static', label: 'Locked Static', desc: 'Rock-solid tripod frame' }
  ];

  return (
    <div className="bg-studio-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Sliders className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            Video Configuration
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
              Studio Specs
            </span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Configure aspect ratio, duration, resolution, style, and camera dynamics
          </p>
        </div>
      </div>

      {/* 1. Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Ratio className="w-3.5 h-3.5 text-purple-400" />
          <span>Aspect Ratio</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {aspectRatios.map((item) => {
            const isSelected = settings.aspectRatio === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ aspectRatio: item.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-600/20'
                    : 'bg-studio-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{item.iconLabel}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Duration & Resolution Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span>Duration</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {durations.map((d) => {
              const isSelected = settings.duration === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChange({ duration: d.id })}
                  className={`py-2 px-1 rounded-xl text-center border transition-all ${
                    isSelected
                      ? 'bg-pink-950/60 border-pink-500 text-white font-bold'
                      : 'bg-studio-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs'
                  }`}
                >
                  <div className="text-xs">{d.label}</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{d.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resolution */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resolution</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {resolutions.map((res) => {
              const isSelected = settings.resolution === res.id;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => onChange({ resolution: res.id })}
                  className={`py-2 px-1.5 rounded-xl text-center border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-500 text-white font-bold'
                      : 'bg-studio-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{res.id}</div>
                  <div className="text-[9px] text-cyan-400/80 mt-0.5">{res.badge}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Style Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Visual Style</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {styles.map((style) => {
            const isSelected = settings.style === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ style: style.id })}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-950/50 border-amber-500 text-white font-semibold'
                    : 'bg-studio-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs'
                }`}
              >
                <span className="text-base">{style.icon}</span>
                <span className="text-xs">{style.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Camera Movement */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>Camera Direction & Pacing</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {cameraMoves.map((cam) => {
            const isSelected = settings.camera === cam.id;
            return (
              <button
                key={cam.id}
                type="button"
                onClick={() => onChange({ camera: cam.id })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500 text-white'
                    : 'bg-studio-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>{cam.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{cam.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
