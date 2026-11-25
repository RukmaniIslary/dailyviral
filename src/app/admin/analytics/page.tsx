import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { Eye, ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';

export default async function AdminAnalyticsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalViews,
    totalClicks,
    weeklyViews,
    weeklyClicks,
    monthlyViews,
    topPosts,
  ] = await Promise.all([
    prisma.postView.count(),
    prisma.externalLinkClick.count(),
    prisma.postView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.externalLinkClick.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.postView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        clicks: true,
        thumbnailUrl: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  const stats = [
    { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: '#3B82F6', sub: 'All time' },
    { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: ExternalLink, color: '#E50935', sub: 'All time' },
    { label: '7-Day Views', value: weeklyViews.toLocaleString(), icon: TrendingUp, color: '#10B981', sub: 'Last 7 days' },
    { label: '7-Day Clicks', value: weeklyClicks.toLocaleString(), icon: ExternalLink, color: '#F59E0B', sub: 'Last 7 days' },
    { label: '30-Day Views', value: monthlyViews.toLocaleString(), icon: BarChart3, color: '#6366F1', sub: 'Last 30 days' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0B0B0F' }}>
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">Analytics</h1>
          <p className="text-gray-500 text-sm">Real-time statistics from the database</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${stat.color}20` }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                <p className="text-xs text-gray-700">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Top posts */}
        <div className="rounded-xl p-5" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} style={{ color: '#E50935' }} />
            Top 10 Posts by Views
          </h2>
          {topPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {topPosts.map((post, i) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#0B0B0F' }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: i === 0 ? '#E50935' : '#2A2A35', color: '#fff' }}
                  >
                    {i + 1}
                  </span>
                  <img
                    src={post.thumbnailUrl}
                    alt=""
                    className="w-14 h-9 rounded object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/post/${post.slug}`}
                      target="_blank"
                      className="text-sm text-white hover:text-red-400 transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-600">{post.category.name}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                    <span className="flex items-center gap-1"><Eye size={11} /> {post.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><ExternalLink size={11} /> {post.clicks.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
