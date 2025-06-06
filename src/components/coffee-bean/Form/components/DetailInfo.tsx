import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import AutocompleteInput from '@/components/common/forms/AutocompleteInput';
import AutoResizeTextarea from '@/components/common/forms/AutoResizeTextarea';
import BlendComponents from './BlendComponents';
import { ExtendedCoffeeBean, BlendComponent } from '../types';
import { pageVariants, pageTransition } from '../constants';

interface DetailInfoProps {
    bean: Omit<ExtendedCoffeeBean, 'id' | 'timestamp'>;
    onBeanChange: (field: keyof Omit<ExtendedCoffeeBean, 'id' | 'timestamp'>) => (value: string) => void;
    blendComponents: BlendComponent[];
    onBlendComponentsChange: {
        add: () => void;
        remove: (index: number) => void;
        change: (index: number, field: keyof BlendComponent, value: string | number) => void;
    };
    autoSetFlavorPeriod: () => void;
    toggleFrozenState: () => void;
}

const DetailInfo: React.FC<DetailInfoProps> = ({
    bean,
    onBeanChange,
    blendComponents,
    onBlendComponentsChange,
    autoSetFlavorPeriod,
    toggleFrozenState,
}) => {
    // 使用翻译钩子
    const t = useTranslations('beanForm.detailInfo')

    // 咖啡豆类型选项
    const BEAN_TYPES = [
        { value: 'filter', label: t('beanType.filter') },
        { value: 'espresso', label: t('beanType.espresso') },
    ];
    return (
        <motion.div
            key="detail-step"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="space-y-8 max-w-md mx-auto flex flex-col items-center justify-center h-full"
        >
            <div className="grid grid-cols-1 gap-6 w-full">
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        {t('beanType.label')}
                    </label>
                    <div className="flex w-full border-b border-neutral-300 dark:border-neutral-700">
                        {BEAN_TYPES.map(type => (
                            <div
                                key={type.value}
                                className="w-1/2 relative py-2"
                                onClick={() => onBeanChange('beanType')(type.value)}
                            >
                                <button
                                    type="button"
                                    className={`w-full text-center transition-colors duration-200 ${
                                        bean.beanType === type.value
                                            ? 'text-neutral-800 dark:text-neutral-200'
                                            : 'text-neutral-500 dark:text-neutral-400'
                                    }`}
                                >
                                    {type.label}
                                </button>
                                {bean.beanType === type.value && (
                                    <div className="absolute -bottom-px left-0 w-full h-px bg-neutral-800 dark:bg-neutral-200"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BlendComponents
                components={blendComponents}
                onAdd={onBlendComponentsChange.add}
                onRemove={onBlendComponentsChange.remove}
                onChange={onBlendComponentsChange.change}
            />

            {!bean.isInTransit && !bean.isFrozen && (
                <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            {t('flavorPeriod.label')}
                        </label>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={autoSetFlavorPeriod}
                                className="text-xs text-neutral-600 dark:text-neutral-400 underline"
                            >
                                {t('flavorPeriod.resetByRoast')}
                            </button>
                            <button
                                type="button"
                                onClick={toggleFrozenState}
                                className="text-xs text-neutral-600 dark:text-neutral-400 underline"
                            >
                                {t('flavorPeriod.setFrozen')}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="block text-xs text-neutral-500 dark:text-neutral-400">
                                {t('flavorPeriod.startDay')}
                            </label>
                            <AutocompleteInput
                                value={bean.startDay ? String(bean.startDay) : ''}
                                onChange={onBeanChange('startDay')}
                                placeholder={t('flavorPeriod.startDayPlaceholder')}
                                clearable={false}
                                suggestions={[]}
                                inputType="tel"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs text-neutral-500 dark:text-neutral-400">
                                {t('flavorPeriod.endDay')}
                            </label>
                            <AutocompleteInput
                                value={bean.endDay ? String(bean.endDay) : ''}
                                onChange={onBeanChange('endDay')}
                                placeholder={t('flavorPeriod.endDayPlaceholder')}
                                clearable={false}
                                suggestions={[]}
                                inputType="tel"
                            />
                        </div>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        <p>{t('flavorPeriod.description', { startDay: bean.startDay || 0, endDay: bean.endDay || 0 })}</p>
                    </div>
                </div>
            )}

            {bean.isFrozen && !bean.isInTransit && (
                <div className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            {t('statusSettings.label')}
                        </label>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={toggleFrozenState}
                                className="text-xs text-neutral-600 dark:text-neutral-400 underline"
                            >
                                {t('flavorPeriod.cancelFrozen')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2 w-full">
                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {t('notes.label')}
                </label>
                <AutoResizeTextarea
                    value={bean.notes || ''}
                    onChange={(e) => onBeanChange('notes')(e.target.value)}
                    placeholder={t('notes.placeholder')}
                    className="w-full py-2 bg-transparent outline-hidden border-b border-neutral-300 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-400"
                    minRows={2}
                    maxRows={8}
                />
            </div>
        </motion.div>
    );
};

export default DetailInfo; 