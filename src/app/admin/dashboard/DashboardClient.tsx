'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  thumbnailUrl: string;
  createdAt: string;
  category: { name: string };
}

interface Props {
  email: string;
  stats: {
    totalPublished: number;
    totalDrafts: number;
    totalCategories: number;
    totalViews: number;
    totalClicks: number;
    pendingReports: number;
  };
  recentPosts: Post[];
  mostViewed: Post[];
}

const STAT_CARDS = [
  { key: 'totalPublished', label: 'Published Posts', accent: '#10b981' },
  { key: 'totalDrafts', label: 'Draft Posts', accent: '#f59e0b' },
  { key: 'totalCategories', label: 'Categories', accent: '#6366f1' },
  { key: 'totalViews', label: 'Total Views', accent: '#3b82f6' },
  { key: 'totalClicks', label: 'Link Clicks', accent: '#e50935' },
  { key: 'pendingReports', label: 'Pending Reports', accent: '#f59e0b' },
] as const;

export default function DashboardClient({ email, stats, recentPosts, mostViewed }: Props) {
  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 2 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Signed in as {email}</p>
        </div>
        <Link href="/admin/posts/new" style={{
          background: '#e50935', color: '#fff', padding: '10px 22px',
          borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(229,9,53,0.25)',
        }}>
          + New Post
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {STAT_CARDS.map(card => (
          <div key={card.key} style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: card.accent, marginBottom: 12 }} />
            <div style={{ fontSize: 30, fontWeight: 900, color: '#1a1a2e', lineHeight: 1 }}>
              {stats[card.key].toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>

        {/* Recent posts */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>Recent Posts</h2>
            <Link href="/admin/posts" style={{ fontSize: 12, color: '#e50935', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
          </div>
          {recentPosts.length === 0 ? (
            <p style={{ padding: 20, fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>No posts yet</p>
          ) : recentPosts.map(post => (
            <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #fafafa' }}>
              <div style={{ width: 48, height: 32, borderRadius: 6, background: '#f1f5f9', flexShrink: 0, overflow: 'hidden' }}>
                <img src={post.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/admin/posts/${post.id}`} style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.title}
                </Link>
                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{post.category.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: post.status === 'PUBLISHED' ? '#ecfdf5' : '#fffbeb', color: post.status === 'PUBLISHED' ? '#10b981' : '#f59e0b' }}>
                    {post.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#cbd5e1', flexShrink: 0 }}>{formatDate(post.createdAt)}</span>
            </div>
          ))}
        </div>

        {/* Most viewed */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>Most Viewed</h2>
          </div>
          {mostViewed.length === 0 ? (
            <p style={{ padding: 20, fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>No data yet</p>
          ) : mostViewed.map((post, i) => (
            <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #fafafa' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? '#e50935' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: i === 0 ? '#fff' : '#64748b', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/post/${post.slug}`} target="_blank" style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.title}
                </Link>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{post.category.name}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', flexShrink: 0 }}>{post.views.toLocaleString()} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
