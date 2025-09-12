"use client"

import { X, Eye, Code } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  name: string
  isDirty?: boolean
}

interface VSCodeTabsProps {
  tabs: Tab[]
  activeTab: string
  viewMode: "code" | "preview"
  onTabSelect: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onViewModeChange: (mode: "code" | "preview") => void
}

export function VSCodeTabs({ tabs, activeTab, viewMode, onTabSelect, onTabClose, onViewModeChange }: VSCodeTabsProps) {
  return (
    <div className="flex bg-muted border-b border-border">
      <div className="max-w-[calc(100vw-130px)] flex flex-1 overflow-x-auto scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground/30 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50 scroll-smooth flex-nowrap min-w-0 supports-[overflow-x-overlay]:scrollbar-gutter-stable">
        {tabs.length > 0 && [
          { id: 'welcome', name: 'Welcome' },
          ...tabs,
        ].map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "flex items-center px-4 py-2 text-sm cursor-pointer vscode-tab border-black hover:bg-[#0d1117]",
              activeTab === tab.id && "vscode-tab active",
            )}
            onClick={() => onTabSelect(tab.id)}
          >
            <span className="mr-2 whitespace-nowrap">
              {tab.name}
              {tab.isDirty && <span className="text-primary">●</span>}
            </span>
            {
              tab.id !== 'welcome' && <button
                className="ml-auto hover:bg-destructive hover:text-destructive-foreground rounded p-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onTabClose(tab.id)
                }}
              >
                <X className="w-3 h-3" />
              </button>
            }
          </div>
        ))}
      </div>

      {tabs.length > 0 && (
        <div className="flex border-l border-border">
          <button
            className={cn(
              "flex items-center px-3 py-2 text-sm border-r border-border",
              viewMode === "code" ? "bg-background" : "hover:bg-sidebar-accent",
            )}
            onClick={() => onViewModeChange("code")}
            title="Code View"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            className={cn(
              "flex items-center px-3 py-2 text-sm",
              viewMode === "preview" ? "bg-background" : "hover:bg-sidebar-accent",
            )}
            onClick={() => onViewModeChange("preview")}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
