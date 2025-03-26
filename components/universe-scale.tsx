"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CosmicScaleVisual } from "@/components/cosmic-scale-visual"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ScaleType = 'planck' | 'nucleus' | 'atomic' | 'bacteria' | 'micro' | 'human' | 'earth' | 'solar' | 'galactic' | 'localgroup' | 'universe';

const scaleLabels: Record<ScaleType, string> = {
  planck: '普朗克尺度',
  nucleus: '原子核尺度',
  atomic: '原子尺度',
  bacteria: '细菌尺度',
  micro: '微观尺度',
  human: '人类尺度',
  earth: '地球尺度',
  solar: '太阳系尺度',
  galactic: '银河系尺度',
  localgroup: '本星系群',
  universe: '宇宙尺度'
};

const scaleDescriptions: Record<ScaleType, {
  title: string;
  description: string;
  exampleSize: string;
  interestingFact: string;
}> = {
  planck: {
    title: '普朗克长度',
    description: '已知最小的可能长度，量子物理学的基本单位。小于这个尺度，空间和时间的概念可能不再适用，需要新的物理理论来解释。',
    exampleSize: '普朗克长度约为10⁻³⁵米，比原子核小约10²⁰倍',
    interestingFact: '在这个尺度下，量子引力效应变得显著，弦理论认为这是基本弦振动的尺度'
  },
  nucleus: {
    title: '原子核世界',
    description: '原子的核心部分，由质子和中子组成。原子核包含了原子质量的99.9%以上，但体积只占原子的很小一部分。',
    exampleSize: '原子核直径约为10⁻¹⁵米',
    interestingFact: '由质子和中子通过强核力结合在一起，一颗针尖大小区域内可容纳约10²⁰个原子核'
  },
  atomic: {
    title: '原子世界',
    description: '在这个尺度下，物质由原子和更小的亚原子粒子组成，量子力学主导着一切。',
    exampleSize: '氢原子直径约为0.1纳米，比可见光波长小1000倍',
    interestingFact: '如果原子核放大到足球场大小，电子将围绕几公里外运行'
  },
  bacteria: {
    title: '细菌世界',
    description: '最常见的微生物，单细胞生命。细菌无处不在，从深海到高空，从酸性温泉到南极冰层，甚至在人体内。',
    exampleSize: '细菌大小通常为1-10微米',
    interestingFact: '人体内的细菌细胞数量是人体细胞的约10倍，一克土壤中可以含有多达400亿个细菌'
  },
  micro: {
    title: '微观宇宙',
    description: '细胞、微生物和微小生物在这个尺度下存在，这是肉眼可见与不可见的交界。',
    exampleSize: '人类细胞平均直径为10-30微米，红细胞约为7.5微米',
    interestingFact: '一滴水中可能含有数百万个微生物，比地球上人类总数还多'
  },
  human: {
    title: '人类尺度',
    description: '这是我们日常体验的世界，从小到蚂蚁，大到高楼大厦，都在这个尺度范围内。',
    exampleSize: '人类平均身高约1.7米，能感知毫米到千米的物体',
    interestingFact: '人类大脑可以分辨的最小视觉细节约为0.1毫米，这是我们感知的极限'
  },
  earth: {
    title: '地球尺度',
    description: '大陆、海洋和地球整体构成了这个尺度，这是人类文明发展的舞台。',
    exampleSize: '地球直径约12,742公里，表面积约5.1亿平方公里',
    interestingFact: '地球上最深的海沟（马里亚纳海沟）深达11公里，珠穆朗玛峰高8.8公里'
  },
  solar: {
    title: '太阳系尺度',
    description: '太阳和围绕它运行的行星、矮行星、小行星和彗星构成了太阳系。',
    exampleSize: '太阳系直径超过9光时（从太阳到冥王星的距离约5.5光时）',
    interestingFact: '光从太阳到地球需要8分钟，从太阳到海王星需要4小时'
  },
  galactic: {
    title: '银河系尺度',
    description: '银河系由数千亿颗恒星、行星系统、星云和星团组成，太阳只是其中一个普通成员。',
    exampleSize: '银河系直径约10万光年，包含约1000-4000亿颗恒星',
    interestingFact: '如果太阳系缩小到1厘米大小，银河系将有10公里宽'
  },
  localgroup: {
    title: '本星系群',
    description: '包含银河系在内的约54个星系组成的星系群。本星系群是宇宙大尺度结构中的一个小单元。',
    exampleSize: '本星系群直径约1000万光年',
    interestingFact: '由银河系和仙女座星系主导，属于室女座超星系团的一部分'
  },
  universe: {
    title: '宇宙尺度',
    description: '宇宙包含数万亿个星系，延伸到我们能观测到的极限，可能还远不止如此。',
    exampleSize: '可观测宇宙直径约930亿光年，包含约2万亿个星系',
    interestingFact: '宇宙中的原子数量估计为10^80个，比地球上所有沙粒的数量还多出难以想象的倍数'
  }
};

