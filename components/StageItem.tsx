import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Method } from '@/lib/config'
import ActionMenu from './ui/action-menu'
import { Step } from '@/lib/hooks/useBrewingState'

interface StageItemProps {
    step: Step & {
        customParams?: Record<string, string | number | boolean>;
        icon?: string;
        isPinned?: boolean;
    }
    index: number
    onClick: () => void
    activeTab: string
    selectedMethod: Method | null
    currentStage: number
    onEdit?: () => void
    onDelete?: () => void
    onShare?: () => void
    isPinned?: boolean
    actionMenuStates?: Record<string, boolean>
    setActionMenuStates?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
    showFlowRate?: boolean
    allSteps?: Step[]
}

// 辅助函数：格式化时间
const formatTime = (seconds: number, compact: boolean = false) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    if (compact) {
        // 简洁模式: 1'20" 或 45"
        return mins > 0
            ? `${mins}'${secs.toString().padStart(2, '0')}"`
            : `${secs}"`
    }
    // 完整模式: 1:20 (用于主计时器显示)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 辅助函数：计算流速
const calculateFlowRate = (waterAmount: string, time: string | number) => {
    if (!waterAmount || !time) return 0;
    const water = parseInt(waterAmount);
    const seconds = typeof time === 'string' ? parseInt(time) : time;
    if (seconds <= 0) return 0;
    return water / seconds;
}

// 改进的流速计算函数：考虑前后阶段的水量差值
const calculateImprovedFlowRate = (step: Step, allSteps: Step[]) => {
    if (!step || !step.items || !step.note || step.type !== 'pour') return 0;
    
    // 获取当前阶段的水量和时间
    const currentWater = parseInt(step.items[0]);
    const currentTime = typeof step.note === 'string' ? parseInt(step.note) : step.note;
    
    if (!currentTime || currentTime <= 0) return 0;
    
    // 查找相同originalIndex的前一个阶段
    if (step.originalIndex !== undefined) {
        // 查找所有具有相同originalIndex的阶段
        const sameStageSteps = allSteps.filter(s => 
            s.originalIndex === step.originalIndex && s.type === 'pour');
        
        // 找出当前步骤在这些阶段中的位置
        const stepIndex = sameStageSteps.findIndex(s => s === step);
        
        // 如果是该originalIndex的第一个阶段
        if (stepIndex === 0) {
            // 查找前一个originalIndex的最后一个阶段
            const prevOriginalIndex = step.originalIndex - 1;
            const prevStageSteps = allSteps.filter(s => 
                s.originalIndex === prevOriginalIndex && s.type === 'pour');
            
            // 获取前一个阶段的最后一个步骤的水量
            let prevWater = 0;
            if (prevStageSteps.length > 0) {
                const prevStep = prevStageSteps[prevStageSteps.length - 1];
                prevWater = prevStep.items ? parseInt(prevStep.items[0]) : 0;
            }
            
            // 计算水量差值
            const waterDiff = currentWater - prevWater;
            return waterDiff / currentTime;
        } else if (stepIndex > 0) {
            // 如果不是第一个阶段，获取同一originalIndex的前一个阶段的水量
            const prevStep = sameStageSteps[stepIndex - 1];
            const prevWater = prevStep.items ? parseInt(prevStep.items[0]) : 0;
            
            // 计算水量差值
            const waterDiff = currentWater - prevWater;
            return waterDiff / currentTime;
        }
    }
    
    // 如果无法确定前一个阶段，使用简单的计算方法
    return currentWater / currentTime;
}

// StageItem组件
const StageItem: React.FC<StageItemProps> = ({
    step,
    index,
    onClick,
    activeTab,
    selectedMethod,
    currentStage,
    onEdit,
    onDelete,
    onShare,
    isPinned: _isPinned,
    actionMenuStates: _actionMenuStates,
    setActionMenuStates: _setActionMenuStates,
    showFlowRate = false,
    allSteps = []
}) => {
    // 判断是否为等待阶段
    const isWaitingStage = step.type === 'wait';

    // 判断是否为当前阶段
    const isCurrentStage = activeTab === '注水' && index === currentStage;
    
    // 获取文本样式
    const textStyle = useMemo(() => 
        isCurrentStage
            ? 'text-neutral-800 dark:text-white'
            : 'text-neutral-600 dark:text-neutral-400',
        [isCurrentStage]
    );

    // 获取操作菜单项
    const actionMenuItems = useMemo(() => {
        const items = [];
        
        if (onEdit) {
            items.push({
                id: 'edit',
                label: '编辑',
                onClick: onEdit,
            });
        }
        
        if (onDelete) {
            items.push({
                id: 'delete',
                label: '删除',
                onClick: onDelete,
            });
        }

        if (onShare) {
            items.push({
                id: 'share',
                label: '分享',
                onClick: onShare,
            });
        }
        
        return items;
    }, [onEdit, onDelete, onShare]);

    // 渲染阶段内容
    const renderStageContent = () => {
        return (
            <div className={`group relative border-l ${isWaitingStage ? 'border-dashed' : ''} border-neutral-200 pl-6 dark:border-neutral-800 ${textStyle}`}>
                {isCurrentStage && (
                    <motion.div
                        className={`absolute -left-px top-0 h-full w-px ${isWaitingStage ? 'bg-neutral-600 dark:bg-neutral-400' : 'bg-neutral-800 dark:bg-white'}`}
                        initial={{ scaleY: 0, transformOrigin: "top" }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.26, ease: 'linear' }}
                    />
                )}
                <div className={activeTab !== '注水' ? 'cursor-pointer' : ''} onClick={onClick}>
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-3 min-w-0 overflow-hidden">
                            {step.icon && (
                                <span className="text-xs mr-1">{step.icon}</span>
                            )}
                            <h3 className={`text-xs font-normal tracking-wider truncate ${isCurrentStage ? 'text-neutral-800 dark:text-white' : ''}`}>
                                {step.title}
                            </h3>
                            {activeTab === '注水' && selectedMethod && step.originalIndex !== undefined && step.items && step.note && (
                                <div className="flex items-baseline gap-2 text-[10px] text-neutral-600 dark:text-neutral-400 shrink-0">
                                    <span>{step.endTime ? formatTime(step.endTime, true) : formatTime(parseInt(step.note), true)}</span>
                                    <span>·</span>
                                    <span>{step.items[0]}</span>
                                    {showFlowRate && step.type === 'pour' && (
                                        <>
                                            <span>·</span>
                                            <span>
                                                {allSteps.length > 0 
                                                    ? calculateImprovedFlowRate(step, allSteps).toFixed(1) 
                                                    : calculateFlowRate(step.items[0], step.note).toFixed(1)}g/s
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {step.description && (
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                {step.description}
                            </p>
                        )}
                        {step.detail && (
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                {step.detail}
                            </p>
                        )}
                        {onEdit && onDelete && (
                            <div className="flex items-baseline ml-2 shrink-0">
                                <ActionMenu
                                    items={actionMenuItems}
                                    showAnimation={false}
                                    onStop={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        {activeTab === '注水' && step.items ? (
                            <p className={`text-xs font-light ${textStyle}`}>{step.items[1]}</p>
                        ) : step.items ? (
                            <ul className="space-y-1">
                                {step.items.map((item: string, i: number) => (
                                    <li key={i} className="text-xs font-light text-neutral-600 dark:text-neutral-400">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`group relative ${
                currentStage === index
                    ? 'text-neutral-800 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400'
            }`}
            onClick={onClick}
        >
            {renderStageContent()}
        </div>
    );
}

export default StageItem