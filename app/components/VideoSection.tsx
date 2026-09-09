'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Play } from '@phosphor-icons/react';

interface VideoSectionProps {
  videoId: string;
  title?: string;
  description?: string;
}

export default function VideoSection({ videoId, title, description }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) return null;

  return (
    <section className="py-12 bg-white overflow-hidden w-full">
      <div className="container mx-auto px-4">
        {(title || description || !title) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold uppercase text-dark mb-2">
              {title || "Video nổi bật"}
            </h2>
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto w-full"
        >
          <div className="relative w-full overflow-hidden pt-[56.25%] rounded-sm shadow-xl bg-black">
            {!isPlaying ? (
              <div 
                className="absolute inset-0 w-full h-full cursor-pointer group"
                onClick={() => setIsPlaying(true)}
              >
                <Image
                  src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                  alt="Video thumbnail"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-brand text-white rounded-full flex items-center justify-center active:scale-[0.98] transition-transform shadow-lg">
                    <Play size={32} weight="fill" className="ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                className="absolute top-0 left-0 w-full h-full border-0"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
