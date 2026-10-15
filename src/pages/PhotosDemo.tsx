import { useMemo, useState } from "react";
import ContributionSkyline, {
  type ContributionDay,
  rng,
  dayMs,
  toKey,
  DAY_MS,
} from "@/components/ui/contribution-skyline";

// ─────────────────────────────────────────────────────────────
// 生成"2025 拍照日记"的模拟数据
// ─────────────────────────────────────────────────────────────

function generatePhotoDiary(endDate: string, seed = 42): ContributionDay[] {
  const end = dayMs(endDate);
  const r = rng(seed);
  const days = 400; // 多生成一点，组件会自己截
  const out: ContributionDay[] = [];

  // 模拟几个拍照高峰事件
  const events = [
    { date: "2025-01-01", name: "元旦跨年烟花", bonus: 28 },
    { date: "2025-02-14", name: "情人节", bonus: 15 },
    { date: "2025-04-05", name: "清明踏青", bonus: 22 },
    { date: "2025-05-01", name: "五一假期", bonus: 18 },
    { date: "2025-07-15", name: "暑假旅行", bonus: 25 },
    { date: "2025-08-20", name: "海边度假", bonus: 32 },
    { date: "2025-09-10", name: "生日", bonus: 20 },
    { date: "2025-10-01", name: "国庆旅行", bonus: 28 },
    { date: "2025-11-11", name: "双十一", bonus: 5 },
    { date: "2025-12-25", name: "圣诞", bonus: 18 },
  ];

  // 4 个旅行季（高斯峰）
  const trips = [
    { at: 0.18, width: 0.04, gain: 1.8 },  // 2 月春节
    { at: 0.42, width: 0.06, gain: 1.5 },  // 5 月春夏
    { at: 0.62, width: 0.08, gain: 2.2 },  // 7-8 月暑假
    { at: 0.82, width: 0.05, gain: 1.9 },  // 10 月国庆
  ];

  let mood = 0.55;
  for (let i = 0; i < days; i++) {
    const ms = end - (days - 1 - i) * DAY_MS;
    const x = i / Math.max(1, days - 1);
    const dow = new Date(ms).getUTCDay();
    const weekend = dow === 0 || dow === 6;
    const isFri = dow === 5;

    // 基础"热度"
    let heat = 0.15;
    for (const t of trips) heat += t.gain * Math.exp(-((x - t.at) ** 2) / (2 * t.width ** 2));
    mood = mood * 0.82 + r() * 0.18;
    heat *= 0.5 + mood * 1.0;

    // 事件日加成
    const dateKey = toKey(ms);
    const event = events.find((e) => e.date === dateKey);

    // 拍照概率：周末高、周五中、工作日低
    let pActive: number;
    if (weekend) pActive = 0.55 + heat * 0.35;
    else if (isFri) pActive = 0.4 + heat * 0.3;
    else pActive = 0.22 + heat * 0.25;

    let count = 0;
    if (r() < Math.min(0.96, pActive)) {
      const baseUnit = (weekend ? 1.5 : 0.9) + heat * 5;
      count = 1 + Math.floor(-Math.log(1 - r()) * baseUnit);
    }

    // 事件日爆发
    if (event) count += event.bonus + Math.floor(r() * event.bonus);

    // 偶尔爆一张（演唱会、突然的美景）
    if (r() < 0.012 && !event) count += 12 + Math.floor(r() * 18);

    out.push({ date: dateKey, count });
  }

  return out;
}

const PALETTE_OPTIONS: { key: string; label: string; preset: any }[] = [
  { key: "github", label: "GitHub 绿", preset: "github" },
  { key: "ocean", label: "海洋蓝", preset: "ocean" },
  { key: "ember", label: "炉火橙", preset: "ember" },
  { key: "grape", label: "葡萄紫", preset: "grape" },
  { key: "halloween", label: "南瓜橙", preset: "halloween" },
  { key: "mono", label: "单色调", preset: "mono" },
];

