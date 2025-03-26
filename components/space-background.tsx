"use client"

import { useEffect, useRef } from "react"

export function SpaceBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const starCount = 200 // 减少星星数量，增加大小和亮度

    // 清除现有星星
    container.innerHTML = ""

    // 创建大型星云背景
    const nebulaBg = document.createElement("div")
    nebulaBg.classList.add("nebula-background")
    container.appendChild(nebulaBg)

    // 创建更显眼的星星
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.classList.add("star")

      // 随机位置
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`

      // 更大的星星尺寸
      const size = Math.random() * 4 + 1
      const isLarge = Math.random() > 0.9
      star.style.width = `${isLarge ? size * 2 : size}px`
      star.style.height = `${isLarge ? size * 2 : size}px`

      // 更短的动画时长和更高的亮度
      const duration = 2 + Math.random() * 4
      star.style.setProperty("--duration", `${duration}s`)
      star.style.setProperty("--opacity", `${0.6 + Math.random() * 0.4}`) // 更高亮度
      star.style.animationDelay = `${Math.random() * 5}s`
      
      // 为大星星添加特殊脉冲效果
      if (isLarge) {
        star.classList.add("large-star")
      }

      container.appendChild(star)
    }

    // 增加流星数量
    for (let i = 0; i < 8; i++) { // 固定数量的流星
      const shootingStar = document.createElement("div")
      shootingStar.classList.add("shooting-star")
      shootingStar.style.left = `${Math.random() * 100}%`
      shootingStar.style.top = `${Math.random() * 50}%` // 主要在上半部分
      
      const speed = 3 + Math.random() * 6
      const delay = i * 2 + Math.random() * 5 // 分散时间点
      shootingStar.style.setProperty("--speed", `${speed}s`)
      shootingStar.style.setProperty("--delay", `${delay}s`)
      shootingStar.style.setProperty("--angle", `${210 + Math.random() * 30}deg`) // 固定方向范围
      
      container.appendChild(shootingStar)
    }

    // 添加几个更大的脉冲光晕
    for (let i = 0; i < 5; i++) {
      const pulsar = document.createElement("div")
      pulsar.classList.add("pulsar")
      pulsar.style.left = `${Math.random() * 100}%`
      pulsar.style.top = `${Math.random() * 100}%`
      pulsar.style.animationDelay = `${Math.random() * 10}s`
      container.appendChild(pulsar)
    }

    // 创建星尘画布
    const dustCanvas = document.createElement("canvas")
    dustCanvas.classList.add("cosmic-dust")
    container.appendChild(dustCanvas)

    const ctx = dustCanvas.getContext("2d")
    if (!ctx) return

    dustCanvas.width = window.innerWidth
    dustCanvas.height = window.innerHeight

    // 创建更大、更明显的粒子
    const particles: {
      x: number
      y: number
      radius: number
      color: string
      vx: number
      vy: number
      alpha: number
      pulse: number
      pulseSpeed: number
    }[] = []

    for (let i = 0; i < 50; i++) {
      const radius = 1 + Math.random() * 3 // 更大的粒子
      const alpha = 0.3 + Math.random() * 0.4 // 更高的透明度
      particles.push({
        x: Math.random() * dustCanvas.width,
        y: Math.random() * dustCanvas.height,
        radius,
        color: `rgba(${59 + Math.random() * 50}, ${130 + Math.random() * 60}, ${246 + Math.random() * 10}, ${alpha})`,
        vx: (Math.random() - 0.5) * 0.3, // 更快的移动
        vy: (Math.random() - 0.5) * 0.3,
        alpha,
        pulse: 0,
        pulseSpeed: 0.05 + Math.random() * 0.1
      })
    }

    function animateDust() {
      if (!ctx) return
      ctx.clearRect(0, 0, dustCanvas.width, dustCanvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        
        // 粒子脉冲效果
        p.pulse += p.pulseSpeed
        const pulseFactor = Math.sin(p.pulse) * 0.5 + 0.5 // 0到1之间变化
        const currentAlpha = p.alpha * (0.6 + pulseFactor * 0.4)
        const currentRadius = p.radius * (0.8 + pulseFactor * 0.4)

        // 边界处理
        if (p.x < 0) p.x = dustCanvas.width
        if (p.x > dustCanvas.width) p.x = 0
        if (p.y < 0) p.y = dustCanvas.height
        if (p.y > dustCanvas.height) p.y = 0

        // 绘制带强化发光效果的粒子
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 3)
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/,`${currentAlpha})`))
        gradient.addColorStop(0.5, p.color.replace(/[\d.]+\)$/,`${currentAlpha * 0.5})`))
        gradient.addColorStop(1, p.color.replace(/[\d.]+\)$/,'0)'))
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, currentRadius * 3, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animateDust)
    }

    animateDust()

    const handleResize = () => {
      if (!dustCanvas || !ctx) return
      dustCanvas.width = window.innerWidth
      dustCanvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 overflow-hidden z-0 bg-black" />
    </>
  )
}

