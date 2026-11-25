import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalViews,
    totalClicks,
    weeklyViews,
    weeklyClicks,
    monthlyViews,
    topPosts,
    dailyViews,
  ] = await Promise.all([
    prisma.postView.count(),
    prisma.externalLinkClick.count(),
    prisma.postView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.externalLinkClick.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.postView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        clicks: true,
        thumbnailUrl: true,
        category: { select: { name: true } },
      },
    }),
    // Daily view counts for the past 7 days
    prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "PostView"
      WHERE "createdAt" >= ${sevenDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,
  ]);

  return NextResponse.json({
    totalViews,
    totalClicks,
    weeklyViews,
    weeklyClicks,
    monthlyViews,
    topPosts,
    dailyViews: dailyViews.map((d) => ({ date: d.date, count: Number(d.count) })),
  });
}
