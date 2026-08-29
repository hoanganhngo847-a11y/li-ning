'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/app/lib/types';
import ProductCard from './ProductCard';
import { cn } from '@/app/lib/utils';
import { getProductsForCollection } from '@/app/lib/data/collectionMap';
import { useProductsWithAdminProducts } from '@/app/lib/admin-products';

interface Tab {
  label: string;
  collectionHandle: string;
}

interface HomeTabSectionProps {
  title: string;
  titleHref: string;
  tabs: Tab[];
  allProducts: Product[];
  collections?: { handle: string; productHandles: string[] }[];
}

export default function HomeTabSection({ title, titleHref, tabs, allProducts }: HomeTabSectionProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.collectionHandle || '');
  const { products: mergedProducts } = useProductsWithAdminProducts(allProducts);

  const displayProducts = useMemo(() => {
    return getProductsForCollection(mergedProducts, activeTab).slice(0, 10);
  }, [activeTab, mergedProducts]);

  if (!tabs.length) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-6">
          <Link href={titleHref} className="inline-block group">
            <h2 className="text-2xl md:text-3xl font-bold uppercase text-[#111111] group-hover:text-[#f30d29] transition-colors relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#f30d29]">
              {title}
            </h2>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.collectionHandle}
              onClick={() => setActiveTab(tab.collectionHandle)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border cursor-pointer",
                activeTab === tab.collectionHandle
                  ? "bg-[#f30d29] text-white border-[#f30d29]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#f30d29] hover:text-[#f30d29]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 mb-8">
            {displayProducts.map(product => (
              <ProductCard key={product.id || product.handle} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Không có sản phẩm nào trong danh mục này.
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link 
            href={`/collections/${activeTab}`}
            className="inline-block px-8 py-3 bg-white text-[#111111] border border-[#111111] rounded hover:bg-[#111111] hover:text-white transition-colors text-sm font-bold uppercase"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
    </section>
  );
}
