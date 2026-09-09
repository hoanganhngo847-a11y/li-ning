'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

interface Category {
  title: string;
  image: string;
  href: string;
}

interface SportCategoriesProps {
  categories: Category[];
}

export default function SportCategories({ categories }: SportCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl md:text-3xl font-bold text-center uppercase mb-8 text-dark"
        >
          Môn thể thao
        </motion.h2>
        
        <div className="flex overflow-x-auto md:grid grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 pb-4 md:pb-0 snap-x snap-mandatory">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
              className="snap-center min-w-[120px] md:min-w-0"
            >
              <Link 
                href={category.href}
                className="flex flex-col items-center gap-3 group active:scale-[0.98] transition-transform"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-bg shadow-sm border border-gray-border flex-shrink-0">
                  <Image 
                    src={category.image} 
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-sm md:text-base font-medium text-center text-dark group-hover:text-brand transition-colors">
                  {category.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
