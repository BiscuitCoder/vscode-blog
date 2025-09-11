"use client"

import { BookOpen, Code, Coffee, Heart, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { RecentPosts } from "./recent-posts"
import { Portfolio } from "./portfolio"
import { TechStackMarquee } from "./tech-stack-marquee"

interface WelcomePageProps {
  onFileSelect?: (fileId: string) => void
  recentPosts?: Array<{
    id: string
    title: string
    category: string
    description: string
  }>
}

export function WelcomePage({ onFileSelect, recentPosts = [] }: WelcomePageProps) {
  return (
    <div className="flex-1 bg-background overflow-y-auto size-full welcome-page">
      <div className="mx-auto pb-16 min-h-full">
        {/* 主要欢迎区域 */}
        <div className="text-center pt-30 relative">
          <div className="relative z-10 px-10">

           <div className="flex justify-center mb-6">
              <div className="relative">
                <img src="/avatar.png" className="rounded-full border-2 border-white w-25" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to <span className="text-primary">Keylen's Blog</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              如你所见，作为一个开发者，随身携带一个 IDE 是再正常不过的事情！
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">伪全干工程师</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Web3 从业者</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">LXDAO Builder</span>
              </div>
            </div>
          </div>
          {/*  */}

          <TechStackMarquee />

        </div>


       <div className="md:p-20 p-10">
         {/* 作品集入口 */}
         <Portfolio onItemSelect={onFileSelect} />

          {/* 最近文章预览 */}
          <RecentPosts posts={recentPosts} onPostSelect={onFileSelect} />

          {/* 底部信息 */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
              <span className="text-xl">🍻 乾杯 ～</span>
            </div>
          </div>

       </div>
       {/*  */}

      </div>
    </div>
  )
}
