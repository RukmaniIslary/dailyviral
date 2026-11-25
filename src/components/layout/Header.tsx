'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown, TrendingUp, Clock, Star, Grid3X3 } from 'lucide-react';
import Logo from '@/components/ui/Logo';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setMenuOpen(false);
    }
  }

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: '#0B0B0F', borderColor: '#2A2A35' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              <Grid3X3 size={15} />
              Home
            </Link>

            {/* Categories dropdown */}
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                <Grid3X3 size={15} />
                Categories
                <ChevronDown size={14} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 rounded-xl border shadow-2xl py-2 z-50"
                  style={{ background: '#17171D', borderColor: '#2A2A35' }}
                >
                  {categories.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-500">No categories yet</p>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-gray-500">{cat._count.posts}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link
              href="/trending"
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              <TrendingUp size={15} />
              Trending
            </Link>
            <Link
              href="/latest"
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              <Clock size={15} />
              Latest
            </Link>
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder-gray-500 outline-none focus:ring-2 w-56"
                style={{
                  background: '#17171D',
                  border: '1px solid #2A2A35',
                  '--tw-ring-color': '#E50935',
                } as React.CSSProperties}
              />
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t pb-4 pt-3 space-y-3" style={{ borderColor: '#2A2A35' }}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder-gray-500 outline-none"
                style={{ background: '#17171D', border: '1px solid #2A2A35' }}
              />
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </form>
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-gray-300 hover:text-white">
              <Grid3X3 size={16} /> Home
            </Link>
            <Link href="/trending" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-gray-300 hover:text-white">
              <TrendingUp size={16} /> Trending
            </Link>
            <Link href="/latest" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2 text-gray-300 hover:text-white">
              <Clock size={16} /> Latest
            </Link>
            {categories.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm py-1.5 px-3 rounded-lg text-gray-300 hover:text-white"
                      style={{ background: '#17171D' }}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
