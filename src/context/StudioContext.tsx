// src/context/StudioContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Brand, ContentIdea, Script, ContentItem, VideoProject, AnalyticsEntry, AutoPilotPlanItem, ArtBusinessStats, AiGeneratedVideo } from '../types';
import { StorageService } from '../services/storageService';
import { AiService } from '../services/aiService';

interface StudioContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  brands: Brand[];
  activeBrand: Brand;
  setActiveBrandId: (id: string) => void;
  updateBrand: (brand: Brand) => void;
  addNewBrand: (brand: Brand) => void;
  deleteBrand: (id: string) => void;

  // Active view
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data for active brand
  ideas: ContentIdea[];
  saveIdea: (idea: ContentIdea) => void;
  deleteIdea: (id: string) => void;
  toggleFavoriteIdea: (id: string) => void;

  scripts: Script[];
  saveScript: (script: Script) => void;
  deleteScript: (id: string) => void;

  projects: VideoProject[];
  saveProject: (project: VideoProject) => void;
  deleteProject: (id: string) => void;

  calendarItems: ContentItem[];
  saveCalendarItem: (item: ContentItem) => void;
  deleteCalendarItem: (id: string) => void;

  analytics: AnalyticsEntry[];
  saveAnalyticsEntry: (entry: AnalyticsEntry) => void;
  deleteAnalyticsEntry: (id: string) => void;

  // Auto-Pilot Plan & Content Workflow
  autoPilotPlans: AutoPilotPlanItem[];
  saveAutoPilotPlanItem: (item: AutoPilotPlanItem) => void;
  saveAutoPilotPlanItems: (items: AutoPilotPlanItem[]) => void;
  deleteAutoPilotPlanItem: (id: string) => void;
  clearAutoPilotPlan: () => void;

  // Art Business Metrics
  artBusinessStats: ArtBusinessStats;
  updateArtBusinessStats: (stats: ArtBusinessStats) => void;

  // AI Video Studio
  videoHistory: AiGeneratedVideo[];
  savedVideos: AiGeneratedVideo[];
  saveGeneratedVideo: (video: AiGeneratedVideo) => void;
  deleteGeneratedVideo: (id: string) => void;
  toggleSaveVideo: (id: string) => void;

  // Server & AI status
  serverStatus: { activeProvider: string; hasGeminiKey: boolean; hasOpenAIKey: boolean; status: string };
  checkServerStatus: () => Promise<void>;

  // Toast / notification
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Quick Action helpers
  quickCreateScriptForTopic: (topic: string) => void;
  quickDraftTopic: string;
  setQuickDraftTopic: (topic: string) => void;
  
  refreshAllData: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('nikhil_studio_theme') as 'dark' | 'light') || 'dark';
  });

  // Apply theme class to <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('nikhil_studio_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Brands
  const [brands, setBrands] = useState<Brand[]>(() => StorageService.getBrands());
  const [activeBrandId, setActiveBrandIdState] = useState<string>(() => StorageService.getActiveBrandId());
  
  const activeBrand = brands.find(b => b.id === activeBrandId) || brands[0] || {
    id: 'brand_personal',
    name: 'Personal Creator',
    creatorName: 'Nikhil',
    niches: 'Tech & Digital Creation',
    preferredLanguage: 'hinglish',
    preferredStyle: 'Energetic & Practical',
    defaultCta: 'Follow for more!',
    bio: 'Digital creator',
    color: '#8b5cf6'
  };

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [quickDraftTopic, setQuickDraftTopic] = useState<string>('');

  // Data Collections
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [calendarItems, setCalendarItems] = useState<ContentItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsEntry[]>([]);
  const [autoPilotPlans, setAutoPilotPlans] = useState<AutoPilotPlanItem[]>([]);
  const [artBusinessStats, setArtBusinessStats] = useState<ArtBusinessStats>(() => StorageService.getArtBusinessStats(activeBrandId));
  const [videoHistory, setVideoHistory] = useState<AiGeneratedVideo[]>(() => StorageService.getVideoStudioHistory(activeBrandId));

  // Server Status
  const [serverStatus, setServerStatus] = useState({
    activeProvider: 'mock',
    hasGeminiKey: false,
    hasOpenAIKey: false,
    status: 'checking'
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  const loadBrandData = useCallback((bId: string) => {
    setIdeas(StorageService.getIdeas(bId));
    setScripts(StorageService.getScripts(bId));
    setProjects(StorageService.getProjects(bId));
    setCalendarItems(StorageService.getCalendarItems(bId));
    setAnalytics(StorageService.getAnalytics(bId));
    setAutoPilotPlans(StorageService.getAutoPilotPlans(bId));
    setArtBusinessStats(StorageService.getArtBusinessStats(bId));
    setVideoHistory(StorageService.getVideoStudioHistory(bId));
  }, []);

  useEffect(() => {
    loadBrandData(activeBrand.id);
  }, [activeBrand.id, loadBrandData]);

  const checkServerStatus = useCallback(async () => {
    const status = await AiService.checkStatus();
    setServerStatus(status);
  }, []);

  useEffect(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  const setActiveBrandId = (id: string) => {
    setActiveBrandIdState(id);
    StorageService.setActiveBrandId(id);
    loadBrandData(id);
    showToast(`Switched brand to: ${brands.find(b => b.id === id)?.name || id}`, 'info');
  };

  const updateBrand = (updated: Brand) => {
    const newBrands = StorageService.saveBrand(updated);
    setBrands(newBrands);
    showToast('Brand settings updated successfully!');
  };

  const addNewBrand = (newBrand: Brand) => {
    const newBrands = StorageService.saveBrand(newBrand);
    setBrands(newBrands);
    setActiveBrandId(newBrand.id);
    showToast(`Created brand: ${newBrand.name}!`, 'success');
  };

  const deleteBrand = (id: string) => {
    if (brands.length <= 1) {
      showToast('Cannot delete the only remaining brand.', 'error');
      return;
    }
    const updated = StorageService.deleteBrand(id);
    setBrands(updated);
    setActiveBrandId(updated[0].id);
    showToast('Brand deleted.');
  };

  // Idea actions
  const saveIdea = (idea: ContentIdea) => {
    StorageService.saveIdea(idea);
    setIdeas(StorageService.getIdeas(activeBrand.id));
    showToast('Idea saved to library!');
  };

  const deleteIdea = (id: string) => {
    StorageService.deleteIdea(id);
    setIdeas(StorageService.getIdeas(activeBrand.id));
    showToast('Idea removed.');
  };

  const toggleFavoriteIdea = (id: string) => {
    StorageService.toggleFavoriteIdea(id);
    setIdeas(StorageService.getIdeas(activeBrand.id));
  };

  // Script actions
  const saveScript = (script: Script) => {
    StorageService.saveScript(script);
    setScripts(StorageService.getScripts(activeBrand.id));
    showToast('Script saved to studio library!');
  };

  const deleteScript = (id: string) => {
    StorageService.deleteScript(id);
    setScripts(StorageService.getScripts(activeBrand.id));
    showToast('Script deleted.');
  };

  // Project actions
  const saveProject = (project: VideoProject) => {
    StorageService.saveProject(project);
    setProjects(StorageService.getProjects(activeBrand.id));
    showToast('Project updated.');
  };

  const deleteProject = (id: string) => {
    StorageService.deleteProject(id);
    setProjects(StorageService.getProjects(activeBrand.id));
    showToast('Project deleted.');
  };

  // Calendar actions
  const saveCalendarItem = (item: ContentItem) => {
    StorageService.saveCalendarItem(item);
    setCalendarItems(StorageService.getCalendarItems(activeBrand.id));
    showToast('Calendar item saved!');
  };

  const deleteCalendarItem = (id: string) => {
    StorageService.deleteCalendarItem(id);
    setCalendarItems(StorageService.getCalendarItems(activeBrand.id));
    showToast('Event removed from calendar.');
  };

  // Analytics actions
  const saveAnalyticsEntry = (entry: AnalyticsEntry) => {
    StorageService.saveAnalyticsEntry(entry);
    setAnalytics(StorageService.getAnalytics(activeBrand.id));
    showToast('Analytics entry logged!');
  };

  const deleteAnalyticsEntry = (id: string) => {
    StorageService.deleteAnalyticsEntry(id);
    setAnalytics(StorageService.getAnalytics(activeBrand.id));
    showToast('Entry removed.');
  };

  // Auto-Pilot Plan actions
  const saveAutoPilotPlanItem = (item: AutoPilotPlanItem) => {
    StorageService.saveAutoPilotPlanItem(item);
    setAutoPilotPlans(StorageService.getAutoPilotPlans(activeBrand.id));
    showToast('Auto-Pilot card updated!');
  };

  const saveAutoPilotPlanItems = (items: AutoPilotPlanItem[]) => {
    StorageService.saveAutoPilotPlanItems(items);
    setAutoPilotPlans(StorageService.getAutoPilotPlans(activeBrand.id));
    showToast(`Generated ${items.length} content plans for your pipeline!`, 'success');
  };

  const deleteAutoPilotPlanItem = (id: string) => {
    StorageService.deleteAutoPilotPlanItem(id);
    setAutoPilotPlans(StorageService.getAutoPilotPlans(activeBrand.id));
    showToast('Item removed from plan.');
  };

  const clearAutoPilotPlan = () => {
    StorageService.clearAutoPilotPlan(activeBrand.id);
    setAutoPilotPlans([]);
    showToast('Auto-Pilot plan cleared.');
  };

  const updateArtBusinessStats = (stats: ArtBusinessStats) => {
    StorageService.saveArtBusinessStats(activeBrand.id, stats);
    setArtBusinessStats(stats);
    showToast('Art business metrics updated!');
  };

  // Video Studio actions
  const saveGeneratedVideo = (video: AiGeneratedVideo) => {
    StorageService.saveSavedVideo(activeBrand.id, video);
    setVideoHistory(StorageService.getVideoStudioHistory(activeBrand.id));
    showToast('Video saved to studio library!', 'success');
  };

  const deleteGeneratedVideo = (id: string) => {
    const updated = videoHistory.filter(v => v.id !== id);
    StorageService.saveVideoStudioHistory(activeBrand.id, updated);
    setVideoHistory(updated);
    showToast('Video removed.');
  };

  const toggleSaveVideo = (id: string) => {
    const target = videoHistory.find(v => v.id === id);
    if (!target) return;
    if (target.isSaved) {
      StorageService.deleteSavedVideo(activeBrand.id, id);
      showToast('Video removed from saved.');
    } else {
      StorageService.saveSavedVideo(activeBrand.id, { ...target, isSaved: true });
      showToast('Video bookmarked to saved library!', 'success');
    }
    setVideoHistory(StorageService.getVideoStudioHistory(activeBrand.id));
  };

  const savedVideos = videoHistory.filter(v => v.isSaved);

  const quickCreateScriptForTopic = (topic: string) => {
    setQuickDraftTopic(topic);
    setActiveTab('scripts');
  };

  const refreshAllData = () => {
    loadBrandData(activeBrand.id);
    setBrands(StorageService.getBrands());
  };

  return (
    <StudioContext.Provider
      value={{
        theme,
        toggleTheme,
        brands,
        activeBrand,
        setActiveBrandId,
        updateBrand,
        addNewBrand,
        deleteBrand,
        activeTab,
        setActiveTab,
        ideas,
        saveIdea,
        deleteIdea,
        toggleFavoriteIdea,
        scripts,
        saveScript,
        deleteScript,
        projects,
        saveProject,
        deleteProject,
        calendarItems,
        saveCalendarItem,
        deleteCalendarItem,
        analytics,
        saveAnalyticsEntry,
        deleteAnalyticsEntry,
        autoPilotPlans,
        saveAutoPilotPlanItem,
        saveAutoPilotPlanItems,
        deleteAutoPilotPlanItem,
        clearAutoPilotPlan,
        artBusinessStats,
        updateArtBusinessStats,
        videoHistory,
        savedVideos,
        saveGeneratedVideo,
        deleteGeneratedVideo,
        toggleSaveVideo,
        serverStatus,
        checkServerStatus,
        toast,
        showToast,
        quickCreateScriptForTopic,
        quickDraftTopic,
        setQuickDraftTopic,
        refreshAllData
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
