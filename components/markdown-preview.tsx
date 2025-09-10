"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Markdown } from "tiptap-markdown"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "bg-[#0d1117] text-[#e6edf3] p-4 rounded-lg font-mono text-sm border border-[#30363d] my-4 overflow-x-auto",
          },
        },
        code: {
          HTMLAttributes: {
            class: "bg-[#21262d] text-[#79c0ff] px-2 py-1 rounded text-sm font-mono border border-[#30363d]",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-[#1f6feb] pl-6 pr-4 py-3 italic text-[#8b949e] bg-[#0d1117] my-6 rounded-r-md",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-6 space-y-2 text-[#e6edf3] my-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-6 space-y-2 text-[#e6edf3] my-4",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "text-[#e6edf3] leading-7 mb-4",
          },
        },
      }),
      Markdown.configure({
        html: true,
        tightLists: false,
        linkify: true,
        breaks: true,
        transformPastedText: true,
      }),
    ],
    content: "",
    editable: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none prose prose-invert max-w-none",
      },
    },
  })

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content, false, {
        preserveWhitespace: "full",
      })
    }
  }, [editor, content])

  return (
    <div className={cn("markdown-preview max-w-none p-8 bg-[#0d1117] overflow-y-auto h-full", className)}>
      <div className="max-w-4xl mx-auto">
        <EditorContent
          editor={editor}
          className="
            [&_.ProseMirror]:outline-none 
            [&_.ProseMirror]:min-h-full
            [&_.ProseMirror_h1]:text-3xl 
            [&_.ProseMirror_h1]:font-bold 
            [&_.ProseMirror_h1]:text-[#f0f6fc] 
            [&_.ProseMirror_h1]:mb-6
            [&_.ProseMirror_h1]:pb-3
            [&_.ProseMirror_h1]:border-b
            [&_.ProseMirror_h1]:border-[#30363d]
            [&_.ProseMirror_h2]:text-2xl 
            [&_.ProseMirror_h2]:font-bold 
            [&_.ProseMirror_h2]:text-[#f0f6fc] 
            [&_.ProseMirror_h2]:mb-5
            [&_.ProseMirror_h2]:pb-2
            [&_.ProseMirror_h2]:border-b
            [&_.ProseMirror_h2]:border-[#21262d]
            [&_.ProseMirror_h3]:text-xl 
            [&_.ProseMirror_h3]:font-semibold 
            [&_.ProseMirror_h3]:text-[#f0f6fc] 
            [&_.ProseMirror_h3]:mb-4
            [&_.ProseMirror_h4]:text-lg 
            [&_.ProseMirror_h4]:font-semibold 
            [&_.ProseMirror_h4]:text-[#f0f6fc] 
            [&_.ProseMirror_h4]:mb-3
            [&_.ProseMirror_h5]:text-base 
            [&_.ProseMirror_h5]:font-semibold 
            [&_.ProseMirror_h5]:text-[#f0f6fc] 
            [&_.ProseMirror_h5]:mb-3
            [&_.ProseMirror_h6]:text-sm 
            [&_.ProseMirror_h6]:font-semibold 
            [&_.ProseMirror_h6]:text-[#8b949e] 
            [&_.ProseMirror_h6]:mb-3
            [&_.ProseMirror_a]:text-[#58a6ff] 
            [&_.ProseMirror_a]:no-underline
            [&_.ProseMirror_a:hover]:underline
            [&_.ProseMirror_strong]:text-[#f0f6fc] 
            [&_.ProseMirror_strong]:font-semibold
            [&_.ProseMirror_em]:text-[#f85149] 
            [&_.ProseMirror_em]:italic
            [&_.ProseMirror_li]:text-[#e6edf3]
            [&_.ProseMirror_li]:mb-1
            [&_.ProseMirror_table]:border-collapse
            [&_.ProseMirror_table]:border
            [&_.ProseMirror_table]:border-[#30363d]
            [&_.ProseMirror_table]:my-6
            [&_.ProseMirror_th]:border
            [&_.ProseMirror_th]:border-[#30363d]
            [&_.ProseMirror_th]:bg-[#21262d]
            [&_.ProseMirror_th]:px-4
            [&_.ProseMirror_th]:py-2
            [&_.ProseMirror_th]:text-[#f0f6fc]
            [&_.ProseMirror_th]:font-semibold
            [&_.ProseMirror_td]:border
            [&_.ProseMirror_td]:border-[#30363d]
            [&_.ProseMirror_td]:px-4
            [&_.ProseMirror_td]:py-2
            [&_.ProseMirror_td]:text-[#e6edf3]
            [&_.ProseMirror_hr]:border-[#30363d]
            [&_.ProseMirror_hr]:my-8
          "
        />
      </div>
    </div>
  )
}
