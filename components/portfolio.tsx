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
}

interface PortfolioProps {
  onItemSelect?: (itemId: string) => void
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 'web3-wallet-app',
    title: 'Web3 钱包',
    subtitle: '多链钱包管理',
    description: '支持多链钱包管理、NFT 展示和 DeFi 交互的现代化 Web3 应用',
    icon: '₿',
    gradient: 'from-blue-500 to-purple-600',
    tags: ['React', 'Web3', 'ethers.js']
  },
  {
    id: 'ai-chatbot',
    title: 'AI 聊天机器人',
    subtitle: '智能对话系统',
    description: '基于 GPT-4 和 LangChain 的智能聊天机器人，支持知识库问答和代码生成',
    icon: '🤖',
    gradient: 'from-green-500 to-blue-600',
    tags: ['Next.js', 'AI', 'LangChain']
  },
  {
    id: 'ecommerce-platform',
    title: '电商平台',
    subtitle: '全栈电商解决方案',
    description: '基于微服务架构的全栈电商平台，支持支付集成和订单管理',
    icon: '🛒',
    gradient: 'from-orange-500 to-red-600',
    tags: ['NestJS', 'PostgreSQL', 'Stripe']
  },
  {
    id: 'design-tool',
    title: '设计师工具',
    subtitle: '在线设计平台',
    description: '面向设计师的专业工具平台，支持实时协作和组件管理',
    icon: '🎨',
    gradient: 'from-pink-500 to-purple-600',
    tags: ['Fabric.js', 'Canvas', 'WebSocket']
  }
]

const tagColors = {
  'React': 'bg-blue-100 text-blue-800',
  'Web3': 'bg-green-100 text-green-800',
  'ethers.js': 'bg-purple-100 text-purple-800',
  'Next.js': 'bg-blue-100 text-blue-800',
  'AI': 'bg-purple-100 text-purple-800',
  'LangChain': 'bg-green-100 text-green-800',
  'NestJS': 'bg-blue-100 text-blue-800',
  'PostgreSQL': 'bg-green-100 text-green-800',
  'Stripe': 'bg-purple-100 text-purple-800',
  'Fabric.js': 'bg-blue-100 text-blue-800',
  'Canvas': 'bg-green-100 text-green-800',
  'WebSocket': 'bg-purple-100 text-purple-800'
}

export function Portfolio({ onItemSelect }: PortfolioProps) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">🎨 Portfolio</h2>
        <p className="text-muted-foreground mx-auto">
          搞了一些有用没用的小玩意儿～
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
                "w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center",
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
                    "px-2 py-1 text-xs rounded-full",
                    tagColors[tag as keyof typeof tagColors] || "bg-gray-100 text-gray-800"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
