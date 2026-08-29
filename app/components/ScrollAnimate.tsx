'use client';

import React, { useEffect, useRef, useState } from 'react';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade';

interface ScrollAnimateProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number; // ms
  duration?: number; // ms
  threshold?: number; // 0-1
  className?: string;
  once?: boolean; // only animate once
}

const animationStyles: Record<AnimationType, { from: React.CSSProperties; to: React.CSSProperties }> = {
  'fade-up': {
    from: { opacity: 0, transform: 'translateY(60px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    from: { opacity: 0, transform: 'translateY(-60px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-left': {
    from: { opacity: 0, transform: 'translateX(-60px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    from: { opacity: 0, transform: 'translateX(60px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  'zoom-in': {
    from: { opacity: 0, transform: 'scale(0.85)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  'fade': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};

export default function ScrollAnimate({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.15,
  className = '',
  once = true,
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const anim = animationStyles[animation];
  const style: React.CSSProperties = {
    ...(isVisible ? anim.to : anim.from),
    transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

// Stagger wrapper: each child gets an increasing delay
interface StaggerProps {
  children: React.ReactNode;
  animation?: AnimationType;
  staggerDelay?: number; // ms between each child
  duration?: number;
  className?: string;
}

export function StaggerChildren({
  children,
  animation = 'fade-up',
  staggerDelay = 80,
  duration = 500,
  className = '',
}: StaggerProps) {
  const childArray = React.Children.toArray(children);

  return (
    <>
      {childArray.map((child, index) => (
        <ScrollAnimate
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          duration={duration}
          className={className}
        >
          {child}
        </ScrollAnimate>
      ))}
    </>
  );
}
