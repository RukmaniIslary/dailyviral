import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const [totalPublished, totalDrafts, totalCategories, viewsAgg, clicksAgg, recentPosts, mostViewed, pendingReports] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.category.count(),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.aggregate({ _sum: { clicks: true } }),
    prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { category: { select: { name: true } } } }),
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { views: 'desc' }, take: 5, include: { category: { select: { name: true } } } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
  ]);

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '32px 28px', minHeight: '100vh' }} className="admin-main">
        <DashboardClient
          email={session.email}
          stats={{ totalPublished, totalDrafts, totalCategories, totalViews: viewsAgg._sum.views || 0, totalClicks: clicksAgg._sum.clicks || 0, pendingReports }}
          recentPosts={JSON.parse(JSON.stringify(recentPosts))}
          mostViewed={JSON.parse(JSON.stringify(mostViewed))}
        />
      </main>
      <style>{`
        @media (max-width: 768px) {
          .admin-main { margin-left: 0 !important; padding-top: 72px !important; }
        }
      `}</style>
    </div>
  );
}
