import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const groups = await prisma.forumGroup.findMany({
    orderBy: { order: 'asc' },
    include: { forums: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, order } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const group = await prisma.forumGroup.create({ data: { name: name.trim(), order: order ?? 0 } });
  return NextResponse.json(group, { status: 201 });
}
