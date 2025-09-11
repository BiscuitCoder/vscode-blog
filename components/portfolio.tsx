"use client"

import { cn } from "@/lib/utils"

interface PortfolioItem {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  gradient: string
  tags: string[]
  githubUrl?: string
}

interface PortfolioProps {
  onItemSelect?: (itemId: string) => void
}

const portfolioItems: PortfolioItem[] = [
  // GitHub Projects
  {
    id: 'vscode-blog',
    title: 'VSCode Blog',
    subtitle: 'VSCode 风格博客平台',
    description: '基于 Next.js 14 的 VSCode 风格博客项目，采用现代化技术栈，支持 Markdown 编辑和实时预览',
    icon: '📝',
    gradient: 'from-blue-500 to-indigo-600',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'TipTap'],
    githubUrl: 'https://github.com/BiscuitCoder/vscode-blog'
  },
  {
    id: 'terminal-blog-cb',
    title: 'Terminal Blog',
    subtitle: '终端风格博客',
    description: '模拟终端界面的博客平台，支持命令行式导航和 Markdown 文章展示',
    icon: '💻',
    gradient: 'from-green-500 to-emerald-600',
    tags: ['Next.js', 'React', 'Terminal UI', 'Markdown'],
    githubUrl: 'https://github.com/BiscuitCoder/terminal-blog-cb'
  },
  {
    id: 'solana-alt-demo',
    title: 'Solana ALT Demo',
    subtitle: 'Solana 代币演示应用',
    description: '基于 Solana 区块链的代币交互演示应用，支持代币创建、转账和查询功能',
    icon: '🪙',
    gradient: 'from-purple-500 to-pink-600',
    tags: ['Solana', 'Web3.js', 'Rust', 'React'],
    githubUrl: 'https://github.com/BiscuitCoder/solana-alt-demo'
  },
  {
    id: 'iou-dapp',
    title: 'IOU DApp',
    subtitle: '去中心化借贷应用',
    description: '基于区块链的借贷协议实现，支持智能合约的借贷和还款功能',
    icon: '📊',
    gradient: 'from-orange-500 to-red-600',
    tags: ['Solidity', 'Ethereum', 'Web3', 'React'],
    githubUrl: 'https://github.com/BiscuitCoder/iou-dapp'
  },
  {
    id: 'drawing0',
    title: 'Drawing0',
    subtitle: '在线绘画工具',
    description: '基于 Canvas 的在线绘画和设计工具，支持多种画笔效果和导出功能',
    icon: '🎨',
    gradient: 'from-pink-500 to-rose-600',
    tags: ['Canvas', 'JavaScript', 'HTML5', 'WebGL'],
    githubUrl: 'https://github.com/BiscuitCoder/drawing0'
  },
  {
    id: 'eip-7702-aggregator',
    title: 'EIP-7702 Aggregator',
    subtitle: '以太坊账户抽象聚合器',
    description: '实现 EIP-7702 账户抽象协议的聚合器，支持批量交易和智能账户管理',
    icon: '🔗',
    gradient: 'from-cyan-500 to-blue-600',
    tags: ['Ethereum', 'Solidity', 'EIP-7702', 'Account Abstraction'],
    githubUrl: 'https://github.com/BiscuitCoder/eip-7702-aggregator'
  },
  {
    id: 'wownav-ts',
    title: 'WowNav TS',
    subtitle: '导航网站生成器',
    description: 'TypeScript 实现的导航网站生成器，支持书签管理和自定义主题',
    icon: '🧭',
    gradient: 'from-teal-500 to-green-600',
    tags: ['TypeScript', 'Node.js', 'HTML', 'CSS'],
    githubUrl: 'https://github.com/BiscuitCoder/wownav_ts'
  },
  {
    id: 'wownav-extension',
    title: 'WowNav Extension',
    subtitle: 'Chrome 导航扩展',
    description: 'Chrome 浏览器扩展，提供快速导航和书签管理功能',
    icon: '🔧',
    gradient: 'from-yellow-500 to-orange-600',
    tags: ['Chrome Extension', 'JavaScript', 'Manifest V3'],
    githubUrl: 'https://github.com/BiscuitCoder/wownav_extension'
  },
  {
    id: '0xSpace-tech',
    title: '0xSpace.tech',
    subtitle: 'Web3 项目模板',
    description: '基于 Next.js 的 Web3 项目启动模板，集成多种前端技术和工具',
    icon: '🚀',
    gradient: 'from-indigo-500 to-purple-600',
    tags: ['Next.js', 'Web3', 'HeroUI', 'RainbowKit', 'Zustand'],
    githubUrl: 'https://github.com/BiscuitCoder/0xSpace.tech'
  },
  {
    id: 'eos-labs',
    title: 'EOS Labs',
    subtitle: '区块链实验室',
    description: 'EOS 区块链的开发实验室，包含智能合约和 DApp 开发示例',
    icon: '🔬',
    gradient: 'from-slate-500 to-gray-600',
    tags: ['EOS', 'C++', 'Smart Contracts', 'Blockchain'],
    githubUrl: 'https://github.com/BiscuitCoder/eos-labs'
  },
  {
    id: 'web3-next-temp',
    title: 'Web3 Next.js Template',
    subtitle: 'Web3 项目模板',
    description: '专为 Web3 项目定制的 Next.js 模板，集成钱包连接和多语言支持',
    icon: '⚡',
    gradient: 'from-violet-500 to-fuchsia-600',
    tags: ['Next.js', 'Web3', 'TypeScript', 'i18next', 'Styled Components'],
    githubUrl: 'https://github.com/BiscuitCoder/web3-next-temp'
  },
  {
    id: 'casual-hackathon-template',
    title: 'CasualHackathon Template',
    subtitle: '休闲黑客松模板',
    description: 'CasualHackathon 的模板项目，提供了一个用于组织和管理休闲黑客松活动的基础框架',
    icon: '🎯',
    gradient: 'from-emerald-500 to-teal-600',
    tags: ['Hackathon', 'Template', 'Organization', 'Node.js', 'JavaScript'],
    githubUrl: 'https://github.com/CasualHackathon/Template'
  },
  {
    id: 'happypods',
    title: 'HappyPods',
    subtitle: 'Mini Grants 管理平台',
    description: '由 LXDAO 开发的 Mini Grants 管理平台，通过多签自动化工具将"申请→捐赠→资金管理→分配"变成公开、可追踪、按贡献度自动发放的透明流程',
    icon: '🎁',
    gradient: 'from-amber-500 to-orange-600',
    tags: ['Web3', 'DAO', 'Grants', 'Multi-signature', 'Blockchain', 'React'],
    githubUrl: 'https://github.com/lxdao-official/happypods'
  },
  {
    id: 'lxdao-docs',
    title: 'LXDAO 文档',
    subtitle: 'LXDAO 官方文档库',
    description: 'LXDAO 的官方文档库，提供了关于 LXDAO 项目和流程的详细说明和指南',
    icon: '📚',
    gradient: 'from-blue-500 to-cyan-600',
    tags: ['Documentation', 'DAO', 'Web3', 'Next.js', 'Markdown'],
    githubUrl: 'https://github.com/lxdao-official/docs'
  }
]

