// src/components/video/VideoPreviewPlayer.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Share2,
  Ratio,
  Clock,
  Film
} from 'lucide-react';
import { AiGeneratedVideo, VideoAspectRatio } from '../../types';

interface VideoPreviewPlayerProps {
  currentVideo: AiGeneratedVideo | null;
  isGenerating: boolean;
  aspectRatio: VideoAspectRatio;
  onSaveVideo: (video: AiGeneratedVideo) => void;
  isSaved: boolean;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  currentVideo,
  isGenerating,
  aspectRatio,
  onSaveVideo,
  isSaved
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(1);

  const duration = currentVideo?.totalDuration || 10;

  // Simulate Generation Progress steps
  useEffect(() => {
    if (isGenerating) {
      setGenerationStep(1);
      const t1 = setTimeout(() => setGenerationStep(2), 700);
      const t2 = setTimeout(() => setGenerationStep(3), 1600);
      const t3 = setTimeout(() => setGenerationStep(4), 2600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isGenerating]);

  // Autoplay when new video generated
  useEffect(() => {
    if (currentVideo && !isGenerating) {
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [currentVideo, isGenerating]);

  // Canvas Animation Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number | undefined;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Background Studio Canvas Base
      ctx.fillStyle = '#08080f';
      ctx.fillRect(0, 0, w, h);

      // Soft paper background / easel glow
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h));
      grad.addColorStop(0, '#1c152d');
      grad.addColorStop(0.7, '#0f0b1a');
      grad.addColorStop(1, '#05030a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const progress = duration > 0 ? (currentTime / duration) : 0;
      const currentSec = currentTime;

      // Determine active scene based on progress
      const scenes = currentVideo?.scenes || [];
      let activeSceneIndex = 0;
      let accumTime = 0;
      for (let i = 0; i < scenes.length; i++) {
        accumTime += scenes[i].duration;
        if (currentSec <= accumTime) {
          activeSceneIndex = i;
          break;
        }
      }
      const activeScene = scenes[activeSceneIndex] || scenes[0];

      // Draw artistic rendering elements based on progress
      // 1. Paper / Drawing Surface
      const marginX = w * 0.08;
      const marginY = h * 0.08;
      const paperW = w - marginX * 2;
      const paperH = h - marginY * 2;

      ctx.save();
      ctx.shadowColor = 'rgba(139, 92, 246, 0.25)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(marginX, marginY, paperW, paperH);

      // Fine art paper grain texture
      ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
      for (let i = 0; i < 40; i++) {
        const px = marginX + Math.sin(i * 99) * paperW * 0.5 + paperW * 0.5;
        const py = marginY + Math.cos(i * 33) * paperH * 0.5 + paperH * 0.5;
        ctx.fillRect(px, py, 2, 2);
      }
      ctx.restore();

      // 2. Animated Drawing / Artwork Progression
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(paperW, paperH) * 0.32;

      ctx.save();
      // Draw circular portrait outline / Krishna crown & peacock feather silhouette
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2 * Math.min(1, progress * 1.5));
      ctx.stroke();

      // Shading lines
      if (progress > 0.15) {
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.7)';
        ctx.lineWidth = 1.5;
        const lineCount = Math.floor(progress * 25);
        for (let i = 0; i < lineCount; i++) {
          const angle = (i / 25) * Math.PI;
          const x1 = cx - Math.cos(angle) * (radius * 0.7);
          const y1 = cy - Math.sin(angle) * (radius * 0.7);
          const x2 = cx + Math.cos(angle) * (radius * 0.7);
          const y2 = cy + Math.sin(angle) * (radius * 0.7);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // Peacock feather / crown highlights (Gold accents)
      if (progress > 0.4) {
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy - radius * 0.85, 14, 28, Math.PI / 8, 0, Math.PI * 2 * Math.min(1, (progress - 0.4) * 2));
        ctx.stroke();

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(cx, cy - radius * 0.85, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Detailed Eyes and Smile Reveal (Krishna facial aesthetic)
      if (progress > 0.6) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        // Left eye
        ctx.beginPath();
        ctx.arc(cx - radius * 0.3, cy - radius * 0.1, radius * 0.15, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
        // Right eye
        ctx.beginPath();
        ctx.arc(cx + radius * 0.3, cy - radius * 0.1, radius * 0.15, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // Flute across bottom
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.9, cy + radius * 0.6);
        ctx.lineTo(cx + radius * 0.9, cy + radius * 0.4);
        ctx.stroke();
      }

      // Final Masterpiece Glow & Signature Stamp
      if (progress > 0.85) {
        ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Artist Signature
        ctx.font = 'italic 11px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Nikhil Arts ©', cx + radius * 0.25, cy + radius * 0.95);
      }

      // 3. Moving Pencil / Stylus Tip with dynamic tracking
      if (progress < 0.95) {
        const penAngle = progress * Math.PI * 6;
        const penX = cx + Math.cos(penAngle) * (radius * 0.6 * Math.sin(progress * 4));
        const penY = cy + Math.sin(penAngle) * (radius * 0.6);

        // Pencil Body
        ctx.save();
        ctx.translate(penX, penY);
        ctx.rotate(-Math.PI / 4);
        ctx.fillStyle = '#f59e0b'; // Gold pencil
        ctx.fillRect(0, -6, 45, 12);
        ctx.fillStyle = '#1e293b'; // Tip
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(-12, 0);
        ctx.lineTo(0, 6);
        ctx.fill();
        ctx.restore();

        // Little dynamic sparkle at pencil tip
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(penX, penY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 4. Cinematic Overlay Cues (Aspect Ratio, Scene Info, Brand Watermark)
      // Top Bar Overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, 0, w, 36);

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(currentVideo?.title?.slice(0, 32) || 'Nikhil AI Studio Video', 12, 22);

      // Aspect Ratio & Resolution Tag
      ctx.font = '10px monospace';
      ctx.fillStyle = '#a855f7';
      const specText = `${aspectRatio} • ${currentVideo?.settings.resolution || '1080p'}`;
      ctx.fillText(specText, w - ctx.measureText(specText).width - 12, 22);

      // Bottom Scene Cues
      if (activeScene) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, h - 42, w, 42);

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Scene ${activeScene.sceneNumber}: ${activeScene.title}`, 12, h - 24);

        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        const promptSnippet = activeScene.prompt.slice(0, 48) + (activeScene.prompt.length > 48 ? '...' : '');
        ctx.fillText(promptSnippet, 12, h - 10);
      }
    };

    render();

    // Timer progression
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            if (isLooping) return 0;
            setIsPlaying(false);
            return duration;
          }
          return Math.min(duration, +(prev + 0.1).toFixed(1));
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [isPlaying, currentTime, duration, isLooping, currentVideo, aspectRatio]);

  // Audio synthesize sound effect
  useEffect(() => {
    if (isPlaying && !isMuted) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220 + (currentTime % 2) * 50, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.2);
        }
      } catch {
        // AudioContext ignored if blocked by autoplay policy
      }
    }
  }, [currentTime, isPlaying, isMuted]);

  // Real Native Video Download via MediaRecorder
  const handleDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentVideo) return;

    try {
      setIsDownloading(true);
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(currentVideo.title || 'Nikhil_AI_Video').replace(/[^a-zA-Z0-9]/g, '_')}_${aspectRatio.replace(':', 'x')}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      };

      // Reset and play for full recording duration
      setCurrentTime(0);
      setIsPlaying(true);
      recorder.start();

      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, (duration + 0.5) * 1000);
    } catch (err) {
      console.warn('Canvas MediaRecorder failed, downloading project brief:', err);
      // Fallback: Export production brief
      const content = `NIKHIL AI STUDIO — AI VIDEO BRIEF\nTitle: ${currentVideo.title}\nPrompt: ${currentVideo.prompt}\nEnhanced: ${currentVideo.enhancedPrompt}\nAspect Ratio: ${aspectRatio}\nDuration: ${duration}s\nResolution: ${currentVideo.settings.resolution}\nStyle: ${currentVideo.settings.style}\nScenes:\n` +
        currentVideo.scenes.map(s => `Scene ${s.sceneNumber} (${s.duration}s): ${s.prompt} [Camera: ${s.camera}, Transition: ${s.transition}]`).join('\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentVideo.title.replace(/[^a-zA-Z0-9]/g, '_')}_brief.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }
  };

  // Dimensions based on Aspect Ratio
  const getPlayerDimensions = () => {
    if (aspectRatio === '9:16') {
      return { width: 360, height: 640, containerClass: 'aspect-[9/16] max-h-[580px]' };
    }
    if (aspectRatio === '16:9') {
      return { width: 640, height: 360, containerClass: 'aspect-[16/9] w-full max-w-[620px]' };
    }
    return { width: 480, height: 480, containerClass: 'aspect-square max-h-[520px]' };
  };

  const dim = getPlayerDimensions();

  return (
    <div className="bg-studio-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-slate-100">Cinematic Preview</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
            {aspectRatio}
          </span>
        </div>

        {currentVideo && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSaveVideo(currentVideo)}
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                isSaved
                  ? 'bg-amber-950/60 border-amber-600/50 text-amber-300'
                  : 'bg-studio-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved' : 'Save Video'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadVideo}
              disabled={isDownloading}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? 'Exporting...' : 'Download'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Canvas Viewport with selected Aspect Ratio Frame */}
      <div
        ref={containerRef}
        className={`relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 bg-black flex items-center justify-center ${dim.containerClass}`}
      >
        <canvas
          ref={canvasRef}
          width={dim.width}
          height={dim.height}
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
        />

        {/* Generating Progress State Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
              <Sparkles className="w-7 h-7 text-purple-400 animate-pulse" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-100">Generating AI Video...</h3>
              <p className="text-xs text-purple-300 font-medium mt-1">
                {generationStep === 1 && 'Step 1/4: Analyzing Prompt Latents & Motion Dynamics'}
                {generationStep === 2 && 'Step 2/4: Computing Camera Vectors & Scene Lighting'}
                {generationStep === 3 && 'Step 3/4: Rendering 4K Canvas Textures & Hand Flow'}
                {generationStep === 4 && 'Step 4/4: Assembling Color Grade & Timeline Reveal'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${generationStep * 25}%` }}
              />
            </div>
          </div>
        )}

        {/* Center Play Button Overlay when paused */}
        {!isPlaying && !isGenerating && currentVideo && (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-900/50 transition-transform hover:scale-110 active:scale-95 z-20"
          >
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </button>
        )}
      </div>

      {/* Media Controls Bar */}
      <div className="w-full space-y-2 pt-2">
        {/* Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
            00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[11px] font-mono text-slate-400 w-10">
            00:{duration < 10 ? `0${duration}` : duration}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-studio-950 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Restart */}
            <button
              type="button"
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-lg bg-studio-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Mute toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-studio-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute ASMR Tone' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Loop toggle */}
            <button
              type="button"
              onClick={() => setIsLooping(!isLooping)}
              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-semibold transition-colors ${
                isLooping
                  ? 'bg-purple-950/60 border-purple-800 text-purple-300'
                  : 'bg-studio-950 border-slate-800 text-slate-400'
              }`}
            >
              Loop {isLooping ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Style: <span className="text-slate-200">{currentVideo?.settings.style || 'Cinematic'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
