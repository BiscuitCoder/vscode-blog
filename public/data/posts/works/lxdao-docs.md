# LXDAO 文档 - LXDAO 官方文档库

## 项目概述

LXDAO 文档库是 LXDAO（LX 去中心化自治组织）的官方文档中心，提供完整的项目介绍、技术文档、治理指南和社区资源。项目采用现代化的文档网站架构，集成了多种文档工具和协作功能，为 LXDAO 社区成员和外部开发者提供全面的技术和项目信息。

## 核心功能

### 📚 文档管理系统
- **多语言支持**: 支持中英文等多语言文档
- **版本控制**: 完整的文档版本管理
- **搜索功能**: 强大的全文搜索功能
- **分类导航**: 清晰的文档分类和导航

### 👥 社区协作
- **实时协作**: 多用户同时编辑文档
- **评论系统**: 文档评论和讨论功能
- **贡献指南**: 详细的文档贡献流程
- **审核机制**: 文档质量审核和发布流程

### 🔧 开发者工具
- **API 文档**: 自动生成 API 文档
- **代码示例**: 丰富的代码示例和教程
- **开发环境**: 本地开发和预览环境
- **部署工具**: 自动文档部署和发布

## 技术架构

### Next.js + MDX 架构
```typescript
// next.config.mjs
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'

const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      remarkMdxFrontmatter,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeHighlight,
    ],
  },
})

export default withMDX(nextConfig)
```

### 文档结构管理
```typescript
// lib/docs/structure.ts
export interface DocNode {
  id: string
  title: string
  slug: string
  path: string
  type: 'folder' | 'file'
  children?: DocNode[]
  frontmatter?: DocFrontmatter
  content?: string
  lastModified: Date
  contributors: Contributor[]
}

export interface DocFrontmatter {
  title: string
  description: string
  category: string
  tags: string[]
  authors: string[]
  createdAt: string
  updatedAt: string
  order: number
  draft?: boolean
  featured?: boolean
}

export interface Contributor {
  name: string
  email: string
  avatar?: string
  contributions: number
}

// 文档树构建器
export class DocTreeBuilder {
  private docs: Map<string, DocNode> = new Map()

  async buildTree(rootPath: string): Promise<DocNode[]> {
    const rootNodes: DocNode[] = []

    // 递归构建文档树
    await this.buildNode(rootPath, rootNodes)

    // 排序节点
    this.sortNodes(rootNodes)

    return rootNodes
  }

  private async buildNode(path: string, nodes: DocNode[]): Promise<void> {
    const stats = await fs.stat(path)

    if (stats.isDirectory()) {
      const children: DocNode[] = []
      const files = await fs.readdir(path)

      for (const file of files) {
        const filePath = join(path, file)
        await this.buildNode(filePath, children)
      }

      // 创建目录节点
      if (children.length > 0) {
        const node: DocNode = {
          id: generateId(),
          title: this.getDirectoryTitle(path),
          slug: this.pathToSlug(path),
          path,
          type: 'folder',
          children,
          lastModified: stats.mtime,
          contributors: await this.getContributors(path)
        }
        nodes.push(node)
      }
    } else if (stats.isFile() && this.isDocFile(path)) {
      // 创建文件节点
      const frontmatter = await this.parseFrontmatter(path)
      const node: DocNode = {
        id: generateId(),
        title: frontmatter?.title || this.getFileTitle(path),
        slug: this.pathToSlug(path),
        path,
        type: 'file',
        frontmatter,
        content: await fs.readFile(path, 'utf-8'),
        lastModified: stats.mtime,
        contributors: await this.getContributors(path)
      }
      nodes.push(node)
    }
  }

  private isDocFile(path: string): boolean {
    const ext = extname(path)
    return ['.md', '.mdx'].includes(ext)
  }

  private getDirectoryTitle(path: string): string {
    const dirName = basename(path)
    return this.slugToTitle(dirName)
  }

  private getFileTitle(path: string): string {
    const fileName = basename(path, extname(path))
    return this.slugToTitle(fileName)
  }

  private pathToSlug(path: string): string {
    return path
      .replace(/^docs\//, '')
      .replace(/\/index$/, '')
      .replace(/\.(md|mdx)$/, '')
      .replace(/\//g, '-')
  }

  private slugToTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private sortNodes(nodes: DocNode[]): void {
    nodes.sort((a, b) => {
      // 文件夹优先
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1
      }

      // 按 order 排序
      const aOrder = a.frontmatter?.order ?? 999
      const bOrder = b.frontmatter?.order ?? 999

      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }

      // 按标题排序
      return a.title.localeCompare(b.title)
    })

    // 递归排序子节点
    nodes.forEach(node => {
      if (node.children) {
        this.sortNodes(node.children)
      }
    })
  }

  private async parseFrontmatter(filePath: string): Promise<DocFrontmatter | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const { data } = matter(content)
      return data as DocFrontmatter
    } catch (error) {
      return null
    }
  }

  private async getContributors(filePath: string): Promise<Contributor[]> {
    // 这里可以集成 Git 历史来获取贡献者信息
    // 暂时返回空数组
    return []
  }
}
```

