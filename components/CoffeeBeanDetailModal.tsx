'use client'

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { CoffeeBean } from '@/app/types'
import { 
  ArrowLeftIcon, 
  ShareIcon, 
  PenIcon, 
  TrashIcon, 
  Sparkles, 
  CherryIcon,
  MapPinIcon,
  TreePalmIcon,
  FlameIcon,
  LeafIcon,
  CircleDollarSignIcon,
  ScaleIcon,
  CalendarIcon
} from 'lucide-react'
import { useSwipeGesture, SwipeDirection } from '@/lib/hooks'

interface CoffeeBeanDetailModalProps {
  isOpen: boolean
  bean: CoffeeBean | null
  beanTitle: string
  onClose: () => void
  onEdit: (bean: CoffeeBean) => void
  onDelete: (bean: CoffeeBean) => void
  onShare: (bean: CoffeeBean) => void
  onGenerateAIRecipe: (bean: CoffeeBean) => void
}

const CoffeeBeanDetailModal: React.FC<CoffeeBeanDetailModalProps> = ({
  isOpen,
  bean,
  beanTitle,
  onClose,
  onEdit,
  onDelete,
  onShare,
  onGenerateAIRecipe
}) => {
  // 客户端挂载状态
  const [mounted, setMounted] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: mainScrollRef });
  
  // 滚动状态
  const [scrolled, setScrolled] = useState(false);
  
  // 添加边缘滑动返回手势
  const { ref: swipeRef } = useSwipeGesture((direction) => {
    if (direction === SwipeDirection.RIGHT) {
      onClose();
    }
  }, {
    hapticFeedback: true,
    edgeOnly: true,
    edgeWidth: 30,
    threshold: 60
  });
  
  // 监听滚动位置
  useEffect(() => {
    const unsubscribe = scrollY.onChange(value => {
      setScrolled(value > 100);
    });
    
    return () => unsubscribe();
  }, [scrollY]);
  
  // 标题栏效果
  const _navBgOpacity = useTransform(scrollY, [50, 150], [0, 1]);
  const stickyTitleOpacity = useTransform(scrollY, [100, 150], [0, 1]);

  // 在客户端挂载后设置状态
  useEffect(() => {
    setMounted(true);
    
    // 当模态框打开时禁止滚动
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    // 清理函数：关闭模态框时恢复滚动
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 页面淡入淡出动画
  const pageAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  };

  if (!bean || !mounted) return null;

  // 使用Portal将模态框内容挂载到body
  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          {...pageAnimation}
          ref={swipeRef}
          className="fixed inset-0 bg-[#EEE] dark:bg-gray-900 z-[9998] flex flex-col"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            paddingTop: 'env(safe-area-inset-top, 0)',
            zIndex: 9998,
            // paddingBottom: 'env(safe-area-inset-bottom, 0)',
          }}
        >
          {/* 顶部导航 - 固定在顶部 */}
          <motion.div 
            className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-3 z-[9999]"
            style={{ 
              paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
            }}
          >
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 shadow-sm">
              {bean.capacity && bean.remaining && (
                <>
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    parseFloat(bean.remaining) / parseFloat(bean.capacity.replace('g', '')) > 0.7 
                      ? 'bg-green-500' 
                      : parseFloat(bean.remaining) / parseFloat(bean.capacity.replace('g', '')) > 0.3
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  } mr-1.5`}></span>
                  <span className={`text-sm ${
                    parseFloat(bean.remaining) / parseFloat(bean.capacity.replace('g', '')) > 0.7
                      ? 'text-green-500'
                      : parseFloat(bean.remaining) / parseFloat(bean.capacity.replace('g', '')) > 0.3 
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }`}>
                    {Math.round(parseFloat(bean.remaining) / parseFloat(bean.capacity.replace('g', '')) * 100)}%
                  </span>
                </>
              )}
            </div>
            
            <button
              onClick={() => onShare(bean)}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 shadow-sm"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </motion.div>

          {/* 主滚动容器 */}
          <div 
            ref={mainScrollRef}
            className="h-full w-full overflow-auto pt-[60px]"
          >
            {/* 内容主体 */}
            <div className="px-4 pb-6">
              {/* 图片区域 - 放回内容流，不再使用fixed定位 */}
              <div className="mb-6">
                <div className="w-full h-[25vh] mb-4 flex items-center justify-center">
                  {bean.image ? (
                    <motion.div 
                      layoutId={`bean-image-${bean.id}`}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={bean.image}
                        alt={bean.name}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      layoutId={`bean-placeholder-${bean.id}`}
                      className="w-full h-full flex items-center justify-center text-amber-500 dark:text-amber-400"
                    >
                      <CherryIcon className="w-28 h-28 stroke-[1.5]" />
                    </motion.div>
                  )}
                </div>

                <motion.h2 
                  layoutId={`bean-title-${bean.id}`}
                  className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-2"
                >
                  {beanTitle}
                </motion.h2>
              </div>
              
              {/* 基本信息 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6 shadow-sm">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 p-4 border-b border-gray-100 dark:border-gray-700">基本信息</h3>
                
                <div>
                  {bean.origin && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                        <div>
                          <div className="text-gray-800 dark:text-gray-200">产地</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{bean.origin}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {bean.process && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <TreePalmIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                        <div>
                          <div className="text-gray-800 dark:text-gray-200">处理法</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{bean.process}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {bean.roastLevel && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <FlameIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                        <div>
                          <div className="text-gray-800 dark:text-gray-200">烘焙度</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{bean.roastLevel}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {bean.variety && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <LeafIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                        <div>
                          <div className="text-gray-800 dark:text-gray-200">品种</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{bean.variety}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {bean.price && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <CircleDollarSignIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                        <div>
                          <div className="text-gray-800 dark:text-gray-200">价格</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">每克 {(parseFloat(bean.price) / (bean.capacity ? parseFloat(bean.capacity.replace('g', '')) : 100)).toFixed(2)}元</div>
                        </div>
                      </div>
                      <div className="text-gray-800 font-medium dark:text-gray-200">{bean.price}元</div>
                    </div>
                  )}
                  
                  {bean.capacity && bean.remaining && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <ScaleIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                        <div>
                          <div className="text-gray-800 dark:text-gray-200">剩余量</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">原始容量 {bean.capacity}</div>
                        </div>
                      </div>
                      <div className="text-gray-800 font-medium dark:text-gray-200">{bean.remaining}</div>
                    </div>
                  )}
                  
                  {bean.roastDate && (
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                        <div>
                          <div className="text-gray-800 dark:text-gray-200">烘焙日期</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {(() => {
                              const roastDate = new Date(bean.roastDate);
                              const now = new Date();
                              const diffDays = Math.floor((now.getTime() - roastDate.getTime()) / (1000 * 60 * 60 * 24));
                              return `${diffDays}天前`;
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-800 font-medium dark:text-gray-200">{bean.roastDate}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 拼配豆信息 */}
              {bean.type === '拼配' && bean.blendComponents && bean.blendComponents.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 p-4 border-b border-gray-100 dark:border-gray-700">拼配组成</h3>
                  <div>
                    {bean.blendComponents.map((component, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 flex justify-between ${idx < (bean.blendComponents?.length || 0) - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                      >
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                          {component.origin || ''} {component.process || ''} {component.variety || ''}
                        </div>
                        <div className="text-sm font-medium dark:text-gray-200">{component.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 风味标签 */}
              {bean.flavor && bean.flavor.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 p-4 border-b border-gray-100 dark:border-gray-700">风味特点</h3>
                  <div className="flex flex-wrap gap-2 p-4">
                    {bean.flavor.map((flavor, idx) => (
                      <div key={idx} className="text-xs bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1.5 text-gray-800 dark:text-gray-200">
                        {flavor}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 备注 */}
              {bean.notes && (
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-6 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 p-4 border-b border-gray-100 dark:border-gray-700">备注</h3>
                  <div className="p-4 text-sm text-gray-700 dark:text-gray-300">{bean.notes}</div>
                </div>
              )}
              
              {/* 操作按钮放在内容最下方 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-6">
                <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700">
                  <button
                    onClick={() => onEdit(bean)}
                    className="py-4 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <PenIcon className="w-4 h-4 mr-2" />
                    编辑
                  </button>
                  
                  <button
                    onClick={() => onDelete(bean)}
                    className="py-4 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    删除
                  </button>
                  
                  <button
                    onClick={() => onGenerateAIRecipe(bean)}
                    className="py-4 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI方案
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 顶部标题栏 - 随滚动出现 */}
          {scrolled && (
            <motion.div 
              className="fixed top-0 left-0 right-0 px-4 py-3 mt-[60px] z-[9990]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ opacity: stickyTitleOpacity }}
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{beanTitle}</h2>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // 将模态框内容渲染到document.body
  return createPortal(modalContent, document.body);
}

export default CoffeeBeanDetailModal 