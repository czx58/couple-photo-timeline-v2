import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ContributionSkyline, { type PaletteInput } from '@/components/ui/contribution-skyline';
import UploadZone from '@/components/UploadZone';

interface AggregateResp {
  total: number;
  days: number;
  data: { date: string; count: number }[];
}

const PALETTES = [
  { key: 'github', label: 'GitHub 绿' },
  { key: 'ocean', label: '海洋蓝' },
  { key: 'ember', label: '炉火橙' },
  { key: 'grape', label: '葡萄紫' },
  { key: 'halloween', label: '南瓜橙' },
  { key: 'mono', label: '单色调' },
];

export default function CoupleHome() {
  const [aggregate, setAggregate] = useState<AggregateResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [palette, setPalette] = useState<PaletteInput>('ocean');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/photos/aggregate');
      const json: AggregateResp = await res.json();
      setAggregate(json);
    } catch {
      setAggregate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCellClick = (day: { date: string; count: number }) => {
    if (day.count > 0) navigate(`/gallery/${day.date}`);
  };

  const skylineData = aggregate?.data ?? [];

  return (
    <div
      className="min-h-screen w-full px-4 py-10 sm:px-8"
      style={{ background: 'var(--color-background, #fafafa)' }}
    >
      <div className="mx-auto max-w-[1100px] space-y-10">
        {/* 顶部 */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              我们的 <span>2026</span> 拍照时光
            </h1>
          </div>

          {/* 配色切换 */}
          <div className="flex flex-wrap gap-2">
            {PALETTES.map((p) => (
              <button
                key={p.key}
                onClick={() => setPalette(p.key as PaletteInput)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  palette === p.key
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </header>

        {/* 热力图 */}
        <section>
          {loading ? (
            <div
              className="py-20 text-center"
              style={{ color: 'var(--color-muted-foreground, #737373)' }}
            >
              加载中...
            </div>
          ) : (
            <ContributionSkyline
              data={skylineData}
              endDate="2026-12-31"
              palette={palette}
              defaultView="3d"
              unit="shot"
              title="2026 · 我们一起拍的"
              showStats={true}
              showLegend={true}
              showToggle={true}
              heightScale={1.1}
              onCellClick={handleCellClick}
              footer={
                aggregate?.total
                  ? '点击任意一天（柱子高亮）查看那天的照片 →'
                  : '先上传一些照片试试吧 ✨'
              }
            />
          )}
        </section>

        {/* 上传区 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">上传照片</h2>
            <p
              className="text-sm"
              style={{ color: 'var(--color-muted-foreground, #737373)' }}
            >
              两个独立入口——你的归你，ta 的归 ta，系统自动合并到同一张热力图。EXIF 里的拍照日期会被自动读出来。
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <UploadZone person="me" label="我的相册" accent="bg-sky-500" onUploaded={fetchData} />
            <UploadZone person="ta" label="ta 的相册" accent="bg-rose-500" onUploaded={fetchData} />
          </div>
          <div className="text-center">
            <button
              onClick={fetchData}
              className="text-sm transition underline underline-offset-4 hover:underline-offset-2"
              style={{ color: 'var(--color-muted-foreground, #737373)' }}
            >
              ↻ 手动刷新热力图
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
