'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm({ initialQuery = '' }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 540 }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Search posts, tags..."
          style={{ width: '100%', padding: '12px 44px 12px 18px', borderRadius: 10, border: '1.5px solid #e0e0e0', fontSize: 15, color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
        <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <button type="submit" style={{ padding: '12px 28px', borderRadius: 10, background: '#00aff0', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
        Search
      </button>
    </form>
  );
}
