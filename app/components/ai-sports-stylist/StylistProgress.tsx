'use client';

import React from 'react';
import { STYLIST_STEPS, StylistStepId } from './types';

interface StylistProgressProps {
  currentStep: StylistStepId;
  onSelectStep?: (step: StylistStepId) => void;
}

export default function StylistProgress({ currentStep, onSelectStep }: StylistProgressProps) {
  const currentIndex = STYLIST_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 overflow-x-auto no-scrollbar py-1">
      {STYLIST_STEPS.map((step, idx) => {
        const isActive = step.id === currentStep;
        const isPast = idx < currentIndex;

        return (
          <div key={step.id} className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            <button
              type="button"
              onClick={() => onSelectStep && onSelectStep(step.id)}
              disabled={idx > currentIndex + 1}
              className={`group flex items-center gap-1.5 text-xs md:text-sm font-extrabold tracking-wider uppercase transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'text-gray-950 cursor-default'
                  : isPast
                  ? 'text-gray-700 hover:text-gray-950 cursor-pointer'
                  : 'text-gray-500 cursor-not-allowed opacity-75'
              }`}
            >
              <span
                className={`font-mono font-black ${
                  isActive ? 'text-[#f30d29]' : isPast ? 'text-gray-700' : 'text-gray-500'
                }`}
              >
                {step.stepNumber}
              </span>
              <span className="relative pb-1 font-bold">
                {step.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#f30d29] rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f30d29] -mt-0.5" />
                  </span>
                )}
              </span>
            </button>

            {idx < STYLIST_STEPS.length - 1 && (
              <span className="text-gray-300 font-light select-none text-xs mx-1">/</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