### 搜索系统
```typescript
// lib/search/index.ts
import Fuse from 'fuse.js'
import { DocNode } from '../docs/structure'

export interface SearchResult {
  node: DocNode
  matches: SearchMatch[]
  score: number
}

export interface SearchMatch {
  field: string
  value: string
  indices: [number, number][]
}

export class DocSearch {
  private fuse: Fuse<DocNode>
  private index: Map<string, DocNode> = new Map()

  constructor(docs: DocNode[]) {
    this.buildIndex(docs)
    this.initializeFuse()
  }

  private buildIndex(docs: DocNode[]): void {
    const flattenDocs = (nodes: DocNode[]): DocNode[] => {
      const result: DocNode[] = []

      for (const node of nodes) {
        result.push(node)
        this.index.set(node.id, node)

        if (node.children) {
          result.push(...flattenDocs(node.children))
        }
      }

      return result
    }

    const flatDocs = flattenDocs(docs)
    this.docs = flatDocs
  }

  private initializeFuse(): void {
    this.fuse = new Fuse(this.docs, {
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'frontmatter.description', weight: 0.2 },
        { name: 'frontmatter.tags', weight: 0.1 },
        { name: 'content', weight: 0.4 },
      ],
      threshold: 0.3,
      includeMatches: true,
      includeScore: true,
      useExtendedSearch: true,
    })
  }

  search(query: string, options: SearchOptions = {}): SearchResult[] {
    if (!query.trim()) {
      return []
    }

    const results = this.fuse.search(query, {
      limit: options.limit || 20,
    })

    return results.map(result => ({
      node: result.item,
      matches: (result.matches || []).map(match => ({
        field: match.key || '',
        value: match.value || '',
        indices: match.indices || [],
      })),
      score: result.score || 0,
    }))
  }

  // 高级搜索
  advancedSearch(criteria: AdvancedSearchCriteria): SearchResult[] {
    let results = this.docs

    // 按分类过滤
    if (criteria.category) {
      results = results.filter(doc =>
        doc.frontmatter?.category === criteria.category
      )
    }

    // 按标签过滤
    if (criteria.tags && criteria.tags.length > 0) {
      results = results.filter(doc =>
        criteria.tags!.some(tag =>
          doc.frontmatter?.tags?.includes(tag)
        )
      )
    }

    // 按作者过滤
    if (criteria.author) {
      results = results.filter(doc =>
        doc.frontmatter?.authors?.includes(criteria.author!)
      )
    }

    // 按时间范围过滤
    if (criteria.dateRange) {
      const { start, end } = criteria.dateRange
      results = results.filter(doc => {
        const docDate = new Date(doc.frontmatter?.updatedAt || doc.lastModified)
        return docDate >= start && docDate <= end
      })
    }

    // 按类型过滤
    if (criteria.type) {
      results = results.filter(doc => doc.type === criteria.type)
    }

    // 文本搜索
    if (criteria.query) {
      const textResults = this.fuse.search(criteria.query)
      const textResultIds = new Set(textResults.map(r => r.item.id))
      results = results.filter(doc => textResultIds.has(doc.id))
    }

    return results
      .slice(0, criteria.limit || 50)
      .map(node => ({
        node,
        matches: [],
        score: 1,
      }))
  }

  // 建议搜索
  getSuggestions(query: string): string[] {
    if (!query.trim() || query.length < 2) {
      return []
    }

    const results = this.fuse.search(query, { limit: 10 })
    const suggestions: string[] = []

    for (const result of results) {
      if (result.item.title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(result.item.title)
      }

      if (result.item.frontmatter?.tags) {
        for (const tag of result.item.frontmatter.tags) {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            suggestions.push(tag)
          }
        }
      }
    }

    return [...new Set(suggestions)].slice(0, 5)
  }

  // 获取相关文档
  getRelatedDocs(docId: string, limit: number = 5): DocNode[] {
    const currentDoc = this.index.get(docId)
    if (!currentDoc) return []

    const related: DocNode[] = []

    // 相同分类的文档
    const sameCategory = this.docs.filter(doc =>
      doc.id !== docId &&
      doc.frontmatter?.category === currentDoc.frontmatter?.category
    )

    // 相同标签的文档
    const sameTags = this.docs.filter(doc => {
      if (doc.id === docId || !doc.frontmatter?.tags || !currentDoc.frontmatter?.tags) {
        return false
      }

      return doc.frontmatter.tags.some(tag =>
        currentDoc.frontmatter!.tags!.includes(tag)
      )
    })

    // 合并并去重
    const candidates = [...sameCategory, ...sameTags]
    const seen = new Set([docId])

    for (const doc of candidates) {
      if (!seen.has(doc.id)) {
        related.push(doc)
        seen.add(doc.id)

        if (related.length >= limit) break
      }
    }

    return related
  }

  // 更新索引
  updateDoc(updatedDoc: DocNode): void {
    const existingIndex = this.docs.findIndex(doc => doc.id === updatedDoc.id)

    if (existingIndex !== -1) {
      this.docs[existingIndex] = updatedDoc
    } else {
      this.docs.push(updatedDoc)
    }

    this.index.set(updatedDoc.id, updatedDoc)
    this.initializeFuse()
  }

  // 删除文档
  removeDoc(docId: string): void {
    const index = this.docs.findIndex(doc => doc.id === docId)

    if (index !== -1) {
      this.docs.splice(index, 1)
      this.index.delete(docId)
      this.initializeFuse()
    }
  }
}

interface SearchOptions {
  limit?: number
}

interface AdvancedSearchCriteria {
  query?: string
  category?: string
  tags?: string[]
  author?: string
  dateRange?: {
    start: Date
    end: Date
  }
  type?: 'file' | 'folder'
  limit?: number
}
```

