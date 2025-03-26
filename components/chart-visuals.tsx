import React, { useEffect, useRef, useState } from 'react';

// 添加放大模式组件
function ChartFullscreenModal({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="bg-slate-900/90 w-full max-w-6xl max-h-[90vh] overflow-auto rounded-2xl border border-white/10 p-2 sm:p-4 md:p-6">
        <div className="flex justify-end mb-2">
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-[75vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ChartProps {
  className?: string;
}

interface PieChartProps extends ChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  title?: string;
}

interface BarChartProps extends ChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  title?: string;
  maxValue?: number;
}

interface CosmicScaleProps extends ChartProps {
  title?: string;
}

export function ExoplanetDistributionChart({ data, className, title }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState({ left: 0, top: 0, opacity: 0 });
  const [tooltipContent, setTooltipContent] = useState({ label: '', value: 0, percentage: 0 });
  
  // 跟踪扇形的位置和大小，用于检测悬停
  const sliceRefs = useRef<Array<{
    startAngle: number;
    endAngle: number;
    centerX: number;
    centerY: number;
    radius: number;
  }>>([]);
  
  // 检查鼠标是否在扇形内
  const isPointInSlice = (x: number, y: number, centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    // 计算点到中心的距离
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 如果距离超出半径，则不在扇形内
    if (distance > radius) return false;
    
    // 计算点的角度（从正x轴开始，逆时针）
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI; // 转换为 0-2π 范围
    
    // 检查角度是否在扇形的角度范围内
    if (startAngle <= endAngle) {
      return angle >= startAngle && angle <= endAngle;
    } else {
      // 处理跨越 0 角度的情况
      return angle >= startAngle || angle <= endAngle;
    }
  };
  
  // 处理鼠标移动事件
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 检查鼠标是否在某个扇形上
    let found = false;
    sliceRefs.current.forEach((slice, index) => {
      if (isPointInSlice(
        x, y, 
        slice.centerX, 
        slice.centerY, 
        slice.radius, 
        slice.startAngle, 
        slice.endAngle
      )) {
        setHoveredSlice(index);
        
        // 更新工具提示内容和位置
        const tooltipX = x + 10;
        const tooltipY = y + 10;
        setTooltipStyle({
          left: tooltipX,
          top: tooltipY,
          opacity: 1
        });
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const percentage = (data[index].value / total) * 100;
        setTooltipContent({
          label: data[index].label,
          value: data[index].value,
          percentage
        });
        
        found = true;
      }
    });
    
    if (!found) {
      setHoveredSlice(null);
      setTooltipStyle({ ...tooltipStyle, opacity: 0 });
    }
  };
  
  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    setHoveredSlice(null);
    setTooltipStyle({ ...tooltipStyle, opacity: 0 });
  };
  
  // 全屏模式状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置绘图比例以适应高DPI屏幕
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // 绘制饼图
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    let total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    
    // 重置扇形引用
    sliceRefs.current = [];
    
    // 首先绘制背景圆
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fill();
    
    // 添加中心圆圈和放射线
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();
    
    // 放射线
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const innerRadius = radius * 0.2;
      const outerRadius = radius * 0.95;
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(angle) * innerRadius,
        centerY + Math.sin(angle) * innerRadius
      );
      ctx.lineTo(
        centerX + Math.cos(angle) * outerRadius,
        centerY + Math.sin(angle) * outerRadius
      );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    data.forEach((item, index) => {
      // 计算扇形角度
      const sliceAngle = 2 * Math.PI * item.value / total;
      const endAngle = startAngle + sliceAngle;
      
      // 存储扇形位置和大小
      sliceRefs.current.push({
        startAngle,
        endAngle,
        centerX,
        centerY,
        radius
      });
      
      // 绘制扇形
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      
      // 如果该扇形被悬停，稍微向外突出显示
      const hoverOffset = hoveredSlice === index ? 10 : 0;
      const midAngle = startAngle + sliceAngle / 2;
      const offsetX = Math.cos(midAngle) * hoverOffset;
      const offsetY = Math.sin(midAngle) * hoverOffset;
      
      // 修改绘制方式，保持圆心不变，只调整半径
      ctx.arc(
        centerX, 
        centerY, 
        radius + (hoveredSlice === index ? hoverOffset : 0), 
        startAngle, 
        endAngle
      );
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      
      // 设置颜色和阴影
      const alpha = hoveredSlice === index ? 1 : 0.85;  // 增加非悬停元素的不透明度
      ctx.fillStyle = item.color + (alpha < 1 ? Math.round(alpha * 255).toString(16) : '');
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = hoveredSlice === index ? 15 : 5;  // 增大阴影模糊效果
      ctx.shadowOffsetX = hoveredSlice === index ? 5 : 3;
      ctx.shadowOffsetY = hoveredSlice === index ? 5 : 3;
      ctx.fill();
      
      // 添加高光效果
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const highlightAngle = Math.min(sliceAngle, Math.PI / 6); // 限制高光角度
      ctx.arc(
        centerX, 
        centerY, 
        radius + (hoveredSlice === index ? hoverOffset : 0), 
        startAngle, 
        startAngle + highlightAngle
      );
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fill();
      
      // 添加标签线和标签
      const labelAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * (hoveredSlice === index ? 0.75 : 0.7);
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;
      
      // 标签连接线
      const outerRadius = radius + (hoveredSlice === index ? hoverOffset : 0) + 5;
      const outerX = centerX + Math.cos(labelAngle) * outerRadius;
      const outerY = centerY + Math.sin(labelAngle) * outerRadius;
      
      ctx.beginPath();
      ctx.moveTo(labelX, labelY);
      ctx.lineTo(outerX, outerY);
      ctx.strokeStyle = hoveredSlice === index ? '#ffffff' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = hoveredSlice === index ? 2 : 1;
      ctx.stroke();
      
      // 添加标签
      ctx.font = hoveredSlice === index ? 'bold 14px sans-serif' : '12px sans-serif';
      ctx.fillStyle = hoveredSlice === index ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.label}`, labelX, labelY);
      
      // 百分比标签
      if (hoveredSlice === index) {
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${Math.round(item.value / total * 100)}%`, labelX, labelY + 20);
      } else {
        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`${Math.round(item.value / total * 100)}%`, labelX, labelY + 16);
      }
      
      startAngle = endAngle;
    });
    
    // 添加标题
    if (title) {
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(title, centerX, 20);
    }
    
  }, [data, title, hoveredSlice]);
  
  return (
    <>
      <div
        className={`relative ${className || ""}`}
        onClick={() => setIsFullscreen(true)}
        style={{ cursor: 'pointer' }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-pointer"
          style={{ width: '100%', height: '100%' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        {/* 添加一个放大提示 */}
        <div className="absolute top-2 right-2 bg-white/10 rounded-full p-1.5 text-white/70 hover:text-white/100 hover:bg-white/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </div>
      </div>
      <div 
        className="absolute pointer-events-none bg-slate-900/95 text-white px-4 py-3 rounded-md border-2 shadow-xl z-10 transition-opacity duration-200"
        style={{
          left: `${tooltipStyle.left}px`,
          top: `${tooltipStyle.top}px`,
          opacity: tooltipStyle.opacity,
          borderColor: tooltipContent.label ? data.find(item => item.label === tooltipContent.label)?.color : 'white',
        }}
      >
        <div className="font-bold text-lg" style={{ 
          color: tooltipContent.label ? data.find(item => item.label === tooltipContent.label)?.color : 'white'
        }}>{tooltipContent.label}</div>
        <div className="text-sm mt-1">数量: <span className="font-semibold">{tooltipContent.value}</span></div>
        <div className="text-sm">占比: <span className="font-semibold bg-slate-800 px-2 py-0.5 rounded-sm ml-1">{tooltipContent.percentage.toFixed(1)}%</span></div>
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-white/50">
        <span>鼠标悬停显示详情</span>
      </div>

      {/* 全屏模态框 */}
      <ChartFullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <ExoplanetDistributionChart
          data={data}
          title={title}
          className="h-full"
        />
      </ChartFullscreenModal>
    </>
  );
}

export function ExplorationMilestonesChart({ data, className, title, maxValue }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [barCoordinates, setBarCoordinates] = useState<Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
  }>>([]);
  const [tooltipInfo, setTooltipInfo] = useState({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    value: 0,
    color: '',
    details: ''
  });
  
  // 全屏模式状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 获取里程碑的详细描述
  const getMilestoneDetails = (label: string, value: number, data: any) => {
    // 检查是否有actualValue字段，说明是太阳系行星数据
    if ('actualValue' in data) {
      // 这是行星直径数据
      return `直径：${(data as any).actualValue.toLocaleString()} 千米`;
    } else {
      // 这是时间轴数据，返回年份格式
      const detailsMap: Record<string, string> = {
        "第一颗人造卫星": `1957年10月4日，苏联发射了第一颗人造卫星"斯普特尼克1号"，开启了太空时代。`,
        "人类首次太空飞行": `1961年4月12日，苏联宇航员尤里·加加林成为首位进入太空的人类，在"东方1号"飞船中环绕地球飞行了108分钟。`,
        "首次登月": `1969年7月20日，美国宇航员尼尔·阿姆斯特朗成为第一个踏上月球表面的人，阿波罗11号任务实现了人类首次登月。`,
        "国际空间站": `1998年11月20日，国际空间站第一个模块"曙光号"发射升空，标志着这一人类历史上最大的国际合作科学项目正式开始。`,
        "好奇号登陆火星": `2012年8月6日，NASA的"好奇号"火星车成功着陆火星表面，开始了对火星盖尔陨石坑的探索任务。`,
        "首张黑洞照片": `2019年4月10日，事件视界望远镜合作组织公布了人类历史上首张黑洞照片，展示了M87星系中心超大质量黑洞的轮廓。`,
        "第一架火星直升机": `2021年4月19日，NASA的"机智号"火星直升机完成了人类在另一个星球上的首次动力飞行。`
      };
      
      return detailsMap[label] || `${value}年，${label}成为人类太空探索的重要里程碑。`;
    }
  };
  
  // 处理鼠标移动事件
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 检查鼠标位置是否在某个柱状图上
    const foundBarIndex = barCoordinates.findIndex(bar => 
      x >= bar.x && x <= bar.x + bar.width && y >= bar.y && y <= bar.y + bar.height
    );
    
    if (foundBarIndex !== -1) {
      setHoveredBar(foundBarIndex);
      
      const item = data[foundBarIndex];
      const isActualValueExists = 'actualValue' in item;
      
      // 创建工具提示内容
      setTooltipInfo({
        visible: true,
        x,
        y,
        label: item.label,
        value: isActualValueExists ? (item as any).actualValue : item.value,
        color: item.color,
        // 对于太阳系行星和时间轴使用不同的详情文本格式
        details: isActualValueExists
          ? getPlanetDetails(item.label, (item as any).actualValue)
          : getMilestoneDetails(item.label, item.value, item)
      });
    } else {
      setHoveredBar(null);
      setTooltipInfo({ ...tooltipInfo, visible: false });
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置绘图比例以适应高DPI屏幕
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // 计算最大值和最小值
    const sortedData = [...data].sort((a, b) => a.value - b.value);
    const minValue = sortedData[0].value;
    const maxActualValue = sortedData[sortedData.length - 1].value;
    
    // 为了更好的布局，扩展范围
    const effectiveMinValue = Math.floor(minValue / 10) * 10 - 5; // 向下取整到十位再减5年
    const effectiveMaxValue = Math.ceil(maxActualValue / 10) * 10 + 5; // 向上取整到十位再加5年
    const valueRange = effectiveMaxValue - effectiveMinValue;
    
    // 定义绘图区域
    const padding = { top: 50, right: 40, bottom: 90, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;
    
    // 清除画布
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // 绘制背景
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);
    
    // 添加水平参考线
    const referenceLineCount = 5;
    for (let i = 0; i <= referenceLineCount; i++) {
      const yPos = padding.top + (chartHeight / referenceLineCount) * i;
      
      ctx.beginPath();
      ctx.moveTo(padding.left, yPos);
      ctx.lineTo(padding.left + chartWidth, yPos);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = i === referenceLineCount ? 2 : 1; // 底部线加粗
      ctx.stroke();
    }
    
    // 绘制标题背景
    if (title) {
      const titleWidth = ctx.measureText(title).width + 40;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(rect.width/2 - titleWidth/2, 10, titleWidth, 30);
    }
    
    // 绘制时间轴线
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight + 5);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight + 5);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 根据数据类型选择适当的刻度和标记
    if ('actualValue' in data[0]) {
      // 这是太阳系行星直径数据，不需要时间轴刻度
      // 仅绘制一条分隔线
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top + chartHeight + 5);
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight + 5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // 这是时间轴数据，使用年份刻度
      // 时间轴刻度 - 使用固定的10年间隔
      const yearStep = 10; // 每10年一个主刻度
      const majorYearStep = 20; // 每20年一个加强刻度
      const decadeStart = Math.floor(effectiveMinValue / 10) * 10;
      
      // 首先绘制背景带状标记(交替浅色背景区域)
      let isAlternate = false;
      for (let year = decadeStart; year <= effectiveMaxValue; year += yearStep * 2) {
        const xStart = padding.left + ((year - effectiveMinValue) / valueRange) * chartWidth;
        const xEnd = padding.left + ((Math.min(year + yearStep * 2, effectiveMaxValue) - effectiveMinValue) / valueRange) * chartWidth;
        const width = xEnd - xStart;
        
        if (isAlternate) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.fillRect(xStart, padding.top, width, chartHeight);
        }
        isAlternate = !isAlternate;
      }
      
      // 绘制次要刻度线(10年间隔)
      for (let year = decadeStart; year <= effectiveMaxValue; year += yearStep) {
        const xPos = padding.left + ((year - effectiveMinValue) / valueRange) * chartWidth;
        
        // 绘制刻度线
        ctx.beginPath();
        ctx.moveTo(xPos, padding.top + chartHeight + 5);
        ctx.lineTo(xPos, padding.top + chartHeight + 8);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 添加小刻度标签
        ctx.font = '10px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText(year.toString(), xPos, padding.top + chartHeight + 20);
      }
      
      // 绘制主要刻度和年份标签(20年间隔)
      for (let year = decadeStart; year <= effectiveMaxValue; year += majorYearStep) {
        const xPos = padding.left + ((year - effectiveMinValue) / valueRange) * chartWidth;
        
        // 绘制主刻度线
        ctx.beginPath();
        ctx.moveTo(xPos, padding.top + chartHeight + 5);
        ctx.lineTo(xPos, padding.top + chartHeight + 15);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // 添加主刻度标签背景
        const yearText = year.toString();
        const textWidth = ctx.measureText(yearText).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(xPos - textWidth/2 - 4, padding.top + chartHeight + 24, textWidth + 8, 20);
        
        // 绘制年份
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(yearText, xPos, padding.top + chartHeight + 38);
        
        // 绘制垂直参考线
        ctx.beginPath();
        ctx.moveTo(xPos, padding.top);
        ctx.lineTo(xPos, padding.top + chartHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.setLineDash([4, 4]); // 虚线
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]); // 重置回实线
      }
    }
    
    // 存储柱形坐标
    const newBarCoordinates: typeof barCoordinates = [];
    
    // 为太阳系行星数据特别优化布局
    if ('actualValue' in data[0]) {
      // 太阳系行星的数据 - 计算分组显示
      const barWidth = Math.min(chartWidth / data.length * 0.6, 30); // 缩小单个柱状图宽度
      const groupPadding = 60; // 增加组间距
      const innerPadding = 15; // 组内间距
      
      // 根据行星类型分组：内行星组、外行星组
      const innerPlanets = ['水星', '金星', '地球', '火星'];
      const outerPlanets = ['木星', '土星', '天王星', '海王星'];
      
      // 计算每组的起始位置
      const groupWidth = (barWidth * 4) + (innerPadding * 3); // 每组4个行星
      const startX1 = padding.left + chartWidth/2 - groupPadding/2 - groupWidth;
      const startX2 = padding.left + chartWidth/2 + groupPadding/2;
      
      // 绘制组标签 - 添加背景增强可读性
      ctx.font = 'bold 14px sans-serif';
      
      // 内行星组标签背景
      const innerLabelWidth = ctx.measureText('内行星').width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(
        startX1 + groupWidth/2 - innerLabelWidth/2 - 8, 
        padding.top - 25, 
        innerLabelWidth + 16, 
        22
      );
      
      // 外行星组标签背景  
      const outerLabelWidth = ctx.measureText('外行星').width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(
        startX2 + groupWidth/2 - outerLabelWidth/2 - 8, 
        padding.top - 25, 
        outerLabelWidth + 16, 
        22
      );
      
      // 组标签文字
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText('内行星', startX1 + groupWidth/2, padding.top - 15);
      ctx.fillText('外行星', startX2 + groupWidth/2, padding.top - 15);
      
      // 绘制分组背景
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(startX1, padding.top, groupWidth, chartHeight);
      ctx.fillRect(startX2, padding.top, groupWidth, chartHeight);
      
      // 添加分组边框增强视觉区分
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(startX1, padding.top, groupWidth, chartHeight);
      ctx.strokeRect(startX2, padding.top, groupWidth, chartHeight);
      
      // 找出最大行星直径以计算比例
      const maxActualValue = Math.max(...data.map(item => (item as any).actualValue));
      
      // 存储地球的Y位置，用于绘制参考线
      let earthY = 0;
      let earthBarHeight = 0;
      
      // 为每个行星分配位置
      data.forEach((item, index) => {
        let barX = 0;
        // 确定行星所在组及其在组内的位置
        const isInnerPlanet = innerPlanets.includes(item.label);
        const groupIndex = isInnerPlanet ? 
                          innerPlanets.indexOf(item.label) : 
                          outerPlanets.indexOf(item.label);
                          
        if (isInnerPlanet) {
          barX = startX1 + groupIndex * (barWidth + innerPadding);
        } else {
          barX = startX2 + groupIndex * (barWidth + innerPadding);
        }
        
        // 计算柱形的高度 - 完全按照真实行星直径比例
        const maxBarHeight = chartHeight - 20;
        const ratio = (item as any).actualValue / maxActualValue;
        
        // 为内行星组使用更高的比例，确保差异可见
        let scaledRatio = ratio;
        if (isInnerPlanet) {
          // 对内行星应用非线性缩放以增强可见性
          // 使用平方根缩放可以增强小行星的可见性
          scaledRatio = Math.sqrt(ratio) * 0.3; // 添加一个系数来调整高度
        }
        
        // 确保最小高度，让小行星也能清晰可见
        const barHeight = Math.max(scaledRatio * maxBarHeight, 10);
        const barY = padding.top + chartHeight - barHeight;
        
        // 特别记录地球的位置用于参考线
        if (item.label === '地球') {
          earthY = barY;
          earthBarHeight = barHeight;
        }
        
        // 存储坐标
        newBarCoordinates.push({
          x: barX,
          y: barY,
          width: barWidth,
          height: barHeight,
          value: item.value
        });
        
        // 绘制柱形
        const barOpacity = hoveredBar === index ? 1 : 0.7;
        
        // 绘制渐变填充
        const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY + barHeight);
        
        // 根据行星分组设置不同渐变色
        if (isInnerPlanet) {
          gradient.addColorStop(0, `${item.color}${barOpacity < 1 ? 'cc' : ''}`);
          gradient.addColorStop(1, `${item.color}${barOpacity < 1 ? '88' : 'cc'}`);
        } else {
          gradient.addColorStop(0, `${item.color}${barOpacity < 1 ? 'cc' : ''}`);
          gradient.addColorStop(1, `${item.color}${barOpacity < 1 ? '88' : 'cc'}`);
        }
        
        ctx.fillStyle = gradient;
        
        // 添加阴影效果
        if (hoveredBar === index) {
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 20;  // 增大阴影模糊效果
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } else {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 8;  // 增大常规阴影
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }
        
        // 绘制柱形前增加发光效果底层
        if (hoveredBar === index) {
          // 添加发光效果底层
          ctx.beginPath();
          ctx.roundRect(barX-3, barY-3, barWidth+6, barHeight+6, [8, 8, 3, 3]);
          ctx.fillStyle = `${item.color}33`;  // 半透明的颜色
          ctx.fill();
        }
        
        // 绘制柱形 - 增强颜色饱和度
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, [5, 5, 0, 0]);
        ctx.fill();
        
        // 重置阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // 添加轮廓
        ctx.strokeStyle = hoveredBar === index ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = hoveredBar === index ? 1.5 : 0.5;
        ctx.stroke();
        
        // 显示行星名称
        ctx.font = hoveredBar === index ? 'bold 13px sans-serif' : '12px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // 为底部标签创建背景以增强可读性
        const labelText = item.label;
        const labelWidth = ctx.measureText(labelText).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(
          barX + barWidth/2 - labelWidth/2 - 4,
          padding.top + chartHeight + 13,
          labelWidth + 8,
          18
        );
        
        // 绘制行星名称
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillText(item.label, barX + barWidth / 2, padding.top + chartHeight + 15);
        
        // 添加直径标记于柱状图顶部
        const rawValue = (item as any).actualValue;
        let topLabel;
        
        // 根据大小确定显示方式
        if (rawValue >= 100000) {
          topLabel = `${(rawValue / 1000).toFixed(0)}k`;
        } else if (rawValue >= 10000) {
          topLabel = `${(rawValue / 1000).toFixed(1)}k`;
        } else {
          topLabel = rawValue.toLocaleString();
        }
        
        // 绘制顶部标签背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const topLabelWidth = ctx.measureText(topLabel).width;
        ctx.beginPath();
        ctx.roundRect(
          barX + barWidth/2 - topLabelWidth/2 - 4,
          barY - 20,
          topLabelWidth + 8,
          18,
          4
        );
        ctx.fill();
        
        // 绘制顶部标签
        ctx.fillStyle = item.color;
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(topLabel, barX + barWidth/2, barY - 11);
        
        // 显示直径数值 - 调整位置避免重叠
        const displayValue = (item as any).actualValue;
        let formattedValue;
        
        if (displayValue >= 100000) {
          formattedValue = `${(displayValue / 1000).toFixed(0)}k`;
        } else {
          formattedValue = displayValue.toLocaleString();
        }
        
        // 分开显示数值，避免和行星名称重叠
        const valueText = `${formattedValue} km`;
        const valueWidth = ctx.measureText(valueText).width;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(
          barX + barWidth/2 - valueWidth/2 - 4,
          padding.top + chartHeight + 35,
          valueWidth + 8,
          18
        );
        
        ctx.font = '11px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(valueText, barX + barWidth / 2, padding.top + chartHeight + 44);
        
        // 调整比例标记位置和大小，确保完全可见
        const earthSize = 12756; // 地球直径
        const proportion = (item as any).actualValue / earthSize;
        
        if (item.label !== '地球') {
          const propText = proportion >= 1 ? 
                          `${proportion.toFixed(1)}× 地球` : 
                          `${Math.round((proportion) * 100)}% 地球`;
          
          ctx.font = '10px sans-serif';
          const propWidth = ctx.measureText(propText).width;
          
          // 比例标记位置调整 - 放在柱形内部中部位置
          const propBgX = barX + barWidth / 2 - propWidth / 2 - 5;
          const propBgY = barY + barHeight * 0.6; // 位于柱形中部而非底部
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.beginPath();
          ctx.roundRect(propBgX, propBgY, propWidth + 10, 20, 4);
          ctx.fill();
          
          // 边框
          ctx.strokeStyle = proportion >= 1 ? 
                          'rgba(74, 222, 128, 0.5)' : 
                          'rgba(252, 165, 165, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // 比例文本
          ctx.fillStyle = proportion >= 1 ? 
                        'rgba(74, 222, 128, 0.9)' : 
                        'rgba(252, 165, 165, 0.9)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(propText, barX + barWidth / 2, propBgY + 10);
        }
      });
      
      // 在所有行星绘制完成后，添加地球参考线
      // 绘制参考线 - 确保与地球高度一致
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(padding.left, earthY);
      ctx.lineTo(padding.left + chartWidth, earthY);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      
      // 添加地球参考标签
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      // 获取地球直径值
      const earthData = data.find(item => item.label === '地球');
      const earthDiameter = (earthData as any).actualValue;
      
      // 标签背景
      const refText = `地球直径: ${earthDiameter.toLocaleString()} km`;
      const textWidth = ctx.measureText(refText).width;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(padding.left + 5, earthY - 10, textWidth + 10, 20);
      
      // 标签边框
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(padding.left + 5, earthY - 10, textWidth + 10, 20);
      
      // 标签文本
      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.fillText(refText, padding.left + 10, earthY);
    } else {
      // 原时间轴数据的常规柱状图布局
      const barWidth = Math.min(chartWidth / data.length * 0.5, 40);
      
      // 绘制事件节点
      data.forEach((item, index) => {
        const xPos = padding.left + ((item.value - effectiveMinValue) / valueRange) * chartWidth;
        
        // 计算柱形的大小
        const barHeight = chartHeight - 20; // 留出顶部空间
        const barX = xPos - barWidth / 2;
        const barY = padding.top + 10; // 从顶部开始
        
        // 存储坐标
        newBarCoordinates.push({
          x: barX,
          y: barY,
          width: barWidth,
          height: barHeight,
          value: item.value
        });
        
        // 绘制垂直连接线
        ctx.beginPath();
        ctx.moveTo(xPos, barY + barHeight);
        ctx.lineTo(xPos, padding.top + chartHeight + 5);
        ctx.strokeStyle = hoveredBar === index ? item.color : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = hoveredBar === index ? 2 : 1;
        ctx.stroke();
        
        // 绘制事件节点圆点
        ctx.beginPath();
        ctx.arc(xPos, padding.top + chartHeight + 5, hoveredBar === index ? 8 : 6, 0, 2 * Math.PI);
        ctx.fillStyle = hoveredBar === index ? item.color : 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        
        // 当悬停时添加发光效果
        if (hoveredBar === index) {
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(xPos, padding.top + chartHeight + 5, 8, 0, 2 * Math.PI);
          ctx.fillStyle = item.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        
        // 绘制柱形
        const barOpacity = hoveredBar === index ? 1 : 0.7;
        const barColor = item.color + (barOpacity < 1 ? Math.round(barOpacity * 255).toString(16) : '');
        
        ctx.fillStyle = barColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = hoveredBar === index ? 10 : 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.beginPath();
        ctx.roundRect(barX, barY, barWidth, barHeight, [5, 5, 0, 0]);
        ctx.fill();
        
        // 重置阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // 时间轴事件标签，恢复之前的倾斜显示
        // 计算标签位置和角度
        // 使标签均匀分布，避免重叠
        const labelOffset = index % 2 === 0 ? 50 : 70; // 交错排列标签
        const labelAngle = -Math.PI / 4; // 倾斜角度
        
        // 绘制事件标签
        ctx.save();
        ctx.translate(xPos, padding.top + chartHeight + labelOffset);
        ctx.rotate(labelAngle);
        
        ctx.font = hoveredBar === index ? 'bold 12px sans-serif' : '12px sans-serif';
        ctx.fillStyle = hoveredBar === index ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'right';
        ctx.fillText(item.label, 0, 0);
        ctx.restore();
        
        // 绘制年份标签（内部）
        ctx.font = hoveredBar === index ? 'bold 14px sans-serif' : '12px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        
        // 显示实际数值
        ctx.fillText(item.value.toString(), barX + barWidth / 2, barY + 20);
      });
    }
    
    // 更新柱形坐标
    setBarCoordinates(newBarCoordinates);
    
    // 添加标题
    if (title) {
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title, rect.width / 2, 25);
      
      // 如果是太阳系行星数据，更新说明文本
      if ('actualValue' in data[0]) {
        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        const scaleText = '实际比例显示，展示行星间真实大小差异';
        ctx.fillText(scaleText, rect.width / 2, 45);
      }
    }
    
    // 给坐标轴添加标签
    if ('actualValue' in data[0]) {
      // 太阳系行星比较图 - 添加明显的坐标轴标签
      
      // X轴标签 - 明显强调这是直径
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      
      // 创建标签背景
      const xLabelText = '行星直径 (千米)';
      const xLabelWidth = ctx.measureText(xLabelText).width;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(
        rect.width/2 - xLabelWidth/2 - 10,
        padding.top + chartHeight + 55,
        xLabelWidth + 20,
        25
      );
      
      // 添加边框
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'; // 使用蓝色突出显示
      ctx.lineWidth = 1.5;
      ctx.strokeRect(
        rect.width/2 - xLabelWidth/2 - 10,
        padding.top + chartHeight + 55,
        xLabelWidth + 20,
        25
      );
      
      // 标签文字
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(xLabelText, rect.width/2, padding.top + chartHeight + 70);
      
      // Y轴标签
      ctx.save();
      ctx.translate(20, padding.top + chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      
      const yLabelText = '直径大小';
      const yLabelWidth = ctx.measureText(yLabelText).width;
      
      // Y轴标签背景
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(-yLabelWidth/2 - 10, -15, yLabelWidth + 20, 30);
      
      // Y轴标签边框
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-yLabelWidth/2 - 10, -15, yLabelWidth + 20, 30);
      
      // Y轴标签文字
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(yLabelText, 0, 0);
      
      ctx.restore();
      
      // 添加实际比例说明
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      // 说明文字背景
      const noteText = '注：行星直径按真实比例显示';
      const noteWidth = ctx.measureText(noteText).width;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(padding.left, padding.top - 25, noteWidth + 16, 20);
      
      // 说明文字
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(noteText, padding.left + 8, padding.top - 20);
    }
  }, [data, title, hoveredBar, maxValue]);
  
  return (
    <>
      <div 
        className={`relative ${className || ""}`}
        onClick={() => setIsFullscreen(true)}
        style={{ cursor: 'pointer' }}
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-pointer"
          style={{ width: '100%', height: '100%' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredBar(null);
            setTooltipInfo({ ...tooltipInfo, visible: false });
          }}
        />
        {/* 添加一个放大提示 */}
        <div className="absolute top-2 right-2 bg-white/10 rounded-full p-1.5 text-white/70 hover:text-white/100 hover:bg-white/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </div>
      </div>
      
      {tooltipInfo.visible && (
        <div 
          className="absolute pointer-events-none z-10 transition-all duration-200 ease-in-out"
          style={{
            left: tooltipInfo.x,
            top: tooltipInfo.y - 120,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="relative">
            <div 
              className="bg-slate-900/95 text-white px-5 py-4 rounded-md border-2 shadow-xl max-w-[350px]"
              style={{ borderColor: tooltipInfo.color }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-lg" style={{ color: tooltipInfo.color }}>{tooltipInfo.label}</div>
                <div className="text-sm font-semibold bg-slate-800 px-2 py-1 rounded">{tooltipInfo.value}</div>
              </div>
              <div 
                className="text-sm mt-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tooltipInfo.details }}
              />
              <div 
                className="absolute w-4 h-4 rotate-45 bg-slate-900/95"
                style={{ 
                  bottom: '-8px', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  borderRight: `2px solid ${tooltipInfo.color}`,
                  borderBottom: `2px solid ${tooltipInfo.color}`
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-2 right-2 text-xs text-white/50">
        <span>鼠标悬停查看详情</span>
      </div>

      {/* 全屏模态框 */}
      <ChartFullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <ExplorationMilestonesChart
          data={data}
          title={title}
          className="h-full"
        />
      </ChartFullscreenModal>
    </>
  );
}

export function CosmicScaleComparison({ className, title }: CosmicScaleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredScale, setHoveredScale] = useState<number | null>(null);
  const [infoPosition, setInfoPosition] = useState({ x: 0, y: 0 });
  
  // 全屏模式状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const scaleData = [
    { 
      scale: '普朗克', 
      size: 1.616e-35, 
      color: 'rgb(190, 24, 93)',
      description: '普朗克长度约1.6×10^-35米，是物理学中最小的有意义长度',
      example: '宇宙中最小的长度单位，量子引力的尺度'
    },
    { 
      scale: '原子核', 
      size: 1.7e-15, 
      color: 'rgb(185, 28, 28)',
      description: '原子核直径约1-15飞米(10^-15米)，由质子和中子组成',
      example: '比原子小约10万倍，包含了原子几乎全部的质量'
    },
    { 
      scale: '原子', 
      size: 0.0000000001, 
      color: 'rgb(239, 68, 68)',
      description: '原子半径约0.1纳米，是物质的基本构成单位',
      example: '一个氢原子直径约为百万分之一毫米'
    },
    { 
      scale: '细菌', 
      size: 0.000001, 
      color: 'rgb(245, 158, 11)',
      description: '细菌大小约1-10微米，是最简单的生命形式之一',
      example: '大肠杆菌长约2微米，宽约0.5微米'
    },
    { 
      scale: '微观', 
      size: 0.00001, 
      color: 'rgb(249, 115, 22)',
      description: '微观尺度在10-100微米之间，需要显微镜才能观察',
      example: '人体红细胞直径约7-8微米'
    },
    { 
      scale: '人类', 
      size: 1.7, 
      color: 'rgb(59, 130, 246)',
      description: '人类平均身高约1.7米，是中等尺度的生物',
      example: '相当于17亿个原子排成一排'
    },
    { 
      scale: '地球', 
      size: 12742000, 
      color: 'rgb(37, 99, 235)',
      description: '地球直径约12,742千米，是太阳系中的第五大行星',
      example: '赤道周长约40,075千米'
    },
    { 
      scale: '太阳系', 
      size: 14959787070000, 
      color: 'rgb(124, 58, 237)',
      description: '太阳系直径约9万个天文单位（约1.4万亿千米）',
      example: '从太阳到最外层的柯伊伯带'
    },
    { 
      scale: '银河系', 
      size: 1.5e+21, 
      color: 'rgb(139, 92, 246)',
      description: '银河系直径约10万光年，包含约2000-4000亿颗恒星',
      example: '光速行进10万年才能从一端到达另一端'
    },
    { 
      scale: '星系群', 
      size: 4.73e+22, 
      color: 'rgb(192, 38, 211)',
      description: '本星系群直径约300万光年，包含超过54个星系',
      example: '仙女座星系是本星系群中最大的星系'
    },
    { 
      scale: '宇宙', 
      size: 8.8e+26, 
      color: 'rgb(236, 72, 153)',
      description: '可观测宇宙直径约930亿光年，包含约2万亿个星系',
      example: '自大爆炸以来，光线能传播的最远距离'
    }
  ];
  
  // 处理鼠标移动事件
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 确保使用固定的中心点坐标，与绘制时一致
    const centerX = Math.floor(rect.width / 2);
    const centerY = Math.floor(rect.height / 2);
    const intCenterX = centerX;
    const intCenterY = centerY;
    
    // 检查鼠标是否在某个圆上
    for (let i = 0; i < scaleData.length; i++) {
      const logSize = logTransform(scaleData[i].size);
      const maxLogSize = logTransform(scaleData[scaleData.length - 1].size);
      const radius = Math.floor((logSize / maxLogSize) * (Math.min(centerX, centerY) * 0.85));
      
      // 检查鼠标位置是否在圆环区域内
      const distance = Math.sqrt(Math.pow(x - intCenterX, 2) + Math.pow(y - intCenterY, 2));
      const tolerance = 15; // 点击容差
      
      if (Math.abs(distance - radius) < tolerance) {
        setHoveredScale(i);
        setInfoPosition({ x, y: y - 10 });
        return;
      }
    }
    
    setHoveredScale(null);
  };
  
  // 对数转换函数
  const logTransform = (value: number) => {
    return Math.log10(value + 1);
  };
  
  // 格式化大数字
  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    if (num < 1e-30) return num.toExponential(2) + ' 米';
    if (num < 1e-15) return `${(num * 1e+15).toFixed(2)} 飞米`;
    if (num < 1e-9) return `${(num * 1e+9).toFixed(2)} 纳米`;
    if (num < 1e-6) return `${(num * 1e+6).toFixed(2)} 微米`;
    if (num < 0.001) return `${(num * 1000).toFixed(2)} 毫米`;
    if (num < 1) return `${(num * 100).toFixed(2)} 厘米`;
    if (num < 1000) return `${num.toFixed(2)} 米`;
    if (num < 1000000) return `${(num/1000).toFixed(2)} 千米`;
    if (num < 9.461e+15) return `${(num/1000000000).toFixed(2)} 百万千米`;
    return `${(num/9.461e+15).toFixed(2)} 光年`;
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置绘图比例以适应高DPI屏幕
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // 先清空画布
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // 使用整数中心点坐标以避免浮点数导致的抗锯齿和对齐问题
    const centerX = Math.floor(rect.width / 2);
    const centerY = Math.floor(rect.height / 2);
    const intCenterX = centerX;
    const intCenterY = centerY;
    const maxRadius = Math.floor(Math.min(centerX, centerY) * 0.85);
    
    // 绘制背景
    const gradient = ctx.createRadialGradient(intCenterX, intCenterY, 0, intCenterX, intCenterY, maxRadius);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.2)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
    
    ctx.beginPath();
    ctx.arc(intCenterX, intCenterY, maxRadius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 绘制放射状辅助线
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(intCenterX, intCenterY);
      ctx.lineTo(
        Math.round(intCenterX + Math.cos(angle) * maxRadius),
        Math.round(intCenterY + Math.sin(angle) * maxRadius)
      );
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    const maxLogSize = logTransform(scaleData[scaleData.length - 1].size);
    
    // 添加同心圆刻度标记（3个刻度）
    const scaleMarks = 3;
    for (let i = 1; i <= scaleMarks; i++) {
      const scaleRadius = Math.floor((i / scaleMarks) * maxRadius);
      
      ctx.beginPath();
      ctx.arc(intCenterX, intCenterY, scaleRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([2, 4]); // 虚线
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]); // 重置
      
      // 添加刻度标签（对数指数显示）
      const expValue = Math.floor(20 * i / scaleMarks); // 从0到20的指数近似
      const expText = `10^${expValue}`;
      
      // 在右侧显示刻度标签
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(intCenterX + scaleRadius + 5, intCenterY - 10, 40, 20);
      
      ctx.font = '10px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(expText, intCenterX + scaleRadius + 10, intCenterY);
    }
    
    // 绘制同心圆
    scaleData.forEach((item, index) => {
      const logSize = logTransform(item.size);
      // 确保半径是整数，避免抗锯齿导致的圆心偏移
      const radius = Math.floor((logSize / maxLogSize) * maxRadius);
      
      // 严格使用整数中心点坐标
      const intCenterX = Math.floor(centerX);
      const intCenterY = Math.floor(centerY);
      
      // 确保使用相同的圆心坐标绘制每个圆环
      ctx.beginPath();
      ctx.arc(intCenterX, intCenterY, radius, 0, 2 * Math.PI);
      
      // 高亮显示悬停的圆环
      if (hoveredScale === index) {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 3;
        
        // 添加辉光效果
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 15;
      } else {
        ctx.strokeStyle = `${item.color}88`; // 半透明
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      
      // 绘制刻度标记，使用固定的角度算法确保标签位置准确
      // 根据索引计算角度，使标签分布在整个圆周上
      // 扇形角度分配，使标签分布更均匀且避免上部拥挤
      const totalSlices = scaleData.length;
      // 将圆分为左右两部分，根据索引分配到左右两侧
      let angle;
      if (index < totalSlices / 2) {
        // 左半部分，从右上角开始到左下角
        const leftSideAngle = Math.PI * 1.7; // 左侧总角度范围
        angle = Math.PI * 0.15 + (index / (totalSlices / 2 - 1)) * leftSideAngle;
      } else {
        // 右半部分，从左下角开始到右上角
        const rightSideAngle = Math.PI * 1.7; // 右侧总角度范围
        angle = Math.PI * 1.85 + ((index - totalSlices / 2) / (totalSlices / 2)) * rightSideAngle;
      }
      
      // 使用整数中心点和精确的角度计算来确保圆上的点完全对齐
      const labelX = Math.round(intCenterX + Math.cos(angle) * radius);
      const labelY = Math.round(intCenterY + Math.sin(angle) * radius);
      
      // 绘制标记点
      ctx.beginPath();
      ctx.arc(labelX, labelY, hoveredScale === index ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = hoveredScale === index ? item.color : `${item.color}aa`;
      ctx.fill();
      
      // 添加标签连接线
      const textDistance = 25;
      const textX = Math.round(labelX + Math.cos(angle) * textDistance);
      const textY = Math.round(labelY + Math.sin(angle) * textDistance);
      
      // 增强连接线，添加箭头效果
      ctx.beginPath();
      ctx.moveTo(labelX, labelY);
      
      // 计算箭头点
      const arrowLength = 8;
      const arrowAngle = Math.PI / 8;
      const arrowX1 = Math.round(labelX + Math.cos(angle - arrowAngle) * arrowLength);
      const arrowY1 = Math.round(labelY + Math.sin(angle - arrowAngle) * arrowLength);
      const arrowX2 = Math.round(labelX + Math.cos(angle + arrowAngle) * arrowLength);
      const arrowY2 = Math.round(labelY + Math.sin(angle + arrowAngle) * arrowLength);
      
      // 绘制箭头
      ctx.moveTo(labelX, labelY);
      ctx.lineTo(arrowX1, arrowY1);
      ctx.moveTo(labelX, labelY);
      ctx.lineTo(arrowX2, arrowY2);
      
      // 绘制主线
      ctx.moveTo(labelX, labelY);
      ctx.lineTo(textX, textY);
      
      ctx.strokeStyle = hoveredScale === index ? item.color : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = hoveredScale === index ? 2 : 1;
      ctx.stroke();
      
      // 绘制标签
      ctx.font = hoveredScale === index ? 'bold 14px sans-serif' : '12px sans-serif';
      
      // 增强标签背景，添加边框
      const textWidth = ctx.measureText(item.scale).width;
      const textBgPadding = 5;
      const bgWidth = textWidth + textBgPadding * 2;
      const bgHeight = 22;
      
      // 绘制标签背景
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.roundRect(
        textX - bgWidth/2, 
        textY - bgHeight/2, 
        bgWidth, 
        bgHeight,
        4 // 圆角
      );
      ctx.fill();
      
      // 绘制边框
      if (hoveredScale === index) {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      
      // 绘制标签文本
      ctx.fillStyle = hoveredScale === index ? item.color : 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.scale, textX, textY);
      
      // 为悬停项添加大小信息
      if (hoveredScale === index) {
        ctx.font = '12px sans-serif';
        const sizeText = `尺寸: ${formatNumber(item.size)}`;
        const sizeWidth = ctx.measureText(sizeText).width;
        
        // 添加尺寸信息背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(
          textX - sizeWidth/2 - textBgPadding, 
          textY + 14, 
          sizeWidth + textBgPadding * 2, 
          18
        );
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(sizeText, textX, textY + 24);
      }
    });
    
    // 绘制中心点，确保在所有圆绘制完成后绘制
    ctx.beginPath();
    ctx.arc(intCenterX, intCenterY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    // 添加标题
    if (title) {
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(title, intCenterX, 15);
      
      // 副标题
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('对数刻度表示', intCenterX, 40);
    }
    
  }, [hoveredScale, title]);
  
  return (
    <>
      <div 
        className={`relative ${className || ""}`}
        onClick={() => setIsFullscreen(true)}
        style={{ cursor: 'pointer' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredScale(null)}
        />
        {/* 添加一个放大提示 */}
        <div className="absolute top-2 right-2 bg-white/10 rounded-full p-1.5 text-white/70 hover:text-white/100 hover:bg-white/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        </div>
      </div>

      {/* 显示宇宙尺度指示器的文本 */}
      {hoveredScale !== null && (
        <div 
          className="absolute pointer-events-none bg-slate-900/95 text-white px-4 py-3 rounded-md border border-primary/50 shadow-xl"
          style={{ left: infoPosition.x, top: infoPosition.y, zIndex: 10 }}
        >
          <p className="font-medium text-md">{scaleData[hoveredScale].scale}</p>
          <p className="text-sm text-slate-300 mt-1">
            尺度: 10<sup>{Math.log10(scaleData[hoveredScale].size).toFixed(1)}</sup> 米
          </p>
          <p className="text-xs mt-2 text-slate-400">{scaleData[hoveredScale].description}</p>
        </div>
      )}

      {/* 全屏模态框 */}
      <ChartFullscreenModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <CosmicScaleComparison
          title={title}
          className="h-full"
        />
      </ChartFullscreenModal>
    </>
  );
} 

// 获取行星详细信息
const getPlanetDetails = (planetName: string, diameter: number) => {
  const planetInfo: Record<string, string> = {
    "水星": "水星是太阳系中最小、最内侧的行星，没有卫星，表面遍布陨石坑，拥有极端的温度变化。",
    "金星": "金星是太阳系中最热的行星，表面被厚厚的二氧化碳大气层覆盖，具有强烈的温室效应和硫酸云层。",
    "地球": "地球是太阳系中唯一已知存在生命的行星，拥有液态水和适宜生命的大气层，是我们的家园。",
    "火星": "火星是一个寒冷的沙漠世界，有薄薄的大气层，表面有古老的河床和极冠，是人类探索的重点目标。",
    "木星": "木星是太阳系中最大的行星，是一个气态巨行星，拥有著名的大红斑和至少79颗卫星。",
    "土星": "土星以其壮观的环系统闻名，同样是气态巨行星，密度极低，拥有丰富的卫星系统。",
    "天王星": "天王星是一个冰巨行星，其自转轴几乎平行于其公转轨道平面，像是在\"侧卧\"着公转。",
    "海王星": "海王星是太阳系最外层的行星，拥有强大的风暴系统和著名的\"大黑斑\"，是一个动态的蓝色世界。"
  };
  
  // 计算与地球的比例
  const earthDiameter = 12756;
  const ratio = diameter / earthDiameter;
  const ratioText = ratio > 1 
    ? `是地球直径的${ratio.toFixed(2)}倍` 
    : `约为地球直径的${(ratio * 100).toFixed(1)}%`;
  
  return `<div class="font-medium mb-2">${planetName}的直径为${diameter.toLocaleString()}千米，${ratioText}。</div>
<div class="mt-1">${planetInfo[planetName] || "这是太阳系中的一颗行星。"}</div>`;
};