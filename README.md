# Vscode blog

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/kelens-projects/v0-vscode-blog)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/T9q6VlPYrN6)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/kelens-projects/v0-vscode-blog](https://vercel.com/kelens-projects/v0-vscode-blog)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/T9q6VlPYrN6](https://v0.app/chat/projects/T9q6VlPYrN6)**

## Writing Guide

### 添加新文章

1. **直接编辑文件**：在 `public/data/posts/` 目录下创建或编辑 Markdown 文件

2. **目录结构**：

   ```text
   public/data/posts/
   ├── 分类名称/
   │   └── 文章名称.md
   ```

3. **生成配置**：
   ```bash
   pnpm run generate-config
   ```

4. **启动开发服务器**：

   ```bash
   pnpm dev
   ```

### Markdown 格式示例

```markdown
# 文章标题

文章简介...

## 二级标题

正文内容...

### 三级标题

- 列表项
- 另一个列表项

```javascript
// 代码块
console.log('Hello World!');
```

**粗体文本** 和 *斜体文本*

[链接](https://example.com)
```

## 技术栈

- **前端框架**：Next.js 14
- **开发语言**：TypeScript
- **样式框架**：Tailwind CSS
- **UI 组件**：Radix UI
- **编辑器**：TipTap
- **部署平台**：Vercel / Netlify / Cloudflare Pages

## 核心功能

- 🎨 **VS Code 风格界面**：熟悉的编辑器体验
- 📝 **Markdown 支持**：实时预览和语法高亮
- 🏗️ **现代化技术栈**：Next.js 14 + TypeScript + Tailwind CSS
- 📱 **响应式设计**：完美支持桌面和移动设备
- 🚀 **静态部署**：支持 Vercel、Netlify、Cloudflare Pages 等

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository