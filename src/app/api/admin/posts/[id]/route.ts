import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { postSchema } from '@/lib/validation/schemas';
import { getSessionFromRequest } from '@/lib/auth/session';
import { validateImageUrl, validateExternalUrl } from '@/lib/security/urlValidator';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

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

  const imgCheck = validateImageUrl(data.thumbnailUrl);
  if (!imgCheck.valid) return NextResponse.json({ error: imgCheck.error }, { status: 400 });

  const urlCheck = validateExternalUrl(data.externalUrl);
  if (!urlCheck.valid) return NextResponse.json({ error: urlCheck.error }, { status: 400 });

  // Check slug uniqueness (exclude self)
  const existing = await prisma.post.findFirst({ where: { slug: data.slug, NOT: { id } } });
  if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });

  const currentPost = await prisma.post.findUnique({ where: { id } });
  if (!currentPost) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  // Determine publishedAt
  let publishedAt = currentPost.publishedAt;
  if (data.status === 'PUBLISHED' && !publishedAt) {
    publishedAt = new Date();
  }

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

  // Delete existing tag connections and recreate
  await prisma.postTag.deleteMany({ where: { postId: id } });

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      thumbnailUrl: data.thumbnailUrl,
      externalUrl: data.externalUrl,
      categoryId: data.categoryId,
      isFeatured: data.isFeatured || false,
      status: data.status || 'DRAFT',
      publishedAt,
      tags: {
        create: tagConnections.map((tagId) => ({ tagId })),
      },
    },
    include: { category: true, tags: { include: { tag: true } } },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: session.adminId,
      action: 'UPDATE_POST',
      details: `Updated post: ${post.title}`,
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  await prisma.post.delete({ where: { id } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: session.adminId,
      action: 'DELETE_POST',
      details: `Deleted post: ${post.title}`,
    },
  });

  return NextResponse.json({ ok: true });
}
