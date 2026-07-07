/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Star as StarIcon, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import AndroidFrame from './components/AndroidFrame';
import HomeView from './components/HomeView';
import FavoritesView from './components/FavoritesView';
import SettingsView from './components/SettingsView';
import FinanceView from './components/FinanceView';
import { 
  CalculatorWrapper, 
  EMICalculator, 
  SIPCalculator, 
  FDCalculator, 
  RDCalculator, 
  GSTCalculator, 
  LoanEligibility, 
  SimpleInterestCalculator, 
  CompoundInterestCalculator,
  IncomeTaxCalculator,
  PersonalLoanCalculator,
  HomeLoanCalculator,
  CarLoanCalculator,
  EducationLoanCalculator,
  GoldLoanCalculator,
  PPFCalculator,
  EPFCalculator,
  NPSCalculator,
  LumpsumCalculator,
  InflationCalculator,
  CurrencyConverter
} from './components/FinanceCalculators';
import { TipCalculator, DiscountCalculator, AgeCalculator, PercentageCalculator } from './components/DailyCalculators';
import { 
  BMICalculator, 
  BMRCalculator, 
  BodyFatCalculator, 
  IdealWeightCalculator, 
  CaloriesCalculator, 
  WaterIntakeCalculator, 
  HeartRateCalculator, 
  BACCalculator, 
  PregnancyCalculator, 
  OvulationCalculator 
} from './components/HealthCalculators';
import HealthView from './components/HealthView';
import { GPACalculator, CGPACalculator, PercentageCalculator as EducationPercentageCalculator, AttendanceCalculator, StudyTimeCalculator } from './components/EducationCalculators';
import { UnitConverter } from './components/UnitConverter';
import { DateDifference, WorkdaysCalculator, TimeDifferenceCalculator } from './components/TimeDateCalculators';
import { CalculatorId } from './types';
import { CALCULATORS } from './data/calculators';

