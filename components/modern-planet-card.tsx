"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface PlanetDataProps {
  name: string
  value: string
  className?: string
  icon?: React.ReactNode
}

export function PlanetDataItem({ name, value, className, icon }: PlanetDataProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-xs font-medium text-foreground/60">{name}</p>
      </div>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}

interface PlanetTagProps {
  children: React.ReactNode
  className?: string
}

export function PlanetTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary-foreground border border-primary/30">
      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1"></span>
      {children}
    </div>
  )
}

interface PlanetCardProps {
  planet: {
    name: string
    chineseName: string
    type: string
    description: string
    distance: string
    diameter: string
    temperature: string
    atmosphere: string
    gravity: string
    orbitalPeriod: string
    discovered: string
  }
  isDetailed?: boolean
  className?: string
}

export function ModernPlanetCard({ planet, isDetailed = false, className }: PlanetCardProps) {
  return (
    <Card className={cn("backdrop-blur-md bg-black/30 border-white/10 overflow-hidden relative", className)}>
      {/* 背景装饰效果 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-primary/10 to-transparent opacity-40 rounded-full -translate-y-20 translate-x-20 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-radial from-secondary/10 to-transparent opacity-30 rounded-full translate-y-20 -translate-x-20 z-0 pointer-events-none" />
      
      <CardContent className="p-6 relative z-10">
        <motion.h3 
          className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {planet.chineseName}
        </motion.h3>
        
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <PlanetTag>{planet.type}</PlanetTag>
        </motion.div>
        
        <motion.p 
          className="text-foreground/80 my-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {planet.description}
        </motion.p>

        <motion.div 
          className="grid grid-cols-2 gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PlanetDataItem 
            name="距离地球" 
            value={planet.distance} 
            icon={<div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />}
          />
          <PlanetDataItem 
            name="直径" 
            value={planet.diameter}
            icon={<div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500" />}
          />
          <PlanetDataItem 
            name="表面温度" 
            value={planet.temperature}
            className="col-span-2"
            icon={<div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-orange-500" />}
          />
        </motion.div>

        <AnimatePresence>
          {isDetailed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 space-y-4 overflow-hidden"
            >
              <div className="relative">
                <h4 className="text-xl font-semibold mb-3 text-foreground/90 inline-block">
                  探索详情
                </h4>
                <div className="absolute h-0.5 w-20 bg-gradient-to-r from-primary/50 to-transparent -bottom-0.5 left-0" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <PlanetDataItem 
                  name="发现时间" 
                  value={planet.discovered}
                  icon={<div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />}
                />
                <PlanetDataItem 
                  name="轨道周期" 
                  value={planet.orbitalPeriod}
                  icon={<div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-500" />}
                />
                <PlanetDataItem 
                  name="重力" 
                  value={planet.gravity}
                  icon={<div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500" />}
                />
                <PlanetDataItem 
                  name="大气层" 
                  value={planet.atmosphere}
                  icon={<div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />}
                />
              </div>
                
              <div className="space-y-3 text-sm text-foreground/70">
                <p className="relative pl-4">
                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {planet.chineseName}是通过先进的光谱分析和凌日法发现的，天文学家通过观测恒星亮度的微小变化来探测行星经过恒星前方时的现象。
                </p>
                <p className="relative pl-4">
                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-secondary/50" />
                  目前的研究重点是分析其大气成分中的生物标记物，并了解其地质活动。未来的任务旨在捕获更高分辨率的图像，并可能部署专门的探测器来研究其独特的环境。
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
} 