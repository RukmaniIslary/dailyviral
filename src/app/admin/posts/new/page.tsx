import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PostForm from '@/components/admin/PostForm';

export default async function NewPostPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '32px 28px' }} className="admin-main">
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e', marginBottom: 24 }}>Add New Post</h1>
        <PostForm categories={categories} />
      </main>
      <style>{`@media (max-width: 768px) { .admin-main { margin-left: 0 !important; padding-top: 72px !important; } }`}</style>
    </div>
  );
}
