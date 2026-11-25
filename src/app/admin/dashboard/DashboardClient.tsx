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

const statCards = (stats: Props['stats']) => [
  { label: 'Published Posts', value: stats.totalPublished, color: '#10b981', bg: '#ecfdf5', emoji: '✅' },
  { label: 'Draft Posts', value: stats.totalDrafts, color: '#f59e0b', bg: '#fffbeb', emoji: '📋' },
  { label: 'Categories', value: stats.totalCategories, color: '#6366f1', bg: '#eef2ff', emoji: '🗂️' },
  { label: 'Total Views', value: stats.totalViews, color: '#3b82f6', bg: '#eff6ff', emoji: '👁️' },
  { label: 'Link Clicks', value: stats.totalClicks, color: '#e50935', bg: '#fff0f3', emoji: '🔗' },
  { label: 'Pending Reports', value: stats.pendingReports, color: '#f59e0b', bg: '#fffbeb', emoji: '🚩' },
];

export default function DashboardClient({ email, stats, recentPosts, mostViewed }: Props) {
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a2e', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Welcome back, <strong>{email}</strong></p>
        </div>
        <Link href="/admin/posts/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#e50935', color: '#fff', padding: '10px 20px',
          borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(229,9,53,0.3)'
        }}>
          ➕ New Post
        </Link>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards(stats).map(card => (
          <div key={card.label} style={{
            background: '#fff', borderRadius: 14, padding: '20px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {card.emoji}
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#1a1a2e', lineHeight: 1 }}>{card.value.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tables row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>

        {/* Recent posts */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #f5f5f5' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e' }}>Recent Posts</h2>
            <Link href="/admin/posts" style={{ fontSize: 12, color: '#e50935', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {recentPosts.length === 0 ? (
              <p style={{ padding: '20px', fontSize: 13, color: '#999', textAlign: 'center' }}>No posts yet</p>
            ) : recentPosts.map(post => (
              <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: '1px solid #fafafa' }}>
                <img src={post.thumbnailUrl} alt="" style={{ width: 52, height: 34, borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: '#f0f0f0' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/admin/posts/${post.id}`} style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </Link>
                  <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{post.category.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: post.status === 'PUBLISHED' ? '#ecfdf5' : '#fffbeb', color: post.status === 'PUBLISHED' ? '#10b981' : '#f59e0b' }}>
                      {post.status}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: 11, color: '#cbd5e1', flexShrink: 0 }}>{formatDate(post.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most viewed */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f5f5f5' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e' }}>📈 Most Viewed</h2>
          </div>
          <div style={{ padding: '8px 0' }}>
            {mostViewed.length === 0 ? (
              <p style={{ padding: '20px', fontSize: 13, color: '#999', textAlign: 'center' }}>No data yet</p>
            ) : mostViewed.map((post, i) => (
              <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: '1px solid #fafafa' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? '#e50935' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: i === 0 ? '#fff' : '#64748b', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/post/${post.slug}`} target="_blank" style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </Link>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{post.category.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', flexShrink: 0 }}>👁 {post.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
