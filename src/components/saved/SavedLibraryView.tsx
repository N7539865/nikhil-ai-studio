// src/components/saved/SavedLibraryView.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  Bookmark,
  Search,
  Star,
  Trash2,
  Edit,
  Download,
  Upload,
  FileText,
  Lightbulb,
  Sparkles,
  Bot
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { StorageService } from '../../services/storageService';

export const SavedLibraryView: React.FC = () => {
  const {
    activeBrand,
    ideas,
    scripts,
    deleteIdea,
    toggleFavoriteIdea,
    deleteScript,
    showToast,
    quickCreateScriptForTopic,
    refreshAllData
  } = useStudio();

  const [activeTab, setActiveTab] = useState<'all' | 'ideas' | 'scripts' | 'favorites'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleExportBackup = () => {
    const json = StorageService.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nikhil_AI_Studio_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Complete studio backup exported!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importAllData(content);
      if (success) {
        refreshAllData();
        showToast('Backup restored successfully!', 'success');
      } else {
        showToast('Invalid backup file format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Filtering
  const filteredIdeas = ideas.filter(i => {
    const matchSearch =
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.hook.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.concept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFav = activeTab !== 'favorites' || i.isFavorite;
    return matchSearch && matchFav;
  });

  const filteredScripts = scripts.filter(s => {
    const matchSearch =
      s.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.hook.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fullText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFav = activeTab !== 'favorites' || s.isFavorite;
    return matchSearch && matchFav;
  });

  const totalSavedCount = ideas.length + scripts.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Saved Creator Assets</h2>
            <p className="text-xs text-slate-400">
              Your personal library of ideas, scripts, and prompts for {activeBrand.name} ({totalSavedCount} items)
            </p>
          </div>
        </div>

        {/* Export / Import Backup Tools */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-studio-950 hover:bg-studio-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            title="Download full JSON backup of all brands and content"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-studio-950 hover:bg-studio-800 border border-slate-800 text-xs font-semibold text-slate-200 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-studio-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Items ({totalSavedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ideas')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'ideas' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ideas ({ideas.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scripts')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'scripts' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scripts ({scripts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'favorites' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 text-amber-400" />
            <span>Favorites</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved library..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Grid of Saved Assets */}
      <div className="space-y-6">
        {/* Saved Ideas Section */}
        {(activeTab === 'all' || activeTab === 'ideas' || activeTab === 'favorites') && filteredIdeas.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Saved Ideas ({filteredIdeas.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIdeas.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-studio-900/90 border border-slate-800 hover:border-amber-500/40 space-y-3 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge type="platform" value={item.platform} />
                      <button
                        type="button"
                        onClick={() => toggleFavoriteIdea(item.id)}
                        className="text-slate-400 hover:text-amber-400 transition-colors"
                      >
                        <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                    <p className="text-xs text-slate-300 italic line-clamp-2">"{item.hook}"</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.concept}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => quickCreateScriptForTopic(item.title)}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300"
                    >
                      Script This
                    </button>
                    <div className="flex items-center gap-1.5">
                      <CopyButton text={`Title: ${item.title}\nHook: ${item.hook}\nConcept: ${item.concept}`} />
                      <button
                        type="button"
                        onClick={() => deleteIdea(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Scripts Section */}
        {(activeTab === 'all' || activeTab === 'scripts' || activeTab === 'favorites') && filteredScripts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Saved Scripts ({filteredScripts.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredScripts.map((sc) => (
                <div
                  key={sc.id}
                  className="p-5 rounded-3xl bg-studio-900/90 border border-slate-800 hover:border-purple-500/40 space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <Badge type="platform" value={sc.platform} />
                    <span className="text-[11px] font-mono text-slate-400">{sc.duration}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-100">{sc.topic}</h4>
                  <div className="p-2.5 rounded-xl bg-studio-950 border border-slate-800/80 text-xs text-slate-300 italic">
                    Hook: "{sc.hook}"
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-3 whitespace-pre-wrap">{sc.fullText}</p>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Scenes: {sc.scenes?.length || 1}</span>
                    <div className="flex items-center gap-2">
                      <CopyButton text={sc.fullText} label="Copy Script" />
                      <button
                        type="button"
                        onClick={() => deleteScript(sc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredIdeas.length === 0 && filteredScripts.length === 0 && (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-slate-500" />
            <p>No saved items match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
