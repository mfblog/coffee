// 简化的多语言配置
export interface I18nConfig {
  grinders: Record<string, string>;
  equipment: Record<string, string>;
  brewingMethods: Record<string, Record<string, string>>;
  brewingTerms: Record<string, string>;
}

// 中文配置
export const zhConfig: I18nConfig = {
  grinders: {
    generic: "通用",
    phanci_pro: "幻刺 Pro",
    c40: "C40",
    lagom_01: "Lagom 01",
    varia_evo: "Varia EVO",
    "1z_kultra": "1z KUltra",
    c3: "栗子 C3",
    c3_esp: "栗子 C3ESP",
    c3_slim: "栗子 Slim",
    hanjian_k6: "汉匠 K6",
    hanjian_k4: "汉匠 K4",
    hanjian_k0: "汉匠 K0",
    hanjian_k1: "汉匠 K1",
    hanjian_k2: "汉匠 K2",
    the2: "大诗 The2",
    foshan: "佛山磨公版磨",
    explorer_edge_plus: "探索者 Edge+",
    wizard_2: "巫师 2 意式版",
    liren_r3: "利刃 R3"
  },
  equipment: {
    V60: "V60",
    CleverDripper: "聪明杯",
    Kalita: "蛋糕滤杯",
    Origami: "折纸滤杯",
    Espresso: "意式咖啡机",
    "蛋糕滤杯": "蛋糕滤杯",
    "手冲壶": "手冲壶",
    "法压壶": "法压壶",
    "爱乐压": "爱乐压",
    "摩卡壶": "摩卡壶",
    "虹吸壶": "虹吸壶",
    "冷萃壶": "冷萃壶",
    "意式咖啡机": "意式咖啡机",
    "Clever": "聪明杯"
  },
  brewingMethods: {
    V60: {
      "一刀流(萃取稳定)": "一刀流(萃取稳定)",
      "三段式(兼容性强)": "三段式(兼容性强)",
      "粕谷哲4:6法(甜而平衡)": "粕谷哲4:6法(甜而平衡)",
      "张师傅1:2:3冲煮法(群友力推)": "张师傅1:2:3冲煮法(群友力推)",
      "冰手冲(清爽明亮)": "冰手冲(清爽明亮)"
    },
    CleverDripper: {
      "万能冲煮方案(兼容性强)": "万能冲煮方案(兼容性强)",
      "冠军冲煮方案(简单好用)": "冠军冲煮方案(简单好用)"
    },
    Kalita: {
      "三段式(兼容性强)": "三段式(兼容性强)"
    },
    Origami: {
      "三段式(兼容性强)": "三段式(兼容性强)"
    },
    Espresso: {
      "意式浓缩": "意式浓缩",
      "冰美式": "冰美式",
      "拿铁": "拿铁",
      "生椰拿铁(百喝不腻)": "生椰拿铁(百喝不腻)",
      "椰青美式(清爽喝不腻)": "椰青美式(清爽喝不腻)",
      "茉莉花香拿铁(超爱！)": "茉莉花香拿铁(超爱！)",
      "橙C美式(果咖必喝)": "橙C美式(果咖必喝)",
      "葡萄冰萃美式(果咖必喝)": "葡萄冰萃美式(果咖必喝)",
      "西班牙拿铁": "西班牙拿铁"
    }
  },
  brewingTerms: {
    // 研磨度
    "极细": "极细",
    "特细": "特细",
    "细": "细",
    "中细": "中细",
    "中细偏粗": "中细偏粗",
    "中粗": "中粗",
    "粗": "粗",
    "特粗": "特粗",
    "意式": "意式",
    // 注水方式
    "绕圈注水": "绕圈注水",
    "中心注水": "中心注水",
    "焖蒸": "焖蒸",
    "萃取浓缩": "萃取浓缩",
    "标准意式浓缩": "标准意式浓缩",
    "饮料": "饮料",
    "其他": "其他",
    "请选择注水方式": "请选择注水方式",
    "添加冰块": "添加冰块",
    "加入饮用水": "加入饮用水",
    "加入冰块": "加入冰块",
    "加入牛奶": "加入牛奶",
    "加入糖浆": "加入糖浆",
    "加入椰厚乳": "加入椰厚乳",
    "加入菲诺椰子水": "加入菲诺椰子水",
    "加入康师傅茉莉蜜茶": "加入康师傅茉莉蜜茶",
    "加入鲜牛奶": "加入鲜牛奶",
    "加入NFC橙汁": "加入NFC橙汁",
    "加入糖浆(可选)": "加入糖浆(可选)",
    "加入NFC葡萄汁": "加入NFC葡萄汁",
    "加入元气森林葡萄气泡水": "加入元气森林葡萄气泡水",
    "加入炼乳": "加入炼乳",
    // 烘焙度
    "极浅烘焙": "极浅烘焙",
    "浅度烘焙": "浅度烘焙",
    "中浅烘焙": "中浅烘焙",
    "中度烘焙": "中度烘焙",
    "中深烘焙": "中深烘焙",
    "深度烘焙": "深度烘焙",
    // 阀门状态
    "关阀": "关阀",
    "开阀": "开阀",
    // 其他术语
    "等待滴滤完成": "等待滴滤完成",
    "等咖啡液流完": "等咖啡液流完",
    "降温绕圈注水": "降温绕圈注水",
    "通用方案": "通用方案",
    "通用": "通用",
    "粉量": "粉量",
    "液重": "液重",
    "萃取时间": "萃取时间",
    "水粉比": "水粉比",
    "总时长": "总时长",
    "研磨度": "研磨度",
    // 冲煮步骤描述
    "中心向外绕圈，确保均匀萃取": "中心向外绕圈，确保均匀萃取",
    "中心向外缓慢画圈注水，均匀萃取咖啡风味": "中心向外缓慢画圈注水，均匀萃取咖啡风味",
    "使咖啡粉充分吸水并释放气体，提升萃取效果": "使咖啡粉充分吸水并释放气体，提升萃取效果",
    "甜度控制，中心圆形注水，确保均匀浸润": "甜度控制，中心圆形注水，确保均匀浸润",
    "甜度控制，大水流中心圆形注水": "甜度控制，大水流中心圆形注水",
    "酸度控制，大水流中心向外螺旋注水": "酸度控制，大水流中心向外螺旋注水",
    "绕圈注水，确保均匀萃取": "绕圈注水，确保均匀萃取",
    "绕圈注水，继续萃取": "绕圈注水，继续萃取",
    "绕圈注水至边缘，完成后杯中加满新鲜冰块": "绕圈注水至边缘，完成后杯中加满新鲜冰块",
    "关闭阀门，绕圈注水": "关闭阀门，绕圈注水",
    "打开阀门，绕圈注水": "打开阀门，绕圈注水",
    "保持开阀，绕圈注水": "保持开阀，绕圈注水",
    "关闭阀门，倒入冷水，降温至70-80°C注水": "关闭阀门，倒入冷水，降温至70-80°C注水",
    "打开阀门等等滴滤完成": "打开阀门等等滴滤完成",
    "打开阀门，等待咖啡液流完": "打开阀门，等待咖啡液流完",
    "保持开阀，由外向内边缘绕圈注水(冲掉边缘咖啡粉)": "保持开阀，由外向内边缘绕圈注水(冲掉边缘咖啡粉)",
    "(分享壶中预先放入50g冰块) 绕圈注水，确保均匀萃取": "(分享壶中预先放入50g冰块) 绕圈注水，确保均匀萃取",
    // 阶段标识
    "焖蒸(绕圈注水)": "焖蒸(绕圈注水)",
    "焖蒸（绕圈注水）": "焖蒸（绕圈注水）",
    "绕圈注水 (1/2)": "绕圈注水 (1/2)",
    "绕圈注水 (2/2)": "绕圈注水 (2/2)",
    "绕圈注水 (1/3)": "绕圈注水 (1/3)",
    "绕圈注水 (2/3)": "绕圈注水 (2/3)",
    "绕圈注水 (3/3)": "绕圈注水 (3/3)",
    "[关阀]绕圈注水": "[关阀]绕圈注水",
    "[开阀]绕圈注水": "[开阀]绕圈注水",
    "[关阀]降温绕圈注水": "[关阀]降温绕圈注水",
    "[开阀]等待滴滤完成": "[开阀]等待滴滤完成",
    "[开阀]等咖啡液流完": "[开阀]等咖啡液流完",
    // 阶段数字
    "2 阶段": "2 阶段",
    "3 阶段": "3 阶段",
    "4 阶段": "4 阶段",
    "5 阶段": "5 阶段",
    // 参数标签
    "咖啡粉": "咖啡粉",
    "水量": "水量",
    "等待": "等待",
    "流速": "流速"
  }
};

