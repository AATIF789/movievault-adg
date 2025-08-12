'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import TrailerModal from './TrailerModal';

const IMG = (p, size = 'w1280') => (p ? `https://image.tmdb.org/t/p/${size}${p}` : null);

export default function HeroCarousel({ items }) {
  const slides = useMemo(() => (items || []).filter(i => i.backdrop_path).slice(0, 8), [items]);
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [ytKey, setYtKey] = useState(null);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => setIdx((i) => (i + 1) % (slides.length || 1)), 6000);
    return () => clearInterval(timer.current);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const s = slides[idx];
  const media_type = s.media_type || (s.title ? 'movie' : 'tv');
  const title = s.title || s.name;
  const overview = s.overview || '';

  const openTrailer = async () => {
    try {
      const res = await fetch(`/api/tmdb/details?type=${media_type}&id=${s.id}`);
      const data = await res.json();
      const v = (data.videos?.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
      if (v) setYtKey(v.key);
      setOpen(true);
    } catch {
      setYtKey(null);
      setOpen(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 mb-8">
      <div className="relative h-[52vw] max-h-[520px] min-h-[260px]">
        <img src={IMG(s.backdrop_path)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative h-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 flex items-end">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs text-white/70">
              <span className="px-2 py-0.5 rounded-full bg-white/10 ring-1 ring-white/15">{(s.media_type || 'movie').toUpperCase()}</span>
              <span>⭐ {Math.round((s.vote_average || 0) * 10) / 10}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{title}</h2>
            <p className="text-white/80 line-clamp-3">{overview}</p>
            <div className="flex items-center gap-3 pt-1">
              <button onClick={openTrailer} className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 transition">▶️ Watch Trailer</button>
              <Link href={`/details/${media_type}/${s.id}`} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 transition">View Details</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 right-4 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/40'}`}
            aria-label={`Go to slide ${i+1}`}
          />
        ))}
      </div>

      <TrailerModal open={open} onClose={() => setOpen(false)} youtubeKey={ytKey} />
    </div>
  );
}