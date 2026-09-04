import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = 'radref:favorites:v1';

export const DEFAULT_FAVORITES: readonly string[] = [
  '/lung/fleischner',
  '/renal/bosniak',
  '/liver/li-rads',
];

export function useFavorites() {
  const [favorites, setFavorites] = useState<readonly string[]>(DEFAULT_FAVORITES);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(FAVORITES_STORAGE_KEY)
      .then((saved) => {
        if (!active || !saved) return;
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
            setFavorites(parsed);
          }
        } catch {
          // ignore parsing failure
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const toggleFavorite = useCallback((route: string) => {
    setFavorites((prev) => {
      const next = prev.includes(route)
        ? prev.filter((r) => r !== route)
        : [...prev, route];
      AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (route: string) => favorites.includes(route),
    [favorites],
  );

  return { favorites, isFavorite, toggleFavorite };
}
