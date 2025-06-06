/**
 * 数据翻译工具 - 用于处理存储在数据库中的中文选项值的翻译
 * 解决语言切换时数据显示不一致的问题
 */

// 烘焙度映射表
export const ROAST_LEVEL_MAP = {
  // 中文完整版 -> 英文键
  '极浅烘焙': 'ultraLight',
  '浅度烘焙': 'light',
  '中浅烘焙': 'mediumLight',
  '中度烘焙': 'medium',
  '中深烘焙': 'mediumDark',
  '深度烘焙': 'dark',
  // 中文简化版 -> 英文键
  '极浅': 'ultraLight',
  '浅度': 'light',
  '中浅': 'mediumLight',
  '中度': 'medium',
  '中深': 'mediumDark',
  '深度': 'dark',
  // 更多变体
  '中深度': 'mediumDark',
  '浅': 'light',
  '深': 'dark',
  // 英文键 -> 中文
  'ultraLight': '极浅烘焙',
  'light': '浅度烘焙',
  'mediumLight': '中浅烘焙',
  'medium': '中度烘焙',
  'mediumDark': '中深烘焙',
  'dark': '深度烘焙'
} as const;

// 咖啡豆状态映射表
export const BEAN_STATUS_MAP = {
  // 中文 -> 英文键
  '养豆期': 'aging',
  '赏味期': 'peak',
  '衰退期': 'decline', 
  '在途': 'transit',
  '冰冻': 'frozen',
  '未知': 'unknown',
  // 英文键 -> 中文
  'aging': '养豆期',
  'peak': '赏味期',
  'decline': '衰退期',
  'transit': '在途', 
  'frozen': '冰冻',
  'unknown': '未知'
} as const;

// 咖啡豆类型映射表
export const BEAN_TYPE_MAP = {
  // 中文 -> 英文键
  '手冲豆': 'filter',
  '意式豆': 'espresso',
  // 英文键 -> 中文
  'filter': '手冲豆',
  'espresso': '意式豆'
} as const;

/**
 * 获取烘焙度的翻译键
 */
export function getRoastLevelKey(roastLevel: string): string {
  if (!roastLevel) return 'medium'; // 默认值

  // 直接匹配
  if (roastLevel in ROAST_LEVEL_MAP) {
    const key = ROAST_LEVEL_MAP[roastLevel as keyof typeof ROAST_LEVEL_MAP];
    // 如果映射结果是英文键，返回它；否则继续处理
    if (typeof key === 'string' && key.match(/^[a-zA-Z]+$/)) {
      return key;
    }
  }

  // 模糊匹配 - 处理包含关系，按照优先级排序
  if (roastLevel.includes('极浅')) return 'ultraLight';
  if (roastLevel.includes('中浅')) return 'mediumLight';  // 必须在 '浅' 之前
  if (roastLevel.includes('中深')) return 'mediumDark';   // 必须在 '深' 之前
  if (roastLevel.includes('浅')) return 'light';
  if (roastLevel.includes('深')) return 'dark';
  if (roastLevel.includes('中')) return 'medium';

  // 如果已经是英文键，直接返回
  if (['ultraLight', 'light', 'mediumLight', 'medium', 'mediumDark', 'dark'].includes(roastLevel)) {
    return roastLevel;
  }

  // 默认返回中度
  console.warn(`Unknown roast level: ${roastLevel}, defaulting to medium`);
  return 'medium';
}

/**
 * 获取咖啡豆状态的翻译键
 */
export function getBeanStatusKey(status: string): string {
  if (status in BEAN_STATUS_MAP) {
    const key = BEAN_STATUS_MAP[status as keyof typeof BEAN_STATUS_MAP];
    return typeof key === 'string' && key.match(/^[a-zA-Z]+$/) ? key : status;
  }
  return status;
}

/**
 * 获取咖啡豆类型的翻译键
 */
export function getBeanTypeKey(beanType: string): string {
  if (beanType in BEAN_TYPE_MAP) {
    const key = BEAN_TYPE_MAP[beanType as keyof typeof BEAN_TYPE_MAP];
    return typeof key === 'string' && key.match(/^[a-zA-Z]+$/) ? key : beanType;
  }
  return beanType;
}

/**
 * 检查烘焙度是否为浅烘焙（用于赏味期计算）
 */
export function isLightRoast(roastLevel: string): boolean {
  const key = getRoastLevelKey(roastLevel);
  return key === 'ultraLight' || key === 'light' || roastLevel.includes('浅');
}

/**
 * 检查烘焙度是否为深烘焙（用于赏味期计算）
 */
export function isDarkRoast(roastLevel: string): boolean {
  const key = getRoastLevelKey(roastLevel);
  return key === 'mediumDark' || key === 'dark' || roastLevel.includes('深');
}

/**
 * 数据迁移：将咖啡豆数据中的中文选项值转换为英文键
 */
export function migrateCoffeeBeanData(bean: any): any {
  const migratedBean = { ...bean };

  // 迁移烘焙度
  if (migratedBean.roastLevel && typeof migratedBean.roastLevel === 'string') {
    const roastKey = getRoastLevelKey(migratedBean.roastLevel);
    if (roastKey !== migratedBean.roastLevel) {
      migratedBean.roastLevel = roastKey;
    }
  }

  // 迁移咖啡豆类型
  if (migratedBean.beanType && typeof migratedBean.beanType === 'string') {
    const typeKey = getBeanTypeKey(migratedBean.beanType);
    if (typeKey !== migratedBean.beanType) {
      migratedBean.beanType = typeKey;
    }
  }

  return migratedBean;
}

/**
 * 批量迁移咖啡豆数据
 */
export function migrateCoffeeBeansArray(beans: any[]): any[] {
  return beans.map(bean => migrateCoffeeBeanData(bean));
}

/**
 * 迁移完整的应用数据
 */
export function migrateAppData(data: any): any {
  const migratedData = { ...data };

  // 迁移咖啡豆数据
  if (migratedData.coffeeBeans && Array.isArray(migratedData.coffeeBeans)) {
    migratedData.coffeeBeans = migrateCoffeeBeansArray(migratedData.coffeeBeans);
  }

  return migratedData;
}

/**
 * 创建翻译函数，用于在界面中显示翻译后的值
 */
export function createTranslationHelpers(t: (key: string) => string) {
  return {
    /**
     * 翻译烘焙度
     */
    translateRoastLevel: (roastLevel: string): string => {
      try {
        const key = getRoastLevelKey(roastLevel);
        const translated = t(`roastLevels.${key}`);
        return translated;
      } catch (error) {
        // 如果翻译失败，返回原值或默认值
        console.warn(`Failed to translate roast level: ${roastLevel}`, error);
        return roastLevel || '中度烘焙';
      }
    },

    /**
     * 翻译咖啡豆状态
     */
    translateBeanStatus: (status: string): string => {
      try {
        const key = getBeanStatusKey(status);
        const translated = t(`beanStatus.${key}`);
        return translated;
      } catch (error) {
        console.warn(`Failed to translate bean status: ${status}`, error);
        return status || '未知';
      }
    },

    /**
     * 翻译咖啡豆类型
     */
    translateBeanType: (beanType: string): string => {
      try {
        const key = getBeanTypeKey(beanType);
        const translated = t(`beanTypes.${key}`);
        return translated;
      } catch (error) {
        console.warn(`Failed to translate bean type: ${beanType}`, error);
        return beanType || '手冲豆';
      }
    }
  };
}
