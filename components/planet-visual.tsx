import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// 行星尺寸类型
export type PlanetSize = 'sm' | 'md' | 'lg';
// 行星类型枚举
export enum PlanetType {
  ROCKY = 'rocky',
  EARTHLIKE = 'earthlike',
  OCEANIC = 'oceanic',
  DESERT = 'desert',
  GAS_GIANT = 'gas-giant',
  ICE_GIANT = 'ice-giant',
  LAVA = 'lava',
  ICE = 'ice'
}

// 行星名称到行星类型的映射
export const mapNameToPlanetType = (planetName: string): PlanetType => {
  const nameMap: Record<string, PlanetType> = {
    'proxima centauri b': PlanetType.ROCKY,
    'kepler-186f': PlanetType.EARTHLIKE,
    'trappist-1e': PlanetType.OCEANIC,
    'k2-18b': PlanetType.ICE_GIANT,
    'gliese 581g': PlanetType.DESERT,
    'hd 40307g': PlanetType.GAS_GIANT,
    '天王星': PlanetType.ICE_GIANT,
    '天王星型': PlanetType.ICE_GIANT,
    '海王星': PlanetType.ICE_GIANT,
    '海王星型': PlanetType.ICE_GIANT,
    '土星': PlanetType.GAS_GIANT,
    '土星型': PlanetType.GAS_GIANT,
    '木星': PlanetType.GAS_GIANT,
    '木星型': PlanetType.GAS_GIANT,
    '地球': PlanetType.EARTHLIKE,
    '类地行星': PlanetType.EARTHLIKE
  };
  
  return nameMap[planetName.toLowerCase()] || PlanetType.EARTHLIKE;
};

interface PlanetVisualProps {
  planetType: PlanetType | string;
  size?: PlanetSize;
  animate?: boolean;
  showSurfaceDetail?: boolean;
  enableInteraction?: boolean;
  className?: string;
  showAtmosphere?: boolean;
  rotationDuration?: number; // 添加旋转周期属性
}

