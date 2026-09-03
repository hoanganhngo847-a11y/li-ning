'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BodyProfile, StylistStepId, FittedItem, FittingState } from './types';
import StylistProgress from './StylistProgress';
import BodyProfileStep from './BodyProfileStep';
import SkinToneStep from './SkinToneStep';
import SportSelectionStep from './SportSelectionStep';
import OutfitRecommendationStep from './OutfitRecommendationStep';
import Avatar3DViewer from './Avatar3DViewer';
import type { Product } from '@/app/lib/types';
import { getProduct3DConfig } from '@/app/lib/avatar/product3DRegistry';

interface StylistConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
}

export default function StylistConfigurator({
  isOpen,
  onClose,
  initialProduct = null,
}: StylistConfiguratorProps) {
  const [currentStep, setCurrentStep] = useState<StylistStepId>('body');
  const [activeHoverRegion, setActiveHoverRegion] = useState<'none' | 'chest' | 'waist' | 'hips' | 'all'>('none');

  // Step 1: Body Profile
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

  // Step 2: Skin Tone
  const [skinTone, setSkinTone] = useState<string>('#e6b8a2');

  // Step 3: Sport Category
  const [selectedSport, setSelectedSport] = useState<string>('badminton');

  // Step 4: 3D Fitted Apparel
  const [fittingState, setFittingState] = useState<FittingState>({
    top: null,
    bottom: null,
    shoes: null,
  });

  // Automatically pre-equip product if opened with initialProduct
  useEffect(() => {
    if (isOpen && initialProduct) {
      setCurrentStep('outfit');
      const config3D = getProduct3DConfig(initialProduct.sku, initialProduct.handle);
      const colorHex = initialProduct.colorHex || '#ffffff';

      if (config3D?.type === 'outfit' || initialProduct.title.toLowerCase().includes('bộ quần áo')) {
        setFittingState((prev) => ({
          ...prev,
          top: {
            product: initialProduct,
            size: 'L',
            colorHex,
            category: 'top',
            exactModelUrl: config3D?.garments.top?.modelUrl || initialProduct.model3dTop,
          },
          bottom: {
            product: initialProduct,
            size: 'L',
            colorHex,
            category: 'bottom',
            exactModelUrl: config3D?.garments.bottom?.modelUrl || initialProduct.model3dBottom,
          },
        }));
      } else {
        const cat = initialProduct.handle.includes('quan') ? 'bottom' : 'top';
        setFittingState((prev) => ({
          ...prev,
          [cat]: {
            product: initialProduct,
            size: 'L',
            colorHex,
            category: cat,
            exactModelUrl: initialProduct.model3d,
          },
        }));
      }
    }
  }, [isOpen, initialProduct]);

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

  const handleSelectStep = (step: StylistStepId) => {
    setCurrentStep(step);
  };

  const handleEquipItem = (item: FittedItem) => {
    setFittingState((prev) => ({
      ...prev,
      [item.category]: item,
    }));
  };

  const handleEquipOutfit = (outfit: { top: FittedItem; bottom: FittedItem }) => {
    setFittingState((prev) => ({
      ...prev,
      top: outfit.top,
      bottom: outfit.bottom,
    }));
  };

  const handleUnequipItem = (category: 'top' | 'bottom') => {
    setFittingState((prev) => ({
      ...prev,
      [category]: null,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Dark/Blurred Backdrop covering entire website header and body */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
      />

      {/* Large Configurator Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full md:w-[92vw] max-w-[1400px] h-[96vh] md:h-[92vh] max-h-[940px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3.5 border-b border-gray-100 bg-white gap-3 md:gap-6 shrink-0">
          {/* Left Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#f30d29] text-white flex items-center justify-center font-black text-xs shadow-sm">
              LN
            </div>
            <div>
              <h2 className="text-xs sm:text-sm md:text-base font-black tracking-tight uppercase text-gray-950">
                TƯ VẤN TRANG PHỤC AI & PHÒNG THỬ ĐỒ 3D
              </h2>
              <p className="text-[10px] md:text-[11px] text-gray-400 font-medium hidden md:block">
                Cá nhân hóa trang phục theo vóc dáng của bạn • Hỗ trợ mô hình 3D chuẩn xác
              </p>
            </div>
          </div>

          {/* Center Progress Indicator */}
          <div className="flex-1 flex justify-center px-1 sm:px-3 overflow-x-auto no-scrollbar">
            <StylistProgress currentStep={currentStep} onSelectStep={handleSelectStep} />
          </div>

          {/* Right Close Button */}
          <div className="flex items-center shrink-0">
            <button
              onClick={onClose}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Main Body (2-Column Layout) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full min-h-[500px]">
            {/* Left Interactive Control Panel (5 cols on 12-col grid) */}
            <div className="lg:col-span-5 xl:col-span-5 order-2 lg:order-1 flex flex-col justify-between bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 md:p-6 shadow-sm">
              {currentStep === 'body' && (
                <BodyProfileStep
                  profile={profile}
                  onChange={handleProfileChange}
                  onContinue={() => setCurrentStep('skin_tone')}
                  onHoverRegion={setActiveHoverRegion}
                />
              )}

              {currentStep === 'skin_tone' && (
                <SkinToneStep
                  selectedSkinTone={skinTone}
                  onSkinToneChange={setSkinTone}
                  onContinue={() => setCurrentStep('sport')}
                  onBack={() => setCurrentStep('body')}
                />
              )}

              {currentStep === 'sport' && (
                <SportSelectionStep
                  selectedSport={selectedSport}
                  onSportChange={setSelectedSport}
                  onContinue={() => setCurrentStep('outfit')}
                  onBack={() => setCurrentStep('skin_tone')}
                />
              )}

              {currentStep === 'outfit' && (
                <OutfitRecommendationStep
                  profile={profile}
                  selectedSkinTone={skinTone}
                  selectedSport={selectedSport}
                  fittingState={fittingState}
                  onEquipItem={handleEquipItem}
                  onEquipOutfit={handleEquipOutfit}
                  onUnequipItem={handleUnequipItem}
                  onBack={() => setCurrentStep('sport')}
                  onClose={onClose}
                />
              )}
            </div>

            {/* Right 3D Avatar Canvas Panel (7 cols on 12-col grid) */}
            <div className="lg:col-span-7 xl:col-span-7 order-1 lg:order-2 flex items-center justify-center h-[380px] sm:h-[450px] lg:h-full min-h-[360px]">
              <Avatar3DViewer
                profile={profile}
                skinTone={skinTone}
                fittingState={fittingState}
                activeHoverRegion={activeHoverRegion}
                showGuides={currentStep === 'body'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
