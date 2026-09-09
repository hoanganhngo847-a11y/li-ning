'use client';

import React from 'react';
import { Product } from '@/app/lib/types';
import { useFitRoom } from './FitRoomContext';

interface TryOnButtonProps {
  product: Product;
  className?: string;
  variant?: 'primary' | 'secondary' | 'badge';
  label?: string;
}

export default function TryOnButton({
  product,
  className = '',
  variant = 'primary',
  label = 'THỬ ĐỒ BẰNG AI',
}: TryOnButtonProps) {
  const { selectProductForTryOn } = useFitRoom();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectProductForTryOn(product, true);
  };

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 hover:bg-[#f30d29] text-[#f30d29] hover:text-white border border-red-200 text-xs font-bold transition-all shadow-xs cursor-pointer ${className}`}
      >
        <span>✨</span>
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`w-full py-2.5 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${className}`}
      >
        <span>✨</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 hover:from-black hover:to-black text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg border border-gray-800 transition-all flex items-center justify-center gap-2.5 cursor-pointer group ${className}`}
    >
      <span className="text-base group-hover:scale-110 transition-transform">✨</span>
      <span>{label}</span>
      <span className="px-2 py-0.5 rounded-full bg-[#f30d29] text-white text-[9.5px] font-mono font-bold">
        FitRoom AI
      </span>
    </button>
  );
}
