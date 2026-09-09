'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { CaretRight } from '@phosphor-icons/react';

interface Step1TvcAthleteStageProps {
  active?: boolean;
  replayKey?: number;
  onReplay?: () => void;
  inlineBust?: number | string;
  inlineWaist?: number | string;
  inlineHips?: number | string;
  gender?: string;
  mouseOffset?: { x: number; y: number };
  className?: string;
}

type StagePhase = 'idle' | 'fullscreen' | 'dissolving' | 'shrinking' | 'active';

export default function Step1TvcAthleteStage({
  active = false,
  replayKey = 0,
  inlineBust = 96,
  inlineWaist = 78,
  inlineHips = 95,
  gender = 'Nam',
  mouseOffset = { x: 0, y: 0 },
  className = '',
}: Step1TvcAthleteStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const [mounted, setMounted] = useState<boolean>(false);
  const [phase, setPhase] = useState<StagePhase>('idle');
  const [animCoords, setAnimCoords] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clear all timers
  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Immediate skip to active settled state
  const skipToActive = useCallback(() => {
    clearTimers();
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setPhase('active');
  }, []);

  // Esc key listener to skip intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (phase === 'fullscreen' || phase === 'dissolving')) {
        skipToActive();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, skipToActive]);

  // Choreographed TVC sequence:
  // 1. 'fullscreen': 0s -> 3.0s, video appears large across the entire screen
  // 2. 'dissolving': at 3.0s, pause video, dissolve dark overlay and video white background into transparency (350ms)
  // 3. 'shrinking': 3.35s -> 4.2s, characters smoothly shrink & glide into right corner of Step 1 (850ms)
  // 4. 'active': portal unmounts, inline stage takes over with enlarged athletes, wireframe twins behind them, and 3 measurement tags
  const startTvcSequence = useCallback(() => {
    clearTimers();

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

    let fullW = Math.min(vw * 0.94, 1260);
    let fullH = fullW * (9 / 16);
    if (fullH > vh * 0.88) {
      fullH = vh * 0.88;
      fullW = fullH * (16 / 9);
    }

    const startX = (vw - fullW) / 2;
    const startY = (vh - fullH) / 2;

    setAnimCoords({ x: startX, y: startY, width: fullW, height: fullH });
    setPhase('fullscreen');

    // Start video playback
    setTimeout(() => {
      const vid = videoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }, 50);

    // Timer 1: At 3.0s (3000ms), pause video and dissolve background
    const timer1 = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setPhase('dissolving');

      // Timer 2: After 350ms background fade, shrink & glide characters to right column
      const timer2 = setTimeout(() => {
        const targetEl = stageRef.current || containerRef.current;
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          setAnimCoords({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          });
        }
        setPhase('shrinking');

        // Timer 3: After 850ms glide transition, activate settled stage
        const timer3 = setTimeout(() => {
          setPhase('active');
        }, 850);
        timersRef.current.push(timer3);
      }, 350);
      timersRef.current.push(timer2);
    }, 3000);
    timersRef.current.push(timer1);
  }, []);

  // Trigger on active or replayKey
  useEffect(() => {
    if (active) {
      startTvcSequence();
    }
  }, [active, replayKey, startTvcSequence]);

  // Fallback observer if active is not controlled
  useEffect(() => {
    const el = containerRef.current;
    if (!el || active) return;

    let hasStarted = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          hasStarted = true;
          startTvcSequence();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [active, startTvcSequence]);

  // Cleanup
  useEffect(() => {
    return () => clearTimers();
  }, []);

  const showEffects = phase === 'active';
  const isPortalActive = phase === 'fullscreen' || phase === 'dissolving' || phase === 'shrinking';

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* 1. INLINE TARGET STAGE IN lg:col-span-5                            */}
      {/* ------------------------------------------------------------------ */}
      <div
        ref={containerRef}
        className={`relative w-full flex items-center justify-center select-none pt-10 sm:pt-14 pb-4 ${className}`}
      >
        {/* Tall portrait container: Enlarged to make the 2 athletes prominent */}
        <div 
          ref={stageRef}
          className="relative w-full max-w-[500px] sm:max-w-[540px] aspect-[529/604] flex items-center justify-center"
        >
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
            style={{
              transform: showEffects
                ? `perspective(1000px) rotateY(${mouseOffset.x * 2.5}deg) rotateX(${-mouseOffset.y * 1.5}deg)`
                : undefined,
            }}
          >
            {/* ============================================================ */}
            {/* 1. ENLARGED 3D WIREFRAME HOLOGRAM TWINS (Tall & Prominent)   */}
            {/* ============================================================ */}
            <AnimatePresence>
              {showEffects && (
                <div className="absolute inset-0 pointer-events-none z-5">
                  {/* Male 3D Hologram Wireframe - Tall, Muscular & Prominently Towering */}
                  <motion.div
                    key={`male-wireframe-${replayKey}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [1, 1.018, 1], y: [0, -4, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.6, delay: 0.1 },
                      scale: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                      y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    style={{ transformOrigin: 'bottom center' }}
                    className="absolute -left-[6%] -top-[21%] w-[57%] sm:w-[58%] h-[121%] pointer-events-none"
                  >
                    {/* Futuristic Red Cyber Aura Glow Backlight */}
                    <div className="absolute inset-x-2 top-2 bottom-16 bg-[radial-gradient(ellipse_at_top,rgba(230,0,18,0.30)_0%,rgba(230,0,18,0.10)_45%,transparent_75%)] blur-2xl pointer-events-none" />

                    <Image
                      src="/images/ai-tryon/step1_male_holo_wireframe.png"
                      alt="Male 3D Hologram Digital Twin"
                      fill
                      sizes="(max-width: 768px) 260px, 340px"
                      className="object-contain object-bottom drop-shadow-[0_0_28px_rgba(230,0,18,0.85)] drop-shadow-[0_0_10px_rgba(255,60,60,0.9)] opacity-100"
                    />
                  </motion.div>

                  {/* Female 3D Hologram Wireframe - Tall, Hourglass & Prominently Towering */}
                  <motion.div
                    key={`female-wireframe-${replayKey}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [1, 1.018, 1], y: [0, -4, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.6, delay: 0.2 },
                      scale: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
                      y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
                    }}
                    style={{ transformOrigin: 'bottom center' }}
                    className="absolute left-[47%] -top-[20%] w-[57%] sm:w-[58%] h-[120%] pointer-events-none"
                  >
                    {/* Futuristic Cyan Cyber Aura Glow Backlight */}
                    <div className="absolute inset-x-2 top-2 bottom-16 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.32)_0%,rgba(6,182,212,0.10)_45%,transparent_75%)] blur-2xl pointer-events-none" />

                    <Image
                      src="/images/ai-tryon/step1_female_holo_wireframe.png"
                      alt="Female 3D Hologram Digital Twin"
                      fill
                      sizes="(max-width: 768px) 260px, 340px"
                      className="object-contain object-bottom drop-shadow-[0_0_28px_rgba(6,182,212,0.85)] drop-shadow-[0_0_10px_rgba(56,189,248,0.9)] opacity-100"
                    />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* ============================================================ */}
            {/* 2. ENLARGED STANDING ATHLETES CUTOUT (Prominent & High-Res)  */}
            {/* ============================================================ */}
            <div
              className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-300 ${
                showEffects ? 'opacity-100 animate-human-breathe' : 'opacity-0'
              }`}
            >
              <Image
                src="/images/ai-tryon/step1_athletes_duo_tall.png"
                alt="Li-Ning Biometric Athletic Models"
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.15)]"
                priority
              />
            </div>

            {/* ============================================================ */}
            {/* 3. SỐ ĐO 3 VÒNG (V1, V2, V3 ONLY - Clean & Uncluttered)      */}
            {/* ============================================================ */}
            <AnimatePresence>
              {showEffects && (
                <>
                  {/* V1: Vòng Ngực (Connected to chest) */}
                  <motion.div
                    key={`v1-tag-${replayKey}`}
                    initial={{ opacity: 0, x: 22, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.15 }}
                    className="absolute -right-2 sm:-right-4 top-[24%] flex items-center gap-1.5 pointer-events-none z-30"
                  >
                    <div className="w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#e60012] to-[#e60012]" />
                    <div className="bg-white/95 backdrop-blur-md border border-red-200/90 rounded-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 shadow-lg shadow-red-500/10 text-left">
                      <span className="text-[9px] font-bold text-zinc-400 block leading-tight uppercase tracking-wider">
                        V1 NGỰC
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#e60012]">
                        {inlineBust || 96} cm
                      </span>
                    </div>
                  </motion.div>

                  {/* V2: Vòng Eo (Connected to waist) */}
                  <motion.div
                    key={`v2-tag-${replayKey}`}
                    initial={{ opacity: 0, x: -22, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.28 }}
                    className="absolute -left-2 sm:-left-4 top-[42%] flex items-center flex-row-reverse gap-1.5 pointer-events-none z-30"
                  >
                    <div className="w-6 sm:w-10 h-px bg-gradient-to-l from-transparent via-[#e60012] to-[#e60012]" />
                    <div className="bg-white/95 backdrop-blur-md border border-red-200/90 rounded-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 shadow-lg shadow-red-500/10 text-left">
                      <span className="text-[9px] font-bold text-zinc-400 block leading-tight uppercase tracking-wider">
                        V2 EO
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#e60012]">
                        {inlineWaist || 78} cm
                      </span>
                    </div>
                  </motion.div>

                  {/* V3: Vòng Hông (Connected to hips) */}
                  <motion.div
                    key={`v3-tag-${replayKey}`}
                    initial={{ opacity: 0, x: 22, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.42 }}
                    className="absolute -right-2 sm:-right-4 top-[56%] flex items-center gap-1.5 pointer-events-none z-30"
                  >
                    <div className="w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#e60012] to-[#e60012]" />
                    <div className="bg-white/95 backdrop-blur-md border border-red-200/90 rounded-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 shadow-lg shadow-red-500/10 text-left">
                      <span className="text-[9px] font-bold text-zinc-400 block leading-tight uppercase tracking-wider">
                        V3 HÔNG
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#e60012]">
                        {inlineHips || 95} cm
                      </span>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. FULLSCREEN CINEMA TVC & SHRINK-TO-CORNER PORTAL                 */}
      {/* ------------------------------------------------------------------ */}
      {mounted &&
        isPortalActive &&
        createPortal(
          <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
            {/* Backdrop: Dark cinema during fullscreen; fades to 0 upon dissolving */}
            <div
              className={`fixed inset-0 transition-opacity duration-400 ease-out pointer-events-auto ${
                phase === 'fullscreen'
                  ? 'opacity-100 bg-zinc-950/85 backdrop-blur-md'
                  : 'opacity-0'
              }`}
            />

            {/* Top Bar during Fullscreen */}
            <div
              className={`fixed top-5 inset-x-0 z-[110] max-w-5xl mx-auto px-6 flex items-center justify-between pointer-events-auto transition-opacity duration-300 ${
                phase === 'fullscreen' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#e60012] animate-ping" />
                <span className="text-white">LI-NING AI BIOMETRIC SYSTEM</span>
                <span className="text-zinc-400 text-[10px]">| TRẮC ĐỊA 3D</span>
              </div>

              <button
                onClick={skipToActive}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95"
              >
                <span>Bỏ qua</span>
                <CaretRight weight="bold" className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom 3-second Progress Indicator during Fullscreen */}
            {phase === 'fullscreen' && (
              <div className="fixed bottom-6 inset-x-0 z-[110] max-w-md mx-auto px-6 pointer-events-none">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#e60012] to-[#ff4d5a] rounded-full animate-[progress_3s_linear_forwards]" />
                </div>
              </div>
            )}

            {/* Animated Athletes Box (Fullscreen Center -> Shrinks & Glides to Right Column) */}
            <div
              className="fixed pointer-events-none"
              style={{
                left: animCoords ? `${animCoords.x}px` : '50%',
                top: animCoords ? `${animCoords.y}px` : '50%',
                width: animCoords ? `${animCoords.width}px` : 'auto',
                height: animCoords ? `${animCoords.height}px` : 'auto',
                transitionProperty: phase === 'shrinking' ? 'all' : 'none',
                transitionDuration: phase === 'shrinking' ? '850ms' : '0ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 105,
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* 1. Transparent Cutout standing athletes underneath */}
                <div
                  className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-300 ${
                    phase === 'dissolving' || phase === 'shrinking' ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src="/images/ai-tryon/step1_athletes_duo_tall.png"
                    alt="Li-Ning Biometric Athletic Models"
                    fill
                    sizes="(max-width: 768px) 100vw, 1260px"
                    className="object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.15)]"
                    priority
                  />
                </div>

                {/* 2. TVC Video playing 0s -> 3.0s, dissolved at t=3.0s */}
                <video
                  ref={videoRef}
                  src="/videos/step1_athletes_tvc.mp4"
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-contain rounded-2xl z-20 transition-opacity duration-350 ease-out ${
                    phase === 'fullscreen' ? 'opacity-100 shadow-2xl' : 'opacity-0'
                  }`}
                  style={{
                    display: phase === 'shrinking' ? 'none' : 'block',
                  }}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
