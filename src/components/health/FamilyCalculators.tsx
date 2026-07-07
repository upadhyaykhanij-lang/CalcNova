/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Calendar, RotateCcw, Share2, Sparkles, Flame, Percent } from 'lucide-react';

/* ==========================================
   1. PREGNANCY DUE DATE CALCULATOR
   ========================================== */
export function PregnancyCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  // Last Menstrual Period Date string
  const [lmpString, setLmpString] = useState<string>(() => {
    // Default to 4 months ago for full demonstration of progress
    const d = new Date();
    d.setMonth(d.getMonth() - 4);
    return d.toISOString().split('T')[0];
  });
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const lmpDate = new Date(lmpString);
  const isValidDate = !isNaN(lmpDate.getTime());

  // Calculations:
  // Standard human pregnancy is 280 days (40 weeks) from LMP.
  // We adjust for cycle variations: + (CycleLength - 28) days.
  const cycleOffset = cycleLength - 28;
  const pregnancyDurationDays = 280 + cycleOffset;

  const eddDate = new Date(lmpDate);
  eddDate.setDate(eddDate.getDate() + pregnancyDurationDays);

  const conceptionDate = new Date(eddDate);
  conceptionDate.setDate(conceptionDate.getDate() - 266); // Standard fetal gestation is 266 days from conception

  // Current status
  const today = new Date();
  const timeDiff = today.getTime() - lmpDate.getTime();
  const daysPregnant = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
  
  const currentWeeks = Math.floor(daysPregnant / 7);
  const currentDays = daysPregnant % 7;

  // Percentage complete
  const percentProgress = Math.min(100, Math.max(0, (daysPregnant / pregnancyDurationDays) * 100));

  // Trimester category
  let trimester = 'First Trimester (Weeks 1 to 13)';
  let trimesterDetail = 'Essential organs, tissue, and structures develop.';
  if (currentWeeks >= 13 && currentWeeks < 27) {
    trimester = 'Second Trimester (Weeks 14 to 27)';
    trimesterDetail = 'Growth spurt, movement begins, sensory functions mature.';
  } else if (currentWeeks >= 27) {
    trimester = 'Third Trimester (Weeks 28 to 40+)';
    trimesterDetail = 'Weight gain, lung development, preparation for birth.';
  }

  const formatDateString = (d: Date) => {
    return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const copyResults = () => {
    if (!isValidDate) return;
    const text = `Pregnancy Calculator Results:\nLMP Date: ${lmpString}\nEstimated Due Date: ${formatDateString(eddDate)}\nEstimated Conception: ${formatDateString(conceptionDate)}\n\nCurrent Gestational Age: ${currentWeeks} weeks & ${currentDays} days (${daysPregnant} days pregnant)\nProgress: ${percentProgress.toFixed(1)}%\nTrimester Status: ${trimester}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    if (!isValidDate) return;
    const text = `Estimated Pregnancy Due Date: ${formatDateString(eddDate)}. Current Progress: ${percentProgress.toFixed(0)}%.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Pregnancy Due Date Estimator', text: text });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        copyResults();
      }
    } else {
      copyResults();
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleReset = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 4);
    setLmpString(d.toISOString().split('T')[0]);
    setCycleLength(28);
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Pregnancy Details</h3>

        <div className="space-y-4">
          <div>
            <label className={`text-xs font-bold mb-1.5 block uppercase tracking-wider text-slate-400`}>First Day of Last Period (LMP)</label>
            <div className="relative">
              <input
                type="date"
                value={lmpString}
                onChange={(e) => setLmpString(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Average Cycle Length</label>
              <span className="font-mono text-xs text-emerald-500 font-bold">{cycleLength} days</span>
            </div>
            <input
              type="range"
              min="20"
              max="45"
              step="1"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className={`flex-1 py-2 text-xs rounded-xl font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-150'
              }`}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-emerald-950/20 border border-emerald-900/30' : 'bg-emerald-50/40 border border-emerald-100'}`}>
        {isValidDate && (
          <div className="absolute top-0 right-0 p-3 flex gap-2">
            <button
              type="button"
              onClick={copyResults}
              className={`p-2 rounded-full transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <button
              type="button"
              onClick={shareResults}
              className={`p-2 rounded-full transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}
            >
              {shared ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
            </button>
          </div>
        )}

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>GESTATIONAL PROGRESS</h3>

        {!isValidDate ? (
          <div className="text-center py-4 text-xs font-bold text-slate-400">
            Select a valid LMP Date to see progress.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-2">
              <span className={`text-[10px] block font-bold text-slate-400 uppercase tracking-widest`}>Estimated Due Date (EDD)</span>
              <span className={`text-2xl font-black font-display tracking-tight text-emerald-500 mt-1 block`}>
                {formatDateString(eddDate)}
              </span>
              <span className="text-[10px] text-slate-400 block font-semibold mt-1">
                Conception Target: {formatDateString(conceptionDate)}
              </span>
            </div>

            <div className="space-y-2 border-t border-dashed border-emerald-200 dark:border-emerald-900/40 pt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Gestational Age</span>
                <span className="font-mono font-black text-emerald-500">{currentWeeks} weeks, {currentDays} days</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Total Progress</span>
                <span className="font-mono font-black text-emerald-500">{percentProgress.toFixed(1)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="relative pt-1">
                <div className="h-2 rounded-full w-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                  <div style={{ width: `${percentProgress}%` }} className="bg-emerald-500 h-full rounded-full transition-all duration-500"></div>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-2xs'} border border-slate-50 space-y-1`}>
              <span className="text-[10px] block font-black text-emerald-500 uppercase tracking-wider">{trimester}</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{trimesterDetail}</span>
              <span className="text-[9px] text-slate-400 block leading-tight">Average gestational cycle spans 40 weeks, but delivery safely ranges ±14 days around EDD.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   2. OVULATION & FERTILITY CALCULATOR
   ========================================== */
export function OvulationCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [lmpString, setLmpString] = useState<string>(() => {
    // Default to 12 days ago for immediate demonstration of ovulation cycle
    const d = new Date();
    d.setDate(d.getDate() - 12);
    return d.toISOString().split('T')[0];
  });
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const lmpDate = new Date(lmpString);
  const isValidDate = !isNaN(lmpDate.getTime());

  // Ovulation typically occurs 14 days before the next period.
  // Next Period Date = LMP + CycleLength
  // Ovulation Date = Next Period Date - 14 days => LMP + CycleLength - 14
  const nextPeriodDate = new Date(lmpDate);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

  const ovulationDate = new Date(lmpDate);
  ovulationDate.setDate(ovulationDate.getDate() + (cycleLength - 14));

  // Fertile window: Starts 5 days before ovulation and ends 1 day after ovulation.
  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  // Peak fertile window: 2 days before ovulation up to ovulation day
  const peakStart = new Date(ovulationDate);
  peakStart.setDate(peakStart.getDate() - 2);

  // Suggested Pregnancy Test Window: 14 days after ovulation
  const testWindowDate = new Date(ovulationDate);
  testWindowDate.setDate(testWindowDate.getDate() + 14);

  const formatDateString = (d: Date) => {
    return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const copyResults = () => {
    if (!isValidDate) return;
    const text = `Ovulation & Fertility Calculator Results:\nLMP Date: ${lmpString}\nEstimated Next Period: ${formatDateString(nextPeriodDate)}\nEstimated Ovulation Date: ${formatDateString(ovulationDate)}\n\nFertile Window: ${formatDateString(fertileStart)} to ${formatDateString(fertileEnd)}\nPeak Fertile Window: ${formatDateString(peakStart)} to ${formatDateString(ovulationDate)}\nEarliest Safe Pregnancy Test Date: ${formatDateString(testWindowDate)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    if (!isValidDate) return;
    const text = `My Peak Fertility Window: ${formatDateString(peakStart)} to ${formatDateString(ovulationDate)}. Predicted Ovulation: ${formatDateString(ovulationDate)}.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Fertility & Cycle Tracker', text: text });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        copyResults();
      }
    } else {
      copyResults();
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handleReset = () => {
    const d = new Date();
    d.setDate(d.getDate() - 12);
    setLmpString(d.toISOString().split('T')[0]);
    setCycleLength(28);
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Cycle Tracking</h3>

        <div className="space-y-4">
          <div>
            <label className={`text-xs font-bold mb-1.5 block uppercase tracking-wider text-slate-400`}>First Day of Last Period (LMP)</label>
            <input
              type="date"
              value={lmpString}
              onChange={(e) => setLmpString(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Cycle Length</label>
              <span className="font-mono text-xs text-emerald-500 font-bold">{cycleLength} days</span>
            </div>
            <input
              type="range"
              min="22"
              max="40"
              step="1"
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className={`flex-1 py-2 text-xs rounded-xl font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-150'
              }`}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-emerald-950/20 border border-emerald-900/30' : 'bg-emerald-50/40 border border-emerald-100'}`}>
        {isValidDate && (
          <div className="absolute top-0 right-0 p-3 flex gap-2">
            <button
              type="button"
              onClick={copyResults}
              className={`p-2 rounded-full transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            </button>
            <button
              type="button"
              onClick={shareResults}
              className={`p-2 rounded-full transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}
            >
              {shared ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
            </button>
          </div>
        )}

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Predicted Fertile Timeline</h3>

        {!isValidDate ? (
          <div className="text-center py-4 text-xs font-bold text-slate-400">
            Select a valid LMP Date to view cycle.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-2">
              <span className={`text-[10px] block font-bold text-slate-400 uppercase tracking-widest`}>NEXT OVULATION DATE</span>
              <span className={`text-2xl font-black font-display tracking-tight text-emerald-500 mt-1 block`}>
                {formatDateString(ovulationDate)}
              </span>
              <span className="text-[10px] text-slate-400 block font-semibold mt-1">
                Estimated Next Period: {formatDateString(nextPeriodDate)}
              </span>
            </div>

            <div className="pt-2 border-t border-dashed border-emerald-200 dark:border-emerald-900/40 space-y-2">
              <span className="text-[10px] block font-black tracking-widest text-center text-slate-400 uppercase">FERTILITY INTENSITY WINDOWS</span>
              
              <div className="space-y-2">
                <div className={`p-3 rounded-2xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-slate-900/60' : 'bg-white shadow-2xs'}`}>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Sparkles size={14} className="text-teal-500" /> Peak Fertility Window
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">Optimal window for family planning.</span>
                  </div>
                  <span className="font-semibold text-teal-500 text-[11px]">
                    {formatDateString(peakStart).split(',')[1]} - {formatDateString(ovulationDate).split(',')[1]}
                  </span>
                </div>

                <div className={`p-3 rounded-2xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-slate-900/60' : 'bg-white shadow-2xs'}`}>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Flame size={14} className="text-emerald-500" /> Full Fertile Window
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">Viable egg sperm lifecycle coverage.</span>
                  </div>
                  <span className="font-semibold text-emerald-500 text-[11px]">
                    {formatDateString(fertileStart).split(',')[1]} - {formatDateString(fertileEnd).split(',')[1]}
                  </span>
                </div>

                <div className={`p-3 rounded-2xl flex justify-between items-center text-xs ${isDarkMode ? 'bg-slate-900/60' : 'bg-white shadow-2xs'}`}>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Calendar size={14} className="text-blue-500" /> Safe Pregnancy Test Date
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 leading-none">Avoids inaccurate false negatives.</span>
                  </div>
                  <span className="font-mono font-black text-blue-500 text-[11px]">
                    {formatDateString(testWindowDate).split(',')[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
