// src/components/video/AiVideoStudioView.tsx
import React, { useState, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { AiService } from '../../services/aiService';
import {
  AiGeneratedVideo,
  VideoStudioScene,
  VideoStudioSettings
} from '../../types';
import { PromptBox } from './PromptBox';
import { ReferenceImageUpload } from './ReferenceImageUpload';
import { VideoSettingsPanel } from './VideoSettingsPanel';
import { SceneBuilder } from './SceneBuilder';
import { VideoPreviewPlayer } from './VideoPreviewPlayer';
import { GenerationHistory } from './GenerationHistory';
import { SavedVideosList } from './SavedVideosList';
import {
  Film,
  Sparkles,
  Layers,
  Bookmark,
  History,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sliders,
  ExternalLink
} from 'lucide-react';

export const AiVideoStudioView: React.FC = () => {
  const {
    activeBrand,
    serverStatus,
    showToast,
    videoHistory,
    savedVideos,
    saveGeneratedVideo,
    deleteGeneratedVideo,
    toggleSaveVideo,
    saveProject,
    setActiveTab
  } = useStudio();

  // Active view tab in Video Studio
  const [activeSubTab, setActiveSubTab] = useState<'workspace' | 'history' | 'saved'>('workspace');

  // Video Generation Workspace State
  const [prompt, setPrompt] = useState<string>(
    'Create a cinematic 10-second video of an artist drawing a realistic Krishna portrait with a pencil on white paper. Close-up shots of the hand, pencil movement and final artwork reveal. Warm studio lighting, realistic details, smooth camera movement.'
  );
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [variations, setVariations] = useState<string[]>([]);
  const [referenceImage, setReferenceImage] = useState<string | undefined>(
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
  );

  const [settings, setSettings] = useState<VideoStudioSettings>({
    aspectRatio: '9:16',
    duration: 10,
    resolution: '1080p',
    style: 'Cinematic',
    camera: 'Cinematic'
  });

  const [scenes, setScenes] = useState<VideoStudioScene[]>([
    {
      id: 'scene_init_1',
      sceneNumber: 1,
      title: 'Paper Preparation & Guidelines',
      prompt: 'Close-up shot of an artist smoothing ivory drawing paper, sketching light initial guidelines for Krishna face.',
      duration: 2,
      camera: 'Close-up',
      transition: 'Cross Dissolve'
    },
    {
      id: 'scene_init_2',
      sceneNumber: 2,
      title: 'Lotus Eyes & Peacock Feather',
      prompt: 'Macro tracking movement: 4B graphite pencil tip rendering deep expressive eyes and ornate peacock feather.',
      duration: 3,
      camera: 'Tracking',
      transition: 'Cross Dissolve'
    },
    {
      id: 'scene_init_3',
      sceneNumber: 3,
      title: 'Shading Flute & Divine Ornaments',
      prompt: 'Slow tilt: Blending paper stump smoothing contrast, white highlights popping on the golden flute.',
      duration: 3,
      camera: 'Tilt',
      transition: 'Zoom In'
    },
    {
      id: 'scene_init_4',
      sceneNumber: 4,
      title: 'Masterpiece Reveal',
      prompt: 'Smooth cinematic dolly out: Studio lights warming as the complete realistic Krishna portrait is unveiled.',
      duration: 2,
      camera: 'Cinematic',
      transition: 'Fade to Black'
    }
  ]);

  // Active preview video
  const [currentVideo, setCurrentVideo] = useState<AiGeneratedVideo | null>(
    videoHistory[0] || null
  );

  // Loading flags
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isRewriting, setIsRewriting] = useState<boolean>(false);
  const [isGeneratingScenes, setIsGeneratingScenes] = useState<boolean>(false);

  // Sync current video when history updates if null
  useEffect(() => {
    if (!currentVideo && videoHistory.length > 0) {
      setCurrentVideo(videoHistory[0]);
    }
  }, [videoHistory, currentVideo]);

  // Handle settings update
  const handleSettingsChange = (updated: Partial<VideoStudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  // 1. Enhance Prompt Action
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    try {
      setIsEnhancing(true);
      const enhanced = await AiService.enhanceVideoPrompt(prompt, settings, activeBrand);
      setEnhancedPrompt(enhanced);
      setPrompt(enhanced);
      showToast('✨ Prompt successfully enhanced with cinematic details!', 'success');
    } catch (e: any) {
      showToast('Failed to enhance prompt: ' + e.message, 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  // 2. Rewrite Prompt Action
  const handleRewritePrompt = async () => {
    if (!prompt.trim()) return;
    try {
      setIsRewriting(true);
      const rewrites = await AiService.rewriteVideoPrompt(prompt, settings.style, activeBrand);
      setVariations(rewrites);
      showToast('3 creative prompt angles generated!', 'info');
    } catch (e: any) {
      showToast('Failed to rewrite prompt', 'error');
    } finally {
      setIsRewriting(false);
    }
  };

  // 3. Auto-Generate Scenes from Prompt
  const handleAutoGenerateScenes = async () => {
    if (!prompt.trim()) return;
    try {
      setIsGeneratingScenes(true);
      const generated = await AiService.generateVideoScenes(prompt, settings);
      setScenes(generated);
      showToast('✨ Scenes auto-constructed from your prompt!', 'success');
    } catch (e: any) {
      showToast('Failed to generate scenes', 'error');
    } finally {
      setIsGeneratingScenes(false);
    }
  };

  // 4. Generate Video Action
  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);
      // Auto-switch to workspace tab if elsewhere
      if (activeSubTab !== 'workspace') setActiveSubTab('workspace');

      const video = await AiService.generateAiVideo({
        prompt,
        enhancedPrompt: enhancedPrompt || prompt,
        referenceImage,
        settings,
        scenes,
        brand: activeBrand
      });

      setCurrentVideo(video);
      saveGeneratedVideo(video);
      showToast('🎬 Video rendered successfully in Studio Preview!', 'success');
    } catch (e: any) {
      showToast('Video generation error: ' + e.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // 5. Send to Video Projects
  const handleSendToProject = (video: AiGeneratedVideo) => {
    saveProject({
      id: 'proj_' + Date.now(),
      brandId: activeBrand.id,
      name: video.title,
      platform: video.settings.aspectRatio === '9:16' ? 'Instagram Reel' : 'YouTube',
      status: 'Ready',
      topic: video.prompt,
      script: video.scenes.map(s => `[Scene ${s.sceneNumber} - ${s.duration}s]: ${s.prompt} (Cam: ${s.camera})`).join('\n\n'),
      caption: `🎨 ${video.title}\n\nGenerated with Nikhil AI Video Studio.\n\n${activeBrand.defaultCta}\n\n#NikhilArts #AIArt #PromptToVideo`,
      hashtags: '#NikhilArts #PromptToVideo #AIArt #ArtProcess',
      thumbnailConcept: video.thumbnailUrl,
      checklist: {
        video_edited: true,
        thumbnail_ready: true,
        ready_to_publish: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    showToast('Video exported to Video Projects!', 'success');
    setActiveTab('projects');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/70 via-studio-900 to-pink-950/60 border border-purple-900/40 p-6 shadow-2xl backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  AI Video Studio
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                    Google Flow Inspired
                  </span>
                </h1>
                <p className="text-xs text-purple-300/80 font-medium">
                  Autonomous Prompt-to-Video Engine • Multi-Scene Sequencing • 4K Real-time Canvas Rendering
                </p>
              </div>
            </div>

            {/* Workflow Breadcrumb Steps */}
            <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-purple-300/70 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-purple-900/40 border border-purple-800/40 text-purple-200">
                PROMPT
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-900/40 border border-purple-800/40 text-purple-200">
                SCENE
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-900/40 border border-purple-800/40 text-purple-200">
                GENERATE
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-900/40 border border-purple-800/40 text-purple-200">
                PREVIEW
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-900/40 border border-purple-800/40 text-purple-200">
                SAVE
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-900/40 border border-purple-800/40 text-purple-200">
                DOWNLOAD
              </span>
            </div>
          </div>

          {/* Subtabs Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-studio-950/80 border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSubTab('workspace')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'workspace'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Studio Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('history')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'history'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                {videoHistory.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('saved')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'saved'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Videos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {savedVideos.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio View Body */}
      {activeSubTab === 'history' ? (
        <GenerationHistory
          history={videoHistory}
          selectedVideoId={currentVideo?.id}
          onSelectVideo={(v) => {
            setCurrentVideo(v);
            setActiveSubTab('workspace');
          }}
          onToggleSave={toggleSaveVideo}
          onDeleteVideo={deleteGeneratedVideo}
        />
      ) : activeSubTab === 'saved' ? (
        <SavedVideosList
          savedVideos={savedVideos}
          onSelectVideo={(v) => {
            setCurrentVideo(v);
            setActiveSubTab('workspace');
          }}
          onRemoveSaved={toggleSaveVideo}
          onSendToProject={handleSendToProject}
        />
      ) : (
        /* Workspace Two-Column Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Controls, Prompts, Settings & Scenes (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Prompt Box */}
            <PromptBox
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerateVideo}
              onEnhance={handleEnhancePrompt}
              onRewrite={handleRewritePrompt}
              isEnhancing={isEnhancing}
              isRewriting={isRewriting}
              isGenerating={isGenerating}
              variations={variations}
              onSelectVariation={(v) => setPrompt(v)}
            />

            {/* 2. Reference Image Upload */}
            <ReferenceImageUpload
              referenceImage={referenceImage}
              onImageChange={(img) => setReferenceImage(img)}
              providerStatus={serverStatus}
            />

            {/* 3. Video Settings */}
            <VideoSettingsPanel
              settings={settings}
              onChange={handleSettingsChange}
            />

            {/* 4. Scene Builder */}
            <SceneBuilder
              scenes={scenes}
              setScenes={setScenes}
              settings={settings}
              onAutoGenerateScenes={handleAutoGenerateScenes}
              isGeneratingScenes={isGeneratingScenes}
            />
          </div>

          {/* Right Column: Sticky Video Preview Player & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
            <VideoPreviewPlayer
              currentVideo={currentVideo}
              isGenerating={isGenerating}
              aspectRatio={settings.aspectRatio}
              onSaveVideo={saveGeneratedVideo}
              isSaved={!!currentVideo && currentVideo.isSaved}
            />

            {/* Quick Export to Projects Banner */}
            {currentVideo && (
              <div className="p-4 rounded-2xl bg-studio-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Deploy to Production</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Sync this video package directly into Video Projects with full checklist.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendToProject(currentVideo)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shrink-0 flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
                >
                  <span>Sync Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mini History Drawer */}
            <GenerationHistory
              history={videoHistory.slice(0, 4)}
              selectedVideoId={currentVideo?.id}
              onSelectVideo={(v) => setCurrentVideo(v)}
              onToggleSave={toggleSaveVideo}
              onDeleteVideo={deleteGeneratedVideo}
            />
          </div>
        </div>
      )}
    </div>
  );
};
