import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl'

// 导入翻译文件
import zhTranslations from '@/locales/zh/common.json'
import enTranslations from '@/locales/en/common.json';
import AutocompleteInput from '@/components/common/forms/AutocompleteInput';
import { ExtendedCoffeeBean } from '../types';
import { pageVariants, pageTransition, FLAVOR_CATEGORIES } from '../constants';

interface FlavorInfoProps {
    bean: Omit<ExtendedCoffeeBean, 'id' | 'timestamp'>;
    flavorInput: string;
    onFlavorInputChange: (value: string) => void;
    onAddFlavor: (flavorValue?: string) => void;
    onRemoveFlavor: (flavor: string) => void;
}

const FlavorInfo: React.FC<FlavorInfoProps> = ({
    bean,
    flavorInput,
    onFlavorInputChange,
    onAddFlavor,
    onRemoveFlavor,
}) => {
    // 使用翻译钩子
    const t = useTranslations('beanForm.flavorInfo')
    const locale = useLocale()

    // 根据当前语言获取风味标签和分类
    const getFlavorData = () => {
        const translations = locale === 'en' ? enTranslations : zhTranslations;
        const flavorTags = translations.beanConstants?.flavorTags || {};

        // 将现有的分类结构转换为当前语言的标签
        const flavorCategories: Record<string, string[]> = {};

        Object.entries(FLAVOR_CATEGORIES).forEach(([categoryKey, tags]) => {
            // 将每个标签转换为当前语言
            const translatedTags = tags.map(tag => {
                // 如果翻译存在，使用翻译；否则使用原标签
                return flavorTags[tag as keyof typeof flavorTags] || tag;
            });
            flavorCategories[categoryKey] = translatedTags;
        });

        // 生成当前语言的风味标签列表
        const allFlavorTags = Object.values(flavorCategories).flat();

        return { flavorCategories, flavorTags: allFlavorTags };
    };

    const { flavorCategories, flavorTags } = getFlavorData();

    // 翻译风味分类的函数
    const translateFlavorCategory = (category: string): string => {
        const translations = locale === 'en' ? enTranslations : zhTranslations;
        const flavorCategoryNames = translations.beanConstants?.flavorCategories;

        if (flavorCategoryNames && flavorCategoryNames[category as keyof typeof flavorCategoryNames]) {
            return flavorCategoryNames[category as keyof typeof flavorCategoryNames];
        }

        return category;
    };
    return (
        <motion.div
            key="flavor-step"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="space-y-8 max-w-md mx-auto flex flex-col items-center justify-center h-full"
        >
            <div className="space-y-2 w-full">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {t('selectedFlavors.label')}
                </label>
                <div className="flex flex-wrap gap-2 pb-2">
                    {bean.flavor && bean.flavor.length > 0 ? (
                        bean.flavor.map((flavor, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-neutral-200 dark:bg-neutral-800 rounded-full px-3 py-1"
                            >
                                <span className="text-xs">{flavor}</span>
                                <button
                                    type="button"
                                    onClick={() => onRemoveFlavor(flavor)}
                                    className="ml-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-neutral-500 dark:text-neutral-400 text-sm py-1 border-b border-neutral-300 dark:border-neutral-700 w-full">
                            {t('selectedFlavors.empty') || '尚未添加风味标签'}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2 w-full">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {t('addFlavor.label')}
                </label>
                <div className="flex items-center w-full">
                    <div className="flex-1 border-b border-neutral-300 dark:border-neutral-700">
                        <AutocompleteInput
                            value={flavorInput}
                            onChange={onFlavorInputChange}
                            placeholder={t('addFlavor.placeholder')}
                            suggestions={flavorTags.filter(tag => !bean.flavor?.includes(tag))}
                            className="w-full border-none"
                            onBlur={() => flavorInput.trim() && onAddFlavor()}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => onAddFlavor()}
                        className="ml-3 h-[36px] px-4 flex items-center justify-center text-xs font-medium bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-800 rounded-full"
                    >
                        {t('addFlavor.addButton')}
                    </button>
                </div>
            </div>

            <div className="space-y-4 w-full">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {t('commonFlavors.label')}
                </label>

                {Object.entries(flavorCategories).map(([category, tags]) => (
                    <div key={category} className="space-y-2">
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {translateFlavorCategory(category)}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {tags.map((flavor, index) => (
                                <button
                                    key={`${category}-${index}`}
                                    type="button"
                                    onClick={() => {
                                        if (bean.flavor?.includes(flavor)) {
                                            onRemoveFlavor(flavor);
                                        } else {
                                            // 直接添加标签，无需经过输入框
                                            onAddFlavor(flavor);
                                        }
                                    }}
                                    className={`rounded-full px-3 py-1 text-xs ${
                                        bean.flavor?.includes(flavor)
                                            ? 'bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-800'
                                            : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                                    }`}
                                >
                                    {bean.flavor?.includes(flavor) ? `${flavor} ×` : flavor}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default FlavorInfo;