# Brew Guide - 咖啡师的得力助手

一个优雅、功能丰富的咖啡萃取指南应用，帮助您记录咖啡豆信息、冲泡参数和咖啡风味。提供咖啡师专业级的计时器、咖啡知识分享和个性化推荐。

## 功能特性

- **咖啡豆管理**：记录咖啡豆信息，包括产地、处理法、烘焙度等
- **冲煮指南**：支持多种萃取方法，包括V60、爱乐压、虹吸壶等
- **计时器**：专业级分阶段咖啡冲泡计时器
- **冲煮日志**：记录每次冲泡的参数和结果
- **咖啡AI助手**：根据咖啡豆特性智能推荐冲泡参数

## UI/UX 特性

### 滑动手势支持

本应用集成了丰富的滑动手势支持，提供类似原生应用的交互体验：

- **边缘滑动返回**：从屏幕左侧边缘右滑返回上一页
- **模态框滑动关闭**：在模态框中右滑关闭
- **触感反馈**：滑动时提供触觉反馈增强体验

详细文档请查看 [docs/SwipeGestures.md](docs/SwipeGestures.md)

### 主题切换

应用支持亮色/暗色模式自动切换，也可手动设置

### 无缝动画

使用 Framer Motion 提供流畅的页面过渡和元素动画

## 技术栈

- **框架**: Next.js 15 (App Router)
- **移动端**: Capacitor
- **状态管理**: React Hooks
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **存储**: LocalStorage 和 IndexedDB
- **部署**: Vercel / PWA / 原生应用

## 开发指南

### 安装依赖

```bash
# 安装项目依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建原生应用

```bash
# 构建 Web 应用
npm run build

# 同步到 Capacitor
npx cap sync

# 打开 iOS 项目
npx cap open ios

# 打开 Android 项目
npx cap open android
```

## 贡献指南

欢迎提交问题和功能请求，或通过 Pull Requests 参与贡献。

## 许可证

本项目采用 MIT 许可证 