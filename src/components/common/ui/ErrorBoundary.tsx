'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
    locale?: string
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
    showDetails: boolean
}

/**
 * 错误边界组件
 * 用于捕获子组件树中的JavaScript错误，避免整个应用崩溃
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false
        }
    }

    // 获取翻译文本的方法
    private getTranslation(key: string): string {
        const locale = this.props.locale || 'zh'

        // 简化的翻译映射
        const translations = {
            zh: {
                'title': '渲染出现问题',
                'description': '应用遇到了一个错误，正在尝试自动修复...',
                'errorMessage': '错误信息:',
                'errorStack': '错误堆栈:',
                'componentStack': '组件堆栈:',
                'unknownError': '未知错误',
                'noStackInfo': '无堆栈信息',
                'retry': '重试',
                'refresh': '刷新页面',
                'showDetails': '显示错误详情',
                'hideDetails': '隐藏错误详情'
            },
            en: {
                'title': 'Rendering Error',
                'description': 'The application encountered an error and is attempting to auto-fix...',
                'errorMessage': 'Error Message:',
                'errorStack': 'Error Stack:',
                'componentStack': 'Component Stack:',
                'unknownError': 'Unknown Error',
                'noStackInfo': 'No Stack Information',
                'retry': 'Retry',
                'refresh': 'Refresh Page',
                'showDetails': 'Show Error Details',
                'hideDetails': 'Hide Error Details'
            }
        } as const

        const currentTranslations = translations[locale as keyof typeof translations] || translations.zh
        return (currentTranslations as any)[key] || translations.zh[key as keyof typeof translations.zh] || key
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // 更新状态，下次渲染时显示备用UI
        return {
            hasError: true,
            error,
            errorInfo: null,
            showDetails: false
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // 记录错误信息
        console.error('ErrorBoundary caught error:', error, errorInfo)

        // 保存错误信息到状态中
        this.setState({
            errorInfo
        })

        // 如果提供了onError回调，则调用它
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }

        // 尝试自动修复数据问题
        this.tryFixData()
    }

    // 尝试自动修复数据问题
    async tryFixData() {
        try {
            const { DataManager } = await import('@/lib/core/dataManager')
            const result = await DataManager.fixBlendBeansData()

            if (result.fixedCount > 0) {
                console.log(`Auto-fixed ${result.fixedCount} problematic data entries`)

                // 如果修复成功，3秒后刷新页面
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            }
        } catch (err) {
            console.error('Auto-fix data failed:', err)
        }
    }

    // 重置错误状态
    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false
        })
    }

    // 切换错误详情显示
    toggleDetails = () => {
        this.setState(prevState => ({
            showDetails: !prevState.showDetails
        }))
    }

    render() {
        if (this.state.hasError) {
            // 如果提供了自定义的fallback，则使用它
            if (this.props.fallback) {
                return this.props.fallback
            }

            // 默认的错误UI
            return (
                <div className="p-4 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/50">
                    <h2 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">
                        {this.getTranslation('title')}
                    </h2>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                        {this.getTranslation('description')}
                    </p>

                    {/* 错误详情 */}
                    {this.state.showDetails && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded border text-xs max-h-80 overflow-y-auto">
                            <div className="mb-2">
                                <strong className="text-red-800 dark:text-red-300">{this.getTranslation('errorMessage')}</strong>
                                <div className="mt-1 text-red-700 dark:text-red-400 font-mono break-all">
                                    {this.state.error?.message || this.getTranslation('unknownError')}
                                </div>
                            </div>
                            <div className="mb-2">
                                <strong className="text-red-800 dark:text-red-300">{this.getTranslation('errorStack')}</strong>
                                <div className="mt-1 text-red-700 dark:text-red-400 font-mono break-all whitespace-pre-wrap">
                                    {this.state.error?.stack || this.getTranslation('noStackInfo')}
                                </div>
                            </div>
                            {this.state.errorInfo?.componentStack && (
                                <div>
                                    <strong className="text-red-800 dark:text-red-300">{this.getTranslation('componentStack')}</strong>
                                    <div className="mt-1 text-red-700 dark:text-red-400 font-mono break-all whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={this.resetError}
                            className="px-3 py-1 text-sm font-medium text-neutral-100 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                        >
                            {this.getTranslation('retry')}
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors dark:bg-red-800/30 dark:text-red-300 dark:hover:bg-red-800/50"
                        >
                            {this.getTranslation('refresh')}
                        </button>
                        <button
                            onClick={this.toggleDetails}
                            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors dark:bg-red-800/30 dark:text-red-300 dark:hover:bg-red-800/50"
                        >
                            {this.state.showDetails ? this.getTranslation('hideDetails') : this.getTranslation('showDetails')}
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary 