'use client';
import { useState } from 'react';
import TrailerModal from './TrailerModal';

export default function WatchTrailer({ videoKey }) {
  const [open, setOpen] = useState(false);
  if (!videoKey) {
    return <button disabled className="px-4 py-2 rounded bg-white/10 text-white/60 cursor-not-allowed">No Trailer</button>;
  }
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 transition">▶️ Watch Trailer</button>
      <TrailerModal open={open} onClose={() => setOpen(false)} youtubeKey={videoKey} />
    </>
  );
}