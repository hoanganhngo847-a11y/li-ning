'use client';

import React from 'react';
import { ArrowsClockwise, Lightning } from '@phosphor-icons/react';

interface AthleteAuraStageProps {
  active: boolean;
  replayKey?: number;
  onReplay?: () => void;
  direction?: 'left' | 'right';
  theme?: 'red' | 'gold' | 'cyan' | 'dark';
  children: React.ReactNode;
  className?: string;
  showShockwave?: boolean;
  showRibbons?: boolean;
  showSparks?: boolean;
  showHalo?: boolean;
  showReplayBtn?: boolean;
  badgeText?: string;
}

export default function AthleteAuraStage({
  active,
  replayKey = 0,
  onReplay,
  direction = 'left',
  theme = 'red',
  children,
  className = '',
  showShockwave = true,
  showRibbons = true,
  showSparks = true,
  showHalo = true,
  showReplayBtn = true,
  badgeText,
}: AthleteAuraStageProps) {
  // Theme color settings
  const themeStyles = {
    red: {
      halo: 'bg-[radial-gradient(circle_at_50%_50%,rgba(230,0,18,0.26)_0%,rgba(255,75,43,0.12)_45%,transparent_72%)]',
      ribbon1Top: '#ff1e27',
      ribbon1Right: '#fbbf24',
      ribbon2Bottom: '#e60012',
      ribbon2Left: '#fde047',
      spark: 'from-red-500 to-amber-300 shadow-[0_0_10px_#e60012]',
      shockwave: 'border-[#e60012] shadow-[0_0_30px_#e60012]',
      badge: 'border-red-400 text-[#e60012] bg-white/95',
    },
    gold: {
      halo: 'bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.28)_0%,rgba(230,0,18,0.12)_45%,transparent_72%)]',
      ribbon1Top: '#f59e0b',
      ribbon1Right: '#fef08a',
      ribbon2Bottom: '#d97706',
      ribbon2Left: '#fbbf24',
      spark: 'from-amber-400 to-yellow-200 shadow-[0_0_10px_#f59e0b]',
      shockwave: 'border-amber-500 shadow-[0_0_30px_#f59e0b]',
      badge: 'border-amber-400 text-amber-600 bg-white/95',
    },
    cyan: {
      halo: 'bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.25)_0%,rgba(230,0,18,0.1)_45%,transparent_72%)]',
      ribbon1Top: '#06b6d4',
      ribbon1Right: '#38bdf8',
      ribbon2Bottom: '#e60012',
      ribbon2Left: '#22d3ee',
      spark: 'from-cyan-400 to-red-400 shadow-[0_0_10px_#06b6d4]',
      shockwave: 'border-cyan-500 shadow-[0_0_30px_#06b6d4]',
      badge: 'border-cyan-400 text-cyan-600 bg-white/95',
    },
    dark: {
      halo: 'bg-[radial-gradient(circle_at_50%_50%,rgba(230,0,18,0.4)_0%,rgba(255,42,59,0.18)_48%,transparent_72%)]',
      ribbon1Top: '#ff2a3b',
      ribbon1Right: '#fbbf24',
      ribbon2Bottom: '#e60012',
      ribbon2Left: '#ff7882',
      spark: 'from-red-500 to-amber-300 shadow-[0_0_12px_#ff2a3b]',
      shockwave: 'border-red-500 shadow-[0_0_40px_#e60012]',
      badge: 'border-red-500 text-red-400 bg-zinc-900/95',
    },
  }[theme];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 1. Background Radiant Halo Aura */}
      {showHalo && active && (
        <div
          className={`absolute inset-[-15%] -z-10 rounded-full animate-radiant-halo pointer-events-none ${themeStyles.halo}`}
        />
      )}

      {/* 2. Ground Landing Shockwave Ring */}
      {showShockwave && active && (
        <div
          key={`shockwave-${replayKey}`}
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-16 rounded-full border-2 animate-ground-shockwave pointer-events-none z-0 ${themeStyles.shockwave}`}
        />
      )}

      {/* 3. 3D Swirling Energy Ribbons (Vầng sáng bay quanh người) */}
      {showRibbons && active && (
        <>
          {/* Upper Ribbon (Tilted 3D Orbit around chest/waist) */}
          <div className="absolute inset-x-[-12%] top-[22%] bottom-[32%] pointer-events-none z-20 flex items-center justify-center [perspective:900px]">
            <div
              className="w-[125%] h-[80px] rounded-[50%] border-2 border-transparent animate-orbit-ribbon-1 opacity-90 drop-shadow-[0_0_12px_rgba(230,0,18,0.85)]"
              style={{
                borderTopColor: themeStyles.ribbon1Top,
                borderRightColor: themeStyles.ribbon1Right,
              }}
            />
          </div>

          {/* Lower Ribbon (Counter-orbit around hips/legs) */}
          <div className="absolute inset-x-[-16%] top-[42%] bottom-[16%] pointer-events-none z-20 flex items-center justify-center [perspective:900px]">
            <div
              className="w-[135%] h-[90px] rounded-[50%] border-2 border-transparent animate-orbit-ribbon-2 opacity-85 drop-shadow-[0_0_15px_rgba(255,42,59,0.9)]"
              style={{
                borderBottomColor: themeStyles.ribbon2Bottom,
                borderLeftColor: themeStyles.ribbon2Left,
              }}
            />
          </div>
        </>
      )}

      {/* 4. Swirling Light Particles & Sparks */}
      {showSparks && active && (
        <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
          {[...Array(8)].map((_, i) => (
            <span
              key={`spark-${replayKey}-${i}`}
              className={`absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-gradient-to-r pointer-events-none ${themeStyles.spark}`}
              style={{
                animation: `swirlAuraSparkles ${4.2 + (i % 3) * 0.8}s ease-in-out infinite`,
                animationDelay: `${i * 0.6}s`,
                transformOrigin: 'center center',
              }}
            />
          ))}
        </div>
      )}

      {/* 5. Athlete Sprint Dash-In Container */}
      <div
        key={`athlete-dash-${replayKey}`}
        className={`relative z-10 transition-all duration-300 ${
          active
            ? direction === 'right'
              ? 'animate-dash-in-right'
              : 'animate-dash-in'
            : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
        }`}
      >
        {children}
      </div>

      {/* 6. Optional Badge Tag */}
      {badgeText && active && (
        <div
          className={`absolute top-2 left-2 z-30 px-2.5 py-0.5 rounded-full border text-[9px] font-black tracking-wider uppercase shadow-sm flex items-center gap-1 backdrop-blur-sm ${themeStyles.badge}`}
        >
          <Lightning weight="fill" className="w-3 h-3 text-[#e60012]" />
          <span>{badgeText}</span>
        </div>
      )}

      {/* 7. Replay Button */}
      {showReplayBtn && onReplay && active && (
        <button
          onClick={onReplay}
          title="Xem lại chuyển động chạy vào và hào quang"
          className="absolute -top-3 -right-3 z-30 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-[#e60012] hover:border-red-300 text-[10px] font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <ArrowsClockwise className="w-3 h-3 text-[#e60012]" />
          <span>Xem lại</span>
        </button>
      )}
    </div>
  );
}
