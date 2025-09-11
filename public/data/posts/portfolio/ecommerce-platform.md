# 现代化电商平台

## 项目概述

基于微服务架构的全栈电商平台，支持商品管理、订单处理、支付集成和用户管理。采用前后端分离架构，提供完整的电商解决方案。

## 技术栈

### 前端技术栈
- **框架**: Next.js 14 + React 18 + TypeScript
- **状态管理**: Redux Toolkit + RTK Query
- **UI 组件**: Material-UI + Emotion
- **表单处理**: React Hook Form + Zod
- **支付集成**: Stripe + PayPal
- **图片处理**: Cloudinary

### 后端技术栈
- **框架**: NestJS + Node.js
- **数据库**: PostgreSQL + TypeORM
- **缓存**: Redis
- **消息队列**: RabbitMQ
- **API 文档**: Swagger
- **认证**: JWT + Passport

### 部署与 DevOps
- **容器化**: Docker + Docker Compose
- **编排**: Kubernetes
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack

## 核心功能

### 用户系统
- 用户注册和登录
- 个人资料管理
- 地址簿管理
- 订单历史查看

### 商品管理
- 商品分类和标签
- 商品搜索和过滤
- 商品详情页
- 商品评价系统

### 购物车和结算
- 购物车管理
- 优惠券系统
- 多地址选择
- 多种支付方式

### 订单管理
- 订单状态跟踪
- 订单历史
- 退换货处理
- 物流信息查询

### 管理员功能
- 商品和分类管理
- 用户和订单管理
- 数据统计和报表
- 系统配置管理

## 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   NestJS API    │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│                 │    │                 │    │                 │
│ - React SPA     │    │ - REST API      │    │ - Users         │
│ - TypeScript    │    │ - GraphQL API   │    │ - Products      │
│ - Material-UI   │    │ - Microservices │    │ - Orders        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Redis Cache   │    │   RabbitMQ      │    │   Cloudinary    │
│                 │    │   Queue         │    │   Images        │
│ - Session       │    │ - Email         │    │                 │
│ - API Cache     │    │ - Notifications │    │ - Product       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 技术亮点

### 1. 微服务架构设计
```typescript
// 商品服务
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cacheManager: Cache,
  ) {}

  async findAll(options: FindManyOptions<Product>) {
    const cacheKey = `products:${JSON.stringify(options)}`

    // 尝试从缓存获取
    const cached = await this.cacheManager.get(cacheKey)
    if (cached) return cached

    // 从数据库查询
    const products = await this.productRepository.find(options)

    // 写入缓存
    await this.cacheManager.set(cacheKey, products, 300) // 5分钟缓存

    return products
  }
}
```

### 2. 实时库存管理
```typescript
// 使用 Redis 实现分布式锁
@Injectable()
export class InventoryService {
  constructor(private redisService: RedisService) {}

  async decreaseStock(productId: string, quantity: number) {
    const lockKey = `lock:inventory:${productId}`

    // 获取分布式锁
    const lock = await this.redisService.acquireLock(lockKey, 5000)

    try {
      // 检查库存
      const currentStock = await this.getStock(productId)
      if (currentStock < quantity) {
        throw new Error('Insufficient stock')
      }

      // 扣减库存
      await this.updateStock(productId, currentStock - quantity)

      // 发送库存变更事件
      await this.eventEmitter.emit('inventory.changed', {
        productId,
        quantity,
        newStock: currentStock - quantity
      })

    } finally {
      // 释放锁
      await this.redisService.releaseLock(lockKey)
    }
  }
}
```

### 3. 支付系统集成
```typescript
// Stripe 支付集成
@Injectable()
export class PaymentService {
  constructor(private stripeService: StripeService) {}

  async createPaymentIntent(order: Order) {
    const paymentIntent = await this.stripeService.paymentIntents.create({
      amount: order.total * 100, // Stripe 使用分作为单位
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: order.userId
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object)
        break
    }
  }
}
```

### 4. 搜索引擎优化
```typescript
// Elasticsearch 集成
@Injectable()
export class SearchService {
  constructor(private elasticsearchService: ElasticsearchService) {}

  async indexProduct(product: Product) {
    await this.elasticsearchService.index({
      index: 'products',
      id: product.id,
      body: {
        name: product.name,
        description: product.description,
        category: product.category.name,
        price: product.price,
        tags: product.tags,
        createdAt: product.createdAt
      }
    })
  }

  async searchProducts(query: string, filters: any) {
    const { body } = await this.elasticsearchService.search({
      index: 'products',
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  fields: ['name^3', 'description^2', 'tags']
                }
              }
            ],
            filter: this.buildFilters(filters)
          }
        },
        sort: [
          { _score: 'desc' },
          { createdAt: 'desc' }
        ]
      }
    })

    return body.hits.hits.map(hit => hit._source)
  }
}
```

## 性能优化

### 1. 数据库优化
```sql
-- 创建复合索引
CREATE INDEX idx_products_category_price ON products (category_id, price);
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);

-- 分页查询优化
SELECT * FROM products
WHERE category_id = $1
ORDER BY price ASC
LIMIT $2 OFFSET $3;
```

### 2. CDN 和缓存策略
```typescript
// 图片懒加载和 CDN 优化
const OptimizedImage = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState(getPlaceholder(src))
  const [imageRef, isInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    if (isInView) {
      // 从 CDN 加载优化后的图片
      const optimizedSrc = getOptimizedImageUrl(src, {
        width: 400,
        height: 400,
        quality: 80,
        format: 'webp'
      })
      setImageSrc(optimizedSrc)
    }
  }, [isInView, src])

  return (
    <img
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      {...props}
    />
  )
}
```

### 3. 前端性能优化
```typescript
// 代码分割和懒加载
const ProductDetail = lazy(() => import('../components/ProductDetail'))
const Checkout = lazy(() => import('../components/Checkout'))

const App = () => (
  <Suspense fallback={<PageSkeleton />}>
    <Routes>
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  </Suspense>
)
```

## 部署配置

### Docker Compose 配置
```yaml
version: '3.8'

services:
  ecommerce-frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - api-gateway

  api-gateway:
    build: ./api-gateway
    ports:
      - "3001:3001"
    depends_on:
      - product-service
      - user-service
      - order-service

  product-service:
    build: ./services/product
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/ecommerce
    depends_on:
      - postgres

  user-service:
    build: ./services/user
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  order-service:
    build: ./services/order
    environment:
      - RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
    depends_on:
      - rabbitmq

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=ecommerce
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "15672:15672"

volumes:
  postgres_data:
  redis_data:
```

## 监控和日志

### 应用监控
```typescript
// Prometheus 指标收集
import { collectDefaultMetrics } from 'prom-client'

collectDefaultMetrics()

app.get('/metrics', async (req, res) => {
  const metrics = await register.metrics()
  res.set('Content-Type', register.contentType)
  res.end(metrics)
})
```

### 错误追踪
```typescript
// Sentry 错误追踪
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
```

## 访问地址

[https://ecommerce-platform.vercel.app](https://ecommerce-platform.vercel.app)

## 开源地址

[GitHub Repository](https://github.com/username/ecommerce-platform)

---

*最后更新: 2024年9月*
