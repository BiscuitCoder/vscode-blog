"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecentPost {
  id: string
  title: string
  category: string
  description: string
}

interface RecentPostsProps {
  posts: RecentPost[]
  onPostSelect?: (postId: string) => void
}

export function RecentPosts({ posts, onPostSelect }: RecentPostsProps) {
  if (posts.length === 0) return null

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        最近更新
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.slice(0, 6).map((post) => (
          <div
            key={post.id}
            className={cn(
              "p-4 rounded-lg border bg-background/50 cursor-pointer transition-colors hover:border-accent",
              "group"
            )}
            onClick={() => onPostSelect?.(post.id)}
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
  )
}
