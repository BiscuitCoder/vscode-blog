# 0xSpace.tech - Web3 项目启动模板

## 项目概述

0xSpace.tech 是一个专为 Web3 项目定制的现代化 Next.js 启动模板，集成了当前最流行的 Web3 技术和工具栈。项目提供了完整的开发环境配置，开箱即用的组件库，以及最佳实践的代码结构，帮助开发者快速启动和构建高质量的 Web3 应用。

## 核心功能

### 🚀 项目模板
- **快速启动**: 预配置的开发环境
- **最佳实践**: 行业标准的代码结构
- **现代化技术**: 最新的 Web3 技术栈
- **生产就绪**: 可直接部署到生产环境

### 🛠️ 开发工具
- **热重载**: 开发时的实时更新
- **类型检查**: TypeScript 严格模式
- **代码规范**: ESLint + Prettier 配置
- **测试环境**: Jest + React Testing Library

### 📦 集成组件
- **钱包连接**: MetaMask, WalletConnect 等
- **UI 组件**: HeroUI 组件库
- **状态管理**: Zustand 状态管理
- **多语言**: i18next 国际化支持

## 技术架构

### Next.js 13+ App Router
```typescript
// app/layout.tsx - 根布局
import { Providers } from '@/components/providers'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### 提供商配置
```typescript
// components/providers.tsx
'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider } from 'next-themes'
import { Web3Provider } from '@/lib/web3'
import { I18nProvider } from '@/lib/i18n'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <I18nProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <HeroUIProvider>
            {children}
          </HeroUIProvider>
        </ThemeProvider>
      </I18nProvider>
    </Web3Provider>
  )
}
```

### Web3 集成
```typescript
// lib/web3.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useWeb3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'

// 配置区块链网络
const chains = [
  {
    id: 1,
    name: 'Ethereum',
    network: 'homestead',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://cloudflare-eth.com'] } },
    blockExplorers: { default: { name: 'Etherscan', url: 'https://etherscan.io' } },
  },
  {
    id: 137,
    name: 'Polygon',
    network: 'matic',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: { default: { http: ['https://polygon-rpc.com'] } },
    blockExplorers: { default: { name: 'PolygonScan', url: 'https://polygonscan.com' } },
  },
]

// 配置 Web3Modal
const { provider } = configureChains(chains, [walletConnectProvider({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID! })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: '0xSpace.tech', chains }),
  provider
})

const ethereumClient = new EthereumClient(wagmiClient, chains)

