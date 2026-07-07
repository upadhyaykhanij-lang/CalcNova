/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, Scale, Heart, Flame, Dumbbell, AlertTriangle, Share2, RotateCcw } from 'lucide-react';

/* ==========================================
   1. BMI CALCULATOR (With Reset and Improved UI)
   ========================================== */
export function BMICalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);
  
  // Imperial fields
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Sync conversions on unit systems
  useEffect(() => {
    if (unitSystem === 'metric') {
      const w = Math.round(weightLbs * 0.453592);
      const h = Math.round((heightFt * 12 + heightIn) * 2.54);
      setWeightKg(w);
      setHeightCm(h);
    } else {
      const lbs = Math.round(weightKg * 2.20462);
      const totalInches = heightCm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inch = Math.round(totalInches % 12);
      setWeightLbs(lbs);
      setHeightFt(ft);
      setHeightIn(inch);
    }
  }, [unitSystem]);

  // Validation Warnings
  const weightWarning = unitSystem === 'metric'
    ? (weightKg <= 10 ? 'Weight must be greater than 10 kg' : weightKg > 400 ? 'Max weight is 400 kg' : null)
    : (weightLbs <= 20 ? 'Weight must be greater than 20 lbs' : weightLbs > 900 ? 'Max weight is 900 lbs' : null);

  const heightWarning = unitSystem === 'metric'
    ? (heightCm <= 50 ? 'Height must be greater than 50 cm' : heightCm > 300 ? 'Max height is 300 cm' : null)
    : (heightFt * 12 + heightIn <= 20 ? 'Height must be greater than 20 inches' : heightFt * 12 + heightIn > 120 ? 'Max height is 10 feet' : null);

  // Sanitized values
  const validWeightKg = Math.max(1, weightKg);
  const validHeightCm = Math.max(1, heightCm);
  const validWeightLbs = Math.max(1, weightLbs);

  let bmi = 0;
  if (unitSystem === 'metric') {
    const heightM = validHeightCm / 100;
    if (heightM > 0) bmi = validWeightKg / (heightM * heightM);
  } else {
    const totalInches = heightFt * 12 + heightIn;
    if (totalInches > 0) bmi = (validWeightLbs / (totalInches * totalInches)) * 703;
  }

  // Categories
  let category = 'Normal';
  let color = 'text-emerald-500';
  let barColor = 'bg-emerald-500';
  let bgHighlight = 'bg-emerald-500/10';
  let description = 'You have a healthy body weight. Maintain with physical activity!';
  let minIdeal = 0;
  let maxIdeal = 0;

  if (unitSystem === 'metric') {
    minIdeal = 18.5 * Math.pow(validHeightCm / 100, 2);
    maxIdeal = 24.9 * Math.pow(validHeightCm / 100, 2);
  } else {
    const totInches = heightFt * 12 + heightIn;
    minIdeal = (18.5 * Math.pow(totInches, 2)) / 703;
    maxIdeal = (24.9 * Math.pow(totInches, 2)) / 703;
  }

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-sky-500';
    barColor = 'bg-sky-400';
    bgHighlight = 'bg-sky-400/10';
    description = 'Underweight score. Consider checking nutritional balances.';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal weight';
    color = 'text-emerald-500';
    barColor = 'bg-emerald-500';
    bgHighlight = 'bg-emerald-500/10';
    description = 'Great shape! Your weight matches your height perfectly.';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    color = 'text-amber-500';
    barColor = 'bg-amber-500';
    bgHighlight = 'bg-amber-500/10';
    description = 'Mild overweight classification. Consider mild workout revisions.';
  } else {
    category = 'Obese';
    color = 'text-rose-500';
    barColor = 'bg-rose-500';
    bgHighlight = 'bg-rose-500/10';
    description = 'Obese classification. Health advice or nutrition guidance suggested.';
  }

  const copyResults = () => {
    const weightStr = unitSystem === 'metric' ? `${validWeightKg} kg` : `${validWeightLbs} lbs`;
    const heightStr = unitSystem === 'metric' ? `${validHeightCm} cm` : `${heightFt} ft ${heightIn} in`;
    const idealStr = `${minIdeal.toFixed(1)} to ${maxIdeal.toFixed(1)} ${unitSystem === 'metric' ? 'kg' : 'lbs'}`;
    const text = `BMI Calculator Results:\nHeight: ${heightStr}\nWeight: ${weightStr}\nBMI Score: ${bmi.toFixed(1)}\nCategory: ${category}\nIdeal Weight Range: ${idealStr}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const weightStr = unitSystem === 'metric' ? `${validWeightKg} kg` : `${validWeightLbs} lbs`;
    const heightStr = unitSystem === 'metric' ? `${validHeightCm} cm` : `${heightFt} ft ${heightIn} in`;
    const idealStr = `${minIdeal.toFixed(1)} to ${maxIdeal.toFixed(1)} ${unitSystem === 'metric' ? 'kg' : 'lbs'}`;
    const text = `BMI Calculator Results:\nHeight: ${heightStr}\nWeight: ${weightStr}\nBMI Score: ${bmi.toFixed(1)}\nCategory: ${category}\nIdeal Weight Range: ${idealStr}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'BMI Calculation', text: text });
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
    if (unitSystem === 'metric') {
      setWeightKg(70);
      setHeightCm(175);
    } else {
      setWeightLbs(154);
      setHeightFt(5);
      setHeightIn(9);
    }
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-slate-800">
          <h3 className={`text-xs font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Unit System</h3>
          <div className="flex border rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1 font-semibold cursor-pointer ${unitSystem === 'metric' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Metric
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1 font-semibold cursor-pointer ${unitSystem === 'imperial' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Imperial
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {unitSystem === 'metric' ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Height (cm)</label>
                  <span className="font-mono text-xs text-emerald-500 font-bold">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="250"
                  step="1"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${
                    heightWarning ? 'border-rose-500 focus:ring-rose-500' : 'focus:ring-emerald-500'
                  } ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'}`}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Weight (kg)</label>
                  <span className="font-mono text-xs text-emerald-500 font-bold">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="200"
                  step="1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${
                    weightWarning ? 'border-rose-500 focus:ring-rose-500' : 'focus:ring-emerald-500'
                  } ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'}`}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Height (Feet & Inches)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="3"
                      max="8"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Number(e.target.value))}
                      className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                    />
                    <span className="text-xs font-bold">Ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(Number(e.target.value))}
                      className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                    />
                    <span className="text-xs font-bold">In</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Weight (lbs)</label>
                  <span className="font-mono text-xs text-emerald-500 font-bold">{weightLbs} lbs</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="450"
                  step="2"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'}`}
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className={`flex-1 py-2 text-xs rounded-xl font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-150'
              }`}
            >
              <RotateCcw size={14} /> Reset Values
            </button>
          </div>
        </div>
      </div>

      {/* Results Display */}
      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-emerald-950/20 border border-emerald-900/30' : 'bg-emerald-50/40 border border-emerald-100'}`}>
        <div className="absolute top-0 right-0 p-3 flex gap-2">
          <button
            type="button"
            onClick={copyResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}
            title="Copy Results"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
          <button
            type="button"
            onClick={shareResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}
            title="Share Results"
          >
            {shared ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>BMI HEALTH STATUS</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>YOUR BMI SCORE</span>
            <span className={`text-4xl font-extrabold font-display tracking-tight ${color}`}>
              {bmi.toFixed(1)}
            </span>
            <span className={`mt-1 block text-sm font-bold ${color}`}>{category}</span>
          </div>

          {/* Indicator slider */}
          <div className="relative pt-2">
            <div className="h-2 rounded-full w-full bg-slate-200 dark:bg-slate-850 flex overflow-hidden">
              <div className="w-[18.5%] bg-sky-400 h-full"></div>
              <div className="w-[25%] bg-emerald-500 h-full"></div>
              <div className="w-[15%] bg-amber-500 h-full"></div>
              <div className="flex-1 bg-rose-500 h-full"></div>
            </div>
            <div 
              style={{ left: `${Math.min(95, Math.max(5, (bmi / 40) * 100))}%` }}
              className="absolute -top-1 w-3 h-4 bg-emerald-600 dark:bg-white rounded-sm border border-black shadow-xs transform -translate-x-1/2"
            ></div>
            <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-1">
              <span>15</span>
              <span>18.5 (Normal)</span>
              <span>25 (Overweight)</span>
              <span>30 (Obese)</span>
              <span>40</span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl ${bgHighlight} text-xs leading-relaxed text-center font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {description}
          </div>

          <div className="pt-2 border-t border-dashed border-emerald-200 dark:border-emerald-900/40 text-center">
            <span className={`text-[11px] block font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>HEALTHY IDEAL RANGE FOR YOUR HEIGHT</span>
            <span className={`text-sm font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-850'}`}>
              {minIdeal.toFixed(1)} - {maxIdeal.toFixed(1)} {unitSystem === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   2. BMR CALCULATOR (With Improved Logic & Imperial)
   ========================================== */
export function BMRCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState<number>(25);
  
  // Metric Inputs
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);
  
  // Imperial Inputs
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);

  const [copied, setCopied] = useState(false);

  // Sync conversions
  useEffect(() => {
    if (unitSystem === 'metric') {
      const w = Math.round(weightLbs * 0.453592);
      const h = Math.round((heightFt * 12 + heightIn) * 2.54);
      setWeightKg(w);
      setHeightCm(h);
    } else {
      const lbs = Math.round(weightKg * 2.20462);
      const totalInches = heightCm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inch = Math.round(totalInches % 12);
      setWeightLbs(lbs);
      setHeightFt(ft);
      setHeightIn(inch);
    }
  }, [unitSystem]);

  const activeWeight = unitSystem === 'metric' ? weightKg : weightLbs * 0.453592;
  const activeHeight = unitSystem === 'metric' ? heightCm : (heightFt * 12 + heightIn) * 2.54;

  // Mifflin-St Jeor equation: BMR = 10*wt + 6.25*ht - 5*age + s (+5 male, -161 female)
  const s = gender === 'male' ? 5 : -161;
  const bmr = 10 * activeWeight + 6.25 * activeHeight - 5 * age + s;

  const calorieRates = [
    { activity: 'Basal Metabolism (BMR)', factor: 1.0, desc: 'Calories to sustain life functions at rest.' },
    { activity: 'Sedentary', factor: 1.2, desc: 'Little/no active workout, desk job.' },
    { activity: 'Lightly Active', factor: 1.375, desc: 'Light workouts 1-3 times per week.' },
    { activity: 'Moderately Active', factor: 1.55, desc: 'Active workout sessions 3-5 days/week.' },
    { activity: 'Very Active', factor: 1.725, desc: 'Intensive sport drills 6-7 days/week.' },
    { activity: 'Extremely Active', factor: 1.9, desc: 'Heavy daily physical labor or athletic drills.' }
  ];

  const copyResults = () => {
    const text = `BMR Calculator Results:\nGender: ${gender}\nAge: ${age} Years\nBMR: ${bmr.toFixed(0)} kcal/day\n\nDaily Calorie Needs:\n- Sedentary: ${(bmr * 1.2).toFixed(0)} kcal\n- Moderately Active: ${(bmr * 1.55).toFixed(0)} kcal\n- Very Active: ${(bmr * 1.725).toFixed(0)} kcal`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setAge(25);
    setGender('male');
    if (unitSystem === 'metric') {
      setWeightKg(70);
      setHeightCm(175);
    } else {
      setWeightLbs(154);
      setHeightFt(5);
      setHeightIn(9);
    }
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-slate-800">
          <h3 className={`text-xs font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>BMR METRICS</h3>
          <div className="flex border rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1 font-semibold cursor-pointer ${unitSystem === 'metric' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Metric
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1 font-semibold cursor-pointer ${unitSystem === 'imperial' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Imperial
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`text-xs font-bold block mb-1.5 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Gender</label>
            <div className="flex border rounded-lg overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-1.5 font-bold cursor-pointer transition-colors ${gender === 'male' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-1.5 font-bold cursor-pointer transition-colors ${gender === 'female' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={`text-[10px] font-bold mb-1 block uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Age (yrs)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Math.max(1, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
            {unitSystem === 'metric' ? (
              <>
                <div>
                  <label className={`text-[10px] font-bold mb-1 block uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(10, Number(e.target.value)))}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-bold mb-1 block uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(10, Number(e.target.value)))}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={`text-[10px] font-bold mb-1 block uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Weight (lbs)</label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Math.max(10, Number(e.target.value)))}
                    className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                  />
                </div>
                <div className="flex gap-1">
                  <div>
                    <label className={`text-[9px] font-bold mb-1 block uppercase text-slate-400`}>Ft</label>
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Math.max(1, Number(e.target.value)))}
                      className={`w-full px-1.5 py-1.5 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] font-bold mb-1 block uppercase text-slate-400`}>In</label>
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(Math.max(0, Math.min(11, Number(e.target.value))))}
                      className={`w-full px-1.5 py-1.5 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                    />
                  </div>
                </div>
              </>
            )}
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
        <div className="absolute top-0 right-0 p-3">
          <button
            type="button"
            onClick={copyResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'}`}
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>BMR METABOLISM STATUS</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>BASAL METABOLIC RATE (BMR)</span>
            <span className={`text-3xl font-black font-display tracking-tight text-emerald-500 mt-1 block`}>
              {bmr.toFixed(0)} <span className="text-sm font-medium">kcal/day</span>
            </span>
          </div>

          <div className="pt-2 border-t border-dashed border-emerald-200 dark:border-emerald-900/40">
            <span className="text-[10px] block font-black tracking-widest mb-3 text-slate-400 text-center">DAILY REQUIREMENTS BASED ON ACTIVITY</span>
            <div className="space-y-2">
              {calorieRates.map((item, idx) => (
                <div key={idx} className={`flex justify-between items-center p-2 rounded-xl text-xs ${idx === 0 ? (isDarkMode ? 'bg-slate-800/60 font-bold' : 'bg-slate-100 font-bold') : ''}`}>
                  <div>
                    <span className={`block font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.activity}</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">{item.desc}</span>
                  </div>
                  <span className={`font-mono font-black ${idx === 0 ? 'text-emerald-500' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {(bmr * item.factor).toFixed(0)} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   3. BODY FAT CALCULATOR (US Navy Method)
   ========================================== */
export function BodyFatCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState<number>(25);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [weightLbs, setWeightLbs] = useState<number>(165);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [heightIn, setHeightIn] = useState<number>(69);

  // Circumferences (US Navy requires Neck, Waist, and Hip for female)
  const [neckCm, setNeckCm] = useState<number>(38);
  const [waistCm, setWaistCm] = useState<number>(85);
  const [hipCm, setHipCm] = useState<number>(95); // Female only

  const [neckIn, setNeckIn] = useState<number>(15);
  const [waistIn, setWaistIn] = useState<number>(33.5);
  const [hipIn, setHipIn] = useState<number>(37.5); // Female only

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Sync metrics
  useEffect(() => {
    if (unitSystem === 'metric') {
      setWeightKg(Math.round(weightLbs * 0.453592));
      setHeightCm(Math.round(heightIn * 2.54));
      setNeckCm(Math.round(neckIn * 2.54 * 10) / 10);
      setWaistCm(Math.round(waistIn * 2.54 * 10) / 10);
      setHipCm(Math.round(hipIn * 2.54 * 10) / 10);
    } else {
      setWeightLbs(Math.round(weightKg * 2.20462));
      setHeightIn(Math.round((heightCm / 2.54) * 10) / 10);
      setNeckIn(Math.round((neckCm / 2.54) * 10) / 10);
      setWaistIn(Math.round((waistCm / 2.54) * 10) / 10);
      setHipIn(Math.round((hipCm / 2.54) * 10) / 10);
    }
  }, [unitSystem]);

  // Variables in inches for Navy formula
  const activeHeightIn = unitSystem === 'metric' ? heightCm / 2.54 : heightIn;
  const activeNeckIn = unitSystem === 'metric' ? neckCm / 2.54 : neckIn;
  const activeWaistIn = unitSystem === 'metric' ? waistCm / 2.54 : waistIn;
  const activeHipIn = unitSystem === 'metric' ? hipCm / 2.54 : hipIn;
  const activeWeightKg = unitSystem === 'metric' ? weightKg : weightLbs * 0.453592;

  // Navy Formulas:
  let bodyFat = 0;
  let validationError: string | null = null;

  if (gender === 'male') {
    if (activeWaistIn <= activeNeckIn) {
      validationError = 'Waist must be larger than Neck circumference.';
    } else {
      bodyFat = 86.010 * Math.log10(activeWaistIn - activeNeckIn) - 70.041 * Math.log10(activeHeightIn) + 36.76;
    }
  } else {
    if (activeWaistIn + activeHipIn <= activeNeckIn) {
      validationError = 'Waist + Hip must be larger than Neck.';
    } else {
      bodyFat = 163.205 * Math.log10(activeWaistIn + activeHipIn - activeNeckIn) - 97.684 * Math.log10(activeHeightIn) - 78.387;
    }
  }

  // Bound Body Fat percentages logically
  if (bodyFat < 2) bodyFat = 2;
  if (bodyFat > 60) bodyFat = 60;

  // Fat mass vs lean mass
  const fatMassKg = activeWeightKg * (bodyFat / 100);
  const leanMassKg = activeWeightKg - fatMassKg;

  // Convert for outputs
  const fatMass = unitSystem === 'metric' ? `${fatMassKg.toFixed(1)} kg` : `${(fatMassKg * 2.20462).toFixed(1)} lbs`;
  const leanMass = unitSystem === 'metric' ? `${leanMassKg.toFixed(1)} kg` : `${(leanMassKg * 2.20462).toFixed(1)} lbs`;

  // Categories based on ACE charts
  let category = 'Fitness';
  let catColor = 'text-emerald-500';
  let bgHighlight = 'bg-emerald-500/10';
  
  if (gender === 'male') {
    if (bodyFat <= 5) { category = 'Essential Fat'; catColor = 'text-sky-500'; bgHighlight = 'bg-sky-500/10'; }
    else if (bodyFat <= 13) { category = 'Athlete'; catColor = 'text-teal-500'; bgHighlight = 'bg-teal-500/10'; }
    else if (bodyFat <= 17) { category = 'Fitness'; catColor = 'text-emerald-500'; bgHighlight = 'bg-emerald-500/10'; }
    else if (bodyFat <= 24) { category = 'Average'; catColor = 'text-amber-500'; bgHighlight = 'bg-amber-500/10'; }
    else { category = 'Obese'; catColor = 'text-rose-500'; bgHighlight = 'bg-rose-500/10'; }
  } else {
    if (bodyFat <= 13) { category = 'Essential Fat'; catColor = 'text-sky-500'; bgHighlight = 'bg-sky-500/10'; }
    else if (bodyFat <= 20) { category = 'Athlete'; catColor = 'text-teal-500'; bgHighlight = 'bg-teal-500/10'; }
    else if (bodyFat <= 24) { category = 'Fitness'; catColor = 'text-emerald-500'; bgHighlight = 'bg-emerald-500/10'; }
    else if (bodyFat <= 31) { category = 'Average'; catColor = 'text-amber-500'; bgHighlight = 'bg-amber-500/10'; }
    else { category = 'Obese'; catColor = 'text-rose-500'; bgHighlight = 'bg-rose-500/10'; }
  }

  const copyResults = () => {
    if (validationError) return;
    const text = `Body Fat Calculator Results (US Navy Method):\nGender: ${gender} | Age: ${age} Years\nBody Fat Percentage: ${bodyFat.toFixed(1)}%\nCategory: ${category}\nLean Body Mass: ${leanMass}\nFat Mass: ${fatMass}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    if (validationError) return;
    const text = `Body Fat Calculator Results (US Navy Method):\nGender: ${gender} | Age: ${age} Years\nBody Fat Percentage: ${bodyFat.toFixed(1)}%\nCategory: ${category}\nLean Body Mass: ${leanMass}\nFat Mass: ${fatMass}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Body Fat Composition', text: text });
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
    setGender('male');
    if (unitSystem === 'metric') {
      setWeightKg(75);
      setHeightCm(175);
      setNeckCm(38);
      setWaistCm(85);
      setHipCm(95);
    } else {
      setWeightLbs(165);
      setHeightIn(69);
      setNeckIn(15);
      setWaistIn(33.5);
      setHipIn(37.5);
    }
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-slate-800">
          <h3 className={`text-xs font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Navy Body Fat</h3>
          <div className="flex border rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1 font-semibold cursor-pointer ${unitSystem === 'metric' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Metric
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1 font-semibold cursor-pointer ${unitSystem === 'imperial' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Imperial
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className={`text-xs font-bold block mb-1 uppercase text-slate-400`}>Gender</label>
            <div className="flex border rounded-lg overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-1.5 font-bold cursor-pointer transition-colors ${gender === 'male' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-1.5 font-bold cursor-pointer transition-colors ${gender === 'female' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                Female
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-0.5`}>Age (yrs)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Math.max(1, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
            <div>
              <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-0.5`}>Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</label>
              <input
                type="number"
                value={unitSystem === 'metric' ? weightKg : weightLbs}
                onChange={(e) => unitSystem === 'metric' ? setWeightKg(Math.max(10, Number(e.target.value))) : setWeightLbs(Math.max(10, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-0.5`}>Height ({unitSystem === 'metric' ? 'cm' : 'inches'})</label>
              <input
                type="number"
                step="0.5"
                value={unitSystem === 'metric' ? heightCm : heightIn}
                onChange={(e) => unitSystem === 'metric' ? setHeightCm(Math.max(30, Number(e.target.value))) : setHeightIn(Math.max(10, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
            <div>
              <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-0.5`}>Neck ({unitSystem === 'metric' ? 'cm' : 'inches'})</label>
              <input
                type="number"
                step="0.1"
                value={unitSystem === 'metric' ? neckCm : neckIn}
                onChange={(e) => unitSystem === 'metric' ? setNeckCm(Math.max(10, Number(e.target.value))) : setNeckIn(Math.max(3, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-0.5`}>Waist ({unitSystem === 'metric' ? 'cm' : 'inches'})</label>
              <input
                type="number"
                step="0.1"
                value={unitSystem === 'metric' ? waistCm : waistIn}
                onChange={(e) => unitSystem === 'metric' ? setWaistCm(Math.max(20, Number(e.target.value))) : setWaistIn(Math.max(5, Number(e.target.value)))}
                className={`w-full px-3 py-1.5 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
            {gender === 'female' ? (
              <div>
                <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-0.5`}>Hip ({unitSystem === 'metric' ? 'cm' : 'inches'})</label>
                <input
                  type="number"
                  step="0.1"
                  value={unitSystem === 'metric' ? hipCm : hipIn}
                  onChange={(e) => unitSystem === 'metric' ? setHipCm(Math.max(20, Number(e.target.value))) : setHipIn(Math.max(5, Number(e.target.value)))}
                  className={`w-full px-3 py-1.5 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase pt-5">
                Hip not required for Men
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
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
        {!validationError && (
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>BODY COMPOSITION DETAILS</h3>

        {validationError ? (
          <div className="flex items-start gap-2 p-3 rounded-2xl bg-rose-500/10 text-rose-500 text-xs font-bold leading-relaxed">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{validationError}</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-2">
              <span className={`text-xs block font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>BODY FAT PERCENTAGE</span>
              <span className={`text-4xl font-black font-display tracking-tight text-emerald-500 mt-1 block`}>
                {bodyFat.toFixed(1)}%
              </span>
              <span className={`mt-1.5 block text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full w-fit mx-auto ${bgHighlight} ${catColor}`}>{category}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-emerald-200 dark:border-emerald-900/40 grid grid-cols-2 gap-3 text-center">
              <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'}`}>
                <span className="text-[10px] block font-bold text-slate-400 uppercase">Lean Body Mass</span>
                <span className="text-sm font-black font-mono text-emerald-500 block mt-0.5">{leanMass}</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100'}`}>
                <span className="text-[10px] block font-bold text-slate-400 uppercase">Fat Body Mass</span>
                <span className="text-sm font-black font-mono text-rose-500 block mt-0.5">{fatMass}</span>
              </div>
            </div>

            <p className="text-[9px] text-slate-400 leading-normal text-center italic">
              Estimated using US Navy Circumference metrics. Standard accuracy ±3-4% margin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   4. IDEAL WEIGHT CALCULATOR
   ========================================== */
export function IdealWeightCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Convert heights
  useEffect(() => {
    if (unitSystem === 'metric') {
      const h = Math.round((heightFt * 12 + heightIn) * 2.54);
      setHeightCm(h);
    } else {
      const totalInches = heightCm / 2.54;
      const ft = Math.floor(totalInches / 12);
      const inch = Math.round(totalInches % 12);
      setHeightFt(ft);
      setHeightIn(inch);
    }
  }, [unitSystem]);

  const activeHeightCm = unitSystem === 'metric' ? heightCm : (heightFt * 12 + heightIn) * 2.54;
  const inchesOver5Ft = Math.max(0, (activeHeightCm / 2.54) - 60);

  // Formulas
  // Devine (1974)
  const devine = gender === 'male'
    ? 50.0 + 2.3 * inchesOver5Ft
    : 45.5 + 2.3 * inchesOver5Ft;

  // Robinson (1983)
  const robinson = gender === 'male'
    ? 52.0 + 1.9 * inchesOver5Ft
    : 49.0 + 1.7 * inchesOver5Ft;

  // Miller (1983)
  const miller = gender === 'male'
    ? 56.2 + 1.41 * inchesOver5Ft
    : 53.1 + 1.36 * inchesOver5Ft;

  // Hamwi (1964)
  const hamwi = gender === 'male'
    ? 48.0 + 2.7 * inchesOver5Ft
    : 45.5 + 2.2 * inchesOver5Ft;

  const avgWeight = (devine + robinson + miller + hamwi) / 4;

  const formatWeight = (kg: number) => {
    if (unitSystem === 'metric') {
      return `${kg.toFixed(1)} kg`;
    } else {
      return `${(kg * 2.20462).toFixed(1)} lbs`;
    }
  };

  const copyResults = () => {
    const text = `Ideal Weight Calculator Results:\nGender: ${gender}\nHeight: ${activeHeightCm.toFixed(0)} cm\n\nIdeal Weight Estimations:\n- Devine Method: ${formatWeight(devine)}\n- Robinson Method: ${formatWeight(robinson)}\n- Miller Method: ${formatWeight(miller)}\n- Hamwi Method: ${formatWeight(hamwi)}\n\nConsensus Average Ideal Weight: ${formatWeight(avgWeight)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Ideal Weight Calculator Results:\nGender: ${gender}\nConsensus Average Ideal Weight: ${formatWeight(avgWeight)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ideal Weight Estimate', text: text });
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
    setGender('male');
    if (unitSystem === 'metric') {
      setHeightCm(175);
    } else {
      setHeightFt(5);
      setHeightIn(9);
    }
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-slate-800">
          <h3 className={`text-xs font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ideal Weight Parameters</h3>
          <div className="flex border rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1 font-semibold cursor-pointer ${unitSystem === 'metric' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Metric
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1 font-semibold cursor-pointer ${unitSystem === 'imperial' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
            >
              Imperial
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`text-xs font-bold block mb-1.5 uppercase tracking-wider text-slate-400`}>Gender</label>
            <div className="flex border rounded-lg overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-1.5 font-bold cursor-pointer transition-colors ${gender === 'male' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-1.5 font-bold cursor-pointer transition-colors ${gender === 'female' ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
              >
                Female
              </button>
            </div>
          </div>

          <div>
            {unitSystem === 'metric' ? (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Height (cm)</label>
                  <span className="font-mono text-xs text-emerald-500 font-bold">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="230"
                  step="1"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ) : (
              <div>
                <label className={`text-xs font-bold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Height (Feet & Inches)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="4"
                      max="7"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Number(e.target.value))}
                      className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                    />
                    <span className="text-xs font-bold">Ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => setHeightIn(Number(e.target.value))}
                      className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                    />
                    <span className="text-xs font-bold">In</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>IDEAL WEIGHT FORMULAS consensus</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AVERAGE IDEAL TARGET</span>
            <span className={`text-3xl font-black font-display tracking-tight text-emerald-500 mt-1 block`}>
              {formatWeight(avgWeight)}
            </span>
          </div>

          <div className="pt-2 border-t border-dashed border-emerald-200 dark:border-emerald-900/40 space-y-2">
            <span className="text-[10px] block font-black tracking-widest text-slate-400 text-center uppercase">FORMULA SPECIFIC RANGES</span>
            
            <div className="space-y-1.5">
              {[
                { name: 'Devine Method (1974)', value: devine, desc: 'Highly utilized clinical standard.' },
                { name: 'Robinson Method (1983)', value: robinson, desc: 'Improved variance scaling standard.' },
                { name: 'Miller Method (1983)', value: miller, desc: 'Lighter scaling for safety variables.' },
                { name: 'Hamwi Method (1964)', value: hamwi, desc: 'Pioneered baseline calculation rules.' }
              ].map((f, fIdx) => (
                <div key={fIdx} className={`p-2 rounded-xl text-xs flex justify-between items-center ${isDarkMode ? 'bg-slate-900/60' : 'bg-white shadow-2xs border border-slate-50'}`}>
                  <div>
                    <span className="font-bold block text-slate-700 dark:text-slate-200">{f.name}</span>
                    <span className="text-[9px] text-slate-400 block font-medium leading-none">{f.desc}</span>
                  </div>
                  <span className="font-mono font-black text-emerald-500">{formatWeight(f.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
