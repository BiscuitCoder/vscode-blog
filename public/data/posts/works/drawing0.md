# Drawing0 - 在线绘画和设计工具

## 项目概述

Drawing0 是一个功能强大的在线绘画和设计工具，基于 HTML5 Canvas 技术构建。项目提供了丰富的绘画工具、特效处理和导出功能，为用户提供专业级的数字绘画体验。支持多种画笔效果、图层管理、滤镜处理等高级功能。

## 核心功能

### 🎨 绘画工具
- **多种画笔**: 铅笔、钢笔、马克笔、喷枪等
- **形状工具**: 矩形、圆形、线条、多边形
- **选择工具**: 矩形选择、魔棒选择、套索选择
- **填充工具**: 油漆桶填充、渐变填充

### 📱 图层管理
- **图层创建**: 新建、复制、删除图层
- **图层顺序**: 图层上下移动和排序
- **图层透明度**: 不透明度调节
- **图层混合模式**: 多种混合模式支持

### ✨ 特效处理
- **滤镜效果**: 模糊、锐化、对比度、亮度调节
- **颜色调整**: 色相、饱和度、亮度调节
- **艺术效果**: 油画、马赛克、浮雕等艺术滤镜
- **自定义滤镜**: 支持用户自定义滤镜脚本

## 技术架构

### 前端技术栈
```typescript
// React 18 + TypeScript
├── components/
│   ├── canvas/
│   │   ├── DrawingCanvas.tsx     // 主画布组件
│   │   ├── Toolbar.tsx           // 工具栏
│   │   ├── LayerPanel.tsx        // 图层面板
│   │   ├── ColorPicker.tsx       // 颜色选择器
│   │   └── BrushSettings.tsx     // 画笔设置
│   ├── tools/
│   │   ├── BrushTool.tsx         // 画笔工具
│   │   ├── ShapeTool.tsx         // 形状工具
│   │   ├── SelectionTool.tsx     // 选择工具
│   │   └── TextTool.tsx          // 文字工具
│   ├── effects/
│   │   ├── FilterPanel.tsx       // 滤镜面板
│   │   ├── AdjustmentPanel.tsx   // 调整面板
│   │   └── EffectPreview.tsx     // 效果预览
│   └── ui/
│       ├── Button.tsx           // 通用按钮
│       ├── Slider.tsx           // 滑块控件
│       └── Modal.tsx            // 模态框

// 核心引擎
├── lib/
│   ├── canvas/
│   │   ├── CanvasEngine.ts      // 画布引擎
│   │   ├── LayerManager.ts      // 图层管理器
│   │   ├── ToolManager.ts       // 工具管理器
│   │   └── HistoryManager.ts    // 历史记录管理器
│   ├── tools/
│   │   ├── BrushEngine.ts       // 画笔引擎
│   │   ├── ShapeEngine.ts       // 形状引擎
│   │   ├── SelectionEngine.ts   // 选择引擎
│   │   └── TextEngine.ts        // 文字引擎
│   ├── effects/
│   │   ├── FilterEngine.ts      // 滤镜引擎
│   │   ├── ColorEngine.ts       // 颜色引擎
│   │   └── BlendEngine.ts       // 混合引擎
│   └── utils/
│       ├── geometry.ts          // 几何计算
│       ├── color.ts             // 颜色处理
│       └── file.ts              // 文件处理
```

### 核心技术
- **React 18**: 最新 React 特性支持
- **TypeScript**: 完整的类型安全
- **HTML5 Canvas**: 高性能 2D 绘图
- **WebGL**: 硬件加速的 3D 渲染
- **Fabric.js**: 强大的 Canvas 库
- **Konva.js**: 交互式 2D Canvas 库
- **File API**: 文件上传和导出

## 画布引擎

