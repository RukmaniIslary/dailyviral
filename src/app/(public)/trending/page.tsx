import type { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import PostGrid from '@/components/posts/PostGrid';
import Pagination from '@/components/ui/Pagination';
import { TrendingUp } from 'lucide-react';

const PAGE_SIZE = 24;

export const metadata: Metadata = {
  title: 'Trending – Daily Viral MMS',
  description: 'Trending adult media content on Daily Viral MMS',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function TrendingPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1'));

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ clicks: 'desc' }, { views: 'desc' }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(229,9,53,0.1)' }}
        >
          <TrendingUp size={20} style={{ color: '#E50935' }} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Trending Now</h1>
          <p className="text-gray-500 text-sm">{total.toLocaleString()} posts</p>
        </div>
      </div>

      <PostGrid posts={JSON.parse(JSON.stringify(posts))} columns={4} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
