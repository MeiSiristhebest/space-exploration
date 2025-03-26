"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Stars, Html, useTexture } from "@react-three/drei"
import { motion } from "framer-motion"
import * as THREE from "three"
import { mapNameToPlanetType, PlanetType } from "@/components/planet-visual"

// 行星信息接口
interface PlanetData {
  id: number
  name: string
  chineseName: string
  type: string
  distance: string
  diameter: string
  temperature: string
  atmosphere: string
}

// 获取行星材质贴图
const getPlanetTextures = (planetType: PlanetType | string, showAtmosphere: boolean, surfaceDetail: boolean) => {
  // 将字符串类型的行星名称转换为 PlanetType
  const normalizedPlanetType: PlanetType = typeof planetType === 'string' && !Object.values(PlanetType).includes(planetType as PlanetType) 
    ? mapNameToPlanetType(planetType) 
    : planetType as PlanetType;

  // 基于行星类型返回纹理参数
  switch (normalizedPlanetType) {
    case PlanetType.ROCKY:
      return {
        color: "#b45309",
        emissive: "#78350f",
        roughness: 1.0,
        metalness: 0.2,
        atmosphereColor: "#d97706",
        atmosphereOpacity: showAtmosphere ? 0.2 : 0,
        cloudColor: "#ffffff",
        hasRings: false,
        hasClouds: false,
        hasLandmass: surfaceDetail,
        landmassColor: "#92400e"
      };
    case PlanetType.EARTHLIKE:
      return {
        color: "#065f46",
        emissive: "#047857",
        roughness: 0.7,
        metalness: 0.1,
        atmosphereColor: "#06b6d4",
        atmosphereOpacity: showAtmosphere ? 0.3 : 0,
        cloudColor: "#ffffff",
        hasRings: false,
        hasClouds: true,
        hasLandmass: surfaceDetail,
        landmassColor: "#047857"
      };
    case PlanetType.OCEANIC:
      return {
        color: "#0284c7",
        emissive: "#0369a1",
        roughness: 0.5,
        metalness: 0.3,
        atmosphereColor: "#38bdf8",
        atmosphereOpacity: showAtmosphere ? 0.4 : 0,
        cloudColor: "#ffffff",
        hasRings: false,
        hasClouds: true,
        hasLandmass: surfaceDetail,
        landmassColor: "#0e7490"
      };
    case PlanetType.GAS_GIANT:
      return {
        color: "#f59e0b",
        emissive: "#d97706",
        roughness: 0.4,
        metalness: 0.2,
        atmosphereColor: "#fbbf24",
        atmosphereOpacity: showAtmosphere ? 0.3 : 0,
        cloudColor: "#fcd34d",
        hasRings: true,
        hasClouds: true,
        hasLandmass: false,
        landmassColor: ""
      };
    case PlanetType.ICE_GIANT:
      return {
        color: "#0ea5e9",
        emissive: "#0284c7",
        roughness: 0.3,
        metalness: 0.4,
        atmosphereColor: "#7dd3fc",
        atmosphereOpacity: showAtmosphere ? 0.35 : 0,
        cloudColor: "#e0f2fe",
        hasRings: true,
        hasClouds: true,
        hasLandmass: false,
        landmassColor: ""
      };
    default:
      return {
        color: "#0ea5e9",
        emissive: "#0284c7",
        roughness: 0.7,
        metalness: 0.2,
        atmosphereColor: "#38bdf8",
        atmosphereOpacity: showAtmosphere ? 0.25 : 0,
        cloudColor: "#ffffff",
        hasRings: false,
        hasClouds: true,
        hasLandmass: surfaceDetail,
        landmassColor: "#047857"
      };
  }
};

