'use client';
import { useMemo, useState } from 'react';
import { useBookmarks } from '@/context/BookmarksContext';
import MediaCard from '@/components/MediaCard';

export default function BookmarksPage() {
  const { items, clearAll } = useBookmarks();
  const [typeFilter, setTypeFilter] = useState('all'); // all | movie | tv
  const [sortKey, setSortKey] = useState('added');     // added | rating | year | title

  const list = useMemo(() => {
    let arr = items.slice();
    if (typeFilter !== 'all') arr = arr.filter(i => (i.media_type || (i.title ? 'movie' : 'tv')) === typeFilter);
    arr.sort((a, b) => {
      if (sortKey === 'added') return (b.addedAt || 0) - (a.addedAt || 0);
      if (sortKey === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
      if (sortKey === 'year') return (+(b.release_date || b.first_air_date || '').slice(0,4) || 0) - (+(a.release_date || a.first_air_date || '').slice(0,4) || 0);
      if (sortKey === 'title') return (a.title || a.name).localeCompare(b.title || b.name);
      return 0;
    });
    return arr;
  }, [items, typeFilter, sortKey]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        {items.length > 0 && (
          <button onClick={clearAll} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20">
            Clear All
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="inline-flex rounded overflow-hidden ring-1 ring-white/20">
          {['all', 'movie', 'tv'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 ${typeFilter === t ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'} transition`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="rounded bg-white/10 text-white px-3 py-2 ring-1 ring-white/20"
        >
          <option value="added">Recently added</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
        </select>
      </div>

      {list.length === 0 ? (
        <div className="p-6 text-white/70 bg-white/5 ring-1 ring-white/10 rounded-lg">No bookmarks yet. Add some favorites!</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {list.map(item => <MediaCard key={`${item.media_type}-${item.id}`} item={item} />)}
        </div>
      )}
    </div>
  );
}