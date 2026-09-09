'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from '@phosphor-icons/react';
import ProductCard from './ProductCard';
import type { Product } from '@/app/lib/types';

interface AnimatedSectionProps {
  title: string;
  titleHref?: string;
  products: Product[];
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'zoom-in';
  bgClass?: string;
}

export default function AnimatedProductSection({
  title,
  titleHref,
  products,
  animation = 'fade-up',
  bgClass = '',
}: AnimatedSectionProps) {
  const displayProducts = products.slice(0, 10);
  const getInitialVariant = () => {
    switch (animation) {
      case 'fade-left': return { opacity: 0, x: -20 };
      case 'fade-right': return { opacity: 0, x: 20 };
      case 'zoom-in': return { opacity: 0, scale: 0.95 };
      default: return { opacity: 0, y: 20 };
    }
  };

  return (
    <section className={`w-full py-12 ${bgClass}`}>
      <div className="max-w-[1400px] mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-2xl font-bold text-dark uppercase">{title}</h2>
          {titleHref && (
            <Link 
              href={titleHref} 
              className="flex items-center gap-1 text-sm font-medium text-dark hover:text-brand transition-colors active:scale-[0.98] transition-transform"
            >
              Xem tất cả
              <ArrowRight size={16} weight="regular" />
            </Link>
          )}
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={getInitialVariant()}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
