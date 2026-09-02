"use client";

import React, { useState, useMemo } from "react";
import { products } from "@/app/lib/data/products";
import { useCart } from "@/app/lib/cart-context";
import { formatPrice } from "@/app/lib/utils";
import {
  BodyProfile,
  ClothingSize,
  FittedItem,
  FittingState,
  SPORT_OPTIONS,
  SKIN_TONE_PRESETS,
  SKIN_TONE_COLOR_MATCH,
  recommendSize,
} from "./types";
import type { Product } from "@/app/lib/types";

interface OutfitRecommendationStepProps {
  profile: BodyProfile;
  selectedSkinTone: string;
  selectedSport: string;
  fittingState: FittingState;
  onEquipItem: (item: FittedItem) => void;
  onUnequipItem: (category: "top" | "bottom") => void;
  onBack: () => void;
  onClose: () => void;
}

const ALL_SIZES: ClothingSize[] = ["S", "M", "L", "XL", "XXL"];

const COLOR_TONE_FILTERS = [
  { id: "all", label: "Tất cả màu", hex: "" },
  { id: "do", label: "Đỏ Li-Ning", hex: "#f30d29" },
  { id: "den", label: "Đen Tuyển", hex: "#111111" },
  { id: "trang", label: "Trắng Sứ", hex: "#ffffff" },
  { id: "xanh_navy", label: "Xanh Navy", hex: "#1a365d" },
  { id: "xanh_duong", label: "Xanh Dương", hex: "#2563eb" },
  { id: "xanh_la", label: "Xanh Lá", hex: "#10b981" },
  { id: "vang", label: "Vàng Chanh", hex: "#eab308" },
  { id: "cam", label: "Cam San Hô", hex: "#f97316" },
  { id: "hong", label: "Hồng Pastel", hex: "#ec4899" },
  { id: "tim", label: "Tím Violet", hex: "#8b5cf6" },
  { id: "xam", label: "Xám Titanium", hex: "#6b7280" },
];

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
  const [activeCategory, setActiveCategory] = useState<"top" | "bottom" | "shoes" | "accessory">("top");
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, ClothingSize>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const sportInfo = SPORT_OPTIONS.find((s) => s.id === selectedSport) || SPORT_OPTIONS[0];
  const skinToneInfo =
    SKIN_TONE_PRESETS.find(
      (p) => p.hex.toLowerCase() === selectedSkinTone.toLowerCase()
    ) || SKIN_TONE_PRESETS[1];

  const skinToneMatchRules = SKIN_TONE_COLOR_MATCH[skinToneInfo.id] || SKIN_TONE_COLOR_MATCH["natural"];

  const recommendedTopSize = useMemo(() => recommendSize(profile, "top"), [profile]);
  const recommendedBottomSize = useMemo(() => recommendSize(profile, "bottom"), [profile]);

  // Filter curated products matching Gender, Sport, Category, Color Tone, and Search Query
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const targetGender = profile.gender === "female" ? "nu" : "nam";

    const matched = products.filter((p) => {
      // 1. Gender check
      const genderMatch =
        p.gender === targetGender || p.gender === "unisex" || !p.gender;
      if (!genderMatch) return false;

      // 2. Search query filter (takes precedence when searching)
      if (query) {
        const matchSearch =
          p.title.toLowerCase().includes(query) ||
          p.handle.toLowerCase().includes(query) ||
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          (p.sport && p.sport.toLowerCase().includes(query)) ||
          (p.colorName && p.colorName.toLowerCase().includes(query)) ||
          (p.collections && p.collections.some((c) => c.toLowerCase().includes(query)));
        return matchSearch;
      }

      // 3. Color Tone Filter (when selected)
      if (selectedColorFilter !== "all") {
        if (p.colorTone !== selectedColorFilter) return false;
      }

      // 4. Category filter
      const handle = p.handle.toLowerCase();
      const title = p.title.toLowerCase();

      if (activeCategory === "top") {
        const isTop =
          handle.includes("ao") ||
          title.includes("áo") ||
          handle.includes("bra") ||
          title.includes("bra") ||
          handle.includes("t-shirt") ||
          handle.includes("polo");
        return isTop;
      } else if (activeCategory === "bottom") {
        const isBottom =
          handle.includes("quan") ||
          title.includes("quần") ||
          handle.includes("vay") ||
          title.includes("váy");
        return isBottom;
      } else if (activeCategory === "shoes") {
        const isShoes =
          handle.includes("giay") ||
          title.includes("giày") ||
          handle.includes("dep") ||
          title.includes("dép");
        return isShoes;
      } else {
        // Accessory (Mũ, Tất, Balo, Phụ kiện)
        const isAccessory =
          handle.includes("mu") ||
          title.includes("mũ") ||
          handle.includes("tat") ||
          title.includes("tất") ||
          handle.includes("balo") ||
          title.includes("balo") ||
          handle.includes("tui") ||
          title.includes("túi") ||
          handle.includes("binh-nuoc") ||
          title.includes("bình nước") ||
          handle.includes("phu-kien");
        return isAccessory;
      }
    });

    // 5. Smart AI Ranking based on Skin Tone Compatibility
    return matched.sort((a, b) => {
      const aIsBest = a.colorTone && skinToneMatchRules.bestTones.includes(a.colorTone) ? 100 : 0;
      const aIsGood = a.colorTone && skinToneMatchRules.goodTones.includes(a.colorTone) ? 50 : 0;
      const aScore = aIsBest || aIsGood;

      const bIsBest = b.colorTone && skinToneMatchRules.bestTones.includes(b.colorTone) ? 100 : 0;
      const bIsGood = b.colorTone && skinToneMatchRules.goodTones.includes(b.colorTone) ? 50 : 0;
      const bScore = bIsBest || bIsGood;

      return bScore - aScore;
    });
  }, [profile.gender, activeCategory, selectedColorFilter, searchQuery, skinToneMatchRules]);

  const handleProductCardClick = (product: Product) => {
    if (expandedProductId === product.id) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(product.id);
      if (!selectedSizes[product.id]) {
        setSelectedSizes((prev) => ({
          ...prev,
          [product.id]: activeCategory === "top" ? recommendedTopSize : recommendedBottomSize,
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
      (activeCategory === "top" ? recommendedTopSize : recommendedBottomSize);

    const colorHex = product.colorHex || "#f30d29";

    let determinedCategory: "top" | "bottom" | "shoes" = activeCategory === "accessory" ? "top" : activeCategory;
    const pHandle = product.handle.toLowerCase();
    const pTitle = product.title.toLowerCase();
    if (pHandle.includes("ao") || pTitle.includes("áo") || pHandle.includes("bra")) {
      determinedCategory = "top";
    } else if (pHandle.includes("quan") || pTitle.includes("quần") || pHandle.includes("vay") || pTitle.includes("váy")) {
      determinedCategory = "bottom";
    } else if (pHandle.includes("giay") || pTitle.includes("giày") || pHandle.includes("dep") || pTitle.includes("dép")) {
      determinedCategory = "shoes";
    }

    onEquipItem({
      product,
      size,
      colorHex,
      category: determinedCategory,
    });
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const size =
      selectedSizes[product.id] ||
      (activeCategory === "top" ? recommendedTopSize : recommendedBottomSize);

    const variant =
      product.variants?.find((v) => v.size === size) ||
      product.variants?.[0] || {
        id: `${product.id}-${size}`,
        title: size,
        size,
        color: product.colorName || "Mặc định",
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
      {/* Header & Search Bar */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-black text-gray-950 tracking-tight uppercase">
            GỢI Ý TRANG PHỤC & THỬ ĐỒ 3D
          </h3>
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 flex items-center gap-1"
            style={{
              backgroundColor: `${skinToneInfo.hex}30`,
              borderColor: skinToneInfo.hex,
              color: "#111827",
            }}
          >
            <span
              className="w-2 h-2 rounded-full border border-black/20"
              style={{ backgroundColor: skinToneInfo.hex }}
            />
            Tone da {skinToneInfo.label}
          </span>
        </div>

        {/* AI Skin Tone Advice Banner */}
        <div className="mt-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2 shadow-2xs">
          <span className="text-base shrink-0 leading-none mt-0.5">✨</span>
          <div className="flex-1 leading-snug">
            <strong className="font-bold text-amber-900">Tư vấn màu sắc tôn da {skinToneInfo.label}: </strong>
            <span className="text-amber-800">{skinToneMatchRules.advice}</span>
          </div>
        </div>

        {/* Product Search Bar */}
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên, mã sản phẩm, màu sắc (đỏ, đen, navy, trắng...)"
            className="w-full pl-9 pr-8 py-2 bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-xs font-medium text-gray-900 rounded-xl border border-gray-200 focus:border-[#f30d29] focus:ring-1 focus:ring-[#f30d29] outline-none transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
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
          <span className="text-[10px] underline cursor-pointer" onClick={() => (window.location.href = "/cart")}>
            Xem giỏ hàng &rarr;
          </span>
        </div>
      )}

      {/* Category Filter Tabs */}
      {!searchQuery && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 p-1 bg-gray-100/80 rounded-xl">
            {[
              { id: "top" as const, label: "Áo thể thao" },
              { id: "bottom" as const, label: "Quần & Váy" },
              { id: "shoes" as const, label: "Giày thi đấu" },
              { id: "accessory" as const, label: "Mũ & Tất" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveCategory(tab.id);
                  setExpandedProductId(null);
                }}
                className={`flex-1 py-1.5 px-1 text-center rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeCategory === tab.id
                    ? "bg-white text-gray-950 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <div>{tab.label}</div>
              </button>
            ))}
          </div>

          {/* Color Tone Filter Toolbar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 pl-1">
              Màu:
            </span>
            {COLOR_TONE_FILTERS.map((c) => {
              const isActive = selectedColorFilter === c.id;
              const isBest = skinToneMatchRules.bestTones.includes(c.id);

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColorFilter(c.id)}
                  className={`shrink-0 px-2 py-1 rounded-full text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                    isActive
                      ? "bg-gray-900 text-white border-gray-900 shadow-2xs"
                      : isBest
                      ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {c.hex && (
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                  )}
                  {c.label}
                  {isBest && c.id !== "all" && <span className="text-[9px] text-amber-600">★</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Search status / count */}
      {searchQuery && (
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>
            Kết quả tìm kiếm cho: &quot;<strong className="text-gray-900">{searchQuery}</strong>&quot; ({filteredProducts.length} sản phẩm)
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-[#f30d29] font-bold text-[11px] hover:underline cursor-pointer"
          >
            Quay lại gợi ý AI
          </button>
        </div>
      )}

      {/* Products List or Empty State */}
      <div className="space-y-3 overflow-y-auto pr-1 max-h-[calc(88vh-310px)] no-scrollbar">
        {filteredProducts.length === 0 ? (
          <div className="py-12 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Không tìm thấy sản phẩm phù hợp</h4>
            <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
              Vui lòng thử chọn màu khác hoặc xóa từ khóa tìm kiếm.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedColorFilter("all");
              }}
              className="px-4 py-2 bg-gray-950 text-white rounded-xl text-xs font-bold hover:bg-black transition-all cursor-pointer"
            >
              Xóa bộ lọc & Xem gợi ý AI
            </button>
          </div>
        ) : (
          filteredProducts.slice(0, 24).map((product) => {
            const isExpanded = expandedProductId === product.id;
            const currentSize =
              selectedSizes[product.id] ||
              (activeCategory === "top" ? recommendedTopSize : recommendedBottomSize);

            const isFitted =
              (fittingState.top?.product.id === product.id) ||
              (fittingState.bottom?.product.id === product.id);

            const isBestTone = product.colorTone && skinToneMatchRules.bestTones.includes(product.colorTone);
            const isGoodTone = product.colorTone && skinToneMatchRules.goodTones.includes(product.colorTone);

            return (
              <div
                key={product.id}
                onClick={() => handleProductCardClick(product)}
                className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isFitted
                    ? "border-[#f30d29] bg-red-50/30 ring-1.5 ring-[#f30d29]"
                    : isExpanded
                    ? "border-gray-900 bg-white shadow-md"
                    : isBestTone
                    ? "border-amber-200/80 bg-white hover:border-amber-400 hover:shadow-2xs"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-2xs"
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
                      {/* Product Title & Status */}
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

                      {/* Color Pill & Skin Tone Suitability Badge */}
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {/* Dominant Color Swatch */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/60">
                          <span
                            className="w-2 h-2 rounded-full border border-black/20"
                            style={{ backgroundColor: product.colorHex || "#111" }}
                          />
                          {product.colorName || "Màu tiêu chuẩn"}
                        </span>

                        {/* AI Skin Tone Match Badge */}
                        {isBestTone ? (
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                            ✨ Tôn tone da
                          </span>
                        ) : isGoodTone ? (
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                            ✓ Hợp màu da
                          </span>
                        ) : null}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-1.5">
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
                        {isExpanded ? "Thu gọn ▲" : "Chọn size & Thử 3D ▼"}
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
                        {activeCategory === "top" ? recommendedTopSize : recommendedBottomSize}
                      </strong>
                    </div>

                    {/* Size Selector Buttons */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                        Chọn kích cỡ phù hợp:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ALL_SIZES.map((size) => {
                          const isSelected = currentSize === size;
                          const isRec =
                            size === (activeCategory === "top" ? recommendedTopSize : recommendedBottomSize);

                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={(e) => handleSelectSize(product.id, size, e)}
                              className={`relative px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                                isSelected
                                  ? "bg-[#f30d29] text-white border-[#f30d29] shadow-xs"
                                  : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              {size}
                              {isRec && !isSelected && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions: Try-on 3D & Add to Cart */}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => handleTryOn(product, e)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          isFitted
                            ? "bg-gray-900 text-white hover:bg-black"
                            : "bg-[#f30d29] text-white hover:bg-[#d10b23]"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {isFitted ? "Đang mặc trên 3D" : "Mặc thử lên mô hình 3D"}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(product, e)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 hover:border-gray-900 text-xs font-bold text-gray-900 hover:bg-gray-50 transition-all cursor-pointer shrink-0"
                        title="Thêm vào giỏ hàng"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
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
          onClick={() => (window.location.href = "/cart")}
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
