'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { products } from '@/app/lib/data/products';
import { useCart } from '@/app/lib/cart-context';
import { formatPrice } from '@/app/lib/utils';
import {
  BodyProfile,
  ClothingSize,
  FittedItem,
  FittingState,
  SPORT_OPTIONS,
  SKIN_TONE_PRESETS,
  recommendSize,
} from './types';
import type { Product } from '@/app/lib/types';

interface OutfitRecommendationStepProps {
  profile: BodyProfile;
  selectedSkinTone: string;
  selectedSport: string;
  fittingState: FittingState;
  onEquipItem: (item: FittedItem) => void;
  onUnequipItem: (category: 'top' | 'bottom') => void;
  onBack: () => void;
  onClose: () => void;
}

const ALL_SIZES: ClothingSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

export default function OutfitRecommendationStep({
  profile,
  selectedSkinTone,
  selectedSport,
  fittingState,
  onEquipItem,
  onUnequipItem,
  onBack,
  onClose,
}: OutfitRecommendationStepProps) {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<'top' | 'bottom' | 'shoes'>('top');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, ClothingSize>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const sportInfo = SPORT_OPTIONS.find((s) => s.id === selectedSport) || SPORT_OPTIONS[0];
  const skinToneInfo =
    SKIN_TONE_PRESETS.find(
      (p) => p.hex.toLowerCase() === selectedSkinTone.toLowerCase()
    ) || SKIN_TONE_PRESETS[1];

  const recommendedTopSize = useMemo(() => recommendSize(profile, 'top'), [profile]);
  const recommendedBottomSize = useMemo(() => recommendSize(profile, 'bottom'), [profile]);

  // Filter curated products matching Gender, Sport, and Category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Gender check
      const targetGender = profile.gender === 'female' ? 'nu' : 'nam';
      const genderMatch =
        p.gender === targetGender || p.gender === 'unisex' || !p.gender;
      if (!genderMatch) return false;

      // 2. Category check
      const handle = p.handle.toLowerCase();
      const title = p.title.toLowerCase();

      if (activeCategory === 'top') {
        const isTop =
          handle.includes('ao') ||
          title.includes('áo') ||
          handle.includes('bra') ||
          title.includes('bra') ||
          handle.includes('t-shirt') ||
          handle.includes('polo');
        return isTop;
      } else if (activeCategory === 'bottom') {
        const isBottom =
          handle.includes('quan') ||
          title.includes('quần') ||
          handle.includes('vay') ||
          title.includes('váy');
        return isBottom;
      } else {
        const isShoes =
          handle.includes('giay') ||
          title.includes('giày') ||
          handle.includes('dep') ||
          title.includes('dép');
        return isShoes;
      }
    });
  }, [profile.gender, activeCategory]);

  const handleProductCardClick = (product: Product) => {
    if (expandedProductId === product.id) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(product.id);
      if (!selectedSizes[product.id]) {
        setSelectedSizes((prev) => ({
          ...prev,
          [product.id]: activeCategory === 'top' ? recommendedTopSize : recommendedBottomSize,
        }));
      }
    }
  };

  const handleSelectSize = (productId: string, size: ClothingSize, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handleTryOn = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const size =
      selectedSizes[product.id] ||
      (activeCategory === 'top' ? recommendedTopSize : recommendedBottomSize);

    // Extract dominant color from product title/handle
    let colorHex = '#f30d29'; // Default Li-Ning Red
    const lower = (product.title + ' ' + product.handle).toLowerCase();
    if (lower.includes('den') || lower.includes('đen') || lower.includes('black')) colorHex = '#111111';
    else if (lower.includes('trang') || lower.includes('trắng') || lower.includes('white')) colorHex = '#f8fafc';
    else if (lower.includes('xanh') || lower.includes('blue') || lower.includes('navy')) colorHex = '#1e3a8a';
    else if (lower.includes('vang') || lower.includes('vàng') || lower.includes('yellow')) colorHex = '#eab308';
    else if (lower.includes('cam') || lower.includes('orange')) colorHex = '#f97316';
    else if (lower.includes('hong') || lower.includes('hồng') || lower.includes('pink')) colorHex = '#ec4899';

    onEquipItem({
      product,
      size,
      colorHex,
      category: activeCategory,
    });
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const size =
      selectedSizes[product.id] ||
      (activeCategory === 'top' ? recommendedTopSize : recommendedBottomSize);

    const variant =
      product.variants?.find((v) => v.size === size) ||
      product.variants?.[0] || {
        id: `${product.id}-${size}`,
        title: size,
        size,
        color: 'Mặc định',
        available: true,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
      };

    addItem(product, variant.id, 1);
    setAddedNotice(`Đã thêm ${product.title} (Size ${size}) vào giỏ hàng!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <div className="flex flex-col justify-between h-full space-y-3">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-950 tracking-tight uppercase">
            GỢI Ý TRANG PHỤC & THỬ ĐỒ 3D
          </h3>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {sportInfo.name} • Tone da {skinToneInfo.label}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
          AI tự động gợi ý kích cỡ chuẩn. Bấm vào sản phẩm để chọn size và <strong>khớp trực tiếp lên mô hình 3D</strong>.
        </p>
      </div>

      {/* Success Notification Alert */}
      {addedNotice && (
        <div className="p-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-md animate-fadeIn">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            {addedNotice}
          </span>
          <span className="text-[10px] underline cursor-pointer" onClick={() => (window.location.href = '/cart')}>
            Xem giỏ hàng &rarr;
          </span>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl">
        {[
          { id: 'top' as const, label: 'Áo thể thao', count: 'Áo Polo / T-Shirt' },
          { id: 'bottom' as const, label: 'Quần & Váy', count: 'Short / Dài' },
          { id: 'shoes' as const, label: 'Giày thi đấu', count: 'Chuyên dụng' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveCategory(tab.id);
              setExpandedProductId(null);
            }}
            className={`flex-1 py-2 px-2 text-center rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-white text-gray-950 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div>{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Curated Products List */}
      <div className="space-y-3 overflow-y-auto pr-1 max-h-[calc(88vh-270px)] no-scrollbar">
        {filteredProducts.slice(0, 15).map((product) => {
          const isExpanded = expandedProductId === product.id;
          const currentSize =
            selectedSizes[product.id] ||
            (activeCategory === 'top' ? recommendedTopSize : recommendedBottomSize);

          const isFitted =
            (activeCategory === 'top' && fittingState.top?.product.id === product.id) ||
            (activeCategory === 'bottom' && fittingState.bottom?.product.id === product.id);

          return (
            <div
              key={product.id}
              onClick={() => handleProductCardClick(product)}
              className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isFitted
                  ? 'border-[#f30d29] bg-red-50/30 ring-1.5 ring-[#f30d29]'
                  : isExpanded
                  ? 'border-gray-900 bg-white shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-20 h-20 rounded-xl bg-gray-50 shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center p-1 bg-white">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold font-mono">
                      LI-NING
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-gray-950 truncate leading-snug">
                        {product.title}
                      </h4>
                      {isFitted && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#f30d29] text-white">
                          Đang mặc
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-[#f30d29]">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-gray-500">
                      Size chọn: <strong className="text-gray-900 font-mono font-bold">{currentSize}</strong>
                    </span>
                    <span className="text-[#f30d29] font-bold inline-flex items-center gap-0.5">
                      {isExpanded ? 'Thu gọn ▲' : 'Chọn size & Thử 3D ▼'}
                    </span>
                  </div>
                </div>
              </div>

              {/* EXPANDED SIZE SELECTOR & TRY-ON CONTROLS */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                  {/* Smart Size Recommendation Banner */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-900">
                    <span className="flex items-center gap-1.5 font-medium">
                      <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Size khuyến nghị theo vóc dáng:
                    </span>
                    <strong className="font-mono font-black text-xs px-2 py-0.5 rounded bg-emerald-600 text-white">
                      {activeCategory === 'top' ? recommendedTopSize : recommendedBottomSize}
                    </strong>
                  </div>

                  {/* Size Buttons S, M, L, XL, XXL */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-600 mb-1.5">
                      Chọn kích cỡ áo:
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {ALL_SIZES.map((size) => {
                        const isSelectedSize = currentSize === size;
                        const isRec =
                          size === (activeCategory === 'top' ? recommendedTopSize : recommendedBottomSize);

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={(e) => handleSelectSize(product.id, size, e)}
                            className={`py-1.5 px-1 text-center rounded-lg border font-mono font-bold text-xs transition-all cursor-pointer relative ${
                              isSelectedSize
                                ? 'bg-gray-950 text-white border-gray-950 shadow-xs'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            <span>{size}</span>
                            {isRec && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons: TRY ON & ADD TO CART */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => handleTryOn(product, e)}
                      className="py-2.5 px-3 rounded-xl bg-gray-950 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                    >
                      <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
                      </svg>
                      <span>MẶC THỬ 3D</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className="py-2.5 px-3 rounded-xl bg-[#f30d29] hover:bg-[#d10b23] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>THÊM VÀO GIỎ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="pt-2 flex items-center gap-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>QUAY LẠI</span>
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = '/cart')}
          className="w-2/3 py-3 px-6 rounded-xl bg-[#f30d29] hover:bg-[#d10b23] text-white font-black text-xs md:text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(243,13,41,0.35)] hover:shadow-[0_6px_25px_rgba(243,13,41,0.5)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-98"
        >
          <span>XEM GIỎ HÀNG & THANH TOÁN</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