### Canvas 核心架构
```typescript
// 画布引擎类
class CanvasEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private layers: Layer[] = []
  private activeLayer: Layer | null = null
  private tools: Map<string, Tool> = new Map()
  private history: HistoryManager

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement
    this.ctx = canvasElement.getContext('2d')!
    this.history = new HistoryManager()
    this.initializeTools()
    this.setupEventListeners()
  }

  // 初始化工具
  private initializeTools(): void {
    this.tools.set('brush', new BrushTool(this))
    this.tools.set('eraser', new EraserTool(this))
    this.tools.set('rectangle', new RectangleTool(this))
    this.tools.set('circle', new CircleTool(this))
    this.tools.set('text', new TextTool(this))
  }

  // 设置事件监听器
  private setupEventListeners(): void {
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this))
  }

  // 鼠标按下事件
  private handleMouseDown(event: MouseEvent): void {
    const point = this.getMousePosition(event)
    const activeTool = this.tools.get(this.activeToolName)

    if (activeTool) {
      activeTool.onMouseDown(point)
      this.history.saveState()
    }
  }

  // 获取鼠标位置
  private getMousePosition(event: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  // 渲染所有图层
  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.layers.forEach(layer => {
      if (layer.visible) {
        this.ctx.globalAlpha = layer.opacity
        this.ctx.globalCompositeOperation = layer.blendMode
        layer.render(this.ctx)
      }
    })
  }

  // 添加图层
  public addLayer(layer: Layer): void {
    this.layers.push(layer)
    this.activeLayer = layer
    this.render()
  }

  // 删除图层
  public removeLayer(layerId: string): void {
    const index = this.layers.findIndex(layer => layer.id === layerId)
    if (index !== -1) {
      this.layers.splice(index, 1)
      this.render()
    }
  }
}
```

### 图层系统
```typescript
// 图层类
class Layer {
  public id: string
  public name: string
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public visible: boolean = true
  public opacity: number = 1.0
  public blendMode: GlobalCompositeOperation = 'source-over'
  public objects: CanvasObject[] = []

  constructor(width: number, height: number) {
    this.id = generateId()
    this.name = `Layer ${this.id}`
    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext('2d')!
  }

  // 添加对象
  public addObject(obj: CanvasObject): void {
    this.objects.push(obj)
    this.render()
  }

  // 删除对象
  public removeObject(objId: string): void {
    const index = this.objects.findIndex(obj => obj.id === objId)
    if (index !== -1) {
      this.objects.splice(index, 1)
      this.render()
    }
  }

  // 渲染图层
  public render(targetCtx?: CanvasRenderingContext2D): void {
    const ctx = targetCtx || this.ctx

    if (!targetCtx) {
      // 清除图层画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    // 渲染所有对象
    this.objects.forEach(obj => {
      obj.render(ctx)
    })
  }
}
```

### 工具系统
```typescript
// 工具基类
abstract class Tool {
  protected canvas: CanvasEngine
  protected isActive: boolean = false

  constructor(canvas: CanvasEngine) {
    this.canvas = canvas
  }

  // 鼠标按下
  abstract onMouseDown(point: Point): void

  // 鼠标移动
  abstract onMouseMove(point: Point): void

  // 鼠标释放
  abstract onMouseUp(point: Point): void

  // 激活工具
  public activate(): void {
    this.isActive = true
  }

  // 停用工具
  public deactivate(): void {
    this.isActive = false
  }
}

// 画笔工具实现
class BrushTool extends Tool {
  private path: Point[] = []
  private brushSize: number = 5
  private brushColor: string = '#000000'

  public onMouseDown(point: Point): void {
    this.path = [point]
  }

  public onMouseMove(point: Point): void {
    if (this.path.length > 0) {
      this.path.push(point)
      this.drawPath()
    }
  }

  public onMouseUp(point: Point): void {
    if (this.path.length > 1) {
      const brushStroke = new BrushStroke(this.path, this.brushSize, this.brushColor)
      this.canvas.getActiveLayer()?.addObject(brushStroke)
    }
    this.path = []
  }

  private drawPath(): void {
    const ctx = this.canvas.getContext()
    ctx.strokeStyle = this.brushColor
    ctx.lineWidth = this.brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(this.path[0].x, this.path[0].y)

    for (let i = 1; i < this.path.length; i++) {
      ctx.lineTo(this.path[i].x, this.path[i].y)
    }

    ctx.stroke()
  }
}
```

## 特效处理

