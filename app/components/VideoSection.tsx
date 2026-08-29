'use client';

import React from 'react';
import ScrollAnimate from './ScrollAnimate';

interface VideoSectionProps {
  videoId: string;
}

export default function VideoSection({ videoId }: VideoSectionProps) {
  if (!videoId) return null;

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <ScrollAnimate animation="fade-up" duration={600}>
          <h2 className="text-2xl md:text-3xl font-bold text-center uppercase mb-8 text-[#111111]">
            Video nổi bật
          </h2>
        </ScrollAnimate>
        <ScrollAnimate animation="zoom-in" delay={150} duration={700}>
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full overflow-hidden pt-[56.25%] rounded-lg shadow-xl bg-black transition-transform duration-500 hover:scale-[1.01]">
              <iframe
                className="absolute top-0 left-0 w-full h-full border-0"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
}