export default function App() {
  // App preferences (saved to local storage)
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('calcnova_theme_mode');
    return (saved as 'light' | 'dark' | 'system') || 'system';
  });

  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    const saved = localStorage.getItem('calcnova_language');
    return (saved as 'en' | 'hi') || 'en';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('calcnova_theme_mode') || 'system';
    if (savedTheme === 'system') {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedTheme === 'dark';
  });

  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(() => {
    const saved = localStorage.getItem('calcnova_phone_frame');
    return saved !== null ? saved === 'true' : true; // Default to phone view simulation
  });

  const [vibration, setVibration] = useState<boolean>(() => {
    const saved = localStorage.getItem('calcnova_vibration');
    return saved !== null ? saved === 'true' : true;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('calcnova_favorites');
    return saved !== null ? JSON.parse(saved) : ['emi', 'bmi', 'unit']; // Presave some favorites
  });

  const [recentIds, setRecentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('calcnova_recents');
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [usageCounts, setUsageCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('calcnova_usage');
    return saved !== null ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'settings'>('home');
  const [activeCalculator, setActiveCalculator] = useState<CalculatorId | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('calcnova_theme_mode', themeMode);
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      setIsDarkMode(themeMode === 'dark');
    }
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('calcnova_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('calcnova_phone_frame', isPhoneFrame.toString());
  }, [isPhoneFrame]);

  useEffect(() => {
    localStorage.setItem('calcnova_vibration', vibration.toString());
  }, [vibration]);

  useEffect(() => {
    localStorage.setItem('calcnova_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle dark mode class on HTML document
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Haptic Feedback Simulator
  const triggerHaptic = () => {
    if (vibration && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleRestoreDefaults = () => {
    localStorage.removeItem('calcnova_theme_mode');
    localStorage.removeItem('calcnova_language');
    localStorage.removeItem('calcnova_phone_frame');
    localStorage.removeItem('calcnova_vibration');
    localStorage.removeItem('calcnova_favorites');
    localStorage.removeItem('calcnova_recents');
    localStorage.removeItem('calcnova_usage');
    localStorage.removeItem('calcnova_user_rating');
    
    setThemeMode('system');
    setLanguage('en');
    setIsPhoneFrame(true);
    setVibration(true);
    setFavorites(['emi', 'bmi', 'unit']);
    setRecentIds([]);
    setUsageCounts({});
    
    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
  };

  const handleToggleFavorite = (id: string) => {
    triggerHaptic();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const [navSource, setNavSource] = useState<'home' | 'finance' | 'health' | 'favorites' | null>(null);

  const recordCalculatorVisit = (id: string) => {
    if (id === 'finance' || id === 'health') return;
    
    setRecentIds((prev) => {
      const updated = [id, ...prev.filter(x => x !== id)].slice(0, 6);
      localStorage.setItem('calcnova_recents', JSON.stringify(updated));
      return updated;
    });

    setUsageCounts((prev) => {
      const updated = { ...prev, [id]: (prev[id] || 0) + 1 };
      localStorage.setItem('calcnova_usage', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectCalculator = (id: string) => {
    triggerHaptic();
    recordCalculatorVisit(id);
    setNavSource('home');
    setActiveCalculator(id as CalculatorId);
  };

  const handleSelectFinanceView = () => {
    triggerHaptic();
    setNavSource('home');
    setActiveCalculator('finance' as any);
  };

  const handleSelectCalculatorFromFinance = (id: string) => {
    triggerHaptic();
    recordCalculatorVisit(id);
    setNavSource('finance');
    setActiveCalculator(id as CalculatorId);
  };

  const handleSelectHealthView = () => {
    triggerHaptic();
    setNavSource('home');
    setActiveCalculator('health' as any);
  };

  const handleSelectCalculatorFromHealth = (id: string) => {
    triggerHaptic();
    recordCalculatorVisit(id);
    setNavSource('health');
    setActiveCalculator(id as CalculatorId);
  };

  const handleSelectCalculatorFromFavorites = (id: string) => {
    triggerHaptic();
    recordCalculatorVisit(id);
    setNavSource('favorites');
    setActiveCalculator(id as CalculatorId);
  };

  const handleBackToMain = () => {
    triggerHaptic();
    if (navSource === 'finance') {
      setActiveCalculator('finance' as any);
      setNavSource('home');
    } else if (navSource === 'health') {
      setActiveCalculator('health' as any);
      setNavSource('home');
    } else {
      setActiveCalculator(null);
      setNavSource(null);
    }
  };

  // Helper to render current calculator contents
  const renderCalculatorContent = () => {
    if (!activeCalculator) return null;

    switch (activeCalculator) {
      // Finance
      case 'emi':
        return <EMICalculator isDarkMode={isDarkMode} onBack={handleBackToMain} />;
      case 'sip':
        return (
          <SIPCalculator 
            isDarkMode={isDarkMode} 
            isFavorited={favorites.includes('sip')} 
            onToggleFavorite={() => handleToggleFavorite('sip')} 
            onBack={handleBackToMain}
            language={language}
          />
        );
      case 'fd':
        return (
          <FDCalculator 
            isDarkMode={isDarkMode} 
            isFavorited={favorites.includes('fd')} 
            onToggleFavorite={() => handleToggleFavorite('fd')} 
            onBack={handleBackToMain}
            language={language}
          />
        );
      case 'rd':
        return (
          <RDCalculator 
            isDarkMode={isDarkMode} 
            isFavorited={favorites.includes('rd')} 
            onToggleFavorite={() => handleToggleFavorite('rd')} 
            onBack={handleBackToMain}
            language={language}
          />
        );
      case 'gst':
        return (
          <GSTCalculator 
            isDarkMode={isDarkMode} 
            isFavorited={favorites.includes('gst')} 
            onToggleFavorite={() => handleToggleFavorite('gst')} 
            onBack={handleBackToMain}
            language={language}
          />
        );
      case 'loan':
        return <LoanEligibility isDarkMode={isDarkMode} />;
      case 'simple_interest':
        return <SimpleInterestCalculator isDarkMode={isDarkMode} />;
      case 'compound_interest':
        return <CompoundInterestCalculator isDarkMode={isDarkMode} />;
      case 'income_tax':
        return <IncomeTaxCalculator isDarkMode={isDarkMode} />;
      case 'personal_loan':
        return <PersonalLoanCalculator isDarkMode={isDarkMode} />;
      case 'home_loan':
        return <HomeLoanCalculator isDarkMode={isDarkMode} />;
      case 'car_loan':
        return <CarLoanCalculator isDarkMode={isDarkMode} />;
      case 'education_loan':
        return <EducationLoanCalculator isDarkMode={isDarkMode} />;
      case 'gold_loan':
        return <GoldLoanCalculator isDarkMode={isDarkMode} />;
      case 'ppf':
        return <PPFCalculator isDarkMode={isDarkMode} />;
      case 'epf':
        return <EPFCalculator isDarkMode={isDarkMode} />;
      case 'nps':
        return <NPSCalculator isDarkMode={isDarkMode} />;
      case 'lumpsum':
        return <LumpsumCalculator isDarkMode={isDarkMode} />;
      case 'inflation':
        return <InflationCalculator isDarkMode={isDarkMode} />;
      case 'currency_converter':
        return <CurrencyConverter isDarkMode={isDarkMode} />;
      // Daily
      case 'tip':
        return <TipCalculator isDarkMode={isDarkMode} />;
      case 'discount':
        return <DiscountCalculator isDarkMode={isDarkMode} />;
      case 'percent_calc':
        return <PercentageCalculator isDarkMode={isDarkMode} />;
      case 'age':
        return <AgeCalculator isDarkMode={isDarkMode} />;
      // Health
      case 'bmi':
        return <BMICalculator isDarkMode={isDarkMode} />;
      case 'bmr':
        return <BMRCalculator isDarkMode={isDarkMode} />;
      case 'body_fat':
        return <BodyFatCalculator isDarkMode={isDarkMode} />;
      case 'ideal_weight':
        return <IdealWeightCalculator isDarkMode={isDarkMode} />;
      case 'calories':
        return <CaloriesCalculator isDarkMode={isDarkMode} />;
      case 'water':
        return <WaterIntakeCalculator isDarkMode={isDarkMode} />;
      case 'heart_rate':
        return <HeartRateCalculator isDarkMode={isDarkMode} />;
      case 'pregnancy':
        return <PregnancyCalculator isDarkMode={isDarkMode} />;
      case 'ovulation':
        return <OvulationCalculator isDarkMode={isDarkMode} />;
      case 'bac':
        return <BACCalculator isDarkMode={isDarkMode} />;
      // Education
      case 'gpa':
        return <GPACalculator isDarkMode={isDarkMode} />;
      case 'cgpa':
        return <CGPACalculator isDarkMode={isDarkMode} />;
      case 'percentage':
        return <EducationPercentageCalculator isDarkMode={isDarkMode} />;
      case 'attendance':
        return <AttendanceCalculator isDarkMode={isDarkMode} />;
      case 'studytime':
        return <StudyTimeCalculator isDarkMode={isDarkMode} />;
      // Unit
      case 'unit':
        return <UnitConverter isDarkMode={isDarkMode} />;
      // Time/Date
      case 'datediff':
        return <DateDifference isDarkMode={isDarkMode} />;
      case 'time_diff':
        return <TimeDifferenceCalculator isDarkMode={isDarkMode} />;
      case 'workdays':
        return <WorkdaysCalculator isDarkMode={isDarkMode} />;
      default:
        return <div className="text-center p-10">Calculator under construction.</div>;
    }
  };

  // Fetch meta info of active calculator
  const activeCalcMeta = CALCULATORS.find(c => c.id === activeCalculator);

  return (
    <AndroidFrame
      isPhoneFrame={isPhoneFrame}
      setIsPhoneFrame={setIsPhoneFrame}
      isDarkMode={isDarkMode}
    >
      <div className={`flex flex-col h-full w-full select-none ${isDarkMode ? 'bg-brand-dark-bg text-white' : 'bg-brand-bg text-slate-900'}`}>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <AnimatePresence mode="wait">
            {activeCalculator ? (
              /* Active Calculator Details Mode */
              <motion.div
                key={`calc-${activeCalculator}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden h-full"
              >
                {activeCalculator === ('finance' as any) ? (
                  <FinanceView
                    onSelectCalculator={handleSelectCalculatorFromFinance}
                    onBack={handleBackToMain}
                    isDarkMode={isDarkMode}
                  />
                ) : activeCalculator === ('health' as any) ? (
                  <HealthView
                    onSelectCalculator={handleSelectCalculatorFromHealth}
                    onBack={handleBackToMain}
                    isDarkMode={isDarkMode}
                  />
                ) : activeCalcMeta ? (
                  <CalculatorWrapper
                    id={activeCalcMeta.id}
                    title={activeCalcMeta.title}
                    icon={activeCalcMeta.icon}
                    isFavorited={favorites.includes(activeCalcMeta.id)}
                    onToggleFavorite={() => handleToggleFavorite(activeCalcMeta.id)}
                    onBack={handleBackToMain}
                    isDarkMode={isDarkMode}
                  >
                    {renderCalculatorContent()}
                  </CalculatorWrapper>
                ) : null}
              </motion.div>
            ) : (
              /* Bottom-Nav Tab Content Mode */
              <motion.div
                key={`tab-${activeTab}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden flex flex-col h-full"
              >
                {activeTab === 'home' && (
                  <HomeView
                    onSelectCalculator={handleSelectCalculator}
                    onSelectFinanceView={handleSelectFinanceView}
                    onSelectHealthView={handleSelectHealthView}
                    isDarkMode={isDarkMode}
                    recentIds={recentIds}
                    usageCounts={usageCounts}
                    favorites={favorites}
                    onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                  />
                )}
                {activeTab === 'favorites' && (
                  <FavoritesView
                    favorites={favorites}
                    onSelectCalculator={handleSelectCalculatorFromFavorites}
                    isDarkMode={isDarkMode}
                  />
                )}
                 {activeTab === 'settings' && (
                  <SettingsView
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    themeMode={themeMode}
                    setThemeMode={setThemeMode}
                    language={language}
                    setLanguage={setLanguage}
                    isPhoneFrame={isPhoneFrame}
                    setIsPhoneFrame={setIsPhoneFrame}
                    vibration={vibration}
                    setVibration={setVibration}
                    favoritesCount={favorites.length}
                    onRestoreDefaults={handleRestoreDefaults}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Material 3 Styled Bottom Navigation Bar (Hidden when actively calculating) */}
        {!activeCalculator && (
          <div className={`py-2 border-t flex justify-around items-center sticky bottom-0 z-30 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-800 text-slate-400' 
              : 'bg-white/95 border-slate-200 text-slate-600'
          } backdrop-blur-md`}>
            {[
              { id: 'home', label: language === 'hi' ? 'मुख्य पृष्ठ' : 'Home', icon: HomeIcon },
              { id: 'favorites', label: language === 'hi' ? 'पसंदीदा' : 'Favorites', icon: StarIcon },
              { id: 'settings', label: language === 'hi' ? 'सेटिंग्स' : 'Settings', icon: SettingsIcon },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => { triggerHaptic(); setActiveTab(tab.id as any); }}
                  className={`flex flex-col items-center gap-1.5 py-1 px-4 cursor-pointer relative group`}
                >
                  {/* Dynamic Active Indicator Capsule (M3 Pillar Style) */}
                  <div className="relative flex items-center justify-center">
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-indicator"
                        className={`absolute -inset-x-4 -inset-y-1.5 rounded-full z-0 ${
                          isDarkMode ? 'bg-[#002d53]' : 'bg-accent-light'
                        }`}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                    <TabIcon 
                      size={20} 
                      className={`relative z-10 transition-colors duration-200 ${
                        isActive 
                          ? isDarkMode ? 'text-blue-400' : 'text-primary' 
                          : 'text-slate-400 group-hover:text-slate-500'
                      }`} 
                    />
                  </div>

                  <span className={`text-[10px] font-bold tracking-widest uppercase relative z-10 font-display transition-colors duration-200 ${
                    isActive 
                      ? isDarkMode ? 'text-blue-400' : 'text-primary' 
                      : 'text-slate-400 group-hover:text-slate-500'
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </AndroidFrame>
  );
}
