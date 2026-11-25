import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [
    totalPublished,
    totalDrafts,
    totalCategories,
    viewsAgg,
    clicksAgg,
    recentPosts,
    mostViewed,
    recentReports,
  ] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.category.count(),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.post.aggregate({ _sum: { clicks: true } }),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: { select: { name: true } } },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 5,
      include: { category: { select: { name: true } } },
    }),
    prisma.report.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { post: { select: { title: true, slug: true } } },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalPublished,
      totalDrafts,
      totalCategories,
      totalViews: viewsAgg._sum.views || 0,
      totalClicks: clicksAgg._sum.clicks || 0,
    },
    recentPosts,
    mostViewed,
    recentReports,
  });
}
