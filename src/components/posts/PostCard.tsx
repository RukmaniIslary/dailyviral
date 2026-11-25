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
      {/* Thumbnail */}
      <div style={{ position: 'relative', background: '#1a1a1a', overflow: 'hidden' }}>
        {post.isFeatured && (
          <span style={{
            position: 'absolute', top: 8, left: 8, zIndex: 2,
            background: '#00aff0', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '3px 9px',
            borderRadius: 25, letterSpacing: .5,
          }}>
            Featured
          </span>
        )}
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          loading="lazy"
          style={{
            width: '100%',
            aspectRatio: '4/3',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform .3s',
          }}
          onError={e => {
            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23bbb' font-family='sans-serif' font-size='13' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        {/* Category + title */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            display: 'inline-block',
            fontSize: 11, fontWeight: 700,
            background: '#e6f7fe', color: '#00aff0',
            padding: '2px 10px', borderRadius: 25,
            marginBottom: 6,
          }}>
            {post.category.name}
          </span>
          <h3 style={{
            fontSize: 14, fontWeight: 700, color: '#111',
            lineHeight: 1.45, margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {post.title}
          </h3>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#888' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Eye icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {post.views.toLocaleString()}
          </span>
          <span>{formatDistanceToNow(new Date(date))}</span>
        </div>
      </div>
    </Link>
  );
}
