# WowNav TS - TypeScript 导航网站生成器

## 项目概述

WowNav TS 是一个基于 TypeScript 开发的现代化导航网站生成器，为用户提供快速创建和管理个人导航页面的解决方案。项目采用模块化架构，支持多种主题和布局，用户可以通过简单的配置快速生成专业的导航网站。

## 核心功能

### 🎨 网站生成
- **模板引擎**: 多种预设模板选择
- **自定义布局**: 灵活的页面布局配置
- **响应式设计**: 完美适配各种设备
- **SEO 优化**: 内置搜索引擎优化

### 📊 书签管理
- **批量导入**: 支持 Chrome 书签导入
- **分类管理**: 智能的书签分类系统
- **搜索功能**: 快速书签搜索和过滤
- **云端同步**: 跨设备书签同步

### 🎯 主题系统
- **内置主题**: 多种精美主题选择
- **自定义主题**: CSS 变量自定义样式
- **主题切换**: 实时主题切换效果
- **深色模式**: 完善的暗色主题支持

## 技术架构

### 核心架构
```typescript
// 导航网站生成器核心类
class NavGenerator {
  private config: NavConfig
  private templateEngine: TemplateEngine
  private bookmarkManager: BookmarkManager
  private themeManager: ThemeManager

  constructor(config: NavConfig) {
    this.config = config
    this.templateEngine = new TemplateEngine()
    this.bookmarkManager = new BookmarkManager()
    this.themeManager = new ThemeManager()
  }

  // 生成导航网站
  public async generate(): Promise<GeneratedSite> {
    // 1. 验证配置
    await this.validateConfig()

    // 2. 处理书签数据
    const bookmarks = await this.bookmarkManager.processBookmarks(this.config.bookmarks)

    // 3. 应用主题
    const theme = await this.themeManager.loadTheme(this.config.theme)

    // 4. 生成 HTML
    const html = await this.templateEngine.render({
      ...this.config,
      bookmarks,
      theme
    })

    // 5. 生成静态资源
    const assets = await this.generateAssets()

    return {
      html,
      assets,
      config: this.config
    }
  }

  // 验证配置
  private async validateConfig(): Promise<void> {
    const validator = new ConfigValidator()

    const errors = await validator.validate(this.config)
    if (errors.length > 0) {
      throw new ValidationError('Configuration validation failed', errors)
    }
  }

  // 生成静态资源
  private async generateAssets(): Promise<AssetBundle> {
    const bundler = new AssetBundler()

    return await bundler.bundle({
      styles: this.config.styles,
      scripts: this.config.scripts,
      images: this.config.images
    })
  }
}

// 配置接口
interface NavConfig {
  title: string
  description: string
  author: string
  theme: string
  layout: LayoutConfig
  bookmarks: Bookmark[]
  styles: StyleConfig
  scripts: ScriptConfig
  seo: SEOConfig
}

// 书签接口
interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  category: string
  icon?: string
  tags: string[]
  order: number
}
```

### 模板引擎
```typescript
// 模板引擎类
class TemplateEngine {
  private templates: Map<string, HandlebarsTemplate> = new Map()
  private cache: Map<string, string> = new Map()

  constructor() {
    this.loadBuiltInTemplates()
  }

  // 加载内置模板
  private loadBuiltInTemplates(): void {
    // 经典布局模板
    this.templates.set('classic', classicTemplate)
    // 网格布局模板
    this.templates.set('grid', gridTemplate)
    // 卡片布局模板
    this.templates.set('card', cardTemplate)
    // 极简布局模板
    this.templates.set('minimal', minimalTemplate)
  }

  // 渲染模板
  public async render(data: TemplateData): Promise<string> {
    const cacheKey = this.generateCacheKey(data)

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const template = this.templates.get(data.layout.template)
    if (!template) {
      throw new Error(`Template '${data.layout.template}' not found`)
    }

    // 注册辅助函数
    this.registerHelpers()

    // 编译并渲染
    const compiledTemplate = Handlebars.compile(template)
    const result = compiledTemplate(data)

    // 缓存结果
    this.cache.set(cacheKey, result)

    return result
  }

  // 注册 Handlebars 辅助函数
  private registerHelpers(): void {
    Handlebars.registerHelper('formatDate', (date: Date) => {
      return new Intl.DateTimeFormat('zh-CN').format(date)
    })

    Handlebars.registerHelper('truncate', (str: string, len: number) => {
      return str.length > len ? str.substring(0, len) + '...' : str
    })

    Handlebars.registerHelper('urlencode', (str: string) => {
      return encodeURIComponent(str)
    })
  }

  // 生成缓存键
  private generateCacheKey(data: TemplateData): string {
    return crypto.createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex')
  }
}
```

