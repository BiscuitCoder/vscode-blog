"use client"

import { Files, Search, GitBranch, Bug, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolbarProps {
  activeView: "explorer" | "search" | "git" | "debug" | "extensions"
  onViewChange: (view: "explorer" | "search" | "git" | "debug" | "extensions") => void
}

export function VSCodeToolbar({ activeView, onViewChange }: ToolbarProps) {
  const toolbarItems = [
    { id: "explorer", icon: Files, label: "Explorer" },
    { id: "search", icon: Search, label: "Search" },
    { id: "git", icon: GitBranch, label: "Source Control" },
    { id: "debug", icon: Bug, label: "Run and Debug" },
    { id: "extensions", icon: Package, label: "Extensions" },
  ]

  return (
    <div className="w-12 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {toolbarItems.map((item) => (
        <button
          key={item.id}
          className={cn(
            "flex items-center justify-center w-12 h-12 border-b border-sidebar-border/50 transition-colors",
            activeView === item.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50",
          )}
          onClick={() => onViewChange(item.id as "explorer" | "search" | "git" | "debug" | "extensions")}
          title={item.label}
        >
          <item.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  )
}
