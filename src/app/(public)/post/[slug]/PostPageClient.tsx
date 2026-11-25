'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Calendar, Tag, ExternalLink, Flag, Share2, ChevronRight } from 'lucide-react';
import PostGrid from '@/components/posts/PostGrid';
import SectionHeader from '@/components/ui/SectionHeader';
import { formatDate } from '@/lib/utils/date';
import ReportModal from '@/components/posts/ReportModal';

interface Post {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string;
  externalUrl: string;
  views: number;
  clicks: number;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  category: { id: string; name: string; slug: string };
  tags: Array<{ tag: { id: string; name: string; slug: string } }>;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  views: number;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  category: { name: string; slug: string };
}

interface Props {
  post: Post;
  related: RelatedPost[];
}

export default function PostPageClient({ post, related }: Props) {
  const [reportOpen, setReportOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Record view
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'view', postId: post.id }),
    }).catch(() => {});
  }, [post.id]);

  async function handleVisit() {
    setLoading(true);
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'click', postId: post.id }),
      });
      const data = await res.json();
      const url = data.redirectUrl || post.externalUrl;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(post.externalUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  const date = post.publishedAt || post.createdAt;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/category/${post.category.slug}`} className="hover:text-white transition-colors">
          {post.category.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-400 truncate max-w-xs">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Thumbnail */}
          <div className="rounded-2xl overflow-hidden aspect-video mb-6" style={{ background: '#17171D' }}>
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect fill='%2317171D' width='800' height='450'/%3E%3Ctext fill='%23374151' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage unavailable%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Title and meta */}
          <h1 className="text-2xl md:text-3xl font-black text-white mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <Link
              href={`/category/${post.category.slug}`}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:text-white transition-colors"
              style={{ background: '#17171D', border: '1px solid #2A2A35' }}
            >
              <Tag size={12} />
              {post.category.name}
            </Link>
            <span className="flex items-center gap-1.5">
              <Eye size={14} /> {post.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(date)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleVisit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#E50935' }}
            >
              <ExternalLink size={18} />
              {loading ? 'Loading...' : 'Visit Content'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-300 hover:text-white transition-colors"
              style={{ background: '#17171D', border: '1px solid #2A2A35' }}
            >
              <Share2 size={16} /> Share
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-500 hover:text-white transition-colors"
              style={{ background: '#17171D', border: '1px solid #2A2A35' }}
            >
              <Flag size={16} /> Report
            </button>
          </div>

          {/* Description */}
          {post.description && (
            <div
              className="rounded-xl p-5 mb-6"
              style={{ background: '#17171D', border: '1px solid #2A2A35' }}
            >
              <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Description</h2>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{post.description}</p>
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/search?q=${encodeURIComponent(tag.name)}`}
                    className="px-3 py-1 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
                    style={{ background: '#17171D', border: '1px solid #2A2A35' }}
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div
            className="rounded-xl p-5 sticky top-24"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <h3 className="text-sm font-bold text-white mb-4">Post Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Category</span>
                <Link href={`/category/${post.category.slug}`} className="text-white hover:opacity-80">
                  {post.category.name}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Views</span>
                <span className="text-white">{post.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Published</span>
                <span className="text-white">{formatDate(date)}</span>
              </div>
              {post.isFeatured && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Featured</span>
                  <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: '#E50935', color: '#fff' }}>
                    Yes
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleVisit}
              disabled={loading}
              className="mt-5 w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: '#E50935' }}
            >
              <ExternalLink size={16} />
              Visit Content
            </button>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mt-12">
          <SectionHeader title="Related Posts" icon={<Tag size={16} />} />
          <PostGrid posts={related} columns={3} />
        </div>
      )}

      {/* Report modal */}
      {reportOpen && <ReportModal postId={post.id} onClose={() => setReportOpen(false)} />}
    </div>
  );
}
