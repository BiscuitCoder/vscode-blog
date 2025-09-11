# Web3 Next.js Template - Web3 项目启动模板

## 项目概述

Web3 Next.js Template 是一个专为 Web3 项目定制的 Next.js 模板，提供完整的开发环境和最佳实践配置。模板集成了现代化的前端技术和 Web3 工具栈，帮助开发者快速构建高质量的去中心化应用。

## 核心功能

### 🚀 快速启动
- **预配置环境**: 开箱即用的开发环境
- **最佳实践**: 行业标准的代码结构
- **现代化技术**: 最新的 Web3 技术栈
- **生产就绪**: 可直接部署到生产环境

### 🛠️ 开发工具
- **热重载**: 实时开发预览
- **类型检查**: TypeScript 完整支持
- **代码规范**: ESLint + Prettier 配置
- **测试框架**: Jest + React Testing Library

### 📦 集成组件
- **钱包连接**: 多钱包适配器支持
- **UI 组件库**: 现代化的设计系统
- **状态管理**: 高效的全局状态管理
- **国际化**: 多语言支持

## 技术架构

### Next.js 13+ App Router
```typescript
// app/layout.tsx - 根布局
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web3 App Template',
  description: 'Modern Web3 application template built with Next.js',
  keywords: ['Web3', 'Blockchain', 'DeFi', 'NFT', 'Cryptocurrency'],
  authors: [{ name: 'Web3 Developer' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
```

### 提供商配置
```typescript
// components/providers/index.tsx
'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ThemeProvider } from 'next-themes'
import { I18nProvider } from '@/lib/i18n'
import { Web3ModalProvider } from '@/lib/web3-modal'

// 配置区块链网络
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY! }),
    publicProvider(),
  ]
)

// 配置钱包连接器
const connectors = [
  new MetaMaskConnector({ chains }),
  new CoinbaseWalletConnector({
    chains,
    options: {
      appName: 'Web3 App Template',
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    },
  }),
  new InjectedConnector({
    chains,
    options: {
      name: 'Injected',
      shimDisconnect: true,
    },
  }),
]

// 创建 Wagmi 客户端
const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={client}>
        <Web3ModalProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="web3-app-theme"
          >
            <I18nProvider>
              {children}
            </I18nProvider>
          </ThemeProvider>
        </Web3ModalProvider>
      </WagmiConfig>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 国际化配置
```typescript
// lib/i18n/index.tsx
'use client'

import { ReactNode, useEffect } from 'react'
import i18next from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// 导入翻译文件
import en from './locales/en.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'

// 配置 i18next
i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ja: { translation: ja },
      ko: { translation: ko },
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  })

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // 确保在客户端初始化完成
    i18next.reloadResources()
  }, [])

  return <>{children}</>
}

// 自定义 Hook
export function useI18n() {
  const { t, i18n } = useTranslation()

  return {
    t,
    i18n,
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
    currentLanguage: i18n.language,
    languages: ['en', 'zh', 'ja', 'ko'],
  }
}