### 书签管理器
```typescript
// 书签管理器类
class BookmarkManager {
  private storage: BookmarkStorage
  private importer: BookmarkImporter
  private exporter: BookmarkExporter

  constructor() {
    this.storage = new BookmarkStorage()
    this.importer = new BookmarkImporter()
    this.exporter = new BookmarkExporter()
  }

  // 处理书签数据
  public async processBookmarks(bookmarks: Bookmark[]): Promise<ProcessedBookmark[]> {
    const processed: ProcessedBookmark[] = []

    for (const bookmark of bookmarks) {
      const processedBookmark = await this.processBookmark(bookmark)
      processed.push(processedBookmark)
    }

    // 按分类分组
    return this.groupByCategory(processed)
  }

  // 处理单个书签
  private async processBookmark(bookmark: Bookmark): Promise<ProcessedBookmark> {
    // 获取网站图标
    const icon = await this.getWebsiteIcon(bookmark.url)

    // 获取网站描述
    const description = bookmark.description || await this.getWebsiteDescription(bookmark.url)

    // 验证 URL
    const isValidUrl = await this.validateUrl(bookmark.url)

    return {
      ...bookmark,
      icon,
      description,
      isValidUrl,
      processedAt: new Date()
    }
  }

  // 获取网站图标
  private async getWebsiteIcon(url: string): Promise<string> {
    try {
      const domain = new URL(url).hostname
      const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
      return iconUrl
    } catch (error) {
      return '/default-icon.png'
    }
  }

  // 获取网站描述
  private async getWebsiteDescription(url: string): Promise<string> {
    try {
      // 这里可以集成网站描述获取服务
      // 例如：使用 OpenGraph 或网站 meta 标签
      return 'Website description'
    } catch (error) {
      return 'No description available'
    }
  }

  // 验证 URL
  private async validateUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      return false
    }
  }

  // 按分类分组
  private groupByCategory(bookmarks: ProcessedBookmark[]): ProcessedBookmark[] {
    const grouped = bookmarks.reduce((acc, bookmark) => {
      const category = bookmark.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(bookmark)
      return acc
    }, {} as Record<string, ProcessedBookmark[]>)

    // 排序并扁平化
    const result: ProcessedBookmark[] = []
    Object.keys(grouped).sort().forEach(category => {
      result.push(...grouped[category])
    })

    return result
  }

  // 从 Chrome 导入书签
  public async importFromChrome(bookmarksHtml: string): Promise<Bookmark[]> {
    return await this.importer.fromChrome(bookmarksHtml)
  }

  // 导出为各种格式
  public async exportBookmarks(bookmarks: Bookmark[], format: 'html' | 'json' | 'csv'): Promise<string> {
    switch (format) {
      case 'html':
        return await this.exporter.toHtml(bookmarks)
      case 'json':
        return await this.exporter.toJson(bookmarks)
      case 'csv':
        return await this.exporter.toCsv(bookmarks)
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }
}
```