const tagColors = {
  // Frontend & Framework
  'React': 'border border-blue-700 text-blue-300',
  'Next.js': 'border border-blue-700 text-blue-300',
  'TypeScript': 'border border-blue-700 text-blue-300',
  'JavaScript': 'border border-yellow-700 text-yellow-300',
  'HTML': 'border border-orange-700 text-orange-300',
  'CSS': 'border border-purple-700 text-purple-300',
  'HTML5': 'border border-orange-700 text-orange-300',
  'Node.js': 'border border-green-700 text-green-300',

  // Blockchain & Web3
  'Web3': 'border border-green-700 text-green-300',
  'Web3.js': 'border border-green-700 text-green-300',
  'ethers.js': 'border border-purple-700 text-purple-300',
  'Solidity': 'border border-gray-700 text-gray-300',
  'Ethereum': 'border border-blue-700 text-blue-300',
  'Solana': 'border border-purple-700 text-purple-300',
  'EIP-7702': 'border border-indigo-700 text-indigo-300',
  'Account Abstraction': 'border border-indigo-700 text-indigo-300',
  'Rust': 'border border-orange-700 text-orange-300',
  'C++': 'border border-pink-700 text-pink-300',
  'Smart Contracts': 'border border-red-700 text-red-300',
  'Blockchain': 'border border-gray-700 text-gray-300',
  'EOS': 'border border-slate-700 text-slate-300',

  // UI & Design
  'Tailwind CSS': 'border border-cyan-700 text-cyan-300',
  'Canvas': 'border border-green-700 text-green-300',
  'WebGL': 'border border-indigo-700 text-indigo-300',
  'Terminal UI': 'border border-gray-700 text-gray-300',
  'Fabric.js': 'border border-blue-700 text-blue-300',

  // Libraries & Tools
  'TipTap': 'border border-purple-700 text-purple-300',
  'Markdown': 'border border-blue-700 text-blue-300',
  'HeroUI': 'border border-pink-700 text-pink-300',
  'RainbowKit': 'border border-yellow-700 text-yellow-300',
  'Zustand': 'border border-green-700 text-green-300',
  'i18next': 'border border-orange-700 text-orange-300',
  'Styled Components': 'border border-pink-700 text-pink-300',
  'LangChain': 'border border-green-700 text-green-300',

  // Extensions & Platforms
  'Chrome Extension': 'border border-blue-700 text-blue-300',
  'Manifest V3': 'border border-green-700 text-green-300',

  // Other
  'AI': 'border border-purple-700 text-purple-300',
  'NestJS': 'border border-blue-700 text-blue-300',
  'PostgreSQL': 'border border-green-700 text-green-300',
  'Stripe': 'border border-purple-700 text-purple-300',
  'WebSocket': 'border border-purple-700 text-purple-300',

  // New Project Tags
  'Hackathon': 'border border-emerald-700 text-emerald-300',
  'Template': 'border border-teal-700 text-teal-300',
  'Organization': 'border border-cyan-700 text-cyan-300',
  'DAO': 'border border-indigo-700 text-indigo-300',
  'Grants': 'border border-amber-700 text-amber-300',
  'Multi-signature': 'border border-orange-700 text-orange-300',
  'Documentation': 'border border-blue-700 text-blue-300'
}

export function Portfolio({ onItemSelect }: PortfolioProps) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">🚀 Portfolio</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          一些折腾 ～
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
            onClick={() => onItemSelect?.(item.id)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center",
                item.gradient
              )}>
                <span className="text-white font-bold text-lg">{item.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "px-2 py-1 text-[10px] rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300",
                    tagColors[tag as keyof typeof tagColors] || "bg-gray-100 text-gray-800"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
            {item.githubUrl && (
              <div className="mt-4 pt-3 border-t border-border">
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white hover:text-primary/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