// 英文配置
export const enConfig: I18nConfig = {
  grinders: {
    generic: "Generic",
    phanci_pro: "Phanci Pro",
    c40: "C40",
    lagom_01: "Lagom 01",
    varia_evo: "Varia EVO",
    "1z_kultra": "1z KUltra",
    c3: "Chestnut C3",
    c3_esp: "Chestnut C3ESP",
    c3_slim: "Chestnut Slim",
    hanjian_k6: "Hanjian K6",
    hanjian_k4: "Hanjian K4",
    hanjian_k0: "Hanjian K0",
    hanjian_k1: "Hanjian K1",
    hanjian_k2: "Hanjian K2",
    the2: "Dashi The2",
    foshan: "Foshan Generic Grinder",
    explorer_edge_plus: "Explorer Edge+",
    wizard_2: "Wizard 2 Espresso",
    liren_r3: "Liren R3"
  },
  equipment: {
    V60: "V60",
    CleverDripper: "Clever Dripper",
    Kalita: "Kalita Wave",
    Origami: "Origami Dripper",
    Espresso: "Espresso Machine",
    "蛋糕滤杯": "Cake Filter",
    "手冲壶": "Pour Over Kettle",
    "法压壶": "French Press",
    "爱乐压": "AeroPress",
    "摩卡壶": "Moka Pot",
    "虹吸壶": "Siphon",
    "冷萃壶": "Cold Brew Maker",
    "意式咖啡机": "Espresso Machine",
    "Clever": "Clever Dripper"
  },
  brewingMethods: {
    V60: {
      "一刀流(萃取稳定)": "One Pour (Stable Extraction)",
      "三段式(兼容性强)": "Three-Stage (Versatile)",
      "粕谷哲4:6法(甜而平衡)": "Kasuya 4:6 Method (Sweet & Balanced)",
      "张师傅1:2:3冲煮法(群友力推)": "Master Zhang 1:2:3 Method (Community Favorite)",
      "冰手冲(清爽明亮)": "Iced Pour Over (Refreshing & Bright)"
    },
    CleverDripper: {
      "万能冲煮方案(兼容性强)": "Universal Brewing Method (Versatile)",
      "冠军冲煮方案(简单好用)": "Champion Brewing Method (Simple & Effective)"
    },
    Kalita: {
      "三段式(兼容性强)": "Three-Stage (Versatile)"
    },
    Origami: {
      "三段式(兼容性强)": "Three-Stage (Versatile)"
    },
    Espresso: {
      "意式浓缩": "Espresso",
      "冰美式": "Iced Americano",
      "拿铁": "Latte",
      "生椰拿铁(百喝不腻)": "Coconut Latte (Never Gets Old)",
      "椰青美式(清爽喝不腻)": "Coconut Water Americano (Refreshing)",
      "茉莉花香拿铁(超爱！)": "Jasmine Latte (Love It!)",
      "橙C美式(果咖必喝)": "Orange Americano (Fruit Coffee Must-Try)",
      "葡萄冰萃美式(果咖必喝)": "Grape Cold Brew Americano (Fruit Coffee Must-Try)",
      "西班牙拿铁": "Spanish Latte"
    }
  },
  brewingTerms: {
    // 研磨度
    "极细": "Extra Fine",
    "特细": "Very Fine",
    "细": "Fine",
    "中细": "Medium Fine",
    "中细偏粗": "Medium Fine to Medium",
    "中粗": "Medium Coarse",
    "粗": "Coarse",
    "特粗": "Very Coarse",
    "意式": "Espresso",
    // 注水方式
    "绕圈注水": "Circular Pour",
    "中心注水": "Center Pour",
    "焖蒸": "Bloom",
    "萃取浓缩": "Extract Espresso",
    "标准意式浓缩": "Standard Espresso",
    "饮料": "Beverage",
    "其他": "Other",
    "请选择注水方式": "Please select pour type",
    "添加冰块": "Add Ice",
    "加入饮用水": "Add Drinking Water",
    "加入冰块": "Add Ice",
    "加入牛奶": "Add Milk",
    "加入糖浆": "Add Syrup",
    "加入椰厚乳": "Add Coconut Cream",
    "加入菲诺椰子水": "Add Fino Coconut Water",
    "加入康师傅茉莉蜜茶": "Add Master Kong Jasmine Honey Tea",
    "加入鲜牛奶": "Add Fresh Milk",
    "加入NFC橙汁": "Add NFC Orange Juice",
    "加入糖浆(可选)": "Add Syrup (Optional)",
    "加入NFC葡萄汁": "Add NFC Grape Juice",
    "加入元气森林葡萄气泡水": "Add Genki Forest Grape Sparkling Water",
    "加入炼乳": "Add Condensed Milk",
    // 烘焙度
    "极浅烘焙": "Ultra Light Roast",
    "浅度烘焙": "Light Roast",
    "中浅烘焙": "Medium Light Roast",
    "中度烘焙": "Medium Roast",
    "中深烘焙": "Medium Dark Roast",
    "深度烘焙": "Dark Roast",
    // 阀门状态
    "关阀": "Close Valve",
    "开阀": "Open Valve",
    // 其他术语
    "等待滴滤完成": "Wait for Drip to Complete",
    "等咖啡液流完": "Wait for Coffee to Finish Dripping",
    "降温绕圈注水": "Cool Down Circular Pour",
    "通用方案": "Common Methods",
    "通用": "Generic",
    "粉量": "Coffee Amount",
    "液重": "Liquid Weight",
    "萃取时间": "Extraction Time",
    "水粉比": "Ratio",
    "总时长": "Total Time",
    "研磨度": "Grind Size",
    // 冲煮步骤描述
    "中心向外绕圈，确保均匀萃取": "Pour from center outward in circles for even extraction",
    "中心向外缓慢画圈注水，均匀萃取咖啡风味": "Slowly pour in circles from center outward for even flavor extraction",
    "使咖啡粉充分吸水并释放气体，提升萃取效果": "Allow coffee grounds to fully absorb water and release gases to improve extraction",
    "甜度控制，中心圆形注水，确保均匀浸润": "Sweetness control, center circular pour for even saturation",
    "甜度控制，大水流中心圆形注水": "Sweetness control, high flow center circular pour",
    "酸度控制，大水流中心向外螺旋注水": "Acidity control, high flow center-outward spiral pour",
    "绕圈注水，确保均匀萃取": "Circular pour for even extraction",
    "绕圈注水，继续萃取": "Circular pour, continue extraction",
    "绕圈注水至边缘，完成后杯中加满新鲜冰块": "Circular pour to edges, add fresh ice to cup when done",
    "关闭阀门，绕圈注水": "Close valve, circular pour",
    "打开阀门，绕圈注水": "Open valve, circular pour",
    "保持开阀，绕圈注水": "Keep valve open, circular pour",
    "关闭阀门，倒入冷水，降温至70-80°C注水": "Close valve, add cold water, cool to 70-80°C pour",
    "打开阀门等等滴滤完成": "Open valve and wait for drip to complete",
    "打开阀门，等待咖啡液流完": "Open valve, wait for coffee to finish dripping",
    "保持开阀，由外向内边缘绕圈注水(冲掉边缘咖啡粉)": "Keep valve open, pour from edge inward (rinse edge grounds)",
    "(分享壶中预先放入50g冰块) 绕圈注水，确保均匀萃取": "(Pre-place 50g ice in server) Circular pour for even extraction",
    // 阶段标识
    "焖蒸(绕圈注水)": "Bloom (Circular Pour)",
    "焖蒸（绕圈注水）": "Bloom (Circular Pour)",
    "绕圈注水 (1/2)": "Circular Pour (1/2)",
    "绕圈注水 (2/2)": "Circular Pour (2/2)",
    "绕圈注水 (1/3)": "Circular Pour (1/3)",
    "绕圈注水 (2/3)": "Circular Pour (2/3)",
    "绕圈注水 (3/3)": "Circular Pour (3/3)",
    "[关阀]绕圈注水": "[Close Valve] Circular Pour",
    "[开阀]绕圈注水": "[Open Valve] Circular Pour",
    "[关阀]降温绕圈注水": "[Close Valve] Cool Down Circular Pour",
    "[开阀]等待滴滤完成": "[Open Valve] Wait for Drip to Complete",
    "[开阀]等咖啡液流完": "[Open Valve] Wait for Coffee to Finish",
    // 阶段数字
    "1 阶段": "Stage 1",
    "2 阶段": "Stage 2",
    "3 阶段": "Stage 3",
    "4 阶段": "Stage 4",
    "5 阶段": "Stage 5",
    // 注水类型和描述
    "中心定点注水，降低萃取率": "Center pour to reduce extraction rate",
    "慢慢绕圈注水，从中心向外，确保均匀萃取": "Slowly pour in circles from center outward for even flavor extraction",
    "添加冰块，降低温度进行冷萃": "Add ice to lower temperature for cold extraction",
    "注水": "Pour",
    // 参数标签
    "咖啡粉": "Coffee",
    "水量": "Water",
    "等待": "Wait",
    "流速": "Flow Rate"
  }
};

