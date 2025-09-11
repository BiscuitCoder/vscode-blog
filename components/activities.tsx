"use client"

import { Trophy, Award, Users, Target, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  gradient: string
  award: string
  link: string
}

interface ActivitiesProps {
  onItemSelect?: (itemId: string) => void
}

const activities: Activity[] = [
  {
    id: 'myfirstdapp-judge',
    title: 'MyFirstDApp 黑客松',
    subtitle: '评委嘉宾',
    description: '担任 MyFirstDApp 黑客松评委嘉宾，见证了许多充满创意的作品诞生',
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-blue-500 to-indigo-600',
    award: '评委嘉宾',
    link: 'https://github.com/CasualHackathon/MyFirstDApp'
  },
  {
    id: 'onchainlife-borrow-reward',
    title: 'OnchainLife 黑客松',
    subtitle: '"越借越赚"奖',
    description: '在 OnchainLife 黑客松中荣获"越借越赚"奖，探索区块链借贷协议创新',
    icon: <Trophy className="w-6 h-6" />,
    gradient: 'from-green-500 to-emerald-600',
    award: '越借越赚奖',
    link: 'https://github.com/CasualHackathon/OnchainLife'
  },
  {
    id: 'eip7702-undercover-unicorn',
    title: 'EIP-7702 黑客松',
    subtitle: '"Best Undercover Unicorn"奖',
    description: '在国际比赛 EIP-7702 黑客松中获得"Best Undercover Unicorn"奖',
    icon: <Award className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-600',
    award: 'Best Undercover Unicorn',
    link: 'https://github.com/CasualHackathon/EIP-7702'
  },
  {
    id: 'conscience-scale-project',
    title: '良心量表开源项目',
    subtitle: '核心贡献者',
    description: '参与良心量表开源项目，贡献代码、文档，推动项目发展',
    icon: <Target className="w-6 h-6" />,
    gradient: 'from-orange-500 to-red-600',
    award: '核心贡献者',
    link: 'https://mp.weixin.qq.com/s/FhkSoqm17EAEPf9Plua1Ug'
  },
  {
    id: 'ai-hackathon-best-collector',
    title: 'AI 黑客松',
    subtitle: '"最佳收藏家"奖',
    description: '在 AI 黑客松中荣获"最佳收藏家"奖，展示出色的 AI 工具收集和应用能力',
    icon: <Star className="w-6 h-6" />,
    gradient: 'from-cyan-500 to-blue-600',
    award: '最佳收藏家奖',
    link: 'https://mp.weixin.qq.com/s/Bnzi2cU4wseo4jQnKYAoBQ'
  }
]

export function Activities({ onItemSelect }: ActivitiesProps) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">🏆 活动经历</h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          一些有意思的活动经历
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="group relative p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden"
            onClick={() => onItemSelect?.(activity.id)}
          >
            {/* 背景装饰 */}
            <div className={cn(
              "absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl rounded-bl-full opacity-10",
              activity.gradient
            )} />

            <div className="relative z-10">
              {/* 头部信息 */}
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 bg-gradient-to-br rounded-full flex items-center justify-center",
                  activity.gradient
                )}>
                  <div className="text-white">
                    {activity.icon}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {activity.award}
                  </div>
                </div>
              </div>

              {/* 主要内容 */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {activity.subtitle}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </div>

              {/* 底部链接 */}
              <div className="flex items-center space-x-2 pt-3 border-t border-border">
                <a
                  href={activity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
