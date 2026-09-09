'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { House, Tag, MapPin, ChatCircle, Phone } from '@phosphor-icons/react';

export default function MobileBottomBar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Trang chủ',
      href: '/',
      icon: House
    },
    {
      label: 'Ưu đãi',
      href: '/collections/khuyen-mai-sale',
      icon: Tag
    },
    {
      label: 'Cửa hàng',
      href: '/pages/he-thong-cua-hang',
      icon: MapPin
    },
    {
      label: 'Nhắn tin',
      href: '#',
      icon: ChatCircle
    },
    {
      label: 'Hotline',
      href: 'tel:1900633083',
      icon: Phone
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 flex justify-around items-center h-14 px-2 pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link 
            key={index} 
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 rounded-sm active:scale-[0.98] transition-transform",
              isActive ? "text-brand" : "text-gray-500 hover:text-brand"
            )}
          >
            <Icon weight={isActive ? "bold" : "regular"} className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
