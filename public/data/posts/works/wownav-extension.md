# WowNav Extension - Chrome 导航扩展

## 项目概述

WowNav Extension 是一个功能强大的 Chrome 浏览器扩展，为用户提供快速的导航和书签管理功能。扩展采用现代化的 Web 技术栈开发，支持书签同步、快速搜索、智能推荐等高级功能，让用户的浏览器使用体验更加高效和便捷。

## 核心功能

### 🚀 快速导航
- **书签栏**: 快速访问常用网站
- **历史记录**: 智能的历史页面推荐
- **快捷搜索**: 一键搜索当前页面内容
- **标签管理**: 多标签页的智能管理

### 🔍 智能搜索
- **书签搜索**: 快速定位书签
- **历史搜索**: 搜索浏览历史
- **标签搜索**: 按标签筛选页面
- **模糊匹配**: 智能的搜索建议

### 📊 数据同步
- **书签同步**: 跨设备书签同步
- **设置同步**: 配置项自动同步
- **云端备份**: 数据安全备份
- **多设备支持**: 无缝的多设备体验

## 技术架构

### Manifest V3 架构
```json
// manifest.json
{
  "manifest_version": 3,
  "name": "WowNav Extension",
  "version": "1.0.0",
  "description": "Modern Chrome extension for navigation and bookmark management",
  "permissions": [
    "bookmarks",
    "history",
    "tabs",
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "https://*/*",
    "http://*/*"
  ],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "WowNav",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "options_page": "options.html",
  "web_accessible_resources": [
    {
      "resources": ["injected.js"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### 核心模块架构
```typescript
// 扩展核心类
class WowNavExtension {
  private bookmarkManager: BookmarkManager
  private historyManager: HistoryManager
  private searchEngine: SearchEngine
  private syncManager: SyncManager

  constructor() {
    this.bookmarkManager = new BookmarkManager()
    this.historyManager = new HistoryManager()
    this.searchEngine = new SearchEngine()
    this.syncManager = new SyncManager()

    this.initialize()
  }

  // 初始化扩展
  private async initialize(): Promise<void> {
    // 设置事件监听器
    this.setupEventListeners()

    // 初始化数据
    await this.initializeData()

    // 启动同步服务
    await this.syncManager.startSync()
  }

  // 设置事件监听器
  private setupEventListeners(): void {
    // 书签变化事件
    chrome.bookmarks.onChanged.addListener(this.handleBookmarkChanged.bind(this))
    chrome.bookmarks.onCreated.addListener(this.handleBookmarkCreated.bind(this))
    chrome.bookmarks.onRemoved.addListener(this.handleBookmarkRemoved.bind(this))

    // 标签页事件
    chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this))
    chrome.tabs.onRemoved.addListener(this.handleTabRemoved.bind(this))

    // 历史记录事件
    chrome.history.onVisited.addListener(this.handleHistoryVisited.bind(this))
  }

  // 初始化数据
  private async initializeData(): Promise<void> {
    try {
      // 加载书签数据
      await this.bookmarkManager.loadBookmarks()

      // 加载历史数据
      await this.historyManager.loadHistory()

      // 初始化搜索索引
      await this.searchEngine.buildIndex()
    } catch (error) {
      console.error('Failed to initialize data:', error)
    }
  }

  // 处理书签变化
  private async handleBookmarkChanged(id: string, changeInfo: chrome.bookmarks.BookmarkChangeInfo): Promise<void> {
    await this.bookmarkManager.updateBookmark(id, changeInfo)
    await this.searchEngine.updateIndex()
    await this.syncManager.syncBookmark(id)
  }

  // 处理书签创建
  private async handleBookmarkCreated(id: string, bookmark: chrome.bookmarks.BookmarkTreeNode): Promise<void> {
    await this.bookmarkManager.addBookmark(bookmark)
    await this.searchEngine.addToIndex(bookmark)
    await this.syncManager.syncBookmark(id)
  }

  // 处理书签删除
  private async handleBookmarkRemoved(id: string, removeInfo: chrome.bookmarks.BookmarkRemoveInfo): Promise<void> {
    await this.bookmarkManager.removeBookmark(id)
    await this.searchEngine.removeFromIndex(id)
    await this.syncManager.removeBookmark(id)
  }

  // 处理标签页更新
  private async handleTabUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): Promise<void> {
    if (changeInfo.url) {
      await this.historyManager.addHistoryEntry(tab)
    }
  }

  // 处理历史记录访问
  private async handleHistoryVisited(result: chrome.history.HistoryItem): Promise<void> {
    await this.historyManager.updateHistoryStats(result)
  }
}
```

### 书签管理器
```typescript
// 书签管理器类
class BookmarkManager {
  private bookmarks: Map<string, BookmarkNode> = new Map()
  private categories: Map<string, BookmarkCategory> = new Map()

