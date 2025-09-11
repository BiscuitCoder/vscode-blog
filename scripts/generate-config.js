#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'public', 'data', 'posts');
const PUBLIC_CONFIG_FILE = path.join(__dirname, '..', 'public', 'data', 'pageconfig.json');

function extractTitle(content) {
    const lines = content.split('\n');
    for (const line of lines) {
        if (line.startsWith('# ')) {
            return line.substring(2).trim();
        }
    }
    return 'Untitled';
}

function extractDescription(content) {
    const lines = content.split('\n');
    const descriptionLines = [];

    for (const line of lines) {
        if (line.startsWith('# ')) continue;
        if (line.startsWith('## ')) continue;
        if (line.trim() === '') continue;
        if (line.startsWith('- ') || line.startsWith('##')) break;

        descriptionLines.push(line);
        if (descriptionLines.length >= 3) break;
    }

    return descriptionLines.join(' ').substring(0, 200) + '...';
}


function generateConfig() {
    const config = {
        posts: {},
        menu: {
            categories: [],
            items: []
        },
        lastUpdated: new Date().toISOString()
    };

    try {
        // 获取所有子目录（分类）
        const categories = fs.readdirSync(POSTS_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .sort();

        let totalFiles = 0;

        for (const category of categories) {
            const categoryPath = path.join(POSTS_DIR, category);

            // 获取该分类下的所有 .md 文件
            const files = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.md'))
                .sort();

            for (const file of files) {
                const filePath = path.join(categoryPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const id = path.basename(file, '.md');

                const title = extractTitle(content);
                const description = extractDescription(content);

                // 使用目录名作为分类，格式化为标题样式
                const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

                config.posts[id] = {
                    id,
                    name: file,
                    title,
                    description,
                    category: categoryTitle,
                    path: `/data/posts/${category}/${file}`,
                    lastModified: fs.statSync(filePath).mtime.toISOString()
                };

                config.menu.items.push({
                    id,
                    title,
                    category: categoryTitle,
                    description
                });

                totalFiles++;
            }
        }

        config.menu.categories = categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1));

        // 按分类分组菜单项
        config.menu.groupedItems = {};
        config.menu.categories.forEach(category => {
            config.menu.groupedItems[category] = config.menu.items
                .filter(item => item.category === category)
                .sort((a, b) => a.title.localeCompare(b.title));
        });

        // 只在 public 目录生成配置文件供客户端访问
        fs.writeFileSync(PUBLIC_CONFIG_FILE, JSON.stringify(config, null, 2));

        console.log(`✅ 配置已生成: ${PUBLIC_CONFIG_FILE}`);
        console.log(`📊 处理了 ${totalFiles} 个文件，包含 ${categories.length} 个分类`);
        console.log(`📁 分类目录: ${categories.join(', ')}`);
        console.log(`🚀 配置文件已优化：直接从 public/data/posts 读取文件`);

    } catch (error) {
        console.error('❌ 生成配置时出错:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    generateConfig();
}

module.exports = { generateConfig };