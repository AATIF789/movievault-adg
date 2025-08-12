'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const BookmarksContext = createContext();
const KEY = 'movievault_bookmarks_v2';

export function BookmarksProvider({ children }) {
  const [map, setMap] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setMap(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(map));
    } catch {}
  }, [map]);

  const add = (item) => {
    const media_type = item.media_type || (item.title ? 'movie' : 'tv');
    const key = `${media_type}-${item.id}`;
    setMap((m) => ({ ...m, [key]: { ...item, media_type, addedAt: Date.now() } }));
  };

  const remove = (item) => {
    const media_type = item.media_type || (item.title ? 'movie' : 'tv');
    const key = `${media_type}-${item.id}`;
    setMap((m) => {
      const next = { ...m };
      delete next[key];
      return next;
    });
  };

  const clearAll = () => setMap({});

  const isBookmarked = (item) => {
    const media_type = item.media_type || (item.title ? 'movie' : 'tv');
    return !!map[`${media_type}-${item.id}`];
  };

  const toggle = (item) => (isBookmarked(item) ? remove(item) : add(item));

  const value = useMemo(
    () => ({ add, remove, toggle, isBookmarked, clearAll, items: Object.values(map) }),
    [map]
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

export const useBookmarks = () => useContext(BookmarksContext);