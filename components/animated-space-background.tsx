"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedSpaceBackgroundProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  interactive?: boolean
}

// 定义星星类型接口
interface Star {
  width: number
  height: number
  left: number
  top: number
  opacity: number
  animOpacity1: number
  animOpacity2: number
  animOpacity3: number
  duration: number
  delay: number
}

interface ShootingStar {
  width: number
  startX: number
  startY: number
  angle: number
  duration: number
  repeatDelay: number
}

interface Stars {
  small: Star[]
  medium: Star[]
  large: Star[]
  shooting: ShootingStar[]
}

export function AnimatedSpaceBackground({
  className,
  intensity = 'medium',
  interactive = true
}: AnimatedSpaceBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [stars, setStars] = useState<Stars | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  // 设置星星数量基于强度
  const getStarCount = () => {
    switch (intensity) {
      case 'low': return { small: 80, medium: 40, large: 15, shooting: 3 }
      case 'high': return { small: 200, medium: 100, large: 40, shooting: 8 }
      default: return { small: 150, medium: 70, large: 25, shooting: 5 }
    }
  }
  
  const starCount = getStarCount()
  
  // 使用简单的伪随机数生成器，使服务器和客户端生成相同的值
  const pseudoRandom = (seed: number) => {
    return ((seed * 9301 + 49297) % 233280) / 233280;
  };
  
  // 生成星星的函数
  const generateSeededStars = (): Stars => {
    const newStars: Stars = {
      small: [],
      medium: [],
      large: [],
      shooting: []
    };
    
    // 为每种类型的星星生成固定数据
    for (let i = 0; i < starCount.small; i++) {
      const seed = i * 1000;
      newStars.small.push({
        width: 0.5 + pseudoRandom(seed) * 1,
        height: 0.5 + pseudoRandom(seed + 1) * 1,
        left: pseudoRandom(seed + 2) * 100,
        top: pseudoRandom(seed + 3) * 100,
        opacity: 0.1 + pseudoRandom(seed + 4) * 0.5,
        animOpacity1: 0.1 + pseudoRandom(seed + 5) * 0.5,
        animOpacity2: 0.5 + pseudoRandom(seed + 6) * 0.5,
        animOpacity3: 0.1 + pseudoRandom(seed + 7) * 0.5,
        duration: 2 + pseudoRandom(seed + 8) * 3,
        delay: pseudoRandom(seed + 9) * 5
      });
    }
    
    for (let i = 0; i < starCount.medium; i++) {
      const seed = i * 2000;
      newStars.medium.push({
        width: 1.5 + pseudoRandom(seed) * 1,
        height: 1.5 + pseudoRandom(seed + 1) * 1,
        left: pseudoRandom(seed + 2) * 100,
        top: pseudoRandom(seed + 3) * 100,
        opacity: 0.3 + pseudoRandom(seed + 4) * 0.4,
        animOpacity1: 0.3 + pseudoRandom(seed + 5) * 0.4,
        animOpacity2: 0.6 + pseudoRandom(seed + 6) * 0.4,
        animOpacity3: 0.3 + pseudoRandom(seed + 7) * 0.4,
        duration: 3 + pseudoRandom(seed + 8) * 4,
        delay: pseudoRandom(seed + 9) * 5
      });
    }
    
    for (let i = 0; i < starCount.large; i++) {
      const seed = i * 3000;
      newStars.large.push({
        width: 2 + pseudoRandom(seed) * 2,
        height: 2 + pseudoRandom(seed + 1) * 2,
        left: pseudoRandom(seed + 2) * 100,
        top: pseudoRandom(seed + 3) * 100,
        opacity: 0.5 + pseudoRandom(seed + 4) * 0.5,
        animOpacity1: 0.5 + pseudoRandom(seed + 5) * 0.5,
        animOpacity2: 0.8 + pseudoRandom(seed + 6) * 0.2,
        animOpacity3: 0.5 + pseudoRandom(seed + 7) * 0.5,
        duration: 4 + pseudoRandom(seed + 8) * 3,
        delay: pseudoRandom(seed + 9) * 5
      });
    }
    
    for (let i = 0; i < starCount.shooting; i++) {
      const seed = i * 4000;
      newStars.shooting.push({
        width: 50 + pseudoRandom(seed) * 150,
        startX: pseudoRandom(seed + 1) * 100,
        startY: pseudoRandom(seed + 2) * 30,
        angle: 30 + pseudoRandom(seed + 3) * 30,
        duration: 1 + pseudoRandom(seed + 4),
        repeatDelay: 10 + pseudoRandom(seed + 5) * 20
      });
    }
    
    return newStars;
  };
  
  // 使用useEffect确保星星数据只在客户端生成一次
  useEffect(() => {
    setIsClient(true)
    setStars(generateSeededStars())
  }, [intensity]) // 仅在强度改变时重新生成
  
  // 初始化和窗口调整大小
  useEffect(() => {
    if (!isClient) return;
    
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient])
  
  // 鼠标移动视差效果
  useEffect(() => {
    if (!isClient || !interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!parallaxRef.current || windowSize.width === 0) return;
      
      // 直接在事件处理程序中更新DOM，而不是通过状态更新
      const moveX = (e.clientX / windowSize.width - 0.5) * 20;
      const moveY = (e.clientY / windowSize.height - 0.5) * 20;
      
      parallaxRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isClient, interactive, windowSize]);

  // 如果不是客户端，或星星数据未准备好，渲染一个基础背景
  if (!isClient || !stars) {
    return (
      <div 
        ref={containerRef}
        className={cn(
          "fixed inset-0 overflow-hidden pointer-events-none z-[-1]",
          className
        )}
      >
        <div className="absolute inset-0 bg-background" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 overflow-hidden pointer-events-none z-[-1]",
        className
      )}
    >
      {/* 基础星空背景 */}
      <div className="absolute inset-0 bg-background" />
      
      {/* 星云效果 */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute w-[200%] h-[200%] left-[-50%] top-[-50%] opacity-20"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 150,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <div className="absolute left-[20%] top-[30%] w-[60%] h-[60%] rounded-full bg-gradient-radial from-primary/30 via-transparent to-transparent blur-3xl" />
          <div className="absolute left-[65%] top-[15%] w-[40%] h-[40%] rounded-full bg-gradient-radial from-secondary/20 via-transparent to-transparent blur-3xl" />
          <div className="absolute left-[25%] top-[60%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-accent/20 via-transparent to-transparent blur-3xl" />
        </motion.div>
      </div>
      
      {/* 视差星星层 */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 transition-transform duration-150 ease-out"
        style={{ willChange: 'transform' }}
      >
        {/* 小星星 */}
        {stars.small.map((star, i) => (
          <motion.div
            key={`small-star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width + "px",
              height: star.height + "px",
              left: star.left + "%",
              top: star.top + "%",
              opacity: star.opacity
            }}
            animate={{ 
              opacity: [
                star.animOpacity1, 
                star.animOpacity2, 
                star.animOpacity3
              ] 
            }}
            transition={{ 
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay
            }}
          />
        ))}
        
        {/* 中等星星 */}
        {stars.medium.map((star, i) => (
          <motion.div
            key={`medium-star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width + "px",
              height: star.height + "px",
              left: star.left + "%",
              top: star.top + "%",
              opacity: star.opacity,
              boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)'
            }}
            animate={{ 
              opacity: [
                star.animOpacity1, 
                star.animOpacity2, 
                star.animOpacity3
              ] 
            }}
            transition={{ 
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay
            }}
          />
        ))}
        
        {/* 大星星 */}
        {stars.large.map((star, i) => (
          <motion.div
            key={`large-star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width + "px",
              height: star.height + "px",
              left: star.left + "%",
              top: star.top + "%",
              opacity: star.opacity,
              boxShadow: '0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.3)'
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [
                star.animOpacity1, 
                star.animOpacity2, 
                star.animOpacity3
              ] 
            }}
            transition={{ 
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay
            }}
          />
        ))}
      </div>
      
      {/* 流星 */}
      {stars.shooting.map((star, i) => (
        <motion.div
          key={`shooting-star-${i}`}
          className="absolute h-[1px] rounded-full bg-gradient-to-r from-white via-white to-transparent"
          style={{
            width: star.width + "px",
            left: star.startX + "%",
            top: star.startY + "%",
            rotate: star.angle + "deg",
            opacity: 0
          }}
          animate={{
            opacity: [0, 1, 0],
            left: [star.startX + "%", (star.startX - 20) + "%"],
            top: [star.startY + "%", (star.startY + 20) + "%"]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatDelay: star.repeatDelay
          }}
        />
      ))}
    </div>
  )
} 