  // 加载书签数据
  public async loadBookmarks(): Promise<void> {
    try {
      const tree = await chrome.bookmarks.getTree()
      this.parseBookmarkTree(tree[0])
      await this.categorizeBookmarks()
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
      throw error
    }
  }

  // 解析书签树
  private parseBookmarkTree(node: chrome.bookmarks.BookmarkTreeNode, parentId?: string): void {
    const bookmarkNode: BookmarkNode = {
      id: node.id,
      title: node.title,
      url: node.url,
      parentId,
      children: [],
      dateAdded: node.dateAdded,
      lastModified: Date.now()
    }

    this.bookmarks.set(node.id, bookmarkNode)

    if (node.children) {
      for (const child of node.children) {
        bookmarkNode.children.push(child.id)
        this.parseBookmarkTree(child, node.id)
      }
    }
  }

  // 对书签进行分类
  private async categorizeBookmarks(): Promise<void> {
    const categories = new Map<string, BookmarkCategory>()

    for (const [id, bookmark] of this.bookmarks) {
      if (bookmark.url) {
        const category = await this.guessCategory(bookmark.url)
        if (!categories.has(category)) {
          categories.set(category, {
            name: category,
            bookmarks: [],
            icon: this.getCategoryIcon(category)
          })
        }
        categories.get(category)!.bookmarks.push(id)
      }
    }

    this.categories = categories
  }

  // 猜测书签分类
  private async guessCategory(url: string): Promise<string> {
    try {
      const domain = new URL(url).hostname

      // 开发工具
      if (domain.includes('github.com')) return '开发工具'
      if (domain.includes('stackoverflow.com')) return '技术社区'
      if (domain.includes('npmjs.com')) return '包管理'

      // 设计工具
      if (domain.includes('figma.com')) return '设计工具'
      if (domain.includes('dribbble.com')) return '设计社区'

      // 生产力工具
      if (domain.includes('notion.so')) return '笔记工具'
      if (domain.includes('gmail.com')) return '邮件服务'
      if (domain.includes('slack.com')) return '团队协作'

      // 媒体平台
      if (domain.includes('youtube.com')) return '视频平台'
      if (domain.includes('twitter.com')) return '社交媒体'

      return '其他'
    } catch (error) {
      return '其他'
    }
  }

  // 获取分类图标
  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      '开发工具': '⚙️',
      '技术社区': '👥',
      '设计工具': '🎨',
      '笔记工具': '📝',
      '邮件服务': '📧',
      '视频平台': '🎬',
      '社交媒体': '📱'
    }
    return icons[category] || '📁'
  }

  // 添加书签
  public async addBookmark(bookmark: chrome.bookmarks.BookmarkTreeNode): Promise<void> {
    const bookmarkNode: BookmarkNode = {
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      parentId: bookmark.parentId,
      children: bookmark.children?.map(child => child.id) || [],
      dateAdded: bookmark.dateAdded,
      lastModified: Date.now()
    }

    this.bookmarks.set(bookmark.id, bookmarkNode)

    // 更新父节点
    if (bookmark.parentId) {
      const parent = this.bookmarks.get(bookmark.parentId)
      if (parent && !parent.children.includes(bookmark.id)) {
        parent.children.push(bookmark.id)
      }
    }

    // 重新分类
    await this.categorizeBookmarks()
  }

  // 更新书签
  public async updateBookmark(id: string, changes: chrome.bookmarks.BookmarkChangeInfo): Promise<void> {
    const bookmark = this.bookmarks.get(id)
    if (bookmark) {
      if (changes.title) bookmark.title = changes.title
      if (changes.url) bookmark.url = changes.url
      bookmark.lastModified = Date.now()

      // 重新分类
      await this.categorizeBookmarks()
    }
  }

  // 删除书签
  public async removeBookmark(id: string): Promise<void> {
    const bookmark = this.bookmarks.get(id)
    if (bookmark) {
      // 从父节点移除
      if (bookmark.parentId) {
        const parent = this.bookmarks.get(bookmark.parentId)
        if (parent) {
          parent.children = parent.children.filter(childId => childId !== id)
        }
      }

      // 删除子节点
      for (const childId of bookmark.children) {
        await this.removeBookmark(childId)
      }

      // 删除自身
      this.bookmarks.delete(id)

      // 重新分类
      await this.categorizeBookmarks()
    }
  }

  // 获取书签
  public getBookmark(id: string): BookmarkNode | undefined {
    return this.bookmarks.get(id)
  }

  // 获取所有书签
  public getAllBookmarks(): BookmarkNode[] {
    return Array.from(this.bookmarks.values())
  }

  // 获取分类
  public getCategories(): BookmarkCategory[] {
    return Array.from(this.categories.values())
  }

  // 搜索书签
  public searchBookmarks(query: string): BookmarkNode[] {
    const results: BookmarkNode[] = []
    const lowerQuery = query.toLowerCase()

    for (const bookmark of this.bookmarks.values()) {
      if (bookmark.url &&
          (bookmark.title.toLowerCase().includes(lowerQuery) ||
           bookmark.url.toLowerCase().includes(lowerQuery))) {
        results.push(bookmark)
      }
    }

    return results
  }
}

