import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { formatGrindSize } from '@/lib/utils/grindUtils';
import { Grinder, availableGrinders, CustomEquipment } from '@/lib/core/config';
import { SettingsOptions } from '@/components/settings/Settings';
import { isEspressoMachine } from '@/lib/utils/equipmentUtils';
import { useConfigTranslation } from '@/lib/utils/i18n-config';

// 动画变体
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.26
};

interface ParamsStepProps {
  params: {
    coffee: string;
    water: string;
    ratio: string;
    grindSize: string;
    temp: string;
    // 意式机特有参数
    extractionTime?: number;
    liquidWeight?: string;
  };
  onCoffeeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRatioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGrindSizeChange: (grindSize: string) => void;
  onTempChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // 意式机特有参数的处理函数
  onExtractionTimeChange?: (value: number) => void;
  onLiquidWeightChange?: (value: string) => void;
  settings: SettingsOptions;
  customEquipment?: CustomEquipment;
}

const ParamsStep: React.FC<ParamsStepProps> = ({
  params,
  onCoffeeChange,
  onRatioChange,
  onGrindSizeChange,
  onTempChange,
  onExtractionTimeChange,
  onLiquidWeightChange,
  settings,
  customEquipment
}) => {
  const tMethods = useTranslations('brewing.methods');
  const tParams = useTranslations('brewing.form.params');
  const locale = useLocale();
  const { translateGrinder, translateBrewingTerm } = useConfigTranslation();

  // 检查是否是意式机
  const isEspresso = customEquipment ? isEspressoMachine(customEquipment) : false;

  // 查找选定的研磨机
  const selectedGrinder = availableGrinders.find((g: Grinder) => g.id === settings.grindType);
  const grinderName = selectedGrinder ? translateGrinder(selectedGrinder.id) : translateBrewingTerm('通用');
  const showSpecificGrindInfo = selectedGrinder && selectedGrinder.id !== 'generic' && selectedGrinder.grindSizes;

  // 研磨度参考提示渲染函数
  const renderGrindSizeHints = () => {
    if (params.grindSize) return null;
    
    return (
      <div className="mt-1 text-xs space-y-1">
        <p className="text-neutral-500 dark:text-neutral-400">{tParams('grindSizeReference.general')}</p>
        {selectedGrinder && selectedGrinder.grindSizes ? (
          // 显示特定研磨机的提示
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {Object.entries(selectedGrinder.grindSizes)
              .filter(([key]) => {
                // 只显示粗细度类型，而不是冲煮器具名称
                const basicKeywords = ['极细', '特细', '细', '中细', '中细偏粗', '中粗', '粗', '特粗'];
                return basicKeywords.includes(key);
              })
              .map(([key, value]) => (
                <p key={key} className="text-neutral-500 dark:text-neutral-400">· {key}: {value}</p>
              ))
            }
          </div>
        ) : (
          // 显示通用提示
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {isEspresso ? (
              <>
                <p className="text-neutral-500 dark:text-neutral-400">· {tParams('grindSizes.extraFine')}</p>
                <p className="text-neutral-500 dark:text-neutral-400">· {tParams('grindSizes.espressoGrade')}</p>
              </>
            ) : (
              <>
                <p className="text-neutral-500 dark:text-neutral-400">· {tParams('grindSizes.extraFine')}</p>
                <p className="text-neutral-500 dark:text-neutral-400">· {tParams('grindSizes.fine')}</p>
                <p className="text-neutral-500 dark:text-neutral-400">· {tParams('grindSizes.mediumFine')}</p>
                <p className="text-neutral-500 dark:text-neutral-400">· {tParams('grindSizes.mediumCoarse')}</p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      key="params-step"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-10 max-w-md mx-auto pt-10 pb-20"
    >
      <div className="grid grid-cols-2 gap-6">
        {/* 咖啡粉量 */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {tMethods('params.coffee')}
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder={isEspresso ? tParams('examples.coffee.espresso') : tParams('examples.coffee.filter')}
              value={params.coffee.replace('g', '')}
              onChange={onCoffeeChange}
              onFocus={(e) => e.target.select()}
              className="w-full py-2 bg-transparent outline-hidden border-b border-neutral-300 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-400"
            />
            <span className="absolute right-0 bottom-2 text-neutral-500 dark:text-neutral-400">{tMethods('units.grams')}</span>
          </div>
        </div>

        {/* 水粉比 */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {tMethods('params.ratio')}
          </label>
          <div className="relative">
            <span className="absolute left-0 bottom-2 text-neutral-500 dark:text-neutral-400">1:</span>
            <input
              type="number"
              min="0"
              step="0.1"
              placeholder={isEspresso ? tParams('examples.ratio.espresso') : tParams('examples.ratio.filter')}
              value={params.ratio.replace('1:', '')}
              onChange={onRatioChange}
              onFocus={(e) => e.target.select()}
              className="w-full py-2 pl-6 bg-transparent outline-hidden border-b border-neutral-300 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-400"
            />
          </div>
        </div>

        {/* 意式机特有字段 - 液重 */}
        {isEspresso && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {tMethods('params.liquidWeight')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder={tParams('examples.liquidWeight')}
                value={(params.liquidWeight || params.water).replace('g', '')}
                onChange={(e) => {
                  if (onLiquidWeightChange) {
                    onLiquidWeightChange(`${e.target.value}g`);
                  }
                }}
                onFocus={(e) => e.target.select()}
                className="w-full py-2 bg-transparent outline-hidden border-b border-neutral-300 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-400"
              />
              <span className="absolute right-0 bottom-2 text-neutral-500 dark:text-neutral-400">{tMethods('units.grams')}</span>
            </div>
          </div>
        )}

        {/* 意式机特有字段 - 萃取时间 */}
        {isEspresso && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {tMethods('params.extractionTime')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                placeholder={tParams('examples.extractionTime')}
                value={params.extractionTime || ''}
                onChange={(e) => {
                  if (onExtractionTimeChange) {
                    onExtractionTimeChange(parseInt(e.target.value) || 0);
                  }
                }}
                onFocus={(e) => e.target.select()}
                className="w-full py-2 bg-transparent outline-hidden border-b border-neutral-300 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-400"
              />
              <span className="absolute right-0 bottom-2 text-neutral-500 dark:text-neutral-400">{tMethods('units.seconds')}</span>
            </div>
          </div>
        )}

        {/* 研磨度 */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {tMethods('params.grindSize')} {grinderName !== translateBrewingTerm('通用') && <span className="text-xs text-neutral-400">({grinderName})</span>}
          </label>
          <input
            type="text"
            value={params.grindSize || ''}
            onChange={(e) => onGrindSizeChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder={
              isEspresso
                ? tParams('examples.grindSize.espresso')
                : (selectedGrinder?.id === "phanci_pro"
                  ? tParams('examples.grindSize.phanciPro')
                  : tParams('examples.grindSize.general'))
            }
            className="w-full py-2 bg-transparent outline-hidden border-b border-neutral-300 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-400"
          />
          {params.grindSize && showSpecificGrindInfo && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {tParams('grindSizeReference.specific', { grinder: grinderName, scale: formatGrindSize(params.grindSize, settings.grindType, locale) })}
            </p>
          )}

          {/* 研磨度参考提示 */}
          {renderGrindSizeHints()}
        </div>

        {/* 只在非意式机模式下显示水温字段 */}
        {!isEspresso && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {tMethods('params.temperature')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder={tParams('examples.temperature')}
                value={params.temp ? params.temp.replace('°C', '') : ''}
                onChange={onTempChange}
                onFocus={(e) => e.target.select()}
                className="w-full py-2 bg-transparent outline-hidden border-b border-neutral-300 dark:border-neutral-700 focus:border-neutral-800 dark:focus:border-neutral-400"
              />
              <span className="absolute right-0 bottom-2 text-neutral-500 dark:text-neutral-400">{tMethods('units.celsius')}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ParamsStep; 