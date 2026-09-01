'use client';

import React, { useState } from 'react';
import StylistConfigurator from './ai-sports-stylist/StylistConfigurator';

export default function AiSportsStylistSection() {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'profile'>('preview');
  const [selectedSport, setSelectedSport] = useState('Running');
  const [selectedSkinTone, setSelectedSkinTone] = useState('#e6b8a2');

  const handleOpenConfigurator = () => {
    setIsConfiguratorOpen(true);
  };

  const handleCloseConfigurator = () => {
    setIsConfiguratorOpen(false);
  };

  return (
    <>
      <section className="w-full max-w-[1360px] mx-auto px-4 py-8 md:py-12">
        <div className="relative bg-white rounded-[32px] p-6 sm:p-8 lg:p-12 shadow-[0_15px_60px_rgba(0,0,0,0.06)] border border-gray-200/80 overflow-hidden">
          
          {/* Futuristic Red Light Streaks in Background */}
          <div className="absolute right-0 bottom-0 w-[550px] h-[350px] bg-gradient-to-tl from-red-500/10 via-red-500/5 to-transparent pointer-events-none rounded-full blur-3xl" />
          <div className="absolute -left-16 -top-16 w-[450px] h-[450px] bg-red-500/5 pointer-events-none rounded-full blur-3xl" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent pointer-events-none" />

          {/* 2-Column Grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* ============================================================ */}
            {/* LEFT COLUMN: HERO CONTENT & 4 FEATURE TILES                  */}
            {/* ============================================================ */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between space-y-6 lg:space-y-8">
              <div>
                {/* Top Pill Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef2f2] border border-[#fecaca] text-[#f30d29] text-[11px] font-black uppercase tracking-wider mb-5 shadow-2xs">
                  <span className="text-[#f30d29] text-xs">✦</span>
                  <span>CÔNG NGHỆ AI LI-NING • PHÒNG THỬ ĐỒ 3D</span>
                </div>

                {/* Headline matching image */}
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black uppercase tracking-tight text-[#111827] leading-[1.12] mb-4">
                  TƯ VẤN TRANG PHỤC<br />
                  THỂ THAO BẰNG AI<br />
                  <span className="text-[#f30d29]">PHÒNG THỬ ĐỒ 3D THÔNG MINH</span>
                </h2>

                {/* Subtitle / Description */}
                <p className="text-sm sm:text-[15px] text-[#4b5563] leading-relaxed font-normal max-w-xl">
                  Tạo hồ sơ vóc dáng của bạn, chọn môn thể thao yêu thích và nhận gợi ý trang phục phù hợp nhất.{' '}
                  <strong className="text-[#111827] font-bold">Thử đồ 3D chân thực</strong>, mua sắm tự tin.
                </p>
              </div>

              {/* 4 Feature Cards Grid (Single horizontal row of 4 cards on desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {/* Card 1: MÔ HÌNH 3D CHUẨN */}
                <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-2xs hover:border-red-400 hover:shadow-xs transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#f30d29] mb-2.5">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M20 8V6a2 2 0 00-2-2h-2M20 16v2a2 2 0 01-2 2h-2M12 7a2 2 0 100-4 2 2 0 000 4zm-4 12v-5a2 2 0 012-2h4a2 2 0 012 2v5" />
                    </svg>
                  </div>
                  <h4 className="text-[11px] font-black text-gray-950 uppercase tracking-tight leading-tight">
                    MÔ HÌNH 3D CHUẨN
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                    Quét & dựng mô hình 3D chính xác đến từng cm.
                  </p>
                </div>

                {/* Card 2: CÁ NHÂN HÓA VÓC DÁNG */}
                <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-2xs hover:border-red-400 hover:shadow-xs transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#f30d29] mb-2.5">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="text-[11px] font-black text-gray-950 uppercase tracking-tight leading-tight">
                    CÁ NHÂN HÓA<br />VÓC DÁNG
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                    Tùy chỉnh chiều cao, cân nặng, số đo 3 vòng.
                  </p>
                </div>

                {/* Card 3: CHỌN MÔN THỂ THAO */}
                <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-2xs hover:border-red-400 hover:shadow-xs transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#f30d29] mb-2.5">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-[11px] font-black text-gray-950 uppercase tracking-tight leading-tight">
                    CHỌN MÔN<br />THỂ THAO
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                    Chọn môn thể thao để AI gợi ý phù hợp nhất.
                  </p>
                </div>

                {/* Card 4: GỢI Ý SIZE & THỬ ĐỒ 3D */}
                <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 flex flex-col items-center text-center shadow-2xs hover:border-red-400 hover:shadow-xs transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#f30d29] mb-2.5">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h4 className="text-[11px] font-black text-gray-950 uppercase tracking-tight leading-tight">
                    GỢI Ý SIZE &<br />THỬ ĐỒ 3D
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                    Đề xuất size chuẩn xác và thử đồ trực quan.
                  </p>
                </div>
              </div>

              {/* Call-to-Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  onClick={handleOpenConfigurator}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#f30d29] hover:bg-[#d10b23] text-white font-black text-xs sm:text-sm uppercase tracking-wider py-4 px-8 rounded-2xl shadow-[0_8px_28px_rgba(243,13,41,0.4)] hover:shadow-[0_12px_38px_rgba(243,13,41,0.58)] transition-all duration-300 cursor-pointer active:scale-98"
                >
                  <span className="text-base">✦</span>
                  <span>MỞ PHÒNG THỬ ĐỒ 3D</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pl-1 sm:border-l sm:border-gray-200 sm:pl-4">
                  <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span>Miễn phí • Cá nhân hóa tức thì</span>
                </div>
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN: FUTURISTIC 3D ATHLETE DASHBOARD                */}
            {/* ============================================================ */}
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="relative bg-[#0f172a] rounded-[28px] border border-gray-800 shadow-2xl p-5 sm:p-6 text-white overflow-hidden flex flex-col justify-between min-h-[540px]">
                
                {/* 1. Header Bar: Tabs on Left, Li-Ning Logo on Right */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`text-xs font-black uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                        activeTab === 'preview'
                          ? 'text-[#f30d29] border-b-2 border-[#f30d29]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      PREVIEW 3D
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('profile')}
                      className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                        activeTab === 'profile'
                          ? 'text-[#f30d29] border-b-2 border-[#f30d29]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      HỒ SƠ CỦA BẠN
                    </button>
                  </div>

                  {/* Iconic Li-Ning Brand Logo */}
                  <div className="flex items-center gap-2 text-[#f30d29] font-black italic tracking-tighter text-base select-none">
                    <svg className="w-7 h-5 fill-current" viewBox="0 0 100 45">
                      <path d="M10 35 C35 5, 65 30, 95 10 C65 25, 45 45, 10 35 Z" />
                      <path d="M25 40 L50 20 L45 42 Z" />
                    </svg>
                    <span className="text-white text-sm font-black tracking-wider not-italic">LI-NING</span>
                  </div>
                </div>

                {/* 2. Middle Interactive Hologram Area */}
                <div className="relative flex-1 my-3 flex items-center justify-center min-h-[330px] sm:min-h-[360px]">
                  
                  {/* LEFT FLOATING CONTROL PANELS */}
                  <div className="absolute left-0 top-1 z-20 flex flex-col gap-2.5 max-w-[155px] sm:max-w-[170px]">
                    {/* Body Stats Card */}
                    <div className="bg-[#1e293b]/90 border border-gray-700/60 rounded-2xl p-3 shadow-xl backdrop-blur-md text-[11px]">
                      <div className="flex items-center gap-1.5 text-gray-300 font-bold uppercase mb-2 text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>THÔNG TIN CƠ THỂ</span>
                      </div>
                      <div className="space-y-1.5 text-gray-300">
                        <div className="flex items-center justify-between border-b border-gray-700/40 pb-1">
                          <span className="flex items-center gap-1 text-[10px] text-gray-300 font-bold">🧍‍♂️ Nam</span>
                          <strong className="text-white font-mono text-[10px]">178cm • 68kg</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[10px] text-gray-300 font-bold">🧍‍♀️ Nữ</span>
                          <strong className="text-white font-mono text-[10px]">165cm • 52kg</strong>
                        </div>
                        <div className="pt-1 flex items-center justify-between text-[9px] text-[#f30d29] font-bold uppercase">
                          <span>Giới tính</span>
                          <span className="px-1.5 py-0.5 bg-red-500/20 rounded border border-red-500/30">Nam & Nữ</span>
                        </div>
                      </div>
                    </div>

                    {/* Sport Dropdown Card */}
                    <div className="bg-[#1e293b]/90 border border-gray-700/60 rounded-2xl p-2.5 shadow-xl backdrop-blur-md text-[11px]">
                      <span className="block text-[9px] text-gray-400 font-bold uppercase mb-1">MÔN THỂ THAO</span>
                      <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-xl border border-gray-700/60 font-bold text-white text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span>🏃‍♂️🏃‍♀️</span> Running & Sports
                        </span>
                        <span className="text-gray-400 text-xs">⌄</span>
                      </div>
                    </div>

                    {/* Skin Tone Swatches */}
                    <div className="bg-[#1e293b]/90 border border-gray-700/60 rounded-2xl p-2.5 shadow-xl backdrop-blur-md text-[11px]">
                      <span className="block text-[9px] text-gray-400 font-bold uppercase mb-1.5">TÔNG DA</span>
                      <div className="flex items-center gap-1.5">
                        {['#f8d8c8', '#e6b8a2', '#c48360', '#683d29'].map((tone, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedSkinTone(tone)}
                            className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                              selectedSkinTone === tone ? 'ring-2 ring-white scale-110' : 'border-white/20'
                            }`}
                            style={{ backgroundColor: tone }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CENTER 3D ATHLETE HOLOGRAM FIGURE */}
                  <div
                    onClick={handleOpenConfigurator}
                    className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer group"
                  >
                    {/* Cylindrical Laser Wireframe Hologram Grid */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                      <div className="w-72 sm:w-96 h-80 sm:h-96 border border-cyan-400/30 rounded-[140px] animate-[spin_30s_linear_infinite]" />
                    </div>

                    {/* High-detail Realistic 3D Athletic Athletes (Couple) Rendering */}
                    <div className="relative z-10 flex flex-col items-center transform group-hover:scale-[1.03] transition-transform duration-500">
                      <div className="relative w-64 sm:w-80 md:w-96 h-80 sm:h-[390px] flex items-center justify-center overflow-hidden rounded-2xl">
                        <img
                          src="/images/couple-athletes-3d-preview.jpg"
                          alt="Mô hình vận động viên Nam & Nữ 3D Li-Ning"
                          className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                        />
                      </div>

                      {/* Glowing Circular Base Platform */}
                      <div className="relative -mt-7 flex items-center justify-center z-20">
                        <div className="px-6 py-1.5 rounded-full border-2 border-red-500/90 shadow-[0_0_25px_rgba(243,13,41,0.8)] bg-red-950/80 backdrop-blur-md flex items-center justify-center">
                          <span className="text-[10px] font-mono font-black text-red-300 uppercase tracking-widest flex items-center gap-1.5">
                            ⟲ XOAY 360° ⟳
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT FLOATING MEASUREMENT CALLOUT BADGES */}
                    <div className="absolute right-0 top-6 z-20 flex flex-col gap-3 text-[11px]">
                      {/* GIỚI TÍNH */}
                      <div className="bg-[#1e293b]/90 border border-gray-700/60 rounded-2xl px-3 py-2 shadow-xl backdrop-blur-md min-w-[80px] text-center">
                        <div className="text-[9px] text-gray-400 font-bold uppercase">GIỚI TÍNH</div>
                        <div className="text-xs font-black text-[#f30d29] font-mono">NAM & NỮ</div>
                      </div>

                      {/* VÓC DÁNG */}
                      <div className="bg-[#1e293b]/90 border border-gray-700/60 rounded-2xl px-3 py-2 shadow-xl backdrop-blur-md min-w-[80px] text-center">
                        <div className="text-[9px] text-gray-400 font-bold uppercase">TẠNG NGƯỜI</div>
                        <div className="text-xs font-black text-white font-mono">4 LOẠI</div>
                      </div>

                      {/* SIZE CHUẨN */}
                      <div className="bg-[#1e293b]/90 border border-gray-700/60 rounded-2xl px-3 py-2 shadow-xl backdrop-blur-md min-w-[80px] text-center">
                        <div className="text-[9px] text-gray-400 font-bold uppercase">GỢI Ý SIZE</div>
                        <div className="text-xs font-black text-[#f30d29] font-mono">S - XXL</div>
                      </div>

                      {/* THỬ ĐỒ 3D */}
                      <div className="bg-[#1e293b]/90 border border-gray-700/60 rounded-2xl px-3 py-2 shadow-xl backdrop-blur-md min-w-[80px] text-center">
                        <div className="text-[9px] text-gray-400 font-bold uppercase">PHÒNG THỬ</div>
                        <div className="text-xs font-black text-emerald-400 font-mono">3D REAL</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Bottom Row: GỢI Ý TRANG PHỤC DÀNH CHO BẠN */}
                <div className="pt-3.5 border-t border-gray-800/80">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-300 mb-2.5">
                    GỢI Ý TRANG PHỤC DÀNH CHO BẠN
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2.5">
                    {/* Item 1: Áo chạy bộ Li-Ning */}
                    <div
                      onClick={handleOpenConfigurator}
                      className="bg-[#1e293b] border border-gray-700/70 rounded-2xl p-1 flex items-center justify-center hover:border-red-500/80 cursor-pointer transition-all h-16 group overflow-hidden"
                    >
                      <img
                        src="/images/products/real-thumb-shirt.jpg"
                        alt="Áo đấu Li-Ning"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* Item 2: Quần Short */}
                    <div
                      onClick={handleOpenConfigurator}
                      className="bg-[#1e293b] border border-gray-700/70 rounded-2xl p-1 flex items-center justify-center hover:border-red-500/80 cursor-pointer transition-all h-16 group overflow-hidden"
                    >
                      <img
                        src="/images/products/real-thumb-shorts.jpg"
                        alt="Quần short Li-Ning"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* Item 3: Giày chạy bộ Feidian */}
                    <div
                      onClick={handleOpenConfigurator}
                      className="bg-[#1e293b] border border-gray-700/70 rounded-2xl p-1 flex items-center justify-center hover:border-red-500/80 cursor-pointer transition-all h-16 group overflow-hidden"
                    >
                      <img
                        src="/images/products/real-thumb-shoes.jpg"
                        alt="Giày chạy bộ Li-Ning"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* Item 4: Tất thể thao */}
                    <div
                      onClick={handleOpenConfigurator}
                      className="bg-[#1e293b] border border-gray-700/70 rounded-2xl p-1 flex items-center justify-center hover:border-red-500/80 cursor-pointer transition-all h-16 group overflow-hidden"
                    >
                      <img
                        src="/images/products/real-thumb-socks.jpg"
                        alt="Tất Li-Ning"
                        className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* Item 5: Action Card 'XEM SẢN PHẨM PHÙ HỢP' */}
                    <div
                      onClick={handleOpenConfigurator}
                      className="bg-red-500/10 border border-red-500/30 hover:bg-[#f30d29] hover:border-[#f30d29] rounded-2xl p-1.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group h-16"
                    >
                      <span className="text-xs mb-0.5 group-hover:scale-110 transition-transform">🛍️</span>
                      <span className="text-[8px] font-black uppercase text-red-400 group-hover:text-white leading-tight">
                        XEM SẢN PHẨM<br />PHÙ HỢP &gt;
                      </span>
                    </div>
                  </div>
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