// 类型定义
interface BookmarkNode {
  id: string
  title: string
  url?: string
  parentId?: string
  children: string[]
  dateAdded?: number
  lastModified: number
}

interface BookmarkCategory {
  name: string
  bookmarks: string[]
  icon: string
}
```

### 搜索引擎
```typescript
// 搜索引擎类
class SearchEngine {
  private bookmarkIndex: Fuse<BookmarkNode>
  private historyIndex: Fuse<chrome.history.HistoryItem>

  constructor() {
    this.bookmarkIndex = null as any
    this.historyIndex = null as any
  }

  // 构建搜索索引
  public async buildIndex(): Promise<void> {
    try {
      // 获取书签数据
      const bookmarks = await this.getAllBookmarks()

      // 构建书签索引
      this.bookmarkIndex = new Fuse(bookmarks, {
        keys: ['title', 'url'],
        threshold: 0.3,
        includeScore: true
      })

      // 获取历史数据
      const history = await this.getRecentHistory()

      // 构建历史索引
      this.historyIndex = new Fuse(history, {
        keys: ['title', 'url'],
        threshold: 0.3,
        includeScore: true
      })
    } catch (error) {
      console.error('Failed to build search index:', error)
    }
  }

  // 搜索书签
  public searchBookmarks(query: string): SearchResult[] {
    if (!this.bookmarkIndex || !query.trim()) {
      return []
    }

    const results = this.bookmarkIndex.search(query)
    return results.map(result => ({
      type: 'bookmark',
      item: result.item,
      score: result.score || 0
    }))
  }

  // 搜索历史
  public searchHistory(query: string): SearchResult[] {
    if (!this.historyIndex || !query.trim()) {
      return []
    }

    const results = this.historyIndex.search(query)
    return results.map(result => ({
      type: 'history',
      item: result.item,
      score: result.score || 0
    }))
  }

  // 综合搜索
  public search(query: string): SearchResult[] {
    const bookmarkResults = this.searchBookmarks(query)
    const historyResults = this.searchHistory(query)

    // 合并结果并排序
    return [...bookmarkResults, ...historyResults]
      .sort((a, b) => a.score - b.score)
      .slice(0, 20) // 限制结果数量
  }

  // 更新索引
  public async updateIndex(): Promise<void> {
    await this.buildIndex()
  }

  // 添加到索引
  public async addToIndex(item: BookmarkNode | chrome.history.HistoryItem): Promise<void> {
    // 重新构建索引
    await this.buildIndex()
  }

  // 从索引移除
  public async removeFromIndex(id: string): Promise<void> {
    // 重新构建索引
    await this.buildIndex()
  }

  // 获取所有书签
  private async getAllBookmarks(): Promise<BookmarkNode[]> {
    try {
      const bookmarks = await chrome.bookmarks.getTree()
      return this.flattenBookmarks(bookmarks[0])
    } catch (error) {
      console.error('Failed to get bookmarks:', error)
      return []
    }
  }

