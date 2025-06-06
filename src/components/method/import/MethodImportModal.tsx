'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { type Method, type CustomEquipment } from '@/lib/core/config'

interface MethodImportModalProps {
    showForm: boolean
    onImport: (method: Method) => void
    onClose: () => void
    existingMethods?: Method[]
    customEquipment?: CustomEquipment
}

const MethodImportModal: React.FC<MethodImportModalProps> = ({
    showForm,
    onImport,
    onClose,
    existingMethods = [],
    customEquipment
}) => {
    // 使用翻译钩子
    const t = useTranslations('methodImport')
    const locale = useLocale()

    // 导入数据的状态
    const [importData, setImportData] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // 清除所有状态消息
    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    // 监听showForm变化，当表单关闭时清除输入框内容
    React.useEffect(() => {
        if (!showForm) {
            setImportData('');
            clearMessages();
        }
    }, [showForm]);

    // 关闭并清除输入
    const handleClose = () => {
        setImportData('');
        clearMessages();
        onClose();
    };

    // 生成模板提示词
    const _templatePrompt = (() => {
        // 根据语言构建JSON示例
        const jsonExample = locale === 'en' ? {
            "name": "Method name",
            "params": {
                "coffee": "Coffee amount, e.g. 15g",
                "water": "Water amount, e.g. 225g",
                "ratio": "Ratio, e.g. 1:15",
                "grindSize": "Grind size, e.g. medium-fine",
                "temp": "Water temperature, e.g. 92°C",
                "stages": [
                    {
                        "time": "minutes*60+seconds, number only",
                        "pourTime": "Pour time, number only, in seconds",
                        "label": "Step description (e.g. bloom(circular pour), circular pour, center pour)",
                        "water": "Water amount for this step, e.g. 40g",
                        "detail": "Describe pouring method, e.g. slowly pour in circles from center outward, evenly extract coffee flavor",
                        "pourType": "Pour type strictly follow center(center pour), circle(circular pour), ice(ice water), other(other)"
                    }
                ]
            }
        } : {
            "name": "方案名称",
            "params": {
                "coffee": "咖啡粉量，如15g",
                "water": "水量，如225g",
                "ratio": "比例，如1:15",
                "grindSize": "研磨度，如中细",
                "temp": "水温，如92°C",
                "stages": [
                    {
                        "time": "分钟*60+秒钟，纯数字",
                        "pourTime": "注水时间，纯数字，单位秒",
                        "label": "步骤操作简述（如焖蒸(绕圈注水)、绕圈注水、中心注水）",
                        "water": "该步骤水量，如40g",
                        "detail": "描述注水方式，如中心向外缓慢画圈注水，均匀萃取咖啡风味",
                        "pourType": "注水方式严格按照center（中心注水）、circle（绕圈注水）、ice（冰水）、other（其他）"
                    }
                ]
            }
        };

        const formattedJson = JSON.stringify(jsonExample, null, 2);

        return `${t('templatePrompt.header')}

${t('templatePrompt.format')}
${formattedJson}

${t('templatePrompt.requirements')}
${t('templatePrompt.requirementsList')}

${t('templatePrompt.tips')}
`;
    })();

    // 兼容性更好的复制文本方法
    const _copyTextToClipboard = async (text: string) => {
        try {
            // 首先尝试使用现代API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                setSuccess(t('messages.copySuccess'));
                setTimeout(() => setSuccess(null), 2000);
                return;
            }

            // 回退方法：创建临时textarea元素
            const textArea = document.createElement('textarea');
            textArea.value = text;

            // 设置样式使其不可见
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);

            // 选择文本并复制
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            if (successful) {
                setSuccess(t('messages.copySuccess'));
                setTimeout(() => setSuccess(null), 2000);
            } else {
                setError(t('messages.copyFailed'));
                setTimeout(() => setError(null), 2000);
            }
        } catch (_err) {
            setError(t('messages.copyFailed'));
            setTimeout(() => setError(null), 2000);
        } finally {
            if (document.querySelector('textarea[style*="-999999px"]')) {
                document.body.removeChild(document.querySelector('textarea[style*="-999999px"]')!);
            }
        }
    }

    // 处理导入数据
    const handleImport = () => {
        if (!importData) {
            setError(t('textInput.inputRequired'));
            return;
        }

        try {
            // 尝试从文本中提取数据
            import('@/lib/utils/jsonUtils').then(async ({ extractJsonFromText }) => {
                setError(null);
                // 解析导入数据，传递自定义器具配置
                const method = extractJsonFromText(importData, customEquipment) as Method;

                if (!method) {
                    setError(t('messages.invalidData'));
                    return;
                }

                // 验证方法对象是否有必要的字段
                if (!method.name) {
                    // 尝试获取method字段，使用接口扩展
                    interface ExtendedMethod extends Method {
                        method?: string;
                    }
                    const extendedMethod = method as ExtendedMethod;
                    if (typeof extendedMethod.method === 'string') {
                        // 如果有method字段，使用它作为name
                        method.name = extendedMethod.method;
                    } else {
                        setError(t('messages.missingName'));
                        return;
                    }
                }

                // 验证params
                if (!method.params) {
                    setError(t('messages.missingParams'));
                    return;
                }

                // 验证stages
                if (!method.params.stages || method.params.stages.length === 0) {
                    setError(t('messages.missingStages'));
                    return;
                }

                // 检查是否已存在同名方案
                const existingMethod = existingMethods.find(m => m.name === method.name);
                if (existingMethod) {
                    setError(t('messages.duplicateName', { name: method.name }));
                    return;
                }

                // 确保method对象完全符合Method接口
                const validMethod: Method = {
                    id: method.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: method.name,
                    params: {
                        coffee: method.params.coffee || '15g',
                        water: method.params.water || '225g',
                        ratio: method.params.ratio || '1:15',
                        grindSize: method.params.grindSize || (locale === 'en' ? 'medium-fine' : '中细'),
                        temp: method.params.temp || '92°C',
                        videoUrl: method.params.videoUrl || '',
                        stages: method.params.stages,
                    }
                };

                // 导入方案
                onImport(validMethod);
                // 导入成功后清空输入框和错误信息
                setImportData('');
                setError(null);
                // 关闭模态框
                handleClose();
            }).catch(err => {
                setError(t('messages.parseError', { error: err instanceof Error ? err.message : t('messages.unknownError') }));
            });
        } catch (err) {
            setError(t('messages.importFailed', { error: err instanceof Error ? err.message : t('messages.unknownError') }));
        }
    };

    // 渲染上传部分
    const renderUploadSection = () => (
        <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-md bg-neutral-50 dark:bg-neutral-800">
            <div className="space-y-4 py-1">
                <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-xs text-neutral-600 dark:text-neutral-400">
                    <ol className="list-decimal pl-5 space-y-1 text-[11px]">
                        <li>{t('manual.steps.prepare')}</li>
                        <li>{t('manual.steps.send')}<a
                            href="https://doubao.com/bot/duJYQEFd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pb-1.5 text-[11px] relative text-neutral-600 dark:text-neutral-400"
                        >
                            <span className="relative underline underline-offset-2 decoration-sky-600 ml-1">{t('manual.aiAssistant')}</span>
                            <svg viewBox="0 0 24 24" className="inline-block ml-1 w-3 h-3" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                <path d="M7 17L17 7M17 7H7M17 7V17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a></li>
                        <li>{t('manual.steps.paste')}</li>
                    </ol>
                    
                    <details className="mt-3 p-2 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 rounded-md text-[10px]">
                        <summary className="text-neutral-500 dark:text-neutral-400 cursor-pointer">{t('manual.promptTitle')}</summary>
                        <textarea
                            readOnly
                            value={_templatePrompt}
                            className="w-full text-neutral-700 dark:text-neutral-300 text-[10px] p-2 mt-2 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 rounded-md h-20 overflow-auto"
                            onFocus={(e) => e.target.select()}
                        />
                        <div className="flex justify-end mt-1">
                            <button
                                onClick={() => {
                                    clearMessages();
                                    _copyTextToClipboard(_templatePrompt);
                                }}
                                className="text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded-sm text-[10px] bg-neutral-200/80 dark:bg-neutral-800/80 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                            >
                                {t('manual.copyButton')}
                            </button>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {showForm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.265 }}
                    className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs"
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{
                            type: "tween",
                            ease: [0.33, 1, 0.68, 1], // cubic-bezier(0.33, 1, 0.68, 1) - easeOutCubic
                            duration: 0.265
                        }}
                        style={{
                            willChange: "transform"
                        }}
                        className="absolute inset-x-0 bottom-0 max-w-[500px] mx-auto max-h-[90vh] overflow-hidden rounded-t-2xl bg-neutral-50 dark:bg-neutral-900 shadow-xl"
                    >
                        {/* 拖动条 */}
                        <div className="sticky top-0 z-10 flex justify-center py-2 bg-neutral-50 dark:bg-neutral-900">
                            <div className="h-1.5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                        </div>

                        {/* 表单内容 */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: "tween",
                                ease: "easeOut",
                                duration: 0.265,
                                delay: 0.05
                            }}
                            style={{
                                willChange: "opacity, transform"
                            }}
                            className="px-6  pb-safe-bottom overflow-auto max-h-[calc(90vh-40px)]"
                        >
                            <div className="flex flex-col">
                                {/* 顶部标题 */}
                                <div className="flex items-center justify-between mt-3 mb-6">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="rounded-full p-2"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-neutral-800 dark:text-neutral-200"
                                        >
                                            <path
                                                d="M19 12H5M5 12L12 19M5 12L12 5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    <h3 className="text-base font-medium">{t('title')}</h3>
                                    <div className="w-8"></div>
                                </div>

                                {/* 表单内容 */}
                                <div className="space-y-4 mt-2">
                                    {renderUploadSection()}
                                    <div className="flex items-center mb-1">
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 flex-1">
                                            {t('textInput.label')}
                                        </p>
                                    </div>
                                    <textarea
                                        className="w-full h-40 p-3 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent focus:border-neutral-800 dark:focus:border-neutral-400 focus:outline-hidden text-neutral-800 dark:text-neutral-200"
                                        placeholder={t('textInput.placeholder')}
                                        value={importData}
                                        onChange={(e) => setImportData(e.target.value)}
                                    />
                                    {error && (
                                        <div className="text-sm text-red-500 dark:text-red-400">
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="text-sm text-green-500 dark:text-green-400">
                                            {success}
                                        </div>
                                    )}
                                    <div className="flex justify-end space-x-3 my-4">
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md text-sm"
                                        >
                                            {t('buttons.cancel')}
                                        </button>
                                        <button
                                            onClick={handleImport}
                                            className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-800 rounded-md text-sm"
                                        >
                                            {t('buttons.import')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default MethodImportModal 