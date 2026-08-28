'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/lib/cart-context';
import { navigation as mainNavigation } from '@/app/lib/data/navigation';
import { NavItem } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Record<string, boolean>>({});
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = (title: string) => {
    setExpandedMobileMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <header className={cn("w-full transition-all duration-300", isScrolled ? "fixed top-0 left-0 z-50 bg-white shadow-md" : "relative bg-white z-50")}>
      {/* Top Announcement Bar */}
      <div className="bg-[#f30d29] text-white text-center py-1.5 text-sm font-medium">
        FREESHIP cho đơn hàng từ 1.000.000đ | Hotline: 1900633083
      </div>

      {/* Main Header Row */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-4 lg:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Link href="/" className="inline-block">
            <img 
              src="https://cdn.hstatic.net/themes/1000312752/1001500748/14/logo.png?v=165" 
              alt="Li-Ning Logo" 
              className="mobile-header-logo" 
              style={{ height: '30px', maxHeight: '30px', width: 'auto', display: 'inline-block' }}
            />
          </Link>
        </div>

        {/* Desktop Logo */}
        <Link href="/" className="hidden lg:block shrink-0">
          <img 
            src="https://cdn.hstatic.net/themes/1000312752/1001500748/14/logo.png?v=165" 
            alt="Li-Ning Logo" 
            className="header-logo" 
            style={{ height: '38px', maxHeight: '38px', width: 'auto', display: 'inline-block' }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center flex-1 h-full mx-8">
          <ul className="flex space-x-6 h-full">
            {mainNavigation.map((item) => (
              <li key={item.title} className="relative group h-full flex items-center">
                <Link href={item.href} className="text-[#111111] hover:text-[#f30d29] font-medium text-[15px] uppercase flex items-center gap-1">
                  {item.title}
                  {item.children && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  )}
                </Link>

                {/* Desktop Dropdowns */}
                {item.children && (
                  item.children.some(c => c.children && c.children.length > 0) ? (
                    /* Multi-column Mega Menu (NAM, NỮ) */
                    <div className="absolute top-full -left-20 lg:-left-32 bg-white shadow-xl border-t-2 border-[#f30d29] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-[850px] p-6 z-50 rounded-b-sm">
                      <div className="grid grid-cols-5 gap-6">
                        {item.children.map((child, idx) => (
                          <div key={idx} className="flex flex-col">
                            <Link href={child.href} className="font-bold text-[#111111] mb-2.5 hover:text-[#f30d29] uppercase text-sm border-b pb-1">
                              {child.title}
                            </Link>
                            {child.children && (
                              <ul className="flex flex-col space-y-1.5">
                                {child.children.map((subChild, subIdx) => (
                                  <li key={subIdx}>
                                    <Link href={subChild.href} className="text-gray-600 hover:text-[#f30d29] text-xs transition-colors block py-0.5">
                                      {subChild.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Single-column Dropdown (MÔN THỂ THAO, THỜI TRANG, YOUNG, SALE, TIN TỨC) */
                    <div className="absolute top-full left-0 bg-white shadow-lg border-t-2 border-[#f30d29] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[210px] py-2 z-50 rounded-b-sm">
                      <ul className="flex flex-col">
                        {item.children.map((child, idx) => (
                          <li key={idx}>
                            <Link 
                              href={child.href} 
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#f30d29] hover:bg-gray-50 uppercase font-medium transition-colors border-b border-gray-50 last:border-0"
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-1 text-gray-700 hover:text-[#f30d29]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <Link href="/account/login" className="hidden lg:block p-1 text-gray-700 hover:text-[#f30d29]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </Link>
          <Link href="/cart" className="relative p-1 text-gray-700 hover:text-[#f30d29]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#f30d29] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={cn("absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 overflow-hidden z-40", isSearchOpen ? "max-h-24 py-4 border-t" : "max-h-0")}>
        <div className="container mx-auto px-4 relative">
          <form action="/search" method="GET" className="relative max-w-2xl mx-auto">
            <input type="text" name="q" placeholder="Tìm kiếm sản phẩm..." className="w-full h-12 pl-4 pr-12 border border-gray-300 rounded focus:outline-none focus:border-[#f30d29]" />
            <button type="submit" className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-gray-500 hover:text-[#f30d29]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
          <button onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#f30d29] lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-xl flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-[#f7f7f7]">
              <span className="font-bold text-lg">MENU</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <ul className="flex flex-col">
                {mainNavigation.map((item) => (
                  <li key={item.title} className="border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between px-4 py-3">
                      <Link href={item.href} className="flex-1 font-medium text-[#111111]" onClick={() => setIsMobileMenuOpen(false)}>
                        {item.title}
                      </Link>
                      {item.children && (
                        <button className="p-2 -mr-2" onClick={() => toggleMobileMenu(item.title)}>
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {expandedMobileMenus[item.title] ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            )}
                          </svg>
                        </button>
                      )}
                    </div>
                    {item.children && expandedMobileMenus[item.title] && (
                      <ul className="bg-[#f7f7f7] pb-2">
                        {item.children.map((child, idx) => (
                          <li key={idx}>
                            <div className="flex items-center justify-between pl-8 pr-4 py-2 border-t border-gray-200">
                              <Link href={child.href} className="flex-1 text-sm text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                                {child.title}
                              </Link>
                              {child.children && (
                                <button className="p-1 -mr-1" onClick={() => toggleMobileMenu(child.title)}>
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {expandedMobileMenus[child.title] ? (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    ) : (
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    )}
                                  </svg>
                                </button>
                              )}
                            </div>
                            {child.children && expandedMobileMenus[child.title] && (
                              <ul className="bg-gray-100 pb-2">
                                {child.children.map((subChild, subIdx) => (
                                  <li key={subIdx}>
                                    <Link href={subChild.href} className="block pl-12 pr-4 py-2 text-sm text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                                      - {subChild.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t bg-[#f7f7f7]">
              <Link href="/account/login" className="flex items-center gap-2 text-[#111111] font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Đăng nhập / Đăng ký
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