// 类型定义
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}
```

## 项目结构

```
web3-nextjs-template/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证路由组
│   │   ├── layout.tsx     # 认证布局
│   │   ├── login/         # 登录页面
│   │   └── register/      # 注册页面
│   ├── (dashboard)/       # 仪表板路由组
│   │   ├── layout.tsx     # 仪表板布局
│   │   ├── page.tsx       # 仪表板首页
│   │   ├── wallet/        # 钱包页面
│   │   ├── nfts/          # NFT 页面
│   │   └── settings/      # 设置页面
│   ├── api/               # API 路由
│   │   ├── auth/          # 认证 API
│   │   ├── web3/          # Web3 API
│   │   └── user/          # 用户 API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   │   ├── button.tsx    # 按钮组件
│   │   ├── input.tsx     # 输入框组件
│   │   ├── modal.tsx     # 模态框组件
│   │   ├── card.tsx      # 卡片组件
│   │   ├── tabs.tsx      # 标签页组件
│   │   └── toast.tsx     # 提示组件
│   ├── web3/             # Web3 相关组件
│   │   ├── wallet-connect.tsx # 钱包连接
│   │   ├── network-selector.tsx # 网络选择
│   │   ├── balance-display.tsx # 余额显示
│   │   ├── transaction-list.tsx # 交易列表
│   │   └── contract-interaction.tsx # 合约交互
│   ├── layout/           # 布局组件
│   │   ├── header.tsx    # 头部导航
│   │   ├── sidebar.tsx   # 侧边栏
│   │   ├── footer.tsx    # 底部信息
│   │   └── breadcrumb.tsx # 面包屑
│   ├── forms/            # 表单组件
│   │   ├── login-form.tsx # 登录表单
│   │   ├── register-form.tsx # 注册表单
│   │   ├── wallet-form.tsx # 钱包表单
│   │   └── settings-form.tsx # 设置表单
│   └── hooks/            # 自定义 Hooks
│       ├── useWeb3.ts    # Web3 Hook
│       ├── useAuth.ts    # 认证 Hook
│       ├── useLocalStorage.ts # 本地存储 Hook
│       └── useDebounce.ts # 防抖 Hook
├── lib/                   # 工具函数和配置
│   ├── web3/             # Web3 相关
│   │   ├── config.ts     # Web3 配置
│   │   ├── providers.ts  # 提供商配置
│   │   ├── contracts.ts  # 合约实例
│   │   ├── utils.ts      # Web3 工具
│   │   └── hooks.ts      # Web3 Hooks
│   ├── auth/             # 认证相关
│   │   ├── providers.ts  # 认证提供商
│   │   ├── utils.ts      # 认证工具
│   │   ├── types.ts      # 认证类型
│   │   └── middleware.ts # 中间件
│   ├── i18n/             # 国际化
│   │   ├── config.ts     # i18n 配置
│   │   ├── locales/      # 语言文件
│   │   │   ├── en.json
│   │   │   ├── zh.json
│   │   │   ├── ja.json
│   │   │   └── ko.json
│   │   └── utils.ts      # 翻译工具
│   ├── database/         # 数据库相关
│   │   ├── config.ts     # 数据库配置
│   │   ├── models/       # 数据模型
│   │   └── migrations/   # 数据库迁移
│   ├── api/              # API 客户端
│   │   ├── client.ts     # API 客户端
│   │   ├── endpoints.ts  # API 端点
│   │   ├── types.ts      # API 类型
│   │   └── errors.ts     # API 错误处理
│   └── utils/            # 通用工具
│       ├── cn.ts         # CSS 类合并
│       ├── format.ts     # 格式化工具
│       ├── validation.ts # 验证工具
│       ├── storage.ts    # 本地存储
│       └── constants.ts  # 常量定义
├── types/                 # TypeScript 类型
│   ├── web3.ts           # Web3 类型
│   ├── auth.ts           # 认证类型
│   ├── api.ts            # API 类型
│   ├── ui.ts             # UI 类型
│   └── common.ts         # 通用类型
├── styles/                # 样式文件
│   ├── globals.css       # 全局样式
│   ├── variables.css     # CSS 变量
│   ├── themes/           # 主题样式
│   │   ├── light.css     # 亮色主题
│   │   ├── dark.css      # 暗色主题
│   │   └── high-contrast.css # 高对比度主题
│   └── components/       # 组件样式
│       ├── button.css
│       ├── modal.css
│       └── form.css
├── public/                # 静态资源
│   ├── images/           # 图片资源
│   │   ├── logos/
│   │   ├── icons/
│   │   └── backgrounds/
│   ├── fonts/            # 字体文件
│   │   ├── inter.woff2
│   │   └── jetbrains-mono.woff2
│   └── favicons/         # 网站图标
├── tests/                 # 测试文件
│   ├── unit/             # 单元测试
│   │   ├── components/   # 组件测试
│   │   ├── hooks/        # Hook 测试
│   │   ├── utils/        # 工具测试
│   │   └── web3/         # Web3 测试
│   ├── integration/      # 集成测试
│   │   ├── auth.test.ts  # 认证集成测试
│   │   ├── web3.test.ts  # Web3 集成测试
│   │   └── api.test.ts   # API 集成测试
│   ├── e2e/              # 端到端测试
│   │   ├── auth.spec.ts  # 认证 E2E 测试
│   │   └── wallet.spec.ts # 钱包 E2E 测试
│   └── utils/            # 测试工具
│       ├── setup.ts      # 测试设置
│       ├── mocks.ts      # 模拟数据
│       └── helpers.ts    # 测试助手
├── docs/                  # 项目文档
│   ├── README.md         # 项目说明
│   ├── getting-started.md # 入门指南
│   ├── api-reference.md  # API 参考
│   ├── deployment.md     # 部署指南
│   ├── troubleshooting.md # 故障排除
│   ├── migration.md      # 迁移指南
│   └── changelog.md      # 更新日志
├── scripts/               # 构建脚本
│   ├── build.ts          # 构建脚本
│   ├── dev.ts            # 开发脚本
│   ├── test.ts           # 测试脚本
│   ├── lint.ts           # 代码检查
│   ├── format.ts         # 格式化脚本
│   ├── type-check.ts     # 类型检查
│   └── analyze.ts        # 代码分析
├── config/                # 配置文件
│   ├── next.config.js    # Next.js 配置
│   ├── tailwind.config.js # Tailwind 配置
│   ├── jest.config.js    # Jest 配置
│   ├── eslint.config.js  # ESLint 配置
│   ├── prettier.config.js # Prettier 配置
│   ├── typescript.config.json # TypeScript 配置
│   └── postcss.config.js # PostCSS 配置
├── .env.example          # 环境变量示例
├── .gitignore           # Git 忽略文件
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript 配置
└── README.md            # 项目说明
```

## 核心功能实现

### 钱包连接组件
```typescript
// components/web3/wallet-connect.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import { useWeb3Modal } from '@web3modal/react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { formatAddress } from '@/lib/utils'

