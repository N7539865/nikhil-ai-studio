// src/components/analytics/AnalyticsView.tsx
import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { AnalyticsEntry, Platform, ArtBusinessStats } from '../../types';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  Sparkles,
  ShoppingBag,
  GraduationCap,
  Package,
  IndianRupee,
  CheckCircle2,
  Clock,
  Layers,
  Film,
  ArrowUpRight,
  Filter,
  Check,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

type DateFilter = '7D' | '30D' | '90D' | 'ALL';
type ChartType = 'views' | 'engagement' | 'content' | 'followers' | 'revenue';

export const AnalyticsView: React.FC = () => {
  const {
    activeBrand,
    analytics,
    saveAnalyticsEntry,
    deleteAnalyticsEntry,
    artBusinessStats,
    updateArtBusinessStats,
    projects,
    ideas,
    calendarItems,
    showToast
  } = useStudio();

  // Filters
  const [dateFilter, setDateFilter] = useState<DateFilter>('ALL');
  const [selectedChart, setSelectedChart] = useState<ChartType>('views');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState<boolean>(false);

  // Form Fields for Add Analytics Data
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [platform, setPlatform] = useState<Platform>('Instagram Reel');
  const [contentName, setContentName] = useState<string>('');
  const [views, setViews] = useState<string>('');
  const [likes, setLikes] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [shares, setShares] = useState<string>('');
  const [subscribersGained, setSubscribersGained] = useState<string>('');
  const [productCourse, setProductCourse] = useState<string>('');
  const [orders, setOrders] = useState<string>('');
  const [revenue, setRevenue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Business Stats Form State
  const [bizCourses, setBizCourses] = useState<number>(artBusinessStats.totalCourses);
  const [bizStudents, setBizStudents] = useState<number>(artBusinessStats.students);
  const [bizProducts, setBizProducts] = useState<number>(artBusinessStats.digitalProducts);
  const [bizCompletedOrders, setBizCompletedOrders] = useState<number>(artBusinessStats.completedOrders);
  const [bizBaseOrders, setBizBaseOrders] = useState<number>(artBusinessStats.baseOrders);
  const [bizBaseRevenue, setBizBaseRevenue] = useState<number>(artBusinessStats.baseRevenue);

  // Open Add Data Modal
  const handleOpenAddModal = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setPlatform('Instagram Reel');
    setContentName('');
    setViews('');
    setLikes('');
    setComments('');
    setShares('');
    setSubscribersGained('');
    setProductCourse('');
    setOrders('');
    setRevenue('');
    setNotes('');
    setIsAddModalOpen(true);
  };

  // Submit Add Analytics Entry
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entryViews = Number(views) || 0;
    const entryLikes = Number(likes) || 0;
    const entryComments = Number(comments) || 0;
    const entryShares = Number(shares) || 0;
    const entrySubs = Number(subscribersGained) || 0;
    const entryOrders = Number(orders) || 0;
    const entryRevenue = Number(revenue) || 0;

    const entry: AnalyticsEntry = {
      id: 'ana_' + Date.now(),
      brandId: activeBrand.id,
      date,
      platform,
      contentName: contentName || 'Untitled Content',
      views: entryViews,
      likes: entryLikes,
      comments: entryComments,
      shares: entryShares,
      subscribersGained: entrySubs,
      productCourse: productCourse || undefined,
      orders: entryOrders > 0 ? entryOrders : undefined,
      revenue: entryRevenue > 0 ? entryRevenue : undefined,
      notes
    };

    saveAnalyticsEntry(entry);
    setIsAddModalOpen(false);
    showToast('Analytics data recorded successfully!', 'success');
  };

  // Submit Business Stats Update
  const handleUpdateBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ArtBusinessStats = {
      totalCourses: Number(bizCourses) || 0,
      students: Number(bizStudents) || 0,
      digitalProducts: Number(bizProducts) || 0,
      completedOrders: Number(bizCompletedOrders) || 0,
      baseOrders: Number(bizBaseOrders) || 0,
      baseRevenue: Number(bizBaseRevenue) || 0
    };
    updateArtBusinessStats(updated);
    setIsBusinessModalOpen(false);
  };

  // Filter analytics by Brand
  const brandAnalytics = analytics.filter((a) => a.brandId === activeBrand.id);

  // Filter by Date
  const now = new Date().getTime();
  const filteredEntries = brandAnalytics.filter((entry) => {
    const entryTime = new Date(entry.date).getTime();
    if (dateFilter === '7D' && now - entryTime > 7 * 86400000) return false;
    if (dateFilter === '30D' && now - entryTime > 30 * 86400000) return false;
    if (dateFilter === '90D' && now - entryTime > 90 * 86400000) return false;
    if (platformFilter !== 'all' && !entry.platform.toLowerCase().includes(platformFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Sort chronologically for charts
  const sortedEntries = [...filteredEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // ================= CONTENT METRICS CALCULATIONS =================
  const totalVideos = filteredEntries.length;
  const publishedVideos = filteredEntries.filter((e) => e.views > 0).length;
  const totalViews = filteredEntries.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = filteredEntries.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const totalComments = filteredEntries.reduce((acc, curr) => acc + (curr.comments || 0), 0);
  const totalShares = filteredEntries.reduce((acc, curr) => acc + (curr.shares || 0), 0);
  const totalSubs = filteredEntries.reduce((acc, curr) => acc + (curr.subscribersGained || 0), 0);

  // Total Content Created (Projects + Ideas + Calendar + Logged Videos)
  const totalContentCreated =
    projects.filter((p) => p.brandId === activeBrand.id).length +
    ideas.filter((i) => i.brandId === activeBrand.id).length +
    calendarItems.filter((c) => c.brandId === activeBrand.id).length +
    totalVideos;

  // Auto-calculated rates with safe division-by-zero protection
  const avgViews = publishedVideos > 0 ? Math.round(totalViews / publishedVideos) : 0;
  const totalEngagement = totalLikes + totalComments + totalShares;
  const engagementRate = totalViews > 0 ? ((totalEngagement / totalViews) * 100).toFixed(2) : '0.00';

  // ================= ART BUSINESS METRICS CALCULATIONS =================
  const loggedOrders = filteredEntries.reduce((acc, curr) => acc + (curr.orders || 0), 0);
  const loggedRevenue = filteredEntries.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

  const totalOrders = (artBusinessStats.baseOrders || 0) + loggedOrders;
  const totalRevenue = (artBusinessStats.baseRevenue || 0) + loggedRevenue;
  const completedOrders = (artBusinessStats.completedOrders || 0) + loggedOrders;

  // Chart Max Values for scaling
  const maxViews = Math.max(...sortedEntries.map((a) => a.views), 1000);
  const maxEngagement = Math.max(...sortedEntries.map((a) => a.likes + a.comments + a.shares), 100);
  const maxRevenue = Math.max(...sortedEntries.map((a) => a.revenue || 0), 5000);
  const maxFollowers = Math.max(...sortedEntries.map((a) => a.subscribersGained), 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
              Real-Time Verification Engine
            </span>
            <span className="text-xs text-slate-400">
              • Brand: <span className="font-semibold text-slate-200">{activeBrand.name}</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <span>📊 Creator & Business Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track video performance, audience retention metrics, and art business sales in one unified dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setBizCourses(artBusinessStats.totalCourses);
              setBizStudents(artBusinessStats.students);
              setBizProducts(artBusinessStats.digitalProducts);
              setBizCompletedOrders(artBusinessStats.completedOrders);
              setBizBaseOrders(artBusinessStats.baseOrders);
              setBizBaseRevenue(artBusinessStats.baseRevenue);
              setIsBusinessModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-studio-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2"
          >
            <Edit3 className="w-3.5 h-3.5 text-pink-400" />
            <span>Edit Business Baseline</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Analytics Data</span>
          </button>
        </div>
      </div>

      {/* Manual Analytics Mode Indicator & Future Sync Notice */}
      <div className="p-4 rounded-2xl bg-studio-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200">Manual Analytics Mode (Active): </span>
            <span>
              All entries are stored locally with zero data leak. Full persistence across page reloads is active.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-lg bg-studio-900 border border-slate-800 text-[10px] font-semibold text-slate-400">
            Official APIs: Ready for OAuth Connect
          </span>
        </div>
      </div>

      {/* ================= 1. CONTENT METRICS SECTION ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Film className="w-4 h-4 text-purple-400" />
            <span>Content & Video Metrics</span>
          </h2>
          <span className="text-xs text-slate-400">
            Across {totalVideos} logged items ({publishedVideos} published)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Total Videos */}
          <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Total Videos</span>
              <Film className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-xl font-black text-slate-100">{totalVideos}</p>
            <p className="text-[10px] text-slate-500">Tracked items</p>
          </div>

          {/* Published Videos */}
          <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Published</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-black text-emerald-400">{publishedVideos}</p>
            <p className="text-[10px] text-slate-500">Active online</p>
          </div>

          {/* Total Views */}
          <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Total Views</span>
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-xl font-black text-slate-100">{totalViews.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">Avg: {avgViews.toLocaleString()}/video</p>
          </div>

          {/* Likes */}
          <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Likes</span>
              <Heart className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <p className="text-xl font-black text-pink-400">{totalLikes.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">Audience approval</p>
          </div>

          {/* Comments */}
          <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Comments</span>
              <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-xl font-black text-amber-400">{totalComments.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">Direct feedback</p>
          </div>

          {/* Shares */}
          <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Shares</span>
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-black text-emerald-400">{totalShares.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">Virality driver</p>
          </div>

          {/* Followers Gained */}
          <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>+Followers</span>
              <Users className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <p className="text-xl font-black text-violet-400">+{totalSubs.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">Audience growth</p>
          </div>

          {/* Total Content Created */}
          <div className="p-4 rounded-2xl bg-studio-900/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Total Created</span>
              <Layers className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <p className="text-xl font-black text-blue-400">{totalContentCreated}</p>
            <p className="text-[10px] text-slate-500">Studio pipeline</p>
          </div>
        </div>
      </div>

      {/* ================= 2. ART BUSINESS METRICS (NIKHIL ARTS) ================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-studio-900/90 via-studio-900/60 to-purple-950/20 border border-purple-500/20 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-pink-400" />
                <span>Art Business & Monetization Metrics ({activeBrand.name})</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                Manual V1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Course enrollments, digital products (brushes, templates), print orders, and direct creator revenue.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Total Attributed Revenue: </span>
            <span className="text-lg font-black text-emerald-400">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {/* Total Courses */}
          <div className="p-4 rounded-2xl bg-studio-950/80 border border-slate-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Total Courses</span>
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-xl font-black text-slate-100">{artBusinessStats.totalCourses}</p>
            <p className="text-[10px] text-slate-500">Live masterclasses</p>
          </div>

          {/* Students Enrolled */}
          <div className="p-4 rounded-2xl bg-studio-950/80 border border-slate-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Students</span>
              <Users className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-xl font-black text-cyan-400">{artBusinessStats.students.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">Active learners</p>
          </div>

          {/* Digital Products */}
          <div className="p-4 rounded-2xl bg-studio-950/80 border border-slate-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Digital Products</span>
              <Package className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-xl font-black text-amber-400">{artBusinessStats.digitalProducts}</p>
            <p className="text-[10px] text-slate-500">Brushes & presets</p>
          </div>

          {/* Orders */}
          <div className="p-4 rounded-2xl bg-studio-950/80 border border-slate-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Total Orders</span>
              <ShoppingBag className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <p className="text-xl font-black text-slate-100">{totalOrders.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">All channels</p>
          </div>

          {/* Completed Orders */}
          <div className="p-4 rounded-2xl bg-studio-950/80 border border-slate-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <span>Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-black text-emerald-400">{completedOrders.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">Fulfilled orders</p>
          </div>

          {/* Total Revenue */}
          <div className="p-4 rounded-2xl bg-studio-950/80 border border-emerald-500/30 space-y-1">
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
              <span>Revenue (INR)</span>
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xl font-black text-emerald-400">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500">Manual V1 tracked</p>
          </div>
        </div>
      </div>

      {/* ================= 3. CHARTS SECTION WITH FILTERS ================= */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 space-y-5 shadow-xl">
        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
          {/* Chart Type Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'views', label: 'Views Over Time' },
              { key: 'engagement', label: 'Engagement Over Time' },
              { key: 'content', label: 'Content Published' },
              { key: 'followers', label: 'Followers Growth' },
              { key: 'revenue', label: 'Revenue Over Time' }
            ].map((ch) => (
              <button
                key={ch.key}
                type="button"
                onClick={() => setSelectedChart(ch.key as ChartType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedChart === ch.key
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-studio-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* Timeframe Filter (7D, 30D, 90D, ALL) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Filter:</span>
            <div className="inline-flex rounded-xl bg-studio-950 p-1 border border-slate-800">
              {(['7D', '30D', '90D', 'ALL'] as DateFilter[]).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setDateFilter(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    dateFilter === tf
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State vs Visual SVG Responsive Bars */}
        {sortedEntries.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No Analytics Data in This Filter Range</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click "+ Add Analytics Data" above or adjust your date filter to view trends and charts.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="font-semibold text-slate-200">
                {selectedChart === 'views' && 'Video Views by Recording Date'}
                {selectedChart === 'engagement' && 'Total Engagement (Likes + Comments + Shares)'}
                {selectedChart === 'content' && 'Content Volume & Posts'}
                {selectedChart === 'followers' && 'Net Follower Inflow'}
                {selectedChart === 'revenue' && 'Revenue Generated by Post (₹)'}
              </span>
              <span>
                Avg Engagement Rate: <span className="font-bold text-purple-400">{engagementRate}%</span>
              </span>
            </div>

            {/* Dynamic Bar Chart */}
            <div className="h-52 flex items-end gap-3 px-3 pt-6 border-b border-slate-800">
              {sortedEntries.map((item) => {
                let value = item.views;
                let displayVal = item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views;
                let heightPercent = Math.max(14, Math.round((item.views / maxViews) * 100));
                let barColor = 'bg-gradient-to-t from-purple-600 to-pink-500';

                if (selectedChart === 'engagement') {
                  const eng = item.likes + item.comments + item.shares;
                  value = eng;
                  displayVal = eng.toLocaleString();
                  heightPercent = Math.max(14, Math.round((eng / maxEngagement) * 100));
                  barColor = 'bg-gradient-to-t from-pink-600 to-rose-400';
                } else if (selectedChart === 'followers') {
                  value = item.subscribersGained;
                  displayVal = `+${item.subscribersGained}`;
                  heightPercent = Math.max(14, Math.round((item.subscribersGained / maxFollowers) * 100));
                  barColor = 'bg-gradient-to-t from-amber-600 to-yellow-400';
                } else if (selectedChart === 'revenue') {
                  const rev = item.revenue || 0;
                  value = rev;
                  displayVal = `₹${rev.toLocaleString()}`;
                  heightPercent = Math.max(14, Math.round((rev / maxRevenue) * 100));
                  barColor = 'bg-gradient-to-t from-emerald-600 to-teal-400';
                } else if (selectedChart === 'content') {
                  value = 1;
                  displayVal = '1 Post';
                  heightPercent = 70;
                  barColor = 'bg-gradient-to-t from-blue-600 to-cyan-400';
                }

                return (
                  <div key={item.id} className="flex-1 flex flex-col items-center gap-1.5 group min-w-[32px]">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-purple-300 truncate">
                      {displayVal}
                    </div>
                    <div
                      className={`w-full rounded-t-xl transition-all duration-300 hover:opacity-90 ${barColor}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Date Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 px-3 font-mono">
              {sortedEntries.map((item) => (
                <span key={item.id} className="truncate max-w-[65px] text-center" title={item.date}>
                  {item.date.slice(5)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= 4. DETAILED LOG TABLE ================= */}
      <div className="p-6 rounded-3xl bg-studio-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Performance Log History</h3>
            <p className="text-xs text-slate-400">Detailed multi-channel metrics & monetization ledger</p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        </div>

        {sortedEntries.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No entries recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Content / Title</th>
                  <th className="py-2.5 px-3">Platform</th>
                  <th className="py-2.5 px-3">Views</th>
                  <th className="py-2.5 px-3">Likes</th>
                  <th className="py-2.5 px-3">Comments</th>
                  <th className="py-2.5 px-3">Shares</th>
                  <th className="py-2.5 px-3">+Followers</th>
                  <th className="py-2.5 px-3">Engagement</th>
                  <th className="py-2.5 px-3">Product / Orders</th>
                  <th className="py-2.5 px-3">Revenue</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedEntries.map((entry) => {
                  const eng =
                    entry.views > 0
                      ? (((entry.likes + entry.comments + entry.shares) / entry.views) * 100).toFixed(1)
                      : '0.0';

                  return (
                    <tr key={entry.id} className="hover:bg-studio-950/50 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-300">{entry.date}</td>
                      <td className="py-3 px-3 font-medium text-slate-200 max-w-[180px] truncate" title={entry.contentName}>
                        {entry.contentName || 'Untitled'}
                      </td>
                      <td className="py-3 px-3">
                        <Badge type="platform" value={entry.platform} size="sm" />
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-100">{entry.views.toLocaleString()}</td>
                      <td className="py-3 px-3 text-slate-300">{entry.likes.toLocaleString()}</td>
                      <td className="py-3 px-3 text-slate-300">{entry.comments.toLocaleString()}</td>
                      <td className="py-3 px-3 text-emerald-400 font-semibold">{entry.shares.toLocaleString()}</td>
                      <td className="py-3 px-3 text-amber-400 font-semibold">+{entry.subscribersGained.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-purple-400">{eng}%</td>
                      <td className="py-3 px-3 text-slate-300 max-w-[140px] truncate">
                        {entry.productCourse ? (
                          <span title={entry.productCourse}>
                            {entry.productCourse} ({entry.orders || 0})
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400 font-mono">
                        {entry.revenue ? `₹${entry.revenue.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Delete this analytics entry?')) {
                              deleteAnalyticsEntry(entry.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-studio-900 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: ADD ANALYTICS DATA ================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Analytics & Performance Data"
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <p className="text-xs text-slate-400">
            Record real performance numbers for a published video or post, plus any attributed course/product sales.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Platform *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="Instagram Reel">Instagram Reel</option>
                <option value="YouTube Short">YouTube Short</option>
                <option value="YouTube Long Video">YouTube Long Video</option>
                <option value="Instagram Post">Instagram Post</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Content / Video Name *</label>
              <input
                type="text"
                required
                value={contentName}
                onChange={(e) => setContentName(e.target.value)}
                placeholder="e.g. Realistic Eye Drawing Tutorial"
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-studio-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
              Audience & Reach Numbers
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Total Views *</label>
                <input
                  type="number"
                  required
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  placeholder="e.g. 45000"
                  className="w-full px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Likes</label>
                <input
                  type="number"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  placeholder="e.g. 3200"
                  className="w-full px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Comments</label>
                <input
                  type="number"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="e.g. 210"
                  className="w-full px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Shares</label>
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="e.g. 850"
                  className="w-full px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">+Followers</label>
                <input
                  type="number"
                  value={subscribersGained}
                  onChange={(e) => setSubscribersGained(e.target.value)}
                  placeholder="e.g. 420"
                  className="w-full px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-studio-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-pink-300 uppercase tracking-wider block">
              Art Business Attribution (Optional)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Product / Course Name</label>
                <input
                  type="text"
                  value={productCourse}
                  onChange={(e) => setProductCourse(e.target.value)}
                  placeholder="e.g. Portrait Masterclass"
                  className="w-full px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Orders Count</label>
                <input
                  type="number"
                  value={orders}
                  onChange={(e) => setOrders(e.target.value)}
                  placeholder="e.g. 14"
                  className="w-full px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Revenue Generated (₹)</label>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="e.g. 14990"
                  className="w-full px-3 py-2 rounded-xl bg-studio-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Key Takeaways</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Evening peak at 6:30 PM generated highest initial engagement"
              className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
            >
              Save Performance Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL 2: EDIT BUSINESS BASELINE ================= */}
      <Modal
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
        title="Update Art Business Baseline Metrics"
        maxWidth="md"
      >
        <form onSubmit={handleUpdateBusinessSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">
            Customize baseline metrics for {activeBrand.name}. Logged video entries will add onto these baseline figures.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Courses</label>
              <input
                type="number"
                value={bizCourses}
                onChange={(e) => setBizCourses(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Students Enrolled</label>
              <input
                type="number"
                value={bizStudents}
                onChange={(e) => setBizStudents(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Digital Products</label>
              <input
                type="number"
                value={bizProducts}
                onChange={(e) => setBizProducts(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Completed Orders</label>
              <input
                type="number"
                value={bizCompletedOrders}
                onChange={(e) => setBizCompletedOrders(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Baseline Orders</label>
              <input
                type="number"
                value={bizBaseOrders}
                onChange={(e) => setBizBaseOrders(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Baseline Revenue (₹)</label>
              <input
                type="number"
                value={bizBaseRevenue}
                onChange={(e) => setBizBaseRevenue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsBusinessModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-600/30"
            >
              Update Baseline
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