export function UniverseScale() {
  const [activeScale, setActiveScale] = useState<ScaleType>('human');
  const scaleInfo = scaleDescriptions[activeScale];

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scaleValue = parseInt(e.target.value);
    const scales: ScaleType[] = [
      'planck', 'nucleus', 'atomic', 'bacteria', 'micro', 'human', 
      'earth', 'solar', 'galactic', 'localgroup', 'universe'
    ];
    setActiveScale(scales[scaleValue]);
  };

  return (
    <section id="universe-scale" className="relative py-20">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            宇宙尺度探索
          </motion.h2>
          <motion.p
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            从微观粒子到宏观宇宙，滑动探索不同尺度下的宇宙奇观。
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-white/10 p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">{scaleInfo.title}</h3>
                <p className="text-slate-300 mb-6">{scaleInfo.description}</p>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-primary mb-1">尺度示例</h4>
                    <p className="text-sm text-slate-300">{scaleInfo.exampleSize}</p>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-primary mb-1">趣味事实</h4>
                    <p className="text-sm text-slate-300">{scaleInfo.interestingFact}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="scale-slider" className="text-slate-300 mb-2 block">
                    尺度滑块
                  </Label>
                  <Input
                    id="scale-slider"
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={[
                      'planck', 'nucleus', 'atomic', 'bacteria', 'micro', 'human', 
                      'earth', 'solar', 'galactic', 'localgroup', 'universe'
                    ].indexOf(activeScale)}
                    onChange={handleScaleChange}
                    className="accent-primary w-full"
                  />
                  
                  <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                    <div className={activeScale === 'planck' ? 'text-primary font-medium' : ''}>普朗克</div>
                    <div className={activeScale === 'nucleus' ? 'text-primary font-medium' : ''}>原子核</div>
                    <div className={activeScale === 'atomic' ? 'text-primary font-medium' : ''}>原子</div>
                    <div className={activeScale === 'bacteria' ? 'text-primary font-medium' : ''}>细菌</div>
                    <div className={activeScale === 'micro' ? 'text-primary font-medium' : ''}>微观</div>
                    <div className={activeScale === 'human' ? 'text-primary font-medium' : ''}>人类</div>
                    <div className={activeScale === 'earth' ? 'text-primary font-medium' : ''}>地球</div>
                    <div className={activeScale === 'solar' ? 'text-primary font-medium' : ''}>太阳系</div>
                    <div className={activeScale === 'galactic' ? 'text-primary font-medium' : ''}>银河</div>
                    <div className={activeScale === 'localgroup' ? 'text-primary font-medium' : ''}>星系群</div>
                    <div className={activeScale === 'universe' ? 'text-primary font-medium' : ''}>宇宙</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <CosmicScaleVisual 
                  activeScale={activeScale}
                  className="h-full w-full"
                />
              </div>
            </div>
          </motion.div>
          
          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              宇宙跨越的尺度范围超过10^40倍，这是一个我们无法直观理解的差距。通过这个探索工具，我们可以感受到不同尺度的宇宙景观，思考我们在宇宙中的位置。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 