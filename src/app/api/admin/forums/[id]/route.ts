import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { name, description, imageUrl, order, groupId, postCount } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const forum = await prisma.forum.update({
    where: { id },
    data: { name: name.trim(), description: description?.trim() || null, imageUrl: imageUrl?.trim() || null, order: order ?? 0, groupId, ...(postCount !== undefined && { postCount: Number(postCount) }) },
  });
  return NextResponse.json(forum);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.forum.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
