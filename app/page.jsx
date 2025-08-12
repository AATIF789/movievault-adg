import {
  getTrending,
  getTopRated,
  getNowPlayingMovies,
  getAiringTodayTV,
  getUpcomingMovies,
} from '@/lib/tmdb';
import MediaCard from '@/components/MediaCard';
import HeroCarousel from '@/components/HeroCarousel';
import HorizontalScroller from '@/components/HorizontalScroller';

export const revalidate = 60;

export default async function Home() {
  const [hero, trendMovies, trendTV, topMovies, topTV, nowPlaying, airingToday, upcoming] = await Promise.all([
    getTrending('all', 'day', 1),
    getTrending('movie', 'day', 1),
    getTrending('tv', 'day', 1),
    getTopRated('movie', 1),
    getTopRated('tv', 1),
    getNowPlayingMovies(1),
    getAiringTodayTV(1),
    getUpcomingMovies(1),
  ]);

  const section = (title, list) => (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">{title}</h2>
      <HorizontalScroller>
        {(list?.results || []).slice(0, 18).map(item => (
          <div key={`${(item.media_type || (item.title ? 'movie' : 'tv'))}-${item.id}`} className="snap-start min-w-[46%] sm:min-w-[32%] md:min-w-[23%] xl:min-w-[15%]">
            <MediaCard item={item} />
          </div>
        ))}
      </HorizontalScroller>
    </section>
  );

  return (
    <div className="space-y-8">
      <HeroCarousel items={hero?.results || []} />
      {section('Trending Movies', trendMovies)}
      {section('Trending TV', trendTV)}
      {section('Top Rated Movies', topMovies)}
      {section('Top Rated TV', topTV)}
      {section('Now Playing (Movies)', nowPlaying)}
      {section('Airing Today (TV)', airingToday)}
      {section('Upcoming (Movies)', upcoming)}
    </div>
  );
}