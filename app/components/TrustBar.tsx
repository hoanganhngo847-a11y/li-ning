'use client';

import React from 'react';
import ScrollAnimate from './ScrollAnimate';

export default function TrustBar() {
  const trustItems = [
    {
      icon: <svg className="w-8 h-8 text-[#f30d29]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      text: "100% Hàng chính hãng"
    },
    {
      icon: <svg className="w-8 h-8 text-[#f30d29]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
      text: "Đổi trả linh hoạt"
    },
    {
      icon: <svg className="w-8 h-8 text-[#f30d29]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      text: "Giao hàng toàn quốc"
    },
    {
      icon: <svg className="w-8 h-8 text-[#f30d29]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
      text: "Hotline: 1900633083"
    }
  ];

  return (
    <div className="bg-[#f7f7f7] border-t border-gray-200 py-6 md:py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <ScrollAnimate key={index} animation="fade-up" delay={index * 120} duration={500}>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {item.text}
                </span>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </div>
  );
}
