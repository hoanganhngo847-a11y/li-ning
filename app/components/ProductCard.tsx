'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TShirt } from '@phosphor-icons/react';
import { Product } from '@/app/lib/types';
import { cn, formatPrice, calculateDiscount } from '@/app/lib/utils';
import { useFitRoom } from '@/app/components/fitroom/FitRoomContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { selectProductForTryOn } = useFitRoom();

  const discount = product.compareAtPrice && product.compareAtPrice > product.price 
    ? calculateDiscount(product.price, product.compareAtPrice) 
    : 0;

  const handleTryOn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectProductForTryOn(product, true);
  };

  return (
    <div className={cn(
      "group relative flex flex-col bg-white rounded-sm overflow-hidden border border-transparent hover:border-gray-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg", 
      className
    )}>
      <Link href={`/products/${product.handle}`} className="relative aspect-square overflow-hidden bg-gray-bg block rounded-sm">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-brand text-white text-xs font-bold px-2 py-1 rounded-sm shadow-md transform group-hover:scale-105 transition-transform duration-200">
            -{discount}%
          </div>
        )}
        
        {/* Sold Out Overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-dark text-white text-xs md:text-sm font-bold px-3 py-1 uppercase tracking-wider rounded-sm">
              Hết hàng
            </span>
          </div>
        )}

        {/* Product Images with smooth zoom and fade */}
        <div className="relative w-full h-full overflow-hidden rounded-sm">
          <Image 
            src={product.images[0]} 
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-105", 
              product.images.length > 1 ? "group-hover:opacity-0" : ""
            )}
          />
          {product.images.length > 1 && (
            <Image 
              src={product.images[1]} 
              alt={`${product.title} - view 2`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
          )}
        </div>

        {/* Quick Action Button: Thử sản phẩm này (FitRoom) */}
        <div className="absolute bottom-2 right-2 z-20 flex md:inset-x-2 md:bottom-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:transform md:translate-y-2 md:group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleTryOn}
            className="flex-shrink-0 w-8 h-8 md:w-full md:h-auto md:py-1.5 md:px-2.5 bg-dark/85 hover:bg-brand text-white text-[11px] font-bold uppercase tracking-wider rounded-sm backdrop-blur-xs transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            title="Thử sản phẩm này"
          >
            <TShirt weight="regular" className="w-4 h-4 md:w-3 md:h-3" />
            <span className="hidden md:inline">Thử sản phẩm này</span>
          </button>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-sm text-dark group-hover:text-brand line-clamp-2 min-h-[40px] leading-snug transition-colors font-medium">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto pt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-brand font-bold text-sm md:text-base">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-price-old text-xs line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
