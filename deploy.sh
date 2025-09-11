#!/bin/bash

# 部署脚本：将 out 目录内容推送到 GitHub Pages 仓库
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署到 GitHub Pages..."

# 检查 out 目录是否存在
if [ ! -d "out" ]; then
    echo "❌ 错误：out 目录不存在，请先运行 'npm run build' 或 'pnpm build'"
    exit 1
fi

# 进入 out 目录
cd out

# 创建 Cloudflare Pages 配置文件（不使用 wrangler.toml）
echo "📄 创建 Cloudflare Pages 配置..."

# 创建 _headers 文件用于设置 HTTP 头
cat > _headers << 'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable
EOF

# 创建 _redirects 文件用于处理 SPA 路由
cat > _redirects << 'EOF'
/*    /index.html   200
EOF

# 创建 _routes.json 文件用于路由配置
cat > _routes.json << 'EOF'
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"]
}
EOF

echo "✅ Cloudflare Pages 配置创建完成"

# 如果已经存在 .git 目录，先清理
if [ -d ".git" ]; then
    echo "🧹 清理现有的 git 仓库..."
    rm -rf .git
fi

# 初始化新的 git 仓库
echo "📝 初始化 git 仓库..."
git init
git checkout -b main

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin https://github.com/BiscuitCoder/vscode-blog-out.git

# 添加所有文件
echo "📦 添加文件到 git..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M:%S')"

# 强制推送（覆盖远程仓库内容）
echo "⬆️  推送代码到 GitHub..."
git push -f origin main

echo "✅ 部署完成！"
echo "🌐 你的网站将在 https://BiscuitCoder.github.io/vscode-blog-out/ 可用"
