// src/components/layout/Header.tsx
import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { Sun, Moon, Bot, Sparkles } from 'lucide-react';
import { BrandSwitcher } from './BrandSwitcher';
import { InstallAppButton } from '../common/InstallAppButton';

export const Header: React.FC = () => {
  const { theme, toggleTheme, activeTab, setActiveTab, activeBrand } = useStudio();

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Studio Command Center';
      case 'assistant': return 'AI Copilot Assistant';
      case 'ideas': return 'Viral Content Ideas';
      case 'scripts': return 'Scene-by-Scene Script Studio';
      case 'titles': return 'High-CTR Titles & Hashtags';
      case 'projects': return 'My Video Projects';
      case 'calendar': return 'Creator Content Calendar';
      case 'checklist': return 'Pre-Publish Checklist';
      case 'prompts': return 'AI Image & Thumbnail Prompts';
      case 'analytics': return 'Creator Performance Analytics';
      case 'saved': return 'Saved Content Library';
      case 'settings': return 'Brand Persona Settings';
      default: return 'Nikhil AI Studio';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-800/80 bg-studio-950/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Mobile brand selector */}
        <div className="md:hidden w-48">
          <BrandSwitcher />
        </div>

        <div className="hidden md:block">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>{getTabTitle(activeTab)}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
              {activeBrand.name}
            </span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {/* PWA Install Button */}
        <InstallAppButton variant="header" />

        {/* Quick AI Assistant Trigger */}
        {activeTab !== 'assistant' && (
          <button
            type="button"
            onClick={() => setActiveTab('assistant')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-studio-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
        </button>

        {/* Creator profile tag */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="relative group cursor-pointer" onClick={() => setActiveTab('settings')}>
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-purple-500/50 hover:ring-purple-400 transition-all shadow-md bg-studio-900">
              <img
                src="/nikhil.jpg"
                alt="Nikhil"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  // Fallback to letter if image error
                  (e.currentTarget.style as any).display = 'none';
                }}
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-studio-950" title="Creator Active" />
          </div>
          <div className="text-left hidden lg:block cursor-pointer" onClick={() => setActiveTab('settings')}>
            <p className="text-xs font-bold text-slate-100 leading-tight flex items-center gap-1">
              <span>{activeBrand.creatorName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
            </p>
            <p className="text-[10px] text-purple-400/90 font-medium">{activeBrand.handleInsta || '@nikhil'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
