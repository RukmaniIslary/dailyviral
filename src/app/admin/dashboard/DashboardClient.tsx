'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';

interface Post { id: string; title: string; slug: string; status: string; views: number; thumbnailUrl: string; createdAt: string; category: { name: string }; }

interface Props {
  email: string;
  stats: { totalPublished: number; totalDrafts: number; totalCategories: number; totalViews: number; totalClicks: number; pendingReports: number; };
  recentPosts: Post[];
  mostViewed: Post[];
}

const CARDS = [
  { key: 'totalPublished', label: 'Published', accent: '#10b981' },
  { key: 'totalDrafts', label: 'Drafts', accent: '#f59e0b' },
  { key: 'totalCategories', label: 'Categories', accent: '#6366f1' },
  { key: 'totalViews', label: 'Total Views', accent: '#00aff0' },
  { key: 'totalClicks', label: 'Link Clicks', accent: '#e50935' },
  { key: 'pendingReports', label: 'Reports', accent: '#f59e0b' },
] as const;

export default function DashboardClient({ email, stats, recentPosts, mostViewed }: Props) {
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 2 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: '#999' }}>Signed in as {email}</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary" style={{ borderRadius: 10, padding: '10px 22px' }}>
          + New Post
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 14, marginBottom: 28 }}>
        {CARDS.map(c => (
          <div key={c.key} style={{ background: '#fff', borderRadius: 12, padding: '20px 18px', border: '1.5px solid #e8e8e8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: c.accent, marginBottom: 14 }} />
            <div style={{ fontSize: 28, fontWeight: 900, color: '#111', lineHeight: 1 }}>{stats[c.key].toLocaleString()}</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 5 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 18 }}>

        <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e8e8e8', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Recent Posts</h2>
            <Link href="/admin/posts" style={{ fontSize: 12, color: '#00aff0', fontWeight: 700 }}>View all</Link>
          </div>
          {recentPosts.length === 0
            ? <p style={{ padding: 20, fontSize: 13, color: '#999', textAlign: 'center' }}>No posts yet</p>
            : recentPosts.map(post => (
              <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: '1px solid #fafafa' }}>
                <div style={{ width: 48, height: 32, borderRadius: 6, background: '#f5f5f5', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={post.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/admin/posts/${post.id}`} style={{ fontSize: 13, fontWeight: 600, color: '#111', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</Link>
                  <div style={{ display: 'flex', gap: 7, marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: '#999' }}>{post.category.name}</span>
                    <span className={`badge ${post.status === 'PUBLISHED' ? 'badge-green' : 'badge-yellow'}`}>{post.status === 'PUBLISHED' ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#ccc', flexShrink: 0 }}>{formatDate(post.createdAt)}</span>
              </div>
            ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e8e8e8', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Most Viewed</h2>
          </div>
          {mostViewed.length === 0
            ? <p style={{ padding: 20, fontSize: 13, color: '#999', textAlign: 'center' }}>No data yet</p>
            : mostViewed.map((post, i) => (
              <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: '1px solid #fafafa' }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? '#00aff0' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: i === 0 ? '#fff' : '#64748b', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/post/${post.slug}`} target="_blank" style={{ fontSize: 13, fontWeight: 600, color: '#111', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</Link>
                  <span style={{ fontSize: 11, color: '#999' }}>{post.category.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#00aff0', flexShrink: 0 }}>{post.views.toLocaleString()} views</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
