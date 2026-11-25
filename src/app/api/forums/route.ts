import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const groups = await prisma.forumGroup.findMany({
    orderBy: { order: 'asc' },
    include: { forums: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json(groups);
}
