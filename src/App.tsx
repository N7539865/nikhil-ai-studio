// src/App.tsx
import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AutoPilotView } from './components/autopilot/AutoPilotView';
import { AiAssistantView } from './components/assistant/AiAssistantView';
import { IdeaGeneratorView } from './components/ideas/IdeaGeneratorView';
import { ScriptGeneratorView } from './components/scripts/ScriptGeneratorView';
import { TitleHashtagView } from './components/titles/TitleHashtagView';
import { ProjectManagerView } from './components/projects/ProjectManagerView';
import { CalendarView } from './components/calendar/CalendarView';
import { UploadChecklistView } from './components/checklist/UploadChecklistView';
import { PromptAssistantView } from './components/prompts/PromptAssistantView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SavedLibraryView } from './components/saved/SavedLibraryView';
import { BrandSettingsView } from './components/settings/BrandSettingsView';
import { AiVideoStudioView } from './components/video/AiVideoStudioView';

const StudioMain: React.FC = () => {
  const { activeTab, toast } = useStudio();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'videostudio':
        return <AiVideoStudioView />;
      case 'autopilot':
        return <AutoPilotView />;
      case 'assistant':
        return <AiAssistantView />;
      case 'ideas':
        return <IdeaGeneratorView />;
      case 'scripts':
        return <ScriptGeneratorView />;
      case 'titles':
        return <TitleHashtagView />;
      case 'projects':
        return <ProjectManagerView />;
      case 'calendar':
        return <CalendarView />;
      case 'checklist':
        return <UploadChecklistView />;
      case 'prompts':
        return <PromptAssistantView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'saved':
        return <SavedLibraryView />;
      case 'settings':
        return <BrandSettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-studio-950 text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Studio Work Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-24 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-300 border-rose-800'
                : toast.type === 'info'
                ? 'bg-purple-950/90 text-purple-300 border-purple-800'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StudioProvider>
      <StudioMain />
    </StudioProvider>
  );
};

export default App;
