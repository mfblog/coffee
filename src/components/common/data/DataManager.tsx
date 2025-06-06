'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { DataManager as DataManagerUtil } from '@/lib/core/dataManager'
import { APP_VERSION } from '@/lib/core/config'
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

interface DataManagerProps {
    isOpen: boolean
    onClose: () => void
    onDataChange?: () => void
}

const DataManager: React.FC<DataManagerProps> = ({ isOpen, onClose, onDataChange }) => {
    const t = useTranslations('dataManager')
    const tUtil = useTranslations('dataManager.dataManagerUtil')
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | null; message: string }>({
        type: null,
        message: ''
    })
    const [isExporting, setIsExporting] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [isResetting, setIsResetting] = useState(false)
    const [showConfirmReset, setShowConfirmReset] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const isNative = Capacitor.isNativePlatform()

    const handleExport = async () => {
        try {
            setIsExporting(true)
            setStatus({ type: 'info', message: t('export.messages.exporting') })

            const jsonData = await DataManagerUtil.exportAllData(tUtil)
            const fileName = `brew-guide-data-${new Date().toISOString().slice(0, 10)}.json`

            if (isNative) {
                try {
                    // 先将文件写入临时目录
                    await Filesystem.writeFile({
                        path: fileName,
                        data: jsonData,
                        directory: Directory.Cache,
                        encoding: Encoding.UTF8
                    })

                    // 获取临时文件的URI
                    const uriResult = await Filesystem.getUri({
                        path: fileName,
                        directory: Directory.Cache
                    })

                    // 使用分享功能让用户选择保存位置
                    await Share.share({
                        title: t('export.shareTitle'),
                        text: t('export.shareText'),
                        url: uriResult.uri,
                        dialogTitle: t('export.shareDialogTitle')
                    })

                    // 清理临时文件
                    await Filesystem.deleteFile({
                        path: fileName,
                        directory: Directory.Cache
                    })

                    setStatus({
                        type: 'success',
                        message: t('export.messages.success')
                    })
                } catch (error) {
                    throw new Error(t('export.messages.saveError', { error: (error as Error).message }))
                }
            } else {
                // Web平台的处理保持不变
                const blob = new Blob([jsonData], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = fileName
                document.body.appendChild(a)
                a.click()

                // 清理
                setTimeout(() => {
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                }, 100)

                setStatus({ type: 'success', message: t('export.messages.webSuccess') })
            }
        } catch (_error) {
            setStatus({ type: 'error', message: t('export.messages.exportError', { error: (_error as Error).message }) })
        } finally {
            setIsExporting(false)
        }
    }

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsImporting(true)
            setStatus({ type: 'info', message: t('import.messages.importing') })

            const reader = new FileReader()
            reader.onload = async (event) => {
                try {
                    const jsonString = event.target?.result as string
                    const result = await DataManagerUtil.importAllData(jsonString, tUtil)

                    if (result.success) {
                        setStatus({ type: 'success', message: result.message })
                        if (onDataChange) {
                            onDataChange()
                        }
                    } else {
                        setStatus({ type: 'error', message: result.message })
                    }
                } catch (_error) {
                    setStatus({ type: 'error', message: t('import.messages.importError', { error: (_error as Error).message }) })
                } finally {
                    setIsImporting(false)
                    // 重置文件输入，以便可以重新选择同一个文件
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                }
            }

            reader.onerror = () => {
                setStatus({ type: 'error', message: t('import.messages.readError') })
                setIsImporting(false)
            }

            reader.readAsText(file)
        } catch (_error) {
            setStatus({ type: 'error', message: t('import.messages.importError', { error: (_error as Error).message }) })
            setIsImporting(false)
        }
    }

    const handleReset = async () => {
        try {
            setIsResetting(true)
            setStatus({ type: 'info', message: t('reset.messages.resetting') })

            const result = await DataManagerUtil.resetAllData(true, tUtil)

            if (result.success) {
                setStatus({ type: 'success', message: result.message })
                if (onDataChange) {
                    onDataChange()
                }

                // 设置一个短暂延迟后刷新页面
                setTimeout(() => {
                    window.location.reload()
                }, 1000) // 延迟1秒，让用户能看到成功消息
            } else {
                setStatus({ type: 'error', message: result.message })
            }
        } catch (_error) {
            setStatus({ type: 'error', message: t('reset.messages.resetError', { error: (_error as Error).message }) })
        } finally {
            setIsResetting(false)
            setShowConfirmReset(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-medium">{t('title')}</h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-6 text-xs text-neutral-500 dark:text-neutral-400">
                        <p>{t('description')}</p>
                        <p className="mt-1">{t('currentVersion', { version: APP_VERSION })}</p>
                    </div>

                    {status.type && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 rounded-md p-3 text-sm ${status.type === 'success'
                                ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : status.type === 'error'
                                    ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    : 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                }`}
                        >
                            {status.message}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="w-full rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
                            >
                                {isExporting ? t('export.button.loading') : t('export.button.idle')}
                            </button>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {isNative
                                    ? t('export.description.native')
                                    : t('export.description.web')}
                            </p>
                        </div>

                        <div>
                            <button
                                onClick={handleImportClick}
                                disabled={isImporting}
                                className="w-full rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
                            >
                                {isImporting ? t('import.button.loading') : t('import.button.idle')}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {t('import.description')}
                            </p>
                        </div>

                        <div>
                            {!showConfirmReset ? (
                                <button
                                    onClick={() => setShowConfirmReset(true)}
                                    className="w-full rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                >
                                    {t('reset.button.idle')}
                                </button>
                            ) : (
                                <div className="mt-4">
                                    <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-red-600 dark:text-red-400"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                                                {t('reset.confirm.title')}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-red-600 dark:text-red-400 mb-4">
                                            {t('reset.confirm.warning')}
                                        </p>

                                        <p className="text-xs text-red-600 dark:text-red-400 mb-4">
                                            {t('reset.confirm.details')}
                                        </p>

                                        <div className="flex space-x-2 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmReset(false)}
                                                className="px-3 py-1.5 text-xs rounded-md bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                            >
                                                {t('reset.confirm.cancel')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                disabled={isResetting}
                                                className="px-3 py-1.5 text-xs rounded-md bg-red-600 text-neutral-100 transition-colors hover:bg-red-700 disabled:opacity-50"
                                            >
                                                {isResetting ? t('reset.button.loading') : t('reset.confirm.confirm')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {t('reset.description')}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default DataManager 