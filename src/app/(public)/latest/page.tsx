import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import PostGrid from '@/components/posts/PostGrid';

const PAGE_SIZE = 24;
export const metadata: Metadata = { title: 'Latest Posts – Daily Viral MMS' };

interface Props { searchParams: Promise<{ page?: string; featured?: string }>; }

export default async function LatestPage({ searchParams }: Props) {
  const { page: p, featured: f } = await searchParams;
  const page = Math.max(1, parseInt(p || '1'));
  const featured = f === 'true';
  const where = { status: 'PUBLISHED' as const, ...(featured ? { isFeatured: true } : {}) };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { category: { select: { name: true, slug: true } } } }),
    prisma.post.count({ where }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 4 }}>{featured ? 'Featured Posts' : 'Latest Posts'}</h1>
          <p style={{ fontSize: 14, color: '#999' }}>{total.toLocaleString()} posts</p>
        </div>
        <PostGrid posts={JSON.parse(JSON.stringify(posts))} columns={4} />
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {page > 1 && <Link href={`/latest?page=${page - 1}`} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, fontWeight: 600, color: '#555', background: '#fff' }}>Previous</Link>}
            <span style={{ padding: '9px 16px', fontSize: 13, color: '#999' }}>Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`/latest?page=${page + 1}`} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, fontWeight: 600, color: '#555', background: '#fff' }}>Next</Link>}
          </div>
        )}
      </div>
    </div>
  );
}
