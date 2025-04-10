import React from 'react';

interface StageDividerProps {
    stageNumber: number;  // 阶段编号
}

const StageDivider: React.FC<StageDividerProps> = ({ stageNumber }) => {
    return (
        <div className="my-7 relative">
            {/* 分隔线 - 使用虚线样式 */}
            <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800 opacity-60"></div>
            
            {/* 阶段标识 - 调整垂直对齐 */}
            <div className="absolute top-[-1px] left-1/2 transform -translate-x-1/2 translate-y-[-50%] bg-white dark:bg-neutral-900 px-3 inline-flex items-center justify-center">
                <span className="text-[10px] font-normal text-neutral-400 dark:text-neutral-500 opacity-70 leading-tight">
                    {stageNumber} 阶段
                </span>
            </div>
        </div>
    );
};

export default StageDivider;
