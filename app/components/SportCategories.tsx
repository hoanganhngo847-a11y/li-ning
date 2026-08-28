import React from 'react';
import Link from 'next/link';

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
        <h2 className="text-2xl md:text-3xl font-bold text-center uppercase mb-8 text-[#111111]">
          Môn thể thao
        </h2>
        
        {/* Mobile: Horizontal scroll, Desktop: Grid wrap */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 pb-4 md:pb-0 snap-x hide-scrollbar">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={category.href}
              className="flex flex-col items-center gap-3 min-w-[120px] md:min-w-0 snap-center group"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#f7f7f7] shadow-sm border border-gray-100 flex-shrink-0">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="text-sm md:text-base font-medium text-center text-gray-800 group-hover:text-[#f30d29] transition-colors">
                {category.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