export function WalletConnect() {
  const { address, isConnected, connector } = useAccount()
  const { chain } = useNetwork()
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()
  const { t } = useI18n()

  const [isConnecting, setIsConnecting] = useState(false)

  // 处理连接
  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await open()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  // 处理断开连接
  const handleDisconnect = async () => {
    try {
      disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  // 获取网络名称
  const getNetworkName = (chainId?: number) => {
    const networks: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      10: 'Optimism',
      42161: 'Arbitrum',
      56: 'BSC',
      43114: 'Avalanche'
    }
    return networks[chainId || 1] || 'Unknown'
  }

  // 获取连接器图标
  const getConnectorIcon = (connectorId?: string) => {
    const icons: Record<string, string> = {
      metaMask: '🦊',
      walletConnect: '🔗',
      coinbaseWallet: '📱',
      injected: '💉'
    }
    return icons[connectorId || ''] || '👛'
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        {/* 网络状态 */}
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">
            {getNetworkName(chain?.id)}
          </span>
        </div>

        {/* 钱包地址 */}
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
          <span className="text-lg">{getConnectorIcon(connector?.id)}</span>
          <span className="text-sm font-medium">
            {formatAddress(address)}
          </span>
        </div>

        {/* 断开连接按钮 */}
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          disabled={isConnecting}
        >
          {t('wallet.disconnect')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {/* 快速连接按钮 */}
      {connectors.slice(0, 3).map((connector) => (
        <Button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isLoading && connector.id === pendingConnector?.id}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <span className="text-lg">{getConnectorIcon(connector.id)}</span>
          {connector.name}
          {isLoading && connector.id === pendingConnector?.id && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          )}
        </Button>
      ))}

      {/* Web3Modal 按钮 */}
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      >
        {isConnecting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {t('wallet.connecting')}
          </div>
        ) : (
          t('wallet.connect')
        )}
      </Button>
    </div>
  )
}
```

### 仪表板页面
```typescript
// app/(dashboard)/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAccount, useBalance, useContractReads } from 'wagmi'
import { formatEther } from 'ethers/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { formatAddress } from '@/lib/utils'

// ERC20 ABI (简化版)
const erc20ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
] as const

