"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ExoplanetDistributionChart, 
  ExplorationMilestonesChart,
  CosmicScaleComparison
} from "@/components/chart-visuals"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Info, PieChart, BarChart, Clock, Maximize, HelpCircle } from "lucide-react"

// 宇宙数据集
const spaceData = [
  {
    id: 1,
    title: "系外行星分布",
    description: "探索迄今为止发现的系外行星类型分布",
    chartType: "pie",
    icon: <PieChart className="w-5 h-5" />,
    chartData: [
      { label: "超级地球", value: 30, color: "#3b82f6" },
      { label: "类地行星", value: 15, color: "#10b981" },
      { label: "气态巨行星", value: 25, color: "#8b5cf6" },
      { label: "热木星", value: 20, color: "#ef4444" },
      { label: "冰巨行星", value: 10, color: "#06b6d4" }
    ],
    insights: "超级地球在已发现的系外行星中占比最高，这表明这种行星类型在我们的银河系可能很常见。由于观测技术的限制，类地行星的发现比例相对较低。",
    metaInfo: [
      { label: "数据来源", value: "NASA系外行星档案馆" },
      { label: "行星总数", value: "5,000+" },
      { label: "主要观测方法", value: "凌日法、径向速度法" }
    ]
  },
  {
    id: 2,
    title: "太阳系大小比较",
    description: "太阳系中各行星直径比较（实际比例展示）",
    chartType: "bar",
    icon: <BarChart className="w-5 h-5" />,
    chartData: [
      { label: "水星", value: 4879, color: "#94a3b8", actualValue: 4879 },
      { label: "金星", value: 12104, color: "#f97316", actualValue: 12104 },
      { label: "地球", value: 12756, color: "#3b82f6", actualValue: 12756 },
      { label: "火星", value: 6792, color: "#ef4444", actualValue: 6792 },
      { label: "木星", value: 142984, color: "#f59e0b", actualValue: 142984 },
      { label: "土星", value: 120536, color: "#f6e05e", actualValue: 120536 },
      { label: "天王星", value: 51118, color: "#06b6d4", actualValue: 51118 },
      { label: "海王星", value: 49528, color: "#2563eb", actualValue: 49528 }
    ],
    insights: "木星和土星作为气体巨行星，直径远超过地球等岩质行星。四颗内行星体积相对较小，而四颗外行星体积巨大，展示了太阳系的结构特征。本图使用实际比例展示各行星大小差异。",
    metaInfo: [
      { label: "最大行星", value: "木星 (142,984 千米)" },
      { label: "最小行星", value: "水星 (4,879 千米)" },
      { label: "地球比例", value: "1 (12,756 千米)" }
    ]
  },
  {
    id: 3,
    title: "太空探索里程碑",
    description: "人类太空探索的重要历史时刻（年份）",
    chartType: "timeline",
    icon: <Clock className="w-5 h-5" />,
    chartData: [
      { label: "第一颗人造卫星", value: 1957, color: "#ef4444" },
      { label: "人类首次太空飞行", value: 1961, color: "#f97316" },
      { label: "首次登月", value: 1969, color: "#f59e0b" },
      { label: "国际空间站", value: 1998, color: "#10b981" },
      { label: "好奇号登陆火星", value: 2012, color: "#06b6d4" },
      { label: "首张黑洞照片", value: 2019, color: "#8b5cf6" },
      { label: "第一架火星直升机", value: 2021, color: "#ec4899" }
    ],
    insights: "太空探索的进展在20世纪60年代达到高峰，随后在21世纪再次加速。每个里程碑都标志着人类理解和探索宇宙能力的重大飞跃。",
    metaInfo: [
      { label: "最早里程碑", value: "斯普特尼克1号 (1957)" },
      { label: "最新里程碑", value: "机智号火星直升机 (2021)" },
      { label: "太空时代", value: "64年+" }
    ]
  },
  {
    id: 4,
    title: "宇宙尺度比较",
    description: "从亚原子到宇宙尺度的对数比较",
    chartType: "scale",
    icon: <Maximize className="w-5 h-5" />,
    chartData: [],
    insights: "宇宙的尺度跨越了超过27个数量级，从普朗克长度到可观测宇宙。这种规模的差异超出了人类的直观理解能力。",
    metaInfo: [
      { label: "最小尺度", value: "原子 (10^-10 米)" },
      { label: "中等尺度", value: "人类 (1.7 米)" },
      { label: "最大尺度", value: "可观测宇宙 (10^26 米)" }
    ]
  }
]

interface DataCardProps {
  data: typeof spaceData[0];
  expanded: boolean;
  onToggle: () => void;
  isNew?: boolean;
}

