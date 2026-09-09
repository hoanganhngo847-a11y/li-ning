'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from '@phosphor-icons/react';
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
    return getProductsForCollection(mergedProducts, activeTab).slice(0, 9);
  }, [activeTab, mergedProducts]);

  if (!tabs.length) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href={titleHref}>
            <h2 className="text-2xl md:text-3xl font-bold uppercase text-dark hover:text-brand transition-colors">
              {title}
            </h2>
          </Link>
          <Link 
            href={`/collections/${activeTab}`}
            className="hidden md:flex items-center gap-1 text-sm font-medium text-dark hover:text-brand transition-colors active:scale-[0.98] transition-transform"
          >
            Xem tất cả
            <ArrowRight size={16} weight="regular" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto md:flex-wrap gap-2 mb-8 pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.collectionHandle}
              onClick={() => setActiveTab(tab.collectionHandle)}
              className={cn(
                "px-6 py-2 rounded-sm text-sm font-medium transition-all duration-300 border cursor-pointer whitespace-nowrap active:scale-[0.98]",
                activeTab === tab.collectionHandle
                  ? "bg-brand text-white border-brand"
                  : "bg-transparent text-gray-600 border border-gray-border hover:border-brand"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid with Motion Fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {displayProducts.map((product, i) => (
                  <motion.div
                    key={product.id || product.handle}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                Không có sản phẩm nào trong danh mục này.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mobile View All Button */}
        <div className="md:hidden text-center mt-6">
          <Link 
            href={`/collections/${activeTab}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-dark border border-gray-border rounded-sm hover:border-brand hover:text-brand transition-colors text-sm font-bold uppercase active:scale-[0.98] transition-transform w-full"
          >
            Xem tất cả
            <ArrowRight size={16} weight="regular" />
          </Link>
        </div>
      </div>
    </section>
  );
}
