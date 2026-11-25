'use client';

import Link from 'next/link';
import { FileText, Eye, ExternalLink, Grid3X3, TrendingUp, Plus, Flag } from 'lucide-react';
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

export default function DashboardClient({ email, stats, recentPosts, mostViewed }: Props) {
  const statCards = [
    { label: 'Published Posts', value: stats.totalPublished.toLocaleString(), icon: FileText, color: '#10B981' },
    { label: 'Draft Posts', value: stats.totalDrafts.toLocaleString(), icon: FileText, color: '#F59E0B' },
    { label: 'Categories', value: stats.totalCategories.toLocaleString(), icon: Grid3X3, color: '#6366F1' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: '#3B82F6' },
    { label: 'Link Clicks', value: stats.totalClicks.toLocaleString(), icon: ExternalLink, color: '#E50935' },
    { label: 'Pending Reports', value: stats.pendingReports.toLocaleString(), icon: Flag, color: '#F59E0B' },
  ];

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {email}</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#E50935' }}
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl p-4" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${stat.color}20` }}>
                <Icon size={16} style={{ color: stat.color }} />
              </div>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div className="rounded-xl p-5" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs text-gray-500 hover:text-white">View all</Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-3">
                <img
                  src={post.thumbnailUrl}
                  alt=""
                  className="w-12 h-8 rounded object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/posts/${post.id}`} className="text-sm text-white hover:text-red-400 line-clamp-1">
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-600">{post.category.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      background: post.status === 'PUBLISHED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: post.status === 'PUBLISHED' ? '#10B981' : '#F59E0B',
                    }}>
                      {post.status}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-600 flex-shrink-0">{formatDate(post.createdAt)}</span>
              </div>
            ))}
            {recentPosts.length === 0 && <p className="text-sm text-gray-600">No posts yet.</p>}
          </div>
        </div>

        {/* Most viewed */}
        <div className="rounded-xl p-5" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} style={{ color: '#E50935' }} /> Most Viewed
            </h2>
          </div>
          <div className="space-y-3">
            {mostViewed.map((post, i) => (
              <div key={post.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: i === 0 ? '#E50935' : '#2A2A35', color: '#fff' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={`/post/${post.slug}`} target="_blank" className="text-sm text-white hover:text-red-400 line-clamp-1">
                    {post.title}
                  </Link>
                  <p className="text-xs text-gray-600">{post.category.name}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                  <Eye size={11} /> {post.views.toLocaleString()}
                </div>
              </div>
            ))}
            {mostViewed.length === 0 && <p className="text-sm text-gray-600">No data yet.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
