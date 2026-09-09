'use client';

import React, { useRef, useEffect, useState, useCallback, useId } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface TransparentRunningAthleteProps {
  onRunComplete?: () => void;
  replayTrigger?: number;
  className?: string;
  onSelectProductCard?: (productId: string) => void;
}

const TOTAL_FRAMES = 54;
const FPS = 25; // High-speed athletic sprint (2.15s sequence)
const FRAME_DURATION = 1000 / FPS;

function AthleteOrbit({ foreground }: { foreground: boolean }) {
  const clipId = useId();

  return (
    <div
      aria-hidden="true"
      className={`athlete-orbit-anchor absolute left-[54%] top-[52%] w-[88%] aspect-[420/160] pointer-events-none ${foreground ? 'z-20' : 'z-0'}`}
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <div className="athlete-orbit w-full h-full opacity-0">
        <svg
          viewBox="0 0 420 160"
          className="w-full h-full overflow-visible"
          style={{ transform: 'rotate(-10deg)' }}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="0" y={foreground ? 80 : 0} width="420" height="80" />
            </clipPath>
          </defs>
          {/* Both halves share one orbit; the athlete occludes the rear half. */}
          <g clipPath={`url(#${clipId})`} opacity={foreground ? 1 : 0.55}>
            <ellipse
              cx="210" cy="80" rx="195" ry="60"
              fill="none" stroke="#e60012" strokeWidth="1" opacity="0.18"
            />
            <ellipse
              className="athlete-orbit-path"
              cx="210" cy="80" rx="195" ry="60"
              pathLength="100"
              fill="none" stroke="#ff2135" strokeWidth="2.8"
              strokeLinecap="round" strokeDasharray="18 7 10 15"
              style={{ filter: 'drop-shadow(0 0 4px rgba(230,0,18,0.65))' }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

const HERO_PRODUCT_ITEMS = [
  {
    id: 'polo',
    title: 'Áo Polo Nam',
    image: '/images/ai-tryon/hero_item_polo.png',
    dots: ['bg-[#111111]', 'bg-[#e60012]', 'bg-white border border-zinc-300'],
  },
  {
    id: 'shorts',
    title: 'Quần Thể Thao',
    image: '/images/ai-tryon/hero_item_shorts.png',
    dots: ['bg-[#9ca3af]', 'bg-[#e60012]', 'bg-white border border-zinc-300'],
  },
  {
    id: 'shoes',
    title: 'Giày Thể Thao',
    image: '/images/ai-tryon/hero_item_shoes.png',
    dots: ['bg-[#111111]', 'bg-[#e60012]', 'bg-white border border-zinc-300'],
  },
];

export default function TransparentRunningAthlete({
  onRunComplete,
  replayTrigger = 0,
  className = '',
  onSelectProductCard,
}: TransparentRunningAthleteProps) {
  const motionContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const standingWrapperRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const idleTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const orbitTweenRef = useRef<gsap.core.Tween | null>(null);

  const [currentFrame, setCurrentFrame] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  // Preload all 54 portrait WebP frames (100% transparent, 500x640)
  useEffect(() => {
    let count = 0;
    const loadedImgs: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new window.Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `/images/ai-tryon/run_frames_portrait_webp/frame_${numStr}.webp`;
      img.onload = () => {
        count++;
        setLoadedCount(count);
      };
      loadedImgs.push(img);
    }
    imagesRef.current = loadedImgs;

    return () => {
      imagesRef.current = [];
    };
  }, []);

  // Draw frame on canvas with high-dpi Retina scaling & quality filtering
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx - 1];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Start Idle Breathing & SIMULTANEOUSLY trigger all reference effects
  const startIdleAura = useCallback(() => {
    if (idleTimelineRef.current) {
      idleTimelineRef.current.kill();
    }

    const tl = gsap.timeline();

    // 1. Simultaneous power-on burst of Wireframe Dummy, Red Ribbons, Laser Orbit, and Floor Laser
    tl.to(
      [
        '.hero-wireframe-dummy',
        '.hero-energy-ribbons',
        '.athlete-hologram',
        '.athlete-orbit',
        '.athlete-floor-ring',
      ],
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power3.out',
      },
      0
    );

    // 2. Stagger slide-in of the 3 product cards on the right
    tl.to(
      '.hero-right-card-item',
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: 'back.out(1.3)',
      },
      0.05
    );

    // Continuous breathing idle loop for real athlete
    gsap.to(standingWrapperRef.current, {
      y: -4,
      scale: 1.003,
      duration: 3.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Holographic wireframe dummy subtle breathing loop
    gsap.to('.hero-wireframe-dummy', {
      y: -3,
      scale: 1.002,
      duration: 3.4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Move the light along a fixed waist-level ellipse, in sync front and back.
    orbitTweenRef.current?.kill();
    const orbitPaths = standingWrapperRef.current?.querySelectorAll('.athlete-orbit-path');
    if (orbitPaths?.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      orbitTweenRef.current = gsap.fromTo(orbitPaths, { strokeDashoffset: 0 }, {
        strokeDashoffset: -100,
        duration: 4.5,
        repeat: -1,
        ease: 'none',
      });
    }

    // Hologram podium floor pulse
    gsap.to('.athlete-hologram-pulse', {
      opacity: 0.65,
      scale: 1.04,
      duration: 2.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Product cards subtle floating hover
    gsap.to('.hero-right-card-1', {
      y: -3,
      duration: 3.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
    gsap.to('.hero-right-card-2', {
      y: 3,
      duration: 3.8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.2,
    });
    gsap.to('.hero-right-card-3', {
      y: -2,
      duration: 3.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 0.4,
    });

    idleTimelineRef.current = tl;
  }, []);

  // Run the sequence with physical GSAP translation from left to right
  const startRunningAnimation = useCallback(() => {
    setIsPlaying(true);
    setIsFinished(false);
    setCurrentFrame(1);

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    if (idleTimelineRef.current) {
      idleTimelineRef.current.kill();
    }
    gsap.killTweensOf(standingWrapperRef.current);
    gsap.killTweensOf('.hero-wireframe-dummy');
    orbitTweenRef.current?.kill();
    gsap.killTweensOf('.athlete-hologram-pulse');
    gsap.killTweensOf('.athlete-floor-ring');
    gsap.killTweensOf('.hero-right-card-item');

    // Hide all secondary effects while athlete is running into the hero stage
    gsap.set(
      [
        '.hero-wireframe-dummy',
        '.hero-energy-ribbons',
        '.athlete-hologram',
        '.athlete-orbit',
        '.athlete-floor-ring',
      ],
      {
        opacity: 0,
        scale: 0.92,
      }
    );
    gsap.set('.hero-right-card-item', {
      x: 0,
      opacity: 1,
      scale: 1,
    });

    // GSAP physical run translation: starts from far left of section and arrives at 0
    if (motionContainerRef.current) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
      const startX = isMobile ? -220 : isTablet ? -450 : -720;

      gsap.fromTo(
        motionContainerRef.current,
        {
          x: startX,
          opacity: 0.2,
          scale: 0.95,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 2.15,
          ease: 'power2.out',
          onComplete: () => {
            // Settle foot landing rebound
            gsap.to(motionContainerRef.current, {
              y: -4,
              duration: 0.1,
              yoyo: true,
              repeat: 1,
              ease: 'power1.inOut',
            });
          },
        }
      );
    }

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const frameToDraw = Math.min(
        Math.floor(elapsed / FRAME_DURATION) + 1,
        TOTAL_FRAMES
      );

      setCurrentFrame(frameToDraw);
      drawFrame(frameToDraw);

      if (frameToDraw < TOTAL_FRAMES) {
        animationFrameIdRef.current = requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
        setIsFinished(true);
        drawFrame(TOTAL_FRAMES);
        startIdleAura();
        onRunComplete?.();
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(step);
  }, [drawFrame, startIdleAura, onRunComplete]);

  // Handle external replay trigger
  useEffect(() => {
    startRunningAnimation();
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (idleTimelineRef.current) {
        idleTimelineRef.current.kill();
      }
      orbitTweenRef.current?.kill();
    };
  }, [replayTrigger, startRunningAnimation]);

  // Initial draw when first frame is loaded
  useEffect(() => {
    if (loadedCount >= 1 && !isFinished) {
      drawFrame(1);
    }
  }, [loadedCount, isFinished, drawFrame]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full ${className}`}>
      {/* Visual Stage Container (Wide enough for Dummy + Athlete + 3 Product Cards + AI Badge) */}
      <div className="relative w-full max-w-[620px] sm:max-w-[660px] lg:max-w-[700px] h-[540px] sm:h-[620px] lg:h-[680px] flex items-center justify-center">
        {/* ==================================================================== */}
        {/* 0. RED DYNAMIC ENERGY RIBBONS & BACKGROUND SPEED SWOOSHES (SVG)     */}
        {/* ==================================================================== */}
        <div className="hero-energy-ribbons absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-0 overflow-hidden">
          <svg
            viewBox="0 0 650 550"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#e60012" stopOpacity="0.0" />
                <stop offset="30%" stopColor="#e60012" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#ff2a3b" stopOpacity="0.75" />
                <stop offset="90%" stopColor="#ff7882" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="ribbonGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e60012" stopOpacity="0.0" />
                <stop offset="40%" stopColor="#e60012" stopOpacity="0.7" />
                <stop offset="85%" stopColor="#ff4d5e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="laserLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff1125" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ff1125" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
              </linearGradient>
              <filter id="ribbonGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Upper Wide Dynamic Swoop Ribbon */}
            <path
              d="M 230 185 C 330 145, 430 95, 640 70 L 650 140 C 450 155, 350 190, 240 220 Z"
              fill="url(#ribbonGrad1)"
              filter="url(#ribbonGlowFilter)"
              opacity="0.85"
            />

            {/* Upper Laser Edge Accent */}
            <path
              d="M 220 185 C 330 140, 440 90, 650 68"
              fill="none"
              stroke="url(#laserLineGrad)"
              strokeWidth="2.5"
              filter="url(#ribbonGlowFilter)"
            />

          </svg>
        </div>

        {/* ==================================================================== */}
        {/* 1. 3D HOLOGRAPHIC AURA & PODIUM GLOW BEHIND DUMMY & ATHLETE          */}
        {/* ==================================================================== */}
        <div className="athlete-hologram absolute inset-0 pointer-events-none z-1 flex items-center justify-center opacity-0 transition-opacity duration-500">
          <div className="athlete-hologram-pulse absolute w-[440px] h-[560px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(230,0,18,0.22)_0%,rgba(255,42,59,0.06)_45%,transparent_70%)] filter blur-2xl" />
          <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-red-500/20 shadow-[0_0_30px_rgba(230,0,18,0.2)] animate-podium-spin" />
        </div>

        {/* ==================================================================== */}
        {/* 2. BLUE HOLOGRAPHIC WIREFRAME DUMMY & HUD CARD (Clean, No AI Scan)  */}
        {/* ==================================================================== */}
        <div className="hero-wireframe-dummy absolute left-[2%] sm:left-[3%] lg:left-[4%] top-[7%] sm:top-[6%] lg:top-[5%] w-[215px] sm:w-[250px] lg:w-[275px] aspect-[255/405] pointer-events-none z-5 opacity-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/ai-tryon/hero_hologram_card_clean.webp"
              alt="Holographic Wireframe Dummy & HUD Card"
              fill
              priority
              className="object-contain filter drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            />
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 4. MAIN TRANSPARENT ANIMATED ATHLETE (Centered in Floor Ring)        */}
        {/* ==================================================================== */}
        <div
          ref={motionContainerRef}
          className="relative z-15 flex items-center justify-center will-change-transform pointer-events-none ml-6 sm:ml-10 lg:ml-12"
        >
          <div
            ref={standingWrapperRef}
            className="relative isolate w-[320px] sm:w-[400px] lg:w-[460px] aspect-[500/640] flex items-center justify-center"
          >
            {/* Ground Floor Laser Ring (Dead Center directly under Athlete's Feet) */}
            <div
              aria-hidden="true"
              className="athlete-floor-ring absolute left-[54.6%] -bottom-4 w-[108%] pointer-events-none z-0 opacity-0"
              style={{ transform: 'translateX(-50%)' }}
            >
              <svg viewBox="0 0 440 70" className="w-full h-auto overflow-visible">
                <ellipse
                  cx="220"
                  cy="35"
                  rx="200"
                  ry="26"
                  fill="none"
                  stroke="#e60012"
                  strokeWidth="1.8"
                  strokeOpacity="0.32"
                  strokeDasharray="18 10 36 10"
                />
                <ellipse
                  cx="220"
                  cy="35"
                  rx="150"
                  ry="19"
                  fill="none"
                  stroke="#e60012"
                  strokeWidth="1.2"
                  strokeOpacity="0.2"
                />
              </svg>
            </div>
            <AthleteOrbit foreground={false} />
            {/* Running Canvas (Retina 1000x1280 internal buffer for crisp motion) */}
            <canvas
              ref={canvasRef}
              width={1000}
              height={1280}
              className={`relative z-10 w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.22)] transition-opacity duration-200 ${
                isFinished ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Ultra-HD 2K Standing Athlete Image (Active when stopped - razor-sharp, zero pixelation) */}
            <div
              className={`absolute inset-0 z-10 transition-opacity duration-200 pointer-events-none ${
                isFinished ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src="/images/ai-tryon/hero_athlete_standing_hd.webp"
                alt="Vận Động Viên Thể Thao Li-Ning"
                fill
                priority
                sizes="(max-width: 768px) 380px, (max-width: 1200px) 460px, 520px"
                className="object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.22)]"
              />
            </div>
            <AthleteOrbit foreground />
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 6. 3 VERTICAL PRODUCT CARDS (Far Right Stack)                        */}
        {/* ==================================================================== */}
        <div className="hero-product-stack absolute right-0 sm:right-1 lg:right-2 top-8 sm:top-12 lg:top-14 z-25 flex flex-col gap-2.5 sm:gap-3 pointer-events-auto">
          {HERO_PRODUCT_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectProductCard?.(item.id)}
              className={`hero-right-card-item hero-right-card-${
                idx + 1
              } w-[84px] sm:w-[92px] lg:w-[98px] bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-zinc-200/80 flex flex-col items-center group hover:scale-105 hover:shadow-xl transition-all cursor-pointer`}
            >
              <div className="w-full aspect-[4/3] relative flex items-center justify-center mb-1">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="90px"
                  className="object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-zinc-800 text-center leading-tight mb-1.5 whitespace-nowrap">
                {item.title}
              </span>
              <div className="flex items-center gap-1.5">
                {item.dots.map((dot, dIdx) => (
                  <span
                    key={dIdx}
                    className={`w-2.5 h-2.5 rounded-full shadow-xs ${dot}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
