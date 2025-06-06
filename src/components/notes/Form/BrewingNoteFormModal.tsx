'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import BrewingNoteForm from './BrewingNoteForm'
import { MethodSelector, CoffeeBeanSelector } from '@/components/notes/Form'
import EquipmentCategoryBar from './EquipmentCategoryBar'
import { useMethodManagement } from '@/components/notes/Form/hooks/useMethodManagement'
import type { BrewingNoteData, CoffeeBean } from '@/types/app'
import { brewingMethods as commonMethods } from '@/lib/core/config'
import SteppedFormModal, { Step } from '@/components/common/modals/SteppedFormModal'
import { type Method, type CustomEquipment } from '@/lib/core/config'
import { CoffeeBeanManager } from '@/lib/managers/coffeeBeanManager'
import { loadCustomEquipments } from '@/lib/managers/customEquipments'
import { getSelectedEquipmentPreference, saveSelectedEquipmentPreference } from '@/lib/hooks/useBrewingState'
// 导入随机选择器组件
import CoffeeBeanRandomPicker from '@/components/coffee-bean/RandomPicker/CoffeeBeanRandomPicker'

interface BrewingNoteFormModalProps {
  showForm: boolean
  initialNote?: Partial<BrewingNoteData> & {
    coffeeBean?: CoffeeBean | null;
    id?: string;
  }
  onSave: (note: BrewingNoteData) => void
  onClose: () => void
  onSaveSuccess?: () => void
}

