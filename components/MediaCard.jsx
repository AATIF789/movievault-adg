'use client';
import Link from 'next/link';
import BookmarkButton from './BookmarkButton';
import RatingBadge from './RatingBadge';

const IMG = (p, size = 'w342') => (p ? `https://image.tmdb.org/t/p/${size}${p}` : null);

export default function MediaCard({ item }) {
  const media_type = item.media_type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const href = `/details/${media_type}/${item.id}`;
  const poster = IMG(item.poster_path);
  const overview = item.overview || '';

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 shadow hover:shadow-indigo-500/20 hover:ring-indigo-400/50 transition">
      <Link href={href} className="block">
        <div className="aspect-[2/3] bg-gradient-to-br from-zinc-800 to-zinc-900 relative">
          {poster ? (
            <img
              src={poster}
              alt={title}
              className="h-full w-full object-cover group-hover:scale-[1.04] transition duration-300"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-white/40 text-sm">No Image</div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white line-clamp-1">{title}</h3>
                <RatingBadge value={item.vote_average} />
              </div>
              <p className="text-xs text-white/70 line-clamp-3">{overview}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-white/70">{year || '—'}</span>
                <span className="text-[11px] text-white/60">• {media_type.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="absolute top-2 right-2">
            <BookmarkButton item={item} />
          </div>
        </div>
      </Link>
    </div>
  );
}