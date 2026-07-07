/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Battery, Wifi, Signal } from 'lucide-react';
import { motion } from 'motion/react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
  isDarkMode: boolean;
}

export default function AndroidFrame({ children, isPhoneFrame, setIsPhoneFrame, isDarkMode }: AndroidFrameProps) {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneFrame) {
    return (
      <div className="min-h-screen flex flex-col w-full transition-colors duration-300">
        {/* Toggle Bar at top of Web view */}
        <div className={`py-2 px-4 flex justify-between items-center text-xs tracking-wider border-b ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'} font-display`}>
          <div className="font-semibold flex items-center gap-1">
            <span className="text-blue-500">●</span> CALCNOVA WEB PORTAL
          </div>
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 font-medium ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} cursor-pointer`}
          >
            <Smartphone size={14} />
            <span>Switch to Android View</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 px-4 flex flex-col items-center justify-center transition-colors duration-300 overflow-y-auto ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      
      {/* Top Controller */}
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => setIsPhoneFrame(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide shadow-xs transition-all duration-200 ${
            isDarkMode 
              ? 'bg-slate-900 text-slate-200 border border-slate-800 hover:bg-slate-800' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          } cursor-pointer`}
        >
          <Monitor size={14} className="text-blue-500" />
          <span>Switch to Web Layout</span>
        </button>
      </div>

      {/* Phone chassis */}
      <div className="relative mx-auto flex flex-col w-full max-w-[395px] h-[820px] rounded-[52px] border-[12px] bg-black border-neutral-900 shadow-2xl overflow-hidden group select-none">
        
        {/* Notch / Front Camera */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-full z-50 flex items-center justify-between px-4">
          <div className="w-3.5 h-3.5 rounded-full bg-[#111] border border-neutral-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40"></div>
          </div>
          <div className="w-10 h-1 bg-neutral-900 rounded-full"></div>
        </div>

        {/* Dynamic Volume Buttons on Left Side */}
        <div className="absolute -left-[15px] top-[160px] w-1 h-[60px] bg-neutral-800 rounded-l-md border-r border-black z-40"></div>
        <div className="absolute -left-[15px] top-[230px] w-1 h-[60px] bg-neutral-800 rounded-l-md border-r border-black z-40"></div>
        
        {/* Dynamic Power Button on Right Side */}
        <div className="absolute -right-[15px] top-[200px] w-1 h-[80px] bg-neutral-800 rounded-r-md border-l border-black z-40"></div>

        {/* Android Native Status Bar */}
        <div className={`absolute top-0 inset-x-0 h-11 px-6 flex items-end justify-between z-40 pointer-events-none pb-1.5 font-display text-[12px] font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          <div className="ml-2">{time}</div>
          <div className="flex items-center gap-1.5 mr-2">
            <Signal size={13} className="stroke-[2.5]" />
            <span className="text-[10px]">5G</span>
            <Wifi size={13} className="stroke-[2.5]" />
            <Battery size={16} className="stroke-[2.5]" />
          </div>
        </div>

        {/* Main Phone Screens */}
        <div className="flex-1 flex flex-col h-full overflow-hidden pt-11 pb-6 relative">
          {children}
        </div>

        {/* Android Gesture Navigation Pill at Bottom */}
        <div className="absolute bottom-1 inset-x-0 h-4 flex items-center justify-center z-40 pointer-events-none">
          <div className="w-28 h-1 bg-neutral-600 rounded-full"></div>
        </div>

      </div>
    </div>
  );
}
