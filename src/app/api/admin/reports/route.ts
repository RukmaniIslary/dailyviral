import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status') || undefined;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const PAGE_SIZE = 20;

  const where = status ? { status: status as 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED' } : {};

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        post: { select: { title: true, slug: true, thumbnailUrl: true } },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return NextResponse.json({
    reports,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  });
}
