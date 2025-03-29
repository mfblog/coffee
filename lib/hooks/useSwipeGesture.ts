'use client';

import { useRef, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import hapticsUtils from '@/lib/haptics';

interface SwipeGestureOptions {
  /**
   * 是否启用触觉反馈
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
   * 是否只允许从左侧边缘滑动
   * @default true
   */
  edgeOnly?: boolean;
  
  /**
   * 阻止传播到父元素(防止页面滚动)
   * @default true
   */
  preventPropagation?: boolean;
  
  /**
   * 是否禁用该手势
   * @default false
   */
  disabled?: boolean;
}

/**
 * 滑动手势方向
 */
export enum SwipeDirection {
  /** 向右滑动(常用于返回) */
  RIGHT = 'right',
  /** 向左滑动 */
  LEFT = 'left',
  /** 向上滑动 */
  UP = 'up',
  /** 向下滑动 */
  DOWN = 'down',
}

/**
 * 滑动手势Hook，用于检测和处理滑动手势
 * 
 * @param onSwipe 滑动触发的回调函数
 * @param options 配置选项
 * 
 * @example
 * ```tsx
 * // 基本用法
 * const { ref } = useSwipeGesture((direction) => {
 *   if (direction === SwipeDirection.RIGHT) {
 *     // 处理向右滑动
 *     handleClose();
 *   }
 * });
 * 
 * // 使用在元素上
 * <div ref={ref}>
 *   // 内容
 * </div>
 * 
 * // 高级配置
 * const { ref } = useSwipeGesture(
 *   (direction) => {
 *     // 处理滑动
 *   },
 *   {
 *     threshold: 100,
 *     edgeOnly: true,
 *     edgeWidth: 30,
 *     hapticFeedback: true
 *   }
 * );
 * ```
 */
export function useSwipeGesture(
  onSwipe: (direction: SwipeDirection) => void,
  options: SwipeGestureOptions = {}
) {
  const elementRef = useRef<HTMLDivElement>(null);
  
  // 默认配置
  const {
    threshold = 75,
    edgeWidth = 20,
    edgeOnly = true,
    preventPropagation = true,
    hapticFeedback = true,
    disabled = false
  } = options;
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    
    // 判断是否为边缘滑动
    const isEdgeSwipe = (clientX: number) => {
      if (!edgeOnly) return true;
      return clientX <= edgeWidth;
    };
    
    // 处理触摸开始
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      
      // 如果开启了仅边缘滑动但不是从边缘开始，则不处理
      if (edgeOnly && !isEdgeSwipe(touchStartX)) return;
      
      if (preventPropagation) {
        e.stopPropagation();
      }
    };
    
    // 处理触摸结束
    const handleTouchEnd = (e: TouchEvent) => {
      // 如果开启了仅边缘滑动但不是从边缘开始，则不处理
      if (edgeOnly && !isEdgeSwipe(touchStartX)) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      // 计算水平和垂直滑动距离
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const diffTime = touchEndTime - touchStartTime;
      
      // 判断滑动方向，使用绝对值比较确定主要方向
      const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
      
      // 计算滑动速度 (像素/毫秒)
      const velocityX = Math.abs(diffX) / diffTime;
      const velocityY = Math.abs(diffY) / diffTime;
      
      // 判断滑动是否足够快 (大于0.2像素/毫秒视为快速滑动)
      const isQuickSwipe = velocityX > 0.2 || velocityY > 0.2;
      
      // 根据滑动距离或速度触发回调
      if (isHorizontalSwipe) {
        if (diffX > threshold || (diffX > 20 && isQuickSwipe)) {
          // 向右滑动
          if (hapticFeedback && Capacitor.isPluginAvailable('Haptics')) {
            hapticsUtils.light();
          }
          onSwipe(SwipeDirection.RIGHT);
        } else if (diffX < -threshold || (diffX < -20 && isQuickSwipe)) {
          // 向左滑动
          if (hapticFeedback && Capacitor.isPluginAvailable('Haptics')) {
            hapticsUtils.light();
          }
          onSwipe(SwipeDirection.LEFT);
        }
      } else {
        if (diffY > threshold || (diffY > 20 && isQuickSwipe)) {
          // 向下滑动
          if (hapticFeedback && Capacitor.isPluginAvailable('Haptics')) {
            hapticsUtils.light();
          }
          onSwipe(SwipeDirection.DOWN);
        } else if (diffY < -threshold || (diffY < -20 && isQuickSwipe)) {
          // 向上滑动
          if (hapticFeedback && Capacitor.isPluginAvailable('Haptics')) {
            hapticsUtils.light();
          }
          onSwipe(SwipeDirection.UP);
        }
      }
      
      if (preventPropagation) {
        e.stopPropagation();
      }
    };
    
    // 添加事件监听器
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // 清理函数
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    onSwipe, 
    threshold, 
    edgeWidth, 
    edgeOnly, 
    preventPropagation, 
    hapticFeedback,
    disabled
  ]);
  
  return { ref: elementRef };
}

export default useSwipeGesture; 