"use client"

import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EnhancedStarsBackgroundProps {
  starCount?: number
  minRadius?: number
  maxRadius?: number
  shootingStars?: boolean
  nebula?: boolean
  className?: string
}

export function EnhancedStarsBackground({
  starCount = 100,
  minRadius = 0.5,
  maxRadius = 2,
  shootingStars = true,
  nebula = true,
  className
}: EnhancedStarsBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // 清除现有星星
    container.querySelectorAll('.star-element').forEach(el => el.remove());
    
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    
    // 创建普通星星
    for (let i = 0; i < starCount; i++) {
      createStar(container, width, height, minRadius, maxRadius);
    }
    
    // 创建大型亮星
    for (let i = 0; i < Math.floor(starCount / 20); i++) {
      createLargeStar(container, width, height, maxRadius * 1.5);
    }
    
    // 创建脉冲星
    for (let i = 0; i < Math.floor(starCount / 30); i++) {
      createPulsar(container, width, height);
    }
    
    // 创建流星
    if (shootingStars) {
      for (let i = 0; i < Math.floor(starCount / 15); i++) {
        createShootingStar(container, width, height);
      }
    }
  }, [starCount, minRadius, maxRadius, shootingStars]);
  
  return (
    <div 
      ref={containerRef} 
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ zIndex: -1 }}
    >
      {nebula && (
        <motion.div 
          className="absolute inset-0 opacity-50"
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" 
               style={{ top: '20%', left: '30%', width: '60%', height: '60%' }} />
          <div className="absolute inset-0 bg-gradient-radial from-secondary/5 via-transparent to-transparent" 
               style={{ top: '40%', left: '10%', width: '50%', height: '50%' }} />
          <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent" 
               style={{ top: '10%', left: '60%', width: '40%', height: '40%' }} />
        </motion.div>
      )}
    </div>
  );
}

// 创建普通星星
function createStar(container: HTMLElement, width: number, height: number, minRadius: number, maxRadius: number) {
  const star = document.createElement('div');
  star.classList.add('star', 'star-element');
  
  const size = minRadius + Math.random() * (maxRadius - minRadius);
  const opacity = 0.4 + Math.random() * 0.6;
  const duration = 3 + Math.random() * 7;
  
  star.style.setProperty('--opacity', opacity.toString());
  star.style.setProperty('--duration', `${duration}s`);
  
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.left = `${Math.random() * width}px`;
  star.style.top = `${Math.random() * height}px`;
  
  container.appendChild(star);
}

// 创建大型亮星
function createLargeStar(container: HTMLElement, width: number, height: number, size: number) {
  const star = document.createElement('div');
  star.classList.add('star', 'large-star', 'star-element');
  
  const starSize = size + Math.random() * size;
  const opacity = 0.7 + Math.random() * 0.3;
  
  star.style.setProperty('--opacity', opacity.toString());
  star.style.width = `${starSize}px`;
  star.style.height = `${starSize}px`;
  star.style.left = `${Math.random() * width}px`;
  star.style.top = `${Math.random() * height}px`;
  
  container.appendChild(star);
}

// 创建脉冲星
function createPulsar(container: HTMLElement, width: number, height: number) {
  const pulsar = document.createElement('div');
  pulsar.classList.add('pulsar', 'star-element');
  
  pulsar.style.left = `${Math.random() * width}px`;
  pulsar.style.top = `${Math.random() * height}px`;
  
  container.appendChild(pulsar);
}

// 创建流星
function createShootingStar(container: HTMLElement, width: number, height: number) {
  const star = document.createElement('div');
  star.classList.add('shooting-star', 'star-element');
  
  const angle = Math.random() * 60 - 30;
  const speed = 3 + Math.random() * 6;
  const delay = Math.random() * 15;
  
  star.style.setProperty('--angle', `${angle}deg`);
  star.style.setProperty('--speed', `${speed}s`);
  star.style.setProperty('--delay', `${delay}s`);
  
  star.style.left = `${Math.random() * width}px`;
  star.style.top = `${Math.random() * (height / 2)}px`;
  
  container.appendChild(star);
} 