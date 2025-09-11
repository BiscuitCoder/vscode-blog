"use client"

import { useEffect, useState } from "react"
import { File, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { SidebarItem } from "@/lib/blog-data"

interface VSCodeSearchViewProps {
  sidebarData: SidebarItem[]
  activeFile: string
  onFileSelect: (fileId: string) => void
}

export function VSCodeSearchView({ sidebarData, activeFile, onFileSelect }: VSCodeSearchViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFiles, setFilteredFiles] = useState<SidebarItem[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const searchFiles = async (items: SidebarItem[], query: string): Promise<SidebarItem[]> => {
    const results: SidebarItem[] = []
    const queryLower = query.toLowerCase()

    const searchInItem = async (item: SidebarItem) => {
      let matchesQuery = false
      let matchReason = ''

      // 搜索文件名或文件夹名
      if (item.name.toLowerCase().includes(queryLower)) {
        matchesQuery = true
        matchReason = 'filename'
      }

      // 如果是文件且还没匹配，尝试搜索文件内容（通过配置文件）
      if (item.type === 'file' && !matchesQuery) {
        try {
          // 从配置文件中获取文件信息
          const response = await fetch('/data/pageconfig.json')
          const config = await response.json()
          const fileInfo = config.posts[item.id]

          if (fileInfo) {
            // 搜索标题
            if (fileInfo.title && fileInfo.title.toLowerCase().includes(queryLower)) {
              matchesQuery = true
              matchReason = 'title'
            }
            // 搜索描述（内容摘要）
            else if (fileInfo.description && fileInfo.description.toLowerCase().includes(queryLower)) {
              matchesQuery = true
              matchReason = 'content'
            }
          }
        } catch (error) {
          // 静默处理错误，不影响搜索体验
          console.warn('Failed to load file content for search:', error)
        }
      }

      if (matchesQuery) {
        // 为匹配的项目添加搜索匹配信息
        const resultItem = {
          ...item,
          matchReason,
          matchQuery: query
        }
        results.push(resultItem)
      }

      // 递归搜索子项
      if (item.children) {
        for (const child of item.children) {
          await searchInItem(child)
        }
      }
    }

    for (const item of items) {
      await searchInItem(item)
    }

    return results
  }

  // 当搜索查询改变时执行搜索
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        try {
          const results = await searchFiles(sidebarData, searchQuery)
          setFilteredFiles(results)
        } catch (error) {
          console.error('Search failed:', error)
          setFilteredFiles([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setFilteredFiles([])
        setIsSearching(false)
      }
    }

    performSearch()
  }, [searchQuery, sidebarData])

  return (
    <>
      <div className="p-3 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide mb-3">Search</h2>
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background border-sidebar-border"
        />
      </div>
      <div className="py-2">
        {searchQuery && (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            {isSearching ? 'Searching...' : `${filteredFiles.length} results for "${searchQuery}"`}
          </div>
        )}
        {searchQuery && !isSearching && filteredFiles.length === 0 && (
          <div className="px-3 py-4 text-sm text-muted-foreground text-center">
            No results found for "{searchQuery}"
          </div>
        )}
        {filteredFiles.map((item) => {
          // 获取匹配原因的显示文本
          const getMatchReasonText = (reason: string) => {
            switch (reason) {
              case 'filename': return '文件名匹配'
              case 'title': return '标题匹配'
              case 'content': return '内容匹配'
              default: return '匹配'
            }
          }

          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-col py-1 px-2 cursor-pointer text-sm vscode-sidebar-item overflow-hidden",
                activeFile === item.id && "vscode-sidebar-item active",
                "hover:bg-sidebar-accent",
              )}
              style={{ paddingLeft: "8px" }}
              onClick={() => {
                if (item.type === "folder") {
                  // 搜索视图中文件夹点击不切换展开状态
                } else {
                  onFileSelect(item.id)
                }
              }}
            >
              <div className="flex items-center">
                {item.type === "folder" ? (
                  <>
                    <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
                  </>
                ) : (
                  <File className="w-4 h-4 mr-2 flex-shrink-0" />
                )}
                <span className="truncate min-w-0" title={item.name}>{item.name}</span>
              </div>
              {/* 显示匹配原因 */}
              {/* <div className="text-xs text-muted-foreground mt-1 ml-6">
                {getMatchReasonText(item.matchReason || '')}
              </div> */}
            </div>
          )
        })}
      </div>
    </>
  )
}