## 项目结构

```
lxdao-docs/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 文档布局
│   ├── page.tsx           # 首页
│   ├── docs/              # 文档页面
│   │   ├── [slug]/        # 动态文档页面
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── page.tsx       # 文档首页
│   ├── search/            # 搜索页面
│   ├── contribute/        # 贡献页面
│   └── api/               # API 路由
│       ├── docs/          # 文档 API
│       ├── search/        # 搜索 API
│       └── contribute/    # 贡献 API
├── components/            # React 组件
│   ├── docs/              # 文档相关组件
│   │   ├── DocLayout.tsx     # 文档布局
│   │   ├── DocNavigation.tsx # 文档导航
│   │   ├── DocContent.tsx    # 文档内容
│   │   ├── DocSidebar.tsx    # 文档侧边栏
│   │   ├── SearchBox.tsx     # 搜索框
│   │   ├── TableOfContents.tsx # 目录
│   │   └── Breadcrumb.tsx    # 面包屑
│   ├── ui/                # UI 组件
│   │   ├── Button.tsx       # 按钮
│   │   ├── Input.tsx        # 输入框
│   │   ├── Modal.tsx        # 模态框
│   │   ├── Card.tsx         # 卡片
│   │   ├── Tabs.tsx         # 标签页
│   │   └── Badge.tsx        # 徽章
│   ├── layout/            # 布局组件
│   │   ├── Header.tsx       # 头部导航
│   │   ├── Footer.tsx       # 底部信息
│   │   ├── Sidebar.tsx      # 侧边栏
│   │   └── ThemeToggle.tsx  # 主题切换
│   └── shared/             # 共享组件
│       ├── Loading.tsx      # 加载组件
│       ├── ErrorBoundary.tsx # 错误边界
│       └── SEO.tsx          # SEO 组件
├── lib/                   # 工具函数
│   ├── docs/              # 文档相关工具
│   │   ├── structure.ts     # 文档结构
│   │   ├── parser.ts        # 文档解析器
│   │   ├── generator.ts     # 文档生成器
│   │   └── validator.ts     # 文档验证器
│   ├── search/            # 搜索相关工具
│   │   ├── index.ts         # 搜索索引
│   │   ├── engine.ts        # 搜索引擎
│   │   └── highlighter.ts   # 高亮器
│   ├── git/               # Git 相关工具
│   │   ├── client.ts        # Git 客户端
│   │   ├── sync.ts          # 同步工具
│   │   ├── history.ts       # 历史记录
│   │   └── contributors.ts  # 贡献者管理
│   ├── utils/             # 通用工具
│   │   ├── cn.ts            # CSS 类合并
│   │   ├── format.ts        # 格式化工具
│   │   ├── validation.ts    # 验证工具
│   │   ├── storage.ts       # 本地存储
│   │   └── constants.ts     # 常量定义
│   └── api/               # API 客户端
│       ├── client.ts        # API 客户端
│       ├── endpoints.ts     # API 端点
│       ├── types.ts         # API 类型
│       └── errors.ts        # API 错误处理
├── content/               # 文档内容
│   ├── docs/              # 文档文件
│   │   ├── introduction/   # 介绍文档
│   │   ├── getting-started/ # 入门指南
│   │   ├── tutorials/      # 教程
│   │   ├── api/           # API 文档
│   │   ├── guides/        # 使用指南
│   │   ├── community/     # 社区文档
│   │   └── governance/    # 治理文档
│   ├── assets/            # 文档资源
│   │   ├── images/        # 图片资源
│   │   ├── diagrams/      # 图表资源
│   │   └── videos/        # 视频资源
│   └── templates/         # 文档模板
│       ├── basic.md        # 基础模板
│       ├── tutorial.md     # 教程模板
│       ├── api.md          # API 模板
│       └── guide.md        # 指南模板
├── styles/                # 样式文件
│   ├── globals.css        # 全局样式
│   ├── variables.css      # CSS 变量
│   ├── themes/            # 主题样式
│   │   ├── light.css       # 亮色主题
│   │   ├── dark.css        # 暗色主题
│   │   ├── high-contrast.css # 高对比度主题
│   │   └── custom.css      # 自定义主题
│   └── components/        # 组件样式
│       ├── docs.css        # 文档样式
│       ├── search.css      # 搜索样式
│       ├── navigation.css  # 导航样式
│       └── forms.css       # 表单样式
├── public/                # 静态资源
│   ├── images/            # 图片资源
│   │   ├── logos/
│   │   ├── icons/
│   │   └── screenshots/
│   ├── fonts/             # 字体文件
│   ├── favicons/          # 网站图标
│   └── robots.txt         # 爬虫配置
├── tests/                 # 测试文件
│   ├── unit/              # 单元测试
│   ├── integration/       # 集成测试
│   ├── e2e/               # 端到端测试
│   └── utils/             # 测试工具
├── scripts/               # 构建脚本
│   ├── build.ts           # 构建脚本
│   ├── dev.ts             # 开发脚本
│   ├── deploy.ts          # 部署脚本
│   ├── index.ts           # 文档索引生成
│   └── sync.ts            # 内容同步脚本
├── config/                # 配置文件
│   ├── next.config.js     # Next.js 配置
│   ├── tailwind.config.js # Tailwind 配置
│   ├── contentlayer.config.ts # Contentlayer 配置
│   └── search.config.ts   # 搜索配置
├── .github/               # GitHub 配置
│   ├── workflows/         # GitHub Actions
│   │   ├── deploy.yml     # 部署工作流
│   │   ├── test.yml       # 测试工作流
│   │   └── preview.yml    # 预览工作流
│   └── ISSUE_TEMPLATE/    # Issue 模板
├── docs/                  # 项目文档
│   ├── README.md          # 项目说明
│   ├── CONTRIBUTING.md    # 贡献指南
│   ├── ARCHITECTURE.md    # 架构说明
│   ├── API.md             # API 文档
│   └── DEPLOYMENT.md      # 部署指南
└── package.json           # 项目依赖
```

