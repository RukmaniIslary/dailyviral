import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BulkUploadClient from './BulkUploadClient';

export default async function BulkUploadPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const categories = await prisma.category.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '32px 28px' }} className="admin-main">
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a1a2e', marginBottom: 6 }}>Bulk Upload</h1>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>Upload up to 10 posts at once.</p>
        <BulkUploadClient categories={JSON.parse(JSON.stringify(categories))} />
      </main>
      <style>{`@media (max-width: 768px) { .admin-main { margin-left: 0 !important; padding-top: 72px !important; } }`}</style>
    </div>
  );
}
