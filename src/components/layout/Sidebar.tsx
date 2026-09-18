// src/components/layout/Sidebar.tsx
import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { BrandSwitcher } from './BrandSwitcher';
import { InstallAppButton } from '../common/InstallAppButton';
import {
  LayoutDashboard,
  Bot,
  Lightbulb,
  FileText,
  Hash,
  Film,
  CalendarDays,
  Image as ImageIcon,
  BarChart3,
  CheckSquare,
  Bookmark,
  Settings,
  Sparkles,
  Zap,
  Clapperboard
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeBrand, serverStatus } = useStudio();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'videostudio', label: 'AI Video Studio', icon: Clapperboard, badge: 'Flow' },
    { id: 'autopilot', label: 'AI Auto-Pilot', icon: Zap, badge: 'New' },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'Smart' },
    { id: 'ideas', label: 'Content Ideas', icon: Lightbulb },
    { id: 'scripts', label: 'Script Studio', icon: FileText },
    { id: 'titles', label: 'Titles & Hashtags', icon: Hash },
    { id: 'projects', label: 'Video Projects', icon: Film },
    { id: 'calendar', label: 'Content Calendar', icon: CalendarDays },
    { id: 'checklist', label: 'Upload Checklist', icon: CheckSquare },
    { id: 'prompts', label: 'AI Image Prompts', icon: ImageIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'saved', label: 'Saved Library', icon: Bookmark },
    { id: 'settings', label: 'Brand Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-slate-800/80 bg-studio-950 p-4 shrink-0 overflow-y-auto">
      {/* Studio Header Logo */}
      <div className="flex items-center gap-3 px-2 py-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            Nikhil AI Studio
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Creator Command Center</p>
        </div>
      </div>

      {/* Brand Switcher Widget */}
      <div className="mb-4">
        <BrandSwitcher />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1">
        <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Creator Suite
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-studio-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* PWA App Install Banner */}
      <div className="my-2 shrink-0">
        <InstallAppButton variant="sidebar" />
      </div>

      {/* Creator Profile Spotlight */}
      <div className="mt-auto pt-3 border-t border-slate-800/80">
        <div
          onClick={() => setActiveTab('settings')}
          className="p-2.5 rounded-2xl bg-studio-900/80 hover:bg-studio-850 border border-slate-800/80 hover:border-purple-500/40 transition-all cursor-pointer flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-purple-500/40 group-hover:ring-purple-400 shrink-0 shadow-md bg-studio-950">
            <img
              src="/nikhil.jpg"
              alt="Nikhil"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-studio-950" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-100 truncate group-hover:text-purple-300 transition-colors">
              {activeBrand.creatorName}
            </p>
            <p className="text-[10px] text-purple-400/90 truncate font-medium">
              {activeBrand.handleInsta || '@nikhil.creates'}
            </p>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 uppercase tracking-wider">
            PRO
          </span>
        </div>
      </div>

      {/* Engine Status Card */}
      <div className="mt-2 pt-2 border-t border-slate-800/60">
        <div className="p-2.5 rounded-xl bg-studio-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-[10px] font-semibold text-slate-200">
                {serverStatus.hasGeminiKey ? 'Gemini 1.5/2.5' : (serverStatus.hasOpenAIKey ? 'OpenAI GPT-4' : 'Studio Engine')}
              </p>
              <p className="text-[9px] text-slate-400">
                {serverStatus.hasGeminiKey || serverStatus.hasOpenAIKey ? 'Live AI Connected' : 'Offline / Smart Mode'}
              </p>
            </div>
          </div>
          <Zap className="w-3.5 h-3.5 text-purple-400" />
        </div>
      </div>
    </aside>
  );
};
