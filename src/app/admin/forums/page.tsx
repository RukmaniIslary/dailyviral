import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ForumsClient from './ForumsClient';

export default async function AdminForumsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const groups = await prisma.forumGroup.findMany({
    orderBy: { order: 'asc' },
    include: { forums: { orderBy: { order: 'asc' } } },
  });

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '32px 28px' }} className="admin-main">
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e', marginBottom: 24 }}>Forums</h1>
        <ForumsClient initialGroups={JSON.parse(JSON.stringify(groups))} />
      </main>
      <style>{`@media (max-width: 768px) { .admin-main { margin-left: 0 !important; padding-top: 72px !important; } }`}</style>
    </div>
  );
}
