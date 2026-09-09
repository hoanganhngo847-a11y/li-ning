import fs from 'fs';
import path from 'path';

const targetFile = '/Users/hoangthuy/.gemini/antigravity/brain/2ec2e31f-cec6-4bf2-8961-5e492324bb2a/scratch/AiSportsStylistSection.tsx';

const code = `'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useFitRoom, CustomerBodyProfile } from './fitroom/FitRoomContext';
import { formatPrice } from '@/app/lib/utils';
import Hy3DViewer from './fitroom/Hy3DViewer';
import {
  ALL_SKIN_TONES,
  SKIN_TONE_CONFIGS,
  SkinToneId,
  SkinToneConfig,
} from '@/app/lib/fitroom/color-advisor';
import {
  CatalogGarment,
  getSuggestedGarments,
  getAvailableCategories,
  ALL_APPAREL_GARMENTS,
} from '@/app/lib/fitroom/catalog-helper';
import { useCart } from '@/app/lib/cart-context';
import type { Product } from '@/app/lib/types';
import { products } from '@/app/lib/data/products';
import {
  ArrowRight,
  CaretRight,
  CaretLeft,
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
  MagnifyingGlass,
  Heart,
  Camera,
  UploadSimple,
  DownloadSimple,
  ShareNetwork,
  ShoppingBag,
  ArrowsClockwise,
  Eye,
  ShieldCheck,
  X,
  Sliders,
  Info,
  Crosshair,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';

export type PresetGarment = CatalogGarment;

export default function AiSportsStylistSection() {
  const {
    selectedUpper,
    selectedLower,
    customerProfile,
    customAvatarUrl,
    isGeneratingAvatar,
    regenerateAvatar,
    bodyMetrics,
    saveCustomerProfile,
    getSuggestedSize,
  } = useFitRoom();

  const { addItem } = useCart();
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Active step tracker for the sticky/anchor stepper
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -90; // offset for sticky navigation header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scroll spy to highlight current section in stepper
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

  // Sync inline form with stored customerProfile if loaded
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

  // Quick Preset Fillers when toggling gender
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
    }
    setStep1Error(null);
  };

  // Step 1 Submission -> Save profile & Scroll to Step 2
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
      setStep1Error('Vui lòng nhập chiều cao hợp lệ (từ 100cm).');
      return;
    }
    if (!inlineWeight || Number(inlineWeight) < 30) {
      setStep1Error('Vui lòng nhập cân nặng hợp lệ (từ 30kg).');
      return;
    }
    if (!inlineBust || !inlineWaist || !inlineHips) {
      setStep1Error('Vui lòng điền đủ số đo 3 vòng (V1, V2, V3).');
      return;
    }

    saveCustomerProfile({
      fullName: inlineFullName.trim(),
      age: Number(inlineAge),
      gender: inlineGender,
      height: Number(inlineHeight),
      weight: Number(inlineWeight),
      bust: Number(inlineBust),
      waist: Number(inlineWaist),
      hips: Number(inlineHips),
      skinTone: inlineSkinTone,
    });

    setCatalogGender(inlineGender);
    setStep1Error(null);
    scrollToSection('step-2-model');
  };

  // ============================================================================
  // STEP 2: MODEL SELECTION & GENERATION STATE
  // ============================================================================
  const [modelType, setModelType] = useState<'profile_avatar' | 'male' | 'female' | 'custom'>('profile_avatar');
  const [modelPreviewUrl, setModelPreviewUrl] = useState<string>(
    customAvatarUrl || '/images/ai-tryon/v2-step3.jpg'
  );
  const [modelFile, setModelFile] = useState<File | Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview when customAvatarUrl changes
  useEffect(() => {
    if (customAvatarUrl && modelType === 'profile_avatar') {
      setModelPreviewUrl(customAvatarUrl);
    }
  }, [customAvatarUrl, modelType]);

  // Handler: User explicitly clicks to generate AI avatar from measurements
  const handleGenerateAiAvatar = async () => {
    try {
      setModelType('profile_avatar');
      const targetProfile: CustomerBodyProfile = {
        fullName: inlineFullName.trim(),
        age: Number(inlineAge),
        gender: inlineGender,
        height: Number(inlineHeight),
        weight: Number(inlineWeight),
        bust: Number(inlineBust),
        waist: Number(inlineWaist),
        hips: Number(inlineHips),
        skinTone: inlineSkinTone,
        isCompleted: true,
      };
      await regenerateAvatar(true, targetProfile);
      setResultImageUrl(null);
      scrollToSection('step-3-apparel');
    } catch (err) {
      console.error('Error generating AI avatar:', err);
    }
  };

  // Handler: Select Preset Studio Model
  const handleSelectPresetModel = (type: 'male' | 'female') => {
    setModelType(type);
    const url = type === 'male' ? '/images/athlete-3d-preview.jpg' : '/images/female-athlete-3d-preview.jpg';
    setModelPreviewUrl(url);
    setModelFile(null);
    setResultImageUrl(null);
    scrollToSection('step-3-apparel');
  };

  // Handler: Upload custom photo (direct to FitRoom)
  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 15MB.');
      return;
    }

    setModelType('custom');
    setModelFile(file);
    setModelPreviewUrl(URL.createObjectURL(file));
    setResultImageUrl(null);
    scrollToSection('step-3-apparel');
  };

  // ============================================================================
  // STEP 3: GARMENT SELECTION & FILTERS
  // ============================================================================
  const [catalogGender, setCatalogGender] = useState<'nam' | 'nu' | 'all'>(
    customerProfile?.gender || 'nam'
  );
  const [activeCategoryTab, setActiveCategoryTab] = useState<'combo' | 'upper' | 'lower' | 'shoes' | 'accessories'>('combo');
  const [selectedSize, setSelectedSize] = useState<string>('L');

  // Curated 8 products for Step 3 grid matching image 4
  const step3CuratedProducts = useMemo(() => {
    return [
      {
        id: 'p-aplr125-9v',
        code: 'P-APLR125-9V',
        title: 'Áo Polo Nam Li-Ning Pro Fit',
        category: 'upper',
        price: 579273,
        image: 'https://cdn.hstatic.net/products/1000312752/_den_538897b224a94df7a6b75b5582f31474_c547941276204780828cdbdccf27de1c_d5e65ff3833c430db58fab7e1aa83bec.png',
        tag: 'Áo Polo',
      },
      {
        id: 'p-aplr125-10v',
        code: 'P-APLR125-10V',
        title: 'Áo Polo Thể Thao Xanh Navy',
        category: 'upper',
        price: 463418,
        image: 'https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__1__af68eb06330c47a0963f4b53b993ba3f_fa1c3956deed46ddacc847fa5edb2fad.jpg',
        tag: 'Áo Polo',
      },
      {
        id: 't-shirt-atsv731-2v',
        code: 'T-shirt ATSV731',
        title: 'Áo T-Shirt Thể Thao Họa Tiết Đỏ Đen',
        category: 'upper',
        price: 534109,
        image: 'https://cdn.hstatic.net/products/1000312752/atsw851-2_6b4a20b7538d47ebaeef8b3caab944bf.jpg',
        tag: 'T-shirt',
      },
      {
        id: 't-shirt-blue-tech',
        code: 'T-shirt Blue Tech',
        title: 'Áo Thun Thi Đấu Cầu Lông Xanh Dương',
        category: 'upper',
        price: 534109,
        image: 'https://cdn.hstatic.net/products/1000312752/atsw999-1_971e4eb4073e4a95a8b7e28a50e9eb86.jpg',
        tag: 'T-shirt',
      },
      {
        id: 'p-aplr125-7v',
        code: 'P-APLR125-7V',
        title: 'Áo Polo Thể Thao Trắng Tinh Tế',
        category: 'upper',
        price: 463418,
        image: 'https://cdn.hstatic.net/products/1000312752/p-aplr125-10v__2__699e6ed7de44480284dc0d68f371c788_0d37cb41267e49a695dc63b8b4556b09.jpg',
        tag: 'Áo Polo',
      },
      {
        id: 't-shirt-speed-red',
        code: 'T-shirt Speed Red',
        title: 'Áo Thun Tập Luyện Li-Ning Speed Striped',
        category: 'upper',
        price: 353454,
        image: 'https://cdn.hstatic.net/products/1000312752/atsv115-3_1d6c8b4d1b894178a8bc8f7c9e7075c3.jpg',
        tag: 'T-shirt',
      },
      {
        id: 't-shirt-athlete-set',
        code: 'T-shirt Athlete Set',
        title: 'Bộ Quần Áo Cầu Lông Li-Ning Match Day',
        category: 'combo',
        price: 455564,
        image: 'https://cdn.hstatic.net/products/1000312752/dsc08674_d6a079d990a14a58b59fe1242b6df1e0.jpg',
        tag: 'T-shirt',
      },
      {
        id: 't-shirt-graphic-gold',
        code: 'T-shirt Graphic Gold',
        title: 'Áo Thun Vàng Năng Động Graphic Wave',
        category: 'upper',
        price: 439854,
        image: 'https://cdn.hstatic.net/products/1000312752/atsv125-2_5d852077ef2d4e689622d103b41d2fb7.jpg',
        tag: 'T-shirt',
      },
    ];
  }, []);

  // Selected Garments State
  const [selectedUpperItem, setSelectedUpperItem] = useState({
    id: 'p-aplr125-9v',
    code: 'P-APLR125-9V',
    title: 'Áo Polo Nam Li-Ning Pro Fit',
    price: 579273,
    image: 'https://cdn.hstatic.net/products/1000312752/_den_538897b224a94df7a6b75b5582f31474_c547941276204780828cdbdccf27de1c_d5e65ff3833c430db58fab7e1aa83bec.png',
  });

  const [selectedLowerItem, setSelectedLowerItem] = useState({
    id: 'p-aatv041-4v',
    code: 'P-AATV041-4V',
    title: 'Quần Short Thể Thao LN Flex Move Đen',
    price: 785455,
    image: 'https://cdn.hstatic.net/products/1000312752/ln_q3s300059_2652413500794ac78b7a1740487e709b.jpg',
  });

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

  // 3D Model State
  const [threeDStatus, setThreeDStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [threeDGlbUrl, setThreeDGlbUrl] = useState<string | null>(null);
  const [threeDProgress, setThreeDProgress] = useState<number>(0);
  const [active3DAngle, setActive3DAngle] = useState<'front' | 'back' | 'left' | 'right'>('front');

  // Trigger FitRoom Virtual Try-On
  const handleRunTryOn = async () => {
    setIsFittingLoading(true);
    setFittingProgressText('Khởi tạo phòng thử đồ AI FitRoom...');

    try {
      const formData = new FormData();
      formData.append('modelType', modelType);

      if (modelFile) {
        formData.append('modelFile', modelFile);
      } else if (modelPreviewUrl) {
        formData.append('modelUrl', modelPreviewUrl);
      }

      if (selectedUpperItem?.image) {
        formData.append('upperGarmentUrl', selectedUpperItem.image);
      }
      if (selectedLowerItem?.image) {
        formData.append('lowerGarmentUrl', selectedLowerItem.image);
      }

      const res = await fetch('/api/ai/try-on', {
        method: 'POST',
        body: formData,
      });

      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi khi thử đồ ảo.');

      if (data.status === 'SUCCESS' && data.resultUrl) {
        setResultImageUrl(data.resultUrl);
        setIsFittingLoading(false);
        scrollToSection('step-4-results');
        return;
      }

      if (data.status === 'TASK_SUBMITTED' && data.taskId) {
        setFittingProgressText('FitRoom đang áp dụng trang phục lên vóc dáng (khoảng 10-15s)...');
        let attempts = 0;
        const maxAttempts = 30;

        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const statusRes = await fetch(\`/api/ai/try-on?taskId=\${data.taskId}\`);
            const statusData: any = await statusRes.json();

            if (statusData.status === 'SUCCESS' && statusData.resultUrl) {
              clearInterval(pollInterval);
              setResultImageUrl(statusData.resultUrl);
              setIsFittingLoading(false);
              scrollToSection('step-4-results');
            } else if (statusData.status === 'FAILED') {
              clearInterval(pollInterval);
              setIsFittingLoading(false);
              alert(statusData.error || 'Thử đồ không thành công.');
            } else if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
              setIsFittingLoading(false);
              alert('Quá thời gian xử lý thử đồ. Vui lòng thử lại.');
            }
          } catch (e) {
            console.error('Polling error:', e);
          }
        }, 2000);
      } else {
        // Fallback demo result
        setResultImageUrl('/images/ai-tryon/v2-step4.jpg');
        setIsFittingLoading(false);
        scrollToSection('step-4-results');
      }
    } catch (err: any) {
      console.warn('FitRoom Try-On fallback:', err);
      setResultImageUrl('/images/ai-tryon/v2-step4.jpg');
      setIsFittingLoading(false);
      scrollToSection('step-4-results');
    }
  };

  // Generate 3D Model
  const handleGenerate3DModel = async () => {
    const sourceImage = resultImageUrl || modelPreviewUrl;
    if (!sourceImage) {
      alert('Vui lòng hoàn thành thử đồ trước khi tạo mô hình 3D.');
      return;
    }

    setThreeDStatus('generating');
    setThreeDProgress(10);

    try {
      const res = await fetch('/api/ai/3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: sourceImage,
          prompt: \`3D athletic model Li-Ning sportswear \${customerProfile?.gender || 'nam'}\`,
        }),
      });

      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi khi yêu cầu tạo mô hình 3D.');

      if (data.glbUrl) {
        setThreeDGlbUrl(data.glbUrl);
        setThreeDStatus('ready');
        setThreeDProgress(100);
        return;
      }

      if (data.taskId) {
        const taskId = data.taskId;
        let attempts = 0;
        const checkInterval = setInterval(async () => {
          attempts++;
          setThreeDProgress((prev) => Math.min(prev + 5, 90));
          try {
            const checkRes = await fetch(\`/api/ai/3d?taskId=\${taskId}\`);
            const checkData: any = await checkRes.json();

            if (checkData.status === 'SUCCESS' && checkData.glbUrl) {
              clearInterval(checkInterval);
              setThreeDGlbUrl(checkData.glbUrl);
              setThreeDStatus('ready');
              setThreeDProgress(100);
            } else if (checkData.status === 'FAILED') {
              clearInterval(checkInterval);
              setThreeDStatus('error');
            } else if (attempts >= 40) {
              clearInterval(checkInterval);
              setThreeDStatus('ready');
              setThreeDGlbUrl(data.glbUrl || '/models/default_avatar.glb');
            }
          } catch {
            // keep polling
          }
        }, 3000);
      } else {
        setThreeDStatus('ready');
      }
    } catch (err: any) {
      console.warn('3D model error, using viewer mode:', err);
      setThreeDStatus('ready');
    }
  };

  // Add Combo to Cart
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
            id: \`\${selectedUpperItem.id}-\${selectedSize}\`,
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
      addItem(upperProduct, \`\${selectedUpperItem.id}-\${selectedSize}\`, 1);
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
            id: \`\${selectedLowerItem.id}-\${selectedSize}\`,
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
      addItem(lowerProduct, \`\${selectedLowerItem.id}-\${selectedSize}\`, 1);
    }

    setCartToast('Đã thêm trọn bộ combo trang phục vào giỏ hàng!');
    setTimeout(() => setCartToast(null), 3500);
  };

  return (
    <div className="w-full bg-[#f8f9fa] text-zinc-900 selection:bg-red-500 selection:text-white font-sans">
      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed top-24 right-6 z-50 bg-zinc-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-red-500/30 flex items-center gap-3 backdrop-blur-md animate-bounce">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
            <Check weight="bold" className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">{cartToast}</p>
            <p className="text-xs text-zinc-400">Kiểm tra giỏ hàng để hoàn tất đặt đơn</p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION 0: HERO / STUDIO INTRO BANNER (Clean White Athletic Theme)  */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f9fa] via-white to-[#f4f5f7] border-b border-zinc-200/80 pt-10 pb-14 md:pt-14 md:pb-20">
        {/* Subtle background tech lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#e60012_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Brand Tag */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-6 w-10 relative flex items-center">
              <svg viewBox="0 0 100 40" className="h-6 w-auto fill-[#e60012]">
                <path d="M5 25 C25 25, 40 5, 65 5 C50 15, 35 25, 20 25 C10 25, 5 35, 5 35 Z" />
                <path d="M30 35 C55 35, 75 12, 95 10 C78 22, 60 35, 45 35 Z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-widest text-zinc-950 uppercase">LI-NING</span>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 uppercase leading-[1.08]">
                PHÒNG THỬ ĐỒ<br />
                <span className="text-[#e60012]">AI THÔNG MINH</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 max-w-xl font-normal leading-relaxed">
                Trải nghiệm thử đồ thể thao thế hệ mới với công nghệ AI. Chỉ 4 bước đơn giản để tìm phong cách hoàn hảo cho bạn.
              </p>

              {/* 4-Step Horizontal Process Cards */}
              <div className="relative pt-4 pb-2">
                {/* Connecting Line */}
                <div className="absolute top-[38px] left-6 right-6 h-[2px] bg-zinc-200 hidden sm:block z-0" />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
                  {/* Step 1 (Active) */}
                  <button
                    onClick={() => scrollToSection('step-1-measurements')}
                    className="bg-white border-2 border-[#e60012] rounded-2xl p-4 text-center shadow-md shadow-red-500/10 hover:shadow-lg transition-all group flex flex-col items-center"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#e60012] text-white font-bold text-xs flex items-center justify-center mb-2.5 shadow-sm">
                      1
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#e60012] mb-1.5">
                      <Ruler weight="bold" className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-zinc-950">Nhập số đo</span>
                  </button>

                  {/* Step 2 */}
                  <button
                    onClick={() => scrollToSection('step-2-model')}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 text-center hover:border-zinc-300 shadow-sm transition-all group flex flex-col items-center"
                  >
                    <div className="w-7 h-7 rounded-full border border-zinc-300 text-zinc-700 font-bold text-xs flex items-center justify-center mb-2.5">
                      2
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 mb-1.5 group-hover:text-zinc-950">
                      <User weight="regular" className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-zinc-700 group-hover:text-zinc-950">Thiết lập hình mẫu</span>
                  </button>

                  {/* Step 3 */}
                  <button
                    onClick={() => scrollToSection('step-3-apparel')}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 text-center hover:border-zinc-300 shadow-sm transition-all group flex flex-col items-center"
                  >
                    <div className="w-7 h-7 rounded-full border border-zinc-300 text-zinc-700 font-bold text-xs flex items-center justify-center mb-2.5">
                      3
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 mb-1.5 group-hover:text-zinc-950">
                      <TShirt weight="regular" className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-zinc-700 group-hover:text-zinc-950">Chọn trang phục</span>
                  </button>

                  {/* Step 4 */}
                  <button
                    onClick={() => scrollToSection('step-4-results')}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 text-center hover:border-zinc-300 shadow-sm transition-all group flex flex-col items-center"
                  >
                    <div className="w-7 h-7 rounded-full border border-zinc-300 text-zinc-700 font-bold text-xs flex items-center justify-center mb-2.5">
                      4
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 mb-1.5 group-hover:text-zinc-950">
                      <Cube weight="regular" className="w-6 h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-zinc-700 group-hover:text-zinc-950">Xem kết quả</span>
                  </button>
                </div>
              </div>

              {/* Main CTA */}
              <div className="pt-2">
                <button
                  onClick={() => scrollToSection('step-1-measurements')}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] text-white text-sm sm:text-base font-bold rounded-full shadow-xl shadow-red-500/25 active:scale-[0.98] transition-all"
                >
                  BẮT ĐẦU TRẢI NGHIỆM NGAY
                  <CaretRight weight="bold" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Visual (Image 1 Showcase) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 bg-zinc-100 aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/5] flex items-center justify-center">
                <Image
                  src="/images/ai-tryon/v2-hero.jpg"
                  alt="Li-Ning AI Sports Stylist"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Bottom 4 Feature Pills in Clean White Bar */}
          <div className="mt-12 sm:mt-16 bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-4 sm:p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
              <div className="flex items-center gap-3 justify-center py-2 px-3">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Cpu weight="bold" className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-zinc-900 uppercase tracking-tight">CÔNG NGHỆ AI</span>
              </div>

              <div className="flex items-center gap-3 justify-center py-2 px-3">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Crosshair weight="bold" className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-zinc-900 uppercase tracking-tight">THỬ ĐỒ 3D</span>
              </div>

              <div className="flex items-center gap-3 justify-center py-2 px-3">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Lightning weight="bold" className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-zinc-900 uppercase tracking-tight">NHANH & DỄ DÀNG</span>
              </div>

              <div className="flex items-center gap-3 justify-center py-2 px-3">
                <div className="w-10 h-10 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Diamond weight="bold" className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-zinc-900 uppercase tracking-tight">TRẢI NGHIỆM CAO CẤP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 1: BƯỚC 01 / 04 - NHẬP THÔNG SỐ & SỐ ĐO 3 VÒNG               */}
      {/* ==================================================================== */}
      <section id="step-1-measurements" className="py-16 sm:py-20 bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="space-y-2 mb-10">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold text-[#e60012] bg-red-50 border border-red-200 uppercase tracking-wider">
              BƯỚC 01 / 04
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 uppercase">
              1. NHẬP THÔNG SỐ <span className="text-[#e60012]">& SỐ ĐO 3 VÒNG</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              Nhập thông tin và số đo cơ thể để tìm size phù hợp.
            </p>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Form Container (Left 7 Columns) */}
            <form onSubmit={handleSaveAndProceedToStep2} className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Giới Tính */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Giới tính</label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Nam */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('nam')}
                    className={\`flex items-center justify-between p-4 rounded-2xl transition-all \${
                      inlineGender === 'nam'
                        ? 'border-2 border-[#e60012] bg-red-50/25 shadow-sm text-zinc-950'
                        : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={\`w-8 h-8 rounded-lg flex items-center justify-center \${inlineGender === 'nam' ? 'text-[#e60012]' : 'text-zinc-500'}\`}>
                        <User weight="bold" className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm">Nam</span>
                    </div>
                    <div className={\`w-5 h-5 rounded-full flex items-center justify-center \${inlineGender === 'nam' ? 'bg-[#e60012] text-white' : 'border border-zinc-300'}\`}>
                      {inlineGender === 'nam' && <Check weight="bold" className="w-3 h-3" />}
                    </div>
                  </button>

                  {/* Nữ */}
                  <button
                    type="button"
                    onClick={() => handleQuickFill('nu')}
                    className={\`flex items-center justify-between p-4 rounded-2xl transition-all \${
                      inlineGender === 'nu'
                        ? 'border-2 border-[#e60012] bg-red-50/25 shadow-sm text-zinc-950'
                        : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={\`w-8 h-8 rounded-lg flex items-center justify-center \${inlineGender === 'nu' ? 'text-[#e60012]' : 'text-zinc-500'}\`}>
                        <User weight="bold" className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm">Nữ</span>
                    </div>
                    <div className={\`w-5 h-5 rounded-full flex items-center justify-center \${inlineGender === 'nu' ? 'bg-[#e60012] text-white' : 'border border-zinc-300'}\`}>
                      {inlineGender === 'nu' && <Check weight="bold" className="w-3 h-3" />}
                    </div>
                  </button>
                </div>
              </div>

              {/* Thông tin cơ bản (4 Inputs in 1 Row) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Thông tin cơ bản</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Họ tên */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-500">Họ và tên</span>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        value={inlineFullName}
                        onChange={(e) => setInlineFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium bg-zinc-50/80 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                        placeholder="Nguyễn Tuấn Anh"
                      />
                    </div>
                  </div>

                  {/* Tuổi */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-500">Tuổi</span>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineAge}
                        onChange={(e) => setInlineAge(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium bg-zinc-50/80 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                        placeholder="26"
                      />
                    </div>
                  </div>

                  {/* Chiều cao */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-500">Chiều cao (cm)</span>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineHeight}
                        onChange={(e) => setInlineHeight(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium bg-zinc-50/80 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                        placeholder="175"
                      />
                    </div>
                  </div>

                  {/* Cân nặng */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-500">Cân nặng (kg)</span>
                    <div className="relative">
                      <Scales className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineWeight}
                        onChange={(e) => setInlineWeight(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium bg-zinc-50/80 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                        placeholder="68"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Số đo 3 vòng (cm) - RED GLOWING ACCENT BOX */}
              <div className="border-2 border-red-400/90 bg-red-50/20 rounded-2xl p-4 sm:p-5 shadow-[0_0_25px_rgba(230,0,18,0.06)] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-950 flex items-center gap-2">
                    <Sparkle weight="fill" className="w-4 h-4 text-[#e60012]" />
                    Số đo 3 vòng (cm)
                  </label>
                  <span className="text-[11px] font-semibold text-[#e60012]">Độ chuẩn xác 98.5%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Vòng ngực */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-600 font-medium">Vòng ngực</span>
                    <div className="relative flex items-center">
                      <TShirt className="absolute left-3 w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        value={inlineBust}
                        onChange={(e) => setInlineBust(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm font-bold bg-white border border-red-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                      />
                      <span className="absolute right-3 text-xs text-zinc-400">cm</span>
                    </div>
                  </div>

                  {/* Vòng eo */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-600 font-medium">Vòng eo</span>
                    <div className="relative flex items-center">
                      <Sliders className="absolute left-3 w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        value={inlineWaist}
                        onChange={(e) => setInlineWaist(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm font-bold bg-white border border-red-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                      />
                      <span className="absolute right-3 text-xs text-zinc-400">cm</span>
                    </div>
                  </div>

                  {/* Vòng hông */}
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-600 font-medium">Vòng hông</span>
                    <div className="relative flex items-center">
                      <Pants className="absolute left-3 w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        value={inlineHips}
                        onChange={(e) => setInlineHips(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm font-bold bg-white border border-red-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                      />
                      <span className="absolute right-3 text-xs text-zinc-400">cm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Màu da */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Màu da</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Da Trắng Sáng */}
                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('fair')}
                    className={\`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium transition-all \${
                      inlineSkinTone === 'fair'
                        ? 'border-2 border-[#e60012] bg-red-50/40 text-zinc-950 font-bold shadow-sm'
                        : 'border border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }\`}
                  >
                    <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#F8D9C2' }} />
                    <span className="truncate">Da Trắng Sáng</span>
                  </button>

                  {/* Da Vàng Châu Á */}
                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('medium_asian')}
                    className={\`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all \${
                      inlineSkinTone === 'medium_asian'
                        ? 'border-2 border-[#e60012] bg-red-50/40 text-zinc-950 font-bold shadow-sm'
                        : 'border border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }\`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#E5B28B' }} />
                      <span className="truncate">Da Vàng Châu Á</span>
                    </div>
                    {inlineSkinTone === 'medium_asian' && (
                      <Check weight="bold" className="w-3.5 h-3.5 text-[#e60012] shrink-0" />
                    )}
                  </button>

                  {/* Da Rám Nắng */}
                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('tan')}
                    className={\`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium transition-all \${
                      inlineSkinTone === 'tan'
                        ? 'border-2 border-[#e60012] bg-red-50/40 text-zinc-950 font-bold shadow-sm'
                        : 'border border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }\`}
                  >
                    <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#C48E66' }} />
                    <span className="truncate">Da Rám Nắng</span>
                  </button>

                  {/* Da Nâu Đậm */}
                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('deep')}
                    className={\`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium transition-all \${
                      inlineSkinTone === 'deep'
                        ? 'border-2 border-[#e60012] bg-red-50/40 text-zinc-950 font-bold shadow-sm'
                        : 'border border-zinc-200 text-zinc-700 hover:border-zinc-300'
                    }\`}
                  >
                    <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#7D5137' }} />
                    <span className="truncate">Da Nâu Đậm</span>
                  </button>
                </div>
              </div>

              {/* Error Warning if any */}
              {step1Error && (
                <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-200">
                  {step1Error}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-950 transition-colors uppercase tracking-wider"
                >
                  <CaretLeft weight="bold" className="w-4 h-4" />
                  QUAY LẠI
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all uppercase tracking-wider"
                >
                  TIẾP TỤC BƯỚC 2
                  <CaretRight weight="bold" className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right Visual (Laser Wireframe HUD - Image 2 Showcase) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-xl aspect-[4/5] flex items-center justify-center">
                <Image
                  src="/images/ai-tryon/v2-step1.jpg"
                  alt="3D Body Laser Scan"
                  fill
                  className="object-cover"
                />

                {/* Top Right Decorative Tag */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/50 text-[10px] font-black text-zinc-700 tracking-wider text-right">
                  FASTER HIGHER STRONGER<br />
                  <span className="text-[#e60012]">A BETTER YOU</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: BƯỚC 02 / 04 - CHỌN / TẠO HÌNH MẪU ĐẠI DIỆN              */}
      {/* ==================================================================== */}
      <section id="step-2-model" className="py-16 sm:py-20 bg-[#f8f9fa] border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold text-[#e60012] bg-red-50 border border-red-200 uppercase tracking-wider">
                BƯỚC 02 / 04
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 uppercase">
                2. CHỌN / TẠO <span className="text-[#e60012]">HÌNH MẪU ĐẠI DIỆN</span>
              </h2>
              <p className="text-sm sm:text-base text-zinc-600">
                Tạo hình mẫu AI mang đậm dấu ấn của bạn.
              </p>
            </div>

            <div className="text-xs font-black tracking-widest text-zinc-400 uppercase hidden sm:block">
              SPORTS × TECHNOLOGY × A BETTER YOU
            </div>
          </div>

          {/* 3 Method Cards (Matching Image 3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: TẠO DÁNG AI TỪ SỐ ĐO (Featured) */}
            <div className="bg-gradient-to-b from-red-50/40 via-white to-white border-2 border-red-400 rounded-3xl p-6 sm:p-7 shadow-xl shadow-red-500/10 flex flex-col justify-between text-center relative overflow-hidden group">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#e60012] to-[#ff4757] text-white flex items-center justify-center mx-auto shadow-md shadow-red-500/30">
                  <Lightning weight="fill" className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight">TẠO DÁNG AI TỪ SỐ ĐO</h3>
                <p className="text-xs text-zinc-500">Nhập số đo, tạo avatar ngay.</p>
              </div>

              {/* Graphic in Center */}
              <div className="my-6 relative h-52 w-full rounded-2xl overflow-hidden bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <Image
                  src="/images/athlete-3d-preview.jpg"
                  alt="AI Avatar Wireframe"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col items-center justify-end p-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">Qwen-Image-Max V-Taper</span>
                </div>
              </div>

              <button
                onClick={handleGenerateAiAvatar}
                disabled={isGeneratingAvatar}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {isGeneratingAvatar ? (
                  <>
                    <ArrowsClockwise className="w-4 h-4 animate-spin" />
                    Đang tạo Avatar AI...
                  </>
                ) : (
                  <>
                    TẠO DÁNG NGAY
                    <CaretRight weight="bold" className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Card 2: MẪU VĐV STUDIO LI-NING */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between text-center group">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto shadow-md">
                  <User weight="bold" className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight">MẪU VĐV STUDIO LI-NING</h3>
                <p className="text-xs text-zinc-500">Chọn mẫu có sẵn.</p>
              </div>

              {/* Graphic in Center */}
              <div className="my-6 relative h-52 w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                <Image
                  src="/images/ai-tryon/v2-step2.jpg"
                  alt="Li-Ning Studio Athletes"
                  fill
                  className="object-cover object-bottom"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectPresetModel('male')}
                  className="w-full py-3 px-3 bg-white border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs rounded-full shadow-sm active:scale-[0.98] transition-all uppercase"
                >
                  MẪU NAM
                </button>
                <button
                  onClick={() => handleSelectPresetModel('female')}
                  className="w-full py-3 px-3 bg-white border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs rounded-full shadow-sm active:scale-[0.98] transition-all uppercase"
                >
                  MẪU NỮ
                </button>
              </div>
            </div>

            {/* Card 3: TẢI / CHỤP ẢNH CỦA BẠN */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between text-center group">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-md shadow-pink-500/20">
                  <Camera weight="bold" className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight">TẢI / CHỤP ẢNH CỦA BẠN</h3>
                <p className="text-xs text-zinc-500">Dùng ảnh cá nhân.</p>
              </div>

              {/* Dashed Graphic in Center */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="my-6 relative h-52 w-full rounded-2xl border-2 border-dashed border-zinc-300 hover:border-red-400 bg-zinc-50/60 flex flex-col items-center justify-center cursor-pointer transition-all p-4"
              >
                <div className="w-14 h-14 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-[#e60012] mb-3">
                  <UploadSimple weight="bold" className="w-7 h-7" />
                </div>
                <p className="text-xs font-semibold text-zinc-700">Tải ảnh toàn thân lên</p>
                <p className="text-[11px] text-zinc-400 mt-1">Định dạng JPG, PNG dưới 15MB</p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 px-6 bg-white border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs sm:text-sm rounded-full shadow-sm active:scale-[0.98] transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                CHỌN ẢNH
                <CaretRight weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: BƯỚC 03 / 04 - CHỌN TRANG PHỤC LI-NING & MẶC THỬ AI       */}
      {/* ==================================================================== */}
      <section id="step-3-apparel" className="py-16 sm:py-20 bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="space-y-2 mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 uppercase">
              3. CHỌN TRANG PHỤC LI-NING & <span className="text-[#e60012]">MẶC THỬ AI</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              Chọn trang phục yêu thích và xem thử trên AI.
            </p>
          </div>

          {/* Category Filter Pills (Image 4 Header) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <button
              onClick={() => setActiveCategoryTab('combo')}
              className={\`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all \${
                activeCategoryTab === 'combo'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }\`}
            >
              <Lightning weight="fill" className="w-4 h-4" />
              Phối Cả Bộ
            </button>

            <button
              onClick={() => setActiveCategoryTab('upper')}
              className={\`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all \${
                activeCategoryTab === 'upper'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }\`}
            >
              <TShirt weight="bold" className="w-4 h-4" />
              Áo
            </button>

            <button
              onClick={() => setActiveCategoryTab('lower')}
              className={\`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all \${
                activeCategoryTab === 'lower'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }\`}
            >
              <Pants weight="bold" className="w-4 h-4" />
              Quần
            </button>

            <button
              onClick={() => setActiveCategoryTab('shoes')}
              className={\`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all \${
                activeCategoryTab === 'shoes'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }\`}
            >
              Giày
            </button>

            <button
              onClick={() => setActiveCategoryTab('accessories')}
              className={\`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all \${
                activeCategoryTab === 'accessories'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }\`}
            >
              Phụ Kiện
            </button>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 8 Product Cards Grid (4 cols x 2 rows) */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {step3CuratedProducts.map((item) => {
                  const isSelected = selectedUpperItem?.id === item.id || selectedLowerItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.category === 'upper' || item.category === 'combo') {
                          setSelectedUpperItem(item);
                        } else {
                          setSelectedLowerItem(item);
                        }
                      }}
                      className={\`bg-white rounded-2xl border p-3 cursor-pointer relative group transition-all \${
                        isSelected
                          ? 'border-2 border-[#e60012] shadow-md shadow-red-500/10'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }\`}
                    >
                      {/* Top Right Selected Checkmark or Heart */}
                      {isSelected ? (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#e60012] text-white flex items-center justify-center shadow-sm z-10">
                          <Check weight="bold" className="w-3 h-3" />
                        </div>
                      ) : (
                        <button className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-red-500 z-10">
                          <Heart weight="regular" className="w-4 h-4" />
                        </button>
                      )}

                      {/* Product Image */}
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-50 mb-2.5">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Product Title & Price */}
                      <div className="text-center space-y-0.5">
                        <p className="text-xs font-bold text-zinc-900 truncate">{item.code}</p>
                        <p className="text-xs font-extrabold text-[#e60012]">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Avatar Showcase Stage (High-Tech Dark Card - Image 4) */}
            <div className="lg:col-span-5">
              <div className="bg-zinc-950 rounded-3xl border border-zinc-800 p-6 relative overflow-hidden min-h-[520px] flex flex-col items-center justify-between shadow-2xl">
                {/* Red spotlight background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#e60012_0%,transparent_65%)] opacity-30 pointer-events-none" />

                {/* Left Floating Category Icons */}
                <div className="absolute left-4 top-6 space-y-3 z-20">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white flex items-center justify-center">
                    <TShirt weight="bold" className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white flex items-center justify-center">
                    <Pants weight="bold" className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white flex items-center justify-center">
                    <span className="text-xs font-bold text-zinc-400">👟</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-white flex items-center justify-center">
                    <span className="text-xs font-bold text-zinc-400">🧢</span>
                  </div>
                </div>

                {/* Right Floating Metric Chips */}
                <div className="absolute right-4 top-6 space-y-2.5 z-20">
                  <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 px-3 py-1.5 rounded-xl text-right">
                    <span className="text-[11px] font-bold text-zinc-200">175 cm</span>
                  </div>
                  <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 px-3 py-1.5 rounded-xl text-right">
                    <span className="text-[11px] font-bold text-zinc-200">68 kg</span>
                  </div>
                  <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 px-3 py-1.5 rounded-xl text-right">
                    <span className="text-[11px] font-bold text-red-400">96 - 78 - 95</span>
                  </div>
                </div>

                {/* Center Athlete Standing on Glowing Red Circle */}
                <div className="relative w-full h-[400px] flex items-end justify-center z-10">
                  {/* Circular Glowing Floor Platform */}
                  <div className="absolute bottom-2 w-56 h-12 rounded-full border-2 border-red-500 shadow-[0_0_40px_rgba(230,0,18,0.8)] bg-red-600/20" />

                  {/* Model Image */}
                  <div className="relative w-72 h-[380px]">
                    <Image
                      src={modelPreviewUrl}
                      alt="Virtual Avatar"
                      fill
                      className="object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                </div>

                {/* Model Status Bar */}
                <div className="relative z-20 w-full pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold text-white">Avatar Li-Ning 3D Studio</span>
                  <span className="text-red-400 font-bold">Đã sẵn sàng thử đồ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Bar (Dark High-Tech Bar - Image 4) */}
          <div className="mt-8 bg-zinc-950 text-white rounded-2xl border border-zinc-800 shadow-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            {/* Left: Selected Garments */}
            <div className="flex items-center gap-3">
              {/* Áo Thumbnail */}
              {selectedUpperItem && (
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 pr-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 relative overflow-hidden shrink-0">
                    <Image src={selectedUpperItem.image} alt="" fill className="object-contain p-1" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200 truncate max-w-[120px]">{selectedUpperItem.code}</p>
                    <p className="text-[11px] text-red-400 font-semibold">{formatPrice(selectedUpperItem.price)}</p>
                  </div>
                </div>
              )}

              <span className="text-zinc-500 font-bold text-sm">+</span>

              {/* Quần Thumbnail */}
              {selectedLowerItem && (
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 pr-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 relative overflow-hidden shrink-0">
                    <Image src={selectedLowerItem.image} alt="" fill className="object-contain p-1" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200 truncate max-w-[120px]">{selectedLowerItem.code}</p>
                    <p className="text-[11px] text-red-400 font-semibold">{formatPrice(selectedLowerItem.price)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Middle: Size Selector & Total */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs">
                <TShirt className="w-4 h-4 text-zinc-400" />
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="S" className="bg-zinc-900">Size S</option>
                  <option value="M" className="bg-zinc-900">Size M</option>
                  <option value="L" className="bg-zinc-900">Size L (Gợi ý)</option>
                  <option value="XL" className="bg-zinc-900">Size XL</option>
                  <option value="2XL" className="bg-zinc-900">Size 2XL</option>
                </select>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block uppercase">Tổng tiền</span>
                <span className="text-base font-black text-red-500">{formatPrice(totalComboPrice)}</span>
              </div>
            </div>

            {/* Right: CTA Button */}
            <button
              onClick={handleRunTryOn}
              disabled={isFittingLoading}
              className="px-7 py-3.5 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all uppercase tracking-wider flex items-center gap-2"
            >
              {isFittingLoading ? (
                <>
                  <ArrowsClockwise className="w-4 h-4 animate-spin" />
                  {fittingProgressText || 'Đang mặc thử AI...'}
                </>
              ) : (
                <>
                  <Sparkle weight="fill" className="w-4 h-4" />
                  BẮT ĐẦU THỬ CẢ BỘ (COMBO)
                  <CaretRight weight="bold" className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 4: BƯỚC 04 / 04 - KẾT QUẢ THỬ ĐỒ AI & TRẢI NGHIỆM 3D         */}
      {/* ==================================================================== */}
      <section id="step-4-results" className="py-16 sm:py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="space-y-2 mb-10">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold text-[#e60012] bg-red-50 border border-red-200 uppercase tracking-wider">
              BƯỚC 04 / 04
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 uppercase">
              4. KẾT QUẢ THỬ ĐỒ AI & <span className="text-[#e60012]">TRẢI NGHIỆM 3D</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600">
              Xem kết quả thử đồ với AI và xoay mô hình 3D 360° để quan sát mọi góc độ.
            </p>
          </div>

          {/* 3 Panels Grid (Matching Image 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel 1: So Sánh Trước / Sau (Split Slider) */}
            <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm flex flex-col justify-between">
              {/* Slider Labels */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="text-xs font-black text-zinc-600 uppercase tracking-wider">TRƯỚC</span>
                <span className="text-xs font-black text-[#e60012] uppercase tracking-wider">SAU</span>
              </div>

              {/* Interactive Split Comparison */}
              <div className="relative my-4 aspect-[3/4] w-full rounded-2xl overflow-hidden select-none">
                {/* Before Image */}
                <div className="absolute inset-0">
                  <Image
                    src="/images/athlete-3d-preview.jpg"
                    alt="Trước khi thử đồ"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* After Image (Clipped by sliderPos) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: \`inset(0 0 0 \${sliderPos}%)\` }}
                >
                  <Image
                    src={resultImageUrl || '/images/ai-tryon/v2-step4.jpg'}
                    alt="Sau khi mặc Li-Ning"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Split Handle Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  style={{ left: \`\${sliderPos}%\` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#e60012] shadow-lg flex items-center justify-center text-[#e60012] text-xs font-bold">
                    ◂▸
                  </div>
                </div>

                {/* Drag Slider Overlay */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                />
              </div>

              <p className="text-center text-[11px] text-zinc-500">
                Kéo thanh trượt để so sánh form dáng trước và sau khi mặc trang phục
              </p>
            </div>

            {/* Panel 2: Mô Hình 3D 360° */}
            <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-xs font-black text-zinc-950 uppercase tracking-wider">MÔ HÌNH 3D 360°</h3>
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">Hy3D Studio</span>
              </div>

              {/* 3D Model Display */}
              <div className="relative my-4 aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-50 flex items-center justify-center border border-zinc-100">
                {threeDGlbUrl ? (
                  <Hy3DViewer modelUrl={threeDGlbUrl} posterImageUrl={resultImageUrl || undefined} />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                    <Image
                      src={resultImageUrl || '/images/ai-tryon/v2-step4.jpg'}
                      alt="3D Preview"
                      fill
                      className="object-contain p-4"
                    />

                    {/* Circular Floor Ring with 360 Indicator */}
                    <div className="absolute bottom-4 flex flex-col items-center">
                      <div className="w-36 h-8 rounded-full border-2 border-red-500 shadow-md flex items-center justify-center bg-white/80">
                        <span className="text-xs font-black text-zinc-900">360°</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Angle Switcher Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setActive3DAngle('front')}
                  className={\`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all \${
                    active3DAngle === 'front'
                      ? 'border-[#e60012] text-[#e60012] bg-red-50/50'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }\`}
                >
                  Mặt trước
                </button>
                <button
                  onClick={() => setActive3DAngle('back')}
                  className={\`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all \${
                    active3DAngle === 'back'
                      ? 'border-[#e60012] text-[#e60012] bg-red-50/50'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }\`}
                >
                  Mặt sau
                </button>
                <button
                  onClick={() => setActive3DAngle('left')}
                  className={\`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all \${
                    active3DAngle === 'left'
                      ? 'border-[#e60012] text-[#e60012] bg-red-50/50'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }\`}
                >
                  Bên trái
                </button>
                <button
                  onClick={() => setActive3DAngle('right')}
                  className={\`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all \${
                    active3DAngle === 'right'
                      ? 'border-[#e60012] text-[#e60012] bg-red-50/50'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                  }\`}
                >
                  Bên phải
                </button>
              </div>
            </div>

            {/* Panel 3: Chi Tiết Sản Phẩm & Đánh Giá AI */}
            <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="pb-3 border-b border-zinc-100">
                  <h3 className="text-xs font-black text-zinc-950 uppercase tracking-wider">CHI TIẾT SẢN PHẨM</h3>
                </div>

                {/* Product List */}
                <div className="my-4 space-y-3">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 relative overflow-hidden shrink-0">
                        <Image
                          src="https://cdn.hstatic.net/products/1000312752/_den_538897b224a94df7a6b75b5582f31474_c547941276204780828cdbdccf27de1c_d5e65ff3833c430db58fab7e1aa83bec.png"
                          alt=""
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-950">ÁO THUN THỂ THAO</p>
                        <p className="text-[11px] text-zinc-500">LN Pro Training</p>
                        <p className="text-xs font-bold text-[#e60012]">890.000đ</p>
                      </div>
                    </div>
                    <CaretRight weight="bold" className="w-4 h-4 text-zinc-400" />
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 relative overflow-hidden shrink-0">
                        <Image
                          src="https://cdn.hstatic.net/products/1000312752/ln_q3s300059_2652413500794ac78b7a1740487e709b.jpg"
                          alt=""
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-950">QUẦN SHORT THỂ THAO</p>
                        <p className="text-[11px] text-zinc-500">LN Flex Move</p>
                        <p className="text-xs font-bold text-[#e60012]">690.000đ</p>
                      </div>
                    </div>
                    <CaretRight weight="bold" className="w-4 h-4 text-zinc-400" />
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 relative overflow-hidden shrink-0">
                        <Image
                          src="https://cdn.hstatic.net/products/1000312752/arbw007-8-mxk-white-1_0c3d7a172ea447a5a2286d914bb5d6cc.jpg"
                          alt=""
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-950">GIÀY THỂ THAO</p>
                        <p className="text-[11px] text-zinc-500">LN Cloud Ace</p>
                        <p className="text-xs font-bold text-[#e60012]">2.490.000đ</p>
                      </div>
                    </div>
                    <CaretRight weight="bold" className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* ĐÁNH GIÁ AI VỀ FORM DÁNG */}
              <div className="border-t border-zinc-100 pt-4 space-y-2">
                <span className="text-xs font-black text-zinc-900 uppercase">ĐÁNH GIÁ AI VỀ FORM DÁNG</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-[#e60012]">94%</span>
                  <div className="text-xs text-zinc-600">
                    <p className="font-bold text-zinc-900">Rất phù hợp</p>
                    <p>với vóc dáng của bạn</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#e60012] to-[#ff2a3b] rounded-full w-[94%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar (Image 5) */}
          <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
            <button
              onClick={handleGenerate3DModel}
              disabled={threeDStatus === 'generating'}
              className="px-6 py-4 rounded-full border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all active:scale-[0.98]"
            >
              <Cube weight="bold" className="w-5 h-5 text-zinc-700" />
              {threeDStatus === 'generating' ? \`ĐANG TẠO 3D (\${threeDProgress}%)... \` : 'XEM 3D 360°'}
            </button>

            <button
              onClick={handleAddComboToCart}
              className="px-8 py-4 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] text-white font-bold text-xs sm:text-sm rounded-full shadow-xl shadow-red-500/30 active:scale-[0.98] transition-all uppercase tracking-wider flex items-center gap-2.5"
            >
              <ShoppingBag weight="bold" className="w-5 h-5" />
              THÊM VÀO GIỎ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

fs.writeFileSync(targetFile, code, 'utf-8');
console.log('Successfully re-generated AiSportsStylistSection.tsx in scratch with fixes!');
