# 滑动手势指南

本文档介绍了如何在应用中使用滑动手势功能，特别是实现类似原生应用的边缘滑动返回。

## 基本概念

滑动手势是移动应用中常见的交互方式，特别是以下几种常见用法：

- **返回导航**：从屏幕左侧边缘向右滑动返回上一页
- **抽屉菜单**：从边缘滑动打开菜单
- **卡片操作**：滑动卡片显示更多操作（如删除、存档等）
- **切换视图**：左右滑动切换选项卡或页面

## 实现方法

本应用提供了两种方式来添加滑动手势功能：

1. **使用 Hook**：`useSwipeGesture` 钩子函数，灵活且易于与任何组件集成
2. **使用高阶组件**：`withSwipeBack` 高阶函数，快速为现有组件添加滑动返回功能

## 方法一：使用 Hook

### 1. 基本用法

最简单的使用方式是通过 `useSwipeGesture` 钩子函数：

```tsx
import { useSwipeGesture, SwipeDirection } from '@/lib/hooks';

function MyComponent() {
  const { ref } = useSwipeGesture((direction) => {
    if (direction === SwipeDirection.RIGHT) {
      // 处理向右滑动（例如返回上一页）
      router.back();
    }
  });

  return (
    <div ref={ref} className="...">
      {/* 组件内容 */}
    </div>
  );
}
```

### 2. 配置选项

`useSwipeGesture` 支持多种配置选项：

```tsx
const { ref } = useSwipeGesture(
  (direction) => {
    // 处理滑动
  },
  {
    // 滑动触发的最小距离
    threshold: 75,
    
    // 是否只允许从边缘滑动
    edgeOnly: true,
    
    // 边缘区域宽度(像素)
    edgeWidth: 20,
    
    // 是否启用触觉反馈
    hapticFeedback: true,
    
    // 阻止事件冒泡(防止页面滚动)
    preventPropagation: true,
    
    // 是否禁用手势
    disabled: false
  }
);
```

## 方法二：使用高阶组件

如果你有一个现有的组件想要添加滑动返回功能，可以使用 `withSwipeBack` 高阶组件：

### 1. 基本用法

```tsx
import { withSwipeBack } from '@/components/withSwipeBack';
import { useRouter } from 'next/navigation';

// 原始页面组件
function PageComponent(props) {
  return (
    <div className="...">
      {/* 页面内容 */}
    </div>
  );
}

// 在组件外部使用高阶组件包装
export default withSwipeBack(PageComponent, {
  onSwipeBack: () => {
    const router = useRouter();
    router.back();
  }
});
```

### 2. 配置选项

`withSwipeBack` 高阶组件支持以下配置：

```tsx
const EnhancedComponent = withSwipeBack(BaseComponent, {
  // 必选：滑动触发的回调函数
  onSwipeBack: () => handleBack(),
  
  // 可选：是否启用触觉反馈
  hapticFeedback: true,
  
  // 可选：滑动触发的最小距离
  threshold: 75,
  
  // 可选：边缘滑动的识别区域宽度
  edgeWidth: 20,
  
  // 可选：是否禁用滑动返回功能
  disabled: false,
  
  // 可选：处理其他方向的滑动
  onSwipe: (direction) => {
    if (direction === SwipeDirection.LEFT) {
      // 处理向左滑动
    }
  }
});
```

## 在模态框中使用

模态框是最常见的使用场景之一，示例如下：

```tsx
import { useSwipeGesture, SwipeDirection } from '@/lib/hooks';

function Modal({ isOpen, onClose }) {
  const { ref } = useSwipeGesture((direction) => {
    if (direction === SwipeDirection.RIGHT) {
      onClose();
    }
  });

  if (!isOpen) return null;
  
  return (
    <div 
      ref={ref}
      className="fixed inset-0 z-50 bg-white"
    >
      {/* 模态框内容 */}
      <button onClick={onClose}>关闭</button>
    </div>
  );
}
```

## 最佳实践

1. **边缘滑动**：对于返回操作，建议使用 `edgeOnly: true` 设置，这样只有从屏幕边缘开始的滑动才会触发操作。

2. **与滚动区域冲突**：当滑动手势与滚动区域（如长列表）冲突时，可以设置 `preventPropagation: false`，让滚动有更高的优先级。

3. **触觉反馈**：为了提供更好的用户体验，建议启用 `hapticFeedback: true`，但要确保用户设置中允许振动。

4. **速度识别**：滑动手势支持速度识别，快速的轻扫（即使距离不足）也可以触发操作。

5. **选择合适的实现方法**：
   - 对于新组件或需要细粒度控制，使用 `useSwipeGesture` Hook
   - 对于快速集成到现有组件，使用 `withSwipeBack` 高阶组件

## 与 Capacitor 集成

该滑动手势功能与 Capacitor 无缝集成，可以在 Web 和原生应用中提供一致的体验：

1. **触觉反馈**：在支持的设备上，会使用 Capacitor 的 Haptics 插件提供触感反馈。

2. **兼容性**：该实现在 iOS、Android 和 Web 上都能正常工作。

## 支持的滑动方向

`SwipeDirection` 枚举提供了四个方向：

- `SwipeDirection.RIGHT`：向右滑动（常用于返回操作）
- `SwipeDirection.LEFT`：向左滑动
- `SwipeDirection.UP`：向上滑动
- `SwipeDirection.DOWN`：向下滑动

## 示例

### 实现边缘滑动返回的页面组件

```tsx
'use client';

import { useSwipeGesture, SwipeDirection } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  
  const { ref } = useSwipeGesture((direction) => {
    if (direction === SwipeDirection.RIGHT) {
      router.back();
    }
  }, { 
    edgeOnly: true,
    edgeWidth: 30,
    hapticFeedback: true
  });
  
  return (
    <div ref={ref} className="min-h-screen">
      {/* 页面内容 */}
    </div>
  );
}
```

### 使用高阶组件实现滑动返回

```tsx
'use client';

import { withSwipeBack } from '@/components/withSwipeBack';
import { useRouter } from 'next/navigation';

function PageContent() {
  return (
    <div className="min-h-screen">
      {/* 页面内容 */}
    </div>
  );
}

// 获取router实例
const router = useRouter();

// 使用高阶组件包装
export default withSwipeBack(PageContent, {
  onSwipeBack: () => router.back(),
  edgeWidth: 30,
  hapticFeedback: true
});
```

### 实现可滑动删除的列表项

```tsx
function SwipeableListItem({ item, onDelete }) {
  const { ref } = useSwipeGesture((direction) => {
    if (direction === SwipeDirection.LEFT) {
      onDelete(item.id);
    }
  }, { 
    edgeOnly: false,
    threshold: 100
  });
  
  return (
    <div ref={ref} className="relative border-b p-4">
      {item.title}
    </div>
  );
}
``` 