// ==== 份量翻译器 · 核心数据类型 ====

// 标准人当量系数
// 用户选人数后，系统将成员系数累加得到总当量
export const EQUIVALENT_RATIO = {
  adult_male: 1.0,
  adult_female: 0.8,
  elder_or_child: 0.6,
} as const;

export type MemberType = keyof typeof EQUIVALENT_RATIO;

// 瓶盖量具等级（农夫山泉瓶盖）
export type CapLevel = 'full' | 'half' | 'flat';

// 食材分类
export type IngredientCategory =
  | 'meat'      // 肉蛋
  | 'vegetable'  // 蔬菜
  | 'seasoning'  // 调料
  | 'staple'     // 主食
  | 'other';

// 单种食材
export interface Ingredient {
  /** 通用 ID，用于剩菜搜索匹配（小写英文，唯一） */
  id: string;
  /** 显示中文名 */
  name: string;
  category: IngredientCategory;
  /** 1 当量时的标准克数（缩放基准） */
  standardAmount: number;
  /** 是否调料（决定是否用瓶盖显示） */
  isSeasoning: boolean;
  /** 调料专属：瓶盖量具对照 */
  capAmount?: {
    level: CapLevel;
    /** 备用参照物（≈X 瓷勺 / ≈X 克） */
    capRef?: string;
  };
  /** 非调料专属：新鲜度提示（结构化字段） */
  freshness?: {
    shelfLife: string;   // 大概保质期
    checkTip: string;    // 外观判断
  };
}

// 单个做菜步骤
export interface Step {
  order: number;
  /** 动作描述 */
  action: string;
  /** 原始火候词（中火/小火/大火） */
  heatLevel?: string;
  /** 翻译后：中火=电磁炉800W */
  heatTranslation?: string;
  /** 判断标准：鸡蛋刚凝固就盛出 */
  judgment?: string;
  /** 大致时长（3分钟） */
  duration?: string;
}

// 补救方案
export interface Tips {
  tooSalty?: string;
  burnt?: string;
  other?: string[];
}

// 菜谱
export interface Recipe {
  id: string;
  title: string;
  /** 场景标签，用于首页场景入口筛选 */
  scenes: string[];
  /** 难度 1=入门 2=中等 3=需要经验 */
  difficulty: 1 | 2 | 3;
  /** 这道菜的"基础份"对应的当量（一般 1） */
  baseServings: number;
  /** 默认偏淡系数（0.85 表示调料默认减 15%） */
  defaultMildFactor: number;
  ingredients: Ingredient[];
  prepOrder: string[];
  steps: Step[];
  tips: Tips;
}

// ==== 用户数据（存 localStorage） ====

export interface Household {
  adult_male: number;
  adult_female: number;
  elder_or_child: number;
}

// 按菜谱单独记忆的口味偏移（百分比，正数=偏咸，负数=偏淡）
export type RecipeTasteOffset = number;

export interface UserData {
  household: Household;
  tasteMemory: Record<string, RecipeTasteOffset>; // recipeId -> offset
  leftoverIngredients: Record<string, number>;    // ingredientId -> 克数
}
