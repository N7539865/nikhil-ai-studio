// src/components/calendar/CalendarView.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ContentItem, ContentStatus, Platform } from '../../types';
import {
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  Edit,
  List,
  Grid3X3,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const CalendarView: React.FC = () => {
  const { activeBrand, calendarItems, saveCalendarItem, deleteCalendarItem, showToast } = useStudio();

  // View state: 'month' | 'week' | 'list'
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('Instagram Reel');
  const [status, setStatus] = useState<ContentStatus>('Idea');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [publishTime, setPublishTime] = useState('18:00');
  const [notes, setNotes] = useState('');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleOpenAdd = (dateStr?: string) => {
    setEditingItem(null);
    setTitle('');
    setPlatform('Instagram Reel');
    setStatus('Idea');
    setPublishDate(dateStr || new Date().toISOString().split('T')[0]);
    setPublishTime('18:00');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ContentItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setPlatform(item.platform);
    setStatus(item.status);
    setPublishDate(item.publishDate);
    setPublishTime(item.publishTime || '18:00');
    setNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const item: ContentItem = {
      id: editingItem ? editingItem.id : 'cal_' + Date.now(),
      brandId: activeBrand.id,
      title: title.trim(),
      platform,
      status,
      publishDate,
      publishTime,
      notes
    };

    saveCalendarItem(item);
    setIsModalOpen(false);
  };

  // Calendar Day Generation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Days array
  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getItemsForDate = (dateStr: string) => {
    return calendarItems.filter(c => c.publishDate === dateStr);
  };

  // Week View calculation
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Calendar Header Card */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Content Schedule & Calendar</h2>
            <p className="text-xs text-slate-400">
              Plan and schedule posts for {activeBrand.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-studio-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`p-2 rounded-lg font-medium transition-colors ${
                viewMode === 'month' ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
              title="Month View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`p-2 rounded-lg font-medium transition-colors ${
                viewMode === 'week' ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
              title="Week View"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-100">
            {monthNames[month]} {year}
          </h3>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="px-2.5 py-1 rounded-lg bg-studio-900 border border-slate-800 text-[11px] font-semibold text-purple-400 hover:text-purple-300"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevPeriod}
            className="p-2 rounded-xl bg-studio-900 hover:bg-studio-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextPeriod}
            className="p-2 rounded-xl bg-studio-900 hover:bg-studio-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="rounded-3xl bg-studio-900/90 border border-slate-800 overflow-hidden shadow-xl">
          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-studio-950/60 text-center py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {days.map((d, index) => {
              if (d === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[100px] p-2 border-b border-r border-slate-800/50 bg-studio-950/20"
                  />
                );
              }

              const formattedDay = d < 10 ? `0${d}` : `${d}`;
              const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
              const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
              const dayItems = getItemsForDate(dateStr);
              const isToday =
                new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={`day-${d}`}
                  onClick={() => handleOpenAdd(dateStr)}
                  className={`min-h-[110px] p-2 border-b border-r border-slate-800/80 transition-colors flex flex-col justify-between group cursor-pointer ${
                    isToday ? 'bg-purple-950/20' : 'hover:bg-studio-950/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-purple-600 text-white' : 'text-slate-300'
                      }`}
                    >
                      {d}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAdd(dateStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition-opacity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1 my-1 overflow-y-auto max-h-20">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(item);
                        }}
                        className="p-1 rounded-md bg-studio-950 border border-slate-800 hover:border-purple-500/50 text-[10px] text-slate-200 truncate flex items-center gap-1 shadow-sm"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            item.platform === 'Instagram Reel' ? 'bg-pink-400' : 'bg-red-400'
                          }`}
                        />
                        <span className="truncate font-medium">{item.title}</span>
                      </div>
                    ))}
                  </div>

                  <div />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((d, idx) => {
            const dateStr = d.toISOString().split('T')[0];
            const dayItems = getItemsForDate(dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-studio-900/90 border border-slate-800 space-y-3 min-h-[220px] ${
                  isToday ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-slate-400">
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-sm font-bold text-slate-100">{d.getDate()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenAdd(dateStr)}
                    className="p-1 rounded-lg bg-studio-950 hover:bg-studio-800 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenEdit(item)}
                      className="cursor-pointer p-2.5 rounded-xl bg-studio-950 border border-slate-800/80 hover:border-purple-500/50 space-y-1"
                    >
                      <p className="text-xs font-semibold text-slate-200 line-clamp-2">{item.title}</p>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">{item.publishTime}</span>
                        <Badge type="status" value={item.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 space-y-4 shadow-xl">
          {calendarItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No content scheduled yet. Click "Schedule Post" above to add your first video!
            </div>
          ) : (
            <div className="space-y-2.5">
              {[...calendarItems]
                .sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-studio-950 border border-slate-800 hover:border-purple-500/40 flex flex-wrap items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge type="platform" value={item.platform} />
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{item.publishDate} {item.publishTime}</span>
                        </span>
                        {item.notes && (
                          <span className="text-xs text-slate-400 italic truncate max-w-xs">• {item.notes}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge type="status" value={item.status} />
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-900 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCalendarItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-studio-900 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Scheduled Post' : 'Schedule Content'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Content Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 AI Video Generators Reel"
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                <option value="Post">Community Post</option>
                <option value="Story">Story</option>
              </select>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Publish Date</label>
              <input
                type="date"
                required
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Time (IST)</label>
              <input
                type="time"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Production Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Pin comment immediately, share to story 15m later..."
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
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
              {editingItem ? 'Update Post' : 'Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
