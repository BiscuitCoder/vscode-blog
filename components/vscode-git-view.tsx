"use client"

import { GitBranch, ExternalLink } from "lucide-react"

interface VSCodeGitViewProps {
  // Git视图目前不需要特殊的props，但保留接口以便将来扩展
}

export function VSCodeGitView({ }: VSCodeGitViewProps) {
  return (
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
                href="https://github.com/BiscuitCoder"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 break-all"
              >
               https://github.com/BiscuitCoder
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
  )
}
