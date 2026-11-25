import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { reportSchema } from '@/lib/validation/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { postId, reason, description } = parsed.data;

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId, status: 'PUBLISHED' },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.report.create({
      data: { postId, reason, description: description || null },
    });

    return NextResponse.json({ ok: true, message: 'Report submitted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