### 主题管理器
```typescript
// 主题管理器类
class ThemeManager {
  private themes: Map<string, Theme> = new Map()
  private customThemes: Map<string, Theme> = new Map()

  constructor() {
    this.loadBuiltInThemes()
  }

  // 加载内置主题
  private loadBuiltInThemes(): void {
    this.themes.set('default', defaultTheme)
    this.themes.set('dark', darkTheme)
    this.themes.set('light', lightTheme)
    this.themes.set('blue', blueTheme)
    this.themes.set('green', greenTheme)
    this.themes.set('purple', purpleTheme)
  }

  // 加载主题
  public async loadTheme(themeName: string): Promise<Theme> {
    // 首先检查自定义主题
    if (this.customThemes.has(themeName)) {
      return this.customThemes.get(themeName)!
    }

    // 然后检查内置主题
    if (this.themes.has(themeName)) {
      return this.themes.get(themeName)!
    }

    throw new Error(`Theme '${themeName}' not found`)
  }

  // 创建自定义主题
  public createCustomTheme(name: string, config: ThemeConfig): Theme {
    const theme = this.buildThemeFromConfig(config)
    this.customThemes.set(name, theme)
    return theme
  }

  // 应用主题变量
  public applyThemeVariables(theme: Theme): string {
    const variables: string[] = []

    Object.entries(theme.colors).forEach(([key, value]) => {
      variables.push(`--color-${key}: ${value}`)
    })

    Object.entries(theme.fonts).forEach(([key, value]) => {
      variables.push(`--font-${key}: ${value}`)
    })

    Object.entries(theme.spacing).forEach(([key, value]) => {
      variables.push(`--spacing-${key}: ${value}`)
    })

    return `:root {\n  ${variables.join(';\n  ')};\n}`
  }

  // 构建主题对象
  private buildThemeFromConfig(config: ThemeConfig): Theme {
    return {
      name: config.name,
      colors: {
        primary: config.primary || '#3b82f6',
        secondary: config.secondary || '#64748b',
        background: config.background || '#ffffff',
        surface: config.surface || '#f8fafc',
        text: config.text || '#1e293b',
        textSecondary: config.textSecondary || '#64748b',
        border: config.border || '#e2e8f0',
        ...config.colors
      },
      fonts: {
        primary: config.fontFamily || '"Inter", sans-serif',
        mono: config.monoFontFamily || '"JetBrains Mono", monospace',
        ...config.fonts
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        ...config.spacing
      }
    }
  }
}

// 主题接口
interface Theme {
  name: string
  colors: Record<string, string>
  fonts: Record<string, string>
  spacing: Record<string, string>
}

interface ThemeConfig {
  name: string
  primary?: string
  secondary?: string
  background?: string
  surface?: string
  text?: string
  textSecondary?: string
  border?: string
  fontFamily?: string
  monoFontFamily?: string
  colors?: Record<string, string>
  fonts?: Record<string, string>
  spacing?: Record<string, string>
}
```

## 项目结构

```
wownav-ts/
├── src/
│   ├── core/
│   │   ├── NavGenerator.ts       # 导航生成器核心
│   │   ├── TemplateEngine.ts     # 模板引擎
│   │   ├── BookmarkManager.ts    # 书签管理器
│   │   └── ThemeManager.ts       # 主题管理器
│   ├── templates/
│   │   ├── classic.hbs           # 经典模板
│   │   ├── grid.hbs             # 网格模板
│   │   ├── card.hbs             # 卡片模板
│   │   └── minimal.hbs          # 极简模板
│   ├── themes/
│   │   ├── default.ts           # 默认主题
│   │   ├── dark.ts              # 暗色主题
│   │   ├── light.ts             # 亮色主题
│   │   └── custom/              # 自定义主题
│   ├── utils/
│   │   ├── bookmark-parser.ts   # 书签解析器
│   │   ├── url-validator.ts     # URL 验证器
│   │   ├── icon-fetcher.ts      # 图标获取器
│   │   └── file-exporter.ts     # 文件导出器
│   ├── types/
│   │   ├── config.ts            # 配置类型
│   │   ├── bookmark.ts          # 书签类型
│   │   ├── theme.ts             # 主题类型
│   │   └── template.ts          # 模板类型
│   └── cli/
│       ├── index.ts             # CLI 入口
│       ├── commands/            # CLI 命令
│       └── prompts/             # 交互式提示
├── templates/                   # HTML 模板文件
│   ├── layouts/
│   │   ├── base.html            # 基础布局
│   │   ├── responsive.html      # 响应式布局
│   │   └── accessibility.html   # 无障碍布局
│   └── partials/
│       ├── header.html          # 头部组件
│       ├── navigation.html      # 导航组件
│       ├── bookmarks.html       # 书签组件
│       └── footer.html          # 底部组件
├── assets/                      # 静态资源
│   ├── styles/
│   │   ├── main.css             # 主样式文件
│   │   ├── themes/              # 主题样式
│   │   └── components/          # 组件样式
│   ├── scripts/
│   │   ├── main.js              # 主脚本
│   │   ├── search.js            # 搜索功能
│   │   └── theme-switcher.js    # 主题切换
│   └── icons/
│       ├── default-bookmark.svg  # 默认书签图标
│       ├── search.svg           # 搜索图标
│       └── settings.svg         # 设置图标
├── config/                      # 配置文件
│   ├── default-config.json      # 默认配置
│   ├── themes.json              # 主题配置
│   └── templates.json           # 模板配置
├── examples/                    # 示例文件
│   ├── bookmarks.html           # Chrome 书签示例
│   ├── config.json              # 配置示例
│   └── generated-site/          # 生成网站示例
└── docs/                        # 文档
    ├── README.md                # 项目说明
    ├── API.md                   # API 文档
    ├── templates.md             # 模板开发指南
    └── deployment.md            # 部署指南
```

