import { getDetails } from '@/lib/tmdb';
import MediaCard from '@/components/MediaCard';
import WatchTrailer from '@/components/WatchTrailer';
import BookmarkButton from '@/components/BookmarkButton';
import ProvidersRow from '@/components/ProvidersRow';

const IMG = (p, size = 'w780') => (p ? `https://image.tmdb.org/t/p/${size}${p}` : null);

export async function generateMetadata({ params }) {
  const { type, id } = params;
  try {
    const d = await getDetails(type, id);
    const title = d.title || d.name || 'Details';
    const description = d.overview || 'Movie/TV details';
    const img = IMG(d.backdrop_path, 'w1280') || IMG(d.poster_path, 'w500') || '';
    return {
      title: `${title} • MovieVault`,
      description,
      openGraph: { title, description, images: img ? [img] : [] },
      twitter: { card: 'summary_large_image', title, description, images: img ? [img] : [] },
    };
  } catch {
    return { title: 'Details • MovieVault' };
  }
}

export default async function DetailsPage({ params }) {
  const { type, id } = params; // 'movie' | 'tv'
  const data = await getDetails(type, id);

  const title = data.title || data.name;
  const year = (data.release_date || data.first_air_date || '').slice(0,4);
  const runtime = data.runtime || (data.episode_run_time && data.episode_run_time[0]);
  const poster = IMG(data.poster_path, 'w342');
  const backdrop = IMG(data.backdrop_path, 'w1280');
  const video = (data.videos?.results || []).find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = (data.credits?.cast || []).slice(0, 12);
  const director = (data.credits?.crew || []).find(c => c.job === 'Director');
  const creators = data.created_by || [];
  const recommended = (data.recommendations?.results || []).slice(0, 12);
  const similar = (data.similar?.results || []).slice(0, 12);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10">
        {backdrop && <img src={backdrop} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
        <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
          <div className="flex gap-6">
            {poster && (
              <img src={poster} alt={title} className="w-32 sm:w-40 md:w-52 rounded-lg ring-1 ring-white/10" />
            )}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-start gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
                <div className="mt-1"><BookmarkButton item={{ ...data, media_type: type }} /></div>
              </div>
              <p className="text-white/70">{[year, runtime ? `${runtime}m` : null, (data.genres||[]).map(g=>g.name).join(', ')].filter(Boolean).join(' • ')}</p>
              <p className="text-white/80 max-w-3xl">{data.overview || 'No summary available.'}</p>
              <div className="flex items-center gap-3">
                <span className="text-white/80">⭐ {Math.round((data.vote_average || 0) * 10) / 10} ({data.vote_count?.toLocaleString()} votes)</span>
                <WatchTrailer videoKey={video?.key} />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {(data.genres || []).map(g => (
                  <a key={g.id} href={`/search?type=${type}&genre=${g.id}`} className="text-xs px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/15">
                    {g.name}
                  </a>
                ))}
              </div>
              <p className="text-white/70">
                {director && <>Directed by <span className="text-white">{director.name}</span></>}
                {!director && creators.length > 0 && <>Created by <span className="text-white">{creators.map(c => c.name).join(', ')}</span></>}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Providers */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Watch Options</h2>
        <ProvidersRow type={type} id={id} />
      </section>

      {/* Cast */}
      {cast.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Top Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {cast.map(person => (
              <div key={person.credit_id || person.cast_id || person.id} className="rounded-lg bg-white/5 ring-1 ring-white/10 p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/48x48?text=%20'}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover bg-white/10"
                  />
                  <div>
                    <p className="text-sm font-semibold">{person.name}</p>
                    <p className="text-xs text-white/60">{person.character ? `as ${person.character}` : 'Cast'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Recommended</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {recommended.map(item => (
              <MediaCard key={(item.media_type || type) + '-' + item.id} item={{ ...item, media_type: item.media_type || type }} />
            ))}
          </div>
        </section>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Similar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {similar.map(item => (
              <MediaCard key={(item.media_type || type) + '-' + item.id} item={{ ...item, media_type: item.media_type || type }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}