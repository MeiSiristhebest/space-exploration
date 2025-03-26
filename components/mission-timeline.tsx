"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, Rocket, Satellite, Telescope } from "lucide-react"

const missions = [
  {
    id: 1,
    year: "2025",
    title: "月球门户建设",
    description:
      "开始建设轨道前哨站，这将作为深空探索的多用途门户。",
    icon: <Rocket className="h-6 w-6 text-primary" />,
  },
  {
    id: 2,
    year: "2028",
    title: "火星样本返回",
    description:
      "回收毅力号火星车收集的样本，在地球实验室中研究是否存在古代微生物生命的迹象。",
    icon: <Satellite className="h-6 w-6 text-primary" />,
  },
  {
    id: 3,
    year: "2032",
    title: "欧罗巴快船任务",
    description:
      "探索木星的卫星欧罗巴，研究其冰层下是否存在适合生命存在的条件。",
    icon: <Telescope className="h-6 w-6 text-primary" />,
  },
  {
    id: 4,
    year: "2035",
    title: "首次载人火星着陆",
    description:
      "人类首次踏上这颗红色星球，标志着太空探索和潜在殖民新纪元的开始。",
    icon: <Calendar className="h-6 w-6 text-primary" />,
  },
]

export function MissionTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  return (
    <section id="missions" className="relative py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            未来空间任务
          </motion.h2>
          <motion.p
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            探索即将塑造空间探索未来和我们对宇宙的理解的时间线。
          </motion.p>
        </div>

        <div ref={containerRef} className="max-w-3xl mx-auto">
          {missions.map((mission, index) => (
            <TimelineItem key={mission.id} mission={mission} index={index} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineItem({
  mission,
  index,
  progress,
}: {
  mission: (typeof missions)[0]
  index: number
  progress: any
}) {
  const ref = useRef<HTMLDivElement>(null)

  const y = useTransform(progress, [0, 1], [50, -50])

  const opacity = useTransform(progress, [0, 0.2 * index, 0.3 * index + 0.1, 0.8, 1], [0.3, 0.3, 1, 1, 0.3])

  return (
    <motion.div ref={ref} style={{ opacity }} className="timeline-item pl-10 pb-16 relative">
      <motion.div
        className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: index * 0.1 }}
      >
        {mission.icon}
      </motion.div>

      <motion.div
        style={{ y }}
        className="planet-card p-6 rounded-lg"
        initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: index * 0.1 }}
      >
        <div className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          {mission.year}
        </div>
        <h3 className="text-xl font-bold mb-2">{mission.title}</h3>
        <p className="text-foreground/80">{mission.description}</p>
      </motion.div>
    </motion.div>
  )
}

