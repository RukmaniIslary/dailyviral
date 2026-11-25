'use client';

import Link from 'next/link';
import { Eye, Calendar, Tag } from 'lucide-react';
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
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const date = post.publishedAt || post.createdAt;

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group block rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ background: '#17171D', border: '1px solid #2A2A35' }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        {post.isFeatured && (
          <span
            className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-xs font-bold text-white"
            style={{ background: '#E50935' }}
          >
            Featured
          </span>
        )}
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect fill='%2317171D' width='400' height='225'/%3E%3Ctext fill='%23374151' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage unavailable%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
          {post.title}
        </h3>

        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
          <Link
            href={`/category/${post.category.slug}`}
            className="flex items-center gap-1 hover:text-red-400 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Tag size={11} />
            {post.category.name}
          </Link>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {post.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Calendar size={11} />
            {formatDistanceToNow(new Date(date))}
          </span>
        </div>
      </div>
    </Link>
  );
}
