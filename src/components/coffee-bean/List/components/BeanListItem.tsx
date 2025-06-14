'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
// import ActionMenu, { ActionMenuItem } from '@/components/coffee-bean/ui/action-menu' // 移除操作菜单
import { ExtendedCoffeeBean, generateBeanTitle } from '../types'
import { isBeanEmpty } from '../globalCache'
import { parseDateToTimestamp } from '@/lib/utils/dateUtils'
import HighlightText from '@/components/common/ui/HighlightText'
import { useTranslations } from 'next-intl'

// 动态导入 ImageViewer 组件 - 移除加载占位符
const ImageViewer = dynamic(() => import('@/components/common/ui/ImageViewer'), {
    ssr: false
})

interface BeanListItemProps {
    bean: ExtendedCoffeeBean
    title?: string // 改为可选，如果不提供则内部生成
    isLast: boolean
    // onEdit: (bean: ExtendedCoffeeBean) => void // 移至详情页面
    // onDelete: (bean: ExtendedCoffeeBean) => void // 移至详情页面
    // onShare: (bean: ExtendedCoffeeBean) => void // 移至详情页面
    onRemainingClick: (bean: ExtendedCoffeeBean, event: React.MouseEvent) => void
    onDetailClick?: (bean: ExtendedCoffeeBean) => void
    searchQuery?: string
}

