// ==== 份量翻译器 · 核心算法 ====
// 纯函数，不依赖任何框架，可以单元测试

import { EQUIVALENT_RATIO, Household, Recipe, RecipeTasteOffset } from './types';

/**
 * 计算家庭总当量
 * 1 男 + 1 女 = 1.0 + 0.8 = 1.8 当量
 */
export function calcEquivalent(hh: Household): number {
  return (
    hh.adult_male * EQUIVALENT_RATIO.adult_male +
    hh.adult_female * EQUIVALENT_RATIO.adult_female +
    hh.elder_or_child * EQUIVALENT_RATIO.elder_or_child
  );
}

/**
 * 计算"够几人吃"的模糊区间
 * 1.8 当量 → "够 1-2 人"
 * 3.5 当量 → "够 3-4 人"
 */
export function servingsText(equiv: number): string {
  const rounded = Math.round(equiv);
  const low = Math.max(1, rounded - 1);
  const high = rounded + 1;
  // 低当量时特殊处理
  if (equiv <= 1.2) return '够 1 人吃';
  if (equiv <= 1.8) return '够 1-2 人吃';
  return `够 ${low}-${high} 人吃`;
}

/**
 * 格式化缩放后的份量显示
 * 150g × 1.8 当量 → 270g → "约 270 克"
 * 小于 10g 的调料直接显示克数，不用"约"
 */
export function formatAmount(grams: number): string {
  if (grams < 1) return '不到 1 克';
  if (grams < 10) return `${grams.toFixed(1)} 克`;
  if (grams < 100) return `${Math.round(grams)} 克`;
  return `约 ${Math.round(grams)} 克`;
}

/**
 * 缩放单份食材
 * 调料额外叠加 defaultMildFactor（默认偏淡）+ 用户口味偏移
 * 
 * @returns 缩放后的克数
 */
export function scaleIngredient(
  standardAmount: number,
  equiv: number,
  isSeasoning: boolean,
  mildFactor: number,
  tasteOffset: RecipeTasteOffset
): number {
  const base = standardAmount * equiv;
  if (!isSeasoning) return base; // 非调料只按当量缩放
  // 调料 = 当量 × 默认偏淡系数 × (1 + 用户口味偏移%)
  return base * mildFactor * (1 + tasteOffset / 100);
}

/**
 * 计算单份食材对应多少瓶盖
 * 返回的是缩放后量对应的瓶盖描述，而不是原菜谱的固定瓶盖
 * 
 * 1 当量盐 = 半盖（≈3g）→ 1.8 当量盐 = 5.4g → 盖数 = 5.4 / 6 ≈ 0.9 → "1 盖"
 * 
 * 但这里有个更简单的做法：直接按原菜谱的瓶盖标记，乘以当量系数
 * 原菜谱标记"半盖"，当量 1.8 → "约 1 盖"
 */
export function scaleCapAmount(
  originalLevel: 'full' | 'half' | 'flat',
  equiv: number,
  mildFactor: number,
  tasteOffset: RecipeTasteOffset
): string {
  // 原瓶盖量（以满盖=1 基准）
  const baseCap = originalLevel === 'full' ? 1 : originalLevel === 'half' ? 0.5 : 0.25;
  const scaledCap = baseCap * equiv * mildFactor * (1 + tasteOffset / 100);

  // 映射回可读的瓶盖等级
  if (scaledCap <= 0.2) return '一点（≈1/4 盖）';
  if (scaledCap <= 0.4) return '半盖';
  if (scaledCap <= 0.7) return '约 3/4 盖';
  if (scaledCap <= 1.2) return '1 盖';
  if (scaledCap <= 1.7) return '约 1.5 盖';
  if (scaledCap <= 2.2) return '2 盖';
  return `约 ${Math.round(scaledCap)} 盖`;
}

/**
 * 剩菜匹配：用户输入的食材集合，找出能做的菜谱
 * 返回按匹配度排序的列表
 * 
 * @param userIngredients 用户已有的食材 id 集合
 * @param recipes 所有菜谱
 */
export function matchRecipes(
  userIngredients: Set<string>,
  recipes: Recipe[]
): Array<{
  recipe: Recipe;
  matched: string[];   // 已有的食材
  missing: string[];    // 缺的食材
  matchRate: number;    // 0-1 匹配度
}> {
  return recipes
    .map((recipe) => {
      const ids = recipe.ingredients.map((i) => i.id);
      const matched = ids.filter((id) => userIngredients.has(id));
      const missing = ids.filter((id) => !userIngredients.has(id));
      // 排除"调料缺失"——家里通常都有盐油糖
      const missingNonSeasoning = recipe.ingredients
        .filter((i) => !userIngredients.has(i.id) && !i.isSeasoning)
        .map((i) => i.id);
      const matchRate = matched.length / ids.length;
      return { recipe, matched, missing: missingNonSeasoning, matchRate };
    })
    .sort((a, b) => b.matchRate - a.matchRate);
}

/**
 * 反向估算：现有食材够几人吃？
 * 用户说"我有 3 个鸡蛋、2 个番茄" → 做番茄炒蛋够几人
 * 
 * 取菜谱里所有非调料食材中，能凑够的最小当量作为上限
 */
export function estimateServings(
  recipe: Recipe,
  userIngredients: Record<string, number>
): number {
  // 对每种食材：用户有量 / 菜谱 1 当量标准量 = 这种食材能支撑多少当量
  const limits = recipe.ingredients
    .filter((i) => !i.isSeasoning && userIngredients[i.id])
    .map((i) => userIngredients[i.id] / i.standardAmount);
  
  if (limits.length === 0) return 0;
  return Math.min(...limits); // 短板效应
}

// ==== localStorage 读写 ====

const STORAGE_KEY = 'recipe-translator-user-data';

export interface StoredUserData {
  household: Household;
  tasteMemory: Record<string, RecipeTasteOffset>;
  leftoverIngredients: Record<string, number>;
}

const defaultUserData: StoredUserData = {
  household: { adult_male: 1, adult_female: 1, elder_or_child: 0 },
  tasteMemory: {},
  leftoverIngredients: {},
};

export function loadUserData(): StoredUserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultUserData };
    const parsed = JSON.parse(raw);
    return { ...defaultUserData, ...parsed };
  } catch {
    return { ...defaultUserData };
  }
}

export function saveUserData(data: StoredUserData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * 反馈后更新口味记忆
 * "咸了" → offset 记为 -20（下次少放 20%）
 * "淡了" → offset 记为 +20（下次多放 20%）
 * "刚好" → offset 记为 0
 */
export function updateTasteMemory(
  data: StoredUserData,
  recipeId: string,
  feedback: 'too_salty' | 'too_light' | 'just_right'
): StoredUserData {
  const offset =
    feedback === 'too_salty' ? -20 : feedback === 'too_light' ? 20 : 0;
  const next = {
    ...data,
    tasteMemory: { ...data.tasteMemory, [recipeId]: offset },
  };
  saveUserData(next);
  return next;
}
