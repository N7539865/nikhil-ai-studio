// src/components/projects/ProjectManagerView.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { VideoProject, ContentStatus, Platform } from '../../types';
import {
  Film,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  FileVideo,
  Edit2,
  Trash2,
  ExternalLink,
  Tag,
  CheckSquare
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { DEFAULT_CHECKLIST_KEYS, CHECKLIST_LABELS } from '../../services/storageService';

export const ProjectManagerView: React.FC = () => {
  const { activeBrand, projects, saveProject, deleteProject, showToast, setActiveTab } = useStudio();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('Instagram Reel');
  const [status, setStatus] = useState<ContentStatus>('Idea');
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [notes, setNotes] = useState('');
  const [thumbnailConcept, setThumbnailConcept] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [videoFileRef, setVideoFileRef] = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  const handleOpenNew = () => {
    setEditingProject(null);
    setName('');
    setPlatform('Instagram Reel');
    setStatus('Idea');
    setTopic('');
    setScript('');
    setCaption('');
    setHashtags('');
    setNotes('');
    setThumbnailConcept('');
    setUploadDate(new Date().toISOString().split('T')[0]);
    setVideoFileRef('');
    const initChecks: Record<string, boolean> = {};
    DEFAULT_CHECKLIST_KEYS.forEach(k => { initChecks[k] = false; });
    setChecklist(initChecks);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: VideoProject) => {
    setEditingProject(proj);
    setName(proj.name);
    setPlatform(proj.platform);
    setStatus(proj.status);
    setTopic(proj.topic);
    setScript(proj.script || '');
    setCaption(proj.caption || '');
    setHashtags(proj.hashtags || '');
    setNotes(proj.notes || '');
    setThumbnailConcept(proj.thumbnailConcept || '');
    setUploadDate(proj.uploadDate || '');
    setVideoFileRef(proj.videoFileRef || '');
    setChecklist(proj.checklist || {});
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const projectData: VideoProject = {
      id: editingProject ? editingProject.id : 'proj_' + Date.now(),
      brandId: activeBrand.id,
      name: name.trim(),
      platform,
      status,
      topic: topic.trim(),
      script,
      caption,
      hashtags,
      notes,
      thumbnailConcept,
      uploadDate,
      videoFileRef,
      checklist: Object.keys(checklist).length > 0 ? checklist : (editingProject?.checklist || {}),
      createdAt: editingProject ? editingProject.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveProject(projectData);
    setIsModalOpen(false);
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filtering
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.notes && p.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Video Project Manager</h2>
            <p className="text-xs text-slate-400">Track production pipelines, files, thumbnails & QA for {activeBrand.name}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Video Project</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, topic, notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Statuses</option>
          <option value="Idea">Idea</option>
          <option value="Script Ready">Script Ready</option>
          <option value="Recording">Recording</option>
          <option value="Editing">Editing</option>
          <option value="Ready">Ready</option>
          <option value="Published">Published</option>
        </select>

        {/* Platform Filter */}
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Platforms</option>
          <option value="Instagram Reel">Instagram Reel</option>
          <option value="YouTube Short">YouTube Short</option>
          <option value="YouTube Long Video">YouTube Long Video</option>
        </select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-studio-900/40 border border-dashed border-slate-800 text-center space-y-3">
          <Film className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs text-slate-400">No video projects found matching your criteria.</p>
          <button
            type="button"
            onClick={handleOpenNew}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300"
          >
            + Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => {
            const checks = proj.checklist || {};
            const total = DEFAULT_CHECKLIST_KEYS.length;
            const completed = DEFAULT_CHECKLIST_KEYS.filter(k => checks[k]).length;
            const percentage = Math.round((completed / total) * 100);

            return (
              <div
                key={proj.id}
                className="rounded-3xl bg-studio-900/95 border border-slate-800 hover:border-purple-500/40 p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge type="platform" value={proj.platform} />
                    <Badge type="status" value={proj.status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-100 line-clamp-2">
                    {proj.name}
                  </h3>

                  {proj.topic && (
                    <p className="text-xs text-slate-300 line-clamp-2">
                      <span className="text-slate-400 font-semibold">Topic: </span>
                      {proj.topic}
                    </p>
                  )}

                  {/* Thumbnail Concept Preview */}
                  {proj.thumbnailConcept && (
                    <div className="p-2.5 rounded-xl bg-studio-950 border border-slate-800/80 text-[11px] text-slate-300">
                      <span className="font-semibold text-amber-400">Thumbnail Idea: </span>
                      <span className="italic">{proj.thumbnailConcept}</span>
                    </div>
                  )}

                  {/* Checklist Meter */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                        <span>Pre-Publish QA:</span>
                      </span>
                      <span className="font-bold text-slate-200">{percentage}% ({completed}/{total})</span>
                    </div>
                    <div className="h-1.5 w-full bg-studio-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                    {proj.uploadDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Target: {proj.uploadDate}</span>
                      </span>
                    )}
                    {proj.videoFileRef && (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 truncate max-w-[150px]">
                        <FileVideo className="w-3 h-3" />
                        <span>{proj.videoFileRef}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(proj)}
                    className="flex-1 py-1.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Manage Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete project "${proj.name}"?`)) {
                        deleteProject(proj.id);
                      }
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-studio-950 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Video Project' : 'Create New Video Project'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Budget Smartphone Comparison 2026"
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Idea">Idea</option>
                <option value="Script Ready">Script Ready</option>
                <option value="Recording">Recording</option>
                <option value="Editing">Editing</option>
                <option value="Ready">Ready</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Instagram Reel">Instagram Reel</option>
                <option value="YouTube Short">YouTube Short</option>
                <option value="YouTube Long Video">YouTube Long Video</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Upload Date</label>
              <input
                type="date"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Premise</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Core focus of the video"
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail Concept</label>
              <input
                type="text"
                value={thumbnailConcept}
                onChange={(e) => setThumbnailConcept(e.target.value)}
                placeholder="Visual layout, text overlay, expressions..."
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Video File Reference</label>
              <input
                type="text"
                value={videoFileRef}
                onChange={(e) => setVideoFileRef(e.target.value)}
                placeholder="e.g. Master_Edit_4k_Final.mp4"
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Caption & Hashtags</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Instagram caption or YouTube description..."
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Checklist Editor within Project */}
          <div className="p-3 rounded-2xl bg-studio-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              10-Point Pre-Publish Checklist
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {DEFAULT_CHECKLIST_KEYS.map((key) => {
                const isChecked = !!checklist[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleChecklistItem(key)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left transition-colors ${
                      isChecked ? 'bg-purple-600/15 text-purple-300 font-medium' : 'text-slate-400 hover:bg-studio-900'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        isChecked ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="truncate">{CHECKLIST_LABELS[key] || key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
            >
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
