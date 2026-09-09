'use client';

import React from 'react';
import { motion, useReducedMotion, type Variant } from 'motion/react';

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

const animationVariants: Record<AnimationType, { hidden: Variant; visible: Variant }> = {
  'fade-up': {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-left': {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-right': {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  'zoom-in': {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
  'fade': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export default function ScrollAnimate({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.3,
  className = '',
  once = true,
}: ScrollAnimateProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = animationVariants[animation];
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  animation?: AnimationType;
  staggerDelay?: number; // ms between each child
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export function StaggerChildren({
  children,
  animation = 'fade-up',
  staggerDelay = 80,
  duration = 500,
  className = '',
  threshold = 0.3,
  once = true,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();
  const childArray = React.Children.toArray(children);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay / 1000,
      },
    },
  };

  const itemVariants = animationVariants[animation];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
    >
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          transition={{
            duration: duration / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