const BrewingNoteFormModal: React.FC<BrewingNoteFormModalProps> = ({
  showForm,
  initialNote,
  onSave,
  onClose,
  onSaveSuccess
}) => {
  const locale = useLocale()
  // 咖啡豆状态
  const [selectedCoffeeBean, setSelectedCoffeeBean] = useState<CoffeeBean | null>(initialNote?.coffeeBean || null)
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([])

  // 器具状态 - 使用缓存逻辑，优先使用初始笔记的器具，否则使用缓存中的器具
  const [selectedEquipment, setSelectedEquipment] = useState<string>(
    initialNote?.equipment || getSelectedEquipmentPreference()
  )
  const [customEquipments, setCustomEquipments] = useState<CustomEquipment[]>([])

  // 步骤控制
  const [currentStep, setCurrentStep] = useState<number>(0)

  // 随机选择器状态
  const [isRandomPickerOpen, setIsRandomPickerOpen] = useState(false)

  // 使用方法管理Hook
  const {
    methodType: _methodType,
    selectedMethod,
    availableMethods,
    customMethods,
    handleMethodTypeChange: _handleMethodTypeChange,
    setSelectedMethod
  } = useMethodManagement({
    selectedEquipment,
    initialMethod: initialNote?.method,
    customEquipments
  })

  // 处理关闭 - 保持器具选择状态，只重置其他状态
  const handleClose = () => {
    setSelectedCoffeeBean(null)
    // 不重置器具选择，保持用户的选择状态
    // setSelectedEquipment('') // 移除这行
    setSelectedMethod('')
    onClose()
  }

  // 加载咖啡豆列表
  useEffect(() => {
    if (showForm) {
      CoffeeBeanManager.getAllBeans()
        .then(beans => {
          setCoffeeBeans(beans)
        })
        .catch(error => console.error('加载咖啡豆失败:', error))
    }
  }, [showForm])

  // 加载自定义器具列表
  useEffect(() => {
    if (showForm) {
      loadCustomEquipments()
        .then(equipments => setCustomEquipments(equipments))
        .catch(error => console.error('加载自定义器具失败:', error))
    }
  }, [showForm])

  // 监听器具缓存变化，实现与冲煮界面的实时同步
  useEffect(() => {
    const handleEquipmentCacheChange = (e: CustomEvent<{ equipmentId: string }>) => {
      const newEquipment = e.detail.equipmentId
      // 只有当缓存中的值与当前状态不同时才更新
      if (newEquipment !== selectedEquipment) {
        setSelectedEquipment(newEquipment)
      }
    }

    // 监听自定义事件
    window.addEventListener('equipmentCacheChanged', handleEquipmentCacheChange as EventListener)

    return () => {
      window.removeEventListener('equipmentCacheChanged', handleEquipmentCacheChange as EventListener)
    }
  }, [selectedEquipment])

  // 处理器具选择 - 移除selectedEquipment依赖以避免频繁重新创建
  const handleEquipmentSelect = useCallback((equipmentId: string) => {
    setSelectedEquipment(prev => {
      if (equipmentId === prev) return prev
      // 延迟保存器具选择到缓存，避免在渲染期间触发其他组件更新
      setTimeout(() => {
        saveSelectedEquipmentPreference(equipmentId)
      }, 0)
      return equipmentId
    })
    // 在笔记模态框中，选择器具只更新方案列表，不自动跳转
  }, [])

  // 处理咖啡豆选择 - 使用函数式更新避免依赖currentStep
  const handleCoffeeBeanSelect = useCallback((bean: CoffeeBean | null) => {
    setSelectedCoffeeBean(bean)
    // 选择咖啡豆后自动前进到下一步
    setCurrentStep(prev => prev + 1)
  }, [])

  // 打开随机选择器
  const handleOpenRandomPicker = () => {
    setIsRandomPickerOpen(true)
  }

  // 处理随机选择咖啡豆 - 使用useCallback和函数式更新
  const handleRandomBeanSelect = useCallback((bean: CoffeeBean) => {
    setSelectedCoffeeBean(bean)
    // 选择随机咖啡豆后自动前进到下一步
    setCurrentStep(prev => prev + 1)
  }, [])

  // 处理方法参数变化 - 使用useCallback优化并延迟事件触发
  const _handleMethodParamsChange = useCallback((method: Method) => {
    // 统一使用ID优先的方式标识方案
    const methodIdentifier = method.id || method.name;
    setSelectedMethod(methodIdentifier);

    // 延迟触发事件，避免在渲染期间触发
    setTimeout(() => {
      const event = new CustomEvent('methodParamsChanged', {
        detail: { params: method.params }
      });
      document.dispatchEvent(event);
    }, 0);
  }, [])

  // 暂时移除跳过方案选择功能
  // const handleSkipMethodSelection = useCallback(() => {
  //   // 清空方案选择
  //   setSelectedMethod('')
  //   // 直接跳转到笔记表单步骤
  //   setCurrentStep(2) // 假设笔记表单是第3步（索引为2）
  // }, [])

  // 计算咖啡粉量
  const getCoffeeAmount = () => {
    if (selectedMethod) {
      // 合并所有方案列表以确保查找全面
      const allMethods = [...availableMethods, ...customMethods]

      // 同时检查ID和名称匹配
      const method = allMethods.find(m =>
        m.id === selectedMethod || m.name === selectedMethod)

      if (method?.params?.coffee) {
        const match = method.params.coffee.match(/(\d+(\.\d+)?)/);
        return match ? parseFloat(match[0]) : 0
      }
    }
    return 0
  }

  // 获取方案参数
  const getMethodParams = () => {
    if (selectedEquipment && selectedMethod) {
      // 合并所有方案列表以确保查找全面
      const allMethods = [...availableMethods, ...customMethods]

      // 同时检查ID和名称匹配
      const methodObj = allMethods.find(m =>
        m.id === selectedMethod || m.name === selectedMethod)

      if (methodObj) {
        return {
          coffee: methodObj.params.coffee,
          water: methodObj.params.water,
          ratio: methodObj.params.ratio,
          grindSize: methodObj.params.grindSize,
          temp: methodObj.params.temp
        }
      }
    }
    return {
      coffee: '15g',
      water: '225g',
      ratio: '1:15',
      grindSize: locale === 'en' ? 'Medium Fine' : '中细',
      temp: '92°C'
    }
  }

  // 设置默认值 - 简化为函数调用，避免复杂的useMemo依赖
  const getDefaultNote = (): Partial<BrewingNoteData> => {
    const params = getMethodParams()
    const isNewNote = !initialNote?.id

    return {
      equipment: selectedEquipment,
      method: selectedMethod || '', // 如果没有选择方案，使用空字符串
      coffeeBean: selectedCoffeeBean,
      coffeeBeanInfo: selectedCoffeeBean ? {
        name: selectedCoffeeBean.name || '',
        roastLevel: selectedCoffeeBean.roastLevel || (locale === 'en' ? 'Medium' : '中度烘焙'),
        roastDate: selectedCoffeeBean.roastDate || ''
      } : {
        name: initialNote?.coffeeBeanInfo?.name || '',
        roastLevel: initialNote?.coffeeBeanInfo?.roastLevel || (locale === 'en' ? 'Medium' : '中度烘焙'),
        roastDate: initialNote?.coffeeBeanInfo?.roastDate || ''
      },
      params: initialNote?.params || params,
      rating: initialNote?.rating || 3,
      taste: initialNote?.taste || {
        acidity: 0,
        sweetness: 0,
        bitterness: 0,
        body: 0
      },
      notes: initialNote?.notes || '',
      ...(isNewNote ? {} : { id: initialNote?.id })
    }
  }

  // 处理步骤完成 - 使用useCallback优化并延迟事件触发
  const handleStepComplete = useCallback(() => {
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
      }
    }, 0)
  }, [])

  // 根据当前语言翻译烘焙度
  const translateRoastLevel = (roastLevel: string): string => {
    if (!roastLevel) return roastLevel;

    // 如果是英文环境，将中文烘焙度翻译为英文
    if (locale === 'en') {
      const roastMap: Record<string, string> = {
        '极浅烘焙': 'Light+',
        '浅度烘焙': 'Light',
        '中浅烘焙': 'Medium Light',
        '中度烘焙': 'Medium',
        '中深烘焙': 'Medium Dark',
        '深度烘焙': 'Dark'
      };
      return roastMap[roastLevel] || roastLevel;
    }

    // 如果是中文环境，将英文烘焙度翻译为中文
    if (locale === 'zh') {
      const roastMap: Record<string, string> = {
        'Light+': '极浅烘焙',
        'Ultra Light': '极浅烘焙',
        'Light': '浅度烘焙',
        'Medium Light': '中浅烘焙',
        'Medium': '中度烘焙',
        'Medium Dark': '中深烘焙',
        'Dark': '深度烘焙'
      };
      return roastMap[roastLevel] || roastLevel;
    }

    return roastLevel;
  };

  // 根据当前语言翻译研磨度
  const translateGrindSize = (grindSize: string): string => {
    if (!grindSize) return grindSize;

    // 如果是英文环境，将中文研磨度翻译为英文
    if (locale === 'en') {
      const grindMap: Record<string, string> = {
        '极细': 'Extra Fine',
        '特细': 'Very Fine',
        '细': 'Fine',
        '中细': 'Medium Fine',
        '中细偏粗': 'Medium Fine to Medium',
        '中粗': 'Medium Coarse',
        '粗': 'Coarse',
        '特粗': 'Very Coarse',
        '意式': 'Espresso'
      };
      return grindMap[grindSize] || grindSize;
    }

    // 如果是中文环境，将英文研磨度翻译为中文
    if (locale === 'zh') {
      const grindMap: Record<string, string> = {
        'Extra Fine': '极细',
        'Very Fine': '特细',
        'Fine': '细',
        'Medium Fine': '中细',
        'Medium Fine to Medium': '中细偏粗',
        'Medium Coarse': '中粗',
        'Coarse': '粗',
        'Very Coarse': '特粗',
        'Espresso': '意式'
      };
      return grindMap[grindSize] || grindSize;
    }

    return grindSize;
  };

  // 根据当前语言翻译方案名称
  const translateMethodName = (methodName: string): string => {
    if (!methodName) return methodName;

    // 如果是英文环境，将中文方案名称翻译为英文
    if (locale === 'en') {
      const methodMap: Record<string, string> = {
        '三段式(兼容性强)': 'Three-Stage (High Compatibility)',
        '四六法': 'Four-Six Method',
        '一刀流': 'One-Pour Method',
        '分段注水': 'Staged Pouring',
        '浸泡式': 'Immersion Method',
        '意式浓缩': 'Espresso',
        '美式咖啡': 'Americano',
        '拿铁': 'Latte',
        '卡布奇诺': 'Cappuccino'
      };
      return methodMap[methodName] || methodName;
    }

    // 如果是中文环境，将英文方案名称翻译为中文
    if (locale === 'zh') {
      const methodMap: Record<string, string> = {
        'Three-Stage (High Compatibility)': '三段式(兼容性强)',
        'Four-Six Method': '四六法',
        'One-Pour Method': '一刀流',
        'Staged Pouring': '分段注水',
        'Immersion Method': '浸泡式',
        'Espresso': '意式浓缩',
        'Americano': '美式咖啡',
        'Latte': '拿铁',
        'Cappuccino': '卡布奇诺'
      };
      return methodMap[methodName] || methodName;
    }

    return methodName;
  };

  // 根据当前语言翻译器具名称
  const translateEquipmentName = (equipmentName: string): string => {
    if (!equipmentName) return equipmentName;

    // 如果是英文环境，将中文器具名称翻译为英文
    if (locale === 'en') {
      const equipmentMap: Record<string, string> = {
        '蛋糕滤杯': 'Cake Filter',
        '手冲壶': 'Pour Over Kettle',
        '法压壶': 'French Press',
        '爱乐压': 'AeroPress',
        '摩卡壶': 'Moka Pot',
        '虹吸壶': 'Siphon',
        '冷萃壶': 'Cold Brew Maker',
        '意式咖啡机': 'Espresso Machine'
      };
      return equipmentMap[equipmentName] || equipmentName;
    }

    // 如果是中文环境，将英文器具名称翻译为中文
    if (locale === 'zh') {
      const equipmentMap: Record<string, string> = {
        'Cake Filter': '蛋糕滤杯',
        'Pour Over Kettle': '手冲壶',
        'French Press': '法压壶',
        'AeroPress': '爱乐压',
        'Moka Pot': '摩卡壶',
        'Siphon': '虹吸壶',
        'Cold Brew Maker': '冷萃壶',
        'Espresso Machine': '意式咖啡机'
      };
      return equipmentMap[equipmentName] || equipmentName;
    }

    return equipmentName;
  };

  // 处理保存笔记
  const handleSaveNote = (note: BrewingNoteData) => {
    // 获取方案名称
    let methodName = selectedMethod || '' // 如果没有选择方案，使用空字符串

    if (selectedMethod) {
      // 合并所有方案以便查找
      const allMethods = [...availableMethods, ...customMethods]

      // 在所有方案中查找匹配的方案
      const methodObj = allMethods.find(m =>
        m.id === selectedMethod || m.name === selectedMethod
      )

      if (methodObj) {
        // 如果找到匹配的方案，始终使用其名称
        methodName = methodObj.name
      }
    }

    // 创建完整笔记，确保所有文本字段按当前语言保存
    const completeNote: BrewingNoteData = {
      ...note,
      // 翻译器具名称
      equipment: translateEquipmentName(selectedEquipment || ''),
      // 翻译方案名称
      method: translateMethodName(methodName),
      // 移除完整的coffeeBean对象，避免可能引起的问题
      coffeeBean: undefined,
      // 重新设置参数以确保使用最新的方案参数，并翻译研磨度
      params: {
        ...(note.params || getMethodParams()),
        grindSize: translateGrindSize((note.params || getMethodParams()).grindSize || '')
      }
    }

    // 处理咖啡豆关联
    if (selectedCoffeeBean?.id) {
      completeNote["beanId"] = selectedCoffeeBean.id

      // 始终设置咖啡豆信息，确保烘焙度使用当前语言
      completeNote.coffeeBeanInfo = {
        name: selectedCoffeeBean.name || '',
        roastLevel: translateRoastLevel(selectedCoffeeBean.roastLevel || (locale === 'en' ? 'Medium' : '中度烘焙')),
        roastDate: selectedCoffeeBean.roastDate || ''
      }

      // 减少咖啡豆剩余量
      const coffeeAmount = getCoffeeAmount()
      if (coffeeAmount > 0) {
        CoffeeBeanManager.updateBeanRemaining(selectedCoffeeBean.id, coffeeAmount)
          .catch(error => console.error('减少咖啡豆剩余量失败:', error))
      }
    }

    // 保存并关闭
    onSave(completeNote)
    handleClose()

    // 如果提供了保存成功回调，则调用它
    if (onSaveSuccess) {
      onSaveSuccess()
    }
  }

  // 定义步骤
  const steps: Step[] = [
    // 只有当有咖啡豆时才添加咖啡豆选择步骤
    ...(coffeeBeans.length > 0 ? [{
      id: 'coffeeBean',
      label: '选择咖啡豆',
      content: (
        <CoffeeBeanSelector
          coffeeBeans={coffeeBeans}
          selectedCoffeeBean={selectedCoffeeBean}
          onSelect={handleCoffeeBeanSelect}
        />
      ),
      isValid: true // 咖啡豆选择为可选
    }] : []),
    {
      id: 'method',
      label: '选择方案',
      content: (
        <div>
          {/* 器具分类栏 */}
          <EquipmentCategoryBar
            selectedEquipment={selectedEquipment}
            customEquipments={customEquipments}
            onEquipmentSelect={handleEquipmentSelect}
          />
          {/* 方案选择 */}
          {selectedEquipment && (
            <MethodSelector
              selectedEquipment={selectedEquipment}
              selectedMethod={selectedMethod}
              customMethods={customMethods}
              commonMethods={selectedEquipment ? (commonMethods as any)[selectedEquipment] || [] : []}
              onMethodSelect={setSelectedMethod}
              onParamsChange={_handleMethodParamsChange}
              // onSkipMethodSelection={handleSkipMethodSelection} // 暂时移除
            />
          )}
        </div>
      ),
      isValid: !!selectedEquipment // 只要选择了设备就有效，方案选择是可选的
    },
    {
      id: 'note-form',
      label: '冲煮笔记',
      content: (
        <BrewingNoteForm
          id={initialNote?.id}
          isOpen={true}
          onClose={() => {}} // 不提供关闭功能，由模态框控制
          onSave={handleSaveNote}
          initialData={getDefaultNote()}
          inBrewPage={true}
          showSaveButton={false}
          onSaveSuccess={onSaveSuccess}
        />
      ),
      isValid: true
    }
  ]

  return (
    <>
      <SteppedFormModal
        showForm={showForm}
        onClose={handleClose}
        onComplete={handleStepComplete}
        steps={steps}
        initialStep={0}
        preserveState={true}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onRandomBean={handleOpenRandomPicker}
      />

      {/* 随机选择器 */}
      <CoffeeBeanRandomPicker
        beans={coffeeBeans}
        isOpen={isRandomPickerOpen}
        onClose={() => setIsRandomPickerOpen(false)}
        onSelect={handleRandomBeanSelect}
      />
    </>
  )
}

export default BrewingNoteFormModal