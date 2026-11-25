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
    <div className="min-h-screen" style={{ background: '#0B0B0F' }}>
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">Add New Post</h1>
        </div>
        <PostForm categories={categories} />
      </main>
    </div>
  );
}
