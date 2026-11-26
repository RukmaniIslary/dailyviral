import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSessionFromRequest } from '@/lib/auth/session';

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().substring(0, 100);
}

async function uniqueSlug(base: string) {
  let slug = base;
  let i = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { posts, status } = await req.json();

  if (!Array.isArray(posts) || posts.length === 0 || posts.length > 10) {
    return NextResponse.json({ error: 'Send between 1 and 10 posts' }, { status: 400 });
  }

  const results: { index: number; success: boolean; title: string; error?: string }[] = [];

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    try {
      if (!p.title?.trim()) throw new Error('Title is required');
      if (!p.externalUrl?.trim()) throw new Error('External URL is required');
      if (!p.thumbnailUrl?.trim()) throw new Error('Thumbnail URL is required');
      if (!p.categoryId?.trim()) throw new Error('Category is required');

      const slug = await uniqueSlug(generateSlug(p.title));

      await prisma.post.create({
        data: {
          title: p.title.trim(),
          slug,
          description: p.description?.trim() || null,
          thumbnailUrl: p.thumbnailUrl.trim(),
          externalUrl: p.externalUrl.trim(),
          categoryId: p.categoryId,
          isFeatured: p.isFeatured || false,
          status: status || 'PUBLISHED',
          publishedAt: (status || 'PUBLISHED') === 'PUBLISHED' ? new Date() : null,
        },
      });

      results.push({ index: i, success: true, title: p.title });
    } catch (err: unknown) {
      results.push({ index: i, success: false, title: p.title || `Post ${i + 1}`, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  const succeeded = results.filter(r => r.success).length;
  await prisma.adminActivityLog.create({
    data: { adminId: session.adminId, action: 'BULK_CREATE_POSTS', details: `Bulk uploaded ${succeeded}/${posts.length} posts` },
  });

  return NextResponse.json({ results, succeeded, failed: posts.length - succeeded });
}
