// src/components/dashboard/DashboardOverview.tsx
import React from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  Lightbulb,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Plus,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Film,
  Zap,
  Mic,
  Video
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const DashboardOverview: React.FC = () => {
  const {
    activeBrand,
    ideas,
    scripts,
    projects,
    calendarItems,
    setActiveTab,
    quickCreateScriptForTopic
  } = useStudio();

  // Metrics calculations
  const totalIdeas = ideas.length;
  const totalScripts = scripts.length;
  const videosPlanned = projects.filter(p => p.status !== 'Published').length;
  const publishedVideos = projects.filter(p => p.status === 'Published').length;
  const draftVideos = projects.filter(p => p.status === 'Idea' || p.status === 'Script Ready' || p.status === 'Editing').length;

  // Upcoming scheduled posts
  const upcomingPosts = [...calendarItems]
    .sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
    .slice(0, 4);

  // Recent projects
  const recentProjects = [...projects].slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-studio-900/90 to-indigo-950/70 border border-purple-500/20 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeBrand.name} Creator Workspace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to create something viral, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{activeBrand.creatorName}</span>?
            </h2>
            <p className="text-sm text-slate-300">
              {activeBrand.bio || 'Plan your content, script your next reel in Hinglish or Hindi, and organize your entire production pipeline.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('videostudio')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                <Film className="w-4 h-4" />
                <span>🎬 AI Video Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('autopilot')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/80 text-purple-200 border border-purple-700/50 text-xs font-bold shadow-sm transition-all"
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span>AI Auto-Pilot</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('assistant')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Copilot</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scripts')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Write New Script</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ideas')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Generate Ideas</span>
              </button>
            </div>
          </div>

          {/* Creator Profile Spotlight Card */}
          <div className="shrink-0 relative group self-center lg:self-auto">
            <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 shadow-2xl shadow-purple-600/40">
              <div className="w-32 h-44 sm:w-36 sm:h-48 rounded-[22px] overflow-hidden bg-studio-950 relative">
                <img
                  src="/nikhil.jpg"
                  alt="Nikhil - Creator"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                <div className="absolute bottom-2 left-2 right-2 text-center space-y-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-studio-950/90 border border-purple-500/40 text-[10px] font-bold text-slate-100 shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Creator
                  </span>
                  <p className="text-[10px] text-purple-300 font-semibold truncate">
                    {activeBrand.creatorName}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full bg-studio-950/95 border border-amber-500/30 text-[9px] font-medium text-amber-300 shadow-lg">
              ज़िंदगी एक सफ़र है सुहाना ✨
            </div>
          </div>
        </div>

        {/* Decorative subtle background accents */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-60 h-60 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Saved Ideas</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100">{totalIdeas}</p>
          <p className="text-[11px] text-slate-400">In your bank</p>
        </div>

        <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Scripts Created</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100">{totalScripts}</p>
          <p className="text-[11px] text-slate-400">Scene-by-scene</p>
        </div>

        <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Videos Planned</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100">{videosPlanned}</p>
          <p className="text-[11px] text-slate-400">Active pipeline</p>
        </div>

        <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Draft Videos</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-100">{draftVideos}</p>
          <p className="text-[11px] text-slate-400">In production</p>
        </div>

        <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800/80 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Published</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">{publishedVideos}</p>
          <p className="text-[11px] text-slate-400">Live on channels</p>
        </div>
      </div>

      {/* Quick Action Buttons Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Quick Creator Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('ideas')}
            className="p-3.5 rounded-2xl bg-studio-900/80 hover:bg-studio-800 border border-slate-800 hover:border-amber-500/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-2 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-200">Reel / Shorts Ideas</p>
            <p className="text-[11px] text-slate-400">Filter by niche & language</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scripts')}
            className="p-3.5 rounded-2xl bg-studio-900/80 hover:bg-studio-800 border border-slate-800 hover:border-purple-500/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-200">Scene Breakdown</p>
            <p className="text-[11px] text-slate-400">Full voiceover & visuals</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('titles')}
            className="p-3.5 rounded-2xl bg-studio-900/80 hover:bg-studio-800 border border-slate-800 hover:border-pink-500/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 w-fit mb-2 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-200">Titles & Hashtags</p>
            <p className="text-[11px] text-slate-400">High-CTR suggestions</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className="p-3.5 rounded-2xl bg-studio-900/80 hover:bg-studio-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-2 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-200">Pre-Publish QA</p>
            <p className="text-[11px] text-slate-400">10-point checklist</p>
          </button>
        </div>
      </div>

      {/* Two Column Grid: Upcoming Schedule & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Calendar Glance */}
        <div className="p-5 rounded-3xl bg-studio-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-100">Content Schedule</h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingPosts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No upcoming content scheduled. Click below to add a post to your calendar!
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingPosts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-studio-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge type="platform" value={item.platform} />
                      <span className="text-[11px] text-slate-400">{item.publishDate} {item.publishTime && `• ${item.publishTime}`}</span>
                    </div>
                  </div>
                  <Badge type="status" value={item.status} />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className="w-full py-2.5 rounded-xl bg-studio-950 hover:bg-studio-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            <span>Schedule New Post</span>
          </button>
        </div>

        {/* Recent Video Projects */}
        <div className="p-5 rounded-3xl bg-studio-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-bold text-slate-100">Recent Projects</h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No video projects tracked yet. Start planning your next video!
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentProjects.map((proj) => {
                const totalChecks = Object.keys(proj.checklist || {}).length || 10;
                const doneChecks = Object.values(proj.checklist || {}).filter(Boolean).length;
                const percentage = Math.round((doneChecks / totalChecks) * 100);

                return (
                  <div
                    key={proj.id}
                    onClick={() => setActiveTab('projects')}
                    className="cursor-pointer flex items-center justify-between p-3 rounded-2xl bg-studio-950 border border-slate-800/80 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-semibold text-slate-200 truncate">{proj.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge type="platform" value={proj.platform} />
                        <span className="text-[11px] text-slate-400">Checklist: {percentage}%</span>
                      </div>
                    </div>
                    <Badge type="status" value={proj.status} />
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className="w-full py-2.5 rounded-xl bg-studio-950 hover:bg-studio-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-pink-400" />
            <span>Create New Video Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