function DataCard({ data, expanded, onToggle, isNew = false }: DataCardProps) {
  const [hovering, setHovering] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // 根据图表类型渲染不同的可视化组件
  const renderChart = () => {
    if (data.chartType === "pie") {
      return (
        <ExoplanetDistributionChart 
          data={data.chartData}
          title={data.title}
          className="h-[500px] mt-5"
        />
      );
    } else if (data.chartType === "bar" || data.chartType === "timeline") {
      return (
        <ExplorationMilestonesChart 
          data={data.chartData}
          title={data.title}
          className="h-[550px] mt-5"
        />
      );
    } else if (data.chartType === "scale") {
      return (
        <CosmicScaleComparison
          title={data.title}
          className="h-[550px] mt-5"
        />
      );
    }
    return null;
  };

  // 图表类型对应的帮助文本
  const getChartHelp = () => {
    switch (data.chartType) {
      case "pie":
        return "饼图显示了不同类型系外行星的比例分布。将鼠标悬停在扇形区域上可查看详细数据。";
      case "bar":
        return "柱状图显示了太阳系行星的直径大小比较。悬停在柱形上可查看具体数值和行星信息。";
      case "timeline":
        return "时间线图展示了太空探索的关键里程碑。悬停在事件点上可查看历史详情。";
      case "scale":
        return "宇宙尺度图使用对数刻度比较不同尺度的物体大小。悬停在圆环上可查看详细说明。";
      default:
        return "交互式数据可视化。悬停在图表元素上可查看详细信息。";
    }
  };

  return (
    <motion.div 
      className={`space-data-card backdrop-blur-sm rounded-xl overflow-hidden relative ${
        isNew ? 'border-2 border-primary' : 'border border-white/10'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      layout
      style={{
        background: expanded 
          ? 'linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6))' 
          : 'rgba(15, 23, 42, 0.6)'
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {isNew && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
            新数据
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${expanded ? 'bg-primary/20' : 'bg-slate-700/50'}`}>
              {data.icon}
            </div>
            <h3 className="text-xl font-bold text-white">{data.title}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            <Button
              variant={expanded ? "default" : "outline"}
              size="sm"
              onClick={onToggle}
              className={`${expanded 
                ? 'bg-primary hover:bg-primary/90 text-white' 
                : 'text-white/80 hover:text-white hover:bg-white/10 border-white/10'}`}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {expanded ? "收起" : "查看数据"}
            </Button>
          </div>
        </div>
        
        <p className="text-slate-300 mt-2 text-base">{data.description}</p>
        
        <AnimatePresence>
          {showHelp && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 p-3 bg-slate-800/80 border border-white/10 rounded-lg text-sm text-slate-300"
            >
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p>{getChartHelp()}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="relative">
                {renderChart()}
                
                <div className="mt-8 p-6 bg-slate-800/70 rounded-lg border border-white/5">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary" />
                    数据洞察
                  </h4>
                  <p className="text-base text-slate-300">
                    {data.insights}
                  </p>
                  
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {data.metaInfo.map((info, index) => (
                      <div key={index} className="bg-slate-900/50 p-4 rounded-lg">
                        <p className="text-xs text-primary/80 mb-1">{info.label}</p>
                        <p className="text-sm font-medium text-white">{info.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 悬停时显示的提示 */}
        {!expanded && hovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-xs text-center text-white/50"
          >
            点击"查看数据"按钮以探索交互式图表
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function SpaceVisualization() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  
  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };
  
  return (
    <div id="visualization" className="space-y-8 max-w-[1300px] mx-auto">
      {/* 移除重复的导航栏，仅保留页面内容 */}
      <div className="space-y-8 px-4">
        {spaceData.map((data) => (
          <DataCard
            key={data.id}
            data={data}
            expanded={expandedCard === data.id}
            onToggle={() => toggleCard(data.id)}
            isNew={data.id === 4}
          />
        ))}
      </div>
    </div>
  );
}

// 独立的渲染图表函数
function renderChart(data: typeof spaceData[0]) {
  if (data.chartType === "pie") {
    return (
      <ExoplanetDistributionChart 
        data={data.chartData}
        title={data.title}
        className="h-[500px] mt-5"
      />
    );
  } else if (data.chartType === "bar") {
    return (
      <ExplorationMilestonesChart 
        data={data.chartData}
        title={data.title}
        className="h-[550px] mt-5"
      />
    );
  } else if (data.chartType === "timeline") {
    return (
      <ExplorationMilestonesChart 
        data={data.chartData}
        title={data.title}
        className="h-[550px] mt-5"
      />
    );
  } else if (data.chartType === "scale") {
    return (
      <CosmicScaleComparison
        title={data.title}
        className="h-[550px] mt-5"
      />
    );
  }
  return null;
} 