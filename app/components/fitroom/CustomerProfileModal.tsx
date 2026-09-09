'use client';

import React, { useState, useEffect } from 'react';
import { useFitRoom } from './FitRoomContext';
import { ALL_SKIN_TONES, SkinToneId } from '@/app/lib/fitroom/color-advisor';

export default function CustomerProfileModal() {
  const {
    isProfileModalOpen,
    closeProfileModal,
    customerProfile,
    saveCustomerProfile,
  } = useFitRoom();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'nam' | 'nu'>('nam');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [skinTone, setSkinTone] = useState<SkinToneId>('medium_asian');
  const [error, setError] = useState<string | null>(null);

  // Sync with existing profile if present
  useEffect(() => {
    if (customerProfile) {
      setFullName(customerProfile.fullName || '');
      setAge(String(customerProfile.age || ''));
      setGender(customerProfile.gender || 'nam');
      setHeight(String(customerProfile.height || ''));
      setWeight(String(customerProfile.weight || ''));
      setBust(String(customerProfile.bust || ''));
      setWaist(String(customerProfile.waist || ''));
      setHips(String(customerProfile.hips || ''));
      setSkinTone(customerProfile.skinTone || 'medium_asian');
    }
  }, [customerProfile, isProfileModalOpen]);

  if (!isProfileModalOpen) return null;

  // Fill sample values for quick testing
  const handleQuickFill = (type: 'nam' | 'nu') => {
    if (type === 'nam') {
      setFullName('Nguyễn Tuấn Anh');
      setAge('26');
      setGender('nam');
      setHeight('175');
      setWeight('68');
      setBust('96');
      setWaist('78');
      setHips('95');
      setSkinTone('medium_asian');
    } else {
      setFullName('Trần Mai Anh');
      setAge('24');
      setGender('nu');
      setHeight('162');
      setWeight('50');
      setBust('85');
      setWaist('64');
      setHips('90');
      setSkinTone('fair');
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Vui lòng nhập Họ và tên của bạn.');
      return;
    }
    if (!age || Number(age) <= 0 || Number(age) > 120) {
      setError('Vui lòng nhập tuổi hợp lệ.');
      return;
    }
    if (!height || Number(height) < 100 || Number(height) > 230) {
      setError('Vui lòng nhập chiều cao hợp lệ (100cm - 230cm).');
      return;
    }
    if (!weight || Number(weight) < 30 || Number(weight) > 200) {
      setError('Vui lòng nhập cân nặng hợp lệ (30kg - 200kg).');
      return;
    }
    if (!bust || !waist || !hips) {
      setError('Vui lòng điền đủ số đo 3 vòng (Vòng 1, Vòng 2, Vòng 3).');
      return;
    }

    saveCustomerProfile({
      fullName: fullName.trim(),
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      bust: Number(bust),
      waist: Number(waist),
      hips: Number(hips),
      skinTone,
    });
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfileModal();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[88vh] my-auto">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827] p-5 sm:p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 text-[#f30d29] flex items-center justify-center text-sm font-black">
                ✦
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                  THÔNG SỐ CƠ THỂ & VÓC DÁNG
                </h3>
                <p className="text-xs text-gray-300">
                  Cung cấp số đo để AI FitRoom căn chỉnh trang phục chuẩn nhất
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeProfileModal}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-base font-bold transition-all cursor-pointer shadow-xs"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Quick Preset Fill Buttons */}
          <div className="mt-3 pt-3 border-t border-gray-700/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-gray-400 font-medium">Điền mẫu nhanh:</span>
            <button
              type="button"
              onClick={() => handleQuickFill('nam')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold transition-all cursor-pointer"
            >
              ⚡ Mẫu Nam (175cm • 68kg)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('nu')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 font-bold transition-all cursor-pointer"
            >
              ⚡ Mẫu Nữ (162cm • 50kg)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* 1. Họ Tên & Tuổi */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tuổi <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                min="10"
                max="100"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900"
              />
            </div>
          </div>

          {/* 2. Giới tính */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('nam')}
                className={`py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  gender === 'nam'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>🧍‍♂️</span>
                <span>Nam</span>
              </button>

              <button
                type="button"
                onClick={() => setGender('nu')}
                className={`py-2.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  gender === 'nu'
                    ? 'bg-pink-50 border-pink-500 text-pink-800 shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>🧍‍♀️</span>
                <span>Nữ</span>
              </button>
            </div>
          </div>

          {/* 2b. Màu da (Skin Tone) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Màu da của bạn <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-500 font-medium">
                {ALL_SKIN_TONES.find((s) => s.id === skinTone)?.vietnameseName}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALL_SKIN_TONES.map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setSkinTone(tone.id)}
                  className={`p-2 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    skinTone === tone.id
                      ? 'bg-red-50/80 border-[#f30d29] ring-2 ring-red-500/20 shadow-xs'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100/60'
                  }`}
                >
                  <span
                    className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: tone.hexColor }}
                  />
                  <span className="text-[11px] font-bold text-gray-800 text-center leading-tight">
                    {tone.vietnameseName}
                  </span>
                  <span className="text-[9px] text-gray-400 text-center leading-none">
                    {tone.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Chiều cao & Cân nặng */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Chiều cao (cm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="175"
                  min="100"
                  max="230"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900 pr-10"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">cm</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Cân nặng (kg) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="68"
                  min="30"
                  max="200"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900 pr-10"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">kg</span>
              </div>
            </div>
          </div>

          {/* 4. Số đo 3 Vòng */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-black text-gray-900 uppercase tracking-wider mb-2">
              SỐ ĐO 3 VÒNG (CM) <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-gray-600">Vòng 1 (Ngực)</span>
                <div className="relative">
                  <input
                    type="number"
                    value={bust}
                    onChange={(e) => setBust(e.target.value)}
                    placeholder="96"
                    min="50"
                    max="150"
                    required
                    className="w-full px-2.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900 pr-8"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-gray-400">cm</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-gray-600">Vòng 2 (Eo)</span>
                <div className="relative">
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder="78"
                    min="40"
                    max="140"
                    required
                    className="w-full px-2.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900 pr-8"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-gray-400">cm</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[11px] font-bold text-gray-600">Vòng 3 (Mông)</span>
                <div className="relative">
                  <input
                    type="number"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    placeholder="95"
                    min="50"
                    max="160"
                    required
                    className="w-full px-2.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900 pr-8"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-gray-400">cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#f30d29] hover:bg-[#d10b23] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>✨</span>
              <span>LƯU THÔNG TIN & BẮT ĐẦU THỬ ĐỒ</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
