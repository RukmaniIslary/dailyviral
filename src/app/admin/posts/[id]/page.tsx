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
    <div className="min-h-screen" style={{ background: '#0B0B0F' }}>
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">Edit Post</h1>
        </div>
        <PostForm
          categories={categories}
          post={JSON.parse(JSON.stringify(post))}
        />
      </main>
    </div>
  );
}
