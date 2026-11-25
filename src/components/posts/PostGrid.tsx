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
    <>
      <style>{`
        .post-grid {
          display: grid;
          grid-template-columns: ${colMap[columns]};
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .post-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .post-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .post-grid { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>
      <div className="post-grid">
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </>
  );
}