## 核心功能实现

### 文档渲染组件
```typescript
// components/docs/DocContent.tsx
'use client'

import { useEffect, useState } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import { DocNode } from '@/lib/docs/structure'

interface DocContentProps {
  doc: DocNode
  components?: Record<string, React.ComponentType<any>>
}

export function DocContent({ doc, components = {} }: DocContentProps) {
  const [mdxSource, setMdxSource] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    serializeDocContent()
  }, [doc])

  const serializeDocContent = async () => {
    try {
      setLoading(true)

      const mdxSource = await serialize(doc.content || '', {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [
            remarkGfm,
            remarkFrontmatter,
            remarkMdxFrontmatter,
          ],
          rehypePlugins: [
            rehypeSlug,
            rehypeAutolinkHeadings,
            rehypeHighlight,
          ],
        },
      })

      setMdxSource(mdxSource)
    } catch (error) {
      console.error('Failed to serialize MDX:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
      </div>
    )
  }

  if (!mdxSource) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load document content</p>
      </div>
    )
  }

  // 自定义组件
  const defaultComponents = {
    h1: (props: any) => (
      <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0" {...props} />
    ),
    h2: (props: any) => (
      <h2 className="text-2xl font-semibold mb-4 mt-6" {...props} />
    ),
    h3: (props: any) => (
      <h3 className="text-xl font-medium mb-3 mt-5" {...props} />
    ),
    p: (props: any) => (
      <p className="text-muted-foreground leading-relaxed mb-4" {...props} />
    ),
    ul: (props: any) => (
      <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
    ),
    ol: (props: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />
    ),
    li: (props: any) => (
      <li className="text-muted-foreground" {...props} />
    ),
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 italic text-muted-foreground" {...props} />
    ),
    code: (props: any) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
    ),
    pre: (props: any) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />
    ),
    a: (props: any) => (
      <a className="text-primary hover:underline" {...props} />
    ),
    table: (props: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-border" {...props} />
      </div>
    ),
    th: (props: any) => (
      <th className="border border-border px-4 py-2 text-left font-semibold bg-muted" {...props} />
    ),
    td: (props: any) => (
      <td className="border border-border px-4 py-2" {...props} />
    ),
    // 自定义组件
    Callout: ({ type = 'info', children, ...props }: any) => {
      const styles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        success: 'bg-green-50 border-green-200 text-green-800',
      }

      return (
        <div className={`border-l-4 p-4 my-4 rounded-r-lg ${styles[type as keyof typeof styles] || styles.info}`} {...props}>
          {children}
        </div>
      )
    },
    CodeBlock: ({ language, children, ...props }: any) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    ),
  }

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote
        {...mdxSource}
        components={{ ...defaultComponents, ...components }}
      />
    </div>
  )
}
```

