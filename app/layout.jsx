import './globals.css';
import Navbar from '@/components/Navbar';
import { BookmarksProvider } from '@/context/BookmarksContext';

export const metadata = {
  title: 'MovieVault',
  description: 'Latest movies and TV updates powered by TMDb',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gradient-to-b from-zinc-950 to-black text-white min-h-screen">
        <BookmarksProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
          <footer className="border-t border-white/10 py-6 text-center text-white/50 text-sm">
            This product uses the TMDb API but is not endorsed or certified by TMDb.
          </footer>
        </BookmarksProvider>
      </body>
    </html>
  );
}