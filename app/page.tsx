"use client"

import { useState, useEffect } from "react"
import { VSCodeToolbar } from "@/components/vscode-toolbar"
import { VSCodeSidebar } from "@/components/vscode-sidebar"
import { VSCodeTabs } from "@/components/vscode-tabs"
import { VSCodeEditor } from "@/components/vscode-editor"
import { MarkdownPreview } from "@/components/markdown-preview"
import { WelcomePage } from "@/components/welcome-page"
import { getAllPosts, getDefaultFiles, getPost, getSidebarData, BlogPost, SidebarItem } from "@/lib/blog-data"
import { useTabPersistence } from "@/lib/use-tab-persistence"

export default function VSCodeBlog() {
  const [allPosts, setAllPosts] = useState<Record<string, BlogPost>>({})
  const [sidebarData, setSidebarData] = useState<SidebarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [recentPosts, setRecentPosts] = useState<Array<{
    id: string
    title: string
    category: string
    description: string
  }>>([])
  const [viewMode, setViewMode] = useState<"code" | "preview">("preview")
  const [activeView, setActiveView] = useState<"explorer" | "search" | "git" | "debug" | "extensions">("explorer")

  // 使用持久化标签状态
  const {
    tabs: openTabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    hasTab,
    hasTabs
  } = useTabPersistence()

  // 当前活动的文件ID
  const activeFile = activeTabId || ''

  // 初始化数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const [posts, sidebar] = await Promise.all([
          getAllPosts(),
          getSidebarData()
        ])

        setAllPosts(posts)
        setSidebarData(sidebar)

        // 设置最近文章（按最后修改时间排序）
        const recentPostsData = Object.values(posts)
          .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
          .slice(0, 6)
          .map(post => ({
            id: post.id,
            title: post.title,
            category: post.category,
            description: post.description
          }))

        setRecentPosts(recentPostsData)

      } catch (error) {
        console.error('Failed to load blog data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleFileSelect = (fileId: string) => {
    // 如果标签不存在，先添加它
    if (!hasTab(fileId) && allPosts[fileId]) {
      addTab({
        id: fileId,
        name: allPosts[fileId].name,
      })
    } else {
      // 如果标签已存在，只需要设置活动状态
      setActiveTab(fileId)
    }
  }

  const handleTabClose = (tabId: string) => {
    removeTab(tabId)
  }

  const currentPost = allPosts[activeFile]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <VSCodeToolbar activeView={activeView} onViewChange={setActiveView} />

      <VSCodeSidebar sidebarData={sidebarData} activeFile={activeFile} onFileSelect={handleFileSelect} activeView={activeView} />

      <div className="flex-1 flex flex-col">
        <VSCodeTabs
          tabs={openTabs}
          activeTab={activeFile}
          viewMode={viewMode}
          onTabSelect={setActiveTab}
          onTabClose={handleTabClose}
          onViewModeChange={setViewMode}
        />

        <div className="flex-1 overflow-hidden">
          {hasTabs && activeFile && currentPost ? (
            viewMode === "code" ? (
              <VSCodeEditor content={currentPost.content} language="markdown" showLineNumbers={true} />
            ) : (
              <MarkdownPreview content={currentPost.content} />
            )
          ) : (
            <WelcomePage
              onFileSelect={handleFileSelect}
              recentPosts={recentPosts}
            />
          )}
        </div>
      </div>
    </div>
  )
}