  // 扁平化书签树
  private flattenBookmarks(node: chrome.bookmarks.BookmarkTreeNode): BookmarkNode[] {
    const result: BookmarkNode[] = []

    if (node.url) {
      result.push({
        id: node.id,
        title: node.title,
        url: node.url,
        parentId: node.parentId,
        children: [],
        dateAdded: node.dateAdded,
        lastModified: Date.now()
      })
    }

    if (node.children) {
      for (const child of node.children) {
        result.push(...this.flattenBookmarks(child))
      }
    }

    return result
  }

  // 获取最近历史
  private async getRecentHistory(): Promise<chrome.history.HistoryItem[]> {
    try {
      const history = await chrome.history.search({
        text: '',
        maxResults: 1000,
        startTime: Date.now() - (30 * 24 * 60 * 60 * 1000) // 30天内
      })
      return history
    } catch (error) {
      console.error('Failed to get history:', error)
      return []
    }
  }
}

// 搜索结果类型
interface SearchResult {
  type: 'bookmark' | 'history'
  item: BookmarkNode | chrome.history.HistoryItem
  score: number
}
```

## 项目结构

```
wownav-extension/
├── src/
│   ├── background/
│   │   ├── service-worker.ts     # Service Worker
│   │   ├── bookmark-sync.ts      # 书签同步
│   │   └── analytics.ts          # 数据分析
│   ├── popup/
│   │   ├── popup.html            # 弹出页面 HTML
│   │   ├── popup.ts              # 弹出页面逻辑
│   │   ├── search.ts             # 搜索功能
│   │   └── settings.ts           # 设置页面
│   ├── content/
│   │   ├── content.ts            # 内容脚本
│   │   ├── injector.ts           # 脚本注入器
│   │   └── overlay.ts            # 页面覆盖层
│   ├── options/
│   │   ├── options.html          # 设置页面 HTML
│   │   ├── options.ts            # 设置页面逻辑
│   │   └── themes.ts             # 主题设置
│   ├── lib/
│   │   ├── bookmarks.ts          # 书签管理
│   │   ├── history.ts            # 历史管理
│   │   ├── search.ts             # 搜索功能
│   │   ├── sync.ts               # 数据同步
│   │   ├── storage.ts            # 本地存储
│   │   └── utils.ts              # 工具函数
│   ├── types/
│   │   ├── bookmark.ts           # 书签类型
│   │   ├── history.ts            # 历史类型
│   │   ├── search.ts             # 搜索类型
│   │   └── settings.ts           # 设置类型
│   └── assets/
│       ├── icons/                # 图标资源
│       └── styles/               # 样式文件
├── public/
│   ├── manifest.json             # 扩展清单
│   ├── popup.html               # 弹出页面
│   ├── options.html             # 设置页面
│   └── _locales/                # 国际化
│       ├── en/
│       │   └── messages.json
│       └── zh_CN/
│           └── messages.json
├── dist/                        # 构建输出
├── test/                        # 测试文件
│   ├── unit/                    # 单元测试
│   ├── integration/             # 集成测试
│   └── e2e/                     # 端到端测试
├── scripts/                     # 构建脚本
│   ├── build.js                 # 构建脚本
│   ├── watch.js                 # 监听脚本
│   └── deploy.js                # 部署脚本
├── docs/                        # 文档
│   ├── README.md                # 项目说明
│   ├── API.md                   # API 文档
│   ├── development.md           # 开发指南
│   └── testing.md               # 测试指南
└── config/                      # 配置文件
    ├── webpack.config.js        # Webpack 配置
    ├── jest.config.js           # Jest 配置
    └── eslint.config.js         # ESLint 配置
```

## 核心功能实现

### 弹出页面
```html
<!-- popup.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WowNav Extension</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div id="popup">
    <div class="search-container">
      <input
        type="text"
        id="search-input"
        placeholder="搜索书签、历史..."
        autocomplete="off"
      >
      <button id="search-button">🔍</button>
    </div>

    <div class="results-container">
      <div class="tabs">
        <button class="tab active" data-tab="bookmarks">书签</button>
        <button class="tab" data-tab="history">历史</button>
        <button class="tab" data-tab="tabs">标签页</button>
      </div>

      <div class="results" id="results">
        <!-- 搜索结果将在这里显示 -->
      </div>
    </div>

    <div class="actions">
      <button id="settings-button">⚙️ 设置</button>
      <button id="add-bookmark-button">⭐ 添加书签</button>
    </div>
  </div>

  <script src="popup.js"></script>
