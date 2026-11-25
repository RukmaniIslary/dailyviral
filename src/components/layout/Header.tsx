'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); setMenuOpen(false); }
  }

  return (
    <header style={{ background: '#fff', borderBottom: '2px solid #e50935', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: '#e50935', borderRadius: 8, padding: '6px 10px', fontWeight: 900, color: '#fff', fontSize: 13, letterSpacing: 1 }}>
              DVM
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#1a1a2e', lineHeight: 1.1 }}>
                Daily <span style={{ color: '#e50935' }}>Viral</span> MMS
              </div>
              <div style={{ fontSize: 10, color: '#e50935', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>18+ Adult Directory</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden-mobile">
            <Link href="/" style={{ padding: '8px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14, color: '#1a1a2e', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fff0f3')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              Home
            </Link>

            <div ref={catRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                style={{ padding: '8px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14, color: '#1a1a2e', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                Categories
                <span style={{ fontSize: 10 }}>{catOpen ? '▲' : '▼'}</span>
              </button>
              {catOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #eee', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 200, zIndex: 100, padding: 8, marginTop: 4 }}>
                  {categories.length === 0 ? (
                    <p style={{ padding: '8px 12px', fontSize: 13, color: '#999' }}>No categories yet</p>
                  ) : (
                    categories.map(cat => (
                      <Link key={cat.id} href={`/category/${cat.slug}`} onClick={() => setCatOpen(false)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, fontSize: 14, color: '#1a1a2e', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fff0f3')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <span>{cat.name}</span>
                        <span style={{ fontSize: 11, color: '#e50935', fontWeight: 700, background: '#fff0f3', padding: '2px 7px', borderRadius: 20 }}>{cat._count.posts}</span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link href="/trending" style={{ padding: '8px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fff0f3')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              Trending
            </Link>
            <Link href="/latest" style={{ padding: '8px 14px', borderRadius: 8, fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fff0f3')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              Latest
            </Link>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden-mobile">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                style={{ width: 200, padding: '8px 36px 8px 12px', borderRadius: 24, border: '1.5px solid #e0e0e0', fontSize: 13, outline: 'none', background: '#f8f9fa' }}
              />
              <button type="submit" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#e50935', fontSize: 14 }}>
                &#128269;
              </button>
            </div>
          </form>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#1a1a2e', display: 'none' }} className="show-mobile">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ padding: '12px 0 16px', borderTop: '1px solid #f0f0f0' }}>
            <form onSubmit={handleSearch} style={{ marginBottom: 12 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: 24, border: '1.5px solid #e0e0e0', fontSize: 14, outline: 'none' }}
              />
            </form>
            {[{ label: 'Home', href: '/' }, { label: 'Trending', href: '/trending' }, { label: 'Latest', href: '/latest' }].map(item => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '10px 4px', fontSize: 15, fontWeight: 600, color: '#1a1a2e', borderBottom: '1px solid #f5f5f5' }}>
                {item.label}
              </Link>
            ))}
            {categories.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Categories</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {categories.map(cat => (
                    <Link key={cat.id} href={`/category/${cat.slug}`} onClick={() => setMenuOpen(false)}
                      style={{ padding: '6px 12px', borderRadius: 20, background: '#fff0f3', color: '#e50935', fontSize: 13, fontWeight: 600 }}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
