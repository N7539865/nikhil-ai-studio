// src/components/layout/BrandSwitcher.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ChevronDown, Plus, Sparkles, Check, Building2, Paintbrush, Gamepad2, Laugh, User } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Brand, Language } from '../../types';

export const BrandSwitcher: React.FC = () => {
  const { brands, activeBrand, setActiveBrandId, addNewBrand } = useStudio();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Brand Form State
  const [name, setName] = useState('');
  const [creatorName, setCreatorName] = useState('Nikhil');
  const [niches, setNiches] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('hinglish');
  const [preferredStyle, setPreferredStyle] = useState('High-energy, fast-paced storytelling');
  const [defaultCta, setDefaultCta] = useState('Follow for more content!');
  const [bio, setBio] = useState('');
  const [color, setColor] = useState('#8b5cf6');

  const getBrandIcon = (brandName: string) => {
    const lower = brandName.toLowerCase();
    if (lower.includes('art')) return <Paintbrush className="w-4 h-4" />;
    if (lower.includes('game') || lower.includes('gaming')) return <Gamepad2 className="w-4 h-4" />;
    if (lower.includes('comedy') || lower.includes('bakchodi')) return <Laugh className="w-4 h-4" />;
    if (lower.includes('telecom') || lower.includes('devpri')) return <Building2 className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newB: Brand = {
      id: 'brand_' + Date.now(),
      name: name.trim(),
      creatorName: creatorName.trim() || 'Nikhil',
      niches: niches.trim() || 'General Creative & Tech',
      preferredLanguage,
      preferredStyle,
      defaultCta,
      bio,
      color
    };

    addNewBrand(newB);
    setIsModalOpen(false);
    // Reset
    setName('');
    setNiches('');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-studio-900/90 hover:bg-studio-800/90 border border-slate-800 text-left transition-all duration-150 shadow-sm"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
            style={{ backgroundColor: activeBrand.color || '#8b5cf6' }}
          >
            {getBrandIcon(activeBrand.name)}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-medium truncate">Active Channel / Brand</p>
            <p className="text-sm font-semibold text-slate-100 truncate">{activeBrand.name}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-studio-900 border border-slate-800 shadow-2xl p-2 space-y-1 animate-fadeIn">
            <p className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Switch Creator Workspace
            </p>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {brands.map((b) => {
                const isSelected = b.id === activeBrand.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setActiveBrandId(b.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-purple-600/15 text-purple-300 font-medium border border-purple-500/30'
                        : 'text-slate-300 hover:bg-studio-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs shrink-0"
                        style={{ backgroundColor: b.color || '#8b5cf6' }}
                      >
                        {getBrandIcon(b.name)}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold truncate">{b.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{b.niches || b.creatorName}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-purple-400 hover:bg-purple-500/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Creator Brand / Channel</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal to Add Brand */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Brand / Channel" maxWidth="md">
        <form onSubmit={handleCreateBrand} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Brand / Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Nikhil Fitness, Tech Uncut, Vlogs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Creator Persona Name</label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Brand Accent Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-0"
                />
                <span className="text-xs text-slate-400 uppercase font-mono">{color}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Primary Niches / Topics</label>
            <input
              type="text"
              placeholder="e.g. AI News, Fitness, Unboxing, Gadgets"
              value={niches}
              onChange={(e) => setNiches(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="hinglish">Hinglish</option>
                <option value="hindi">हिंदी (Hindi)</option>
                <option value="english">English</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Content Style</label>
              <input
                type="text"
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Default Call To Action (CTA)</label>
            <input
              type="text"
              value={defaultCta}
              onChange={(e) => setDefaultCta(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