### 滤镜引擎
```typescript
// 滤镜基类
abstract class Filter {
  abstract apply(imageData: ImageData): ImageData
}

// 模糊滤镜
class BlurFilter extends Filter {
  private radius: number

  constructor(radius: number = 5) {
    super()
    this.radius = radius
  }

  public apply(imageData: ImageData): ImageData {
    const { data, width, height } = imageData
    const output = new ImageData(width, height)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        const neighbors = this.getNeighbors(data, width, height, x, y, this.radius)

        // 计算平均值
        let r = 0, g = 0, b = 0, a = 0
        neighbors.forEach(neighbor => {
          r += neighbor.r
          g += neighbor.g
          b += neighbor.b
          a += neighbor.a
        })

        const count = neighbors.length
        output.data[index] = r / count     // Red
        output.data[index + 1] = g / count // Green
        output.data[index + 2] = b / count // Blue
        output.data[index + 3] = a / count // Alpha
      }
    }

    return output
  }

  private getNeighbors(data: Uint8ClampedArray, width: number, height: number, x: number, y: number, radius: number) {
    const neighbors = []

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx
        const ny = y + dy

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const index = (ny * width + nx) * 4
          neighbors.push({
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
          })
        }
      }
    }

    return neighbors
  }
}
```

### 颜色调整
```typescript
// 颜色调整类
class ColorAdjustment {
  private brightness: number = 0
  private contrast: number = 0
  private saturation: number = 0
  private hue: number = 0

  constructor(options: {
    brightness?: number
    contrast?: number
    saturation?: number
    hue?: number
  } = {}) {
    this.brightness = options.brightness || 0
    this.contrast = options.contrast || 0
    this.saturation = options.saturation || 0
    this.hue = options.hue || 0
  }

  public apply(imageData: ImageData): ImageData {
    const { data, width, height } = imageData
    const output = new ImageData(width, height)

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]
      const a = data[i + 3]

      // 亮度调整
      r = this.adjustBrightness(r, this.brightness)
      g = this.adjustBrightness(g, this.brightness)
      b = this.adjustBrightness(b, this.brightness)

      // 对比度调整
      r = this.adjustContrast(r, this.contrast)
      g = this.adjustContrast(g, this.contrast)
      b = this.adjustContrast(b, this.contrast)

      // 饱和度调整
      const hsl = this.rgbToHsl(r, g, b)
      hsl[1] = Math.max(0, Math.min(1, hsl[1] + this.saturation / 100))
      const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2])
      r = rgb[0]
      g = rgb[1]
      b = rgb[2]

      // 色相调整
      const hslHue = this.rgbToHsl(r, g, b)
      hslHue[0] = (hslHue[0] + this.hue / 360) % 1
      const rgbHue = this.hslToRgb(hslHue[0], hslHue[1], hslHue[2])
      r = rgbHue[0]
      g = rgbHue[1]
      b = rgbHue[2]

      output.data[i] = r
      output.data[i + 1] = g
      output.data[i + 2] = b
      output.data[i + 3] = a
    }

    return output
  }

  private adjustBrightness(value: number, adjustment: number): number {
    return Math.max(0, Math.min(255, value + adjustment))
  }

  private adjustContrast(value: number, adjustment: number): number {
    const factor = (259 * (adjustment + 255)) / (255 * (259 - adjustment))
    return Math.max(0, Math.min(255, factor * (value - 128) + 128))
  }

  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return [h, s, l]
  }

  private hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r: number, g: number, b: number

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }
}
```

## 项目结构

```
drawing0/
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── DrawingCanvas.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   ├── LayerPanel.tsx
│   │   │   └── ColorPicker.tsx
│   │   ├── tools/
│   │   │   ├── BrushTool.tsx
│   │   │   ├── ShapeTool.tsx
│   │   │   └── SelectionTool.tsx
│   │   └── effects/
│   │       ├── FilterPanel.tsx
│   │       └── AdjustmentPanel.tsx
│   ├── lib/
│   │   ├── canvas/
│   │   │   ├── CanvasEngine.ts
│   │   │   ├── LayerManager.ts
│   │   │   └── ToolManager.ts
│   │   ├── tools/
│   │   │   ├── BrushEngine.ts
│   │   │   └── ShapeEngine.ts
│   │   ├── effects/
│   │   │   ├── FilterEngine.ts
│   │   │   └── ColorEngine.ts
│   │   └── utils/
│   │       ├── geometry.ts
│   │       └── color.ts
│   ├── types/
│   │   ├── canvas.ts
│   │   ├── tools.ts
│   │   └── effects.ts
│   └── hooks/
│       ├── useCanvas.ts
│       ├── useTools.ts
│       └── useEffects.ts
├── public/
│   ├── icons/
│   │   ├── brush.svg
│   │   ├── shapes.svg
│   │   └── effects.svg
│   └── presets/
│       ├── brushes.json
│       └── filters.json
└── styles/
    ├── canvas.css
    ├── toolbar.css
    └── animations.css
```

