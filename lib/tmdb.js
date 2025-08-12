import 'server-only';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

function buildUrl(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });
  return url.toString();
}

export async function tmdbFetch(path, params = {}) {
  const url = buildUrl(path, params);
  const res = await fetch(url, { next: { revalidate: 60 } }); // revalidate every 60s
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDb error (${res.status}): ${text}`);
  }
  return res.json();
}

// Core
export const getTrending = (type = 'all', window = 'day', page = 1) =>
  tmdbFetch(`/trending/${type}/${window}`, { page });

export const searchTMDb = (type = 'multi', query, page = 1) =>
  tmdbFetch(`/search/${type}`, { query, page, include_adult: 'false' });

export const discoverTMDb = (type = 'movie', params = {}) =>
  tmdbFetch(`/discover/${type}`, params);

export const getGenres = (type = 'movie') =>
  tmdbFetch(`/genre/${type}/list`);

export const getDetails = (type, id) =>
  tmdbFetch(`/${type}/${id}`, {
    append_to_response: 'videos,credits,recommendations,similar',
  });

// Lists
export const getTopRated = (type = 'movie', page = 1) =>
  tmdbFetch(`/${type}/top_rated`, { page });

export const getPopular = (type = 'movie', page = 1) =>
  tmdbFetch(`/${type}/popular`, { page });

export const getNowPlayingMovies = (page = 1) =>
  tmdbFetch(`/movie/now_playing`, { page });

export const getAiringTodayTV = (page = 1) =>
  tmdbFetch(`/tv/airing_today`, { page });

export const getUpcomingMovies = (page = 1) =>
  tmdbFetch(`/movie/upcoming`, { page });

// Providers
export const getWatchProviders = (type, id) =>
  tmdbFetch(`/${type}/${id}/watch/providers`);