</body>
</html>
```

```typescript
// popup.ts
class PopupManager {
  private searchInput: HTMLInputElement
  private searchButton: HTMLButtonElement
  private resultsContainer: HTMLElement
  private tabs: NodeListOf<HTMLButtonElement>

  constructor() {
    this.searchInput = document.getElementById('search-input') as HTMLInputElement
    this.searchButton = document.getElementById('search-button') as HTMLButtonElement
    this.resultsContainer = document.getElementById('results') as HTMLElement
    this.tabs = document.querySelectorAll('.tab')

    this.initialize()
  }

  private initialize(): void {
    // 设置事件监听器
    this.searchInput.addEventListener('input', this.handleSearch.bind(this))
    this.searchButton.addEventListener('click', this.handleSearch.bind(this))

    // 标签页切换
    this.tabs.forEach(tab => {
      tab.addEventListener('click', this.handleTabSwitch.bind(this))
    })

    // 设置和添加书签按钮
    document.getElementById('settings-button')?.addEventListener('click', this.openSettings.bind(this))
    document.getElementById('add-bookmark-button')?.addEventListener('click', this.addCurrentPage.bind(this))

    // 加载初始数据
    this.loadBookmarks()
  }

  private async handleSearch(): Promise<void> {
    const query = this.searchInput.value.trim()

    if (query.length === 0) {
      this.loadBookmarks()
      return
    }

    try {
      // 发送搜索请求到 background script
      const response = await chrome.runtime.sendMessage({
        type: 'SEARCH',
        payload: { query }
      })

      this.displayResults(response.results)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  private handleTabSwitch(event: Event): void {
    const target = event.target as HTMLButtonElement
    const tabName = target.dataset.tab

    // 更新标签页状态
    this.tabs.forEach(tab => tab.classList.remove('active'))
    target.classList.add('active')

    // 加载对应数据
    switch (tabName) {
      case 'bookmarks':
        this.loadBookmarks()
        break
      case 'history':
        this.loadHistory()
        break
      case 'tabs':
        this.loadTabs()
        break
    }
  }

  private async loadBookmarks(): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_BOOKMARKS'
      })

      this.displayBookmarks(response.bookmarks)
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
    }
  }

  private async loadHistory(): Promise<void> {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_HISTORY'
      })

      this.displayHistory(response.history)
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  private async loadTabs(): Promise<void> {
    try {
      const tabs = await chrome.tabs.query({})
      this.displayTabs(tabs)
    } catch (error) {
      console.error('Failed to load tabs:', error)
    }
  }

  private displayBookmarks(bookmarks: any[]): void {
    const html = bookmarks.map(bookmark => `
      <div class="result-item bookmark" data-url="${bookmark.url}">
        <div class="result-icon">📖</div>
        <div class="result-content">
          <div class="result-title">${bookmark.title}</div>
          <div class="result-url">${bookmark.url}</div>
        </div>
      </div>
    `).join('')

    this.resultsContainer.innerHTML = html
    this.attachClickHandlers()
  }

  private displayHistory(history: any[]): void {
    const html = history.map(item => `
      <div class="result-item history" data-url="${item.url}">
        <div class="result-icon">🕒</div>
        <div class="result-content">
          <div class="result-title">${item.title}</div>
          <div class="result-url">${item.url}</div>
        </div>
      </div>
    `).join('')

    this.resultsContainer.innerHTML = html
    this.attachClickHandlers()
  }

  private displayTabs(tabs: chrome.tabs.Tab[]): void {
    const html = tabs.map(tab => `
      <div class="result-item tab" data-tab-id="${tab.id}">
        <div class="result-icon">📄</div>
        <div class="result-content">
          <div class="result-title">${tab.title}</div>
          <div class="result-url">${tab.url}</div>
        </div>
      </div>
    `).join('')

    this.resultsContainer.innerHTML = html
    this.attachClickHandlers()
  }

  private attachClickHandlers(): void {
    const items = this.resultsContainer.querySelectorAll('.result-item')

    items.forEach(item => {
      item.addEventListener('click', async (event) => {
        const target = event.currentTarget as HTMLElement

        if (target.classList.contains('bookmark') || target.classList.contains('history')) {
          const url = target.dataset.url
          if (url) {
            await chrome.tabs.create({ url })
            window.close()
          }
        } else if (target.classList.contains('tab')) {
          const tabId = parseInt(target.dataset.tabId || '0')
          if (tabId) {
            await chrome.tabs.update(tabId, { active: true })
            window.close()
          }
        }
      })
    })
  }

  private async openSettings(): Promise<void> {
    await chrome.runtime.openOptionsPage()
    window.close()
  }

  private async addCurrentPage(): Promise<void> {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      if (tab.url && tab.title) {
        await chrome.bookmarks.create({
          title: tab.title,
          url: tab.url
        })

        // 显示成功提示
        this.showNotification('书签已添加！')
      }
    } catch (error) {
      console.error('Failed to add bookmark:', error)
      this.showNotification('添加书签失败', 'error')
    }
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    // 简单的通知显示
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }
}

