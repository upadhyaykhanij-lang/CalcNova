/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, ArrowRight, HeartCrack } from 'lucide-react';
import { Calculator } from '../types';
import { CALCULATORS } from '../data/calculators';
import M3Icon from './M3Icon';

interface FavoritesViewProps {
  favorites: string[];
  onSelectCalculator: (id: string) => void;
  isDarkMode: boolean;
}

export default function FavoritesView({
  favorites,
  onSelectCalculator,
  isDarkMode
}: FavoritesViewProps) {
  // Filter calculators that are favorited
  const favCalculators = CALCULATORS.filter((c) => favorites.includes(c.id));

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6 flex flex-col h-full">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-extrabold font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-primary'}`}>
          Favorites
        </h1>
        <p className={`text-xs mt-1 font-semibold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Quick access to your most-used tools
        </p>
      </div>

      {favCalculators.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className={`p-4 rounded-full ${isDarkMode ? 'bg-slate-900 text-slate-600' : 'bg-accent-light/60 text-primary'}`}>
            <Star size={48} className="stroke-[1.5]" />
          </div>
          <div>
            <h3 className={`text-base font-bold font-display ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>No Favorites Yet</h3>
            <p className="text-xs text-slate-500 max-w-[240px] mx-auto mt-1 leading-relaxed">
              Star your favorite calculators in any details view to see them collected here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {favCalculators.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCalculator(c.id)}
              className={`p-4 rounded-3xl flex items-center justify-between text-left m3-card-shadow hover:m3-card-shadow-elevated transition-all group cursor-pointer border ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-850' 
                  : 'bg-white border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2.5 rounded-2xl transition-transform group-hover:scale-105 ${
                  isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-accent-light text-primary'
                }`}>
                  <M3Icon name={c.icon} size={20} />
                </div>
                <div>
                  <h3 className={`text-sm font-bold font-display ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 pr-2">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-primary transition-colors pr-1">
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