## 模板系统

### 经典模板
```handlebars
<!-- classic.hbs -->
<!DOCTYPE html>
<html lang="{{language}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <meta name="description" content="{{description}}">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body class="{{theme.name}}">
  <header class="header">
    <div class="container">
      <h1 class="site-title">{{title}}</h1>
      <p class="site-description">{{description}}</p>
      <div class="search-box">
        <input type="text" placeholder="搜索书签..." class="search-input">
        <button class="search-button">🔍</button>
      </div>
    </div>
  </header>

  <main class="main">
    <div class="container">
      {{#each categories}}
      <section class="category">
        <h2 class="category-title">{{name}}</h2>
        <div class="bookmarks-grid">
          {{#each bookmarks}}
          <a href="{{url}}" class="bookmark-card" target="_blank" rel="noopener">
            <div class="bookmark-icon">
              <img src="{{icon}}" alt="{{title}}" loading="lazy">
            </div>
            <div class="bookmark-info">
              <h3 class="bookmark-title">{{title}}</h3>
              <p class="bookmark-description">{{description}}</p>
            </div>
          </a>
          {{/each}}
        </div>
      </section>
      {{/each}}
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p>&copy; {{year}} {{author}}. Powered by WowNav TS.</p>
    </div>
  </footer>

  <script src="scripts/main.js"></script>
</body>
</html>
```

### 网格模板
```handlebars
<!-- grid.hbs -->
<!DOCTYPE html>
<html lang="{{language}}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <meta name="description" content="{{description}}">
  <link rel="stylesheet" href="styles/grid.css">
</head>
<body class="{{theme.name}}">
  <div class="grid-container">
    {{#each bookmarks}}
    <div class="grid-item">
      <a href="{{url}}" class="bookmark-link" target="_blank" rel="noopener">
        <div class="bookmark-header">
          <img src="{{icon}}" alt="{{title}}" class="bookmark-icon" loading="lazy">
          <h3 class="bookmark-title">{{title}}</h3>
        </div>
        {{#if description}}
        <p class="bookmark-description">{{description}}</p>
        {{/if}}
        <div class="bookmark-tags">
          {{#each tags}}
          <span class="tag">{{this}}</span>
          {{/each}}
        </div>
      </a>
    </div>
    {{/each}}
  </div>

  <div class="search-overlay" id="search-overlay">
    <div class="search-container">
      <input type="text" placeholder="搜索书签..." class="search-input" id="search-input">
      <div class="search-results" id="search-results"></div>
    </div>
  </div>

  <script src="scripts/grid.js"></script>
</body>
</html>
```

## 功能特性

### 书签导入导出
```typescript
// Chrome 书签导入器
class ChromeBookmarkImporter {
  public async importFromFile(file: File): Promise<Bookmark[]> {
    const content = await file.text()
    return this.parseBookmarks(content)
  }

  public async importFromURL(url: string): Promise<Bookmark[]> {
    const response = await fetch(url)
    const content = await response.text()
    return this.parseBookmarks(content)
  }

  private parseBookmarks(html: string): Bookmark[] {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const bookmarks: Bookmark[] = []

    const links = doc.querySelectorAll('a')
    links.forEach((link, index) => {
      const bookmark: Bookmark = {
        id: `bookmark-${index}`,
        title: link.textContent || 'Untitled',
        url: link.href,
        category: this.guessCategory(link.href),
        tags: [],
        order: index
      }
      bookmarks.push(bookmark)
    })

    return bookmarks
  }

  private guessCategory(url: string): string {
    const domain = new URL(url).hostname

    if (domain.includes('github.com')) return '开发工具'
    if (domain.includes('stackoverflow.com')) return '技术社区'
    if (domain.includes('youtube.com')) return '视频媒体'
    if (domain.includes('twitter.com')) return '社交媒体'

    return '其他'
  }
}
```

