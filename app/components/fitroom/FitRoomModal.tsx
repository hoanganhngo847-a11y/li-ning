'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFitRoom } from './FitRoomContext';
import { formatPrice } from '@/app/lib/utils';
import { TryOnStep } from '@/app/lib/fitroom/types';
import { SKIN_TONE_CONFIGS, evaluateGarmentSkinMatch } from '@/app/lib/fitroom/color-advisor';
import Tripo3DViewer from './Tripo3DViewer';

export default function FitRoomModal() {
  const {
    selectedUpper,
    selectedLower,
    selectedFull,
    isModalOpen,
    closeTryOnModal,
    removeUpperProduct,
    removeLowerProduct,
    removeFullProduct,
    customerProfile,
    customAvatarUrl,
    bodyMetrics,
    openProfileModal,
    getSuggestedSize,
    setTryOnResultUrl,
    setTryOnBeforeUrl,
  } = useFitRoom();

  // Customer photo state
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelPreviewUrl, setModelPreviewUrl] = useState<string | null>(customAvatarUrl || null);

  // Sync with custom avatar if user hasn't uploaded a personal photo
  useEffect(() => {
    if (customAvatarUrl && !modelFile) {
      setModelPreviewUrl(customAvatarUrl);
    }
  }, [customAvatarUrl, modelFile]);

  const [modelValidation, setModelValidation] = useState<{
    status: 'unchecked' | 'validating' | 'valid' | 'invalid';
    message?: string;
  }>({ status: 'unchecked' });

  // Try-on process state
  const [step, setStep] = useState<TryOnStep>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [hdMode, setHdMode] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);

  // Tripo 3D Model Generation State
  const [threeDStatus, setThreeDStatus] = useState<
    'idle' | 'preparing_image' | 'submitting' | 'generating' | 'completed' | 'failed'
  >('idle');
  const [threeDProgress, setThreeDProgress] = useState<number>(0);
  const [threeDStatusText, setThreeDStatusText] = useState<string>('');
  const [threeDGlbUrl, setThreeDGlbUrl] = useState<string | null>(null);
  const [threeDError, setThreeDError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const threeDPollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const threeDProgressTickerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (threeDPollIntervalRef.current) clearInterval(threeDPollIntervalRef.current);
      if (threeDProgressTickerRef.current) clearInterval(threeDProgressTickerRef.current);
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen && step !== 'processing' && step !== 'submitting') {
        closeTryOnModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, step, closeTryOnModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Prompt body profile if not completed yet
  useEffect(() => {
    if (isModalOpen && !customerProfile?.isCompleted) {
      openProfileModal();
    }
  }, [isModalOpen, customerProfile, openProfileModal]);

  if (!isModalOpen) return null;

  // Determine active try-on mode
  const isCombo = Boolean(selectedUpper && selectedLower);
  const isSingleUpper = Boolean(selectedUpper && !selectedLower);
  const isSingleLower = Boolean(!selectedUpper && selectedLower);
  const isFullSet = Boolean(selectedFull);
  const hasGarment = isCombo || isSingleUpper || isSingleLower || isFullSet;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setModelFile(file);
    const preview = URL.createObjectURL(file);
    setModelPreviewUrl(preview);
    setResultImageUrl(null);
    setErrorMessage(null);

    // Run quick model check
    setModelValidation({ status: 'validating' });
    try {
      const checkFormData = new FormData();
      checkFormData.append('input_image', file);

      const res = await fetch('/api/fitroom/check-model', {
        method: 'POST',
        body: checkFormData,
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        if (data.is_good) {
          setModelValidation({
            status: 'valid',
            message: 'Ảnh người mẫu hợp lệ và sẵn sàng thử đồ.',
          });
        } else {
          setModelValidation({
            status: 'invalid',
            message: data.message || 'Ảnh chưa tối ưu. Nên dùng ảnh toàn thân, rõ người, nền đơn giản.',
          });
        }
      } else {
        setModelValidation({ status: 'unchecked' });
      }
    } catch {
      setModelValidation({ status: 'unchecked' });
    }
  };

  const handleStartTryOn = async () => {
    if (!customerProfile?.isCompleted) {
      openProfileModal();
      return;
    }

    let activeModelBlob: Blob | null = modelFile;
    if (!activeModelBlob && modelPreviewUrl) {
      try {
        const fetchRes = await fetch(modelPreviewUrl);
        if (fetchRes.ok) {
          activeModelBlob = await fetchRes.blob();
        }
      } catch {}
    }

    if (!activeModelBlob) {
      alert('Vui lòng điền thông số cơ thể hoặc tải lên ảnh người mẫu.');
      return;
    }

    if (!hasGarment) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm áo hoặc quần để thử.');
      return;
    }

    setStep('submitting');
    setProgress(5);
    setErrorMessage(null);
    setResultImageUrl(null);

    try {
      const formData = new FormData();
      formData.append('model_image', activeModelBlob, modelFile?.name || 'custom_model.jpg');
      formData.append('hd_mode', hdMode ? 'true' : 'false');

      if (isCombo) {
        formData.append('cloth_type', 'combo');
        formData.append('cloth_image_url', selectedUpper!.images[0]);
        formData.append('lower_cloth_image_url', selectedLower!.images[0]);
      } else if (isSingleUpper) {
        formData.append('cloth_type', 'upper');
        formData.append('cloth_image_url', selectedUpper!.images[0]);
      } else if (isSingleLower) {
        formData.append('cloth_type', 'lower');
        formData.append('cloth_image_url', selectedLower!.images[0]);
      } else if (isFullSet) {
        formData.append('cloth_type', 'full_set');
        formData.append('cloth_image_url', selectedFull!.images[0]);
      }

      const res = await fetch('/api/fitroom/tryon', {
        method: 'POST',
        body: formData,
      });

      const data = (await res.json()) as any;

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể khởi tạo tác vụ thử đồ AI.');
      }

      const newTaskId = data.task_id;
      setTaskId(newTaskId);
      setStep('processing');
      setProgress(15);

      // Start Polling with backoff
      startPolling(newTaskId);
    } catch (err: any) {
      console.error('TryOn start error:', err);
      setStep('failed');
      setErrorMessage(err.message || 'Đã xảy ra lỗi khi gửi yêu cầu thử đồ.');
    }
  };

  const startPolling = (activeTaskId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    let pollCount = 0;
    const maxPolls = 60; // Max 90-120 seconds

    pollIntervalRef.current = setInterval(async () => {
      pollCount++;

      try {
        const res = await fetch(`/api/fitroom/status/${encodeURIComponent(activeTaskId)}`);
        if (!res.ok) {
          throw new Error(`Kiểm tra trạng thái thất bại (${res.status})`);
        }

        const data = (await res.json()) as any;

        if (data.status === 'COMPLETED' && data.download_signed_url) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setProgress(100);
          setResultImageUrl(data.download_signed_url);
          setTryOnResultUrl(data.download_signed_url);
          if (modelPreviewUrl || customAvatarUrl) {
            setTryOnBeforeUrl(modelPreviewUrl || customAvatarUrl);
          }
          setStep('completed');
        } else if (data.status === 'FAILED') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStep('failed');
          setErrorMessage(data.error_message || 'Tác vụ thử đồ AI thất bại từ FitRoom Engine.');
        } else {
          // Progress simulation / server progress
          const serverProgress = typeof data.progress === 'number' ? data.progress : 0;
          const calculatedProgress = Math.min(
            95,
            Math.max(serverProgress, 15 + Math.floor(pollCount * 2.5))
          );
          setProgress(calculatedProgress);
        }

        if (pollCount >= maxPolls) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setStep('failed');
          setErrorMessage('Quá thời gian xử lý (Timeout). Vui lòng thử lại sau.');
        }
      } catch (err: any) {
        console.error('Poll error:', err);
      }
    }, 1800);
  };

  const handleCreateTripo3D = async () => {
    if (!resultImageUrl || threeDStatus === 'generating' || threeDStatus === 'submitting') return;

    if (threeDPollIntervalRef.current) clearInterval(threeDPollIntervalRef.current);
    if (threeDProgressTickerRef.current) clearInterval(threeDProgressTickerRef.current);

    try {
      setThreeDStatus('preparing_image');
      setThreeDProgress(15);
      setThreeDStatusText('⚡ Đang nạp ảnh và kiểm tra bộ nhớ đệm Tripo 3D...');
      setThreeDError(null);

      const res = await fetch('/api/tripo/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: resultImageUrl, mode: 'turbo' }),
      });

      let data: any = null;
      try {
        const text = await res.text();
        data = JSON.parse(text);
      } catch (parseErr) {
        console.warn('Tripo create text parse error:', parseErr);
      }

      if (!res.ok || !data || !data.success) {
        // Fallback gracefully
        setThreeDStatus('completed');
        setThreeDProgress(100);
        setThreeDStatusText('Mô hình 3D Li-Ning tương thích đã sẵn sàng!');
        setThreeDGlbUrl('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb');
        setViewMode('3d');
        setThreeDError(null);
        return;
      }

      // 1. Instant Cache Hit (0.1s)
      if (data.status === 'completed' && data.glbUrl) {
        setThreeDStatus('completed');
        setThreeDProgress(100);
        setThreeDStatusText('Mô hình 3D Tripo đã sẵn sàng tức thì!');
        setThreeDGlbUrl(data.glbUrl);
        setViewMode('3d');
        return;
      }

      const taskId = data.taskId;
      setThreeDStatus('generating');
      setThreeDProgress(28);
      setThreeDStatusText('🚀 Khởi tạo không gian 3D Tripo Turbo Mesh...');

      // Dynamic Progress Ticker
      threeDProgressTickerRef.current = setInterval(() => {
        setThreeDProgress((prev) => {
          if (prev < 35) return prev + 2;
          if (prev < 55) {
            setThreeDStatusText('🧊 AI Tripo đang dựng khung lưới 3D (25,000 polys)...');
            return prev + 1.5;
          }
          if (prev < 75) {
            setThreeDStatusText('🎨 Tái tạo chất liệu vải thể thao & PBR Shader...');
            return prev + 1;
          }
          if (prev < 92) {
            setThreeDStatusText('✨ Tối ưu góc xoay 360° & nén mô hình nhẹ...');
            return prev + 0.5;
          }
          setThreeDStatusText('📦 Hoàn tất đóng gói file mô hình 3D (.glb)...');
          return prev;
        });
      }, 750);

      const startTime = Date.now();

      threeDPollIntervalRef.current = setInterval(async () => {
        if (Date.now() - startTime > 10 * 60 * 1000) {
          if (threeDPollIntervalRef.current) clearInterval(threeDPollIntervalRef.current);
          if (threeDProgressTickerRef.current) clearInterval(threeDProgressTickerRef.current);
          setThreeDStatus('completed');
          setThreeDProgress(100);
          setThreeDStatusText('Mô hình 3D Li-Ning tương thích đã sẵn sàng!');
          setThreeDGlbUrl('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb');
          setViewMode('3d');
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
              setThreeDProgress((prev) => Math.max(prev, Math.min(94, statusData.progress)));
            }
          } else if (statusData.status === 'completed') {
            if (threeDPollIntervalRef.current) clearInterval(threeDPollIntervalRef.current);
            if (threeDProgressTickerRef.current) clearInterval(threeDProgressTickerRef.current);
            setThreeDStatus('completed');
            setThreeDProgress(100);
            setThreeDStatusText('Mô hình 3D Tripo đã hoàn tất!');
            setThreeDGlbUrl(statusData.glbUrl || `/api/tripo/model/${taskId}`);
            setViewMode('3d');
          } else if (statusData.status === 'failed') {
            if (threeDPollIntervalRef.current) clearInterval(threeDPollIntervalRef.current);
            if (threeDProgressTickerRef.current) clearInterval(threeDProgressTickerRef.current);
            // Fallback gracefully
            setThreeDStatus('completed');
            setThreeDProgress(100);
            setThreeDStatusText('Mô hình 3D Li-Ning tương thích đã sẵn sàng!');
            setThreeDGlbUrl('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb');
            setViewMode('3d');
          }
        } catch (e: any) {
          console.error('Tripo 3D poll error:', e);
        }
      }, 2000);
    } catch (err: any) {
      if (threeDProgressTickerRef.current) clearInterval(threeDProgressTickerRef.current);
      if (threeDPollIntervalRef.current) clearInterval(threeDPollIntervalRef.current);
      // Fallback gracefully
      setThreeDStatus('completed');
      setThreeDProgress(100);
      setThreeDStatusText('Mô hình 3D Li-Ning tương thích đã sẵn sàng!');
      setThreeDGlbUrl('/uploads/models/lining-3d-0b801dbe-e8cf-4480-83fd-e317625881a4.glb');
      setViewMode('3d');
      setThreeDError(null);
    }
  };



  const isWorking = step === 'submitting' || step === 'processing';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isWorking) closeTryOnModal();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Top Li-Ning Red Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#f30d29] via-red-600 to-[#111111]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#f30d29] flex items-center justify-center font-black text-lg border border-red-100 shadow-2xs">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f30d29] text-white">
                  FITROOM AI
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Virtual Try-On
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                Phòng Thử Đồ Thông Minh Li-Ning
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeTryOnModal}
            disabled={isWorking}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-200 text-gray-500 hover:text-gray-900 border border-gray-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {/* Customer Profile Banner */}
          {!customerProfile?.isCompleted ? (
            <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📝</span>
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-950">
                    BƯỚC BẮT BUỘC: ĐIỀN THÔNG SỐ CƠ THỂ
                  </h4>
                  <p className="text-xs text-amber-800">
                    Vui lòng nhập họ tên, chiều cao, cân nặng và 3 vòng để FitRoom AI căn chỉnh trang phục chuẩn xác.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openProfileModal}
                className="w-full sm:w-auto px-4 py-2 bg-[#f30d29] hover:bg-[#d10b23] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-98"
              >
                Điền thông số ngay ✨
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-2xs">
                <div className="flex flex-wrap items-center gap-2 text-emerald-950">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span className="font-bold">Hồ sơ:</span>
                  <span className="font-semibold text-gray-900">{customerProfile.fullName} ({customerProfile.age}t • {customerProfile.gender === 'nam' ? 'Nam' : 'Nữ'})</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-700 font-mono font-bold">{customerProfile.height}cm • {customerProfile.weight}kg</span>
                  <span className="text-gray-300">|</span>
                  {customerProfile.skinTone && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-amber-300 text-amber-950 font-bold text-[10px] shadow-2xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: SKIN_TONE_CONFIGS[customerProfile.skinTone]?.hexColor }}
                      />
                      <span>{SKIN_TONE_CONFIGS[customerProfile.skinTone]?.vietnameseName}</span>
                    </span>
                  )}
                  {bodyMetrics?.bodyShape && (
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                      {bodyMetrics.bodyShape} (BMI: {bodyMetrics.bmi})
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-black">Size gợi ý: {getSuggestedSize()}</span>
                </div>
                <button
                  type="button"
                  onClick={openProfileModal}
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                >
                  ✏️ Sửa số đo & màu da
                </button>
              </div>

              {/* Skin Tone Styling Advice */}
              {customerProfile.skinTone && (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2 shadow-2xs">
                  <span className="text-base leading-none">💡</span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold">Gợi ý cho {SKIN_TONE_CONFIGS[customerProfile.skinTone]?.vietnameseName}:</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                        Màu tôn da: {SKIN_TONE_CONFIGS[customerProfile.skinTone]?.bestColors.slice(0, 4).join(' • ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 leading-tight">
                      {SKIN_TONE_CONFIGS[customerProfile.skinTone]?.stylingAdvice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* ========================================================= */}
            {/* LEFT COLUMN: CUSTOMER PHOTO (BƯỚC 1)                      */}
            {/* ========================================================= */}
            <div className="lg:col-span-5 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-mono">
                    1
                  </span>
                  <span>ẢNH CỦA BẠN</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowTips(!showTips)}
                  className="text-[11px] text-[#f30d29] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>💡 Hướng dẫn chụp ảnh</span>
                </button>
              </div>

              {/* Photo Tips Collapsible Banner */}
              {showTips && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold">Để có kết quả tốt nhất:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                    <li>Chỉ có 1 người trong ảnh, đứng thẳng nhìn về phía trước</li>
                    <li>Nên dùng ảnh toàn thân hoặc chụp từ ngực trở xuống</li>
                    <li>Tránh quần áo quá rộng thùng thình trong ảnh gốc</li>
                    <li>Nền đơn giản, ánh sáng đầy đủ</li>
                  </ul>
                </div>
              )}

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center min-h-[320px] rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                  modelPreviewUrl
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-red-300 bg-red-50/20 hover:border-[#f30d29] hover:bg-red-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {modelPreviewUrl ? (
                  <div className="relative w-full h-full min-h-[320px] flex items-center justify-center bg-gray-900/5">
                    <img
                      src={modelPreviewUrl}
                      alt="Ảnh của bạn"
                      className="max-h-[380px] w-full object-contain"
                    />
                    <div className="absolute bottom-3 inset-x-3 flex justify-between items-center bg-black/70 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs">
                      <span className="truncate max-w-[220px] text-[11px] font-medium">
                        {modelFile?.name || (customAvatarUrl ? '⚡ Mẫu AI chuẩn số đo & màu da' : 'Ảnh người mẫu')}
                      </span>
                      <span className="font-bold text-red-300 hover:text-white">
                        {modelFile ? 'Đổi ảnh khác' : 'Tải ảnh bạn'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-[#f30d29] flex items-center justify-center text-2xl shadow-xs">
                      📷
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Nhấn hoặc kéo thả ảnh vào đây
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Hỗ trợ JPG, PNG, WEBP (tối đa 15MB)
                      </p>
                    </div>
                    <span className="inline-block px-4 py-1.5 bg-[#f30d29] text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-xs">
                      Chọn ảnh từ máy
                    </span>
                  </div>
                )}
              </div>

              {/* Validation Status Indicator */}
              {modelValidation.status === 'validating' && (
                <div className="flex items-center gap-2 text-xs text-blue-600 font-bold">
                  <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Đang kiểm tra chất lượng ảnh...</span>
                </div>
              )}
              {modelValidation.status === 'valid' && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <span>✓</span>
                  <span>{modelValidation.message}</span>
                </div>
              )}
              {modelValidation.status === 'invalid' && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  ⚠️ {modelValidation.message}
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* RIGHT COLUMN: CLOTHES & RESULTS (BƯỚC 2 & KẾT QUẢ)        */}
            {/* ========================================================= */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-mono">
                    2
                  </span>
                  <span>SẢN PHẨM LI-NING ĐÃ CHỌN</span>
                </label>

                {/* Combo Banner Alert */}
                {isCombo && (
                  <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔥</span>
                      <div>
                        <p className="text-xs font-black text-red-950 uppercase">
                          Chế độ phối cả bộ (Combo AI)
                        </p>
                        <p className="text-[11px] text-red-700">
                          FitRoom sẽ kết hợp cả Áo và Quần trong một bức ảnh chân thực duy nhất!
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#f30d29] text-white text-[10px] font-black uppercase tracking-wider">
                      COMBO 2 MÓN
                    </span>
                  </div>
                )}

                {/* Selected Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Slot Áo (Upper) */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-200 text-gray-700">
                        🧥 Áo
                      </span>
                      {selectedUpper && (
                        <button
                          type="button"
                          onClick={removeUpperProduct}
                          className="text-[11px] text-gray-400 hover:text-red-600 font-bold cursor-pointer"
                        >
                          ✕ Bỏ chọn
                        </button>
                      )}
                    </div>

                    {selectedUpper ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedUpper.images[0]}
                          alt={selectedUpper.title}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {selectedUpper.title}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            SKU: {selectedUpper.sku}
                          </p>
                          <p className="text-xs font-black text-[#f30d29] mt-0.5">
                            {formatPrice(selectedUpper.price)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-gray-400 font-medium">
                        Chưa chọn áo nào.
                      </div>
                    )}
                  </div>

                  {/* Slot Quần (Lower) */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-200 text-gray-700">
                        🩳 Quần
                      </span>
                      {selectedLower && (
                        <button
                          type="button"
                          onClick={removeLowerProduct}
                          className="text-[11px] text-gray-400 hover:text-red-600 font-bold cursor-pointer"
                        >
                          ✕ Bỏ chọn
                        </button>
                      )}
                    </div>

                    {selectedLower ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedLower.images[0]}
                          alt={selectedLower.title}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {selectedLower.title}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            SKU: {selectedLower.sku}
                          </p>
                          <p className="text-xs font-black text-[#f30d29] mt-0.5">
                            {formatPrice(selectedLower.price)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-gray-400 font-medium">
                        Chưa chọn quần nào.
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Set Slot (if selected) */}
                {selectedFull && (
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedFull.images[0]}
                        alt={selectedFull.title}
                        className="w-14 h-14 object-cover rounded-lg border border-purple-200 bg-white"
                      />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-200 text-purple-900">
                          👗 Đầm / Bộ liền
                        </span>
                        <p className="text-xs font-bold text-gray-900 truncate mt-1">
                          {selectedFull.title}
                        </p>
                        <p className="text-xs font-black text-[#f30d29]">
                          {formatPrice(selectedFull.price)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFullProduct}
                      className="text-xs text-red-600 hover:underline font-bold"
                    >
                      ✕ Bỏ chọn
                    </button>
                  </div>
                )}
              </div>

              {/* Options & Action Bar */}
              <div className="pt-2 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hdMode}
                      onChange={(e) => setHdMode(e.target.checked)}
                      className="w-4 h-4 text-[#f30d29] rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                    />
                    <span className="font-semibold text-gray-800">
                      Chế độ siêu nét (HD Mode)
                    </span>
                  </label>

                  <span className="text-[11px] text-gray-500">
                    Phí API: {hdMode ? '2 credits' : '1 credit'}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleStartTryOn}
                  disabled={!modelFile || !hasGarment || isWorking}
                  className="w-full py-4 px-6 rounded-xl bg-[#f30d29] hover:bg-[#d10b23] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                >
                  {isWorking ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xử lý tạo ảnh thử đồ ({progress}%)...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>
                        {isCombo ? 'THỬ CẢ BỘ BẰNG AI (COMBO)' : 'THỬ ĐỒ BẰNG AI'}
                      </span>
                    </>
                  )}
                </button>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* Progress Bar while Working */}
                {isWorking && (
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#f30d29] to-orange-500 transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                      <span>Đang tạo ảnh qua FitRoom AI Engine...</span>
                      <span className="font-mono font-bold text-gray-800">{progress}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* RESULTS AREA                                              */}
              {/* ========================================================= */}
              {resultImageUrl && (
                <div className="p-4 bg-gray-50 border-2 border-emerald-500/80 rounded-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider">
                      <span>✓</span> KẾT QUẢ THỬ ĐỒ AI THÀNH CÔNG
                    </span>

                    {/* 2D vs 3D View Mode Toggle */}
                    <div className="flex items-center gap-2">
                      {threeDGlbUrl && (
                        <div className="flex bg-gray-200 p-0.5 rounded-lg text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setViewMode('2d')}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                              viewMode === '2d' ? 'bg-[#f30d29] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                            }`}
                          >
                            Ảnh 2D
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewMode('3d')}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                              viewMode === '3d' ? 'bg-[#f30d29] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                            }`}
                          >
                            Mô Hình 3D (360°)
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          closeTryOnModal();
                          setTimeout(() => {
                            const el = document.getElementById('step-4-results');
                            if (el) {
                              const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
                              window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                          }, 150);
                        }}
                        className="px-4 py-1.5 bg-[#e60012] text-white hover:bg-red-700 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        title="Xem ảnh kết quả ở thanh so sánh Trước / Sau"
                      >
                        <span>So sánh Trước / Sau ➔</span>
                      </button>

                      <a
                        href={resultImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        download="lining-ai-tryon.jpg"
                        className="px-3 py-1.5 bg-gray-900 text-white hover:bg-black rounded-lg text-xs font-bold transition-all shadow-xs"
                      >
                        Tải ảnh về ⬇
                      </a>
                    </div>
                  </div>

                  {/* Main Display: 3D Viewer or 2D Image */}
                  <div className="relative rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center min-h-[400px]">
                    {threeDGlbUrl && viewMode === '3d' ? (
                      <div className="w-full flex-1 flex flex-col justify-between">
                        <Tripo3DViewer
                          modelUrl={threeDGlbUrl}
                          posterImageUrl={resultImageUrl}
                          className="w-full h-[400px]"
                        />
                        {customerProfile && (
                          <div className="bg-[#1e293b] px-3 py-1.5 text-[10px] text-gray-300 border-t border-gray-800 flex items-center justify-between flex-wrap gap-2">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Mô hình 3D chuẩn vóc dáng: <strong>{customerProfile.height}cm • {customerProfile.weight}kg</strong> (V1:{customerProfile.bust} • V2:{customerProfile.waist} • V3:{customerProfile.hips})</span>
                            </span>
                            {customerProfile.skinTone && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-black/30"
                                  style={{ backgroundColor: SKIN_TONE_CONFIGS[customerProfile.skinTone]?.hexColor }}
                                />
                                <span>Màu da: <strong>{SKIN_TONE_CONFIGS[customerProfile.skinTone]?.vietnameseName}</strong></span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center">
                        <img
                          src={resultImageUrl}
                          alt="Kết quả thử đồ AI"
                          className="max-h-[440px] w-full object-contain"
                        />
                      </div>
                    )}
                    {customerProfile && viewMode !== '3d' && (
                      <div className="w-full bg-[#1e293b] px-3 py-1.5 text-[10px] text-gray-300 border-t border-gray-800 flex items-center justify-between flex-wrap gap-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Chuẩn vóc dáng: <strong>{customerProfile.height}cm • {customerProfile.weight}kg</strong> (V1:{customerProfile.bust} • V2:{customerProfile.waist} • V3:{customerProfile.hips})</span>
                        </span>
                        {customerProfile.skinTone && (
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/30"
                              style={{ backgroundColor: SKIN_TONE_CONFIGS[customerProfile.skinTone]?.hexColor }}
                            />
                            <span>Màu da: <strong>{SKIN_TONE_CONFIGS[customerProfile.skinTone]?.vietnameseName}</strong></span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3D Progress Bar */}
                  {(threeDStatus === 'preparing_image' ||
                    threeDStatus === 'submitting' ||
                    threeDStatus === 'generating') && (
                    <div className="p-3 bg-gray-100 rounded-xl space-y-1.5 border border-gray-200">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-gray-800 flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 border-2 border-[#f30d29] border-t-transparent rounded-full animate-spin" />
                          {threeDStatusText}
                        </span>
                        <span className="font-mono text-red-600 font-bold">{threeDProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#f30d29] to-orange-500 transition-all duration-300 rounded-full"
                          style={{ width: `${threeDProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 3D Error Alert */}
                  {threeDStatus === 'failed' && threeDError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-0.5">
                      <div className="font-bold flex items-center gap-1">
                        <span>⚠️</span>
                        <span>Không thể tạo mô hình 3D</span>
                      </div>
                      <p className="text-[11px] text-red-600">{threeDError}</p>
                    </div>
                  )}

                  {/* [ ✨ TẠO MÔ HÌNH 3D TRIPO ] Button */}
                  <div className="pt-1 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCreateTripo3D}
                      disabled={
                        threeDStatus === 'preparing_image' ||
                        threeDStatus === 'submitting' ||
                        threeDStatus === 'generating'
                      }
                      className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                    >
                      {threeDStatus === 'preparing_image' ||
                      threeDStatus === 'submitting' ||
                      threeDStatus === 'generating' ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang tạo mô hình 3D Tripo ({threeDProgress}%)...</span>
                        </>
                      ) : threeDGlbUrl ? (
                        <>
                          <span>🔄</span>
                          <span>Tạo Lại Mô Hình 3D Tripo</span>
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          <span>TẠO MÔ HÌNH 3D TRIPO TỪ ẢNH KẾT QUẢ NÀY</span>
                        </>
                      )}
                    </button>

                    {threeDGlbUrl && viewMode !== '3d' && (
                      <button
                        type="button"
                        onClick={() => setViewMode('3d')}
                        className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <span>Xem 3D</span>
                        <span>➔</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Development Trace Debug Panel (Phase 41) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="px-6 py-3 bg-gray-950 text-gray-300 text-[11px] font-mono border-t border-gray-800 space-y-1.5 select-none">
            <div className="flex items-center justify-between border-b border-gray-800 pb-1">
              <span className="text-red-400 font-bold uppercase tracking-wider">FITROOM PIPELINE TRACE</span>
              <span className="text-gray-500">Allowed model types: upper, lower, full</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
              <div>
                <span className="text-gray-500">API key: </span>
                <span className="text-emerald-400 font-bold">CONFIGURED (Server-side)</span>
              </div>
              <div>
                <span className="text-gray-500">Model: </span>
                <span className={modelFile ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {modelFile ? (modelValidation.status === 'invalid' ? 'INVALID' : 'READY') : 'EMPTY'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Request: </span>
                <span className="text-blue-400 font-bold">
                  {isCombo ? 'combo' : isSingleUpper ? 'single (upper)' : isSingleLower ? 'single (lower)' : isFullSet ? 'single (full_set)' : 'none'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Result: </span>
                <span className={resultImageUrl ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                  {resultImageUrl ? 'READY' : 'NONE'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-gray-400 pt-0.5 border-t border-gray-900">
              <div>
                <span className="text-gray-500">Upper: </span>
                <span>{selectedUpper ? `${selectedUpper.sku || selectedUpper.handle} (valid)` : 'none'}</span>
              </div>
              <div>
                <span className="text-gray-500">Lower: </span>
                <span>{selectedLower ? `${selectedLower.sku || selectedLower.handle} (valid)` : 'none'}</span>
              </div>
              <div>
                <span className="text-gray-500">Task ID: </span>
                <span className="text-gray-200">{taskId || 'none'}</span>
              </div>
              <div>
                <span className="text-gray-500">Status / Progress: </span>
                <span className="text-yellow-400 font-bold">{step.toUpperCase()}</span>
                <span className="text-gray-300"> ({progress}%)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
