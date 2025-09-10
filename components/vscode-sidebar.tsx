"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, GitBranch, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SidebarItem {
  id: string
  name: string
  type: "file" | "folder"
  children?: SidebarItem[]
  isOpen?: boolean
}

const sidebarData: SidebarItem[] = [
  {
    id: "blog",
    name: "blog",
    type: "folder",
    isOpen: true,
    children: [
      {
        id: "posts",
        name: "posts",
        type: "folder",
        isOpen: true,
        children: [
          { id: "react-hooks", name: "react-hooks.md", type: "file" },
          { id: "typescript-tips", name: "typescript-tips.md", type: "file" },
          { id: "nextjs-guide", name: "nextjs-guide.md", type: "file" },
        ],
      },
      {
        id: "categories",
        name: "categories",
        type: "folder",
        children: [
          { id: "frontend", name: "frontend.md", type: "file" },
          { id: "backend", name: "backend.md", type: "file" },
          { id: "devops", name: "devops.md", type: "file" },
        ],
      },
      { id: "about", name: "about.md", type: "file" },
      { id: "contact", name: "contact.md", type: "file" },
    ],
  },
]

interface SidebarProps {
  activeFile: string
  onFileSelect: (fileId: string) => void
  activeView: "explorer" | "search" | "git" | "debug" | "extensions"
}

export function VSCodeSidebar({ activeFile, onFileSelect, activeView }: SidebarProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(["blog", "posts"]))
  const [searchQuery, setSearchQuery] = useState("")

  const searchFiles = (items: SidebarItem[], query: string): SidebarItem[] => {
    const results: SidebarItem[] = []

    const searchInItem = (item: SidebarItem) => {
      if (item.type === "file" && item.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(item)
      }
      if (item.children) {
        item.children.forEach(searchInItem)
      }
    }

    items.forEach(searchInItem)
    return results
  }

  const filteredFiles = searchQuery ? searchFiles(sidebarData, searchQuery) : []

  const toggleFolder = (folderId: string) => {
    const newOpenFolders = new Set(openFolders)
    if (newOpenFolders.has(folderId)) {
      newOpenFolders.delete(folderId)
    } else {
      newOpenFolders.add(folderId)
    }
    setOpenFolders(newOpenFolders)
  }

  const renderItem = (item: SidebarItem, depth = 0) => {
    const isOpen = openFolders.has(item.id)
    const isActive = activeFile === item.id

    return (
      <div key={item.id}>
        <div
          className={cn(
            "flex items-center py-1 px-2 cursor-pointer text-sm vscode-sidebar-item",
            isActive && "vscode-sidebar-item active",
            "hover:bg-sidebar-accent",
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (item.type === "folder") {
              toggleFolder(item.id)
            } else {
              onFileSelect(item.id)
            }
          }}
        >
          {item.type === "folder" ? (
            <>
              {isOpen ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}
              {isOpen ? <FolderOpen className="w-4 h-4 mr-2" /> : <Folder className="w-4 h-4 mr-2" />}
            </>
          ) : (
            <>
              <div className="w-4 h-4 mr-1" />
              <File className="w-4 h-4 mr-2" />
            </>
          )}
          <span>{item.name}</span>
        </div>
        {item.type === "folder" && isOpen && item.children && (
          <div>{item.children.map((child) => renderItem(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen overflow-y-auto">
      {activeView === "explorer" && (
        <>
          <div className="p-3 border-b border-sidebar-border">
            <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">Explorer</h2>
          </div>
          <div className="py-2">{sidebarData.map((item) => renderItem(item))}</div>
        </>
      )}

      {activeView === "search" && (
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
              <div className="px-3 py-2 text-xs text-muted-foreground">{filteredFiles.length} results</div>
            )}
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "flex items-center py-1 px-2 cursor-pointer text-sm vscode-sidebar-item",
                  activeFile === file.id && "vscode-sidebar-item active",
                  "hover:bg-sidebar-accent",
                )}
                style={{ paddingLeft: "8px" }}
                onClick={() => onFileSelect(file.id)}
              >
                <File className="w-4 h-4 mr-2" />
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === "git" && (
        <>
          <div className="p-3 border-b border-sidebar-border">
            <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">Source Control</h2>
          </div>
          <div className="p-3">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4" />
                <span className="text-sm">main</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Repository</h3>
                <div className="bg-background rounded p-3 border border-sidebar-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">GitHub Repository</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <a
                    href="https://github.com/yourusername/vscode-blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 break-all"
                  >
                    github.com/yourusername/vscode-blog
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Changes</h3>
                <div className="text-sm text-muted-foreground">No changes</div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === "debug" && (
        <>
          <div className="p-3 border-b border-sidebar-border">
            <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">Run and Debug</h2>
          </div>
          <div className="p-3">
            <div className="bg-background rounded p-4 border border-sidebar-border text-center">
              <div className="text-sm text-muted-foreground mb-2">调试功能暂未开放</div>
              <div className="text-xs text-muted-foreground">Debug functionality is not available yet</div>
            </div>
          </div>
        </>
      )}

      {activeView === "extensions" && (
        <>
          <div className="p-3 border-b border-sidebar-border">
            <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">Extensions</h2>
          </div>
          <div className="p-3">
            <div className="bg-background rounded p-4 border border-sidebar-border text-center">
              <div className="text-sm text-muted-foreground mb-2">插件功能暂未开放</div>
              <div className="text-xs text-muted-foreground">Extensions functionality is not available yet</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
