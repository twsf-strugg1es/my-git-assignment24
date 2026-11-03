import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (user) =>
        set((state) => {
          const isFavorite = state.favorites.some(
            (favorite) => favorite.id === user.id,
          )

          return {
            favorites: isFavorite
              ? state.favorites.filter((favorite) => favorite.id !== user.id)
              : [...state.favorites, user],
          }
        }),
    }),
    {
      name: 'people-favorites',
    },
  ),
)
