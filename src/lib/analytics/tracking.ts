import { prisma } from '@/lib/db/prisma';

// Simple deduplication: track the last N view timestamps per post in memory
// to prevent rapid-fire duplicate counts from a single visitor.
const recentViews = new Map<string, number>();

export async function recordPostView(postId: string, visitorKey: string): Promise<void> {
  const dedupeKey = `${postId}:${visitorKey}`;
  const now = Date.now();
  const lastView = recentViews.get(dedupeKey);

  // Allow at most one view per visitor per post per 30 minutes
  if (lastView && now - lastView < 30 * 60 * 1000) {
    return;
  }

  recentViews.set(dedupeKey, now);

  await Promise.all([
    prisma.postView.create({ data: { postId } }),
    prisma.post.update({ where: { id: postId }, data: { views: { increment: 1 } } }),
  ]);
}

export async function recordExternalClick(postId: string): Promise<void> {
  await Promise.all([
    prisma.externalLinkClick.create({ data: { postId } }),
    prisma.post.update({ where: { id: postId }, data: { clicks: { increment: 1 } } }),
  ]);
}

// Clean up old deduplication entries every hour
setInterval(() => {
  const cutoff = Date.now() - 60 * 60 * 1000;
  for (const [key, ts] of recentViews.entries()) {
    if (ts < cutoff) recentViews.delete(key);
  }
}, 60 * 60 * 1000);
