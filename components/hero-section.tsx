"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// 添加ScrollButton组件，带有增强的动画效果
interface ScrollButtonProps {
  text: string;
  sectionId: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
}

const ScrollButton = ({ text, sectionId, variant = "default" }: ScrollButtonProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 计算元素位置
      const offsetTop = element.offsetTop;
      
      // 添加动画效果，并偏移navbar高度
      window.scrollTo({
        top: offsetTop - 80,
        behavior: 'smooth'
      });
      
      // 添加视觉反馈
      element.classList.add('highlight-section');
      setTimeout(() => {
        element.classList.remove('highlight-section');
      }, 1500);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button 
        size="lg" 
        variant={variant}
        className={variant === "default" ? 
          "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30" : 
          "border-primary/50 text-primary hover:bg-primary/10"
        }
        onClick={() => scrollToSection(sectionId)}
      >
        {text}
      </Button>
    </motion.div>
  );
};

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // 优化平滑滚动到指定的section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 计算元素位置
      const offsetTop = element.offsetTop;
      
      // 添加动画效果，并偏移navbar高度
      window.scrollTo({
        top: offsetTop - 80,
        behavior: 'smooth'
      });
      
      // 添加视觉反馈
      element.classList.add('highlight-section');
      setTimeout(() => {
        element.classList.remove('highlight-section');
      }, 1500);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      const xPos = (clientX / innerWidth - 0.5) * 20
      const yPos = (clientY / innerHeight - 0.5) * 20

      const elements = containerRef.current?.querySelectorAll(".parallax")
      elements?.forEach((el) => {
        const htmlEl = el as HTMLElement
        const speed = Number.parseFloat(htmlEl.dataset.speed || "1")
        htmlEl.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              探索宇宙
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient glow parallax"
            data-speed="0.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            探索宇宙
          </motion.h1>

          <motion.p
            className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto parallax"
            data-speed="0.8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            踏上探索宇宙的旅程，发现遥远的世界，并通过互动体验揭开宇宙的神秘面纱。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* 使用新的ScrollButton组件替换原有按钮 */}
            <ScrollButton text="开始探索" sectionId="visualization" />
            <ScrollButton text="查看任务" sectionId="missions" variant="outline" />
          </motion.div>
        </div>
      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
        onClick={() => scrollToSection('visualization')}
        whileHover={{ y: 5 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ 
          y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 400, damping: 10 }
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="scroll-indicator"
        >
          <ArrowDown className="text-primary h-8 w-8" />
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl parallax"
        data-speed="1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl parallax"
        data-speed="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
    </div>
  )
}

