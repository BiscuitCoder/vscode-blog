"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface TechStackMarqueeProps {
  className?: string
}

const techStack = [
  // 前端核心技术栈
  "React", "VUE3", "Next.js", "TypeScript", "Nuxt.js", "Sass",
  "Tailwind CSS", "shadcn/ui", "Framer Motion", "Three.js", "Vite", "Webpack",

  // 区块链技术栈
  "Web3", "Solidity", "ethers.js", "wagmi", "viem", "Hardhat", "Foundry",
  "The Graph", "Uniswap", "Aave", "Compound", "IPFS", "Filecoin", "Arweave",

  // 前端开发工具
  "Node.js", "pnpm", "ESLint", "Prettier", "Husky", "GitHub Actions",
  "Vercel", "Netlify", "Figma",

  // 区块链生态
  "Ethereum", "Polygon", "Arbitrum", "Optimism", "Base", "BSC", "Solana",
  "Layer 2", "DeFi", "NFT", "DAO", "DEX",

  // 服务端常见技术栈
  "Node.js", "Go", "Rust",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker",
  "Vercel", "Cloudflare",
]

const personalityTraits = [
  "救火队员", "AI驯兽员", "伪全干",
  "处女座驱动型", "唱跳 Rap 一律不会", "创造欲",
  "新鲜事", "Remote", "探索欲",
  "自由生产力", "数字游民", "Web3"
]


export function TechStackMarquee({ className }: TechStackMarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRefs = useRef<(HTMLDivElement | null)[]>([])

  // 定义每行的配置
  const rows = [
    {
      id: 'tech-stack',
      keywords: techStack,
      animation: 'marquee-left 200s linear infinite',
      delay: '0s',
      gradient: 'from-blue-900/20 to-indigo-900/20',
      border: 'border-blue-700/30',
      textColor: 'text-blue-400',
      hoverBg: 'hover:bg-blue-800/30',
      hoverText: 'hover:text-blue-300'
    },
    {
      id: 'personality',
      keywords: personalityTraits,
      animation: 'marquee-right 90s linear infinite',
      delay: '0.3s',
      gradient: 'from-green-900/20 to-green-900/20',
      border: 'border-green-700/30',
      textColor: 'text-green-400',
      hoverBg: 'hover:bg-green-800/30',
      hoverText: 'hover:text-green-300'
    }
  ]

  // 生成重复的关键字数组
  const createRepeatedKeywords = (keywords: string[], repeatCount: number = 6) => {
    return Array.from({ length: repeatCount }, () => keywords).flat()
  }

  // 处理标签hover事件
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let hoverTimeout: NodeJS.Timeout

    const handleMouseEnter = () => {
      clearTimeout(hoverTimeout)
      // 暂停所有动画
      containerRefs.current.forEach(container => {
        if (container) {
          container.style.animationPlayState = 'paused'
        }
      })
    }

    const handleMouseLeave = () => {
      // 延迟恢复动画，避免快速进出时的闪烁
      hoverTimeout = setTimeout(() => {
        containerRefs.current.forEach(container => {
          if (container) {
            container.style.animationPlayState = 'running'
          }
        })
      }, 100)
    }

    // 为wrapper添加事件监听
    wrapper.addEventListener('mouseenter', handleMouseEnter)
    wrapper.addEventListener('mouseleave', handleMouseLeave)

    // 为所有span标签添加事件监听
    const spans = wrapper.querySelectorAll('span')
    spans.forEach(span => {
      span.addEventListener('mouseenter', handleMouseEnter)
      span.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      clearTimeout(hoverTimeout)
      wrapper.removeEventListener('mouseenter', handleMouseEnter)
      wrapper.removeEventListener('mouseleave', handleMouseLeave)
      spans.forEach(span => {
        span.removeEventListener('mouseenter', handleMouseEnter)
        span.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <div className={cn("absolute top-0 left-0 right-0 overflow-hidden opacity-90 hover:opacity-100 transition-opacity duration-300", className)}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"></div>

      {/* 轮播内容 */}
      <div ref={wrapperRef} className="relative z-10 space-y-4 py-4 marquee-wrapper">
        {rows.map((row, rowIndex) => (
          <div key={row.id} className="flex items-center space-x-3 overflow-hidden">
            <div
              ref={el => containerRefs.current[rowIndex] = el}
              className="flex items-center space-x-3 marquee-container"
              style={{
                animation: row.animation,
                animationDelay: row.delay
              }}
            >
              {/* 使用 map 生成重复的关键字以实现无缝循环 */}
              {createRepeatedKeywords(row.keywords).map((keyword, index) => (
                <span
                  key={`${row.id}-${keyword}-${index}`}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap opacity-50",
                    `bg-gradient-to-r ${row.gradient}`,
                    row.border,
                    row.textColor,
                    "transition-all duration-300 cursor-pointer",
                    "hover:scale-110 hover:opacity-100",
                    row.hoverBg,
                    row.hoverText
                  )}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CSS 动画定义 */}
      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-16.67%); } /* 1/6 的距离，因为重复了6次 */
        }

        @keyframes marquee-right {
          0% { transform: translateX(-16.67%); }
          100% { transform: translateX(0%); }
        }

        .marquee-container {
          animation-fill-mode: both;
          animation-timing-function: linear;
          will-change: transform;
        }

        .marquee-container:hover,
        .marquee-wrapper:hover .marquee-container {
          animation-play-state: paused;
        }

        /* 当标签被hover时暂停动画 */
        .marquee-wrapper:has(span:hover) .marquee-container {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
