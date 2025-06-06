import { useLocale } from 'next-intl';
import { translateGrinder, translateEquipment, translateBrewingMethod, translateBrewingTerm } from '@/lib/core/config-i18n';
import { availableGrinders, equipmentList, type Grinder, type Equipment } from '@/lib/core/config';

// 简化的翻译钩子
export function useConfigTranslation() {
  const locale = useLocale();

  return {
    // 翻译磨豆机名称
    translateGrinder: (grinderId: string): string => {
      return translateGrinder(grinderId, locale);
    },

    // 翻译器具名称
    translateEquipment: (equipmentId: string): string => {
      return translateEquipment(equipmentId, locale);
    },

    // 翻译冲煮方案名称
    translateBrewingMethod: (equipmentId: string, methodName: string): string => {
      return translateBrewingMethod(equipmentId, methodName, locale);
    },

    // 翻译冲煮术语
    translateBrewingTerm: (term: string): string => {
      return translateBrewingTerm(term, locale);
    },

    // 获取翻译后的磨豆机列表
    getTranslatedGrinders: (): Array<Grinder & { translatedName: string }> => {
      return availableGrinders.map(grinder => ({
        ...grinder,
        translatedName: translateGrinder(grinder.id, locale)
      }));
    },

    // 获取翻译后的器具列表
    getTranslatedEquipment: (): Array<Equipment & { translatedName: string }> => {
      return equipmentList.map(equipment => ({
        ...equipment,
        translatedName: translateEquipment(equipment.id, locale)
      }));
    },

    // 翻译研磨度数值中的单位
    translateGrindSizeValue: (value: string): string => {
      if (!value) return value;

      // 单位翻译映射
      const unitTranslations: Record<string, string> = {
        '格': locale === 'en' ? 'Grid' : '格',
        '圈': locale === 'en' ? 'Circle' : '圈',
        '档': locale === 'en' ? 'Gear' : '档',
        '刻度': locale === 'en' ? 'Scale' : '刻度',
        '级': locale === 'en' ? 'Level' : '级',
      };

      let translatedValue = value;
      Object.entries(unitTranslations).forEach(([chinese, translated]) => {
        translatedValue = translatedValue.replace(new RegExp(chinese, 'g'), translated);
      });

      return translatedValue;
    },

    // 当前语言
    locale
  };
}
