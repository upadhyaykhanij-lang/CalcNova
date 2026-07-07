/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ChevronLeft, ArrowRight, Coins, TrendingUp, Landmark, FileText, Wallet, Percent, Calculator,
  Receipt, User, Home, Car, GraduationCap, Sparkles, PiggyBank, Briefcase, ShieldCheck, ArrowUpRight, Globe, LineChart, Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import M3Icon from './M3Icon';
import { CalculatorId } from '../types';

interface FinanceViewProps {
  onSelectCalculator: (id: CalculatorId) => void;
  onBack: () => void;
  isDarkMode: boolean;
}

export default function FinanceView({ onSelectCalculator, onBack, isDarkMode }: FinanceViewProps) {
  const options = [
    // Loans
    {
      id: 'emi' as CalculatorId,
      title: 'EMI Calculator',
      description: 'Calculate Equated Monthly Installments (EMI) using standard loan formulas.',
      icon: 'Calculator',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      group: 'Loans'
    },
    {
      id: 'personal_loan' as CalculatorId,
      title: 'Personal Loan Calculator',
      description: 'Plan personal loan EMIs, interest details, and processing fees.',
      icon: 'User',
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
      group: 'Loans'
    },
    {
      id: 'home_loan' as CalculatorId,
      title: 'Home Loan Calculator',
      description: 'Calculate EMIs for housing loans with optional prepayment schedule estimations.',
      icon: 'Home',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      group: 'Loans'
    },
    {
      id: 'car_loan' as CalculatorId,
      title: 'Car Loan Calculator',
      description: 'Determine car loan EMIs, down payments, and total borrowing costs.',
      icon: 'Car',
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      group: 'Loans'
    },
    {
      id: 'education_loan' as CalculatorId,
      title: 'Education Loan Calculator',
      description: 'Estimate student loan repayments, moratoria, and interest splits.',
      icon: 'GraduationCap',
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      group: 'Loans'
    },
    {
      id: 'gold_loan' as CalculatorId,
      title: 'Gold Loan Calculator',
      description: 'Check gold ornament eligibility, loan-to-value (LTV), and EMIs.',
      icon: 'Sparkles',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      group: 'Loans'
    },
    {
      id: 'loan' as CalculatorId,
      title: 'Loan Eligibility Checker',
      description: 'Check maximum loan affordability and multi-bank comparisons.',
      icon: 'Wallet',
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      group: 'Loans'
    },

    // Investments & Savings
    {
      id: 'sip' as CalculatorId,
      title: 'SIP Calculator',
      description: 'Estimate future wealth from systematic monthly mutual fund investments.',
      icon: 'TrendingUp',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      group: 'Investments & Savings'
    },
    {
      id: 'lumpsum' as CalculatorId,
      title: 'Lumpsum Calculator',
      description: 'Determine future returns on single one-time mutual fund investments.',
      icon: 'Coins',
      color: 'text-green-500 bg-green-500/10 border-green-500/20',
      group: 'Investments & Savings'
    },
    {
      id: 'fd' as CalculatorId,
      title: 'FD Calculator',
      description: 'Calculate interest earned and maturity values of bank Fixed Deposits.',
      icon: 'Landmark',
      color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
      group: 'Investments & Savings'
    },
    {
      id: 'rd' as CalculatorId,
      title: 'RD Calculator',
      description: 'Calculate maturity values of monthly Recurring Deposits.',
      icon: 'PiggyBank',
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      group: 'Investments & Savings'
    },
    {
      id: 'ppf' as CalculatorId,
      title: 'PPF Calculator',
      description: 'Estimate Public Provident Fund returns with tax-free compound interest.',
      icon: 'Lock',
      color: 'text-lime-500 bg-lime-500/10 border-lime-500/20',
      group: 'Investments & Savings'
    },
    {
      id: 'epf' as CalculatorId,
      title: 'EPF Calculator',
      description: 'Calculate Employee Provident Fund retirement corpus and savings.',
      icon: 'Briefcase',
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      group: 'Investments & Savings'
    },
    {
      id: 'nps' as CalculatorId,
      title: 'NPS Calculator',
      description: 'Estimate retirement pension and lump sum under National Pension Scheme.',
      icon: 'ShieldCheck',
      color: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
      group: 'Investments & Savings'
    },

    // Taxes & Interest
    {
      id: 'simple_interest' as CalculatorId,
      title: 'Simple Interest Calculator',
      description: 'Calculate basic interest earned or paid without compounding.',
      icon: 'Percent',
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
      group: 'Taxes & Interest'
    },
    {
      id: 'compound_interest' as CalculatorId,
      title: 'Compound Interest Calculator',
      description: 'Calculate interest compounding across multiple frequencies.',
      icon: 'LineChart',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      group: 'Taxes & Interest'
    },
    {
      id: 'gst' as CalculatorId,
      title: 'GST Calculator',
      description: 'Quickly calculate CGST, SGST, IGST tax splits for standard rates.',
      icon: 'FileText',
      color: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
      group: 'Taxes & Interest'
    },
    {
      id: 'income_tax' as CalculatorId,
      title: 'Income Tax Calculator (India)',
      description: 'Calculate income tax slab breakdowns under old and new regimes.',
      icon: 'Receipt',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      group: 'Taxes & Interest'
    },

    // Utilities
    {
      id: 'inflation' as CalculatorId,
      title: 'Inflation Calculator',
      description: 'Measure purchasing power decay and future cost adjustments.',
      icon: 'ArrowUpRight',
      color: 'text-red-500 bg-red-500/10 border-red-500/20',
      group: 'Utilities'
    },
    {
      id: 'currency_converter' as CalculatorId,
      title: 'Currency Converter',
      description: 'Check live currency estimations and swap between global fiat pairs.',
      icon: 'Globe',
      color: 'text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20',
      group: 'Utilities'
    }
  ];

  const groups = [
    { name: 'Loans', color: 'text-blue-500' },
    { name: 'Investments & Savings', color: 'text-emerald-500' },
    { name: 'Taxes & Interest', color: 'text-amber-500' },
    { name: 'Utilities', color: 'text-purple-500' }
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
          <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Coins size={20} />
          </div>
          <div>
            <h2 className={`text-lg font-extrabold font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Finance Suite</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premium Suite</p>
          </div>
        </div>
      </div>

      {/* Calculator Cards List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        <div className="space-y-1">
          <h1 className={`text-2xl font-black font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Financial Suite
          </h1>
          <p className="text-xs text-slate-500">
            Compare investments, calculate dynamic tax slabs, and plan your borrowing costs with 19 professional tools.
          </p>
        </div>

        {groups.map((group, gIdx) => {
          const groupOptions = options.filter(opt => opt.group === group.name);
          return (
            <div key={group.name} className="space-y-3">
              <h3 className={`text-xs font-black uppercase tracking-wider border-b pb-1.5 ${
                isDarkMode ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-100'
              } flex items-center gap-2`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></span>
                {group.name}
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {groupOptions.map((opt, idx) => (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (gIdx * 3 + idx) * 0.02, duration: 0.15 }}
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
                    <ArrowRight size={14} className={`text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 ml-1`} />
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