## 高级功能

### 实时协作
```typescript
// WebSocket 协作
class CollaborationManager {
  private socket: WebSocket
  private canvas: CanvasEngine

  constructor(canvas: CanvasEngine, roomId: string) {
    this.canvas = canvas
    this.socket = new WebSocket(`ws://localhost:8080/room/${roomId}`)
    this.setupSocketListeners()
  }

  private setupSocketListeners(): void {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      switch (data.type) {
        case 'DRAW':
          this.handleRemoteDraw(data.payload)
          break
        case 'LAYER_UPDATE':
          this.handleLayerUpdate(data.payload)
          break
        case 'TOOL_CHANGE':
          this.handleToolChange(data.payload)
          break
      }
    }
  }

  private handleRemoteDraw(payload: any): void {
    // 处理远程绘画数据
    const { tool, points, color, size } = payload
    this.canvas.drawWithTool(tool, points, { color, size })
  }

  public sendDrawData(tool: string, points: Point[], options: any): void {
    const message = {
      type: 'DRAW',
      payload: { tool, points, ...options }
    }
    this.socket.send(JSON.stringify(message))
  }
}
```

### 插件系统
```typescript
// 插件接口
interface Plugin {
  name: string
  version: string
  author: string

  // 插件生命周期
  onLoad(): void
  onUnload(): void

  // 工具扩展
  registerTools(): Tool[]

  // 滤镜扩展
  registerFilters(): Filter[]

  // UI 扩展
  registerUI(): React.Component
}

// 插件管理器
class PluginManager {
  private plugins: Map<string, Plugin> = new Map()

  public loadPlugin(plugin: Plugin): void {
    plugin.onLoad()
    this.plugins.set(plugin.name, plugin)

    // 注册插件提供的工具和滤镜
    const tools = plugin.registerTools()
    const filters = plugin.registerFilters()

    tools.forEach(tool => this.registerTool(tool))
    filters.forEach(filter => this.registerFilter(filter))
  }

  public unloadPlugin(pluginName: string): void {
    const plugin = this.plugins.get(pluginName)
    if (plugin) {
      plugin.onUnload()
      this.plugins.delete(pluginName)
    }
  }
}
```

## 性能优化

### Canvas 优化
```typescript
// Canvas 渲染优化
class OptimizedCanvas {
  private offscreenCanvas: OffscreenCanvas
  private offscreenCtx: OffscreenCanvasRenderingContext2D
  private mainCanvas: HTMLCanvasElement
  private mainCtx: CanvasRenderingContext2D

  constructor(width: number, height: number) {
    // 创建离屏画布
    this.offscreenCanvas = new OffscreenCanvas(width, height)
    this.offscreenCtx = this.offscreenCanvas.getContext('2d')!

    // 主画布
    this.mainCanvas = document.createElement('canvas')
    this.mainCanvas.width = width
    this.mainCanvas.height = height
    this.mainCtx = this.mainCanvas.getContext('2d')!
  }

  // 批量渲染
  public batchRender(objects: CanvasObject[]): void {
    // 在离屏画布上渲染
    this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)

    objects.forEach(obj => {
      obj.render(this.offscreenCtx)
    })

    // 一次性绘制到主画布
    this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
    this.mainCtx.drawImage(this.offscreenCanvas, 0, 0)
  }

  // 区域渲染
  public renderRegion(objects: CanvasObject[], region: Rect): void {
    // 只渲染指定区域
    const { x, y, width, height } = region

    this.offscreenCtx.clearRect(x, y, width, height)

    objects.forEach(obj => {
      if (this.intersectsRegion(obj, region)) {
        obj.render(this.offscreenCtx)
      }
    })

    // 只更新变化的区域
    this.mainCtx.clearRect(x, y, width, height)
    this.mainCtx.drawImage(
      this.offscreenCanvas,
      x, y, width, height,
      x, y, width, height
    )
  }

  private intersectsRegion(obj: CanvasObject, region: Rect): boolean {
    const objBounds = obj.getBounds()
    return !(objBounds.x + objBounds.width < region.x ||
             region.x + region.width < objBounds.x ||
             objBounds.y + objBounds.height < region.y ||
             region.y + region.height < objBounds.y)
  }
}
```

### 内存管理
```typescript
// 内存管理器
class MemoryManager {
  private cache: Map<string, ImageBitmap> = new Map()
  private maxCacheSize: number = 50 * 1024 * 1024 // 50MB

