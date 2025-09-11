"use client"

import { BookOpen, Code, Coffee, Heart, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { RecentPosts } from "./recent-posts"
import { PortfolioSection } from "./portfolio-section"
import { Activities } from "./activities"
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

            {/* 社交链接 */}
            <div className="flex justify-center gap-6 mb-8">
              {[
                {
                  href: "https://x.com/keylen1010",
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  ),
                  label: "Twitter",
                  bgColor: "bg-blue-500 hover:bg-blue-600",
                  external: true
                },
                {
                  href: "mailto:kelenworks@gmail.com",
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: "Email",
                  bgColor: "bg-blue-500 hover:bg-blue-600",
                  external: false,
                  disabled: false
                }
              ].map((link, index) => (
                <a
                  key={index}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer px-4 py-2 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg",
                    link.bgColor,
                    link.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  href={link.href}
                  target="_blank"
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </a>
              ))}
            </div>

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
         <PortfolioSection onItemSelect={onFileSelect} />

         {/* 活动经历 */}
         <Activities onItemSelect={onFileSelect} />

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