// 常用代币合约地址
const TOKENS = {
  USDC: '0xA0b86a33E6441e88C5F2712C3E9b74F5c4d6E3E9',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
} as const

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { data: ethBalance } = useBalance({ address })
  const { t } = useI18n()

  // 读取代币余额
  const { data: tokenBalances } = useContractReads({
    contracts: Object.entries(TOKENS).map(([symbol, address]) => ({
      address: address as `0x${string}`,
      abi: erc20ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    })),
  })

  const [portfolioValue, setPortfolioValue] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState([])

  // 计算投资组合价值
  useEffect(() => {
    if (ethBalance && tokenBalances) {
      // 这里应该获取代币价格并计算总价值
      const ethValue = parseFloat(formatEther(ethBalance.value))
      setPortfolioValue(ethValue) // 简化计算
    }
  }, [ethBalance, tokenBalances])

  // 加载最近交易
  useEffect(() => {
    if (address) {
      // 这里应该从区块链浏览器 API 获取交易历史
      // 暂时使用模拟数据
      setRecentTransactions([
        {
          hash: '0x123...',
          type: 'send',
          amount: '0.5 ETH',
          timestamp: Date.now() - 3600000,
          status: 'confirmed'
        }
      ])
    }
  }, [address])

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">🔗</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">{t('dashboard.connect_wallet_title')}</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {t('dashboard.connect_wallet_description')}
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500">
            {t('wallet.connect')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 头部信息 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">
            {t('dashboard.welcome_back', { address: formatAddress(address!) })}
          </p>
        </div>
        <Button variant="outline">
          {t('dashboard.refresh')}
        </Button>
      </div>

      {/* 资产概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t('dashboard.portfolio_value')}
              </p>
              <p className="text-2xl font-bold">
                ${portfolioValue.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t('dashboard.eth_balance')}
              </p>
              <p className="text-2xl font-bold">
                {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0'} ETH
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⟠</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t('dashboard.transactions_today')}
              </p>
              <p className="text-2xl font-bold">
                {recentTransactions.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 代币余额 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{t('dashboard.token_balances')}</h3>
          <Button variant="outline" size="sm">
            {t('dashboard.add_token')}
          </Button>
        </div>

        <div className="space-y-4">
          {/* ETH 余额 */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-lg">⟠</span>
              </div>
              <div>
                <p className="font-medium">Ethereum</p>
                <p className="text-sm text-muted-foreground">ETH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0'}
              </p>
              <p className="text-sm text-muted-foreground">
                ${ethBalance ? (parseFloat(formatEther(ethBalance.value)) * 1800).toFixed(2) : '0'}
              </p>
            </div>
          </div>

          {/* 其他代币 */}
          {tokenBalances?.map((balance, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">🪙</span>
                </div>
                <div>
                  <p className="font-medium">Token {index + 1}</p>
                  <p className="text-sm text-muted-foreground">TKN{index + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {balance ? parseFloat(formatEther(balance)).toFixed(2) : '0'}
                </p>
                <p className="text-sm text-muted-foreground">
                  $0.00
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 最近交易 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{t('dashboard.recent_transactions')}</h3>
          <Button variant="outline" size="sm">
            {t('dashboard.view_all')}
          </Button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((tx: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.status === 'confirmed' ? 'bg-green-500/20' :
                  tx.status === 'pending' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  <span className="text-sm">
                    {tx.type === 'send' ? '📤' : '📥'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {tx.type === 'send' ? t('transaction.sent') : t('transaction.received')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  tx.type === 'send' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {tx.type === 'send' ? '-' : '+'}{tx.amount}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                >
                  {t('transaction.view')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
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
  "env": {
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID": "@walletconnect-project-id",
    "NEXT_PUBLIC_ALCHEMY_API_KEY": "@alchemy-api-key",
    "NEXT_PUBLIC_INFURA_PROJECT_ID": "@infura-project-id",
    "NEXT_PUBLIC_ENABLE_TESTNETS": "@enable-testnets"
  },
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"]
}
```

### 环境变量配置
```bash
# .env.local
# Web3 配置
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
NEXT_PUBLIC_ENABLE_TESTNETS=true

# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/web3app

# JWT 配置
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# 文件上传配置
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# 监控配置
SENTRY_DSN=your_sentry_dsn
```

## 扩展功能

### 🔌 DeFi 集成
- **Uniswap 集成**: 代币交换功能
- **Aave 集成**: 借贷功能
- **Compound 集成**: 收益聚合
- **Yearn 集成**: 收益优化

### 📊 数据分析
- **交易分析**: 用户交易行为分析
- **资产分析**: 投资组合风险分析
- **市场数据**: 加密货币市场数据
- **收益报告**: 投资收益统计报告

### 🌐 社交功能
- **用户资料**: 个性化用户资料
- **好友系统**: Web3 社交网络
- **消息系统**: 加密消息传递
- **群组功能**: 社区和群组管理

## 最佳实践

### 性能优化
```typescript
// 图片优化
import Image from 'next/image'
import { useState } from 'react'

function OptimizedImage({ src, alt, ...props }: any) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
      )}
      <Image
        src={src}
        alt={alt}
        {...props}
        onLoad={() => setIsLoading(false)}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  )
}

// 组件懒加载
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <div className="animate-pulse">Loading...</div>,
  ssr: false
})

// 数据获取优化
import { useQuery } from '@tanstack/react-query'

function useOptimizedData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // 智能重试逻辑
      if (error.status === 429) return false // 不要重试速率限制
      return failureCount < 3
    }
  })
}
```

### 安全考虑
```typescript
// API 密钥安全管理
class SecureStorage {
  private static instance: SecureStorage
  private key: CryptoKey | null = null

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage()
    }
    return SecureStorage.instance
  }

  async initialize(): Promise<void> {
    this.key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  async encrypt(data: string): Promise<string> {
    if (!this.key) await this.initialize()

    const encoded = new TextEncoder().encode(data)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key!,
      encoded
    )

    // 组合 IV 和加密数据
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)

    return btoa(String.fromCharCode(...combined))
  }

  async decrypt(encryptedData: string): Promise<string> {
    if (!this.key) await this.initialize()

    const combined = new Uint8Array(
      atob(encryptedData).split('').map(c => c.charCodeAt(0))
    )

    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.key!,
      encrypted
    )

    return new TextDecoder().decode(decrypted)
  }
}

