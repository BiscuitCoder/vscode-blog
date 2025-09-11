# Web3 钱包应用

## 项目概述

一个现代化的 Web3 钱包应用，支持多链钱包管理、NFT 展示和 DeFi 交互。采用 React + TypeScript + ethers.js 构建。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **区块链交互**: ethers.js + Web3Modal
- **UI 组件**: Tailwind CSS + Radix UI
- **状态管理**: Zustand
- **测试**: Jest + React Testing Library

## 核心功能

### 多链支持
- Ethereum 主网
- Polygon
- BSC
- Arbitrum

### 钱包连接
- MetaMask
- WalletConnect
- Coinbase Wallet
- Trust Wallet

### NFT 管理
- NFT 收藏展示
- 交易历史追踪
- 跨链转移

### DeFi 集成
- 代币交换
- 流动性挖矿
- 质押收益

## 技术亮点

### 1. 响应式设计
```typescript
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
```

### 2. 实时价格更新
```typescript
const useTokenPrice = (tokenAddress: string) => {
  const [price, setPrice] = useState<number>(0)

  useEffect(() => {
    const fetchPrice = async () => {
      const response = await fetch(`/api/price/${tokenAddress}`)
      const data = await response.json()
      setPrice(data.price)
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000) // 30秒更新一次
    return () => clearInterval(interval)
  }, [tokenAddress])

  return price
}
```

## 项目截图

![Web3 钱包界面](./wallet-screenshot.png)

## 部署方式

项目已部署到 Vercel，支持自动 CI/CD。

```bash
# 本地开发
npm run dev

# 构建生产版本
npm run build

# 部署
npm run deploy
```

## 访问地址

[https://web3-wallet.vercel.app](https://web3-wallet.vercel.app)

## 开源地址

[GitHub Repository](https://github.com/username/web3-wallet)

---

*最后更新: 2024年9月*
