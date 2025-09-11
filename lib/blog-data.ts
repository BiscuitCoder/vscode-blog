export interface BlogPost {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  path: string;
  lastModified: string;
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

export interface MenuItem {
  id: string;
  title: string;
  category: string;
  description: string;
}

export interface BlogConfig {
  posts: Record<string, BlogPost>;
  menu: {
    categories: string[];
    items: MenuItem[];
    groupedItems: Record<string, MenuItem[]>;
  };
  lastUpdated: string;
}

let configCache: BlogConfig | null = null;
let lastConfigCheck = 0;
const CONFIG_CHECK_INTERVAL = 5000; // 5秒检查一次

export async function loadBlogConfig(): Promise<BlogConfig> {
  // 在客户端环境中，我们需要通过 API 或者 public 文件夹来获取配置
  try {
    // 尝试从 public 文件夹获取配置文件
    const response = await fetch('/data/pageconfig.json');
    if (!response.ok) {
      throw new Error('Config file not found');
    }
    const config = await response.json();

    // 在开发环境下定期检查配置文件是否有更新
    if (process.env.NODE_ENV === 'development') {
      const now = Date.now();
      if (now - lastConfigCheck > CONFIG_CHECK_INTERVAL) {
        lastConfigCheck = now;
        configCache = null; // 重置缓存
      }
    }

    if (!configCache) {
      configCache = config;
    }

    return configCache!;
  } catch (error) {
    console.error('Failed to load blog config:', error);
    // 返回默认配置
    return {
      posts: {},
      menu: {
        categories: [],
        items: [],
        groupedItems: {}
      },
      lastUpdated: new Date().toISOString()
    };
  }
}

export async function getAllPosts(): Promise<Record<string, BlogPost>> {
  const config = await loadBlogConfig();
  return config.posts;
}

export async function getPost(id: string): Promise<BlogPost | null> {
  const config = await loadBlogConfig();
  return config.posts[id] || null;
}

// 获取包含内容的完整文章
export async function getPostWithContent(id: string): Promise<BlogPostWithContent | null> {
  const post = await getPost(id);
  if (!post) return null;

  try {
    // 从 public 路径读取文件内容
    const response = await fetch(post.path);
    if (!response.ok) {
      console.error(`Failed to load content for ${id}: ${response.status}`);
      return null;
    }
    const content = await response.text();

    return {
      ...post,
      content,
    };
  } catch (error) {
    console.error(`Error loading content for ${id}:`, error);
    return null;
  }
}

export async function getMenuCategories(): Promise<string[]> {
  const config = await loadBlogConfig();
  return config.menu.categories;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const config = await loadBlogConfig();
  return config.menu.items;
}

export async function getGroupedMenuItems(): Promise<Record<string, MenuItem[]>> {
  const config = await loadBlogConfig();
  return config.menu.groupedItems;
}

// 获取默认打开的文件
export async function getDefaultFiles(): Promise<string[]> {
  const posts = await getAllPosts();
  const postIds = Object.keys(posts);

  // 返回前两个文件作为默认打开的文件
  return postIds.slice(0, 2);
}

// 获取所有文章的ID列表
export async function getAllPostIds(): Promise<string[]> {
  const posts = await getAllPosts();
  return Object.keys(posts);
}

// 侧边栏数据结构
export interface SidebarItem {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: SidebarItem[];
  isOpen?: boolean;
}

// 将配置文件转换为侧边栏数据结构
export async function getSidebarData(): Promise<SidebarItem[]> {
  const config = await loadBlogConfig();
  const groupedItems = config.menu.groupedItems;

  const sidebarData: SidebarItem[] = [
    {
      id: "posts",
      name: "posts",
      type: "folder",
      isOpen: true,
      children: config.menu.categories.map(category => ({
        id: `category-${category.toLowerCase()}`,
        name: category,
        type: "folder" as const,
        isOpen: false,
        children: groupedItems[category]?.map(item => ({
          id: item.id,
          name: config.posts[item.id]?.name || `${item.id}.md`,
          type: "file" as const,
        })) || []
      }))
    }
  ];

  return sidebarData;
}
