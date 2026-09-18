// src/components/checklist/UploadChecklistView.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { CheckSquare, CheckCircle2, RotateCcw, Save, Sparkles, Film } from 'lucide-react';
import { DEFAULT_CHECKLIST_KEYS, CHECKLIST_LABELS } from '../../services/storageService';

export const UploadChecklistView: React.FC = () => {
  const { activeBrand, projects, saveProject, showToast } = useStudio();

  // Selected project for checklist
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'custom');
  const activeProj = projects.find(p => p.id === selectedProjectId);

  const [localChecks, setLocalChecks] = useState<Record<string, boolean>>(() => {
    if (activeProj && activeProj.checklist) {
      return activeProj.checklist;
    }
    const init: Record<string, boolean> = {};
    DEFAULT_CHECKLIST_KEYS.forEach(k => { init[k] = false; });
    return init;
  });

  const handleSelectProject = (projId: string) => {
    setSelectedProjectId(projId);
    const p = projects.find(item => item.id === projId);
    if (p && p.checklist) {
      setLocalChecks(p.checklist);
    } else {
      const init: Record<string, boolean> = {};
      DEFAULT_CHECKLIST_KEYS.forEach(k => { init[k] = false; });
      setLocalChecks(init);
    }
  };

  const toggleItem = (key: string) => {
    setLocalChecks(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // If linked to an active project, auto-update the project
      if (activeProj) {
        saveProject({
          ...activeProj,
          checklist: updated,
          status: Object.values(updated).filter(Boolean).length === DEFAULT_CHECKLIST_KEYS.length ? 'Ready' : activeProj.status
        });
      }
      return updated;
    });
  };

  const handleReset = () => {
    const reset: Record<string, boolean> = {};
    DEFAULT_CHECKLIST_KEYS.forEach(k => { reset[k] = false; });
    setLocalChecks(reset);
    if (activeProj) {
      saveProject({ ...activeProj, checklist: reset });
    }
    showToast('Checklist reset.');
  };

  const handleCheckAll = () => {
    const full: Record<string, boolean> = {};
    DEFAULT_CHECKLIST_KEYS.forEach(k => { full[k] = true; });
    setLocalChecks(full);
    if (activeProj) {
      saveProject({ ...activeProj, checklist: full, status: 'Ready' });
    }
    showToast('All items marked ready!');
  };

  const completedCount = DEFAULT_CHECKLIST_KEYS.filter(k => localChecks[k]).length;
  const percentage = Math.round((completedCount / DEFAULT_CHECKLIST_KEYS.length) * 100);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Pre-Publish Quality Checklist</h2>
              <p className="text-xs text-slate-400">
                10-point publication quality assurance before hitting upload on YouTube or Instagram
              </p>
            </div>
          </div>

          {/* Project selector */}
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-purple-400 shrink-0" />
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="custom">General Ad-Hoc Upload</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  Project: {p.name} ({p.platform})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Bar Display */}
        <div className="p-5 rounded-2xl bg-studio-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-100">{percentage}%</span>
              <span className="text-xs text-slate-400">
                ({completedCount} of {DEFAULT_CHECKLIST_KEYS.length} tasks ready)
              </span>
            </div>

            {percentage === 100 ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Ready To Publish!</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-purple-400">
                {DEFAULT_CHECKLIST_KEYS.length - completedCount} items remaining
              </span>
            )}
          </div>

          <div className="h-3 w-full bg-studio-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentage === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Tasks */}
      <div className="rounded-3xl bg-studio-900/90 border border-slate-800 p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Publishing Verification Steps
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCheckAll}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 px-2 py-1 rounded-lg hover:bg-studio-950"
            >
              Mark All Done
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-studio-950 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {DEFAULT_CHECKLIST_KEYS.map((key, index) => {
            const isDone = !!localChecks[key];
            return (
              <div
                key={key}
                onClick={() => toggleItem(key)}
                className={`cursor-pointer flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                    : 'bg-studio-950 border-slate-800/80 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm'
                        : 'border-slate-700 bg-studio-900'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <span className={`text-xs font-semibold ${isDone ? 'text-slate-100' : 'text-slate-300'}`}>
                      {index + 1}. {CHECKLIST_LABELS[key]}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? 'Completed' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
