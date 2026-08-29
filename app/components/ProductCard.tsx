import React from 'react';
import Link from 'next/link';
import { Product } from '@/app/lib/types';
import { cn, formatPrice, calculateDiscount } from '@/app/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const discount = product.compareAtPrice && product.compareAtPrice > product.price 
    ? calculateDiscount(product.price, product.compareAtPrice) 
    : 0;

  return (
    <div className={cn(
      "group relative flex flex-col bg-white rounded-md overflow-hidden border border-transparent hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg", 
      className
    )}>
      <Link href={`/products/${product.handle}`} className="relative aspect-square overflow-hidden bg-[#f7f7f7] block">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-[#f30d29] text-white text-xs font-bold px-2 py-1 rounded shadow-md transform group-hover:scale-105 transition-transform duration-200">
            -{discount}%
          </div>
        )}
        
        {/* Sold Out Overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-gray-800 text-white text-xs md:text-sm font-bold px-3 py-1 uppercase tracking-wider rounded">
              Hết hàng
            </span>
          </div>
        )}

        {/* Product Images with smooth zoom and fade */}
        <div className="relative w-full h-full overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105", 
              product.images.length > 1 ? "group-hover:opacity-0" : ""
            )}
            loading="lazy"
          />
          {product.images.length > 1 && (
            <img 
              src={product.images[1]} 
              alt={`${product.title} - view 2`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
          )}
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-sm text-[#111111] group-hover:text-[#f30d29] line-clamp-2 min-h-[40px] leading-snug transition-colors font-medium">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto pt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-[#f30d29] font-bold text-sm md:text-base">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-gray-400 text-xs line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
