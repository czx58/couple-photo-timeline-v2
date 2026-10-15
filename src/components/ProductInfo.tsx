import { Star, Tag, Calendar, Barcode, Share2, Heart, ChevronDown, Info } from 'lucide-react';
import { useState } from 'react';
import { useFavoritesStore } from '../store/useFavoritesStore';
import type { Shoe } from '../types/shoe';

interface ProductInfoProps {
  shoe: Shoe;
}

export default function ProductInfo({ shoe }: ProductInfoProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(shoe.id);
  const [showTags, setShowTags] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 border border-black text-black text-xs tracking-[0.15em] uppercase font-medium">
            {shoe.brand}
          </span>
          {shoe.collab && (
            <span className="px-3 py-1 border border-gray-400 text-gray-600 text-xs tracking-[0.15em] uppercase font-medium">
              × {shoe.collab}
            </span>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight tracking-tight uppercase">
            {shoe.name}
          </h1>
          <p className="mt-2 text-lg text-gray-500 font-medium">
            {shoe.colorway}
            {shoe.nickname && <span className="text-gray-400 ml-2">/ {shoe.nickname}</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Star size={16} className="text-black fill-black" />
          <span className="text-black font-medium">{shoe.rating}</span>
          <span className="text-gray-400">({shoe.reviewCount} 人评价)</span>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Price */}
      <div className="flex items-end gap-4">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-gray-400" />
          <span className="text-xs tracking-[0.2em] text-gray-500 uppercase">市场参考价</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg text-gray-500">¥</span>
          <span className="font-display text-3xl font-bold text-black">
            {shoe.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-px bg-gray-200 border border-gray-200">
        <div className="bg-[#FAFAFA] p-4">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-500" />
            <div>
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">发售日期</p>
              <p className="text-sm text-black font-medium">
                {shoe.releaseDate
                  ? new Date(shoe.releaseDate).toLocaleDateString('zh-CN')
                  : '待定'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#FAFAFA] p-4">
          <div className="flex items-center gap-3">
            <Barcode size={18} className="text-gray-500" />
            <div>
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">货号</p>
              <p className="text-sm text-black font-mono">{shoe.styleCode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border border-gray-200 p-6 bg-white">
        <p className="text-gray-600 leading-relaxed text-sm">{shoe.description}</p>
      </div>

      {/* Tags */}
      <div>
        <button
          onClick={() => setShowTags(!showTags)}
          className="flex items-center gap-2 text-xs tracking-[0.2em] text-gray-500 hover:text-black transition-colors uppercase font-medium"
        >
          <Tag size={16} />
          <span>相关标签</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${showTags ? 'rotate-180' : ''}`}
          />
        </button>
        {showTags && (
          <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
            {shoe.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm hover:border-black hover:text-black transition-all cursor-pointer"
              >
                # {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => toggleFavorite(shoe.id)}
          className={`flex-shrink-0 w-12 h-12 border flex items-center justify-center transition-all duration-300 ${
            favorited
              ? 'bg-black border-black text-white'
              : 'bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black'
          }`}
          title={favorited ? '取消收藏' : '收藏'}
        >
          <Heart size={20} className={favorited ? 'fill-current' : ''} />
        </button>
        <button className="flex-shrink-0 w-12 h-12 bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:border-black hover:text-black transition-all duration-300" title="分享">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
