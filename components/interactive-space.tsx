"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Stars, Html } from "@react-three/drei"
import { motion } from "framer-motion"
import { Suspense } from "react"
import * as THREE from "three"

function SpaceScene() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
      <hemisphereLight intensity={0.8} color="#3b82f6" groundColor="#000000" />
      <Suspense fallback={<Html center>加载3D场景中...</Html>}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Planet position={[0, 0, 0]} />
        <SpaceStation position={[5, 2, 0]} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.5}
          rotateSpeed={0.5}
          minDistance={5}
          maxDistance={30}
        />
      </Suspense>
    </Canvas>
  )
}

function Planet({ position }: { position: [number, number, number] }) {
  const planetRef = useRef<THREE.Mesh>(null)
  const cloudRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  // Create a simple planet with atmosphere
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.001
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.0015
    }
  })

  return (
    <group position={position}>
      {/* 行星主体 - 使用更加鲜艳的蓝色 */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial 
          color="#0077be" 
          metalness={0.1} 
          roughness={0.7} 
          emissive="#0a3d62"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 行星表面陆地 - 添加深绿色陆地 */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[3.01, 64, 64]} />
        <meshStandardMaterial 
          color="#0c8a45" 
          metalness={0.2} 
          roughness={1}
          opacity={0.7}
          transparent={true}
          wireframe={false}
          emissive="#064a24"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 行星云层 - 添加白色半透明云层 */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[3.05, 48, 48]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1} 
          roughness={0.8}
          opacity={0.4}
          transparent={true}
          emissive="#a1c1dc"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 增强大气层效果 - 使用更加明亮的蓝色 */}
      <mesh>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshStandardMaterial 
          color="#4fa4ff" 
          transparent={true} 
          opacity={0.15} 
          side={THREE.BackSide}
          emissive="#4fa4ff"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* 外层发光效果 - 增加亮度 */}
      <mesh>
        <sphereGeometry args={[3.4, 32, 32]} />
        <meshStandardMaterial 
          color="#4fa4ff" 
          transparent={true} 
          opacity={0.08} 
          side={THREE.BackSide}
          emissive="#4fa4ff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 添加极光效果 */}
      <mesh>
        <torusGeometry args={[3.15, 0.2, 16, 100]} />
        <meshStandardMaterial 
          color="#50f2aa" 
          transparent={true} 
          opacity={0.3}
          emissive="#50f2aa"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Info tag */}
      <Html position={[4, 0, 0]} className="planet-card p-4 rounded-lg w-48" distanceFactor={10} occlude>
        <div className="text-white">
          <h3 className="text-lg font-bold mb-1">水瑶星-9</h3>
          <p className="text-xs text-blue-300">水基系外行星</p>
          <div className="mt-2 text-xs">
            <p>距离：42光年</p>
            <p>温度：-20°C 至 10°C</p>
          </div>
        </div>
      </Html>
    </group>
  )
}

function SpaceStation({ position }: { position: [number, number, number] }) {
  const stationRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.rotation.y += 0.005
    }
  })

  return (
    <group position={position} ref={stationRef}>
      {/* 中心舱 - 添加金属质感 */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#404040"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 太阳能板 - 更亮的蓝色 */}
      <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[3, 0.1, 1]} />
        <meshStandardMaterial 
          color="#2196f3" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#1976d2"
          emissiveIntensity={0.6}
        />
      </mesh>

      <mesh position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[3, 0.1, 1]} />
        <meshStandardMaterial 
          color="#2196f3" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#1976d2"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* 发光核心 - 增强亮度 */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* 添加额外的细节 - 通信天线 */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial 
          color="#a0a0a0" 
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial 
          color="#ff2222" 
          emissive="#ff0000"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Info tag */}
      <Html position={[0, 2, 0]} className="planet-card p-3 rounded-lg w-40" distanceFactor={10} occlude>
        <div className="text-white">
          <h3 className="text-sm font-bold mb-1">轨道站阿尔法</h3>
          <p className="text-xs text-blue-300">研究与观测</p>
        </div>
      </Html>
    </group>
  )
}

export function InteractiveSpace() {
  return (
    <section id="interactive-space" className="relative h-screen">
      {/* 场景容器 */}
      <div className="absolute inset-0 w-full h-full">
        <SpaceScene />
      </div>

      {/* 覆盖文本 */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none pb-20">
        <motion.div 
          className="bg-black/50 backdrop-blur-lg rounded-xl p-6 max-w-md mx-auto border border-white/10 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-3 text-white">交互式太空探索</h2>
          <p className="text-slate-300 mb-4">
            这个3D场景允许你探索模拟的太空环境。通过鼠标或触摸可以旋转、缩放和平移视图。
          </p>
          <div className="text-sm bg-white/5 p-3 rounded border border-white/10">
            <p className="text-primary font-medium mb-1">操作指南：</p>
            <ul className="text-slate-300 space-y-1 text-xs">
              <li>• 左键拖动或触摸 - 旋转视图</li>
              <li>• 滚轮或双指缩放 - 放大/缩小</li>
              <li>• 右键拖动 - 平移视图</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

