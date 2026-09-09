'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Banner } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

interface HeroSliderProps {
  banners: Banner[];
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (banners.length <= 1 || isHovered || prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length, isHovered, prefersReducedMotion]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!banners || banners.length === 0) return null;

  return (
    <div 
      className="relative w-full overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="w-full shrink-0 relative">
            <Link href={banner.link || '#'}>
              {/* Desktop Image */}
              <div className={cn("relative w-full aspect-[21/9]", banner.imageMobile ? "hidden md:block" : "block")}>
                <Image 
                  src={banner.image} 
                  alt={banner.alt || `Banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
              {/* Mobile Image */}
              {banner.imageMobile && (
                <div className="relative w-full aspect-[4/5] md:hidden block">
                  <Image 
                    src={banner.imageMobile} 
                    alt={banner.alt || `Banner ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-cover"
                  />
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/60 text-white rounded-sm flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 active:scale-[0.98] transition-transform"
            aria-label="Previous slide"
          >
            <CaretLeft size={24} weight="regular" />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/60 text-white rounded-sm flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 active:scale-[0.98] transition-transform"
            aria-label="Next slide"
          >
            <CaretRight size={24} weight="regular" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-sm transition-colors duration-300 active:scale-[0.98] transition-transform",
                currentIndex === index ? "bg-brand" : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
