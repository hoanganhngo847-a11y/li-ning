'use client';

import React, { useState } from 'react';
import { cn } from '@/app/lib/utils';

export interface FilterState {
  priceRange?: [number, number];
  gender?: string[];
  sport?: string[];
  size?: string[];
  color?: string[];
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export default function FilterSidebar({ onFilterChange, className }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gender: true,
    price: true,
    size: true,
    color: true,
    sport: true
  });

  const [filters, setFilters] = useState<FilterState>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = (prev[category] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      const newFilters = { ...prev, [category]: updated };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => {
      const newFilters = { ...prev, priceRange: [min, max] as [number, number] };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const isPriceSelected = (min: number, max: number) => {
    return filters.priceRange?.[0] === min && filters.priceRange?.[1] === max;
  };

  const SectionHeader = ({ title, section }: { title: string, section: string }) => (
    <button 
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-3 font-bold text-[#111111] uppercase text-sm"
    >
      {title}
      <svg className={cn("w-4 h-4 transition-transform", expandedSections[section] ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className={cn("bg-white", className)}>
      {/* Giới tính */}
      <div className="border-b border-gray-200 pb-2">
        <SectionHeader title="Giới tính" section="gender" />
        {expandedSections['gender'] && (
          <div className="flex flex-col gap-2 pb-3">
            {['Nam', 'Nữ', 'Unisex'].map(g => (
              <label key={g} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.gender?.includes(g) || false}
                  onChange={() => handleCheckboxChange('gender', g)}
                  className="w-4 h-4 text-[#f30d29] rounded border-gray-300 focus:ring-[#f30d29]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#f30d29]">{g}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Mức giá */}
      <div className="border-b border-gray-200 pb-2">
        <SectionHeader title="Mức giá" section="price" />
        {expandedSections['price'] && (
          <div className="flex flex-col gap-2 pb-3">
            {[
              { label: 'Dưới 500.000đ', min: 0, max: 500000 },
              { label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
              { label: '1.000.000đ - 2.000.000đ', min: 1000000, max: 2000000 },
              { label: '2.000.000đ - 3.000.000đ', min: 2000000, max: 3000000 },
              { label: 'Trên 3.000.000đ', min: 3000000, max: 999999999 }
            ].map(p => (
              <label key={p.label} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="price"
                  checked={isPriceSelected(p.min, p.max)}
                  onChange={() => handlePriceChange(p.min, p.max)}
                  className="w-4 h-4 text-[#f30d29] border-gray-300 focus:ring-[#f30d29]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#f30d29]">{p.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Kích thước */}
      <div className="border-b border-gray-200 pb-2">
        <SectionHeader title="Kích thước" section="size" />
        {expandedSections['size'] && (
          <div className="flex flex-wrap gap-2 pb-3">
            {['S', 'M', 'L', 'XL', '2XL', '38', '39', '40', '41', '42', '43', '44', '45'].map(s => {
              const isSelected = filters.size?.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => handleCheckboxChange('size', s)}
                  className={cn(
                    "min-w-[36px] h-9 px-2 flex items-center justify-center border text-xs font-medium rounded-sm transition-colors",
                    isSelected ? "border-[#f30d29] bg-[#f30d29] text-white" : "border-gray-200 text-gray-700 hover:border-[#f30d29]"
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Môn thể thao */}
      <div className="border-b border-gray-200 pb-2">
        <SectionHeader title="Môn thể thao" section="sport" />
        {expandedSections['sport'] && (
          <div className="flex flex-col gap-2 pb-3">
            {['Chạy bộ', 'Bóng rổ', 'Cầu lông', 'Thời trang', 'Tập luyện'].map(sp => (
              <label key={sp} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={filters.sport?.includes(sp) || false}
                  onChange={() => handleCheckboxChange('sport', sp)}
                  className="w-4 h-4 text-[#f30d29] rounded border-gray-300 focus:ring-[#f30d29]"
                />
                <span className="text-sm text-gray-600 group-hover:text-[#f30d29]">{sp}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
