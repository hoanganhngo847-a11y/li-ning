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
    <div className="flex items-center justify-start md:justify-center gap-2 md:gap-8 overflow-x-auto no-scrollbar py-1">
      {STYLIST_STEPS.map((step, idx) => {
        const isActive = step.id === currentStep;
        const isPast = idx < currentIndex;

        return (
          <div key={step.id} className="flex items-center gap-2 md:gap-8 shrink-0">
            <button
              type="button"
              onClick={() => onSelectStep && onSelectStep(step.id)}
              disabled={idx > currentIndex + 1}
              className={`group flex items-center gap-2 text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-200 ${
                isActive
                  ? 'text-gray-950 font-black cursor-default'
                  : isPast
                  ? 'text-gray-600 hover:text-gray-900 cursor-pointer'
                  : 'text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              <span
                className={`flex items-center justify-center text-[10px] md:text-xs font-mono font-bold transition-colors ${
                  isActive
                    ? 'text-[#f30d29]'
                    : isPast
                    ? 'text-gray-700 group-hover:text-gray-950'
                    : 'text-gray-400'
                }`}
              >
                {step.stepNumber}
              </span>
              <span className="relative pb-1">
                {step.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f30d29] rounded-full" />
                )}
              </span>
            </button>

            {idx < STYLIST_STEPS.length - 1 && (
              <span className="text-gray-300 select-none text-xs">/</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