  public async loadImage(url: string): Promise<ImageBitmap> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!
    }

    const response = await fetch(url)
    const blob = await response.blob()
    const bitmap = await createImageBitmap(blob)

    // 检查缓存大小
    if (this.getCacheSize() + bitmap.width * bitmap.height * 4 > this.maxCacheSize) {
      this.evictOldEntries()
    }

    this.cache.set(url, bitmap)
    return bitmap
  }

  private getCacheSize(): number {
    let totalSize = 0
    this.cache.forEach(bitmap => {
      totalSize += bitmap.width * bitmap.height * 4 // RGBA
    })
    return totalSize
  }

  private evictOldEntries(): void {
    // LRU 策略清理缓存
    const entries = Array.from(this.cache.entries())
    const toRemove = Math.floor(entries.length * 0.2) // 清理 20%

    for (let i = 0; i < toRemove; i++) {
      const [url] = entries[i]
      this.cache.delete(url)
    }
  }
}
```

## 部署配置

### 构建优化
```javascript
// webpack 配置优化
const config = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        canvas: {
          test: /[\\/]node_modules[\\/](fabric|konva)[\\/]/,
          name: 'canvas-vendor',
          chunks: 'all',
        },
        effects: {
          test: /[\\/]lib[\\/]effects[\\/]/,
          name: 'effects',
          chunks: 'all',
        },
      },
    },
  },
  experiments: {
    topLevelAwait: true,
  },
}
```

### CDN 配置
```typescript
// 资源 CDN 配置
const CDN_CONFIG = {
  images: 'https://cdn.drawing0.com/images/',
  fonts: 'https://cdn.drawing0.com/fonts/',
  presets: 'https://cdn.drawing0.com/presets/',
}

// 动态加载资源
export const loadResource = async (type: keyof typeof CDN_CONFIG, name: string) => {
  const baseUrl = CDN_CONFIG[type]
  const url = `${baseUrl}${name}`

  switch (type) {
    case 'images':
      return await loadImage(url)
    case 'fonts':
      return await loadFont(url)
    case 'presets':
      return await loadPreset(url)
  }
}
```

## 扩展功能

### 🔌 插件生态
- **工具插件**: 自定义画笔和形状工具
- **滤镜插件**: 专业级图像处理滤镜
- **导出插件**: 支持多种文件格式导出
- **主题插件**: 自定义界面主题

### 📊 数据分析
- **使用统计**: 用户绘画行为分析
- **性能监控**: 画布渲染性能监控
- **错误追踪**: 异常情况自动上报
- **用户反馈**: 内置反馈收集系统

### 🌐 云端同步
- **自动保存**: 云端自动保存作品
- **版本控制**: 作品历史版本管理
- **跨设备同步**: 多设备作品同步
- **分享功能**: 作品在线分享

## 最佳实践

### 代码组织
```typescript
// 模块化架构
├── core/           # 核心引擎
│   ├── CanvasEngine.ts
│   ├── ToolManager.ts
│   └── HistoryManager.ts
├── tools/          # 工具模块
│   ├── base/
│   │   └── Tool.ts
│   ├── drawing/
│   │   └── BrushTool.ts
│   └── selection/
│       └── SelectionTool.ts
├── effects/        # 特效模块
│   ├── base/
│   │   └── Effect.ts
│   ├── filters/
│   │   └── BlurFilter.ts
│   └── adjustments/
│       └── BrightnessAdjustment.ts
├── ui/            # 用户界面
│   ├── components/
│   │   ├── Toolbar.tsx
│   │   └── LayerPanel.tsx
│   └── dialogs/
│       └── ExportDialog.tsx
└── utils/         # 工具函数
    ├── geometry.ts
    ├── color.ts
    └── file.ts
