'use client';

import PostCard from './PostCard';

interface Post {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  views: number;
  isFeatured: boolean;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  category: { name: string; slug: string };
}

interface PostGridProps {
  posts: Post[];
  columns?: 2 | 3 | 4;
}

export default function PostGrid({ posts, columns = 3 }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500">No posts found.</p>
      </div>
    );
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
