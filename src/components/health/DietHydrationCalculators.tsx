/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, GlassWater, Plus, RotateCcw, Activity, Share2 } from 'lucide-react';

/* ==========================================
   1. CALORIE COUNTER & ADVISOR
   ========================================== */
export function CaloriesCalculator({ isDarkMode }: { isDarkMode: boolean }) {
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

  const [activity, setActivity] = useState<number>(1.375); // Lightly active default
  const [goal, setGoal] = useState<'lose_fast' | 'lose_slow' | 'maintain' | 'gain_slow' | 'gain_fast'>('maintain');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Sync conversions
  useEffect(() => {
    if (unitSystem === 'metric') {
      setWeightKg(Math.round(weightLbs * 0.453592));
      setHeightCm(Math.round((heightFt * 12 + heightIn) * 2.54));
    } else {
      setWeightLbs(Math.round(weightKg * 2.20462));
      const totalInches = heightCm / 2.54;
      setHeightFt(Math.floor(totalInches / 12));
      setHeightIn(Math.round(totalInches % 12));
    }
  }, [unitSystem]);

  const activeWeight = unitSystem === 'metric' ? weightKg : weightLbs * 0.453592;
  const activeHeight = unitSystem === 'metric' ? heightCm : (heightFt * 12 + heightIn) * 2.54;

  // Mifflin-St Jeor equation for BMR
  const s = gender === 'male' ? 5 : -161;
  const bmr = 10 * activeWeight + 6.25 * activeHeight - 5 * age + s;
  const tdee = bmr * activity;

  // Calorie targets based on goal
  let targetCalories = tdee;
  let goalLabel = 'Maintain Weight';
  let goalDesc = 'Your calorie intake matches your body energy expenditure perfectly.';

  if (goal === 'lose_fast') {
    targetCalories = tdee - 1000;
    goalLabel = 'Lose Weight (~1 kg/week)';
    goalDesc = 'Steep deficit. Highly recommended to consume rich protein and stay hydrated.';
  } else if (goal === 'lose_slow') {
    targetCalories = tdee - 500;
    goalLabel = 'Lose Weight (~0.5 kg/week)';
    goalDesc = 'Healthy and highly sustainable fat-loss caloric deficit.';
  } else if (goal === 'gain_slow') {
    targetCalories = tdee + 350;
    goalLabel = 'Gain Weight (~0.25 kg/week)';
    goalDesc = 'Clean surplus. Ideal for lean muscle building with active resistance training.';
  } else if (goal === 'gain_fast') {
    targetCalories = tdee + 700;
    goalLabel = 'Gain Weight (~0.5 kg/week)';
    goalDesc = 'High surplus. Best for athletic mass building phases.';
  }

  // Ensure target doesn't drop below a safe floor
  const minSafeFloor = gender === 'male' ? 1500 : 1200;
  if (targetCalories < minSafeFloor) {
    targetCalories = minSafeFloor;
  }

  // Macro splits: Protein 30%, Carbs 45%, Fats 25%
  const proteinPct = 0.30;
  const carbsPct = 0.45;
  const fatsPct = 0.25;

  const proteinGrams = (targetCalories * proteinPct) / 4;
  const carbsGrams = (targetCalories * carbsPct) / 4;
  const fatsGrams = (targetCalories * fatsPct) / 9;

  const copyResults = () => {
    const text = `Calorie Advisor Results:\nGender: ${gender} | Age: ${age}\nGoal: ${goalLabel}\nTarget Daily Intake: ${targetCalories.toFixed(0)} kcal/day\n\nDaily Macros:\n- Protein (30%): ${proteinGrams.toFixed(0)}g\n- Carbs (45%): ${carbsGrams.toFixed(0)}g\n- Fats (25%): ${fatsGrams.toFixed(0)}g`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Calorie Advisor Results:\nGender: ${gender} | Target: ${targetCalories.toFixed(0)} kcal/day`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Daily Calorie Targets', text: text });
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
    setActivity(1.375);
    setGoal('maintain');
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
          <h3 className={`text-xs font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Calories Advisor</h3>
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

        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-bold block mb-1 uppercase text-slate-400`}>Gender</label>
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
              <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-1`}>Age (yrs)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Math.max(1, Number(e.target.value)))}
                className={`w-full px-3 py-1 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {unitSystem === 'metric' ? (
              <>
                <div>
                  <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-1`}>Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(10, Number(e.target.value)))}
                    className={`w-full px-3 py-1 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-1`}>Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(10, Number(e.target.value)))}
                    className={`w-full px-3 py-1 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={`text-[10px] font-bold uppercase text-slate-400 block mb-1`}>Weight (lbs)</label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Math.max(10, Number(e.target.value)))}
                    className={`w-full px-3 py-1 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <label className={`text-[9px] font-bold text-slate-400 block`}>Ft</label>
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(Math.max(1, Number(e.target.value)))}
                      className={`w-full px-1 py-1 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] font-bold text-slate-400 block`}>In</label>
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(Math.max(0, Math.min(11, Number(e.target.value))))}
                      className={`w-full px-1 py-1 text-xs rounded-lg font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1 uppercase tracking-wider text-slate-400`}>Physical Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              className={`w-full px-3 py-1.5 text-xs font-bold rounded-xl border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
            >
              <option value="1.2">Sedentary (No Active Workouts)</option>
              <option value="1.375">Lightly Active (Workout 1-3 times/week)</option>
              <option value="1.55">Moderately Active (Workout 3-5 times/week)</option>
              <option value="1.725">Very Active (Workout 6-7 times/week)</option>
              <option value="1.9">Extremely Active (Athletic Daily Drills)</option>
            </select>
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1.5 uppercase tracking-wider text-slate-400`}>Your Goal</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'lose_fast', label: 'Lose Fast Deficit' },
                { id: 'lose_slow', label: 'Lose Steady Deficit' },
                { id: 'maintain', label: 'Maintain Intake' },
                { id: 'gain_slow', label: 'Gain Lean Surplus' },
                { id: 'gain_fast', label: 'Gain Athletic Surplus' }
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id as any)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    goal === g.id
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : isDarkMode
                        ? 'bg-slate-800 border-slate-750 text-slate-300 hover:bg-slate-750'
                        : 'bg-slate-50 border-slate-100 text-slate-750 hover:bg-slate-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
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

      {/* Target outputs */}
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>YOUR ENERGY BUDGET</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{goalLabel}</span>
            <span className={`text-4xl font-black font-display tracking-tight text-emerald-500 mt-1 block`}>
              {targetCalories.toFixed(0)} <span className="text-sm font-medium">kcal/day</span>
            </span>
            <p className="text-[11px] text-slate-500 font-medium max-w-xs mx-auto mt-2 leading-relaxed">
              {goalDesc}
            </p>
          </div>

          <div className="pt-3 border-t border-dashed border-emerald-200 dark:border-emerald-900/40 space-y-3">
            <span className="text-[10px] block font-black tracking-widest text-center text-slate-400 uppercase">SUGGESTED MACROS BREAKDOWN</span>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className={`p-2 rounded-2xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-white'} border border-slate-100 dark:border-slate-800`}>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Protein (30%)</span>
                <span className="block text-xs font-black text-emerald-500 font-mono mt-0.5">{proteinGrams.toFixed(0)}g</span>
                <span className="text-[9px] text-slate-400 block font-semibold">{(proteinGrams * 4).toFixed(0)} kcal</span>
              </div>
              <div className={`p-2 rounded-2xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-white'} border border-slate-100 dark:border-slate-800`}>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Carbs (45%)</span>
                <span className="block text-xs font-black text-amber-500 font-mono mt-0.5">{carbsGrams.toFixed(0)}g</span>
                <span className="text-[9px] text-slate-400 block font-semibold">{(carbsGrams * 4).toFixed(0)} kcal</span>
              </div>
              <div className={`p-2 rounded-2xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-white'} border border-slate-100 dark:border-slate-800`}>
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Fats (25%)</span>
                <span className="block text-xs font-black text-rose-500 font-mono mt-0.5">{fatsGrams.toFixed(0)}g</span>
                <span className="text-[9px] text-slate-400 block font-semibold">{(fatsGrams * 9).toFixed(0)} kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   2. WATER INTAKE TRACKER (With circular gauge & storage)
   ========================================== */
