/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ArrowRight, Clock, Star, TrendingUp, Activity, Sun, Moon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, CALCULATORS } from '../data/calculators';
import M3Icon from './M3Icon';

interface HomeViewProps {
  onSelectCalculator: (id: string) => void;
  onSelectFinanceView: () => void;
  onSelectHealthView: () => void;
  isDarkMode: boolean;
  recentIds: string[];
  usageCounts: Record<string, number>;
  favorites: string[];
  onToggleDarkMode: () => void;
}

export default function HomeView({
  onSelectCalculator,
  onSelectFinanceView,
  onSelectHealthView,
  isDarkMode,
  recentIds = [],
  usageCounts = {},
  favorites = [],
  onToggleDarkMode
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [greeting, setGreeting] = useState('Welcome');

  // Pull to refresh states
  const [pullDistance, setPullDistance] = useState(0);
  const [pullState, setPullState] = useState<'idle' | 'pulling' | 'ready' | 'refreshing'>('idle');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good Morning ☀️');
    } else if (hours < 17) {
      setGreeting('Good Afternoon ⛅');
    } else {
      setGreeting('Good Evening 🌙');
    }
  }, []);

  // Filter logic
  const filteredCalculators = CALCULATORS.filter((c) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || c.categoryId === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Pull to Refresh handlers
  const handleStart = (clientY: number) => {
    if (containerRef.current && containerRef.current.scrollTop === 0 && !isRefreshing) {
      setStartY(clientY);
      setIsDragging(true);
      setPullState('pulling');
    }
  };

  const handleMove = (clientY: number) => {
    if (!isDragging || isRefreshing) return;
    const diff = clientY - startY;
    if (diff > 0) {
      // Smooth logarithmic-like pulling resistance
      const distance = Math.min(85, Math.pow(diff, 0.82));
      setPullDistance(distance);
      if (distance > 50) {
        setPullState('ready');
      } else {
        setPullState('pulling');
      }
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (pullDistance > 50) {
      setPullState('refreshing');
      setIsRefreshing(true);
      setPullDistance(50);

      // Trigger a gentle vibration on pull trigger
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }

      // Simulate a premium state refresh/re-computation loading phase
      setTimeout(() => {
        setIsRefreshing(false);
        setPullState('idle');
        setPullDistance(0);
        if (navigator.vibrate) {
          navigator.vibrate([15, 15]);
        }
      }, 1200);
    } else {
      setPullState('idle');
      setPullDistance(0);
    }
  };

  // Search Suggestions chips list
  const suggestions = [
    { label: 'SIP Plan', query: 'sip', icon: 'TrendingUp' },
    { label: 'Loan EMI', query: 'emi', icon: 'Calculator' },
    { label: 'BMI Health', query: 'bmi', icon: 'Scale' },
    { label: 'GST Split', query: 'gst', icon: 'FileText' },
    { label: 'Unit Conv', query: 'unit', icon: 'Ruler' },
    { label: 'Age Diff', query: 'age', icon: 'Calendar' }
  ];

  // Resolve dynamic content for sliders/sections
  const favCalculators = CALCULATORS.filter((c) => favorites.includes(c.id));
  
  const recentCalculators = recentIds
    .map(id => CALCULATORS.find(c => c.id === id))
    .filter((c): c is typeof CALCULATORS[0] => !!c);

  // Compute Most Used Calculators (sort by visits + popular defaults to guarantee 4 entries)
  const sortedByUsage = CALCULATORS
    .filter(c => (usageCounts[c.id] || 0) > 0)
    .sort((a, b) => (usageCounts[b.id] || 0) - (usageCounts[a.id] || 0))
    .slice(0, 4);

  const popularDefaults = ['emi', 'bmi', 'unit', 'discount'];
  const mostUsedList = [...sortedByUsage];
  for (const defId of popularDefaults) {
    if (mostUsedList.length >= 4) break;
    if (!mostUsedList.some(c => c.id === defId)) {
      const found = CALCULATORS.find(c => c.id === defId);
      if (found) mostUsedList.push(found);
    }
  }

  // Predefined Trending Calculators for curated premium catalog
  const trendingIds = ['sip', 'gst', 'datediff', 'currency_converter'];
  const trendingCalculators = trendingIds
    .map(id => CALCULATORS.find(c => c.id === id))
    .filter((c): c is typeof CALCULATORS[0] => !!c);

  // Shimmer skeleton container while pull-to-refresh is loading
  const ShimmerBlock = () => (
    <div className="space-y-6 py-4 animate-pulse">
      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      <div className="space-y-3">
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="flex gap-3 overflow-hidden">
          <div className="h-[110px] w-[130px] bg-slate-200 dark:bg-slate-800 rounded-3xl shrink-0" />
          <div className="h-[110px] w-[130px] bg-slate-200 dark:bg-slate-800 rounded-3xl shrink-0" />
          <div className="h-[110px] w-[130px] bg-slate-200 dark:bg-slate-800 rounded-3xl shrink-0" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-[105px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-[105px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto no-scrollbar relative select-none"
      onTouchStart={(e) => handleStart(e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientY)}
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {/* Pull To Refresh Loading Ring */}
      <div 
        className="absolute left-0 right-0 flex justify-center pointer-events-none z-50 transition-all duration-75"
        style={{ top: `${pullDistance - 35}px`, opacity: pullDistance > 10 ? 1 : 0 }}
      >
        <div className={`p-2 rounded-full shadow-lg border flex items-center justify-center bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800`}>
          <div 
            className={`transition-transform duration-75 ${pullState === 'refreshing' ? 'animate-spin text-primary dark:text-blue-400' : 'text-slate-400'}`} 
            style={{ transform: pullState === 'refreshing' ? undefined : `rotate(${pullDistance * 6}deg)` }}
          >
            <M3Icon name="RotateCw" size={16} />
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pt-2">
          <h1 className="text-3xl font-extrabold tracking-tight font-display text-primary dark:text-blue-400">
            Calc<span className="text-slate-400 font-normal">Nova</span>
          </h1>
          <div className="flex items-center gap-2">
            {/* Quick Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                  : 'bg-white border-slate-100 shadow-xs text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className={`w-8 h-8 rounded-full shadow-xs flex items-center justify-center text-xs font-bold border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm text-slate-700'
            }`}>
              👤
            </div>
          </div>
        </div>

        {/* Header Greetings Card */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDarkMode 
            ? 'bg-gradient-to-r from-slate-900/60 to-slate-900/40 border-slate-800/80 text-white' 
            : 'bg-gradient-to-r from-blue-50/50 to-indigo-50/20 border-slate-100 shadow-xs'
        } flex items-center justify-between`}>
          <div>
            <h2 className={`text-xl font-extrabold font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {greeting}
            </h2>
            <p className="text-[10px] mt-0.5 font-bold text-slate-400 dark:text-blue-300/60 tracking-wider uppercase">
              Your Premium Calculator Space
            </p>
          </div>
          <div className={`p-2.5 rounded-2xl ${isDarkMode ? 'bg-slate-850 text-blue-400' : 'bg-accent-light text-primary'}`}>
            <Sparkles size={20} className="animate-pulse" />
          </div>
        </div>

        {/* Search Segment */}
        <div className="space-y-3">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-800 text-slate-100 focus-within:border-primary/70 focus-within:ring-1 focus-within:ring-primary/30' 
              : 'bg-white border-slate-150 text-slate-950 shadow-xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20'
          }`}>
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search finance, health, BMI, units..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-transparent outline-hidden focus:ring-0 placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dynamic Search Suggestions chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => setSearchQuery(s.query)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'bg-white border-slate-150 text-slate-600 hover:bg-slate-50 shadow-2xs hover:text-primary'
                }`}
              >
                <M3Icon name={s.icon} size={12} className="opacity-70" />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shimmer loading template on pull refreshing */}
        {isRefreshing ? (
          <ShimmerBlock />
        ) : (
          <AnimatePresence mode="popLayout">
            {/* SEARCH OR CATEGORY FILTER ACTIVE VIEW */}
            {searchQuery.trim() !== '' || activeCategory !== 'all' ? (
              <motion.div 
                key="filter-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'text-blue-400' : 'text-primary'}`}>
                    RESULTS ({filteredCalculators.length})
                  </h2>
                  {(searchQuery || activeCategory !== 'all') && (
                    <button 
                      onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                      className="text-[10px] font-bold text-primary dark:text-blue-400 uppercase tracking-wider"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {filteredCalculators.length === 0 ? (
                  /* EMPTY STATE ILLUSTRATION */
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <svg className="w-24 h-24 text-slate-300 dark:text-slate-700 mb-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="45" cy="45" r="20" stroke="currentColor" className="stroke-slate-300 dark:stroke-slate-700" />
                      <path d="M60 60 L80 80" stroke="currentColor" strokeLinecap="round" strokeWidth={2.5} className="stroke-slate-400 dark:stroke-slate-600" />
                      <text x="39" y="52" className="text-xl font-bold fill-slate-300 dark:fill-slate-700 font-sans font-black">?</text>
                      <path d="M15 20 L25 15" stroke="currentColor" strokeLinecap="round" className="opacity-40" />
                      <path d="M80 25 L85 15" stroke="currentColor" strokeLinecap="round" className="opacity-40" />
                      <path d="M15 75 L25 80" stroke="currentColor" strokeLinecap="round" className="opacity-40" />
                    </svg>
                    <h3 className={`text-base font-bold font-display ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                      No Calculators Found
                    </h3>
                    <p className="text-xs text-slate-500 max-w-[280px] mx-auto mt-1.5 leading-relaxed">
                      We couldn't find any tool matching "<span className="font-semibold text-primary dark:text-blue-400">{searchQuery}</span>". Try another term.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-[300px]">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block w-full mb-1">Suggestions:</span>
                      {['SIP', 'EMI', 'BMI', 'GST', 'Age'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredCalculators.map((c, idx) => (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        key={c.id}
                        onClick={() => onSelectCalculator(c.id)}
                        className={`p-4 rounded-3xl flex items-center justify-between text-left m3-card-shadow transition-all group cursor-pointer border ${
                          isDarkMode 
                            ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-white' 
                            : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-950'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`p-3 rounded-2xl ${
                            isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-accent-light text-primary'
                          }`}>
                            <M3Icon name={c.icon} size={20} />
                          </div>
                          <div>
                            <h3 className="text-[9px] font-black tracking-widest uppercase text-slate-400">
                              {c.categoryId.replace('_', ' & ')}
                            </h3>
                            <h4 className={`text-sm font-bold font-display ${isDarkMode ? 'text-white' : 'text-slate-950'} mt-0.5`}>
                              {c.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 pr-2">
                              {c.description}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-400 group-hover:text-primary dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* DEFAULT HOME SCREEN DASHBOARD LAYOUT */
              <motion.div 
                key="home-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* 1. FAVORITE CALCULATORS SECTION */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'text-blue-400' : 'text-primary'}`}>
                      ⭐️ Favorites Space
                    </h2>
                  </div>
                  {favCalculators.length === 0 ? (
                    <div className={`p-4 rounded-3xl border border-dashed text-center ${
                      isDarkMode ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-slate-50/50'
                    }`}>
                      <p className="text-xs text-slate-400 font-medium">No favorites saved yet.</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Star tools in details view to access them here.</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 px-0.5">
                      {favCalculators.map((c) => (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          key={`fav-${c.id}`}
                          onClick={() => onSelectCalculator(c.id)}
                          className={`p-4 rounded-3xl border text-left shrink-0 w-[140px] flex flex-col justify-between h-[120px] transition-all group relative overflow-hidden shadow-xs ${
                            isDarkMode 
                              ? 'bg-slate-900 border-slate-800 text-white' 
                              : 'bg-gradient-to-br from-amber-50/60 to-yellow-50/40 border-amber-100 text-slate-850'
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <div className={`p-2 rounded-2xl ${
                              isDarkMode ? 'bg-slate-850 text-amber-400' : 'bg-white text-amber-500 shadow-3xs'
                            }`}>
                              <M3Icon name={c.icon} size={18} />
                            </div>
                            <Star size={13} className="fill-amber-400 text-amber-400 animate-pulse" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black font-display leading-tight truncate">{c.title}</h4>
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate mt-0.5 uppercase tracking-wider">{c.categoryId}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. RECENT CALCULATORS SECTION */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'text-blue-400' : 'text-primary'}`}>
                      ⏱️ Recent Tools
                    </h2>
                  </div>
                  {recentCalculators.length === 0 ? (
                    <div className={`p-4 rounded-3xl border border-dashed text-center ${
                      isDarkMode ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-slate-50/50'
                    }`}>
                      <p className="text-xs text-slate-400 font-medium">No recent tools used yet.</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Your calculations will log here automatically.</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 px-0.5">
                      {recentCalculators.map((c) => (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          key={`recent-${c.id}`}
                          onClick={() => onSelectCalculator(c.id)}
                          className={`p-4 rounded-3xl border text-left shrink-0 w-[140px] flex flex-col justify-between h-[120px] transition-all group relative overflow-hidden shadow-xs ${
                            isDarkMode 
                              ? 'bg-slate-900 border-slate-850 text-white hover:bg-slate-850' 
                              : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <div className={`p-2 rounded-2xl ${
                              isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-slate-50 text-slate-600'
                            }`}>
                              <M3Icon name={c.icon} size={18} />
                            </div>
                            <Clock size={12} className="text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black font-display leading-tight truncate">{c.title}</h4>
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate mt-0.5 uppercase tracking-wider">{c.categoryId}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. MOST USED CALCULATORS GRID SECTION */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'text-blue-400' : 'text-primary'}`}>
                      📈 Most Used Tools
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {mostUsedList.map((c) => (
                      <motion.button
                        whileHover={{ y: -2 }}
                        key={`most-${c.id}`}
                        onClick={() => onSelectCalculator(c.id)}
                        className={`p-4 rounded-3xl border text-left flex flex-col justify-between h-[105px] transition-all group relative overflow-hidden shadow-xs ${
                          isDarkMode 
                            ? 'bg-slate-900 border-slate-850 text-white hover:bg-slate-850' 
                            : 'bg-white border-slate-100 text-slate-800 hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div className={`p-2 rounded-2xl ${
                            isDarkMode ? 'bg-[#002d53]/50 text-blue-300' : 'bg-primary/5 text-primary'
                          }`}>
                            <M3Icon name={c.icon} size={18} />
                          </div>
                          {usageCounts[c.id] ? (
                            <span className="text-[8px] font-black tracking-wider bg-primary/10 text-primary dark:bg-blue-950/40 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase">
                              {usageCounts[c.id]} runs
                            </span>
                          ) : (
                            <span className="text-[8px] font-black tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <h4 className="text-xs font-black font-display leading-tight truncate">{c.title}</h4>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">{c.description}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 4. TRENDING CALCULATORS LIST */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                      🔥 Curated Trending
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {trendingCalculators.map((c) => (
                      <motion.button
                        whileHover={{ x: 2 }}
                        key={`trending-${c.id}`}
                        onClick={() => onSelectCalculator(c.id)}
                        className={`p-4 rounded-3xl border text-left flex items-center justify-between transition-all group relative overflow-hidden shadow-xs border-rose-100/40 dark:border-rose-950/20 ${
                          isDarkMode 
                            ? 'bg-gradient-to-r from-slate-900 to-slate-900/60 hover:bg-slate-850 text-white' 
                            : 'bg-gradient-to-r from-rose-50/20 to-white hover:bg-rose-50/30 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-2xl bg-rose-100/40 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400 shrink-0">
                            <M3Icon name={c.icon} size={18} />
                          </div>
                          <div>
                            <span className="text-[8px] font-black tracking-widest uppercase bg-rose-500/10 text-rose-500 dark:bg-rose-400/10 dark:text-rose-400 px-1.5 py-0.5 rounded-sm">
                              Trending
                            </span>
                            <h4 className="text-xs font-black font-display mt-0.5">{c.title}</h4>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 max-w-[190px]">{c.description}</p>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 group-hover:text-rose-500 transition-all shrink-0 ml-2" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* 5. BENTO CATEGORIES GRID */}
                <div className="space-y-3 pt-2">
                  <h2 className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? 'text-blue-400' : 'text-primary'}`}>
                    🗂️ Bento Categories
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map((cat) => {
                      let catColors = {
                        bg: 'bg-white border-slate-100 text-slate-900',
                        darkBg: 'bg-slate-900 border-slate-850 text-white',
                        iconBg: 'bg-slate-100 text-slate-700',
                        iconDarkBg: 'bg-slate-800 text-slate-200'
                      };

                      if (cat.id === 'finance') {
                        catColors = {
                          bg: 'bg-[#D1E4FF] border-[#A1C9FF] text-[#001D36]',
                          darkBg: 'bg-[#002d53]/70 border-[#004578]/80 text-white',
                          iconBg: 'bg-white/80 text-[#001D36]',
                          iconDarkBg: 'bg-[#004578] text-[#D1E4FF]'
                        };
                      } else if (cat.id === 'daily') {
                        catColors = {
                          bg: 'bg-amber-50/90 border-amber-200 text-amber-950',
                          darkBg: 'bg-amber-950/30 border-amber-900/40 text-white',
                          iconBg: 'bg-white/80 text-amber-900',
                          iconDarkBg: 'bg-amber-900/60 text-amber-100'
                        };
                      } else if (cat.id === 'health') {
                        catColors = {
                          bg: 'bg-emerald-50/90 border-emerald-200 text-emerald-950',
                          darkBg: 'bg-emerald-950/30 border-emerald-900/40 text-white',
                          iconBg: 'bg-white/80 text-emerald-900',
                          iconDarkBg: 'bg-emerald-900/60 text-emerald-100'
                        };
                      } else if (cat.id === 'education') {
                        catColors = {
                          bg: 'bg-purple-50/90 border-purple-200 text-purple-950',
                          darkBg: 'bg-purple-950/30 border-purple-900/40 text-white',
                          iconBg: 'bg-white/80 text-purple-900',
                          iconDarkBg: 'bg-purple-900/60 text-purple-100'
                        };
                      } else if (cat.id === 'unit') {
                        catColors = {
                          bg: 'bg-orange-50/90 border-orange-200 text-orange-950',
                          darkBg: 'bg-orange-950/30 border-orange-900/40 text-white',
                          iconBg: 'bg-white/80 text-orange-900',
                          iconDarkBg: 'bg-orange-900/60 text-orange-100'
                        };
                      } else if (cat.id === 'time_date') {
                        catColors = {
                          bg: 'bg-cyan-50/90 border-cyan-200 text-cyan-950',
                          darkBg: 'bg-cyan-950/30 border-cyan-900/40 text-white',
                          iconBg: 'bg-white/80 text-cyan-900',
                          iconDarkBg: 'bg-[#002d53]/70 text-[#D1E4FF]'
                        };
                      }

                      return (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          key={cat.id}
                          onClick={() => {
                            if (cat.id === 'finance') {
                              onSelectFinanceView();
                            } else if (cat.id === 'health') {
                              onSelectHealthView();
                            } else {
                              setActiveCategory(cat.id);
                            }
                          }}
                          className={`p-4 rounded-3xl text-left border relative overflow-hidden flex flex-col justify-between h-[120px] shadow-2xs hover:shadow-sm transition-all group cursor-pointer ${
                            isDarkMode ? catColors.darkBg : catColors.bg
                          }`}
                        >
                          <div className={`p-2 rounded-2xl w-fit ${
                            isDarkMode ? catColors.iconDarkBg : catColors.iconBg
                          }`}>
                            <M3Icon name={cat.icon} size={18} />
                          </div>

                          <div>
                            <h3 className="text-sm font-black font-display leading-tight">
                              {cat.name}
                            </h3>
                            <p className="text-[9px] opacity-80 line-clamp-1 mt-0.5 font-medium tracking-wide">
                              {cat.description}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Info Tip Banner */}
                <div className={`p-4 rounded-3xl border ${
                  isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-primary/5 border-primary/10'
                } flex gap-4 items-center`}>
                  <div className={`p-2.5 rounded-2xl shrink-0 ${isDarkMode ? 'bg-slate-850 text-blue-400' : 'bg-white text-primary shadow-3xs'}`}>
                    💡
                  </div>
                  <div className="text-xs leading-relaxed">
                    <span className={`font-black block ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>M3 Quick Tip</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Vibration and simulated frame styles are fully customizable anytime via the <span className="font-semibold text-primary dark:text-blue-400">Settings</span> tab.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