// Web3 上下文
interface Web3ContextType {
  isConnected: boolean
  address: string | null
  chainId: number | null
  signer: ethers.Signer | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const Web3Context = createContext<Web3ContextType | null>(null)

// Web3 提供商组件
export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)

  const { open, close } = useWeb3Modal()

  useEffect(() => {
    // 检查是否已连接
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setIsConnected(true)
            setAddress(accounts[0])

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const network = await provider.getNetwork()
            setChainId(network.chainId)
            setSigner(provider.getSigner())
          }
        } catch (error) {
          console.error('Failed to check connection:', error)
        }
      }
    }

    checkConnection()

    // 监听账户变化
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setIsConnected(true)
          setAddress(accounts[0])
        } else {
          setIsConnected(false)
          setAddress(null)
          setSigner(null)
        }
      })

      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16))
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  const connect = async () => {
    try {
      await open()
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  const disconnect = async () => {
    try {
      await close()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  return (
    <Web3Context.Provider value={{
      isConnected,
      address,
      chainId,
      signer,
      connect,
      disconnect
    }}>
      <WagmiConfig client={wagmiClient}>
        {children}
      </WagmiConfig>
    </Web3Context.Provider>
  )
}

// 使用 Web3 上下文的 Hook
export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}
```

### 国际化支持
```typescript
// lib/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// 语言资源
const resources = {
  en: {
    translation: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'wallet.connect': 'Connect Wallet',
      'wallet.disconnect': 'Disconnect',
      'common.loading': 'Loading...',
      'common.error': 'Something went wrong',
    }
  },
  zh: {
    translation: {
      'nav.home': '首页',
      'nav.about': '关于',
      'nav.contact': '联系我们',
      'wallet.connect': '连接钱包',
      'wallet.disconnect': '断开连接',
      'common.loading': '加载中...',
      'common.error': '出错了',
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 默认语言
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

// I18n 提供商
export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    i18n.changeLanguage(navigator.language.split('-')[0])
  }, [])

  return <>{children}</>
}

// 使用翻译的 Hook
export function useTranslation() {
  return i18n
}
```

## 项目结构

```
0xSpace.tech/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── about/             # 关于页面
│   ├── contact/           # 联系页面
│   ├── dashboard/         # 用户仪表板
│   └── api/               # API 路由
│       ├── auth/          # 认证 API
│       └── web3/          # Web3 API
├── components/            # React 组件
│   ├── ui/               # UI 组件
│   │   ├── button.tsx    # 按钮组件
│   │   ├── modal.tsx     # 模态框
│   │   ├── input.tsx     # 输入框
│   │   └── card.tsx      # 卡片组件
│   ├── web3/             # Web3 相关组件
│   │   ├── wallet-connect.tsx # 钱包连接
│   │   ├── balance.tsx   # 余额显示
│   │   ├── transaction.tsx # 交易组件
│   │   └── network-selector.tsx # 网络选择
│   ├── layout/           # 布局组件
│   │   ├── header.tsx    # 头部导航
│   │   ├── footer.tsx    # 底部信息
│   │   ├── sidebar.tsx   # 侧边栏
│   │   └── breadcrumb.tsx # 面包屑导航
│   └── forms/            # 表单组件
│       ├── login-form.tsx # 登录表单
│       ├── register-form.tsx # 注册表单
│       └── contact-form.tsx # 联系表单
├── lib/                   # 工具函数和配置
│   ├── web3/             # Web3 相关
│   │   ├── config.ts     # Web3 配置
│   │   ├── contracts.ts  # 合约实例
│   │   ├── utils.ts      # Web3 工具
│   │   └── hooks.ts      # Web3 Hooks
│   ├── i18n/             # 国际化
│   │   ├── config.ts     # i18n 配置
│   │   ├── locales/      # 语言文件
│   │   └── utils.ts      # 翻译工具
│   ├── auth/             # 认证相关
│   │   ├── providers.ts  # 认证提供商
│   │   ├── utils.ts      # 认证工具
│   │   └── hooks.ts      # 认证 Hooks
│   ├── api/              # API 客户端
│   │   ├── client.ts     # API 客户端
│   │   ├── endpoints.ts  # API 端点
│   │   └── types.ts      # API 类型
│   └── utils/            # 通用工具
│       ├── cn.ts         # CSS 类合并
│       ├── format.ts     # 格式化工具
│       ├── validation.ts # 验证工具
│       └── storage.ts    # 本地存储
├── hooks/                 # React Hooks
│   ├── useWeb3.ts        # Web3 Hook
│   ├── useAuth.ts        # 认证 Hook
│   ├── useLocalStorage.ts # 本地存储 Hook
│   └── useDebounce.ts    # 防抖 Hook
├── types/                 # TypeScript 类型
│   ├── web3.ts           # Web3 类型
│   ├── auth.ts           # 认证类型
│   ├── api.ts            # API 类型
│   └── common.ts         # 通用类型
├── styles/                # 样式文件
│   ├── globals.css       # 全局样式
│   ├── variables.css     # CSS 变量
│   ├── components/       # 组件样式
│   └── themes/           # 主题样式
├── public/                # 静态资源
│   ├── images/           # 图片资源
│   ├── icons/            # 图标资源
│   └── fonts/            # 字体文件
├── config/                # 配置文件
│   ├── constants.ts      # 常量配置
│   ├── environment.ts    # 环境配置
│   └── features.ts       # 功能配置
├── tests/                 # 测试文件
│   ├── unit/             # 单元测试
│   ├── integration/      # 集成测试
│   └── e2e/              # 端到端测试
├── docs/                  # 项目文档
│   ├── README.md         # 项目说明
│   ├── API.md            # API 文档
│   ├── deployment.md     # 部署指南
│   └── contribution.md   # 贡献指南
└── scripts/               # 构建脚本
    ├── build.ts          # 构建脚本
    ├── deploy.ts         # 部署脚本
    ├── setup.ts          # 初始化脚本
    └── lint.ts           # 代码检查
```

## 核心功能实现

### 钱包连接组件
```typescript
// components/web3/wallet-connect.tsx
'use client'

import { useState } from 'react'
import { useWeb3 } from '@/lib/web3'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

export function WalletConnect() {
  const { isConnected, address, chainId, connect, disconnect } = useWeb3()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connect()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getChainName = (chainId: number) => {
    const chains: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      56: 'BSC',
      43114: 'Avalanche'
    }
    return chains[chainId] || `Chain ${chainId}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm font-medium">
            {getChainName(chainId!)}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span className="text-sm font-medium">
            {formatAddress(address)}
          </span>
        </div>

        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? t('common.loading') : t('wallet.disconnect')}
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
    >
      {isLoading ? t('common.loading') : t('wallet.connect')}
    </Button>
  )
}
```

### 仪表板组件
```typescript
// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useWeb3 } from '@/lib/web3'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

interface DashboardData {
  balance: string
  transactions: Transaction[]
  nfts: NFT[]
  tokens: Token[]
}

interface Transaction {
  hash: string
  type: 'send' | 'receive'
  amount: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
}

interface NFT {
  id: string
  name: string
  image: string
  collection: string
}

interface Token {
  symbol: string
  balance: string
  value: string
}

export default function Dashboard() {
  const { address, isConnected } = useWeb3()
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      loadDashboardData()
    }
  }, [isConnected, address])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)

      // 这里应该调用实际的API来获取数据
      const response = await fetch(`/api/dashboard?address=${address}`)
      const dashboardData = await response.json()

      setData(dashboardData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">连接钱包</h2>
          <p className="text-muted-foreground mb-6">
            请连接您的钱包以查看仪表板
          </p>
          <Button>连接钱包</Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 余额概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">总余额</p>
              <p className="text-2xl font-bold">{data?.balance} ETH</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">代币数量</p>
              <p className="text-2xl font-bold">{data?.tokens.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🪙</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">NFT 数量</p>
              <p className="text-2xl font-bold">{data?.nfts.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 最新交易 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">最新交易</h3>
          <Button variant="outline" size="sm">
            查看全部
          </Button>
        </div>

        <div className="space-y-3">
          {data?.transactions.slice(0, 5).map((tx) => (
            <div key={tx.hash} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  tx.status === 'confirmed' ? 'bg-green-500' :
                  tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium">
                    {tx.type === 'send' ? '发送' : '接收'} {tx.amount} ETH
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tx.timestamp * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
              >
                查看
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* NFT 展示 */}
      {data?.nfts && data.nfts.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">我的 NFT</h3>
            <Button variant="outline" size="sm">
              查看全部
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.nfts.slice(0, 4).map((nft) => (
              <div key={nft.id} className="group cursor-pointer">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-sm font-medium truncate">{nft.name}</p>
                <p className="text-xs text-muted-foreground truncate">{nft.collection}</p>
              </div>
            ))}
          </div>
        </Card>
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
  "env": {
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID": "@walletconnect-project-id",
    "NEXT_PUBLIC_ALCHEMY_API_KEY": "@alchemy-api-key",
    "NEXT_PUBLIC_INFURA_PROJECT_ID": "@infura-project-id"
  },
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### 环境变量配置
```bash
# .env.local
# Web3 配置
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id

# 数据库配置
DATABASE_URL=postgresql://username:password@localhost:5432/database

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# 文件上传配置
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 扩展功能

### 🔌 插件系统
- **钱包插件**: 支持更多钱包类型
- **网络插件**: 自定义区块链网络
- **协议插件**: DeFi 协议集成
- **工具插件**: 开发工具集成

### 📊 数据分析
- **用户行为**: 用户交互数据分析
- **交易统计**: 交易数据统计分析
- **性能监控**: 应用性能监控
- **错误追踪**: 错误日志追踪

### 🌐 多链支持
- **Layer 2**: Arbitrum 和 Optimism
- **侧链**: Polygon 和 BSC
- **跨链桥接**: 资产跨链转移
- **多链钱包**: 支持多种区块链

## 最佳实践

### 安全考虑
```typescript
// API 密钥安全
const secureConfig = {
  // 使用环境变量而不是硬编码
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

  // RPC 端点轮换
  rpcEndpoints: [
    process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL,
    process.env.NEXT_PUBLIC_INFURA_RPC_URL,
    'https://cloudflare-eth.com' // 公共端点作为后备
  ],

  // 请求频率限制
  rateLimit: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000 // 15分钟
  }
}

// 合约调用安全
class SecureContractCaller {
  private provider: ethers.providers.Provider
  private rateLimiter: RateLimiter

  async callContract(
    contractAddress: string,
    methodName: string,
    params: any[] = []
  ) {
    // 检查请求频率
    if (!this.rateLimiter.checkLimit(contractAddress)) {
      throw new Error('Rate limit exceeded')
    }

    // 使用多个RPC端点进行重试
    for (const rpcUrl of secureConfig.rpcEndpoints) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const contract = new ethers.Contract(contractAddress, abi, provider)

        return await contract[methodName](...params)
      } catch (error) {
        console.warn(`RPC call failed for ${rpcUrl}:`, error)
        continue
      }
    }

    throw new Error('All RPC endpoints failed')
  }
}
```

### 性能优化
```typescript
// React Query 配置
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
      retry: (failureCount, error) => {
        // 网络错误重试
        if (error instanceof NetworkError) {
          return failureCount < 3
        }
        return false
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error)
        // 显示错误提示
        toast.error('操作失败，请重试')
      }
    }
  }
})

// SWR 配置
import { SWRConfig } from 'swr'

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  fallback: {
    '/api/user': { name: 'Loading...' }
  }
}
```

### 用户体验
```typescript
// 加载状态管理
const useAsyncOperation = <T,>(
  operation: () => Promise<T>,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
    loadingText?: string
  } = {}
) => {
  const [state, setState] = useState<{
    loading: boolean
    data: T | null
    error: Error | null
  }>({
    loading: false,
    data: null,
    error: null
  })

  const execute = useCallback(async () => {
    setState({ loading: true, data: null, error: null })

    try {
      const result = await operation()
      setState({ loading: false, data: result, error: null })
      options.onSuccess?.(result)
    } catch (error) {
      const err = error as Error
      setState({ loading: false, data: null, error: err })
      options.onError?.(err)
    }
  }, [operation, options])

  return {
    ...state,
    execute,
    reset: () => setState({ loading: false, data: null, error: null })
  }
}

// 使用示例
const { loading, data, error, execute } = useAsyncOperation(
  () => connectWallet(),
  {
    onSuccess: (address) => toast.success(`Connected: ${address}`),
    onError: (error) => toast.error(`Connection failed: ${error.message}`),
    loadingText: 'Connecting wallet...'
  }
)
```

## 技术亮点

### 🎯 开箱即用
- **完整配置**: 预配置的开发环境
- **最佳实践**: 行业标准的代码结构
- **现代化技术**: 最新的 Web3 技术栈
- **生产就绪**: 可直接部署到生产环境

### ⚡ 高性能架构
- **服务端渲染**: Next.js 13+ App Router
- **静态生成**: 页面预渲染优化
- **增量更新**: 按需加载和更新
- **缓存优化**: 多层缓存策略

### 🔒 安全优先
- **类型安全**: TypeScript 严格模式
- **环境隔离**: 开发/生产环境分离
- **密钥管理**: 安全的 API 密钥管理
- **代码审计**: 定期安全代码审查

## 社区贡献

### 🤝 开源协作
- **模板更新**: 保持技术栈更新
- **功能扩展**: 添加新功能和组件
- **文档完善**: 完善使用文档和指南
- **问题修复**: 修复 bug 和性能问题

### 📈 项目数据
- **使用统计**: 模板使用情况统计
- **贡献者**: 社区贡献者数据
- **功能使用**: 各功能使用频率
- **用户反馈**: 用户反馈和建议

## 未来规划

- [ ] **更多模板**: 不同类型的项目模板
- [ ] **插件系统**: 可扩展的插件架构
- [ ] **多框架支持**: React, Vue, Svelte 等
- [ ] **云端集成**: Vercel, Netlify 等平台集成
- [ ] **AI 助手**: 智能代码生成和建议

## 相关链接

- **项目主页**: [github.com/BiscuitCoder/0xSpace.tech](https://github.com/BiscuitCoder/0xSpace.tech)
- **在线演示**: [0xSpace.tech/demo](https://0xSpace.tech/demo)
- **文档中心**: [docs.0xSpace.tech](https://docs.0xSpace.tech)
- **模板库**: [templates.0xSpace.tech](https://templates.0xSpace.tech)

---

*下一代 Web3 开发模板 - 开箱即用，功能完整，性能卓越* 🚀