export function WaterIntakeCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [weight, setWeight] = useState<number>(70);
  const [exercise, setExercise] = useState<number>(30); // minutes of exercise
  const [climate, setClimate] = useState<'cold' | 'moderate' | 'hot'>('moderate');
  const [loggedToday, setLoggedToday] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('calcnova_water_logged');
      if (saved) {
        setLoggedToday(Number(saved));
      }
    } catch (e) {
      // Ignored
    }
  }, []);

  const saveLogs = (val: number) => {
    setLoggedToday(val);
    try {
      localStorage.setItem('calcnova_water_logged', String(val));
    } catch (e) {
      // Ignored
    }
  };

  const baseline = weight * 35; // mL per kg
  const workoutAdd = exercise * 12; // 12mL per minute
  const climateAdd = climate === 'cold' ? -250 : climate === 'hot' ? 500 : 0;
  const targetWater = Math.max(1000, baseline + workoutAdd + climateAdd);

  const percentLogged = Math.min(100, (loggedToday / targetWater) * 100);

  const logWater = (amount: number) => {
    saveLogs(loggedToday + amount);
  };

  const resetLogs = () => {
    saveLogs(0);
  };

  const copyResults = () => {
    const text = `Water Hydration Tracker Results:\nDaily Target: ${targetWater.toFixed(0)} mL\nAmount Logged: ${loggedToday} mL (${percentLogged.toFixed(0)}%)\nWeight: ${weight} kg | Active exercise: ${exercise} mins`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Hydration Tracker: Target ${targetWater.toFixed(0)} mL, Logged ${loggedToday} mL.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Daily Hydration Tracking', text: text });
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

  const handleResetValues = () => {
    setWeight(70);
    setExercise(30);
    setClimate('moderate');
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Hydration Parameters</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-bold mb-1 block uppercase tracking-wider text-slate-400`}>Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Math.max(20, Number(e.target.value)))}
                className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
            <div>
              <label className={`text-xs font-bold mb-1 block uppercase tracking-wider text-slate-400`}>Exercise (mins)</label>
              <input
                type="number"
                value={exercise}
                onChange={(e) => setExercise(Math.max(0, Number(e.target.value)))}
                className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'}`}
              />
            </div>
          </div>

          <div>
            <label className={`text-xs font-bold block mb-1.5 uppercase tracking-wider text-slate-400`}>Climate Environment</label>
            <div className="flex border rounded-xl overflow-hidden text-xs">
              {[
                { id: 'cold', label: '❄️ Cold' },
                { id: 'moderate', label: '🌤️ Moderate' },
                { id: 'hot', label: '🔥 Hot' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setClimate(c.id as any)}
                  className={`flex-1 py-2 font-bold cursor-pointer transition-colors ${climate === c.id ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleResetValues}
              className={`flex-1 py-2 text-xs rounded-xl font-bold border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-150'
              }`}
            >
              <RotateCcw size={14} /> Reset Metrics
            </button>
          </div>
        </div>
      </div>

      {/* Circle visual progress logged */}
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
          <button
            type="button"
            onClick={resetLogs}
            className={`p-2 rounded-full transition-all cursor-pointer text-rose-500 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:bg-slate-50 shadow-sm'}`}
            title="Reset Daily Intake Log"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Daily Hydration Goal</h3>

        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative w-36 h-36 rounded-full border-4 border-dashed border-emerald-200 dark:border-emerald-900 flex items-center justify-center overflow-hidden">
              <div 
                style={{ height: `${percentLogged}%` }}
                className="absolute bottom-0 left-0 right-0 bg-sky-500/20 dark:bg-sky-400/30 transition-all duration-500 rounded-b-full w-full"
              ></div>
              
              <div className="text-center z-10">
                <GlassWater size={36} className="mx-auto text-sky-500 animate-bounce" />
                <span className="block text-2xl font-black font-mono mt-1 text-slate-900 dark:text-white">
                  {loggedToday} <span className="text-xs font-medium">mL</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mt-1">
                  Target: {targetWater.toFixed(0)} mL
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-sky-500 tracking-wide uppercase">
              {percentLogged.toFixed(0)}% Logged Today
            </span>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] block font-black tracking-widest text-center text-slate-400 uppercase">QUICK LOG BEVERAGE</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { amount: 250, label: 'Cup', val: '250 mL' },
                { amount: 500, label: 'Glass', val: '500 mL' },
                { amount: 750, label: 'Bottle', val: '750 mL' }
              ].map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => logWater(item.amount)}
                  className={`py-2 rounded-2xl flex flex-col items-center gap-1 font-bold border transition-all cursor-pointer ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-white' : 'bg-white border-slate-100 hover:bg-slate-50 shadow-xs text-slate-800'
                  }`}
                >
                  <Plus size={14} className="text-sky-500" />
                  <span className="text-xs font-black">{item.val}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
