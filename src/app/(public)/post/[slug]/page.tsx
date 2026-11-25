import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db/prisma';
import PostPageClient from './PostPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
    select: { title: true, description: true, thumbnailUrl: true },
  });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.description || `Watch ${post.title} on Daily Viral MMS`,
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      images: [{ url: post.thumbnailUrl }],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) notFound();

  const related = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      categoryId: post.categoryId,
      NOT: { id: post.id },
    },
    orderBy: { views: 'desc' },
    take: 6,
    include: { category: { select: { name: true, slug: true } } },
  });

  return <PostPageClient post={JSON.parse(JSON.stringify(post))} related={JSON.parse(JSON.stringify(related))} />;
}