// 行星3D组件
function Planet3D({ 
  planetType, 
  showAtmosphere = true, 
  surfaceDetail = true, 
  rotationSpeed = 1
}: { 
  planetType: string; 
  showAtmosphere: boolean; 
  surfaceDetail: boolean; 
  rotationSpeed: number;
}) {
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const landmassRef = useRef<THREE.Mesh>(null);
  const textures = getPlanetTextures(planetType, showAtmosphere, surfaceDetail);
  
  // 行星自转动画
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.001 * rotationSpeed;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.0015 * rotationSpeed;
    }
    if (landmassRef.current) {
      landmassRef.current.rotation.y += 0.001 * rotationSpeed;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 行星主体 */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial 
          color={textures.color} 
          metalness={textures.metalness} 
          roughness={textures.roughness} 
          emissive={textures.emissive}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 行星陆地 (仅当表面细节开启并行星有陆地时) */}
      {textures.hasLandmass && (
        <mesh ref={landmassRef}>
          <sphereGeometry args={[1.81, 64, 64]} />
          <meshStandardMaterial 
            color={textures.landmassColor} 
            metalness={0.1} 
            roughness={1}
            opacity={0.7}
            transparent={true}
            wireframe={false}
            emissive={textures.landmassColor}
            emissiveIntensity={0.1}
          />
        </mesh>
      )}

      {/* 行星云层 (仅当行星有云层时) */}
      {textures.hasClouds && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[1.85, 48, 48]} />
          <meshStandardMaterial 
            color={textures.cloudColor} 
            metalness={0.1} 
            roughness={0.8}
            opacity={0.4}
            transparent={true}
            emissive={textures.cloudColor}
            emissiveIntensity={0.1}
          />
        </mesh>
      )}

      {/* 大气层 */}
      <mesh>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial 
          color={textures.atmosphereColor} 
          transparent={true} 
          opacity={textures.atmosphereOpacity} 
          side={THREE.BackSide}
          emissive={textures.atmosphereColor}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* 外层发光效果 */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshStandardMaterial 
          color={textures.atmosphereColor} 
          transparent={true} 
          opacity={textures.atmosphereOpacity * 0.6} 
          side={THREE.BackSide}
          emissive={textures.atmosphereColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 行星光环 (仅当行星有光环时) */}
      {textures.hasRings && (
        <mesh rotation={[Math.PI / 6, 0, 0]}>
          <ringGeometry args={[2.5, 4.0, 64]} />
          <meshStandardMaterial 
            color={textures.color} 
            transparent={true} 
            opacity={0.6}
            side={THREE.DoubleSide}
            metalness={0.8}
            roughness={0.4}
          />
        </mesh>
      )}

      {/* 轨道环 1 */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[4, 4.05, 128]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent={true} 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 轨道环 2 */}
      <mesh rotation={[Math.PI / 6, Math.PI / 8, 0]}>
        <ringGeometry args={[5, 5.05, 128]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent={true} 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 轨道环 3 */}
      <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <ringGeometry args={[6, 6.03, 128]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent={true} 
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 轨道粒子 */}
      <OrbitParticles />
    </group>
  );
}

// 轨道粒子效果
function OrbitParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: 150 }).map((_, i) => {
        const angle = (i / 75) * Math.PI * 2;
        const radius = 4 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 0.5;
        const scale = Math.random() * 0.03 + 0.01;
        
        return (
          <mesh key={i} position={[x, y, z]} scale={scale}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        );
      })}
    </group>
  );
}

// 场景控制器
function SceneControls() {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    // 将相机设置为适当的初始位置，确保可以看到整个行星及其轨道
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 0, 0);
    
    // 确保WebGL渲染器在交互时保持高品质
    gl.setPixelRatio(window.devicePixelRatio);
  }, [camera, gl]);
  
  return (
    <OrbitControls 
      enableZoom={true}
      enablePan={false}
      enableRotate={true}
      zoomSpeed={0.5}
      rotateSpeed={0.5}
      minDistance={4}
      maxDistance={12}
      target={[0, 0, 0]}
      autoRotate={true}
      autoRotateSpeed={0.3}
      dampingFactor={0.05}
      enableDamping={true}
    />
  );
}

// 导出的主组件
export function Planet3DView({ 
  planet,
  showAtmosphere,
  surfaceDetail,
  rotationSpeed
}: { 
  planet: PlanetData;
  showAtmosphere: boolean;
  surfaceDetail: boolean;
  rotationSpeed: number;
}) {
  return (
    <div className="h-[450px] w-full relative three-canvas-container">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        className="three-canvas"
      >
        <color attach="background" args={['#000010']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7dd3fc" />
        <SceneControls />
        <Stars radius={100} depth={50} count={5000} factor={4} />
        
        {/* 行星系统 */}
        <Planet3D 
          planetType={planet.name} 
          showAtmosphere={showAtmosphere}
          surfaceDetail={surfaceDetail}
          rotationSpeed={rotationSpeed}
        />
        
        {/* 行星信息标签 */}
        <Html position={[2.5, 2.5, 0]} center>
          <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg w-48 text-white text-center transform-gpu select-none shadow-xl">
            <h3 className="text-lg font-bold text-primary/90">{planet.name}</h3>
            <p className="text-xs text-white/70">{planet.chineseName}</p>
            <div className="h-px bg-white/10 my-2"></div>
            <div className="text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-primary/80">类型:</span>
                <span>{planet.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary/80">距离:</span>
                <span>{planet.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary/80">温度:</span>
                <span>{planet.temperature}</span>
              </div>
            </div>
          </div>
        </Html>

        {/* 行星左侧解释性文本 */}
        <Html position={[-3.5, 0, 0]} center>
          <div className="text-white text-left space-y-6 transform-gpu select-none w-40 opacity-80">
            <div className="space-y-1">
              <div className="text-sm font-bold text-blue-300">大气与蒸汽</div>
              <div className="text-xs text-white/70">探测到丰富的大气层和水蒸气存在</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-blue-300">天文学手段</div>
              <div className="text-xs text-white/70">通过观测恒星光线能够识别此类天体现象</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-blue-300">深入探测</div>
              <div className="text-xs text-white/70">为了解其物质活动，需要部署专门的探测设备</div>
            </div>
          </div>
        </Html>
      </Canvas>

      {/* 轨道指示器 - 位于Canvas外部，确保始终可见 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
        <div className="w-[300px] h-[300px] rounded-full border border-white/10 absolute"></div>
        <div className="w-[380px] h-[380px] rounded-full border border-white/5 absolute"></div>
        <div className="w-[460px] h-[460px] rounded-full border border-white/5 absolute"></div>
      </div>
    </div>
  );
} 