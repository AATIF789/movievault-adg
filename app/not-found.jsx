import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto text-center space-y-4 py-20">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-white/70">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="inline-block px-4 py-2 rounded bg-white/10 hover:bg-white/20">Go home</Link>
    </div>
  );
}