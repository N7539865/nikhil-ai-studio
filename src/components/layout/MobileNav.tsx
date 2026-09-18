// src/components/layout/MobileNav.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { InstallAppButton } from '../common/InstallAppButton';
import {
  LayoutDashboard,
  Bot,
  Lightbulb,
  FileText,
  Menu,
  X,
  Hash,
  Film,
  CalendarDays,
  CheckSquare,
  Image as ImageIcon,
  BarChart3,
  Bookmark,
  Settings,
  Zap,
  Clapperboard
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useStudio();
  const [showDrawer, setShowDrawer] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'autopilot', label: 'Auto-Pilot', icon: Zap },
    { id: 'assistant', label: 'AI Chat', icon: Bot },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb },
  ];

  const drawerTabs = [
    { id: 'videostudio', label: 'AI Video Studio', icon: Clapperboard },
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
    <>
      {/* Mobile Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-studio-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Studio Tools</h3>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Install App Button in Mobile Drawer */}
            <InstallAppButton variant="sidebar" />

            <div className="grid grid-cols-2 gap-2.5">
              {drawerTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowDrawer(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'bg-studio-950 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-purple-400" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-studio-950/95 backdrop-blur-md border-t border-slate-800/90 px-3 py-2 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowDrawer(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${
            showDrawer || drawerTabs.some(d => d.id === activeTab) ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  );
};
