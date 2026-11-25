'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PostGrid from '@/components/posts/PostGrid';
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

export default function PostPageClient({ post, related }: { post: Post; related: RelatedPost[] }) {
  const [reportOpen, setReportOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
      window.open(data.redirectUrl || post.externalUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(post.externalUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setLoading(false);
    }
  }

  const date = post.publishedAt || post.createdAt;

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#999', marginBottom: 24, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#e50935' }}>Home</Link>
          <span>›</span>
          <Link href={`/category/${post.category.slug}`} style={{ color: '#e50935' }}>{post.category.name}</Link>
          <span>›</span>
          <span style={{ color: '#666' }}>{post.title.substring(0, 50)}{post.title.length > 50 ? '...' : ''}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>

          {/* Main */}
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>

            {/* Thumbnail */}
            <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect fill='%23f0f0f0' width='800' height='450'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage unavailable%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <div style={{ padding: '24px 28px' }}>
              {/* Category tag */}
              <Link href={`/category/${post.category.slug}`}
                style={{ display: 'inline-block', background: '#fff0f3', color: '#e50935', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: 12 }}>
                {post.category.name}
              </Link>

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, color: '#1a1a2e', marginBottom: 16, lineHeight: 1.3 }}>
                {post.title}
              </h1>

              {/* Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13, color: '#888', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                <span>&#128065; {post.views.toLocaleString()} views</span>
                <span>&#128197; {formatDate(date)}</span>
                {post.isFeatured && <span style={{ color: '#e50935', fontWeight: 700 }}>&#11088; Featured</span>}
              </div>

              {/* BIG WATCH BUTTON */}
              <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: 16, padding: '28px 24px', textAlign: 'center', marginBottom: 24 }}>
                <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>Click below to watch the full content</p>
                <button
                  onClick={handleVisit}
                  disabled={loading}
                  style={{ background: 'linear-gradient(135deg, #e50935 0%, #c4072d 100%)', color: '#fff', border: 'none', borderRadius: 50, padding: '16px 48px', fontSize: 20, fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 24px rgba(229,9,53,0.4)', transition: 'all 0.2s', letterSpacing: 0.5, display: 'inline-flex', alignItems: 'center', gap: 12 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(229,9,53,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(229,9,53,0.4)'; }}
                >
                  <span style={{ fontSize: 24 }}>&#9654;</span>
                  {loading ? 'Loading...' : 'Watch Now'}
                </button>
                <p style={{ color: '#64748b', fontSize: 12, marginTop: 12 }}>Opens in a new tab</p>
              </div>

              {/* Description */}
              {post.description && (
                <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Description</h3>
                  <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7 }}>{post.description}</p>
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Tags</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {post.tags.map(({ tag }) => (
                      <Link key={tag.id} href={`/search?q=${encodeURIComponent(tag.name)}`}
                        style={{ padding: '5px 14px', borderRadius: 20, background: '#f0f0f0', color: '#555', fontSize: 13, fontWeight: 500, border: '1px solid #e0e0e0' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fff0f3'; e.currentTarget.style.color = '#e50935'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f0f0f0'; e.currentTarget.style.color = '#555'; }}>
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid #f0f0f0', flexWrap: 'wrap' }}>
                <button
                  onClick={handleVisit}
                  disabled={loading}
                  style={{ flex: 1, minWidth: 160, background: '#e50935', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  &#9654; {loading ? 'Loading...' : 'Watch Full Video'}
                </button>
                <button
                  onClick={() => { if (navigator.share) navigator.share({ title: post.title, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
                  style={{ padding: '12px 20px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  &#128279; Share
                </button>
                <button
                  onClick={() => setReportOpen(true)}
                  style={{ padding: '12px 16px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#999', fontSize: 14, cursor: 'pointer' }}>
                  &#9873; Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 4, height: 24, background: '#e50935', borderRadius: 2 }} />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>Related Posts</h2>
            </div>
            <PostGrid posts={related} columns={3} />
          </div>
        )}
      </div>

      {reportOpen && <ReportModal postId={post.id} onClose={() => setReportOpen(false)} />}
    </div>
  );
}
