"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Info, Rotate3d } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlanetVisual, mapNameToPlanetType } from "@/components/planet-visual"
import { ModernPlanetCard } from "@/components/modern-planet-card"
import { PlanetControlPanel } from "@/components/planet-control-panel"
import { EnhancedStarsBackground } from "@/components/enhanced-stars-background"
import { cn } from "@/lib/utils"
import { Planet3DView } from "@/components/planet-3d-view"

const planets = [
  {
    id: 1,
    name: "Proxima Centauri b",
    chineseName: "比邻星b",
    type: "岩质系外行星",
    description:
      "最接近我们太阳系的系外行星，位于比邻星的宜居带内。科学家认为它可能拥有适合生命存在的条件，表面可能存在液态水。",
    distance: "4.2光年",
    diameter: "1.08 × 地球",
    temperature: "-39°C 至 30°C",
    atmosphere: "可能有大气层，成分未知",
    gravity: "约1.1 × 地球",
    orbitalPeriod: "11.2地球日",
    discovered: "2016年"
  },
  {
    id: 2,
    name: "Kepler-186f",
    chineseName: "开普勒-186f",
    type: "类地行星",
    description:
      "首个在其他恒星宜居带中发现的地球大小的行星，可能存在液态水。位于天鹅座方向约582光年处，围绕一颗比太阳更冷更暗的红矮星运行。",
    distance: "582光年",
    diameter: "1.17 × 地球",
    temperature: "-85°C 至 5°C",
    atmosphere: "未知，可能存在",
    gravity: "约1.2 × 地球",
    orbitalPeriod: "129.9地球日",
    discovered: "2014年"
  },
  {
    id: 3,
    name: "TRAPPIST-1e",
    chineseName: "特拉帕斯-1e",
    type: "温和行星",
    description:
      "七行星系统中的一员，是寻找地球以外生命迹象最有希望的世界之一。特拉帕斯-1是一个紧凑的系统，其所有行星的轨道都比水星到太阳的距离更近。",
    distance: "39光年",
    diameter: "0.92 × 地球",
    temperature: "-50°C 至 10°C",
    atmosphere: "可能有稠密大气层",
    gravity: "约0.9 × 地球",
    orbitalPeriod: "6.1地球日",
    discovered: "2017年"
  },
  {
    id: 4,
    name: "K2-18b",
    chineseName: "K2-18b",
    type: "海王星型",
    description:
      "一颗令人兴奋的系外行星，因在其大气层中发现水而备受关注。这颗行星位于宜居带内，科学家认为它可能有液态水洋。",
    distance: "124光年",
    diameter: "2.6 × 地球",
    temperature: "-20°C 至 40°C",
    atmosphere: "含有氢、氦和水蒸气",
    gravity: "约2.3 × 地球",
    orbitalPeriod: "33地球日",
    discovered: "2015年"
  },
]

