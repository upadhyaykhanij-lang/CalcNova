/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Ruler, 
  Weight, 
  Thermometer, 
  Maximize2, 
  Droplet, 
  Gauge, 
  Clock, 
  Coins, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temp' | 'area' | 'volume' | 'speed' | 'time' | 'currency';

interface ConversionFactor {
  name: string;
  symbol: string;
  // Factor to base unit
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const CONVERSIONS: Record<Exclude<UnitCategory, 'currency'>, ConversionFactor[]> = {
  length: [
    { name: 'Meters', symbol: 'm', toBase: v => v, fromBase: v => v },
    { name: 'Kilometers', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { name: 'Centimeters', symbol: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
    { name: 'Millimeters', symbol: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { name: 'Miles', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    { name: 'Yards', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { name: 'Feet', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { name: 'Inches', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 }
  ],
  weight: [
    { name: 'Kilograms', symbol: 'kg', toBase: v => v, fromBase: v => v },
    { name: 'Grams', symbol: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { name: 'Milligrams', symbol: 'mg', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    { name: 'Pounds', symbol: 'lb', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
    { name: 'Ounces', symbol: 'oz', toBase: v => v * 0.028349523, fromBase: v => v / 0.028349523 },
    { name: 'Metric Tons', symbol: 't', toBase: v => v * 1000, fromBase: v => v / 1000 }
  ],
  temp: [
    { name: 'Celsius', symbol: '°C', toBase: v => v, fromBase: v => v },
    { name: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * 5/9, fromBase: v => (v * 9/5) + 32 },
    { name: 'Kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 }
  ],
  area: [
    { name: 'Square Meters', symbol: 'm²', toBase: v => v, fromBase: v => v },
    { name: 'Square Kilometers', symbol: 'km²', toBase: v => v * 1000000, fromBase: v => v / 1000000 },
    { name: 'Square Feet', symbol: 'ft²', toBase: v => v * 0.09290304, fromBase: v => v / 0.09290304 },
    { name: 'Acres', symbol: 'ac', toBase: v => v * 4046.8564, fromBase: v => v / 4046.8564 },
    { name: 'Hectares', symbol: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 }
  ],
  volume: [
    { name: 'Liters', symbol: 'L', toBase: v => v, fromBase: v => v },
    { name: 'Milliliters', symbol: 'mL', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { name: 'Gallons (US)', symbol: 'gal', toBase: v => v * 3.785411784, fromBase: v => v / 3.785411784 },
    { name: 'Quarts (US)', symbol: 'qt', toBase: v => v * 0.946352946, fromBase: v => v / 0.946352946 },
    { name: 'Cups (US)', symbol: 'cup', toBase: v => v * 0.236588236, fromBase: v => v / 0.236588236 },
    { name: 'Fluid Ounces (US)', symbol: 'fl oz', toBase: v => v * 0.029573529, fromBase: v => v / 0.029573529 },
    { name: 'Cubic Meters', symbol: 'm³', toBase: v => v * 1000, fromBase: v => v / 1000 }
  ],
  speed: [
    { name: 'Meters / Second', symbol: 'm/s', toBase: v => v, fromBase: v => v },
    { name: 'Kilometers / Hour', symbol: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { name: 'Miles / Hour', symbol: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { name: 'Knots', symbol: 'kn', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    { name: 'Feet / Second', symbol: 'fps', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 }
  ],
  time: [
    { name: 'Seconds', symbol: 's', toBase: v => v, fromBase: v => v },
    { name: 'Milliseconds', symbol: 'ms', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { name: 'Minutes', symbol: 'min', toBase: v => v * 60, fromBase: v => v / 60 },
    { name: 'Hours', symbol: 'h', toBase: v => v * 3600, fromBase: v => v / 3600 },
    { name: 'Days', symbol: 'd', toBase: v => v * 86400, fromBase: v => v / 86400 },
    { name: 'Weeks', symbol: 'wk', toBase: v => v * 604800, fromBase: v => v / 604800 },
    { name: 'Months (Avg)', symbol: 'mo', toBase: v => v * 2629746, fromBase: v => v / 2629746 },
    { name: 'Years (Avg)', symbol: 'yr', toBase: v => v * 31556952, fromBase: v => v / 31556952 }
  ]
};

const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.5,
  JPY: 155.0,
  AUD: 1.51,
  CAD: 1.36,
  CHF: 0.90,
  CNY: 7.24,
  SGD: 1.34,
};

const CURRENCY_DETAILS: Record<string, { name: string; symbol: string }> = {
  USD: { name: 'US Dollar', symbol: '$' },
  EUR: { name: 'Euro', symbol: '€' },
  GBP: { name: 'British Pound', symbol: '£' },
  INR: { name: 'Indian Rupee', symbol: '₹' },
  JPY: { name: 'Japanese Yen', symbol: '¥' },
  AUD: { name: 'Australian Dollar', symbol: 'A$' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$' },
  CHF: { name: 'Swiss Franc', symbol: 'CHF' },
  CNY: { name: 'Chinese Yuan', symbol: '¥' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$' }
};

export function UnitConverter({ isDarkMode }: { isDarkMode: boolean }) {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnitIdx, setFromUnitIdx] = useState<number>(0);
  const [toUnitIdx, setToUnitIdx] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('1');
  const [outputValue, setOutputValue] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Currency Exchange Rates
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isRatesLoading, setIsRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Offline Fallback');

  const fetchRates = () => {
    setIsRatesLoading(true);
    setRatesError(null);
    fetch('https://api.frankfurter.app/latest?from=USD')
      .then(res => {
        if (!res.ok) throw new Error('API server issue');
        return res.json();
      })
      .then(data => {
        if (data && data.rates) {
          const fetched: Record<string, number> = { USD: 1.0 };
          Object.keys(CURRENCY_DETAILS).forEach(curr => {
            if (curr === 'USD') return;
            fetched[curr] = data.rates[curr] || FALLBACK_RATES[curr];
          });
          setRates(fetched);
          setLastUpdated(new Date().toLocaleTimeString());
        }
        setIsRatesLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch live exchange rates:', err);
        setRatesError('Failed to fetch live exchange rates. Using fallback.');
        setIsRatesLoading(false);
      });
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const getUnits = (): ConversionFactor[] => {
    if (category === 'currency') {
      return Object.keys(CURRENCY_DETAILS).map(curr => ({
        name: CURRENCY_DETAILS[curr].name,
        symbol: CURRENCY_DETAILS[curr].symbol,
        toBase: v => v / rates[curr],
        fromBase: v => v * rates[curr]
      }));
    }
    return CONVERSIONS[category];
  };

  const listUnits = getUnits();

  // Reset selections on category change safely
  useEffect(() => {
    setFromUnitIdx(0);
    setToUnitIdx(Math.min(1, listUnits.length - 1));
  }, [category, rates]); // also trigger when rates load to update selectors properly

  useEffect(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setOutputValue(0);
      return;
    }

    const fromUnit = listUnits[fromUnitIdx];
    const toUnit = listUnits[toUnitIdx];
    
    if (!fromUnit || !toUnit) return;

    // Convert: From -> Base (USD for currency, meters/seconds/etc. for static) -> To
    const baseVal = fromUnit.toBase(val);
    const finalVal = toUnit.fromBase(baseVal);
    setOutputValue(finalVal);
  }, [inputValue, fromUnitIdx, toUnitIdx, category, rates]);

  const copyResults = () => {
    const fromUnit = listUnits[fromUnitIdx];
    const toUnit = listUnits[toUnitIdx];
    if (!fromUnit || !toUnit) return;
    const text = `Unit Conversion Results:\n${inputValue} ${fromUnit.symbol} = ${outputValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit.symbol}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (cat: UnitCategory) => {
    switch (cat) {
      case 'length': return <Ruler size={16} />;
      case 'weight': return <Weight size={16} />;
      case 'temp': return <Thermometer size={16} />;
      case 'area': return <Maximize2 size={16} />;
      case 'volume': return <Droplet size={16} />;
      case 'speed': return <Gauge size={16} />;
      case 'time': return <Clock size={16} />;
      case 'currency': return <Coins size={16} />;
    }
  };

  const categories: { id: UnitCategory; label: string }[] = [
    { id: 'length', label: 'Length' },
    { id: 'weight', label: 'Weight' },
    { id: 'temp', label: 'Temperature' },
    { id: 'area', label: 'Area' },
    { id: 'volume', label: 'Volume' },
    { id: 'speed', label: 'Speed' },
    { id: 'time', label: 'Time' },
    { id: 'currency', label: 'Currency' }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Category selector */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold mb-4 tracking-wider uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>CONVERTER CATEGORY</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
          {categories.map((item) => (
            <button
              key={item.id}
              onClick={() => setCategory(item.id)}
              className={`py-2.5 px-3 rounded-2xl transition-all border flex items-center gap-2 justify-center cursor-pointer ${
                category === item.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {getCategoryIcon(item.id)}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Currency Rates Status */}
      {category === 'currency' && (
        <div className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`relative flex h-2.5 w-2.5 ${lastUpdated === 'Offline Fallback' ? 'hidden' : 'inline-block'}`}>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            {lastUpdated === 'Offline Fallback' ? (
              <AlertCircle size={14} className="text-amber-500" />
            ) : null}
            <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {lastUpdated === 'Offline Fallback' 
                ? 'Offline mode (using standard fallback exchange rates)' 
                : `Live Exchange Rates (from USD base) • Updated at ${lastUpdated}`}
            </span>
          </div>

          <button
            onClick={fetchRates}
            disabled={isRatesLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
            } disabled:opacity-50`}
          >
            <RefreshCw size={12} className={isRatesLoading ? 'animate-spin' : ''} />
            <span>{isRatesLoading ? 'Syncing...' : 'Sync Rates'}</span>
          </button>
        </div>
      )}

      {/* Input / output fields */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'} space-y-4`}>
        {/* FROM */}
        <div>
          <label className={`text-xs font-bold mb-2 uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>FROM</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`flex-1 px-3.5 py-3 text-sm rounded-2xl font-mono border focus:outline-hidden ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
              placeholder="Value"
            />
            <select
              value={fromUnitIdx}
              onChange={(e) => setFromUnitIdx(Number(e.target.value))}
              className={`sm:w-64 px-3.5 py-3 text-sm rounded-2xl border focus:outline-hidden font-medium ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
            >
              {listUnits.map((u, i) => (
                <option key={i} value={i}>{u.name} ({u.symbol})</option>
              ))}
            </select>
          </div>
        </div>

        {/* TO */}
        <div>
          <label className={`text-xs font-bold mb-2 uppercase tracking-wider block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TO</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className={`flex-1 px-3.5 py-3 text-sm rounded-2xl font-mono border select-all flex items-center ${
              isDarkMode ? 'bg-slate-800/50 border-slate-750 text-slate-200' : 'bg-slate-50/50 border-slate-150 text-slate-700'
            }`}>
              {isNaN(parseFloat(inputValue)) ? '0' : outputValue.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
            <select
              value={toUnitIdx}
              onChange={(e) => setToUnitIdx(Number(e.target.value))}
              className={`sm:w-64 px-3.5 py-3 text-sm rounded-2xl border focus:outline-hidden font-medium ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
            >
              {listUnits.map((u, i) => (
                <option key={i} value={i}>{u.name} ({u.symbol})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Presentation */}
      <div className={`p-6 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={copyResults}
            className={`p-2.5 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
            title="Copy Results"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>CONVERSION VALUE</h3>

        <div className="space-y-4 text-center">
          <div className="py-2">
            <span className={`text-xs block font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>RESULT</span>
            <span className={`text-2xl font-extrabold font-display tracking-tight text-emerald-500 block`}>
              {inputValue || '0'} {listUnits[fromUnitIdx]?.symbol}
            </span>
            <span className={`text-sm text-slate-500 font-bold block my-2`}>is equivalent to</span>
            <span className={`text-3xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400 block`}>
              {outputValue.toLocaleString(undefined, { maximumFractionDigits: 6 })} {listUnits[toUnitIdx]?.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
