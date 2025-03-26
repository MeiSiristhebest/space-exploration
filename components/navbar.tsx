"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, Star, Rocket, Globe, ChevronRight, Database, Maximize, Disc } from "lucide-react"

const navItems = [
  { name: "首页", href: "#", icon: <Star className="w-4 h-4" />, sectionId: "" },
  { name: "行星", href: "#planets", icon: <Globe className="w-4 h-4" />, sectionId: "planets" },
  { name: "任务", href: "#missions", icon: <Rocket className="w-4 h-4" />, sectionId: "missions" },
  { name: "数据", href: "#visualization", icon: <Database className="w-4 h-4" />, sectionId: "visualization" },
  { name: "尺度", href: "#universe-scale", icon: <Maximize className="w-4 h-4" />, sectionId: "universe-scale" },
  { name: "黑洞", href: "#blackhole", icon: <Disc className="w-4 h-4" />, sectionId: "blackhole" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("首页")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      const sections = navItems.filter(item => item.sectionId).map(item => 
        document.getElementById(item.sectionId)
      );
      
      const currentSection = sections
        .filter(section => section)
        .find(section => {
          const rect = section?.getBoundingClientRect();
          return rect && rect.top <= 200 && rect.bottom >= 200;
        });

      if (currentSection) {
        const activeNavItem = navItems.find(item => 
          item.sectionId && document.getElementById(item.sectionId) === currentSection
        );
        if (activeNavItem) {
          setActiveItem(activeNavItem.name);
        }
      } else if (window.scrollY < 100) {
        setActiveItem("首页");
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    if (id === "") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop;
      
      window.scrollTo({
        top: offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/70 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-900/20" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"
              animate={{ 
                rotate: 360,
                boxShadow: ["0 0 0px rgba(59, 130, 246, 0.5)", "0 0 20px rgba(59, 130, 246, 0.5)", "0 0 0px rgba(59, 130, 246, 0.5)"]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12a10 10 0 0 1 8 4"></path>
                <path d="M16 12a10 10 0 0 1-8 4"></path>
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
            </motion.div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">COSMOS</span>
          </Link>

          <nav className="hidden md:flex items-center">
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-1 py-1 flex items-center">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="relative"
                >
                  <button
                    onClick={() => {
                      setActiveItem(item.name);
                      scrollToSection(item.sectionId);
                    }}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-colors ${
                      activeItem === item.name 
                        ? "bg-blue-600/80 text-white" 
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className={activeItem === item.name ? "opacity-100" : "opacity-70"}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium ml-1.5">{item.name}</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </nav>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-full ${isMenuOpen ? 'bg-blue-600/80' : 'bg-black/30 border border-white/10'}`}
            >
              {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white/90" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-black/90 backdrop-blur-xl border-t border-blue-500/20"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                key={item.name}
              >
                <button
                  className="flex items-center justify-between p-3 rounded-lg text-white/80 hover:text-white hover:bg-blue-900/20 transition-colors w-full text-left"
                  onClick={() => {
                    scrollToSection(item.sectionId);
                    setIsMenuOpen(false);
                    setActiveItem(item.name);
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-3 rounded-full bg-blue-900/30 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={16} className="text-blue-400" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