export function ModernPlanetShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const [viewMode, setViewMode] = useState<'normal' | '3d'>('normal')
  const [showAtmosphere, setShowAtmosphere] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(1)
  const [surfaceDetail, setSurfaceDetail] = useState(true)

  const currentPlanet = planets[currentIndex]

  // 当行星改变时重置详情状态
  useEffect(() => {
    setIsInfoVisible(false);
    // 简短延迟后显示选择器，创造平滑过渡效果
    const timer = setTimeout(() => setIsInfoVisible(true), 800);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const nextPlanet = () => {
    setDirection(1)
    
    // 添加切换行星时的视觉效果
    if (viewMode === '3d') {
      const event = new CustomEvent('planet-transition', { 
        detail: { direction: 'next' } 
      });
      window.dispatchEvent(event);
    }
    
    setCurrentIndex((prev) => (prev + 1) % planets.length)
  }

  const prevPlanet = () => {
    setDirection(-1)
    
    // 添加切换行星时的视觉效果
    if (viewMode === '3d') {
      const event = new CustomEvent('planet-transition', { 
        detail: { direction: 'prev' } 
      });
      window.dispatchEvent(event);
    }
    
    setCurrentIndex((prev) => (prev - 1 + planets.length) % planets.length)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  }

  // 处理大气层效果变化
  const handleAtmosphereChange = (checked: boolean) => {
    setShowAtmosphere(checked);
    setTimeout(() => {
      const event = new CustomEvent('atmosphere-toggled', { 
        detail: { showAtmosphere: checked } 
      });
      window.dispatchEvent(event);
    }, 10);
  };

  // 处理旋转速度变化
  const handleRotationSpeedChange = (value: number) => {
    setRotationSpeed(value);
    setTimeout(() => {
      const event = new CustomEvent('rotation-changed', { 
        detail: { rotationSpeed: value } 
      });
      window.dispatchEvent(event);
    }, 10);
  };

  return (
    <section id="planets" className="relative py-20 overflow-hidden">
      {/* 增强版星星背景 */}
      <EnhancedStarsBackground starCount={200} minRadius={0.5} maxRadius={2.5} shootingStars={true} nebula={true} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            行星发现
          </motion.h2>
          <motion.p
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            探索我们太阳系之外的非凡世界，每个世界都有独特的特征和潜在的发现机会。
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="order-2 md:order-1 space-y-6">
                <ModernPlanetCard 
                  planet={currentPlanet} 
                  isDetailed={isInfoVisible} 
                />
                
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary/10 backdrop-blur-sm"
                    onClick={() => setIsInfoVisible(!isInfoVisible)}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    {isInfoVisible ? "隐藏详情" : "更多详情"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-secondary/50 text-secondary hover:bg-secondary/10 backdrop-blur-sm"
                    onClick={() => setViewMode(viewMode === 'normal' ? '3d' : 'normal')}
                  >
                    <Rotate3d className="mr-2 h-4 w-4" />
                    {viewMode === 'normal' ? '3D视图' : '标准视图'}
                  </Button>
                </div>
                
                <PlanetControlPanel 
                  showAtmosphere={showAtmosphere}
                  onAtmosphereChange={handleAtmosphereChange}
                  rotationSpeed={rotationSpeed}
                  onRotationSpeedChange={handleRotationSpeedChange}
                  surfaceDetail={surfaceDetail}
                  onSurfaceDetailChange={setSurfaceDetail}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>

              <div className="order-1 md:order-2 flex justify-center">
                <div className={cn(
                  "relative p-8",
                  viewMode === '3d' ? 'transform-gpu three-planet-container' : ''
                )}>
                  {/* 光晕背景 - 仅在标准视图下显示 */}
                  {viewMode !== '3d' && (
                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/5 via-primary/2 to-transparent" />
                  )}
                  
                  {/* 轨道线 - 仅在标准视图下显示 */}
                  {viewMode !== '3d' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                      {/* 移除左侧黑色圆环，它没有明确的用途 */}
                      
                      {Array.from({ length: planets.length }).map((_, i) => (
                        <div 
                          key={`orbit-${i}`} 
                          className={cn(
                            "standard-view-orbit border border-white/10 rounded-full",
                            currentIndex === i ? "border-white/30" : ""
                          )}
                          style={{ 
                            width: `${240 + i * 40}px`, 
                            height: `${240 + i * 40}px`,
                            boxShadow: currentIndex === i 
                              ? '0 0 10px rgba(255, 255, 255, 0.2), inset 0 0 5px rgba(255, 255, 255, 0.1)' 
                              : 'none',
                            transition: 'all 0.5s ease'
                          }}
                        >
                          {currentIndex === i && (
                            <div className="absolute inset-0 rounded-full animate-pulse opacity-20 bg-gradient-radial from-primary/30 to-transparent" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 根据视图模式显示不同的行星组件 */}
                  {viewMode === '3d' ? (
                    // 3D模式 - 使用Three.js真实3D渲染
                    <Planet3DView 
                      planet={currentPlanet}
                      showAtmosphere={showAtmosphere}
                      surfaceDetail={surfaceDetail}
                      rotationSpeed={rotationSpeed}
                    />
                  ) : (
                    // 标准模式 - 使用原有的PlanetVisual组件
                    <motion.div
                      className="relative flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 20 / rotationSpeed, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        className="relative"
                      >
                        <PlanetVisual 
                          planetType={currentPlanet.name} 
                          size="lg" 
                          animate={true}
                          showSurfaceDetail={surfaceDetail}
                          enableInteraction={false}
                          showAtmosphere={showAtmosphere}
                          rotationDuration={20 / rotationSpeed}
                          className="shadow-2xl"
                        />
                      </motion.div>
                    </motion.div>
                  )}
                  
                  {/* 在标准视图下显示行星名称标签 */}
                  {viewMode !== '3d' && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium border border-white/10 transition-all duration-300 shadow-lg">
                      <div className="text-primary/90 font-bold text-center">{currentPlanet.name}</div>
                      <div className="text-xs text-white/70 text-center">{currentPlanet.chineseName}</div>
                    </div>
                  )}

                  {/* 在标准视图下显示行星右侧解释性文本 */}
                  {viewMode !== '3d' && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-[120%] text-white text-left space-y-4 w-56 z-20 right-info-card">
                      {currentPlanet.id === 1 && (
                        <>
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-blue-400">成分未知</div>
                            <div className="text-xs text-white/90 leading-relaxed">天文学家通过观测恒星光谱识别此类天体现象。</div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="text-sm font-bold text-blue-400">深入探测</div>
                            <div className="text-xs text-white/90 leading-relaxed">为了解其物质活动，需要部署专门的探测设备。</div>
                          </div>
                        </>
                      )}
                      {currentPlanet.id === 2 && (
                        <>
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-blue-400">类地环境</div>
                            <div className="text-xs text-white/90 leading-relaxed">位于宜居带内，可能存在适合生命存在的条件。</div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="text-sm font-bold text-blue-400">遥远距离</div>
                            <div className="text-xs text-white/90 leading-relaxed">位于582光年距离，探测详细情况存在挑战。</div>
                          </div>
                        </>
                      )}
                      {currentPlanet.id === 3 && (
                        <>
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-blue-400">成分未知</div>
                            <div className="text-xs text-white/90 leading-relaxed">天文学家通过观测恒星光谱识别此类天体现象。</div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="text-sm font-bold text-blue-400">深入探测</div>
                            <div className="text-xs text-white/90 leading-relaxed">为了解其物质活动，需要部署专门的探测设备。</div>
                          </div>
                        </>
                      )}
                      {currentPlanet.id === 4 && (
                        <>
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-blue-400">大气成分</div>
                            <div className="text-xs text-white/90 leading-relaxed">已发现含有氢、氦和水蒸气的大气层。</div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="text-sm font-bold text-blue-400">潜在海洋</div>
                            <div className="text-xs text-white/90 leading-relaxed">科学家推测其表面可能存在液态水海洋。</div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 导航控制 */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPlanet}
              className="rounded-full h-10 w-10 border-primary/50 text-primary hover:bg-primary/10 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* 行星指示器 */}
            <div className="flex items-center space-x-4 bg-black/40 backdrop-blur-md rounded-full px-6 py-2 border border-white/10">
              {planets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={cn(
                    "flex items-center justify-center transition-all duration-300 rounded-full",
                    index === currentIndex
                      ? "bg-primary text-white h-8 w-8 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      : "bg-white/10 h-3 w-3 hover:bg-white/30"
                  )}
                  aria-label={`查看行星 ${index + 1}`}
                >
                  {index === currentIndex && <span className="text-xs font-medium">{index + 1}</span>}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextPlanet}
              className="rounded-full h-10 w-10 border-primary/50 text-primary hover:bg-primary/10 backdrop-blur-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 