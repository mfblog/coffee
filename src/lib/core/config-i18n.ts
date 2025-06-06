// 简化的多语言配置
export interface I18nConfig {
  grinders: Record<string, string>;
  equipment: Record<string, string>;
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
    Espresso: "意式咖啡机"
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
    Espresso: "Espresso Machine"
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
