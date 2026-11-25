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

export default function PostGrid({ posts, columns = 3 }: { posts: Post[]; columns?: 2 | 3 | 4 }) {
  if (posts.length === 0) {
    return <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>No posts found.</div>;
  }

  const colMap = { 2: 'repeat(2, 1fr)', 3: 'repeat(3, 1fr)', 4: 'repeat(4, 1fr)' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: colMap[columns], gap: 16 }}>
      <style>{`
        @media (max-width: 1024px) {
          .post-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .post-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .post-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
