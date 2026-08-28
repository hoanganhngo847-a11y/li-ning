'use client';

import React from 'react';

export default function SocialFloating() {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
      {/* Zalo */}
      <a href="#" className="w-10 h-10 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Zalo">
        <span className="font-bold text-[10px]">Zalo</span>
      </a>
      
      {/* Messenger */}
      <a href="#" className="w-10 h-10 rounded-full bg-[#0084FF] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Messenger">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.26c0 2.923 1.488 5.485 3.792 7.127.18.127.3.327.316.549l.115 1.745c.032.483.565.753.974.49l2.062-1.326a1.002 1.002 0 01.884-.114 10.63 10.63 0 002.857.39c5.523 0 10-4.145 10-9.26C22 6.145 17.523 2 12 2zm1.093 11.536l-2.455-2.617a1.042 1.042 0 00-1.472-.057L5.85 13.91c-.496.442.221 1.206.822.812l2.67-1.742a1.042 1.042 0 011.272.091l2.42 2.58a1.043 1.043 0 001.483.045l3.39-3.136c.485-.449-.244-1.204-.836-.8l-2.98 1.776z"/></svg>
      </a>

      {/* Phone */}
      <a href="tel:1900633083" className="w-10 h-10 rounded-full bg-[#f30d29] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Hotline">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      </a>

      {/* TikTok */}
      <a href="#" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="TikTok">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
      </a>
      
      {/* Instagram */}
      <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Instagram">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth={2}/><path strokeWidth={2} d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth={2}/></svg>
      </a>

      {/* YouTube */}
      <a href="#" className="w-10 h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="YouTube">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      </a>
    </div>
  );
}
