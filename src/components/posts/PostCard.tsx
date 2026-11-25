'use client';

import Link from 'next/link';
import { formatDistanceToNow } from '@/lib/utils/date';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string;
    views: number;
    isFeatured: boolean;
    publishedAt: Date | string | null;
    createdAt: Date | string;
    category: { name: string; slug: string };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const date = post.publishedAt || post.createdAt;

  return (
    <Link href={`/post/${post.slug}`} style={{ display: 'block', textDecoration: 'none', borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}>

      {/* Thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '16/9', background: '#f0f0f0', overflow: 'hidden' }}>
        {post.isFeatured && (
          <span style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, background: '#e50935', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
            Featured
          </span>
        )}
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
          loading="lazy"
          onError={e => {
            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect fill='%23f0f0f0' width='400' height='225'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
        {/* Play button overlay */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0)', transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.3)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(229,9,53,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
            className="play-btn">
            <span style={{ color: '#fff', fontSize: 18, marginLeft: 3 }}>&#9654;</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.4, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 600, background: '#fff0f3', color: '#e50935', padding: '3px 8px', borderRadius: 20 }}>
            {post.category.name}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#999' }}>
            <span>&#128065; {post.views.toLocaleString()}</span>
            <span>{formatDistanceToNow(new Date(date))}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
