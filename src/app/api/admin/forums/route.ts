import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { groupId, name, description, imageUrl, order } = await req.json();
  if (!groupId || !name?.trim()) return NextResponse.json({ error: 'groupId and name are required' }, { status: 400 });
  const slug = toSlug(name);
  const forum = await prisma.forum.create({
    data: { groupId, name: name.trim(), description: description?.trim() || null, imageUrl: imageUrl?.trim() || null, slug, order: order ?? 0 },
  });
  return NextResponse.json(forum, { status: 201 });
}