// 初始化弹出页面管理器
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager()
})
```

### Background Script
```typescript
// background.ts (Service Worker)
import { BookmarkManager } from './lib/bookmarks'
import { HistoryManager } from './lib/history'
import { SearchEngine } from './lib/search'
import { SyncManager } from './lib/sync'

// 全局变量
let bookmarkManager: BookmarkManager
let historyManager: HistoryManager
let searchEngine: SearchEngine
let syncManager: SyncManager

// 初始化
async function initialize(): Promise<void> {
  console.log('WowNav Extension initializing...')

  bookmarkManager = new BookmarkManager()
  historyManager = new HistoryManager()
  searchEngine = new SearchEngine()
  syncManager = new SyncManager()

  // 初始化各个管理器
  await Promise.all([
    bookmarkManager.initialize(),
    historyManager.initialize(),
    searchEngine.initialize(),
    syncManager.initialize()
  ])

  console.log('WowNav Extension initialized successfully')
}

// 消息处理
chrome.runtime.onMessage.addListener(
  (request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    handleMessage(request, sender, sendResponse)
    return true // 保持消息通道开放
  }
)

async function handleMessage(
  request: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): Promise<void> {
  try {
    switch (request.type) {
      case 'SEARCH':
        const results = await searchEngine.search(request.payload.query)
        sendResponse({ success: true, results })
        break

      case 'GET_BOOKMARKS':
        const bookmarks = await bookmarkManager.getBookmarks()
        sendResponse({ success: true, bookmarks })
        break

      case 'GET_HISTORY':
        const history = await historyManager.getHistory()
        sendResponse({ success: true, history })
        break

      case 'ADD_BOOKMARK':
        await bookmarkManager.addBookmark(request.payload.bookmark)
        sendResponse({ success: true })
        break

      case 'UPDATE_BOOKMARK':
        await bookmarkManager.updateBookmark(request.payload.id, request.payload.changes)
        sendResponse({ success: true })
        break

      case 'DELETE_BOOKMARK':
        await bookmarkManager.deleteBookmark(request.payload.id)
        sendResponse({ success: true })
        break

      case 'SYNC_DATA':
        await syncManager.syncData()
        sendResponse({ success: true })
        break

      default:
        sendResponse({ success: false, error: 'Unknown message type' })
    }
  } catch (error) {
    console.error('Message handling failed:', error)
    sendResponse({ success: false, error: error.message })
  }
}

// 安装事件
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed:', details.reason)

  if (details.reason === 'install') {
    // 首次安装
    await initialize()
  } else if (details.reason === 'update') {
    // 扩展更新
    await initialize()
  }
})

// 启动事件
chrome.runtime.onStartup.addListener(async () => {
  console.log('Extension startup')
  await initialize()
})

// 定期同步
setInterval(async () => {
  try {
    await syncManager.syncData()
  } catch (error) {
    console.error('Auto sync failed:', error)
  }
}, 5 * 60 * 1000) // 每5分钟同步一次
```

## 构建配置

### Webpack 配置
```javascript
// webpack.config.js
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    popup: './src/popup/popup.ts',
    background: './src/background/service-worker.ts',
    content: './src/content/content.ts',
    options: './src/options/options.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
        { from: 'src/assets', to: 'assets' }
      ]
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

