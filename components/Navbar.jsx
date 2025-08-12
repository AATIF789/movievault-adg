'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const [term, setTerm] = useState('');
  const router = useRouter();
  const onSubmit = (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    router.push(`/search?q=${encodeURIComponent(term)}&type=multi`);
    setTerm('');
  };
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-6">
        <Link href="/" className="font-extrabold text-xl text-white tracking-tight">
          MovieVault
        </Link>
        <nav className="ml-auto flex items-center gap-5">
          <Link href="/bookmarks" className="text-white/90 hover:text-white transition">Bookmarks</Link>
          <form onSubmit={onSubmit} className="relative">
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search movies, TV..."
              className="w-64 sm:w-80 rounded-lg bg-white/10 text-white placeholder-white/50 pl-10 pr-3 py-2 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-indigo-400 transition"
            />
            <span className="absolute left-3 top-2.5 text-white/60">🔎</span>
          </form>
        </nav>
      </div>
    </header>
  );
}