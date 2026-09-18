// src/components/autopilot/AutoPilotView.tsx
import React, { useState, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  Platform,
  Language,
  ContentStatus,
  AutoPilotPlanItem,
  AutoPilotConfig,
  VideoProject,
  ContentItem
} from '../../types';
import { AiService } from '../../services/aiService';
import {
  Sparkles,
  Rocket,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  RefreshCw,
  Bookmark,
  CheckCircle2,
  Clock,
  Tag,
  Film,
  ArrowRight,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  FileText,
  Copy,
  Check,
  Video,
  AlertCircle,
  HelpCircle,
  Share2,
  ListOrdered,
  Filter
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from '../common/BrandIcons';
import { CopyButton } from '../common/CopyButton';
import { Modal } from '../common/Modal';
import { VideoUploadOptimizer } from './VideoUploadOptimizer';

const STATUS_STEPS: ContentStatus[] = [
  'Idea',
  'Script Ready',
  'Recording',
  'Editing',
  'Ready',
  'Published'
];

const CATEGORIES = [
  'Drawing',
  'Sketching',
  'Painting',
  'Art Tutorial',
  'Nikhil Arts',
  'Motivation',
  'Gaming',
  'Comedy',
  'AI',
  'Other'
];

export const AutoPilotView: React.FC = () => {
  const {
    activeBrand,
    autoPilotPlans,
    saveAutoPilotPlanItem,
    saveAutoPilotPlanItems,
    deleteAutoPilotPlanItem,
    clearAutoPilotPlan,
    saveProject,
    saveCalendarItem,
    setActiveTab,
    showToast
  } = useStudio();

  // Mode: Workflow Auto-Pilot (default) vs Video Upload Optimizer
  const [activeMode, setActiveMode] = useState<'workflow' | 'upload'>('workflow');

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Setup Modal State
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

  // Form Fields for Setup
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Instagram Reel');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    activeBrand.id === 'brand_arts' ? 'Drawing' : 'Tech & AI'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    activeBrand.preferredLanguage || 'hindi'
  );
  const [itemCount, setItemCount] = useState<5 | 10 | 20>(5);
  const [frequency, setFrequency] = useState<'Daily' | '3x/wk' | '5x/wk' | 'Weekly'>('Daily');
  const [duration, setDuration] = useState<'15s' | '30s' | '60s' | '1–5 min' | 'Long video'>('30s');
  const [customTopic, setCustomTopic] = useState<string>('');

  // Update defaults when activeBrand changes
  useEffect(() => {
    if (activeBrand.id === 'brand_arts') {
      setSelectedCategory('Drawing');
      setSelectedLanguage('hindi');
    } else if (activeBrand.id === 'brand_gaming') {
      setSelectedCategory('Gaming');
      setSelectedLanguage('hinglish');
    } else if (activeBrand.id === 'brand_comedy') {
      setSelectedCategory('Comedy');
      setSelectedLanguage('hindi');
    }
  }, [activeBrand.id]);

  // Modals for Single Cards
  const [viewingItem, setViewingItem] = useState<AutoPilotPlanItem | null>(null);
  const [editingItem, setEditingItem] = useState<AutoPilotPlanItem | null>(null);
  const [schedulingItem, setSchedulingItem] = useState<AutoPilotPlanItem | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('18:30');
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  // Quick Action: Open Setup Form
  const handleOpenSetup = () => {
    setIsSetupOpen(true);
  };

  // Submit Setup & Trigger AI Generation
  const handleStartAutoPilot = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setLoadingStep('Consulting creator blueprint and audience profile...');

    try {
      const config: AutoPilotConfig = {
        platform: selectedPlatform,
        category: selectedCategory,
        language: selectedLanguage,
        itemCount,
        frequency,
        duration,
        customTopic
      };

      setTimeout(() => {
        setLoadingStep('Scripting high-retention hooks and scene breakdowns...');
      }, 900);

      setTimeout(() => {
        setLoadingStep('Generating high-CTR titles, captions, hashtags & cover concepts...');
      }, 1800);

      const generatedItems = await AiService.generateAutoPilotPlan(config, activeBrand);

      if (generatedItems && generatedItems.length > 0) {
        saveAutoPilotPlanItems(generatedItems);
        setIsSetupOpen(false);
        showToast(`🚀 Generated ${generatedItems.length} complete content plans successfully!`, 'success');
      } else {
        showToast('Could not generate items. Please check connection and try again.', 'error');
      }
    } catch (err: any) {
      console.error('AutoPilot generation error:', err);
      showToast('Error generating content plan: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setGenerating(false);
      setLoadingStep('');
    }
  };

  // Status Progression Handler
  const handleAdvanceStatus = (item: AutoPilotPlanItem, targetStatus: ContentStatus) => {
    const updated: AutoPilotPlanItem = {
      ...item,
      status: targetStatus
    };
    saveAutoPilotPlanItem(updated);
    showToast(`Status updated to "${targetStatus}"!`, 'info');
  };

  // Regenerate Single Card
  const handleRegenerateItem = async (item: AutoPilotPlanItem) => {
    setRegeneratingId(item.id);
    try {
      const updated = await AiService.regenerateAutoPilotItem(item, activeBrand);
      saveAutoPilotPlanItem(updated);
      showToast('Card regenerated with fresh angles!', 'success');
      if (viewingItem && viewingItem.id === item.id) {
        setViewingItem(updated);
      }
    } catch (err) {
      console.error('Regenerate error:', err);
      showToast('Failed to regenerate card.', 'error');
    } finally {
      setRegeneratingId(null);
    }
  };

  // Save Complete Card to Studio Projects
  const handleSaveToProjects = (item: AutoPilotPlanItem) => {
    const newProject: VideoProject = {
      id: 'proj_' + Date.now(),
      brandId: activeBrand.id,
      name: item.selectedTitle || item.topic,
      platform: item.platform,
      status: item.status,
      topic: item.topic,
      script: item.scriptText,
      caption: item.caption,
      hashtags: item.hashtags.join(' '),
      notes: `Hook: ${item.hook}\nCTA: ${item.cta}`,
      thumbnailConcept: item.thumbnailIdea,
      checklist: {
        video_edited: item.status === 'Ready' || item.status === 'Published',
        thumbnail_ready: item.status === 'Ready' || item.status === 'Published',
        title_added: true,
        description_added: true,
        hashtags_added: true,
        keywords_added: true,
        caption_added: true,
        cta_added: true,
        video_reviewed: item.status === 'Published',
        ready_to_publish: item.status === 'Ready' || item.status === 'Published'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveProject(newProject);
    showToast(`Saved "${item.selectedTitle.slice(0, 30)}..." to My Videos & Projects!`, 'success');
  };

  // Open Schedule Modal
  const handleOpenSchedule = (item: AutoPilotPlanItem) => {
    setSchedulingItem(item);
    setScheduleDate(item.scheduledDate || new Date().toISOString().split('T')[0]);
    setScheduleTime(item.scheduledTime || '18:30');
  };

  // Confirm Schedule into Calendar
  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingItem) return;

    const calendarItem: ContentItem = {
      id: 'cal_' + Date.now(),
      brandId: activeBrand.id,
      title: schedulingItem.selectedTitle || schedulingItem.topic,
      platform: schedulingItem.platform,
      status: schedulingItem.status === 'Idea' ? 'Script Ready' : schedulingItem.status,
      publishDate: scheduleDate,
      publishTime: scheduleTime,
      notes: `Category: ${schedulingItem.category} | Hook: ${schedulingItem.hook}`
    };

    saveCalendarItem(calendarItem);

    // Also update the card's scheduledDate and status
    const updatedCard: AutoPilotPlanItem = {
      ...schedulingItem,
      scheduledDate: scheduleDate,
      scheduledTime: scheduleTime,
      status: schedulingItem.status === 'Idea' ? 'Script Ready' : schedulingItem.status
    };
    saveAutoPilotPlanItem(updatedCard);

    showToast(`Scheduled for ${scheduleDate} at ${scheduleTime} in Content Calendar!`, 'success');
    setSchedulingItem(null);
  };

  // Filter items
  const brandPlans = autoPilotPlans.filter(p => p.brandId === activeBrand.id);
  const filteredPlans = brandPlans.filter(item => {
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.selectedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hook.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count by status
  const getStatusCount = (status: string) => {
    if (status === 'all') return brandPlans.length;
    return brandPlans.filter(p => p.status.toLowerCase() === status.toLowerCase()).length;
  };

  if (activeMode === 'upload') {
    return (
      <div className="space-y-6 pb-12">
        {/* Mode Switch Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-studio-900/90 border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Auto-Pilot Mode:</span>
            <div className="inline-flex rounded-xl bg-studio-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveMode('workflow')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-all flex items-center gap-1.5"
              >
                <Rocket className="w-3.5 h-3.5 text-purple-400" />
                <span>Content Workflow Auto-Pilot</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('upload')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white shadow-sm flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Upload Optimizer</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Brand: <span className="text-purple-300 font-semibold">{activeBrand.name}</span>
          </p>
        </div>

        {/* Existing Video Upload Optimizer */}
        <VideoUploadOptimizer />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Mode Bar */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-purple-300 uppercase tracking-wider">
              Autonomous Creator Engine
            </span>
            <span className="text-xs text-slate-400">• Brand: <span className="font-semibold text-slate-200">{activeBrand.name}</span></span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
            <span>🤖 AI Content Auto-Pilot</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Autonomous pipeline: <span className="text-purple-300 font-mono">IDEA → SCRIPT → TITLE → CAPTION → HASHTAGS → CONTENT PLAN → SCHEDULE</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Switch to Video Upload */}
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className="px-3.5 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-300 hover:text-purple-300 hover:border-purple-500/40 transition-all flex items-center gap-2"
            title="Switch to single video file analysis"
          >
            <Video className="w-4 h-4 text-purple-400" />
            <span>Upload Video Optimizer</span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleOpenSetup}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white font-bold text-xs shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5"
          >
            <Rocket className="w-4 h-4" />
            <span className="text-sm">🚀 Start Auto-Pilot</span>
          </button>
        </div>
      </div>

      {/* Visual Workflow Pipeline Banner */}
      <div className="p-4 rounded-2xl bg-studio-950/90 border border-slate-800/80 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] text-xs font-semibold text-slate-400 px-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">1</span>
            <span>IDEA</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center gap-2 text-pink-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px]">2</span>
            <span>SCRIPT</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
            <span>TITLE</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">4</span>
            <span>CAPTION</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">5</span>
            <span>HASHTAGS</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">6</span>
            <span>CONTENT PLAN</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">7</span>
            <span>SCHEDULE</span>
          </div>
        </div>
      </div>

      {/* Auto-Pilot Dashboard Hub Shortcuts */}
      <div className="p-5 rounded-3xl bg-studio-900/90 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Studio Workflow Shortcuts</span>
          </h2>
          <span className="text-[11px] text-slate-400">1-click navigation across creative modules</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          <button
            type="button"
            onClick={handleOpenSetup}
            className="p-3 rounded-2xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <Rocket className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-slate-200 leading-tight">Create Content Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ideas')}
            className="p-3 rounded-2xl bg-studio-950 hover:bg-studio-800/80 border border-slate-800 text-slate-300 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200 leading-tight">Generate Ideas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scripts')}
            className="p-3 rounded-2xl bg-studio-950 hover:bg-studio-800/80 border border-slate-800 text-slate-300 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <Film className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200 leading-tight">Generate Scripts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('titles')}
            className="p-3 rounded-2xl bg-studio-950 hover:bg-studio-800/80 border border-slate-800 text-slate-300 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200 leading-tight">Generate Titles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('titles')}
            className="p-3 rounded-2xl bg-studio-950 hover:bg-studio-800/80 border border-slate-800 text-slate-300 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <Tag className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200 leading-tight">Generate Captions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('titles')}
            className="p-3 rounded-2xl bg-studio-950 hover:bg-studio-800/80 border border-slate-800 text-slate-300 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <Share2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200 leading-tight">Generate Hashtags</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className="p-3 rounded-2xl bg-studio-950 hover:bg-studio-800/80 border border-slate-800 text-slate-300 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <Calendar className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200 leading-tight">Content Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className="p-3 rounded-2xl bg-studio-950 hover:bg-studio-800/80 border border-slate-800 text-slate-300 flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
          >
            <Bookmark className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-slate-200 leading-tight">Saved Content</span>
          </button>
        </div>
      </div>

      {/* Filter and Status Progression Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-studio-900/90 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>Content Status:</span>
          </span>
          {['all', 'Idea', 'Script Ready', 'Recording', 'Editing', 'Ready', 'Published'].map((st) => {
            const count = getStatusCount(st);
            const active = statusFilter.toLowerCase() === st.toLowerCase();
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-studio-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st === 'all' ? 'All Content' : st}
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-purple-800 text-purple-200' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plan items..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {brandPlans.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Clear all auto-pilot cards for this brand? You can regenerate a new batch anytime.')) {
                  clearAutoPilotPlan();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-studio-950 border border-slate-800 transition-colors"
              title="Clear plan cards"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Auto-Pilot Content Cards Grid */}
      {filteredPlans.length === 0 ? (
        <div className="p-12 rounded-3xl bg-studio-900/90 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Rocket className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-slate-200">No Auto-Pilot Content Cards Found</h3>
            <p className="text-xs text-slate-400">
              Launch the Auto-Pilot engine to instantly generate full scripts, high-CTR titles, platform-optimized captions, hashtags, and a scheduled content plan.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenSetup}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30 transition-all inline-flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            <span>🚀 Start Auto-Pilot</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPlans.map((item) => {
            const isRegenerating = regeneratingId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-3xl bg-studio-900/90 border border-slate-800 p-5 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-studio-950 border border-slate-800 text-[10px] font-bold text-purple-300 flex items-center gap-1">
                        {item.platform.includes('Instagram') ? (
                          <InstagramIcon className="w-3 h-3 text-pink-400" />
                        ) : (
                          <YoutubeIcon className="w-3 h-3 text-red-500" />
                        )}
                        <span>{item.platform}</span>
                      </span>

                      <span className="px-2 py-1 rounded-lg bg-studio-950 border border-slate-800 text-[10px] font-semibold text-slate-300">
                        {item.category}
                      </span>

                      <span className="px-2 py-1 rounded-lg bg-studio-950 border border-slate-800 text-[10px] font-mono text-slate-400">
                        ⏱️ {item.duration}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      {item.language.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-purple-300 transition-colors">
                    {item.selectedTitle || item.topic}
                  </h3>

                  {/* Hook Box */}
                  <div className="p-3 rounded-2xl bg-studio-950 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>Opening Hook</span>
                    </div>
                    <p className="text-xs text-slate-300 italic line-clamp-2">
                      "{item.hook}"
                    </p>
                  </div>

                  {/* Interactive Status Progression Pipeline */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-semibold uppercase tracking-wider">Workflow Stage:</span>
                      <span className="font-bold text-purple-400">{item.status}</span>
                    </div>

                    <div className="grid grid-cols-6 gap-1 bg-studio-950 p-1 rounded-xl border border-slate-800">
                      {STATUS_STEPS.map((st, idx) => {
                        const currentIdx = STATUS_STEPS.indexOf(item.status);
                        const isReached = currentIdx >= idx;
                        const isCurrent = item.status === st;

                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleAdvanceStatus(item, st)}
                            title={`Mark status as ${st}`}
                            className={`py-1 text-[9px] font-bold rounded-lg transition-all text-center truncate ${
                              isCurrent
                                ? 'bg-purple-600 text-white shadow-sm'
                                : isReached
                                ? 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/80'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                            }`}
                          >
                            {st === 'Script Ready' ? 'Script' : st}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Scenes Breakdown Summary */}
                  {item.scenes && item.scenes.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                        <span>Script Breakdown ({item.scenes.length} scenes)</span>
                        <span className="text-slate-500 font-mono text-[9px]">{item.scheduledDate ? `Post: ${item.scheduledDate}` : ''}</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-300 bg-studio-950/40 p-2.5 rounded-xl border border-slate-800/60">
                        {item.scenes.slice(0, 2).map((sc) => (
                          <div key={sc.sceneNumber} className="truncate">
                            <span className="font-mono text-purple-400 text-[10px] mr-1">[{sc.timestamp}]</span>
                            <span>{sc.dialogue || sc.visualCues}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="grid grid-cols-4 gap-1.5">
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => setViewingItem(item)}
                      className="px-2 py-2 rounded-xl bg-studio-950 hover:bg-studio-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="View full script and metadata"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View</span>
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="px-2 py-2 rounded-xl bg-studio-950 hover:bg-studio-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="Edit card fields"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit</span>
                    </button>

                    {/* Regenerate */}
                    <button
                      type="button"
                      onClick={() => handleRegenerateItem(item)}
                      disabled={isRegenerating}
                      className="px-2 py-2 rounded-xl bg-studio-950 hover:bg-studio-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                      title="Regenerate this specific item"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${isRegenerating ? 'animate-spin' : ''}`} />
                      <span>Rerun</span>
                    </button>

                    {/* Save to Projects */}
                    <button
                      type="button"
                      onClick={() => handleSaveToProjects(item)}
                      className="px-2 py-2 rounded-xl bg-studio-950 hover:bg-studio-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="Save complete package to My Videos & Projects"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-pink-400" />
                      <span>Save</span>
                    </button>
                  </div>

                  {/* Secondary Row: Mark Ready, Add to Calendar, Delete */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {/* Mark Ready Button */}
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(item, 'Ready')}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Mark Ready</span>
                    </button>

                    {/* Add to Calendar */}
                    <button
                      type="button"
                      onClick={() => handleOpenSchedule(item)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Calendar className="w-3 h-3 text-purple-400" />
                      <span>Schedule</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Delete this card from your auto-pilot plan?')) {
                          deleteAutoPilotPlanItem(item.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-studio-950 hover:bg-rose-950/40 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. START AUTO-PILOT SETUP MODAL */}
      <Modal
        isOpen={isSetupOpen}
        onClose={() => !generating && setIsSetupOpen(false)}
        title="🚀 Configure AI Content Auto-Pilot"
        maxWidth="lg"
      >
        <form onSubmit={handleStartAutoPilot} className="space-y-4">
          <p className="text-xs text-slate-400">
            Configure your batch parameters. The AI will autonomously craft high-retention hooks, complete scripts with scene breakdowns, platform-specific titles, captions, hashtags, and suggested schedules based on your brand settings.
          </p>

          {/* Active Brand Information Callout */}
          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-slate-200">Active Brand Persona: {activeBrand.name}</span>
              <p className="text-slate-400">
                Creator: <span className="text-purple-300">{activeBrand.creatorName}</span> • Niche: <span className="text-purple-300">{activeBrand.niches}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Default CTA: <span className="text-slate-300 italic">"{activeBrand.defaultCta}"</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Platform */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Content Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
                disabled={generating}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Instagram Reel">Instagram Reels</option>
                <option value="YouTube Short">YouTube Shorts</option>
                <option value="YouTube Long Video">YouTube (Long Video)</option>
                <option value="Instagram Post">Instagram Posts</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category / Genre</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={generating}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                disabled={generating}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="hindi">Hindi (हिंदी - 100%)</option>
                <option value="hinglish">Hinglish (Natural Creator)</option>
                <option value="english">English (100% Pure)</option>
              </select>
            </div>

            {/* Number of content ideas */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Content Ideas</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    disabled={generating}
                    onClick={() => setItemCount(num as 5 | 10 | 20)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      itemCount === num
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-studio-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {num} Items
                  </button>
                ))}
              </div>
            </div>

            {/* Posting frequency */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Posting Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                disabled={generating}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Daily">Daily (Every 24h)</option>
                <option value="3x/wk">3x / Week</option>
                <option value="5x/wk">5x / Week</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as any)}
                disabled={generating}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="15s">15s (Ultra Fast Reel/Short)</option>
                <option value="30s">30s (Optimal Retention)</option>
                <option value="60s">60s (Deep Breakdown)</option>
                <option value="1–5 min">1–5 min (Medium Form)</option>
                <option value="Long video">Long Video (&gt; 5 min)</option>
              </select>
            </div>

            {/* Optional Custom Topic */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Specific Theme / Keyword <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                disabled={generating}
                placeholder="e.g. Portrait shading, Vintage Car, ASMR"
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Loading status indicator */}
          {generating && (
            <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-800/60 flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-purple-400 animate-spin shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-200">Generating {itemCount} Complete Content Packages...</p>
                <p className="text-[11px] text-purple-300">{loadingStep}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              disabled={generating}
              onClick={() => setIsSetupOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Launch Content Auto-Pilot
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. CARD VIEW MODAL */}
      {viewingItem && (
        <Modal
          isOpen={true}
          onClose={() => setViewingItem(null)}
          title={`Content Package: ${viewingItem.selectedTitle || viewingItem.topic}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            {/* Header Chips */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold">
                {viewingItem.platform}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-studio-950 border border-slate-800 text-slate-300 text-xs">
                {viewingItem.category}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-studio-950 border border-slate-800 text-slate-300 text-xs font-mono">
                ⏱️ {viewingItem.duration}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                Status: {viewingItem.status}
              </span>
            </div>

            {/* Hook */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>Opening Hook (First 3 Seconds)</span>
                <CopyButton text={viewingItem.hook} label="Copy Hook" />
              </div>
              <p className="text-xs text-slate-200 font-medium italic">
                "{viewingItem.hook}"
              </p>
            </div>

            {/* Title Options */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Title Options (Click to select)
              </label>
              <div className="space-y-1.5">
                {viewingItem.titleOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const updated = { ...viewingItem, selectedTitle: opt };
                      setViewingItem(updated);
                      saveAutoPilotPlanItem(updated);
                      showToast('Selected title updated!', 'info');
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      viewingItem.selectedTitle === opt
                        ? 'bg-purple-950/60 border-purple-500 text-white'
                        : 'bg-studio-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {viewingItem.selectedTitle === opt && (
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scene-by-Scene Script Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Scene-by-Scene Script Breakdown
                </label>
                <CopyButton text={viewingItem.scriptText} label="Copy Full Script" />
              </div>

              <div className="space-y-2">
                {viewingItem.scenes.map((scene) => (
                  <div key={scene.sceneNumber} className="p-3 rounded-xl bg-studio-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-purple-400">Scene {scene.sceneNumber}</span>
                      <span className="font-mono text-slate-400">{scene.timestamp}</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="font-semibold text-slate-400">Visual: </span>
                      {scene.visualCues}
                    </div>
                    <div className="text-xs text-slate-200 bg-studio-900/60 p-2 rounded-lg">
                      <span className="font-semibold text-pink-400">Voiceover: </span>
                      "{scene.dialogue}"
                    </div>
                    {scene.onScreenText && (
                      <div className="text-[11px] text-amber-300">
                        <span className="font-semibold text-slate-400">On-Screen: </span>
                        {scene.onScreenText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Caption & Hashtags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Platform Caption</label>
                  <CopyButton text={viewingItem.caption} label="Copy" />
                </div>
                <div className="p-3 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-line max-h-36 overflow-y-auto">
                  {viewingItem.caption}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Hashtags</label>
                  <CopyButton text={viewingItem.hashtags.join(' ')} label="Copy All" />
                </div>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-studio-950 border border-slate-800 max-h-36 overflow-y-auto">
                  {viewingItem.hashtags.map((h, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-studio-900 text-purple-300 text-[11px] font-mono">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Thumbnail Idea & CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-xl bg-studio-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Thumbnail / Cover Concept</span>
                  <CopyButton text={viewingItem.thumbnailIdea} label="Copy" />
                </div>
                <p className="text-xs text-slate-400 italic">
                  {viewingItem.thumbnailIdea}
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-studio-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Call to Action (CTA)</span>
                <p className="text-xs text-slate-200 font-semibold">
                  "{viewingItem.cta}"
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSaveToProjects(viewingItem);
                  }}
                  className="px-4 py-2 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5 text-pink-400" />
                  <span>Save to Projects</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewingItem(null);
                    handleOpenSchedule(viewingItem);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Add to Calendar</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. CARD EDIT MODAL */}
      {editingItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          title="Edit Content Plan Card"
          maxWidth="lg"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveAutoPilotPlanItem(editingItem);
              setEditingItem(null);
              showToast('Card updated successfully!');
            }}
            className="space-y-4 max-h-[75vh] overflow-y-auto pr-1"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Topic</label>
              <input
                type="text"
                required
                value={editingItem.topic}
                onChange={(e) => setEditingItem({ ...editingItem, topic: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Selected Title</label>
              <input
                type="text"
                required
                value={editingItem.selectedTitle}
                onChange={(e) => setEditingItem({ ...editingItem, selectedTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hook</label>
              <textarea
                rows={2}
                value={editingItem.hook}
                onChange={(e) => setEditingItem({ ...editingItem, hook: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Caption</label>
              <textarea
                rows={4}
                value={editingItem.caption}
                onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hashtags (space separated)</label>
              <input
                type="text"
                value={editingItem.hashtags.join(' ')}
                onChange={(e) => setEditingItem({ ...editingItem, hashtags: e.target.value.split(' ').filter(Boolean) })}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Call to Action (CTA)</label>
              <input
                type="text"
                value={editingItem.cta}
                onChange={(e) => setEditingItem({ ...editingItem, cta: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail Concept</label>
              <textarea
                rows={2}
                value={editingItem.thumbnailIdea}
                onChange={(e) => setEditingItem({ ...editingItem, thumbnailIdea: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. SCHEDULE TO CALENDAR MODAL */}
      {schedulingItem && (
        <Modal
          isOpen={true}
          onClose={() => setSchedulingItem(null)}
          title="Add to Content Calendar"
          maxWidth="sm"
        >
          <form onSubmit={handleConfirmSchedule} className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-200">{schedulingItem.selectedTitle || schedulingItem.topic}</p>
              <p className="text-[11px] text-slate-400">Platform: {schedulingItem.platform}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Posting Date</label>
                <input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Posting Time</label>
                <input
                  type="time"
                  required
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] text-slate-300 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                This will automatically add an event to your <strong>Content Calendar</strong> and mark this item as planned.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSchedulingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
              >
                Confirm & Add
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
