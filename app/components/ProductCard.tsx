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
    <div className={cn("group relative flex flex-col bg-white rounded-sm overflow-hidden", className)}>
      <Link href={`/products/${product.handle}`} className="relative aspect-square overflow-hidden bg-[#f7f7f7] block">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-[#f30d29] text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
        
        {/* Sold Out Overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-sm font-bold px-4 py-1 uppercase tracking-wider">Hết hàng</span>
          </div>
        )}

        {/* Product Images */}
        <div className="relative w-full h-full">
          <img 
            src={product.images[0]} 
            alt={product.title}
            className={cn("absolute inset-0 w-full h-full object-cover transition-opacity duration-300", 
              product.images.length > 1 ? "group-hover:opacity-0" : ""
            )}
          />
          {product.images.length > 1 && (
            <img 
              src={product.images[1]} 
              alt={`${product.title} - view 2`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-sm text-[#111111] hover:text-[#f30d29] line-clamp-2 min-h-[40px] leading-snug transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto pt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-[#f30d29] font-bold">
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
