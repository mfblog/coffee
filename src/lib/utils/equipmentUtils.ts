import { CustomEquipment } from '@/lib/core/config';
import { translateBrewingTerm } from '@/lib/core/config-i18n';

/**
 * 判断是否是意式机
 * @param customEquipment 自定义设备对象
 * @returns 是否为意式机
 */
export const isEspressoMachine = (customEquipment: CustomEquipment): boolean => {
  return customEquipment.animationType === 'espresso';
};

/**
 * 获取注水方式的显示名称
 * @param pourType 注水类型
 * @param locale 语言环境，默认为中文
 * @returns 注水方式的翻译名称
 */
export const getPourTypeName = (pourType?: string, locale: string = 'zh'): string => {
  if (!pourType) return translateBrewingTerm('请选择注水方式', locale);

  switch (pourType) {
    case 'extraction':
      return translateBrewingTerm('萃取浓缩', locale);
    case 'beverage':
      return translateBrewingTerm('饮料', locale);
    case 'other':
      return translateBrewingTerm('其他', locale);
    case 'center':
      return translateBrewingTerm('中心注水', locale);
    case 'circle':
      return translateBrewingTerm('绕圈注水', locale);
    case 'ice':
      return translateBrewingTerm('添加冰块', locale);
    default:
      return pourType;
  }
};

/**
 * 判断设备是否有阀门
 * @param customEquipment 自定义设备对象
 * @returns 是否有阀门
 */
export const hasValve = (customEquipment: CustomEquipment): boolean => {
  return !!customEquipment.hasValve;
};

/**
 * 获取设备的默认注水方式
 * @param customEquipment 自定义设备对象
 * @returns 默认的注水方式
 */
export const getDefaultPourType = (customEquipment: CustomEquipment): string => {
  // 根据器具类型返回默认注水方式
  switch (customEquipment.animationType) {
    case 'espresso':
      return 'extraction'; // 意式机默认使用萃取浓缩模式
    case 'v60':
    case 'origami':
      return 'circle'; // V60和Origami默认使用绕圈注水
    case 'kalita':
      return 'center'; // Kalita默认使用中心注水
    case 'clever':
      return 'circle'; // 聪明杯默认使用绕圈注水
    case 'custom':
  // 如果是自定义预设并且有自定义注水动画
      if (customEquipment.customPourAnimations && 
      customEquipment.customPourAnimations.length > 0) {
    
    // 先找系统默认的动画
    const defaultAnimation = customEquipment.customPourAnimations.find(
      anim => anim.isSystemDefault && anim.pourType
    );
    
    if (defaultAnimation && defaultAnimation.pourType) {
      return defaultAnimation.pourType;
    }
    
    // 没有系统默认动画就用第一个动画
    const firstAnimation = customEquipment.customPourAnimations[0];
    if (firstAnimation.pourType) {
      return firstAnimation.pourType;
    }
    
    return firstAnimation.id;
  }
      // 如果没有自定义注水动画，默认使用绕圈注水
      return 'circle';
    default:
      return 'circle';
  }
}; 