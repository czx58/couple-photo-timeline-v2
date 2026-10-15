import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (shoeId: string) => void;
  isFavorite: (shoeId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (shoeId: string) => {
        const favorites = get().favorites;
        if (favorites.includes(shoeId)) {
          set({ favorites: favorites.filter((id) => id !== shoeId) });
        } else {
          set({ favorites: [...favorites, shoeId] });
        }
      },
      isFavorite: (shoeId: string) => get().favorites.includes(shoeId),
    }),
    {
      name: 'shoe-favorites',
    }
  )
);
