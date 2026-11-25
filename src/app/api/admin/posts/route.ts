import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { postSchema } from '@/lib/validation/schemas';
import { getSessionFromRequest } from '@/lib/auth/session';
import { validateImageUrl, validateExternalUrl } from '@/lib/security/urlValidator';

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const status = searchParams.get('status') || undefined;
  const q = searchParams.get('q')?.trim() || undefined;
  const categoryId = searchParams.get('category') || undefined;

  const where = {
    ...(status ? { status: status as 'DRAFT' | 'PUBLISHED' } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { description: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: { select: { name: true, slug: true } },
        _count: { select: { reports: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const data = parsed.data;

  // Security: validate URLs
  const imgCheck = validateImageUrl(data.thumbnailUrl);
  if (!imgCheck.valid) return NextResponse.json({ error: imgCheck.error }, { status: 400 });

  const urlCheck = validateExternalUrl(data.externalUrl);
  if (!urlCheck.valid) return NextResponse.json({ error: urlCheck.error }, { status: 400 });

  // Check slug uniqueness
  const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
  if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });

  // Verify category
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 400 });

  // Handle tags
  const tagConnections = await Promise.all(
    (data.tags || []).filter(Boolean).map(async (tagName) => {
      const slug = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name: tagName.trim(), slug },
      });
      return tag.id;
    })
  );

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      thumbnailUrl: data.thumbnailUrl,
      externalUrl: data.externalUrl,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured || false,
      status: data.status || 'DRAFT',
      publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      tags: {
        create: tagConnections.map((tagId) => ({ tagId })),
      },
    },
    include: { category: true, tags: { include: { tag: true } } },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: session.adminId,
      action: 'CREATE_POST',
      details: `Created post: ${post.title}`,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
