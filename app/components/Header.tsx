'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/lib/cart-context';
import { navigation as mainNavigation } from '@/app/lib/data/navigation';
import type { NavItem } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';
import { MagnifyingGlass, ShoppingBag, User, List, X, CaretDown, CaretRight } from '@phosphor-icons/react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Record<string, boolean>>({});
  
  const desktopMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  
  const { totalItems } = useCart();

  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinelEl);
    return () => {
      observer.unobserve(sentinelEl);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (desktopMenuCloseTimer.current) {
        clearTimeout(desktopMenuCloseTimer.current);
      }
    };
  }, []);

  const openDesktopDropdown = (title: string) => {
    if (desktopMenuCloseTimer.current) {
      clearTimeout(desktopMenuCloseTimer.current);
    }
    setOpenDesktopMenu(title);
  };

  const closeDesktopDropdown = () => {
    if (desktopMenuCloseTimer.current) {
      clearTimeout(desktopMenuCloseTimer.current);
    }
    desktopMenuCloseTimer.current = setTimeout(() => {
      setOpenDesktopMenu(null);
    }, 650);
  };

  const toggleMobileMenu = (title: string) => {
    setExpandedMobileMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      {/* Sentinel element to trigger sticky header via IntersectionObserver */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-1" aria-hidden="true" />
      
      <header className={cn("w-full transition-all duration-300", isScrolled ? "fixed top-0 left-0 z-[100] bg-white shadow-md" : "relative bg-white z-[100]")}>
        {/* Main Header Row */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 cursor-pointer rounded-sm hover:text-brand transition-colors active:scale-[0.98]">
              <List weight="bold" className="w-6 h-6" />
            </button>
            <Link href="/" className="inline-block relative z-[120]" aria-label="Về trang chủ" onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(false); setOpenDesktopMenu(null); }}>
              <Image
                src="https://cdn.hstatic.net/themes/1000312752/1001500748/14/logo.png?v=165"
                alt="Li-Ning Logo"
                width={110}
                height={30}
                priority
                className="mobile-header-logo object-contain"
              />
            </Link>
          </div>

          {/* Desktop Logo */}
          <Link href="/" className="hidden lg:block shrink-0 relative z-[120]" aria-label="Về trang chủ" onClick={() => setOpenDesktopMenu(null)}>
            <Image
              src="https://cdn.hstatic.net/themes/1000312752/1001500748/14/logo.png?v=165"
              alt="Li-Ning Logo"
              width={140}
              height={38}
              priority
              className="header-logo object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 h-full mx-8">
            <ul className="flex space-x-6 h-full">
              {mainNavigation.map((item) => {
                const isOpen = openDesktopMenu === item.title;
                const hasMegaMenu = item.children?.some((child: NavItem) => child.children && child.children.length > 0);

                return (
                  <li
                    key={item.title}
                    className="relative h-full flex items-center z-[110]"
                    onMouseEnter={() => item.children && openDesktopDropdown(item.title)}
                    onMouseLeave={closeDesktopDropdown}
                    onFocus={() => item.children && openDesktopDropdown(item.title)}
                    onBlur={closeDesktopDropdown}
                  >
                    <Link href={item.href} onClick={() => setOpenDesktopMenu(null)} className="text-[#111111] hover:text-brand font-medium text-[15px] uppercase flex items-center gap-1">
                      {item.title}
                      {item.children && (
                        <CaretDown weight="bold" className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
                      )}
                    </Link>

                    {/* Desktop Dropdowns */}
                    {item.children && (
                      hasMegaMenu ? (
                        /* Multi-column Mega Menu (NAM, NỮ) */
                        <div
                          className={cn(
                            "absolute top-[calc(100%-1px)] left-1/2 -translate-x-1/2 bg-white shadow-xl border-t-2 border-brand transition-all duration-200 w-[850px] max-w-[90vw] p-6 z-[200] rounded-b-sm",
                            isOpen ? "opacity-100 visible pointer-events-auto mt-0" : "opacity-0 invisible pointer-events-none -mt-1"
                          )}
                          onMouseEnter={() => openDesktopDropdown(item.title)}
                          onMouseLeave={closeDesktopDropdown}
                        >
                          <div className="absolute -top-6 left-0 right-0 h-6" aria-hidden="true" />
                          <div className="grid grid-cols-5 gap-6">
                            {item.children.map((child, idx) => (
                              <div key={idx} className="flex flex-col">
                                <Link href={child.href} onClick={() => setOpenDesktopMenu(null)} className="font-bold text-[#111111] mb-2.5 hover:text-brand uppercase text-sm border-b pb-1 rounded-sm">
                                  {child.title}
                                </Link>
                                {child.children && (
                                  <ul className="flex flex-col space-y-1.5">
                                    {child.children.map((subChild, subIdx) => (
                                      <li key={subIdx}>
                                        <Link href={subChild.href} onClick={() => setOpenDesktopMenu(null)} className="text-gray-600 hover:text-brand text-xs transition-colors block py-0.5 rounded-sm">
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
                        /* Single-column Dropdown */
                        <div
                          className={cn(
                            "absolute top-[calc(100%-1px)] left-0 bg-white shadow-lg border-t-2 border-brand transition-all duration-200 min-w-[210px] py-2 z-[200] rounded-b-sm",
                            isOpen ? "opacity-100 visible pointer-events-auto mt-0" : "opacity-0 invisible pointer-events-none -mt-1"
                          )}
                          onMouseEnter={() => openDesktopDropdown(item.title)}
                          onMouseLeave={closeDesktopDropdown}
                        >
                          <div className="absolute -top-6 left-0 right-0 h-6" aria-hidden="true" />
                          <ul className="flex flex-col">
                            {item.children.map((child, idx) => (
                              <li key={idx}>
                                <Link
                                  href={child.href}
                                  onClick={() => setOpenDesktopMenu(null)}
                                  className="block px-4 py-2.5 text-sm text-gray-700 hover:text-brand hover:bg-gray-50 uppercase font-medium transition-colors border-b border-gray-50 last:border-0 rounded-sm"
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
                );
              })}
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-1 text-gray-700 hover:text-brand rounded-sm active:scale-[0.98] transition-transform">
              <MagnifyingGlass weight="bold" className="w-6 h-6" />
            </button>
            <Link href="/account/login" className="hidden lg:block p-1 text-gray-700 hover:text-brand rounded-sm active:scale-[0.98] transition-transform">
              <User weight="bold" className="w-6 h-6" />
            </Link>
            <Link href="/cart" className="relative p-1 text-gray-700 hover:text-brand rounded-sm active:scale-[0.98] transition-transform">
              <ShoppingBag weight="bold" className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-sm flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Overlay */}
        <div className={cn("absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 overflow-hidden z-40 rounded-b-sm", isSearchOpen ? "max-h-24 py-4 border-t" : "max-h-0")}>
          <div className="container mx-auto px-4 relative">
            <form action="/search" method="GET" className="relative max-w-2xl mx-auto">
              <input type="text" name="q" placeholder="Tìm kiếm sản phẩm..." className="w-full h-12 pl-4 pr-12 border border-gray-300 rounded-sm focus:outline-none focus:border-brand" />
              <button type="submit" className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-gray-500 hover:text-brand rounded-sm active:scale-[0.98] transition-transform">
                <MagnifyingGlass weight="bold" className="w-5 h-5" />
              </button>
            </form>
            <button onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand lg:hidden rounded-sm active:scale-[0.98] transition-transform">
              <X weight="bold" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-xl flex flex-col rounded-r-sm">
              <div className="p-4 border-b flex items-center justify-between bg-gray-bg">
                <span className="font-bold text-lg">MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="rounded-sm hover:text-brand active:scale-[0.98] transition-transform">
                  <X weight="bold" className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                <ul className="flex flex-col">
                  {mainNavigation.map((item) => (
                    <li key={item.title} className="border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between px-4 py-3">
                        <Link href={item.href} className="flex-1 font-medium text-[#111111] hover:text-brand rounded-sm" onClick={() => setIsMobileMenuOpen(false)}>
                          {item.title}
                        </Link>
                        {item.children && (
                          <button className="p-2 -mr-2 rounded-sm active:scale-[0.98] transition-transform" onClick={() => toggleMobileMenu(item.title)}>
                            {expandedMobileMenus[item.title] ? (
                              <CaretDown weight="bold" className="w-5 h-5 text-gray-500 hover:text-brand" />
                            ) : (
                              <CaretRight weight="bold" className="w-5 h-5 text-gray-500 hover:text-brand" />
                            )}
                          </button>
                        )}
                      </div>
                      {item.children && expandedMobileMenus[item.title] && (
                        <ul className="bg-gray-bg pb-2">
                          {item.children.map((child, idx) => (
                            <li key={idx}>
                              <div className="flex items-center justify-between pl-8 pr-4 py-2 border-t border-gray-200">
                                <Link href={child.href} className="flex-1 text-sm text-gray-800 hover:text-brand rounded-sm" onClick={() => setIsMobileMenuOpen(false)}>
                                  {child.title}
                                </Link>
                                {child.children && (
                                  <button className="p-1 -mr-1 rounded-sm active:scale-[0.98] transition-transform" onClick={() => toggleMobileMenu(child.title)}>
                                    {expandedMobileMenus[child.title] ? (
                                      <CaretDown weight="bold" className="w-4 h-4 text-gray-500 hover:text-brand" />
                                    ) : (
                                      <CaretRight weight="bold" className="w-4 h-4 text-gray-500 hover:text-brand" />
                                    )}
                                  </button>
                                )}
                              </div>
                              {child.children && expandedMobileMenus[child.title] && (
                                <ul className="bg-gray-100 pb-2">
                                  {child.children.map((subChild, subIdx) => (
                                    <li key={subIdx}>
                                      <Link href={subChild.href} className="block pl-12 pr-4 py-2 text-sm text-gray-600 hover:text-brand rounded-sm" onClick={() => setIsMobileMenuOpen(false)}>
                                        {subChild.title}
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
              <div className="p-4 border-t bg-gray-bg">
                <Link href="/account/login" className="flex items-center gap-2 text-[#111111] font-medium hover:text-brand rounded-sm" onClick={() => setIsMobileMenuOpen(false)}>
                  <User weight="bold" className="w-5 h-5" />
                  Đăng nhập / Đăng ký
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
