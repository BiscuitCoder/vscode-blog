# Cloudflare Pages 部署指南

## 🚀 最简单的部署步骤

### 1. 构建项目

```bash
pnpm build
```

### 2. 部署到 GitHub

```bash
pnpm deploy
```

## 🔧 Cloudflare Pages 设置

### 第一步：创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 "Pages" 标签
3. 点击 "Create a project"
4. 选择 "Connect to Git"

### 第二步：连接 GitHub 仓库

1. 选择你的 GitHub 账户
2. 选择仓库 `vscode-blog-out`
3. 配置构建设置：
   - **Build command**: 留空（不需要构建）
   - **Build output directory**: `/` (根目录)
   - **Root directory**: `/` (留空)

### 第三步：部署

- Cloudflare 会自动检测 `_headers` 和 `_redirects` 文件
- 首次部署可能需要几分钟
- 之后每次推送到 `main` 分支都会自动重新部署

## ✅ 自动创建的文件

部署时会自动在 `out/` 目录创建以下文件：

- **`_headers`** - HTTP 安全头和缓存设置
- **`_redirects`** - SPA 路由重定向规则
- **`_routes.json`** - 路由配置（排除 API 路径）

## 🌐 访问你的网站

部署完成后，你可以通过以下 URL 访问：

- `https://你的项目名.pages.dev`
- 或自定义域名（在 Cloudflare Pages 设置中配置）

## 📝 注意事项

- 确保 GitHub 仓库 `vscode-blog-out` 是公开的，或者你已授权 Cloudflare 访问私有仓库
- 首次部署可能需要几分钟时间
- Cloudflare Pages 会自动处理 HTTPS 和 CDN
