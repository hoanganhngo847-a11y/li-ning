'use client';

import React from 'react';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const sortOptions = [
    { value: 'manual', label: 'Sản phẩm nổi bật' },
    { value: 'price-ascending', label: 'Giá: Tăng dần' },
    { value: 'price-descending', label: 'Giá: Giảm dần' },
    { value: 'created-descending', label: 'Mới nhất' },
    { value: 'title-ascending', label: 'Tên: A-Z' },
    { value: 'title-descending', label: 'Tên: Z-A' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-600 hidden md:block">Sắp xếp theo:</label>
      <div className="relative">
        <select
          id="sort"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 text-sm text-gray-700 py-2 pl-3 pr-8 rounded-sm focus:outline-none focus:border-[#f30d29] cursor-pointer"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
