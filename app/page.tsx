"use client"

import { useState, useEffect } from "react"
import { VSCodeToolbar } from "@/components/vscode-toolbar"
import { VSCodeSidebar } from "@/components/vscode-sidebar"
import { VSCodeTabs } from "@/components/vscode-tabs"
import { VSCodeEditor } from "@/components/vscode-editor"
import { MarkdownPreview } from "@/components/markdown-preview"
import { WelcomePage } from "@/components/welcome-page"
import { getAllPosts, getDefaultFiles, getPostWithContent, getSidebarData, BlogPost, BlogPostWithContent, SidebarItem } from "@/lib/blog-data"
import { useTabPersistence } from "@/lib/use-tab-persistence"

export default function VSCodeBlog() {
  const [allPosts, setAllPosts] = useState<Record<string, BlogPost>>({})
  const [currentPost, setCurrentPost] = useState<BlogPostWithContent | null>(null)
  const [sidebarData, setSidebarData] = useState<SidebarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingContent, setLoadingContent] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
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

        // 清理无效的标签（文章已不存在的标签）
        const validTabIds = Object.keys(posts)
        const invalidTabs = openTabs.filter(tab => !validTabIds.includes(tab.id))

        if (invalidTabs.length > 0) {
          console.log('清理无效标签:', invalidTabs.map(tab => tab.id))
          invalidTabs.forEach(tab => {
            removeTab(tab.id)
          })
        }

      } catch (error) {
        console.error('Failed to load blog data:', error)
      } finally {
        setLoading(false)
        // 延迟一点时间确保所有状态都已更新
        setTimeout(() => {
          setInitialLoadComplete(true)
        }, 100)
      }
    }

    loadData()
  }, [])

  const handleFileSelect = async (fileId: string) => {
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

    // 如果是当前活动的文件，且还没有加载内容，则加载内容
    if (activeFile === fileId && !currentPost) {
      setLoadingContent(true)
      try {
        const postWithContent = await getPostWithContent(fileId)
        if (postWithContent) {
          setCurrentPost(postWithContent)
        }
      } catch (error) {
        console.error('Failed to load post content:', error)
      } finally {
        setLoadingContent(false)
      }
    }
  }

  const handleTabClose = (tabId: string) => {
    removeTab(tabId)
  }

  // 当 activeFile 变化时，加载对应的内容
  useEffect(() => {
    if (activeFile && allPosts[activeFile]) {
      const loadContent = async () => {
        setLoadingContent(true)
        try {
          const postWithContent = await getPostWithContent(activeFile)
          if (postWithContent) {
            setCurrentPost(postWithContent)
          }
        } catch (error) {
          console.error('Failed to load post content:', error)
        } finally {
          setLoadingContent(false)
        }
      }

      loadContent()
    } else {
      setCurrentPost(null)
    }
  }, [activeFile, allPosts])

  if (loading || !initialLoadComplete) {
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
          {hasTabs && activeFile && allPosts[activeFile] ? (
            currentPost && !loadingContent ? (
              viewMode === "code" ? (
                <VSCodeEditor content={currentPost.content} language="markdown" showLineNumbers={true} />
              ) : (
                <MarkdownPreview content={currentPost.content} />
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
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
