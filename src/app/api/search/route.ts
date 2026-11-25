import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get('q')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const category = searchParams.get('category') || undefined;

    if (!q || q.length < 1) {
      return NextResponse.json({ posts: [], pagination: { page: 1, total: 0, totalPages: 0 } });
    }

    const where = {
      status: 'PUBLISHED' as const,
      ...(category ? { category: { slug: category } } : {}),
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
        { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' as const } } } } },
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          views: true,
          isFeatured: true,
          publishedAt: true,
          createdAt: true,
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      query: q,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
