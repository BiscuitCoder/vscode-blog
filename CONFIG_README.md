# 博客配置系统使用指南

## 📁 项目结构

```
data/
├── posts/           # 文章目录（按分类组织）
│   ├── react/       # React 相关文章
│   │   └── react-hooks.md
│   ├── nextjs/      # Next.js 相关文章
│   │   └── nextjs-guide.md
│   ├── typescript/  # TypeScript 相关文章
│   │   └── typescript-tips.md
│   ├── about/       # 关于页面文章
│   │   ├── about.md
│   │   └── test-article.md
│   └── [category]/  # 新增分类目录
│       └── article.md
└── pageconfig.json  # 自动生成的配置文件

scripts/
└── generate-config.js  # 配置生成脚本
```

## 🚀 使用方法

### 1. 添加新文章

在相应的分类目录中创建新的 Markdown 文件：

```bash
# 创建新的 React 文章
mkdir -p data/posts/react
echo "# 新 React 特性

这里是关于 React 新特性的内容...

## 主要改进

- 性能优化
- 新增 Hook
- 更好的 TypeScript 支持" > data/posts/react/new-react-feature.md

# 创建新的工具类文章
mkdir -p data/posts/tools
echo "# 开发工具指南

介绍常用的开发工具...

## 推荐工具

- VS Code
- Git
- Docker" > data/posts/tools/dev-tools.md
```

### 2. 生成配置文件

运行配置生成脚本：

```bash
# 使用 npm 脚本
npm run generate-config

# 或直接运行
node scripts/generate-config.js
```

### 3. 自动分类和部署

脚本会自动：
- 📖 读取所有 `.md` 文件
- 📝 提取标题和描述
- 🏷️ 基于文件名智能分类
- 📊 生成菜单结构
- 💾 保存到 `data/pageconfig.json`
- 🌐 自动复制到 `public/data/pageconfig.json` 供客户端访问

## 📋 支持的分类规则

脚本会根据文件名自动分类：

| 文件名包含 | 分类 |
|-----------|------|
| `react` | React |
| `typescript`/`ts` | TypeScript |
| `nextjs`/`next` | Next.js |
| `about` | About |
| 其他 | General |

## 🔧 配置文件格式

```json
{
  "posts": {
    "article-id": {
      "id": "article-id",
      "name": "article-id.md",
      "title": "文章标题",
      "description": "文章描述...",
      "category": "分类名称",
      "content": "# Markdown 内容",
      "path": "/data/posts/article-id.md",
      "lastModified": "2025-09-10T03:27:45.728Z"
    }
  },
  "menu": {
    "categories": ["React", "TypeScript", "Next.js"],
    "items": [...],
    "groupedItems": {
      "React": [...],
      "TypeScript": [...],
      "Next.js": [...]
    }
  },
  "lastUpdated": "2025-09-10T03:28:00.380Z"
}
```

## 🎯 开发环境特性

- 🔄 开发模式下自动检测配置文件更新（5秒间隔）
- 📦 生产模式下使用缓存以提高性能
- 🛡️ 错误处理：配置文件不存在时返回默认配置

## 📝 自定义分类

如需自定义分类逻辑，请编辑 `scripts/generate-config.js` 中的 `extractCategory` 函数：

```javascript
function extractCategory(filename) {
  // 自定义分类规则
  if (filename.includes('custom-keyword')) return 'Custom Category';
  // ... 更多规则
}
```

## 🔄 工作流程

1. **添加文章** → 在 `data/posts/` 中创建 `.md` 文件
2. **运行脚本** → `npm run generate-config`
3. **自动更新** → 配置文件和菜单自动更新
4. **即时预览** → 博客界面实时反映变化

## 💡 最佳实践

- 📝 使用有意义的英文文件名作为 ID
- 🏷️ 在 Markdown 文件中使用标准格式（`# 标题`）
- 🔄 每次添加新文章后运行生成脚本
- 📊 定期检查配置文件是否正确更新

## 🐛 故障排除

**配置文件未更新？**
```bash
# 强制重新生成
rm data/pageconfig.json
npm run generate-config
```

**分类不正确？**
- 检查文件名是否包含关键词
- 修改 `scripts/generate-config.js` 中的分类逻辑

**应用未显示新文章？**
- 确保运行了生成脚本
- 检查浏览器控制台是否有错误
- 在开发模式下，配置文件会自动重新加载

## 🎯 新功能特性

### 欢迎页面
- 🏠 默认启动时显示美观的欢迎页面
- 📑 关闭所有标签后自动显示欢迎页面
- 🕒 展示最近更新的文章预览
- 🚀 提供快速开始指南和写作提示
- 🎨 现代化UI设计，包含图标和动画效果

### 目录结构分类
- 📂 严格按照 `data/posts/` 下的目录结构生成分类
- 🗂️ 每个子目录自动成为一个分类
- 🔄 支持无限层级目录结构
- 📋 自动生成分类菜单和导航
- 🏷️ 目录名自动格式化为标题样式（如 `react` → `React`）

### 工作流程优化
1. **创建分类** → `mkdir -p data/posts/new-category`
2. **添加文章** → 创建 `.md` 文件到对应目录
3. **生成配置** → `npm run generate-config`
4. **即时生效** → 博客界面自动更新分类和菜单

### 标签状态持久化

#### 功能特性
- 🔄 **自动保存** - 每次打开/关闭标签时自动保存状态
- 📱 **跨会话保持** - 刷新页面后恢复上次浏览状态
- 🎯 **智能恢复** - 优先恢复最后活动的标签
- 💾 **本地存储** - 使用浏览器 localStorage 保存状态

#### 存储结构
```javascript
{
  "tabs": [
    { "id": "react-hooks", "name": "react-hooks.md" },
    { "id": "typescript-tips", "name": "typescript-tips.md" }
  ],
  "activeTabId": "react-hooks"
}
```

#### 工作原理
1. **打开文章** → 自动添加到标签列表并设为活动状态
2. **关闭标签** → 从列表中移除，如果是活动标签则自动选择相邻标签
3. **切换标签** → 更新活动状态
4. **刷新页面** → 从本地存储恢复所有标签和活动状态
5. **清空标签** → 移除所有标签，显示欢迎页面

### 界面优化特性

#### 欢迎页面
- 🎨 **美观设计** - VSCode 风格的欢迎界面
- 📱 **响应式布局** - 支持移动端和桌面端
- 🔄 **滚动优化** - 内容过多时可正常滚动
- 📚 **快速预览** - 显示最近更新的文章
- 🎯 **交互友好** - 点击文章可直接跳转阅读

#### 自定义滚动条
- 🎨 **主题一致** - 与 VSCode 暗色主题完美融合
- 🌐 **跨浏览器** - 支持 Webkit 和 Firefox
- 📏 **尺寸适中** - 合适的宽度和高度
- ✨ **悬停效果** - 鼠标悬停时的视觉反馈
- 🎯 **容器定制** - 不同区域有不同的滚动条样式

#### 滚动条样式详情
```css
/* 主滚动条 (侧边栏等) */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

/* 内容区域滚动条 (欢迎页面、预览区域) */
.welcome-page::-webkit-scrollbar,
.markdown-preview::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
```
