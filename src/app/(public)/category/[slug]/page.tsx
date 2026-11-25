import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import PostGrid from '@/components/posts/PostGrid';
import Pagination from '@/components/ui/Pagination';
import { ChevronRight, Grid3X3 } from 'lucide-react';

const PAGE_SIZE = 24;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} – Daily Viral MMS`,
    description: category.description || `Browse ${category.name} posts on Daily Viral MMS`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1'));

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED', categoryId: category.id },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.post.count({ where: { status: 'PUBLISHED', categoryId: category.id } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/" className="hover:text-white transition-colors">Categories</Link>
        <ChevronRight size={14} />
        <span className="text-gray-400">{category.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(229,9,53,0.1)' }}
          >
            <Grid3X3 size={20} style={{ color: '#E50935' }} />
          </div>
          <h1 className="text-3xl font-black text-white">{category.name}</h1>
        </div>
        {category.description && (
          <p className="text-gray-400 mt-2 ml-13">{category.description}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          {total.toLocaleString()} post{total !== 1 ? 's' : ''}
        </p>
      </div>

      <PostGrid posts={JSON.parse(JSON.stringify(posts))} columns={4} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
