import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Loader2 } from 'lucide-react';
import { shoesApi } from '../services/api';
import type { Shoe } from '../types/shoe';

const emptyForm = {
  name: '',
  brand: '',
  collab: '',
  colorway: '',
  nickname: '',
  price: '',
  original_price: '',
  rating: '0',
  review_count: '0',
  release_date: '',
  style_code: '',
  image_url: '',
  description: '',
  story: '',
  tags: '',
};

export default function Admin() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadShoes = async () => {
    try {
      setLoading(true);
      const data = await shoesApi.getAll();
      setShoes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShoes();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!confirm('确定要删除这双鞋吗？')) return;

    try {
      await shoesApi.delete(id);
      await loadShoes();
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newShoe: Omit<Shoe, 'id'> = {
        name: form.name,
        brand: form.brand,
        collab: form.collab || undefined,
        colorway: form.colorway,
        nickname: form.nickname || undefined,
        price: Number(form.price) || 0,
        originalPrice: form.original_price ? Number(form.original_price) : undefined,
        rating: Number(form.rating) || 0,
        reviewCount: Number(form.review_count) || 0,
        releaseDate: form.release_date,
        styleCode: form.style_code,
        images: form.image_url
          ? [{ id: 'main', url: form.image_url, alt: `${form.brand} ${form.name}`, angle: 'side' as const }]
          : [],
        description: form.description,
        story: form.story,
        specs: [],
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      await shoesApi.create(newShoe);
      setForm(emptyForm);
      await loadShoes();
      alert('添加成功！');
    } catch (err) {
      alert(err instanceof Error ? err.message : '添加失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">球鞋管理后台</h1>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Add Form */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5" />
            <h2 className="text-lg font-bold text-gray-900">添加新鞋款</h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="品牌 *"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
              required
            />
            <input
              type="text"
              placeholder="鞋款名称 *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
              required
            />
            <input
              type="text"
              placeholder="配色名称 *"
              value={form.colorway}
              onChange={(e) => setForm({ ...form, colorway: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
              required
            />
            <input
              type="text"
              placeholder="联名品牌（可选）"
              value={form.collab}
              onChange={(e) => setForm({ ...form, collab: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
            />
            <input
              type="number"
              placeholder="价格 *"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
              required
            />
            <input
              type="number"
              placeholder="原价（可选）"
              value={form.original_price}
              onChange={(e) => setForm({ ...form, original_price: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
            />
            <input
              type="text"
              placeholder="货号"
              value={form.style_code}
              onChange={(e) => setForm({ ...form, style_code: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
            />
            <input
              type="date"
              placeholder="发售日期"
              value={form.release_date}
              onChange={(e) => setForm({ ...form, release_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors"
            />
            <input
              type="text"
              placeholder="图片 URL"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors md:col-span-2"
            />
            <textarea
              placeholder="简介"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors md:col-span-2 h-24 resize-none"
            />
            <textarea
              placeholder="深度故事"
              value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors md:col-span-2 h-32 resize-none"
            />
            <input
              type="text"
              placeholder="标签，用逗号分隔，例如：联名款, 科比系列, 湖人配色"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-black transition-colors md:col-span-2"
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? '添加中...' : '添加鞋款'}
              </button>
            </div>
          </form>
        </section>

        {/* Shoes List */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">现有鞋款</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-8">{error}</p>
          ) : shoes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无鞋款</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">图片</th>
                    <th className="pb-3 font-medium">品牌</th>
                    <th className="pb-3 font-medium">名称</th>
                    <th className="pb-3 font-medium">配色</th>
                    <th className="pb-3 font-medium">价格</th>
                    <th className="pb-3 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {shoes.map((shoe) => (
                    <tr key={shoe.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-4 text-sm text-gray-400">{shoe.id}</td>
                      <td className="py-4">
                        {shoe.images[0] ? (
                          <img
                            src={shoe.images[0].url}
                            alt={shoe.images[0].alt}
                            className="w-16 h-16 object-contain bg-gray-50 rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-xs text-gray-400">
                            无图
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-sm">{shoe.brand}</td>
                      <td className="py-4 font-medium">{shoe.name}</td>
                      <td className="py-4 text-sm text-gray-500">{shoe.colorway}</td>
                      <td className="py-4 text-sm">¥{shoe.price}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDelete(shoe.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