// 获取当前语言的配置
export function getI18nConfig(locale: string = 'zh'): I18nConfig {
  return locale === 'en' ? enConfig : zhConfig;
}

// 简单翻译函数
export function translateGrinder(grinderId: string, locale: string = 'zh'): string {
  const config = getI18nConfig(locale);
  return config.grinders[grinderId] || grinderId;
}

export function translateEquipment(equipmentId: string, locale: string = 'zh'): string {
  const config = getI18nConfig(locale);
  return config.equipment[equipmentId] || equipmentId;
}

// 翻译冲煮方案名称
export function translateBrewingMethod(equipmentId: string, methodName: string, locale: string = 'zh'): string {
  const config = getI18nConfig(locale);
  const equipmentMethods = config.brewingMethods[equipmentId];
  if (equipmentMethods && equipmentMethods[methodName]) {
    return equipmentMethods[methodName];
  }
  return methodName;
}

// 翻译冲煮术语
export function translateBrewingTerm(term: string, locale: string = 'zh'): string {
  const config = getI18nConfig(locale);
  return config.brewingTerms[term] || term;
}

// React Hook for translations
import { useLocale } from 'next-intl';

export function useConfigTranslation() {
  const locale = useLocale();

  return {
    translateGrinder: (grinderId: string) => translateGrinder(grinderId, locale),
    translateEquipment: (equipmentId: string) => translateEquipment(equipmentId, locale),
    translateBrewingMethod: (equipmentId: string, methodName: string) =>
      translateBrewingMethod(equipmentId, methodName, locale),
    translateBrewingTerm: (term: string) => translateBrewingTerm(term, locale),
  };
}
