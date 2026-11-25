import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { recordPostView, recordExternalClick } from '@/lib/analytics/tracking';
import { sanitizeRedirectUrl } from '@/lib/security/urlValidator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, postId } = body;

    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId, status: 'PUBLISHED' },
      select: { id: true, externalUrl: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (type === 'view') {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
      const ua = req.headers.get('user-agent') || '';
      const visitorKey = `${ip}:${ua.substring(0, 50)}`;
      await recordPostView(postId, visitorKey);
      return NextResponse.json({ ok: true });
    }

    if (type === 'click') {
      await recordExternalClick(postId);
      const safeUrl = sanitizeRedirectUrl(post.externalUrl);
      return NextResponse.json({ ok: true, redirectUrl: safeUrl });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}
