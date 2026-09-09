'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/app/lib/types';
import { mapProductToFitRoomType } from '@/app/lib/fitroom/category-mapper';
import { SkinToneId } from '@/app/lib/fitroom/color-advisor';

export interface CustomerBodyProfile {
  fullName: string;
  age: number | string;
  gender: 'nam' | 'nu';
  height: number | string;
  weight: number | string;
  bust: number | string;
  waist: number | string;
  hips: number | string;
  skinTone?: SkinToneId;
  isCompleted: boolean;
}

interface FitRoomContextType {
  selectedUpper: Product | null;
  selectedLower: Product | null;
  selectedFull: Product | null;
  isModalOpen: boolean;
  openTryOnModal: () => void;
  closeTryOnModal: () => void;
  selectProductForTryOn: (product: Product, openModal?: boolean) => void;
  removeUpperProduct: () => void;
  removeLowerProduct: () => void;
  removeFullProduct: () => void;
  clearSelection: () => void;
  // Customer Body Profile
  customerProfile: CustomerBodyProfile | null;
  customAvatarUrl: string | null;
  isGeneratingAvatar: boolean;
  regenerateAvatar: (force?: boolean, targetProfile?: CustomerBodyProfile) => Promise<void>;
  bodyMetrics: {
    bmi: number;
    bmiCategory: string;
    bodyShape: string;
    skinToneName: string;
    whr?: number;
    bwr?: number;
    hbr?: number;
  } | null;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  saveCustomerProfile: (profile: Omit<CustomerBodyProfile, 'isCompleted'>) => void;
  getSuggestedSize: () => string;
  // FitRoom Try-On Result Synchronization
  tryOnResultUrl: string | null;
  setTryOnResultUrl: (url: string | null) => void;
  tryOnBeforeUrl: string | null;
  setTryOnBeforeUrl: (url: string | null) => void;
}

const FitRoomContext = createContext<FitRoomContextType | undefined>(undefined);