// 使用示例
const secureStorage = SecureStorage.getInstance()

// 存储敏感数据
await secureStorage.encrypt('sensitive-api-key')

// 检索并解密
const apiKey = await secureStorage.decrypt(encryptedKey)
```

### 错误处理
```typescript
// 全局错误边界
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误到监控服务
    console.error('Error caught by boundary:', error, errorInfo)

    // 发送错误到 Sentry 或其他监控服务
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">出错了</h2>
            <p className="text-muted-foreground mb-6">
              抱歉，出现了一个错误。我们正在努力修复。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// 使用错误边界包装应用
export function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  )
}
```

## 技术亮点

### 🎯 开箱即用
- **完整配置**: 预配置的开发环境和工具链
- **最佳实践**: 遵循行业标准和最佳实践
- **现代化技术**: 使用最新的 Web 技术和框架
- **生产就绪**: 可直接部署到生产环境的完整应用

### ⚡ 高性能架构
- **Next.js 13+**: 最新的 App Router 和 React Server Components
- **服务端渲染**: 优化的首屏加载和 SEO
- **静态生成**: 预渲染页面提高性能
- **增量更新**: 智能的缓存和更新策略

### 🔒 企业级安全
- **TypeScript**: 完整的类型安全和开发体验
- **环境隔离**: 开发、测试、生产环境分离
- **密钥管理**: 安全的 API 密钥和敏感数据管理
- **审计日志**: 完整的操作记录和安全审计

## 社区贡献

### 🤝 开源协作
- **模板更新**: 保持技术栈和依赖的最新版本
- **功能扩展**: 添加新的功能模块和组件
- **文档完善**: 完善使用文档、API 文档和部署指南
- **问题修复**: 修复 bug 和性能问题，改进用户体验

### 📈 项目数据
- **下载统计**: npm 下载量和 GitHub clone 统计
- **用户反馈**: 收集和分析用户反馈和建议
- **功能使用**: 分析各功能模块的使用情况
- **性能指标**: 监控应用的性能指标和用户体验

## 未来规划

- [ ] **多链支持**: 支持更多区块链网络和 Layer 2 解决方案
- [ ] **AI 集成**: 集成 AI 功能，如智能合约分析和自动化交易
- [ ] **移动应用**: 开发配套的 React Native 移动应用
- [ ] **插件系统**: 开发可扩展的插件架构
- [ ] **企业版本**: 开发面向企业的定制版本

## 相关链接

- **项目主页**: [github.com/BiscuitCoder/web3-next-temp](https://github.com/BiscuitCoder/web3-next-temp)
- **在线演示**: [web3-template.vercel.app](https://web3-template.vercel.app)
- **文档中心**: [docs.web3-template.dev](https://docs.web3-template.dev)
- **模板市场**: [templates.web3-template.dev](https://templates.web3-template.dev)

---

*专为 Web3 项目定制的现代化 Next.js 模板 - 快速启动，功能完整，性能卓越* 🚀
