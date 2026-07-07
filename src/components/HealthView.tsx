/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ChevronLeft, ArrowRight, Heart, Scale, Flame, GlassWater, Activity, 
  Sparkles, Dumbbell, Baby, Calendar, Wine, ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import M3Icon from './M3Icon';
import { CalculatorId } from '../types';

interface HealthViewProps {
  onSelectCalculator: (id: CalculatorId) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export default function HealthView({ onSelectCalculator, onBack, isDarkMode }: HealthViewProps) {
  const options = [
    // Body & Fitness
    {
      id: 'bmi' as CalculatorId,
      title: 'BMI Calculator',
      description: 'Check Body Mass Index (BMI) and find your healthy weight range.',
      icon: 'Scale',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      group: 'Body & Fitness'
    },
    {
      id: 'bmr' as CalculatorId,
      title: 'BMR Calculator',
      description: 'Calculate Basal Metabolic Rate and baseline daily energy needs.',
      icon: 'Flame',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      group: 'Body & Fitness'
    },
    {
      id: 'body_fat' as CalculatorId,
      title: 'Body Fat Calculator',
      description: 'Estimate fat percentage, lean mass, and composition classes.',
      icon: 'Dumbbell',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      group: 'Body & Fitness'
    },
    {
      id: 'ideal_weight' as CalculatorId,
      title: 'Ideal Weight Calculator',
      description: 'Estimate your target weight based on Robinson, Miller, and Hamwi methods.',
      icon: 'Scale',
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      group: 'Body & Fitness'
    },

    // Diet & Hydration
    {
      id: 'calories' as CalculatorId,
      title: 'Calorie Counter & Advisor',
      description: 'Determine tailored daily calorie target budgets for gain/loss goals.',
      icon: 'Activity',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      group: 'Diet & Hydration'
    },
    {
      id: 'water' as CalculatorId,
      title: 'Water Intake Tracker',
      description: 'Find personalized hydration goals and track glass logging.',
      icon: 'GlassWater',
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      group: 'Diet & Hydration'
    },

    // Vitals & Training
    {
      id: 'heart_rate' as CalculatorId,
      title: 'Heart Rate Zones',
      description: 'Calculate aerobic training targets, warm-up, and fat burn zones.',
      icon: 'Activity',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      group: 'Vitals & Training'
    },

    // Family & Reproductive
    {
      id: 'pregnancy' as CalculatorId,
      title: 'Pregnancy Due Date',
      description: 'Estimate birth dates, conception days, and progress trimesters.',
      icon: 'Baby',
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
      group: 'Family & Reproductive'
    },
    {
      id: 'ovulation' as CalculatorId,
      title: 'Ovulation & Fertility',
      description: 'Map cycle fertile windows, ovulation days, and pregnancy test dates.',
      icon: 'Calendar',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      group: 'Family & Reproductive'
    },

    // Lifestyle & Safety
    {
      id: 'bac' as CalculatorId,
      title: 'BAC Alcohol Calculator',
      description: 'Estimate Blood Alcohol Content percentage and sobering timeline.',
      icon: 'Wine',
      color: 'text-red-500 bg-red-500/10 border-red-500/20',
      group: 'Lifestyle & Safety'
    }
  ];

  const groups = [
    { name: 'Body & Fitness', color: 'text-emerald-500' },
    { name: 'Diet & Hydration', color: 'text-sky-500' },
    { name: 'Vitals & Training', color: 'text-indigo-500' },
    { name: 'Family & Reproductive', color: 'text-pink-500' },
    { name: 'Lifestyle & Safety', color: 'text-red-500' }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header bar */}
      <div className={`flex items-center gap-3 p-4 border-b shrink-0 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 animate-pulse">
            <Heart size={20} className="fill-emerald-500" />
          </div>
          <div>
            <h2 className={`text-lg font-extrabold font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Health & Vitals</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CalcNova Wellness</p>
          </div>
        </div>
      </div>

      {/* Calculator Cards List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        <div className="space-y-1">
          <h1 className={`text-2xl font-black font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Wellness Companion
          </h1>
          <p className="text-xs text-slate-500">
            Track body indices, caloric targets, pregnancy milestones, ovulation schedules, and fitness zones with 10 medical-grade estimators.
          </p>
        </div>

        {groups.map((group, gIdx) => {
          const groupOptions = options.filter(opt => opt.group === group.name);
          if (groupOptions.length === 0) return null;

          return (
            <div key={group.name} className="space-y-3">
              <h3 className={`text-xs font-black uppercase tracking-wider border-b pb-1.5 ${
                isDarkMode ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-100'
              } flex items-center gap-2`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'}`}></span>
                {group.name}
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {groupOptions.map((opt, idx) => (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (gIdx * 2 + idx) * 0.02, duration: 0.15 }}
                    onClick={() => onSelectCalculator(opt.id)}
                    className={`p-3.5 rounded-2xl flex items-center justify-between text-left m3-card-shadow transition-all group cursor-pointer border ${
                      isDarkMode 
                        ? 'bg-slate-900 border-slate-800/60 hover:bg-slate-855 hover:border-slate-700/80' 
                        : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border shrink-0 ${opt.color}`}>
                        <M3Icon name={opt.icon} size={18} />
                      </div>
                      <div className="flex-1 pr-2">
                        <h4 className={`text-xs font-extrabold font-display ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                          {opt.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className={`text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all shrink-0 ml-1`} />
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}

        {/* Disclaimer Note */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-amber-50/20 border-amber-100 text-slate-500'
        } flex gap-3 items-start`}>
          <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-relaxed">
            <span className="font-bold">Medical Disclaimer:</span> All calculations and estimates are for informational and educational purposes only. They do not constitute professional medical advice, diagnosis, or treatment. Always consult with a licensed physician or healthcare provider before embarking on diet, hydration, or intensive exercise regimens.
          </p>
        </div>
      </div>
    </div>
  );
}
