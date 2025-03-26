"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Globe, Rocket, Database, Maximize, Disc } from "lucide-react"

// 更新导航项，与navbar保持一致
const navigationItems = [
  { name: "首页", icon: <Star className="h-4 w-4" />, sectionId: "" },
  { name: "行星", icon: <Globe className="h-4 w-4" />, sectionId: "planets" },
  { name: "任务", icon: <Rocket className="h-4 w-4" />, sectionId: "missions" },
  { name: "数据", icon: <Database className="h-4 w-4" />, sectionId: "visualization" },
  { name: "尺度", icon: <Maximize className="h-4 w-4" />, sectionId: "universe-scale" },
  { name: "黑洞", icon: <Disc className="h-4 w-4" />, sectionId: "blackhole" },
]

export function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState("")
  const [showLabels, setShowLabels] = useState(false)

  // 监听滚动事件，确定当前活动部分
  useEffect(() => {
    const handleScroll = () => {
      // 获取所有部分
      const sections = navigationItems
        .filter(item => item.sectionId)
        .map(item => document.getElementById(item.sectionId));
      
      // 找到当前在视口中的部分
      const currentSection = sections
        .filter(section => section)
        .find(section => {
          const rect = section?.getBoundingClientRect();
          return rect && rect.top <= 200 && rect.bottom >= 200;
        });

      if (currentSection) {
        const activeNavItem = navigationItems.find(item => 
          item.sectionId && document.getElementById(item.sectionId) === currentSection
        );
        if (activeNavItem) {
          setActiveSection(activeNavItem.sectionId);
        }
      } else if (window.scrollY < 100) {
        setActiveSection("");
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll(); // 初始调用以设置初始状态
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 滚动到指定部分
  const scrollToSection = (id: string) => {
    if (id === "") {
      // 首页滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop;
      
      // 添加动画效果
      window.scrollTo({
        top: offsetTop - 80, // 减去navbar高度的偏移量
        behavior: "smooth"
      });
      
      // 添加视觉反馈
      element.classList.add('highlight-section');
      setTimeout(() => {
        element.classList.remove('highlight-section');
      }, 1500);
    }
  };

  return (
    <motion.div 
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col items-center space-y-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      onMouseEnter={() => setShowLabels(true)}
      onMouseLeave={() => setShowLabels(false)}
    >
      {navigationItems.map((item) => (
        <div key={item.sectionId || "home"} className="relative flex items-center group">
          {/* 标签 - 仅在悬停或活动时显示 */}
          <motion.div
            className="absolute right-full mr-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0, x: 10 }}
            animate={{ 
              opacity: showLabels || activeSection === item.sectionId ? 1 : 0,
              x: showLabels || activeSection === item.sectionId ? 0 : 10
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs font-medium">{item.name}</span>
          </motion.div>
          
          {/* 指示器点 */}
          <motion.button 
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
              activeSection === item.sectionId 
                ? 'bg-primary text-white shadow-lg shadow-primary/40' 
                : 'bg-black/30 backdrop-blur-sm border border-white/10 text-white/60 hover:bg-black/40 hover:text-white/90'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scrollToSection(item.sectionId)}
            aria-label={`导航到${item.name}`}
          >
            {item.icon}
          </motion.button>
        </div>
      ))}
    </motion.div>
  )
} 