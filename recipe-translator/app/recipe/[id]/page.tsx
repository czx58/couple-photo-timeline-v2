'use client';

import { useState, useEffect, useMemo, use } from 'react';
import { notFound } from 'next/navigation';
import { recipes as allRecipes } from '@/data/recipes.json';
import type { Recipe } from '@/data/types';
import {
  loadUserData,
  saveUserData,
  calcEquivalent,
  servingsText,
  scaleIngredient,
  scaleCapAmount,
  formatAmount,
  updateTasteMemory,
  type StoredUserData,
} from '@/data/algorithms';

export default function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const recipe = (allRecipes as Recipe[]).find((r) => r.id === id);
  if (!recipe) {
    notFound();
    return null;
  }

  const [data, setData] = useState<StoredUserData | null>(null);
  const [feedback, setFeedback] = useState<
    { kind: 'too_salty' | 'too_light' | 'just_right'; at: number } | null
  >(null);

  useEffect(() => {
    setData(loadUserData());
  }, []);

  const equiv = useMemo(
    () => (data ? calcEquivalent(data.household) : 0),
    [data]
  );

  const tasteOffset = data?.tasteMemory[recipe.id] ?? 0;

  // 份量提示文案
  const servingsLabel = servingsText(equiv);
  const tasteHint = tasteOffset !== 0
    ? tasteOffset > 0
      ? `你上次说偏淡，自动多放了 ${tasteOffset}% 调料`
      : `你上次说偏咸，自动少放了 ${Math.abs(tasteOffset)}% 调料`
    : '（调料默认偏淡，淡了可以补，咸了救不了）';

  function onFeedback(kind: 'too_salty' | 'too_light' | 'just_right') {
    if (!data || !recipe) return;
    const next = updateTasteMemory(data, recipe.id, kind);
    setData(next);
    setFeedback({ kind, at: Date.now() });
    setTimeout(() => setFeedback(null), 2000);
  }

  if (!data) return <div className="p-8 text-center text-gray-400">加载中…</div>;

  return (
    <div className="space-y-6 pb-24">
      {/* 头部 */}
      <header>
        <a href="/" className="text-sm text-gray-500">← 返回</a>
        <h1 className="mt-3 text-2xl font-bold text-kitchen-dark">
          {recipe.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {servingsLabel} · {tasteHint}
        </p>
      </header>

      {/* 食材清单（带缩放和瓶盖） */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-kitchen-dark">
          食材 & 调料
        </h2>
        <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
          {recipe.ingredients.map((ing) => {
            const scaledGrams = scaleIngredient(
              ing.standardAmount,
              equiv,
              ing.isSeasoning,
              recipe.defaultMildFactor,
              tasteOffset
            );
            const cap = ing.capAmount
              ? scaleCapAmount(
                  ing.capAmount.level,
                  equiv,
                  recipe.defaultMildFactor,
                  tasteOffset
                )
              : null;
            return (
              <div
                key={ing.id}
                className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0"
              >
                <div>
                  <span className="font-medium text-kitchen-dark">
                    {ing.name}
                  </span>
                  {ing.isSeasoning && (
                    <span className="ml-1 text-xs text-gray-400">（调料）</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {formatAmount(scaledGrams)}
                  </span>
                  {cap && (
                    <span className="cap-badge">
                      瓶盖 {cap}
                      {ing.capAmount?.capRef && (
                        <span className="opacity-60"> · {ing.capAmount.capRef}</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 备菜顺序 */}
      {recipe.prepOrder.length > 0 && (
        <section>
          <h2 className="mb-3 text-base font-semibold text-kitchen-dark">
            备菜顺序
          </h2>
          <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
            {recipe.prepOrder.map((line, i) => (
              <div key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="font-medium text-kitchen-accent">
                  {i + 1}.
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 步骤 */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-kitchen-dark">
          开始做
        </h2>
        <div className="space-y-3">
          {recipe.steps.map((step) => (
            <div
              key={step.order}
              className="rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kitchen-accent text-xs font-bold text-white">
                  {step.order}
                </span>
                <div className="flex-1">
                  <p className="text-[15px] leading-relaxed text-kitchen-dark">
                    {step.action}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {step.heatTranslation && (
                      <span className="rounded bg-kitchen-warm px-2 py-0.5 text-kitchen-accent">
                        🔥 {step.heatTranslation}
                      </span>
                    )}
                    {step.duration && (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-500">
                        ⏱ {step.duration}
                      </span>
                    )}
                  </div>
                  {step.judgment && (
                    <p className="mt-2 rounded bg-gray-50 px-3 py-2 text-xs text-gray-600">
                      💡 {step.judgment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 补救方案 */}
      {recipe.tips && (
        <section>
          <h2 className="mb-3 text-base font-semibold text-kitchen-dark">
            翻车了怎么办
          </h2>
          <div className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
            {recipe.tips.tooSalty && (
              <TipRow label="太咸了" tip={recipe.tips.tooSalty} />
            )}
            {recipe.tips.burnt && (
              <TipRow label="糊底了" tip={recipe.tips.burnt} />
            )}
            {recipe.tips.other?.map((t, i) => (
              <TipRow key={i} label="小提醒" tip={t} />
            ))}
          </div>
        </section>
      )}

      {/* 反馈按钮（常驻底部） */}
      <section className="pt-4">
        <h2 className="mb-3 text-center text-sm font-medium text-gray-500">
          做完了？告诉我味道怎么样
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => onFeedback('too_light')}
            className="flex-1 rounded-xl bg-white py-3 text-sm text-gray-600 shadow-sm transition active:bg-gray-100"
          >
            淡了
          </button>
          <button
            onClick={() => onFeedback('just_right')}
            className="flex-1 rounded-xl bg-kitchen-accent py-3 text-sm font-medium text-white shadow-sm transition active:opacity-80"
          >
            刚好
          </button>
          <button
            onClick={() => onFeedback('too_salty')}
            className="flex-1 rounded-xl bg-white py-3 text-sm text-gray-600 shadow-sm transition active:bg-gray-100"
          >
            咸了
          </button>
        </div>
        {feedback && (
          <p className="mt-3 text-center text-sm text-green-600">
            ✓ 已记下，下次做这道菜会自动调整
          </p>
        )}
      </section>
    </div>
  );
}

function TipRow({ label, tip }: { label: string; tip: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="shrink-0 font-medium text-kitchen-dark">{label}：</span>
      <span className="text-gray-600">{tip}</span>
    </div>
  );
}
