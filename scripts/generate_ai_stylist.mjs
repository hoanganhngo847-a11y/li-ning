import fs from 'fs';

const content = `'use client';

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

  // Step 1: Form State
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
    customAvatarUrl || '/images/athlete-3d-preview.jpg'
  );
  const [modelFile, setModelFile] = useState<File | Blob | null>(null);
  const [isEditingModel, setIsEditingModel] = useState<boolean>(false);
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
      setViewCompareMode('original');
      setIsEditingModel(false);
    } catch (err) {
      console.error('Error generating AI avatar:', err);
    }
  };

  // Handler: Select Preset Studio Model (zero waiting, zero API cost)
  const handleSelectPresetModel = (type: 'male' | 'female') => {
    setModelType(type);
    const url = type === 'male' ? '/images/athlete-3d-preview.jpg' : '/images/female-athlete-3d-preview.jpg';
    setModelPreviewUrl(url);
    setModelFile(null);
    setResultImageUrl(null);
    setViewCompareMode('original');
    setIsEditingModel(false);
    if (threeDGlbUrl) {
      setThreeDChangedNotice('Ảnh người mẫu đã thay đổi. Vui lòng tạo lại mô hình 3D.');
      setThreeDGlbUrl(null);
      setThreeDStatus('idle');
    }
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
    setViewCompareMode('original');
    setIsEditingModel(false);
    if (threeDGlbUrl) {
      setThreeDChangedNotice('Ảnh người mẫu đã thay đổi. Vui lòng tạo lại mô hình 3D.');
      setThreeDGlbUrl(null);
      setThreeDStatus('idle');
    }
  };

  // ============================================================================
  // STEP 3: GARMENT SELECTION & FILTERS
  // ============================================================================
  const [catalogGender, setCatalogGender] = useState<'nam' | 'nu' | 'all'>(
    customerProfile?.gender || 'nam'
  );
  const [topCategory, setTopCategory] = useState<string>('all');
  const [bottomCategory, setBottomCategory] = useState<string>('all');
  const [onlyRecommendedSkinTone, setOnlyRecommendedSkinTone] = useState<boolean>(false);

  const defaultTopGarment = useMemo(() => {
    const list = getSuggestedGarments({
      gender: customerProfile?.gender || 'nam',
      skinTone: customerProfile?.skinTone || 'medium_asian',
      type: 'upper',
      limit: 1,
    }).garments;
    return list[0] || ALL_APPAREL_GARMENTS[0];
  }, [customerProfile?.gender, customerProfile?.skinTone]);

  const defaultBottomGarment = useMemo(() => {
    const list = getSuggestedGarments({
      gender: customerProfile?.gender || 'nam',
      skinTone: customerProfile?.skinTone || 'medium_asian',
      type: 'lower',
      limit: 1,
    }).garments;
    return list[0] || ALL_APPAREL_GARMENTS.find((g) => g.type === 'lower') || ALL_APPAREL_GARMENTS[0];
  }, [customerProfile?.gender, customerProfile?.skinTone]);

  const [activeTop, setActiveTop] = useState<CatalogGarment>(defaultTopGarment);
  const [activeBottom, setActiveBottom] = useState<CatalogGarment>(defaultBottomGarment);
  const [tryOnMode, setTryOnMode] = useState<'combo' | 'upper' | 'lower'>('combo');

  // Full Catalog Modal State (800+ garments)
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [modalTargetSlot, setModalTargetSlot] = useState<'upper' | 'lower'>('upper');
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');
  const [modalCategory, setModalCategory] = useState<string>('all');

  // Dynamic suggested garments
  const suggestedTops = useMemo(() => {
    return getSuggestedGarments({
      gender: catalogGender,
      skinTone: customerProfile?.skinTone || 'medium_asian',
      type: 'upper',
      categoryKey: topCategory,
      onlyRecommendedSkinTone,
      limit: 12,
    }).garments;
  }, [catalogGender, customerProfile?.skinTone, topCategory, onlyRecommendedSkinTone]);

  const suggestedBottoms = useMemo(() => {
    return getSuggestedGarments({
      gender: catalogGender,
      skinTone: customerProfile?.skinTone || 'medium_asian',
      type: 'lower',
      categoryKey: bottomCategory,
      onlyRecommendedSkinTone,
      limit: 12,
    }).garments;
  }, [catalogGender, customerProfile?.skinTone, bottomCategory, onlyRecommendedSkinTone]);

  const topCategories = useMemo(() => {
    return getAvailableCategories('upper', catalogGender);
  }, [catalogGender]);

  const bottomCategories = useMemo(() => {
    return getAvailableCategories('lower', catalogGender);
  }, [catalogGender]);

  const modalGarments = useMemo(() => {
    if (!isCatalogModalOpen) return [];
    return getSuggestedGarments({
      gender: catalogGender,
      skinTone: customerProfile?.skinTone || 'medium_asian',
      type: modalTargetSlot,
      categoryKey: modalCategory,
      searchQuery: modalSearchQuery,
      onlyRecommendedSkinTone,
      limit: 48,
    }).garments;
  }, [
    isCatalogModalOpen,
    catalogGender,
    customerProfile?.skinTone,
    modalTargetSlot,
    modalCategory,
    modalSearchQuery,
    onlyRecommendedSkinTone,
  ]);

  // Sync selected products from other pages
  useEffect(() => {
    if (selectedUpper) {
      setActiveTop((prev) => ({
        id: selectedUpper.id,
        sku: selectedUpper.sku || selectedUpper.handle,
        title: selectedUpper.title,
        price: selectedUpper.price,
        image: selectedUpper.images?.[0] || prev.image,
        type: 'upper',
        handle: selectedUpper.handle,
        gender: selectedUpper.gender || 'nam',
        categoryKey: 'other_top',
        categoryLabel: 'Áo thể thao',
      }));
    }
  }, [selectedUpper]);

  useEffect(() => {
    if (selectedLower) {
      setActiveBottom((prev) => ({
        id: selectedLower.id,
        sku: selectedLower.sku || selectedLower.handle,
        title: selectedLower.title,
        price: selectedLower.price,
        image: selectedLower.images?.[0] || prev.image,
        type: 'lower',
        handle: selectedLower.handle,
        gender: selectedLower.gender || 'nam',
        categoryKey: 'other_bottom',
        categoryLabel: 'Quần thể thao',
      }));
    }
  }, [selectedLower]);

  // Compute total price of currently active outfit
  const currentTotalPrice = useMemo(() => {
    let sum = 0;
    if (tryOnMode === 'upper' || tryOnMode === 'combo') sum += activeTop.price || 0;
    if (tryOnMode === 'lower' || tryOnMode === 'combo') sum += activeBottom.price || 0;
    return sum;
  }, [tryOnMode, activeTop.price, activeBottom.price]);

  // ============================================================================
  // TRY-ON EXECUTION & STEP 4 RESULTS STATE
  // ============================================================================
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewCompareMode, setViewCompareMode] = useState<'slider' | 'result' | '3d' | 'original'>('slider');

  // Before/After Interactive Split Slider State
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = useCallback(
    (clientX: number) => {
      if (!sliderContainerRef.current) return;
      const rect = sliderContainerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pos = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSliderPosition(pos);
    },
    [sliderContainerRef]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) handleSliderMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider && e.touches[0]) handleSliderMove(e.touches[0].clientX);
    };
    const handleMouseUp = () => setIsDraggingSlider(false);

    if (isDraggingSlider) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingSlider, handleSliderMove]);

  // 3D Model State
  const [threeDStatus, setThreeDStatus] = useState<
    'idle' | 'preparing_image' | 'submitting' | 'queued' | 'generating' | 'completed' | 'failed'
  >('idle');
  const [threeDProgress, setThreeDProgress] = useState<number>(0);
  const [threeDStatusText, setThreeDStatusText] = useState<string>('');
  const [threeDGlbUrl, setThreeDGlbUrl] = useState<string | null>(null);
  const [threeDPreviewUrl, setThreeDPreviewUrl] = useState<string | null>(null);
  const [threeDError, setThreeDError] = useState<string | null>(null);
  const [threeDChangedNotice, setThreeDChangedNotice] = useState<string | null>(null);

  // Suggested sizes
  const suggestedSize = useMemo(() => {
    return getSuggestedSize();
  }, [getSuggestedSize]);

  // Handler: Execute AI Virtual Try-On
  const handleStartTryOn = async () => {
    setIsProcessing(true);
    setProgress(15);
    setStatusText('Đang tải hình mẫu đại diện và phân tích cấu trúc vải...');
    setErrorMessage(null);

    // Scroll smoothly to Step 4 results
    scrollToSection('step-4-results');

    try {
      const formData = new FormData();

      if (modelFile) {
        formData.append('model_image', modelFile);
      } else {
        formData.append('model_image_url', modelPreviewUrl);
      }

      if (tryOnMode === 'upper' || tryOnMode === 'combo') {
        formData.append('upper_garment_url', activeTop.image);
      }
      if (tryOnMode === 'lower' || tryOnMode === 'combo') {
        formData.append('lower_garment_url', activeBottom.image);
      }

      formData.append('cloth_type', tryOnMode);

      setProgress(40);
      setStatusText('FitRoom AI đang xử lý ghép trang phục theo tỷ lệ cơ thể...');

      const res = await fetch('/api/fitroom/tryon', {
        method: 'POST',
        body: formData,
      });

      const data: any = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Thử đồ thất bại');
      }

      const taskId = data.taskId;
      setProgress(60);
      setStatusText('AI đang hoàn thiện nếp gấp và ánh sáng bóng đổ thể thao...');

      // Poll status
      let pollCount = 0;
      const interval = setInterval(async () => {
        pollCount++;
        try {
          const statusRes = await fetch(\`/api/fitroom/tryon?taskId=\${taskId}\`);
          const statusData: any = await statusRes.json();

          if (statusData.status === 'completed' && statusData.resultUrl) {
            clearInterval(interval);
            setResultImageUrl(statusData.resultUrl);
            setProgress(100);
            setStatusText('Hoàn tất thử đồ!');
            setIsProcessing(false);
            setViewCompareMode('slider');
            scrollToSection('step-4-results');
          } else if (statusData.status === 'failed') {
            clearInterval(interval);
            throw new Error(statusData.error || 'FitRoom báo lỗi xử lý');
          } else {
            setProgress(Math.min(95, 60 + Math.floor(pollCount * 1.5)));
          }
        } catch (err: any) {
          clearInterval(interval);
          setErrorMessage(err.message || 'Lỗi khi kiểm tra trạng thái thử đồ');
          setIsProcessing(false);
        }
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể bắt đầu thử đồ. Vui lòng thử lại.');
      setIsProcessing(false);
    }
  };

  // Handler: Generate 3D Model
  const handleGenerate3D = async () => {
    const targetImage = resultImageUrl || modelPreviewUrl;
    if (!targetImage) {
      alert('Vui lòng hoàn thành thử đồ hoặc chọn hình mẫu trước.');
      return;
    }

    setThreeDStatus('preparing_image');
    setThreeDProgress(10);
    setThreeDStatusText('Đang xử lý tách nền và chuẩn bị ảnh cho AI 3D...');
    setThreeDError(null);

    try {
      const res = await fetch('/api/hy3d/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: targetImage }),
      });

      const data: any = await res.json();
      if (!res.ok || !data.taskId) {
        throw new Error(data.error || 'Khởi tạo mô hình 3D thất bại');
      }

      const taskId = data.taskId;
      setThreeDStatus('queued');
      setThreeDProgress(25);
      setThreeDStatusText('Đang xếp hàng dựng mesh 3D...');

      const pollInterval = setInterval(async () => {
        try {
          const checkRes = await fetch(\`/api/hy3d/status?taskId=\${taskId}\`);
          const checkData: any = await checkRes.json();

          if (checkData.status === 'completed' && checkData.glbUrl) {
            clearInterval(pollInterval);
            setThreeDGlbUrl(checkData.glbUrl);
            setThreeDPreviewUrl(checkData.previewUrl || null);
            setThreeDStatus('completed');
            setThreeDProgress(100);
            setThreeDStatusText('Dựng 3D thành công!');
            setViewCompareMode('3d');
          } else if (checkData.status === 'failed') {
            clearInterval(pollInterval);
            setThreeDStatus('failed');
            setThreeDError(checkData.error || 'Dựng 3D thất bại');
          } else {
            setThreeDProgress((prev) => Math.min(95, prev + 5));
            setThreeDStatusText(checkData.message || 'Đang tính toán hình học 3D & texture...');
          }
        } catch (err: any) {
          clearInterval(pollInterval);
          setThreeDStatus('failed');
          setThreeDError(err.message || 'Lỗi mạng khi kiểm tra trạng thái 3D');
        }
      }, 3000);
    } catch (err: any) {
      setThreeDStatus('failed');
      setThreeDError(err.message || 'Không thể tạo mô hình 3D');
    }
  };

  // Handler: Add to Cart
  const handleAddToCart = (type: 'all' | 'top' | 'bottom') => {
    let addedCount = 0;
    if (type === 'all' || type === 'top') {
      const p = products.find((x) => x.handle === activeTop.handle || x.id === activeTop.id);
      if (p) {
        addItem(p, \`\${p.id}-\${suggestedSize}\`, 1);
        addedCount++;
      }
    }
    if (type === 'all' || type === 'bottom') {
      const p = products.find((x) => x.handle === activeBottom.handle || x.id === activeBottom.id);
      if (p) {
        addItem(p, \`\${p.id}-\${suggestedSize}\`, 1);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      setCartToast(\`Đã thêm \${addedCount} sản phẩm (Size \${suggestedSize}) vào giỏ hàng!\`);
      setTimeout(() => setCartToast(null), 3500);
    } else {
      setCartToast('Đã thêm sản phẩm vào giỏ hàng!');
      setTimeout(() => setCartToast(null), 2500);
    }
  };

  return (
    <div className="w-full space-y-12 lg:space-y-16" id="ai-tryon-section">
      {/* Toast Notification */}
      {cartToast && (
        <div className="fixed top-24 right-6 z-50 bg-black/95 text-white px-5 py-3.5 rounded-xl border border-red-500/50 shadow-[0_10px_30px_rgba(243,13,41,0.3)] flex items-center gap-3 backdrop-blur-md animate-slideIn">
          <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">✓</span>
          <span className="text-xs font-bold">{cartToast}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 0: HERO INTRO BANNER (Matching Image 1)               */}
      {/* ============================================================ */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#090a0f] border border-red-900/30 text-white shadow-[0_25px_70px_rgba(0,0,0,0.6)]">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-800/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Brand Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between text-[11px] font-mono tracking-widest text-gray-400">
          <div className="flex items-center gap-3">
            <Image
              src="https://cdn.hstatic.net/themes/1000312752/1001500748/14/logo.png?v=165"
              alt="Li-Ning"
              width={100}
              height={26}
              className="h-6 w-auto object-contain invert"
            />
            <span className="text-white/60">ANYTHING IS POSSIBLE</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-white/50 uppercase text-[10px]">
            <span>SPORTS</span>
            <span>×</span>
            <span>TECHNOLOGY</span>
            <span>×</span>
            <span>A BETTER YOU</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (span 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>LI-NING SMART FIT • ALIBABA CLOUD QWEN-IMAGE-MAX • FITROOM AI</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none">
              <span className="text-white block">PHÒNG THỬ ĐỒ</span>
              <span className="text-brand block mt-1 drop-shadow-[0_0_25px_rgba(243,13,41,0.4)]">
                AI THÔNG MINH
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Trải nghiệm thử đồ thể thao thế hệ mới với công nghệ AI. Chỉ 4 bước đơn giản để thấy phiên bản tốt nhất của bạn.
            </p>

            {/* 4 Workflow Cards (matching Image 1) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div
                onClick={() => scrollToSection('step-1-measurements')}
                className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/70 shadow-[0_0_15px_rgba(243,13,41,0.25)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center text-center"
              >
                <div className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500 text-red-400 flex items-center justify-center text-xs font-bold mb-2">
                  1
                </div>
                <span className="text-xs font-bold text-white mb-1">Nhập số đo</span>
                <span className="text-[10px] text-gray-400 leading-tight">Cung cấp chiều cao, cân nặng và số đo 3 vòng</span>
              </div>

              <div
                onClick={() => scrollToSection('step-2-model')}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-red-500/40 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center text-center"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 text-gray-300 flex items-center justify-center text-xs font-bold mb-2">
                  2
                </div>
                <span className="text-xs font-bold text-white mb-1">Thiết lập hình mẫu</span>
                <span className="text-[10px] text-gray-400 leading-tight">Chọn giới tính, tạo hình AI đại diện của bạn</span>
              </div>

              <div
                onClick={() => scrollToSection('step-3-apparel')}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-red-500/40 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center text-center"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 text-gray-300 flex items-center justify-center text-xs font-bold mb-2">
                  3
                </div>
                <span className="text-xs font-bold text-white mb-1">Chọn trang phục</span>
                <span className="text-[10px] text-gray-400 leading-tight">Khám phá bộ sưu tập Li-Ning và chọn trang phục</span>
              </div>

              <div
                onClick={() => scrollToSection('step-4-results')}
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-red-500/40 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center text-center"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 text-gray-300 flex items-center justify-center text-xs font-bold mb-2">
                  4
                </div>
                <span className="text-xs font-bold text-white mb-1">Xem kết quả</span>
                <span className="text-[10px] text-gray-400 leading-tight">Thử đồ AI & xem mô hình 3D 360° sống động</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection('step-1-measurements')}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-[#f30d29] to-red-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(243,13,41,0.5)] hover:shadow-[0_0_35px_rgba(243,13,41,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>BẮT ĐẦU TRẢI NGHIỆM NGAY</span>
                <ArrowRight size={18} weight="bold" />
              </button>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-400">
                THỂ THAO THÔNG MINH HƠN • DÀNH CHO PHIÊN BẢN TỐT HƠN CỦA BẠN
              </span>
            </div>
          </div>

          {/* Right Column (span 5): Athlete & Hologram Wireframe Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden border border-red-500/30 shadow-[0_0_40px_rgba(243,13,41,0.25)] bg-[#0d0f14]">
              <Image
                src="/images/athlete-3d-preview.jpg"
                alt="Li-Ning Athlete AI"
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent opacity-80" />

              {/* Floating HUD Card: YOUR AI AVATAR */}
              <div className="absolute top-4 right-4 p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] space-y-1">
                <div className="font-mono text-[9px] uppercase tracking-wider text-gray-400 font-bold">YOUR AI AVATAR</div>
                <div className="flex items-center gap-2 text-gray-200">
                  <span>👤 {inlineHeight} cm</span>
                  <span>•</span>
                  <span>⚖️ {inlineWeight} kg</span>
                </div>
                <div className="text-red-400 font-mono text-[10px] font-bold">
                  📐 {inlineBust} - {inlineWaist} - {inlineHips}
                </div>
              </div>

              {/* Floating Garment Preview Badge */}
              <div className="absolute bottom-16 left-4 p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-red-500/40 text-white flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 relative shrink-0">
                  <Image src={activeTop.image} alt={activeTop.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 pr-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 block font-bold">VIRTUAL TRY-ON</span>
                  <span className="text-xs font-bold text-white truncate block max-w-[130px]">{activeTop.title}</span>
                </div>
              </div>

              {/* Script text: Move Smarter WITH AI */}
              <div className="absolute bottom-4 right-4 text-right">
                <span className="font-serif italic text-xl sm:text-2xl text-red-500 drop-shadow-[0_0_10px_rgba(243,13,41,0.5)] block">
                  Move Smarter
                </span>
                <span className="font-mono text-[10px] tracking-widest text-white/70 uppercase block">WITH AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Pillars (matching Image 1 bottom) */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10 bg-black/40 backdrop-blur-sm divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="p-4 sm:p-5 flex items-center gap-3">
            <Cpu size={28} weight="regular" className="text-red-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">CÔNG NGHỆ AI TIÊN TIẾN</h4>
              <p className="text-[10px] text-gray-400">Alibaba Cloud Qwen-Image-Max</p>
            </div>
          </div>
          <div className="p-4 sm:p-5 flex items-center gap-3">
            <Cube size={28} weight="regular" className="text-red-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">THỬ ĐỒ CHÂN THỰC</h4>
              <p className="text-[10px] text-gray-400">Mô hình 3D 360° sống động</p>
            </div>
          </div>
          <div className="p-4 sm:p-5 flex items-center gap-3">
            <Lightning size={28} weight="regular" className="text-red-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">NHANH CHÓNG & DỄ DÀNG</h4>
              <p className="text-[10px] text-gray-400">Chỉ 4 bước đơn giản</p>
            </div>
          </div>
          <div className="p-4 sm:p-5 flex items-center gap-3">
            <Diamond size={28} weight="regular" className="text-red-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">TRẢI NGHIỆM CAO CẤP</h4>
              <p className="text-[10px] text-gray-400">Dành riêng cho tín đồ thể thao</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: BODY MEASUREMENTS & 3D WIREFRAME HUD (Image 2)     */}
      {/* ============================================================ */}
      <section
        id="step-1-measurements"
        className="relative w-full rounded-3xl overflow-hidden bg-[#0a0c10] border border-red-900/30 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 sm:p-10 lg:p-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-white/10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                BƯỚC 01 / 04 • THÔNG SỐ CƠ THỂ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                <span>1. NHẬP THÔNG SỐ </span>
                <span className="text-brand">& SỐ ĐO 3 VÒNG</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
                Hệ thống sẽ dựa vào số đo thật để tính toán tỷ lệ dáng người và chuẩn bị cho bước chọn hình mẫu.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block font-bold">SMART FIT BY LI-NING</span>
              <span className="text-[9px] font-mono tracking-widest text-red-400 uppercase block">MEASURE • ANALYZE • FIT BETTER</span>
            </div>
          </div>

          {/* Form Layout: Left inputs (7 cols), Right 3D Wireframe Visual (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start">
            {/* Left Form */}
            <form onSubmit={handleSaveAndProceedToStep2} className="lg:col-span-7 space-y-6">
              {/* 1. CHỌN GIỚI TÍNH CỦA BẠN */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold block mb-3">
                  1. CHỌN GIỚI TÍNH CỦA BẠN
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* NAM */}
                  <div
                    onClick={() => { setInlineGender('nam'); handleQuickFill('nam'); }}
                    className={\`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between \${
                      inlineGender === 'nam'
                        ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(243,13,41,0.25)]'
                        : 'bg-[#12151c] border-white/10 hover:border-white/20'
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      <User size={24} className={inlineGender === 'nam' ? 'text-red-400' : 'text-gray-400'} />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase">NAM GIỚI</h4>
                        <p className="text-[11px] text-gray-400">Phom V-Taper, ngực nở eo gọn</p>
                      </div>
                    </div>
                    <div className={\`w-5 h-5 rounded-full border flex items-center justify-center \${
                      inlineGender === 'nam' ? 'bg-red-500 border-red-500 text-white' : 'border-gray-600'
                    }\`}>
                      {inlineGender === 'nam' && <Check size={12} weight="bold" />}
                    </div>
                  </div>

                  {/* NỮ */}
                  <div
                    onClick={() => { setInlineGender('nu'); handleQuickFill('nu'); }}
                    className={\`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between \${
                      inlineGender === 'nu'
                        ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(243,13,41,0.25)]'
                        : 'bg-[#12151c] border-white/10 hover:border-white/20'
                    }\`}
                  >
                    <div className="flex items-center gap-3">
                      <User size={24} className={inlineGender === 'nu' ? 'text-red-400' : 'text-gray-400'} />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase">NỮ GIỚI</h4>
                        <p className="text-[11px] text-gray-400">Đồng hồ cát, tôn eo và hông</p>
                      </div>
                    </div>
                    <div className={\`w-5 h-5 rounded-full border flex items-center justify-center \${
                      inlineGender === 'nu' ? 'bg-red-500 border-red-500 text-white' : 'border-gray-600'
                    }\`}>
                      {inlineGender === 'nu' && <Check size={12} weight="bold" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. THÔNG TIN CƠ BẢN */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold block mb-3">
                  2. THÔNG TIN CƠ BẢN
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">Họ & Tên</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={inlineFullName}
                        onChange={(e) => setInlineFullName(e.target.value)}
                        className="w-full pl-3 pr-2 py-2.5 rounded-lg bg-[#12151c] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none"
                        placeholder="Nguyễn Tuấn Anh"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">Tuổi</span>
                    <div className="relative">
                      <input
                        type="number"
                        value={inlineAge}
                        onChange={(e) => setInlineAge(e.target.value)}
                        className="w-full pl-3 pr-2 py-2.5 rounded-lg bg-[#12151c] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none"
                        placeholder="26"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">Chiều cao (cm)</span>
                    <div className="relative">
                      <input
                        type="number"
                        value={inlineHeight}
                        onChange={(e) => setInlineHeight(e.target.value)}
                        className="w-full pl-3 pr-2 py-2.5 rounded-lg bg-[#12151c] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none"
                        placeholder="175"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">Cân nặng (kg)</span>
                    <div className="relative">
                      <input
                        type="number"
                        value={inlineWeight}
                        onChange={(e) => setInlineWeight(e.target.value)}
                        className="w-full pl-3 pr-2 py-2.5 rounded-lg bg-[#12151c] border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none"
                        placeholder="68"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. SỐ ĐO 3 VÒNG (CM) - Glowing Highlight Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-red-950/20 to-black/40 border border-red-500/40 shadow-[0_0_25px_rgba(243,13,41,0.15)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                    3. SỐ ĐO 3 VÒNG (CM)
                  </span>
                  <span className="text-[10px] font-mono uppercase text-gray-400">CHÍNH XÁC HƠN - VỪA VẶN HƠN</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-gray-300 block mb-1">V1 Ngực</span>
                    <div className="relative">
                      <input
                        type="number"
                        value={inlineBust}
                        onChange={(e) => setInlineBust(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-[#0e1015] border border-red-500/30 text-white text-sm focus:border-red-500 focus:outline-none font-bold"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">cm</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-300 block mb-1">V2 Eo</span>
                    <div className="relative">
                      <input
                        type="number"
                        value={inlineWaist}
                        onChange={(e) => setInlineWaist(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-[#0e1015] border border-red-500/30 text-white text-sm focus:border-red-500 focus:outline-none font-bold"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">cm</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-300 block mb-1">V3 Hông</span>
                    <div className="relative">
                      <input
                        type="number"
                        value={inlineHips}
                        onChange={(e) => setInlineHips(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-[#0e1015] border border-red-500/30 text-white text-sm focus:border-red-500 focus:outline-none font-bold"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">cm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. MÀU DA CỦA BẠN */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold block mb-3">
                  4. MÀU DA CỦA BẠN
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {ALL_SKIN_TONES.map((tone: SkinToneConfig) => {
                    const isSelected = inlineSkinTone === tone.id;
                    return (
                      <div
                        key={tone.id}
                        onClick={() => setInlineSkinTone(tone.id)}
                        className={\`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 \${
                          isSelected
                            ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(243,13,41,0.2)]'
                            : 'bg-[#12151c] border-white/10 hover:border-white/20'
                        }\`}
                      >
                        <span className="w-5 h-5 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: tone.hexColor }} />
                        <span className="text-xs text-white truncate">{tone.vietnameseName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error Alert */}
              {step1Error && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-500 text-red-300 text-xs">
                  ⚠️ {step1Error}
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider hidden sm:inline">
                  THỂ THAO THÔNG MINH HƠN • DÀNH CHO PHIÊN BẢN TỐT HƠN CỦA BẠN
                </span>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-red-600 via-[#f30d29] to-red-600 text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(243,13,41,0.4)] hover:shadow-[0_0_30px_rgba(243,13,41,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer ml-auto"
                >
                  <span>TIẾP TỤC BƯỚC 2</span>
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>
            </form>

            {/* Right Side 3D Wireframe Model Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-2xl overflow-hidden border border-red-500/30 bg-[#0c0e14] shadow-[0_0_35px_rgba(243,13,41,0.2)]">
                <Image
                  src={inlineGender === 'nam' ? '/images/athlete-3d-preview.jpg' : '/images/female-athlete-3d-preview.jpg'}
                  alt="Body Measurement Model"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-black/20 to-transparent" />

                {/* Laser scanlines matching measurements */}
                <div className="absolute top-[32%] left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#f30d29] flex items-center justify-between px-3">
                  <span className="text-[9px] font-mono font-bold text-red-400 bg-black/70 px-1.5 py-0.5 rounded">V1 NGỰC</span>
                  <span className="text-[9px] font-mono font-bold text-white bg-red-600/90 px-1.5 py-0.5 rounded">{inlineBust} cm</span>
                </div>
                <div className="absolute top-[42%] left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#f30d29] flex items-center justify-between px-3">
                  <span className="text-[9px] font-mono font-bold text-red-400 bg-black/70 px-1.5 py-0.5 rounded">V2 EO</span>
                  <span className="text-[9px] font-mono font-bold text-white bg-red-600/90 px-1.5 py-0.5 rounded">{inlineWaist} cm</span>
                </div>
                <div className="absolute top-[52%] left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#f30d29] flex items-center justify-between px-3">
                  <span className="text-[9px] font-mono font-bold text-red-400 bg-black/70 px-1.5 py-0.5 rounded">V3 HÔNG</span>
                  <span className="text-[9px] font-mono font-bold text-white bg-red-600/90 px-1.5 py-0.5 rounded">{inlineHips} cm</span>
                </div>

                {/* Floating Metric Card Top Right */}
                <div className="absolute top-3 right-3 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Chiều cao</span>
                    <span className="font-bold">{inlineHeight} cm</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Cân nặng</span>
                    <span className="font-bold">{inlineWeight} kg</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">3 vòng</span>
                    <span className="font-bold text-red-400">{inlineBust}-{inlineWaist}-{inlineHips}</span>
                  </div>
                </div>

                <div className="absolute bottom-3 inset-x-3 text-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    DỮ LIỆU CHÍNH XÁC • TRẢI NGHIỆM TỐI ƯU
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: MODEL SETUP (Matching Image 3 & 4)                 */}
      {/* ============================================================ */}
      <section id="step-2-model" className="w-full">
        {(!customAvatarUrl && !isGeneratingAvatar && isEditingModel) || (!customAvatarUrl && !isGeneratingAvatar && modelType !== 'male' && modelType !== 'female' && modelType !== 'custom') ? (
          /* -------------------------------------------------------- */
          /* Selection View: 3 Method Cards (Matching Image 3)        */
          /* -------------------------------------------------------- */
          <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-red-50/20 border border-gray-200/90 p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            {/* Header */}
            <div className="pb-6 border-b border-gray-200/80">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#f30d29] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                BƯỚC 02 / 04 • THIẾT LẬP HÌNH MẪU
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-gray-950">
                <span>2. CHỌN / TẠO </span>
                <span className="text-brand">HÌNH MẪU ĐẠI DIỆN</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
                Lựa chọn 1 trong 3 phương thức: Tạo dáng AI độc bản từ số đo, Dùng mẫu VĐV Studio có sẵn (tức thì), hoặc Tải ảnh thật của bạn.
              </p>
            </div>

            {/* 3 Method Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Card 1: Tạo dáng AI từ số đo (Dark High-Tech Card with glowing red border) */}
              <div className="relative rounded-2xl bg-[#0b0d11] text-white p-6 border border-red-500 shadow-[0_0_30px_rgba(243,13,41,0.25)] flex flex-col justify-between overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      <Lightning size={12} weight="fill" />
                      <span>KHUYÊN DÙNG • AI CHUẨN TỶ LỆ</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-black uppercase text-white">
                    TẠO DÁNG AI TỪ SỐ ĐO
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Dùng Alibaba Cloud Qwen-Image-Max tái tạo chính xác cơ thể theo thông số {inlineHeight}cm • V1:{inlineBust} V2:{inlineWaist} V3:{inlineHips}.
                  </p>

                  <div className="space-y-2.5 pt-1 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-red-400 shrink-0" />
                      <span>Chuẩn xác theo số đo thật</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cube size={16} className="text-red-400 shrink-0" />
                      <span>Thể hiện trang phục chi tiết</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-red-400 shrink-0" />
                      <span>Công nghệ AI tiên tiến Alibaba Cloud</span>
                    </div>
                  </div>

                  {/* Wireframe Graphic Preview */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#050608] border border-red-900/50 mt-2">
                    <Image
                      src={inlineGender === 'nam' ? '/images/athlete-3d-preview.jpg' : '/images/female-athlete-3d-preview.jpg'}
                      alt="AI Wireframe Preview"
                      fill
                      className="object-cover object-top opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11] via-transparent to-transparent" />
                    <div className="absolute inset-x-2 bottom-2 flex justify-between text-[10px] font-mono text-red-400 bg-black/70 px-2.5 py-1 rounded-md">
                      <span>{inlineGender === 'nam' ? 'VĐV Nam' : 'VĐV Nữ'}</span>
                      <span>{inlineBust}-{inlineWaist}-{inlineHips} cm</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiAvatar}
                  disabled={isGeneratingAvatar}
                  className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-[#f30d29] to-red-600 text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(243,13,41,0.4)] hover:shadow-[0_0_30px_rgba(243,13,41,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lightning size={16} weight="fill" />
                  <span>{isGeneratingAvatar ? 'ĐANG TẠO HÌNH MẪU AI...' : 'TẠO DÁNG NGAY'}</span>
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>

              {/* Card 2: Mẫu VĐV Studio Li-Ning (Clean White Card) */}
              <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider">
                    <Lightning size={12} />
                    <span>TỨC THÌ • KHÔNG CẦN CHỜ</span>
                  </span>

                  <h3 className="text-xl font-black uppercase text-gray-900">
                    MẪU VĐV STUDIO LI-NING
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Sử dụng ngay hình ảnh người mẫu thể thao chuyên nghiệp có sẵn tại Studio. Thử đồ ngay lập tức mà không cần gọi API.
                  </p>

                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-100 bg-gray-50 mt-2">
                    <Image
                      src="/images/couple-athletes-3d-preview.jpg"
                      alt="Studio Athletes"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetModel('male')}
                    className="py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <User size={16} />
                    <span>VĐV Nam</span>
                    <CaretRight size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetModel('female')}
                    className="py-3 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <User size={16} />
                    <span>VĐV Nữ</span>
                    <CaretRight size={14} />
                  </button>
                </div>
              </div>

              {/* Card 3: Tải / Chụp ảnh của bạn (Clean Upload Dropzone) */}
              <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                    <Camera size={12} />
                    <span>ẢNH TOÀN THÂN CỦA BẠN</span>
                  </span>

                  <h3 className="text-xl font-black uppercase text-gray-900">
                    TẢI / CHỤP ẢNH CỦA BẠN
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Tải ảnh chụp đứng toàn thân của bạn lên. FitRoom AI sẽ trực tiếp ghép trang phục thể thao Li-Ning lên người bạn.
                  </p>

                  {/* Dropzone Container */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-red-500 bg-gray-50 hover:bg-red-50/20 cursor-pointer flex flex-col items-center justify-center text-center p-4 transition-all group"
                  >
                    <UploadSimple size={36} className="text-gray-400 group-hover:text-brand transition-colors mb-2" />
                    <span className="text-xs font-bold text-gray-800 group-hover:text-brand block">
                      KÉO THẢ ẢNH VÀO ĐÂY
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">Hoặc nhấn để chọn file</span>
                    <span className="text-[9px] text-gray-400 mt-2">Hỗ trợ JPG, PNG (Tối đa 10MB)</span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCustomFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mt-6 py-3.5 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-gray-900 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <Camera size={16} />
                  <span>CHỌN FILE ẢNH</span>
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* -------------------------------------------------------- */
          /* Avatar Ready View: Holographic Stage (Matching Image 4)   */
          /* -------------------------------------------------------- */
          <div className="relative w-full rounded-3xl overflow-hidden bg-[#090b10] border border-red-900/30 text-white p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />

            {/* Stepper Bar Top (matching Image 4) */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider">
                <div className="flex items-center gap-1 text-gray-400">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">1</span>
                  <span>Nhập số đo</span>
                </div>
                <span className="text-white/30">—</span>
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white">2</span>
                  <span className="text-red-400">Thiết lập hình mẫu</span>
                </div>
                <span className="text-white/30">—</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px]">3</span>
                  <span>Chọn trang phục</span>
                </div>
                <span className="text-white/30">—</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px]">4</span>
                  <span>Xem kết quả</span>
                </div>
              </div>
              <div className="text-right hidden sm:block text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                SPORTS × TECHNOLOGY × A BETTER YOU
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column (span 5): 3D Cylinder Stage */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative w-full max-w-[380px] aspect-[3/4] rounded-2xl overflow-hidden border border-red-500/40 shadow-[0_0_40px_rgba(243,13,41,0.3)] bg-gradient-to-b from-[#0e1118] to-[#06080b]">
                  {/* Cylinder holographic light cage background */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(243,13,41,0.4),transparent_70%)]" />

                  {/* Avatar Image */}
                  <Image
                    src={modelPreviewUrl}
                    alt="AI Avatar Model"
                    fill
                    className="object-contain object-bottom scale-95"
                  />

                  {/* Circular illuminated floor ring */}
                  <div className="absolute bottom-2 inset-x-8 h-8 rounded-[100%] border-2 border-red-500/80 shadow-[0_0_20px_#f30d29,inset_0_0_15px_#f30d29] pointer-events-none" />

                  {/* 360 View Badge */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono flex items-center gap-1.5 shadow-md">
                      <ArrowsClockwise size={12} className="text-red-400" />
                      <span>XEM 360°</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column (span 7): Status & Action */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                    BƯỚC 02 / 04 • THIẾT LẬP HÌNH MẪU
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                    <Check size={12} weight="bold" />
                    <span>HÌNH MẪU ĐÃ SẴN SÀNG</span>
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
                  <span className="text-white block">MẪU AI ĐỘC BẢN</span>
                  <span className="text-brand block mt-1">THEO SỐ ĐO CƠ THỂ</span>
                </h2>

                <p className="text-sm text-gray-300 max-w-xl leading-relaxed">
                  Hình mẫu 3D cá nhân hóa của bạn đã được tạo thành công. Sẵn sàng để thử mọi phong cách Li-Ning theo đúng số đo thực tế.
                </p>

                {/* 4 Metric Pills (matching Image 4) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#12151c] border border-white/10 text-center">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Giới tính</span>
                    <span className="text-sm font-bold text-white uppercase">{inlineGender === 'nam' ? 'Nam' : 'Nữ'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#12151c] border border-white/10 text-center">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Chiều cao</span>
                    <span className="text-sm font-bold text-white">{inlineHeight} cm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#12151c] border border-white/10 text-center">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Cân nặng</span>
                    <span className="text-sm font-bold text-white">{inlineWeight} kg</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#12151c] border border-white/10 text-center">
                    <span className="text-[10px] text-gray-400 block mb-0.5">Số đo 3 vòng</span>
                    <span className="text-sm font-bold text-red-400">{inlineBust}-{inlineWaist}-{inlineHips}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToSection('step-3-apparel')}
                    className="flex-1 py-4 px-8 rounded-full bg-gradient-to-r from-red-600 via-[#f30d29] to-red-600 text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(243,13,41,0.5)] hover:shadow-[0_0_35px_rgba(243,13,41,0.7)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>TIẾP TỤC: BƯỚC 3 - CHỌN TRANG PHỤC LI-NING</span>
                    <ArrowRight size={18} weight="bold" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingModel(true)}
                    className="py-4 px-6 rounded-full bg-white/5 border border-white/15 hover:border-white/30 text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer text-center"
                  >
                    ĐỔI HÌNH MẪU
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Dữ liệu của bạn được bảo mật và chỉ phục vụ trải nghiệm cá nhân hóa</span>
                  </span>
                  <span className="font-serif italic text-red-500/80 hidden sm:inline">Move Smarter With AI</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* SECTION 3: APPAREL SELECTION & TRY-ON (Matching Image 5)      */}
      {/* ============================================================ */}
      <section
        id="step-3-apparel"
        className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#f8f9fa] to-white border border-gray-200/80 p-6 sm:p-10 lg:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.05)]"
      >
        {/* Header */}
        <div className="pb-6 border-b border-gray-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#f30d29] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            BƯỚC 03 / 04 • TRANG PHỤC & MẶC THỬ
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-gray-950">
            <span>3. CHỌN TRANG PHỤC LI-NING </span>
            <span className="text-brand">& MẶC THỬ AI</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Chọn áo, quần hoặc phối cả bộ. Bấm &quot;Bắt đầu thử&quot; để FitRoom AI ghép đồ theo tỷ lệ người mẫu.
          </p>
        </div>

        {/* Mode Selector Tabs (Matching Image 5) */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-6">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTryOnMode('combo')}
              className={\`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer \${
                tryOnMode === 'combo'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-black'
              }\`}
            >
              <Lightning size={14} weight="fill" />
              <span>Phối Cả Bộ (Combo)</span>
            </button>
            <button
              type="button"
              onClick={() => setTryOnMode('upper')}
              className={\`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer \${
                tryOnMode === 'upper'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-black'
              }\`}
            >
              <TShirt size={14} />
              <span>Chỉ Áo</span>
            </button>
            <button
              type="button"
              onClick={() => setTryOnMode('lower')}
              className={\`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer \${
                tryOnMode === 'lower'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-black'
              }\`}
            >
              <Pants size={14} />
              <span>Chỉ Quần</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyRecommendedSkinTone(!onlyRecommendedSkinTone)}
              className={\`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer \${
                onlyRecommendedSkinTone
                  ? 'bg-amber-50 border-amber-400 text-amber-800'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }\`}
            >
              <Sparkle size={14} className={onlyRecommendedSkinTone ? 'text-amber-600' : 'text-gray-400'} />
              <span>Lọc Tôn Da</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setModalTargetSlot('upper');
                setIsCatalogModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:border-gray-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MagnifyingGlass size={14} className="text-gray-400" />
              <span>Kho 800+ Sản Phẩm</span>
            </button>
          </div>
        </div>

        {/* Apparel Main Layout: Left catalog grids (7 cols), Right sticky avatar card (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upper & Lower Clothing Selection */}
          <div className="lg:col-span-7 space-y-8">
            {/* UPPER APPAREL (ÁO) */}
            {(tryOnMode === 'combo' || tryOnMode === 'upper') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TShirt size={20} className="text-brand" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                      CHỌN ÁO THỂ THAO
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">
                    Đang chọn: <strong className="text-brand">{activeTop.sku || activeTop.title}</strong>
                  </span>
                </div>

                {/* Categories filter pills */}
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
                  {topCategories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setTopCategory(cat.key)}
                      className={\`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-all border \${
                        topCategory === cat.key
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }\`}
                    >
                      {cat.label} ({cat.count})
                    </button>
                  ))}
                </div>

                {/* Top Apparel Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {suggestedTops.slice(0, 8).map((garment) => {
                    const isSelected = activeTop.id === garment.id || activeTop.sku === garment.sku;
                    return (
                      <div
                        key={garment.id}
                        onClick={() => setActiveTop(garment)}
                        className={\`group relative p-2.5 rounded-xl bg-white border cursor-pointer transition-all flex flex-col justify-between \${
                          isSelected
                            ? 'border-red-500 ring-2 ring-red-500/20 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }\`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                            <Check size={12} weight="bold" />
                          </div>
                        )}
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2">
                          <Image src={garment.image} alt={garment.title} fill className="object-contain p-1 group-hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-gray-900 truncate leading-tight mb-1">
                            {garment.title}
                          </h4>
                          <span className="text-xs font-bold text-red-600 block">
                            {formatPrice(garment.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LOWER APPAREL (QUẦN) */}
            {(tryOnMode === 'combo' || tryOnMode === 'lower') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pants size={20} className="text-brand" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                      CHỌN QUẦN THỂ THAO
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">
                    Đang chọn: <strong className="text-brand">{activeBottom.sku || activeBottom.title}</strong>
                  </span>
                </div>

                {/* Categories filter pills */}
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
                  {bottomCategories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setBottomCategory(cat.key)}
                      className={\`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-all border \${
                        bottomCategory === cat.key
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }\`}
                    >
                      {cat.label} ({cat.count})
                    </button>
                  ))}
                </div>

                {/* Bottom Apparel Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {suggestedBottoms.slice(0, 8).map((garment) => {
                    const isSelected = activeBottom.id === garment.id || activeBottom.sku === garment.sku;
                    return (
                      <div
                        key={garment.id}
                        onClick={() => setActiveBottom(garment)}
                        className={\`group relative p-2.5 rounded-xl bg-white border cursor-pointer transition-all flex flex-col justify-between \${
                          isSelected
                            ? 'border-red-500 ring-2 ring-red-500/20 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }\`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                            <Check size={12} weight="bold" />
                          </div>
                        )}
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2">
                          <Image src={garment.image} alt={garment.title} fill className="object-contain p-1 group-hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-gray-900 truncate leading-tight mb-1">
                            {garment.title}
                          </h4>
                          <span className="text-xs font-bold text-red-600 block">
                            {formatPrice(garment.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Avatar Try-On HUD Card (Matching Image 5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="relative rounded-2xl overflow-hidden bg-[#090b10] border border-red-500/50 shadow-[0_0_40px_rgba(243,13,41,0.25)] p-5 text-white">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">HÌNH MẪU AI CỦA BẠN</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">cm | kg</span>
              </div>

              {/* Avatar Stage Container */}
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#050608] border border-red-950 flex items-center justify-center">
                {/* Red circular glowing floor ring */}
                <div className="absolute bottom-2 inset-x-8 h-8 rounded-[100%] border-2 border-red-500/80 shadow-[0_0_20px_#f30d29,inset_0_0_15px_#f30d29] pointer-events-none" />

                <Image
                  src={modelPreviewUrl}
                  alt="Avatar"
                  fill
                  className="object-contain object-bottom scale-95"
                />

                {/* Left Tool Strip */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs">
                    <TShirt size={16} className={tryOnMode !== 'lower' ? 'text-red-400' : 'text-gray-400'} />
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs">
                    <Pants size={16} className={tryOnMode !== 'upper' ? 'text-red-400' : 'text-gray-400'} />
                  </div>
                </div>

                {/* Floating Metric Badge */}
                <div className="absolute top-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] space-y-0.5">
                  <div className="flex justify-between gap-3 text-gray-300">
                    <span>Chiều cao</span>
                    <span className="font-bold">{inlineHeight} cm</span>
                  </div>
                  <div className="flex justify-between gap-3 text-gray-300">
                    <span>Cân nặng</span>
                    <span className="font-bold">{inlineWeight} kg</span>
                  </div>
                  <div className="flex justify-between gap-3 text-red-400 font-mono font-bold">
                    <span>3 vòng</span>
                    <span>{inlineBust}-{inlineWaist}-{inlineHips}</span>
                  </div>
                </div>

                {/* Script text: Move Smarter */}
                <div className="absolute bottom-12 left-4">
                  <span className="font-serif italic text-lg sm:text-xl text-red-500/90 drop-shadow-[0_0_8px_rgba(243,13,41,0.5)] block">
                    Move Smarter
                  </span>
                  <span className="font-mono text-[9px] tracking-widest text-white/70 uppercase block">WITH AI</span>
                </div>

                {/* 360 View Button */}
                <div className="absolute bottom-3 inset-x-3 text-center">
                  <button
                    type="button"
                    onClick={() => scrollToSection('step-4-results')}
                    className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono inline-flex items-center gap-1.5 hover:bg-black transition-colors cursor-pointer"
                  >
                    <Cube size={14} className="text-red-400" />
                    <span>Xem ở chế độ 3D 360°</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Sticky Bottom Bar (Matching Image 5) */}
        <div className="sticky bottom-4 z-40 mt-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b0e14]/95 backdrop-blur-xl border border-red-500/50 shadow-[0_15px_50px_rgba(0,0,0,0.7)] text-white flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Selected Garments */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold block">
                  ĐÃ CHỌN ({tryOnMode === 'combo' ? '2' : '1'} SP):
                </span>
                <div className="flex items-center gap-2">
                  {(tryOnMode === 'combo' || tryOnMode === 'upper') && (
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/10 relative border border-white/20 shrink-0">
                      <Image src={activeTop.image} alt={activeTop.title} fill className="object-cover" />
                    </div>
                  )}
                  {tryOnMode === 'combo' && <span className="text-gray-400 font-bold">+</span>}
                  {(tryOnMode === 'combo' || tryOnMode === 'lower') && (
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/10 relative border border-white/20 shrink-0">
                      <Image src={activeBottom.image} alt={activeBottom.title} fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Center: Sizing & Total Price */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">GỢI Ý SIZE</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span>Size {suggestedSize}</span>
                  <span className="text-[10px] text-gray-400 font-normal">Dựa trên số đo</span>
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">TỔNG TIỀN</span>
                <span className="text-sm sm:text-base font-black text-brand">
                  {formatPrice(currentTotalPrice)}
                </span>
              </div>
            </div>

            {/* Right: Big Glowing CTA Button */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleStartTryOn}
                disabled={isProcessing}
                className="w-full md:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-[#f30d29] to-red-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(243,13,41,0.6)] hover:shadow-[0_0_35px_rgba(243,13,41,0.8)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkle size={18} weight="fill" />
                <span>{isProcessing ? 'AI ĐANG MẶC THỬ...' : tryOnMode === 'combo' ? 'BẮT ĐẦU THỬ CẢ BỘ (COMBO)' : 'BẮT ĐẦU THỬ ĐỒ AI'}</span>
                <ArrowRight size={18} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4: AI RESULTS & 3D FITTING ROOM                      */}
      {/* ============================================================ */}
      <section
        id="step-4-results"
        className="relative w-full rounded-3xl overflow-hidden bg-[#090b10] border border-red-900/40 p-6 sm:p-10 lg:p-12 text-white shadow-[0_25px_70px_rgba(0,0,0,0.6)]"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
              BƯỚC 04 / 04 • KẾT QUẢ THỬ ĐỒ & 3D
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              <span>KẾT QUẢ THỬ ĐỒ AI </span>
              <span className="text-brand">& PHÒNG THỬ 3D 360°</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Hình ảnh trang phục Li-Ning đã được AI xử lý chính xác theo phom dáng của bạn.
            </p>
          </div>

          {/* Mode switch pills */}
          <div className="flex items-center gap-1.5 bg-[#12151c] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewCompareMode('slider')}
              className={\`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer \${
                viewCompareMode === 'slider' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }\`}
            >
              So sánh Trực quan
            </button>
            <button
              type="button"
              onClick={() => setViewCompareMode('result')}
              className={\`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer \${
                viewCompareMode === 'result' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }\`}
            >
              Ảnh Kết quả
            </button>
            <button
              type="button"
              onClick={() => setViewCompareMode('3d')}
              className={\`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 \${
                viewCompareMode === '3d' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }\`}
            >
              <Cube size={14} />
              <span>Phòng 3D 360°</span>
            </button>
          </div>
        </div>

        {/* Processing Loading Indicator */}
        {isProcessing && (
          <div className="my-8 p-6 rounded-2xl bg-[#12151c] border border-red-500/40 text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <Sparkle size={24} className="text-brand animate-spin" />
              <span className="text-sm font-bold text-white uppercase">{statusText}</span>
            </div>
            <div className="w-full max-w-md mx-auto h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-500"
                style={{ width: \`\${progress}%\` }}
              />
            </div>
          </div>
        )}

        {/* Main Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          {/* Left Column (span 7): Visual Comparison / Result / 3D */}
          <div className="lg:col-span-7">
            {viewCompareMode === '3d' ? (
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#050608] border border-white/10 relative">
                <Hy3DViewer
                  modelUrl={threeDGlbUrl || ''}
                  posterImageUrl={resultImageUrl || modelPreviewUrl}
                />
              </div>
            ) : viewCompareMode === 'slider' && resultImageUrl ? (
              /* Interactive Before/After Split Slider */
              <div
                ref={sliderContainerRef}
                onMouseDown={() => setIsDraggingSlider(true)}
                onTouchStart={() => setIsDraggingSlider(true)}
                className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 select-none cursor-ew-resize bg-black shadow-[0_0_40px_rgba(0,0,0,0.5)]"
              >
                {/* Before Image (Original Avatar) */}
                <Image
                  src={modelPreviewUrl}
                  alt="Trước khi thử"
                  fill
                  className="object-cover object-top"
                />

                {/* After Image (Clipped with Slider position) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: \`polygon(\${sliderPosition}% 0, 100% 0, 100% 100%, \${sliderPosition}% 100%)\` }}
                >
                  <Image
                    src={resultImageUrl}
                    alt="Sau khi thử"
                    fill
                    className="object-cover object-top"
                  />
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_#fff]"
                  style={{ left: \`\${sliderPosition}%\` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <ArrowsClockwise size={16} weight="bold" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono uppercase text-gray-300">
                  GỐC (BEFORE)
                </div>
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-red-600/90 backdrop-blur-md text-[10px] font-mono uppercase text-white font-bold">
                  THỬ ĐỒ AI (AFTER)
                </div>
              </div>
            ) : (
              /* Single View */
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 bg-black">
                <Image
                  src={resultImageUrl || modelPreviewUrl}
                  alt="Kết quả"
                  fill
                  className="object-cover object-top"
                />
              </div>
            )}
          </div>

          {/* Right Column (span 5): Outfit Details & Add to Cart */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#12151c] border border-white/10 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold block">
                BỘ TRANG PHỤC ĐÃ PHỐI
              </span>

              {/* Garments Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 relative shrink-0">
                    <Image src={activeTop.image} alt={activeTop.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white truncate block">{activeTop.title}</span>
                    <span className="text-[11px] text-gray-400 block font-mono">{activeTop.sku}</span>
                  </div>
                  <span className="text-xs font-bold text-red-400">{formatPrice(activeTop.price)}</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 relative shrink-0">
                    <Image src={activeBottom.image} alt={activeBottom.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white truncate block">{activeBottom.title}</span>
                    <span className="text-[11px] text-gray-400 block font-mono">{activeBottom.sku}</span>
                  </div>
                  <span className="text-xs font-bold text-red-400">{formatPrice(activeBottom.price)}</span>
                </div>
              </div>

              {/* Sizing Advisory */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck size={20} className="shrink-0 text-emerald-400" />
                <span>
                  Đề xuất size chuẩn theo số đo: <strong>Size {suggestedSize}</strong> (Vừa vặn hoàn hảo).
                </span>
              </div>

              {/* Total & Action Buttons */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase">TỔNG CỘNG:</span>
                <span className="text-xl font-black text-brand">{formatPrice(currentTotalPrice)}</span>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart('all')}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-red-600 via-[#f30d29] to-red-600 text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(243,13,41,0.5)] hover:shadow-[0_0_30px_rgba(243,13,41,0.7)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={18} weight="bold" />
                  <span>THÊM CẢ BỘ VÀO GIỎ HÀNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerate3D()}
                  className="w-full py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Cube size={16} />
                  <span>XEM MÔ HÌNH 3D CHI TIẾT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FULL CATALOG MODAL (800+ Garments)                           */}
      {/* ============================================================ */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0c0e14] border border-white/20 rounded-2xl overflow-hidden flex flex-col text-white shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MagnifyingGlass size={20} className="text-brand" />
                <h3 className="text-base font-bold uppercase">
                  Kho Trang Phục Thể Thao Li-Ning (800+)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Search & Filters */}
            <div className="p-4 border-b border-white/10 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <input
                  type="text"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên sản phẩm, mã SKU..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#151922] border border-white/10 text-white text-xs focus:border-red-500 focus:outline-none"
                />
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalTargetSlot('upper')}
                  className={\`px-3 py-2 rounded-lg text-xs font-bold \${
                    modalTargetSlot === 'upper' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300'
                  }\`}
                >
                  Áo thể thao
                </button>
                <button
                  type="button"
                  onClick={() => setModalTargetSlot('lower')}
                  className={\`px-3 py-2 rounded-lg text-xs font-bold \${
                    modalTargetSlot === 'lower' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300'
                  }\`}
                >
                  Quần thể thao
                </button>
              </div>
            </div>

            {/* Garment Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {modalGarments.map((garment) => (
                <div
                  key={garment.id}
                  onClick={() => {
                    if (modalTargetSlot === 'upper') setActiveTop(garment);
                    else setActiveBottom(garment);
                    setIsCatalogModalOpen(false);
                  }}
                  className="group p-2 rounded-xl bg-[#141720] border border-white/10 hover:border-red-500 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black/40 mb-1.5">
                    <Image src={garment.image} alt={garment.title} fill className="object-contain p-1 group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-white truncate">{garment.title}</h4>
                    <span className="text-[11px] font-bold text-red-400 block">{formatPrice(garment.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('/Users/hoangthuy/.gemini/antigravity/brain/2ec2e31f-cec6-4bf2-8961-5e492324bb2a/scratch/AiSportsStylistSection.tsx', content, 'utf8');
console.log('AiSportsStylistSection rewritten cleanly!');