### 文档导航组件
```typescript
// components/docs/DocNavigation.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react'
import { DocNode } from '@/lib/docs/structure'
import { cn } from '@/lib/utils'

interface DocNavigationProps {
  docs: DocNode[]
  className?: string
}

export function DocNavigation({ docs, className }: DocNavigationProps) {
  return (
    <nav className={cn('space-y-1', className)}>
      {docs.map((doc) => (
        <DocNodeItem key={doc.id} doc={doc} />
      ))}
    </nav>
  )
}

interface DocNodeItemProps {
  doc: DocNode
  level?: number
}

function DocNodeItem({ doc, level = 0 }: DocNodeItemProps) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(true)
  const isActive = pathname === `/docs/${doc.slug}`

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  if (doc.type === 'folder') {
    return (
      <div>
        <button
          onClick={toggleExpanded}
          className={cn(
            'flex items-center w-full px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors',
            level > 0 && 'ml-4'
          )}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 mr-2 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-2 text-muted-foreground" />
          )}
          <Folder className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-sm font-medium truncate">{doc.title}</span>
        </button>

        {isExpanded && doc.children && (
          <div className="ml-2">
            {doc.children.map((child) => (
              <DocNodeItem key={child.id} doc={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={`/docs/${doc.slug}`}
      className={cn(
        'flex items-center px-3 py-2 text-left rounded-lg hover:bg-muted transition-colors',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
        level > 0 && 'ml-4'
      )}
    >
      <File className="w-4 h-4 mr-2 text-muted-foreground" />
      <span className="text-sm truncate">{doc.title}</span>
      {doc.frontmatter?.draft && (
        <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          Draft
        </span>
      )}
    </Link>
  )
}
```

