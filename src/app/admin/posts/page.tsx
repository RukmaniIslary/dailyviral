import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PostsTableClient from './PostsTableClient';

interface Props {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}

export default async function AdminPostsPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const { page: pageParam, status, q } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1'));
  const PAGE_SIZE = 20;

  const where = {
    ...(status ? { status: status as 'DRAFT' | 'PUBLISHED' } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { name: true } } },
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="min-h-screen" style={{ background: '#0B0B0F' }}>
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0 p-6">
        <PostsTableClient
          initialPosts={JSON.parse(JSON.stringify(posts))}
          total={total}
          page={page}
          pageSize={PAGE_SIZE}
          categories={categories}
        />
      </main>
    </div>
  );
}
