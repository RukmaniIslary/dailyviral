import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { categorySchema } from '@/lib/validation/schemas';
import { getSessionFromRequest } from '@/lib/auth/session';

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

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const existing = await prisma.category.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });

  const category = await prisma.category.update({ where: { id }, data: parsed.data });

  await prisma.adminActivityLog.create({
    data: { adminId: session.adminId, action: 'UPDATE_CATEGORY', details: `Updated: ${category.name}` },
  });

  return NextResponse.json({ category });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Check if any posts use this category
  const postCount = await prisma.post.count({ where: { categoryId: id } });
  if (postCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete category with ${postCount} posts. Reassign posts first.` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });

  await prisma.adminActivityLog.create({
    data: { adminId: session.adminId, action: 'DELETE_CATEGORY', details: `Deleted: ${category.name}` },
  });

  return NextResponse.json({ ok: true });
}
