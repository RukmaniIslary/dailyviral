import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ReportsClient from './ReportsClient';

interface Props {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function AdminReportsPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const { page: pageParam, status } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1'));
  const PAGE_SIZE = 20;
  const where = status ? { status: status as 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED' } : {};

  const [reports, total] = await Promise.all([
    prisma.report.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { post: { select: { title: true, slug: true, thumbnailUrl: true } } } }),
    prisma.report.count({ where }),
  ]);

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '32px 28px' }} className="admin-main">
        <ReportsClient initialReports={JSON.parse(JSON.stringify(reports))} total={total} page={page} pageSize={PAGE_SIZE} />
      </main>
      <style>{`@media (max-width: 768px) { .admin-main { margin-left: 0 !important; padding-top: 72px !important; } }`}</style>
    </div>
  );
}
