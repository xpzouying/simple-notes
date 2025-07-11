# Simple Notes

一个轻量级的 macOS 菜单栏笔记应用，使用 Tauri 和 React 构建，支持 Markdown 格式和 GitHub Gist 同步。

## 功能特性

- 🖊️ **Markdown 编辑器** - 支持 Markdown 格式编写，实时预览
- ☁️ **GitHub Gist 同步** - 自动同步笔记到私有 GitHub Gist
- 🎨 **简洁界面** - 使用 shadcn/ui 组件的极简设计
- 🌓 **深色模式** - 根据系统偏好自动切换深色模式
- 📌 **快速访问** - 常驻菜单栏，随时快速访问

## 安装

### 系统要求

- macOS 10.15 或更高版本
- Rust（最新稳定版）
- Node.js 16+
- GitHub Personal Access Token（用于 Gist 同步）

### 从 Releases 下载

从 [Releases 页面](https://github.com/xpzouying/simple-notes/releases) 下载最新版本。

**macOS 用户注意事项**：如果遇到 "Simple Notes 已损坏，无法打开" 的错误，这是由于 macOS Gatekeeper 安全机制导致的。解决方法：

1. 打开终端
2. 导航到包含应用的文件夹
3. 运行以下命令：
   ```bash
   xattr -cr "Simple Notes.app"
   ```
4. 再次尝试打开应用

或者，您也可以在系统偏好设置中允许该应用：
- 前往 系统偏好设置 > 安全性与隐私 > 通用
- 点击被阻止的应用信息旁边的"仍要打开"

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/xpzouying/simple-notes.git
cd simple-notes

# 安装依赖
npm install

# 构建应用
npm run tauri build

# 应用程序将在 src-tauri/target/release/bundle/ 目录中
```

## 使用方法

1. 点击菜单栏图标打开笔记面板
2. 点击"Edit"开始编写
3. 点击"Save"同步到 GitHub Gist
4. 通过设置按钮配置 GitHub token

### GitHub Token 设置

1. 访问 [GitHub Settings > Tokens](https://github.com/settings/tokens/new?scopes=gist)
2. 创建一个具有"gist"权限的新 token
3. 复制 token 并粘贴到应用的设置中

## 开发

```bash
# 安装依赖
npm install

# 开发模式运行
npm run tauri dev

# 生产构建
npm run tauri build
```

## 技术栈

- **前端**: React, TypeScript, Tailwind CSS, shadcn/ui
- **后端**: Tauri 2.0, Rust
- **存储**: GitHub Gist API
- **编辑器**: React Markdown

## 许可证

MIT License

## 作者

[xpzouying](https://haha.ai)