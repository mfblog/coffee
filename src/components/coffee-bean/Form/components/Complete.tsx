import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ExtendedCoffeeBean, BlendComponent } from '../types';
import { pageVariants, pageTransition } from '../constants';

interface CompleteProps {
    bean: Omit<ExtendedCoffeeBean, 'id' | 'timestamp'>;
    blendComponents: BlendComponent[];
    isEdit: boolean;
}

const Complete: React.FC<CompleteProps> = ({
    bean,
    blendComponents,
    isEdit,
}) => {
    // 使用翻译钩子
    const t = useTranslations('beanForm.complete')
    return (
        <motion.div
            key="complete-step"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex flex-col items-center justify-center pt-10 space-y-8 text-center relative"
        >
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Check className="w-8 h-8 text-neutral-800 dark:text-neutral-200" />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-200">
                    {isEdit ? t('title.edit') : t('title.add')}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                    {t('subtitle')}
                </p>
            </div>
            <div className="w-full space-y-4">
                <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.name')}</span>
                    <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">{bean.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.type')}</span>
                    <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">
                        {blendComponents.length > 1 ? t('values.blend') : t('values.single')}
                    </span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.usage')}</span>
                    <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">
                        {bean.beanType === 'filter' ? t('values.filter') : t('values.espresso')}
                    </span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.capacity')}</span>
                    <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">{bean.capacity}g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.roastLevel')}</span>
                    <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">{bean.roastLevel}</span>
                </div>
                {blendComponents.length <= 1 && bean.origin && (
                    <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.origin')}</span>
                        <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">{bean.origin}</span>
                    </div>
                )}
                {blendComponents.length <= 1 && bean.process && (
                    <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.process')}</span>
                        <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">{bean.process}</span>
                    </div>
                )}
                {blendComponents.length <= 1 && bean.variety && (
                    <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.variety')}</span>
                        <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">{bean.variety}</span>
                    </div>
                )}
                {bean.flavor && bean.flavor.length > 0 && (
                    <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.flavor')}</span>
                        <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">{bean.flavor.join(', ')}</span>
                    </div>
                )}
                <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.flavorPeriod')}</span>
                    <span className="text-sm font-medium truncate ml-4 max-w-[60%] text-right">{t('values.days', { start: bean.startDay, end: bean.endDay })}</span>
                </div>
                {blendComponents.length > 0 && (
                    <div className="flex flex-col py-2 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-neutral-500 dark:text-neutral-400 shrink-0">{t('fields.components')}</span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0">
                                {blendComponents.length > 1 && blendComponents.some(comp => comp.percentage !== undefined) ? t('fields.ratio') : ''}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {blendComponents.map((comp, index) => (
                                <div key={index} className="text-left">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium truncate max-w-[70%]">{t('fields.component')} #{index + 1}</span>
                                        {blendComponents.length > 1 && comp.percentage !== undefined && (
                                            <span className="text-sm font-medium shrink-0">{comp.percentage}%</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {comp.origin && (
                                            <span className="inline-block px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full truncate max-w-[90%]">
                                                {comp.origin}
                                            </span>
                                        )}
                                        {comp.process && (
                                            <span className="inline-block px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full truncate max-w-[90%]">
                                                {comp.process}
                                            </span>
                                        )}
                                        {comp.variety && (
                                            <span className="inline-block px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full truncate max-w-[90%]">
                                                {comp.variety}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Complete; 