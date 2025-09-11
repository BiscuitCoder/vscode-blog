"use client"

interface VSCodeDebugViewProps {
  // 调试视图目前不需要特殊的props，但保留接口以便将来扩展
}

export function VSCodeDebugView({ }: VSCodeDebugViewProps) {
  return (
    <>
      <div className="p-3 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">Run and Debug</h2>
      </div>
      <div className="p-3">
        <div className="bg-background rounded p-4 border border-sidebar-border text-center">
          <div className="text-xs text-muted-foreground">Debug functionality is not available yet</div>
        </div>
      </div>
    </>
  )
}
