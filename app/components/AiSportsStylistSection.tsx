'use client';

import React, { useState } from 'react';
import StylistConfigurator from './ai-sports-stylist/StylistConfigurator';

export default function AiSportsStylistSection() {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);

  const handleOpenConfigurator = () => {
    setIsConfiguratorOpen(true);
  };

  const handleCloseConfigurator = () => {
    setIsConfiguratorOpen(false);
  };

  return (
    <>
      <section className="w-full max-w-[1140px] mx-auto px-4 py-6 md:py-10">
        <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-gray-800/90 overflow-hidden">
          {/* Subtle Ambient Red Glow Effects */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#f30d29]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Background Tech Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Content & CTA */}
            <div className="lg:col-span-7 space-y-4 md:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-mono font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#f30d29] animate-pulse" />
                CÔNG NGHỆ AI LI-NING • PHÒNG THỬ ĐỒ 3D
              </div>

              {/* Headline */}
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                  TƯ VẤN TRANG PHỤC THỂ THAO AI
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#f30d29] via-red-400 to-orange-400">
                    PHÒNG THỬ ĐỒ 3D THÔNG MINH
                  </span>
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl font-normal">
                  Khám phá trang phục thi đấu hoàn hảo theo đúng <strong>vóc dáng cơ thể thực tế</strong> (chiều cao, cân nặng, số đo 3 vòng) và <strong>môn thể thao yêu thích</strong> của bạn.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
                  <div className="text-base mb-1">🧍‍♂️</div>
                  <div className="text-xs font-bold text-white uppercase tracking-tight">Mô Hình 3D Chuẩn</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">4 tạng người: Gầy mỡ bụng, Thon gọn, Cơ bắp, Đầy đặn</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
                  <div className="text-base mb-1">🎯</div>
                  <div className="text-xs font-bold text-white uppercase tracking-tight">Trang Phục Chuẩn Môn</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Pickleball, Cầu lông, Chạy bộ, Tập luyện</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xs">
                  <div className="text-base mb-1">🔄</div>
                  <div className="text-xs font-bold text-white uppercase tracking-tight">Xoay 360° Đa Góc</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Xem trước Trước, Ngang, Sau chân thực</div>
                </div>
              </div>

              {/* CTA Button & Note */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleOpenConfigurator}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#f30d29] hover:bg-[#d10b23] text-white font-black text-xs md:text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-[0_4px_25px_rgba(243,13,41,0.45)] hover:shadow-[0_6px_35px_rgba(243,13,41,0.6)] transition-all duration-300 cursor-pointer active:scale-98"
                >
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>MỞ PHÒNG THỬ ĐỒ 3D (THỬ NGAY)</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <span className="text-[11px] text-gray-400 flex items-center gap-1.5 font-medium">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Miễn phí • Tùy chỉnh trực tiếp
                </span>
              </div>
            </div>

            {/* Right Column: 3D Visual Preview Interactive Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={handleOpenConfigurator}
                className="w-full max-w-sm bg-gradient-to-b from-gray-800/60 to-gray-900/80 rounded-2xl border border-gray-700/80 p-5 shadow-2xl relative overflow-hidden group cursor-pointer hover:border-red-500/60 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono uppercase text-gray-300 font-bold">MÔ HÌNH VẬN ĐỘNG VIÊN 3D</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/20 text-red-300 rounded border border-red-500/30 uppercase">
                    XOAY 360°
                  </span>
                </div>

                {/* 3D Mannequin Visual Representation */}
                <div className="relative h-60 w-full flex items-center justify-center bg-gray-950/70 rounded-xl border border-gray-800/80 overflow-hidden">
                  {/* Grid Lines inside preview */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Silhouette Figure */}
                  <div className="relative flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-32 h-44 text-gray-400 drop-shadow-[0_0_15px_rgba(243,13,41,0.3)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM20 9H15V22H13V16H11V22H9V9H4V7H20V9Z" />
                    </svg>

                    {/* Laser Scan Line Effect */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#f30d29] to-transparent animate-pulse" />
                  </div>

                  {/* Floating Measurement Tags */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-gray-300 border border-gray-700">
                    Ngực: <span className="text-[#f30d29] font-bold">104 cm</span>
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-gray-300 border border-gray-700">
                    Eo: <span className="text-amber-400 font-bold">78 cm</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-gray-300 border border-gray-700">
                    Hông: <span className="text-emerald-400 font-bold">96 cm</span>
                  </div>

                  {/* Hover Overlay Hint */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-10 h-10 rounded-full bg-[#f30d29] flex items-center justify-center text-white shadow-lg mb-1 transform group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Bấm để tùy chỉnh 3D</span>
                  </div>
                </div>

                {/* Bottom Quick Preset Tags */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span>Dáng: Gầy mỡ bụng, Thon gọn, Cơ bắp, Đầy đặn</span>
                  <span className="text-[#f30d29] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Khám phá ngay &rarr;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Large 3D Fitting Room Modal */}
      <StylistConfigurator isOpen={isConfiguratorOpen} onClose={handleCloseConfigurator} />
    </>
  );
}
