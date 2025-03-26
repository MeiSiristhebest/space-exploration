import React from 'react';
import { cn } from '@/lib/utils';

interface CosmicScaleItemProps {
  scale: 'planck' | 'nucleus' | 'atomic' | 'bacteria' | 'micro' | 'human' | 'earth' | 'solar' | 'galactic' | 'localgroup' | 'universe';
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface CosmicScaleVisualProps {
  activeScale: 'planck' | 'nucleus' | 'atomic' | 'bacteria' | 'micro' | 'human' | 'earth' | 'solar' | 'galactic' | 'localgroup' | 'universe';
  className?: string;
}

export function CosmicScaleItem({ scale, active = false, className, children }: CosmicScaleItemProps) {
  return (
    <div 
      className={cn(
        'scale-item transition-all duration-500',
        `scale-item-${scale}`,
        active ? 'ring-2 ring-white/50 shadow-lg scale-105' : 'opacity-80',
        className
      )}
    >
      {/* 粒子特效背景 */}
      <div className="particles" />
      
      {/* 动态环形 */}
      {active && (
        <>
          <div className="scale-ring absolute w-[30%] h-[30%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30" />
          <div className="scale-ring absolute w-[50%] h-[50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" style={{ animationDelay: '0.5s' }} />
          <div className="scale-ring absolute w-[70%] h-[70%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10" style={{ animationDelay: '1s' }} />
        </>
      )}
      
      {children}
    </div>
  );
}

export function CosmicScaleVisual({ activeScale, className }: CosmicScaleVisualProps) {
  // 获取尺度相关的描述信息
  const getScaleInfo = (scale: string) => {
    switch(scale) {
      case 'planck':
        return {
          title: '普朗克长度',
          description: '已知最小的可能长度',
          fact: '量子物理学的基本长度单位'
        };
      case 'nucleus':
        return {
          title: '原子核尺度',
          description: '原子的核心部分',
          fact: '由质子和中子组成'
        };
      case 'atomic':
        return {
          title: '原子尺度',
          description: '原子尺度约为0.1纳米，比可见光波长小1000倍',
          fact: '如果原子核是足球场大小，电子云将覆盖整个城市'
        };
      case 'bacteria':
        return {
          title: '细菌尺度',
          description: '最小的生命形式之一',
          fact: '单细胞微生物，大小通常为1-10微米'
        };
      case 'micro':
        return {
          title: '微观尺度',
          description: '细胞尺度从微米到毫米不等，红细胞直径约为7.5微米',
          fact: '人体内约有37.2万亿个细胞，每天约有数十亿细胞死亡并再生'
        };
      case 'human':
        return {
          title: '人类尺度',
          description: '人类平均身高约1.7米，能感知毫米到千米的物体',
          fact: '人类眼睛能分辨的最小物体约为0.1毫米，是头发直径的一半'
        };
      case 'earth':
        return {
          title: '地球尺度',
          description: '地球直径约12,742公里，地球表面积约5.1亿平方公里',
          fact: '地球最深的海沟马里亚纳海沟深度约11公里，比珠穆朗玛峰还高2公里'
        };
      case 'solar':
        return {
          title: '太阳系尺度',
          description: '太阳系直径约9万个天文单位，一个天文单位是地球到太阳的距离',
          fact: '光从太阳到地球需要8分钟，而从太阳到海王星需要4小时'
        };
      case 'galactic':
        return {
          title: '银河系尺度',
          description: '银河系直径约10万光年，包含约1000-4000亿颗恒星',
          fact: '如果太阳系缩小到1厘米，银河系将有10公里宽'
        };
      case 'localgroup':
        return {
          title: '本星系群',
          description: '由约54个星系组成的星系群',
          fact: '银河系和仙女座星系是最大的两个成员'
        };
      case 'universe':
        return {
          title: '宇宙尺度',
          description: '可观测宇宙直径约930亿光年，包含约2万亿个星系',
          fact: '宇宙中最大的已知结构是"长城"，长度达到15亿光年'
        };
      default:
        return {
          title: '未知尺度',
          description: '暂无描述',
          fact: '暂无趣味事实'
        };
    }
  };
  
  const scaleInfo = getScaleInfo(activeScale);
  
  return (
    <div className={cn('relative space-y-4', className)}>
      <div className="grid grid-cols-11 gap-0.5 h-32">
        <CosmicScaleItem scale="planck" active={activeScale === 'planck'}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping">
              <div className="absolute w-3 h-3 animate-spin rounded-full border border-rose-500 border-dashed"></div>
            </div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="nucleus" active={activeScale === 'nucleus'}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-2.5 h-2.5 rounded-full bg-orange-700 animate-pulse">
              <div className="absolute w-5 h-5 animate-spin rounded-full border border-orange-500 border-dashed"></div>
            </div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="atomic" active={activeScale === 'atomic'}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-4 h-4 rounded-full bg-red-500 animate-pulse">
              <div className="absolute w-8 h-8 animate-spin rounded-full border border-red-400 border-dashed"></div>
            </div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="bacteria" active={activeScale === 'bacteria'}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300/30 to-amber-500/30 backdrop-blur-sm"></div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="micro" active={activeScale === 'micro'}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400/40 to-orange-600/40 backdrop-blur-sm"></div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="human" active={activeScale === 'human'}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-5 bg-blue-400/30 rounded-full"></div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="earth" active={activeScale === 'earth'}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-800 opacity-80"></div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="solar" active={activeScale === 'solar'}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 shadow-lg shadow-orange-500/50 animate-pulse"></div>
            <div className="absolute w-20 h-20 rounded-full border border-white/10 border-dashed"></div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="galactic" active={activeScale === 'galactic'}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-700/20 animate-spin-slow"></div>
            <div className="absolute w-16 h-6 rounded-full bg-gradient-to-br from-purple-400/30 to-purple-700/30 rotate-45"></div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="localgroup" active={activeScale === 'localgroup'}>
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-24 h-24 bg-gradient-radial from-fuchsia-500/30 to-transparent rounded-full animate-pulse-slow"></div>
            <div className="absolute w-16 h-16 bg-gradient-radial from-purple-500/20 to-transparent rounded-full -translate-x-6 translate-y-2"></div>
            <div className="absolute w-12 h-12 bg-gradient-radial from-indigo-500/20 to-transparent rounded-full translate-x-8 -translate-y-4"></div>
          </div>
        </CosmicScaleItem>
        
        <CosmicScaleItem scale="universe" active={activeScale === 'universe'}>
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-24 h-24 bg-gradient-radial from-pink-500/30 to-transparent rounded-full animate-pulse-slow"></div>
            <div className="absolute w-32 h-32 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.1),transparent_70%)]"></div>
          </div>
        </CosmicScaleItem>
      </div>
      
      <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg p-4 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-2">{scaleInfo.title}</h3>
        <p className="text-slate-300 mb-2">{scaleInfo.description}</p>
        <div className="text-sm text-slate-400">
          <span className="font-semibold">趣味事实：</span> {scaleInfo.fact}
        </div>
      </div>
    </div>
  );
} 