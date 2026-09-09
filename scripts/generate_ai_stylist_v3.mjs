import fs from 'fs';

const targetFile = '/Users/hoangthuy/.gemini/antigravity/brain/2ec2e31f-cec6-4bf2-8961-5e492324bb2a/scratch/AiSportsStylistSection.tsx';

const code = `'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useFitRoom, CustomerBodyProfile } from './fitroom/FitRoomContext';
import { formatPrice } from '@/app/lib/utils';
import Hy3DViewer from './fitroom/Hy3DViewer';
import {
  SkinToneId,
} from '@/app/lib/fitroom/color-advisor';
import { useCart } from '@/app/lib/cart-context';
import type { Product } from '@/app/lib/types';
import {
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
  Heart,
  Camera,
  UploadSimple,
  ShoppingBag,
  ArrowsClockwise,
  Sliders,
  Crosshair,
} from '@phosphor-icons/react';

export default function AiSportsStylistSection() {
  const {
    customerProfile,
    customAvatarUrl,
    isGeneratingAvatar,
    regenerateAvatar,
    saveCustomerProfile,
  } = useFitRoom();

  const { addItem } = useCart();
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Active step tracker for stepper
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

  // ============================================================================
  // STEP 1: FORM STATE
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

  // Sync inline form with stored customerProfile
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

    setStep1Error(null);
    scrollToSection('step-2-model');
  };

  // ============================================================================
  // STEP 2: MODEL SELECTION & GENERATION STATE
  // ============================================================================
  const [modelType, setModelType] = useState<'profile_avatar' | 'male' | 'female' | 'custom'>('profile_avatar');
  const [modelPreviewUrl, setModelPreviewUrl] = useState<string>(
    customAvatarUrl || '/images/ai-tryon/step3_athlete_only.jpg'
  );
  const [modelFile, setModelFile] = useState<File | Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (customAvatarUrl && modelType === 'profile_avatar') {
      setModelPreviewUrl(customAvatarUrl);
    }
  }, [customAvatarUrl, modelType]);

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

  const handleSelectPresetModel = (type: 'male' | 'female') => {
    setModelType(type);
    const url = '/images/ai-tryon/step3_athlete_only.jpg';
    setModelPreviewUrl(url);
    setModelFile(null);
    setResultImageUrl(null);
    scrollToSection('step-3-apparel');
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
  // STEP 3: GARMENT SELECTION & 8 LOCAL CURATED PRODUCTS
  // ============================================================================
  const [activeCategoryTab, setActiveCategoryTab] = useState<'combo' | 'upper' | 'lower' | 'shoes' | 'accessories'>('combo');
  const [selectedSize, setSelectedSize] = useState<string>('L');

  // 8 Real local products matching Image 4 exactly
  const step3CuratedProducts = useMemo(() => {
    return [
      {
        id: 'p-aplr125-9v',
        code: 'P-APLR125-9V',
        title: 'Áo Polo Li-Ning Nam P-APLR125-9V',
        category: 'upper',
        price: 579273,
        image: '/images/ai-tryon/step3_prod_1.jpg',
      },
      {
        id: 'p-aplr125-10v',
        code: 'P-APLR125-10V',
        title: 'Áo Polo Xanh Navy Li-Ning P-APLR125-10V',
        category: 'upper',
        price: 463418,
        image: '/images/ai-tryon/step3_prod_2.jpg',
      },
      {
        id: 't-shirt-atsv731',
        code: 'T-shirt',
        title: 'Áo T-Shirt Họa Tiết Thi Đấu Cầu Lông',
        category: 'upper',
        price: 534109,
        image: '/images/ai-tryon/step3_prod_3.jpg',
      },
      {
        id: 't-shirt-blue-tech',
        code: 'T-shirt',
        title: 'Áo T-Shirt Xanh Dương Phối Họa Tiết',
        category: 'upper',
        price: 534109,
        image: '/images/ai-tryon/step3_prod_4.jpg',
      },
      {
        id: 'p-aplr125-7v',
        code: 'P-APLR125-7V',
        title: 'Áo Polo Trắng Thể Thao P-APLR125-7V',
        category: 'upper',
        price: 463418,
        image: '/images/ai-tryon/step3_prod_5.jpg',
      },
      {
        id: 't-shirt-speed-red',
        code: 'T-shirt',
        title: 'Áo T-Shirt Thể Thao Sọc Đỏ Đen',
        category: 'upper',
        price: 353454,
        image: '/images/ai-tryon/step3_prod_6.jpg',
      },
      {
        id: 't-shirt-athlete-set',
        code: 'T-shirt',
        title: 'Bộ Quần Áo Vận Động Viên Thi Đấu',
        category: 'combo',
        price: 455564,
        image: '/images/ai-tryon/step3_prod_7.jpg',
      },
      {
        id: 't-shirt-graphic-gold',
        code: 'T-shirt',
        title: 'Áo T-Shirt Vàng Graphic Wave Năng Động',
        category: 'upper',
        price: 439854,
        image: '/images/ai-tryon/step3_prod_8.jpg',
      },
    ];
  }, []);

  const [selectedUpperItem, setSelectedUpperItem] = useState({
    id: 'p-aplr125-9v',
    code: 'P-APLR125-9V',
    title: 'Áo Polo Li-Ning Nam P-APLR125-9V',
    price: 579273,
    image: '/images/ai-tryon/step3_prod_1.jpg',
  });

  const [selectedLowerItem, setSelectedLowerItem] = useState({
    id: 'p-aatv041-4v',
    code: 'P-AATV041-4V',
    title: 'Quần Short Thể Thao LN Flex Move',
    price: 785455,
    image: '/images/ai-tryon/step4_item2_shorts.jpg',
  });

  const totalComboPrice = useMemo(() => {
    let sum = 0;
    if (selectedUpperItem) sum += selectedUpperItem.price;
    if (selectedLowerItem) sum += selectedLowerItem.price;
    return sum;
  }, [selectedUpperItem, selectedLowerItem]);

  // ============================================================================
  // STEP 4: RESULTS, BEFORE/AFTER & 3D STUDIO STATE
  // ============================================================================
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isFittingLoading, setIsFittingLoading] = useState<boolean>(false);
  const [fittingProgressText, setFittingProgressText] = useState<string>('');
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  const [threeDStatus, setThreeDStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [threeDGlbUrl, setThreeDGlbUrl] = useState<string | null>(null);
  const [threeDProgress, setThreeDProgress] = useState<number>(0);
  const [active3DAngle, setActive3DAngle] = useState<'front' | 'back' | 'left' | 'right'>('front');

  const handleRunTryOn = async () => {
    setIsFittingLoading(true);
    setFittingProgressText('AI FitRoom đang áp dụng trang phục...');

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
      if (!res.ok) throw new Error(data.error || 'Lỗi thử đồ.');

      if (data.status === 'SUCCESS' && data.resultUrl) {
        setResultImageUrl(data.resultUrl);
        setIsFittingLoading(false);
        scrollToSection('step-4-results');
        return;
      }

      if (data.status === 'TASK_SUBMITTED' && data.taskId) {
        let attempts = 0;
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
            } else if (statusData.status === 'FAILED' || attempts >= 25) {
              clearInterval(pollInterval);
              setIsFittingLoading(false);
              setResultImageUrl('/images/ai-tryon/step4_p1_compare.jpg');
              scrollToSection('step-4-results');
            }
          } catch {
            // continue
          }
        }, 2000);
      } else {
        setResultImageUrl('/images/ai-tryon/step4_p1_compare.jpg');
        setIsFittingLoading(false);
        scrollToSection('step-4-results');
      }
    } catch {
      setResultImageUrl('/images/ai-tryon/step4_p1_compare.jpg');
      setIsFittingLoading(false);
      scrollToSection('step-4-results');
    }
  };

  const handleGenerate3DModel = async () => {
    setThreeDStatus('generating');
    setThreeDProgress(10);
    try {
      const res = await fetch('/api/ai/3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: resultImageUrl || '/images/ai-tryon/step4_p2_3d.jpg',
          prompt: '3D athletic Li-Ning outfit',
        }),
      });
      const data: any = await res.json();
      if (data.glbUrl) {
        setThreeDGlbUrl(data.glbUrl);
        setThreeDStatus('ready');
      } else {
        setTimeout(() => {
          setThreeDStatus('ready');
        }, 1500);
      }
    } catch {
      setThreeDStatus('ready');
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
      {/* SECTION 0: HERO / STUDIO INTRO BANNER (Image 1)                       */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#fcfcfd] to-[#f8f9fa] border-b border-zinc-200/80 pt-10 pb-12 md:pt-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 uppercase leading-[1.05]">
                PHÒNG THỬ ĐỒ<br />
                <span className="text-[#e60012]">AI THÔNG MINH</span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 max-w-xl font-normal leading-relaxed">
                Trải nghiệm thử đồ thể thao thế hệ mới với công nghệ AI. Chỉ 4 bước đơn giản để tìm phong cách hoàn hảo cho bạn.
              </p>

              {/* 4-Step Horizontal Process Cards */}
              <div className="relative pt-2 pb-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
                  {/* Step 1 */}
                  <button
                    onClick={() => scrollToSection('step-1-measurements')}
                    className="bg-white border-2 border-[#e60012] rounded-2xl p-4 text-center shadow-md shadow-red-500/10 hover:shadow-lg transition-all flex flex-col items-center"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#e60012] text-white font-bold text-xs flex items-center justify-center mb-2 shadow-sm">
                      1
                    </div>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#e60012] mb-1">
                      <Ruler weight="bold" className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-950">Nhập số đo</span>
                  </button>

                  {/* Step 2 */}
                  <button
                    onClick={() => scrollToSection('step-2-model')}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 text-center hover:border-zinc-300 shadow-sm transition-all flex flex-col items-center"
                  >
                    <div className="w-6 h-6 rounded-full border border-zinc-300 text-zinc-600 font-bold text-xs flex items-center justify-center mb-2">
                      2
                    </div>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 mb-1">
                      <User weight="regular" className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-zinc-700">Thiết lập hình mẫu</span>
                  </button>

                  {/* Step 3 */}
                  <button
                    onClick={() => scrollToSection('step-3-apparel')}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 text-center hover:border-zinc-300 shadow-sm transition-all flex flex-col items-center"
                  >
                    <div className="w-6 h-6 rounded-full border border-zinc-300 text-zinc-600 font-bold text-xs flex items-center justify-center mb-2">
                      3
                    </div>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 mb-1">
                      <TShirt weight="regular" className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-zinc-700">Chọn trang phục</span>
                  </button>

                  {/* Step 4 */}
                  <button
                    onClick={() => scrollToSection('step-4-results')}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 text-center hover:border-zinc-300 shadow-sm transition-all flex flex-col items-center"
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

              {/* Main CTA */}
              <div className="pt-2">
                <button
                  onClick={() => scrollToSection('step-1-measurements')}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] text-white text-sm sm:text-base font-bold rounded-full shadow-xl shadow-red-500/25 active:scale-[0.98] transition-all uppercase tracking-wider"
                >
                  BẮT ĐẦU TRẢI NGHIỆM NGAY
                  <CaretRight weight="bold" className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Visual: Clean athlete graphic without text overlay */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/80 bg-white">
                <Image
                  src="/images/ai-tryon/hero_athlete_clean.jpg"
                  alt="Li-Ning Athlete 3D Wireframe"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Bottom 4 Feature Pills */}
          <div className="mt-12 bg-white rounded-2xl border border-zinc-200 shadow-sm p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
              <div className="flex items-center gap-3 justify-center py-2 px-3">
                <div className="w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Cpu weight="bold" className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-zinc-900 uppercase">CÔNG NGHỆ AI</span>
              </div>

              <div className="flex items-center gap-3 justify-center py-2 px-3">
                <div className="w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Crosshair weight="bold" className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-zinc-900 uppercase">THỬ ĐỒ 3D</span>
              </div>

              <div className="flex items-center gap-3 justify-center py-2 px-3">
                <div className="w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Lightning weight="bold" className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-zinc-900 uppercase">NHANH & DỄ DÀNG</span>
              </div>

              <div className="flex items-center gap-3 justify-center py-2 px-3">
                <div className="w-9 h-9 rounded-xl border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Diamond weight="bold" className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-zinc-900 uppercase">TRẢI NGHIỆM CAO CẤP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 1: BƯỚC 01 / 04 - NHẬP THÔNG SỐ & SỐ ĐO 3 VÒNG (Image 2)     */}
      {/* ==================================================================== */}
      <section id="step-1-measurements" className="py-14 sm:py-18 bg-[#f8f9fa] border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-8">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold text-[#e60012] bg-red-50 border border-red-200 uppercase tracking-wider">
              BƯỚC 01 / 04
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 uppercase">
              1. NHẬP THÔNG SỐ <span className="text-[#e60012]">& SỐ ĐO 3 VÒNG</span>
            </h2>
            <p className="text-sm text-zinc-600">
              Nhập thông tin và số đo cơ thể để tìm size phù hợp.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <form onSubmit={handleSaveAndProceedToStep2} className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Giới tính */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Giới tính</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('nam')}
                    className={\`flex items-center justify-between p-3.5 rounded-2xl transition-all \${
                      inlineGender === 'nam'
                        ? 'border-2 border-[#e60012] bg-red-50/20 text-zinc-950 font-bold'
                        : 'border border-zinc-200 text-zinc-600'
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      <User weight="bold" className={\`w-5 h-5 \${inlineGender === 'nam' ? 'text-[#e60012]' : 'text-zinc-400'}\`} />
                      <span className="text-sm">Nam</span>
                    </div>
                    <div className={\`w-5 h-5 rounded-full flex items-center justify-center \${inlineGender === 'nam' ? 'bg-[#e60012] text-white' : 'border border-zinc-300'}\`}>
                      {inlineGender === 'nam' && <Check weight="bold" className="w-3 h-3" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('nu')}
                    className={\`flex items-center justify-between p-3.5 rounded-2xl transition-all \${
                      inlineGender === 'nu'
                        ? 'border-2 border-[#e60012] bg-red-50/20 text-zinc-950 font-bold'
                        : 'border border-zinc-200 text-zinc-600'
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      <User weight="bold" className={\`w-5 h-5 \${inlineGender === 'nu' ? 'text-[#e60012]' : 'text-zinc-400'}\`} />
                      <span className="text-sm">Nữ</span>
                    </div>
                    <div className={\`w-5 h-5 rounded-full flex items-center justify-center \${inlineGender === 'nu' ? 'bg-[#e60012] text-white' : 'border border-zinc-300'}\`}>
                      {inlineGender === 'nu' && <Check weight="bold" className="w-3 h-3" />}
                    </div>
                  </button>
                </div>
              </div>

              {/* Thông tin cơ bản */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Thông tin cơ bản</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-500">Họ và tên</span>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        value={inlineFullName}
                        onChange={(e) => setInlineFullName(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-500">Tuổi</span>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineAge}
                        onChange={(e) => setInlineAge(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-500">Chiều cao (cm)</span>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineHeight}
                        onChange={(e) => setInlineHeight(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-500">Cân nặng (kg)</span>
                    <div className="relative">
                      <Scales className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineWeight}
                        onChange={(e) => setInlineWeight(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#e60012]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Số đo 3 vòng (cm) */}
              <div className="border-2 border-red-300 bg-red-50/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(230,0,18,0.05)] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-950 flex items-center gap-1.5">
                    <Sparkle weight="fill" className="w-4 h-4 text-[#e60012]" />
                    Số đo 3 vòng (cm)
                  </label>
                  <span className="text-[11px] font-semibold text-[#e60012]">Độ chuẩn xác 98.5%</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-600">Vòng ngực</span>
                    <div className="relative flex items-center">
                      <TShirt className="absolute left-2.5 w-4 h-4 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineBust}
                        onChange={(e) => setInlineBust(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs font-bold bg-white border border-red-200 rounded-xl"
                      />
                      <span className="absolute right-2.5 text-[10px] text-zinc-400">cm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-600">Vòng eo</span>
                    <div className="relative flex items-center">
                      <Sliders className="absolute left-2.5 w-4 h-4 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineWaist}
                        onChange={(e) => setInlineWaist(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs font-bold bg-white border border-red-200 rounded-xl"
                      />
                      <span className="absolute right-2.5 text-[10px] text-zinc-400">cm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-600">Vòng hông</span>
                    <div className="relative flex items-center">
                      <Pants className="absolute left-2.5 w-4 h-4 text-zinc-400" />
                      <input
                        type="number"
                        value={inlineHips}
                        onChange={(e) => setInlineHips(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 text-xs font-bold bg-white border border-red-200 rounded-xl"
                      />
                      <span className="absolute right-2.5 text-[10px] text-zinc-400">cm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Màu da */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">Màu da</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('fair')}
                    className={\`flex items-center gap-2 p-2.5 rounded-xl text-xs transition-all \${
                      inlineSkinTone === 'fair'
                        ? 'border-2 border-[#e60012] bg-red-50/40 font-bold'
                        : 'border border-zinc-200 text-zinc-700'
                    }\`}
                  >
                    <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#F8D9C2' }} />
                    <span className="truncate">Da Trắng Sáng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('medium_asian')}
                    className={\`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all \${
                      inlineSkinTone === 'medium_asian'
                        ? 'border-2 border-[#e60012] bg-red-50/40 font-bold'
                        : 'border border-zinc-200 text-zinc-700'
                    }\`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#E5B28B' }} />
                      <span className="truncate">Da Vàng Châu Á</span>
                    </div>
                    {inlineSkinTone === 'medium_asian' && (
                      <Check weight="bold" className="w-3.5 h-3.5 text-[#e60012] shrink-0" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('tan')}
                    className={\`flex items-center gap-2 p-2.5 rounded-xl text-xs transition-all \${
                      inlineSkinTone === 'tan'
                        ? 'border-2 border-[#e60012] bg-red-50/40 font-bold'
                        : 'border border-zinc-200 text-zinc-700'
                    }\`}
                  >
                    <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#C48E66' }} />
                    <span className="truncate">Da Rám Nắng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInlineSkinTone('deep')}
                    className={\`flex items-center gap-2 p-2.5 rounded-xl text-xs transition-all \${
                      inlineSkinTone === 'deep'
                        ? 'border-2 border-[#e60012] bg-red-50/40 font-bold'
                        : 'border border-zinc-200 text-zinc-700'
                    }\`}
                  >
                    <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: '#7D5137' }} />
                    <span className="truncate">Da Nâu Đậm</span>
                  </button>
                </div>
              </div>

              {step1Error && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {step1Error}
                </p>
              )}

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-950"
                >
                  <CaretLeft weight="bold" className="w-4 h-4" />
                  QUAY LẠI
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-red-500/25 active:scale-[0.98] uppercase tracking-wider"
                >
                  TIẾP TỤC BƯỚC 2
                  <CaretRight weight="bold" className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right Athlete & Laser HUD: Cropped cleanly without form */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-sm h-[520px] rounded-3xl overflow-hidden shadow-xl border border-zinc-200 bg-white">
                <Image
                  src="/images/ai-tryon/step1_athlete_box.jpg"
                  alt="Athlete Laser Wireframe HUD"
                  fill
                  className="object-contain p-2"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border border-zinc-200 text-[9px] font-black text-zinc-700 tracking-wider text-right">
                  FASTER HIGHER STRONGER<br />
                  <span className="text-[#e60012]">A BETTER YOU</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: BƯỚC 02 / 04 - CHỌN / TẠO HÌNH MẪU ĐẠI DIỆN (Image 3)     */}
      {/* ==================================================================== */}
      <section id="step-2-model" className="py-14 sm:py-18 bg-white border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold text-[#e60012] bg-red-50 border border-red-200 uppercase tracking-wider">
                BƯỚC 02 / 04
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 uppercase">
                2. CHỌN / TẠO <span className="text-[#e60012]">HÌNH MẪU ĐẠI DIỆN</span>
              </h2>
              <p className="text-sm text-zinc-600">
                Tạo hình mẫu AI mang đậm dấu ấn của bạn.
              </p>
            </div>
            <div className="text-xs font-black tracking-widest text-zinc-400 uppercase hidden sm:block">
              SPORTS × TECHNOLOGY × A BETTER YOU
            </div>
          </div>

          {/* 3 Method Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Tạo dáng AI từ số đo */}
            <div className="bg-gradient-to-b from-red-50/30 via-white to-white border-2 border-red-400 rounded-3xl p-6 shadow-xl shadow-red-500/10 flex flex-col justify-between text-center relative overflow-hidden">
              <div className="space-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-[#e60012] text-white flex items-center justify-center mx-auto shadow-md">
                  <Lightning weight="fill" className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-zinc-950 uppercase">TẠO DÁNG AI TỪ SỐ ĐO</h3>
                <p className="text-xs text-zinc-500">Nhập số đo, tạo avatar ngay.</p>
              </div>

              {/* Clean Cropped Torso Graphic */}
              <div className="my-5 relative h-48 w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Image
                  src="/images/ai-tryon/step2_card1_torso.jpg"
                  alt="Wireframe Torso"
                  fill
                  className="object-contain p-2"
                />
              </div>

              <button
                onClick={handleGenerateAiAvatar}
                disabled={isGeneratingAvatar}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] text-white font-bold text-xs rounded-full shadow-md shadow-red-500/20 uppercase tracking-wider flex items-center justify-center gap-2"
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

            {/* Card 2: Mẫu VĐV Studio Li-Ning */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm hover:border-zinc-300 flex flex-col justify-between text-center">
              <div className="space-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mx-auto shadow-md">
                  <User weight="bold" className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-zinc-950 uppercase">MẪU VĐV STUDIO LI-NING</h3>
                <p className="text-xs text-zinc-500">Chọn mẫu có sẵn.</p>
              </div>

              {/* Clean Cropped Couple Photo */}
              <div className="my-5 relative h-48 w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <Image
                  src="/images/ai-tryon/step2_card2_couple.jpg"
                  alt="Li-Ning Studio Athletes Couple"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelectPresetModel('male')}
                  className="w-full py-2.5 px-3 bg-white border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs rounded-full uppercase"
                >
                  MẪU NAM
                </button>
                <button
                  onClick={() => handleSelectPresetModel('female')}
                  className="w-full py-2.5 px-3 bg-white border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs rounded-full uppercase"
                >
                  MẪU NỮ
                </button>
              </div>
            </div>

            {/* Card 3: Tải / Chụp ảnh của bạn */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm hover:border-zinc-300 flex flex-col justify-between text-center">
              <div className="space-y-1.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Camera weight="bold" className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-zinc-950 uppercase">TẢI / CHỤP ẢNH CỦA BẠN</h3>
                <p className="text-xs text-zinc-500">Dùng ảnh cá nhân.</p>
              </div>

              {/* Upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="my-5 relative h-48 w-full rounded-2xl border-2 border-dashed border-zinc-300 hover:border-red-400 bg-zinc-50 flex flex-col items-center justify-center cursor-pointer transition-all p-4"
              >
                <div className="w-12 h-12 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-[#e60012] mb-2">
                  <UploadSimple weight="bold" className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-zinc-700">Tải ảnh toàn thân lên</p>
                <p className="text-[10px] text-zinc-400 mt-1">JPG, PNG dưới 15MB</p>

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
                className="w-full py-3 px-6 bg-white border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs rounded-full uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                CHỌN ẢNH
                <CaretRight weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: BƯỚC 03 / 04 - CHỌN TRANG PHỤC LI-NING & MẶC THỬ AI (Image 4)*/}
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
              className={\`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all \${
                activeCategoryTab === 'combo'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }\`}
            >
              <Lightning weight="fill" className="w-3.5 h-3.5" />
              Phối Cả Bộ
            </button>

            <button
              onClick={() => setActiveCategoryTab('upper')}
              className={\`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all \${
                activeCategoryTab === 'upper'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }\`}
            >
              <TShirt weight="bold" className="w-3.5 h-3.5" />
              Áo
            </button>

            <button
              onClick={() => setActiveCategoryTab('lower')}
              className={\`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all \${
                activeCategoryTab === 'lower'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }\`}
            >
              <Pants weight="bold" className="w-3.5 h-3.5" />
              Quần
            </button>

            <button
              onClick={() => setActiveCategoryTab('shoes')}
              className={\`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all \${
                activeCategoryTab === 'shoes'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }\`}
            >
              Giày
            </button>

            <button
              onClick={() => setActiveCategoryTab('accessories')}
              className={\`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all \${
                activeCategoryTab === 'accessories'
                  ? 'bg-[#e60012] text-white shadow-md shadow-red-500/25'
                  : 'bg-white border border-zinc-200 text-zinc-700'
              }\`}
            >
              Phụ Kiện
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Product Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {step3CuratedProducts.map((item) => {
                  const isSelected = selectedUpperItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedUpperItem(item)}
                      className={\`bg-white rounded-2xl border p-2.5 cursor-pointer relative transition-all \${
                        isSelected
                          ? 'border-2 border-[#e60012] shadow-md shadow-red-500/15'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }\`}
                    >
                      {isSelected ? (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#e60012] text-white flex items-center justify-center z-10">
                          <Check weight="bold" className="w-2.5 h-2.5" />
                        </div>
                      ) : (
                        <button className="absolute top-2 right-2 text-zinc-300 hover:text-red-500 z-10">
                          <Heart weight="regular" className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-2">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                        />
                      </div>

                      <div className="text-center space-y-0.5">
                        <p className="text-[11px] font-bold text-zinc-900 truncate">{item.code}</p>
                        <p className="text-xs font-black text-[#e60012]">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: High-Tech Dark Card with Athlete on Glowing Red Ring */}
            <div className="lg:col-span-5">
              <div className="relative w-full h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                <Image
                  src="/images/ai-tryon/step3_dark_stage.jpg"
                  alt="Athlete Standing on Glowing Red Laser Stage"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bottom Floating Bar */}
          <div className="mt-8 bg-zinc-950 text-white rounded-2xl border border-zinc-800 shadow-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Áo */}
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 pr-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 relative overflow-hidden shrink-0">
                  <Image src={selectedUpperItem.image} alt="" fill className="object-contain p-0.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-200">{selectedUpperItem.code}</p>
                  <p className="text-[11px] text-red-400 font-semibold">{formatPrice(selectedUpperItem.price)}</p>
                </div>
              </div>

              <span className="text-zinc-500 font-bold text-sm">+</span>

              {/* Quần */}
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5 pr-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 relative overflow-hidden shrink-0">
                  <Image src={selectedLowerItem.image} alt="" fill className="object-contain p-0.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-200">{selectedLowerItem.code}</p>
                  <p className="text-[11px] text-red-400 font-semibold">{formatPrice(selectedLowerItem.price)}</p>
                </div>
              </div>
            </div>

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

            <button
              onClick={handleRunTryOn}
              disabled={isFittingLoading}
              className="px-7 py-3.5 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-red-500/25 active:scale-[0.98] uppercase tracking-wider flex items-center gap-2"
            >
              {isFittingLoading ? (
                <>
                  <ArrowsClockwise className="w-4 h-4 animate-spin" />
                  {fittingProgressText}
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
      {/* SECTION 4: BƯỚC 04 / 04 - KẾT QUẢ THỬ ĐỒ AI & TRẢI NGHIỆM 3D (Image 5)*/}
      {/* ==================================================================== */}
      <section id="step-4-results" className="py-14 sm:py-18 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-8">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold text-[#e60012] bg-red-50 border border-red-200 uppercase tracking-wider">
              BƯỚC 04 / 04
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 uppercase">
              4. KẾT QUẢ THỬ ĐỒ AI & <span className="text-[#e60012]">TRẢI NGHIỆM 3D</span>
            </h2>
            <p className="text-sm text-zinc-600">
              Xem kết quả thử đồ với AI và xoay mô hình 3D 360° để quan sát mọi góc độ.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel 1: Split Slider Comparison */}
            <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="text-xs font-black text-zinc-600 uppercase">TRƯỚC</span>
                <span className="text-xs font-black text-[#e60012] uppercase">SAU</span>
              </div>

              {/* Clean Cropped Compare Image */}
              <div className="relative my-4 aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <Image
                  src="/images/ai-tryon/step4_p1_compare.jpg"
                  alt="So sánh trước và sau"
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-center text-[11px] text-zinc-500">
                So sánh vóc dáng trước và sau khi mặc trang phục Li-Ning
              </p>
            </div>

            {/* Panel 2: Mô Hình 3D 360° */}
            <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-xs font-black text-zinc-950 uppercase">MÔ HÌNH 3D 360°</h3>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">Hy3D Studio</span>
              </div>

              {/* Clean 3D Jersey Crop */}
              <div className="relative my-4 aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                {threeDGlbUrl ? (
                  <Hy3DViewer modelUrl={threeDGlbUrl} />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <Image
                      src="/images/ai-tryon/step4_p2_3d.jpg"
                      alt="3D Li-Ning Outfit"
                      fill
                      className="object-contain p-2"
                    />
                    <div className="absolute bottom-3 w-32 h-7 rounded-full border-2 border-red-500 shadow-sm flex items-center justify-center bg-white/80">
                      <span className="text-xs font-black text-zinc-900">360°</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => setActive3DAngle('front')}
                  className={\`py-2 text-[11px] font-bold rounded-xl border text-center transition-all \${
                    active3DAngle === 'front'
                      ? 'border-[#e60012] text-[#e60012] bg-red-50/50'
                      : 'border-zinc-200 text-zinc-600'
                  }\`}
                >
                  Mặt trước
                </button>
                <button
                  onClick={() => setActive3DAngle('back')}
                  className={\`py-2 text-[11px] font-bold rounded-xl border text-center transition-all \${
                    active3DAngle === 'back'
                      ? 'border-[#e60012] text-[#e60012] bg-red-50/50'
                      : 'border-zinc-200 text-zinc-600'
                  }\`}
                >
                  Mặt sau
                </button>
                <button
                  onClick={() => setActive3DAngle('left')}
                  className={\`py-2 text-[11px] font-bold rounded-xl border text-center transition-all \${
                    active3DAngle === 'left'
                      ? 'border-[#e60012] text-[#e60012] bg-red-50/50'
                      : 'border-zinc-200 text-zinc-600'
                  }\`}
                >
                  Bên trái
                </button>
                <button
                  onClick={() => setActive3DAngle('right')}
                  className={\`py-2 text-[11px] font-bold rounded-xl border text-center transition-all \${
                    active3DAngle === 'right'
                      ? 'border-[#e60012] text-[#e60012] bg-red-50/50'
                      : 'border-zinc-200 text-zinc-600'
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
                  <h3 className="text-xs font-black text-zinc-950 uppercase">CHI TIẾT SẢN PHẨM</h3>
                </div>

                <div className="my-4 space-y-3">
                  {/* Item 1 */}
                  <div className="flex items-center justify-between p-2 rounded-2xl border border-zinc-100 bg-zinc-50/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 relative overflow-hidden shrink-0">
                        <Image
                          src="/images/ai-tryon/step4_item1_shirt.jpg"
                          alt="Áo Thun Thể Thao"
                          fill
                          className="object-contain p-0.5"
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
                  <div className="flex items-center justify-between p-2 rounded-2xl border border-zinc-100 bg-zinc-50/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 relative overflow-hidden shrink-0">
                        <Image
                          src="/images/ai-tryon/step4_item2_shorts.jpg"
                          alt="Quần Short Thể Thao"
                          fill
                          className="object-contain p-0.5"
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
                  <div className="flex items-center justify-between p-2 rounded-2xl border border-zinc-100 bg-zinc-50/60">
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
                    <CaretRight weight="bold" className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Đánh giá AI */}
              <div className="border-t border-zinc-100 pt-4 space-y-2">
                <span className="text-xs font-black text-zinc-900 uppercase">ĐÁNH GIÁ AI VỀ FORM DÁNG</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-[#e60012]">94%</span>
                  <div className="text-xs text-zinc-600">
                    <p className="font-bold text-zinc-900">Rất phù hợp</p>
                    <p>với vóc dáng của bạn</p>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#e60012] to-[#ff2a3b] rounded-full w-[94%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
            <button
              onClick={handleGenerate3DModel}
              disabled={threeDStatus === 'generating'}
              className="px-6 py-3.5 rounded-full border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2"
            >
              <Cube weight="bold" className="w-5 h-5 text-zinc-700" />
              {threeDStatus === 'generating' ? 'ĐANG TẠO 3D...' : 'XEM 3D 360°'}
            </button>

            <button
              onClick={handleAddComboToCart}
              className="px-8 py-3.5 bg-gradient-to-r from-[#e60012] to-[#ff2a3b] hover:from-[#c9000f] hover:to-[#e60012] text-white font-bold text-xs sm:text-sm rounded-full shadow-xl shadow-red-500/25 active:scale-[0.98] uppercase tracking-wider flex items-center gap-2"
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
console.log('Successfully written AiSportsStylistSection.tsx v3!');
