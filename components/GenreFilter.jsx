'use client';
import { useEffect, useState } from 'react';

export default function GenreFilter({ type = 'movie', value, onChange }) {
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    fetch(`/api/tmdb/genres?type=${type}`).then(r => r.json()).then(d => setGenres(d.genres || [])).catch(() => setGenres([]));
  }, [type]);
  return (
    <select
      className="rounded bg-white/10 text-white px-3 py-2 ring-1 ring-white/20"
      value={value || ''}
      onChange={(e) => onChange(e.target.value || '')}
    >
      <option value="">All genres</option>
      {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
    </select>
  );
}