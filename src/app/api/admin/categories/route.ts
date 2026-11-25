import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { categorySchema } from '@/lib/validation/schemas';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { posts: true } } },
  });

  return NextResponse.json({ categories });
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

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return NextResponse.json({ error: 'Category slug already exists' }, { status: 409 });

  const category = await prisma.category.create({ data: parsed.data });

  await prisma.adminActivityLog.create({
    data: { adminId: session.adminId, action: 'CREATE_CATEGORY', details: `Created: ${category.name}` },
  });

  return NextResponse.json({ category }, { status: 201 });
}
