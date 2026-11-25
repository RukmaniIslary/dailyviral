'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';

interface Post {
  id: string; title: string; slug: string; status: string;
  views: number; clicks: number; isFeatured: boolean;
  createdAt: string; thumbnailUrl: string;
  category: { name: string };
}

interface Category { id: string; name: string; }

interface Props {
  initialPosts: Post[]; total: number; page: number; pageSize: number; categories: Category[];
}

const inputStyle = { padding: '9px 14px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, color: '#111', background: '#fff', outline: 'none' } as const;

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
      if (res.ok) setPosts(prev => prev.filter(p => p.id !== id));
      else alert('Delete failed');
    } catch { alert('Network error'); }
    finally { setDeleting(null); }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim();
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
    url.searchParams.set('page', '1');
    router.push(url.pathname + url.search);
  }

  function setStatusFilter(s: string) {
    const url = new URL(window.location.href);
    if (s) url.searchParams.set('status', s); else url.searchParams.delete('status');
    url.searchParams.set('page', '1');
    router.push(url.pathname + url.search);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 2 }}>All Posts</h1>
          <p style={{ fontSize: 13, color: '#999' }}>{total.toLocaleString()} posts total</p>
        </div>
        <Link href="/admin/posts/new" style={{ background: '#00aff0', color: '#fff', padding: '10px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, boxShadow: '0 2px 8px rgba(0,175,240,0.25)' }}>
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input name="q" placeholder="Search posts..." style={{ ...inputStyle, width: 220 }}
            onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
          <button type="submit" style={{ ...inputStyle, background: '#00aff0', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', padding: '9px 18px' }}>
            Search
          </button>
        </form>
        <div style={{ display: 'flex', gap: 6 }}>
          {['All', 'PUBLISHED', 'DRAFT'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s === 'All' ? '' : s)}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#555', cursor: 'pointer' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e8e8e8', overflow: 'hidden' }}>
        {posts.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ color: '#999', marginBottom: 12 }}>No posts found.</p>
            <Link href="/admin/posts/new" style={{ color: '#00aff0', fontWeight: 700, fontSize: 14 }}>Create your first post</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  {['Post', 'Category', 'Status', 'Views', 'Clicks', 'Date', 'Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Fixed size thumbnail - never grows */}
                        <div style={{ width: 72, height: 48, borderRadius: 6, background: '#f5f5f5', flexShrink: 0, overflow: 'hidden' }}>
                          <img src={post.thumbnailUrl} alt=""
                            style={{ width: 72, height: 48, objectFit: 'cover', display: 'block' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
                            {post.title}
                          </p>
                          {post.isFeatured && (
                            <span style={{ fontSize: 10, fontWeight: 700, background: '#e6f7fe', color: '#00aff0', padding: '1px 7px', borderRadius: 25 }}>Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{post.category.name}</td>
                    <td>
                      <span className={`badge ${post.status === 'PUBLISHED' ? 'badge-green' : 'badge-yellow'}`}>
                        {post.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ color: '#555' }}>{post.views.toLocaleString()}</td>
                    <td style={{ color: '#555' }}>{post.clicks.toLocaleString()}</td>
                    <td style={{ fontSize: 12, color: '#aaa' }}>{formatDate(post.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/admin/posts/${post.id}`}
                          style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #e0e0e0', fontSize: 12, fontWeight: 600, color: '#555', background: '#fff' }}>
                          Edit
                        </Link>
                        <Link href={`/post/${post.slug}`} target="_blank"
                          style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #e0e0e0', fontSize: 12, fontWeight: 600, color: '#00aff0', background: '#fff' }}>
                          View
                        </Link>
                        <button onClick={() => handleDelete(post.id, post.title)} disabled={deleting === post.id}
                          style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #fecdd3', fontSize: 12, fontWeight: 600, color: '#e50935', background: '#fff', cursor: 'pointer', opacity: deleting === post.id ? 0.5 : 1 }}>
                          Delete
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          <Link href={`/admin/posts?page=${page - 1}`}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, fontWeight: 600, color: page === 1 ? '#ccc' : '#555', pointerEvents: page === 1 ? 'none' : 'auto', background: '#fff' }}>
            Previous
          </Link>
          <span style={{ fontSize: 13, color: '#999' }}>Page {page} of {totalPages}</span>
          <Link href={`/admin/posts?page=${page + 1}`}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, fontWeight: 600, color: page === totalPages ? '#ccc' : '#555', pointerEvents: page === totalPages ? 'none' : 'auto', background: '#fff' }}>
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
