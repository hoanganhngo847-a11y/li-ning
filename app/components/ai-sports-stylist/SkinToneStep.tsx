'use client';

import React from 'react';
import { SKIN_TONE_PRESETS, SkinTonePreset } from './types';

interface SkinToneStepProps {
  selectedSkinTone: string;
  onSkinToneChange: (hex: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

// Spectrum gradient color stops for continuous slider
const SPECTRUM_COLORS = [
  '#fcefe8',
  '#f8d8c8',
  '#eec1a8',
  '#e6b8a2',
  '#dea88d',
  '#d89b7d',
  '#c98966',
  '#c48360',
  '#ad6f4e',
  '#9e6347',
  '#824e36',
  '#683d29',
];

export default function SkinToneStep({
  selectedSkinTone,
  onSkinToneChange,
  onContinue,
  onBack,
}: SkinToneStepProps) {
  // Find matching preset or default to natural
  const currentPreset =
    SKIN_TONE_PRESETS.find(
      (p) => p.hex.toLowerCase() === selectedSkinTone.toLowerCase()
    ) || SKIN_TONE_PRESETS[1];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value); // 0 to 100
    const idx = (val / 100) * (SPECTRUM_COLORS.length - 1);
    const low = Math.floor(idx);
    const high = Math.ceil(idx);

    if (low === high) {
      onSkinToneChange(SPECTRUM_COLORS[low]);
    } else {
      // Pick nearest color stop
      const color = (idx - low) < 0.5 ? SPECTRUM_COLORS[low] : SPECTRUM_COLORS[high];
      onSkinToneChange(color);
    }
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-950 tracking-tight uppercase">
            TONE MÀU DA
          </h3>
          <span
            className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs flex items-center gap-1.5"
            style={{
              backgroundColor: `${selectedSkinTone}20`,
              borderColor: selectedSkinTone,
              color: '#111827',
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/20"
              style={{ backgroundColor: selectedSkinTone }}
            />
            {currentPreset.label}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
          Kéo thanh trượt hoặc chọn tone da của bạn. Mô hình 3D sẽ cập nhật sắc da ngay lập tức trong thời gian thực.
        </p>
      </div>

      <div className="space-y-4 overflow-y-auto pr-1 max-h-[calc(88vh-220px)] no-scrollbar">
        {/* 1. CONTINUOUS COLOR SPECTRUM SLIDER */}
        <div className="bg-gray-50/90 p-4 rounded-xl border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Thanh trượt màu da liên tục
            </label>
            <span className="text-[11px] font-mono font-bold text-gray-900 uppercase">
              {selectedSkinTone}
            </span>
          </div>

          <div className="relative pt-1 pb-2">
            {/* Gradient Bar Track */}
            <div
              className="h-5 rounded-full border border-gray-300/80 shadow-inner relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(to right, #fcefe8, #f8d8c8, #e6b8a2, #d89b7d, #c48360, #9e6347, #683d29)',
              }}
            />
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="30"
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
            />
          </div>

          <div className="flex justify-between text-[10px] font-medium text-gray-400 uppercase">
            <span>Sáng hồng</span>
            <span>Vàng Á Đông</span>
            <span>Bánh mật</span>
            <span>Ngăm khỏe</span>
          </div>
        </div>

        {/* 2. 6 STANDARD PRESET SWATCHES */}
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-2">
            6 Tone Da Chuẩn Chọn Nhanh
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SKIN_TONE_PRESETS.map((preset) => {
              const isSelected =
                preset.hex.toLowerCase() === selectedSkinTone.toLowerCase();
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSkinToneChange(preset.hex)}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#f30d29] bg-red-50/40 ring-2 ring-[#f30d29] shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-full border border-black/10 shadow-xs mb-1.5 flex items-center justify-center"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-gray-950 drop-shadow-xs"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-gray-900 text-center leading-tight">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. COLOR PALETTE RECOMMENDATION CARD */}
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 rounded-xl border border-gray-800 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#f30d29]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-200">
              GỢI Ý PHỐI MÀU CHO TONE DA {currentPreset.label.toUpperCase()}
            </h4>
          </div>
          <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
            {currentPreset.recommendedPalette.title}:
          </p>

          <div className="grid grid-cols-4 gap-2">
            {currentPreset.recommendedPalette.colors.map((c, i) => (
              <div
                key={i}
                className="flex flex-col items-center bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-xs"
              >
                <div
                  className="w-6 h-6 rounded-md border border-white/20 mb-1 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[10px] text-gray-300 font-medium text-center truncate w-full">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
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
          <span>TIẾP TỤC BƯỚC 03 (MÔN THỂ THAO)</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
