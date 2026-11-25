import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CategoriesClient from './CategoriesClient';

export default async function AdminCategoriesPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  const categories = await prisma.category.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }], include: { _count: { select: { posts: true } } } });

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '32px 28px' }} className="admin-main">
        <CategoriesClient initialCategories={JSON.parse(JSON.stringify(categories))} />
      </main>
      <style>{`@media (max-width: 768px) { .admin-main { margin-left: 0 !important; padding-top: 72px !important; } }`}</style>
    </div>
  );
}