### 实时搜索
```typescript
// 搜索功能类
class SearchEngine {
  private bookmarks: Bookmark[]
  private fuse: Fuse<Bookmark>

  constructor(bookmarks: Bookmark[]) {
    this.bookmarks = bookmarks
    this.fuse = new Fuse(bookmarks, {
      keys: ['title', 'description', 'url', 'tags'],
      threshold: 0.3,
      includeScore: true
    })
  }

  // 搜索书签
  public search(query: string): SearchResult[] {
    if (!query.trim()) {
      return this.bookmarks.map(bookmark => ({
        bookmark,
        score: 1
      }))
    }

    const results = this.fuse.search(query)
    return results.map(result => ({
      bookmark: result.item,
      score: result.score || 0
    }))
  }

  // 按分类过滤
  public filterByCategory(category: string): Bookmark[] {
    return this.bookmarks.filter(bookmark => bookmark.category === category)
  }

  // 按标签过滤
  public filterByTag(tag: string): Bookmark[] {
    return this.bookmarks.filter(bookmark => bookmark.tags.includes(tag))
  }

  // 获取所有分类
  public getCategories(): string[] {
    return [...new Set(this.bookmarks.map(bookmark => bookmark.category))]
  }

  // 获取所有标签
  public getTags(): string[] {
    const allTags = this.bookmarks.flatMap(bookmark => bookmark.tags)
    return [...new Set(allTags)]
  }
}
```

## 部署配置

### 静态网站部署
```json
// package.json
{
  "name": "wownav-ts",
  "version": "1.0.0",
  "description": "TypeScript navigation website generator",
  "main": "dist/index.js",
  "bin": {
    "wownav": "./dist/cli/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/cli/index.ts",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "dependencies": {
    "handlebars": "^4.7.8",
    "fuse.js": "^6.6.2",
    "chalk": "^5.2.0",
    "commander": "^10.0.1",
    "inquirer": "^9.1.4"
  },
  "devDependencies": {
    "@types/node": "^18.15.11",
    "typescript": "^5.0.4",
    "jest": "^29.5.0",
    "eslint": "^8.37.0",
    "prettier": "^2.8.7"
  }
}
```

### CLI 工具
```typescript
#!/usr/bin/env node

import { Command } from 'commander'
import { NavGenerator } from './core/NavGenerator'
import { ConfigLoader } from './utils/ConfigLoader'

const program = new Command()

program
  .name('wownav')
  .description('TypeScript navigation website generator')
  .version('1.0.0')

program
  .command('generate')
  .description('Generate navigation website')
  .option('-c, --config <path>', 'Path to config file', './config.json')
  .option('-o, --output <path>', 'Output directory', './dist')
  .action(async (options) => {
    try {
      console.log('🚀 Starting WowNav generation...')

      // 加载配置
      const configLoader = new ConfigLoader()
      const config = await configLoader.load(options.config)

      // 生成网站
      const generator = new NavGenerator(config)
      const result = await generator.generate()

      // 保存到文件
      await result.save(options.output)

      console.log('✅ Website generated successfully!')
      console.log(`📁 Output: ${options.output}`)
    } catch (error) {
      console.error('❌ Generation failed:', error.message)
      process.exit(1)
    }
  })

program
  .command('init')
  .description('Initialize new WowNav project')
  .option('-t, --template <name>', 'Template to use', 'classic')
  .action(async (options) => {
    try {
      console.log('📝 Initializing WowNav project...')

      // 创建项目结构
      await createProjectStructure(options.template)

      console.log('✅ Project initialized!')
      console.log('📝 Edit config.json to customize your navigation')
    } catch (error) {
      console.error('❌ Initialization failed:', error.message)
      process.exit(1)
    }
  })

program.parse()
```

## 扩展功能

### 🔌 插件系统
- **导入插件**: 支持更多书签格式
- **导出插件**: 自定义导出格式
- **主题插件**: 第三方主题支持
- **功能插件**: 扩展功能模块

### 📊 数据分析
- **访问统计**: 书签点击统计
- **搜索分析**: 搜索行为分析
- **用户偏好**: 个性化推荐
- **性能监控**: 网站性能监控

### 🌐 云端功能
- **云端存储**: 书签云端备份
- **跨设备同步**: 多设备数据同步
- **团队协作**: 团队书签共享
- **版本控制**: 书签历史版本

## 最佳实践