const BeanListItem: React.FC<BeanListItemProps> = ({
    bean,
    title,
    isLast,
    // onEdit, // 移至详情页面
    // onDelete, // 移至详情页面
    // onShare, // 移至详情页面
    onRemainingClick,
    onDetailClick,
    searchQuery = ''
}) => {
    const t = useTranslations('nav')
    const tStatus = useTranslations('nav.beanStatus')
    // 图片查看器状态和错误状态
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [_imageLoaded, _setImageLoaded] = useState(false);
    
    // 添加设置状态 - 使用props传入，避免每个组件都加载设置
    const [showOnlyBeanName] = useState(true); // 默认只显示咖啡豆名称
    const [showFlavorPeriod] = useState(false); // 默认不显示赏味期信息



    // 计算赏味期信息
    const flavorInfo = useMemo(() => {
        // 检查是否为在途状态
        if (bean.isInTransit) {
            return {
                phase: 'transit',
                remainingDays: 0,
                progressPercent: 0,
                status: 'transit',
                preFlavorPercent: 0,
                flavorPercent: 100, // 在途状态下整个进度条显示为在途区域
                daysSinceRoast: 0,
                endDay: 0,
                isFrozen: false,
                isInTransit: true
            };
        }

        if (!bean.roastDate) return {
            phase: 'unknown',
            remainingDays: 0,
            progressPercent: 0,
            status: 'unknown',
            preFlavorPercent: 0,
            flavorPercent: 0,
            daysSinceRoast: 0,
            endDay: 0,
            isFrozen: false,
            isInTransit: false
        };

        // 检查是否为冰冻状态
        if (bean.isFrozen) {
            return {
                phase: 'frozen',
                remainingDays: 0,
                progressPercent: 0,
                status: 'frozen',
                preFlavorPercent: 0,
                flavorPercent: 100, // 冰冻状态下整个进度条显示为赏味期区域
                daysSinceRoast: 0,
                endDay: 0,
                isFrozen: true,
                isInTransit: false
            };
        }

        const today = new Date();
        // 使用日期工具函数解析日期
        const roastTimestamp = parseDateToTimestamp(bean.roastDate);
        const roastDate = new Date(roastTimestamp);
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const roastDateOnly = new Date(roastDate.getFullYear(), roastDate.getMonth(), roastDate.getDate());
        const daysSinceRoast = Math.ceil((todayDate.getTime() - roastDateOnly.getTime()) / (1000 * 60 * 60 * 24));

        // 优先使用自定义赏味期参数，如果没有则根据烘焙度计算
        let startDay = bean.startDay || 0;
        let endDay = bean.endDay || 0;

        // 如果没有自定义值，则根据烘焙度设置默认值
        if (startDay === 0 && endDay === 0) {
            if (bean.roastLevel === 'ultraLight' || bean.roastLevel === 'light') {
                startDay = 7;
                endDay = 30;
            } else if (bean.roastLevel === 'mediumDark' || bean.roastLevel === 'dark') {
                startDay = 14;
                endDay = 60;
            } else {
                // 默认为中烘焙
                startDay = 10;
                endDay = 30;
            }
        }

        let phase = '';
        let status = '';
        let remainingDays = 0;
        const progressPercent = Math.min((daysSinceRoast / endDay) * 100, 100);
        const preFlavorPercent = (startDay / endDay) * 100;
        const flavorPercent = ((endDay - startDay) / endDay) * 100;

        if (daysSinceRoast < startDay) {
            phase = 'aging';
            remainingDays = startDay - daysSinceRoast;
            status = `aging-${remainingDays}`;
        } else if (daysSinceRoast <= endDay) {
            phase = 'peak';
            remainingDays = endDay - daysSinceRoast;
            status = `peak-${remainingDays}`;
        } else {
            phase = 'decline';
            remainingDays = 0;
            status = 'decline';
        }

        return { phase, remainingDays, progressPercent, preFlavorPercent, flavorPercent, status, daysSinceRoast, endDay, isFrozen: false, isInTransit: false };
    }, [bean.roastDate, bean.startDay, bean.endDay, bean.roastLevel, bean.isFrozen, bean.isInTransit]);

    // 计算豆子是否为空
    const isEmpty = isBeanEmpty(bean);

    // 生成标题 - 如果没有传入title则根据设置生成
    const displayTitle = title || generateBeanTitle(bean, showOnlyBeanName);

    // 移除操作菜单项，操作功能移至详情页面

    // 格式化数字显示，整数时不显示小数点
    const formatNumber = (value: string | undefined): string =>
        !value ? '0' : (Number.isInteger(parseFloat(value)) ? Math.floor(parseFloat(value)).toString() : value);

    // 格式化日期显示（缩写格式）
    const formatDateShort = (dateStr: string): string => {
        try {
            const timestamp = parseDateToTimestamp(dateStr);
            const date = new Date(timestamp);
            const year = date.getFullYear().toString().slice(-2); // 获取年份的最后两位
            return `${year}-${date.getMonth() + 1}-${date.getDate()}`;
        } catch {
            return dateStr;
        }
    };

    // 格式化克价显示（只显示每克价格）
    const formatPricePerGram = (price: string, capacity: string): string => {
        const priceNum = parseFloat(price);
        const capacityNum = parseFloat(capacity.replace('g', ''));
        if (isNaN(priceNum) || isNaN(capacityNum) || capacityNum === 0) return '';
        const pricePerGram = priceNum / capacityNum;
        return `${pricePerGram.toFixed(2)}${t('units.pricePerGram')}`;
    };

    // 移除了不再使用的 infoItems 计算逻辑，因为现在直接在 JSX 中渲染

    // 获取状态圆点的颜色
    const getStatusDotColor = (phase: string): string => {
        switch (phase) {
            case 'aging':
                return 'bg-amber-400'; // 黄色
            case 'peak':
                return 'bg-green-400'; // 绿色
            case 'decline':
                return 'bg-red-400'; // 红色
            case 'transit':
                return 'bg-blue-400'; // 蓝色
            case 'frozen':
                return 'bg-cyan-400'; // 冰蓝色
            case 'unknown':
            default:
                return 'bg-neutral-400'; // 灰色
        }
    };

    // 格式化状态显示文本
    const formatStatusText = (status: string): string => {
        if (status.includes('-')) {
            const [phase, days] = status.split('-');
            return `${tStatus(phase)} ${days}${t('units.days')}`;
        }
        return tStatus(status);
    };

    // 处理卡片点击事件
    const handleCardClick = (e: React.MouseEvent) => {
        // 检查点击的目标是否在需要避开的区域内
        const target = e.target as HTMLElement;

        // 避开图片区域、剩余量编辑区域
        if (
            target.closest('[data-click-area="image"]') ||
            target.closest('[data-click-area="remaining-edit"]')
        ) {
            return;
        }

        // 调用详情页回调
        if (onDetailClick) {
            onDetailClick(bean);
        }
    };

    return (
        <div
            className={`group ${isLast ? '' : ''} ${
                isEmpty ? 'bg-neutral-100/60 dark:bg-neutral-800/30' : ''
            } ${onDetailClick ? 'cursor-pointer transition-colors' : ''}`}
            onClick={handleCardClick}
        >
            {/* 左右布局：左侧图片，右侧所有内容（包括备注） */}
            <div className="flex gap-3">
                {/* 左侧图片区域 - 固定显示，缩小尺寸，使用 self-start 防止被拉伸 */}
                <div className="relative self-start">
                    <div
                        className="w-14 h-14 relative shrink-0 cursor-pointer rounded border border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-100 dark:bg-neutral-800/20 overflow-hidden"
                        onClick={() => bean.image && !imageError && setImageViewerOpen(true)}
                        data-click-area="image"
                    >
                        {bean.image && !imageError ? (
                            <Image
                                src={bean.image}
                                alt={bean.name || t('labels.beanImage')}
                                height={48}
                                width={48}
                                unoptimized
                                style={{ width: '100%', height: '100%' }}
                                className="object-cover"
                                sizes="48px"
                                priority={true}
                                loading="eager"
                                onError={() => setImageError(true)}
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                            />
                        ) : (
                            // 没有图片时显示灰色背景和名称首字
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-neutral-400 dark:text-neutral-600">
                                {bean.name ? bean.name.charAt(0) : t('labels.bean')}
                            </div>
                        )}
                    </div>

                    {/* 状态圆点 - 右下角，边框超出图片边界 - 只有当有赏味期数据时才显示 */}
                    {bean.roastDate && (bean.startDay || bean.endDay || bean.roastLevel) && (
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${getStatusDotColor(flavorInfo.phase)} border-2 border-neutral-50 dark:border-neutral-900`} />
                    )}
                </div>

                {/* 图片查看器 */}
                {bean.image && !imageError && imageViewerOpen && (
                    <ImageViewer
                        isOpen={imageViewerOpen}
                        imageUrl={bean.image}
                        alt={bean.name || t('labels.beanImage')}
                        onClose={() => setImageViewerOpen(false)}
                    />
                )}

                {/* 右侧内容区域 - 包含标题、参数和备注 */}
                <div className="flex-1 min-w-0 flex flex-col gap-y-2">
                    {/* 标题和参数区域 - 根据是否有备注决定高度 */}
                    <div className={`flex flex-col justify-center gap-y-1.5 ${bean.notes ? '' : 'h-14'}`}>
                        {/* 顶部：标题 */}
                        <div className="text-xs font-medium text-neutral-800 dark:text-neutral-100 pr-2 leading-tight line-clamp-2">
                            {searchQuery ? (
                                <HighlightText
                                    text={displayTitle}
                                    highlight={searchQuery}
                                />
                            ) : (
                                displayTitle
                            )}
                            {isEmpty && (
                                <span className="text-neutral-500 dark:text-neutral-400 font-normal">（{t('labels.usedUp')}）</span>
                            )}
                        </div>

                        {/* 底部：参数信息 */}
                        <div className="flex items-center text-xs font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
                            {/* 日期或赏味期信息 */}
                            {bean.roastDate && !bean.isInTransit && (
                                <>
                                    <span className="shrink-0">
                                        {showFlavorPeriod ? formatStatusText(flavorInfo.status) : formatDateShort(bean.roastDate)}
                                    </span>
                                    {(bean.capacity && bean.remaining) || (bean.price && bean.capacity) ? (
                                        <span className="mx-2 text-neutral-400 dark:text-neutral-600">·</span>
                                    ) : null}
                                </>
                            )}

                            {/* 剩余量信息 */}
                            {bean.capacity && bean.remaining && (
                                <>
                                    <span className="shrink-0">
                                        <span
                                            onClick={(e) => onRemainingClick(bean, e)}
                                            className="cursor-pointer"
                                            data-click-area="remaining-edit"
                                        >
                                            <span className="border-dashed border-b border-neutral-400 dark:border-neutral-600 transition-colors">
                                                {formatNumber(bean.remaining)}
                                            </span>
                                            /{formatNumber(bean.capacity)}{t('units.grams')}
                                        </span>
                                    </span>
                                    {bean.price && bean.capacity ? (
                                        <span className="mx-2 text-neutral-400 dark:text-neutral-600">·</span>
                                    ) : null}
                                </>
                            )}

                            {/* 价格信息 */}
                            {bean.price && bean.capacity && (
                                <span className="shrink-0">
                                    {formatPricePerGram(bean.price, bean.capacity)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 备注区域 - 现在在右侧内容区域内 */}
                    {bean.notes && (
                        <div className="text-xs font-medium bg-neutral-200/30 dark:bg-neutral-800/40 p-1.5 rounded tracking-widest text-neutral-800/70 dark:text-neutral-400/85 whitespace-pre-line leading-tight">
                            {searchQuery ? (
                                <HighlightText
                                    text={bean.notes}
                                    highlight={searchQuery}
                                    className="text-neutral-600 dark:text-neutral-400"
                                />
                            ) : (
                                bean.notes
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// 使用 React.memo 包装组件以避免不必要的重新渲染
export default React.memo(BeanListItem) 