export default function PhotosDemo() {
  const [paletteKey, setPaletteKey] = useState<string>("ocean");
  const [view2d, setView2d] = useState<"2d" | "3d">("2d");
  const [view3d, setView3d] = useState<"2d" | "3d">("3d");

  const photoData = useMemo(() => generatePhotoDiary("2025-12-31", 42), []);
  const photoData2 = useMemo(() => generatePhotoDiary("2025-06-30", 99), []);
  const photoData3 = useMemo(() => generatePhotoDiary("2024-12-31", 7), []);

  const palette = PALETTE_OPTIONS.find((p) => p.key === paletteKey)?.preset ?? "github";

  return (
    <div
      className="min-h-screen w-full px-4 py-10 sm:px-8"
      style={{ background: "var(--color-background, #fafafa)" }}
    >
      <div className="mx-auto max-w-[980px] space-y-10">
        {/* 标题区 */}
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            📷 我的拍照日记 · 2025
          </h1>
          <p
            className="mx-auto mt-3 max-w-xl text-[15px]"
            style={{ color: "var(--color-muted-foreground, #737373)" }}
          >
            下面用同一个组件，展示三种不同的视角和主题：一张是 2025 全年热力图，一张是同期的 3D 天际线，
            还有一张是用默认随机数据生成的"去年"对比。
          </p>
        </header>

        {/* 调色板选择器 */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            className="mr-2 text-sm"
            style={{ color: "var(--color-muted-foreground, #737373)" }}
          >
            配色方案：
          </span>
          {PALETTE_OPTIONS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPaletteKey(p.key)}
              className="rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300"
              style={{
                borderColor: paletteKey === p.key ? "var(--color-foreground, #171717)" : "var(--color-border, #e5e5e5)",
                background: paletteKey === p.key ? "var(--color-foreground, #171717)" : "transparent",
                color: paletteKey === p.key ? "var(--color-background, #ffffff)" : "var(--color-foreground, #171717)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Demo 1: 2D 热力图 */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">① 平面视角 — 一眼看全年节奏</h2>
            <p
              className="text-[13px]"
              style={{ color: "var(--color-muted-foreground, #737373)" }}
            >
              哪个月最忙？周末拍得多还是工作日多？悬停每一天看具体张数。
            </p>
          </div>
          <ContributionSkyline
            data={photoData}
            endDate="2025-12-31"
            palette={palette}
            view={view2d}
            onViewChange={setView2d}
            unit="photo"
            title="2025 年拍了 1,284 张照片"
            showStats={true}
            showLegend={true}
            showToggle={true}
          />
        </section>

        {/* Demo 2: 3D 天际线 */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">② 等距天际线 — 一整年"长"成了一座城</h2>
            <p
              className="text-[13px]"
              style={{ color: "var(--color-muted-foreground, #737373)" }}
            >
              每根柱子的高度 = 那天拍的张数。拖拽可以旋转视角，双击复位。
              注意：从 2D 切到 3D 时，柱子会从后往前像波浪一样"升起"——这不是两张图，是同一个场景换了相机。
            </p>
          </div>
          <ContributionSkyline
            data={photoData}
            endDate="2025-12-31"
            palette={palette}
            view={view3d}
            onViewChange={setView3d}
            unit="photo"
            title={'切换到 3D 看看：哪几天是「高楼」？'}
            showStats={true}
            showLegend={true}
            showToggle={true}
            heightScale={1.1}
          />
        </section>

        {/* Demo 3: 上半年对比 */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">③ 同期对比 — 只看 2025 上半年</h2>
            <p
              className="text-[13px]"
              style={{ color: "var(--color-muted-foreground, #737373)" }}
            >
              把 endDate 改到 2025-06-30，组件自动只展示那一天往回一年的数据。
              这就是 props <code className="rounded bg-black/10 px-1">endDate</code> 的威力——日期决定窗口。
            </p>
          </div>
          <ContributionSkyline
            data={photoData2}
            endDate="2025-06-30"
            palette={palette}
            defaultView="3d"
            unit="photo"
            showStats={true}
            showLegend={true}
            showToggle={true}
          />
        </section>

        {/* Demo 4: 不传 data — 自动生成 */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">④ 不传 data 也能跑 — 自动生成"可信的空数据"</h2>
            <p
              className="text-[13px]"
              style={{ color: "var(--color-muted-foreground, #737373)" }}
            >
              下面这个完全没有传 data prop，组件内部用 mulberry32 随机种子生成了一份"看起来像真的"一年数据——
              周末少、有几个忙季、偶尔爆发拍很多张。demo 永远不会是空白的。
            </p>
          </div>
          <ContributionSkyline
            endDate="2025-12-31"
            palette={palette}
            defaultView="2d"
            unit="memory"
            showStats={true}
            showLegend={true}
            showToggle={true}
            footer="— 数据由 seeded RNG 自动生成，不传 data prop 时永远不空 —"
          />
        </section>

        {/* Demo 5: 不同的高度倍率 */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold">⑤ heightScale 调高一点 — "高楼"更立体</h2>
            <p
              className="text-[13px]"
              style={{ color: "var(--color-muted-foreground, #737373)" }}
            >
              <code className="rounded bg-black/10 px-1">heightScale={2.2}</code> 让柱子更高。
              试试不同值（0.5 ~ 3.0），找到最顺眼的天际线高度。
            </p>
          </div>
          <ContributionSkyline
            data={photoData3}
            endDate="2024-12-31"
            palette={palette}
            defaultView="3d"
            unit="shot"
            title="2024 回顾（heightScale = 2.2）"
            showStats={true}
            showLegend={true}
            showToggle={true}
            heightScale={2.2}
          />
        </section>

        {/* Props 速查 */}
        <section
          className="rounded-xl border p-5"
          style={{
            borderColor: "var(--color-border, #e5e5e5)",
            background: "var(--color-card, #ffffff)",
          }}
        >
          <h2 className="mb-3 text-lg font-semibold">🔧 这个组件暴露了什么</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ color: "var(--color-muted-foreground, #737373)" }}>
                  <th className="pb-2 pr-4 font-semibold">Prop</th>
                  <th className="pb-2 pr-4 font-semibold">类型</th>
                  <th className="pb-2 font-semibold">作用</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--color-muted-foreground, #737373)" }}>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>data</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">{'{ date, count }[]'}</td>
                  <td className="py-1">每日数据；不传则自动生成种子数据</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>endDate</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">string | Date</td>
                  <td className="py-1">显示截止日，默认今天</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>view</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">"2d" | "3d"</td>
                  <td className="py-1">受控视图</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>defaultView</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">"2d" | "3d"</td>
                  <td className="py-1">初始视图，组件进入视口时平滑切换</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>palette</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">preset | string[] | {'{light,dark}[]'}</td>
                  <td className="py-1">配色：github/ocean/ember/grape/halloween/mono，或自定义四色</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>heightScale</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">number (默认 1)</td>
                  <td className="py-1">3D 柱子高度倍率</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>duration</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">ms (默认 1300)</td>
                  <td className="py-1">2D↔3D 切换动画时长</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>orbit</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">boolean</td>
                  <td className="py-1">3D 下是否允许拖拽旋转</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>title</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">ReactNode</td>
                  <td className="py-1">自定义标题</td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 font-mono text-[13px]" style={{ color: "var(--color-foreground, #171717)" }}>unit</td>
                  <td className="py-1 pr-4 font-mono text-[12px]">string (默认 "contribution")</td>
                  <td className="py-1">统计单位名，比如 "photo" / "shot"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 页脚 */}
        <footer
          className="pb-4 pt-6 text-center text-[12px]"
          style={{ color: "var(--color-muted-foreground, #737373)" }}
        >
          ✨ 这个组件只用 React + 原生 Canvas 2D，零外部渲染依赖。
          相机从俯视插值到等距角，柱子以波浪式从后往前升起——同一个场景，不是两张图。
        </footer>
      </div>
    </div>
  );
}
