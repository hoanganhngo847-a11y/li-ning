'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BodyProfile, StylistStepId } from './types';
import StylistProgress from './StylistProgress';
import BodyProfileStep from './BodyProfileStep';
import Avatar3DViewer from './Avatar3DViewer';

interface StylistConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StylistConfigurator({ isOpen, onClose }: StylistConfiguratorProps) {
  const [currentStep, setCurrentStep] = useState<StylistStepId>('body');
  const [activeHoverRegion, setActiveHoverRegion] = useState<'none' | 'chest' | 'waist' | 'hips' | 'all'>('none');

  const [profile, setProfile] = useState<BodyProfile>({
    gender: 'male',
    height: 175,
    weight: 76,
    chest: 104,
    waist: 78,
    hips: 96,
    bodyType: 'muscular',
    isCustomized: false,
  });

  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleProfileChange = (updated: Partial<BodyProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleContinue = () => {
    if (currentStep === 'body') {
      setCurrentStep('sport');
    }
  };

  const handleSelectStep = (step: StylistStepId) => {
    setCurrentStep(step);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Dark/Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fadeIn"
      />

      {/* Large Configurator Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full md:w-[82vw] max-w-[1280px] h-[95vh] md:h-[88vh] max-h-[880px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-5 md:px-8 py-4 border-b border-gray-200 bg-white gap-3 md:gap-4 shrink-0">
          {/* Left Title & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f30d29] text-white flex items-center justify-center font-black text-sm shadow-sm">
              LN
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black tracking-tight uppercase text-gray-950 flex items-center gap-2">
                AI SPORTS STYLIST
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 bg-red-50 text-[#f30d29] rounded border border-red-100 uppercase tracking-widest">
                  Fitting Room
                </span>
              </h2>
              <p className="text-[11px] md:text-xs text-gray-500 font-medium">
                Find your perfect performance look
              </p>
            </div>
          </div>

          {/* Center Progress Indicator */}
          <div className="order-3 md:order-2 self-center md:self-auto w-full md:w-auto">
            <StylistProgress currentStep={currentStep} onSelectStep={handleSelectStep} />
          </div>

          {/* Right Close Button */}
          <div className="order-2 md:order-3 absolute md:static top-4 right-4 flex items-center">
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-white">
          {currentStep === 'body' ? (
            /* 2-Column Desktop Grid / Responsive Stacking on Mobile */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
              {/* Left Panel (~35% -> 5 cols on 12-col grid) */}
              <div className="lg:col-span-5 xl:col-span-4 order-2 lg:order-1 flex flex-col justify-between bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-2xs">
                <BodyProfileStep
                  profile={profile}
                  onChange={handleProfileChange}
                  onContinue={handleContinue}
                  onHoverRegion={setActiveHoverRegion}
                />
              </div>

              {/* Right Panel (~65% -> 7 or 8 cols on 12-col grid) */}
              <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2 flex items-center justify-center h-[380px] sm:h-[450px] lg:h-full min-h-[360px]">
                <Avatar3DViewer profile={profile} activeHoverRegion={activeHoverRegion} />
              </div>
            </div>
          ) : (
            /* Step 2 (SPORT), Step 3 (STYLE), Step 4 (OUTFIT) Placeholders */
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#f30d29] flex items-center justify-center font-bold text-xl mb-4 border border-red-100 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">
                {currentStep.toUpperCase()} PREFERENCES
              </h3>
              <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
                Sport preferences and tailored recommendations will be added in the next phase.
              </p>
              <button
                type="button"
                onClick={() => setCurrentStep('body')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gray-950 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Body Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
