'use client'

import React from 'react'
import { Scroll, GalleryVerticalEnd, BookOpen, PlusIcon, DownloadIcon } from 'lucide-react'
import hapticsUtils from '@/lib/haptics'
import { motion, AnimatePresence } from 'framer-motion'

// 添加新的主导航类型
export type MainTabType = '冲煮' | '咖啡豆' | '笔记';

// 定义底部导航项接口
interface BottomNavItem {
    id: MainTabType;
    icon: React.FC<{ className?: string }>;
    label: string;
}

// 底部导航项配置
const bottomNavItems: BottomNavItem[] = [
    {
        id: '冲煮',
        icon: GalleryVerticalEnd,
        label: '冲煮'
    },
    {
        id: '咖啡豆',
        icon: Scroll,
        label: '咖啡豆'
    },
    {
        id: '笔记',
        icon: BookOpen,
        label: '笔记'
    }
];

interface BottomNavigationBarProps {
    activeMainTab: MainTabType;
    onTabChange: (tab: MainTabType) => void;
    hapticFeedback?: boolean;
    onAddCoffeeBean?: () => void;
    onImportCoffeeBean?: () => void;
    onAddNote?: () => void;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
    activeMainTab,
    onTabChange,
    hapticFeedback = true,
    onAddCoffeeBean,
    onImportCoffeeBean,
    onAddNote
}) => {
    // 处理主标签点击
    const handleMainTabClick = (tab: MainTabType) => {
        console.log(`标签点击: ${tab}`); // 调试信息
        
        // 如果已经在选中的标签，不做任何操作
        if (activeMainTab === tab) return;

        if (hapticFeedback) {
            hapticsUtils.light(); // 添加轻触感反馈
        }

        onTabChange(tab);
    };

    // 处理添加咖啡豆点击
    const handleAddCoffeeBean = () => {
        console.log('点击添加咖啡豆按钮'); // 调试信息
        
        if (hapticFeedback) {
            hapticsUtils.light();
        }
        
        if (onAddCoffeeBean) {
            onAddCoffeeBean();
        } else {
            console.warn('未提供 onAddCoffeeBean 回调函数');
        }
    };
    
    // 处理导入咖啡豆点击
    const handleImportCoffeeBean = () => {
        console.log('点击导入咖啡豆按钮'); // 调试信息
        
        if (hapticFeedback) {
            hapticsUtils.light();
        }
        
        if (onImportCoffeeBean) {
            onImportCoffeeBean();
        } else {
            console.warn('未提供 onImportCoffeeBean 回调函数');
        }
    };

    // 处理添加笔记点击
    const handleAddNote = () => {
        console.log('点击添加笔记按钮'); // 调试信息
        
        if (hapticFeedback) {
            hapticsUtils.light();
        }
        
        if (onAddNote) {
            onAddNote();
        } else {
            console.warn('未提供 onAddNote 回调函数');
        }
    };
    
    // 统一的简单动画定义
    const fadeAnimation = {
        initial: {opacity: 0, filter: "blur(8px)", scale: 0.9},
        animate: {opacity: 1, filter: "blur(0px)", scale: 1},
        exit: {opacity: 0, filter: "blur(8px)", scale: 0.9},
        transition: {duration: 0.3}
    };
    
    // 悬停和点击效果
    const interactionAnimations = {
        whileHover: {scale: 1.05, transition: {duration: 0.1}},
        whileTap: {scale: 0.95, transition: {duration: 0.1}}
    };

    // 检查是否显示咖啡豆相关操作按钮
    const shouldShowBeanActions = activeMainTab === '咖啡豆';
    const showAddButton = shouldShowBeanActions && !!onAddCoffeeBean;
    const showImportButton = shouldShowBeanActions && !!onImportCoffeeBean;
    
    // 检查是否显示笔记相关操作按钮
    const shouldShowNoteActions = activeMainTab === '笔记';
    const showAddNoteButton = shouldShowNoteActions && !!onAddNote;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
            <div className="flex justify-between items-end px-6 px-safe pb-6">
                {/* 左侧主导航组 */}
                <motion.div 
                    className="flex items-center bg-[#0061FE] rounded-full p-1.5 shadow-lg"
                    initial={fadeAnimation.initial}
                    animate={fadeAnimation.animate}
                    exit={fadeAnimation.exit}
                    transition={fadeAnimation.transition}
                >
                    {bottomNavItems.map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => handleMainTabClick(item.id)}
                            className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-full ${
                                activeMainTab === item.id 
                                ? 'text-white' 
                                : 'text-blue-100'
                            }`}
                            initial={fadeAnimation.initial}
                            animate={fadeAnimation.animate}
                            exit={fadeAnimation.exit}
                            transition={fadeAnimation.transition}
                            {...interactionAnimations}
                        >
                            <item.icon className="w-5 h-5 stroke-[1.5]" />
                            {activeMainTab === item.id && (
                                <motion.div 
                                    className="absolute bottom-0.5 w-0.5 h-0.5 rounded-full bg-white" 
                                    initial={fadeAnimation.initial}
                                    animate={fadeAnimation.animate}
                                    exit={fadeAnimation.exit}
                                    transition={fadeAnimation.transition}
                                />
                            )}
                            <span className="sr-only">{item.label}</span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* 右侧操作按钮组 */}
                <div className="flex items-center space-x-2">
                    <AnimatePresence mode='wait'>
                        {/* 添加咖啡豆按钮 */}
                        {showAddButton && (
                            <motion.div 
                                key="add-btn"
                                className="bg-[#0061FE] rounded-full p-1.5 shadow-lg"
                                initial={fadeAnimation.initial}
                                animate={fadeAnimation.animate}
                                exit={fadeAnimation.exit}
                                transition={fadeAnimation.transition}
                            >
                                <motion.button 
                                    className="relative flex items-center justify-center w-10 h-10 rounded-full text-blue-100"
                                    onClick={handleAddCoffeeBean}
                                    aria-label="添加咖啡豆"
                                    {...interactionAnimations}
                                >
                                    <PlusIcon className="w-5 h-5 stroke-[1.5]" />
                                </motion.button>
                            </motion.div>
                        )}
                        
                        {/* 导入咖啡豆按钮 */}
                        {showImportButton && (
                            <motion.div 
                                key="import-btn"
                                className="bg-[#0061FE] rounded-full p-1.5 shadow-lg"
                                initial={fadeAnimation.initial}
                                animate={fadeAnimation.animate}
                                exit={fadeAnimation.exit}
                                transition={{...fadeAnimation.transition, delay: showAddButton ? 0.1 : 0}}
                            >
                                <motion.button 
                                    className="relative flex items-center justify-center w-10 h-10 rounded-full text-blue-100"
                                    onClick={handleImportCoffeeBean}
                                    aria-label="导入咖啡豆"
                                    {...interactionAnimations}
                                >
                                    <DownloadIcon className="w-5 h-5 stroke-[1.5]" />
                                </motion.button>
                            </motion.div>
                        )}
                        
                        {/* 添加笔记按钮 */}
                        {showAddNoteButton && (
                            <motion.div 
                                key="add-note-btn"
                                className="bg-[#0061FE] rounded-full p-1.5 shadow-lg"
                                initial={fadeAnimation.initial}
                                animate={fadeAnimation.animate}
                                exit={fadeAnimation.exit}
                                transition={fadeAnimation.transition}
                            >
                                <motion.button 
                                    className="relative flex items-center justify-center w-10 h-10 rounded-full text-blue-100"
                                    onClick={handleAddNote}
                                    aria-label="添加笔记"
                                    {...interactionAnimations}
                                >
                                    <PlusIcon className="w-5 h-5 stroke-[1.5]" />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default BottomNavigationBar; 