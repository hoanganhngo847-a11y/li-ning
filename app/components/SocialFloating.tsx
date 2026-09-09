'use client';

import React from 'react';
import { ChatCircle, MessengerLogo, Phone } from '@phosphor-icons/react';

export default function SocialFloating() {
  return (
    <div className="fixed right-4 bottom-24 z-40 hidden md:flex flex-col gap-3">
      {/* Zalo */}
      <a href="#" className="w-11 h-11 rounded-sm bg-zinc-800 text-white flex items-center justify-center shadow-lg hover:bg-brand hover:scale-105 active:scale-[0.98] transition-all" title="Zalo">
        <ChatCircle weight="regular" className="w-5 h-5" />
      </a>
      
      {/* Messenger */}
      <a href="#" className="w-11 h-11 rounded-sm bg-zinc-800 text-white flex items-center justify-center shadow-lg hover:bg-brand hover:scale-105 active:scale-[0.98] transition-all" title="Messenger">
        <MessengerLogo weight="regular" className="w-5 h-5" />
      </a>

      {/* Phone */}
      <a href="tel:1900633083" className="w-11 h-11 rounded-sm bg-zinc-800 text-white flex items-center justify-center shadow-lg hover:bg-brand hover:scale-105 active:scale-[0.98] transition-all" title="Hotline">
        <Phone weight="regular" className="w-5 h-5" />
      </a>
    </div>
  );
}
