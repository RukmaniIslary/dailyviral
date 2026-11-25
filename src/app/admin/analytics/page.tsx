import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';

export default async function AdminAnalyticsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalViews, totalClicks, weeklyViews, weeklyClicks, monthlyViews, topPosts] = await Promise.all([
    prisma.postView.count(),
    prisma.externalLinkClick.count(),
    prisma.postView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.externalLinkClick.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.postView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { views: 'desc' }, take: 10, select: { id: true, title: true, slug: true, views: true, clicks: true, thumbnailUrl: true, category: { select: { name: true } } } }),
  ]);

  const stats = [
    { label: 'Total Views', value: totalViews, accent: '#3b82f6' },
    { label: 'Total Clicks', value: totalClicks, accent: '#e50935' },
    { label: '7-Day Views', value: weeklyViews, accent: '#10b981' },
    { label: '7-Day Clicks', value: weeklyClicks, accent: '#f59e0b' },
    { label: '30-Day Views', value: monthlyViews, accent: '#6366f1' },
  ];

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '32px 28px' }} className="admin-main">
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 28 }}>Analytics</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <div style={{ width: 4, height: 32, borderRadius: 2, background: s.accent, marginBottom: 12 }} />
              <div style={{ fontSize: 30, fontWeight: 900, color: '#1a1a2e', lineHeight: 1 }}>{s.value.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>Top Posts by Views</h2>
          </div>
          {topPosts.length === 0 ? (
            <p style={{ padding: 20, color: '#94a3b8', fontSize: 14, textAlign: 'center' }}>No data yet</p>
          ) : topPosts.map((post, i) => (
            <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid #fafafa' }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? '#e50935' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: i === 0 ? '#fff' : '#64748b', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ width: 48, height: 32, borderRadius: 6, background: '#f1f5f9', flexShrink: 0, overflow: 'hidden' }}>
                <img src={post.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/post/${post.slug}`} target="_blank" style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {post.title}
                </Link>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{post.category.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, flexShrink: 0 }}>
                <span style={{ color: '#3b82f6', fontWeight: 600 }}>{post.views.toLocaleString()} views</span>
                <span style={{ color: '#e50935', fontWeight: 600 }}>{post.clicks.toLocaleString()} clicks</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <style>{`@media (max-width: 768px) { .admin-main { margin-left: 0 !important; padding-top: 72px !important; } }`}</style>
    </div>
  );
}
