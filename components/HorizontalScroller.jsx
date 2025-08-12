'use client';
import { useRef } from 'react';

export default function HorizontalScroller({ children }) {
  const ref = useRef(null);
  const scrollBy = (dx) => ref.current?.scrollBy({ left: dx, behavior: 'smooth' });

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
      >
        {children}
      </div>
      <button
        onClick={() => scrollBy(-600)}
        className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 ring-1 ring-white/20 p-2 hover:bg-black/70"
        aria-label="Scroll left"
      >
        ‹
      </button>
      <button
        onClick={() => scrollBy(600)}
        className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 ring-1 ring-white/20 p-2 hover:bg-black/70"
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  );
}