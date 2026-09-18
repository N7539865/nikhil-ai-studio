// src/types/index.ts

export type Platform = 'Instagram Reel' | 'Instagram Reels' | 'YouTube Short' | 'YouTube Shorts' | 'YouTube Long Video' | 'YouTube' | 'Post' | 'Story' | 'Instagram Post';
export type Language = 'hindi' | 'hinglish' | 'english';
export type ContentStatus = 'Idea' | 'Script Ready' | 'Recording' | 'Editing' | 'Ready' | 'Published';

export interface Brand {
  id: string;
  name: string;
  creatorName: string;
  handleYt?: string;
  handleInsta?: string;
  handleGithub?: string;
  niches: string;
  preferredLanguage: Language;
  preferredStyle: string;
  defaultCta: string;
  bio: string;
  color: string;
}

export interface ContentIdea {
  id: string;
  brandId: string;
  title: string;
  hook: string;
  concept: string;
  suggestedShots: string[];
  cta: string;
  caption: string;
  hashtags: string[];
  platform: Platform;
  niche: string;
  category: string;
  language: Language;
  duration: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface ScriptScene {
  sceneNumber: number;
  timestamp: string;
  visualCues: string;
  dialogue: string;
  onScreenText: string;
  sfx: string;
}

export interface Script {
  id: string;
  brandId: string;
  topic: string;
  platform: Platform;
  duration: string;
  language: Language;
  tone: string;
  hook: string;
  scenes: ScriptScene[];
  fullText: string;
  cta: string;
  isFavorite?: boolean;
  createdAt: string;
}

export interface TitleHashtagSet {
  id: string;
  brandId: string;
  topic: string;
  platform: Platform;
  youtubeTitles: string[];
  shortsTitles: string[];
  captions: string[];
  hashtags: string[];
  keywords: string[];
  ctaSuggestions: string[];
  createdAt: string;
}

export interface ContentItem {
  id: string;
  brandId: string;
  title: string;
  platform: Platform;
  status: ContentStatus;
  publishDate: string; // YYYY-MM-DD
  publishTime?: string;
  notes?: string;
  projectId?: string;
}

export interface VideoProject {
  id: string;
  brandId: string;
  name: string;
  platform: Platform;
  status: ContentStatus;
  topic: string;
  script?: string;
  caption?: string;
  hashtags?: string;
  notes?: string;
  thumbnailConcept?: string;
  uploadDate?: string;
  videoFileRef?: string;
  checklist: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEntry {
  id: string;
  brandId: string;
  date: string;
  platform: Platform;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  subscribersGained: number;
  notes?: string;
  contentName?: string;
  productCourse?: string;
  orders?: number;
  revenue?: number;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  platform?: Platform;
  language?: Language;
  isSaved?: boolean;
}

export interface AiPromptTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  style: string;
  recommendedTool: string;
}

export interface AutoPilotAnalysisResult {
  topic: string;
  category: string;
  titleOptions: string[];
  hookOptions: string[];
  description: string;
  captionOptions: string[];
  ctaOptions: string[];
  hashtags: string[];
  keywords: string[];
  thumbnailConcept: string;
  recommendedPostDate: string;
  recommendedPostTime: string;
  postingTimeReasoning: string;
  confidenceNote: string;
}

export interface AutoPilotDraft {
  brandId: string;
  videoUrl?: string;
  videoFileName: string;
  videoDuration?: number;
  videoSize?: string;
  platform: Platform;
  context: string;
  category: string;
  language: Language;
  analysis?: AutoPilotAnalysisResult;
  selectedTitle: string;
  selectedHook: string;
  selectedCaption: string;
  selectedCta: string;
  description: string;
  hashtags: string[];
  keywords: string[];
  scheduledDate: string;
  scheduledTime: string;
}

export interface AutoPilotPlanScene {
  sceneNumber: number;
  timestamp: string;
  visualCues: string;
  dialogue: string;
  onScreenText: string;
  sfx?: string;
}

export interface AutoPilotPlanItem {
  id: string;
  brandId: string;
  topic: string;
  concept: string;
  hook: string;
  category: string;
  platform: Platform;
  duration: string;
  language: Language;
  status: ContentStatus;
  
  // Full Script info
  scriptText: string;
  scenes: AutoPilotPlanScene[];
  voiceover: string;
  onScreenText: string;
  
  // Content Package Metadata
  titleOptions: string[];
  selectedTitle: string;
  caption: string;
  hashtags: string[];
  cta: string;
  thumbnailIdea: string;
  
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
}

export interface AutoPilotConfig {
  platform: Platform;
  category: string;
  language: Language;
  itemCount: 5 | 10 | 20;
  frequency: 'Daily' | '3x/wk' | '5x/wk' | 'Weekly';
  duration: '15s' | '30s' | '60s' | '1–5 min' | 'Long video';
  customTopic?: string;
}

export interface ArtBusinessStats {
  totalCourses: number;
  students: number;
  digitalProducts: number;
  completedOrders: number;
  baseOrders: number;
  baseRevenue: number;
}

// AI Video Studio Types
export type VideoAspectRatio = '9:16' | '16:9' | '1:1';
export type VideoDuration = 5 | 8 | 10 | 15;
export type VideoResolution = '720p' | '1080p' | '4K';
export type VideoStyle = 
  | 'Realistic'
  | 'Cinematic'
  | 'Animated'
  | '3D'
  | 'Art'
  | 'Product'
  | 'Documentary'
  | 'Fantasy';

export type VideoCamera = 
  | 'Static'
  | 'Close-up'
  | 'Wide shot'
  | 'Tracking'
  | 'Dolly'
  | 'Pan'
  | 'Tilt'
  | 'Handheld'
  | 'Cinematic';

export type VideoTransition = 
  | 'Cut'
  | 'Cross Dissolve'
  | 'Fade to Black'
  | 'Fade to White'
  | 'Whip Pan'
  | 'Zoom In';

export interface VideoStudioScene {
  id: string;
  sceneNumber: number;
  title: string;
  prompt: string;
  duration: number; // in seconds
  referenceImage?: string;
  camera: VideoCamera;
  transition: VideoTransition;
}

export interface VideoStudioSettings {
  aspectRatio: VideoAspectRatio;
  duration: VideoDuration;
  resolution: VideoResolution;
  style: VideoStyle;
  camera: VideoCamera;
}

export interface AiGeneratedVideo {
  id: string;
  brandId: string;
  title: string;
  prompt: string;
  enhancedPrompt?: string;
  referenceImage?: string;
  settings: VideoStudioSettings;
  scenes: VideoStudioScene[];
  totalDuration: number;
  status: 'generating' | 'ready' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  isSaved: boolean;
  createdAt: string;
}