### 搜索组件
```typescript
// components/docs/SearchBox.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DocSearch } from '@/lib/search'

interface SearchBoxProps {
  searchEngine: DocSearch
  className?: string
}

export function SearchBox({ searchEngine, className }: SearchBoxProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length >= 2) {
      const newSuggestions = searchEngine.getSuggestions(query)
      setSuggestions(newSuggestions)
      setIsOpen(newSuggestions.length > 0)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [query, searchEngine])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文档..."
            className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-muted focus:outline-none focus:bg-muted first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="flex items-center">
                <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="truncate">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

## 部署配置

### Vercel 部署
```json
// vercel.json
{
  "functions": {
    "pages/api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"]
}
```

### 环境变量配置
```bash
# .env.local
# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/lxdao_docs

# GitHub 配置 (用于内容同步)
GITHUB_TOKEN=your_github_token
GITHUB_REPO=lxdao-official/docs
GITHUB_BRANCH=main

# 搜索配置
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your_meilisearch_api_key

# 分析配置
GOOGLE_ANALYTICS_ID=your_ga_id
MIXPANEL_TOKEN=your_mixpanel_token

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 扩展功能

### 🔌 插件系统
- **主题插件**: 自定义文档主题
- **导出插件**: 支持多种格式导出
- **集成插件**: 第三方服务集成
- **编辑器插件**: 自定义编辑器功能

### 📊 分析功能
- **阅读统计**: 文档阅读量分析
- **用户行为**: 用户浏览行为分析
- **搜索分析**: 搜索查询分析
- **贡献统计**: 贡献者统计分析

### 🌐 国际化
- **多语言支持**: 支持多种语言
- **本地化内容**: 地域化内容展示
- **翻译工具**: 内置翻译功能
- **社区翻译**: 社区贡献翻译

## 最佳实践

