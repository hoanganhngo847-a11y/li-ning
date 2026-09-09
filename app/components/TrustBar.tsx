'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowsClockwise, Truck, Headset } from '@phosphor-icons/react';

export default function TrustBar() {
  const trustItems = [
    {
      icon: <ShieldCheck size={28} weight="regular" className="text-brand" />,
      text: "100% Hàng chính hãng"
    },
    {
      icon: <ArrowsClockwise size={28} weight="regular" className="text-brand" />,
      text: "Đổi trả linh hoạt"
    },
    {
      icon: <Truck size={28} weight="regular" className="text-brand" />,
      text: "Giao hàng toàn quốc"
    },
    {
      icon: <Headset size={28} weight="regular" className="text-brand" />,
      text: "Hotline: 1900633083"
    }
  ];

  return (
    <div className="bg-gray-bg border-t border-gray-border py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {trustItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col items-center text-center gap-3 px-4 ${
                index !== trustItems.length - 1 ? 'md:border-r border-gray-border' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