export function FitRoomProvider({ children }: { children: React.ReactNode }) {
  const [selectedUpper, setSelectedUpper] = useState<Product | null>(null);
  const [selectedLower, setSelectedLower] = useState<Product | null>(null);
  const [selectedFull, setSelectedFull] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [customerProfile, setCustomerProfile] = useState<CustomerBodyProfile | null>(null);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState<boolean>(false);
  const [bodyMetrics, setBodyMetrics] = useState<{
    bmi: number;
    bmiCategory: string;
    bodyShape: string;
    skinToneName: string;
    whr?: number;
    bwr?: number;
    hbr?: number;
  } | null>(null);

  const [tryOnResultUrl, setTryOnResultUrlState] = useState<string | null>(null);
  const [tryOnBeforeUrl, setTryOnBeforeUrlState] = useState<string | null>(null);

  const setTryOnResultUrl = (url: string | null) => {
    setTryOnResultUrlState(url);
    try {
      if (url) {
        sessionStorage.setItem('lining_fitroom_last_result', url);
      } else {
        sessionStorage.removeItem('lining_fitroom_last_result');
      }
    } catch {}
  };

  const setTryOnBeforeUrl = (url: string | null) => {
    setTryOnBeforeUrlState(url);
    try {
      if (url) {
        sessionStorage.setItem('lining_fitroom_last_before', url);
      } else {
        sessionStorage.removeItem('lining_fitroom_last_before');
      }
    } catch {}
  };

  // Load profile from localStorage & try-on products from sessionStorage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('lining_customer_profile');
      if (storedProfile) {
        setCustomerProfile(JSON.parse(storedProfile));
      }
      const storedResult = sessionStorage.getItem('lining_fitroom_last_result');
      if (storedResult) {
        setTryOnResultUrlState(storedResult);
      }
      const storedBefore = sessionStorage.getItem('lining_fitroom_last_before');
      if (storedBefore) {
        setTryOnBeforeUrlState(storedBefore);
      }
    } catch {}
  }, []);

  const regenerateAvatar = async (force: boolean = false, targetProfile?: CustomerBodyProfile) => {
    const prof = targetProfile || customerProfile;
    if (!prof) return;
    setIsGeneratingAvatar(true);
    try {
      const res = await fetch('/api/fitroom/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: prof.gender,
          height: prof.height,
          weight: prof.weight,
          bust: prof.bust,
          waist: prof.waist,
          hips: prof.hips,
          skinTone: prof.skinTone || 'medium_asian',
          forceRegenerate: force,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.success && data.avatarUrl) {
          setCustomAvatarUrl(data.avatarUrl);
          setBodyMetrics({
            bmi: data.bmi,
            bmiCategory: data.bmiCategory,
            bodyShape: data.bodyShape,
            skinToneName: data.skinToneName,
            whr: data.whr,
            bwr: data.bwr,
            hbr: data.hbr,
          });
        }
      }
    } catch (err) {
      console.error('Failed to generate avatar for profile:', err);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  // Load any saved try-on products from sessionStorage if available
  useEffect(() => {
    try {
      const storedUpper = sessionStorage.getItem('lining_fitroom_upper');
      const storedLower = sessionStorage.getItem('lining_fitroom_lower');
      const storedFull = sessionStorage.getItem('lining_fitroom_full');
      if (storedUpper) setSelectedUpper(JSON.parse(storedUpper));
      if (storedLower) setSelectedLower(JSON.parse(storedLower));
      if (storedFull) setSelectedFull(JSON.parse(storedFull));
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const openTryOnModal = () => setIsModalOpen(true);
  const closeTryOnModal = () => setIsModalOpen(false);

  const selectProductForTryOn = (product: Product, openModal = true) => {
    if (!product) return;

    const slotType = mapProductToFitRoomType(product);

    if (slotType === 'full_set') {
      setSelectedFull(product);
      setSelectedUpper(null);
      setSelectedLower(null);
      try {
        sessionStorage.setItem('lining_fitroom_full', JSON.stringify(product));
        sessionStorage.removeItem('lining_fitroom_upper');
        sessionStorage.removeItem('lining_fitroom_lower');
      } catch {}
    } else if (slotType === 'lower') {
      setSelectedLower(product);
      setSelectedFull(null);
      try {
        sessionStorage.setItem('lining_fitroom_lower', JSON.stringify(product));
        sessionStorage.removeItem('lining_fitroom_full');
      } catch {}
    } else {
      // Default to upper
      setSelectedUpper(product);
      setSelectedFull(null);
      try {
        sessionStorage.setItem('lining_fitroom_upper', JSON.stringify(product));
        sessionStorage.removeItem('lining_fitroom_full');
      } catch {}
    }

    if (openModal) {
      setIsModalOpen(true);
    }
  };

  const removeUpperProduct = () => {
    setSelectedUpper(null);
    try {
      sessionStorage.removeItem('lining_fitroom_upper');
    } catch {}
  };

  const removeLowerProduct = () => {
    setSelectedLower(null);
    try {
      sessionStorage.removeItem('lining_fitroom_lower');
    } catch {}
  };

  const removeFullProduct = () => {
    setSelectedFull(null);
    try {
      sessionStorage.removeItem('lining_fitroom_full');
    } catch {}
  };

  const clearSelection = () => {
    setSelectedUpper(null);
    setSelectedLower(null);
    setSelectedFull(null);
    try {
      sessionStorage.removeItem('lining_fitroom_upper');
      sessionStorage.removeItem('lining_fitroom_lower');
      sessionStorage.removeItem('lining_fitroom_full');
    } catch {}
  };

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const saveCustomerProfile = (profile: Omit<CustomerBodyProfile, 'isCompleted'>) => {
    const fullProfile: CustomerBodyProfile = {
      ...profile,
      isCompleted: true,
    };
    setCustomerProfile(fullProfile);
    try {
      localStorage.setItem('lining_customer_profile', JSON.stringify(fullProfile));
    } catch {}
    setIsProfileModalOpen(false);
  };

  const getSuggestedSize = (): string => {
    if (!customerProfile) return 'L';
    const h = Number(customerProfile.height) || 170;
    const w = Number(customerProfile.weight) || 65;

    if (customerProfile.gender === 'nu') {
      if (h <= 155 || w <= 46) return 'S';
      if (h <= 162 && w <= 53) return 'M';
      if (h <= 168 && w <= 60) return 'L';
      return 'XL';
    } else {
      if (h <= 165 || w <= 55) return 'S';
      if (h <= 172 && w <= 65) return 'M';
      if (h <= 178 && w <= 75) return 'L';
      if (h <= 185 && w <= 85) return 'XL';
      return '2XL';
    }
  };

  return (
    <FitRoomContext.Provider
      value={{
        selectedUpper,
        selectedLower,
        selectedFull,
        isModalOpen,
        openTryOnModal,
        closeTryOnModal,
        selectProductForTryOn,
        removeUpperProduct,
        removeLowerProduct,
        removeFullProduct,
        clearSelection,
        customerProfile,
        customAvatarUrl,
        isGeneratingAvatar,
        regenerateAvatar,
        bodyMetrics,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        saveCustomerProfile,
        getSuggestedSize,
        tryOnResultUrl,
        setTryOnResultUrl,
        tryOnBeforeUrl,
        setTryOnBeforeUrl,
      }}
    >
      {children}
    </FitRoomContext.Provider>
  );
}

export function useFitRoom() {
  const context = useContext(FitRoomContext);
  if (!context) {
    throw new Error('useFitRoom must be used within a FitRoomProvider');
  }
  return context;
}