### 内容管理
```typescript
// 文档验证器
class DocValidator {
  private rules: ValidationRule[]

  constructor() {
    this.rules = [
      {
        name: 'frontmatter',
        validate: this.validateFrontmatter.bind(this),
        message: 'Frontmatter is required and must be valid'
      },
      {
        name: 'content',
        validate: this.validateContent.bind(this),
        message: 'Content must not be empty and properly formatted'
      },
      {
        name: 'links',
        validate: this.validateLinks.bind(this),
        message: 'All links must be valid and accessible'
      },
      {
        name: 'images',
        validate: this.validateImages.bind(this),
        message: 'All images must exist and be properly sized'
      }
    ]
  }

  async validate(doc: DocNode): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    for (const rule of this.rules) {
      try {
        const result = await rule.validate(doc)
        if (!result.valid) {
          errors.push(`${rule.name}: ${result.message || rule.message}`)
        }
        if (result.warnings) {
          warnings.push(...result.warnings)
        }
      } catch (error) {
        errors.push(`${rule.name}: Validation failed - ${error.message}`)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  private async validateFrontmatter(doc: DocNode): Promise<ValidationResult> {
    const frontmatter = doc.frontmatter

    if (!frontmatter) {
      return { valid: false, message: 'Frontmatter is missing' }
    }

    const requiredFields = ['title', 'description']
    const missingFields = requiredFields.filter(field => !frontmatter[field])

    if (missingFields.length > 0) {
      return {
        valid: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }
    }

    return { valid: true }
  }

  private async validateContent(doc: DocNode): Promise<ValidationResult> {
    if (!doc.content || doc.content.trim().length === 0) {
      return { valid: false, message: 'Content is empty' }
    }

    // 检查基本的 Markdown 语法
    const issues: string[] = []

    // 检查未闭合的代码块
    const codeBlockRegex = /```/g
    const codeBlocks = doc.content.match(codeBlockRegex)
    if (codeBlocks && codeBlocks.length % 2 !== 0) {
      issues.push('Unclosed code blocks detected')
    }

    // 检查未闭合的链接
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const links = doc.content.match(linkRegex) || []
    const unclosedLinks = links.filter(link => !link.endsWith(')'))
    if (unclosedLinks.length > 0) {
      issues.push('Unclosed links detected')
    }

    return {
      valid: issues.length === 0,
      warnings: issues.length > 0 ? issues : undefined
    }
  }

  private async validateLinks(doc: DocNode): Promise<ValidationResult> {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const links = doc.content.match(linkRegex) || []

    const invalidLinks: string[] = []

    for (const link of links) {
      const urlMatch = link.match(/\(([^)]+)\)/)
      if (urlMatch) {
        const url = urlMatch[1]

        // 跳过邮件链接和锚点链接
        if (url.startsWith('mailto:') || url.startsWith('#')) {
          continue
        }

        // 检查相对链接
        if (!url.startsWith('http') && !url.startsWith('/')) {
          invalidLinks.push(`Invalid relative link: ${url}`)
        }

        // 可以在这里添加更多的链接验证逻辑
        // 比如检查外部链接是否可访问
      }
    }

    return {
      valid: invalidLinks.length === 0,
      warnings: invalidLinks.length > 0 ? invalidLinks : undefined
    }
  }

  private async validateImages(doc: DocNode): Promise<ValidationResult> {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    const images = doc.content.match(imageRegex) || []

    const invalidImages: string[] = []

    for (const image of images) {
      const urlMatch = image.match(/\(([^)]+)\)/)
      if (urlMatch) {
        const url = urlMatch[1]

        // 检查图片路径
        if (!url.startsWith('http') && !url.startsWith('/')) {
          invalidImages.push(`Invalid image path: ${url}`)
        }

        // 可以在这里添加图片大小和格式验证
      }
    }

    return {
      valid: invalidImages.length === 0,
      warnings: invalidImages.length > 0 ? invalidImages : undefined
    }
  }
}

interface ValidationRule {
  name: string
  validate: (doc: DocNode) => Promise<ValidationResult>
  message: string
}

interface ValidationResult {
  valid: boolean
  message?: string
  warnings?: string[]
}
```

### 性能优化
```typescript
// 内容预加载
class ContentPreloader {
  private preloadQueue: DocNode[] = []
  private maxConcurrent: number = 3
  private activeLoads: number = 0

  preloadDocs(docs: DocNode[]): void {
    this.preloadQueue = [...docs]
    this.startPreloading()
  }

  private async startPreloading(): Promise<void> {
    while (this.activeLoads < this.maxConcurrent && this.preloadQueue.length > 0) {
      const doc = this.preloadQueue.shift()
      if (doc) {
        this.activeLoads++
        this.preloadDoc(doc).finally(() => {
          this.activeLoads--
          this.startPreloading()
        })
      }
    }
  }

  private async preloadDoc(doc: DocNode): Promise<void> {
    if (doc.type === 'file' && doc.content) {
      // 预处理文档内容
      await this.preprocessContent(doc.content)

      // 缓存处理后的内容
      this.cacheProcessedContent(doc.id, doc.content)
    }

    if (doc.children) {
      // 递归预加载子文档
      for (const child of doc.children) {
        await this.preloadDoc(child)
      }
    }
  }

  private async preprocessContent(content: string): Promise<string> {
    // 这里可以进行内容预处理
    // 比如语法高亮、链接验证等

    return content
  }

  private cacheProcessedContent(docId: string, content: string): void {
    // 使用 IndexedDB 或其他存储方式缓存内容
    const cacheKey = `doc-${docId}`
    localStorage.setItem(cacheKey, content)
  }

