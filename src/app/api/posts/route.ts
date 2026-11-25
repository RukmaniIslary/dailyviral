import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const PAGE_SIZE = 24;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const sort = searchParams.get('sort') || 'latest';
    const categorySlug = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || String(PAGE_SIZE));

    const where = {
      status: 'PUBLISHED' as const,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(featured ? { isFeatured: true } : {}),
    };

    const orderBy =
      sort === 'views'
        ? { views: 'desc' as const }
        : sort === 'trending'
        ? { clicks: 'desc' as const }
        : { publishedAt: 'desc' as const };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          views: true,
          clicks: true,
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
      pagination: {
        page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
