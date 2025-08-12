'use client';
import GenreFilter from './GenreFilter';

export default function FiltersBar({
  type = 'movie',
  genre, onGenreChange,
  sortBy, onSortChange,
  year, onYearChange,
  rating, onRatingChange,
}) {
  const effectiveType = type === 'multi' ? 'movie' : type;
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Type buttons handled by parent; this is the rest */}
      <GenreFilter type={effectiveType} value={genre} onChange={onGenreChange} />
      <select
        className="rounded bg-white/10 text-white px-3 py-2 ring-1 ring-white/20"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="popularity.desc">Popularity</option>
        <option value="vote_average.desc">Rating</option>
        <option value="primary_release_date.desc">Release Date</option>
        <option value="revenue.desc">Revenue</option>
      </select>

      <input
        type="number"
        inputMode="numeric"
        min="1900"
        max="2100"
        placeholder="Year"
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        className="w-24 rounded bg-white/10 text-white px-3 py-2 ring-1 ring-white/20 placeholder-white/50"
      />

      <div className="flex items-center gap-2">
        <label className="text-white/70 text-sm">Min Rating</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={rating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="accent-indigo-500"
        />
        <span className="text-white/80 text-sm w-8">{rating}</span>
      </div>
    </div>
  );
}