  getCachedContent(docId: string): string | null {
    const cacheKey = `doc-${docId}`
    return localStorage.getItem(cacheKey)
  }
}

// 虚拟滚动
class VirtualScroller {
  private container: HTMLElement
  private items: DocNode[]
  private itemHeight: number = 40
  private visibleItems: number = 10
  private scrollTop: number = 0
  private totalHeight: number = 0

  constructor(container: HTMLElement, items: DocNode[]) {
    this.container = container
    this.items = items
    this.totalHeight = items.length * this.itemHeight

    this.setupContainer()
    this.setupScrollHandler()
    this.render()
  }

  private setupContainer(): void {
    this.container.style.height = `${this.visibleItems * this.itemHeight}px`
    this.container.style.overflow = 'auto'
    this.container.style.position = 'relative'
  }

  private setupScrollHandler(): void {
    this.container.addEventListener('scroll', (e) => {
      this.scrollTop = this.container.scrollTop
      this.render()
    })
  }

  private render(): void {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight)
    const endIndex = Math.min(
      startIndex + this.visibleItems,
      this.items.length
    )

    const visibleItems = this.items.slice(startIndex, endIndex)

    // 清除现有内容
    this.container.innerHTML = ''

    // 创建虚拟滚动容器
    const scrollContainer = document.createElement('div')
    scrollContainer.style.height = `${this.totalHeight}px`
    scrollContainer.style.position = 'relative'

    // 渲染可见项目
    visibleItems.forEach((item, index) => {
      const itemElement = this.createItemElement(item, startIndex + index)
      itemElement.style.position = 'absolute'
      itemElement.style.top = `${(startIndex + index) * this.itemHeight}px`
      itemElement.style.width = '100%'
      scrollContainer.appendChild(itemElement)
    })

    this.container.appendChild(scrollContainer)
  }

  private createItemElement(item: DocNode, index: number): HTMLElement {
    const element = document.createElement('div')
    element.className = 'virtual-item'
    element.textContent = item.title
    element.dataset.index = index.toString()

    return element
  }

  updateItems(newItems: DocNode[]): void {
    this.items = newItems
    this.totalHeight = newItems.length * this.itemHeight
    this.render()
  }
}
```

## 技术亮点

### 🎯 现代化架构
- **MDX 支持**: 支持 React 组件嵌入文档
- **实时协作**: 多用户同时编辑支持
- **版本控制**: 完整的文档版本管理
- **SEO 优化**: 搜索引擎优化支持

### ⚡ 高性能设计
- **静态生成**: 文档预渲染优化
- **增量更新**: 按需内容更新
- **缓存策略**: 多层缓存优化
- **虚拟滚动**: 大文档高效渲染

### 🔒 安全可靠
- **内容验证**: 文档内容安全验证
- **权限控制**: 细粒度的访问控制
- **审计日志**: 完整的操作记录
- **备份恢复**: 自动备份和恢复机制

## 社区贡献

### 🤝 开源协作
- **文档贡献**: 社区文档编写和更新
- **翻译贡献**: 多语言翻译支持
- **功能建议**: 功能需求和改进建议
- **问题反馈**: Bug 报告和修复

### 📈 项目数据
- **访问统计**: 文档访问量和热门内容
- **贡献统计**: 贡献者数量和贡献质量
- **搜索分析**: 用户搜索行为分析
- **使用反馈**: 用户体验和满意度调查

## 未来规划

- [ ] **AI 助手**: AI 辅助文档生成和改进
- [ ] **实时协作**: 多用户实时协作编辑
- [ ] **多媒体支持**: 视频和音频内容嵌入
- [ ] **API 集成**: 第三方服务深度集成
- [ ] **移动端优化**: 专用的移动端应用

## 相关链接

- **项目主页**: [github.com/lxdao-official/docs](https://github.com/lxdao-official/docs)
- **在线文档**: [docs.lxdao.io](https://docs.lxdao.io)
- **LXDAO 官网**: [lxdao.io](https://lxdao.io)
- **社区论坛**: [forum.lxdao.io](https://forum.lxdao.io)

---

*知识的桥梁，创新的起点 - LXDAO 官方文档库* 📚
