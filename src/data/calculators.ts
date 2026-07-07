/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calculator } from '../types';

export const CALCULATORS: Calculator[] = [
  // FINANCE
  {
    id: 'sip',
    title: 'SIP Calculator',
    description: 'Estimate mutual fund returns via Systematic Investment Plans.',
    categoryId: 'finance',
    icon: 'TrendingUp',
    keywords: ['sip', 'mutual fund', 'investment', 'finance', 'returns', 'wealth', 'compound']
  },
  {
    id: 'fd',
    title: 'FD Calculator',
    description: 'Calculate maturity amount and interest earned on Fixed Deposits.',
    categoryId: 'finance',
    icon: 'Landmark',
    keywords: ['fd', 'fixed deposit', 'saving', 'interest', 'finance', 'bank']
  },
  {
    id: 'rd',
    title: 'RD Calculator',
    description: 'Calculate Recurring Deposit maturity values with compound interest.',
    categoryId: 'finance',
    icon: 'Coins',
    keywords: ['rd', 'recurring deposit', 'saving', 'interest', 'monthly', 'finance']
  },
  {
    id: 'gst',
    title: 'GST Calculator',
    description: 'Calculate Gross or Net price with CGST and SGST tax splits.',
    categoryId: 'finance',
    icon: 'FileText',
    keywords: ['gst', 'tax', 'finance', 'vat', 'cgst', 'sgst', 'invoice']
  },
  {
    id: 'loan',
    title: 'Loan Eligibility',
    description: 'Check loan affordability, maximum eligibility, and interest comparisons.',
    categoryId: 'finance',
    icon: 'Wallet',
    keywords: ['loan', 'eligibility', 'affordability', 'finance', 'principal', 'interest']
  },
  {
    id: 'income_tax',
    title: 'Income Tax Calculator (India)',
    description: 'Estimate your income tax liability under Old and New tax regimes.',
    categoryId: 'finance',
    icon: 'Receipt',
    keywords: ['income tax', 'tax', 'india', 'itr', 'finance', 'salary', 'taxable']
  },
  {
    id: 'personal_loan',
    title: 'Personal Loan Calculator',
    description: 'Plan personal loans, EMIs, processing fees, and overall cost of borrowing.',
    categoryId: 'finance',
    icon: 'User',
    keywords: ['personal loan', 'emi', 'loan', 'finance', 'borrow', 'credit']
  },
  {
    id: 'home_loan',
    title: 'Home Loan Calculator',
    description: 'Calculate EMIs and interest for home loans with prepayment options.',
    categoryId: 'finance',
    icon: 'Home',
    keywords: ['home loan', 'mortgage', 'emi', 'house', 'property', 'finance']
  },
  {
    id: 'car_loan',
    title: 'Car Loan Calculator',
    description: 'Estimate monthly EMIs, down payments, and total interest for a car purchase.',
    categoryId: 'finance',
    icon: 'Car',
    keywords: ['car loan', 'auto loan', 'emi', 'vehicle', 'interest', 'finance']
  },
  {
    id: 'education_loan',
    title: 'Education Loan Calculator',
    description: 'Plan student loans with moratorium periods and compound interest calculations.',
    categoryId: 'finance',
    icon: 'GraduationCap',
    keywords: ['education loan', 'student loan', 'college', 'emi', 'interest', 'finance']
  },
  {
    id: 'gold_loan',
    title: 'Gold Loan Calculator',
    description: 'Check loan-to-value (LTV) and monthly payments against gold ornament weight.',
    categoryId: 'finance',
    icon: 'Sparkles',
    keywords: ['gold loan', 'gold', 'jewel loan', 'emi', 'finance', 'ornament']
  },
  {
    id: 'ppf',
    title: 'PPF Calculator',
    description: 'Calculate returns and maturity values for Public Provident Fund investments.',
    categoryId: 'finance',
    icon: 'PiggyBank',
    keywords: ['ppf', 'provident fund', 'tax savings', 'saving', 'investment', 'finance']
  },
  {
    id: 'epf',
    title: 'EPF Calculator',
    description: 'Estimate your retirement EPF balance based on employee & employer contributions.',
    categoryId: 'finance',
    icon: 'Briefcase',
    keywords: ['epf', 'employee provident fund', 'retirement', 'pension', 'finance', 'salary']
  },
  {
    id: 'nps',
    title: 'NPS Calculator',
    description: 'Check pension amount and lump sum withdrawal on maturity under National Pension System.',
    categoryId: 'finance',
    icon: 'ShieldCheck',
    keywords: ['nps', 'pension', 'national pension system', 'retirement', 'annuity', 'finance']
  },
  {
    id: 'lumpsum',
    title: 'Lumpsum Investment Calculator',
    description: 'Calculate the future value of a one-time lumpsum mutual fund investment.',
    categoryId: 'finance',
    icon: 'Coins',
    keywords: ['lumpsum', 'mutual fund', 'one-time', 'wealth', 'compound', 'finance']
  },
  {
    id: 'inflation',
    title: 'Inflation Calculator',
    description: 'See how inflation affects purchasing power and future costs of living.',
    categoryId: 'finance',
    icon: 'ArrowUpRight',
    keywords: ['inflation', 'purchasing power', 'time value of money', 'cost of living', 'finance']
  },
  {
    id: 'currency_converter',
    title: 'Currency Converter',
    description: 'Convert values between key global currencies based on estimated current rates.',
    categoryId: 'finance',
    icon: 'Globe',
    keywords: ['currency', 'converter', 'exchange rate', 'forex', 'usd', 'eur', 'inr', 'finance']
  },
  {
    id: 'emi',
    title: 'EMI Calculator',
    description: 'Calculate Equated Monthly Installments (EMI) for Home, Car, or Personal loans.',
    categoryId: 'finance',
    icon: 'Calculator',
    keywords: ['loan', 'emi', 'monthly', 'installment', 'finance', 'car', 'home', 'daily']
  },

  // DAILY
  {
    id: 'discount',
    title: 'Discount Calculator',
    description: 'Calculate discount savings, percentage-offs, and final checkout prices.',
    categoryId: 'daily',
    icon: 'Sparkles',
    keywords: ['discount', 'sale', 'shopping', 'off', 'percentage', 'tax', 'daily']
  },
  {
    id: 'percent_calc',
    title: 'Percentage Calculator',
    description: 'Find percentage increase/decrease, ratios, value splits, and conversions.',
    categoryId: 'daily',
    icon: 'Calculator',
    keywords: ['percentage', 'increase', 'decrease', 'ratio', 'fraction', 'daily']
  },

  // HEALTH
  {
    id: 'bmi',
    title: 'BMI Calculator',
    description: 'Check Body Mass Index and find your ideal weight range.',
    categoryId: 'health',
    icon: 'Scale',
    keywords: ['bmi', 'health', 'weight', 'height', 'fitness', 'diet']
  },
  {
    id: 'bmr',
    title: 'BMR Calculator',
    description: 'Calculate Basal Metabolic Rate and baseline caloric expenditures.',
    categoryId: 'health',
    icon: 'Heart',
    keywords: ['bmr', 'calories', 'metabolism', 'diet', 'health', 'fitness']
  },
  {
    id: 'body_fat',
    title: 'Body Fat Calculator',
    description: 'Estimate your body fat percentage using standard US Navy body circumference methods.',
    categoryId: 'health',
    icon: 'Dumbbell',
    keywords: ['body fat', 'fat percentage', 'lean mass', 'fitness', 'health', 'circumference']
  },
  {
    id: 'ideal_weight',
    title: 'Ideal Weight Calculator',
    description: 'Estimate your healthy target weight using Devine, Robinson, Miller, and Hamwi equations.',
    categoryId: 'health',
    icon: 'Scale',
    keywords: ['ideal weight', 'healthy weight', 'target', 'formulas', 'health']
  },
  {
    id: 'water',
    title: 'Water Intake Tracker',
    description: 'Track daily hydration goals based on active body metrics and local climate.',
    categoryId: 'health',
    icon: 'GlassWater',
    keywords: ['water', 'hydration', 'health', 'drink', 'target', 'glass']
  },
  {
    id: 'calories',
    title: 'Calorie Counter & Advisor',
    description: 'Estimate daily calorie targets for maintenance, weight loss, or weight gain goals.',
    categoryId: 'health',
    icon: 'Activity',
    keywords: ['calories', 'intake', 'nutrition', 'diet', 'burn', 'health', 'fitness']
  },
  {
    id: 'heart_rate',
    title: 'Heart Rate Zones Calculator',
    description: 'Find your target aerobic, fat burn, and anaerobic training zones based on age and resting pulse.',
    categoryId: 'health',
    icon: 'Activity',
    keywords: ['heart rate', 'pulse', 'cardio', 'fat burn', 'zones', 'karvonen', 'fitness', 'mhr']
  },
  {
    id: 'pregnancy',
    title: 'Pregnancy Due Date Calculator',
    description: 'Calculate your estimated due date, gestational age, and pregnancy progress markers.',
    categoryId: 'health',
    icon: 'Baby',
    keywords: ['pregnancy', 'due date', 'conception', 'baby', 'gestational age', 'weeks', 'trimester']
  },
  {
    id: 'ovulation',
    title: 'Ovulation & Fertility Calculator',
    description: 'Identify your peak fertile windows, ovulation date, and conception timeline.',
    categoryId: 'health',
    icon: 'Calendar',
    keywords: ['ovulation', 'fertility', 'fertile window', 'period', 'cycle', 'conception']
  },
  {
    id: 'bac',
    title: 'BAC Calculator (Blood Alcohol)',
    description: 'Estimate Blood Alcohol Content percentage, state of sobriety, and clearance timeline.',
    categoryId: 'health',
    icon: 'Wine',
    keywords: ['bac', 'alcohol', 'blood alcohol', 'sober', 'drink', 'beverage', 'widmark']
  },

  // TIP (moved from DAILY)
  {
    id: 'tip',
    title: 'Tip Calculator',
    description: 'Split bills and calculate tips quickly with friends.',
    categoryId: 'finance',
    icon: 'Percent',
    keywords: ['tip', 'bill', 'split', 'restaurant', 'food', 'daily', 'finance']
  },
  {
    id: 'gpa',
    title: 'GPA Calculator',
    description: 'Calculate Semester Grade Point Average based on grades and course credits.',
    categoryId: 'education',
    icon: 'GraduationCap',
    keywords: ['gpa', 'grade', 'cgpa', 'percentage', 'marks', 'education', 'school', 'college']
  },
  {
    id: 'cgpa',
    title: 'CGPA Calculator',
    description: 'Calculate Cumulative Grade Point Average across semesters and convert to percentages.',
    categoryId: 'education',
    icon: 'Award',
    keywords: ['cgpa', 'gpa', 'cumulative', 'average', 'marks', 'percentage', 'education', 'college']
  },
  {
    id: 'percentage',
    title: 'Percentage Calculator',
    description: 'Calculate simple or weighted grade percentages, marks distribution, and final grades.',
    categoryId: 'education',
    icon: 'Percent',
    keywords: ['percentage', 'marks', 'exam', 'score', 'education', 'grade', 'weight']
  },
  {
    id: 'attendance',
    title: 'Attendance Calculator',
    description: 'Track attendance percentage and calculate how many classes you can miss or need to attend.',
    categoryId: 'education',
    icon: 'Calendar',
    keywords: ['attendance', 'classes', 'bunk', 'college', 'absence', 'school', 'schedule']
  },
  {
    id: 'studytime',
    title: 'Study Planner & Timer',
    description: 'Plan study sessions, focus-break cycles, and calculate prep time needed for exams.',
    categoryId: 'education',
    icon: 'Clock',
    keywords: ['study', 'timer', 'exam', 'prep', 'schedule', 'break', 'pomodoro', 'education']
  },

  // UNIT CONVERTER
  {
    id: 'unit',
    title: 'Unit Converter',
    description: 'Convert values between Length, Weight, Temp, Area, Volume, and Speed.',
    categoryId: 'unit',
    icon: 'Ruler',
    keywords: ['unit', 'converter', 'length', 'weight', 'temp', 'temperature', 'area', 'volume', 'speed', 'metric', 'imperial']
  },

  // TIME & DATE
  {
    id: 'age',
    title: 'Age Calculator',
    description: 'Calculate precise age in years, months, and days, plus days to your next birthday.',
    categoryId: 'daily',
    icon: 'Calendar',
    keywords: ['age', 'birthday', 'years', 'months', 'days', 'dob', 'time', 'date', 'daily']
  },
  {
    id: 'datediff',
    title: 'Date Difference',
    description: 'Calculate exact years, months, weeks, and days between two calendar dates.',
    categoryId: 'time_date',
    icon: 'Clock',
    keywords: ['date', 'time', 'difference', 'days', 'calendar', 'weeks']
  },
  {
    id: 'time_diff',
    title: 'Time Difference',
    description: 'Find duration between times or add/subtract time intervals with precision.',
    categoryId: 'time_date',
    icon: 'Clock',
    keywords: ['time', 'difference', 'hours', 'minutes', 'duration', 'add', 'subtract']
  },
  {
    id: 'workdays',
    title: 'Working Days',
    description: 'Calculate workdays and weekends between dates with custom weekend filters.',
    categoryId: 'time_date',
    icon: 'Calendar',
    keywords: ['workdays', 'working days', 'weekends', 'date', 'time', 'business days']
  },
  {
    id: 'simple_interest',
    title: 'Simple Interest Calculator',
    description: 'Calculate interest earned or paid with simple interest formulas.',
    categoryId: 'finance',
    icon: 'Percent',
    keywords: ['simple interest', 'interest', 'finance', 'saving', 'investment']
  },
  {
    id: 'compound_interest',
    title: 'Compound Interest Calculator',
    description: 'Calculate compound interest growth, rates, and future values.',
    categoryId: 'finance',
    icon: 'TrendingUp',
    keywords: ['compound interest', 'compound', 'interest', 'finance', 'saving', 'investment']
  }
];

export const CATEGORIES = [
  { id: 'finance', name: 'Finance', icon: 'Coins', color: 'from-blue-500 to-indigo-600', description: 'Tip, SIP, FD, RD, GST, Loan Eligibility' },
  { id: 'daily', name: 'Daily', icon: 'Percent', color: 'from-sky-400 to-blue-500', description: 'Percentage, Discount, Age, BMI, Loan' },
  { id: 'health', name: 'Health', icon: 'Heart', color: 'from-emerald-400 to-teal-500', description: 'BMI, BMR, Body Fat, Ideal Weight, Water, Calories, Heart Rate, Pregnancy, Ovulation, BAC' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'from-purple-500 to-indigo-500', description: 'GPA, Marks Percentage' },
  { id: 'unit', name: 'Unit Converter', icon: 'Ruler', color: 'from-amber-400 to-orange-500', description: 'Length, Weight, Temp, Area, Volume, Speed' },
  { id: 'time_date', name: 'Time & Date', icon: 'Clock', color: 'from-pink-500 to-rose-500', description: 'Date Difference, Time Difference, Workdays' }
];
