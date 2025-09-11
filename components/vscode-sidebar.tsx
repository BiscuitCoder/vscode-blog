"use client"

import { VSCodeExplorerView } from "./vscode-explorer-view"
import { VSCodeSearchView } from "./vscode-search-view"
import { VSCodeGitView } from "./vscode-git-view"
import { VSCodeDebugView } from "./vscode-debug-view"
import { VSCodeExtensionsView } from "./vscode-extensions-view"
import { SidebarItem } from "@/lib/blog-data"

interface SidebarProps {
  sidebarData: SidebarItem[]
  activeFile: string
  onFileSelect: (fileId: string) => void
  activeView: "explorer" | "search" | "git" | "debug" | "extensions"
}

export function VSCodeSidebar({ sidebarData, activeFile, onFileSelect, activeView }: SidebarProps) {

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen overflow-y-auto">
      {activeView === "explorer" && (
        <VSCodeExplorerView
          sidebarData={sidebarData}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
        />
      )}

      {activeView === "search" && (
        <VSCodeSearchView
          sidebarData={sidebarData}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
        />
      )}

      {activeView === "git" && (
        <VSCodeGitView />
      )}

      {activeView === "debug" && (
        <VSCodeDebugView />
      )}

      {activeView === "extensions" && (
        <VSCodeExtensionsView />
      )}
    </div>
  )
}
