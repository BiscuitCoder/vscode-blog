"use client"

import { cn } from "@/lib/utils"

interface VSCodeEditorProps {
  content: string
  language?: string
  showLineNumbers?: boolean
}

export function VSCodeEditor({ content, language = "markdown", showLineNumbers = true }: VSCodeEditorProps) {
  const lines = content.split("\n")

  const highlightMarkdown = (text: string) => {
    return (
      text
        // Headers
        .replace(
          /^(#{1,6})\s(.*)$/gm,
          '<span class="text-primary font-bold">$1</span> <span class="text-primary font-semibold">$2</span>',
        )
        // Bold
        .replace(
          /(\*\*)(.*?)(\*\*)/g,
          '<span class="text-yellow-400">$1</span><span class="font-bold">$2</span><span class="text-yellow-400">$3</span>',
        )
        // Italic
        .replace(
          /(\*)(.*?)(\*)/g,
          '<span class="text-yellow-400">$1</span><span class="italic">$2</span><span class="text-yellow-400">$3</span>',
        )
        // Code blocks
        .replace(
          /(```)([\s\S]*?)(```)/g,
          '<span class="text-green-400">$1</span><span class="text-green-300">$2</span><span class="text-green-400">$3</span>',
        )
        // Inline code
        .replace(
          /(`)(.*?)(`)/g,
          '<span class="text-green-400">$1</span><span class="text-green-300">$2</span><span class="text-green-400">$3</span>',
        )
        // Links
        .replace(
          /(\[)(.*?)(\])($$)(.*?)($$)/g,
          '<span class="text-blue-400">$1</span><span class="text-blue-300">$2</span><span class="text-blue-400">$3$4</span><span class="text-blue-300">$5</span><span class="text-blue-400">$6</span>',
        )
    )
  }

  return (
    <div className="flex bg-background text-foreground font-mono text-sm h-full">
      {showLineNumbers && (
        <div className="bg-muted px-3 py-4 border-r border-border min-w-[60px]">
          {lines.map((_, index) => (
            <div key={index} className="vscode-line-numbers leading-6 text-right">
              {index + 1}
            </div>
          ))}
        </div>
      )}
      <div className="flex-1 p-4 overflow-auto">
        <pre className="whitespace-pre-wrap leading-6">
          {language === "markdown" ? (
            <div dangerouslySetInnerHTML={{ __html: highlightMarkdown(content) }} />
          ) : (
            <code className={cn("language-" + language)}>{content}</code>
          )}
        </pre>
      </div>
    </div>
  )
}
