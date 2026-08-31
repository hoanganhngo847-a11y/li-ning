'use client';

import React from 'react';
import { SPORT_OPTIONS, SportOption } from './types';

interface SportSelectionStepProps {
  selectedSport: string;
  onSportChange: (sportId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function SportSelectionStep({
  selectedSport,
  onSportChange,
  onContinue,
  onBack,
}: SportSelectionStepProps) {
  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-950 tracking-tight uppercase">
            CHỌN MÔN THỂ THAO
          </h3>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-[#f30d29] border border-red-200">
            Bước 03/04
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
          Chọn bộ môn thể thao chính để AI đề xuất trang phục và giày thi đấu tối ưu nhất cho bạn.
        </p>
      </div>

      {/* Sports Cards Grid */}
      <div className="space-y-2.5 overflow-y-auto pr-1 max-h-[calc(88vh-220px)] no-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SPORT_OPTIONS.map((sport) => {
            const isSelected = sport.id === selectedSport;
            return (
              <button
                key={sport.id}
                type="button"
                onClick={() => onSportChange(sport.id)}
                className={`p-3.5 text-left rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#f30d29] bg-red-50/40 text-gray-950 ring-2 ring-[#f30d29] shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{sport.icon}</span>
                    <div>
                      <div className="text-sm font-black tracking-tight text-gray-950 uppercase">
                        {sport.name}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#f30d29]">
                        {sport.badge}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#f30d29] text-white flex items-center justify-center shadow-2xs">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {sport.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>QUAY LẠI</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="w-2/3 py-3.5 px-6 rounded-xl bg-[#f30d29] hover:bg-[#d10b23] text-white font-black text-xs md:text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(243,13,41,0.35)] hover:shadow-[0_6px_25px_rgba(243,13,41,0.5)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
        >
          <span>TIẾP TỤC BƯỚC 04 (GỢI Ý TRANG PHỤC)</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
