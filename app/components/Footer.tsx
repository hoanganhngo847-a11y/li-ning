'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';
import { FacebookLogo, YoutubeLogo, InstagramLogo, TiktokLogo, CaretDown } from '@phosphor-icons/react';

export default function Footer() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter submission logic here
  };

  return (
    <footer className="bg-zinc-950 text-gray-300 pt-12 pb-20 md:pb-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1 - VỀ LI-NING VIETNAM */}
          <div className="footer-col">
            <h4 
              className="text-white font-bold uppercase mb-4 flex justify-between items-center cursor-pointer lg:cursor-default lg:mb-6"
              onClick={() => toggleSection('col1')}
            >
              Về Li-Ning Vietnam
              <CaretDown 
                weight="bold"
                className={cn("w-5 h-5 lg:hidden transition-transform", expandedSection === 'col1' ? "rotate-180" : "")} 
              />
            </h4>
            <div className={cn("flex flex-col gap-3 text-sm lg:flex lg:h-auto overflow-hidden transition-all duration-300", expandedSection === 'col1' ? "max-h-96 pb-4" : "max-h-0 lg:max-h-96")}>
              <p>Công ty TNHH Quốc tế Hải Long</p>
              <p>MST: 0106129772</p>
              <p>Địa chỉ: CH2.2, Tầng 2, Tòa Handiresco, 31 Lê Văn Lương, P. Nhân Chính, Q. Thanh Xuân, TP. Hà Nội</p>
              <div className="mt-4">
                <Image 
                  src="https://cdn.hstatic.net/themes/1000312752/1001500748/14/logo-bct.png?v=165" 
                  alt="Bộ Công Thương" 
                  width={130}
                  height={40}
                  className="h-10 w-auto object-contain rounded-sm" 
                />
              </div>
            </div>
          </div>

          {/* Column 2 - HỖ TRỢ KHÁCH HÀNG */}
          <div className="footer-col">
            <h4 
              className="text-white font-bold uppercase mb-4 flex justify-between items-center cursor-pointer lg:cursor-default lg:mb-6"
              onClick={() => toggleSection('col2')}
            >
              Hỗ trợ khách hàng
              <CaretDown 
                weight="bold"
                className={cn("w-5 h-5 lg:hidden transition-transform", expandedSection === 'col2' ? "rotate-180" : "")} 
              />
            </h4>
            <div className={cn("flex flex-col gap-2 text-sm lg:flex overflow-hidden transition-all duration-300", expandedSection === 'col2' ? "max-h-96 pb-4" : "max-h-0 lg:max-h-96")}>
              <Link href="/pages/huong-dan-mua-hang" className="hover:text-brand transition-colors">Hướng dẫn mua hàng</Link>
              <Link href="/pages/chinh-sach-thanh-toan" className="hover:text-brand transition-colors">Chính sách thanh toán</Link>
              <Link href="/pages/chinh-sach-van-chuyen" className="hover:text-brand transition-colors">Chính sách vận chuyển</Link>
              <Link href="/pages/chinh-sach-doi-tra" className="hover:text-brand transition-colors">Chính sách đổi trả</Link>
              <Link href="/pages/chinh-sach-bao-hanh" className="hover:text-brand transition-colors">Chính sách bảo hành</Link>
              <Link href="/pages/huong-dan-chon-size" className="hover:text-brand transition-colors">Hướng dẫn chọn size</Link>
            </div>
          </div>

          {/* Column 3 - VỀ CHÚNG TÔI */}
          <div className="footer-col">
            <h4 
              className="text-white font-bold uppercase mb-4 flex justify-between items-center cursor-pointer lg:cursor-default lg:mb-6"
              onClick={() => toggleSection('col3')}
            >
              Về chúng tôi
              <CaretDown 
                weight="bold"
                className={cn("w-5 h-5 lg:hidden transition-transform", expandedSection === 'col3' ? "rotate-180" : "")} 
              />
            </h4>
            <div className={cn("flex flex-col gap-2 text-sm lg:flex overflow-hidden transition-all duration-300", expandedSection === 'col3' ? "max-h-96 pb-4" : "max-h-0 lg:max-h-96")}>
              <Link href="/pages/gioi-thieu" className="hover:text-brand transition-colors">Giới thiệu</Link>
              <Link href="/pages/he-thong-cua-hang" className="hover:text-brand transition-colors">Hệ thống cửa hàng</Link>
              <Link href="/blogs/tin-tuc-su-kien" className="hover:text-brand transition-colors">Tin tức Sự kiện</Link>
              <Link href="/pages/lien-he" className="hover:text-brand transition-colors">Liên hệ</Link>
            </div>
          </div>

          {/* Column 4 - KẾT NỐI VỚI CHÚNG TÔI */}
          <div className="footer-col">
            <h4 
              className="text-white font-bold uppercase mb-4 flex justify-between items-center cursor-pointer lg:cursor-default lg:mb-6"
              onClick={() => toggleSection('col4')}
            >
              Kết nối với chúng tôi
              <CaretDown 
                weight="bold"
                className={cn("w-5 h-5 lg:hidden transition-transform", expandedSection === 'col4' ? "rotate-180" : "")} 
              />
            </h4>
            <div className={cn("flex flex-col gap-4 text-sm lg:flex overflow-hidden transition-all duration-300", expandedSection === 'col4' ? "max-h-96 pb-4" : "max-h-0 lg:max-h-96")}>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 rounded-sm bg-gray-800 flex items-center justify-center hover:bg-brand transition-colors">
                  <FacebookLogo weight="bold" className="w-4 h-4 text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-sm bg-gray-800 flex items-center justify-center hover:bg-brand transition-colors">
                  <YoutubeLogo weight="bold" className="w-4 h-4 text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-sm bg-gray-800 flex items-center justify-center hover:bg-brand transition-colors">
                  <InstagramLogo weight="bold" className="w-4 h-4 text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-sm bg-gray-800 flex items-center justify-center hover:bg-brand transition-colors">
                  <TiktokLogo weight="bold" className="w-4 h-4 text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-sm bg-gray-800 flex items-center justify-center hover:bg-brand transition-colors">
                  <span className="text-white text-[10px] font-bold">Zalo</span>
                </a>
              </div>
              
              <div className="mt-2">
                <p className="mb-2 font-medium">Đăng ký nhận tin</p>
                <form className="flex" onSubmit={handleNewsletterSubmit}>
                  <input type="email" placeholder="Nhập email của bạn..." className="flex-1 px-3 py-2 text-black text-sm focus:outline-none rounded-sm rounded-r-none" required />
                  <button type="submit" className="bg-brand text-white px-4 py-2 font-medium text-sm hover:bg-red-700 transition-colors rounded-sm rounded-l-none active:scale-[0.98]">Đăng ký</button>
                </form>
              </div>

              <div className="mt-2 text-gray-400 text-xs">
                Chấp nhận thanh toán: COD, VNPAY, ATM, Visa, MasterCard
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Li-Ning Sport Vietnam. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
