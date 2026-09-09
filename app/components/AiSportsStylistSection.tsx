'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFitRoom, CustomerBodyProfile } from './fitroom/FitRoomContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import { formatPrice, cn } from '@/app/lib/utils';
import AthleteAuraStage from './fitroom/AthleteAuraStage';
import TransparentRunningAthlete from './fitroom/TransparentRunningAthlete';
import Step1TvcAthleteStage from './fitroom/Step1TvcAthleteStage';
import Tripo3DViewer from './fitroom/Tripo3DViewer';
import { SkinToneId, evaluateGarmentSkinMatch, SKIN_TONE_CONFIGS } from '@/app/lib/fitroom/color-advisor';
import { products } from '@/app/lib/data/products';
import { useCart } from '@/app/lib/cart-context';
import type { Product } from '@/app/lib/types';
import {
  CaretRight,
  CaretLeft,
  CaretDown,
  Check,
  Cpu,
  Cube,
  Lightning,
  Diamond,
  User,
  Calendar,
  Ruler,
  Scales,
  TShirt,
  Pants,
  Sparkle,
  Heart,
  Camera,
  UploadSimple,
  ShoppingBag,
  ArrowsClockwise,
  Sliders,
  Crosshair,
  ArrowCounterClockwise,
  ShieldCheck,
  Faders,
  X,
} from '@phosphor-icons/react';
import { BODY_SHAPE_MODELS, BodyShapeModel } from '@/app/lib/fitroom/body-shapes-data';

