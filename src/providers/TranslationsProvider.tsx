'use client'

import { NextIntlClientProvider } from 'next-intl'
import { ReactNode, useEffect, useState } from 'react'
import { Storage } from '@/lib/core/storage'

// 导入翻译文件 - 强制刷新缓存
import zhMessages from '@/locales/zh/common.json'
import enMessages from '@/locales/en/common.json'

const messages = {
    zh: zhMessages,
    en: enMessages,
}

// 创建自定义事件名称
export const LANGUAGE_CHANGE_EVENT = 'languageChange'

// 检测系统语言的函数
function detectSystemLanguage(): string {
    if (typeof window === 'undefined') return 'zh'

    // 获取浏览器语言设置
    const browserLanguage = navigator.language || navigator.languages?.[0] || 'zh-CN'

    // 简单的语言映射：如果是英文相关的语言代码，返回 'en'，否则返回 'zh'
    if (browserLanguage.toLowerCase().startsWith('en')) {
        return 'en'
    }

    return 'zh'
}

// 创建触发语言变化的函数
export function notifyLanguageChange() {
    // 创建并分发自定义事件
    const event = new CustomEvent(LANGUAGE_CHANGE_EVENT)
    window.dispatchEvent(event)
}

export function TranslationsProvider({
    children,
}: {
    children: ReactNode
}) {
    const [locale, setLocale] = useState<string>('zh')

    useEffect(() => {
        // 从本地存储加载语言设置
        const loadLanguage = async () => {
            try {
                const settings = await Storage.get('brewGuideSettings')
                if (settings) {
                    const parsedSettings = JSON.parse(settings)
                    setLocale(parsedSettings.language || 'zh')
                } else {
                    // 如果没有保存的设置，使用系统语言
                    const systemLanguage = detectSystemLanguage()
                    setLocale(systemLanguage)
                }
            } catch (error) {
                console.error('Error loading language settings:', error)
                // 出错时也使用系统语言
                const systemLanguage = detectSystemLanguage()
                setLocale(systemLanguage)
            }
        }

        // 初始加载
        loadLanguage()

        // 监听自定义语言变化事件
        const handleLanguageChange = () => {
            loadLanguage()
        }

        window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange)
        
        // 同时保留 storage 事件监听，以支持多标签页同步
        window.addEventListener('storage', handleLanguageChange)

        return () => {
            window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange)
            window.removeEventListener('storage', handleLanguageChange)
        }
    }, [])

    return (
        <NextIntlClientProvider messages={messages[locale as keyof typeof messages]} locale={locale}>
            {children}
        </NextIntlClientProvider>
    )
} 