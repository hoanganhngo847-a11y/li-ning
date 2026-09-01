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
        height: profile.height,
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
      isCustomized: true,
    });
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-4">
      {/* 1. Header & Description */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-gray-950 tracking-tight uppercase">
            THÔNG SỐ VÓC DÁNG
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            {profile.isCustomized ? 'ĐÃ TÙY CHỈNH' : 'CHUẨN CƠ BẢN'}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-gray-500 leading-snug">
          Tùy chỉnh chiều cao, cân nặng và số đo 3 vòng.<br />
          Các vùng cơ thể được tính toán để đưa ra gợi ý chính xác nhất.
        </p>
      </div>

      {/* 2. Scrollable Inputs Section */}
      <div className="space-y-4 overflow-y-auto pr-1 max-h-[calc(88vh-200px)] no-scrollbar">
        {/* GENDER */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-gray-800 mb-1.5">
            GIỚI TÍNH
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleGenderChange('male')}
              className={`py-2 px-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                profile.gender === 'male'
                  ? 'bg-[#f30d29] text-white shadow-sm'
                  : 'bg-[#f8fafc] text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>NAM</span>
              <span className="text-sm">♂</span>
            </button>
            <button
              type="button"
              onClick={() => handleGenderChange('female')}
              className={`py-2 px-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                profile.gender === 'female'
                  ? 'bg-[#f30d29] text-white shadow-sm'
                  : 'bg-[#f8fafc] text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>NỮ</span>
              <span className="text-sm">♀</span>
            </button>
          </div>
        </div>

        {/* DÁNG NGƯỜI CHUẨN (CHỌN NHANH) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-gray-800">
              DÁNG NGƯỜI CHUẨN (CHỌN NHANH)
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
                  className={`p-2.5 text-left rounded-xl border transition-all duration-200 cursor-pointer relative flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-[#f30d29] bg-red-50/50 text-gray-950 ring-1 ring-[#f30d29]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-base">
                    {option.id === 'skinny_fat' && '🧍'}
                    {option.id === 'slim' && '🧍‍♂️'}
                    {option.id === 'muscular' && (
                      <span className={isSelected ? 'text-[#f30d29]' : 'text-gray-700'}>🏋️</span>
                    )}
                    {option.id === 'fat' && '🧍‍♂️'}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className={`text-xs font-bold tracking-tight ${isSelected ? 'text-[#f30d29]' : 'text-gray-900'}`}>
                      {option.label}
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f30d29] text-white flex items-center justify-center text-[10px] font-black">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CHIỀU CAO (CM) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <span>🏃‍♂️</span> CHIỀU CAO (CM)
            </span>
            <span className="font-mono text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-2xs">
              {profile.height} cm
            </span>
          </div>
          <div className="relative pt-1 pb-3">
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
              <span className="text-gray-700 font-bold">{profile.height} cm</span>
              <span>{config.ranges.height.max} cm</span>
            </div>
          </div>
        </div>

        {/* CÂN NẶNG (KG) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
              <span>⚖️</span> CÂN NẶNG (KG)
            </span>
            <span className="font-mono text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-2xs">
              {profile.weight} kg
            </span>
          </div>
          <div className="relative pt-1 pb-3">
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
              <span className="text-gray-700 font-bold">{profile.weight} kg</span>
              <span>{config.ranges.weight.max} kg</span>
            </div>
          </div>
        </div>

        {/* SỐ ĐO 3 VÒNG CỤC BỘ (CM) */}
        <div className="pt-1">
          <label className="block text-[11px] font-black uppercase tracking-wider text-gray-800 mb-2 flex items-center gap-1.5">
            <span>≡</span> SỐ ĐO 3 VÒNG CỰC BỘ (CM)
          </label>

          {/* VÒNG 1 (NGỰC) */}
          <div
            onMouseEnter={() => onHoverRegion && onHoverRegion('chest')}
            onMouseLeave={() => onHoverRegion && onHoverRegion('none')}
            className="mb-3"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f30d29]" />
                VÒNG 1 (NGỰC)
              </span>
              <span className="font-mono text-xs font-bold text-gray-900 bg-white px-2.5 py-0.5 rounded border border-gray-200">
                {profile.chest} cm
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
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-0.5">
              <span>{config.ranges.chest.min} cm</span>
              <span className="text-gray-700 font-medium">{profile.chest} cm</span>
              <span>{config.ranges.chest.max} cm</span>
            </div>
          </div>

          {/* VÒNG 2 (EO) */}
          <div
            onMouseEnter={() => onHoverRegion && onHoverRegion('waist')}
            onMouseLeave={() => onHoverRegion && onHoverRegion('none')}
            className="mb-3"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                VÒNG 2 (EO)
              </span>
              <span className="font-mono text-xs font-bold text-gray-900 bg-white px-2.5 py-0.5 rounded border border-gray-200">
                {profile.waist} cm
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
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-0.5">
              <span>{config.ranges.waist.min} cm</span>
              <span className="text-gray-700 font-medium">{profile.waist} cm</span>
              <span>{config.ranges.waist.max} cm</span>
            </div>
          </div>

          {/* VÒNG 3 (HÔNG) */}
          <div
            onMouseEnter={() => onHoverRegion && onHoverRegion('hips')}
            onMouseLeave={() => onHoverRegion && onHoverRegion('none')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                VÒNG 3 (HÔNG)
              </span>
              <span className="font-mono text-xs font-bold text-gray-900 bg-white px-2.5 py-0.5 rounded border border-gray-200">
                {profile.hips} cm
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
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-0.5">
              <span>{config.ranges.hips.min} cm</span>
              <span className="text-gray-700 font-medium">{profile.hips} cm</span>
              <span>{config.ranges.hips.max} cm</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Continue Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-3 px-4 bg-[#f30d29] hover:bg-[#d10b23] text-white font-black text-xs md:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <span>TIẾP TỤC BƯỚC 02 (CHỌN MÀU DA)</span>
          <span className="text-base">→</span>
        </button>
      </div>
    </div>
  );
}
