'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  clicks: number;
  isFeatured: boolean;
  createdAt: string;
  thumbnailUrl: string;
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  initialPosts: Post[];
  total: number;
  page: number;
  pageSize: number;
  categories: Category[];
}

export default function PostsTableClient({ initialPosts, total, page, pageSize, categories }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const totalPages = Math.ceil(total / pageSize);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Delete failed');
      }
    } catch {
      alert('Network error');
    } finally {
      setDeleting(null);
    }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.elements.namedItem('q') as HTMLInputElement).value.trim();
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    url.searchParams.set('page', '1');
    router.push(url.pathname + url.search);
  }

  function handleFilterStatus(status: string) {
    const url = new URL(window.location.href);
    if (status) url.searchParams.set('status', status);
    else url.searchParams.delete('status');
    url.searchParams.set('page', '1');
    router.push(url.pathname + url.search);
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">All Posts</h1>
          <p className="text-gray-500 text-sm">{total.toLocaleString()} total posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white w-fit"
          style={{ background: '#E50935' }}
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <input
              name="q"
              placeholder="Search posts..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
              style={{ background: '#17171D', border: '1px solid #2A2A35' }}
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: '#E50935' }}
          >
            Go
          </button>
        </form>

        {(['', 'PUBLISHED', 'DRAFT'] as const).map((s) => (
          <button
            key={s}
            onClick={() => handleFilterStatus(s)}
            className="px-3 py-2 rounded-xl text-xs font-medium transition-colors"
            style={{
              background: '#17171D',
              border: '1px solid #2A2A35',
              color: '#9CA3AF',
            }}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500">No posts found.</p>
            <Link href="/admin/posts/new" className="mt-3 inline-block text-sm" style={{ color: '#E50935' }}>
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A35' }}>
                  {['Post', 'Category', 'Status', 'Views', 'Clicks', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors hover:bg-white/5"
                    style={{ borderBottom: '1px solid #1E1E26' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.thumbnailUrl}
                          alt=""
                          className="w-14 h-9 rounded object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div>
                          <p className="text-white font-medium line-clamp-1 max-w-xs">{post.title}</p>
                          {post.isFeatured && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ background: 'rgba(229,9,53,0.1)', color: '#E50935' }}
                            >
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{post.category.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          background: post.status === 'PUBLISHED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          color: post.status === 'PUBLISHED' ? '#10B981' : '#F59E0B',
                        }}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {post.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      <span className="flex items-center gap-1">
                        <ExternalLink size={12} /> {post.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(post.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <Link
                          href={`/post/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleting === post.id}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/10 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          <Link
            href={`/admin/posts?page=${page - 1}`}
            className="p-2 rounded-lg disabled:opacity-30"
            style={{ background: '#17171D', border: '1px solid #2A2A35', color: '#9CA3AF', pointerEvents: page === 1 ? 'none' : 'auto', opacity: page === 1 ? 0.3 : 1 }}
          >
            <ChevronLeft size={16} />
          </Link>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`/admin/posts?page=${page + 1}`}
            className="p-2 rounded-lg"
            style={{ background: '#17171D', border: '1px solid #2A2A35', color: '#9CA3AF', pointerEvents: page === totalPages ? 'none' : 'auto', opacity: page === totalPages ? 0.3 : 1 }}
          >
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </>
  );
}
