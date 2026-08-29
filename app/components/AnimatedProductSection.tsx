'use client';

import React from 'react';
import ScrollAnimate, { StaggerChildren } from './ScrollAnimate';
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
  return (
    <section className={`container mx-auto px-4 py-12 ${bgClass}`}>
      <ScrollAnimate animation="fade-up" duration={500}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 uppercase">{title}</h2>
          {titleHref && (
            <a href={titleHref} className="text-[#f30d29] hover:underline">Xem tất cả</a>
          )}
        </div>
      </ScrollAnimate>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <StaggerChildren animation={animation} staggerDelay={80} duration={500}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
