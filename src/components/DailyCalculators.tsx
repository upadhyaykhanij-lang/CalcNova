/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, Calendar, Percent, Sparkles, Share2, AlertTriangle } from 'lucide-react';

/* ==========================================
   1. TIP CALCULATOR
   ========================================== */
export function TipCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [bill, setBill] = useState<number>(100);
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [people, setPeople] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  const tipAmount = bill * (tipPercent / 100);
  const totalAmount = bill + tipAmount;
  const tipPerPerson = tipAmount / people;
  const totalPerPerson = totalAmount / people;

  const copyResults = () => {
    const text = `Tip Split Results:\nBill: $${bill.toFixed(2)}\nTip: ${tipPercent}%\nPeople Split: ${people}\n\nTip Amount: $${tipAmount.toFixed(2)}\nTotal Amount: $${totalAmount.toFixed(2)}\nTip Per Person: $${tipPerPerson.toFixed(2)}\nTotal Per Person: $${totalPerPerson.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>BILL PARAMETERS</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Bill Amount ($)</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">${bill.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1"
              max="1000"
              step="5"
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tip Percentage (%)</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">{tipPercent}%</span>
            </div>
            <div className="grid grid-cols-5 gap-1 mb-2">
              {[10, 15, 18, 20].map((item) => (
                <button
                  key={item}
                  onClick={() => setTipPercent(item)}
                  className={`py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                    tipPercent === item
                      ? 'bg-blue-600 text-white border-blue-600'
                      : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item}%
                </button>
              ))}
              <input
                type="number"
                placeholder="Custom"
                value={tipPercent === 10 || tipPercent === 15 || tipPercent === 18 || tipPercent === 20 ? '' : tipPercent}
                onChange={(e) => setTipPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                className={`w-full px-1 text-center py-1 text-xs font-semibold rounded-lg font-mono border focus:outline-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Number of People</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">{people} People</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>BILL SPLIT OUTCOME</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center py-2">
            <div>
              <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>EACH PERSON PAYS</span>
              <span className={`text-2xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
                ${totalPerPerson.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>EACH PERSON'S TIP</span>
              <span className={`text-2xl font-extrabold font-display tracking-tight text-emerald-500`}>
                ${tipPerPerson.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Bill (Excl.)</span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                ${bill.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Tip Amount</span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                ${tipAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   2. DISCOUNT CALCULATOR
   ========================================== */
export function DiscountCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [price, setPrice] = useState<number>(120);
  const [discount, setDiscount] = useState<number>(20);
  const [tax, setTax] = useState<number>(8);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Input Validation Warnings
  const priceWarning = price <= 0 ? 'Price must be greater than 0' : price > 10000000 ? 'Max price is $10,000,000' : null;
  const discountWarning = discount < 0 ? 'Discount cannot be negative' : discount > 100 ? 'Max discount is 100%' : null;
  const taxWarning = tax < 0 ? 'Tax cannot be negative' : tax > 100 ? 'Max tax is 100%' : null;

  // Sanitized values for arithmetic safely
  const validPrice = Math.max(0, price);
  const validDiscount = Math.max(0, Math.min(100, discount));
  const validTax = Math.max(0, Math.min(100, tax));

  const discountAmount = validPrice * (validDiscount / 100);
  const discountedPrice = validPrice - discountAmount;
  const taxAmount = discountedPrice * (validTax / 100);
  const finalPrice = discountedPrice + taxAmount;
  const netSavings = discountAmount;

  const copyResults = () => {
    const text = `Discount Calculator Results:
Original Price: $${validPrice.toFixed(2)}
Discount: ${validDiscount}%
Sales Tax: ${validTax}%

Discounted Price: $${discountedPrice.toFixed(2)}
Tax Amount: $${taxAmount.toFixed(2)}
Final Sale Price: $${finalPrice.toFixed(2)}
Total Savings: $${netSavings.toFixed(2)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Discount Calculator Results:
Original Price: $${validPrice.toFixed(2)}
Discount: ${validDiscount}%
Sales Tax: ${validTax}%

Discounted Price: $${discountedPrice.toFixed(2)}
Tax Amount: $${taxAmount.toFixed(2)}
Final Sale Price: $${finalPrice.toFixed(2)}
Total Savings: $${netSavings.toFixed(2)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shopping Discount Estimate',
          text: text,
        });
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

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>SHOPPING DISCOUNTS</h3>

        <div className="space-y-4">
          {/* Price Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Original Price ($)</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">${price}</span>
            </div>
            <input
              type="range"
              min="5"
              max="2000"
              step="5"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer animate-fade-in"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${
                priceWarning ? 'border-rose-500 focus:ring-rose-500' : 'focus:ring-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {priceWarning && (
              <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                <AlertTriangle size={12} />
                <span>{priceWarning}</span>
              </div>
            )}
          </div>

          {/* Discount Percentage Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Discount Percentage (%)</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">{discount}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${
                discountWarning ? 'border-rose-500 focus:ring-rose-500' : 'focus:ring-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {discountWarning && (
              <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                <AlertTriangle size={12} />
                <span>{discountWarning}</span>
              </div>
            )}
          </div>

          {/* Tax Percentage Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Sales Tax (%)</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">{tax}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={tax}
              step="0.1"
              onChange={(e) => setTax(Number(e.target.value))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${
                taxWarning ? 'border-rose-500 focus:ring-rose-500' : 'focus:ring-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {taxWarning && (
              <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                <AlertTriangle size={12} />
                <span>{taxWarning}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        <div className="absolute top-0 right-0 p-3 flex gap-2">
          <button
            onClick={copyResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
            title="Copy Results"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
          <button
            onClick={shareResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
            title="Share Results"
          >
            {shared ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>DISCOUNT SUMMARY</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>FINAL SALE PRICE</span>
            <span className={`text-3xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
              ${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs text-center">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tax Amount</span>
              <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                ${taxAmount.toFixed(2)}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Before Tax</span>
              <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                ${discountedPrice.toFixed(2)}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Saved</span>
              <span className={`text-xs font-bold font-mono text-emerald-500`}>
                ${netSavings.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   3. AGE CALCULATOR
   ========================================== */
export function AgeCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);
  const [ageDays, setAgeDays] = useState(0);
  const [daysToNextBday, setDaysToNextBday] = useState(0);
  const [totalDaysLived, setTotalDaysLived] = useState(0);

  const dateWarning = birthDate && targetDate && new Date(targetDate) < new Date(birthDate) 
    ? 'Birthdate cannot be after target date!' 
    : null;

  useEffect(() => {
    if (!birthDate || !targetDate) return;

    const bdate = new Date(birthDate);
    const tdate = new Date(targetDate);

    if (tdate < bdate) {
      setAgeYears(0);
      setAgeMonths(0);
      setAgeDays(0);
      setDaysToNextBday(0);
      setTotalDaysLived(0);
      return;
    }

    // Total days lived
    const diffTime = Math.abs(tdate.getTime() - bdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotalDaysLived(diffDays);

    // Precise age in Y / M / D
    let years = tdate.getFullYear() - bdate.getFullYear();
    let months = tdate.getMonth() - bdate.getMonth();
    let days = tdate.getDate() - bdate.getDate();

    if (days < 0) {
      months -= 1;
      // Days in previous month of targetDate
      const prevMonth = new Date(tdate.getFullYear(), tdate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAgeYears(years);
    setAgeMonths(months);
    setAgeDays(days);

    // Days to next Birthday
    const nextBday = new Date(tdate.getFullYear(), bdate.getMonth(), bdate.getDate());
    if (nextBday < tdate) {
      nextBday.setFullYear(tdate.getFullYear() + 1);
    }
    const bdayDiffTime = nextBday.getTime() - tdate.getTime();
    const bdayDiffDays = Math.ceil(bdayDiffTime / (1000 * 60 * 60 * 24));
    setDaysToNextBday(bdayDiffDays === 365 || bdayDiffDays === 366 ? 0 : bdayDiffDays);

  }, [birthDate, targetDate]);

  const copyResults = () => {
    const text = `Age Calculator Results:
Birthdate: ${birthDate}
At Date: ${targetDate}

Age: ${ageYears} Years, ${ageMonths} Months, ${ageDays} Days
Total Days Lived: ${totalDaysLived.toLocaleString()} days
Days to Next Birthday: ${daysToNextBday} days`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Age Calculator Results:
Birthdate: ${birthDate}
At Date: ${targetDate}

Age: ${ageYears} Years, ${ageMonths} Months, ${ageDays} Days
Total Days Lived: ${totalDaysLived.toLocaleString()} days
Days to Next Birthday: ${daysToNextBday} days`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Calculated Age Estimate',
          text: text,
        });
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

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>DATE SPECIFICATIONS</h3>

        <div className="space-y-4">
          <div>
            <label className={`text-sm font-medium block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${
                dateWarning ? 'border-rose-500' : ''
              } ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
            />
            {dateWarning && (
              <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                <AlertTriangle size={12} />
                <span>{dateWarning}</span>
              </div>
            )}
          </div>

          <div>
            <label className={`text-sm font-medium block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Calculate Age at Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
              }`}
            />
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        <div className="absolute top-0 right-0 p-3 flex gap-2">
          <button
            onClick={copyResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
            title="Copy Results"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
          <button
            onClick={shareResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
            title="Share Results"
          >
            {shared ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>CALCULATED AGE</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>YOUR EXACT AGE IS</span>
            <span className={`text-2xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
              {ageYears} Yrs, {ageMonths} Mo, {ageDays} Days
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Days Lived</span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {totalDaysLived.toLocaleString()} days
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Next Birthday In</span>
              <span className={`text-sm font-bold font-mono text-emerald-500`}>
                {daysToNextBday} days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   4. PERCENTAGE CALCULATOR
   ========================================== */
export function PercentageCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [tab, setTab] = useState<'basic' | 'ratio' | 'change'>('basic');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Basic: What is X% of Y?
  const [basicX, setBasicX] = useState<number>(15);
  const [basicY, setBasicY] = useState<number>(200);
  const basicResult = (basicX / 100) * basicY;

  // Ratio: X is what percent of Y?
  const [ratioX, setRatioX] = useState<number>(30);
  const [ratioY, setRatioY] = useState<number>(150);
  const ratioResult = ratioY !== 0 ? (ratioX / ratioY) * 100 : 0;
  const ratioWarning = ratioY === 0 ? 'Total (Y) cannot be zero for division' : null;

  // Change: Percentage increase/decrease from X to Y
  const [changeX, setChangeX] = useState<number>(50);
  const [changeY, setChangeY] = useState<number>(75);
  const changeDiff = changeY - changeX;
  const changeResult = changeX !== 0 ? (changeDiff / changeX) * 100 : 0;
  const changeWarning = changeX === 0 ? 'Initial Value (X) cannot be zero' : null;

  const copyResults = () => {
    let text = '';
    if (tab === 'basic') {
      text = `Percentage Results:\nWhat is ${basicX}% of ${basicY}?\nAnswer: ${basicResult.toFixed(2)}`;
    } else if (tab === 'ratio') {
      text = `Percentage Results:\n${ratioX} is what % of ${ratioY}?\nAnswer: ${ratioResult.toFixed(2)}%`;
    } else {
      const typeStr = changeResult >= 0 ? 'Increase' : 'Decrease';
      text = `Percentage Results:\nChange from ${changeX} to ${changeY} is a ${Math.abs(changeResult).toFixed(2)}% ${typeStr}`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    let text = '';
    if (tab === 'basic') {
      text = `Percentage Results:\nWhat is ${basicX}% of ${basicY}?\nAnswer: ${basicResult.toFixed(2)}`;
    } else if (tab === 'ratio') {
      text = `Percentage Results:\n${ratioX} is what % of ${ratioY}?\nAnswer: ${ratioResult.toFixed(2)}%`;
    } else {
      const typeStr = changeResult >= 0 ? 'Increase' : 'Decrease';
      text = `Percentage Results:\nChange from ${changeX} to ${changeY} is a ${Math.abs(changeResult).toFixed(2)}% ${typeStr}`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Percentage Calculation Output',
          text: text,
        });
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

  return (
    <div className="space-y-5">
      {/* Tab select bar */}
      <div className="flex border-b dark:border-slate-800">
        {[
          { id: 'basic', label: 'X% of Y' },
          { id: 'ratio', label: 'X is % of Y' },
          { id: 'change', label: '% Change' }
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

      {/* Input panel */}
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-black uppercase tracking-widest mb-4 ${isDarkMode ? 'text-blue-400' : 'text-primary'}`}>
          {tab === 'basic' && 'Find Value of Percentage'}
          {tab === 'ratio' && 'Find Ratio Percentage'}
          {tab === 'change' && 'Find Change Percentage'}
        </h3>

        <div className="space-y-4">
          {tab === 'basic' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-bold mb-1 block uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Percent (X%)</label>
                <input
                  type="number"
                  value={basicX}
                  onChange={(e) => setBasicX(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
              <div>
                <label className={`text-xs font-bold mb-1 block uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Of Total (Y)</label>
                <input
                  type="number"
                  value={basicY}
                  onChange={(e) => setBasicY(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
            </div>
          )}

          {tab === 'ratio' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-bold mb-1 block uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Value (X)</label>
                <input
                  type="number"
                  value={ratioX}
                  onChange={(e) => setRatioX(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
              <div>
                <label className={`text-xs font-bold mb-1 block uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Out of Total (Y)</label>
                <input
                  type="number"
                  value={ratioY}
                  onChange={(e) => setRatioY(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${
                    ratioWarning ? 'border-rose-500' : ''
                  } ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
                {ratioWarning && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                    <AlertTriangle size={12} />
                    <span>{ratioWarning}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'change' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-bold mb-1 block uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Initial Value (X)</label>
                <input
                  type="number"
                  value={changeX}
                  onChange={(e) => setChangeX(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${
                    changeWarning ? 'border-rose-500' : ''
                  } ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
                {changeWarning && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                    <AlertTriangle size={12} />
                    <span>{changeWarning}</span>
                  </div>
                )}
              </div>
              <div>
                <label className={`text-xs font-bold mb-1 block uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Final Value (Y)</label>
                <input
                  type="number"
                  value={changeY}
                  onChange={(e) => setChangeY(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-sm rounded-xl font-mono font-bold border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Outcome panel */}
      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        <div className="absolute top-0 right-0 p-3 flex gap-2">
          <button
            onClick={copyResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
            title="Copy Results"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
          <button
            onClick={shareResults}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
            }`}
            title="Share Results"
          >
            {shared ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-primary'}`}>
          Calculation Outcome
        </h3>

        <div className="text-center py-4">
          {tab === 'basic' && (
            <>
              <span className={`text-xs block font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {basicX}% of {basicY} is
              </span>
              <span className="text-4xl font-black font-mono tracking-tight text-emerald-500 mt-2 block">
                {basicResult.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })}
              </span>
            </>
          )}

          {tab === 'ratio' && (
            <>
              <span className={`text-xs block font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {ratioX} is what percentage of {ratioY}?
              </span>
              <span className="text-4xl font-black font-mono tracking-tight text-blue-500 dark:text-blue-400 mt-2 block">
                {ratioResult.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%
              </span>
            </>
          )}

          {tab === 'change' && (
            <>
              <span className={`text-xs block font-bold tracking-wide uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Percentage Change
              </span>
              <span className={`text-4xl font-black font-mono tracking-tight mt-2 block ${changeResult >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {changeResult >= 0 ? '+' : ''}{changeResult.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%
              </span>
              <p className={`text-[10px] uppercase font-black tracking-wider mt-2 ${changeResult >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {changeResult >= 0 ? 'Percentage Increase' : 'Percentage Decrease'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

