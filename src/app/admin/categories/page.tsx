import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CategoriesClient from './CategoriesClient';

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="min-h-screen" style={{ background: '#0B0B0F' }}>
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0 p-6">
        <CategoriesClient initialCategories={JSON.parse(JSON.stringify(categories))} />
      </main>
    </div>
  );
}
