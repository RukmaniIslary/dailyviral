import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  if (!['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const report = await prisma.report.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ report });
}
