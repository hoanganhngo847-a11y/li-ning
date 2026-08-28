import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="py-4 bg-[#f7f7f7] border-b border-gray-200 mb-6 text-sm" aria-label="Breadcrumb">
      <div className="container mx-auto px-4">
        <ol className="flex items-center flex-wrap gap-2 text-gray-500">
          <li className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#f30d29] transition-colors">Trang chủ</Link>
          </li>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center gap-2">
                <span className="text-gray-400">/</span>
                {isLast || !item.href ? (
                  <span className="text-gray-800 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-[#f30d29] transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
