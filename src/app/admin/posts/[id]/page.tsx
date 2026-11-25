import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PostForm from '@/components/admin/PostForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!post) notFound();

  return (
    <div className="min-h-screen" style={{ background: '#f8f9fa' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '32px 28px' }} className="admin-main">
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e', marginBottom: 24 }}>Edit Post</h1>
        <PostForm
          categories={categories}
          post={JSON.parse(JSON.stringify(post))}
        />
      </main>
      <style>{`@media (max-width: 768px) { .admin-main { margin-left: 0 !important; padding-top: 72px !important; } }`}</style>
    </div>
  );
}
