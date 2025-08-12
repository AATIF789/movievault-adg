'use client';
import { useState, useEffect } from 'react';
import { useBookmarks } from '@/context/BookmarksContext';

export default function BookmarkButton({ item }) {
  const { isBookmarked, toggle } = useBookmarks();
  const active = isBookmarked(item);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (pulse) {
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
  }, [pulse]);

  return (
    <button
      aria-label={active ? 'Remove bookmark' : 'Add bookmark'}
      onClick={(e) => { e.preventDefault(); toggle(item); setPulse(true); }}
      className={`rounded-full p-2 ${active ? 'bg-amber-500 text-black' : 'bg-black/60 text-white/80'} hover:scale-105 transition ${pulse ? 'animate-pulse' : ''}`}
      title={active ? 'Remove bookmark' : 'Add bookmark'}
    >
      {active ? '★' : '☆'}
    </button>
  );
}