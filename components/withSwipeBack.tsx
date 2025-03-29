'use client';

import React, { useRef } from 'react';
import { useSwipeGesture, SwipeDirection } from '@/lib/hooks';

interface SwipeBackOptions {
  /**
   * 滑动触发时的回调函数
   */
  onSwipeBack: () => void;
  
  /**
   * 是否启用触觉反馈
   * @default true
   */
  hapticFeedback?: boolean;
  
  /**
   * 滑动触发的最小距离
   * @default 75
   */
  threshold?: number;
  
  /**
   * 边缘滑动的识别区域宽度
   * @default 20
   */
  edgeWidth?: number;
  
  /**
   * 是否禁用滑动返回功能
   * @default false
   */
  disabled?: boolean;
  
  /**
   * 除了右滑返回外，是否监听其他方向的滑动
   */
  onSwipe?: (direction: SwipeDirection) => void;
}

/**
 * 高阶组件：为任何组件添加滑动返回功能
 * 
 * @param Component 需要添加滑动返回功能的组件
 * @param options 配置选项
 * 
 * @example
 * ```tsx
 * // 基本用法
 * const PageWithSwipeBack = withSwipeBack(PageComponent, {
 *   onSwipeBack: () => router.back()
 * });
 * 
 * // 高级配置
 * const ModalWithSwipeBack = withSwipeBack(ModalComponent, {
 *   onSwipeBack: () => setIsOpen(false),
 *   threshold: 100,
 *   edgeWidth: 30,
 *   hapticFeedback: true
 * });
 * ```
 */
export function withSwipeBack<P extends object>(
  Component: React.ComponentType<P>,
  options: SwipeBackOptions
) {
  const WithSwipeGesture = React.forwardRef<HTMLDivElement, P>((props, ref) => {
    const swipeRef = useRef<HTMLDivElement | null>(null);
    const {
      onSwipeBack,
      hapticFeedback = true,
      threshold = 75,
      edgeWidth = 20,
      disabled = false,
      onSwipe
    } = options;

    const { ref: gestureRef } = useSwipeGesture((direction) => {
      if (direction === SwipeDirection.RIGHT) {
        onSwipeBack();
      } else if (onSwipe) {
        onSwipe(direction);
      }
    }, {
      threshold,
      edgeWidth,
      disabled,
      hapticFeedback,
      edgeOnly: true
    });

    const combinedRef = (node: HTMLDivElement | null) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }
      if (gestureRef.current !== node) {
        gestureRef.current = node;
      }
      swipeRef.current = node;
    };

    // @ts-expect-error - React.createElement 在处理泛型组件时的类型推导限制
    return <Component {...props} ref={combinedRef} />;
  });
  
  // 设置displayName以便调试
  const displayName = Component.displayName || Component.name || 'Component';
  WithSwipeGesture.displayName = `withSwipeBack(${displayName})`;
  
  return WithSwipeGesture;
}

export default withSwipeBack; 