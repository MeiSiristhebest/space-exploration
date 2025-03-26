import { HeroSection } from "@/components/hero-section"
import { InteractiveSpace } from "@/components/interactive-space"
import { MissionTimeline } from "@/components/mission-timeline"
import { ModernPlanetShowcase } from "@/components/modern-planet-showcase"
import { SpaceVisualization } from "@/components/space-visualization"
import { UniverseScale } from "@/components/universe-scale"
import { BlackHole3D } from "@/components/black-hole-3d"

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <InteractiveSpace />
      <ModernPlanetShowcase />
      <SpaceVisualization />
      <MissionTimeline />
      <UniverseScale />
      <BlackHole3D />
    </div>
  )
}

