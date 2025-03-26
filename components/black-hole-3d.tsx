"use client"

import React, { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Stars, useTexture, PerspectiveCamera, Text, Sphere } from "@react-three/drei"
import { motion } from "framer-motion"
import * as THREE from "three"
import { Vector3 } from "three"

// 黑洞扭曲效果着色器
const AccretionDiskMaterial = () => {
  const diskRef = useRef<THREE.ShaderMaterial>(null)
  
  useFrame(({ clock }) => {
    if (diskRef.current) {
      diskRef.current.uniforms.time.value = clock.getElapsedTime()
    }
  })
  
  return (
    <shaderMaterial
      ref={diskRef}
      uniforms={{
        time: { value: 0 },
        color1: { value: new THREE.Color('#FF7D00') }, // 更亮的橙色
        color2: { value: new THREE.Color('#FF3300') }, // 更鲜明的红色
        color3: { value: new THREE.Color('#FFD700') }  // 金色光环
      }}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // 引力透镜扭曲效应
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float distortion = sin(angle * 10.0 + time * 1.0) * 0.03 * (1.0 - dist * 3.0);
          dist += distortion;
          
          // 颜色过渡 - 更接近EHT黑洞照片
          vec3 color;
          if (dist < 0.25) {
            // 黑洞中心 - 更深邃的黑色
            float intensity = 1.0 - dist / 0.25;
            intensity = pow(intensity, 0.7);
            color = mix(vec3(0.0, 0.0, 0.0), vec3(0.05, 0.0, 0.0), intensity * 0.2);
          } else if (dist < 0.3) {
            // 事件视界周围的引力红移区域
            float factor = (dist - 0.25) / 0.05;
            color = mix(vec3(0.05, 0.0, 0.0), color2, pow(factor, 0.5));
          } else if (dist < 0.4) {
            // 明亮的吸积盘 - 主环
            float factor = (dist - 0.3) / 0.1;
            factor = pow(factor, 0.5);
            color = mix(color2, color3, factor);
            
            // 增加高光区域
            float ringHighlight = pow(1.0 - abs((dist - 0.35) / 0.03), 4.0);
            color += vec3(1.0, 0.7, 0.3) * ringHighlight * 2.0;
            
            // 添加热斑效果
            float hotspotAngle = mod(angle + time * 0.2, 6.28);
            float hotspot = pow(1.0 - abs(sin(hotspotAngle * 2.0)), 8.0) * 0.6;
            color += vec3(1.0, 0.7, 0.0) * hotspot * (1.0 - abs((dist - 0.35) / 0.05));
          } else if (dist < 0.55) {
            // 外部吸积盘衰减
            float factor = (dist - 0.4) / 0.15;
            factor = pow(factor, 1.2);
            color = mix(color3, color1, factor);
            color *= (1.0 - factor * 0.8); // 逐渐变暗
          } else {
            // 外部区域淡出
            float alpha = 1.0 - (dist - 0.55) / 0.45;
            alpha = pow(alpha, 3.0);
            color = color1 * alpha * 0.3; // 非常微弱的外部光
          }
          
          // 添加闪烁和扰动
          float flicker = noise(vec2(time * 0.1, dist * 10.0)) * 0.15 + 0.85;
          color *= flicker;
          
          // 添加纹理细节
          if (dist > 0.3 && dist < 0.5) {
            // 添加环状纹理
            float rings = sin(dist * 100.0 - time * 0.5) * 0.05 + 0.95;
            color *= rings;
            
            // 添加径向条纹
            float radialStripes = (sin(angle * 30.0 + time * 0.2) * 0.5 + 0.5) * 0.05 + 0.95;
            color *= radialStripes;
          }
          
          // 添加明亮的光晕
          if (dist > 0.3 && dist < 0.42) {
            float glow = pow(1.0 - abs((dist - 0.35) / 0.07), 2.0) * 0.5;
            color += vec3(1.0, 0.6, 0.0) * glow;
          }
          
          gl_FragColor = vec4(color, 1.0);
          
          // 确保黑洞中心足够黑
          if (dist < 0.25) {
            float centerAlpha = smoothstep(0.25, 0.15, dist);
            gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0, 0.0, 0.0), centerAlpha);
          }
        }
      `}
      side={THREE.DoubleSide}
    />
  )
}

// 引力扭曲粒子效果
function GravityParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 3000 // 增加粒子数量
  const particleSize = 0.03 // 减小粒子尺寸使效果更细腻
  
  // 创建粒子位置
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const particleMasses = new Float32Array(particleCount) // 添加质量属性
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    // 在球面上随机生成粒子
    const radius = 5 + Math.random() * 8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
    
    // 随机初始速度 - 模拟轨道运动
    const orbitSpeed = 0.005 + Math.random() * 0.01
    velocities[i3] = -positions[i3 + 1] * orbitSpeed    // 切线方向
    velocities[i3 + 1] = positions[i3] * orbitSpeed
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.002  // 很小的z方向速度
    
    // 随机粒子质量 - 模拟不同大小的星体
    particleMasses[i] = 0.5 + Math.random() * 1.5
    
    // 基于质量和距离的颜色 - 模拟温度和恒星类型
    const distRatio = radius / 13 // 标准化距离
    if (distRatio < 0.5) {
      // 靠近黑洞的粒子 - 偏红色/橙色（高温）
      colors[i3] = 0.8 + Math.random() * 0.2     // R - 高
      colors[i3 + 1] = 0.2 + Math.random() * 0.3 // G - 中低
      colors[i3 + 2] = 0.0 + Math.random() * 0.2 // B - 低
    } else if (distRatio < 0.7) {
      // 中等距离 - 偏白/蓝（中温）
      colors[i3] = 0.7 + Math.random() * 0.3     // R - 高
      colors[i3 + 1] = 0.7 + Math.random() * 0.3 // G - 高
      colors[i3 + 2] = 0.8 + Math.random() * 0.2 // B - 高
    } else {
      // 远距离粒子 - 偏蓝（低温，实际上恒星形成区）
      colors[i3] = 0.2 + Math.random() * 0.3     // R - 低
      colors[i3 + 1] = 0.3 + Math.random() * 0.4 // G - 中
      colors[i3 + 2] = 0.8 + Math.random() * 0.2 // B - 高
    }
  }
  
  // 更新粒子位置
  useFrame(({ clock }) => {
    if (!particlesRef.current) return
    
    const time = clock.getElapsedTime()
    const positionArray = particlesRef.current.geometry.attributes.position.array as Float32Array
    const colorArray = particlesRef.current.geometry.attributes.color.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // 读取当前位置
      const x = positionArray[i3]
      const y = positionArray[i3 + 1]
      const z = positionArray[i3 + 2]
      
      // 计算到黑洞中心的距离
      const distance = Math.sqrt(x * x + y * y + z * z)
      
      // 粒子质量影响其受到的引力 - 模拟广义相对论效应
      const particleMass = particleMasses[i]
      
      // 引力模拟 - 基于距离的平方反比定律，但在靠近黑洞时有额外增强
      const gravitationalFactor = 0.0015 * particleMass
      
      // 在事件视界附近引力急剧增强 - 模拟强引力场效应
      const eventHorizonProximity = Math.max(0, 1.0 - distance / 3.0)
      const gravitationalForce = (gravitationalFactor / Math.pow(distance, 2.0)) * 
                               (1.0 + eventHorizonProximity * 5.0)
      
      // 向黑洞方向的单位向量
      const dx = -x / distance
      const dy = -y / distance
      const dz = -z / distance
      
      // 计算潮汐力效应 - 靠近黑洞时粒子被拉伸
      const tidalEffect = Math.max(0, 0.0002 * Math.pow(1.5 / Math.max(1.5, distance), 3))
      
      // 引入相对论性喷流效应 - 在z轴方向
      const jetEffect = distance < 2.0 ? 0.002 * (Math.random() > 0.5 ? 1 : -1) : 0
      
      // 更新速度 - 应用引力、潮汐力和喷流效应
      velocities[i3] += dx * gravitationalForce
      velocities[i3 + 1] += dy * gravitationalForce
      velocities[i3 + 2] += dz * gravitationalForce + jetEffect
      
      // 潮汐力 - 沿径向拉伸
      velocities[i3] += dx * tidalEffect * distance
      velocities[i3 + 1] += dy * tidalEffect * distance
      velocities[i3 + 2] += dz * tidalEffect * distance
      
      // 更新位置
      positionArray[i3] += velocities[i3]
      positionArray[i3 + 1] += velocities[i3 + 1]
      positionArray[i3 + 2] += velocities[i3 + 2]
      
      // 光热效应 - 靠近黑洞的粒子变红/变亮（引力红移 + 加热）
      if (distance < 3.0) {
        const heatFactor = 1.0 - distance / 3.0
        
        // 增加红色分量
        colorArray[i3] = Math.min(1.0, colorArray[i3] + heatFactor * 0.3)
        
        // 减少蓝色分量 - 引力红移效应
        colorArray[i3 + 2] = Math.max(0.0, colorArray[i3 + 2] - heatFactor * 0.3)
        
        // 粒子亮度随时间脉动 - 模拟吸积过程中的不稳定性
        const pulseFactor = 0.2 * Math.sin(time * 3.0 + distance * 5.0) * heatFactor
        colorArray[i3] = Math.min(1.0, Math.max(0.0, colorArray[i3] + pulseFactor))
        colorArray[i3 + 1] = Math.min(1.0, Math.max(0.0, colorArray[i3 + 1] + pulseFactor))
      }
      
      // 如果粒子被吸入黑洞（距离很小），模拟湮灭和重置
      if (distance < 0.8) {
        // 有概率完全消失 - 模拟被吸入事件视界
        if (Math.random() < 0.1) {
          const resetRadius = 12 + Math.random() * 3
          const resetTheta = Math.random() * Math.PI * 2
          const resetPhi = Math.random() * Math.PI
          
          positionArray[i3] = resetRadius * Math.sin(resetPhi) * Math.cos(resetTheta)
          positionArray[i3 + 1] = resetRadius * Math.sin(resetPhi) * Math.sin(resetTheta)
          positionArray[i3 + 2] = resetRadius * Math.cos(resetPhi)
          
          // 新生成的粒子初始速度 - 类似轨道速度
          const newOrbitSpeed = 0.005 + Math.random() * 0.01
          velocities[i3] = -positionArray[i3 + 1] * newOrbitSpeed
          velocities[i3 + 1] = positionArray[i3] * newOrbitSpeed
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.002
          
          // 重置颜色为新位置对应的温度
          const newDistRatio = resetRadius / 13
          if (newDistRatio < 0.5) {
            colorArray[i3] = 0.8 + Math.random() * 0.2
            colorArray[i3 + 1] = 0.2 + Math.random() * 0.3
            colorArray[i3 + 2] = 0.0 + Math.random() * 0.2
          } else if (newDistRatio < 0.7) {
            colorArray[i3] = 0.7 + Math.random() * 0.3
            colorArray[i3 + 1] = 0.7 + Math.random() * 0.3
            colorArray[i3 + 2] = 0.8 + Math.random() * 0.2
          } else {
            colorArray[i3] = 0.2 + Math.random() * 0.3
            colorArray[i3 + 1] = 0.3 + Math.random() * 0.4
            colorArray[i3 + 2] = 0.8 + Math.random() * 0.2
          }
        }
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.geometry.attributes.color.needsUpdate = true
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// 光线弯曲效果 - 模拟引力透镜
function LightBending() {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const time = clock.getElapsedTime()
      ref.current.rotation.z = time * 0.05
    }
  })
  
  return (
    <group>
      {/* 内部引力透镜 - 强引力区 */}
      <mesh ref={ref}>
        <torusGeometry args={[1.5, 0.15, 16, 100]} />
        <meshPhongMaterial 
          color="#3498db" 
          transparent={true} 
          opacity={0.07}
          emissive="#3498db"
          emissiveIntensity={0.1}
          shininess={30}
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* 外部引力透镜 - 弱引力区 */}
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshPhongMaterial 
          color="#000000" 
          transparent={true} 
          opacity={0.03}
          shininess={30}
          specular={new THREE.Color("#222222")}
          side={THREE.BackSide} 
        />
      </mesh>
    </group>
  )
}

// 相对论喷流 - 黑洞极点的高能粒子流
function RelativisticJet() {
  const jetRef = useRef<THREE.Mesh>(null)
  const particles = 100
  const particleSize = 0.02
  
  // 创建喷流粒子
  const positions = new Float32Array(particles * 3)
  const colors = new Float32Array(particles * 3)
  
  // 北极喷流
  for (let i = 0; i < particles/2; i++) {
    const i3 = i * 3
    const distance = (i / (particles/2)) * 10
    
    // 沿z轴正方向喷射
    positions[i3] = (Math.random() - 0.5) * 0.5 * (distance * 0.1)
    positions[i3 + 1] = (Math.random() - 0.5) * 0.5 * (distance * 0.1)
    positions[i3 + 2] = distance
    
    // 蓝偏色(靠近蓝移 - 朝向观察者)
    colors[i3] = 0.2
    colors[i3 + 1] = 0.5
    colors[i3 + 2] = 0.9
  }
  
  // 南极喷流
  for (let i = particles/2; i < particles; i++) {
    const i3 = i * 3
    const distance = ((i - particles/2) / (particles/2)) * 10
    
    // 沿z轴负方向喷射
    positions[i3] = (Math.random() - 0.5) * 0.5 * (distance * 0.1)
    positions[i3 + 1] = (Math.random() - 0.5) * 0.5 * (distance * 0.1)
    positions[i3 + 2] = -distance
    
    // 红偏色(靠近红移 - 远离观察者)
    colors[i3] = 0.9
    colors[i3 + 1] = 0.3
    colors[i3 + 2] = 0.2
  }
  
  useFrame(({ clock }) => {
    if (jetRef.current) {
      const time = clock.getElapsedTime()
      
      // 喷流旋转
      jetRef.current.rotation.z = time * 0.2
      
      // 脉动效果
      const scale = 1 + Math.sin(time * 3) * 0.1
      jetRef.current.scale.set(scale, scale, 1)
    }
  })
  
  return (
    <points ref={jetRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// 黑洞组件
function BlackHole() {
  const diskSize = 8 // 增大吸积盘尺寸
  const diskRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (diskRef.current) {
      // 吸积盘缓慢旋转 - 内部更快，外部更慢
      const time = clock.getElapsedTime()
      diskRef.current.rotation.z = time * 0.05
    }
  })
  
  return (
    <group>
      {/* 黑洞本身 - 事件视界 */}
      <mesh>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>
      
      {/* 光线弯曲效果 - 引力透镜 */}
      <LightBending />
      
      {/* 相对论喷流 */}
      <RelativisticJet />
      
      {/* 吸积盘 - 稍微倾斜以更真实 */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.1, 0, Math.PI / 15]}>
        <ringGeometry args={[0.9, diskSize, 180]} />
        <AccretionDiskMaterial />
      </mesh>
      
      {/* 引力影响下的粒子 */}
      <GravityParticles />
      
      {/* 黑洞周围的星空背景 */}
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0.6}
        fade
        speed={0.5}
      />
      
      {/* 文字标签 - 事件视界 */}
      <Text
        position={[0, -6, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        事件视界
      </Text>
      
      {/* 标注光线弯曲 */}
      <Text
        position={[2.5, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        引力透镜效应
      </Text>
      
      {/* 标注喷流 */}
      <Text
        position={[0, 1, 8]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        相对论喷流
      </Text>
    </group>
  )
}

function CameraController() {
  const { camera, gl } = useThree()
  
  useEffect(() => {
    // 设置初始相机位置
    camera.position.set(0, 0, 12)
    camera.lookAt(0, 0, 0)
  }, [camera])
  
  return (
    <OrbitControls
      enableZoom={true}
      enablePan={false}
      enableRotate={true}
      zoomSpeed={0.5}
      rotateSpeed={0.4}
      minDistance={4}
      maxDistance={20}
      target={new Vector3(0, 0, 0)}
    />
  )
}

// 增强信息面板内容
function PhysicsInfoPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <motion.div
        className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className="text-primary font-bold mb-2">强引力场物理学</h3>
        <p className="text-sm text-white/80">
          黑洞的引力强度达到了临界点，使得光线无法逃逸。在事件视界附近，广义相对论效应显著：潮汐力撕裂物质，物体被"拉面条化"。能量释放使周围物质被加热至数百万度。
        </p>
      </motion.div>
      
      <motion.div
        className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-primary font-bold mb-2">时空扭曲效应</h3>
        <p className="text-sm text-white/80">
          黑洞附近的时空被严重弯曲，导致引力透镜效应和时间膨胀。接近事件视界的物体，相对外部观察者会经历时间变慢。如果一个宇航员掉入黑洞，对外界观察者而言，他将永远静止在事件视界。
        </p>
      </motion.div>
      
      <motion.div
        className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="text-primary font-bold mb-2">吸积与喷流现象</h3>
        <p className="text-sm text-white/80">
          黑洞通过吸积盘吸收周围物质，形成高速旋转的等离子体盘。巨大的磁场和旋转能量在黑洞极点产生相对论性喷流，以接近光速喷射物质和能量，延伸数千光年，是宇宙中最强大的能量释放机制。
        </p>
      </motion.div>
    </div>
  )
}

export function BlackHole3D() {
  return (
    <section id="blackhole" className="relative py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            黑洞物理学
          </motion.h2>
          <motion.p
            className="text-lg text-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            探索宇宙中最极端天体的物理特性：引力场、时空扭曲、相对论喷流和事件视界奥秘。
          </motion.p>
        </div>
        
        <motion.div
          className="w-full h-[600px] relative rounded-xl overflow-hidden backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-20" />
          <Canvas dpr={[1, 2]} className="bg-black">
            <ambientLight intensity={0.1} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />
            <BlackHole />
            <CameraController />
          </Canvas>
          
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 max-w-xs">
            <h3 className="text-sm font-bold text-primary mb-1">M87* 超大质量黑洞物理模型</h3>
            <p className="text-xs text-white/80">
              此模型展示了多种黑洞物理效应：事件视界（中央黑区）、吸积盘（明亮环状物质）、引力透镜效应（光线弯曲）、相对论喷流（垂直高能束流）和周围物质的潮汐变形。
            </p>
          </div>
          
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm py-1 px-3 rounded-full border border-white/10">
            <p className="text-xs text-white/80">拖动鼠标旋转视角 | 滚轮缩放</p>
          </div>
        </motion.div>
        
        <PhysicsInfoPanel />
      </div>
    </section>
  )
} 