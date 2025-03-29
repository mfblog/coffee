'use client';

import React, { forwardRef } from 'react';
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
  const { 
    onSwipeBack, 
    hapticFeedback = true, 
    threshold = 75,
    edgeWidth = 20,
    disabled = false,
    onSwipe
  } = options;
  
  // 使用forwardRef确保ref正确传递
  const WithSwipeGesture = forwardRef<HTMLDivElement, P>((props, ref) => {
    // 使用滑动手势钩子
    const { ref: swipeRef } = useSwipeGesture((direction) => {
      // 右滑触发返回
      if (direction === SwipeDirection.RIGHT) {
        onSwipeBack();
      }
      
      // 如果提供了onSwipe回调，处理所有方向的滑动
      if (onSwipe) {
        onSwipe(direction);
      }
    }, {
      hapticFeedback,
      threshold,
      edgeWidth,
      edgeOnly: true,
      disabled
    });
    
    // 合并refs
    const combinedRef = (node: HTMLDivElement) => {
      // 处理传入的ref
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }
      
      // 处理滑动手势的ref
      if (swipeRef && node) {
        (swipeRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };
    
    // 为了解决类型问题，使用React.createElement
    return React.createElement(Component, Object.assign(
      {}, 
      // @ts-ignore - 由于泛型约束，我们需要绕过类型检查
      props, 
      { ref: combinedRef }
    ));
  });
  
  // 设置displayName以便调试
  const displayName = Component.displayName || Component.name || 'Component';
  WithSwipeGesture.displayName = `withSwipeBack(${displayName})`;
  
  return WithSwipeGesture;
}

export default withSwipeBack; 