```

### 测试策略
```typescript
// Canvas 功能测试
describe('CanvasEngine', () => {
  let canvas: CanvasEngine
  let mockCanvas: HTMLCanvasElement

  beforeEach(() => {
    mockCanvas = document.createElement('canvas')
    mockCanvas.width = 800
    mockCanvas.height = 600
    canvas = new CanvasEngine(mockCanvas)
  })

  describe('Layer Management', () => {
    it('should add a new layer', () => {
      const layer = canvas.addLayer()
      expect(canvas.getLayers()).toContain(layer)
    })

    it('should remove a layer', () => {
      const layer = canvas.addLayer()
      canvas.removeLayer(layer.id)
      expect(canvas.getLayers()).not.toContain(layer)
    })
  })

  describe('Tool System', () => {
    it('should switch active tool', () => {
      canvas.setActiveTool('brush')
      expect(canvas.getActiveTool()).toBe('brush')
    })

    it('should handle mouse events', () => {
      const mockEvent = {
        clientX: 100,
        clientY: 100,
        preventDefault: jest.fn()
      }

      canvas.handleMouseDown(mockEvent)
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })
  })
})
```

### 性能监控
```typescript
// 性能监控工具
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  public startMeasurement(name: string): void {
    this.metrics.set(name, [performance.now()])
  }

  public endMeasurement(name: string): number {
    const measurements = this.metrics.get(name)
    if (!measurements) return 0

    const duration = performance.now() - measurements[0]
    measurements.push(duration)

    // 保留最近10次测量
    if (measurements.length > 10) {
      measurements.shift()
    }

    return duration
  }

  public getAverageTime(name: string): number {
    const measurements = this.metrics.get(name)
    if (!measurements || measurements.length < 2) return 0

    const sum = measurements.slice(1).reduce((a, b) => a + b, 0)
    return sum / (measurements.length - 1)
  }

  public logMetrics(): void {
    console.group('Performance Metrics')
    this.metrics.forEach((measurements, name) => {
      if (measurements.length > 1) {
        const avg = this.getAverageTime(name)
        console.log(`${name}: ${avg.toFixed(2)}ms (avg)`)
      }
    })
    console.groupEnd()
  }
}
```

## 技术亮点

### 🎨 创新交互
- **流畅绘画体验**: 60fps 的实时渲染
- **智能工具**: AI 辅助的绘画建议
- **手势支持**: 触屏设备的多点触控
- **语音控制**: 语音命令控制工具

### ⚡ 高性能架构
- **WebGL 加速**: GPU 加速的图形渲染
- **多线程处理**: Web Workers 处理复杂计算
- **内存优化**: 智能的内存管理和垃圾回收
- **网络优化**: 增量加载和资源预取

### 🔒 安全与隐私
- **本地存储**: 作品保存在本地
- **隐私保护**: 不收集用户绘画数据
- **安全导出**: 安全的文件导出机制
- **权限控制**: 摄像头和麦克风权限管理

## 社区贡献

### 🤝 开源协作
- **插件开发**: 第三方插件开发指南
- **主题定制**: 社区主题分享平台
- **教程创作**: 用户教程和技巧分享
- **功能投票**: 社区功能需求投票

### 📈 项目活跃度
- **用户增长**: 月活跃用户统计
- **插件下载**: 插件下载量排行
- **社区讨论**: GitHub Discussions 活跃度
- **贡献者**: 社区贡献者增长统计

## 未来规划

- [ ] **AI 绘画助手**: 集成 AI 绘画功能
- [ ] **3D 建模**: 2D 向 3D 绘画扩展
- [ ] **VR 支持**: 虚拟现实绘画体验
- [ ] **云协作**: 实时多人协作绘画
- [ ] **移动应用**: 原生移动端应用

## 相关链接

- **项目主页**: [github.com/BiscuitCoder/drawing0](https://github.com/BiscuitCoder/drawing0)
- **在线演示**: [drawing0.vercel.app](https://drawing0.vercel.app)
- **插件市场**: [plugins.drawing0.dev](https://plugins.drawing0.dev)
- **文档中心**: [docs.drawing0.dev](https://docs.drawing0.dev)

---

*释放你的创造力 - 下一代在线绘画工具* 🎨
