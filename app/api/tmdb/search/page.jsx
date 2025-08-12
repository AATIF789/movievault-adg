'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';
import ErrorState from '@/components/ErrorState';
import MediaCard from '@/components/MediaCard';
import GenreFilter from '@/components/GenreFilter';

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();

  const q = params.get('q') || '';
  const typeParam = params.get('type') || 'multi'; // multi | movie | tv
  const [type, setType] = useState(typeParam);
  const [genre, setGenre] = useState(params.get('genre') || '');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [data, setData] = useState({ results: [], total_results: 0 });

  const fetchData = async () => {
    setErr(null);
    setLoading(true);
    try {
      let url;
      if (q) {
        url = `/api/tmdb/search?type=${type}&query=${encodeURIComponent(q)}&page=1`;
      } else {
        const t = type === 'multi' ? 'movie' : type;
        const g = genre ? `&with_genres=${genre}` : '';
        url = `/api/tmdb/discover?type=${t}&page=1${g}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch results');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [q, type, genre]);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (type) sp.set('type', type);
    if (genre) sp.set('genre', genre);
    router.replace(`/search?${sp.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, genre]);

  const results = useMemo(() => (data?.results || []), [data]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Search</h1>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded overflow-hidden ring-1 ring-white/20">
          {['multi', 'movie', 'tv'].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-2 ${type === t ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'} transition`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <GenreFilter type={type === 'multi' ? 'movie' : type} value={genre} onChange={setGenre} />
        <div className="text-white/60">Query: <span className="text-white">{q || '(none)'}</span></div>
      </div>

      {loading && <Loader />}
      {err && <ErrorState message={err} />}

      {!loading && !err && (
        <>
          <p className="text-white/60">{(data.total_results || 0).toLocaleString()} results</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {results.map(item => <MediaCard key={`${item.media_type || (item.title ? 'movie' : 'tv')}-${item.id}`} item={item} />)}
          </div>
        </>
      )}
    </div>
  );
}