// src/components/video/SceneBuilder.tsx
import React from 'react';
import {
  Layers,
  Plus,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Camera,
  Repeat,
  Clock
} from 'lucide-react';
import {
  VideoStudioScene,
  VideoCamera,
  VideoTransition,
  VideoStudioSettings
} from '../../types';

interface SceneBuilderProps {
  scenes: VideoStudioScene[];
  setScenes: (scenes: VideoStudioScene[]) => void;
  settings: VideoStudioSettings;
  onAutoGenerateScenes: () => Promise<void>;
  isGeneratingScenes: boolean;
}

export const SceneBuilder: React.FC<SceneBuilderProps> = ({
  scenes,
  setScenes,
  settings,
  onAutoGenerateScenes,
  isGeneratingScenes
}) => {
  const cameraOptions: VideoCamera[] = [
    'Static',
    'Close-up',
    'Wide shot',
    'Tracking',
    'Dolly',
    'Pan',
    'Tilt',
    'Handheld',
    'Cinematic'
  ];

  const transitionOptions: VideoTransition[] = [
    'Cut',
    'Cross Dissolve',
    'Fade to Black',
    'Fade to White',
    'Whip Pan',
    'Zoom In'
  ];

  const totalDuration = scenes.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);

  const handleAddScene = () => {
    const newNum = scenes.length + 1;
    const newScene: VideoStudioScene = {
      id: 'scene_' + Date.now() + '_' + newNum,
      sceneNumber: newNum,
      title: `Scene ${newNum}`,
      prompt: '',
      duration: 3,
      camera: 'Cinematic',
      transition: 'Cross Dissolve'
    };
    setScenes([...scenes, newScene]);
  };

  const handleDuplicateScene = (index: number) => {
    const target = scenes[index];
    if (!target) return;
    const cloned: VideoStudioScene = {
      ...target,
      id: 'scene_' + Date.now() + '_clone',
      title: `${target.title} (Copy)`,
      sceneNumber: scenes.length + 1
    };
    const updated = [...scenes];
    updated.splice(index + 1, 0, cloned);
    // Renumber
    setScenes(updated.map((s, i) => ({ ...s, sceneNumber: i + 1 })));
  };

  const handleDeleteScene = (index: number) => {
    if (scenes.length <= 1) return;
    const updated = scenes.filter((_, i) => i !== index);
    setScenes(updated.map((s, i) => ({ ...s, sceneNumber: i + 1 })));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...scenes];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setScenes(updated.map((s, i) => ({ ...s, sceneNumber: i + 1 })));
  };

  const handleMoveDown = (index: number) => {
    if (index === scenes.length - 1) return;
    const updated = [...scenes];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setScenes(updated.map((s, i) => ({ ...s, sceneNumber: i + 1 })));
  };

  const handleUpdateScene = (index: number, field: keyof VideoStudioScene, value: any) => {
    const updated = [...scenes];
    updated[index] = { ...updated[index], [field]: value };
    setScenes(updated);
  };

  return (
    <div className="bg-studio-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Multi-Scene Director
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                Timeline Flow
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Construct sequential multi-scene narrative with camera transitions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Total Duration Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-studio-950 border border-slate-800 text-xs font-mono">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-400">Total:</span>
            <span className={`font-bold ${totalDuration > settings.duration ? 'text-amber-400' : 'text-slate-200'}`}>
              {totalDuration}s
            </span>
            <span className="text-[10px] text-slate-400">/ {settings.duration}s target</span>
          </div>

          {/* AI Auto-Breakdown button */}
          <button
            type="button"
            onClick={onAutoGenerateScenes}
            disabled={isGeneratingScenes}
            className="text-[11px] px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/70 to-purple-950/70 border border-cyan-700/50 hover:border-cyan-500 text-cyan-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Auto-breakdown user prompt into 3-4 storyboard scenes"
          >
            <Sparkles className={`w-3.5 h-3.5 text-cyan-400 ${isGeneratingScenes ? 'animate-spin' : ''}`} />
            <span>{isGeneratingScenes ? 'Breaking down...' : '✨ Auto-Split Scenes'}</span>
          </button>
        </div>
      </div>

      {/* Scenes List */}
      <div className="space-y-3">
        {scenes.map((scene, idx) => (
          <div
            key={scene.id}
            className="p-3.5 rounded-xl bg-studio-950/80 border border-slate-800/80 hover:border-slate-700/80 transition-all space-y-3 group"
          >
            {/* Scene Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {scene.sceneNumber}
                </span>
                <input
                  type="text"
                  value={scene.title}
                  onChange={(e) => handleUpdateScene(idx, 'title', e.target.value)}
                  placeholder={`Scene ${scene.sceneNumber} Title`}
                  className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none focus:border-b focus:border-cyan-500 max-w-[200px]"
                />
              </div>

              {/* Scene Reorder & Action Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === scenes.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-3 bg-slate-800 mx-1" />
                <button
                  type="button"
                  onClick={() => handleDuplicateScene(idx)}
                  className="p-1 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Duplicate Scene"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {scenes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteScene(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Scene"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scene Prompt */}
            <textarea
              value={scene.prompt}
              onChange={(e) => handleUpdateScene(idx, 'prompt', e.target.value)}
              placeholder={`Describe visual action for scene ${scene.sceneNumber} (e.g. Artist prepares paper, close-up sketch, final reveal)...`}
              rows={2}
              className="w-full bg-studio-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />

            {/* Scene Controls Row (Duration, Camera, Transition) */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 text-[11px]">
              {/* Duration */}
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Duration</label>
                <select
                  value={scene.duration}
                  onChange={(e) => handleUpdateScene(idx, 'duration', Number(e.target.value))}
                  className="w-full bg-studio-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((sec) => (
                    <option key={sec} value={sec}>
                      {sec} seconds
                    </option>
                  ))}
                </select>
              </div>

              {/* Camera Direction */}
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Camera</label>
                <select
                  value={scene.camera}
                  onChange={(e) => handleUpdateScene(idx, 'camera', e.target.value as VideoCamera)}
                  className="w-full bg-studio-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {cameraOptions.map((cam) => (
                    <option key={cam} value={cam}>
                      {cam}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transition to next scene */}
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Transition</label>
                <select
                  value={scene.transition}
                  onChange={(e) => handleUpdateScene(idx, 'transition', e.target.value as VideoTransition)}
                  className="w-full bg-studio-900 border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {transitionOptions.map((tr) => (
                    <option key={tr} value={tr}>
                      {tr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Scene Button */}
      <button
        type="button"
        onClick={handleAddScene}
        className="w-full py-2.5 rounded-xl border border-dashed border-slate-800 hover:border-cyan-500/60 bg-studio-950/40 hover:bg-studio-950 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Scene {scenes.length + 1}</span>
      </button>
    </div>
  );
};
