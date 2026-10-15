import { Heart, ShoppingBag, Share2 } from 'lucide-react';
import { useFavoritesStore } from '../store/useFavoritesStore';

interface ActionBarProps {
  shoeId: string;
  shoeName: string;
  price: number;
}

export default function ActionBar({ shoeId, price }: ActionBarProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorited = isFavorite(shoeId);

  return (
    <>
      {/* Desktop - already in ProductInfo, this is for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="glass-card border-t border-white/10 px-4 py-3 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite(shoeId)}
              className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                favorited
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-dark-700/60 border-white/10 text-white/60'
              }`}
            >
              <Heart size={20} className={favorited ? 'fill-current' : ''} />
            </button>
            <button className="flex-shrink-0 w-12 h-12 rounded-xl bg-dark-700/60 border border-white/10 text-white/60 flex items-center justify-center">
              <Share2 size={18} />
            </button>
            <button className="flex-shrink-0 w-12 h-12 rounded-xl bg-dark-700/60 border border-white/10 text-white/60 flex items-center justify-center">
              <ShoppingBag size={18} />
            </button>
            <button className="flex-1 h-12 rounded-xl bg-gradient-to-r from-lakers-gold-500 via-lakers-gold-400 to-lakers-gold-500 bg-[length:200%_100%] text-dark-900 font-bold text-base hover:bg-[position:100%_0] transition-all duration-500 gold-glow">
              ¥{price.toLocaleString()} · 立即购买
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="h-20 md:hidden" />
    </>
  );
}
