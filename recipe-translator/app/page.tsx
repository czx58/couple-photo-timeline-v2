'use client';

import { useState, useEffect, useMemo } from 'react';
import { recipes as allRecipes } from '@/data/recipes.json';
import type { Recipe } from '@/data/types';
import {
  loadUserData,
  saveUserData,
  calcEquivalent,
  servingsText,
  type StoredUserData,
} from '@/data/algorithms';

const SCENES = ['全部', '一人快手餐', '周末硬菜', '能量餐', '展示用'] as const;

export default function HomePage() {
  const [data, setData] = useState<StoredUserData | null>(null);
  const [activeScene, setActiveScene] = useState<string>('全部');

  useEffect(() => {
    setData(loadUserData());
  }, []);

  useEffect(() => {
    if (data) saveUserData(data);
  }, [data]);

  const equiv = useMemo(
    () => (data ? calcEquivalent(data.household) : 0),
    [data]
  );

  const filtered = useMemo(() => {
    const list = allRecipes as Recipe[];
    if (activeScene === '全部') return list;
    return list.filter((r) => r.scenes.includes(activeScene));
  }, [activeScene]);

  if (!data) return <div className="p-8 text-center text-gray-400">加载中…</div>;

  return (
    <div className="space-y-6">
      {/* 头部：选人数 */}
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-kitchen-dark">
          今天几个人吃饭？
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {servingsText(equiv)}（总当量 {equiv.toFixed(1)}）
        </p>
        <div className="mt-4 space-y-3">
          {(['adult_male', 'adult_female', 'elder_or_child'] as const).map(
            (type) => {
              const labels = {
                adult_male: '成年男性',
                adult_female: '成年女性',
                elder_or_child: '老人/小孩',
              };
              const count = data.household[type];
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{labels[type]}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setData({
                          ...data,
                          household: {
                            ...data.household,
                            [type]: Math.max(0, count - 1),
                          },
                        })
                      }
                      className="h-8 w-8 rounded-full bg-gray-100 text-lg text-gray-600 active:bg-gray-200"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-lg font-medium">
                      {count}
                    </span>
                    <button
                      onClick={() =>
                        setData({
                          ...data,
                          household: {
                            ...data.household,
                            [type]: count + 1,
                          },
                        })
                      }
                      className="h-8 w-8 rounded-full bg-kitchen-accent text-lg text-white active:opacity-80"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* 剩菜入口 */}
      <a
        href="/leftover"
        className="block rounded-2xl border-2 border-dashed border-kitchen-accent/40 bg-white/60 p-5 text-center text-kitchen-accent transition hover:border-kitchen-accent"
      >
        🍱 冰箱有剩菜？点我看看能做什么
      </a>

      {/* 场景筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SCENES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveScene(s)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition ${
              activeScene === s
                ? 'bg-kitchen-dark text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 菜谱列表 */}
      <section className="space-y-3">
        {filtered.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </section>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const stars = '★'.repeat(recipe.difficulty) + '☆'.repeat(3 - recipe.difficulty);
  return (
    <a
      href={`/recipe/${recipe.id}`}
      className="block rounded-2xl bg-white p-4 shadow-sm transition active:scale-[0.98]"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-medium text-kitchen-dark">
            {recipe.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
            <span>{stars}</span>
            <span>·</span>
            <span>{recipe.scenes.slice(0, 2).join(' / ')}</span>
          </div>
        </div>
        <span className="text-sm text-kitchen-accent">›</span>
      </div>
    </a>
  );
}
