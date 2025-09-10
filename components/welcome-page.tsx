"use client"

import { BookOpen, Code, Coffee, Heart, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

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
      <div className="max-w-4xl mx-auto px-8 py-16 min-h-full">
        {/* 主要欢迎区域 */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Code className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            欢迎使用 <span className="text-primary">VSCode Blog</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            一个现代化的开发者博客平台，结合了 VS Code 的界面设计和 Markdown 的强大功能
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Markdown 支持</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">实时预览</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">分类管理</span>
            </div>
          </div>
        </div>

        {/* 快速操作区域 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 开始阅读 */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">开始阅读</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              从左侧边栏选择文章开始阅读，或者浏览不同分类的内容
            </p>
            <div className="text-sm text-muted-foreground">
              💡 提示：点击左侧的文章标题即可开始阅读
            </div>
          </div>

          {/* 写作指南 */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">写作指南</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              了解如何添加新文章和组织内容结构
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>在 data/posts/ 下创建分类目录</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>添加 .md 文件到对应目录</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>运行 npm run generate-config</span>
              </div>
            </div>
          </div>
        </div>

        {/* 最近文章预览 */}
        {recentPosts.length > 0 && (
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              最近更新
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPosts.slice(0, 6).map((post) => (
                <div
                  key={post.id}
                  className={cn(
                    "p-4 rounded-lg border bg-background/50 cursor-pointer transition-colors hover:border-accent",
                    "group"
                  )}
                  onClick={() => onFileSelect?.(post.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {post.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 底部信息 */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
            <Coffee className="w-4 h-4" />
            <span>享受写作和阅读的乐趣</span>
          </div>
        </div>
      </div>
    </div>
  )
}
