'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/Loader';
import ErrorState from '@/components/ErrorState';
import MediaCard from '@/components/MediaCard';
import FiltersBar from '@/components/FiltersBar';

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();

  const q = params.get('q') || '';
  const initialType = params.get('type') || 'multi';
  const initialGenre = params.get('genre') || '';
  const initialSort = params.get('sort_by') || 'popularity.desc';
  const initialYear = params.get('year') || '';
  const initialRating = params.get('rating') || '0';

  const [type, setType] = useState(initialType);          // multi | movie | tv
  const [genre, setGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState(initialSort);
  const [year, setYear] = useState(initialYear);
  const [rating, setRating] = useState(initialRating);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const effectiveType = type === 'multi' ? 'movie' : type; // for discover
  const yearParamName = effectiveType === 'tv' ? 'first_air_date_year' : 'primary_release_year';

  const updateUrl = () => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (type) sp.set('type', type);
    if (genre) sp.set('genre', genre);
    if (sortBy) sp.set('sort_by', sortBy);
    if (year) sp.set('year', year);
    if (rating) sp.set('rating', rating);
    router.replace(`/search?${sp.toString()}`);
  };

  useEffect(() => { updateUrl(); /* eslint-disable-next-line */ }, [type, genre, sortBy, year, rating]);

  const fetchPage = async (p = 1, replace = false) => {
    setErr(null);
    setLoading(true);
    try {
      let url;
      if (q) {
        url = `/api/tmdb/search?type=${type}&query=${encodeURIComponent(q)}&page=${p}`;
      } else {
        const params = [
          `type=${effectiveType}`,
          `page=${p}`,
          genre ? `with_genres=${genre}` : '',
          sortBy ? `sort_by=${encodeURIComponent(sortBy)}` : '',
          year ? `${yearParamName}=${encodeURIComponent(year)}` : '',
          rating ? `vote_average.gte=${encodeURIComponent(rating)}` : '',
        ].filter(Boolean).join('&');
        url = `/api/tmdb/discover?${params}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch results');
      const json = await res.json();
      setItems((prev) => replace ? (json.results || []) : [...prev, ...(json.results || [])]);
      setPage(json.page || p);
      setTotalPages(json.total_pages || 1);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on initial or changes (replace items)
  useEffect(() => { setItems([]); setPage(1); fetchPage(1, true); /* eslint-disable-next-line */ }, [q, type, genre, sortBy, year, rating]);

  const canLoadMore = page < totalPages;
  const results = useMemo(() => items, [items]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Explore</h1>

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

        <FiltersBar
          type={type}
          genre={genre} onGenreChange={setGenre}
          sortBy={sortBy} onSortChange={setSortBy}
          year={year} onYearChange={setYear}
          rating={rating} onRatingChange={setRating}
        />
      </div>

      {loading && results.length === 0 && <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10">
            <div className="aspect-[2/3] bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>}

      {err && <ErrorState message={err} />}

      {!loading && !err && (
        <>
          <p className="text-white/60">{results.length.toLocaleString()} results {canLoadMore ? `(page ${page} of ${totalPages})` : ''}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {results.map(item => (
              <MediaCard key={`${item.media_type || (item.title ? 'movie' : 'tv')}-${item.id}-${Math.random().toString(36).slice(2,7)}`} item={item} />
            ))}
          </div>

          {canLoadMore && (
            <div className="grid place-items-center py-6">
              <button
                onClick={() => fetchPage(page + 1)}
                disabled={loading}
                className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}