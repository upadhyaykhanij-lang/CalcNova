/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Education Calculators: GPA, CGPA, Percentage (Weighted/Simple), Attendance, and Study Planner.
 */

import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Award, 
  GraduationCap, 
  Share2, 
  AlertTriangle, 
  RotateCcw, 
  Calendar, 
  Clock, 
  BookOpen, 
  Percent 
} from 'lucide-react';

/* ==========================================
   HELPERS & COMMON STYLES
   ========================================== */
const m3CardBase = (isDarkMode: boolean) => 
  `p-5 rounded-3xl m3-card-shadow ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`;

const m3ResultBase = (isDarkMode: boolean) => 
  `p-5 rounded-3xl m3-card-shadow-elevated relative overflow-hidden ${
    isDarkMode ? 'bg-blue-950/40 border border-blue-900/30' : 'bg-blue-50/50 border border-blue-100'
  }`;


/* ==========================================
   1. GPA CALCULATOR
   ========================================== */
interface Course {
  id: string;
  name: string;
  grade: string; // "A", "B", etc.
  credits: number;
}

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export function GPACalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Mathematics I', grade: 'A', credits: 4 },
    { id: '2', name: 'Computer Science', grade: 'A-', credits: 3 },
    { id: '3', name: 'Physics Lab', grade: 'B+', credits: 2 },
  ]);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const addCourse = () => {
    const newId = (Date.now() + Math.random()).toString().substring(7);
    setCourses([...courses, { id: newId, name: `Course ${courses.length + 1}`, grade: 'A', credits: 3 }]);
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return; // Prevent empty list
    setCourses(courses.filter(c => c.id !== id));
  };

  let totalCredits = 0;
  let totalPoints = 0;
  courses.forEach(c => {
    const pt = GRADE_POINTS[c.grade] ?? 4.0;
    totalCredits += c.credits;
    totalPoints += pt * c.credits;
  });

  const finalGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

  const copyResults = () => {
    const listText = courses.map(c => `- ${c.name}: Grade ${c.grade} (${c.credits} Credits)`).join('\n');
    const text = `GPA Calculator Results:\n${listText}\n\nTotal Credits: ${totalCredits}\nCumulative GPA: ${finalGPA.toFixed(2)} / 4.00`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const listText = courses.map(c => `- ${c.name}: Grade ${c.grade} (${c.credits} Credits)`).join('\n');
    const text = `GPA Calculator Results:\n${listText}\n\nTotal Credits: ${totalCredits}\nGPA Score: ${finalGPA.toFixed(2)} / 4.00`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My GPA Estimate', text: text });
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
    <div className="space-y-5 animate-fade-in">
      <div className={m3CardBase(isDarkMode)}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>COURSE WORKSPACE</h3>
          <button
            onClick={addCourse}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} />
            <span>Add Course</span>
          </button>
        </div>

        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
          {courses.map((course) => (
            <div key={course.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                className={`flex-1 text-xs px-2.5 py-1.5 rounded-lg border focus:outline-hidden ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                }`}
                placeholder="Course Name"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className={`text-xs px-2 py-1.5 rounded-lg border focus:outline-hidden font-mono font-bold ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                }`}
              >
                {Object.keys(GRADE_POINTS).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <select
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                className={`text-xs px-2 py-1.5 rounded-lg border focus:outline-hidden font-mono ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                }`}
              >
                {[1, 2, 3, 4, 5].map((cr) => (
                  <option key={cr} value={cr}>{cr} Cr</option>
                ))}
              </select>
              <button
                onClick={() => removeCourse(course.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={m3ResultBase(isDarkMode)}>
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>GPA METRICS</h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>CUMULATIVE GPA</span>
            <span className={`text-4xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
              {finalGPA.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-medium block mt-1">Scale of 4.00</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs text-center">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Credit Hours</span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {totalCredits} credits
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Grade Status</span>
              <span className={`text-sm font-bold font-mono ${finalGPA >= 3.5 ? 'text-emerald-500' : finalGPA >= 2.0 ? 'text-amber-500' : 'text-rose-500'}`}>
                {finalGPA >= 3.5 ? 'Excellent 👑' : finalGPA >= 2.0 ? 'Satisfactory Pass' : 'Academic Action'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ==========================================
   2. CGPA CALCULATOR
   ========================================== */
interface SemesterGPA {
  id: string;
  name: string;
  gpa: number;
  credits: number;
}

export function CGPACalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [tab, setTab] = useState<'multi' | 'convert'>('multi');
  
  // Tab 1: Multi-semester
  const [semesters, setSemesters] = useState<SemesterGPA[]>([
    { id: '1', name: 'Semester 1', gpa: 8.5, credits: 20 },
    { id: '2', name: 'Semester 2', gpa: 8.8, credits: 22 },
    { id: '3', name: 'Semester 3', gpa: 9.0, credits: 18 },
  ]);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Tab 2: Converter
  const [cgpaVal, setCgpaVal] = useState<number>(8.5);
  const [scale, setScale] = useState<'10' | '4'>('10');
  const [formulaType, setFormulaType] = useState<'cbse' | 'linear'>('cbse');

  const addSemester = () => {
    const newId = (Date.now() + Math.random()).toString().substring(7);
    setSemesters([...semesters, { id: newId, name: `Semester ${semesters.length + 1}`, gpa: 8.0, credits: 20 }]);
  };

  const updateSemester = (id: string, field: keyof SemesterGPA, value: any) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSemester = (id: string) => {
    if (semesters.length <= 1) return;
    setSemesters(semesters.filter(s => s.id !== id));
  };

  // Calculations for Tab 1
  let totalSemCredits = 0;
  let totalSemPoints = 0;
  semesters.forEach(s => {
    const validGpa = Math.max(0, Math.min(10, s.gpa));
    const validCredits = Math.max(1, s.credits);
    totalSemCredits += validCredits;
    totalSemPoints += validGpa * validCredits;
  });
  const cumulativeCgpa = totalSemCredits > 0 ? totalSemPoints / totalSemCredits : 0;
  const cumulativePercentage = cumulativeCgpa * 9.5; // standard CBSE conversion

  // Calculations for Tab 2
  const maxLimit = scale === '10' ? 10 : 4;
  const validCgpaInput = Math.max(0, Math.min(maxLimit, cgpaVal));
  let convertedPercentage = 0;
  if (scale === '10') {
    convertedPercentage = formulaType === 'cbse' ? validCgpaInput * 9.5 : validCgpaInput * 10;
  } else {
    convertedPercentage = (validCgpaInput / 4) * 100;
  }

  const copyResults = () => {
    let text = '';
    if (tab === 'multi') {
      const list = semesters.map(s => `- ${s.name}: GPA ${s.gpa} (${s.credits} Credits)`).join('\n');
      text = `Cumulative CGPA Report:\n${list}\n\nFinal CGPA: ${cumulativeCgpa.toFixed(2)}\nCBSE Equivalent Percentage: ${cumulativePercentage.toFixed(1)}%`;
    } else {
      text = `CGPA to Percentage Conversion:\nCGPA: ${validCgpaInput} / ${scale}.00\nFormula: ${
        scale === '10' ? (formulaType === 'cbse' ? 'CGPA × 9.5' : 'CGPA × 10') : '(CGPA ÷ 4) × 100'
      }\nEquivalent Percentage: ${convertedPercentage.toFixed(1)}%`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    let text = '';
    if (tab === 'multi') {
      text = `My cumulative CGPA is ${cumulativeCgpa.toFixed(2)} based on ${semesters.length} semesters. Percentage equivalent is ~${cumulativePercentage.toFixed(1)}%.`;
    } else {
      text = `CGPA of ${validCgpaInput}/${scale} converts to ${convertedPercentage.toFixed(1)}% equivalent.`;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My CGPA Estimate', text: text });
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
    <div className="space-y-5 animate-fade-in">
      {/* Tab bar */}
      <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-full">
        <button
          onClick={() => setTab('multi')}
          className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            tab === 'multi'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Semester Aggregator
        </button>
        <button
          onClick={() => setTab('convert')}
          className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            tab === 'convert'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          CGPA ↔ Percentage
        </button>
      </div>

      {tab === 'multi' ? (
        <div className={m3CardBase(isDarkMode)}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>SEMESTER WISE GPAS</h3>
            <button
              onClick={addSemester}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} />
              <span>Add Semester</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
            {semesters.map((sem) => (
              <div key={sem.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={sem.name}
                  onChange={(e) => updateSemester(sem.id, 'name', e.target.value)}
                  className={`flex-1 text-xs px-2.5 py-1.5 rounded-lg border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                  placeholder="Semester Name"
                />
                <div className="w-24">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={sem.gpa}
                    onChange={(e) => updateSemester(sem.id, 'gpa', Number(e.target.value))}
                    placeholder="GPA"
                    className={`w-full text-xs px-2 py-1.5 rounded-lg border font-mono font-bold focus:outline-hidden ${
                      sem.gpa < 0 || sem.gpa > 10 ? 'border-rose-500' : ''
                    } ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    }`}
                  />
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    value={sem.credits}
                    onChange={(e) => updateSemester(sem.id, 'credits', Number(e.target.value))}
                    placeholder="Credits"
                    className={`w-full text-xs px-2 py-1.5 rounded-lg border font-mono focus:outline-hidden ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    }`}
                  />
                </div>
                <button
                  onClick={() => removeSemester(sem.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={m3CardBase(isDarkMode)}>
          <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>CONVERSION INPUT</h3>
          
          <div className="space-y-4">
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                CGPA Grading Scale
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-850 p-1 rounded-xl">
                <button
                  onClick={() => { setScale('10'); setCgpaVal(8.5); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                    scale === '10' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  10.0 Scale (e.g., India)
                </button>
                <button
                  onClick={() => { setScale('4'); setCgpaVal(3.5); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                    scale === '4' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  4.0 Scale (e.g., US)
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Your CGPA
                </label>
                <span className="font-mono text-xs text-blue-500 font-bold">{validCgpaInput.toFixed(2)} / {scale}.00</span>
              </div>
              <input
                type="range"
                min="0"
                max={scale}
                step="0.05"
                value={cgpaVal}
                onChange={(e) => setCgpaVal(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                max={scale}
                value={cgpaVal}
                onChange={(e) => setCgpaVal(Number(e.target.value))}
                className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden ${
                  cgpaVal < 0 || cgpaVal > Number(scale) ? 'border-rose-500' : ''
                } ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                }`}
              />
            </div>

            {scale === '10' && (
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Conversion Formula (10.0 Scale)
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormulaType('cbse')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                      formulaType === 'cbse'
                        ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    CBSE / AICTE (CGPA × 9.5)
                  </button>
                  <button
                    onClick={() => setFormulaType('linear')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                      formulaType === 'linear'
                        ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    Direct Linear (CGPA × 10)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Card */}
      <div className={m3ResultBase(isDarkMode)}>
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          {tab === 'multi' ? 'AGGREGATED CUMULATIVE METRICS' : 'EQUIVALENT PERCENTAGE SCORE'}
        </h3>

        <div className="space-y-4">
          <div className="text-center py-2">
            {tab === 'multi' ? (
              <>
                <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>FINAL CUMULATIVE CGPA</span>
                <span className="text-4xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400">
                  {cumulativeCgpa.toFixed(2)}
                </span>
                <span className={`text-xs block font-semibold mt-1.5 text-emerald-500`}>
                  ~{cumulativePercentage.toFixed(1)}% (CBSE Equivalent)
                </span>
              </>
            ) : (
              <>
                <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>CONVERTED PERCENTAGE</span>
                <span className="text-4xl font-extrabold font-display tracking-tight text-emerald-500">
                  {convertedPercentage.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500 font-medium block mt-1">
                  Using {scale === '10' ? (formulaType === 'cbse' ? 'CBSE (×9.5) Formula' : 'Linear (×10) Formula') : 'US 4.0 Scale Conversion'}
                </span>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs text-center animate-fade-in">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Class Standing</span>
              <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} block mt-1`}>
                {tab === 'multi' 
                  ? (cumulativeCgpa >= 8.5 ? 'First Class with Distinction 🌟' : cumulativeCgpa >= 6.5 ? 'First Class 👍' : 'Second Class')
                  : (convertedPercentage >= 85 ? 'First Class with Distinction 🌟' : convertedPercentage >= 60 ? 'First Class 👍' : 'Second Class')}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>US Grade Equivalent</span>
              <span className={`text-xs font-bold font-mono block mt-1 text-blue-500`}>
                {tab === 'multi' 
                  ? (cumulativeCgpa >= 9.0 ? 'A+ / 4.0 GPA' : cumulativeCgpa >= 8.0 ? 'A / 3.7 GPA' : cumulativeCgpa >= 7.0 ? 'B / 3.0 GPA' : 'C / 2.0 GPA')
                  : (convertedPercentage >= 90 ? 'A+ / 4.0 GPA' : convertedPercentage >= 80 ? 'A / 3.7 GPA' : convertedPercentage >= 70 ? 'B / 3.0 GPA' : 'C / 2.0 GPA')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ==========================================
   3. PERCENTAGE / GRADE CALCULATOR
   ========================================== */
interface WeightedItem {
  id: string;
  name: string;
  weight: number; // e.g. 30 for 30%
  score: number;  // e.g. 90 for 90%
}

export function PercentageCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [tab, setTab] = useState<'simple' | 'weighted'>('simple');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Simple Marks Percentage
  const [obtained, setObtained] = useState<number>(420);
  const [total, setTotal] = useState<number>(500);

  // Weighted Grade Percentage
  const [weightedItems, setWeightedItems] = useState<WeightedItem[]>([
    { id: '1', name: 'Homework & Quizzes', weight: 30, score: 95 },
    { id: '2', name: 'Midterm Exam', weight: 30, score: 85 },
    { id: '3', name: 'Final Exam', weight: 40, score: 80 },
  ]);

  const addWeightedItem = () => {
    const newId = (Date.now() + Math.random()).toString().substring(7);
    const currentWeightSum = weightedItems.reduce((acc, item) => acc + item.weight, 0);
    const defaultWeight = Math.max(0, 100 - currentWeightSum);
    setWeightedItems([...weightedItems, { id: newId, name: `Assignment ${weightedItems.length + 1}`, weight: defaultWeight || 10, score: 90 }]);
  };

  const updateWeightedItem = (id: string, field: keyof WeightedItem, value: any) => {
    setWeightedItems(weightedItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeWeightedItem = (id: string) => {
    if (weightedItems.length <= 1) return;
    setWeightedItems(weightedItems.filter(item => item.id !== id));
  };

  // Simple Marks Calculation
  const obtainedWarning = obtained < 0 ? 'Obtained marks cannot be negative' : obtained > total ? 'Obtained marks cannot exceed total marks' : null;
  const totalWarning = total <= 0 ? 'Total marks must be greater than 0' : null;

  const validObtained = Math.max(0, obtained);
  const validTotal = Math.max(1, total);
  const simplePercentage = (validObtained / validTotal) * 100;

  // Weighted Calculations
  const weightSum = weightedItems.reduce((acc, item) => acc + item.weight, 0);
  let weightedPercentage = 0;
  weightedItems.forEach(item => {
    const scoreVal = Math.max(0, Math.min(100, item.score));
    const weightVal = Math.max(0, item.weight);
    weightedPercentage += (scoreVal * (weightVal / 100));
  });

  // Calculate generic letter grade
  const getGradeInfo = (perc: number) => {
    if (perc >= 90) return { grade: 'A+', remarks: 'Outstanding mastery, top performance!' };
    if (perc >= 80) return { grade: 'A', remarks: 'Excellent command, strong results.' };
    if (perc >= 70) return { grade: 'B', remarks: 'Very good achievement, steady progress.' };
    if (perc >= 60) return { grade: 'C', remarks: 'Satisfactory completion, minor gaps.' };
    if (perc >= 50) return { grade: 'D', remarks: 'Passable grade, review is suggested.' };
    return { grade: 'F', remarks: 'Unsatisfactory progress, additional support is needed.' };
  };

  const currentPercent = tab === 'simple' ? simplePercentage : weightedPercentage;
  const { grade, remarks } = getGradeInfo(currentPercent);

  const copyResults = () => {
    let text = '';
    if (tab === 'simple') {
      text = `Percentage Marks Analysis:\nMarks Obtained: ${validObtained}\nMaximum Marks: ${validTotal}\n\nPercentage: ${simplePercentage.toFixed(1)}%\nGrade: ${grade}\nRemarks: ${remarks}`;
    } else {
      const breakdown = weightedItems.map(item => `- ${item.name}: Weight ${item.weight}%, Score ${item.score}%`).join('\n');
      text = `Weighted Class Grade Report:\n${breakdown}\n\nTotal Weights Checked: ${weightSum}%\nWeighted Final Grade: ${weightedPercentage.toFixed(1)}%\nGrade Letter: ${grade}\nRemarks: ${remarks}`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    let text = '';
    if (tab === 'simple') {
      text = `Scored ${simplePercentage.toFixed(1)}% (${validObtained}/${validTotal}) equivalent to Grade ${grade}.`;
    } else {
      text = `Weighted class grade is ${weightedPercentage.toFixed(1)}% equivalent to Grade ${grade}.`;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Academic Percentage', text: text });
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
    <div className="space-y-5 animate-fade-in">
      {/* Tab bar */}
      <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-full">
        <button
          onClick={() => setTab('simple')}
          className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            tab === 'simple'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Simple Score Percentage
        </button>
        <button
          onClick={() => setTab('weighted')}
          className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            tab === 'weighted'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Weighted Grade Planner
        </button>
      </div>

      {tab === 'simple' ? (
        <div className={m3CardBase(isDarkMode)}>
          <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>MARKS BREAKDOWN</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Obtained Marks</label>
                <span className="font-mono text-xs text-blue-500 font-semibold">{obtained} Marks</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(100, total)}
                step="1"
                value={obtained}
                onChange={(e) => setObtained(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                value={obtained}
                onChange={(e) => setObtained(Number(e.target.value))}
                className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${
                  obtainedWarning ? 'border-rose-500 focus:ring-rose-500' : 'focus:ring-blue-500'
                } ${
                  isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
                }`}
              />
              {obtainedWarning && (
                <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                  <AlertTriangle size={12} />
                  <span>{obtainedWarning}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Maximum Total Marks</label>
                <span className="font-mono text-xs text-blue-500 font-semibold">{total} Marks</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={total}
                onChange={(e) => {
                  const tVal = Number(e.target.value);
                  setTotal(tVal);
                  if (obtained > tVal) setObtained(tVal);
                }}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
                className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${
                  totalWarning ? 'border-rose-500 focus:ring-rose-500' : 'focus:ring-blue-500'
                } ${
                  isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
                }`}
              />
              {totalWarning && (
                <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                  <AlertTriangle size={12} />
                  <span>{totalWarning}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={m3CardBase(isDarkMode)}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>WEIGHTED GRADE ITEMS</h3>
            <button
              onClick={addWeightedItem}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <Plus size={14} />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
            {weightedItems.map((item) => (
              <div key={item.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateWeightedItem(item.id, 'name', e.target.value)}
                  className={`flex-1 text-xs px-2.5 py-1.5 rounded-lg border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                  placeholder="Task Name (e.g., Midterm)"
                />
                <div className="w-20">
                  <span className="text-[10px] block font-semibold text-slate-500 uppercase text-center mb-0.5">Weight %</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.weight}
                    onChange={(e) => updateWeightedItem(item.id, 'weight', Number(e.target.value))}
                    placeholder="Weight"
                    className={`w-full text-xs px-2 py-1 rounded-lg border font-mono text-center focus:outline-hidden ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    }`}
                  />
                </div>
                <div className="w-20">
                  <span className="text-[10px] block font-semibold text-slate-500 uppercase text-center mb-0.5">Score %</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.score}
                    onChange={(e) => updateWeightedItem(item.id, 'score', Number(e.target.value))}
                    placeholder="Score"
                    className={`w-full text-xs px-2 py-1 rounded-lg border font-mono text-center focus:outline-hidden ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                    }`}
                  />
                </div>
                <button
                  onClick={() => removeWeightedItem(item.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors mt-4"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {weightSum !== 100 && (
            <div className="flex items-center gap-1.5 mt-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <AlertTriangle size={14} className="shrink-0" />
              <span>Weights sum up to <strong>{weightSum}%</strong>. For ideal evaluation, weights should equal 100%.</span>
            </div>
          )}
        </div>
      )}

      {/* Scorecard Display */}
      <div className={m3ResultBase(isDarkMode)}>
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>PERCENTAGE SCORECARD</h3>

        <div className="space-y-4">
          <div className="text-center py-2 animate-scale-up">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>PERCENTAGE SCORED</span>
            <span className={`text-4xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400`}>
              {currentPercent.toFixed(1)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs text-center">
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Grade Earned</span>
              <span className={`text-3xl font-bold font-display mt-1 block ${currentPercent >= 60 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {grade}
              </span>
            </div>
            <div>
              <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Academic Verdict</span>
              <span className={`text-sm font-bold font-mono mt-2 block ${currentPercent >= 50 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {currentPercent >= 50 ? 'PASSED ✅' : 'FAILING STATUS ❌'}
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl text-xs text-center font-medium bg-blue-500/5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {remarks}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ==========================================
   4. ATTENDANCE CALCULATOR
   ========================================== */
export function AttendanceCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [conducted, setConducted] = useState<number>(45);
  const [attended, setAttended] = useState<number>(31);
  const [target, setTarget] = useState<number>(75);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Validation Warnings
  const conductedWarning = conducted <= 0 ? 'Conducted classes must be > 0' : conducted > 1000 ? 'Max total is 1000' : null;
  const attendedWarning = attended < 0 ? 'Attended classes cannot be negative' : attended > conducted ? 'Attended cannot exceed conducted' : null;
  const targetWarning = target < 50 ? 'Min target is 50%' : target > 100 ? 'Max target is 100%' : null;

  // Sanitized values
  const validConducted = Math.max(1, conducted);
  const validAttended = Math.max(0, Math.min(validConducted, attended));
  const validTarget = Math.max(1, Math.min(100, target)) / 100;

  // Math calculations
  const currentPercentage = (validAttended / validConducted) * 100;
  const isMeetingTarget = currentPercentage >= (validTarget * 100);

  let recommendation = '';
  let detailText = '';
  let statusBadge = '';
  let statusColor = '';

  if (isMeetingTarget) {
    statusColor = 'text-emerald-500';
    statusBadge = 'TARGET ACHIEVED 😎';
    
    // Calculate how many classes can be safely skipped/bunked
    // Formula: A / (C + y) >= t => A >= tC + ty => ty <= A - tC => y = floor((A - tC) / t)
    const maxBunk = Math.floor((validAttended - (validTarget * validConducted)) / validTarget);
    
    if (maxBunk > 0) {
      recommendation = `You can safely miss the next ${maxBunk} class${maxBunk > 1 ? 'es' : ''} without falling below ${target}%.`;
      detailText = `Missing consecutive classes will reduce attendance. Your threshold is ${maxBunk} bunk${maxBunk > 1 ? 's' : ''}.`;
    } else {
      recommendation = 'You are currently meeting your target! Do not skip any upcoming classes to stay above threshold.';
      detailText = 'Your attendance is exactly on the margin. Skipping even 1 class will drop you below your target.';
    }
  } else {
    statusColor = 'text-rose-500';
    statusBadge = 'ATTENDANCE CRITICAL 🚨';
    
    // Calculate consecutive classes to attend to reach target
    // Formula: (A + x) / (C + x) >= t => A + x >= tC + tx => x(1 - t) >= tC - A => x = ceil((tC - A) / (1 - t))
    let reqClasses = 0;
    if (validTarget < 1) {
      reqClasses = Math.ceil(((validTarget * validConducted) - validAttended) / (1 - validTarget));
    } else {
      // 100% target: can only reach if Conducted = Attended, but if we missed some, we can never get 100%.
      reqClasses = -1; 
    }

    if (reqClasses > 0) {
      recommendation = `You must attend the next ${reqClasses} consecutive class${reqClasses > 1 ? 'es' : ''} to reach ${target}%.`;
      detailText = `Currently short of target. Consistent attendance is strictly required. No skips allowed!`;
    } else if (reqClasses === -1) {
      recommendation = 'It is mathematically impossible to reach 100% attendance because you have already missed classes.';
      detailText = 'Aim for the highest possible percentage by attending all remaining lectures.';
    }
  }

  const copyResults = () => {
    const text = `Attendance Analysis Report:
Classes Conducted: ${validConducted}
Classes Attended: ${validAttended}
Current Attendance: ${currentPercentage.toFixed(1)}%
Target Required: ${target}%
Status: ${statusBadge}

Recommendation: ${recommendation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    const text = `Attendance tracking: ${currentPercentage.toFixed(1)}% (Target: ${target}%). Status: ${statusBadge}. ${recommendation}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Academic Attendance Status', text: text });
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
    <div className="space-y-5 animate-fade-in">
      <div className={m3CardBase(isDarkMode)}>
        <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ATTENDANCE WORKSPACE</h3>
        
        <div className="space-y-4">
          {/* Conducted Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Total Conducted Lectures</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">{conducted} Classes</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="1"
              value={conducted}
              onChange={(e) => {
                const cVal = Number(e.target.value);
                setConducted(cVal);
                if (attended > cVal) setAttended(cVal);
              }}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={conducted}
              onChange={(e) => {
                const cVal = Number(e.target.value);
                setConducted(cVal);
                if (attended > cVal) setAttended(cVal);
              }}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${
                conductedWarning ? 'border-rose-500 focus:ring-rose-500' : 'focus:ring-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {conductedWarning && (
              <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                <AlertTriangle size={12} />
                <span>{conductedWarning}</span>
              </div>
            )}
          </div>

          {/* Attended Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Attended Lectures</label>
              <span className="font-mono text-xs text-blue-500 font-semibold">{attended} Classes</span>
            </div>
            <input
              type="range"
              min="0"
              max={conducted}
              step="1"
              value={attended}
              onChange={(e) => setAttended(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={attended}
              onChange={(e) => setAttended(Number(e.target.value))}
              className={`mt-2 w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden focus:ring-1 ${
                attendedWarning ? 'border-rose-500 focus:ring-rose-500' : 'focus:ring-blue-500'
              } ${
                isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-950 border-slate-200'
              }`}
            />
            {attendedWarning && (
              <div className="flex items-center gap-1 mt-1 text-xs text-rose-500 font-medium">
                <AlertTriangle size={12} />
                <span>{attendedWarning}</span>
              </div>
            )}
          </div>

          {/* Target Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Target Attendance Required</label>
              <span className="font-mono text-xs text-blue-600 font-bold">{target}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results View */}
      <div className={m3ResultBase(isDarkMode)}>
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>ATTENDANCE REPORT</h3>

        <div className="space-y-4">
          <div className="text-center py-2 relative">
            <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>CURRENT PERCENTAGE</span>
            <span className={`text-4xl font-extrabold font-display tracking-tight ${statusColor}`}>
              {currentPercentage.toFixed(1)}%
            </span>
            <span className={`text-[10px] block font-bold tracking-wider mt-1.5 ${statusColor}`}>
              {statusBadge}
            </span>
          </div>

          {/* Visual Progress Bar with Indicator */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold inline-block py-1 px-2 uppercase rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {validAttended} Attended
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold inline-block py-1 px-2 uppercase rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {validConducted} Total
                </span>
              </div>
            </div>

            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-200 dark:bg-slate-800 relative">
              <div
                style={{ width: `${currentPercentage}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                  isMeetingTarget ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              ></div>
              {/* Target Line marker */}
              <div 
                style={{ left: `${target}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-blue-600 dark:bg-blue-400 z-10"
                title={`Target ${target}%`}
              ></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold px-0.5 mt-1">
              <span>0%</span>
              <span style={{ color: '#2563eb' }} className="ml-auto pr-2">Target ({target}%)</span>
              <span>100%</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl text-xs text-center font-bold bg-blue-500/5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} border border-blue-200/20`}>
            {recommendation}
          </div>
          
          <div className="text-[10px] text-center text-slate-500 font-medium">
            {detailText}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ==========================================
   5. STUDY TIMER & PLANNER
   ========================================== */
export function StudyTimeCalculator({ isDarkMode }: { isDarkMode: boolean }) {
  const [mode, setMode] = useState<'splitter' | 'exam'>('splitter');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Splitter State
  const [totalMins, setTotalMins] = useState<number>(180);
  const [focusMins, setFocusMins] = useState<number>(50);
  const [breakMins, setBreakMins] = useState<number>(10);

  // Exam Prep State
  const [daysLeft, setDaysLeft] = useState<number>(7);
  const [topicsCount, setTopicsCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Input sanitizations
  const validTotalMins = Math.max(10, Math.min(600, totalMins));
  const validFocusMins = Math.max(5, Math.min(120, focusMins));
  const validBreakMins = Math.max(1, Math.min(60, breakMins));

  const validDaysLeft = Math.max(1, Math.min(365, daysLeft));
  const validTopicsCount = Math.max(1, Math.min(100, topicsCount));

  // Splitter Calculations
  const cycleTime = validFocusMins + validBreakMins;
  const cycleCount = Math.floor(validTotalMins / cycleTime);
  const remainderMins = validTotalMins % cycleTime;
  const totalStudyMins = cycleCount * validFocusMins + Math.min(validFocusMins, remainderMins);
  const totalBreakMins = validTotalMins - totalStudyMins;

  // Exam Prep Calculations
  // Baseline focus multiplier based on difficulty
  const basePrepPerTopic: Record<string, number> = { easy: 2, medium: 4.5, hard: 8 };
  const totalHoursNeeded = validTopicsCount * basePrepPerTopic[difficulty];
  const dailyHoursNeeded = totalHoursNeeded / validDaysLeft;

  const copyResults = () => {
    let text = '';
    if (mode === 'splitter') {
      text = `Study Session Timeline Report:
Total Available: ${validTotalMins} minutes
Focus Segment: ${validFocusMins} mins
Break Segment: ${validBreakMins} mins

Cycles Formed: ${cycleCount} focus cycles
Active Focus Time: ${totalStudyMins} mins
Active Rest Breaks: ${totalBreakMins} mins`;
    } else {
      text = `Exam Prep Schedule Report:
Days Left: ${validDaysLeft} days
Topics to Study: ${validTopicsCount} topics
Self Assessed Difficulty: ${difficulty.toUpperCase()}

Total Preparation Time Needed: ${totalHoursNeeded.toFixed(1)} hours
Recommended Daily Study Hours: ${dailyHoursNeeded.toFixed(1)} hrs/day
Focus Allocated per Topic: ${(totalHoursNeeded / validTopicsCount).toFixed(1)} hours`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareResults = async () => {
    let text = '';
    if (mode === 'splitter') {
      text = `My study split: ${totalStudyMins} mins of pure focus, ${totalBreakMins} mins of breaks across ${cycleCount} focus cycles!`;
    } else {
      text = `Recommended exam study schedule: ${dailyHoursNeeded.toFixed(1)} hours/day over ${validDaysLeft} days to master ${validTopicsCount} topics!`;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Study Schedule', text: text });
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
    <div className="space-y-5 animate-fade-in">
      {/* Tab bar */}
      <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-full">
        <button
          onClick={() => setMode('splitter')}
          className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            mode === 'splitter'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Study Session Splitter
        </button>
        <button
          onClick={() => setMode('exam')}
          className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            mode === 'exam'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Exam Prep Planner
        </button>
      </div>

      {mode === 'splitter' ? (
        <div className={m3CardBase(isDarkMode)}>
          <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TIMING INTERVALS</h3>
          
          <div className="space-y-4">
            {/* Total Available Minutes */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Total Available Study Time
                </label>
                <span className="font-mono text-xs text-blue-500 font-bold">{validTotalMins} minutes</span>
              </div>
              <input
                type="range"
                min="30"
                max="480"
                step="15"
                value={totalMins}
                onChange={(e) => setTotalMins(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Focus Mins */}
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Focus block
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={focusMins}
                  onChange={(e) => setFocusMins(Number(e.target.value))}
                  className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
                <span className="text-[10px] text-slate-500 block mt-1">Recommended: 25-50m</span>
              </div>

              {/* Break Mins */}
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Short Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={breakMins}
                  onChange={(e) => setBreakMins(Number(e.target.value))}
                  className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
                <span className="text-[10px] text-slate-500 block mt-1">Recommended: 5-10m</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={m3CardBase(isDarkMode)}>
          <h3 className={`text-sm font-semibold mb-4 tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>EXAM SYLLABUS & TIME</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Days Left */}
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Days until Exam
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={daysLeft}
                  onChange={(e) => setDaysLeft(Number(e.target.value))}
                  className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>

              {/* Topics */}
              <div>
                <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Topics/Chapters
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={topicsCount}
                  onChange={(e) => setTopicsCount(Number(e.target.value))}
                  className={`w-full px-3 py-1.5 text-sm rounded-lg font-mono border focus:outline-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-950'
                  }`}
                />
              </div>
            </div>

            {/* Difficulty Mode Selection */}
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Subject Difficulty
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-850 p-1 rounded-xl">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors uppercase ${
                      difficulty === d
                        ? d === 'easy'
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : d === 'medium'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-rose-500 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Metrics */}
      <div className={m3ResultBase(isDarkMode)}>
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

        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
          {mode === 'splitter' ? 'FOCUS TIMELINE PLAN' : 'RECOMMENDED SCHEDULE'}
        </h3>

        {mode === 'splitter' ? (
          <div className="space-y-4">
            <div className="text-center py-2 animate-scale-up">
              <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL CYCLES</span>
              <span className="text-4xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400">
                {cycleCount} Cycles
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-1">
                {validFocusMins}m Focus + {validBreakMins}m Break
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs text-center">
              <div>
                <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Focus Time</span>
                <span className="text-sm font-bold font-mono text-emerald-500 block mt-1">
                  {totalStudyMins} mins
                </span>
              </div>
              <div>
                <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rest Breaks</span>
                <span className="text-sm font-bold font-mono text-blue-500 block mt-1">
                  {totalBreakMins} mins
                </span>
              </div>
            </div>

            {/* Visual Timeline Graphics */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800/40 rounded-2xl">
              <span className="text-[10px] font-bold block uppercase text-slate-500 text-center mb-2">Visual Session Timeline</span>
              <div className="flex gap-1 h-3 rounded-full overflow-hidden w-full bg-slate-200 dark:bg-slate-800">
                {Array.from({ length: cycleCount }).map((_, idx) => (
                  <React.Fragment key={idx}>
                    <div className="bg-emerald-500 h-full flex-1" title={`Focus ${idx+1}`} />
                    <div className="bg-blue-400 h-full w-2" title={`Break ${idx+1}`} />
                  </React.Fragment>
                ))}
                {remainderMins > 0 && (
                  <div className="bg-emerald-400/50 h-full" style={{ width: `${(remainderMins / cycleTime) * 10}%` }} title="Remaining Study" />
                )}
              </div>
              <div className="flex justify-between text-[8px] text-slate-400 font-bold px-1 mt-1">
                <span>Start</span>
                <span>{cycleCount} Rounds Completed</span>
                <span>End ({validTotalMins}m)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-2 animate-scale-up">
              <span className={`text-xs block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>DAILY COMMITMENT</span>
              <span className="text-4xl font-extrabold font-display tracking-tight text-blue-600 dark:text-blue-400 animate-pulse">
                {dailyHoursNeeded.toFixed(1)} hrs
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-1">
                Every day for {validDaysLeft} days
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-blue-200 dark:border-blue-900/40 text-xs text-center animate-fade-in">
              <div>
                <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Study Time</span>
                <span className="text-sm font-bold font-mono text-emerald-500 block mt-1">
                  {totalHoursNeeded.toFixed(1)} hours
                </span>
              </div>
              <div>
                <span className={`block font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Time per Topic</span>
                <span className="text-sm font-bold font-mono text-blue-500 block mt-1">
                  {(totalHoursNeeded / validTopicsCount).toFixed(1)} hours
                </span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl text-[11px] text-center font-bold border ${
              difficulty === 'easy'
                ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500'
                : difficulty === 'medium'
                  ? 'bg-amber-500/5 border-amber-500/10 text-amber-500'
                  : 'bg-rose-500/5 border-rose-500/10 text-rose-500'
            }`}>
              {difficulty === 'easy' && '🍀 Comfort Zone: Material seems straightforward. Focus on quick reviews.'}
              {difficulty === 'medium' && '⚡ Regular Pace: Sound preparation required. Do not leave chapters for the last day.'}
              {difficulty === 'hard' && '🔥 High Focus: Demanding materials. Break down topics and take short mock exams.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
