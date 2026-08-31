'use client';

import React, { useEffect, useState } from 'react';
import StylistConfigurator from './ai-sports-stylist/StylistConfigurator';

interface AiSportsStylistProps {
  targetId?: string;
}

export default function AiSportsStylist({ targetId = 'home-product-section' }: AiSportsStylistProps) {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    if (typeof window !== 'undefined') {
      const hasShown = sessionStorage.getItem('lining_ai_stylist_shown');
      if (hasShown) return;
    }

    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCardVisible(true);
          sessionStorage.setItem('lining_ai_stylist_shown', 'true');
          observer.unobserve(targetElement);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [targetId]);

  const handleCloseCard = () => {
    setIsCardVisible(false);
  };

  const handleTryNow = () => {
    setIsCardVisible(false);
    setIsConfiguratorOpen(true);
  };

  const handleCloseConfigurator = () => {
    setIsConfiguratorOpen(false);
  };

  return (
    <>
      {/* Floating / Slide-in Card (Bottom Right) */}
      <div
        className={`fixed z-40 transition-all duration-500 ease-out ${
          isCardVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-12 pointer-events-none'
        } bottom-20 md:bottom-6 right-4 md:right-6 w-[calc(100vw-2rem)] max-w-[340px]`}
      >
        <div className="relative bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-xl shadow-2xl p-4 md:p-5 overflow-hidden text-gray-900 transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.15)]">
          {/* Top subtle Li-Ning red accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f30d29] via-red-500 to-[#111111]" />

          {/* Close button */}
          <button
            onClick={handleCloseCard}
            className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header Tag / Badge */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-50 text-[#f30d29] border border-red-100">
              <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
              </svg>
              AI SPORTS STYLIST
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base font-bold text-gray-900 mb-1 leading-snug">
            Find your perfect LI-NING outfit
          </h4>

          {/* Short Description */}
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            Đề xuất outfit chuẩn xác theo môn thể thao, vóc dáng và phong cách riêng của bạn.
          </p>

          {/* CTA Action Button */}
          <button
            onClick={handleTryNow}
            className="w-full flex items-center justify-center gap-2 bg-[#f30d29] hover:bg-[#d10b23] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group cursor-pointer"
          >
            <span>TRY NOW</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Large Digital Fitting Room / AI Sports Stylist Configurator Modal */}
      <StylistConfigurator
        isOpen={isConfiguratorOpen}
        onClose={handleCloseConfigurator}
      />
    </>
  );
}
