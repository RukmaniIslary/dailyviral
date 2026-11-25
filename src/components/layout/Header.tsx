'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category { id: string; name: string; slug: string; _count: { posts: number }; }

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [q, setQ] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) { router.push(`/search?q=${encodeURIComponent(q.trim())}`); setMenuOpen(false); }
  }

  return (
    <header style={{ background: '#fff', borderBottom: '1.5px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ background: 'linear-gradient(135deg, #00aff0, #0090cc)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 13, letterSpacing: 0.5 }}>DV</span>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 900, fontSize: 16, color: '#111' }}>Daily Viral <span style={{ color: '#00aff0' }}>MMS</span></div>
            <div style={{ fontSize: 10, color: '#999', letterSpacing: 1, textTransform: 'uppercase' }}>18+ Directory</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }} className="desk-nav">
          <Link href="/" className="nav-link">Home</Link>

          <div ref={catRef} style={{ position: 'relative' }}>
            <button onClick={() => setCatOpen(!catOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555', padding: '7px 14px', borderRadius: 25, display: 'flex', alignItems: 'center', gap: 5 }}
              onMouseEnter={e => { e.currentTarget.style.color = '#00aff0'; e.currentTarget.style.background = '#e6f7fe'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = 'none'; }}>
              Categories
              <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z"/></svg>
            </button>
            {catOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 14, boxShadow: '0 12px 32px rgba(0,0,0,0.1)', minWidth: 210, zIndex: 200, padding: 8 }}>
                {categories.length === 0
                  ? <p style={{ padding: '10px 14px', fontSize: 13, color: '#999' }}>No categories yet</p>
                  : categories.map(c => (
                    <Link key={c.id} href={`/category/${c.slug}`} onClick={() => setCatOpen(false)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderRadius: 8, fontSize: 14, color: '#333', transition: 'background .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e6f7fe'; e.currentTarget.style.color = '#00aff0'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#333'; }}>
                      <span>{c.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: '#e6f7fe', color: '#00aff0', padding: '2px 8px', borderRadius: 25 }}>{c._count.posts}</span>
                    </Link>
                  ))
                }
              </div>
            )}
          </div>

          <Link href="/trending" className="nav-link">Trending</Link>
          <Link href="/latest" className="nav-link">Latest</Link>
          <Link href="/forums" className="nav-link">Forums</Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desk-nav">
          <div style={{ position: 'relative' }}>
            <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Search..."
              style={{ width: 220, padding: '9px 40px 9px 16px', borderRadius: 25, border: '1.5px solid #e0e0e0', fontSize: 13, outline: 'none', background: '#f7f7f7', color: '#111' }}
              onFocus={e => { e.target.style.borderColor = '#00aff0'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#e0e0e0'; e.target.style.background = '#f7f7f7'; }} />
            <button type="submit" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#00aff0', display: 'flex', alignItems: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </form>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mob-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', flexDirection: 'column', gap: 5, padding: 4 }}>
          <span style={{ display: 'block', width: 22, height: 2, background: '#333', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: '#333', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 22, height: 2, background: '#333', borderRadius: 2 }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #eee', padding: '12px 20px 20px' }}>
          <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
            <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Search posts..."
              style={{ width: '100%', padding: '10px 16px', borderRadius: 25, border: '1.5px solid #e0e0e0', fontSize: 14, outline: 'none' }} />
          </form>
          {[{ label: 'Home', href: '/' }, { label: 'Trending', href: '/trending' }, { label: 'Latest', href: '/latest' }, { label: 'Forums', href: '/forums' }].map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '11px 4px', fontSize: 15, fontWeight: 600, color: '#333', borderBottom: '1px solid #f5f5f5' }}>
              {item.label}
            </Link>
          ))}
          {categories.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Categories</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categories.map(c => (
                  <Link key={c.id} href={`/category/${c.slug}`} onClick={() => setMenuOpen(false)}
                    style={{ padding: '6px 14px', borderRadius: 25, background: '#e6f7fe', color: '#00aff0', fontSize: 13, fontWeight: 600 }}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .mob-btn { display: none !important; } .desk-nav { display: flex !important; } }
        @media (max-width: 768px) { .mob-btn { display: flex !important; } .desk-nav { display: none !important; } }
      `}</style>
    </header>
  );
}
