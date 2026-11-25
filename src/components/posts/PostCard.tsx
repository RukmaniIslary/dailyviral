'use client';

import Link from 'next/link';
import { formatDistanceToNow } from '@/lib/utils/date';

interface Props {
  post: {
    id: string; title: string; slug: string; thumbnailUrl: string;
    views: number; isFeatured: boolean;
    publishedAt: Date | string | null; createdAt: Date | string;
    category: { name: string; slug: string };
  };
}

export default function PostCard({ post }: Props) {
  const date = post.publishedAt || post.createdAt;
  return (
    <Link href={`/post/${post.slug}`} className="post-card">
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#f0f0f0', overflow: 'hidden' }}>
        {post.isFeatured && (
          <span style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, background: '#00aff0', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 25, letterSpacing: .5 }}>
            Featured
          </span>
        )}
        <img className="post-thumb" src={post.thumbnailUrl} alt={post.title} loading="lazy"
          onError={e => {
            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect fill='%23f0f0f0' width='400' height='225'/%3E%3Ctext fill='%23bbb' font-family='sans-serif' font-size='13' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
          }} />
        {/* Play overlay */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0)', transition: 'background .2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,175,240,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="#fff"><path d="M0 0l16 9L0 18V0z"/></svg>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <h3 className="clamp2" style={{ fontSize: 14, fontWeight: 700, color: '#111', lineHeight: 1.4, marginBottom: 8 }}>
          {post.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: '#e6f7fe', color: '#00aff0', padding: '3px 9px', borderRadius: 25 }}>
            {post.category.name}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#999' }}>
            <span>{post.views.toLocaleString()} views</span>
            <span>{formatDistanceToNow(new Date(date))}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
