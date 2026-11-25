import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import PostGrid from '@/components/posts/PostGrid';
import Pagination from '@/components/ui/Pagination';
import SearchForm from './SearchForm';
import { Search } from 'lucide-react';

const PAGE_SIZE = 20;

interface Props {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}" – Daily Viral MMS` : 'Search – Daily Viral MMS',
  };
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
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { category: { select: { name: true, slug: true } } },
      }),
      prisma.post.count({ where }),
    ]);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-4">Search</h1>
        <SearchForm initialQuery={query} />
      </div>

      {query ? (
        <>
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Search size={14} />
            {total > 0 ? (
              <span>
                {total.toLocaleString()} result{total !== 1 ? 's' : ''} for{' '}
                <span className="text-white font-medium">"{query}"</span>
              </span>
            ) : (
              <span>
                No results for <span className="text-white font-medium">"{query}"</span>
              </span>
            )}
          </div>

          {total > 0 ? (
            <>
              <PostGrid posts={JSON.parse(JSON.stringify(posts))} columns={4} />
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          ) : (
            <div className="py-16 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#17171D' }}
              >
                <Search size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-400 mb-2">No results found for "{query}"</p>
              <p className="text-gray-600 text-sm">Try a different search term or browse categories.</p>
              <Link
                href="/"
                className="mt-5 inline-block px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: '#E50935' }}
              >
                Browse Home
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <Search size={40} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">Enter a search term above to find posts.</p>
        </div>
      )}
    </div>
  );
}
