'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Method } from '@/lib/core/config'
import { useConfigTranslation } from '@/lib/utils/i18n-config'


interface MethodSelectorProps {
  selectedEquipment: string
  selectedMethod: string
  customMethods: Method[]
  commonMethods: Method[]
  onMethodSelect: (methodId: string) => void
  onParamsChange: (method: Method) => void
  // onSkipMethodSelection?: () => void // 暂时移除跳过方案选择功能
}

const MethodSelector: React.FC<MethodSelectorProps> = ({
  selectedEquipment,
  selectedMethod,
  customMethods,
  commonMethods,
  onMethodSelect,
  onParamsChange,
  // onSkipMethodSelection // 暂时移除
}) => {
  const t = useTranslations('notes.form')
  const { translateBrewingMethod, translateBrewingTerm } = useConfigTranslation()
  // 本地状态管理参数
  const [coffeeAmount, setCoffeeAmount] = useState<string>('15')
  const [ratioAmount, setRatioAmount] = useState<string>('15')
  const [waterAmount, setWaterAmount] = useState<string>('225g')
  const [grindSize, setGrindSize] = useState<string>(t('placeholders.grindSizeInput'))
  const [_tempValue, setTempValue] = useState<string>('92')

  // 处理咖啡粉量变化
  const handleCoffeeAmountChange = (value: string, method: Method) => {
    // 允许输入数字和小数点的正则表达式
    const regex = /^$|^[0-9]*\.?[0-9]*$/;
    if (regex.test(value)) {
      setCoffeeAmount(value)

      // 更新方法参数
      method.params.coffee = `${value}g`

      // 计算并更新水量
      if (value && ratioAmount && value !== '.') {
        const coffeeValue = parseFloat(value)
        const ratioValue = parseFloat(ratioAmount)

        if (!isNaN(coffeeValue) && !isNaN(ratioValue) && coffeeValue > 0) {
          const waterValue = coffeeValue * ratioValue
          // 四舍五入到整数
          const roundedWaterValue = Math.round(waterValue)
          method.params.water = `${roundedWaterValue}g`
          setWaterAmount(`${roundedWaterValue}g`)
        }
      }

      // 通知父组件参数已更改
      onParamsChange(method)
    }
  }

  // 处理水粉比变化
  const handleRatioAmountChange = (value: string, method: Method) => {
    // 允许输入数字和小数点的正则表达式
    const regex = /^$|^[0-9]*\.?[0-9]*$/;
    if (regex.test(value)) {
      setRatioAmount(value)

      // 更新方法参数
      method.params.ratio = `1:${value}`

      // 计算并更新水量
      if (coffeeAmount && value && value !== '.') {
        const coffeeValue = parseFloat(coffeeAmount)
        const ratioValue = parseFloat(value)

        if (!isNaN(coffeeValue) && !isNaN(ratioValue) && coffeeValue > 0) {
          const waterValue = coffeeValue * ratioValue
          // 四舍五入到整数
          const roundedWaterValue = Math.round(waterValue)
          method.params.water = `${roundedWaterValue}g`
          setWaterAmount(`${roundedWaterValue}g`)
        }
      }

      // 通知父组件参数已更改
      onParamsChange(method)
    }
  }

  // 反向翻译函数：从翻译后的值找到原始值
  const reverseTranslateBrewingTerm = (translatedTerm: string): string => {
    // 常见研磨度的反向映射
    const reverseMap: Record<string, string> = {
      'Extra Fine': '极细',
      'Very Fine': '特细',
      'Fine': '细',
      'Medium Fine': '中细',
      'Medium Fine to Medium': '中细偏粗',
      'Medium Coarse': '中粗',
      'Coarse': '粗',
      'Very Coarse': '特粗',
      'Espresso': '意式'
    }

    // 如果找到反向映射，返回原始中文值；否则返回输入值
    return reverseMap[translatedTerm] || translatedTerm
  }

  // 处理研磨度变化
  const handleGrindSizeChange = (value: string, method: Method) => {
    // 将翻译后的值转换回原始值进行存储
    const originalValue = reverseTranslateBrewingTerm(value)
    setGrindSize(originalValue)

    // 更新方法参数（存储原始值）
    method.params.grindSize = originalValue

    // 通知父组件参数已更改
    onParamsChange(method)
  }

  // 处理水温变化
  // 未使用的水温变更处理函数，可以在将来实现

  // 当选择的方法变化时，初始化参数
  useEffect(() => {
    if (selectedMethod) {
      // 在所有方案中查找选中的方案
      const allMethods = [...customMethods, ...commonMethods];
      const method = allMethods.find(m => m.id === selectedMethod || m.name === selectedMethod);

      if (method) {
        // 提取参数到本地状态
        const coffee = extractNumber(method.params.coffee)
        const ratio = extractRatioNumber(method.params.ratio)
        const temp = method.params.temp.replace('°C', '')

        setCoffeeAmount(coffee)
        setRatioAmount(ratio)
        setWaterAmount(method.params.water)
        setGrindSize(method.params.grindSize)
        setTempValue(temp)
      }
    }
  }, [selectedMethod, customMethods, commonMethods])

  // 辅助函数：提取数字部分
  function extractNumber(str: string): string {
    const match = str.match(/(\d+(\.\d+)?)/);
    return match ? match[0] : '';
  }

  // 辅助函数：从水粉比中提取数字部分
  function extractRatioNumber(ratio: string): string {
    const match = ratio.match(/1:(\d+(\.\d+)?)/);
    return match ? match[1] : '';
  }

  // 判断方法是否选中
  const isMethodSelected = (method: Method) => {
    return selectedMethod === method.id || selectedMethod === method.name;
  }

  // 创建分隔符
  const divider = (customMethods.length > 0 && commonMethods.length > 0) ? (
    <div className="py-3 flex items-center">
      <div className="grow h-px bg-neutral-200 dark:bg-neutral-800"></div>
      <span className="px-2 text-xs text-neutral-500 dark:text-neutral-400">{translateBrewingTerm('通用方案')}</span>
      <div className="grow h-px bg-neutral-200 dark:bg-neutral-800"></div>
    </div>
  ) : null;

  // 渲染单个方案
  const renderMethod = (method: Method, isCustom: boolean) => {
    const isSelected = isMethodSelected(method);

    return (
      <div
        key={isCustom ? (method.id || method.name) : method.name}
        className="group relative"
      >
        <div
          className={`group relative border-l ${isSelected ? 'border-neutral-800 dark:border-white' : 'border-neutral-200 dark:border-neutral-800'} pl-6 cursor-pointer`}
          onClick={() => {
            // 统一优先使用ID作为标识符，确保一致性
            const methodIdentifier = method.id || method.name;
            onMethodSelect(methodIdentifier);
          }}
        >
          {isSelected && (
            <div className="absolute -left-px top-0 h-full w-px bg-neutral-800 dark:bg-white"></div>
          )}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-3 min-w-0 overflow-hidden text-neutral-800 dark:text-neutral-100 ">
              <h3 className={`text-xs font-medium tracking-wider truncate`}>
                {translateBrewingMethod(selectedEquipment, method.name)}
              </h3>
            </div>
          </div>

          {!isSelected && (
            <div className="mt-1.5 space-y-0.5 text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center">
                <span className="text-xs font-medium w-14">{t('methodParams.coffee')}</span>
                <span className="text-xs font-medium">{method.params.coffee}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-medium w-14">{t('methodParams.water')}</span>
                <span className="text-xs font-medium">{method.params.water}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-medium w-14">{t('methodParams.ratio')}</span>
                <span className="text-xs font-medium">{method.params.ratio}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-medium w-14">{t('methodParams.grindSize')}</span>
                <span className="text-xs font-medium">{translateBrewingTerm(method.params.grindSize)}</span>
              </div>
            </div>
          )}

          {isSelected && (
            <div className="mt-2 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-700" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                {/* 咖啡粉量 */}
                <div className="flex items-center">
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-14">{t('methodParams.coffee')}</label>
                  <div className="w-20 flex justify-end">
                    <input
                      type="text"
                      value={coffeeAmount}
                      onChange={(e) => handleCoffeeAmountChange(e.target.value, method)}
                      className="w-12 py-0.5 px-1 border border-neutral-300 dark:border-neutral-700 rounded-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-right text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-neutral-500"
                      placeholder="15"
                    />
                    <span className="ml-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">g</span>
                  </div>
                </div>

                {/* 水量 - 不可编辑，仅显示计算结果 */}
                <div className="flex items-center">
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-14">{t('methodParams.water')}</label>
                  <div className="w-20 flex justify-end">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{waterAmount}</span>
                  </div>
                </div>

                {/* 粉水比 */}
                <div className="flex items-center">
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-14">{t('methodParams.ratio')}</label>
                  <div className="w-20 flex justify-end items-center">
                    <span className="mr-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">1:</span>
                    <input
                      type="text"
                      value={ratioAmount}
                      onChange={(e) => handleRatioAmountChange(e.target.value, method)}
                      className="w-10 py-0.5 px-1 border border-neutral-300 dark:border-neutral-700 rounded-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-right text-xs font-medium  focus:outline-hidden focus:ring-1 focus:ring-neutral-500"
                      placeholder="15"
                    />
                  </div>
                </div>

                {/* 研磨度 */}
                <div className="flex items-center">
                  <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-14">{t('methodParams.grindSize')}</label>
                  <div className="w-20 flex justify-end">
                    <input
                      type="text"
                      value={translateBrewingTerm(grindSize)}
                      onChange={(e) => handleGrindSizeChange(e.target.value, method)}
                      className="w-16 py-0.5 px-1 border border-neutral-300 dark:border-neutral-700 rounded-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-right text-xs font-medium  focus:outline-hidden focus:ring-1 focus:ring-neutral-500"
                      placeholder={t('placeholders.grindSizeInput')}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="py-3">
      <div>
        {selectedEquipment ? (
          <div className="space-y-5">
            {/* 自定义方案 */}
            {customMethods.length > 0 && (
              customMethods.map((method) => renderMethod(method, true))
            )}

            {/* 分隔符 */}
            {divider}

            {/* 通用方案 */}
            {commonMethods.length > 0 ? (
              commonMethods.map((method) => renderMethod(method, false))
            ) : (
              !customMethods.length && (
                <div className="text-xs text-neutral-500 dark:text-neutral-400 border-l border-neutral-200 dark:border-neutral-800 pl-6">
                  {t('messages.noAvailableMethods')}
                </div>
              )
            )}

            {/* 暂时移除跳过方案选择选项，避免意外触发 */}
          </div>
        ) : (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 border-l border-neutral-200 dark:border-neutral-800 pl-6">
            {t('messages.selectEquipmentFirst')}
          </div>
        )}
      </div>
    </div>
  )
}

export default MethodSelector
