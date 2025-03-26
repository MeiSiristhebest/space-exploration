"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Gauge, Layers, Sparkles, Cloud, RotateCw, Eye } from "lucide-react"

interface ControlItemProps {
  label: string
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

function ControlItem({ label, children, icon, className }: ControlItemProps) {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {icon && <span className="text-primary/70">{icon}</span>}
      <div className="flex-1">
        <div className="text-xs text-foreground/70 mb-1">{label}</div>
        {children}
      </div>
    </div>
  )
}

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={checked} 
        onCheckedChange={onChange} 
        className="data-[state=checked]:bg-primary" 
      />
      {label && <span className="text-xs text-foreground/80">{label}</span>}
    </div>
  )
}

interface PlanetControlPanelProps {
  showAtmosphere: boolean
  onAtmosphereChange: (value: boolean) => void
  rotationSpeed: number
  onRotationSpeedChange: (value: number) => void
  surfaceDetail: boolean
  onSurfaceDetailChange: (value: boolean) => void
  viewMode: 'normal' | '3d'
  onViewModeChange: (mode: 'normal' | '3d') => void
}

// 定义控制项的接口
interface ControlItem {
  id: string
  icon: React.ReactElement<{ className?: string }>
  name: string
  value: boolean | number
  onChange: ((value: boolean) => void) | ((value: number) => void)
  component: "switch" | "slider"
  min?: number
  max?: number
  step?: number
}

export function PlanetControlPanel({
  showAtmosphere,
  onAtmosphereChange,
  rotationSpeed,
  onRotationSpeedChange,
  surfaceDetail,
  onSurfaceDetailChange,
  viewMode,
  onViewModeChange
}: PlanetControlPanelProps) {
  const controls: ControlItem[] = [
    {
      id: "atmosphere",
      icon: <Cloud className="h-4 w-4" />,
      name: "大气层",
      value: showAtmosphere,
      onChange: onAtmosphereChange,
      component: "switch"
    },
    {
      id: "rotation",
      icon: <RotateCw className="h-4 w-4" />,
      name: "旋转速度",
      value: rotationSpeed,
      onChange: onRotationSpeedChange,
      component: "slider",
      min: 0.5,
      max: 5,
      step: 0.5
    },
    {
      id: "detail",
      icon: <Layers className="h-4 w-4" />,
      name: "表面细节",
      value: surfaceDetail,
      onChange: onSurfaceDetailChange,
      component: "switch"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 planet-controls-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground/90">行星控制面板</h3>
        <div className="relative overflow-hidden h-7 rounded-full bg-black/20 border border-white/5 p-1 flex">
          {['normal', '3d'].map((mode) => (
            <button
              key={mode}
              className={cn(
                "relative z-10 text-xs px-3 py-0.5 rounded-full transition-colors duration-200",
                viewMode === mode 
                  ? "text-background" 
                  : "text-foreground/60 hover:text-foreground/80"
              )}
              onClick={() => onViewModeChange(mode as 'normal' | '3d')}
            >
              {mode === 'normal' ? '标准' : '3D'}
            </button>
          ))}
          <div 
            className="absolute inset-y-1 w-[calc(50%-2px)] rounded-full bg-primary transition-transform duration-300 ease-out"
            style={{ 
              transform: `translateX(${viewMode === 'normal' ? '2px' : 'calc(100% + 2px)'})`
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {controls.map((control) => (
          <motion.div 
            key={control.id} 
            className="flex items-center justify-between space-x-4"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-2">
              <div className={cn(
                "flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center",
                control.id === "atmosphere" ? "bg-blue-500/10" : 
                control.id === "rotation" ? "bg-orange-500/10" : "bg-green-500/10"
              )}>
                {React.cloneElement(control.icon, { 
                  className: cn(
                    "h-4 w-4", 
                    control.id === "atmosphere" ? "text-blue-400" : 
                    control.id === "rotation" ? "text-orange-400" : "text-green-400"
                  )
                })}
              </div>
              <div>
                <p className="text-sm font-medium">{control.name}</p>
                {control.component === 'slider' && (
                  <p className="text-xs text-foreground/60">
                    {control.value}x
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0 w-24">
              {control.component === "switch" ? (
                <Switch 
                  checked={control.value as boolean} 
                  onCheckedChange={control.onChange as (checked: boolean) => void} 
                  className="data-[state=checked]:bg-primary"
                />
              ) : (
                <Slider
                  value={[control.value as number]}
                  min={control.min as number}
                  max={control.max as number}
                  step={control.step as number}
                  onValueChange={(values) => (control.onChange as (value: number) => void)(values[0])}
                  className="planet-control-slider"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
} 