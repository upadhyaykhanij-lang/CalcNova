/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, Calendar, Clock } from 'lucide-react';

/* ==========================================
   1. DATE DIFFERENCE CALCULATOR
   ========================================== */
export function DateDifference({ isDarkMode }: { isDarkMode: boolean }) {
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);

  const [diffDays, setDiffDays] = useState(0);
  const [diffWeeks, setDiffWeeks] = useState(0);
  const [diffMonths, setDiffMonths] = useState(0);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setDiffDays(0);
      setDiffWeeks(0);
      setDiffMonths(0);
      return;
    }

    let extraFactor = includeEndDay ? 1 : 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + extraFactor;

    setDiffDays(totalDays);
    setDiffWeeks(parseFloat((totalDays / 7).toFixed(1)));
    setDiffMonths(parseFloat((totalDays / 30.437).toFixed(1)));
  }, [startDate, endDate, includeEndDay]);

  const copyResults = () => {
    const text = `Date Difference Results:\nStart: ${startDate}\nEnd: ${endDate}\nInclude End Day: ${includeEndDay ? 'Yes' : 'No'}\n\nDifference: ${diffDays} Days\nEquivalent: ${diffWeeks} Weeks / ${diffMonths} Months`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>CALENDAR SPECIFICATION</h3>

        <div className="space-y-4">
          <div>
            <label className={`text-sm font-medium block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
            />
          </div>

          <div>
            <label className={`text-sm font-medium block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t dark:border-slate-800">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Include Last/End Date (+1 Day)</span>
            <input
              type="checkbox"
              checked={includeEndDay}
              onChange={(e) => setIncludeEndDay(e.target.checked)}
              className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        <div className="absolute top-0 right-0 p-3">
          <button
            onClick={copyResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>DURATION ANALYSIS</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL CALENDAR DIFFERENCE</span>
            <span className={`text-3xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
              {diffDays} Days
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs text-center">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Weeks</span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {diffWeeks} weeks
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Months</span>
              <span className={`text-sm font-bold font-mono text-emerald-500`}>
                {diffMonths} months
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   2. WORKING DAYS CALCULATOR
   ========================================== */
export function WorkdaysCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-01-31');
  const [weekendRule, setWeekendRule] = useState<'sat_sun' | 'sun_only'>('sat_sun');
  const [copied, setCopied] = useState(false);

  const [totalDays, setTotalDays] = useState(0);
  const [workdays, setWorkdays] = useState(0);
  const [weekends, setWeekends] = useState(0);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setTotalDays(0);
      setWorkdays(0);
      setWeekends(0);
      return;
    }

    let current = new Date(start);
    let workCount = 0;
    let weekendCount = 0;
    let daysCount = 0;

    while (current <= end) {
      daysCount++;
      const day = current.getDay(); // 0 = Sunday, 6 = Saturday
      
      let isWeekend = false;
      if (weekendRule === 'sat_sun') {
        isWeekend = (day === 0 || day === 6);
      } else {
        isWeekend = (day === 0);
      }

      if (isWeekend) {
        weekendCount++;
      } else {
        workCount++;
      }

      current.setDate(current.getDate() + 1);
    }

    setTotalDays(daysCount);
    setWorkdays(workCount);
    setWeekends(weekendCount);

  }, [startDate, endDate, weekendRule]);

  const copyResults = () => {
    const text = `Workdays Results:\nStart: ${startDate}\nEnd: ${endDate}\nWeekend Filter: ${weekendRule === 'sat_sun' ? 'Saturday + Sunday' : 'Sunday Only'}\n\nTotal Days: ${totalDays}\nWork Days: ${workdays}\nWeekend Days: ${weekends}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>BUSINESS DATE RANGE</h3>

        <div className="space-y-4">
          <div>
            <label className={`text-sm font-medium block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
            />
          </div>

          <div>
            <label className={`text-sm font-medium block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
            />
          </div>

          <div>
            <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Weekend Definitions</label>
            <div className="flex border rounded-lg overflow-hidden text-xs">
              <button
                onClick={() => setWeekendRule('sat_sun')}
                className={`flex-1 py-1.5 font-semibold cursor-pointer ${weekendRule === 'sat_sun' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                Sat + Sun Weekend
              </button>
              <button
                onClick={() => setWeekendRule('sun_only')}
                className={`flex-1 py-1.5 font-semibold cursor-pointer ${weekendRule === 'sun_only' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                Sunday Only
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        <div className="absolute top-0 right-0 p-3">
          <button
            onClick={copyResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>BUSINESS WORK DAYS</h3>

        <div className="space-y-4 text-center">
          <div className="py-2">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL WORKING BUSINESS DAYS</span>
            <span className={`text-4xl font-extrabold font-display tracking-tight text-emerald-500 block`}>
              {workdays} Days
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Calendar Days</span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {totalDays} days
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Weekend Holidays</span>
              <span className={`text-sm font-bold font-mono text-rose-400`}>
                {weekends} days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   3. TIME DIFFERENCE CALCULATOR
   ========================================== */
export function TimeDifferenceCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [tab, setTab] = useState<'duration' | 'offset'>('duration');
  const [copied, setCopied] = useState(false);

  // Tab 1: Duration between times
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:30');
  const [nextDay, setNextDay] = useState<boolean>(false);

  // Tab 2: Add / Subtract offset
  const [baseTime, setBaseTime] = useState<string>('12:00');
  const [offsetHours, setOffsetHours] = useState<number>(2);
  const [offsetMinutes, setOffsetMinutes] = useState<number>(30);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  // Outputs
  const [durationHours, setDurationHours] = useState(0);
  const [durationMins, setDurationMins] = useState(0);
  const [durationDecimal, setDurationDecimal] = useState(0);
  const [resultingTime, setResultingTime] = useState('');

  // Calculate Duration
  useEffect(() => {
    if (!startTime || !endTime) return;

    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);

    let startTotal = sH * 60 + sM;
    let endTotal = eH * 60 + eM;

    if (nextDay || endTotal < startTotal) {
      endTotal += 24 * 60; // Add 24 hours
    }

    const diffMinsTotal = endTotal - startTotal;
    const hrs = Math.floor(diffMinsTotal / 60);
    const mins = diffMinsTotal % 60;

    setDurationHours(hrs);
    setDurationMins(mins);
    setDurationDecimal(parseFloat((diffMinsTotal / 60).toFixed(2)));
  }, [startTime, endTime, nextDay]);

  // Calculate Offset Result
  useEffect(() => {
    if (!baseTime) return;

    const [bH, bM] = baseTime.split(':').map(Number);
    let baseTotal = bH * 60 + bM;
    const offsetTotal = offsetHours * 60 + offsetMinutes;

    let finalTotal = baseTotal;
    if (operation === 'add') {
      finalTotal += offsetTotal;
    } else {
      finalTotal -= offsetTotal;
    }

    // Normalize with modulo 24 hours
    finalTotal = finalTotal % (24 * 60);
    if (finalTotal < 0) {
      finalTotal += 24 * 60;
    }

    const fH = Math.floor(finalTotal / 60);
    const fM = finalTotal % 60;

    // Format beautifully as 12-hour AM/PM
    const ampm = fH >= 12 ? 'PM' : 'AM';
    const displayHour = fH % 12 === 0 ? 12 : fH % 12;
    const displayMins = fM < 10 ? `0${fM}` : fM;

    setResultingTime(`${displayHour}:${displayMins} ${ampm} (${fH < 10 ? '0' + fH : fH}:${fM < 10 ? '0' + fM : fM})`);
  }, [baseTime, offsetHours, offsetMinutes, operation]);

  const copyResults = () => {
    let text = '';
    if (tab === 'duration') {
      text = `Time Duration Results:\nFrom: ${startTime}\nTo: ${endTime} ${nextDay ? '(Next Day)' : ''}\n\nDuration: ${durationHours} hours and ${durationMins} minutes (${durationDecimal} decimal hours)`;
    } else {
      text = `Time Calculation Results:\nBase Time: ${baseTime}\nOffset: ${operation === 'add' ? '+' : '-'}${offsetHours}h ${offsetMinutes}m\n\nResult: ${resultingTime}`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Sub tabs */}
      <div className="flex border-b dark:border-slate-800">
        {[
          { id: 'duration', label: 'Time Duration' },
          { id: 'offset', label: 'Add/Subtract Offset' }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as any)}
            className={`flex-1 pb-2.5 pt-1 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? 'text-blue-400' : 'text-primary'}`}>
          {tab === 'duration' ? 'Calculate duration' : 'Calculate time offset'}
        </h3>

        {tab === 'duration' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-bold block mb-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
              <div>
                <label className={`text-xs font-bold block mb-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t dark:border-slate-800">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Ends on Next Day</span>
              <input
                type="checkbox"
                checked={nextDay}
                onChange={(e) => setNextDay(e.target.checked)}
                className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-bold block mb-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Base Time</label>
                <input
                  type="time"
                  value={baseTime}
                  onChange={(e) => setBaseTime(e.target.value)}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
              <div>
                <label className={`text-xs font-bold block mb-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Operation</label>
                <div className="flex border rounded-xl overflow-hidden text-xs h-9">
                  <button
                    type="button"
                    onClick={() => setOperation('add')}
                    className={`flex-1 font-bold cursor-pointer transition-colors ${operation === 'add' ? 'bg-primary text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
                  >
                    Add (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperation('subtract')}
                    className={`flex-1 font-bold cursor-pointer transition-colors ${operation === 'subtract' ? 'bg-primary text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
                  >
                    Sub (-)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-bold block mb-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Offset Hours</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={offsetHours}
                  onChange={(e) => setOffsetHours(Math.max(0, Number(e.target.value)))}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
              <div>
                <label className={`text-xs font-bold block mb-1 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Offset Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={offsetMinutes}
                  onChange={(e) => setOffsetMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Outcome box */}
      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        <div className="absolute top-0 right-0 p-3">
          <button
            onClick={copyResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-primary'}`}>
          Outcome Analyzed
        </h3>

        <div className="text-center py-4">
          {tab === 'duration' ? (
            <div className="space-y-3">
              <span className={`text-xs block font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Duration Difference
              </span>
              <span className="text-4xl font-black font-display tracking-tight text-blue-500 dark:text-blue-400 block">
                {durationHours}h {durationMins}m
              </span>
              <p className="text-[11px] text-slate-500 font-bold uppercase">
                Equivalent to {durationDecimal} decimal hours
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <span className={`text-xs block font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Resulting Future Time
              </span>
              <span className="text-3xl font-black font-display tracking-tight text-emerald-500 block">
                {resultingTime}
              </span>
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed max-w-xs mx-auto">
                Time calculated by {operation === 'add' ? 'advancing' : 'regressing'} {baseTime} by {offsetHours} hours and {offsetMinutes} minutes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

