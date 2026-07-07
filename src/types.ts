/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CalculatorId =
  | 'emi'
  | 'sip'
  | 'fd'
  | 'rd'
  | 'gst'
  | 'loan'
  | 'tip'
  | 'discount'
  | 'percent_calc'
  | 'age'
  | 'bmi'
  | 'bmr'
  | 'body_fat'
  | 'ideal_weight'
  | 'calories'
  | 'water'
  | 'heart_rate'
  | 'pregnancy'
  | 'ovulation'
  | 'bac'
  | 'gpa'
  | 'percentage'
  | 'cgpa'
  | 'attendance'
  | 'studytime'
  | 'unit'
  | 'datediff'
  | 'time_diff'
  | 'workdays'
  | 'simple_interest'
  | 'compound_interest'
  | 'income_tax'
  | 'personal_loan'
  | 'home_loan'
  | 'car_loan'
  | 'education_loan'
  | 'gold_loan'
  | 'ppf'
  | 'epf'
  | 'nps'
  | 'lumpsum'
  | 'inflation'
  | 'currency_converter';

export type CategoryId = 'finance' | 'daily' | 'health' | 'education' | 'unit' | 'time_date';

export interface Calculator {
  id: CalculatorId;
  title: string;
  description: string;
  categoryId: CategoryId;
  icon: string; // Lucide icon name
  keywords: string[];
}

export interface SavedFavorite {
  id: CalculatorId;
  savedAt: string;
}

export interface AppSettings {
  isDarkMode: boolean;
  isPhoneFrame: boolean;
  vibrationFeedback: boolean;
}
