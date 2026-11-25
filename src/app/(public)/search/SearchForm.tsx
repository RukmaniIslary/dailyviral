'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchForm({ initialQuery = '' }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl">
      <div className="relative flex-1">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search posts, tags..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none text-sm"
          style={{ background: '#17171D', border: '1px solid #2A2A35' }}
        />
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>
      <button
        type="submit"
        className="px-5 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
        style={{ background: '#E50935' }}
      >
        Search
      </button>
    </form>
  );
}