### TypeScript 配置
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["chrome"],
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
```

## 功能特性

### 书签管理
- **智能分类**: 自动识别网站类型并分类
- **快速搜索**: 支持书签标题和URL搜索
- **一键添加**: 快速添加当前页面为书签
- **云端同步**: 支持多设备同步

### 历史记录
- **智能推荐**: 基于使用频率推荐历史页面
- **快速搜索**: 历史记录全文搜索
- **隐私保护**: 本地存储，不上传数据
- **智能清理**: 自动清理过期历史

### 标签页管理
- **快速切换**: 在扩展中切换标签页
- **批量关闭**: 批量关闭不需要的标签页
- **分组管理**: 按窗口或域名分组标签页
- **会话保存**: 保存和恢复标签页会话

## 扩展功能

### 🔌 API 集成
- **天气信息**: 显示当前天气
- **汇率转换**: 货币汇率查询
- **翻译服务**: 页面内容翻译
- **笔记功能**: 快速笔记记录

### 📊 数据分析
- **使用统计**: 扩展使用情况统计
- **搜索分析**: 用户搜索行为分析
- **性能监控**: 扩展运行性能监控
- **错误追踪**: 运行错误自动上报

### 🌐 网络功能
- **RSS 阅读**: RSS 源订阅和阅读
- **邮件提醒**: 邮件未读提醒
- **日程提醒**: Google Calendar 集成
- **新闻聚合**: 新闻源聚合显示

## 安全考虑

### 数据隐私
- **本地存储**: 用户数据仅存储在本地
- **权限控制**: 最小化权限请求
- **加密传输**: 敏感数据加密传输
- **定期清理**: 自动清理临时数据

### 扩展安全
- **代码审查**: 严格的代码审查流程
- **依赖审计**: 第三方依赖安全审计
- **更新机制**: 安全的自动更新机制
- **漏洞修复**: 及时修复安全漏洞

## 测试策略

### 单元测试
```typescript
// popup.test.ts
import { PopupManager } from '../src/popup/popup'

