# Next.js 开发指南

## App Router

Next.js 13 引入了新的 App Router，基于 React Server Components。

### 文件结构

```
app/
  layout.tsx      # 根布局
  page.tsx        # 首页
  about/
    page.tsx      # /about 页面
  blog/
    page.tsx      # /blog 页面
    [slug]/
      page.tsx    # /blog/[slug] 动态路由
```

### 服务端组件

```typescript
// app/page.tsx
async function HomePage() {
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();

  return (
    <div>
      <h1>博客文章</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

export default HomePage;
```

### 客户端组件

```typescript
'use client'

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      点击次数: {count}
    </button>
  );
}

export default Counter;
```

## 数据获取

### Server Actions

```typescript
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // 保存到数据库
  await savePost({ title, content });

  redirect('/blog');
}
```

Next.js 提供了强大的全栈开发能力！
