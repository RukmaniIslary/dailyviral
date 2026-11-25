import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import PostGrid from '@/components/posts/PostGrid';
import SearchForm from './SearchForm';

const PAGE_SIZE = 20;

interface Props {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: "${q}" – Daily Viral MMS` : 'Search – Daily Viral MMS' };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page: pageParam = '1', category } = await searchParams;
  const page = Math.max(1, parseInt(pageParam));
  const query = q.trim();

  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  let total = 0;

  if (query) {
    const where = {
      status: 'PUBLISHED' as const,
      ...(category ? { category: { slug: category } } : {}),
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { description: { contains: query, mode: 'insensitive' as const } },
        { tags: { some: { tag: { name: { contains: query, mode: 'insensitive' as const } } } } },
      ],
    };
    [posts, total] = await Promise.all([
      prisma.post.findMany({ where, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { category: { select: { name: true, slug: true } } } }),
      prisma.post.count({ where }),
    ]);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 20 }}>Search</h1>
        <div style={{ marginBottom: 28 }}>
          <SearchForm initialQuery={query} />
        </div>

        {query ? (
          <>
            <p style={{ fontSize: 14, color: '#999', marginBottom: 24 }}>
              {total > 0
                ? <>{total.toLocaleString()} result{total !== 1 ? 's' : ''} for <strong style={{ color: '#111' }}>"{query}"</strong></>
                : <>No results for <strong style={{ color: '#111' }}>"{query}"</strong></>
              }
            </p>

            {total > 0 ? (
              <>
                <PostGrid posts={JSON.parse(JSON.stringify(posts))} columns={4} />
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                    {page > 1 && (
                      <Link href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                        style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, fontWeight: 600, color: '#555', background: '#fff' }}>
                        Previous
                      </Link>
                    )}
                    <span style={{ padding: '9px 16px', fontSize: 13, color: '#999' }}>Page {page} of {totalPages}</span>
                    {page < totalPages && (
                      <Link href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                        style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, fontWeight: 600, color: '#555', background: '#fff' }}>
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 20px' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#f0f0f0', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <p style={{ color: '#555', marginBottom: 6, fontWeight: 600 }}>No results found for "{query}"</p>
                <p style={{ color: '#999', fontSize: 13, marginBottom: 24 }}>Try a different search term or browse categories.</p>
                <Link href="/" style={{ background: '#00aff0', color: '#fff', padding: '10px 24px', borderRadius: 25, fontWeight: 700, fontSize: 14 }}>
                  Browse Home
                </Link>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#f0f0f0', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <p style={{ color: '#999' }}>Enter a search term above to find posts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
