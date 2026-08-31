'use client';

import React from 'react';
import { BodyProfile, BodyType, BODY_TYPE_OPTIONS, Gender } from './types';
import { AVATAR_CONFIG } from '@/app/lib/avatar/avatarConfig';
import { BODY_PRESETS } from '@/app/lib/avatar/bodyPresets';

interface BodyProfileStepProps {
  profile: BodyProfile;
  onChange: (updated: Partial<BodyProfile>) => void;
  onContinue: () => void;
  onHoverRegion?: (region: 'none' | 'chest' | 'waist' | 'hips' | 'all') => void;
}

export default function BodyProfileStep({ profile, onChange, onContinue, onHoverRegion }: BodyProfileStepProps) {
  const config = AVATAR_CONFIG[profile.gender];

  const handleGenderChange = (gender: Gender) => {
    const preset = BODY_PRESETS[gender][profile.bodyType] || BODY_PRESETS[gender].muscular;
    onChange({
      gender,
      height: preset.height,
      weight: preset.weight,
      chest: preset.chest,
      waist: preset.waist,
      hips: preset.hips,
      isCustomized: false,
    });
  };

  const handlePresetSelect = (presetId: BodyType) => {
    const preset = BODY_PRESETS[profile.gender][presetId];
    if (preset) {
      onChange({
        bodyType: presetId,
        height: profile.height, // preserve custom height
        weight: preset.weight,
        chest: preset.chest,
        waist: preset.waist,
        hips: preset.hips,
        isCustomized: false,
      });
    }
  };

  const handleSliderChange = (key: keyof BodyProfile, value: number) => {
    onChange({
      [key]: value,
      isCustomized: true, // mark as customized when user manually adjusts
    });
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-4">
      {/* Header & Description */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-950 tracking-tight uppercase">
            THÔNG SỐ VÓC DÁNG
          </h3>
          {profile.isCustomized ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Đã tùy chỉnh
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Chuẩn {BODY_PRESETS[profile.gender][profile.bodyType]?.label || profile.bodyType}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
          Tùy chỉnh chiều cao, cân nặng và số đo 3 vòng. Các vùng cơ thể biến dạng cục bộ độc lập, chính xác.
        </p>
      </div>

      {/* Inputs Section */}
      <div className="space-y-3.5 overflow-y-auto pr-1 max-h-[calc(88vh-220px)] no-scrollbar">
        {/* 1. GENDER */}
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
            Giới tính
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['male', 'female'] as Gender[]).map((g) => {
              const isSelected = profile.gender === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderChange(g)}
                  className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 cursor-pointer text-center ${
                    isSelected
                      ? 'bg-gray-950 text-white border-gray-950 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {g === 'male' ? 'Nam' : 'Nữ'}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. BODY PRESETS (Quick Presets) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700">
              Dáng người chuẩn (Chọn nhanh)
            </label>
            <span className="text-[10px] text-gray-400">Chọn để điền nhanh</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {BODY_TYPE_OPTIONS.map((option) => {
              const isSelected = profile.bodyType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handlePresetSelect(option.id)}
                  className={`p-2.5 text-left rounded-xl border transition-all duration-200 cursor-pointer relative ${
                    isSelected
                      ? 'border-[#f30d29] bg-red-50/40 text-gray-950 ring-1 ring-[#f30d29]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-tight">{option.label}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#f30d29]" />}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. GLOBAL: HEIGHT SLIDER */}
        <div className="bg-gray-50/90 p-3 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Chiều cao (Toàn thân)
            </span>
            <span className="font-mono text-xs font-black text-gray-950 bg-white px-2.5 py-0.5 rounded-md border border-gray-200 shadow-2xs">
              {profile.height} <span className="text-[10px] font-semibold text-gray-500">cm</span>
            </span>
          </div>
          <input
            type="range"
            min={config.ranges.height.min}
            max={config.ranges.height.max}
            step={config.ranges.height.step}
            value={profile.height}
            onChange={(e) => handleSliderChange('height', Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f30d29]"
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
            <span>{config.ranges.height.min} cm</span>
            <span>{config.ranges.height.default} cm</span>
            <span>{config.ranges.height.max} cm</span>
          </div>
        </div>

        {/* 4. GLOBAL: WEIGHT SLIDER */}
        <div className="bg-gray-50/90 p-3 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Cân nặng (Khối lượng cơ thể)
            </span>
            <span className="font-mono text-xs font-black text-gray-950 bg-white px-2.5 py-0.5 rounded-md border border-gray-200 shadow-2xs">
              {profile.weight} <span className="text-[10px] font-semibold text-gray-500">kg</span>
            </span>
          </div>
          <input
            type="range"
            min={config.ranges.weight.min}
            max={config.ranges.weight.max}
            step={config.ranges.weight.step}
            value={profile.weight}
            onChange={(e) => handleSliderChange('weight', Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f30d29]"
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
            <span>{config.ranges.weight.min} kg</span>
            <span>{config.ranges.weight.default} kg</span>
            <span>{config.ranges.weight.max} kg</span>
          </div>
        </div>

        {/* 5. LOCAL MEASUREMENTS (Strictly isolated anatomical regions) */}
        <div className="border-t border-gray-200/90 pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#f30d29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              Số đo 3 vòng cục bộ (Độc lập)
            </label>
            <span className="text-[10px] text-gray-400">Không làm to toàn thân</span>
          </div>

          {/* VÒNG 1 - CHEST / BUST */}
          <div
            className="bg-gray-50/90 p-3 rounded-xl border border-gray-100 transition-colors hover:border-red-200"
            onMouseEnter={() => onHoverRegion?.('chest')}
            onMouseLeave={() => onHoverRegion?.('none')}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f30d29]" />
                Vòng 1 (Vòng ngực)
              </span>
              <span className="font-mono text-xs font-black text-gray-950 bg-white px-2.5 py-0.5 rounded-md border border-gray-200 shadow-2xs">
                {profile.chest} <span className="text-[10px] font-semibold text-gray-500">cm</span>
              </span>
            </div>
            <input
              type="range"
              min={config.ranges.chest.min}
              max={config.ranges.chest.max}
              step={config.ranges.chest.step}
              value={profile.chest}
              onChange={(e) => handleSliderChange('chest', Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f30d29]"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
              <span>{config.ranges.chest.min} cm</span>
              <span>{config.ranges.chest.default} cm</span>
              <span>{config.ranges.chest.max} cm</span>
            </div>
          </div>

          {/* VÒNG 2 - WAIST */}
          <div
            className="bg-gray-50/90 p-3 rounded-xl border border-gray-100 transition-colors hover:border-amber-200"
            onMouseEnter={() => onHoverRegion?.('waist')}
            onMouseLeave={() => onHoverRegion?.('none')}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Vòng 2 (Vòng eo)
              </span>
              <span className="font-mono text-xs font-black text-gray-950 bg-white px-2.5 py-0.5 rounded-md border border-gray-200 shadow-2xs">
                {profile.waist} <span className="text-[10px] font-semibold text-gray-500">cm</span>
              </span>
            </div>
            <input
              type="range"
              min={config.ranges.waist.min}
              max={config.ranges.waist.max}
              step={config.ranges.waist.step}
              value={profile.waist}
              onChange={(e) => handleSliderChange('waist', Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f30d29]"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
              <span>{config.ranges.waist.min} cm</span>
              <span>{config.ranges.waist.default} cm</span>
              <span>{config.ranges.waist.max} cm</span>
            </div>
          </div>

          {/* VÒNG 3 - HIPS */}
          <div
            className="bg-gray-50/90 p-3 rounded-xl border border-gray-100 transition-colors hover:border-emerald-200"
            onMouseEnter={() => onHoverRegion?.('hips')}
            onMouseLeave={() => onHoverRegion?.('none')}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Vòng 3 (Vòng hông)
              </span>
              <span className="font-mono text-xs font-black text-gray-950 bg-white px-2.5 py-0.5 rounded-md border border-gray-200 shadow-2xs">
                {profile.hips} <span className="text-[10px] font-semibold text-gray-500">cm</span>
              </span>
            </div>
            <input
              type="range"
              min={config.ranges.hips.min}
              max={config.ranges.hips.max}
              step={config.ranges.hips.step}
              value={profile.hips}
              onChange={(e) => handleSliderChange('hips', Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f30d29]"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
              <span>{config.ranges.hips.min} cm</span>
              <span>{config.ranges.hips.default} cm</span>
              <span>{config.ranges.hips.max} cm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 bg-[#f30d29] hover:bg-[#d10b23] text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.99]"
        >
          <span>TIẾP TỤC BƯỚC 02 (CHỌN MÔN THỂ THAO)</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
