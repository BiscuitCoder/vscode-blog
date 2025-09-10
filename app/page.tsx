"use client"

import { useState } from "react"
import { VSCodeToolbar } from "@/components/vscode-toolbar"
import { VSCodeSidebar } from "@/components/vscode-sidebar"
import { VSCodeTabs } from "@/components/vscode-tabs"
import { VSCodeEditor } from "@/components/vscode-editor"
import { MarkdownPreview } from "@/components/markdown-preview"

const blogPosts = {
  "react-hooks": {
    name: "react-hooks.md",
    content: `# React Hooks 完全指南

## 什么是 React Hooks？

React Hooks 是 React 16.8 引入的新特性，它让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

## 常用的 Hooks

### useState

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### useEffect

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## 自定义 Hooks

自定义 Hook 是一个函数，其名称以 "use" 开头，函数内部可以调用其他的 Hook。

\`\`\`javascript
import { useState, useEffect } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
\`\`\`

## 总结

React Hooks 提供了一种更简洁、更灵活的方式来编写 React 组件，让函数组件拥有了类组件的所有能力。`,
  },
  "typescript-tips": {
    name: "typescript-tips.md",
    content: `# TypeScript 实用技巧

## 类型断言

\`\`\`typescript
// 类型断言的两种语法
const someValue: unknown = "this is a string";
const strLength1: number = (someValue as string).length;
const strLength2: number = (<string>someValue).length;
\`\`\`

## 联合类型

\`\`\`typescript
type Status = "loading" | "success" | "error";

function handleStatus(status: Status) {
  switch (status) {
    case "loading":
      return "正在加载...";
    case "success":
      return "加载成功！";
    case "error":
      return "加载失败！";
  }
}
\`\`\`

## 泛型

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

// 使用
const output1 = identity<string>("myString");
const output2 = identity<number>(100);
\`\`\`

## 实用工具类型

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - 所有属性变为可选
type PartialUser = Partial<User>;

// Pick - 选择特定属性
type UserInfo = Pick<User, "name" | "email">;

// Omit - 排除特定属性
type UserWithoutId = Omit<User, "id">;
\`\`\`

这些技巧可以帮助你更好地使用 TypeScript！`,
  },
  "nextjs-guide": {
    name: "nextjs-guide.md",
    content: `# Next.js 开发指南

## App Router

Next.js 13 引入了新的 App Router，基于 React Server Components。

### 文件结构

\`\`\`
app/
  layout.tsx      # 根布局
  page.tsx        # 首页
  about/
    page.tsx      # /about 页面
  blog/
    page.tsx      # /blog 页面
    [slug]/
      page.tsx    # /blog/[slug] 动态路由
\`\`\`

### 服务端组件

\`\`\`typescript
// app/page.tsx
async function HomePage() {
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();

  return (
    <div>
      <h1>博客文章</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

export default HomePage;
\`\`\`

### 客户端组件

\`\`\`typescript
'use client'

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      点击次数: {count}
    </button>
  );
}

export default Counter;
\`\`\`

## 数据获取

### Server Actions

\`\`\`typescript
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // 保存到数据库
  await savePost({ title, content });
  
  redirect('/blog');
}
\`\`\`

Next.js 提供了强大的全栈开发能力！`,
  },
  about: {
    name: "about.md",
    content: `# 关于我

## 👋 你好！

我是一名全栈开发者，专注于现代 Web 技术栈。

## 🛠️ 技术栈

- **前端**: React, Next.js, TypeScript, Tailwind CSS
- **后端**: Node.js, Python, PostgreSQL, MongoDB
- **工具**: Git, Docker, VS Code, Figma

## 📝 博客主题

这个博客主要分享：

- React 和 Next.js 开发经验
- TypeScript 最佳实践
- 前端工程化
- 全栈开发技巧

## 📫 联系方式

- Email: developer@example.com
- GitHub: @developer
- Twitter: @developer

感谢你的访问！`,
  },
}

export default function VSCodeBlog() {
  const [activeFile, setActiveFile] = useState("react-hooks")
  const [openTabs, setOpenTabs] = useState([
    { id: "react-hooks", name: "react-hooks.md" },
    { id: "typescript-tips", name: "typescript-tips.md" },
  ])
  const [viewMode, setViewMode] = useState<"code" | "preview">("preview")
  const [activeView, setActiveView] = useState<"explorer" | "search" | "git" | "debug" | "extensions">("explorer")

  const handleFileSelect = (fileId: string) => {
    setActiveFile(fileId)

    // 如果文件不在标签页中，添加它
    if (!openTabs.find((tab) => tab.id === fileId) && blogPosts[fileId as keyof typeof blogPosts]) {
      const newTab = {
        id: fileId,
        name: blogPosts[fileId as keyof typeof blogPosts].name,
      }
      setOpenTabs([...openTabs, newTab])
    }
  }

  const handleTabClose = (tabId: string) => {
    const newTabs = openTabs.filter((tab) => tab.id !== tabId)
    setOpenTabs(newTabs)

    // 如果关闭的是当前活动标签页，切换到第一个标签页
    if (tabId === activeFile && newTabs.length > 0) {
      setActiveFile(newTabs[0].id)
    }
  }

  const currentPost = blogPosts[activeFile as keyof typeof blogPosts]

  return (
    <div className="flex h-screen bg-background text-foreground">
      <VSCodeToolbar activeView={activeView} onViewChange={setActiveView} />

      <VSCodeSidebar activeFile={activeFile} onFileSelect={handleFileSelect} activeView={activeView} />

      <div className="flex-1 flex flex-col">
        <VSCodeTabs
          tabs={openTabs}
          activeTab={activeFile}
          viewMode={viewMode}
          onTabSelect={setActiveFile}
          onTabClose={handleTabClose}
          onViewModeChange={setViewMode}
        />

        <div className="flex-1 overflow-hidden">
          {currentPost ? (
            viewMode === "code" ? (
              <VSCodeEditor content={currentPost.content} language="markdown" showLineNumbers={true} />
            ) : (
              <MarkdownPreview content={currentPost.content} />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>选择一个文件开始阅读</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
