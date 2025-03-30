# 咖啡冲泡指南 (Brew Guide)

一个现代化的咖啡冲泡助手应用，帮助咖啡爱好者记录和优化他们的冲泡过程。

![版本](https://img.shields.io/badge/版本-1.0.8-blue)

## 功能特点

-   🧰 多种冲泡滤杯支持 (V60, 聪明杯等)
-   📋 丰富的冲泡方案库
-   ⏱️ 精确的冲泡计时器
-   📊 可视化注水过程
-   📝 详细的冲泡记录
-   🔄 自定义冲泡方案
-   🌓 深色/浅色模式

## 开发指南

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 版本更新

当需要更新应用版本时，使用以下命令：

```bash
npm run update-version <新版本号>
```

例如，更新到版本 1.0.9：
```bash
npm run update-version 1.0.9
```

该命令会自动更新：
- package.json 中的版本号
- lib/config.ts 中的 APP_VERSION
- Android 应用版本号

> 注意：iOS 版本号需要在 Xcode 中手动更新

## 使用指南

1. 在首页选择您的冲泡滤杯（如 V60、聪明杯等）
2. 选择合适的冲泡方案或创建自定义方案
3. 按照指导进行注水操作
4. 记录您的冲泡体验和口感评价

## 技术栈

-   [Next.js 15](https://nextjs.org/) - React 框架
-   [React 19](https://react.dev/) - 用户界面库
-   [Tailwind CSS 4](https://tailwindcss.com/) - 样式解决方案
-   [Framer Motion](https://www.framer.com/motion/) - 动画库
-   [TypeScript](https://www.typescriptlang.org/) - 类型安全
-   [Capacitor](https://capacitorjs.com/) - 跨平台应用开发

## 贡献

欢迎提交问题和功能请求！如果您想贡献代码，请先开一个 issue 讨论您想要更改的内容。

## 许可

[MIT](https://choosealicense.com/licenses/mit/)

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
