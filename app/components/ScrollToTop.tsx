'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/app/lib/utils';
import { CaretUp } from '@phosphor-icons/react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-20 md:bottom-6 right-4 w-11 h-11 bg-zinc-800 shadow-lg text-white rounded-sm flex items-center justify-center hover:bg-brand hover:scale-105 active:scale-[0.98] transition-all duration-300 z-40",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      <CaretUp weight="bold" className="w-5 h-5" />
    </button>
  );
}