export function PlanetVisual({ 
  planetType, 
  size = 'md', 
  animate = true, 
  showSurfaceDetail = true,
  enableInteraction = false,
  className = '',
  showAtmosphere = true, // 默认显示大气层
  rotationDuration = 20, // 默认旋转周期
}: PlanetVisualProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  
  // 转换字符串类型的行星名称为 PlanetType
  const normalizedPlanetType: PlanetType = typeof planetType === 'string' && !Object.values(PlanetType).includes(planetType as PlanetType) 
    ? mapNameToPlanetType(planetType) 
    : planetType as PlanetType;
  
  // 设置尺寸
  const sizeClass = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64'
  }[size];
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 处理鼠标悬停效果
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableInteraction || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    
    setHoverPosition({ x, y });
  };
  
  // 基于行星类型定义视觉风格
  const getPlanetStyle = () => {
    // 检查当前行星类型
    const actualType = typeof planetType === 'string' ? mapNameToPlanetType(planetType) : planetType;
    
    // 基于真实名称返回样式（保持向后兼容）
    if (typeof planetType === 'string') {
      switch (planetType.toLowerCase()) {
        case 'proxima centauri b':
          return {
            core: 'bg-gradient-to-r from-red-700 to-red-900',
            surface: 'bg-[radial-gradient(ellipse_at_center,rgba(153,27,27,0.5),transparent_70%)]',
            atmosphere: 'bg-red-500/20',
            ring: false,
            craters: true,
            clouds: false,
            terrain: 'rocky',
            animation: 'animate-[planet-rotate_20s_linear_infinite]',
            color: 'red'
          };
        case 'kepler-186f':
          return {
            core: 'bg-gradient-to-r from-emerald-700 to-emerald-900',
            surface: 'bg-[radial-gradient(circle_at_30%_70%,rgba(16,185,129,0.4),transparent_70%)]',
            atmosphere: 'bg-emerald-500/30',
            ring: false,
            craters: false,
            clouds: true,
            terrain: 'earthlike',
            animation: 'animate-[planet-rotate_25s_linear_infinite]',
            color: 'emerald'
          };
        case 'trappist-1e':
          return {
            core: 'bg-gradient-to-r from-blue-800 to-indigo-900',
            surface: 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.3),transparent_70%)]',
            atmosphere: 'bg-blue-400/20',
            ring: false,
            craters: false,
            clouds: true,
            terrain: 'oceanic',
            animation: 'animate-[planet-rotate_30s_linear_infinite]',
            color: 'blue'
          };
        case 'k2-18b':
          return {
            core: 'bg-gradient-to-r from-cyan-700 via-teal-800 to-cyan-900',
            surface: 'bg-[radial-gradient(circle_at_40%_60%,rgba(103,232,249,0.4),transparent_70%)]',
            atmosphere: 'bg-cyan-400/30',
            ring: false,
            craters: false,
            clouds: true,
            terrain: 'gaseous',
            animation: 'animate-[planet-rotate_22s_linear_infinite] animate-[planet-pulse_4s_ease-in-out_infinite]',
            color: 'cyan'
          };
        // 其他具名行星保持不变...
      }
    }
    
    // 基于行星类型返回通用样式
    switch (actualType) {
      case PlanetType.ROCKY:
        return {
          core: 'bg-gradient-to-r from-stone-700 to-stone-900',
          surface: 'bg-[radial-gradient(ellipse_at_center,rgba(120,113,108,0.5),transparent_70%)]',
          atmosphere: 'bg-stone-500/10',
          ring: false,
          craters: true,
          clouds: false,
          terrain: 'rocky',
          animation: 'animate-[planet-rotate_20s_linear_infinite]',
          color: 'stone'
        };
      case PlanetType.EARTHLIKE:
        return {
          core: 'bg-gradient-to-r from-emerald-700 via-blue-800 to-emerald-900',
          surface: 'bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.5),transparent_70%)]',
          atmosphere: 'bg-blue-400/20',
          ring: false,
          craters: false,
          clouds: true,
          terrain: 'earthlike',
          animation: 'animate-[planet-rotate_24s_linear_infinite]',
          color: 'blue'
        };
      case PlanetType.OCEANIC:
        return {
          core: 'bg-gradient-to-r from-blue-800 to-indigo-900',
          surface: 'bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.3),transparent_70%)]',
          atmosphere: 'bg-blue-400/20',
          ring: false,
          craters: false,
          clouds: true,
          terrain: 'oceanic',
          animation: 'animate-[planet-rotate_30s_linear_infinite]',
          color: 'blue'
        };
      case PlanetType.DESERT:
        return {
          core: 'bg-gradient-to-r from-orange-700 to-amber-900',
          surface: 'bg-[radial-gradient(ellipse_at_bottom,rgba(234,88,12,0.5),transparent_70%)]',
          atmosphere: 'bg-orange-500/25',
          ring: false,
          craters: true,
          clouds: false,
          terrain: 'desert',
          animation: 'animate-[planet-rotate_28s_linear_infinite]',
          color: 'orange'
        };
      case PlanetType.GAS_GIANT:
        return {
          core: 'bg-gradient-to-r from-amber-600 to-yellow-700',
          surface: 'bg-[radial-gradient(ellipse_at_center,rgba(252,211,77,0.4),transparent_75%)]',
          atmosphere: 'bg-amber-300/20',
          ring: true,
          craters: false,
          clouds: true,
          terrain: 'gaseous',
          animation: 'animate-[planet-rotate_20s_linear_infinite]',
          color: 'amber'
        };
      case PlanetType.ICE_GIANT:
        return {
          core: 'bg-gradient-to-r from-sky-700 to-sky-900',
          surface: 'bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.3),transparent_70%)]',
          atmosphere: 'bg-sky-400/20',
          ring: true,
          craters: false,
          clouds: true,
          terrain: 'icy-gaseous',
          animation: 'animate-[planet-rotate_15s_linear_infinite]',
          color: 'sky'
        };
      case PlanetType.LAVA:
        return {
          core: 'bg-gradient-to-r from-red-800 to-orange-900',
          surface: 'bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.6),transparent_70%)]',
          atmosphere: 'bg-red-600/30',
          ring: false,
          craters: true,
          clouds: false,
          terrain: 'rocky',
          animation: 'animate-[planet-rotate_18s_linear_infinite]',
          color: 'red'
        };
      case PlanetType.ICE:
        return {
          core: 'bg-gradient-to-r from-cyan-800 to-indigo-900',
          surface: 'bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,0.4),transparent_70%)]',
          atmosphere: 'bg-cyan-200/10',
          ring: false,
          craters: true,
          clouds: false,
          terrain: 'icy-gaseous',
          animation: 'animate-[planet-rotate_26s_linear_infinite]',
          color: 'cyan'
        };
      default:
        return {
          core: 'bg-gradient-to-r from-emerald-700 via-blue-800 to-emerald-900',
          surface: 'bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.5),transparent_70%)]',
          atmosphere: 'bg-blue-400/20',
          ring: false,
          craters: false,
          clouds: true,
          terrain: 'earthlike',
          animation: 'animate-[planet-rotate_24s_linear_infinite]',
          color: 'blue'
        };
    }
  };

  const planetStyle = getPlanetStyle();
  
  // 将颜色转换为CSS变量值
  const getColorVar = (color: string) => {
    switch (color) {
      case 'red': return 'rgb(239, 68, 68)';
      case 'orange': return 'rgb(249, 115, 22)'; 
      case 'amber': return 'rgb(245, 158, 11)';
      case 'yellow': return 'rgb(234, 179, 8)';
      case 'lime': return 'rgb(132, 204, 22)';
      case 'green': return 'rgb(34, 197, 94)';
      case 'emerald': return 'rgb(16, 185, 129)';
      case 'teal': return 'rgb(20, 184, 166)';
      case 'cyan': return 'rgb(6, 182, 212)';
      case 'sky': return 'rgb(14, 165, 233)';
      case 'blue': return 'rgb(59, 130, 246)';
      case 'indigo': return 'rgb(79, 70, 229)';
      case 'violet': return 'rgb(139, 92, 246)';
      case 'purple': return 'rgb(168, 85, 247)';
      case 'fuchsia': return 'rgb(217, 70, 239)';
      case 'pink': return 'rgb(236, 72, 153)';
      case 'rose': return 'rgb(244, 63, 94)';
      case 'stone': return 'rgb(120, 113, 108)';
      case 'gray': return 'rgb(107, 114, 128)';
      case 'slate': return 'rgb(100, 116, 139)';
      default: return 'rgb(59, 130, 246)';
    }
  };
  
  // 生成随机地形纹理
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const terrainContainer = container.querySelector('.planet-terrain') as HTMLElement;
    if (!terrainContainer) return;
    
    // 清除现有地形
    terrainContainer.innerHTML = '';
    
    // 如果不显示表面细节，则退出
    if (!showSurfaceDetail) return;
    
    // 添加表面材质纹理
    const surfaceMaterial = document.createElement('div');
    surfaceMaterial.className = 'planet-surface-material';
    
    if (planetStyle.terrain === 'rocky') {
      surfaceMaterial.classList.add('surface-texture-rocky');
    } else if (planetStyle.terrain === 'earthlike') {
      surfaceMaterial.classList.add('surface-texture-earthlike');
    } else if (planetStyle.terrain === 'oceanic') {
      surfaceMaterial.classList.add('surface-texture-oceanic');
    } else if (planetStyle.terrain === 'gaseous' || planetStyle.terrain === 'icy-gaseous') {
      surfaceMaterial.classList.add('surface-texture-gaseous');
    }
    
    terrainContainer.appendChild(surfaceMaterial);
    
    if (planetStyle.terrain === 'rocky') {
      // 为岩石行星生成陨石坑
      const craterCount = Math.floor(Math.random() * 12) + 8;
      for (let i = 0; i < craterCount; i++) {
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.2;
        
        const crater = document.createElement('div');
        crater.className = 'absolute rounded-full bg-black/40';
        crater.style.width = `${size}%`;
        crater.style.height = `${size}%`;
        crater.style.left = `${left}%`;
        crater.style.top = `${top}%`;
        crater.style.opacity = `${opacity}`;
        crater.style.boxShadow = 'inset 1px 1px 3px rgba(255,255,255,0.2)';
        terrainContainer.appendChild(crater);
      }
    } else if (planetStyle.terrain === 'earthlike') {
      // 为类地行星生成大陆
      const continentCount = Math.floor(Math.random() * 4) + 3;
      const baseHue = planetStyle.color === 'emerald' ? 140 : 200; // 绿色或蓝色基调
      
      for (let i = 0; i < continentCount; i++) {
        const size = Math.random() * 30 + 15;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const hue = baseHue - 20 + Math.random() * 40;
        
        const continent = document.createElement('div');
        continent.className = 'absolute';
        continent.style.width = `${size}%`;
        continent.style.height = `${size * (0.6 + Math.random() * 0.8)}%`;
        continent.style.left = `${left}%`;
        continent.style.top = `${top}%`;
        continent.style.backgroundColor = `hsla(${hue}, 70%, 40%, 0.7)`;
        continent.style.borderRadius = '50% 60% 40% 70% / 60% 40% 70% 50%';
        continent.style.transform = `rotate(${Math.random() * 360}deg)`;
        terrainContainer.appendChild(continent);
      }
    } else if (planetStyle.terrain === 'oceanic') {
      // 为海洋行星生成小岛和深海区域
      const islandCount = Math.floor(Math.random() * 5) + 2;
      
      for (let i = 0; i < islandCount; i++) {
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        const island = document.createElement('div');
        island.className = 'absolute';
        island.style.width = `${size}%`;
        island.style.height = `${size * (0.8 + Math.random() * 0.4)}%`;
        island.style.left = `${left}%`;
        island.style.top = `${top}%`;
        island.style.backgroundColor = 'rgba(16, 185, 129, 0.7)';
        island.style.borderRadius = '50% 60% 40% 70% / 60% 40% 70% 50%';
        island.style.transform = `rotate(${Math.random() * 360}deg)`;
        terrainContainer.appendChild(island);
      }
      
      // 添加深海区域
      const deepSeaCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < deepSeaCount; i++) {
        const size = Math.random() * 25 + 20;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        const deepSea = document.createElement('div');
        deepSea.className = 'absolute';
        deepSea.style.width = `${size}%`;
        deepSea.style.height = `${size}%`;
        deepSea.style.left = `${left}%`;
        deepSea.style.top = `${top}%`;
        deepSea.style.backgroundColor = 'rgba(30, 58, 138, 0.4)';
        deepSea.style.borderRadius = '50%';
        deepSea.style.filter = 'blur(8px)';
        terrainContainer.appendChild(deepSea);
      }
    } else if (planetStyle.terrain === 'gaseous' || planetStyle.terrain === 'icy-gaseous') {
      // 为气态行星生成环带
      const isIcy = planetStyle.terrain === 'icy-gaseous';
      const bandCount = Math.floor(Math.random() * 4) + 4;
      const baseColor = getColorVar(planetStyle.color);
      
      for (let i = 0; i < bandCount; i++) {
        const height = Math.random() * 10 + 5;
        const top = i * (100 / bandCount) + Math.random() * 5;
        const opacity = Math.random() * 0.4 + 0.2;
        
        const band = document.createElement('div');
        band.className = 'absolute w-full';
        band.style.height = `${height}%`;
        band.style.top = `${top}%`;
        band.style.left = '0';
        
        if (isIcy) {
          band.style.background = `linear-gradient(to right, rgba(255,255,255,${opacity}), transparent, rgba(255,255,255,${opacity}))`;
        } else {
          const isDark = Math.random() > 0.5;
          band.style.background = isDark 
            ? `linear-gradient(to right, rgba(0,0,0,${opacity}), transparent 70%)`
            : `linear-gradient(to right, ${baseColor}, transparent 80%)`;
          band.style.opacity = `${opacity}`;
        }
        
        terrainContainer.appendChild(band);
      }
      
      // 添加大风暴
      if (Math.random() > 0.5) {
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 60 + 20;
        const top = Math.random() * 60 + 20;
        
        const storm = document.createElement('div');
        storm.className = 'absolute rounded-full';
        storm.style.width = `${size}%`;
        storm.style.height = `${size * (0.6 + Math.random() * 0.4)}%`;
        storm.style.left = `${left}%`;
        storm.style.top = `${top}%`;
        
        if (planetStyle.color === 'orange' || planetStyle.color === 'amber') {
          storm.style.backgroundColor = 'rgba(234, 88, 12, 0.7)';
        } else if (isIcy) {
          storm.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        } else {
          storm.style.backgroundColor = `${baseColor}66`;
        }
        
        storm.style.boxShadow = `0 0 20px ${baseColor}66`;
        terrainContainer.appendChild(storm);
      }
    } else if (planetStyle.terrain === 'desert') {
      // 为沙漠行星生成沙漠纹理
      const duneCount = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < duneCount; i++) {
        const width = 100 + Math.random() * 40;
        const height = Math.random() * 8 + 4;
        const top = Math.random() * 100;
        const opacity = Math.random() * 0.3 + 0.1;
        
        const dune = document.createElement('div');
        dune.className = 'absolute';
        dune.style.width = `${width}%`;
        dune.style.height = `${height}%`;
        dune.style.left = `${-Math.random() * 20}%`;
        dune.style.top = `${top}%`;
        dune.style.backgroundColor = `rgba(234, 88, 12, ${opacity})`;
        dune.style.borderRadius = '40% 60% 60% 40% / 40% 60% 40% 60%';
        dune.style.transform = `rotate(${Math.random() * 5}deg)`;
        terrainContainer.appendChild(dune);
      }
    }
    
    // 添加云层
    if (planetStyle.clouds) {
      const cloudContainer = container.querySelector('.planet-clouds') as HTMLElement;
      if (!cloudContainer) return;
      
      // 清除现有云层
      cloudContainer.innerHTML = '';
      
      const cloudCount = Math.floor(Math.random() * 5) + 3;
      const isGaseous = planetStyle.terrain === 'gaseous' || planetStyle.terrain === 'icy-gaseous';
      
      for (let i = 0; i < cloudCount; i++) {
        const size = Math.random() * (isGaseous ? 40 : 25) + (isGaseous ? 20 : 10);
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const opacity = Math.random() * 0.4 + 0.2;
        
        const cloud = document.createElement('div');
        cloud.className = 'absolute rounded-full';
        cloud.style.width = `${size}%`;
        cloud.style.height = `${size * (0.4 + Math.random() * 0.6)}%`;
        cloud.style.left = `${left}%`;
        cloud.style.top = `${top}%`;
        
        if (planetStyle.terrain === 'icy-gaseous') {
          cloud.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        } else if (planetStyle.color === 'orange' || planetStyle.color === 'amber') {
          cloud.style.backgroundColor = `rgba(252, 211, 77, ${opacity})`;
        } else {
          cloud.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        }
        
        cloud.style.filter = 'blur(5px)';
        cloud.style.transform = `rotate(${Math.random() * 360}deg)`;
        cloudContainer.appendChild(cloud);
      }
    }
  }, [normalizedPlanetType, showSurfaceDetail]);
  
  // 3D互动悬停效果
  const getHoverTransform = () => {
    if (!enableInteraction || !isHovering) return '';
    
    const tiltX = hoverPosition.y * 15; // 垂直移动控制X轴倾斜
    const tiltY = -hoverPosition.x * 15; // 水平移动控制Y轴倾斜
    const scale = 1.05;
    
    return `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
  };
  
  // 监听气氛层状态变化和旋转速度变化的事件
  useEffect(() => {
    const handleAtmosphereToggle = (event: CustomEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const atmosphere = container.querySelector('.planet-atmosphere') as HTMLElement;
      const outerGlow = container.querySelector('.planet-outer-glow') as HTMLElement;
      
      if (atmosphere) {
        atmosphere.style.opacity = event.detail.showAtmosphere ? '1' : '0';
      }
      
      if (outerGlow) {
        outerGlow.style.opacity = event.detail.showAtmosphere ? '1' : '0';
      }
    };
    
    const handleRotationChange = (event: CustomEvent) => {
      const container = containerRef.current;
      if (!container) return;
      
      const planetCore = container.querySelector('.planet-core') as HTMLElement;
      const clouds = container.querySelector('.planet-clouds') as HTMLElement;
      
      if (planetCore) {
        const newDuration = rotationDuration / event.detail.rotationSpeed;
        planetCore.style.animationDuration = `${newDuration}s`;
      }
      
      if (clouds) {
        const newDuration = (rotationDuration * 1.5) / event.detail.rotationSpeed;
        clouds.style.animationDuration = `${newDuration}s`;
      }
    };
    
    window.addEventListener('atmosphere-toggled', handleAtmosphereToggle as EventListener);
    window.addEventListener('rotation-changed', handleRotationChange as EventListener);
    
    return () => {
      window.removeEventListener('atmosphere-toggled', handleAtmosphereToggle as EventListener);
      window.removeEventListener('rotation-changed', handleRotationChange as EventListener);
    };
  }, [rotationDuration]);
  
  return (
    <div 
      ref={containerRef} 
      className={cn('relative flex items-center justify-center', className)}
      onMouseEnter={() => enableInteraction && setIsHovering(true)}
      onMouseLeave={() => enableInteraction && setIsHovering(false)}
      onMouseMove={handleMouseMove}
      style={{
        transform: getHoverTransform(),
        transition: 'transform 0.2s ease'
      }}
    >
      {/* 背景光晕 */}
      <div className="absolute w-full h-full rounded-full opacity-30 bg-gradient-radial from-white/10 via-transparent to-transparent"></div>
      
      {/* 行星核心 */}
      <div 
        className={cn(
          'absolute rounded-full planet-core', 
          sizeClass, 
          planetStyle.core, 
          animate && planetStyle.animation
        )}
        style={animate ? { animationDuration: `${rotationDuration}s` } : undefined}
      >
        {/* 行星表面特征 */}
        <div className="absolute inset-0 rounded-full planet-terrain overflow-hidden">
          {/* 动态生成的地形特征在这里注入 */}
        </div>
      </div>
      
      {/* 行星表面渐变 */}
      <div 
        className={cn(
          'absolute rounded-full planet-surface', 
          sizeClass, 
          planetStyle.surface
        )}
      />
      
      {/* 行星云层 */}
      <div 
        className={cn(
          'absolute rounded-full overflow-hidden', 
          sizeClass,
          'planet-clouds'
        )}
        style={{ 
          animation: animate ? 'planet-rotate 40s linear infinite' : 'none',
          animationDirection: 'reverse',
          animationDuration: animate ? `${rotationDuration * 1.5}s` : undefined
        }}
      >
        {/* 动态生成的云层在这里注入 */}
      </div>
      
      {/* 行星大气 */}
      <div 
        className={cn(
          'absolute rounded-full planet-atmosphere', 
          sizeClass, 
          planetStyle.atmosphere
        )}
        style={{
          opacity: showAtmosphere ? '1' : '0',
          transition: 'opacity 0.3s ease'
        }}
      />
      
      {/* 行星外大气光晕 */}
      <div 
        className={cn(
          'absolute rounded-full planet-outer-glow', 
          size === 'sm' ? 'w-28 h-28' : size === 'md' ? 'w-44 h-44' : 'w-72 h-72'
        )}
        style={{
          background: `radial-gradient(circle at center, ${getColorVar(planetStyle.color)}10, transparent 70%)`,
          animation: animate ? 'planet-pulse 4s ease-in-out infinite' : 'none',
          opacity: showAtmosphere ? '1' : '0',
          transition: 'opacity 0.3s ease'
        }}
      />
      
      {/* 互动高光效果 */}
      {enableInteraction && (
        <div 
          className={cn(
            'absolute rounded-full transition-opacity duration-300', 
            sizeClass
          )}
          style={{
            background: `radial-gradient(
              circle at ${50 + hoverPosition.x * 30}% ${50 + hoverPosition.y * 30}%, 
              rgba(255,255,255,0.15) 0%, 
              transparent 70%
            )`,
            opacity: isHovering ? 1 : 0
          }}
        />
      )}
      
      {/* 可选行星环 */}
      {planetStyle.ring && (
        <div className="absolute w-full h-full flex items-center justify-center transform -rotate-12 planet-ring-container">
          {/* 行星环主体 */}
          <div className={cn(
            'absolute rounded-full overflow-hidden',
            size === 'sm' ? 'w-32 h-8' : 
            size === 'md' ? 'w-52 h-12' : 
            'w-[340px] h-16'
          )}>
            {/* 行星环渐变 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {/* 行星环纹理 */}
            <div className="absolute inset-0">
              {Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={index}
                  className="absolute w-full" 
                  style={{
                    height: `${5 + Math.random() * 10}%`,
                    top: `${index * 25 + Math.random() * 5}%`,
                    background: `linear-gradient(to right, transparent, ${getColorVar(planetStyle.color)}30, transparent)`,
                    opacity: 0.7 - index * 0.1
                  }}
                />
              ))}
            </div>
            
            {/* 行星环阴影 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
          </div>
          
          {/* 环小颗粒 */}
          <div className="absolute w-full h-full flex items-center justify-center">
            {Array.from({ length: 6 }).map((_, index) => {
              const size = 1 + Math.random() * 1.5;
              const distance = 30 + index * 10 + Math.random() * 5;
              const angle = Math.random() * 360;
              const x = Math.cos(angle * Math.PI / 180) * distance;
              const y = Math.sin(angle * Math.PI / 180) * distance * 0.25;
              
              return (
                <div 
                  key={index}
                  className="absolute rounded-full bg-white/80"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    transform: `translateX(${x}%) translateY(${y}%)`,
                    boxShadow: '0 0 3px rgba(255,255,255,0.8)'
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
      
      {/* 互动指示器 */}
      {enableInteraction && isHovering && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/70">
          拖动查看
        </div>
      )}
    </div>
  );
} 