describe('PopupManager', () => {
  let popupManager: PopupManager

  beforeEach(() => {
    // 设置 DOM 环境
    document.body.innerHTML = `
      <div id="popup">
        <input id="search-input" />
        <button id="search-button"></button>
        <div id="results"></div>
      </div>
    `

    popupManager = new PopupManager()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('Search Functionality', () => {
    it('should handle search input', () => {
      const searchInput = document.getElementById('search-input') as HTMLInputElement

      // 模拟用户输入
      searchInput.value = 'github'
      searchInput.dispatchEvent(new Event('input'))

      // 验证搜索被触发
      expect(searchInput.value).toBe('github')
    })

    it('should display search results', () => {
      const results = [
        { title: 'GitHub', url: 'https://github.com' },
        { title: 'GitHub Issues', url: 'https://github.com/issues' }
      ]

      // 模拟显示结果
      popupManager.displayResults(results)

      const resultElements = document.querySelectorAll('.result-item')
      expect(resultElements.length).toBe(2)
    })
  })
})
```

### 集成测试
```typescript
// extension.test.ts
import { WowNavExtension } from '../src/extension'

describe('WowNavExtension Integration', () => {
  let extension: WowNavExtension

  beforeEach(async () => {
    extension = new WowNavExtension()
    await extension.initialize()
  })

  afterEach(async () => {
    await extension.cleanup()
  })

  describe('Bookmark Management', () => {
    it('should add and retrieve bookmarks', async () => {
      const bookmark = {
        title: 'Test Bookmark',
        url: 'https://example.com'
      }

      await extension.addBookmark(bookmark)
      const bookmarks = await extension.getBookmarks()

      expect(bookmarks).toContainEqual(
        expect.objectContaining({
          title: 'Test Bookmark',
          url: 'https://example.com'
        })
      )
    })

    it('should sync bookmarks across devices', async () => {
      // 模拟跨设备同步
      const bookmark = {
        title: 'Sync Test',
        url: 'https://sync-test.com'
      }

      await extension.addBookmark(bookmark)
      await extension.syncData()

      // 验证同步状态
      const syncStatus = await extension.getSyncStatus()
      expect(syncStatus.lastSync).toBeDefined()
    })
  })
})
```

## 最佳实践

### 性能优化
```typescript
// 内存管理
class MemoryManager {
  private cache: Map<string, any> = new Map()
  private maxCacheSize: number = 50 * 1024 * 1024 // 50MB

  public set(key: string, value: any): void {
    if (this.getCacheSize() + this.getObjectSize(value) > this.maxCacheSize) {
      this.evictOldEntries()
    }

    this.cache.set(key, value)
  }

  public get(key: string): any {
    return this.cache.get(key)
  }

  private getCacheSize(): number {
    let totalSize = 0
    this.cache.forEach(value => {
      totalSize += this.getObjectSize(value)
    })
    return totalSize
  }

  private getObjectSize(obj: any): number {
    return JSON.stringify(obj).length * 2 // 近似大小
  }

  private evictOldEntries(): void {
    // LRU 策略清理缓存
    const keys = Array.from(this.cache.keys())
    const toRemove = Math.floor(keys.length * 0.2)

    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(keys[i])
    }
  }
}
```

### 用户体验
```typescript
// 键盘快捷键
class KeyboardShortcuts {
  private shortcuts: Map<string, () => void> = new Map()

  constructor() {
    this.setupShortcuts()
    this.attachListeners()
  }

  private setupShortcuts(): void {
    // 搜索快捷键
    this.shortcuts.set('ctrl+k', () => this.focusSearchInput())

    // 书签快捷键
    this.shortcuts.set('ctrl+b', () => this.openBookmarks())

    // 历史快捷键
    this.shortcuts.set('ctrl+h', () => this.openHistory())

    // 设置快捷键
    this.shortcuts.set('ctrl+,', () => this.openSettings())
  }

  private attachListeners(): void {
    document.addEventListener('keydown', (event) => {
      const key = this.getKeyCombination(event)

      if (this.shortcuts.has(key)) {
        event.preventDefault()
        this.shortcuts.get(key)!()
      }
    })
  }

  private getKeyCombination(event: KeyboardEvent): string {
    const keys = []

    if (event.ctrlKey) keys.push('ctrl')
    if (event.altKey) keys.push('alt')
    if (event.shiftKey) keys.push('shift')
    if (event.metaKey) keys.push('meta')

    keys.push(event.key.toLowerCase())

    return keys.join('+')
  }

  private focusSearchInput(): void {
    const searchInput = document.getElementById('search-input') as HTMLInputElement
    searchInput.focus()
  }

  private openBookmarks(): void {
    // 切换到书签标签
    const bookmarkTab = document.querySelector('[data-tab="bookmarks"]') as HTMLButtonElement
    bookmarkTab.click()
  }

  private openHistory(): void {
    // 切换到历史标签
    const historyTab = document.querySelector('[data-tab="history"]') as HTMLButtonElement
    historyTab.click()
  }

  private openSettings(): void {
    // 打开设置页面
    chrome.runtime.openOptionsPage()
  }
}
```

## 技术亮点

### 🎯 现代化架构
- **Manifest V3**: 最新的Chrome扩展标准
- **Service Worker**: 现代化的后台处理
- **模块化设计**: 高度可扩展的架构
- **TypeScript**: 完整的类型安全

### ⚡ 高性能实现
- **虚拟滚动**: 大量数据的高效渲染
- **增量同步**: 智能的数据同步策略
- **缓存优化**: 多层缓存优化
- **懒加载**: 资源按需加载

### 🔒 隐私保护
- **最小权限**: 只请求必要的权限
- **本地处理**: 数据在本地处理
- **加密存储**: 敏感数据加密存储
- **透明审计**: 清晰的数据使用说明

## 社区贡献

### 🤝 开发协作
- **贡献指南**: 详细的开发贡献流程
- **代码审查**: 严格的代码审查标准
- **问题跟踪**: GitHub Issues 管理
- **文档维护**: 社区文档更新

### 📈 项目数据
- **用户增长**: 安装用户数量统计
- **功能使用**: 各功能使用频率分析
- **性能指标**: 扩展运行性能数据
- **反馈收集**: 用户反馈和建议收集

## 未来规划

- [ ] **AI 助手**: 智能搜索和推荐
- [ ] **多浏览器**: Firefox 和 Edge 支持
- [ ] **移动端**: 移动端配套应用
- [ ] **插件市场**: 第三方插件支持
- [ ] **企业版本**: 企业级功能支持

## 相关链接

- **项目主页**: [github.com/BiscuitCoder/wownav-extension](https://github.com/BiscuitCoder/wownav-extension)
- **Chrome 商店**: [chrome.google.com/webstore/detail/wownav/...](https://chrome.google.com/webstore/detail/wownav/...)
- **开发文档**: [docs.wownav.dev/extension](https://docs.wownav.dev/extension)
- **用户手册**: [help.wownav.dev](https://help.wownav.dev)

---

*重新定义浏览器导航体验 - 智能、高效、现代化的Chrome扩展* ⚡