### 配置管理
```typescript
// 配置验证器
class ConfigValidator {
  private schema = {
    title: 'string',
    description: 'string',
    author: 'string',
    theme: 'string',
    bookmarks: 'array',
    layout: 'object'
  }

  public async validate(config: any): Promise<ValidationError[]> {
    const errors: ValidationError[] = []

    // 基本字段验证
    Object.entries(this.schema).forEach(([field, type]) => {
      if (!config[field]) {
        errors.push({
          field,
          message: `Field '${field}' is required`
        })
      } else if (typeof config[field] !== type) {
        errors.push({
          field,
          message: `Field '${field}' must be of type ${type}`
        })
      }
    })

    // 书签验证
    if (config.bookmarks) {
      config.bookmarks.forEach((bookmark: any, index: number) => {
        if (!bookmark.url || !bookmark.title) {
          errors.push({
            field: `bookmarks[${index}]`,
            message: 'Bookmark must have url and title'
          })
        }
      })
    }

    // 主题验证
    if (config.theme && !this.isValidTheme(config.theme)) {
      errors.push({
        field: 'theme',
        message: `Theme '${config.theme}' is not supported`
      })
    }

    return errors
  }

  private isValidTheme(theme: string): boolean {
    const validThemes = ['default', 'dark', 'light', 'blue', 'green', 'purple']
    return validThemes.includes(theme)
  }
}
```

### 性能优化
```typescript
// 资源优化器
class ResourceOptimizer {
  private staticAssets: Map<string, string> = new Map()

  // 压缩 CSS
  public async compressCSS(css: string): Promise<string> {
    // 使用 clean-css 或其他压缩工具
    const result = await postcss([cssnano()]).process(css, { from: undefined })
    return result.css
  }

  // 压缩 JavaScript
  public async compressJS(js: string): Promise<string> {
    // 使用 terser 压缩
    const result = await terser.minify(js)
    return result.code || js
  }

  // 优化图片
  public async optimizeImage(imageBuffer: Buffer, format: 'webp' | 'avif'): Promise<Buffer> {
    // 使用 sharp 优化图片
    const sharp = require('sharp')
    return await sharp(imageBuffer)
      .webp({ quality: 80 })
      .toBuffer()
  }

  // 生成 Service Worker
  public generateServiceWorker(assets: string[]): string {
    return `
      const CACHE_NAME = 'wownav-v1'
      const urlsToCache = ${JSON.stringify(assets)}

      self.addEventListener('install', (event) => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
        )
      })

      self.addEventListener('fetch', (event) => {
        event.respondWith(
          caches.match(event.request)
            .then((response) => {
              if (response) {
                return response
              }
              return fetch(event.request)
            })
        )
      })
    `
  }
}
```

## 技术亮点

### 🎨 现代化架构
- **TypeScript**: 完整的类型安全
- **模块化设计**: 高度可扩展的架构
- **模板引擎**: 灵活的模板系统
- **插件化**: 丰富的扩展生态

### ⚡ 高性能实现
- **静态生成**: 预渲染的静态网站
- **懒加载**: 图片和组件懒加载
- **缓存策略**: 多层缓存优化
- **CDN 支持**: 全球快速访问

### 🔧 开发体验
- **CLI 工具**: 命令行界面
- **热重载**: 开发时实时更新
- **类型检查**: 完整的类型系统
- **文档完善**: 详细的使用文档

## 社区贡献

### 🤝 开源协作
- **模板贡献**: 社区模板分享
- **主题开发**: 自定义主题开发
- **插件制作**: 功能插件开发
- **文档翻译**: 多语言文档支持

### 📈 项目活跃度
- **用户增长**: 安装用户统计
- **模板下载**: 模板使用统计
- **插件生态**: 插件数量统计
- **社区反馈**: 用户反馈收集

## 未来规划

- [ ] **可视化编辑器**: 拖拽式界面编辑
- [ ] **AI 推荐**: 智能书签推荐
- [ ] **团队功能**: 多用户协作
- [ ] **移动应用**: React Native 版本
- [ ] **云端服务**: SaaS 版本

## 相关链接

- **项目主页**: [github.com/BiscuitCoder/wownav_ts](https://github.com/BiscuitCoder/wownav_ts)
- **在线演示**: [wownav-ts.vercel.app](https://wownav-ts.vercel.app)
- **模板库**: [templates.wownav.dev](https://templates.wownav.dev)
- **文档中心**: [docs.wownav.dev](https://docs.wownav.dev)

---

*TypeScript 驱动的现代化导航网站生成器 - 让书签管理变得简单而优雅* 🎯
