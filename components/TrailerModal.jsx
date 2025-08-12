'use client';
import { useEffect } from 'react';

export default function TrailerModal({ open, onClose, youtubeKey }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 grid place-items-center p-4">
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden ring-1 ring-white/20">
        {youtubeKey ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-white/60">No trailer available</div>
        )}
      </div>
      <button onClick={onClose} className="mt-4 px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20">
        Close
      </button>
    </div>
  );
}