"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarItem } from "@/lib/blog-data"

interface VSCodeExplorerViewProps {
  sidebarData: SidebarItem[]
  activeFile: string
  onFileSelect: (fileId: string) => void
}

export function VSCodeExplorerView({ sidebarData, activeFile, onFileSelect }: VSCodeExplorerViewProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(["blog", "posts"]))

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
            "flex items-center py-1 px-2 cursor-pointer text-sm vscode-sidebar-item overflow-hidden",
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
              {isOpen ? <ChevronDown className="w-4 h-4 mr-1 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 mr-1 flex-shrink-0" />}
              {isOpen ? <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0" /> : <Folder className="w-4 h-4 mr-2 flex-shrink-0" />}
            </>
          ) : (
            <>
              <div className="w-4 h-4 mr-1 flex-shrink-0" />
              <File className="w-4 h-4 mr-2 flex-shrink-0" />
            </>
          )}
          <span className="truncate min-w-0" title={item.name}>{item.name}</span>
        </div>
        {item.type === "folder" && isOpen && item.children && (
          <div>{item.children.map((child) => renderItem(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="p-3 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">Explorer</h2>
      </div>
      <div className="py-2">{sidebarData.map((item) => renderItem(item))}</div>
    </>
  )
}
