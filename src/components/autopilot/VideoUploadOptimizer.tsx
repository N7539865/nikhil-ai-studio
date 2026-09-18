// src/components/autopilot/AutoPilotView.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Platform, Language, AutoPilotAnalysisResult, VideoProject, ContentItem, AnalyticsEntry } from '../../types';
import { AiService } from '../../services/aiService';
import { postingTimeService, PostingRecommendation } from '../../services/postingTimeService';
import {
  UploadCloud,
  Video,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Send,
  Calendar,
  Save,
  Edit3,
  X,
  FileText,
  Tag,
  ArrowRight,
  Info,
  Check,
  Film,
  Zap,
  ChevronLeft
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../common/BrandIcons';
import { CopyButton } from '../common/CopyButton';
import { VoiceInputButton } from '../common/VoiceInputButton';
import { Modal } from '../common/Modal';

type AutoPilotStep = 'upload' | 'options' | 'schedule' | 'review';

export const VideoUploadOptimizer: React.FC = () => {
  const { activeBrand, showToast, saveProject, saveCalendarItem, saveAnalyticsEntry } = useStudio();

  // Current workflow step
  const [step, setStep] = useState<AutoPilotStep>('upload');

  // Video State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoSizeFormatted, setVideoSizeFormatted] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Form State
  const [platform, setPlatform] = useState<Platform>('Instagram Reel');
  const [context, setContext] = useState<string>('');
  const [category, setCategory] = useState<string>('Tech & Productivity');
  const [language, setLanguage] = useState<Language>(activeBrand.preferredLanguage || 'hinglish');

  // Analysis Result
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AutoPilotAnalysisResult | null>(null);

  // Selected Options
  const [selectedTitleIdx, setSelectedTitleIdx] = useState<number>(0);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [selectedHookIdx, setSelectedHookIdx] = useState<number>(0);
  const [customHook, setCustomHook] = useState<string>('');
  const [selectedCaptionIdx, setSelectedCaptionIdx] = useState<number>(0);
  const [customCaption, setCustomCaption] = useState<string>('');
  const [selectedCtaIdx, setSelectedCtaIdx] = useState<number>(0);
  const [customCta, setCustomCta] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');

  // Posting Recommendation & Schedule
  const [recommendation, setRecommendation] = useState<PostingRecommendation | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('18:30');

  // Confirmation Modals
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);
  const [publishInProgress, setPublishInProgress] = useState<boolean>(false);
  const [publishSuccessReceipt, setPublishSuccessReceipt] = useState<any | null>(null);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Video duration reader
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(Math.round(videoRef.current.duration));
    }
  };

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);

    // Format size
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setVideoSizeFormatted(`${sizeMb} MB`);

    // Auto-detect topic from filename if context is empty
    if (!context) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setContext(cleanName);
    }

    showToast(`Video loaded locally: ${file.name} (${sizeMb} MB)`);
  };

  // Trigger AI Auto-Pilot Analysis
  const handleRunAnalysis = async () => {
    if (!videoFile && !context.trim()) {
      showToast('Please select a video or provide topic context.', 'error');
      return;
    }

    setLoading(true);
    try {
      const fileName = videoFile?.name || 'custom_creator_video.mp4';
      const result = await AiService.analyzeVideoForAutoPilot(
        fileName,
        context,
        platform,
        category,
        language,
        activeBrand
      );

      if (result) {
        setAnalysis(result);
        setSelectedTitleIdx(0);
        setCustomTitle(result.titleOptions[0] || '');
        setSelectedHookIdx(0);
        setCustomHook(result.hookOptions[0] || '');
        setSelectedCaptionIdx(0);
        setCustomCaption(result.captionOptions[0] || '');
        setSelectedCtaIdx(0);
        setCustomCta(result.ctaOptions[0] || '');
        setCustomDescription(result.description || '');

        // Calculate posting time recommendations
        const reco = postingTimeService.getRecommendation(activeBrand.id, platform);
        setRecommendation(reco);
        setScheduledDate(reco.primarySlot.date);
        setScheduledTime(reco.primarySlot.time);

        setStep('options');
        showToast('AI Auto-Pilot analysis ready with 3 optimized options!');
      } else {
        showToast('Analysis failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Analysis encountered an error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Get active values
  const getActiveTitle = () => customTitle || analysis?.titleOptions[selectedTitleIdx] || 'Untitled Video';
  const getActiveHook = () => customHook || analysis?.hookOptions[selectedHookIdx] || '';
  const getActiveCaption = () => customCaption || analysis?.captionOptions[selectedCaptionIdx] || '';
  const getActiveCta = () => customCta || analysis?.ctaOptions[selectedCtaIdx] || '';

  // Save as Draft in Projects
  const handleSaveDraft = () => {
    const title = getActiveTitle();
    const newProject: VideoProject = {
      id: 'proj_' + Date.now(),
      brandId: activeBrand.id,
      name: title,
      platform,
      status: 'Ready',
      topic: analysis?.topic || context || title,
      caption: getActiveCaption(),
      hashtags: (analysis?.hashtags || []).join(' '),
      notes: `Generated via Auto-Pilot. Selected Hook: "${getActiveHook()}". CTA: "${getActiveCta()}". Scheduled target: ${scheduledDate} ${scheduledTime}.`,
      thumbnailConcept: analysis?.thumbnailConcept,
      uploadDate: scheduledDate,
      videoFileRef: videoFile?.name || 'Local_Video.mp4',
      checklist: {
        video_edited: true,
        thumbnail_ready: !!analysis?.thumbnailConcept,
        title_added: true,
        description_added: true,
        hashtags_added: true,
        keywords_added: true,
        caption_added: true,
        cta_added: true,
        video_reviewed: true,
        ready_to_publish: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveProject(newProject);
    showToast('Draft project saved successfully to Video Projects!', 'success');
    setStep('review');
  };

  // Execute Scheduling
  const handleConfirmSchedule = () => {
    const title = getActiveTitle();
    const calItem: ContentItem = {
      id: 'cal_' + Date.now(),
      brandId: activeBrand.id,
      title,
      platform,
      status: 'Ready',
      publishDate: scheduledDate,
      publishTime: scheduledTime,
      notes: `[Auto-Pilot Scheduled] Hook: "${getActiveHook()}". Scheduled via optimal engagement window.`
    };

    saveCalendarItem(calItem);
    setShowScheduleModal(false);
    showToast(`Video scheduled for ${scheduledDate} at ${scheduledTime}!`, 'success');
    setStep('review');
  };

  // Execute Instant Publishing
  const handleConfirmPublish = async () => {
    setPublishInProgress(true);
    try {
      const draft = {
        brandId: activeBrand.id,
        videoFileName: videoFile?.name || 'AutoPilot_Video.mp4',
        platform,
        context,
        category,
        language,
        selectedTitle: getActiveTitle(),
        selectedHook: getActiveHook(),
        selectedCaption: getActiveCaption(),
        selectedCta: getActiveCta(),
        description: customDescription || analysis?.description || '',
        hashtags: analysis?.hashtags || [],
        keywords: analysis?.keywords || [],
        scheduledDate,
        scheduledTime
      };

      const res = await AiService.publishAutoPilotPost(draft, platform, true);
      
      // Log to calendar as Published
      const publishedItem: ContentItem = {
        id: 'cal_' + Date.now(),
        brandId: activeBrand.id,
        title: getActiveTitle(),
        platform,
        status: 'Published',
        publishDate: new Date().toISOString().split('T')[0],
        publishTime: new Date().toTimeString().slice(0, 5),
        notes: `[Auto-Pilot Published] Hook: "${getActiveHook()}". Published successfully via ${res.mode}.`
      };
      saveCalendarItem(publishedItem);

      // Create initial tracking entry in Analytics
      const newAnalytics: AnalyticsEntry = {
        id: 'ana_' + Date.now(),
        brandId: activeBrand.id,
        date: new Date().toISOString().split('T')[0],
        platform,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        subscribersGained: 0,
        notes: `Initial baseline tracking for: ${getActiveTitle()}`
      };
      saveAnalyticsEntry(newAnalytics);

      setPublishSuccessReceipt(res);
      setShowPublishModal(false);
      showToast(res.message || 'Video published successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Publishing failed.', 'error');
    } finally {
      setPublishInProgress(false);
    }
  };

  // Reset entire workflow
  const handleReset = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
    setVideoDuration(null);
    setVideoSizeFormatted('');
    setAnalysis(null);
    setStep('upload');
    setPublishSuccessReceipt(null);
    showToast('Auto-Pilot session cleared.');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Breadcrumb */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-studio-900 to-studio-900 border border-purple-500/20 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">AI Content Auto-Pilot</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Smart Co-Pilot
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload video &rarr; AI deep analysis &rarr; 3-option optimization &rarr; Data-backed posting time &rarr; User approval
              </p>
            </div>
          </div>

          {/* Workflow Step Tracker */}
          <div className="flex items-center gap-2 bg-studio-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setStep('upload')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                step === 'upload' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Upload
            </button>
            <button
              onClick={() => analysis && setStep('options')}
              disabled={!analysis}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                step === 'options'
                  ? 'bg-purple-600 text-white shadow'
                  : analysis
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              2. 3 Options
            </button>
            <button
              onClick={() => analysis && setStep('schedule')}
              disabled={!analysis}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                step === 'schedule'
                  ? 'bg-purple-600 text-white shadow'
                  : analysis
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              3. Best Time
            </button>
            <button
              onClick={() => analysis && setStep('review')}
              disabled={!analysis}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                step === 'review'
                  ? 'bg-purple-600 text-white shadow'
                  : analysis
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              4. Approve & Publish
            </button>
          </div>
        </div>

        {/* Virality Guard & Privacy Banner */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              <strong>Zero External Upload Without Consent:</strong> Video stays 100% on your device preview until you confirm.
            </span>
          </div>
          <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              <strong>Virality Guard:</strong> Recommendations are optimized for retention and CTR. Organic virality is never guaranteed.
            </span>
          </div>
        </div>
      </div>

      {/* Success Receipt Modal / Card if published */}
      {publishSuccessReceipt && (
        <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/40 shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Broadcast Action Successful!</h3>
                <p className="text-xs text-slate-400">
                  {publishSuccessReceipt.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPublishSuccessReceipt(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-studio-950 border border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Platform:</span>
              <span className="font-semibold text-slate-200">{publishSuccessReceipt.platform}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Mode:</span>
              <span className="font-semibold text-emerald-400 uppercase">{publishSuccessReceipt.mode}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Dispatch ID:</span>
              <span className="font-mono text-slate-300">{publishSuccessReceipt.dispatchId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Status:</span>
              <span className="font-semibold text-purple-400">Tracked in Analytics</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: UPLOAD & INPUT */}
      {step === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload Dropzone & Player */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-slate-200">1. Select Video to Analyze</h3>
                </div>
                {videoFile && (
                  <button
                    onClick={handleReset}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              {/* Video Player or Upload Dropzone */}
              {videoUrl ? (
                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner group aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full h-full object-contain"
                    controls
                  />
                  <div className="absolute top-3 left-3 bg-studio-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 text-[11px] font-medium text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Local HTML5 Preview
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-700 hover:border-purple-500/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-studio-950/40 hover:bg-purple-950/10 group">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform mb-3">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-slate-200 text-sm">
                    Click to select or drag & drop video
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    MP4, MOV, WebM, MKV up to 500MB
                  </p>
                  <span className="mt-3 px-3 py-1 rounded-full bg-slate-800/80 text-[11px] text-slate-300 font-medium">
                    🔒 100% Client-Side Preview
                  </span>
                </label>
              )}

              {/* Video Metadata Chip */}
              {videoFile && (
                <div className="p-3.5 rounded-2xl bg-studio-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="font-medium text-slate-200 truncate max-w-xs">{videoFile.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span>Size: <strong className="text-slate-200">{videoSizeFormatted}</strong></span>
                    {videoDuration !== null && (
                      <span>Duration: <strong className="text-slate-200">{videoDuration}s</strong></span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Optimization Inputs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                2. Target Platform & Context
              </h3>

              {/* Platform Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Target Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlatform('Instagram Reel')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      platform === 'Instagram Reel'
                        ? 'border-pink-500 bg-pink-500/10 text-pink-300 shadow-md shadow-pink-500/20'
                        : 'border-slate-800 bg-studio-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <InstagramIcon className="w-5 h-5" />
                    <span className="text-xs font-bold">IG Reel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlatform('YouTube Short')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      platform === 'YouTube Short'
                        ? 'border-red-500 bg-red-500/10 text-red-300 shadow-md shadow-red-500/20'
                        : 'border-slate-800 bg-studio-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <YoutubeIcon className="w-5 h-5" />
                    <span className="text-xs font-bold">YT Short</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlatform('YouTube Long Video')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      platform === 'YouTube Long Video'
                        ? 'border-red-500 bg-red-500/10 text-red-300 shadow-md shadow-red-500/20'
                        : 'border-slate-800 bg-studio-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <YoutubeIcon className="w-5 h-5" />
                    <span className="text-xs font-bold">YT Video</span>
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">AI Output Language</label>
                <div className="grid grid-cols-3 gap-1.5 bg-studio-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setLanguage('english')}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      language === 'english' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    English (100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hindi')}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      language === 'hindi' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    हिंदी (100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('hinglish')}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      language === 'hinglish' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Hinglish
                  </button>
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">Content Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Tech & Productivity">Tech & Productivity</option>
                  <option value="Smartphones & Gadgets">Smartphones & Gadgets</option>
                  <option value="Creator Economy & Growth">Creator Economy & Growth</option>
                  <option value="Comedy & Relatable Skits">Comedy & Relatable Skits</option>
                  <option value="Gaming Highlights & Clutch">Gaming Highlights & Clutch</option>
                  <option value="Art, Painting & Tutorials">Art, Painting & Tutorials</option>
                  <option value="Daily Vlog & Lifestyle">Daily Vlog & Lifestyle</option>
                </select>
              </div>

              {/* Context / Topic Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-400">Optional Topic / Creator Notes</label>
                  <VoiceInputButton onTranscript={text => setContext(prev => prev ? `${prev} ${text}` : text)} />
                </div>
                <textarea
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="e.g. 5 hidden AI tools for video editors, why manual timelines fail, Devpri Telecom special store offer..."
                  rows={3}
                  className="w-full bg-studio-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleRunAnalysis}
                disabled={loading || (!videoFile && !context.trim())}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                  loading
                    ? 'bg-purple-800 text-purple-300 cursor-wait'
                    : !videoFile && !context.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-600/30'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Video & Generating 3 Options...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze & Generate Auto-Pilot
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: 3-OPTION METADATA SELECTION */}
      {step === 'options' && analysis && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-studio-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('upload')}
                className="p-2 rounded-xl bg-studio-950 hover:bg-studio-800 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-base font-bold text-slate-200">
                  Select Your Preferred Options ({language.toUpperCase()})
                </h3>
                <p className="text-xs text-slate-400">
                  Pick one of 3 AI-generated options for each key element, or customize directly.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('schedule')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              Continue to Best Posting Time <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Section: Titles (3 Options) */}
          <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold">1</span>
                Title (3 Options)
              </h4>
              <span className="text-xs text-slate-500">Pick or edit inline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.titleOptions.map((title, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedTitleIdx(idx);
                    setCustomTitle(title);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                    selectedTitleIdx === idx
                      ? 'border-purple-500 bg-purple-500/10 text-slate-100 shadow-md shadow-purple-500/20'
                      : 'border-slate-800 bg-studio-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      Option {idx + 1}
                    </span>
                    {selectedTitleIdx === idx && (
                      <span className="p-1 rounded-full bg-purple-500 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-relaxed">{title}</p>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Custom Title Edit</label>
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                className="w-full bg-studio-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Section: Opening Hooks (3 Options) */}
          <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-bold">2</span>
                3-Second Retention Hook (3 Options)
              </h4>
              <span className="text-xs text-slate-500">First 3 seconds critical for watch time</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.hookOptions.map((hook, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedHookIdx(idx);
                    setCustomHook(hook);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                    selectedHookIdx === idx
                      ? 'border-pink-500 bg-pink-500/10 text-slate-100 shadow-md shadow-pink-500/20'
                      : 'border-slate-800 bg-studio-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                      Hook {idx + 1}
                    </span>
                    {selectedHookIdx === idx && (
                      <span className="p-1 rounded-full bg-pink-500 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs italic leading-relaxed">"{hook}"</p>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Custom Hook Edit</label>
              <input
                type="text"
                value={customHook}
                onChange={e => setCustomHook(e.target.value)}
                className="w-full bg-studio-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Section: Captions (3 Options) */}
          <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">3</span>
                Caption (3 Options)
              </h4>
              <span className="text-xs text-slate-500">Formatted with spacing and emojis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.captionOptions.map((caption, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedCaptionIdx(idx);
                    setCustomCaption(caption);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                    selectedCaptionIdx === idx
                      ? 'border-cyan-500 bg-cyan-500/10 text-slate-100 shadow-md shadow-cyan-500/20'
                      : 'border-slate-800 bg-studio-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Caption {idx + 1}
                    </span>
                    {selectedCaptionIdx === idx && (
                      <span className="p-1 rounded-full bg-cyan-500 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed whitespace-pre-line line-clamp-5">{caption}</p>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Custom Caption Edit</label>
              <textarea
                value={customCaption}
                onChange={e => setCustomCaption(e.target.value)}
                rows={3}
                className="w-full bg-studio-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>

          {/* Section: CTA (3 Options) */}
          <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold">4</span>
                Call to Action (CTA) (3 Options)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.ctaOptions.map((cta, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedCtaIdx(idx);
                    setCustomCta(cta);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                    selectedCtaIdx === idx
                      ? 'border-amber-500 bg-amber-500/10 text-slate-100 shadow-md shadow-amber-500/20'
                      : 'border-slate-800 bg-studio-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      CTA {idx + 1}
                    </span>
                    {selectedCtaIdx === idx && (
                      <span className="p-1 rounded-full bg-amber-500 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium leading-relaxed">"{cta}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Hashtags, Keywords & Thumbnail Direction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hashtags & Keywords */}
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-400" />
                  Targeted Hashtags & Search Keywords
                </h4>
                <CopyButton text={analysis.hashtags.join(' ')} label="Copy All Tags" />
              </div>

              <div className="flex flex-wrap gap-2">
                {analysis.hashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-studio-950 border border-purple-500/20 text-purple-300 text-xs font-medium hover:border-purple-500/50 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">Search Keywords (SEO):</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 text-[11px]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Thumbnail / Cover Visual Concept */}
            <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  Thumbnail / Reel Cover Concept
                </h4>
                <CopyButton text={analysis.thumbnailConcept} label="Copy Prompt" />
              </div>
              <div className="p-4 rounded-2xl bg-studio-950 border border-pink-500/20 text-xs text-slate-300 leading-relaxed">
                {analysis.thumbnailConcept}
              </div>
              <p className="text-[11px] text-slate-500">
                Tip: Paste this prompt into our <strong>AI Prompt Generator</strong> or Midjourney / Ideogram for high-CTR cover art.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: POSTING TIME RECOMMENDATION */}
      {step === 'schedule' && recommendation && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-studio-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('options')}
                className="p-2 rounded-xl bg-studio-950 hover:bg-studio-800 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-base font-bold text-slate-200">
                  Recommended Best Posting Time
                </h3>
                <p className="text-xs text-slate-400">
                  Data-backed scheduling window based on studio engagement history and platform habits.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('review')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              Proceed to Final Approval <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Recommendation Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 to-studio-900 border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                    {recommendation.primarySlot.label}
                  </span>
                  <div className="text-2xl font-black text-slate-100 mt-0.5">
                    {scheduledDate} at {scheduledTime} IST
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="bg-studio-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="bg-studio-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Historical Analysis Reasoning */}
            <div className="p-4 rounded-2xl bg-studio-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-purple-300">
                <Info className="w-4 h-4" />
                Why This Time Was Recommended:
              </div>
              <p className="text-slate-300 leading-relaxed">
                {recommendation.reasoning}
              </p>
              <p className="text-[11px] text-slate-500 italic">
                {recommendation.confidenceNote}
              </p>
            </div>

            {/* Alternative Slots */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Alternative Tested Time Slots:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendation.alternativeSlots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setScheduledDate(slot.date);
                      setScheduledTime(slot.time);
                      showToast(`Updated to ${slot.label} (${slot.time})`);
                    }}
                    className="p-3 rounded-2xl bg-studio-950 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300">
                        {slot.label}
                      </span>
                      <span className="text-xs font-mono font-bold text-purple-400">{slot.time} IST</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{slot.reasoning}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: FINAL APPROVAL & DISPATCH SCREEN */}
      {step === 'review' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-studio-900 border border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('schedule')}
                className="p-2 rounded-xl bg-studio-950 hover:bg-studio-800 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-base font-bold text-slate-200">
                  Step 4: Final Approval & Action Dispatch
                </h3>
                <p className="text-xs text-slate-400">
                  Review all prepared metadata and choose how you want to handle this video.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Video Preview & Core Details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                    {platform === 'Instagram Reel' ? <InstagramIcon className="w-3.5 h-3.5" /> : <YoutubeIcon className="w-3.5 h-3.5" />}
                    {platform}
                  </span>
                  <span className="text-xs text-slate-400">Target: {scheduledDate} at {scheduledTime} IST</span>
                </div>

                {/* Local Video Player */}
                {videoUrl ? (
                  <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800 shadow-inner">
                    <video src={videoUrl} controls className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-studio-950 border border-slate-800 aspect-video flex flex-col items-center justify-center text-slate-500 text-xs">
                    <Video className="w-8 h-8 mb-2 opacity-50" />
                    No video file attached (Metadata draft)
                  </div>
                )}

                {/* Selected Title */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Approved Title:</span>
                  <h2 className="text-base font-bold text-slate-100 bg-studio-950 p-3 rounded-xl border border-slate-800">
                    {getActiveTitle()}
                  </h2>
                </div>

                {/* Selected Hook */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block mb-1">Approved 3-Second Hook:</span>
                  <p className="text-xs italic text-pink-300 bg-studio-950 p-3 rounded-xl border border-slate-800">
                    "{getActiveHook()}"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Caption, Tags, & 5 Action Buttons */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
                {/* Caption & CTA */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Approved Caption & CTA:</span>
                    <CopyButton text={`${getActiveCaption()}\n\n${getActiveCta()}\n\n${(analysis?.hashtags || []).join(' ')}`} label="Copy Full Post" />
                  </div>
                  <div className="bg-studio-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2 whitespace-pre-line max-h-48 overflow-y-auto">
                    <p>{getActiveCaption()}</p>
                    <p className="font-semibold text-amber-300">👉 {getActiveCta()}</p>
                    <p className="text-purple-400 font-mono text-[11px]">{(analysis?.hashtags || []).join(' ')}</p>
                  </div>
                </div>

                {/* Scheduled Time Banner */}
                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Calendar className="w-4 h-4" />
                    <span>Scheduled Window: <strong>{scheduledDate} @ {scheduledTime} IST</strong></span>
                  </div>
                  <button
                    onClick={() => setStep('schedule')}
                    className="text-purple-400 hover:text-purple-200 underline text-[11px]"
                  >
                    Change Time
                  </button>
                </div>

                {/* THE 5 MANDATORY ACTIONS */}
                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Approve & Dispatch Actions:
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Action 1: Edit */}
                    <button
                      onClick={() => setStep('options')}
                      className="py-3 px-4 rounded-xl bg-studio-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit3 className="w-4 h-4 text-purple-400" />
                      Edit Options
                    </button>

                    {/* Action 2: Save Draft */}
                    <button
                      onClick={handleSaveDraft}
                      className="py-3 px-4 rounded-xl bg-studio-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Save className="w-4 h-4 text-cyan-400" />
                      Save Draft
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Action 3: Schedule */}
                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Post
                    </button>

                    {/* Action 4: Publish Now */}
                    <button
                      onClick={() => setShowPublishModal(true)}
                      className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      Publish Now
                    </button>
                  </div>

                  {/* Action 5: Cancel */}
                  <button
                    onClick={handleReset}
                    className="w-full py-2 rounded-xl text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel & Discard Auto-Pilot
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: SCHEDULE */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Confirm Scheduling"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              This will add the post to your <strong>Content Calendar</strong> for automated reminder & status tracking.
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-studio-950 border border-slate-800 space-y-2">
            <div>
              <span className="text-slate-500 block">Title:</span>
              <p className="font-bold text-slate-200">{getActiveTitle()}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block">Platform:</span>
                <span className="font-semibold text-slate-300">{platform}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Scheduled Time:</span>
                <span className="font-semibold text-purple-400">{scheduledDate} @ {scheduledTime} IST</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="px-4 py-2 rounded-xl bg-studio-950 hover:bg-studio-800 text-slate-300 font-semibold text-xs"
            >
              Back
            </button>
            <button
              onClick={handleConfirmSchedule}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <Check className="w-4 h-4" />
              Confirm Schedule
            </button>
          </div>
        </div>
      </Modal>

      {/* CONFIRMATION MODAL: PUBLISH NOW */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Confirm Instant Publishing"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Platform Broadcast Notice:</strong> You are approving immediate broadcast to <strong>{platform}</strong>.
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-studio-950 border border-slate-800 space-y-2">
            <div>
              <span className="text-slate-500 block">Title:</span>
              <p className="font-bold text-slate-200">{getActiveTitle()}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block">Target Channel:</span>
                <span className="font-semibold text-slate-300">{activeBrand.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Platform Mode:</span>
                <span className="font-semibold text-emerald-400">Sandbox / Official API</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Publishing will register this release in your Content Calendar and initiate baseline metrics in Creator Analytics.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setShowPublishModal(false)}
              className="px-4 py-2 rounded-xl bg-studio-950 hover:bg-studio-800 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPublish}
              disabled={publishInProgress}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              {publishInProgress ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Broadcasting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Yes, Publish Now
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
