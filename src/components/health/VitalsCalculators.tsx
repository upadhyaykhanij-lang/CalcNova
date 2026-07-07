/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, Heart, ShieldAlert, Plus, Minus, RotateCcw, Share2 } from 'lucide-react';

/* ==========================================
   1. HEART RATE ZONES CALCULATOR (Karvonen Method)
   ========================================== */
export function HeartRateCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [age, setAge] = useState<number>(25);
  const [restingHr, setRestingHr] = useState<number>(70);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Haskell Max HR: 220 - age
  const maxHr = 220 - age;
  // Heart Rate Reserve: Max HR - Resting HR
  const hrr = maxHr - restingHr;

  const calculateTarget = (intensity: number) => {
    return Math.round((hrr * intensity) + restingHr);
  };

  const zones = [
    {
      num: 1,
      name: 'Recovery & Warm-up',
      intensity: '50% - 60%',
      low: calculateTarget(0.50),
      high: calculateTarget(0.60),
      color: 'bg-sky-400 text-sky-400',
      desc: 'Promotes metabolic recovery & basic conditioning.'
    },
    {
      num: 2,
      name: 'Fat Burning / Aerobic',
      intensity: '60% - 70%',
      low: calculateTarget(0.60),
      high: calculateTarget(0.70),
      color: 'bg-emerald-500 text-emerald-500',
      desc: 'Improves endurance, calorie oxidation, & aerobic base.'
    },
    {
      num: 3,
      name: 'Aerobic / Cardiovascular',
      intensity: '70% - 80%',
      low: calculateTarget(0.70),
      high: calculateTarget(0.80),
      color: 'bg-amber-500 text-amber-500',
      desc: 'Enhances general aerobic power & optimal cardio stamina.'
    },
    {
      num: 4,
      name: 'Anaerobic / Threshold',
      intensity: '80% - 90%',
      low: calculateTarget(0.80),
      high: calculateTarget(0.90),
      color: 'bg-orange-500 text-orange-500',
      desc: 'Elevates anaerobic threshold, speed, & muscular endurance.'
    },
    {
      num: 5,
      name: 'VO2 Max / Redline',
      intensity: '90% - 100%',
      low: calculateTarget(0.90),
      high: maxHr,
      color: 'bg-rose-500 text-rose-500',
      desc: 'Peak aerobic sprint drills. Advised for short burst intervals.'
    }
  ];

  const copyResults = () => {
    const text = `Heart Rate Zones Calculator Results:\nAge: ${age} Years\nResting Heart Rate: ${restingHr} bpm\nMax Heart Rate: ${maxHr} bpm\n\nTarget Intensity Zones:\n${zones.map(z => `- Zone ${z.num} (${z.name}): ${z.low}-${z.high} bpm (${z.intensity})`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Heart Rate Zones: Max ${maxHr} bpm, Rest ${restingHr} bpm. Standard training ranges calculated.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Karvonen Heart Rate Zones', text: text });
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
    setAge(25);
    setRestingHr(70);
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Cardiovascular Vitals</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-bold mb-1 block uppercase tracking-wider text-slate-400`}>Age (yrs)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Math.max(1, Math.min(115, Number(e.target.value))))}
                className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
            <div>
              <label className={`text-xs font-bold mb-1 block uppercase tracking-wider text-slate-400`}>Resting HR (bpm)</label>
              <input
                type="number"
                value={restingHr}
                onChange={(e) => setRestingHr(Math.max(30, Math.min(220, Number(e.target.value))))}
                className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Karvonen Training Zones</h3>

        <div className="space-y-4">
          <div className="text-center py-2 flex justify-around border-b border-emerald-100 dark:border-emerald-900/30 pb-4">
            <div>
              <span className="text-[10px] block font-bold text-slate-400 uppercase">Max Heart Rate</span>
              <span className="text-2xl font-black font-mono text-emerald-500">{maxHr} <span className="text-xs font-semibold text-slate-500">bpm</span></span>
            </div>
            <div>
              <span className="text-[10px] block font-bold text-slate-400 uppercase">Heart Rate Reserve</span>
              <span className="text-2xl font-black font-mono text-emerald-500">{hrr} <span className="text-xs font-semibold text-slate-500">bpm</span></span>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {zones.map((z) => (
              <div key={z.num} className={`p-3 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-50'
              }`}>
                <div className="flex gap-2.5 items-start">
                  <div className={`w-8 h-8 rounded-full ${z.color.split(' ')[0]} text-white flex items-center justify-center font-black text-xs`}>
                    Z{z.num}
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-slate-800 dark:text-slate-100">{z.name}</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">{z.desc}</span>
                  </div>
                </div>

                <div className="text-right md:shrink-0 ml-10 md:ml-0">
                  <span className="text-sm font-black text-emerald-500 font-mono block">
                    {z.low} - {z.high} <span className="text-[10px] font-semibold text-slate-400">bpm</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block">Intensity: {z.intensity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   2. BAC CALCULATOR (Blood Alcohol Content - Widmark)
   ========================================== */
export function BACCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(75);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  
  // Drink quantities
  const [beers, setBeers] = useState<number>(0);  // 330mL, 5%
  const [wines, setWines] = useState<number>(0);  // 150mL, 12%
  const [shots, setShots] = useState<number>(0);  // 45mL, 40%
  
  const [hours, setHours] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Widmark formula Constants
  // BAC = [Alcohol (g) / (BodyWeight (g) * r)] * 100 - Beta * Time
  // r is the distribution coefficient: 0.68 for males, 0.55 for females
  // Beta is the elimination rate: 0.015% per hour
  const r = gender === 'male' ? 0.68 : 0.55;
  const beta = 0.015;

  const activeWeightKg = weightUnit === 'kg' ? weight : weight / 2.20462;
  const bodyWeightGrams = activeWeightKg * 1000;

  // Compute alcohol in grams
  const beerGrams = beers * 330 * 0.05 * 0.8;
  const wineGrams = wines * 150 * 0.12 * 0.8;
  const shotGrams = shots * 45 * 0.40 * 0.8;
  const totalAlcoholGrams = beerGrams + wineGrams + shotGrams;

  let bac = 0;
  let rawBacNoDecay = 0;
  if (bodyWeightGrams > 0) {
    rawBacNoDecay = (totalAlcoholGrams / (bodyWeightGrams * r)) * 100;
    bac = Math.max(0, rawBacNoDecay - (beta * hours));
  }

  // Hours until sober
  const hoursToSober = bac > 0 ? (bac / beta) : 0;

  // Impairment assessments
  let status = 'Sober';
  let statusColor = 'text-emerald-500';
  let bgHighlight = 'bg-emerald-500/10';
  let warningNote = 'You are sober and safe to operate machinery or drive.';

  if (bac > 0 && bac <= 0.04) {
    status = 'Mildly Relaxed / Buzz';
    statusColor = 'text-teal-500';
    bgHighlight = 'bg-teal-500/10';
    warningNote = 'Mild buzz. Reaction time slightly slower. Drive with high caution or avoid.';
  } else if (bac > 0.04 && bac <= 0.08) {
    status = 'Impaired (Legal Limit)';
    statusColor = 'text-amber-500';
    bgHighlight = 'bg-amber-500/10';
    warningNote = 'Close to or above the legal driving threshold in many countries. Do NOT drive.';
  } else if (bac > 0.08 && bac <= 0.15) {
    status = 'Intoxicated (Legally Drunk)';
    statusColor = 'text-orange-500';
    bgHighlight = 'bg-orange-500/10';
    warningNote = 'Significant balance, reaction, and speech impairment. Strictly prohibited to drive.';
  } else if (bac > 0.15) {
    status = 'Severely Intoxicated';
    statusColor = 'text-rose-500';
    bgHighlight = 'bg-rose-500/10';
    warningNote = 'Severe coordinate losses, critical health risk. Advised hydration and sleep immediately.';
  }

  const copyResults = () => {
    const text = `BAC Calculator Results:\nBAC Level: ${bac.toFixed(3)}%\nStatus: ${status}\nHours until Sober: ${hoursToSober.toFixed(1)} hrs\nDrinks consumed: ${beers} Beers, ${wines} Wine glasses, ${shots} Spirits shots\nElapsed Time: ${hours} hours`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Blood Alcohol Estimate: ${bac.toFixed(3)}% (${status}). Hours to 0.00%: ${hoursToSober.toFixed(1)} hrs.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Widmark BAC Estimate', text: text });
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
    setBeers(0);
    setWines(0);
    setShots(0);
    setHours(1);
    setWeight(75);
    setGender('male');
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Widmark BAC parameters</h3>

        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-bold block mb-1 uppercase text-slate-400`}>Gender</label>
              <div className="flex border rounded-lg overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-1 font-bold cursor-pointer transition-colors ${gender === 'male' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-1 font-bold cursor-pointer transition-colors ${gender === 'female' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
                >
                  Female
                </button>
              </div>
            </div>
            <div>
              <label className={`text-[10px] font-bold block mb-1 uppercase text-slate-400`}>Body Weight</label>
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(10, Number(e.target.value)))}
                  className={`w-full px-2 py-1 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as any)}
                  className={`px-1.5 py-1 text-xs font-bold rounded-lg border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-dashed dark:border-slate-800 pt-3">
            <span className="text-[10px] block font-black tracking-widest text-slate-400 uppercase">BEVERAGES CONSUMED</span>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { name: '🍺 Beer', val: beers, set: setBeers, sub: '330mL (5%)' },
                { name: '🍷 Wine', val: wines, set: setWines, sub: '150mL (12%)' },
                { name: '🥃 Shot', val: shots, set: setShots, sub: '45mL (40%)' }
              ].map((item, index) => (
                <div key={index} className={`p-2 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-50'}`}>
                  <span className="text-[10px] block font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                  <span className="text-[9px] text-slate-400 block leading-none">{item.sub}</span>

                  <div className="flex items-center justify-around gap-1 mt-2.5">
                    <button
                      type="button"
                      onClick={() => item.set(Math.max(0, item.val - 1))}
                      className={`p-1 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800`}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-mono text-xs font-black text-slate-900 dark:text-white">{item.val}</span>
                    <button
                      type="button"
                      onClick={() => item.set(item.val + 1)}
                      className={`p-1 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800`}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Time since first drink</label>
              <span className="font-mono text-xs text-emerald-500 font-bold">{hours} hours</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="24"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-2 pt-1">
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>ESTIMATED BAC INTENSITY</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-[10px] block font-bold text-slate-400 uppercase tracking-widest`}>Estimated BAC Level</span>
            <span className={`text-4xl font-black font-display tracking-tight text-emerald-500 block mt-1`}>
              {bac.toFixed(3)}%
            </span>
            <span className={`mt-1.5 block text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full w-fit mx-auto ${bgHighlight} ${statusColor}`}>{status}</span>
          </div>

          <div className="pt-2 border-t border-dashed border-emerald-200 dark:border-emerald-900/40 text-center">
            <span className={`text-[10px] block font-bold text-slate-400 uppercase tracking-widest`}>HOURS UNTIL FULLY SOBER (0.00% BAC)</span>
            <span className={`text-xl font-black font-mono text-slate-900 dark:text-white mt-0.5 block`}>
              {hoursToSober.toFixed(1)} <span className="text-xs font-bold">hours</span>
            </span>
          </div>

          <div className={`p-3 rounded-2xl ${bgHighlight} text-xs leading-relaxed text-center font-bold flex gap-2 items-start ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <ShieldAlert size={16} className={`shrink-0 mt-0.5 ${statusColor}`} />
            <span>{warningNote}</span>
          </div>

          <p className="text-[9px] text-slate-400 leading-normal text-center italic">
            Widmark Calculations represent physiological approximations only. Metabolic clearance rates differ heavily based on enzymatic indices, food intake, and biological profiles. Always secure safe transport.
          </p>
        </div>
      </div>
    </div>
  );
}