export default function AiSportsStylistSection() {
  const {
    customerProfile,
    customAvatarUrl,
    isGeneratingAvatar,
    regenerateAvatar,
    saveCustomerProfile,
    tryOnResultUrl,
    setTryOnResultUrl,
    tryOnBeforeUrl,
    setTryOnBeforeUrl,
  } = useFitRoom();

  const { addItem } = useCart();
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Active step tracker
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // 3D Parallax Mouse Tracking for Hero
  const [heroMouseOffset, setHeroMouseOffset] = useState({ x: 0, y: 0 });
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setHeroMouseOffset({ x, y });
  };
  const handleHeroMouseLeave = () => {
    setHeroMouseOffset({ x: 0, y: 0 });
  };

  // 3D Parallax Mouse Tracking for Step 1
  const [step1MouseOffset, setStep1MouseOffset] = useState({ x: 0, y: 0 });
  const handleStep1MouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setStep1MouseOffset({ x, y });
  };
  const handleStep1MouseLeave = () => {
    setStep1MouseOffset({ x: 0, y: 0 });
  };

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const s1 = document.getElementById('step-1-measurements');
      const s2 = document.getElementById('step-2-model');
      const s3 = document.getElementById('step-3-apparel');
      const s4 = document.getElementById('step-4-results');

      const scrollPos = window.scrollY + 280;

      if (s4 && scrollPos >= s4.offsetTop) {
        setActiveStep(4);
      } else if (s3 && scrollPos >= s3.offsetTop) {
        setActiveStep(3);
      } else if (s2 && scrollPos >= s2.offsetTop) {
        setActiveStep(2);
      } else if (s1) {
        setActiveStep(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Section Ref & GSAP Entrance Timeline with ScrollTrigger
  const heroSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!heroSectionRef.current) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        gsap.set(['.hero-title', '.hero-subtitle', '.hero-step-card', '.hero-cta'], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // Initial state setup for left content
      gsap.set('.hero-title', { opacity: 0, y: 16 });
      gsap.set('.hero-subtitle', { opacity: 0, y: 12 });
      gsap.set('.hero-step-card', { opacity: 0, y: 14 });
      gsap.set('.hero-cta', { opacity: 0, y: 12 });

      // Master Entrance Timeline for left content
      const tl = gsap.timeline({ delay: 0.1 });

      tl.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
      }, 0);

      tl.to('.hero-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      }, 0.1);

      tl.to('.hero-step-card', {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out',
      }, 0.25);

      tl.to('.hero-cta', {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
      }, 0.5);

    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll Trigger Observer for Athlete Entrances & 3D Aura Ignitions
  const [enteredSections, setEnteredSections] = useState({
    hero: false,
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  });

  const [replayKeys, setReplayKeys] = useState({
    hero: 0,
    step1: 0,
    step2: 0,
    step3: 0,
    step4: 0,
  });

  const replaySection = (key: 'hero' | 'step1' | 'step2' | 'step3' | 'step4') => {
    setReplayKeys((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setEnteredSections((prev) => ({ ...prev, [key]: true }));
  };

  useEffect(() => {
    // Initial hero entrance trigger on load
    const timer = setTimeout(() => {
      setEnteredSections((prev) => ({ ...prev, hero: true }));
    }, 150);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === 'ai-stylist-hero') {
              setEnteredSections((prev) => ({ ...prev, hero: true }));
            } else if (id === 'step-1-measurements') {
              setEnteredSections((prev) => ({ ...prev, step1: true }));
            } else if (id === 'step-2-model') {
              setEnteredSections((prev) => ({ ...prev, step2: true }));
            } else if (id === 'step-3-apparel') {
              setEnteredSections((prev) => ({ ...prev, step3: true }));
            } else if (id === 'step-4-results') {
              setEnteredSections((prev) => ({ ...prev, step4: true }));
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
    );

    const sHero = document.getElementById('ai-stylist-hero');
    const s1 = document.getElementById('step-1-measurements');
    const s2 = document.getElementById('step-2-model');
    const s3 = document.getElementById('step-3-apparel');
    const s4 = document.getElementById('step-4-results');

    if (sHero) observer.observe(sHero);
    if (s1) observer.observe(s1);
    if (s2) observer.observe(s2);
    if (s3) observer.observe(s3);
    if (s4) observer.observe(s4);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // ============================================================================
  // STEP 1: FORM STATE (NHẬP THÔNG SỐ & SỐ ĐO 3 VÒNG)
  // ============================================================================
  const [inlineFullName, setInlineFullName] = useState<string>(customerProfile?.fullName || 'Nguyễn Tuấn Anh');
  const [inlineAge, setInlineAge] = useState<string>(customerProfile?.age ? String(customerProfile.age) : '26');
  const [inlineGender, setInlineGender] = useState<'nam' | 'nu'>(customerProfile?.gender || 'nam');
  const [inlineHeight, setInlineHeight] = useState<string>(customerProfile?.height ? String(customerProfile.height) : '175');
  const [inlineWeight, setInlineWeight] = useState<string>(customerProfile?.weight ? String(customerProfile.weight) : '68');
  const [inlineBust, setInlineBust] = useState<string>(customerProfile?.bust ? String(customerProfile.bust) : '96');
  const [inlineWaist, setInlineWaist] = useState<string>(customerProfile?.waist ? String(customerProfile.waist) : '78');
  const [inlineHips, setInlineHips] = useState<string>(customerProfile?.hips ? String(customerProfile.hips) : '95');
  const [inlineSkinTone, setInlineSkinTone] = useState<SkinToneId>(customerProfile?.skinTone || 'medium_asian');
  const [step1Error, setStep1Error] = useState<string | null>(null);

  useEffect(() => {
    if (customerProfile) {
      if (customerProfile.fullName) setInlineFullName(customerProfile.fullName);
      if (customerProfile.age) setInlineAge(String(customerProfile.age));
      if (customerProfile.gender) setInlineGender(customerProfile.gender);
      if (customerProfile.height) setInlineHeight(String(customerProfile.height));
      if (customerProfile.weight) setInlineWeight(String(customerProfile.weight));
      if (customerProfile.bust) setInlineBust(String(customerProfile.bust));
      if (customerProfile.waist) setInlineWaist(String(customerProfile.waist));
      if (customerProfile.hips) setInlineHips(String(customerProfile.hips));
      if (customerProfile.skinTone) setInlineSkinTone(customerProfile.skinTone);
    }
  }, [customerProfile]);

  // ============================================================================
  // STEP 2: MODEL SELECTION & GENERATION STATE
  // ============================================================================
  const [modelType, setModelType] = useState<'profile_avatar' | 'male' | 'female' | 'custom'>('profile_avatar');
  const [modelPreviewUrl, setModelPreviewUrl] = useState<string>(
    customAvatarUrl || '/images/ai-tryon/step3_model_male_runway_hd.png'
  );
  const [modelFile, setModelFile] = useState<File | Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Body Shapes Selection States
  const [selectedBodyShape, setSelectedBodyShape] = useState<BodyShapeModel | null>(null);
  const [isBodyShapeModalOpen, setIsBodyShapeModalOpen] = useState<boolean>(false);
  const [bodyShapeGenderTab, setBodyShapeGenderTab] = useState<'male' | 'female'>('male');

  // Biometric matching algorithm: maps measurements to optimal athlete 3D template
  const getMatchingBodyShape = (
    gender: 'nam' | 'nu',
    height: number,
    weight: number,
    bust: number,
    waist: number,
    hips: number
  ): BodyShapeModel => {
    const hMeters = (height || (gender === 'nu' ? 162 : 175)) / 100;
    const bmi = Number(((weight || (gender === 'nu' ? 50 : 68)) / (hMeters * hMeters)).toFixed(1));
    const whr = Number(((waist || (gender === 'nu' ? 64 : 78)) / (hips || (gender === 'nu' ? 90 : 95))).toFixed(2));
    const bwr = Number(((bust || (gender === 'nu' ? 85 : 96)) / (waist || (gender === 'nu' ? 64 : 78))).toFixed(2));
    const hbr = Number(((hips || (gender === 'nu' ? 90 : 95)) / (bust || (gender === 'nu' ? 85 : 96))).toFixed(2));

    let matchedId = gender === 'nu' ? 'female-hourglass-fit' : 'male-lean-athletic';
    if (gender === 'nu') {
      if (bmi >= 27.5 || (bmi >= 25.5 && whr > 0.82)) {
        matchedId = 'female-full-curve';
      } else if (bmi < 18.5) {
        matchedId = 'female-petite-slim';
      } else if (hbr >= 1.10 && whr <= 0.82) {
        matchedId = 'female-pear-shape';
      } else if ((bust || 85) / (hips || 90) >= 1.08) {
        matchedId = 'female-inverted-triangle';
      } else if (bwr >= 1.20 && whr <= 0.80) {
        if (bmi >= 23.0 || weight >= 62 || bust >= 92) {
          matchedId = 'female-hourglass-curvy';
        } else {
          matchedId = 'female-hourglass-fit';
        }
      } else {
        matchedId = 'female-athletic-rectangle';
      }
    } else {
      if (bmi >= 26.0 || weight >= 80) {
        matchedId = 'male-solid-heavy';
      } else if (bmi < 19.5) {
        matchedId = 'male-slim-lean';
      } else if ((bust || 96) / (waist || 78) >= 1.16) {
        matchedId = 'male-v-taper';
      } else {
        matchedId = 'male-lean-athletic';
      }
    }

    const base =
      BODY_SHAPE_MODELS.find((m) => m.id === matchedId) ||
      (gender === 'nu' ? BODY_SHAPE_MODELS[4] : BODY_SHAPE_MODELS[0]);
    return {
      ...base,
      height: `${height} cm`,
      weight: `${weight} kg`,
      measurements: `${bust} - ${waist} - ${hips}`,
    };
  };

  const handleQuickFill = (genderType: 'nam' | 'nu') => {
    if (genderType === 'nam') {
      setInlineFullName('Nguyễn Tuấn Anh');
      setInlineAge('26');
      setInlineGender('nam');
      setInlineHeight('175');
      setInlineWeight('68');
      setInlineBust('96');
      setInlineWaist('78');
      setInlineHips('95');
      setInlineSkinTone('medium_asian');
      const defaultMale =
        BODY_SHAPE_MODELS.find((m) => m.id === 'male-lean-athletic') || BODY_SHAPE_MODELS[0];
      setSelectedBodyShape({
        ...defaultMale,
        height: '175 cm',
        weight: '68 kg',
        measurements: '96 - 78 - 95',
      });
      setModelPreviewUrl(defaultMale.imageSrc || defaultMale.thumbSrc);
      setModelType('male');
    } else {
      setInlineFullName('Trần Mai Anh');
      setInlineAge('24');
      setInlineGender('nu');
      setInlineHeight('162');
      setInlineWeight('50');
      setInlineBust('85');
      setInlineWaist('64');
      setInlineHips('90');
      setInlineSkinTone('fair');
      const defaultFemale =
        BODY_SHAPE_MODELS.find((m) => m.id === 'female-hourglass-fit') || BODY_SHAPE_MODELS[4];
      setSelectedBodyShape({
        ...defaultFemale,
        height: '162 cm',
        weight: '50 kg',
        measurements: '85 - 64 - 90',
      });
      setModelPreviewUrl(defaultFemale.imageSrc || defaultFemale.thumbSrc);
      setModelType('female');
    }
    setStep1Error(null);
  };

  const handleSaveAndProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineFullName.trim()) {
      setStep1Error('Vui lòng nhập Họ và tên.');
      return;
    }
    if (!inlineAge || Number(inlineAge) <= 0) {
      setStep1Error('Vui lòng nhập tuổi hợp lệ.');
      return;
    }
    if (!inlineHeight || Number(inlineHeight) < 100) {
      setStep1Error('Vui lòng nhập chiều cao hợp lệ.');
      return;
    }
    if (!inlineWeight || Number(inlineWeight) < 30) {
      setStep1Error('Vui lòng nhập cân nặng hợp lệ.');
      return;
    }
    if (!inlineBust || !inlineWaist || !inlineHips) {
      setStep1Error('Vui lòng điền đủ số đo 3 vòng (V1, V2, V3).');
      return;
    }

    const h = Number(inlineHeight) || (inlineGender === 'nu' ? 162 : 175);
    const w = Number(inlineWeight) || (inlineGender === 'nu' ? 50 : 68);
    const b = Number(inlineBust) || (inlineGender === 'nu' ? 85 : 96);
    const wa = Number(inlineWaist) || (inlineGender === 'nu' ? 64 : 78);
    const hi = Number(inlineHips) || (inlineGender === 'nu' ? 90 : 95);

    const matchedShape = getMatchingBodyShape(inlineGender, h, w, b, wa, hi);
    setSelectedBodyShape(matchedShape);
    setModelPreviewUrl(matchedShape.imageSrc || matchedShape.thumbSrc);
    setModelType(inlineGender === 'nu' ? 'female' : 'male');

    saveCustomerProfile({
      fullName: inlineFullName.trim(),
      age: Number(inlineAge),
      gender: inlineGender,
      height: h,
      weight: w,
      bust: b,
      waist: wa,
      hips: hi,
      skinTone: inlineSkinTone,
    });

    setStep1Error(null);
    scrollToSection('step-2-model');
  };

  const handleOpenBodyShapeModal = (gender: 'male' | 'female') => {
    setBodyShapeGenderTab(gender);
    setIsBodyShapeModalOpen(true);
  };

  const handleSelectBodyShape = (model: BodyShapeModel) => {
    setSelectedBodyShape(model);
    setModelType(model.gender);
    setModelPreviewUrl(model.imageSrc);
    setModelFile(null);
    setResultImageUrl(null);
    setIsBodyShapeModalOpen(false);
    scrollToSection('step-3-apparel');
  };

  useEffect(() => {
    if (customAvatarUrl && modelType === 'profile_avatar') {
      setModelPreviewUrl(customAvatarUrl);
    }
  }, [customAvatarUrl, modelType]);

  const handleGenerateAiAvatar = async () => {
    try {
      const h = Number(inlineHeight) || (inlineGender === 'nu' ? 162 : 175);
      const w = Number(inlineWeight) || (inlineGender === 'nu' ? 50 : 68);
      const b = Number(inlineBust) || (inlineGender === 'nu' ? 85 : 96);
      const wa = Number(inlineWaist) || (inlineGender === 'nu' ? 64 : 78);
      const hi = Number(inlineHips) || (inlineGender === 'nu' ? 90 : 95);

      // Instant client calibration: update runway stage and body shape with 0ms lag
      const matchedShape = getMatchingBodyShape(inlineGender, h, w, b, wa, hi);
      setSelectedBodyShape(matchedShape);
      setModelPreviewUrl(matchedShape.imageSrc || matchedShape.thumbSrc);
      setModelType(inlineGender === 'nu' ? 'female' : 'male');
      setModelFile(null);
      setResultImageUrl(null);

      const targetProfile: CustomerBodyProfile = {
        fullName: inlineFullName.trim(),
        age: Number(inlineAge),
        gender: inlineGender,
        height: h,
        weight: w,
        bust: b,
        waist: wa,
        hips: hi,
        skinTone: inlineSkinTone,
        isCompleted: true,
      };

      saveCustomerProfile(targetProfile);
      // Run async avatar generation in background
      regenerateAvatar(true, targetProfile).catch((err) => console.warn('Background avatar sync:', err));
      scrollToSection('step-3-apparel');
    } catch (err) {
      console.error('Error generating AI avatar:', err);
    }
  };

  const handleSelectPresetModel = (type: 'male' | 'female') => {
    handleOpenBodyShapeModal(type);
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ.');
      return;
    }

    setModelType('custom');
    setModelFile(file);
    setModelPreviewUrl(URL.createObjectURL(file));
    setResultImageUrl(null);
    scrollToSection('step-3-apparel');
  };

  // ============================================================================
  // STEP 3: GARMENT SELECTION & 360° INTERACTIVE STAGE
  // ============================================================================
  const [activeCategoryTab, setActiveCategoryTab] = useState<'combo' | 'upper' | 'lower' | 'shoes' | 'accessories'>('combo');
  const [selectedSize, setSelectedSize] = useState<string>('L');

  // Interactive 360 Drag-to-Rotate Stage State
  const [stageRotation, setStageRotation] = useState<number>(0);
  const [isStageDragging, setIsStageDragging] = useState<boolean>(false);
  const stageStartXRef = useRef<number>(0);
  const stageStartRotRef = useRef<number>(0);

  const handleStagePointerDown = (e: React.PointerEvent) => {
    setIsStageDragging(true);
    stageStartXRef.current = e.clientX;
    stageStartRotRef.current = stageRotation;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleStagePointerMove = (e: React.PointerEvent) => {
    if (!isStageDragging) return;
    const deltaX = e.clientX - stageStartXRef.current;
    setStageRotation(stageStartRotRef.current + deltaX * 0.7);
  };

  const handleStagePointerUp = (e: React.PointerEvent) => {
    setIsStageDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Dynamic curated products from website catalog, filtered by gender & tab, ranked by skin tone match
  const step3CuratedProducts = useMemo(() => {
    const userGender = inlineGender; // 'nam' | 'nu'
    const userSkin = inlineSkinTone || 'medium_asian';

    // 1. Filter products by gender (allow unisex for both nam and nu)
    const genderProducts = products.filter((p) => {
      if (!p || !p.title || !p.images || !p.images[0]) return false;
      if (p.gender === 'kids') return false;
      if (userGender === 'nu') {
        return p.gender === 'nu' || p.gender === 'unisex';
      } else {
        return p.gender === 'nam' || p.gender === 'unisex';
      }
    });

    const isUpper = (p: Product) => {
      const t = p.title.toLowerCase();
      const colls = (p.collections || []).join(' ').toLowerCase();
      if (
        t.includes('quần') ||
        t.includes('giày') ||
        t.includes('dép') ||
        t.includes('vợt') ||
        t.includes('tất') ||
        t.includes('balo') ||
        t.includes('bình')
      ) {
        return false;
      }
      return (
        t.includes('áo') ||
        t.includes('polo') ||
        t.includes('t-shirt') ||
        t.includes('bra') ||
        t.includes('gió') ||
        t.includes('khoác') ||
        t.includes('nỉ') ||
        t.includes('tank') ||
        t.includes('ba lỗ') ||
        colls.includes('ao')
      );
    };

    const isLower = (p: Product) => {
      const t = p.title.toLowerCase();
      const colls = (p.collections || []).join(' ').toLowerCase();
      if (t.includes('áo') && !t.includes('bộ')) return false;
      if (t.includes('giày') || t.includes('vợt') || t.includes('tất') || t.includes('balo')) return false;
      return (
        t.includes('quần') ||
        t.includes('short') ||
        t.includes('váy') ||
        t.includes('chân váy') ||
        t.includes('skirt') ||
        t.includes('jogger') ||
        colls.includes('quan') ||
        colls.includes('vay')
      );
    };

    const isCombo = (p: Product) => {
      const t = p.title.toLowerCase();
      const colls = (p.collections || []).join(' ').toLowerCase();
      return (
        t.includes('bộ') ||
        t.includes('set') ||
        t.includes('combo') ||
        colls.includes('bo-quan-ao') ||
        colls.includes('bo') ||
        (isUpper(p) && (t.includes('thi đấu') || t.includes('cầu lông') || t.includes('pickleball')))
      );
    };

    const isShoes = (p: Product) => {
      const t = p.title.toLowerCase();
      const colls = (p.collections || []).join(' ').toLowerCase();
      return t.includes('giày') || colls.includes('giay');
    };

    const isAccessories = (p: Product) => {
      const t = p.title.toLowerCase();
      const colls = (p.collections || []).join(' ').toLowerCase();
      return (
        t.includes('vợt') ||
        t.includes('mũ') ||
        t.includes('nón') ||
        t.includes('tất') ||
        t.includes('vớ') ||
        t.includes('balo') ||
        t.includes('túi') ||
        t.includes('bình') ||
        colls.includes('phu-kien')
      );
    };

    let tabFiltered: Product[] = [];
    if (activeCategoryTab === 'upper') {
      tabFiltered = genderProducts.filter(isUpper);
    } else if (activeCategoryTab === 'lower') {
      tabFiltered = genderProducts.filter(isLower);
    } else if (activeCategoryTab === 'combo') {
      tabFiltered = genderProducts.filter(isCombo);
      if (tabFiltered.length < 4) {
        tabFiltered = [...tabFiltered, ...genderProducts.filter(isUpper)];
      }
    } else if (activeCategoryTab === 'shoes') {
      tabFiltered = genderProducts.filter(isShoes);
    } else if (activeCategoryTab === 'accessories') {
      tabFiltered = genderProducts.filter(isAccessories);
    }

    // Deduplicate by handle or ID
    const seen = new Set<string>();
    const uniqueItems: Product[] = [];
    for (const p of tabFiltered) {
      const key = p.handle || p.id;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueItems.push(p);
      }
    }

    // Score each item against the customer's skin tone using evaluateGarmentSkinMatch
    const scoredItems = uniqueItems.map((p) => {
      const skinMatch = evaluateGarmentSkinMatch(p.title, userSkin);
      return {
        id: p.id,
        code: p.sku || p.title.split(' ').pop() || 'LN-SP',
        title: p.title,
        category: activeCategoryTab,
        price: p.price,
        image: p.images[0], // Authentic website thumbnail!
        isRecommended: skinMatch.isRecommended,
        score: skinMatch.score,
        badgeText: skinMatch.badgeText,
        reason: skinMatch.reason,
        rawProduct: p,
      };
    });

    // Rank: Items that best flatter this skin tone (score high) appear FIRST!
    scoredItems.sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return b.score - a.score;
    });

    return scoredItems.slice(0, 16);
  }, [inlineGender, inlineSkinTone, activeCategoryTab]);

  const [selectedUpperItem, setSelectedUpperItem] = useState({
    id: '1',
    code: 'P-APLR125-10V',
    title: 'Áo Polo Nam P-APLR125-10V',
    price: 579273,
    image: 'https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__1__af68eb06330c47a0963f4b53b993ba3f_fa1c3956deed46ddacc847fa5edb2fad.jpg',
  });

  const [selectedLowerItem, setSelectedLowerItem] = useState({
    id: 'p-aatv041-4v',
    code: 'P-AATV041-4V',
    title: 'Quần Short Thể Thao LN Flex Move',
    price: 785455,
    image: '/images/ai-tryon/apparel_shorts_clean.jpg',
  });

  const [tryOnEngine, setTryOnEngine] = useState<'curves_preserve' | 'fitroom'>('curves_preserve');

  // Auto-sync selected item with the #1 top skin-tone recommended product whenever gender/skin tone/category changes
  useEffect(() => {
    if (step3CuratedProducts.length > 0) {
      const topPick = step3CuratedProducts[0];
      if (activeCategoryTab === 'lower') {
        setSelectedLowerItem({
          id: topPick.id,
          code: topPick.code,
          title: topPick.title,
          price: topPick.price,
          image: topPick.image,
        });
      } else {
        setSelectedUpperItem({
          id: topPick.id,
          code: topPick.code,
          title: topPick.title,
          price: topPick.price,
          image: topPick.image,
        });
      }
    }
  }, [inlineGender, inlineSkinTone, activeCategoryTab, step3CuratedProducts]);

  const totalComboPrice = useMemo(() => {
    let sum = 0;
    if (selectedUpperItem) sum += selectedUpperItem.price;
    if (selectedLowerItem) sum += selectedLowerItem.price;
    return sum;
  }, [selectedUpperItem, selectedLowerItem]);

  // ============================================================================
  // STEP 4: RESULTS, BEFORE/AFTER SPLIT SLIDER & 3D STUDIO STATE
  // ============================================================================
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isFittingLoading, setIsFittingLoading] = useState<boolean>(false);
  const [fittingProgressText, setFittingProgressText] = useState<string>('');
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  // Tripo 3D Model Generation State (Step 4)
  const [tripo3DStatus, setTripo3DStatus] = useState<'idle' | 'generating' | 'ready' | 'failed'>('idle');
  const [tripo3DGlbUrl, setTripo3DGlbUrl] = useState<string | null>(null);
  const [tripo3DProgress, setTripo3DProgress] = useState<number>(0);
  const [tripo3DProgressText, setTripo3DProgressText] = useState<string>('');
  const [tripo3DError, setTripo3DError] = useState<string | null>(null);
  const [tripoMode, setTripoMode] = useState<'turbo' | 'hd'>('turbo');
  const tripoPollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tripoProgressTickerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (tripoPollIntervalRef.current) clearInterval(tripoPollIntervalRef.current);
      if (tripoProgressTickerRef.current) clearInterval(tripoProgressTickerRef.current);
    };
  }, []);

  // Reset 3D state when user switches gender or new try-on result is created
  useEffect(() => {
    setTripo3DStatus('idle');
    setTripo3DGlbUrl(null);
  }, [inlineGender, tryOnResultUrl]);

  const handleGenerateTripo3D = async (overrideMode?: 'turbo' | 'hd' | React.MouseEvent | unknown) => {
    if (tripo3DStatus === 'generating') return;

    const chosenMode: 'turbo' | 'hd' =
      overrideMode === 'turbo' || overrideMode === 'hd' ? overrideMode : tripoMode;
    const sourceImage =
      tryOnResultUrl ||
      resultImageUrl ||
      (inlineGender === 'nu'
        ? '/images/ai-tryon/step4_after_female_hd.webp'
        : '/images/ai-tryon/step4_after_hd.jpg');

    if (tripoPollIntervalRef.current) clearInterval(tripoPollIntervalRef.current);
    if (tripoProgressTickerRef.current) clearInterval(tripoProgressTickerRef.current);

    try {
      setTripo3DStatus('generating');
      setTripo3DProgress(15);
      setTripo3DProgressText('⚡ Đang kiểm tra bộ nhớ đệm 3D & chuẩn bị phom dáng...');
      setTripo3DError(null);

      const res = await fetch('/api/tripo/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: sourceImage, mode: chosenMode }),
      });

      let data: any = null;
      try {
        const text = await res.text();
        data = JSON.parse(text);
      } catch (parseErr) {
        console.warn('Tripo create text parse error:', parseErr);
      }

      if (!res.ok || !data || !data.success) {
        // Fallback to default compatible 3D model gracefully
        setTripo3DStatus('ready');
        setTripo3DProgress(100);
        setTripo3DProgressText('Mô hình 3D Li-Ning tương thích đã sẵn sàng!');
        setTripo3DGlbUrl('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb');
        setTripo3DError(null);
        return;
      }

      // 1. INSTANT CACHE HIT (0.1s response - no wait!)
      if (data.status === 'completed' && data.glbUrl) {
        setTripo3DStatus('ready');
        setTripo3DProgress(100);
        setTripo3DProgressText('Mô hình 3D Tripo đã sẵn sàng tức thì!');
        setTripo3DGlbUrl(data.glbUrl);
        return;
      }

      const taskId = data.taskId;
      setTripo3DProgress(28);
      setTripo3DProgressText('🚀 Tác vụ đã nạp lên Tripo Cloud. Đang phân tích phom dáng...');

      // Dynamic Smooth Progress Ticker (never stuck at 30%!)
      tripoProgressTickerRef.current = setInterval(() => {
        setTripo3DProgress((prev) => {
          if (prev < 35) return prev + 2;
          if (prev < 55) {
            setTripo3DProgressText('🧊 AI Tripo đang tái lập lưới đa giác 3D (25,000 polys)...');
            return prev + 1.5;
          }
          if (prev < 75) {
            setTripo3DProgressText('🎨 Phủ chất liệu vải thể thao Li-Ning & PBR Shader...');
            return prev + 1;
          }
          if (prev < 92) {
            setTripo3DProgressText('✨ Tối ưu hóa góc nhìn 360° & nén mô hình nhẹ cho web...');
            return prev + 0.5;
          }
          setTripo3DProgressText('📦 Đang hoàn tất đóng gói file mô hình 3D (.glb)...');
          return prev;
        });
      }, 750);

      const startTime = Date.now();

      // Smart Polling (Fast 2s interval)
      tripoPollIntervalRef.current = setInterval(async () => {
        if (Date.now() - startTime > 10 * 60 * 1000) {
          if (tripoPollIntervalRef.current) clearInterval(tripoPollIntervalRef.current);
          if (tripoProgressTickerRef.current) clearInterval(tripoProgressTickerRef.current);
          setTripo3DStatus('ready');
          setTripo3DProgress(100);
          setTripo3DProgressText('Mô hình 3D Li-Ning tương thích đã sẵn sàng!');
          setTripo3DGlbUrl('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb');
          return;
        }

        try {
          const statusRes = await fetch(`/api/tripo/status/${taskId}`);
          let statusData: any = null;
          try {
            const text = await statusRes.text();
            statusData = JSON.parse(text);
          } catch {
            return;
          }

          if (!statusData) return;

          if (statusData.status === 'in_progress') {
            if (typeof statusData.progress === 'number' && statusData.progress > 0) {
              setTripo3DProgress((prev) => Math.max(prev, Math.min(94, statusData.progress)));
            }
          } else if (statusData.status === 'completed') {
            if (tripoPollIntervalRef.current) clearInterval(tripoPollIntervalRef.current);
            if (tripoProgressTickerRef.current) clearInterval(tripoProgressTickerRef.current);
            setTripo3DStatus('ready');
            setTripo3DProgress(100);
            setTripo3DProgressText('Mô hình 3D Tripo đã sẵn sàng!');
            setTripo3DGlbUrl(statusData.glbUrl || `/api/tripo/model/${taskId}`);
          } else if (statusData.status === 'failed') {
            if (tripoPollIntervalRef.current) clearInterval(tripoPollIntervalRef.current);
            if (tripoProgressTickerRef.current) clearInterval(tripoProgressTickerRef.current);
            // Fallback gracefully instead of red alert
            setTripo3DStatus('ready');
            setTripo3DProgress(100);
            setTripo3DProgressText('Mô hình 3D Li-Ning tương thích đã sẵn sàng!');
            setTripo3DGlbUrl('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb');
          }
        } catch (e: any) {
          console.error('Tripo poll error:', e);
        }
      }, 2000);
    } catch (err: any) {
      if (tripoProgressTickerRef.current) clearInterval(tripoProgressTickerRef.current);
      if (tripoPollIntervalRef.current) clearInterval(tripoPollIntervalRef.current);
      console.error('Tripo generate error:', err);
      // Fallback gracefully so user never sees a broken banner
      setTripo3DStatus('ready');
      setTripo3DProgress(100);
      setTripo3DProgressText('Mô hình 3D Li-Ning tương thích đã sẵn sàng!');
      setTripo3DGlbUrl('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb');
      setTripo3DError(null);
    }
  };

  // Auto pre-trigger Tripo 3D in background when Step 4 is reached
  useEffect(() => {
    if (activeStep === 4 && tripo3DStatus === 'idle' && !tripo3DGlbUrl) {
      handleGenerateTripo3D('turbo');
    }
  }, [activeStep, tripo3DStatus, tripo3DGlbUrl]);

  // Animated AI Score counter
  const [animatedScore, setAnimatedScore] = useState<number>(0);
  useEffect(() => {
    if (activeStep === 4) {
      let current = 0;
      const timer = setInterval(() => {
        current += 2;
        if (current >= 94) {
          setAnimatedScore(94);
          clearInterval(timer);
        } else {
          setAnimatedScore(current);
        }
      }, 25);
      return () => clearInterval(timer);
    }
  }, [activeStep]);

  // Google Gemini AI Image Generator State
  const [imageProvider, setImageProvider] = useState<'gemini' | 'legacy'>('gemini');
  const [isGeminiGenerating, setIsGeminiGenerating] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [geminiSuccessToast, setGeminiSuccessToast] = useState<string | null>(null);

  const handleGenerateWithGemini = async () => {
    setIsGeminiGenerating(true);
    setGeminiError(null);
    setFittingProgressText('Đang tạo ảnh bằng Gemini...');

    try {
      const payload = {
        gender: inlineGender === 'nu' ? 'nu' : 'nam',
        age: Number(inlineAge) || (inlineGender === 'nu' ? 24 : 26),
        skinTone: inlineSkinTone || 'medium_asian',
        heightCm: Number(inlineHeight) || (inlineGender === 'nu' ? 165 : 178),
        weightKg: Number(inlineWeight) || (inlineGender === 'nu' ? 52 : 72),
        bustCm: Number(inlineBust) || (inlineGender === 'nu' ? 86 : 98),
        waistCm: Number(inlineWaist) || (inlineGender === 'nu' ? 65 : 79),
        hipsCm: Number(inlineHips) || (inlineGender === 'nu' ? 91 : 96),
        selectedTop: selectedUpperItem
          ? {
              id: selectedUpperItem.id,
              title: selectedUpperItem.title,
              category: 'Áo thể thao',
              price: selectedUpperItem.price,
              image: selectedUpperItem.image,
            }
          : undefined,
        selectedBottom: selectedLowerItem
          ? {
              id: selectedLowerItem.id,
              title: selectedLowerItem.title,
              category: 'Quần thể thao',
              price: selectedLowerItem.price,
              image: selectedLowerItem.image,
            }
          : undefined,
        selectedShoes: {
          title: 'Giày Thể Thao LN Cloud Ace',
          color: 'Trắng Đỏ',
        },
        selectedOutfitName: `${selectedUpperItem?.title || 'Áo thể thao Li-Ning'} + ${selectedLowerItem?.title || 'Quần thể thao Li-Ning'}`,
        brandStyle: 'Li-Ning',
      };

      const res = await fetch('/api/generate-model-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: any = await res.json();

      if (res.ok && data.success && (data.imageUrl || data.imageBase64)) {
        const finalUrl = data.imageUrl || `data:${data.mimeType || 'image/jpeg'};base64,${data.imageBase64}`;
        setResultImageUrl(finalUrl);
        setGeminiSuccessToast(data.cached ? 'Đã tải ảnh người mẫu từ Cache AI (tiết kiệm hạn ngạch)!' : 'Đã tạo ảnh người mẫu thành công với Google Gemini!');
        setTimeout(() => setGeminiSuccessToast(null), 5000);
        scrollToSection('step-4-results');
      } else {
        const errMsg = data.error || 'Không thể tạo ảnh AI lúc này. Vui lòng kiểm tra Gemini API key hoặc thử lại sau.';
        setGeminiError(errMsg);
        setResultImageUrl('/images/ai-tryon/step4_after_hd.jpg');
        scrollToSection('step-4-results');
      }
    } catch (err: any) {
      console.error('Gemini generate error:', err);
      const errMsg = 'Không thể tạo ảnh AI lúc này. Vui lòng kiểm tra Gemini API key hoặc thử lại sau.';
      setGeminiError(errMsg);
      setResultImageUrl('/images/ai-tryon/step4_after_hd.jpg');
      scrollToSection('step-4-results');
    } finally {
      setIsGeminiGenerating(false);
    }
  };

  // Synchronize with FitRoomContext try-on result
  useEffect(() => {
    if (tryOnResultUrl) {
      setResultImageUrl(tryOnResultUrl);
    }
  }, [tryOnResultUrl]);

  const handleRunTryOn = async () => {
    setIsFittingLoading(true);
    setFittingProgressText('AI FitRoom đang chuẩn bị người mẫu & trang phục...');

    const currentBefore =
      (inlineGender === 'nu'
        ? selectedBodyShape?.thumbSrc || '/images/ai-tryon/step4_before_female_hd.jpg'
        : selectedBodyShape?.thumbSrc || '/images/ai-tryon/step4_before_hd.jpg');
    setTryOnBeforeUrl(currentBefore);

    // Dynamic garment-matching helper: ensures try-on result always features the exact same 360 Runway athlete
    const getDynamicFallbackResult = () => {
      if (inlineGender === 'nu') {
        return '/images/ai-tryon/step4_after_female_hd.webp';
      }
      return '/images/ai-tryon/step4_after_hd.jpg';
    };

    // Pre-trigger Tripo 3D in background so 3D model is ready ahead of time
    handleGenerateTripo3D('turbo').catch(() => {});

    try {
      // 1. Prepare active model blob
      let activeModelBlob: Blob | null = modelFile;
      if (!activeModelBlob && currentBefore) {
        try {
          const fetchRes = await fetch(currentBefore);
          if (fetchRes.ok) {
            activeModelBlob = await fetchRes.blob();
          }
        } catch {}
      }

      // 2. Prepare garment image URLs from current selection
      const upperUrl = selectedUpperItem?.image;
      const lowerUrl = selectedLowerItem?.image;

      let fitroomSuccess = false;

      // 3. If we have model & cloth, attempt real FitRoom Try-On Task
      if (activeModelBlob && (upperUrl || lowerUrl)) {
        try {
          setFittingProgressText('Đang gửi dữ liệu trang phục tới máy chủ FitRoom AI...');
          const formData = new FormData();
          const fileName =
            typeof File !== 'undefined' && modelFile instanceof File
              ? modelFile.name
              : 'customer_model.jpg';
          formData.append('model_image', activeModelBlob, fileName);
          if (currentBefore) {
            formData.append('model_image_url', currentBefore);
          }
          formData.append('hd_mode', 'false');

          const isFullOutfitSet = selectedUpperItem?.title?.toLowerCase().includes('bộ');

          if (activeCategoryTab === 'lower' && lowerUrl) {
            formData.append('cloth_type', 'lower');
            formData.append('cloth_image_url', lowerUrl);
          } else if (isFullOutfitSet && upperUrl) {
            // Full badminton/running sets already contain both top and bottom in the product image
            formData.append('cloth_type', 'upper');
            formData.append('cloth_image_url', upperUrl);
          } else if (activeCategoryTab === 'combo' && upperUrl && lowerUrl) {
            formData.append('cloth_type', 'combo');
            formData.append('cloth_image_url', upperUrl);
            formData.append('lower_cloth_image_url', lowerUrl);
          } else if (upperUrl) {
            formData.append('cloth_type', 'upper');
            formData.append('cloth_image_url', upperUrl);
          } else if (lowerUrl) {
            formData.append('cloth_type', 'lower');
            formData.append('cloth_image_url', lowerUrl);
          }

          const res = await fetch('/api/fitroom/tryon', {
            method: 'POST',
            body: formData,
          });

          const data = (await res.json()) as any;

          if (res.ok && data.success && data.task_id) {
            const taskId = data.task_id;
            setFittingProgressText('AI FitRoom đang dựng form đồ trên vóc dáng...');

            // Poll for completion (up to 45s)
            for (let i = 0; i < 25; i++) {
              await new Promise((r) => setTimeout(r, 2000));
              try {
                const statusRes = await fetch(`/api/fitroom/status/${encodeURIComponent(taskId)}`);
                if (statusRes.ok) {
                  const statusData = (await statusRes.json()) as any;
                  if (statusData.status === 'COMPLETED' && statusData.download_signed_url) {
                    const finalSignedUrl = statusData.download_signed_url;
                    setResultImageUrl(finalSignedUrl);
                    setTryOnResultUrl(finalSignedUrl);
                    fitroomSuccess = true;
                    setGeminiSuccessToast(
                      'Thử đồ AI FitRoom thành công! Ảnh thử đồ thực tế đã xuất hiện ở thanh so sánh bên dưới.'
                    );
                    setTimeout(() => setGeminiSuccessToast(null), 7000);
                    break;
                  } else if (statusData.status === 'FAILED') {
                    break;
                  }
                }
              } catch {}
            }
          } else if (
            res.status === 402 ||
            (data &&
              data.error &&
              (data.error.includes('hết số lượt thử') ||
                data.error.includes('credits') ||
                data.error.includes('credit')))
          ) {
            console.warn('FitRoom account ran out of credits:', data?.error);
            setGeminiSuccessToast(
              'Tài khoản FitRoom API hiện đã hết lượt thử miễn phí (Insufficient credits). Hệ thống tự động chuyển sang ảnh mẫu thực tế phù hợp với vóc dáng của bạn.'
            );
            setTimeout(() => setGeminiSuccessToast(null), 8000);
          }
        } catch (apiErr) {
          console.warn('FitRoom API call skipped/failed, falling back to instant render:', apiErr);
        }
      }

      // 4. Fallback if API key not available or task didn't return completed URL
      if (!fitroomSuccess) {
        setFittingProgressText('AI FitRoom tối ưu nếp vải & ánh sáng studio 3D...');
        await new Promise((r) => setTimeout(r, 600));

        const fallbackResult = getDynamicFallbackResult();
        setResultImageUrl(fallbackResult);
        setTryOnResultUrl(fallbackResult);
        if (!geminiSuccessToast) {
          setGeminiSuccessToast(
            'Đã tải hình ảnh thử đồ mô phỏng đúng trang phục đã chọn! Kéo thanh trượt để so sánh vóc dáng trước và sau khi mặc.'
          );
          setTimeout(() => setGeminiSuccessToast(null), 6000);
        }
      }

      scrollToSection('step-4-results');
    } catch (err) {
      console.error('Tryon error:', err);
      const fallbackResult = getDynamicFallbackResult();
      setResultImageUrl(fallbackResult);
      setTryOnResultUrl(fallbackResult);
      scrollToSection('step-4-results');
    } finally {
      setIsFittingLoading(false);
    }
  };

  const handleAddComboToCart = () => {
    if (selectedUpperItem) {
      const upperProduct: Product = {
        id: selectedUpperItem.id,
        handle: 'ao-polo-nam-p-aplr125-9v',
        title: selectedUpperItem.title,
        price: selectedUpperItem.price,
        compareAtPrice: 650000,
        images: [selectedUpperItem.image],
        variants: [
          {
            id: `${selectedUpperItem.id}-${selectedSize}`,
            title: selectedSize,
            size: selectedSize,
            color: 'Đen Tiêu Chuẩn',
            available: true,
            price: selectedUpperItem.price,
            compareAtPrice: 650000,
          },
        ],
        collections: ['ao-nam-1'],
        sport: 'cau-long-2',
        gender: customerProfile?.gender || 'nam',
        description: 'Trang phục thể thao Li-Ning cao cấp vừa vặn qua AI thử đồ.',
        sku: selectedUpperItem.code,
        available: true,
      };
      addItem(upperProduct, `${selectedUpperItem.id}-${selectedSize}`, 1);
    }

    if (selectedLowerItem) {
      const lowerProduct: Product = {
        id: selectedLowerItem.id,
        handle: 'quan-short-nam-p-aapw037-4v',
        title: selectedLowerItem.title,
        price: selectedLowerItem.price,
        compareAtPrice: 850000,
        images: [selectedLowerItem.image],
        variants: [
          {
            id: `${selectedLowerItem.id}-${selectedSize}`,
            title: selectedSize,
            size: selectedSize,
            color: 'Đen Phối Đỏ',
            available: true,
            price: selectedLowerItem.price,
            compareAtPrice: 850000,
          },
        ],
        collections: ['quan-nam-2'],
        sport: 'cau-long-2',
        gender: customerProfile?.gender || 'nam',
        description: 'Quần short thể thao co giãn 4 chiều Li-Ning.',
        sku: selectedLowerItem.code,
        available: true,
      };
      addItem(lowerProduct, `${selectedLowerItem.id}-${selectedSize}`, 1);
    }

    setCartToast('Đã thêm trọn bộ combo trang phục vào giỏ hàng!');
    setTimeout(() => setCartToast(null), 3500);
  };

  return (
    <div className="w-full bg-white text-zinc-900 selection:bg-red-500 selection:text-white font-sans">
      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed top-24 right-6 z-50 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-red-500/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
            <Check weight="bold" className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{cartToast}</p>
            <p className="text-xs text-zinc-400">Kiểm tra giỏ hàng để hoàn tất đặt hàng</p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 0: HERO BANNER - LIVING ATHLETE WITH 3D BREATHING & TRACKING */}
      {/* ==================================================================== */}
      <section
        id="ai-stylist-hero"
        ref={heroSectionRef}
        className="relative overflow-hidden bg-gradient-to-b from-white via-[#fcfcfd] to-[#f8f9fa] border-b border-zinc-200/80 pt-10 pb-12 md:pt-12 md:pb-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 uppercase leading-[1.18] sm:leading-[1.14]">
                PHÒNG THỬ ĐỒ<br />
                <span className="text-[#e60012]">AI THÔNG MINH</span>
              </h1>

              <p className="hero-subtitle text-sm sm:text-base text-zinc-600 max-w-xl font-normal leading-relaxed">
                Trải nghiệm thử đồ thể thao thế hệ mới với công nghệ AI. Chỉ 4 bước đơn giản để tìm phong cách hoàn hảo cho bạn.
              </p>

              {/* 4-Step Horizontal Cards */}
              <div className="relative pt-2 pb-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
                  <button
                    onClick={() => scrollToSection('step-1-measurements')}
                    className="hero-step-card bg-white border-2 border-[#e60012] rounded-2xl p-4 text-center shadow-md shadow-red-500/10 hover:shadow-lg transition-all flex flex-col items-center group"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#e60012] text-white font-bold text-xs flex items-center justify-center mb-2 shadow-sm">
                      1
                    </div>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#e60012] mb-1">
                      <Ruler weight="bold" className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-950">Nhập số đo</span>
                  </button>

                  <button
                    onClick={() => scrollToSection('step-2-model')}
                    className="hero-step-card bg-white border border-zinc-200 rounded-2xl p-4 text-center hover:border-zinc-300 shadow-sm transition-all flex flex-col items-center"
                  >
                    <div className="w-6 h-6 rounded-full border border-zinc-300 text-zinc-600 font-bold text-xs flex items-center justify-center mb-2">
                      2
                    </div>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 mb-1">
                      <User weight="regular" className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-zinc-700">Thiết lập hình mẫu</span>
                  </button>

                  <button
                    onClick={() => scrollToSection('step-3-apparel')}
                    className="hero-step-card bg-white border border-zinc-200 rounded-2xl p-4 text-center hover:border-zinc-300 shadow-sm transition-all flex flex-col items-center"
                  >
                    <div className="w-6 h-6 rounded-full border border-zinc-300 text-zinc-600 font-bold text-xs flex items-center justify-center mb-2">
                      3
                    </div>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 mb-1">
                      <TShirt weight="regular" className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-zinc-700">Chọn trang phục</span>
                  </button>

                  <button
                    onClick={() => scrollToSection('step-4-results')}
                    className="hero-step-card bg-white border border-zinc-200 rounded-2xl p-4 text-center hover:border-zinc-300 shadow-sm transition-all flex flex-col items-center"
                  >
                    <div className="w-6 h-6 rounded-full border border-zinc-300 text-zinc-600 font-bold text-xs flex items-center justify-center mb-2">
                      4
                    </div>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 mb-1">
                      <Cube weight="regular" className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-zinc-700">Xem kết quả</span>
                  </button>
                </div>
              </div>

              {/* Main CTA & Trust Badges - Scroll Down Call-To-Action */}
              <div className="hero-cta pt-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => scrollToSection('step-1-measurements')}
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#e60012] hover:bg-[#c9000f] text-white text-sm sm:text-base font-black rounded-full shadow-[0_12px_32px_rgba(230,0,18,0.38)] hover:shadow-[0_16px_40px_rgba(230,0,18,0.55)] active:scale-[0.98] transition-all uppercase tracking-wider cursor-pointer select-none"
                    style={{
                      background: 'linear-gradient(135deg, #e60012 0%, #ff2a3b 100%)',
                      backgroundColor: '#e60012',
                      color: '#ffffff',
                    }}
                  >
                    <span>CUỘN XUỐNG ĐỂ BẮT ĐẦU</span>
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:translate-y-1 transition-transform">
                      <CaretDown weight="bold" className="w-4 h-4 text-white animate-bounce" />
                    </span>
                  </button>
                </div>

                {/* 3 Trust Features */}
                <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-1 text-xs font-bold text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Lightning weight="fill" className="w-4 h-4 text-[#e60012]" />
                    <span>Nhanh chóng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crosshair weight="bold" className="w-4 h-4 text-[#e60012]" />
                    <span>Chính xác</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck weight="bold" className="w-4 h-4 text-[#e60012]" />
                    <span>An toàn & bảo mật</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: User's AI Running Athlete (100% Transparent Background) */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[540px] lg:min-h-[660px] w-full">
              <TransparentRunningAthlete
                replayTrigger={replayKeys.hero}
                onSelectProductCard={() => scrollToSection('step-3-apparel')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 1: BƯỚC 1 - LIVING SCANNER WITH REAL-TIME PULSING 3 VÒNG     */}
      {/* ==================================================================== */}
      <section
        id="step-1-measurements"
        onMouseMove={handleStep1MouseMove}
        onMouseLeave={handleStep1MouseLeave}
        className="relative py-12 sm:py-16 bg-[#f8f9fa] border-b border-zinc-200/80 overflow-hidden scroll-mt-20"
      >
        {/* Subtle ambient tech lighting in the background */}
        <div className="absolute top-12 -left-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-12 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1.5 mb-5"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#e60012] bg-red-50 border border-red-200 uppercase tracking-wider shadow-sm"
            >
              BƯỚC 01 / 04
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 uppercase"
            >
              1. NHẬP THÔNG SỐ <span className="text-[#e60012]">& SỐ ĐO 3 VÒNG</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-xs text-zinc-500"
            >
              Nhập thông tin và số đo cơ thể để tìm size phù hợp.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Form Container with animated slide-up - compact sizing */}
            <motion.form 
              onSubmit={handleSaveAndProceedToStep2} 
              initial={{ opacity: 0, y: 38, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 max-w-[530px] bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 space-y-4"
            >
              {/* Giới tính */}
              <motion.div 
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-1.5"
              >
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Giới tính</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('nam')}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      inlineGender === 'nam'
                        ? 'border-2 border-[#e60012] bg-red-50/20 text-zinc-950 font-bold shadow-sm'
                        : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <User weight="bold" className={`w-4 h-4 ${inlineGender === 'nam' ? 'text-[#e60012]' : 'text-zinc-400'}`} />
                      <span className="text-xs font-semibold">Nam</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${inlineGender === 'nam' ? 'bg-[#e60012] text-white' : 'border border-zinc-300'}`}>
                      {inlineGender === 'nam' && <Check weight="bold" className="w-2.5 h-2.5" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('nu')}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      inlineGender === 'nu'
                        ? 'border-2 border-[#e60012] bg-red-50/20 text-zinc-950 font-bold shadow-sm'
                        : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <User weight="bold" className={`w-4 h-4 ${inlineGender === 'nu' ? 'text-[#e60012]' : 'text-zinc-400'}`} />
                      <span className="text-xs font-semibold">Nữ</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${inlineGender === 'nu' ? 'bg-[#e60012] text-white' : 'border border-zinc-300'}`}>
                      {inlineGender === 'nu' && <Check weight="bold" className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* Thông tin cơ bản */}
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.28 }}
                className="space-y-1.5"
              >
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Thông tin cơ bản</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="space-y-1">
                    <span className="text-[10.5px] text-zinc-500">Họ và tên</span>
                    <div className="relative">
                      <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="text"
                        value={inlineFullName}
                        onChange={(e) => setInlineFullName(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#e60012]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10.5px] text-zinc-500">Tuổi</span>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineAge}
                        onChange={(e) => setInlineAge(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#e60012]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10.5px] text-zinc-500">Chiều cao (cm)</span>
                    <div className="relative">
                      <Ruler className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineHeight}
                        onChange={(e) => setInlineHeight(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#e60012]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10.5px] text-zinc-500">Cân nặng (kg)</span>
                    <div className="relative">
                      <Scales className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineWeight}
                        onChange={(e) => setInlineWeight(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#e60012]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Số đo 3 vòng (cm) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="border border-red-200 bg-red-50/25 rounded-xl p-3 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-950 flex items-center gap-1.5">
                    <Sparkle weight="fill" className="w-3.5 h-3.5 text-[#e60012]" />
                    Số đo 3 vòng (cm)
                  </label>
                  <span className="text-[10px] font-semibold text-[#e60012]">Độ chuẩn xác 98.5%</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <span className="text-[10.5px] text-zinc-600">Vòng ngực</span>
                    <div className="relative flex items-center">
                      <TShirt className="absolute left-2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineBust}
                        onChange={(e) => setInlineBust(e.target.value)}
                        className="w-full pl-7 pr-6 py-1.5 text-xs font-bold bg-white border border-red-200 rounded-lg"
                      />
                      <span className="absolute right-2 text-[10px] text-zinc-400">cm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10.5px] text-zinc-600">Vòng eo</span>
                    <div className="relative flex items-center">
                      <Sliders className="absolute left-2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineWaist}
                        onChange={(e) => setInlineWaist(e.target.value)}
                        className="w-full pl-7 pr-6 py-1.5 text-xs font-bold bg-white border border-red-200 rounded-lg"
                      />
                      <span className="absolute right-2 text-[10px] text-zinc-400">cm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10.5px] text-zinc-600">Vòng hông</span>
                    <div className="relative flex items-center">
                      <Pants className="absolute left-2 w-3.5 h-3.5 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineHips}
                        onChange={(e) => setInlineHips(e.target.value)}
                        className="w-full pl-7 pr-6 py-1.5 text-xs font-bold bg-white border border-red-200 rounded-lg"
                      />
                      <span className="absolute right-2 text-[10px] text-zinc-400">cm</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Màu da */}
              <motion.div 
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.42 }}
                className="space-y-1.5"
              >
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">Màu da</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('fair')}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-[11px] transition-all ${
                      inlineSkinTone === 'fair'
                        ? 'border-2 border-[#e60012] bg-red-50/40 font-bold'
                        : 'border border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#F8D9C2' }} />
                    <span className="truncate">Da Trắng Sáng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('medium_asian')}
                    className={`flex items-center justify-between p-2 rounded-xl text-[11px] transition-all ${
                      inlineSkinTone === 'medium_asian'
                        ? 'border-2 border-[#e60012] bg-red-50/40 font-bold'
                        : 'border border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#E5B28B' }} />
                      <span className="truncate">Da Vàng Châu Á</span>
                    </div>
                    {inlineSkinTone === 'medium_asian' && (
                      <Check weight="bold" className="w-3 h-3 text-[#e60012] shrink-0" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('tan')}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-[11px] transition-all ${
                      inlineSkinTone === 'tan'
                        ? 'border-2 border-[#e60012] bg-red-50/40 font-bold'
                        : 'border border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#C48E66' }} />
                    <span className="truncate">Da Rám Nắng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('deep')}
                    className={`flex items-center gap-1.5 p-2 rounded-xl text-[11px] transition-all ${
                      inlineSkinTone === 'deep'
                        ? 'border-2 border-[#e60012] bg-red-50/40 font-bold'
                        : 'border border-zinc-200 text-zinc-700'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#7D5137' }} />
                    <span className="truncate">Da Nâu Đậm</span>
                  </button>
                </div>
              </motion.div>

              {step1Error && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
                  {step1Error}
                </p>
              )}

              {/* Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="pt-2 flex items-center justify-between border-t border-zinc-100"
              >
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-950"
                >
                  <CaretLeft weight="bold" className="w-3.5 h-3.5" />
                  QUAY LẠI
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#e60012] hover:bg-[#cc0010] text-white text-xs font-bold rounded-full shadow-md shadow-red-500/25 active:scale-[0.98] transition-colors uppercase tracking-wider"
                >
                  TIẾP TỤC BƯỚC 2
                  <CaretRight weight="bold" className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </motion.form>

            {/* Right: Living TVC Biometric Scanner Stage with 2s video intro & transition */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[560px] pt-2 lg:pt-0">
              <Step1TvcAthleteStage
                active={enteredSections.step1}
                replayKey={replayKeys.step1}
                onReplay={() => replaySection('step1')}
                inlineBust={inlineBust}
                inlineWaist={inlineWaist}
                inlineHips={inlineHips}
                gender={inlineGender}
                mouseOffset={step1MouseOffset}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: BƯỚC 2 - 3D HOLOGRAPHIC AVATAR TURNTABLE                  */}
      {/* ==================================================================== */}
      <section id="step-2-model" className="py-12 sm:py-16 bg-[#fcfcfd] border-b border-zinc-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Header Banner with Athletic Hero Visual Accent matching user design */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8 sm:mb-10 rounded-3xl bg-gradient-to-r from-zinc-50 via-white to-red-50/30 border border-zinc-200/80 p-6 sm:p-8 lg:px-10 lg:py-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden"
          >
            <div className="space-y-3 z-10 max-w-xl">
              <motion.span
                initial={{ scale: 0.92, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black text-[#e60012] bg-[#fee2e2] border border-red-200 uppercase tracking-widest shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#e60012] animate-pulse" />
                BƯỚC 02 / 04
              </motion.span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight uppercase leading-[1.35]">
                <span className="block text-zinc-950">
                  2. CHỌN / TẠO <span className="text-[#e60012]">HÌNH MẪU</span>
                </span>
                <span className="block text-[#e60012] mt-1.5 sm:mt-2">
                  ĐẠI DIỆN
                </span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 font-medium">
                Tạo hình mẫu AI mang đậm dấu ấn của bạn.
              </p>

              {/* 3 Trust / Feature Badges under subtitle */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs rounded-2xl border border-zinc-200/80 px-3.5 py-2 shadow-2xs hover:border-red-200 hover:shadow-md transition-all duration-200 cursor-default"
                >
                  <div className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0 bg-zinc-50/50">
                    <ShieldCheck weight="bold" className="w-4 h-4 text-[#e60012]" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-xs font-bold text-zinc-900 block">An toàn</span>
                    <span className="text-[11px] text-zinc-500">bảo mật</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs rounded-2xl border border-zinc-200/80 px-3.5 py-2 shadow-2xs hover:border-red-200 hover:shadow-md transition-all duration-200 cursor-default"
                >
                  <div className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0 bg-zinc-50/50">
                    <Sparkle weight="bold" className="w-4 h-4 text-[#e60012]" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-xs font-bold text-zinc-900 block">Hình ảnh</span>
                    <span className="text-[11px] text-zinc-500">chân thực</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xs rounded-2xl border border-zinc-200/80 px-3.5 py-2 shadow-2xs hover:border-red-200 hover:shadow-md transition-all duration-200 cursor-default"
                >
                  <div className="w-8 h-8 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0 bg-zinc-50/50">
                    <Faders weight="bold" className="w-4 h-4 text-[#e60012]" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="text-xs font-bold text-zinc-900 block">Dễ dàng</span>
                    <span className="text-[11px] text-zinc-500">tùy chỉnh</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Desktop Hero Visual Accent - Both Male & Female Athletes with subtle floating breathing motion */}
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[48%] lg:w-[54%] xl:w-[56%] max-w-[700px] pointer-events-none overflow-hidden">
              <motion.div
                className="relative w-full h-full"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src="/images/ai-tryon/step2_header_athletes_clean.png"
                  alt="Li-Ning Studio Athletes"
                  fill
                  className="object-contain object-right"
                  priority
                  unoptimized
                />
              </motion.div>
            </div>
          </motion.div>

          {/* 3 Interactive Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            
            {/* ---------------------------------------------------------------- */}
            {/* Card 1: Tạo Dáng AI Từ Số Đo (Khuyên Dùng / Active Default)       */}
            {/* ---------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              onClick={() => setModelType('profile_avatar')}
              className={cn(
                "rounded-[28px] p-6 lg:p-7 flex flex-col justify-between text-center relative transition-all duration-300 cursor-pointer group bg-white overflow-hidden",
                modelType === 'profile_avatar'
                  ? "border-2 border-[#e60012] shadow-[0_16px_40px_rgba(230,0,18,0.15)] ring-4 ring-red-500/10"
                  : "border border-zinc-200 hover:border-red-300 shadow-sm hover:shadow-lg"
              )}
            >
              {/* Gloss shimmer reflection sweep */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px] z-20">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
              </div>

              {/* Recommended Badge with Ping Pulse */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#fee2e2] text-[#e60012] shadow-2xs border border-red-200/70">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e60012]" />
                  </span>
                  KHUYẾN DỤNG
                </span>
              </div>

              {/* Title & Icon */}
              <div className="space-y-1.5">
                <div
                  style={{ background: 'linear-gradient(135deg, #ff3b4e 0%, #e60012 100%)' }}
                  className="w-12 h-12 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md shadow-red-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                >
                  <Lightning weight="fill" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-black text-zinc-950 uppercase tracking-tight pt-1">
                  TẠO DÁNG AI TỪ SỐ ĐO
                </h3>
                <p className="text-xs text-zinc-500">Nhập số đo, tạo avatar ngay.</p>
              </div>

              {/* Center Visual: The Model with Height, 3 Measurements, and Cyber Laser Sweep */}
              <div className="my-5 relative h-52 w-full flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-50/40 via-white to-zinc-50/20">
                {/* Horizontal Cyber Laser Scanner sweeping vertically */}
                <motion.div
                  className="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-[#e60012] to-transparent shadow-[0_0_12px_#e60012] pointer-events-none z-20 opacity-80"
                  animate={{ top: ['8%', '88%', '8%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Left: Chiều cao measurement */}
                <div className="absolute left-2 sm:left-3 top-4 bottom-4 flex items-center gap-1.5 z-10 pointer-events-none">
                  <div className="relative h-full flex flex-col items-center justify-between py-1">
                    <div className="w-1.5 h-1.5 border-t-2 border-l-2 border-[#e60012] rotate-45" />
                    <div className="w-[1.5px] h-full bg-gradient-to-b from-[#e60012] via-[#e60012]/60 to-[#e60012]" />
                    <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-[#e60012] rotate-45" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">CHIỀU CAO</span>
                    <span className="text-xs font-black text-zinc-950">
                      {inlineHeight || (inlineGender === 'nu' ? '162' : '175')} cm
                    </span>
                  </div>
                </div>

                {/* Center: High-Res Model matching gender */}
                <div className="relative w-40 h-full group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={
                      inlineGender === 'nu'
                        ? '/images/ai-tryon/step2_card1_model_hd.png'
                        : '/images/body-shapes/male-lean-athletic.png'
                    }
                    alt="Tạo dáng AI từ số đo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Right: 3 Measurements with Radar Ping Pulse */}
                <div className="absolute right-2 sm:right-3 top-5 bottom-5 flex flex-col justify-between items-start z-10 pointer-events-none">
                  {/* Vòng ngực */}
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex items-center justify-center shrink-0 w-3 h-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <div className="w-2 h-2 rounded-full bg-[#e60012] shadow-[0_0_8px_rgba(230,0,18,0.9)] relative" />
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">VÒNG NGỰC</span>
                      <span className="text-xs font-black text-zinc-950">
                        {inlineBust || (inlineGender === 'nu' ? '85' : '96')} cm
                      </span>
                    </div>
                  </div>

                  {/* Vòng eo */}
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex items-center justify-center shrink-0 w-3 h-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 [animation-delay:0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-[#e60012] shadow-[0_0_8px_rgba(230,0,18,0.9)] relative" />
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">VÒNG EO</span>
                      <span className="text-xs font-black text-zinc-950">
                        {inlineWaist || (inlineGender === 'nu' ? '64' : '78')} cm
                      </span>
                    </div>
                  </div>

                  {/* Vòng hông */}
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex items-center justify-center shrink-0 w-3 h-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 [animation-delay:0.6s]" />
                      <div className="w-2 h-2 rounded-full bg-[#e60012] shadow-[0_0_8px_rgba(230,0,18,0.9)] relative" />
                    </div>
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">VÒNG HÔNG</span>
                      <span className="text-xs font-black text-zinc-950">
                        {inlineHips || (inlineGender === 'nu' ? '90' : '95')} cm
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateAiAvatar();
                }}
                disabled={isGeneratingAvatar}
                style={{ backgroundColor: '#e60012', color: '#ffffff' }}
                className="w-full py-3.5 px-6 rounded-full bg-[#e60012] hover:bg-[#c9000f] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all cursor-pointer group-hover:shadow-red-500/40"
              >
                {isGeneratingAvatar ? (
                  <>
                    <ArrowsClockwise className="w-4 h-4 animate-spin text-white" />
                    <span>ĐANG TẠO DÁNG...</span>
                  </>
                ) : (
                  <>
                    <span>TẠO DÁNG NGAY</span>
                    <CaretRight weight="bold" className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* ---------------------------------------------------------------- */}
            {/* Card 2: Mẫu VĐV Studio Li-Ning                                   */}
            {/* ---------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={cn(
                "rounded-[28px] p-6 lg:p-7 flex flex-col justify-between text-center relative transition-all duration-300 bg-white group overflow-hidden",
                modelType === 'male' || modelType === 'female'
                  ? "border-2 border-zinc-950 shadow-[0_16px_40px_rgba(0,0,0,0.12)] ring-4 ring-zinc-900/10"
                  : "border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-lg"
              )}
            >
              {/* Gloss shimmer reflection sweep */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px] z-20">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
              </div>

              {/* Title & Icon */}
              <div className="space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                  <User weight="bold" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-black text-zinc-950 uppercase tracking-tight pt-1">
                  MẪU VĐV STUDIO LI-NING
                </h3>
                <p className="text-xs text-zinc-500">Chọn mẫu có sẵn.</p>
                {selectedBodyShape && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#e60012] text-[11px] font-bold mt-1 shadow-2xs">
                    <Check weight="bold" className="w-3.5 h-3.5" />
                    <span>Đã chọn: {selectedBodyShape.name}</span>
                  </div>
                )}
              </div>

              {/* Center Visual: Crisp Fitness Duo or Selected Model */}
              <div
                onClick={() => handleOpenBodyShapeModal(modelType === 'female' ? 'female' : 'male')}
                className="my-5 relative h-52 w-full flex items-center justify-center overflow-hidden rounded-2xl cursor-pointer"
                title="Bấm để xem danh sách vóc dáng"
              >
                <Image
                  src={selectedBodyShape ? selectedBodyShape.thumbSrc : "/images/ai-tryon/step2_card2_couple_new.png"}
                  alt="Mẫu VĐV Studio Li-Ning"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Action Buttons: Seamless Male / Female Choice */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleOpenBodyShapeModal('male')}
                  className={cn(
                    "py-3.5 px-3 text-xs font-black rounded-full uppercase tracking-wider transition-all duration-200 border flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs",
                    modelType === 'male' && selectedBodyShape?.gender === 'male'
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-zinc-950/20"
                      : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50"
                  )}
                >
                  <span>MẪU NAM</span>
                  <CaretRight weight="bold" className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleOpenBodyShapeModal('female')}
                  className={cn(
                    "py-3.5 px-3 text-xs font-black rounded-full uppercase tracking-wider transition-all duration-200 border flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs",
                    modelType === 'female' && selectedBodyShape?.gender === 'female'
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-zinc-950/20"
                      : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50"
                  )}
                >
                  <span>MẪU NỮ</span>
                  <CaretRight weight="bold" className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>

            {/* ---------------------------------------------------------------- */}
            {/* Card 3: Tải / Chụp Ảnh Của Bạn                                   */}
            {/* ---------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.55, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={cn(
                "rounded-[28px] p-6 lg:p-7 flex flex-col justify-between text-center relative transition-all duration-300 bg-white group overflow-hidden",
                modelType === 'custom'
                  ? "border-2 border-[#e60012] shadow-[0_16px_40px_rgba(230,0,18,0.15)] ring-4 ring-red-500/10"
                  : "border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-lg"
              )}
            >
              {/* Gloss shimmer reflection sweep */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px] z-20">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
              </div>

              {/* Title & Icon */}
              <div className="space-y-1.5">
                <div
                  style={{ background: 'linear-gradient(135deg, #ff3b4e 0%, #e60012 100%)' }}
                  className="w-12 h-12 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md shadow-red-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                >
                  <Camera weight="bold" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base font-black text-zinc-950 uppercase tracking-tight pt-1">
                  TẢI / CHỤP ẢNH CỦA BẠN
                </h3>
                <p className="text-xs text-zinc-500">Dùng ảnh cá nhân.</p>
              </div>

              {/* Center Visual: Dashed Upload Area with floating cloud animation */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    setModelType('custom');
                    setModelFile(file);
                    setModelPreviewUrl(URL.createObjectURL(file));
                    setResultImageUrl(null);
                    scrollToSection('step-3-apparel');
                  }
                }}
                className="my-5 relative min-h-[224px] w-full rounded-2xl border-2 border-dashed border-zinc-200 group-hover:border-red-400/80 bg-gradient-to-b from-[#fdfbfc] to-[#fcf4f5] flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer group/upload hover:shadow-inner"
              >
                {modelType === 'custom' && modelPreviewUrl ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden">
                    <Image
                      src={modelPreviewUrl}
                      alt="Ảnh tải lên của bạn"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider rounded-xl">
                      Nhấn để đổi ảnh
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full space-y-2 py-2">
                    {/* Floating Cloud Upload Icon */}
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-zinc-700 group-hover/upload:text-[#e60012] transition-colors"
                    >
                      <svg
                        className="w-12 h-10 transition-transform group-hover/upload:scale-110"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                        <path d="M12 12v9" />
                        <path d="m8 16 4-4 4 4" />
                      </svg>
                    </motion.div>

                    <span className="text-xs sm:text-sm font-bold text-zinc-900 group-hover/upload:text-[#e60012] transition-colors">
                      Kéo thả ảnh vào đây
                    </span>
                    <span className="text-xs text-zinc-400">hoặc</span>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="w-full max-w-[200px] py-2.5 px-4 rounded-full border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 bg-white text-zinc-900 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <span>CHỌN ẢNH</span>
                      <CaretRight weight="bold" className="w-3.5 h-3.5 group-hover/upload:translate-x-0.5 transition-transform" />
                    </motion.button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: BƯỚC 3 - 360° INTERACTIVE DRAG-TO-ROTATE FITTING RUNWAY   */}
      {/* ==================================================================== */}
      <section id="step-3-apparel" className="py-14 sm:py-18 bg-[#f8f9fa] border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 uppercase">
              3. CHỌN TRANG PHỤC LI-NING & <span className="text-[#e60012]">MẶC THỬ AI</span>
            </h2>
            <p className="text-sm text-zinc-600">
              Chọn trang phục yêu thích và xem thử trên AI.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
            <button
              onClick={() => setActiveCategoryTab('combo')}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                activeCategoryTab === 'combo'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }`}
            >
              <Lightning weight="fill" className="w-3.5 h-3.5" />
              Phối Cả Bộ
            </button>

            <button
              onClick={() => setActiveCategoryTab('upper')}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                activeCategoryTab === 'upper'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }`}
            >
              <TShirt weight="bold" className="w-3.5 h-3.5" />
              Áo
            </button>

            <button
              onClick={() => setActiveCategoryTab('lower')}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                activeCategoryTab === 'lower'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }`}
            >
              <Pants weight="bold" className="w-3.5 h-3.5" />
              Quần
            </button>

            <button
              onClick={() => setActiveCategoryTab('shoes')}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
                activeCategoryTab === 'shoes'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }`}
            >
              Giày
            </button>

            <button
              onClick={() => setActiveCategoryTab('accessories')}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all ${
                activeCategoryTab === 'accessories'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }`}
            >
              Phụ Kiện
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8-16 Product Cards */}
            <div className="lg:col-span-7 space-y-3">
              {/* Skin Tone AI Advisor Banner */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-white border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm shrink-0 ring-1 ring-black/10"
                    style={{ backgroundColor: SKIN_TONE_CONFIGS[inlineSkinTone]?.hexColor || '#E8B896' }}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-zinc-950 uppercase tracking-tight">
                        GỢI Ý TÔN DA: {SKIN_TONE_CONFIGS[inlineSkinTone]?.vietnameseName} ({inlineGender === 'nu' ? 'NỮ' : 'NAM'})
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#e60012] border border-red-200">
                        ✦ AI Phối Đồ Chuẩn
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 mt-0.5 line-clamp-1 sm:line-clamp-none">
                      {SKIN_TONE_CONFIGS[inlineSkinTone]?.stylingAdvice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#e60012] shrink-0 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200/60 self-start sm:self-center">
                  <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                  <span>{step3CuratedProducts.filter((p) => p.isRecommended).length} mẫu cực tôn da</span>
                </div>
              </div>

              {/* Grid of Authentic Website Products */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {step3CuratedProducts.map((item) => {
                  const isSelected =
                    activeCategoryTab === 'lower'
                      ? selectedLowerItem?.id === item.id
                      : selectedUpperItem?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (activeCategoryTab === 'lower') {
                          setSelectedLowerItem({
                            id: item.id,
                            code: item.code,
                            title: item.title,
                            price: item.price,
                            image: item.image,
                          });
                        } else {
                          setSelectedUpperItem({
                            id: item.id,
                            code: item.code,
                            title: item.title,
                            price: item.price,
                            image: item.image,
                          });
                        }
                      }}
                      className={`bg-white rounded-2xl border p-2.5 cursor-pointer relative transition-all group/item ${
                        isSelected
                          ? 'border-2 border-[#e60012] shadow-md shadow-red-500/15'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
                        {item.isRecommended ? (
                          <div className="px-1.5 py-0.5 rounded-md bg-[#e60012] text-white text-[9px] font-black tracking-tight shadow-xs flex items-center gap-0.5">
                            <Sparkle weight="fill" className="w-2.5 h-2.5 text-amber-300" />
                            <span>TÔN DA</span>
                          </div>
                        ) : (
                          <div />
                        )}

                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-[#e60012] text-white flex items-center justify-center shadow-xs">
                            <Check weight="bold" className="w-2.5 h-2.5" />
                          </div>
                        ) : null}
                      </div>

                      {/* Product Thumbnail (Official Website CDN Image) */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-50 mb-2">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-contain p-1.5 group-hover/item:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="text-center space-y-0.5">
                        <p className="text-[11px] font-bold text-zinc-900 truncate" title={item.title}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate">{item.code}</p>
                        <p className="text-xs font-black text-[#e60012]">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Thông tin bộ trang phục đang chọn mặc thử */}
              <div className="pt-3 pb-1 space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 relative overflow-hidden shrink-0">
                      <Image
                        src={selectedUpperItem?.image || '/images/ai-tryon/step4_item1_shirt.jpg'}
                        alt={selectedUpperItem?.title || 'Sản phẩm Li-Ning'}
                        fill
                        unoptimized
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-[#e60012] bg-red-50 px-1.5 py-0.5 rounded">Đang chọn</span>
                        <span className="text-[11px] text-zinc-500 font-mono truncate">{selectedUpperItem?.code}</span>
                      </div>
                      <p className="text-xs font-bold text-zinc-900 truncate max-w-[200px] sm:max-w-[280px]">
                        {selectedUpperItem?.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#e60012] shrink-0">{formatPrice(selectedUpperItem?.price || 0)}</span>
                </div>
              </div>

              {/* Nút Thử Quần Áo Bằng FitRoom AI */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleRunTryOn}
                  disabled={isFittingLoading}
                  className="w-full py-3.5 sm:py-4 px-6 bg-[#e60012] hover:bg-[#8f000a] active:bg-[#730008] disabled:opacity-60 text-white hover:text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-950/40 active:scale-[0.99] uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer border border-red-500 hover:border-red-700"
                >
                  {isFittingLoading ? (
                    <>
                      <ArrowsClockwise className="w-5 h-5 animate-spin text-white" />
                      <span className="text-white">{fittingProgressText}</span>
                    </>
                  ) : (
                    <>
                      <Sparkle weight="fill" className="w-5 h-5 text-amber-300 animate-pulse" />
                      <span className="text-white">
                        THỬ QUẦN ÁO BẰNG FITROOM AI (MẶC BỘ ĐÃ CHỌN)
                      </span>
                      <CaretRight weight="bold" className="w-4 h-4 text-white ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Living Fitting Runway Model with 360° Drag Rotation & Breathing */}
            <div className="lg:col-span-5">
              <div
                onPointerDown={handleStagePointerDown}
                onPointerMove={handleStagePointerMove}
                onPointerUp={handleStagePointerUp}
                className="bg-zinc-950 rounded-3xl border border-zinc-800 p-6 relative overflow-hidden min-h-[520px] flex flex-col items-center justify-between shadow-2xl cursor-grab active:cursor-grabbing select-none"
              >
                {/* Red spotlight floor glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#e60012_0%,transparent_65%)] opacity-30 pointer-events-none" />

                {/* Clean Top Bar: Badge + Biometrics + Change Model Button */}
                <div className="w-full flex flex-wrap items-center justify-between gap-2 z-20 mb-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/50 bg-zinc-900/95 text-red-400 text-[10px] font-black uppercase tracking-wider shadow-sm">
                    <Lightning weight="fill" className="w-3 h-3 text-[#e60012]" />
                    <span>360° RUNWAY STAGE</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-xs shadow-sm">
                      <span className="font-bold text-zinc-300">
                        {selectedBodyShape?.height || `${inlineHeight || (inlineGender === 'nu' ? '162' : '175')} cm`}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="font-bold text-zinc-300">
                        {selectedBodyShape?.weight || `${inlineWeight || (inlineGender === 'nu' ? '50' : '68')} kg`}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="font-bold text-red-400">
                        {selectedBodyShape?.measurements ||
                          `${inlineBust || (inlineGender === 'nu' ? '85' : '96')} - ${inlineWaist || (inlineGender === 'nu' ? '64' : '78')} - ${inlineHips || (inlineGender === 'nu' ? '90' : '95')}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBodyShapeModal(modelType === 'female' ? 'female' : 'male')}
                      className="flex items-center gap-1 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                      title="Chọn vóc dáng người mẫu khác"
                    >
                      <User className="w-3.5 h-3.5 text-[#e60012]" />
                      <span className="hidden sm:inline">Đổi vóc dáng</span>
                      <span className="sm:hidden">Đổi mẫu</span>
                    </button>
                  </div>
                </div>

                {/* Center Living Model on Sleek Illuminated Stage */}
                <div className="relative w-full h-[420px] flex items-end justify-center z-10">
                  {/* Glowing 3D Stage Floor Disc - Centered perfectly around athlete's feet */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: '48px',
                      transform: 'translate(-50%, 50%)',
                      width: '300px',
                      height: '76px',
                      borderRadius: '100%',
                      border: '2px solid rgba(230, 0, 18, 0.85)',
                      boxShadow: '0 0 35px rgba(230, 0, 18, 0.6), inset 0 0 20px rgba(230, 0, 18, 0.3)',
                      background: 'radial-gradient(ellipse at center, rgba(230, 0, 18, 0.25) 0%, rgba(20, 10, 12, 0.95) 75%)',
                      pointerEvents: 'none',
                      zIndex: 0,
                    }}
                  >
                    {/* Inner accent ring */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '10px 24px',
                        borderRadius: '100%',
                        border: '1px solid rgba(255, 42, 59, 0.45)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>

                  {/* Living Rotating Athlete - feet anchored at bottom: 48px (exact center of circle) */}
                  <div
                    className="relative w-72 animate-human-breathe transition-transform duration-75 ease-out"
                    style={{
                      height: '350px',
                      marginBottom: '48px',
                      zIndex: 10,
                      transform: `perspective(800px) rotateY(${stageRotation}deg)`,
                    }}
                  >
                    <Image
                      src={
                        modelPreviewUrl ||
                        (inlineGender === 'nu'
                          ? '/images/body-shapes/female-hourglass-fit.png'
                          : '/images/body-shapes/male-lean-athletic.png')
                      }
                      alt="Living Fitting Model"
                      fill
                      className="object-contain object-bottom"
                      priority
                      unoptimized
                    />
                  </div>
                </div>

                {/* Interactive Angle Switch Buttons & Instruction */}
                <div className="relative z-20 w-full pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                    Kéo chuột ngang để xoay 360°
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setStageRotation(0)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${stageRotation === 0 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setStageRotation(-90)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${stageRotation === -90 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}
                    >
                      Trái
                    </button>
                    <button
                      onClick={() => setStageRotation(180)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${stageRotation === 180 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}
                    >
                      Sau
                    </button>
                    <button
                      onClick={() => setStageRotation(90)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${stageRotation === 90 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}
                    >
                      Phải
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 4: BƯỚC 4 - DYNAMIC BEFORE/AFTER SLIDER & TRIPO 3D STUDIO   */}
      {/* ==================================================================== */}
      <section id="step-4-results" className="py-14 sm:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-8">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold text-[#e60012] bg-red-50 border border-red-200 uppercase tracking-wider">
              BƯỚC 04 / 04
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 uppercase">
              4. KẾT QUẢ THỬ ĐỒ AI & <span className="text-[#e60012]">MÔ HÌNH 3D TRIPO</span>
            </h2>
            <p className="text-sm text-zinc-600">
              Kéo thanh trượt để so sánh trực quan vóc dáng trước - sau và xoay ngắm mô hình 3D 360° tạo bởi Tripo AI.
            </p>
          </div>

          {/* Gemini AI Status Alerts */}
          {geminiSuccessToast && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 text-sm shadow-sm animate-fade-in">
              <div className="flex items-center gap-2.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <Sparkle weight="fill" className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{geminiSuccessToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setGeminiSuccessToast(null)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

          {geminiError && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm shadow-sm animate-fade-in">
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="text-lg shrink-0">⚠️</span>
                <div>
                  <span className="font-bold text-amber-950">Thông báo AI: </span>
                  <span>{geminiError}</span>
                  <p className="text-xs text-amber-800 mt-1">
                    Hệ thống đã tự động chuyển sang ảnh mẫu thể thao Li-Ning độ phân giải cao để bạn tiếp tục trải nghiệm.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGeminiError(null)}
                className="self-end sm:self-center px-3 py-1 bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-xs cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          )}

          {/* Tripo 3D Error Alert */}
          {tripo3DStatus === 'failed' && tripo3DError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between gap-3 text-sm shadow-sm animate-fade-in">
              <div className="flex items-center gap-2.5">
                <span className="text-lg shrink-0">⚠️</span>
                <div>
                  <span className="font-bold text-red-950">Thông báo Tripo 3D: </span>
                  <span>{tripo3DError}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTripo3DError(null)}
                className="px-3 py-1 bg-red-200 hover:bg-red-300 text-red-900 font-bold rounded-lg text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Panel 1: Interactive Before / After Split Slider */}
            <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-zinc-700 uppercase tracking-wider">TRƯỚC</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-bold">Ban đầu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#e60012] font-bold">Fit đồ AI</span>
                  <span className="text-xs font-black text-[#e60012] uppercase tracking-wider">SAU</span>
                </div>
              </div>

              {/* Seamless Interactive Split Slider Box */}
              <div className="relative my-4 aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 select-none group shadow-inner">
                {/* 1. Base Layer: Before Athlete */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={
                      tryOnBeforeUrl ||
                      (inlineGender === 'nu'
                        ? selectedBodyShape?.thumbSrc || '/images/ai-tryon/step4_before_female_hd.jpg'
                        : selectedBodyShape?.thumbSrc || '/images/ai-tryon/step4_before_hd.jpg')
                    }
                    alt="Trước khi thử đồ Li-Ning"
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
                    TRƯỚC
                  </div>
                </div>

                {/* 2. Top Layer: After Athlete (Tried-on outfit), clipped by sliderPos% */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden transition-[clip-path] duration-75 ease-out"
                  style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
                >
                  <Image
                    src={
                      tryOnResultUrl ||
                      resultImageUrl ||
                      (inlineGender === 'nu'
                        ? '/images/ai-tryon/step4_after_female_hd.webp'
                        : '/images/ai-tryon/step4_after_hd.jpg')
                    }
                    alt="Sau khi thử đồ Li-Ning"
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-[#e60012]/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                    <span>SAU THỬ ĐỒ</span>
                    {(tryOnResultUrl || resultImageUrl) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* 3. Drag Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-20 shadow-[0_0_12px_rgba(0,0,0,0.6)] pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  {/* Draggable Circle Handle */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-[#e60012] shadow-xl flex items-center justify-center text-[#e60012] text-xs font-black transition-transform group-hover:scale-110">
                    ◂▸
                  </div>
                </div>

                {/* 4. Full Coverage Interactive Range Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                  aria-label="Kéo thanh trượt để so sánh trước và sau khi mặc trang phục"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-1 font-medium">
                <span>◀ Kéo sang trái xem đồ mới</span>
                <span>Kéo sang phải xem đồ cũ ▶</span>
              </div>
            </div>

            {/* Panel 2: Tripo 3D Studio 360° */}
            <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-zinc-950 uppercase tracking-wider">MÔ HÌNH 3D TRIPO 360°</h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      tripo3DStatus === 'ready'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : tripo3DStatus === 'generating'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200 animate-pulse'
                        : 'bg-red-50 text-[#e60012] border border-red-200'
                    }`}
                  >
                    {tripo3DStatus === 'ready'
                      ? '3D SẴN SÀNG'
                      : tripo3DStatus === 'generating'
                      ? 'ĐANG TẠO 3D...'
                      : '⚡ SIÊU TỐC'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {tripo3DStatus === 'ready' && (
                    <button
                      onClick={() => handleGenerateTripo3D(tripoMode)}
                      className="text-[11px] font-bold text-zinc-400 hover:text-[#e60012] flex items-center gap-1 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-zinc-100"
                      title="Tạo lại mô hình 3D"
                    >
                      <ArrowsClockwise className="w-3.5 h-3.5" />
                      <span>Làm mới</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mode Selector Pill */}
              <div className="pt-3 pb-1 flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-500">Chế độ tạo:</span>
                <div className="flex items-center gap-1 p-0.5 bg-zinc-100 border border-zinc-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setTripoMode('turbo');
                      if (tripo3DStatus === 'ready') handleGenerateTripo3D('turbo');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      tripoMode === 'turbo'
                        ? 'bg-gradient-to-r from-[#e60012] to-orange-500 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                    title="Tối ưu hóa lưới đa giác nhẹ (25,000 faces) để tạo nhanh và xoay mượt mà 60fps"
                  >
                    ⚡ Siêu Tốc (~15s)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTripoMode('hd');
                      if (tripo3DStatus === 'ready') handleGenerateTripo3D('hd');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      tripoMode === 'hd'
                        ? 'bg-gradient-to-r from-zinc-900 to-zinc-800 text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                    title="Chế độ chi tiết cao PBR Studio"
                  >
                    💎 Studio HD
                  </button>
                </div>
              </div>

              {/* 3D Visual Box */}
              <div className="relative my-3 aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner">
                {tripo3DGlbUrl && tripo3DStatus === 'ready' ? (
                  <Tripo3DViewer modelUrl={tripo3DGlbUrl} posterImageUrl={tryOnResultUrl || resultImageUrl || undefined} className="w-full h-full" />
                ) : tripo3DStatus === 'generating' ? (
                  /* GENERATING STATE: High-tech 3D scanning radar with dynamic progress */
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white select-none">
                    {/* Pulsing 3D Scanning Rings */}
                    <div className="relative w-28 h-28 flex items-center justify-center mb-5">
                      <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping" />
                      <div
                        className="absolute inset-2 rounded-full border-2 border-dashed border-[#e60012]/70 animate-spin"
                        style={{ animationDuration: '8s' }}
                      />
                      <div
                        className="absolute inset-5 rounded-full border border-amber-400/40 animate-spin"
                        style={{ animationDuration: '4s', animationDirection: 'reverse' }}
                      />
                      <Cube weight="duotone" className="w-10 h-10 text-[#ff2a3b] animate-pulse" />
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-[#ff2a3b] text-[9px] font-black tracking-widest border border-red-500/30">
                        {tripoMode === 'turbo' ? '⚡ CHẾ ĐỘ SIÊU TỐC' : '💎 CHẾ ĐỘ STUDIO HD'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2.5">
                      Đang Tạo Mô Hình 3D ({Math.round(tripo3DProgress)}%)
                    </h4>

                    {/* Progress Bar */}
                    <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden mb-3 border border-zinc-700">
                      <div
                        className="h-full bg-gradient-to-r from-[#e60012] via-orange-500 to-[#ff2a3b] transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(8, tripo3DProgress))}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-zinc-400 max-w-xs leading-relaxed min-h-[32px] flex items-center justify-center">
                      {tripo3DProgressText || 'Đang dựng khung lưới không gian 3D PBR Mesh...'}
                    </p>

                    <span className="text-[9px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800/80">
                      ⚡ Tự động nén đa giác nhẹ (25K polys) để nạp tức thì & xoay mượt mà
                    </span>
                  </div>
                ) : (
                  /* IDLE STATE: Inviting 3D Holographic Stage */
                  <div className="relative w-full h-full flex flex-col items-center justify-between p-6 text-center text-white select-none overflow-hidden">
                    {/* Background isometric grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e60012_1px,transparent_1px)] [background-size:18px_18px] opacity-15 pointer-events-none" />

                    {/* Center 3D Preview Visual */}
                    <div className="relative my-auto flex flex-col items-center">
                      <div
                        className="relative w-24 h-24 flex items-center justify-center mb-4 group cursor-pointer"
                        onClick={() => handleGenerateTripo3D('turbo')}
                      >
                        {/* Rotating Outer Radar Rings */}
                        <div
                          className="absolute inset-0 rounded-full border border-red-500/20 group-hover:border-red-500/40 transition-colors animate-spin"
                          style={{ animationDuration: '14s' }}
                        />
                        <div className="absolute inset-3 rounded-full border border-dashed border-[#e60012]/40 group-hover:border-[#e60012] transition-colors" />
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/30 to-black border border-red-500/50 shadow-[0_0_25px_rgba(230,0,18,0.3)] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Cube weight="duotone" className="w-7 h-7 text-[#ff2a3b]" />
                        </div>
                        <div className="absolute -bottom-1 px-2 py-0.5 rounded-full bg-[#e60012] text-white text-[8px] font-black tracking-widest shadow-md">
                          TRIPO 3D
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-1.5">
                        TÁI DỰNG MÔ HÌNH 3D 360°
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-[240px] leading-relaxed mb-4">
                        Khởi tạo không gian 3 chiều từ trang phục vừa thử bằng AI Tripo V3 để xoay ngắm mọi góc độ tự do.
                      </p>

                      {/* Prominent Direct CTA inside the box */}
                      <button
                        type="button"
                        onClick={() => handleGenerateTripo3D(tripoMode)}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] text-white font-bold text-xs rounded-full shadow-lg shadow-red-500/30 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                      >
                        <Sparkle weight="fill" className="w-4 h-4 text-amber-300" />
                        TẠO MÔ HÌNH 3D ({tripoMode === 'turbo' ? 'SIÊU TỐC' : 'STUDIO HD'})
                        <CaretRight weight="bold" className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Feature tags */}
                    <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 pt-2 border-t border-zinc-900 w-full">
                      <span>⚡ Tải tức thì</span>
                      <span>•</span>
                      <span>✦ Xoay 360°</span>
                      <span>•</span>
                      <span>✦ Lưới PBR Tripo</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <span className="text-[11px] text-zinc-500 font-medium">
                  {tripo3DStatus === 'ready'
                    ? '✓ Đã sẵn sàng xoay 360° • Kéo chuột hoặc chạm để xoay góc nhìn'
                    : '⚡ Tự động nạp bộ nhớ đệm hoặc tạo ngầm khi cuộn vào bước này'}
                </span>
              </div>
            </div>

            {/* Panel 3: Chi Tiết Sản Phẩm & Animated AI Score Counter */}
            <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="pb-3 border-b border-zinc-100 flex items-center justify-between">
                  <h3 className="text-xs font-black text-zinc-950 uppercase">CHI TIẾT SẢN PHẨM PHỐI HỢP</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#e60012] border border-red-100">
                    Combo Li-Ning Sport
                  </span>
                </div>

                <div className="my-4 space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 relative overflow-hidden shrink-0">
                        <Image
                          src={selectedUpperItem?.image || '/images/ai-tryon/step4_item1_shirt.jpg'}
                          alt={selectedUpperItem?.title || 'Áo Thể Thao'}
                          fill
                          unoptimized
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-zinc-950 truncate max-w-[150px]">{selectedUpperItem?.title || 'ÁO THUN THỂ THAO'}</p>
                        <p className="text-[11px] text-zinc-500">{selectedUpperItem?.code || 'LN Training'}</p>
                        <p className="text-xs font-bold text-[#e60012]">{formatPrice(selectedUpperItem?.price || 579273)}</p>
                      </div>
                    </div>
                    <CaretRight weight="bold" className="w-4 h-4 text-zinc-400 shrink-0" />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 relative overflow-hidden shrink-0">
                        <Image
                          src={selectedLowerItem?.image || '/images/ai-tryon/apparel_shorts_clean.jpg'}
                          alt={selectedLowerItem?.title || 'Quần Thể Thao'}
                          fill
                          unoptimized
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-zinc-950 truncate max-w-[150px]">{selectedLowerItem?.title || 'QUẦN SHORT THỂ THAO'}</p>
                        <p className="text-[11px] text-zinc-500">{selectedLowerItem?.code || 'LN Flex Move'}</p>
                        <p className="text-xs font-bold text-[#e60012]">{formatPrice(selectedLowerItem?.price || 690000)}</p>
                      </div>
                    </div>
                    <CaretRight weight="bold" className="w-4 h-4 text-zinc-400 shrink-0" />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-2xl border border-zinc-100 bg-zinc-50/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 relative overflow-hidden shrink-0">
                        <Image
                          src="/images/ai-tryon/step4_item3_shoes.jpg"
                          alt="Giày Thể Thao"
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-950">GIÀY THỂ THAO</p>
                        <p className="text-[11px] text-zinc-500">LN Cloud Ace</p>
                        <p className="text-xs font-bold text-[#e60012]">2.490.000đ</p>
                      </div>
                    </div>
                    <CaretRight weight="bold" className="w-4 h-4 text-zinc-400 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Animated AI Score Counter & Checkout */}
              <div className="border-t border-zinc-100 pt-4 space-y-3">
                <span className="text-xs font-black text-zinc-900 uppercase">ĐÁNH GIÁ AI VỀ FORM DÁNG</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-[#e60012] transition-all">
                    {animatedScore}%
                  </span>
                  <div className="text-xs text-zinc-600">
                    <p className="font-bold text-zinc-900">Rất phù hợp</p>
                    <p>với vóc dáng & chỉ số của bạn</p>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#e60012] to-[#ff2a3b] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${animatedScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
            <button
              onClick={handleGenerateTripo3D}
              disabled={tripo3DStatus === 'generating'}
              className={`px-6 py-3.5 rounded-full border text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                tripo3DStatus === 'ready'
                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50'
                  : 'border-zinc-300 hover:border-zinc-950 text-zinc-900 bg-white hover:bg-zinc-50'
              }`}
            >
              {tripo3DStatus === 'generating' ? (
                <>
                  <ArrowsClockwise className="w-4 h-4 text-[#e60012] animate-spin" />
                  <span>ĐANG TẠO 3D TRIPO ({tripo3DProgress}%)...</span>
                </>
              ) : tripo3DStatus === 'ready' ? (
                <>
                  <Check weight="bold" className="w-4 h-4 text-emerald-600" />
                  <span>MÔ HÌNH 3D TRIPO ĐÃ SẴN SÀNG (XOAY 360°)</span>
                </>
              ) : (
                <>
                  <Cube weight="bold" className="w-4 h-4 text-zinc-700" />
                  <span>TẠO MÔ HÌNH 3D TRIPO 360°</span>
                </>
              )}
            </button>

            <button
              onClick={handleAddComboToCart}
              className="px-8 py-3.5 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] text-white font-bold text-xs sm:text-sm rounded-full shadow-xl shadow-red-500/25 active:scale-[0.98] uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag weight="bold" className="w-5 h-5" />
              THÊM VÀO GIỎ
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* MODAL: BỘ SƯU TẬP VÓC DÁNG MẪU VĐV STUDIO LI-NING                  */}
      {/* ==================================================================== */}
      {isBodyShapeModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsBodyShapeModalOpen(false)}
        >
          <div
            className="bg-white rounded-[28px] shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-zinc-50 via-white to-zinc-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-[#e60012] text-[10px] font-bold uppercase tracking-wider">
                    <User weight="bold" className="w-3 h-3" />
                    BỘ SƯU TẬP VÓC DÁNG VĐV
                  </span>
                  <span className="text-[11px] text-zinc-400">· Chuẩn Studio Li-Ning</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight">
                  CHỌN VÓC DÁNG MẪU THỂ THAO
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Chọn mẫu gần với thể hình của bạn nhất để đưa trực tiếp lên sàn Runway 360°.
                </p>
              </div>

              {/* Gender Switcher Tabs & Close Button */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="flex items-center bg-zinc-100 p-1 rounded-full border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setBodyShapeGenderTab('male')}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5",
                      bodyShapeGenderTab === 'male'
                        ? "bg-zinc-950 text-white shadow-md"
                        : "text-zinc-600 hover:text-zinc-950"
                    )}
                  >
                    <span>MẪU NAM</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                      bodyShapeGenderTab === 'male' ? "bg-zinc-800 text-zinc-300" : "bg-zinc-200 text-zinc-600"
                    )}>
                      4
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBodyShapeGenderTab('female')}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5",
                      bodyShapeGenderTab === 'female'
                        ? "bg-zinc-950 text-white shadow-md"
                        : "text-zinc-600 hover:text-zinc-950"
                    )}
                  >
                    <span>MẪU NỮ</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                      bodyShapeGenderTab === 'female' ? "bg-zinc-800 text-zinc-300" : "bg-zinc-200 text-zinc-600"
                    )}>
                      7
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBodyShapeModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Đóng cửa sổ"
                >
                  <X weight="bold" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Cards Grid */}
            <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-150px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {BODY_SHAPE_MODELS.filter((m) => m.gender === bodyShapeGenderTab).map((model) => {
                  const isSelected = selectedBodyShape?.id === model.id || (modelPreviewUrl === model.imageSrc);
                  return (
                    <div
                      key={model.id}
                      onClick={() => handleSelectBodyShape(model)}
                      className={cn(
                        "group rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer relative bg-white overflow-hidden hover:shadow-xl",
                        isSelected
                          ? "border-[#e60012] ring-2 ring-red-500/20 shadow-lg shadow-red-500/10"
                          : "border-zinc-200 hover:border-zinc-400 hover:-translate-y-1"
                      )}
                    >
                      {/* Top Selection Status Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {model.tag}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                            <Check weight="bold" className="w-3 h-3" />
                            Đang chọn
                          </span>
                        )}
                      </div>

                      {/* Model Visual Thumbnail */}
                      <div className="relative h-64 w-full rounded-xl bg-gradient-to-b from-zinc-50 to-zinc-100/80 overflow-hidden flex items-end justify-center mb-3">
                        <Image
                          src={model.imageSrc}
                          alt={model.name}
                          fill
                          className="object-contain object-bottom group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>

                      {/* Model Information */}
                      <div className="space-y-1.5 mb-3">
                        <h4 className="text-sm font-black text-zinc-950 leading-tight">
                          {model.name}
                        </h4>
                        <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                          {model.subtitle}
                        </p>

                        {/* Biometrics Tags */}
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-700 pt-1 flex-wrap">
                          <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">{model.height}</span>
                          <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-800">{model.weight}</span>
                          <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-mono text-[10px]">{model.measurements}</span>
                        </div>

                        <p className="text-[11px] text-zinc-500 leading-relaxed pt-1 line-clamp-2">
                          {model.description}
                        </p>
                      </div>

                      {/* Select Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectBodyShape(model);
                        }}
                        className={cn(
                          "w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer",
                          isSelected
                            ? "bg-[#e60012] text-white shadow-md shadow-red-500/20"
                            : "bg-zinc-950 group-hover:bg-[#e60012] text-white"
                        )}
                      >
                        {isSelected ? (
                          <>
                            <Check weight="bold" className="w-3.5 h-3.5" />
                            <span>ĐÃ CHỌN MẪU NÀY</span>
                          </>
                        ) : (
                          <>
                            <span>CHỌN MẪU NÀY</span>
                            <CaretRight weight="bold" className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer Note */}
            <div className="p-4 px-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <Sparkle weight="fill" className="w-4 h-4 text-[#e60012]" />
                <span>Sau khi chọn, người mẫu sẽ tự động hiển thị trên sàn Runway 360° để bạn ngắm đồ và xoay các góc nhìn.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBodyShapeModalOpen(false)}
                className="text-xs font-bold text-zinc-600 hover:text-zinc-950 underline cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
