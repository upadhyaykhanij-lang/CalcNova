/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Star, Copy, Info, Check, Calculator, TrendingUp, Landmark, Coins, FileText, 
  Wallet, Share2, AlertTriangle, Receipt, User, Home, Car, GraduationCap, Sparkles, PiggyBank, 
  Briefcase, ShieldCheck, ArrowUpRight, Globe, Lock, Percent, LineChart, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import M3Icon from './M3Icon';

interface CalculatorWrapperProps {
  id: string;
  title: string;
  icon: string;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  isDarkMode: boolean;
  children: React.ReactNode;
}

export function CalculatorWrapper({
  title,
  icon,
  isFavorited,
  onToggleFavorite,
  onBack,
  isDarkMode,
  children
}: CalculatorWrapperProps) {
  const [copied, setCopied] = useState(false);

  const triggerCopyNotification = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
      {/* Header bar */}
      <div className={`flex items-center justify-between p-4 sticky top-0 z-10 backdrop-blur-md border-b ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
            } cursor-pointer`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-xl ${
              isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-accent-light text-primary'
            }`}>
              <M3Icon name={icon} size={20} />
            </div>
            <h2 className={`text-lg font-extrabold font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-primary'}`}>{title}</h2>
          </div>
        </div>

        <button
          onClick={onToggleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFavorited 
              ? 'text-amber-500 hover:bg-amber-500/10' 
              : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'
          } cursor-pointer`}
        >
          <Star size={20} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4 flex-1 space-y-6">
        {children}
      </div>
    </div>
  );
}

/* ==========================================
   1. EMI CALCULATOR
   ========================================== */
export function EMICalculator({ isDarkMode, onBack }: { isDarkMode: boolean; onBack?: () => void }) {
  // Inputs (stored as string to handle empty/mid-typing states gracefully)
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [loanTenure, setLoanTenure] = useState<string>('5');

  // Calculated states (pre-calculate for initial load, recalculate on button click or change)
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Validation Error messages
  const [errors, setErrors] = useState<{
    loanAmount?: string;
    interestRate?: string;
    loanTenure?: string;
  }>({});

  // Real-time or submit-time validation checker
  const validateInputs = (amount: string, rate: string, tenure: string) => {
    const newErrors: typeof errors = {};
    const amtNum = Number(amount);
    const rateNum = Number(rate);
    const tenureNum = Number(tenure);

    if (!amount || isNaN(amtNum) || amtNum <= 0) {
      newErrors.loanAmount = 'Enter a valid loan amount greater than 0';
    } else if (amtNum < 1000) {
      newErrors.loanAmount = 'Minimum loan amount is $1,000';
    } else if (amtNum > 100000000) {
      newErrors.loanAmount = 'Maximum loan amount is $100,000,000';
    }

    if (!rate || isNaN(rateNum) || rateNum <= 0) {
      newErrors.interestRate = 'Enter a valid annual interest rate greater than 0%';
    } else if (rateNum < 0.1) {
      newErrors.interestRate = 'Minimum interest rate is 0.1%';
    } else if (rateNum > 50) {
      newErrors.interestRate = 'Maximum interest rate is 50%';
    }

    if (!tenure || isNaN(tenureNum) || tenureNum <= 0) {
      newErrors.loanTenure = 'Enter a valid tenure greater than 0 years';
    } else if (tenureNum < 1) {
      newErrors.loanTenure = 'Minimum tenure is 1 year';
    } else if (tenureNum > 40) {
      newErrors.loanTenure = 'Maximum tenure is 40 years';
    }

    return newErrors;
  };

  // Perform calculation of EMI
  const calculateEMI = () => {
    const validationErrors = validateInputs(loanAmount, interestRate, loanTenure);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsCalculated(false);
      return;
    }

    const P = Number(loanAmount);
    const annualRate = Number(interestRate);
    const N = Number(loanTenure) * 12; // tenure in months

    const r = annualRate / (12 * 100); // monthly interest rate

    let emiValue = 0;
    if (r > 0) {
      emiValue = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    } else {
      emiValue = P / N;
    }

    const totalPaymentValue = emiValue * N;
    const totalInterestValue = Math.max(0, totalPaymentValue - P);

    setEmi(emiValue);
    setTotalInterest(totalInterestValue);
    setTotalPayment(totalPaymentValue);
    setIsCalculated(true);
  };

  // Reset all states to standard defaults
  const handleReset = () => {
    setLoanAmount('100000');
    setInterestRate('8.5');
    setLoanTenure('5');
    setEmi(0);
    setTotalInterest(0);
    setTotalPayment(0);
    setIsCalculated(false);
    setErrors({});
  };

  // Calculate automatically on component mount to present pre-filled default data
  useEffect(() => {
    calculateEMI();
  }, []);

  const principalRatio = totalPayment > 0 ? (Number(loanAmount) / totalPayment) * 100 : 100;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const copyResults = () => {
    if (!isCalculated) return;
    const text = `EMI Calculator Results:\nLoan Amount: $${Number(loanAmount).toLocaleString()}\nAnnual Interest Rate: ${interestRate}%\nLoan Tenure: ${loanTenure} Years\n\nMonthly EMI: $${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Interest Payable: $${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Payment (Principal + Interest): $${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    if (!isCalculated) return;
    const text = `EMI Calculator Results:\nLoan Amount: $${Number(loanAmount).toLocaleString()}\nAnnual Interest Rate: ${interestRate}%\nLoan Tenure: ${loanTenure} Years\n\nMonthly EMI: $${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Interest Payable: $${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nTotal Payment (Principal + Interest): $${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EMI Calculator Estimate',
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
      {/* Parameter Cards */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>LOAN CALCULATOR PARAMETERS</h3>
        
        <div className="space-y-5">
          {/* Loan Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Loan Amount ($)</label>
              <span className="font-mono text-xs text-blue-500 font-bold">
                ${(Number(loanAmount) || 0).toLocaleString()}
              </span>
            </div>
            
            <input
              type="range"
              min="1000"
              max="10000000"
              step="5000"
              value={Number(loanAmount) || 1000}
              onChange={(e) => {
                setLoanAmount(e.target.value);
                const errs = validateInputs(e.target.value, interestRate, loanTenure);
                setErrors(prev => ({ ...prev, loanAmount: errs.loanAmount }));
              }}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />

            <input
              type="number"
              value={loanAmount}
              placeholder="e.g. 100000"
              onChange={(e) => {
                setLoanAmount(e.target.value);
                const errs = validateInputs(e.target.value, interestRate, loanTenure);
                setErrors(prev => ({ ...prev, loanAmount: errs.loanAmount }));
              }}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.loanAmount ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {errors.loanAmount && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.loanAmount}
              </p>
            )}
          </div>

          {/* Annual Interest Rate Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Annual Interest Rate (%)</label>
              <span className="font-mono text-xs text-blue-500 font-bold">
                {Number(interestRate) || 0}%
              </span>
            </div>

            <input
              type="range"
              min="0.1"
              max="30"
              step="0.1"
              value={Number(interestRate) || 0.1}
              onChange={(e) => {
                setInterestRate(e.target.value);
                const errs = validateInputs(loanAmount, e.target.value, loanTenure);
                setErrors(prev => ({ ...prev, interestRate: errs.interestRate }));
              }}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />

            <input
              type="number"
              step="0.1"
              value={interestRate}
              placeholder="e.g. 8.5"
              onChange={(e) => {
                setInterestRate(e.target.value);
                const errs = validateInputs(loanAmount, e.target.value, loanTenure);
                setErrors(prev => ({ ...prev, interestRate: errs.interestRate }));
              }}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.interestRate ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {errors.interestRate && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.interestRate}
              </p>
            )}
          </div>

          {/* Loan Tenure (Years) Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Loan Tenure (Years)</label>
              <span className="font-mono text-xs text-blue-500 font-bold">
                {Number(loanTenure) || 0} Years
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={Number(loanTenure) || 1}
              onChange={(e) => {
                setLoanTenure(e.target.value);
                const errs = validateInputs(loanAmount, interestRate, e.target.value);
                setErrors(prev => ({ ...prev, loanTenure: errs.loanTenure }));
              }}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />

            <input
              type="number"
              value={loanTenure}
              placeholder="e.g. 5"
              onChange={(e) => {
                setLoanTenure(e.target.value);
                const errs = validateInputs(loanAmount, interestRate, e.target.value);
                setErrors(prev => ({ ...prev, loanTenure: errs.loanTenure }));
              }}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.loanTenure ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {errors.loanTenure && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {errors.loanTenure}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleReset}
              className={`py-3 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 text-xs uppercase ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Reset
            </button>
            <button
              onClick={calculateEMI}
              className="py-3 px-4 rounded-2xl font-bold tracking-wide transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 border border-blue-600 cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 text-xs uppercase"
            >
              <Calculator size={14} />
              Calculate
            </button>
          </div>
        </div>
      </div>

      {/* Results View */}
      {isCalculated ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
            isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
          }`}
        >
          {/* Quick Copy / Share buttons in Results */}
          <div className="absolute top-0 right-0 p-3 flex items-center gap-2">
            <button
              onClick={copyResults}
              title="Copy results"
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
              }`}
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            </button>
            <button
              onClick={shareResults}
              title="Share results"
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
              }`}
            >
              {shared ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            </button>
          </div>

          <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>EMI SUMMARY ESTIMATE</h3>

          <div className="space-y-4">
            <div className="text-center py-2">
              <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>Monthly EMI</span>
              <span className={`text-3xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
                ${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed border-blue-200 dark:border-blue-900/40">
              <div>
                <span className={`text-[10px] block font-bold tracking-widest uppercase mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>Total Interest</span>
                <span className={`text-base font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className={`text-[10px] block font-bold tracking-widest uppercase mb-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>Total Payment</span>
                <span className={`text-base font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  ${totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Split Breakdown */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Principal ({principalRatio.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Interest ({interestRatio.toFixed(1)}%)</span>
                </div>
              </div>

              {/* Progress bar representing ratio */}
              <div className="w-24 h-4 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 shadow-inner">
                <div style={{ width: `${principalRatio}%` }} className="bg-blue-600 h-full"></div>
                <div style={{ width: `${interestRatio}%` }} className="bg-amber-500 h-full"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className={`p-6 text-center rounded-3xl border border-dashed ${
          isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
        }`}>
          <Calculator className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-xs font-medium">Please enter valid inputs and click Calculate to view results.</p>
        </div>
      )}

      {/* Back button to return to Finance View */}
      {onBack && (
        <div className="pt-2">
          <button
            onClick={onBack}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700 hover:text-white text-slate-300' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <ChevronLeft size={16} />
            Back to Finance Page
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   2. SIP CALCULATOR
   ========================================== */
export interface SIPCalculatorProps {
  isDarkMode: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onBack?: () => void;
  language?: 'en' | 'hi';
}

export function SIPCalculator({ 
  isDarkMode, 
  isFavorited = false, 
  onToggleFavorite, 
  onBack,
  language = 'en'
}: SIPCalculatorProps) {
  const [monthlyInvest, setMonthlyInvest] = useState(1000);
  const [returnRate, setReturnRate] = useState(12);
  const [period, setPeriod] = useState(10);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Translation Dictionary
  const dict = {
    en: {
      paramsTitle: "SIP CALCULATOR PARAMETERS",
      monthlyLabel: "Monthly Investment",
      returnLabel: "Expected Return Rate (p.a.)",
      periodLabel: "Investment Period",
      years: "Years",
      minWarning: "Min investment is $10",
      maxWarning: "Max investment is $1,000,000",
      rateMinWarning: "Min return rate is 0.1%",
      rateMaxWarning: "Max return rate is 50%",
      periodMinWarning: "Min period is 1 year",
      periodMaxWarning: "Max period is 50 years",
      estimatedMaturity: "ESTIMATED MATURITY",
      futureValue: "TOTAL MATURITY AMOUNT",
      totalInvested: "Total Investment",
      wealthGained: "Total Returns",
      invested: "Invested",
      wealthGain: "Wealth Gain",
      growthChart: "YEARLY GROWTH PROJECTION",
      chartSubtitle: "Hover/tap columns to explore year-by-year value compounding",
      year: "Year",
      backBtn: "Back to Finance Page",
      savedToFav: "Saved in Favorites",
      saveToFav: "Save to Favorites",
      copySuccess: "Copied!",
      shareSuccess: "Shared!",
      copiedToast: "SIP results successfully copied to clipboard!",
      sharedToast: "SIP results shared successfully!",
    },
    hi: {
      paramsTitle: "एसआईपी कैलकुलेटर पैरामीटर",
      monthlyLabel: "मासिक निवेश",
      returnLabel: "अपेक्षित वार्षिक रिटर्न (%)",
      periodLabel: "निवेश अवधि",
      years: "वर्ष",
      minWarning: "न्यूनतम निवेश ₹10 है",
      maxWarning: "अधिकतम निवेश ₹1,000,000 है",
      rateMinWarning: "न्यूनतम रिटर्न दर 0.1% है",
      rateMaxWarning: "अधिकतम रिटर्न दर 50% है",
      periodMinWarning: "न्यूनतम अवधि 1 वर्ष है",
      periodMaxWarning: "अधिकतम अवधि 50 वर्ष है",
      estimatedMaturity: "अनुमानित परिपक्वता",
      futureValue: "कुल परिपक्वता राशि",
      totalInvested: "कुल निवेश",
      wealthGained: "कुल रिटर्न",
      invested: "कुल निवेश",
      wealthGain: "अनुमानित वेल्थ",
      growthChart: "वार्षिक वृद्धि अनुमान",
      chartSubtitle: "वर्ष-दर-वर्ष संचयी मूल्य देखने के लिए कॉलम पर होवर/टैप करें",
      year: "वर्ष",
      backBtn: "फाइनेंस पेज पर वापस जाएं",
      savedToFav: "पसंदीदा में सुरक्षित",
      saveToFav: "पसंदीदा में सहेजें",
      copySuccess: "कॉपी किया गया!",
      shareSuccess: "साझा किया गया!",
      copiedToast: "एसआईपी परिणाम क्लिपबोर्ड पर सफलतापूर्वक कॉपी हो गए!",
      sharedToast: "एसआईपी परिणाम सफलतापूर्वक साझा किए गए!",
    }
  };

  const t = dict[language] || dict.en;
  const sym = language === 'hi' ? '₹' : '$';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Validations
  const investWarning = monthlyInvest < 10 ? t.minWarning : monthlyInvest > 1000000 ? t.maxWarning : null;
  const rateWarning = returnRate < 0.1 ? t.rateMinWarning : returnRate > 50 ? t.rateMaxWarning : null;
  const periodWarning = period < 1 ? t.periodMinWarning : period > 50 ? t.periodMaxWarning : null;

  // Clean values for calculation
  const validInvest = Math.max(0, monthlyInvest);
  const validRate = Math.max(0, returnRate);
  const validPeriod = Math.max(1, period);

  const months = validPeriod * 12;
  const i = validRate / (12 * 100); // monthly return rate

  // Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  let totalValue = 0;
  if (i > 0) {
    totalValue = validInvest * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
  } else {
    totalValue = validInvest * months;
  }

  const invested = validInvest * months;
  const wealthGained = Math.max(0, totalValue - invested);
  const wealthRatio = totalValue > 0 ? (wealthGained / totalValue) * 100 : 0;
  const investRatio = totalValue > 0 ? (invested / totalValue) * 100 : 0;

  // Generate Year-by-Year growth projection data
  const chartData: Array<{ year: number; invested: number; wealth: number; total: number }> = [];
  for (let y = 1; y <= validPeriod; y++) {
    const m = y * 12;
    let fv = 0;
    if (i > 0) {
      fv = validInvest * ((Math.pow(1 + i, m) - 1) / i) * (1 + i);
    } else {
      fv = validInvest * m;
    }
    const inv = validInvest * m;
    const wealth = Math.max(0, fv - inv);
    chartData.push({
      year: y,
      invested: Math.round(inv),
      wealth: Math.round(wealth),
      total: Math.round(fv)
    });
  }

  // Active hover projection details (defaults to final year)
  const activeYearData = hoveredIdx !== null ? chartData[hoveredIdx] : chartData[chartData.length - 1];

  const formatCompact = (num: number) => {
    if (num >= 10000000) {
      return sym + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000000) {
      return sym + (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    }
    if (num >= 1000) {
      return sym + (num / 1000).toFixed(0) + 'K';
    }
    return sym + num;
  };

  const copyResults = () => {
    const text = `SIP Calculator Results (${language === 'hi' ? 'Hindi' : 'English'}):
- ${t.monthlyLabel}: ${sym}${validInvest.toLocaleString()}
- ${t.returnLabel}: ${validRate}%
- ${t.periodLabel}: ${validPeriod} ${t.years}

- ${t.totalInvested}: ${sym}${invested.toLocaleString()}
- ${t.wealthGained}: ${sym}${Math.round(wealthGained).toLocaleString()}
- ${t.futureValue}: ${sym}${Math.round(totalValue).toLocaleString()}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(t.copiedToast);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `SIP Calculator Estimate:
- ${t.monthlyLabel}: ${sym}${validInvest.toLocaleString()}
- ${t.returnLabel}: ${validRate}%
- ${t.periodLabel}: ${validPeriod} ${t.years}

- ${t.totalInvested}: ${sym}${invested.toLocaleString()}
- ${t.wealthGained}: ${sym}${Math.round(wealthGained).toLocaleString()}
- ${t.futureValue}: ${sym}${Math.round(totalValue).toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SIP Investment Estimate',
          text: text,
        });
        setShared(true);
        showToast(t.sharedToast);
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

  // Helper for dynamic bar chart labels
  const shouldShowLabel = (yr: number) => {
    if (validPeriod <= 10) return true;
    if (validPeriod <= 20) return yr % 2 === 0 || yr === 1 || yr === validPeriod;
    if (validPeriod <= 35) return yr % 5 === 0 || yr === 1 || yr === validPeriod;
    return yr % 10 === 0 || yr === 1 || yr === validPeriod;
  };

  // SVG Chart scale setups
  const maxY = Math.max(100, totalValue * 1.05);
  const chartHeight = 160;
  const chartWidth = 430;
  const plotLeft = 60;
  const plotRight = 420;
  const plotWidth = plotRight - plotLeft;
  const plotBottom = 180;
  const plotTop = 20;
  const plotHeight = plotBottom - plotTop;

  const barStep = plotWidth / validPeriod;
  const barWidth = Math.max(2, barStep * 0.65);

  return (
    <div className="space-y-5">
      {/* Parameters Input Card */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.paramsTitle}
        </h3>
        
        <div className="space-y-5">
          {/* Monthly Investment */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.monthlyLabel}</label>
              <span className="font-mono text-xs text-emerald-500 font-bold">{sym}{monthlyInvest.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10"
              max="20000"
              step="100"
              value={monthlyInvest > 20000 ? 20000 : monthlyInvest}
              onChange={(e) => setMonthlyInvest(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              value={monthlyInvest === 0 ? '' : monthlyInvest}
              placeholder="e.g. 5000"
              onChange={(e) => setMonthlyInvest(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                investWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {investWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {investWarning}
              </p>
            )}
          </div>

          {/* Expected Returns */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.returnLabel}</label>
              <span className="font-mono text-xs text-emerald-500 font-bold">{returnRate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={returnRate > 30 ? 30 : returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              step="0.1"
              value={returnRate === 0 ? '' : returnRate}
              placeholder="e.g. 12"
              onChange={(e) => setReturnRate(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                rateWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {rateWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {rateWarning}
              </p>
            )}
          </div>

          {/* Period */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.periodLabel} ({t.years})</label>
              <span className="font-mono text-xs text-emerald-500 font-bold">{period} {t.years}</span>
            </div>
            <input
              type="range"
              min="1"
              max="45"
              step="1"
              value={period > 45 ? 45 : period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              value={period === 0 ? '' : period}
              placeholder="e.g. 15"
              onChange={(e) => setPeriod(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                periodWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {periodWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {periodWarning}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Outputs Card */}
      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        {/* Quick actions top-right corner */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={copyResults}
            title={t.copySuccess}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-xs border border-slate-100'
            }`}
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={shareResults}
            title={t.shareSuccess}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-xs border border-slate-100'
            }`}
          >
            {shared ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          {t.estimatedMaturity}
        </h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
              {t.futureValue}
            </span>
            <span className="text-3xl font-black font-display tracking-tight text-emerald-600 dark:text-emerald-400">
              {sym}{Math.round(totalValue).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed border-blue-200 dark:border-blue-900/40">
            <div>
              <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                {t.totalInvested}
              </span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>
                {sym}{invested.toLocaleString()}
              </span>
            </div>
            <div>
              <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                {t.wealthGained}
              </span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>
                {sym}{Math.round(wealthGained).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Interactive Stacked Ratio Bar */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {t.invested} ({investRatio.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {t.wealthGain} ({wealthRatio.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 shadow-inner">
              <div style={{ width: `${investRatio}%` }} className="bg-blue-500 h-full transition-all duration-500"></div>
              <div style={{ width: `${wealthRatio}%` }} className="bg-emerald-500 h-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Save to Favorites toggle directly inside results block */}
          {onToggleFavorite && (
            <div className="pt-3 border-t border-slate-200/50 dark:border-slate-850/50 flex justify-center">
              <button
                onClick={onToggleFavorite}
                className={`w-full py-3 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase ${
                  isFavorited
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    : isDarkMode
                      ? 'bg-slate-800/60 border-slate-750 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <Star size={14} fill={isFavorited ? 'currentColor' : 'none'} className="text-amber-500" />
                <span>{isFavorited ? t.savedToFav : t.saveToFav}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Yearly Growth Projection Chart Card */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <div className="mb-4">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.growthChart}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            {t.chartSubtitle}
          </p>
        </div>

        {/* SVG Interactive Column Chart */}
        <div className="relative w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[320px] w-full">
            <svg 
              viewBox="0 0 500 240" 
              className="w-full h-auto"
              style={{ overflow: 'visible' }}
            >
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, gridIdx) => {
                const gridVal = p * maxY;
                const gridY = plotBottom - p * plotHeight;
                return (
                  <g key={gridIdx}>
                    <line 
                      x1={plotLeft} 
                      y1={gridY} 
                      x2={plotRight} 
                      y2={gridY} 
                      stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} 
                      strokeWidth={1}
                      strokeDasharray={gridIdx === 0 ? "none" : "3,3"} 
                    />
                    <text 
                      x={plotLeft - 8} 
                      y={gridY + 3.5} 
                      textAnchor="end" 
                      className={`text-[9px] font-mono font-semibold ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
                    >
                      {formatCompact(gridVal)}
                    </text>
                  </g>
                );
              })}

              {/* Chart columns (Bars) */}
              {chartData.map((item, idx) => {
                const xCenter = plotLeft + idx * barStep + barStep / 2;
                const xPos = xCenter - barWidth / 2;
                const investedHeight = (item.invested / maxY) * plotHeight;
                const wealthHeight = (item.wealth / maxY) * plotHeight;
                const isHovered = hoveredIdx === idx;

                return (
                  <g key={idx}>
                    {/* Hover Column highlight backing */}
                    {isHovered && (
                      <rect 
                        x={xCenter - barStep / 2} 
                        y={plotTop} 
                        width={barStep} 
                        height={plotHeight} 
                        fill={isDarkMode ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.04)"} 
                        rx={6} 
                      />
                    )}

                    {/* Invested Bar portion (Blue) */}
                    <rect 
                      x={xPos} 
                      y={plotBottom - investedHeight} 
                      width={barWidth} 
                      height={investedHeight} 
                      fill={isHovered ? "#2563eb" : "#3b82f6"} 
                      rx={1.5} 
                      className="transition-all duration-200"
                    />

                    {/* Wealth Gained portion (Emerald) */}
                    <rect 
                      x={xPos} 
                      y={plotBottom - investedHeight - wealthHeight} 
                      width={barWidth} 
                      height={wealthHeight} 
                      fill={isHovered ? "#059669" : "#10b981"} 
                      rx={1.5} 
                      className="transition-all duration-200"
                    />

                    {/* X-axis year markings */}
                    {shouldShowLabel(item.year) && (
                      <g>
                        <line 
                          x1={xCenter} 
                          y1={plotBottom} 
                          x2={xCenter} 
                          y2={plotBottom + 4} 
                          stroke={isDarkMode ? "#334155" : "#cbd5e1"} 
                        />
                        <text 
                          x={xCenter} 
                          y={plotBottom + 16} 
                          textAnchor="middle" 
                          className={`text-[9px] font-mono font-bold ${
                            isHovered 
                              ? isDarkMode ? 'fill-blue-400' : 'fill-blue-600'
                              : isDarkMode ? 'fill-slate-500' : 'fill-slate-400'
                          }`}
                        >
                          {item.year}
                        </text>
                      </g>
                    )}

                    {/* Wider invisible interactive mouse/touch sensor */}
                    <rect 
                      x={xCenter - barStep / 2} 
                      y={plotTop} 
                      width={barStep} 
                      height={plotHeight} 
                      fill="transparent" 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onTouchStart={() => setHoveredIdx(idx)}
                    />
                  </g>
                );
              })}

              {/* Coordinate axis lines */}
              <line 
                x1={plotLeft} 
                y1={plotBottom} 
                x2={plotRight} 
                y2={plotBottom} 
                stroke={isDarkMode ? "#334155" : "#cbd5e1"} 
                strokeWidth={1.5} 
              />
              <line 
                x1={plotLeft} 
                y1={plotTop} 
                x2={plotLeft} 
                y2={plotBottom} 
                stroke={isDarkMode ? "#334155" : "#cbd5e1"} 
                strokeWidth={1.5} 
              />

              {/* X Axis Label */}
              <text 
                x={(plotLeft + plotRight) / 2} 
                y={plotBottom + 34} 
                textAnchor="middle" 
                className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
              >
                {t.periodLabel} ({t.years})
              </text>
            </svg>
          </div>
        </div>

        {/* Dynamic Hover Tooltip Breakdown Container */}
        <div className="mt-4">
          {activeYearData && (
            <motion.div 
              key={activeYearData.year}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-slate-50 border-slate-150'
              }`}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.year} {activeYearData.year} {language === 'hi' ? 'का अनुमान' : 'Compounding'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {activeYearData.year} {t.years.toLowerCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className={`text-[9px] block font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.invested}</span>
                  <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {sym}{activeYearData.invested.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className={`text-[9px] block font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.wealthGain}</span>
                  <span className="text-xs font-bold font-mono text-emerald-500">
                    {sym}{activeYearData.wealth.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className={`text-[9px] block font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Value</span>
                  <span className="text-xs font-bold font-mono text-blue-500">
                    {sym}{activeYearData.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Back button to return to Finance View */}
      {onBack && (
        <div className="pt-2">
          <button
            onClick={onBack}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700 hover:text-white text-slate-300' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <ChevronLeft size={16} />
            {t.backBtn}
          </button>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   3. FD (FIXED DEPOSIT) CALCULATOR
   ========================================== */
export interface FDCalculatorProps {
  isDarkMode: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onBack?: () => void;
  language?: 'en' | 'hi';
}

export function FDCalculator({ 
  isDarkMode, 
  isFavorited = false, 
  onToggleFavorite, 
  onBack,
  language = 'en'
}: FDCalculatorProps) {
  const [deposit, setDeposit] = useState(10000);
  const [interest, setInterest] = useState(7.1);
  const [tenure, setTenure] = useState(5); // Years
  const [compounding, setCompounding] = useState<number>(4); // Quarterly compounding
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Translation Dictionary
  const dict = {
    en: {
      paramsTitle: "FD CALCULATOR PARAMETERS",
      depositLabel: "Deposit Amount",
      interestLabel: "Expected Rate of Interest (p.a.)",
      tenureLabel: "Tenure (Investment Period)",
      compoundingLabel: "Compounding Frequency",
      years: "Years",
      minWarning: "Min deposit is $500",
      maxWarning: "Max deposit is $10,000,000",
      rateMinWarning: "Min interest rate is 0.1%",
      rateMaxWarning: "Max interest rate is 30%",
      tenureMinWarning: "Min tenure is 1 Year",
      tenureMaxWarning: "Max tenure is 40 Years",
      estimatedMaturity: "ESTIMATED MATURITY BREAKDOWN",
      futureValue: "TOTAL MATURITY AMOUNT",
      totalInvested: "Invested Principal",
      interestEarned: "Interest Earned",
      invested: "Principal",
      interestGain: "Interest",
      growthChart: "COMPOUNDING GROWTH TIMELINE",
      chartSubtitle: "Hover/tap columns to see how compounding accelerates your wealth",
      year: "Year",
      backBtn: "Back to Finance Page",
      savedToFav: "Saved in Favorites",
      saveToFav: "Save to Favorites",
      copySuccess: "Copied!",
      shareSuccess: "Shared!",
      copiedToast: "FD results successfully copied to clipboard!",
      sharedToast: "FD results shared successfully!",
      yearly: "Yearly",
      halfYearly: "Half-Yearly",
      quarterly: "Quarterly",
      monthly: "Monthly"
    },
    hi: {
      paramsTitle: "एफडी कैलकुलेटर पैरामीटर",
      depositLabel: "जमा राशि",
      interestLabel: "ब्याज दर (वार्षिक %)",
      tenureLabel: "जमा अवधि",
      compoundingLabel: "चक्रवृद्धि आवृत्ति",
      years: "वर्ष",
      minWarning: "न्यूनतम जमा ₹500 है",
      maxWarning: "अधिकतम जमा ₹10,000,000 है",
      rateMinWarning: "न्यूनतम ब्याज दर 0.1% है",
      rateMaxWarning: "अधिकतम ब्याज दर 30% है",
      tenureMinWarning: "न्यूनतम अवधि 1 वर्ष है",
      tenureMaxWarning: "अधिकतम अवधि 40 वर्ष है",
      estimatedMaturity: "अनुमानित परिपक्वता विवरण",
      futureValue: "कुल परिपक्वता राशि",
      totalInvested: "मूल निवेश राशि",
      interestEarned: "अर्जित कुल ब्याज",
      invested: "मूलधन",
      interestGain: "अर्जित ब्याज",
      growthChart: "चक्रवृद्धि विकास समयरेखा",
      chartSubtitle: "ब्याज दर वृद्धि और मूल्य परिवर्तन देखने के लिए होवर/टैप करें",
      year: "वर्ष",
      backBtn: "फाइनेंस पेज पर वापस जाएं",
      savedToFav: "पसंदीदा में सुरक्षित",
      saveToFav: "पसंदीदा में सहेजें",
      copySuccess: "कॉपी किया गया!",
      shareSuccess: "साझा किया गया!",
      copiedToast: "एफडी परिणाम क्लिपबोर्ड पर सफलतापूर्वक कॉपी हो गए!",
      sharedToast: "एफडी परिणाम सफलतापूर्वक साझा किए गए!",
      yearly: "वार्षिक",
      halfYearly: "अर्ध-वार्षिक",
      quarterly: "त्रैमासिक",
      monthly: "मासिक"
    }
  };

  const t = dict[language] || dict.en;
  const sym = language === 'hi' ? '₹' : '$';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Validations
  const depositWarning = deposit < 500 ? t.minWarning : deposit > 10000000 ? t.maxWarning : null;
  const interestWarning = interest < 0.1 ? t.rateMinWarning : interest > 30 ? t.rateMaxWarning : null;
  const tenureWarning = tenure < 1 ? t.tenureMinWarning : tenure > 40 ? t.tenureMaxWarning : null;

  // Clean values for calculation
  const validDeposit = Math.max(0, deposit);
  const validInterest = Math.max(0, interest);
  const validTenure = Math.max(1, tenure);

  // Formula: A = P * (1 + r/n)^(n*t)
  const r = validInterest / 100;
  const n = compounding;
  
  const totalValue = validDeposit * Math.pow(1 + r/n, n * validTenure);
  const interestEarned = Math.max(0, totalValue - validDeposit);

  const investRatio = totalValue > 0 ? (validDeposit / totalValue) * 100 : 100;
  const interestRatio = totalValue > 0 ? (interestEarned / totalValue) * 100 : 0;

  // Generate Year-by-Year compounding growth data
  const chartData: Array<{ year: number; invested: number; interest: number; total: number }> = [];
  for (let y = 1; y <= validTenure; y++) {
    const fv = validDeposit * Math.pow(1 + r/n, n * y);
    const earned = Math.max(0, fv - validDeposit);
    chartData.push({
      year: y,
      invested: Math.round(validDeposit),
      interest: Math.round(earned),
      total: Math.round(fv)
    });
  }

  // Active hover data breakdown
  const activeYearData = hoveredIdx !== null ? chartData[hoveredIdx] : chartData[chartData.length - 1];

  const formatCompact = (num: number) => {
    if (num >= 10000000) {
      return sym + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000000) {
      return sym + (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    }
    if (num >= 1000) {
      return sym + (num / 1000).toFixed(0) + 'K';
    }
    return sym + num;
  };

  const copyResults = () => {
    const text = `Fixed Deposit Calculator Results (${language === 'hi' ? 'Hindi' : 'English'}):
- ${t.depositLabel}: ${sym}${validDeposit.toLocaleString()}
- ${t.interestLabel}: ${validInterest}%
- ${t.tenureLabel}: ${validTenure} ${t.years}
- ${t.compoundingLabel}: ${compounding === 1 ? t.yearly : compounding === 2 ? t.halfYearly : compounding === 4 ? t.quarterly : t.monthly}

- ${t.totalInvested}: ${sym}${validDeposit.toLocaleString()}
- ${t.interestEarned}: ${sym}${Math.round(interestEarned).toLocaleString()}
- ${t.futureValue}: ${sym}${Math.round(totalValue).toLocaleString()}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(t.copiedToast);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Fixed Deposit Calculation:
- ${t.depositLabel}: ${sym}${validDeposit.toLocaleString()}
- ${t.interestLabel}: ${validInterest}%
- ${t.tenureLabel}: ${validTenure} ${t.years}
- ${t.compoundingLabel}: ${compounding === 1 ? t.yearly : compounding === 2 ? t.halfYearly : compounding === 4 ? t.quarterly : t.monthly}

- ${t.totalInvested}: ${sym}${validDeposit.toLocaleString()}
- ${t.interestEarned}: ${sym}${Math.round(interestEarned).toLocaleString()}
- ${t.futureValue}: ${sym}${Math.round(totalValue).toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fixed Deposit Estimate',
          text: text,
        });
        setShared(true);
        showToast(t.sharedToast);
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

  const shouldShowLabel = (yr: number) => {
    if (validTenure <= 10) return true;
    if (validTenure <= 20) return yr % 2 === 0 || yr === 1 || yr === validTenure;
    if (validTenure <= 35) return yr % 5 === 0 || yr === 1 || yr === validTenure;
    return yr % 10 === 0 || yr === 1 || yr === validTenure;
  };

  // SVG Chart Dimensions & Bounds
  const maxY = Math.max(100, totalValue * 1.05);
  const chartHeight = 160;
  const chartWidth = 430;
  const plotLeft = 60;
  const plotRight = 420;
  const plotWidth = plotRight - plotLeft;
  const plotBottom = 180;
  const plotTop = 20;
  const plotHeight = plotBottom - plotTop;

  const barStep = plotWidth / validTenure;
  const barWidth = Math.max(2, barStep * 0.65);

  return (
    <div className="space-y-5">
      {/* Parameters Input Card */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.paramsTitle}
        </h3>
        
        <div className="space-y-5">
          {/* Deposit Amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.depositLabel}</label>
              <span className="font-mono text-xs text-blue-500 font-bold">{sym}{deposit.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="1000000"
              step="500"
              value={deposit > 1000000 ? 1000000 : deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              value={deposit === 0 ? '' : deposit}
              placeholder="e.g. 50000"
              onChange={(e) => setDeposit(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                depositWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {depositWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {depositWarning}
              </p>
            )}
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.interestLabel}</label>
              <span className="font-mono text-xs text-blue-500 font-bold">{interest}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.05"
              value={interest > 15 ? 15 : interest}
              onChange={(e) => setInterest(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              step="0.01"
              value={interest === 0 ? '' : interest}
              placeholder="e.g. 7.1"
              onChange={(e) => setInterest(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                interestWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {interestWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {interestWarning}
              </p>
            )}
          </div>

          {/* Time Period / Tenure */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.tenureLabel} ({t.years})</label>
              <span className="font-mono text-xs text-blue-500 font-bold">{tenure} {t.years}</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={tenure > 25 ? 25 : tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              value={tenure === 0 ? '' : tenure}
              placeholder="e.g. 5"
              onChange={(e) => setTenure(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                tenureWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {tenureWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {tenureWarning}
              </p>
            )}
          </div>

          {/* Compounding Frequency Options */}
          <div>
            <label className={`text-sm font-semibold block mb-2.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.compoundingLabel}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {[
                { label: t.yearly, val: 1 },
                { label: t.halfYearly, val: 2 },
                { label: t.quarterly, val: 4 },
                { label: t.monthly, val: 12 }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setCompounding(item.val)}
                  className={`py-2.5 px-3 rounded-xl transition-all border cursor-pointer active:scale-[0.98] ${
                    compounding === item.val
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : isDarkMode
                        ? 'bg-slate-800 border-slate-750 text-slate-300 hover:bg-slate-750'
                        : 'bg-slate-50 border-slate-200 text-slate-750 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Estimated Maturity Details */}
      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        {/* Quick action buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={copyResults}
            title={t.copySuccess}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-xs border border-slate-100'
            }`}
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={shareResults}
            title={t.shareSuccess}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-xs border border-slate-100'
            }`}
          >
            {shared ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          {t.estimatedMaturity}
        </h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
              {t.futureValue}
            </span>
            <span className="text-3xl font-black font-display tracking-tight text-blue-600 dark:text-blue-400">
              {sym}{Math.round(totalValue).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed border-blue-200 dark:border-blue-900/40">
            <div>
              <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                {t.totalInvested}
              </span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>
                {sym}{validDeposit.toLocaleString()}
              </span>
            </div>
            <div>
              <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                {t.interestEarned}
              </span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>
                {sym}{Math.round(interestEarned).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Interactive Stacked Ratio Bar */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {t.invested} ({investRatio.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {t.interestGain} ({interestRatio.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 shadow-inner">
              <div style={{ width: `${investRatio}%` }} className="bg-blue-500 h-full transition-all duration-500"></div>
              <div style={{ width: `${interestRatio}%` }} className="bg-emerald-500 h-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Save to Favorites toggle button */}
          {onToggleFavorite && (
            <div className="pt-3 border-t border-slate-200/50 dark:border-slate-850/50 flex justify-center">
              <button
                onClick={onToggleFavorite}
                className={`w-full py-3 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase ${
                  isFavorited
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    : isDarkMode
                      ? 'bg-slate-800/60 border-slate-750 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <Star size={14} fill={isFavorited ? 'currentColor' : 'none'} className="text-amber-500" />
                <span>{isFavorited ? t.savedToFav : t.saveToFav}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Growth Projection Chart Card */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <div className="mb-4">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.growthChart}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            {t.chartSubtitle}
          </p>
        </div>

        {/* SVG Column Chart */}
        <div className="relative w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[320px] w-full">
            <svg 
              viewBox="0 0 500 240" 
              className="w-full h-auto"
              style={{ overflow: 'visible' }}
            >
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, gridIdx) => {
                const gridVal = p * maxY;
                const gridY = plotBottom - p * plotHeight;
                return (
                  <g key={gridIdx}>
                    <line 
                      x1={plotLeft} 
                      y1={gridY} 
                      x2={plotRight} 
                      y2={gridY} 
                      stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} 
                      strokeWidth={1}
                      strokeDasharray={gridIdx === 0 ? "none" : "3,3"} 
                    />
                    <text 
                      x={plotLeft - 8} 
                      y={gridY + 3.5} 
                      textAnchor="end" 
                      className={`text-[9px] font-mono font-semibold ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
                    >
                      {formatCompact(gridVal)}
                    </text>
                  </g>
                );
              })}

              {/* Chart columns (Bars) */}
              {chartData.map((item, idx) => {
                const xCenter = plotLeft + idx * barStep + barStep / 2;
                const xPos = xCenter - barWidth / 2;
                const investedHeight = (item.invested / maxY) * plotHeight;
                const interestHeight = (item.interest / maxY) * plotHeight;
                const isHovered = hoveredIdx === idx;

                return (
                  <g key={idx}>
                    {/* Hover Column highlight backing */}
                    {isHovered && (
                      <rect 
                        x={xCenter - barStep / 2} 
                        y={plotTop} 
                        width={barStep} 
                        height={plotHeight} 
                        fill={isDarkMode ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.04)"} 
                        rx={6} 
                      />
                    )}

                    {/* Principal portion (Blue) */}
                    <rect 
                      x={xPos} 
                      y={plotBottom - investedHeight} 
                      width={barWidth} 
                      height={investedHeight} 
                      fill={isHovered ? "#2563eb" : "#3b82f6"} 
                      rx={1.5} 
                      className="transition-all duration-200"
                    />

                    {/* Compounded Interest portion (Emerald) */}
                    <rect 
                      x={xPos} 
                      y={plotBottom - investedHeight - interestHeight} 
                      width={barWidth} 
                      height={interestHeight} 
                      fill={isHovered ? "#059669" : "#10b981"} 
                      rx={1.5} 
                      className="transition-all duration-200"
                    />

                    {/* X-axis year labels */}
                    {shouldShowLabel(item.year) && (
                      <g>
                        <line 
                          x1={xCenter} 
                          y1={plotBottom} 
                          x2={xCenter} 
                          y2={plotBottom + 4} 
                          stroke={isDarkMode ? "#334155" : "#cbd5e1"} 
                        />
                        <text 
                          x={xCenter} 
                          y={plotBottom + 16} 
                          textAnchor="middle" 
                          className={`text-[9px] font-mono font-bold ${
                            isHovered 
                              ? isDarkMode ? 'fill-blue-400' : 'fill-blue-600'
                              : isDarkMode ? 'fill-slate-500' : 'fill-slate-400'
                          }`}
                        >
                          {item.year}
                        </text>
                      </g>
                    )}

                    {/* Touch / mouse sensory hotspot */}
                    <rect 
                      x={xCenter - barStep / 2} 
                      y={plotTop} 
                      width={barStep} 
                      height={plotHeight} 
                      fill="transparent" 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onTouchStart={() => setHoveredIdx(idx)}
                    />
                  </g>
                );
              })}

              {/* Grid axes */}
              <line 
                x1={plotLeft} 
                y1={plotBottom} 
                x2={plotRight} 
                y2={plotBottom} 
                stroke={isDarkMode ? "#334155" : "#cbd5e1"} 
                strokeWidth={1.5} 
              />
              <line 
                x1={plotLeft} 
                y1={plotTop} 
                x2={plotLeft} 
                y2={plotBottom} 
                stroke={isDarkMode ? "#334155" : "#cbd5e1"} 
                strokeWidth={1.5} 
              />

              {/* X Axis Title */}
              <text 
                x={(plotLeft + plotRight) / 2} 
                y={plotBottom + 34} 
                textAnchor="middle" 
                className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
              >
                {t.tenureLabel} ({t.years})
              </text>
            </svg>
          </div>
        </div>

        {/* Compound Year Tooltip breakdown */}
        <div className="mt-4">
          {activeYearData && (
            <motion.div 
              key={activeYearData.year}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-slate-50 border-slate-150'
              }`}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                  {t.year} {activeYearData.year} {language === 'hi' ? 'पर संचित मूल्य' : 'Accumulated Value'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {activeYearData.year} {t.years.toLowerCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className={`text-[9px] block font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.invested}</span>
                  <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {sym}{activeYearData.invested.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className={`text-[9px] block font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.interestGain}</span>
                  <span className="text-xs font-bold font-mono text-emerald-500">
                    {sym}{activeYearData.interest.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className={`text-[9px] block font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Value</span>
                  <span className="text-xs font-bold font-mono text-blue-500">
                    {sym}{activeYearData.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Back to Finance page Button */}
      {onBack && (
        <div className="pt-2">
          <button
            onClick={onBack}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700 hover:text-white text-slate-300' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs'
            }`}
          >
            <ChevronLeft size={16} />
            {t.backBtn}
          </button>
        </div>
      )}

      {/* Toast snackbar element */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed bottom-14 left-4 right-4 mx-auto z-50 p-4 rounded-2xl bg-slate-950/95 dark:bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-slate-800 flex items-center gap-2.5 max-w-sm backdrop-blur-md"
        >
          <div className="p-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shrink-0">
            <Check size={14} />
          </div>
          <span className="flex-1 leading-snug">{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
}

/* ==========================================
   4. RD (RECURRING DEPOSIT) CALCULATOR
   ========================================== */
export interface RDCalculatorProps {
  isDarkMode: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onBack?: () => void;
  language?: 'en' | 'hi';
}

export function RDCalculator({ 
  isDarkMode, 
  isFavorited = false, 
  onToggleFavorite, 
  onBack,
  language = 'en'
}: RDCalculatorProps) {
  const [monthly, setMonthly] = useState(1000);
  const [interest, setInterest] = useState(6.8);
  const [tenure, setTenure] = useState(5); // Years
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Translation Dictionary
  const dict = {
    en: {
      paramsTitle: "RD CALCULATOR PARAMETERS",
      monthlyLabel: "Monthly Deposit Amount",
      interestLabel: "Expected Rate of Interest (p.a.)",
      tenureLabel: "Tenure (Investment Period)",
      years: "Years",
      minWarning: "Min monthly deposit is $10",
      maxWarning: "Max monthly deposit is $1,000,000",
      rateMinWarning: "Min interest rate is 0.1%",
      rateMaxWarning: "Max interest rate is 30%",
      tenureMinWarning: "Min tenure is 1 Year",
      tenureMaxWarning: "Max tenure is 30 Years",
      estimatedMaturity: "ESTIMATED RD MATURITY BREAKDOWN",
      futureValue: "TOTAL MATURITY VALUE",
      totalInvested: "Invested Principal",
      interestEarned: "Interest Earned",
      invested: "Principal",
      interestGain: "Interest",
      growthChart: "RECURRING SAVINGS TIMELINE",
      chartSubtitle: "Hover/tap columns to see how monthly deposits and interest accumulate over time",
      year: "Year",
      backBtn: "Back to Finance Page",
      savedToFav: "Saved in Favorites",
      saveToFav: "Save to Favorites",
      copySuccess: "Copied!",
      shareSuccess: "Shared!",
      copiedToast: "RD results successfully copied to clipboard!",
      sharedToast: "RD results shared successfully!"
    },
    hi: {
      paramsTitle: "आरडी कैलकुलेटर पैरामीटर",
      monthlyLabel: "मासिक जमा राशि",
      interestLabel: "ब्याज दर (वार्षिक %)",
      tenureLabel: "जमा अवधि",
      years: "वर्ष",
      minWarning: "न्यूनतम मासिक जमा ₹10 है",
      maxWarning: "अधिकतम मासिक जमा ₹1,000,000 है",
      rateMinWarning: "न्यूनतम ब्याज दर 0.1% है",
      rateMaxWarning: "अधिकतम ब्याज दर 30% है",
      tenureMinWarning: "न्यूनतम अवधि 1 वर्ष है",
      tenureMaxWarning: "अधिकतम अवधि 30 वर्ष है",
      estimatedMaturity: "अनुमानित आरडी परिपक्वता विवरण",
      futureValue: "कुल परिपक्वता मूल्य",
      totalInvested: "कुल निवेशित मूलधन",
      interestEarned: "अर्जित कुल ब्याज",
      invested: "मूलधन",
      interestGain: "अर्जित ब्याज",
      growthChart: "मासिक बचत संचय समयरेखा",
      chartSubtitle: "समय के साथ मासिक जमा और ब्याज वृद्धि देखने के लिए होवर/टैप करें",
      year: "वर्ष",
      backBtn: "फाइनेंस पेज पर वापस जाएं",
      savedToFav: "पसंदीदा में सुरक्षित",
      saveToFav: "पसंदीदा में सहेजें",
      copySuccess: "कॉपी किया गया!",
      shareSuccess: "साझा किया गया!",
      copiedToast: "आरडी परिणाम क्लिपबोर्ड पर सफलतापूर्वक कॉपी हो गए!",
      sharedToast: "आरडी परिणाम सफलतापूर्वक साझा किए गए!"
    }
  };

  const t = dict[language] || dict.en;
  const sym = language === 'hi' ? '₹' : '$';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Validations
  const monthlyWarning = monthly < 10 ? t.minWarning : monthly > 1000000 ? t.maxWarning : null;
  const interestWarning = interest < 0.1 ? t.rateMinWarning : interest > 30 ? t.rateMaxWarning : null;
  const tenureWarning = tenure < 1 ? t.tenureMinWarning : tenure > 30 ? t.tenureMaxWarning : null;

  // Clean values for calculation
  const validMonthly = Math.max(0, monthly);
  const validInterest = Math.max(0, interest);
  const validTenure = Math.max(1, tenure);

  // Standard Indian Banking Compounding for RD: Compounds Quarterly on Monthly Deposits
  // Formula: M = P * sum( (1 + r/4) ^ (4 * (n - k + 1) / 12) )
  const r = validInterest / 100;
  const n = validTenure * 12; // Total months
  const invested = validMonthly * n;

  let totalValue = 0;
  for (let k = 1; k <= n; k++) {
    const monthsCompounded = n - k + 1;
    totalValue += validMonthly * Math.pow(1 + r / 4, monthsCompounded / 3);
  }

  const interestEarned = Math.max(0, totalValue - invested);

  const investRatio = totalValue > 0 ? (invested / totalValue) * 100 : 100;
  const interestRatio = totalValue > 0 ? (interestEarned / totalValue) * 100 : 0;

  // Build Year-by-Year compounding data for RD
  const chartData: Array<{ year: number; invested: number; interest: number; total: number }> = [];
  for (let y = 1; y <= validTenure; y++) {
    const monthsCount = y * 12;
    const investedAtYear = validMonthly * monthsCount;
    let totalAtYear = 0;
    for (let k = 1; k <= monthsCount; k++) {
      const monthsCompounded = monthsCount - k + 1;
      totalAtYear += validMonthly * Math.pow(1 + r / 4, monthsCompounded / 3);
    }
    chartData.push({
      year: y,
      invested: Math.round(investedAtYear),
      interest: Math.round(Math.max(0, totalAtYear - investedAtYear)),
      total: Math.round(totalAtYear)
    });
  }

  // Active hover data breakdown
  const activeYearData = hoveredIdx !== null ? chartData[hoveredIdx] : chartData[chartData.length - 1];

  const formatCompact = (num: number) => {
    if (num >= 10000000) {
      return sym + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000000) {
      return sym + (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    }
    if (num >= 1000) {
      return sym + (num / 1000).toFixed(0) + 'K';
    }
    return sym + num;
  };

  const copyResults = () => {
    const text = `Recurring Deposit Calculator Results (${language === 'hi' ? 'Hindi' : 'English'}):
- ${t.monthlyLabel}: ${sym}${validMonthly.toLocaleString()}
- ${t.interestLabel}: ${validInterest}%
- ${t.tenureLabel}: ${validTenure} ${t.years}

- ${t.totalInvested}: ${sym}${invested.toLocaleString()}
- ${t.interestEarned}: ${sym}${Math.round(interestEarned).toLocaleString()}
- ${t.futureValue}: ${sym}${Math.round(totalValue).toLocaleString()}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(t.copiedToast);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Recurring Deposit Calculation:
- ${t.monthlyLabel}: ${sym}${validMonthly.toLocaleString()}
- ${t.interestLabel}: ${validInterest}%
- ${t.tenureLabel}: ${validTenure} ${t.years}

- ${t.totalInvested}: ${sym}${invested.toLocaleString()}
- ${t.interestEarned}: ${sym}${Math.round(interestEarned).toLocaleString()}
- ${t.futureValue}: ${sym}${Math.round(totalValue).toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Recurring Deposit calculation',
          text: text,
        });
        setShared(true);
        showToast(t.sharedToast);
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

  const shouldShowLabel = (yr: number) => {
    if (validTenure <= 10) return true;
    if (validTenure <= 20) return yr % 2 === 0 || yr === 1 || yr === validTenure;
    if (validTenure <= 35) return yr % 5 === 0 || yr === 1 || yr === validTenure;
    return yr % 10 === 0 || yr === 1 || yr === validTenure;
  };

  // SVG Chart Dimensions & Bounds
  const maxY = Math.max(100, totalValue * 1.05);
  const chartHeight = 160;
  const chartWidth = 430;
  const plotLeft = 60;
  const plotRight = 420;
  const plotWidth = plotRight - plotLeft;
  const plotBottom = 180;
  const plotTop = 20;
  const plotHeight = plotBottom - plotTop;

  const barStep = plotWidth / validTenure;
  const barWidth = Math.max(2, barStep * 0.65);

  return (
    <div className="space-y-5">
      {/* Parameters Input Card */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.paramsTitle}
        </h3>
        
        <div className="space-y-5">
          {/* Monthly Deposit Amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.monthlyLabel}</label>
              <span className="font-mono text-xs text-blue-500 font-bold">{sym}{monthly.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10"
              max="50000"
              step="50"
              value={monthly > 50000 ? 50000 : monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              value={monthly === 0 ? '' : monthly}
              placeholder="e.g. 5000"
              onChange={(e) => setMonthly(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                monthlyWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {monthlyWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {monthlyWarning}
              </p>
            )}
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.interestLabel}</label>
              <span className="font-mono text-xs text-blue-500 font-bold">{interest}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.05"
              value={interest > 15 ? 15 : interest}
              onChange={(e) => setInterest(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              step="0.01"
              value={interest === 0 ? '' : interest}
              placeholder="e.g. 6.8"
              onChange={(e) => setInterest(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                interestWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {interestWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {interestWarning}
              </p>
            )}
          </div>

          {/* Time Period / Tenure */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.tenureLabel} ({t.years})</label>
              <span className="font-mono text-xs text-blue-500 font-bold">{tenure} {t.years}</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={tenure > 15 ? 15 : tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              value={tenure === 0 ? '' : tenure}
              placeholder="e.g. 5"
              onChange={(e) => setTenure(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                tenureWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {tenureWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {tenureWarning}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Estimated Maturity Details */}
      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        {/* Quick action buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={copyResults}
            title={t.copySuccess}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-xs border border-slate-100'
            }`}
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={shareResults}
            title={t.shareSuccess}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-xs border border-slate-100'
            }`}
          >
            {shared ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          {t.estimatedMaturity}
        </h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
              {t.futureValue}
            </span>
            <span className="text-3xl font-black font-display tracking-tight text-blue-600 dark:text-blue-400">
              {sym}{Math.round(totalValue).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed border-blue-200 dark:border-blue-900/40">
            <div>
              <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                {t.totalInvested}
              </span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>
                {sym}{invested.toLocaleString()}
              </span>
            </div>
            <div>
              <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                {t.interestEarned}
              </span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>
                {sym}{Math.round(interestEarned).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Interactive Stacked Ratio Bar */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {t.invested} ({investRatio.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {t.interestGain} ({interestRatio.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 shadow-inner">
              <div style={{ width: `${investRatio}%` }} className="bg-blue-500 h-full transition-all duration-500"></div>
              <div style={{ width: `${interestRatio}%` }} className="bg-emerald-500 h-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Save to Favorites toggle button */}
          {onToggleFavorite && (
            <div className="pt-3 border-t border-slate-200/50 dark:border-slate-850/50 flex justify-center">
              <button
                onClick={onToggleFavorite}
                className={`w-full py-3 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase ${
                  isFavorited
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    : isDarkMode
                      ? 'bg-slate-800/60 border-slate-750 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <Star size={14} fill={isFavorited ? 'currentColor' : 'none'} className="text-amber-500" />
                <span>{isFavorited ? t.savedToFav : t.saveToFav}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Growth Projection Chart Card */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <div className="mb-4">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.growthChart}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">
            {t.chartSubtitle}
          </p>
        </div>

        {/* SVG Column Chart */}
        <div className="relative w-full overflow-x-auto no-scrollbar">
          <div className="min-w-[320px] w-full">
            <svg 
              viewBox="0 0 500 240" 
              className="w-full h-auto"
              style={{ overflow: 'visible' }}
            >
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, gridIdx) => {
                const gridVal = p * maxY;
                const gridY = plotBottom - p * plotHeight;
                return (
                  <g key={gridIdx}>
                    <line 
                      x1={plotLeft} 
                      y1={gridY} 
                      x2={plotRight} 
                      y2={gridY} 
                      stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} 
                      strokeWidth={1}
                      strokeDasharray={gridIdx === 0 ? "none" : "3,3"} 
                    />
                    <text 
                      x={plotLeft - 8} 
                      y={gridY + 3.5} 
                      textAnchor="end" 
                      className={`text-[9px] font-mono font-semibold ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
                    >
                      {formatCompact(gridVal)}
                    </text>
                  </g>
                );
              })}

              {/* Chart columns (Bars) */}
              {chartData.map((item, idx) => {
                const xCenter = plotLeft + idx * barStep + barStep / 2;
                const xPos = xCenter - barWidth / 2;
                const investedHeight = (item.invested / maxY) * plotHeight;
                const interestHeight = (item.interest / maxY) * plotHeight;
                const isHovered = hoveredIdx === idx;

                return (
                  <g key={idx}>
                    {/* Hover Column highlight backing */}
                    {isHovered && (
                      <rect 
                        x={xCenter - barStep / 2} 
                        y={plotTop} 
                        width={barStep} 
                        height={plotHeight} 
                        fill={isDarkMode ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.04)"} 
                        rx={6} 
                      />
                    )}

                    {/* Principal portion (Blue) */}
                    <rect 
                      x={xPos} 
                      y={plotBottom - investedHeight} 
                      width={barWidth} 
                      height={investedHeight} 
                      fill={isHovered ? "#2563eb" : "#3b82f6"} 
                      rx={1.5} 
                      className="transition-all duration-200"
                    />

                    {/* Compounded Interest portion (Emerald) */}
                    <rect 
                      x={xPos} 
                      y={plotBottom - investedHeight - interestHeight} 
                      width={barWidth} 
                      height={interestHeight} 
                      fill={isHovered ? "#059669" : "#10b981"} 
                      rx={1.5} 
                      className="transition-all duration-200"
                    />

                    {/* X-axis year labels */}
                    {shouldShowLabel(item.year) && (
                      <g>
                        <line 
                          x1={xCenter} 
                          y1={plotBottom} 
                          x2={xCenter} 
                          y2={plotBottom + 4} 
                          stroke={isDarkMode ? "#334155" : "#cbd5e1"} 
                        />
                        <text 
                          x={xCenter} 
                          y={plotBottom + 16} 
                          textAnchor="middle" 
                          className={`text-[9px] font-mono font-bold ${
                            isHovered 
                              ? isDarkMode ? 'fill-blue-400' : 'fill-blue-600'
                              : isDarkMode ? 'fill-slate-500' : 'fill-slate-400'
                          }`}
                        >
                          {item.year}
                        </text>
                      </g>
                    )}

                    {/* Touch / mouse sensory hotspot */}
                    <rect 
                      x={xCenter - barStep / 2} 
                      y={plotTop} 
                      width={barStep} 
                      height={plotHeight} 
                      fill="transparent" 
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onTouchStart={() => setHoveredIdx(idx)}
                    />
                  </g>
                );
              })}

              {/* Grid axes */}
              <line 
                x1={plotLeft} 
                y1={plotBottom} 
                x2={plotRight} 
                y2={plotBottom} 
                stroke={isDarkMode ? "#334155" : "#cbd5e1"} 
                strokeWidth={1.5} 
              />
              <line 
                x1={plotLeft} 
                y1={plotTop} 
                x2={plotLeft} 
                y2={plotBottom} 
                stroke={isDarkMode ? "#334155" : "#cbd5e1"} 
                strokeWidth={1.5} 
              />

              {/* X Axis Title */}
              <text 
                x={(plotLeft + plotRight) / 2} 
                y={plotBottom + 34} 
                textAnchor="middle" 
                className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`}
              >
                {t.tenureLabel} ({t.years})
              </text>
            </svg>
          </div>
        </div>

        {/* Compound Year Tooltip breakdown */}
        <div className="mt-4">
          {activeYearData && (
            <motion.div 
              key={activeYearData.year}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800' 
                  : 'bg-slate-50 border-slate-150'
              }`}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                  {t.year} {activeYearData.year} {language === 'hi' ? 'पर संचित मूल्य' : 'Accumulated Value'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {activeYearData.year} {t.years.toLowerCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className={`text-[9px] block font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.invested}</span>
                  <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {sym}{activeYearData.invested.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className={`text-[9px] block font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.interestGain}</span>
                  <span className="text-xs font-bold font-mono text-emerald-500">
                    {sym}{activeYearData.interest.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className={`text-[9px] block font-bold uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Value</span>
                  <span className="text-xs font-bold font-mono text-blue-500">
                    {sym}{activeYearData.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Back to Finance page Button */}
      {onBack && (
        <div className="pt-2">
          <button
            onClick={onBack}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700 hover:text-white text-slate-300' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs'
            }`}
          >
            <ChevronLeft size={16} />
            {t.backBtn}
          </button>
        </div>
      )}

      {/* Toast snackbar element */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed bottom-14 left-4 right-4 mx-auto z-50 p-4 rounded-2xl bg-slate-950/95 dark:bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-slate-800 flex items-center gap-2.5 max-w-sm backdrop-blur-md"
        >
          <div className="p-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shrink-0">
            <Check size={14} />
          </div>
          <span className="flex-1 leading-snug">{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
}

/* ==========================================
   5. GST (GOODS & SERVICES TAX) CALCULATOR
   ========================================== */
export interface GSTCalculatorProps {
  isDarkMode: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  onBack?: () => void;
  language?: 'en' | 'hi';
}

export function GSTCalculator({ 
  isDarkMode, 
  isFavorited = false, 
  onToggleFavorite, 
  onBack,
  language = 'en'
}: GSTCalculatorProps) {
  const [amount, setAmount] = useState<number>(5000);
  const [rate, setRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'add' | 'remove'>('add');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Translation Dictionary
  const dict = {
    en: {
      title: "GST CALCULATOR PARAMETERS",
      gstTypeLabel: "GST Calculation Type",
      addGst: "Add GST (Tax Exclusive)",
      removeGst: "Remove GST (Tax Inclusive)",
      amountLabel: "Amount",
      amountPlaceholder: "Enter amount",
      rateLabel: "GST Rate Percentage",
      minWarning: "Min amount is $1",
      maxWarning: "Max amount is $100,000,000",
      rateMinWarning: "Min rate is 0.1%",
      rateMaxWarning: "Max rate is 100%",
      gstBreakdown: "TAX INVOICE SUMMARY",
      netPrice: "Net Amount (Tax-Free Base)",
      cgstLabel: "CGST (Central Tax)",
      sgstLabel: "SGST (State Tax)",
      totalGst: "Total GST Tax Amount",
      finalPrice: "TOTAL TRANSACTION AMOUNT",
      invoiceReceipt: "ITEMIZED TRANSACTION RECEIPT",
      taxProportion: "TAX VS BASE PRICE SPLIT",
      copiedToast: "GST details successfully copied to clipboard!",
      sharedToast: "GST details shared successfully!",
      backBtn: "Back to Finance Page",
      savedToFav: "Saved in Favorites",
      saveToFav: "Save to Favorites",
      copySuccess: "Copied!",
      shareSuccess: "Shared!",
      baseAmount: "Base Amount",
      taxRate: "Tax Rate",
      type: "Type",
      addLabel: "ADD EXTRA GST",
      removeLabel: "EXTRACT INCLUDED GST",
      invoiceId: "Invoice Reference",
      timestamp: "Issued Timestamp",
      paymentTerms: "Payment Terms: Cash/Online",
      receiptFooter: "THANK YOU FOR YOUR TRANSACTION",
    },
    hi: {
      title: "जीएसटी कैलकुलेटर पैरामीटर",
      gstTypeLabel: "जीएसटी गणना का प्रकार",
      addGst: "जीएसटी जोड़ें (कर रहित)",
      removeGst: "जीएसटी घटाएं (कर सहित)",
      amountLabel: "राशि",
      amountPlaceholder: "राशि दर्ज करें",
      rateLabel: "जीएसटी दर प्रतिशत",
      minWarning: "न्यूनतम राशि ₹1 है",
      maxWarning: "अधिकतम राशि ₹100,000,000 है",
      rateMinWarning: "न्यूनतम दर 0.1% है",
      rateMaxWarning: "अधिकतम दर 100% है",
      gstBreakdown: "कर चालान बिल विवरण",
      netPrice: "शुद्ध मूल्य (कर रहित मूलधन)",
      cgstLabel: "सीजीएसटी (केंद्रीय कर)",
      sgstLabel: "एसजीएसटी (राज्य कर)",
      totalGst: "कुल जीएसटी कर राशि",
      finalPrice: "कुल देय राशि",
      invoiceReceipt: "मदवार कर रसीद",
      taxProportion: "कर बनाम शुद्ध मूल्य अनुपात",
      copiedToast: "जीएसटी विवरण क्लिपबोर्ड पर सफलतापूर्वक कॉपी हो गया!",
      sharedToast: "जीएसटी विवरण सफलतापूर्वक साझा किया गया!",
      backBtn: "फाइनेंस पेज पर वापस जाएं",
      savedToFav: "पसंदीदा में सुरक्षित",
      saveToFav: "पसंदीदा में सहेजें",
      copySuccess: "कॉपी किया गया!",
      shareSuccess: "साझा किया गया!",
      baseAmount: "मूल राशि",
      taxRate: "कर की दर",
      type: "प्रकार",
      addLabel: "जीएसटी अतिरिक्त जोड़ें",
      removeLabel: "शामिल जीएसटी निकालें",
      invoiceId: "चालान संदर्भ आईडी",
      timestamp: "जारी करने का समय",
      paymentTerms: "भुगतान शर्तें: नकद/ऑनलाइन",
      receiptFooter: "लेनदेन के लिए धन्यवाद",
    }
  };

  const t = dict[language] || dict.en;
  const sym = language === 'hi' ? '₹' : '$';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Validations
  const amountWarning = amount < 1 ? t.minWarning : amount > 100000000 ? t.maxWarning : null;
  const rateWarning = rate < 0.1 ? t.rateMinWarning : rate > 100 ? t.rateMaxWarning : null;

  // Clean values for calculation
  const validAmount = Math.max(0, amount);
  const validRate = Math.max(0, rate);

  let gstAmount = 0;
  let netAmount = 0;
  let totalAmount = 0;

  if (gstType === 'add') {
    netAmount = validAmount;
    gstAmount = validAmount * (validRate / 100);
    totalAmount = validAmount + gstAmount;
  } else {
    totalAmount = validAmount;
    netAmount = validAmount / (1 + validRate / 100);
    gstAmount = validAmount - netAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  const baseRatio = totalAmount > 0 ? (netAmount / totalAmount) * 100 : 100;
  const taxRatio = totalAmount > 0 ? (gstAmount / totalAmount) * 100 : 0;

  // Stable invoice mock reference info
  const invoiceNum = "TXN-" + Math.floor(validAmount * 1.5 + 4820).toString().padStart(6, '0');
  const nowStr = new Date().toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const copyResults = () => {
    const text = `GST Tax Split Details (${language === 'hi' ? 'Hindi' : 'English'}):
- ${t.type}: ${gstType === 'add' ? t.addGst : t.removeGst}
- ${t.amountLabel}: ${sym}${validAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- ${t.taxRate}: ${validRate}%

- ${t.netPrice}: ${sym}${netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- ${t.cgstLabel} (Half): ${sym}${cgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- ${t.sgstLabel} (Half): ${sym}${sgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- ${t.totalGst}: ${sym}${gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- ${t.finalPrice}: ${sym}${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(t.copiedToast);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `GST Tax Split:
- ${t.type}: ${gstType === 'add' ? t.addGst : t.removeGst}
- ${t.amountLabel}: ${sym}${validAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- ${t.taxRate}: ${validRate}%
- ${t.totalGst}: ${sym}${gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
- ${t.finalPrice}: ${sym}${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GST Tax Calculation',
          text: text,
        });
        setShared(true);
        showToast(t.sharedToast);
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
      {/* Parameters Input Card */}
      <div className={`p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {t.title}
        </h3>
        
        <div className="space-y-5">
          {/* Operation Toggle (Add/Remove) */}
          <div>
            <label className={`text-sm font-semibold block mb-2.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-750'}`}>
              {t.gstTypeLabel}
            </label>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/40 dark:border-slate-700/50">
              <button
                onClick={() => setGstType('add')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer ${
                  gstType === 'add' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {gstType === 'add' ? '✓ ' : ''}{t.addGst}
              </button>
              <button
                onClick={() => setGstType('remove')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all cursor-pointer ${
                  gstType === 'remove' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {gstType === 'remove' ? '✓ ' : ''}{t.removeGst}
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.amountLabel} ({gstType === 'add' ? t.baseAmount : 'Total Price'})
              </label>
              <span className="font-mono text-xs text-blue-500 font-bold">{sym}{amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10"
              max="100000"
              step="50"
              value={amount > 100000 ? 100000 : amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer mb-2"
            />
            <input
              type="number"
              value={amount === 0 ? '' : amount}
              placeholder={t.amountPlaceholder}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                amountWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800/50 text-white border-slate-750' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {amountWarning && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} />
                {amountWarning}
              </p>
            )}
          </div>

          {/* GST Slabs or Percentage Rate */}
          <div>
            <label className={`text-sm font-semibold block mb-2.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.rateLabel}
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-xs font-bold mb-3">
              {[5, 12, 18, 28].map((item) => (
                <button
                  key={item}
                  onClick={() => setRate(item)}
                  className={`py-2.5 rounded-xl transition-all border cursor-pointer ${
                    rate === item
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : isDarkMode
                        ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-750'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item}%
                </button>
              ))}
              <input
                type="number"
                placeholder="Custom"
                value={rate === 5 || rate === 12 || rate === 18 || rate === 28 ? '' : rate}
                onChange={(e) => setRate(Math.min(100, Math.max(0, Number(e.target.value))))}
                className={`w-full px-1 text-center py-2 text-xs font-bold rounded-xl font-mono border focus:outline-hidden transition-all ${
                  rateWarning ? 'border-rose-500 focus:border-rose-500' : 'focus:border-blue-500'
                } ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-750 text-white' : 'bg-slate-50 border-slate-200 text-slate-750'
                }`}
              />
            </div>
            {rateWarning && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertTriangle size={12} />
                {rateWarning}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Billing Split Outcomes */}
      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
        isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
      }`}>
        {/* Quick action buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={copyResults}
            title={t.copySuccess}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-xs border border-slate-100'
            }`}
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={shareResults}
            title={t.shareSuccess}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-600 shadow-xs border border-slate-100'
            }`}
          >
            {shared ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          {t.gstBreakdown}
        </h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
              {t.finalPrice}
            </span>
            <span className="text-3xl font-black font-display tracking-tight text-blue-600 dark:text-blue-400">
              {sym}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed border-blue-200 dark:border-blue-900/40">
            <div>
              <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                {t.netPrice}
              </span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>
                {sym}{netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className={`text-[10px] block font-bold tracking-widest uppercase mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-550'}`}>
                {t.totalGst}
              </span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-100' : 'text-slate-850'}`}>
                {sym}{gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/55 dark:border-slate-800/60 text-xs">
            <div>
              <span className={`block font-semibold text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.cgstLabel} ({validRate / 2}%)
              </span>
              <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {sym}{cgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className={`block font-semibold text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.sgstLabel} ({validRate / 2}%)
              </span>
              <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                {sym}{sgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Interactive Stacked Ratio Bar of Base vs Tax */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  {t.baseAmount} ({baseRatio.toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                  GST Tax ({taxRatio.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 shadow-inner">
              <div style={{ width: `${baseRatio}%` }} className="bg-blue-500 h-full transition-all duration-500"></div>
              <div style={{ width: `${taxRatio}%` }} className="bg-emerald-500 h-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Save to Favorites toggle button */}
          {onToggleFavorite && (
            <div className="pt-3 border-t border-slate-200/50 dark:border-slate-850/50 flex justify-center">
              <button
                onClick={onToggleFavorite}
                className={`w-full py-3 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase ${
                  isFavorited
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    : isDarkMode
                      ? 'bg-slate-800/60 border-slate-750 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <Star size={14} fill={isFavorited ? 'currentColor' : 'none'} className="text-amber-500" />
                <span>{isFavorited ? t.savedToFav : t.saveToFav}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Itemized Transaction Receipt Display */}
      <div className={`p-6 rounded-3xl m3-card-shadow relative ${
        isDarkMode 
          ? 'bg-slate-900 border border-slate-800 text-slate-300' 
          : 'bg-stone-50 border border-stone-200 text-stone-850 shadow-xs'
      }`}>
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 border-b border-dashed border-slate-300 dark:border-slate-800 pb-2">
          <span>{t.invoiceReceipt}</span>
          <span>ONLINE</span>
        </div>

        <div className="pt-6 space-y-4">
          <div className="flex justify-between text-[11px] font-mono leading-none">
            <span className="text-slate-400 dark:text-slate-500">{t.invoiceId}:</span>
            <span className="font-bold">{invoiceNum}</span>
          </div>
          <div className="flex justify-between text-[11px] font-mono leading-none">
            <span className="text-slate-400 dark:text-slate-500">{t.timestamp}:</span>
            <span className="font-semibold">{nowStr}</span>
          </div>

          {/* Decorative Divider */}
          <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-800 my-4"></div>

          {/* Table headers */}
          <div className="grid grid-cols-12 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            <span className="col-span-6">Description</span>
            <span className="col-span-2 text-center">Rate</span>
            <span className="col-span-4 text-right">Amount</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="grid grid-cols-12 leading-tight">
              <span className="col-span-6 font-semibold">Net Base Price</span>
              <span className="col-span-2 text-center">-</span>
              <span className="col-span-4 text-right font-semibold">
                {sym}{netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="grid grid-cols-12 leading-tight text-slate-600 dark:text-slate-400">
              <span className="col-span-6">Central Tax (CGST)</span>
              <span className="col-span-2 text-center">{(validRate / 2).toFixed(1)}%</span>
              <span className="col-span-4 text-right">
                {sym}{cgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="grid grid-cols-12 leading-tight text-slate-600 dark:text-slate-400">
              <span className="col-span-6">State Tax (SGST)</span>
              <span className="col-span-2 text-center">{(validRate / 2).toFixed(1)}%</span>
              <span className="col-span-4 text-right">
                {sym}{sgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="grid grid-cols-12 leading-tight text-slate-500 dark:text-slate-400">
              <span className="col-span-6 font-semibold">Total Tax Combined</span>
              <span className="col-span-2 text-center">{validRate}%</span>
              <span className="col-span-4 text-right font-semibold">
                {sym}{gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-800 my-4"></div>

          <div className="flex items-center justify-between font-black font-mono">
            <span className="text-sm">TOTAL AMOUNT</span>
            <span className="text-base text-blue-600 dark:text-blue-400">
              {sym}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Barcode representation */}
          <div className="flex flex-col items-center justify-center pt-4 pb-2">
            <div className="flex h-10 gap-[2px] opacity-70">
              {[1,3,1,4,2,1,5,1,2,3,1,2,4,1,3,1,1,2,4,1,2,3,1,4,1,2].map((w, index) => (
                <div 
                  key={index} 
                  style={{ width: `${w}px` }} 
                  className={`h-full ${isDarkMode ? 'bg-slate-400' : 'bg-slate-850'}`}
                ></div>
              ))}
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-1.5 tracking-widest">{invoiceNum}</span>
          </div>

          <div className="text-center">
            <span className="text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 block">
              *** {t.receiptFooter} ***
            </span>
          </div>
        </div>
      </div>

      {/* Back to Finance page Button */}
      {onBack && (
        <div className="pt-2">
          <button
            onClick={onBack}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold tracking-wide transition-all border cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs uppercase ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700 hover:text-white text-slate-300' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs'
            }`}
          >
            <ChevronLeft size={16} />
            {t.backBtn}
          </button>
        </div>
      )}

      {/* Toast snackbar element */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed bottom-14 left-4 right-4 mx-auto z-50 p-4 rounded-2xl bg-slate-950/95 dark:bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-slate-800 flex items-center gap-2.5 max-w-sm backdrop-blur-md"
        >
          <div className="p-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shrink-0">
            <Check size={14} />
          </div>
          <span className="flex-1 leading-snug">{toastMessage}</span>
        </motion.div>
      )}
    </div>
  );
}

/* ==========================================
   6. LOAN ELIGIBILITY & AFFORDABILITY
   ========================================== */
export function LoanEligibility({ isDarkMode }: { isDarkMode: boolean }) {
  const [income, setIncome] = useState(5000);
  const [existingEMI, setExistingEMI] = useState(300);
  const [interest, setInterest] = useState(8.5);
  const [tenure, setTenure] = useState(20); // Years
  const [copied, setCopied] = useState(false);

  // Maximum monthly EMI bank allows is usually 50% of net monthly income (FOIR ratio)
  const maxEMIAllowed = income * 0.5;
  const netEMIEligible = Math.max(0, maxEMIAllowed - existingEMI);

  // From EMI formula, calculate Maximum Eligible Loan Principal:
  // P = EMI / [ r * (1+r)^n / ((1+r)^n - 1) ]
  const r = interest / (12 * 100);
  const n = tenure * 12;
  
  let eligibleLoan = 0;
  if (r > 0 && netEMIEligible > 0) {
    eligibleLoan = netEMIEligible / ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }

  const copyResults = () => {
    const text = `Loan Eligibility Results:\nNet Monthly Income: $${income.toLocaleString()}\nExisting EMIs: $${existingEMI.toLocaleString()}\nRate: ${interest}%\nTenure: ${tenure} Years\n\nMax Monthly EMI Allowed: $${maxEMIAllowed.toFixed(2)}\nAffordable Addt. EMI: $${netEMIEligible.toFixed(2)}\nMaximum Eligible Loan Principal: $${eligibleLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AFFORDABILITY INPUTS</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Net Monthly Income</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">${income.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Existing EMIs / Obligations</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">${existingEMI.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="15000"
              step="100"
              value={existingEMI}
              onChange={(e) => setExistingEMI(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-semibold mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rate of Interest (%)</label>
              <input
                type="number"
                value={interest}
                step="0.1"
                onChange={(e) => setInterest(Number(e.target.value))}
                className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                }`}
              />
            </div>
            <div>
              <label className={`text-xs font-semibold mb-1 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Tenure (Years)</label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                }`}
              />
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>MAX ELIGIBILITY ESTIMATE</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>MAX ELIGIBLE LOAN PRINCIPAL</span>
            <span className={`text-3xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
              ${eligibleLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Max Bank EMI Capacity</span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                ${maxEMIAllowed.toLocaleString()}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Affordable Surplus EMI</span>
              <span className={`text-sm font-bold font-mono text-emerald-500`}>
                ${netEMIEligible.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   7. SIMPLE INTEREST CALCULATOR
   ========================================== */
export function SimpleInterestCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(6.5);
  const [time, setTime] = useState(5);
  const [timeType, setTimeType] = useState<'years' | 'months'>('years');
  const [copied, setCopied] = useState(false);

  const validPrincipal = Math.max(0, principal);
  const validRate = Math.max(0, rate);
  const validTime = Math.max(0, time);

  const t = timeType === 'years' ? validTime : validTime / 12;
  const interestEarned = (validPrincipal * validRate * t) / 100;
  const totalValue = validPrincipal + interestEarned;

  const principalRatio = totalValue > 0 ? (validPrincipal / totalValue) * 100 : 100;
  const interestRatio = totalValue > 0 ? (interestEarned / totalValue) * 100 : 0;

  const copyResults = () => {
    const text = `Simple Interest Results:\nPrincipal: $${validPrincipal.toLocaleString()}\nRate: ${validRate}%\nTime: ${validTime} ${timeType}\n\nInterest Earned: $${interestEarned.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nTotal Amount: $${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>SIMPLE INTEREST PARAMETERS</h3>
        
        <div className="space-y-4">
          {/* Principal */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Principal Amount</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">${principal.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="1000000"
              step="500"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
          </div>

          {/* Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Interest Rate (% p.a.)</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">{rate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="30"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={rate}
              step="0.1"
              onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
          </div>

          {/* Time */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Time Period</label>
              <div className="flex border rounded-lg overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setTimeType('years')}
                  className={`px-3 py-1 font-semibold cursor-pointer ${timeType === 'years' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-750' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Years
                </button>
                <button
                  type="button"
                  onClick={() => setTimeType('months')}
                  className={`px-3 py-1 font-semibold cursor-pointer ${timeType === 'months' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-750' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Months
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max={timeType === 'years' ? '30' : '360'}
                step="1"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="flex-1 accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className={`text-sm font-bold font-mono px-2 py-1 rounded-md ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                {time} {timeType === 'years' ? 'Yrs' : 'Mos'}
              </span>
            </div>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Math.max(0, Number(e.target.value)))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Results */}
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>SIMPLE INTEREST BREAKDOWN</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL AMOUNT</span>
            <span className={`text-3xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Principal Amount</span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                ${validPrincipal.toLocaleString()}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Interest Earned</span>
              <span className={`text-sm font-bold font-mono text-emerald-500`}>
                ${interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Graph bar */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Principal ({principalRatio.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Interest ({interestRatio.toFixed(1)}%)</span>
              </div>
            </div>

            <div className="w-24 h-4 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
              <div style={{ width: `${principalRatio}%` }} className="bg-blue-600 h-full"></div>
              <div style={{ width: `${interestRatio}%` }} className="bg-amber-500 h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   8. COMPOUND INTEREST CALCULATOR
   ========================================== */
export function CompoundInterestCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(6.5);
  const [time, setTime] = useState(5);
  const [compounding, setCompounding] = useState<number>(4); // Quarterly default
  const [copied, setCopied] = useState(false);

  const validPrincipal = Math.max(0, principal);
  const validRate = Math.max(0, rate);
  const validTime = Math.max(0, time);

  // Formula: A = P * (1 + r/n)^(n*t)
  const r = validRate / 100;
  const n = compounding;
  const t = validTime;
  
  const totalValue = validPrincipal * Math.pow(1 + r/n, n*t);
  const interestEarned = Math.max(0, totalValue - validPrincipal);

  const principalRatio = totalValue > 0 ? (validPrincipal / totalValue) * 100 : 100;
  const interestRatio = totalValue > 0 ? (interestEarned / totalValue) * 100 : 0;

  const copyResults = () => {
    const text = `Compound Interest Results:\nPrincipal: $${validPrincipal.toLocaleString()}\nRate: ${validRate}%\nTime: ${validTime} Years\nCompounding: ${compounding === 1 ? 'Yearly' : compounding === 2 ? 'Half-Yearly' : compounding === 4 ? 'Quarterly' : 'Monthly'}\n\nInterest Earned: $${interestEarned.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nTotal Amount: $${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>COMPOUND INTEREST PARAMETERS</h3>
        
        <div className="space-y-4">
          {/* Principal */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Principal Amount</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">${principal.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="1000000"
              step="500"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
          </div>

          {/* Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Interest Rate (% p.a.)</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">{rate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="30"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={rate}
              step="0.1"
              onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
          </div>

          {/* Time */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Time Period (Years)</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">{time} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Math.max(0, Number(e.target.value)))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
          </div>

          {/* Compounding Frequency */}
          <div>
            <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Compounding Frequency</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {[
                { label: 'Yearly', val: 1 },
                { label: 'Half-Yearly', val: 2 },
                { label: 'Quarterly', val: 4 },
                { label: 'Monthly', val: 12 }
              ].map((item) => (
                <button
                  type="button"
                  key={item.val}
                  onClick={() => setCompounding(item.val)}
                  className={`py-2 px-3 rounded-xl transition-all border cursor-pointer ${
                    compounding === item.val
                      ? 'bg-blue-600 text-white border-blue-600'
                      : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>COMPOUND INTEREST BREAKDOWN</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL AMOUNT</span>
            <span className={`text-3xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>Principal Amount</span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                ${validPrincipal.toLocaleString()}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>Interest Earned</span>
              <span className={`text-sm font-bold font-mono text-emerald-500`}>
                ${interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Graph bar */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Principal ({principalRatio.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Interest ({interestRatio.toFixed(1)}%)</span>
              </div>
            </div>

            <div className="w-24 h-4 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
              <div style={{ width: `${principalRatio}%` }} className="bg-blue-600 h-full"></div>
              <div style={{ width: `${interestRatio}%` }} className="bg-amber-500 h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   10. INCOME TAX CALCULATOR (INDIA)
   ========================================== */
export function IncomeTaxCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [income, setIncome] = useState<string>('800000');
  const [deductions, setDeductions] = useState<string>('150000'); // 80C deductions for Old regime
  const [otherDeductions, setOtherDeductions] = useState<string>('50000'); // 80D/HRA etc.

  const [oldTax, setOldTax] = useState<number>(0);
  const [newTax, setNewTax] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [betterRegime, setBetterRegime] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const calculateTax = () => {
    const incVal = Math.max(0, Number(income) || 0);
    const ded80C = Math.min(150000, Math.max(0, Number(deductions) || 0));
    const dedOther = Math.max(0, Number(otherDeductions) || 0);

    // 1. NEW REGIME CALCULATION (FY 2024-25 / AY 2025-26)
    // Standard deduction under New regime is ₹75,000
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, incVal - newStdDeduction);
    let tempNewTax = 0;

    if (newTaxableIncome > 700000) {
      // Slab-wise calculation
      // Slabs: Up to 3L: Nil; 3L-6L: 5%; 6L-9L: 10%; 9L-12L: 15%; 12L-15L: 20%; Above 15L: 30%
      let remaining = newTaxableIncome;
      if (remaining > 1500000) {
        tempNewTax += (remaining - 1500000) * 0.30;
        remaining = 1500000;
      }
      if (remaining > 1200000) {
        tempNewTax += (remaining - 1200000) * 0.20;
        remaining = 1200000;
      }
      if (remaining > 900000) {
        tempNewTax += (remaining - 900000) * 0.15;
        remaining = 900000;
      }
      if (remaining > 600000) {
        tempNewTax += (remaining - 600000) * 0.10;
        remaining = 600000;
      }
      if (remaining > 300000) {
        tempNewTax += (remaining - 300000) * 0.05;
      }
    } else {
      // Rebate u/s 87A makes tax zero up to ₹7,00,000 taxable income
      tempNewTax = 0;
    }
    // Add 4% Cess
    const finalNewTax = tempNewTax + (tempNewTax * 0.04);

    // 2. OLD REGIME CALCULATION
    // Standard deduction under Old regime is ₹50,000
    const oldStdDeduction = 50000;
    const totalOldDeductions = oldStdDeduction + ded80C + dedOther;
    const oldTaxableIncome = Math.max(0, incVal - totalOldDeductions);
    let tempOldTax = 0;

    if (oldTaxableIncome > 500000) {
      // Slab-wise calculation
      // Slabs: Up to 2.5L: Nil; 2.5L-5L: 5%; 5L-10L: 20%; Above 10L: 30%
      let remaining = oldTaxableIncome;
      if (remaining > 1000000) {
        tempOldTax += (remaining - 1000000) * 0.30;
        remaining = 1000000;
      }
      if (remaining > 500000) {
        tempOldTax += (remaining - 500000) * 0.20;
        remaining = 500000;
      }
      if (remaining > 250000) {
        tempOldTax += (remaining - 250000) * 0.05;
      }
    } else {
      // Rebate u/s 87A makes tax zero up to ₹5,00,000 taxable income
      tempOldTax = 0;
    }
    // Add 4% Cess
    const finalOldTax = tempOldTax + (tempOldTax * 0.04);

    setNewTax(finalNewTax);
    setOldTax(finalOldTax);

    const diff = Math.abs(finalOldTax - finalNewTax);
    setSavings(diff);
    if (finalNewTax < finalOldTax) {
      setBetterRegime('NEW REGIME (Saves ' + Math.round(diff).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) + ')');
    } else if (finalOldTax < finalNewTax) {
      setBetterRegime('OLD REGIME (Saves ' + Math.round(diff).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) + ')');
    } else {
      setBetterRegime('BOTH ARE IDENTICAL');
    }
  };

  useEffect(() => {
    calculateTax();
  }, [income, deductions, otherDeductions]);

  const copyResults = () => {
    const text = `Income Tax Estimator (India) Results:\n` +
      `Gross Annual Income: ₹${Number(income).toLocaleString('en-IN')}\n` +
      `Estimated New Regime Tax: ₹${newTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\n` +
      `Estimated Old Regime Tax: ₹${oldTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\n` +
      `Recommendation: ${betterRegime}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Income Tax Estimator (India) Results:\nGross Annual Income: ₹${Number(income).toLocaleString('en-IN')}\nEstimated New Regime Tax: ₹${newTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\nEstimated Old Regime Tax: ₹${oldTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\nRecommendation: ${betterRegime}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Income Tax Estimation', text });
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
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>INCOME & DEDUCTIONS</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Gross Annual Salary (₹)</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`}
            />
          </div>
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Section 80C Deductions (Max ₹1.5L - Old Regime only)</label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`}
            />
          </div>
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Other Deductions (80D, HRA Exemptions, etc. - Old Regime only)</label>
            <input
              type="number"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`}
            />
          </div>
          <div className="pt-2">
            <button
              onClick={() => { setIncome('800000'); setDeductions('150000'); setOtherDeductions('50000'); }}
              className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3 flex items-center gap-2">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
          <button onClick={shareResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {shared ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
          </button>
        </div>

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>TAX ESTIMATE ANALYSIS</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/10">
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">New Regime Tax</span>
              <span className="text-xl font-black font-mono text-blue-500">
                ₹{newTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[9px] block text-slate-500 mt-1">₹75,000 Std Deduction applied</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/10">
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Old Regime Tax</span>
              <span className="text-xl font-black font-mono text-indigo-500">
                ₹{oldTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[9px] block text-slate-500 mt-1">₹50,000 Std + 80C + 80D applied</span>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-dashed border-blue-200 dark:border-blue-900/40">
            <span className="text-[10px] block font-bold text-slate-400 tracking-widest uppercase mb-1">Recommended Option</span>
            <span className="text-sm font-extrabold text-emerald-500 bg-emerald-500/10 px-3.5 py-1 rounded-full uppercase tracking-wider font-display inline-block">
              {betterRegime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   11. PERSONAL LOAN CALCULATOR
   ========================================== */
export function PersonalLoanCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [amount, setAmount] = useState<string>('50000');
  const [rate, setRate] = useState<string>('11.5');
  const [tenure, setTenure] = useState<string>('3');
  const [fee, setFee] = useState<string>('1.5'); // Processing fee %

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [feeValue, setFeeValue] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const P = Math.max(0, Number(amount) || 0);
    const R = Math.max(0, Number(rate) || 0);
    const N = Math.max(1, Number(tenure) || 1) * 12;
    const F = Math.max(0, Number(fee) || 0);

    const r = R / (12 * 100);
    let emiVal = 0;
    if (r > 0) {
      emiVal = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    } else {
      emiVal = P / N;
    }

    const interest = emiVal * N - P;
    const feeAmt = P * (F / 100);
    const total = P + interest + feeAmt;

    setEmi(emiVal);
    setTotalInterest(interest);
    setFeeValue(feeAmt);
    setTotalCost(total);
  };

  useEffect(() => {
    calculate();
  }, [amount, rate, tenure, fee]);

  const copyResults = () => {
    const text = `Personal Loan Estimate:\nLoan Amount: $${Number(amount).toLocaleString()}\nEMI: $${emi.toFixed(2)}/mo\nTotal Interest: $${totalInterest.toFixed(2)}\nFee Value: $${feeValue.toFixed(2)}\nTotal Borrowing Cost: $${totalCost.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>LOAN DETAILS</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Personal Loan Amount ($)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Interest Rate (% p.a.)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tenure (Years)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Processing Fee (%)</label>
            <input type="number" step="0.1" value={fee} onChange={(e) => setFee(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
          </div>
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button onClick={() => { setAmount('50000'); setRate('11.5'); setTenure('3'); setFee('1.5'); }} className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
            <button onClick={calculate} className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">Calculate</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3 flex items-center gap-2">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>CALCULATION SUMMARY</h3>
        <div className="space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Monthly EMI</span>
            <span className="text-3xl font-extrabold text-blue-500 font-mono">
              ${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40">
            <div>
              <span className="text-[9px] block text-slate-500 font-bold uppercase">Total Interest</span>
              <span className="text-xs font-extrabold font-mono text-slate-700 dark:text-slate-200">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-[9px] block text-slate-500 font-bold uppercase">Proc. Fee</span>
              <span className="text-xs font-extrabold font-mono text-slate-700 dark:text-slate-200">${feeValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-[9px] block text-slate-500 font-bold uppercase">Total Cost</span>
              <span className="text-xs font-extrabold font-mono text-slate-700 dark:text-slate-200">${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   12. HOME LOAN CALCULATOR
   ========================================== */
export function HomeLoanCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [propertyVal, setPropertyVal] = useState<string>('300000');
  const [downpayment, setDownpayment] = useState<string>('20'); // Downpayment %
  const [rate, setRate] = useState<string>('7.5');
  const [tenure, setTenure] = useState<string>('20');

  const [loanAmt, setLoanAmt] = useState<number>(0);
  const [downpaymentAmt, setDownpaymentAmt] = useState<number>(0);
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayable, setTotalPayable] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const prop = Math.max(0, Number(propertyVal) || 0);
    const dpPct = Math.max(0, Number(downpayment) || 0);
    const R = Math.max(0, Number(rate) || 0);
    const N = Math.max(1, Number(tenure) || 1) * 12;

    const dpAmt = prop * (dpPct / 100);
    const loan = Math.max(0, prop - dpAmt);

    const r = R / (12 * 100);
    let emiVal = 0;
    if (r > 0) {
      emiVal = (loan * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    } else {
      emiVal = loan / N;
    }

    const interest = emiVal * N - loan;
    const total = emiVal * N;

    setLoanAmt(loan);
    setDownpaymentAmt(dpAmt);
    setEmi(emiVal);
    setTotalInterest(interest);
    setTotalPayable(total);
  };

  useEffect(() => {
    calculate();
  }, [propertyVal, downpayment, rate, tenure]);

  const copyResults = () => {
    const text = `Home Loan Estimate:\nProperty Value: $${Number(propertyVal).toLocaleString()}\nDown Payment: $${downpaymentAmt.toLocaleString()} (${downpayment}%)\nLoan Principal: $${loanAmt.toLocaleString()}\nEMI: $${emi.toFixed(2)}/mo\nTotal Interest: $${totalInterest.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>PROPERTY & FINANCING</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Property Value ($)</label>
            <input type="number" value={propertyVal} onChange={(e) => setPropertyVal(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Down Payment (%)</label>
              <input type="number" value={downpayment} onChange={(e) => setDownpayment(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tenure (Years)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Interest Rate (%)</label>
            <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
          </div>
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button onClick={() => { setPropertyVal('300000'); setDownpayment('20'); setRate('7.5'); setTenure('20'); }} className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
            <button onClick={calculate} className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">Calculate</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>LOAN CALCULATOR ESTIMATE</h3>
        <div className="space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Monthly Home EMI</span>
            <span className="text-3xl font-extrabold text-indigo-400 dark:text-indigo-400 font-mono">
              ${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Loan Principal</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${loanAmt.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Total Interest</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   13. CAR LOAN CALCULATOR
   ========================================== */
export function CarLoanCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [price, setPrice] = useState<string>('35000');
  const [downpayment, setDownpayment] = useState<string>('7000');
  const [rate, setRate] = useState<string>('6.5');
  const [tenure, setTenure] = useState<string>('5');

  const [loanAmt, setLoanAmt] = useState<number>(0);
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const prVal = Math.max(0, Number(price) || 0);
    const dpVal = Math.max(0, Number(downpayment) || 0);
    const R = Math.max(0, Number(rate) || 0);
    const N = Math.max(1, Number(tenure) || 1) * 12;

    const loan = Math.max(0, prVal - dpVal);
    const r = R / (12 * 100);
    let emiVal = 0;
    if (r > 0) {
      emiVal = (loan * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    } else {
      emiVal = loan / N;
    }

    const interest = emiVal * N - loan;

    setLoanAmt(loan);
    setEmi(emiVal);
    setTotalInterest(interest);
  };

  useEffect(() => {
    calculate();
  }, [price, downpayment, rate, tenure]);

  const copyResults = () => {
    const text = `Car Loan Estimate:\nEx-Showroom Price: $${Number(price).toLocaleString()}\nDown Payment: $${Number(downpayment).toLocaleString()}\nLoan Amount: $${loanAmt.toLocaleString()}\nEMI: $${emi.toFixed(2)}/mo\nTotal Interest: $${totalInterest.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>CAR LOAN DETAILS</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Vehicle Price ($)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Down Payment ($)</label>
              <input type="number" value={downpayment} onChange={(e) => setDownpayment(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Interest Rate (%)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tenure (Years)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={() => { setPrice('35000'); setDownpayment('7000'); setRate('6.5'); setTenure('5'); }} className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>LOAN BREAKDOWN</h3>
        <div className="space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Monthly Auto EMI</span>
            <span className="text-3xl font-extrabold text-cyan-400 dark:text-cyan-400 font-mono">
              ${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Car Loan Amount</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${loanAmt.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Total Interest</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   14. EDUCATION LOAN CALCULATOR
   ========================================== */
export function EducationLoanCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [amount, setAmount] = useState<string>('40000');
  const [rate, setRate] = useState<string>('9.2');
  const [courseDuration, setCourseDuration] = useState<string>('4');
  const [moratorium, setMoratorium] = useState<string>('1'); // Repayment holiday post course (Years)
  const [repaymentTenure, setRepaymentTenure] = useState<string>('7'); // Repayment duration (Years)

  const [moratoriumInterest, setMoratoriumInterest] = useState<number>(0);
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const P = Math.max(0, Number(amount) || 0);
    const R = Math.max(0, Number(rate) || 0);
    const C = Math.max(0, Number(courseDuration) || 0);
    const M = Math.max(0, Number(moratorium) || 0);
    const N = Math.max(1, Number(repaymentTenure) || 1) * 12;

    const morYears = C + M; // total moratorium period before repayment starts
    // Simple Interest accumulates during college & moratorium
    const accumulatedSI = P * (R / 100) * morYears;
    const finalPrincipalForRepayment = P + accumulatedSI;

    const r = R / (12 * 100);
    let emiVal = 0;
    if (r > 0) {
      emiVal = (finalPrincipalForRepayment * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    } else {
      emiVal = finalPrincipalForRepayment / N;
    }

    const repaymentInterest = emiVal * N - finalPrincipalForRepayment;
    const overallInterest = accumulatedSI + repaymentInterest;
    const overallPayment = P + overallInterest;

    setMoratoriumInterest(accumulatedSI);
    setEmi(emiVal);
    setTotalInterest(overallInterest);
    setTotalPayment(overallPayment);
  };

  useEffect(() => {
    calculate();
  }, [amount, rate, courseDuration, moratorium, repaymentTenure]);

  const copyResults = () => {
    const text = `Education Loan Estimate:\nPrincipal: $${Number(amount).toLocaleString()}\nAccrued Moratorium Interest: $${moratoriumInterest.toFixed(2)}\nMonthly EMI (Post-Moratorium): $${emi.toFixed(2)}/mo\nTotal Interest: $${totalInterest.toFixed(2)}\nTotal Repayable: $${totalPayment.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>ACADEMIC LOAN TIMELINE</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Education Loan Amount ($)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Course Duration (Yrs)</label>
              <input type="number" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Moratorium (Yrs)</label>
              <input type="number" value={moratorium} onChange={(e) => setMoratorium(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Interest Rate (%)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Repayment Term (Yrs)</label>
              <input type="number" value={repaymentTenure} onChange={(e) => setRepaymentTenure(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={() => { setAmount('40000'); setRate('9.2'); setCourseDuration('4'); setMoratorium('1'); setRepaymentTenure('7'); }} className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>REPAYMENT ESTIMATE</h3>
        <div className="space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Post-Moratorium Monthly EMI</span>
            <span className="text-3xl font-extrabold text-teal-400 dark:text-teal-400 font-mono">
              ${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Accrued Interest (Moratorium)</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${moratoriumInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Total Interest (Overall)</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   15. GOLD LOAN CALCULATOR
   ========================================== */
export function GoldLoanCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [weight, setWeight] = useState<string>('50'); // Gold grams
  const [purity, setPurity] = useState<string>('22'); // 18, 22 or 24 Karat
  const [rate, setRate] = useState<string>('9.0'); // Interest Rate %
  const [tenure, setTenure] = useState<string>('12'); // Months

  const [goldValue, setGoldValue] = useState<number>(0);
  const [maxLoan, setMaxLoan] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Default Gold Spot Prices per Gram (estimated based on realistic global benchmarks)
  const spotPrice24K = 75; // e.g. $75/gram for pure gold

  const calculate = () => {
    const wtVal = Math.max(0, Number(weight) || 0);
    const R = Math.max(0, Number(rate) || 0);
    const N = Math.max(1, Number(tenure) || 1);

    // purity adjustment factor
    let factor = 1;
    if (purity === '18') factor = 18 / 24;
    else if (purity === '22') factor = 22 / 24;

    const computedGoldVal = wtVal * spotPrice24K * factor;
    // Standard Gold loan-to-value is 75%
    const maxLtvAmt = computedGoldVal * 0.75;

    // Monthly compound interest gold loan payment estimation
    const monthlyRate = R / (12 * 100);
    let payment = 0;
    if (monthlyRate > 0) {
      payment = (maxLtvAmt * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1);
    } else {
      payment = maxLtvAmt / N;
    }

    const interest = payment * N - maxLtvAmt;

    setGoldValue(computedGoldVal);
    setMaxLoan(maxLtvAmt);
    setMonthlyPayment(payment);
    setTotalInterest(interest);
  };

  useEffect(() => {
    calculate();
  }, [weight, purity, rate, tenure]);

  const copyResults = () => {
    const text = `Gold Loan Estimate:\nWeight: ${weight} grams (${purity}K purity)\nEst. Gold Value: $${goldValue.toFixed(2)}\nMax Eligible Loan (75% LTV): $${maxLoan.toFixed(2)}\nEstimated Monthly Payment: $${monthlyPayment.toFixed(2)}/mo\nTotal Interest: $${totalInterest.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>GOLD ORNAMENT SPECIFICATIONS</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Gold Weight (Grams)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Gold Purity (Karat)</label>
              <select value={purity} onChange={(e) => setPurity(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`}>
                <option value="24">24 Karat (99.9%)</option>
                <option value="22">22 Karat (91.6%)</option>
                <option value="18">18 Karat (75.0%)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Rate (% p.a.)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Term (Months)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={() => { setWeight('50'); setPurity('22'); setRate('9.0'); setTenure('12'); }} className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>ELIGIBILITY & LOAN VALUE</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/10">
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Est. Gold Value</span>
              <span className="text-lg font-black font-mono text-amber-500">
                ${goldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/10">
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Max Loan (75% LTV)</span>
              <span className="text-lg font-black font-mono text-emerald-500">
                ${maxLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
          <div className="text-center py-2 border-t border-dashed border-blue-200 dark:border-blue-900/40">
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Estimated Monthly Payment</span>
            <span className="text-2xl font-black font-mono text-blue-500 dark:text-blue-400">
              ${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   16. PPF CALCULATOR
   ========================================== */
export function PPFCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [yearlyInvest, setYearlyInvest] = useState<string>('150000'); // Standard max limit is 1.5L in India
  const [rate, setRate] = useState<string>('7.1'); // Current government PPF rate
  const [tenure, setTenure] = useState<string>('15'); // Minimum PPF tenure is 15 years

  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [maturityVal, setMaturityVal] = useState<number>(0);
  const [interestEarned, setInterestEarned] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const P = Math.max(0, Number(yearlyInvest) || 0);
    const R = Math.max(0, Number(rate) || 0);
    const Y = Math.max(1, Number(tenure) || 1);

    let balance = 0;
    let totalInvest = 0;
    const r = R / 100;

    for (let i = 0; i < Y; i++) {
      balance += P;
      totalInvest += P;
      const annualInterest = balance * r;
      balance += annualInterest;
    }

    setTotalInvested(totalInvest);
    setMaturityVal(balance);
    setInterestEarned(balance - totalInvest);
  };

  useEffect(() => {
    calculate();
  }, [yearlyInvest, rate, tenure]);

  const copyResults = () => {
    const text = `PPF Investment Forecast:\nYearly Investment: $${Number(yearlyInvest).toLocaleString()}\nTenure: ${tenure} Years\nTotal Invested: $${totalInvested.toLocaleString()}\nInterest Earned: $${interestEarned.toLocaleString()}\nMaturity Amount: $${maturityVal.toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>PPF PARAMETERS</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Yearly Contribution ($)</label>
            <input type="number" value={yearlyInvest} onChange={(e) => setYearlyInvest(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Interest Rate (% p.a.)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tenure (Years)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={() => { setYearlyInvest('150000'); setRate('7.1'); setTenure('15'); }} className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>SAVINGS MATURITY ACCRUAL</h3>
        <div className="space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Est. Maturity Value</span>
            <span className="text-3xl font-extrabold text-emerald-400 dark:text-emerald-400 font-mono">
              ${maturityVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Total Invested</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Interest Earned</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${interestEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   17. EPF CALCULATOR
   ========================================== */
export function EPFCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [salary, setSalary] = useState<string>('5000'); // Monthly basic + DA
  const [employeeContrib, setEmployeeContrib] = useState<string>('12'); // default 12%
  const [interest, setInterest] = useState<string>('8.25'); // default EPF rate
  const [increment, setIncrement] = useState<string>('8'); // Expected yearly increment %
  const [years, setYears] = useState<string>('25'); // working age to retirement

  const [totalCorpus, setTotalCorpus] = useState<number>(0);
  const [employeeContribTotal, setEmployeeContribTotal] = useState<number>(0);
  const [employerContribTotal, setEmployerContribTotal] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    let monthlySalary = Math.max(0, Number(salary) || 0);
    const empP = Math.max(0, Number(employeeContrib) || 0) / 100;
    const rateEPF = Math.max(0, Number(interest) || 0) / 100;
    const incP = Math.max(0, Number(increment) || 0) / 100;
    const workingY = Math.max(1, Number(years) || 1);

    let epfBalance = 0;
    let empTotalAccumulated = 0;
    let emrTotalAccumulated = 0;

    for (let year = 1; year <= workingY; year++) {
      // Monthly savings added year-by-year
      const empMonthly = monthlySalary * empP;
      // Employer contribution to EPF is 3.67% (8.33% goes to EPS pension scheme)
      const emrMonthly = monthlySalary * 0.0367;

      for (let month = 1; month <= 12; month++) {
        epfBalance += empMonthly + emrMonthly;
        empTotalAccumulated += empMonthly;
        emrTotalAccumulated += emrMonthly;
        // EPF compounding is calculated monthly but credited annually, let's simulate realistic compounding:
        epfBalance += (epfBalance * (rateEPF / 12));
      }

      // Salary increment at the end of the year
      monthlySalary += (monthlySalary * incP);
    }

    setTotalCorpus(epfBalance);
    setEmployeeContribTotal(empTotalAccumulated);
    setEmployerContribTotal(emrTotalAccumulated);
  };

  useEffect(() => {
    calculate();
  }, [salary, employeeContrib, interest, increment, years]);

  const copyResults = () => {
    const text = `EPF Retirement Projection:\nBasic Salary: $${salary}/mo\nYears left: ${years}\nEmployee Accumulation: $${employeeContribTotal.toLocaleString()}\nEmployer Accumulation: $${employerContribTotal.toLocaleString()}\nEst. EPF Retirement Corpus: $${totalCorpus.toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>EPF SCHEME PARAMETERS</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Basic Salary/mo ($)</label>
              <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>EPF Rate (%)</label>
              <input type="number" step="0.05" value={interest} onChange={(e) => setInterest(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Ann. Salary Inc. (%)</label>
              <input type="number" value={increment} onChange={(e) => setIncrement(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Term Left (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={() => { setSalary('5000'); setEmployeeContrib('12'); setInterest('8.25'); setIncrement('8'); setYears('25'); }} className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>EPF ACCRUED RETIREMENT CORPUS</h3>
        <div className="space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Est. Retirement Balance</span>
            <span className="text-3xl font-extrabold text-blue-400 dark:text-blue-400 font-mono">
              ${totalCorpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Emp Contribution</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${employeeContribTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Emr Contribution</span>
              <span className="text-sm font-extrabold font-mono text-slate-700 dark:text-slate-200">${employerContribTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   18. NPS CALCULATOR
   ========================================== */
export function NPSCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [monthlyInvest, setMonthlyInvest] = useState<string>('5000');
  const [rate, setRate] = useState<string>('10'); // average stock/bond blend rate
  const [age, setAge] = useState<string>('25');
  const [pensionAnnuity, setPensionAnnuity] = useState<string>('40'); // default min annuity purchase is 40%

  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [totalCorpus, setTotalCorpus] = useState<number>(0);
  const [lumpsumAmt, setLumpsumAmt] = useState<number>(0);
  const [annuityAmt, setAnnuityAmt] = useState<number>(0);
  const [monthlyPension, setMonthlyPension] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const P = Math.max(0, Number(monthlyInvest) || 0);
    const R = Math.max(0, Number(rate) || 0);
    const currAge = Math.max(18, Number(age) || 18);
    const annPct = Math.max(40, Math.min(100, Number(pensionAnnuity) || 40)) / 100;

    const retirementAge = 60;
    const workingMonths = (retirementAge - currAge) * 12;

    let balance = 0;
    const r = R / (12 * 100);

    for (let i = 0; i < workingMonths; i++) {
      balance += P;
      balance += balance * r;
    }

    const invested = P * workingMonths;
    const annuityPart = balance * annPct;
    const lumpsumPart = balance - annuityPart;

    // Estimate realistic monthly pension from annuity assuming standard 6% return rate
    const estAnnuityReturnRate = 0.06;
    const pension = (annuityPart * estAnnuityReturnRate) / 12;

    setTotalInvested(invested);
    setTotalCorpus(balance);
    setLumpsumAmt(lumpsumPart);
    setAnnuityAmt(annuityPart);
    setMonthlyPension(pension);
  };

  useEffect(() => {
    calculate();
  }, [monthlyInvest, rate, age, pensionAnnuity]);

  const copyResults = () => {
    const text = `NPS Calculator Forecast:\nMonthly Contribution: $${monthlyInvest}\nTotal Invested: $${totalInvested.toLocaleString()}\nAccrued Pension Corpus: $${totalCorpus.toLocaleString()}\nLumpsum Payout (60%): $${lumpsumAmt.toLocaleString()}\nEstimated Monthly Pension: $${monthlyPension.toFixed(2)}/mo`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>PENSION ALLOCATIONS</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Contribution/mo ($)</label>
              <input type="number" value={monthlyInvest} onChange={(e) => setMonthlyInvest(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Expected Rate (%)</label>
              <input type="number" step="0.5" value={rate} onChange={(e) => setRate(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Current Age (Years)</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Annuity Purchase (%)</label>
              <input type="number" min="40" max="100" value={pensionAnnuity} onChange={(e) => setPensionAnnuity(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={() => { setMonthlyInvest('5000'); setRate('10'); setAge('25'); setPensionAnnuity('40'); }} className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>NPS PENSION PROJECTION</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/10">
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Lumpsum (60% cash)</span>
              <span className="text-lg font-black font-mono text-emerald-500">
                ${lumpsumAmt.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/10">
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Est. Monthly Pension</span>
              <span className="text-lg font-black font-mono text-blue-500">
                ${monthlyPension.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="text-center py-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <span className="text-[10px] block text-slate-500 font-bold uppercase">Total Pension Corpus</span>
            <span className="text-xl font-extrabold font-mono text-slate-700 dark:text-slate-200">${totalCorpus.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   19. LUMPSUM INVESTMENT CALCULATOR
   ========================================== */
export function LumpsumCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [principal, setPrincipal] = useState<string>('10000');
  const [rate, setRate] = useState<string>('12');
  const [tenure, setTenure] = useState<string>('10');

  const [totalValue, setTotalValue] = useState<number>(0);
  const [wealthGained, setWealthGained] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const P = Math.max(0, Number(principal) || 0);
    const R = Math.max(0, Number(rate) || 0);
    const Y = Math.max(1, Number(tenure) || 1);

    const futureVal = P * Math.pow(1 + R / 100, Y);

    setTotalValue(futureVal);
    setWealthGained(Math.max(0, futureVal - P));
  };

  useEffect(() => {
    calculate();
  }, [principal, rate, tenure]);

  const copyResults = () => {
    const text = `Lumpsum Wealth Forecast:\nPrincipal Invested: $${Number(principal).toLocaleString()}\nGrowth Rate: ${rate}% p.a.\nTenure: ${tenure} Years\nWealth Gained: $${wealthGained.toLocaleString()}\nFuture Portfolio Value: $${totalValue.toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const principalRatio = totalValue > 0 ? (Number(principal) / totalValue) * 100 : 100;
  const wealthRatio = totalValue > 0 ? (wealthGained / totalValue) * 100 : 0;

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>LUMPSUM SETUP</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Initial Principal Amount ($)</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Expected Rate (% p.a.)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Tenure (Years)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={() => { setPrincipal('10000'); setRate('12'); setTenure('10'); }} className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>INVESTMENT HARVEST</h3>
        <div className="space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Future Portfolio Value</span>
            <span className="text-3xl font-extrabold text-blue-400 dark:text-blue-400 font-mono">
              ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs">
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Initial Investment</span>
              <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-200">${Number(principal).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] block text-slate-500 font-bold uppercase">Wealth Accumulated</span>
              <span className="text-sm font-bold font-mono text-emerald-555 dark:text-emerald-400">${wealthGained.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          {/* Progress bar split */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Investment ({principalRatio.toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Accrued Value ({wealthRatio.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-24 h-4 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800 shadow-inner">
              <div style={{ width: `${principalRatio}%` }} className="bg-blue-600 h-full"></div>
              <div style={{ width: `${wealthRatio}%` }} className="bg-emerald-500 h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   20. INFLATION CALCULATOR
   ========================================== */
export function InflationCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [cost, setCost] = useState<string>('10000');
  const [inflationRate, setInflationRate] = useState<string>('6');
  const [years, setYears] = useState<string>('10');

  const [futureCost, setFutureCost] = useState<number>(0);
  const [purchasingPower, setPurchasingPower] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const C = Math.max(0, Number(cost) || 0);
    const R = Math.max(0, Number(inflationRate) || 0);
    const Y = Math.max(1, Number(years) || 1);

    // What costs C today will cost futureCost tomorrow
    const futCost = C * Math.pow(1 + R / 100, Y);
    // Purchasing power of C in the future: what you can buy with today's C in Y years
    const purchPower = C / Math.pow(1 + R / 100, Y);

    setFutureCost(futCost);
    setPurchasingPower(purchPower);
  };

  useEffect(() => {
    calculate();
  }, [cost, inflationRate, years]);

  const copyResults = () => {
    const text = `Inflation Cost Projections:\nCurrent Worth: $${Number(cost).toLocaleString()}\nInflation Rate: ${inflationRate}% p.a.\nTerm: ${years} Years\nAdjusted Future Cost: $${futureCost.toLocaleString()}\nFuture Purchasing Value of today's sum: $${purchasingPower.toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>INFLATION DETAILS</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Current Cost/Amount ($)</label>
            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Inflation Rate (%)</label>
              <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Years</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
            </div>
          </div>
          <div className="pt-2">
            <button onClick={() => { setCost('10000'); setInflationRate('6'); setYears('10'); }} className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}>Reset</button>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>PURCHASING POWER DEPRECIATION</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/10 text-center">
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Adjusted Future Cost</span>
              <span className="text-lg font-black font-mono text-red-400">
                ${futureCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/20 border border-slate-700/10 text-center">
              <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Value in {years} Years</span>
              <span className="text-lg font-black font-mono text-amber-550">
                ${purchasingPower.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center leading-relaxed font-medium">
            Due to an average {inflationRate}% inflation, what costs ${Number(cost).toLocaleString()} today will require ${futureCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} in {years} years.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   21. CURRENCY CONVERTER
   ========================================== */
export function CurrencyConverter({ isDarkMode }: { isDarkMode: boolean }) {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');

  const [convertedAmt, setConvertedAmt] = useState<number>(0);
  const [rateDetails, setRateDetails] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Benchmarked cross exchange rates relative to USD base
  const rates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    INR: 83.50,
    JPY: 158.20,
    AUD: 1.50,
    CAD: 1.37,
    SGD: 1.35
  };

  const calculate = () => {
    const amt = Math.max(0, Number(amount) || 0);
    const fromFactor = rates[fromCurrency] || 1;
    const toFactor = rates[toCurrency] || 1;

    // Convert to USD base then to target currency
    const usdEquivalent = amt / fromFactor;
    const targetVal = usdEquivalent * toFactor;

    setConvertedAmt(targetVal);
    setRateDetails(toFactor / fromFactor);
  };

  useEffect(() => {
    calculate();
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const copyResults = () => {
    const text = `Currency Conversion:\nSum: ${amount} ${fromCurrency}\nRate: 1 ${fromCurrency} = ${rateDetails.toFixed(4)} ${toCurrency}\nResult: ${convertedAmt.toFixed(2)} ${toCurrency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      <div className={`p-4 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-555'}`}>CONVERSION PAIR</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Amount to Convert</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>From</label>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`}>
                {Object.keys(rates).map(cur => <option key={cur} value={cur}>{cur}</option>)}
              </select>
            </div>
            <button onClick={swapCurrencies} className={`p-2.5 rounded-full mt-4 cursor-pointer transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'}`}>
              ⇄
            </button>
            <div className="flex-1">
              <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>To</label>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className={`w-full px-3 py-2 text-sm rounded-xl font-mono border focus:outline-hidden ${isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-95 border-slate-200'}`}>
                {Object.keys(rates).map(cur => <option key={cur} value={cur}>{cur}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${isDarkMode ? 'bg-blue-950/30 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'}`}>
        <div className="absolute top-0 right-0 p-3">
          <button onClick={copyResults} className={`p-2 rounded-full cursor-pointer ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'}`}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>LIVE EXCHANGE ESTIMATE</h3>
        <div className="space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest">Converted Value</span>
            <span className="text-3xl font-extrabold text-blue-400 dark:text-blue-400 font-mono">
              {convertedAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
            </span>
          </div>
          <div className="text-xs text-center border-t border-dashed border-blue-200 dark:border-blue-900/40 pt-2 font-bold text-slate-400">
            1 {fromCurrency} = {rateDetails.toFixed(4)} {toCurrency}
          </div>
        </div>
      </div>
    </div>
  );
}
